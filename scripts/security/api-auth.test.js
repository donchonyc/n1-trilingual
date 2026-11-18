#!/usr/bin/env node
/* API authorization and input-validation regression test.
   Spawns scripts/serve.js with a temporary data directory and a test sync key,
   then checks the security properties the app depends on:
   - sync key required for every API route
   - constant-time comparison path accepts only the exact key
   - state must be a plain object, never an array or null
   - oversized bodies are rejected
   - unsupported methods and path traversal are rejected
   No production data or credentials are touched. */
"use strict";

const http = require("http");
const net = require("net");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.join(__dirname, "..", "..");
const TOKEN = "test-sync-token-" + Date.now().toString(36);
const MAX_BODY = 5 * 1024 * 1024;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

function request(port, method, urlPath, options) {
  const opts = options || {};
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    let payload = null;
    const headers = {};
    if (opts.token) headers["x-sync-token"] = opts.token;
    if (opts.body !== undefined) {
      payload = Buffer.isBuffer(opts.body)
        ? opts.body
        : Buffer.from(typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body));
      headers["content-type"] = "application/json";
      headers["content-length"] = payload.length;
    }

    const req = http.request({
      host: "127.0.0.1", port, method, path: urlPath, headers, timeout: 8000
    }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { body += chunk; });
      res.on("end", () => finish({ status: res.statusCode, headers: res.headers, body }));
    });

    req.on("error", (err) => finish({ status: 0, error: err.code || err.message }));
    req.on("timeout", () => { req.destroy(); finish({ status: 0, error: "timeout" }); });
    if (payload) req.write(payload);
    req.end();
  });
}

async function waitForServer(port, child) {
  for (let i = 0; i < 80; i++) {
    if (child.exitCode !== null) throw new Error("server exited early");
    const res = await request(port, "GET", "/api/health", { token: TOKEN });
    if (res.status === 200) return;
    await sleep(100);
  }
  throw new Error("server did not become ready");
}

function parseJson(res) {
  try { return JSON.parse(res.body || "{}"); } catch (e) { return null; }
}

let passed = 0;
let failed = 0;
function check(name, condition, detail) {
  if (condition) {
    passed++;
    console.log("  ok   " + name);
  } else {
    failed++;
    console.log("  FAIL " + name + (detail ? " — " + detail : ""));
  }
}

function makeRes() {
  return {
    statusCode: 0,
    headers: {},
    body: "",
    setHeader(name, value) { this.headers[String(name).toLowerCase()] = value; },
    end(chunk) { this.body = chunk === undefined || chunk === null ? "" : String(chunk); }
  };
}

function makeReq(method, headers, body) {
  const { Readable } = require("stream");
  let req;
  if (body !== undefined && (Buffer.isBuffer(body) || typeof body === "string")) {
    req = Readable.from([Buffer.isBuffer(body) ? body : Buffer.from(body)]);
  } else {
    req = Readable.from([]);
    if (body !== undefined) req.body = body;
  }
  req.method = method;
  req.headers = headers || {};
  return req;
}

function loadVercelHandler() {
  const blobId = require.resolve("@vercel/blob");
  let stored = null;
  require.cache[blobId] = {
    id: blobId,
    filename: blobId,
    loaded: true,
    exports: {
      put: async (key, value) => {
        stored = value;
        return { url: "mock://" + key };
      },
      get: async () => {
        if (stored === null) {
          const err = new Error("not found");
          err.name = "BlobNotFoundError";
          throw err;
        }
        return { stream: new Response(stored).body };
      }
    }
  };
  process.env.SYNC_TOKEN = TOKEN;
  const statePath = path.join(ROOT, "api", "state.js");
  delete require.cache[statePath];
  return require(statePath);
}

async function invokeHandler(handler, method, options) {
  const opts = options || {};
  const res = makeRes();
  const headers = opts.token ? { "x-sync-token": opts.token } : {};
  await handler(makeReq(method, headers, opts.body), res);
  return res;
}

async function checkVercelHandler() {
  const handler = loadVercelHandler();
  console.log("  Vercel handler (api/state.js)");

  let res = await invokeHandler(handler, "GET", {});
  check("vercel health requires a sync key", res.statusCode === 401, "status " + res.statusCode);

  res = await invokeHandler(handler, "GET", { token: "wrong-" + TOKEN });
  check("vercel wrong sync key is rejected", res.statusCode === 401, "status " + res.statusCode);

  res = await invokeHandler(handler, "GET", { token: TOKEN });
  check("vercel correct sync key is accepted", res.statusCode === 200, "status " + res.statusCode);

  res = await invokeHandler(handler, "PUT", { body: { state: { lang: "en" } } });
  check("vercel write without a sync key is rejected", res.statusCode === 401, "status " + res.statusCode);

  res = await invokeHandler(handler, "PUT", { token: TOKEN, body: "{" });
  check("vercel invalid JSON is rejected", res.statusCode === 400, "status " + res.statusCode);

  res = await invokeHandler(handler, "PUT", { token: TOKEN, body: { state: [] } });
  check("vercel array state is rejected", res.statusCode === 400, "status " + res.statusCode);

  res = await invokeHandler(handler, "PUT", { token: TOKEN, body: { state: null } });
  check("vercel null state is rejected", res.statusCode === 400, "status " + res.statusCode);

  res = await invokeHandler(handler, "PUT", { token: TOKEN, body: { state: { lang: "ja", step: 3 } } });
  check("vercel valid state is stored", res.statusCode === 200, "status " + res.statusCode);

  res = await invokeHandler(handler, "GET", { token: TOKEN });
  const state = parseJson(res);
  check("vercel stored state round-trips",
    res.statusCode === 200 && state && state.state && state.state.lang === "ja" && state.state.step === 3,
    JSON.stringify(state));

  res = await invokeHandler(handler, "DELETE", { token: TOKEN });
  check("vercel unsupported method is rejected", res.statusCode === 405, "status " + res.statusCode);
  check("vercel 405 advertises allowed methods", /GET/.test(String(res.headers.allow || "")) &&
    /PUT/.test(String(res.headers.allow || "")), "Allow: " + res.headers.allow);

  res = await invokeHandler(handler, "PUT", { token: TOKEN, body: Buffer.alloc(MAX_BODY + 1, 0x61) });
  check("vercel oversized body is rejected", res.statusCode === 413, "status " + res.statusCode);
}

async function main() {
  const port = await freePort();
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "n1-trilingual-sec-"));
  const env = { ...process.env, SYNC_TOKEN: TOKEN, DATA_DIR: dataDir, HOST: "127.0.0.1", PORT: String(port) };
  delete env.DATABASE_URL;

  const child = spawn(process.execPath, [path.join(ROOT, "scripts", "serve.js"), String(port)], {
    cwd: ROOT, env, stdio: ["ignore", "pipe", "pipe"]
  });
  let stderr = "";
  child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
  child.stdout.resume();

  try {
    await waitForServer(port, child);

    let res = await request(port, "GET", "/api/health");
    check("health requires a sync key", res.status === 401, "status " + res.status);

    res = await request(port, "GET", "/api/state", { token: "wrong-" + TOKEN });
    check("wrong sync key is rejected", res.status === 401, "status " + res.status);

    res = await request(port, "GET", "/api/state", { token: TOKEN });
    check("correct sync key is accepted", res.status === 200, "status " + res.status);

    res = await request(port, "PUT", "/api/state", { body: { state: { lang: "en" } } });
    check("write without a sync key is rejected", res.status === 401, "status " + res.status);

    res = await request(port, "PUT", "/api/state", { token: TOKEN, body: "{" });
    check("invalid JSON is rejected", res.status === 400, "status " + res.status);

    res = await request(port, "PUT", "/api/state", { token: TOKEN, body: { state: [] } });
    check("array state is rejected", res.status === 400, "status " + res.status);

    res = await request(port, "PUT", "/api/state", { token: TOKEN, body: { state: null } });
    check("null state is rejected", res.status === 400, "status " + res.status);

    res = await request(port, "PUT", "/api/state", { token: TOKEN, body: { state: { lang: "ja", step: 3 } } });
    check("valid state is stored", res.status === 200, "status " + res.status);

    res = await request(port, "GET", "/api/state", { token: TOKEN });
    const state = parseJson(res);
    check("stored state round-trips",
      res.status === 200 && state && state.state && state.state.lang === "ja" && state.state.step === 3,
      JSON.stringify(state));

    res = await request(port, "DELETE", "/api/state", { token: TOKEN });
    check("unsupported method is rejected", res.status === 405, "status " + res.status);
    check("405 advertises allowed methods", /GET/.test(String(res.headers.allow || "")) &&
      /PUT/.test(String(res.headers.allow || "")), "Allow: " + res.headers.allow);

    res = await request(port, "GET", "/.data/users/learner-1.json", { token: TOKEN });
    check("runtime data directory is not served", res.status === 404, "status " + res.status);

    res = await request(port, "GET", "/assets/%2e%2e/%2e%2e/package.json", { token: TOKEN });
    check("encoded path traversal is rejected", res.status === 404 || res.status === 403, "status " + res.status);

    res = await request(port, "GET", "/api/%", { token: TOKEN });
    check("malformed percent-encoding is rejected", res.status === 400 || res.status === 404, "status " + res.status);

    res = await request(port, "GET", "/api/does-not-exist", { token: TOKEN });
    check("unknown API route is rejected", res.status === 405, "status " + res.status);

    const oversized = Buffer.alloc(MAX_BODY + 4096, 0x61);
    res = await request(port, "PUT", "/api/state", { token: TOKEN, body: oversized });
    check("oversized body is rejected", res.status === 413 || res.status === 0,
      res.error || ("status " + res.status));

    await checkVercelHandler();
  } finally {
    child.kill();
    await sleep(200);
    try { fs.rmSync(dataDir, { recursive: true, force: true }); } catch (e) { /* best effort */ }
  }

  console.log(`API auth test: ${passed} passed, ${failed} failed`);
  if (failed && stderr.trim()) console.error(stderr.trim());
  return failed ? 1 : 0;
}

main().then((code) => process.exit(code)).catch((err) => {
  console.error("API auth test failed to run:", err.message || err);
  process.exit(1);
});
