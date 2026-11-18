#!/usr/bin/env node
/* Lightweight static checks plus security invariants for the sync API.
   These are deliberately boring, deterministic checks that complement CodeQL:
   no dynamic code execution, no shell execution in runtime code, and the auth
   and request-size guards must still be present. */
"use strict";

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.join(__dirname, "..", "..");
const SKIP_DIRS = new Set([".git", "node_modules", ".vercel", ".data", "dist", "coverage"]);
const SKIP_PREFIXES = ["scripts/security/"];
const SKIP_FILES = new Set(["package-lock.json", "security-audit.json"]);
const CODE_EXT = new Set([".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".html"]);

function toPosix(p) { return p.split(path.sep).join("/"); }

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
  try {
    return execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], {
      cwd: ROOT, encoding: "utf8", maxBuffer: 32 * 1024 * 1024
    }).split("\0").filter(Boolean);
  } catch (e) {
    const out = [];
    walk(ROOT, out);
    return out;
  }
}

function skipped(rel) {
  if (SKIP_FILES.has(rel)) return true;
  if (SKIP_PREFIXES.some((p) => rel.startsWith(p))) return true;
  return rel.split("/").some((part) => SKIP_DIRS.has(part));
}

const RULES = [
  {
    id: "dynamic-code",
    re: /\beval\s*\(|new\s+Function\s*\(/,
    message: "dynamic code execution"
  },
  {
    id: "document-write",
    re: /document\.write\s*\(/,
    message: "document.write sink"
  },
  {
    id: "dangerous-html",
    re: /dangerouslySetInnerHTML/,
    message: "raw HTML injection sink"
  },
  {
    id: "javascript-url",
    re: /["']javascript:/i,
    message: "javascript: URL"
  },
  {
    id: "runtime-shell",
    re: /require\(\s*["']child_process["']\s*\)|from\s+["']child_process["']/,
    message: "shell execution in runtime code",
    allow: ["scripts/"]
  }
];

const REQUIRED = [
  ["api/state.js", /timingSafeEqual\s*\(/, "constant-time token comparison"],
  ["api/state.js", /MAX_BODY/, "request body size limit"],
  ["api/state.js", /authorized\s*\(\s*req\s*\)/, "authorization check before handlers"],
  ["api/state.js", /Array\.isArray\s*\(\s*body\.state\s*\)/, "state must reject arrays and non-objects"],
  ["scripts/serve.js", /timingSafeEqual\s*\(/, "constant-time token comparison"],
  ["scripts/serve.js", /MAX_BODY/, "request body size limit"],
  ["scripts/serve.js", /authorized\s*\(\s*req\s*\)/, "authorization check before handlers"],
  ["scripts/serve.js", /path\.normalize/, "path normalization"],
  ["scripts/serve.js", /startsWith\s*\(\s*root\s*\+\s*path\.sep\s*\)/, "path traversal containment"]
];

function lineOf(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function main() {
  const files = listFiles();
  const findings = [];
  const codeFiles = files.filter((rel) => {
    if (skipped(rel)) return false;
    return CODE_EXT.has(path.extname(rel).toLowerCase());
  });

  for (const rel of codeFiles) {
    const full = path.join(ROOT, rel);
    let text;
    try { text = fs.readFileSync(full, "utf8"); } catch (e) { continue; }
    for (const rule of RULES) {
      if (rule.allow && rule.allow.some((p) => rel.startsWith(p))) continue;
      const m = rule.re.exec(text);
      if (m) findings.push(`${rel}:${lineOf(text, m.index)}: ${rule.message}`);
    }
  }

  for (const [rel, re, message] of REQUIRED) {
    const full = path.join(ROOT, rel);
    let text;
    try { text = fs.readFileSync(full, "utf8"); } catch (e) {
      findings.push(`${rel}: missing file (${message})`);
      continue;
    }
    if (!re.test(text)) findings.push(`${rel}: missing security invariant — ${message}`);
  }

  const gitignore = path.join(ROOT, ".gitignore");
  if (fs.existsSync(gitignore)) {
    const ignores = fs.readFileSync(gitignore, "utf8");
    ["node_modules", ".data", ".vercel", ".env"].forEach((entry) => {
      if (!ignores.includes(entry)) findings.push(`.gitignore: missing ${entry}`);
    });
  } else {
    findings.push(".gitignore: missing");
  }

  console.log(`Static scan: ${codeFiles.length} code files`);
  findings.slice(0, 40).forEach((f) => console.log("  ✗ " + f));
  if (findings.length > 40) console.log(`  … ${findings.length - 40} more`);
  console.log(`Static scan: ${findings.length} finding(s)`);
  process.exit(findings.length ? 1 : 0);
}

main();
