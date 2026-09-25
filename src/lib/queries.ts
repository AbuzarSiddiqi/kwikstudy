import { db, parseJson, type CourseRow, type LessonRow, type ModuleRow } from "@/lib/db";

/* ---------- catalog ---------- */

export type CourseCard = CourseRow & { category_name: string; category_slug: string; instructor_name: string };

const COURSE_SELECT = `
  SELECT c.*, cat.name AS category_name, cat.slug AS category_slug,
    (SELECT i.name FROM course_instructors ci JOIN instructors i ON i.id = ci.instructor_id
      WHERE ci.course_id = c.id ORDER BY ci.role LIMIT 1) AS instructor_name
  FROM courses c
  JOIN course_categories cat ON cat.id = c.category_id
`;

export function getPublishedCourses(): CourseCard[] {
  return db.prepare(`${COURSE_SELECT} WHERE c.status = 'published' ORDER BY c.created_at`).all() as unknown as CourseCard[];
}

export function getCourseBySlug(slug: string): CourseCard | null {
  return (db.prepare(`${COURSE_SELECT} WHERE c.slug = ?`).get(slug) as unknown as CourseCard) ?? null;
}

export function searchCourses(q: string, category?: string): CourseCard[] {
  const like = `%${q}%`;
  let sql = `${COURSE_SELECT} WHERE c.status = 'published' AND (c.title LIKE ? OR c.subtitle LIKE ? OR c.description LIKE ? OR cat.name LIKE ? OR c.cover_code LIKE ?)`;
  const args: unknown[] = [like, like, like, like, like];
  if (category && category !== "all") {
    sql += " AND cat.slug = ?";
    args.push(category);
  }
  return db.prepare(sql + " ORDER BY c.created_at").all(...args) as unknown as CourseCard[];
}

export function getCategories() {
  return db.prepare("SELECT * FROM course_categories ORDER BY id").all() as { id: string; slug: string; name: string; description: string }[];
}

/* ---------- curriculum ---------- */

export type CurriculumModule = ModuleRow & { lessons: LessonRow[] };

export function getCurriculum(courseId: string): CurriculumModule[] {
  const mods = db.prepare("SELECT * FROM modules WHERE course_id = ? ORDER BY idx").all(courseId) as ModuleRow[];
  const les = db.prepare("SELECT * FROM lessons WHERE module_id IN (SELECT id FROM modules WHERE course_id = ?) ORDER BY idx").all(courseId) as LessonRow[];
  return mods.map((m) => ({ ...m, lessons: les.filter((l) => l.module_id === m.id) }));
}

export function getCourseStats(courseId: string) {
  const row = db
    .prepare(
      `SELECT COUNT(l.id) AS lesson_count,
              COALESCE(SUM(l.duration_min), 0) AS total_min,
              SUM(l.is_free_preview) AS free_count,
              (SELECT COUNT(*) FROM modules WHERE course_id = ?) AS module_count
       FROM lessons l JOIN modules m ON m.id = l.module_id
       WHERE m.course_id = ?`
    )
    .get(courseId, courseId) as { lesson_count: number; total_min: number; free_count: number; module_count: number };
  return row;
}

export function getLessonWithCourse(lessonId: string) {
  return db
    .prepare(
      `SELECT l.*, m.course_id, m.idx AS module_idx, m.title AS module_title,
              c.slug AS course_slug, c.title AS course_title
       FROM lessons l JOIN modules m ON m.id = l.module_id JOIN courses c ON c.id = m.course_id
       WHERE l.id = ?`
    )
    .get(lessonId) as
    | (LessonRow & { course_id: string; module_idx: number; module_title: string; course_slug: string; course_title: string })
    | undefined;
}

/* ---------- instructors ---------- */

export function getInstructors() {
  return db
    .prepare(
      `SELECT i.*,
        (SELECT COUNT(*) FROM course_instructors ci WHERE ci.instructor_id = i.id) AS course_count
       FROM instructors i ORDER BY i.experience_years DESC`
    )
    .all() as unknown as (Instructor & { course_count: number })[];
}

export type Instructor = {
  id: string; slug: string; name: string; role: string; bio: string;
  expertise: string; experience_years: number; teaching_approach: string;
};

export function getInstructorBySlug(slug: string) {
  const ins = db.prepare("SELECT * FROM instructors WHERE slug = ?").get(slug) as Instructor | undefined;
  if (!ins) return null;
  const courses = db
    .prepare(
      `SELECT c.*, cat.name AS category_name, cat.slug AS category_slug, ci.role AS ci_role
       FROM course_instructors ci JOIN courses c ON c.id = ci.course_id
       JOIN course_categories cat ON cat.id = c.category_id
       WHERE ci.instructor_id = ? ORDER BY c.price DESC`
    )
    .all(ins.id) as unknown as (CourseRow & { category_name: string; category_slug: string; ci_role: string })[];
  return { ...ins, expertiseList: parseJson<string[]>(ins.expertise, []), courses };
}

/* ---------- programs ---------- */

export function getPrograms() {
  return db
    .prepare(
      `SELECT p.*,
        (SELECT GROUP_CONCAT(c.title, ' · ') FROM program_courses pc JOIN courses c ON c.id = pc.course_id WHERE pc.program_id = p.id) AS course_titles,
        (SELECT COUNT(*) FROM program_courses pc WHERE pc.program_id = p.id) AS course_count
       FROM programs p WHERE p.status = 'published' ORDER BY p.price DESC`
    )
    .all() as unknown as ProgramRow[];
}

export type ProgramRow = {
  id: string; slug: string; title: string; subtitle: string; description: string; level: string;
  duration_months: number; price: number; original_price: number | null; cover_variant: string; cover_code: string;
  outcomes: string; projects: string; faqs: string; course_titles: string; course_count: number;
};

export function getProgramBySlug(slug: string) {
  const program = db.prepare("SELECT * FROM programs WHERE slug = ? AND status = 'published'").get(slug) as ProgramRow | undefined;
  if (!program) return null;
  const courses = db
    .prepare(
      `SELECT c.*, cat.name AS category_name, cat.slug AS category_slug, pc.note, pc.idx
       FROM program_courses pc JOIN courses c ON c.id = pc.course_id
       JOIN course_categories cat ON cat.id = c.category_id
       WHERE pc.program_id = ? ORDER BY pc.idx`
    )
    .all(program.id) as unknown as (CourseRow & { category_name: string; category_slug: string; note: string })[];
  return { ...program, courses };
}

/* ---------- enrollment & progress ---------- */

export function isEnrolled(userId: string, courseId: string): boolean {
  return !!db.prepare("SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?").get(userId, courseId);
}

export type CourseProgress = {
  completed: number; total: number; percent: number;
  currentLessonId: string | null; lastCompletedAt: string | null;
};

export function getCourseProgress(userId: string, courseId: string): CourseProgress {
  const total = (getCourseStats(courseId).lesson_count as number) ?? 0;
  const rows = db
    .prepare(
      `SELECT l.id, lp.status, lp.completed_at
       FROM lessons l
       JOIN modules m ON m.id = l.module_id
       LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = ?
       WHERE m.course_id = ? ORDER BY m.idx, l.idx`
    )
    .all(userId, courseId) as { id: string; status: string | null; completed_at: string | null }[];
  const completed = rows.filter((r) => r.status === "completed").length;
  const current = rows.find((r) => r.status !== "completed");
  const lastCompleted = rows.filter((r) => r.status === "completed").at(-1);
  return {
    completed, total, percent: total ? Math.round((completed / total) * 100) : 0,
    currentLessonId: current?.id ?? null,
    lastCompletedAt: lastCompleted?.completed_at ?? null,
  };
}

export function getEnrolledCourses(userId: string) {
  return db
    .prepare(
      `SELECT c.*, cat.name AS category_name, cat.slug AS category_slug, e.enrolled_at, e.status AS enroll_status
       FROM enrollments e JOIN courses c ON c.id = e.course_id
       JOIN course_categories cat ON cat.id = c.category_id
       WHERE e.user_id = ? ORDER BY e.enrolled_at DESC`
    )
    .all(userId) as unknown as (CourseRow & { category_name: string; category_slug: string; enrolled_at: string; enroll_status: string })[];
}

export function getLearningActivity(userId: string, days = 28) {
  const since = new Date(Date.now() - days * 86400_000).toISOString();
  const rows = db
    .prepare(
      `SELECT DATE(completed_at) AS day, COUNT(*) AS n
       FROM lesson_progress
       WHERE user_id = ? AND status = 'completed' AND completed_at >= ?
       GROUP BY DATE(completed_at) ORDER BY day`
    )
    .all(userId, since) as { day: string; n: number }[];
  const byDay = new Map(rows.map((r) => [r.day, r.n]));
  const daysArr: { date: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10);
    daysArr.push({ date, count: byDay.get(date) ?? 0 });
  }
  // current streak: consecutive days with activity ending today or yesterday
  let streak = 0;
  for (let i = daysArr.length - 1; i >= 0; i--) {
    if (daysArr[i].count > 0) streak++;
    else if (i === daysArr.length - 1) continue; // today with no activity yet doesn't break
    else break;
  }
  return { days: daysArr, streak };
}

export function getCertificate(certId: string) {
  return db
    .prepare(
      `SELECT ct.*, u.name AS student_name, u.email AS student_email, c.title AS course_title, c.slug AS course_slug
       FROM certificates ct JOIN users u ON u.id = ct.user_id JOIN courses c ON c.id = ct.course_id
       WHERE ct.id = ?`
    )
    .get(certId) as
    | { id: string; user_id: string; course_id: string; issued_at: string; status: string; student_name: string; student_email: string; course_title: string; course_slug: string }
    | undefined;
}

export function getUserCertificates(userId: string) {
  return db
    .prepare(
      `SELECT ct.*, c.title AS course_title, c.slug AS course_slug
       FROM certificates ct JOIN courses c ON c.id = ct.course_id
       WHERE ct.user_id = ? ORDER BY ct.issued_at DESC`
    )
    .all(userId) as unknown as { id: string; issued_at: string; status: string; course_title: string; course_slug: string }[];
}
