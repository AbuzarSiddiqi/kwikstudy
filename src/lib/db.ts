import Database from "better-sqlite3";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { seedDatabase } from "@/db/seed";

export type Db = Database.Database;

/**
 * Resolves a writable directory for the SQLite file.
 * Local/dev and traditional hosts use <cwd>/data; on read-only serverless
 * filesystems (e.g. Vercel) the database lives in /tmp and is seeded on
 * first boot. NOTE: /tmp is ephemeral per instance — for durable storage
 * connect a managed database (Turso/LibSQL, Postgres, Supabase).
 */
function resolveDataDir(): string {
  const candidates = [
    process.env.KS_DATA_DIR,
    path.join(process.cwd(), "data"),
    path.join(os.tmpdir(), "kwikstudy"),
  ].filter((dir): dir is string => typeof dir === "string" && dir.length > 0);
  for (const dir of candidates) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      fs.accessSync(dir, fs.constants.W_OK);
      return dir;
    } catch {
      /* read-only or unusable — try the next candidate */
    }
  }
  throw new Error("KwikStudy: no writable directory available for the SQLite database");
}

function createDb(): Db {
  const dir = resolveDataDir();
  const file = path.join(dir, "kwikstudy.db");
  const fresh = !fs.existsSync(file);
  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  if (fresh) {
    console.log(`[kwikstudy] fresh database at ${file} — seeding demo content`);
    seedDatabase(db);
  }
  return db;
}

const g = globalThis as unknown as { __ksDb?: Db };

export const db: Db = g.__ksDb ?? (g.__ksDb = createDb());

/* ---------- shared row types ---------- */

export type UserRow = {
  id: string; email: string; password_hash: string; name: string;
  role: "student" | "instructor" | "admin"; phone: string | null; created_at: string;
};

export type CourseRow = {
  id: string; slug: string; title: string; subtitle: string; description: string;
  category_id: string; level: string; language: string; duration_hours: number;
  price: number; original_price: number | null;
  status: "published" | "draft" | "waitlist";
  cover_variant: string; cover_code: string;
  projects: string; outcomes: string; requirements: string; faqs: string;
  created_at: string;
  // joined
  category_name?: string; category_slug?: string;
};

export type ModuleRow = { id: string; course_id: string; idx: number; title: string; summary: string };
export type LessonRow = {
  id: string; module_id: string; idx: number; title: string;
  type: "video" | "text" | "quiz" | "assignment";
  duration_min: number; is_free_preview: number; content: string;
};
export type InstructorRow = {
  id: string; slug: string; name: string; role: string; bio: string;
  expertise: string; experience_years: number; teaching_approach: string;
};
export type EnrollmentRow = { id: string; user_id: string; course_id: string; enrolled_at: string; status: string; order_id: string | null };
export type ProgressRow = { id: string; user_id: string; course_id: string; lesson_id: string; status: string; completed_at: string | null; last_viewed_at: string | null };
export type CertificateRow = { id: string; user_id: string; course_id: string; issued_at: string; status: string };
export type EnquiryRow = {
  id: string; name: string; email: string; phone: string | null; topic: string;
  course_id: string | null; preferred_contact: string; message: string; status: string; created_at: string;
};

export function parseJson<T>(s: string | null | undefined, fallback: T): T {
  if (!s) return fallback;
  try { return JSON.parse(s) as T; } catch { return fallback; }
}
