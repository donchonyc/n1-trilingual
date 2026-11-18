#!/usr/bin/env node
/* Summarize `npm audit --json` output for humans and GitHub Actions.
   High findings are reported but do not fail the build; critical findings do.
   Set AUDIT_FAIL_ON_HIGH=1 to make high findings blocking too. */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const REPORT = process.env.AUDIT_REPORT || path.join(ROOT, "security-audit.json");
const FAIL_ON_HIGH = process.env.AUDIT_FAIL_ON_HIGH === "1";
const LEVELS = ["critical", "high", "moderate", "low", "info"];

function readReport() {
  if (!fs.existsSync(REPORT)) {
    throw new Error(`audit report not found: ${REPORT}`);
  }
  const buf = fs.readFileSync(REPORT);
  let raw;
  if (buf[0] === 0xff && buf[1] === 0xfe) {
    raw = buf.toString("utf16le");
  } else if (buf[0] === 0xfe && buf[1] === 0xff) {
    const swapped = Buffer.from(buf);
    swapped.swap16();
    raw = swapped.toString("utf16le");
  } else {
    raw = buf.toString("utf8");
  }
  raw = raw.replace(/^\uFEFF/, "").trim();
  if (!raw) throw new Error(`audit report is empty: ${REPORT}`);
  const data = JSON.parse(raw);
  if (data.error) {
    throw new Error(`npm audit failed: ${data.error.summary || data.error.code || "unknown error"}`);
  }
  return data;
}

function main() {
  let audit;
  try {
    audit = readReport();
  } catch (e) {
    console.error("Dependency audit: " + e.message);
    process.exit(1);
  }

  const counts = { critical: 0, high: 0, moderate: 0, low: 0, info: 0 };
  const vulnerable = audit.vulnerabilities && typeof audit.vulnerabilities === "object"
    ? audit.vulnerabilities : {};

  for (const entry of Object.values(vulnerable)) {
    const severity = String(entry.severity || "info").toLowerCase();
    if (counts[severity] === undefined) counts[severity] = 0;
    counts[severity]++;
  }

  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  console.log("Dependency audit: " + total + " vulnerable package(s)");
  for (const level of LEVELS) {
    console.log(`  ${level.padEnd(9)} ${counts[level] || 0}`);
  }

  const notable = Object.entries(vulnerable)
    .filter(([, entry]) => entry.severity === "critical" || entry.severity === "high")
    .sort((a, b) => (a[1].severity === "critical" ? -1 : 1) - (b[1].severity === "critical" ? -1 : 1));

  const lines = [];
  lines.push("## Dependency audit");
  lines.push("");
  lines.push("| Severity | Packages |");
  lines.push("| --- | ---: |");
  for (const level of LEVELS) lines.push(`| ${level} | ${counts[level] || 0} |`);
  lines.push("");
  if (!notable.length) {
    lines.push("No high or critical vulnerable packages found.");
  } else {
    lines.push("### High and critical findings");
    lines.push("");
    for (const [name, entry] of notable) {
      const via = Array.isArray(entry.via)
        ? entry.via.filter((v) => typeof v === "object" && v.url).map((v) => v.url)
        : [];
      lines.push(`- **${entry.severity}** \`${name}\` (${entry.range || "unknown range"})`);
      for (const url of via.slice(0, 2)) lines.push(`  - ${url}`);
    }
    lines.push("");
  }
  if (counts.high && !FAIL_ON_HIGH) {
    lines.push("High findings are reported but non-blocking. Critical findings fail the job.");
  }

  const markdown = lines.join("\n") + "\n";
  console.log(markdown);

  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown, "utf8");
    } catch (e) {
      console.error("Could not write GitHub step summary:", e.message);
    }
  }

  if (counts.critical > 0) {
    console.error(`Dependency audit failed: ${counts.critical} critical vulnerabilit${counts.critical === 1 ? "y" : "ies"}.`);
    process.exit(1);
  }
  if (FAIL_ON_HIGH && counts.high > 0) {
    console.error(`Dependency audit failed: ${counts.high} high vulnerabilit${counts.high === 1 ? "y" : "ies"}.`);
    process.exit(1);
  }
}

main();
