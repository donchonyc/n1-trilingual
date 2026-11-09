/* Single-user persistence for the trilingual study site.
   Default backend: atomic JSON file under DATA_DIR.
   Multi-server backend: PostgreSQL when DATABASE_URL is set (requires `pg`).
   The app servers are stateless; point every instance at the same DB. */
const fs = require("fs");
const fsp = fs.promises;
const path = require("path");

const ROOT = path.join(__dirname, "..");
const USER_ID = process.env.USER_ID || "learner-1";
const USER_NAME = process.env.USER_NAME || "Learner";
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, ".data");

function iso() { return new Date().toISOString(); }

async function fileStore() {
  const dir = path.join(DATA_DIR, "users");
  const file = path.join(dir, USER_ID + ".json");
  await fsp.mkdir(dir, { recursive: true });

  async function ensure() {
    try {
      const raw = await fsp.readFile(file, "utf8");
      const rec = JSON.parse(raw);
      return rec;
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
      const rec = {
        id: USER_ID, name: USER_NAME, state: null, revision: 0,
        createdAt: iso(), updatedAt: iso()
      };
      await write(rec);
      return rec;
    }
  }

  async function write(rec) {
    const tmp = file + ".tmp." + process.pid + "." + Date.now();
    await fsp.writeFile(tmp, JSON.stringify(rec, null, 2), "utf8");
    await fsp.rename(tmp, file);
  }

  return {
    backend: "file",
    user: { id: USER_ID, name: USER_NAME },
    async get() {
      const rec = await ensure();
      return {
        user: {
          id: rec.id, name: rec.name, revision: rec.revision,
          createdAt: rec.createdAt, updatedAt: rec.updatedAt
        },
        state: rec.state
      };
    },
    async put(state) {
      const rec = await ensure();
      const next = {
        ...rec,
        state: state,
        revision: Number(rec.revision || 0) + 1,
        updatedAt: iso()
      };
      await write(next);
      return {
        user: {
          id: next.id, name: next.name, revision: next.revision,
          createdAt: next.createdAt, updatedAt: next.updatedAt
        },
        state: next.state
      };
    }
  };
}

async function postgresStore() {
  let Pool;
  try {
    ({ Pool } = require("pg"));
  } catch (e) {
    throw new Error("DATABASE_URL is set but the 'pg' package is not installed. Run: npm install pg");
  }
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : undefined
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS trilingual_user (
      id text PRIMARY KEY,
      name text NOT NULL,
      state jsonb,
      revision integer NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `);
  await pool.query(
    `INSERT INTO trilingual_user (id, name, state, revision)
     VALUES ($1, $2, NULL, 0) ON CONFLICT (id) DO NOTHING`,
    [USER_ID, USER_NAME]
  );

  async function get() {
    const q = await pool.query(
      `SELECT id, name, state, revision, created_at, updated_at
       FROM trilingual_user WHERE id = $1`, [USER_ID]
    );
    const r = q.rows[0];
    return {
      user: {
        id: r.id, name: r.name, revision: Number(r.revision),
        createdAt: r.created_at, updatedAt: r.updated_at
      },
      state: r.state
    };
  }

  return {
    backend: "postgres",
    user: { id: USER_ID, name: USER_NAME },
    get,
    async put(state) {
      const q = await pool.query(
        `UPDATE trilingual_user
         SET state = $2::jsonb, revision = revision + 1, updated_at = now()
         WHERE id = $1
         RETURNING id, name, state, revision, created_at, updated_at`,
        [USER_ID, JSON.stringify(state)]
      );
      const r = q.rows[0];
      return {
        user: {
          id: r.id, name: r.name, revision: Number(r.revision),
          createdAt: r.created_at, updatedAt: r.updated_at
        },
        state: r.state
      };
    }
  };
}

async function createStore() {
  return process.env.DATABASE_URL ? postgresStore() : fileStore();
}

module.exports = { createStore, USER_ID, USER_NAME, DATA_DIR };
