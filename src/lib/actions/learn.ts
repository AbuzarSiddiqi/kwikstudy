"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { newId } from "@/lib/auth-core";

function courseOfLesson(lessonId: string): { course_id: string; slug: string } | undefined {
  return db
    .prepare("SELECT m.course_id, c.slug FROM lessons l JOIN modules m ON m.id = l.module_id JOIN courses c ON c.id = m.course_id WHERE l.id = ?")
    .get(lessonId) as { course_id: string; slug: string } | undefined;
}

function isEnrolledIn(userId: string, courseId: string): boolean {
  return !!db.prepare("SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?").get(userId, courseId);
}

/** Issue a certificate when every lesson of the course is complete. */
function maybeIssueCertificate(userId: string, courseId: string) {
  const existing = db.prepare("SELECT id FROM certificates WHERE user_id = ? AND course_id = ?").get(userId, courseId);
  if (existing) return;
  const total = db
    .prepare("SELECT COUNT(*) n FROM lessons WHERE module_id IN (SELECT id FROM modules WHERE course_id = ?)")
    .get(courseId) as { n: number };
  const done = db
    .prepare(
      "SELECT COUNT(*) n FROM lesson_progress WHERE user_id = ? AND course_id = ? AND status = 'completed'"
    )
    .get(userId, courseId) as { n: number };
  if (total.n > 0 && done.n >= total.n) {
    const id = `CERT-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    db.prepare("INSERT INTO certificates (id, user_id, course_id, issued_at, status) VALUES (?,?,?,?, 'valid')")
      .run(id, userId, courseId, new Date().toISOString());
    db.prepare("UPDATE enrollments SET status = 'completed' WHERE user_id = ? AND course_id = ?").run(userId, courseId);
    revalidatePath("/dashboard/certificates");
  }
}

export type CompleteState = { ok: boolean; error?: string; percent?: number } | null;

export async function toggleLessonComplete(lessonId: string, complete: boolean): Promise<CompleteState> {
  const user = await requireUser();
  const course = courseOfLesson(lessonId);
  if (!course) return { ok: false, error: "Lesson not found" };
  if (!isEnrolledIn(user.id, course.course_id)) return { ok: false, error: "You are not enrolled in this course" };

  if (complete) {
    db.prepare(
      `INSERT INTO lesson_progress (id, user_id, course_id, lesson_id, status, completed_at, last_viewed_at)
       VALUES (?,?,?,?, 'completed', ?, ?)
       ON CONFLICT(user_id, lesson_id) DO UPDATE SET status = 'completed', completed_at = ?`
    ).run(newId("lp"), user.id, course.course_id, lessonId, new Date().toISOString(), new Date().toISOString(), new Date().toISOString());
  } else {
    db.prepare("DELETE FROM lesson_progress WHERE user_id = ? AND lesson_id = ?").run(user.id, lessonId);
  }

  maybeIssueCertificate(user.id, course.course_id);

  const stats = db
    .prepare(
      `SELECT (SELECT COUNT(*) FROM lessons WHERE module_id IN (SELECT id FROM modules WHERE course_id = ?)) total,
              (SELECT COUNT(*) FROM lesson_progress WHERE user_id = ? AND course_id = ? AND status = 'completed') done`
    )
    .get(course.course_id, user.id, course.course_id) as { total: number; done: number };

  revalidatePath(`/learn/${course.slug}`);
  revalidatePath("/dashboard");
  return { ok: true, percent: stats.total ? Math.round((stats.done / stats.total) * 100) : 0 };
}

export async function pingLessonView(lessonId: string): Promise<void> {
  const user = await requireUser();
  const course = courseOfLesson(lessonId);
  if (!course || !isEnrolledIn(user.id, course.course_id)) return;
  db.prepare(
    `INSERT INTO lesson_progress (id, user_id, course_id, lesson_id, status, last_viewed_at)
     VALUES (?,?,?,?, 'in_progress', ?)
     ON CONFLICT(user_id, lesson_id) DO UPDATE SET last_viewed_at = ?`
  ).run(newId("lp"), user.id, course.course_id, lessonId, new Date().toISOString(), new Date().toISOString());
}

/* ---------- quizzes ---------- */

export type QuizResult =
  | { ok: true; passed: boolean; score: number; total: number; results: { correct: boolean; correctIndex: number; explanation: string }[] }
  | { ok: false; error: string }
  | null;

export async function submitQuiz(lessonId: string, answers: number[]): Promise<QuizResult> {
  const user = await requireUser();
  const course = courseOfLesson(lessonId);
  if (!course) return { ok: false, error: "Lesson not found" };
  if (!isEnrolledIn(user.id, course.course_id)) return { ok: false, error: "You are not enrolled in this course" };

  const quiz = db.prepare("SELECT * FROM quizzes WHERE lesson_id = ?").get(lessonId) as { id: string; pass_score: number } | undefined;
  if (!quiz) return { ok: false, error: "No quiz attached to this lesson" };

  const questions = db.prepare("SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY idx").all(quiz.id) as
    { id: string; question: string; explanation: string }[];

  const results = questions.map((q, i) => {
    const chosen = answers[i] ?? -1;
    const correctRow = db.prepare("SELECT idx FROM quiz_options WHERE question_id = ? AND is_correct = 1").get(q.id) as { idx: number };
    return { correct: chosen === correctRow.idx, correctIndex: correctRow.idx, explanation: q.explanation };
  });

  const score = results.filter((r) => r.correct).length;
  const total = questions.length;
  const passed = total > 0 && (score / total) * 100 >= quiz.pass_score;

  db.prepare("INSERT INTO quiz_attempts (id, quiz_id, user_id, score, total, created_at) VALUES (?,?,?,?,?,?)")
    .run(newId("qa"), quiz.id, user.id, score, total, new Date().toISOString());

  if (passed) {
    await toggleLessonComplete(lessonId, true);
  }
  revalidatePath(`/learn/${course.slug}`);
  return { ok: true, passed, score, total, results };
}

export async function latestAttempt(lessonId: string) {
  const user = await requireUser();
  const quiz = db.prepare("SELECT id FROM quizzes WHERE lesson_id = ?").get(lessonId) as { id: string } | undefined;
  if (!quiz) return null;
  return (
    (db.prepare("SELECT score, total, created_at FROM quiz_attempts WHERE quiz_id = ? AND user_id = ? ORDER BY created_at DESC LIMIT 1")
      .get(quiz.id, user.id) as { score: number; total: number; created_at: string } | undefined) ?? null
  );
}

/* ---------- assignments ---------- */

export type AssignmentState = { ok: boolean; error?: string } | null;

export async function submitAssignment(_prev: AssignmentState, formData: FormData): Promise<AssignmentState> {
  const user = await requireUser();
  const lessonId = String(formData.get("lessonId") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  const asg = db.prepare("SELECT * FROM assignments WHERE lesson_id = ?").get(lessonId) as
    | { id: string; title: string } | undefined;
  if (!asg) return { ok: false, error: "Assignment not found" };
  if (notes.length < 20) return { ok: false, error: "Please describe your submission in at least 20 characters." };

  const course = courseOfLesson(lessonId);
  if (!course || !isEnrolledIn(user.id, course.course_id)) return { ok: false, error: "You are not enrolled in this course" };

  db.prepare(
    `INSERT INTO assignment_submissions (id, assignment_id, user_id, notes, submitted_at)
     VALUES (?,?,?,?,?)
     ON CONFLICT(assignment_id, user_id) DO UPDATE SET notes = ?, submitted_at = ?`
  ).run(newId("sub"), asg.id, user.id, notes, new Date().toISOString(), notes, new Date().toISOString());

  await toggleLessonComplete(lessonId, true);
  revalidatePath("/dashboard/assignments");
  return { ok: true };
}
