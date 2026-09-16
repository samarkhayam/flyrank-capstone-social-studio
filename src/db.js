import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import {config} from "./config.js";
fs.mkdirSync(path.dirname(config.databaseFile),{recursive:true});
export const db=new Database(config.databaseFile);
db.pragma("journal_mode=WAL"); db.pragma("foreign_keys=ON");
export function initDb(){db.exec(`CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,body TEXT NOT NULL,url TEXT,source_type TEXT NOT NULL,created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS variants(id INTEGER PRIMARY KEY AUTOINCREMENT,post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,platform TEXT NOT NULL,body TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'draft',rejection_reason TEXT,created_at TEXT NOT NULL,updated_at TEXT NOT NULL,UNIQUE(post_id,platform));
CREATE TABLE IF NOT EXISTS jobs(id INTEGER PRIMARY KEY AUTOINCREMENT,variant_id INTEGER NOT NULL REFERENCES variants(id) ON DELETE CASCADE,scheduled_for TEXT NOT NULL,adapter TEXT NOT NULL,idempotency_key TEXT NOT NULL UNIQUE,status TEXT NOT NULL DEFAULT 'pending',attempts INTEGER NOT NULL DEFAULT 0,last_error TEXT,created_at TEXT NOT NULL,updated_at TEXT NOT NULL,UNIQUE(variant_id,scheduled_for));
CREATE TABLE IF NOT EXISTS publish_attempts(id INTEGER PRIMARY KEY AUTOINCREMENT,job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,variant_id INTEGER NOT NULL REFERENCES variants(id) ON DELETE CASCADE,adapter TEXT NOT NULL,idempotency_key TEXT NOT NULL,status TEXT NOT NULL,external_id TEXT,error TEXT,attempted_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_jobs_due ON jobs(status,scheduled_for);`)}
export const repos={
posts:{create:db.prepare(`INSERT INTO posts(title,body,url,source_type,created_at) VALUES(@title,@body,@url,@sourceType,@createdAt)`),list:db.prepare(`SELECT * FROM posts ORDER BY id DESC`),get:db.prepare(`SELECT * FROM posts WHERE id=?`)},
variants:{upsert:db.prepare(`INSERT INTO variants(post_id,platform,body,status,created_at,updated_at) VALUES(@postId,@platform,@body,'draft',@now,@now) ON CONFLICT(post_id,platform) DO UPDATE SET body=excluded.body,status='draft',rejection_reason=NULL,updated_at=excluded.updated_at`),list:db.prepare(`SELECT * FROM variants ORDER BY id DESC`),get:db.prepare(`SELECT * FROM variants WHERE id=?`),approve:db.prepare(`UPDATE variants SET status='approved',rejection_reason=NULL,updated_at=? WHERE id=?`),reject:db.prepare(`UPDATE variants SET status='rejected',rejection_reason=?,updated_at=? WHERE id=?`),edit:db.prepare(`UPDATE variants SET body=?,status='draft',rejection_reason=NULL,updated_at=? WHERE id=?`)},
jobs:{create:db.prepare(`INSERT INTO jobs(variant_id,scheduled_for,adapter,idempotency_key,status,created_at,updated_at) VALUES(@variantId,@scheduledFor,@adapter,@idempotencyKey,'pending',@now,@now)`),list:db.prepare(`SELECT * FROM jobs ORDER BY scheduled_for,id`),due:db.prepare(`SELECT * FROM jobs WHERE status='pending' AND scheduled_for<=? ORDER BY scheduled_for,id LIMIT ?`),claim:db.prepare(`UPDATE jobs SET status='processing',attempts=attempts+1,updated_at=? WHERE id=? AND status='pending'`),complete:db.prepare(`UPDATE jobs SET status='completed',updated_at=? WHERE id=?`),retry:db.prepare(`UPDATE jobs SET status='pending',last_error=?,updated_at=? WHERE id=?`),fail:db.prepare(`UPDATE jobs SET status='failed',last_error=?,updated_at=? WHERE id=?`)},
attempts:{create:db.prepare(`INSERT INTO publish_attempts(job_id,variant_id,adapter,idempotency_key,status,external_id,error,attempted_at) VALUES(@jobId,@variantId,@adapter,@idempotencyKey,@status,@externalId,@error,@attemptedAt)`),list:db.prepare(`SELECT * FROM publish_attempts ORDER BY id DESC`)}
};
export const transaction=fn=>db.transaction(fn)();
