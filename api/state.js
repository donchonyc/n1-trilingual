/* Vercel serverless endpoint for the single tracked user.
   State is stored in a private Vercel Blob object, which persists across
   function instances and deployments. Local development uses scripts/serve.js. */
const crypto = require("crypto");
const { put, get } = require("@vercel/blob");

const USER_ID = process.env.USER_ID || "learner-1";
const USER_NAME = process.env.USER_NAME || "Learner";
const BLOB_PATH = "n1-trilingual/users/" + USER_ID + ".json";
const SYNC_TOKEN = process.env.SYNC_TOKEN || "";
const MAX_BODY = 5 * 1024 * 1024;

function iso() { return new Date().toISOString(); }

function blobOptions() {
  const o = { access: "private", useCache: false };
  if (process.env.BLOB_READ_WRITE_TOKEN) o.token = process.env.BLOB_READ_WRITE_TOKEN;
  if (process.env.BLOB_STORE_ID) o.storeId = process.env.BLOB_STORE_ID;
  return o;
}

function writeOptions() {
  const o = { access: "private" };
  if (process.env.BLOB_READ_WRITE_TOKEN) o.token = process.env.BLOB_READ_WRITE_TOKEN;
  if (process.env.BLOB_STORE_ID) o.storeId = process.env.BLOB_STORE_ID;
  return o;
}

function defaultRecord() {
  const now = iso();
  return {
    id: USER_ID, name: USER_NAME, state: null, revision: 0,
    createdAt: now, updatedAt: now
  };
}

async function readRecord() {
  let result;
  try {
    result = await get(BLOB_PATH, blobOptions());
  } catch (e) {
    if (e && (e.name === "BlobNotFoundError" || e.statusCode === 404)) return defaultRecord();
    throw e;
  }
  if (!result || !result.stream) return defaultRecord();
  const text = await new Response(result.stream).text();
  if (!text) return defaultRecord();
  const rec = JSON.parse(text);
  return {
    id: rec.id || USER_ID,
    name: rec.name || USER_NAME,
    state: rec.state == null ? null : rec.state,
    revision: Number(rec.revision) || 0,
    createdAt: rec.createdAt || iso(),
    updatedAt: rec.updatedAt || iso()
  };
}

async function writeRecord(rec) {
  await put(BLOB_PATH, JSON.stringify(rec), {
    ...writeOptions(),
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60
  });
}

function meta(rec) {
  return {
    id: rec.id, name: rec.name, revision: rec.revision,
    createdAt: rec.createdAt, updatedAt: rec.updatedAt
  };
}

function send(res, status, value) {
  const body = JSON.stringify(value);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Length", Buffer.byteLength(body));
  res.end(body);
}

function authorized(req) {
  if (!SYNC_TOKEN) return true;
  const got = String(req.headers["x-sync-token"] || "");
  if (got.length !== SYNC_TOKEN.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(got), Buffer.from(SYNC_TOKEN));
  } catch (e) { return false; }
}

async function readJson(req) {
  if (req.body && typeof req.body === "object") {
    if (Buffer.isBuffer(req.body)) return JSON.parse(req.body.toString("utf8"));
    return req.body;
  }
  if (typeof req.body === "string") return JSON.parse(req.body);
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) {
      const e = new Error("Payload too large");
      e.statusCode = 413;
      throw e;
    }
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

module.exports = async function handler(req, res) {
  try {
    if (!authorized(req)) {
      send(res, 401, { error: "sync_key_required" });
      return;
    }

    if (req.method === "GET") {
      const rec = await readRecord();
      send(res, 200, {
        user: meta(rec),
        backend: "vercel-blob",
        state: rec.state
      });
      return;
    }

    if (req.method === "PUT") {
      let body;
      try {
        body = await readJson(req);
      } catch (e) {
        send(res, e.statusCode || 400, { error: "invalid_json" });
        return;
      }
      if (!body || typeof body.state !== "object" || body.state === null || Array.isArray(body.state)) {
        send(res, 400, { error: "state_object_required" });
        return;
      }
      if (JSON.stringify(body.state).length > MAX_BODY) {
        send(res, 413, { error: "payload_too_large" });
        return;
      }
      const prev = await readRecord();
      const rec = {
        ...prev,
        state: body.state,
        revision: Number(prev.revision || 0) + 1,
        updatedAt: iso()
      };
      await writeRecord(rec);
      send(res, 200, { ok: true, user: meta(rec), backend: "vercel-blob" });
      return;
    }

    res.setHeader("Allow", "GET, PUT");
    send(res, 405, { error: "method_not_allowed" });
  } catch (e) {
    console.error("Blob state error:", e);
    send(res, 500, { error: "server_error" });
  }
};
