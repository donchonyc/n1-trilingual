#!/usr/bin/env node
/* Secret scanner for the repository working tree.
   High-confidence credential patterns are errors. Local, gitignored .env files
   are reported as warnings so a developer can see them without breaking CI. */
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..", "..");
const MAX_BYTES = 2 * 1024 * 1024;
const SKIP_DIRS = new Set([".git", "node_modules", ".vercel", ".data", "dist", "coverage"]);
const SKIP_PREFIXES = ["scripts/security/"];
const SKIP_FILES = new Set(["package-lock.json", "security-audit.json"]);

const HIGH_CONFIDENCE = [
  { name: "AWS access key", re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "GitHub token", re: /\bgh[pousr]_[A-Za-z0-9]{36,}\b/ },
  { name: "GitHub fine-grained token", re: /\bgithub_pat_[A-Za-z0-9_]{50,}\b/ },
  { name: "Slack token", re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { name: "Stripe live key", re: /\bsk_live_[0-9A-Za-z]{20,}\b/ },
  { name: "Google API key", re: /\bAIza[0-9A-Za-z_-]{35}\b/ },
  { name: "Private key block", re: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/ },
  { name: "Vercel token", re: /\bvercel_[A-Za-z0-9]{24,}\b/ },
  { name: "JSON Web Token", re: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/ }
];

const GENERIC_ASSIGNMENT =
  /^\s*(?:export\s+)?([A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|API_KEY|PRIVATE_KEY|DATABASE_URL)[A-Z0-9_]*)\s*=\s*([^\s#]{12,})\s*$/;

function toPosix(p) { return p.split(path.sep).join("/"); }

function gitFiles() {
  try {
    const read = (args) => execFileSync("git", ["ls-files", "-z", ...args], {
      cwd: ROOT, encoding: "utf8", maxBuffer: 32 * 1024 * 1024
    }).split("\0").filter(Boolean);
    return {
      tracked: read(["--cached"]),
      files: read(["--cached", "--others", "--exclude-standard"])
    };
  } catch (e) {
    return null;
  }
}

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = toPosix(path.relative(ROOT, full));
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, out);
    } else if (entry.isFile()) {
      out.push(rel);
    }
  }
}

function listFiles() {
  const git = gitFiles();
  if (git) {
    const files = git.files.slice();
    // Gitignored .env files are not tracked, but a local scan should still warn about them.
    try {
      for (const name of fs.readdirSync(ROOT)) {
        if (isEnvFile(name) && !files.includes(name)) files.push(name);
      }
    } catch (e) { /* best effort */ }
    return { files, tracked: new Set(git.tracked), fromGit: true };
  }
  const out = [];
  walk(ROOT, out);
  return { files: out, tracked: new Set(), fromGit: false };
}

function skipped(rel) {
  if (SKIP_FILES.has(rel)) return true;
  if (SKIP_PREFIXES.some((p) => rel.startsWith(p))) return true;
  return rel.split("/").some((part) => SKIP_DIRS.has(part));
}

function isEnvFile(rel) {
  const base = path.basename(rel);
  return (base === ".env" || base.startsWith(".env.")) && base !== ".env.example";
}

function looksLikePlaceholder(value) {
  return /^(?:\.\.\.|<.*>|your[-_]|example|changeme|placeholder|xxx+|\*+)$/i.test(value) ||
    /postgres:\/\/user:pass@host/i.test(value);
}

function main() {
  const { files, tracked, fromGit } = listFiles();
  const errors = [];
  const warnings = [];
  let scanned = 0;

  for (const rel of files) {
    if (skipped(rel)) continue;
    const full = path.join(ROOT, rel);
    let stat;
    try { stat = fs.statSync(full); } catch (e) { continue; }
    if (!stat.isFile() || stat.size > MAX_BYTES) continue;

    let text;
    try { text = fs.readFileSync(full, "utf8"); } catch (e) { continue; }
    if (text.indexOf("\u0000") !== -1) continue;
    scanned++;

    const isEnv = isEnvFile(rel);
    const isTracked = tracked.has(rel);
    const sink = isEnv && !isTracked ? warnings : errors;

    if (isEnv && isTracked) {
      errors.push(`${rel}: environment file is tracked by git`);
    } else if (isEnv) {
      warnings.push(`${rel}: local environment file (gitignored) — keep it out of commits`);
    }

    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
      for (const rule of HIGH_CONFIDENCE) {
        if (rule.re.test(line)) {
          sink.push(`${rel}:${i + 1}: ${rule.name} [redacted]`);
        }
      }
      const m = line.match(GENERIC_ASSIGNMENT);
      if (m && !looksLikePlaceholder(m[2]) && !/process\.env/.test(line)) {
        sink.push(`${rel}:${i + 1}: credential-like assignment to ${m[1]} [redacted]`);
      }
    });
  }

  const source = fromGit ? "tracked + unignored untracked files" : "filesystem walk";
  console.log(`Secret scan: ${scanned} files (${source})`);
  warnings.slice(0, 30).forEach((w) => console.log("  ! " + w));
  if (warnings.length > 30) console.log(`  … ${warnings.length - 30} more warnings`);
  errors.slice(0, 30).forEach((e) => console.log("  ✗ " + e));
  if (errors.length > 30) console.log(`  … ${errors.length - 30} more errors`);
  console.log(`Secret scan: ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(errors.length ? 1 : 0);
}

main();
