import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { readFileSync } from "node:fs";

export type Db = Database.Database;

function createDb(): Db {
  const dataDir = path.join(process.cwd(), "data");
  fs.mkdirSync(dataDir, { recursive: true });
  const db = new Database(path.join(dataDir, "kwikstudy.db"));
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  const schema = readFileSync(path.join(process.cwd(), "src", "db", "schema.sql"), "utf8");
  db.exec(schema);
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
