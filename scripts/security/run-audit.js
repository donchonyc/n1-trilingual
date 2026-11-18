#!/usr/bin/env node
/* Run npm audit, save the JSON report and summarize it. Cross-platform wrapper
   so `npm run security` behaves the same on Windows, macOS and Linux. */
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..", "..");
const REPORT = path.join(ROOT, "security-audit.json");

function npmCommand() {
  if (process.env.npm_execpath) {
    return { command: process.execPath, prefix: [process.env.npm_execpath] };
  }
  return { command: process.platform === "win32" ? "npm.cmd" : "npm", prefix: [], shell: process.platform === "win32" };
}

function main() {
  const npm = npmCommand();
  const result = spawnSync(npm.command, [...npm.prefix, "audit", "--omit=dev", "--audit-level=high", "--json"], {
    cwd: ROOT,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    shell: Boolean(npm.shell)
  });

  if (result.error) {
    console.error("Dependency audit could not run:", result.error.message);
    process.exit(1);
  }

  const output = result.stdout || "";
  if (!output.trim()) {
    console.error("Dependency audit produced no JSON.");
    if (result.stderr) console.error(result.stderr.trim());
    process.exit(1);
  }

  try {
    fs.writeFileSync(REPORT, output, "utf8");
  } catch (e) {
    console.error("Could not write audit report:", e.message);
    process.exit(1);
  }

  const summary = spawnSync(process.execPath, [path.join(__dirname, "summarize-audit.js")], {
    cwd: ROOT,
    stdio: "inherit"
  });
  process.exit(summary.status === null ? 1 : summary.status);
}

main();
