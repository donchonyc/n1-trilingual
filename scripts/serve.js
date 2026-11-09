/* Static preview + single-user sync API.
   Local: node scripts/serve.js [port]
   Multi-server: set DATABASE_URL (and npm install pg); all app servers share it.
   Optional sync key: SYNC_TOKEN=... (sent as x-sync-token). */
const http = require("http");
const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const crypto = require("crypto");
const { createStore } = require("./store");

const root = path.join(__dirname, "..");
const port = Number(process.env.PORT || process.argv[2]) || 4173;
const host = process.env.HOST || "127.0.0.1";
const syncToken = process.env.SYNC_TOKEN || "";
const MAX_BODY = 5 * 1024 * 1024;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon"
};

function sendJSON(res, status, value) {
  const body = JSON.stringify(value);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function authorized(req) {
  if (!syncToken) return true;
  const got = String(req.headers["x-sync-token"] || "");
  if (got.length !== syncToken.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(got), Buffer.from(syncToken));
  } catch (e) { return false; }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(Object.assign(new Error("Payload too large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => {
      try { resolve(Buffer.concat(chunks).toString("utf8")); }
      catch (e) { reject(e); }
    });
    req.on("error", reject);
  });
}

async function handleAPI(req, res, urlPath, store) {
  if (!authorized(req)) {
    sendJSON(res, 401, { error: "sync_key_required" });
    return true;
  }

  if (req.method === "GET" && urlPath === "/api/health") {
    sendJSON(res, 200, { ok: true, backend: store.backend });
    return true;
  }

  if (req.method === "GET" && (urlPath === "/api/state" || urlPath === "/api/user")) {
    const rec = await store.get();
    sendJSON(res, 200, {
      user: rec.user,
      backend: store.backend,
      state: urlPath === "/api/state" ? rec.state : undefined
    });
    return true;
  }

  if (req.method === "PUT" && urlPath === "/api/state") {
    let body;
    try {
      const raw = await readBody(req);
      body = JSON.parse(raw || "{}");
    } catch (e) {
      sendJSON(res, e.status || 400, { error: "invalid_json" });
      return true;
    }
    if (!body || typeof body.state !== "object" || body.state === null || Array.isArray(body.state)) {
      sendJSON(res, 400, { error: "state_object_required" });
      return true;
    }
    if (JSON.stringify(body.state).length > MAX_BODY) {
      sendJSON(res, 413, { error: "payload_too_large" });
      return true;
    }
    const rec = await store.put(body.state);
    sendJSON(res, 200, {
      ok: true,
      user: rec.user,
      backend: store.backend
    });
    return true;
  }

  sendJSON(res, 405, { error: "method_not_allowed" });
  return true;
}

async function main() {
  const store = await createStore();
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);

    if (urlPath === "/api" || urlPath.startsWith("/api/")) {
      handleAPI(req, res, urlPath, store).catch((e) => {
        console.error("API error:", e);
        if (!res.headersSent) sendJSON(res, 500, { error: "server_error" });
      });
      return;
    }

    // Never expose runtime state or dotfiles.
    if (urlPath.startsWith("/.data") || urlPath.startsWith("/data") ||
        urlPath.split("/").some((p) => p.startsWith("."))) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const rel = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
    const file = path.normalize(path.join(root, rel));
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(403); res.end("Forbidden"); return;
    }
    fsp.readFile(file).then((data) => {
      res.writeHead(200, {
        "Content-Type": types[path.extname(file).toLowerCase()] || "application/octet-stream",
        "Cache-Control": "no-store"
      });
      res.end(data);
    }).catch(() => {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found: " + urlPath);
    });
  });

  server.listen(port, host, () => {
    console.log(`N1 trilingual → http://${host}:${port}`);
    console.log(`single user: ${store.user.id} (${store.user.name})`);
    console.log(`state backend: ${store.backend}` + (syncToken ? " · sync key required" : ""));
    if (store.backend === "file") console.log("multi-server: set DATABASE_URL (Postgres) or share DATA_DIR");
  });
}

main().catch((e) => {
  console.error("Server failed:", e.message || e);
  process.exit(1);
});
