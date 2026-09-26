"use server";

import { revalidatePath } from "next/cache";
import { store } from "@/lib/store";
import {
  assignmentForLesson, certificateExists, countLessonCompletion, createCertificate,
  findEnrollment, getLessonWithCourse, insertQuizAttempt, quizForLesson,
  quizQuestionsWithGrading, setLessonCompleted, touchLesson, upsertSubmission,
} from "@/lib/queries";
import { requireUser } from "@/lib/session";

function isEnrolledIn(userId: string, courseId: string): boolean {
  return !!findEnrollment(userId, courseId);
}

/** Issue a certificate when every lesson of the course is complete. */
function maybeIssueCertificate(userId: string, courseId: string) {
  if (certificateExists(userId, courseId)) return;
  const { total, done } = countLessonCompletion(userId, courseId);
  if (total > 0 && done >= total) createCertificate(userId, courseId);
}

export type CompleteState = { ok: boolean; error?: string; percent?: number } | null;

export async function toggleLessonComplete(lessonId: string, complete: boolean): Promise<CompleteState> {
  const user = await requireUser();
  const lesson = getLessonWithCourse(lessonId);
  if (!lesson) return { ok: false, error: "Lesson not found" };
  if (!isEnrolledIn(user.id, lesson.course_id)) return { ok: false, error: "You are not enrolled in this course" };

  setLessonCompleted(user.id, lesson.course_id, lessonId, complete);
  maybeIssueCertificate(user.id, lesson.course_id);

  const { total, done } = countLessonCompletion(user.id, lesson.course_id);
  revalidatePath(`/learn/${lesson.course_slug}`);
  revalidatePath("/dashboard");
  return { ok: true, percent: total ? Math.round((done / total) * 100) : 0 };
}

export async function pingLessonView(lessonId: string): Promise<void> {
  const user = await requireUser();
  const lesson = getLessonWithCourse(lessonId);
  if (!lesson || !isEnrolledIn(user.id, lesson.course_id)) return;
  touchLesson(user.id, lesson.course_id, lessonId);
}

/* ---------- quizzes ---------- */

export type QuizResult =
  | { ok: true; passed: boolean; score: number; total: number; results: { correct: boolean; correctIndex: number; explanation: string }[] }
  | { ok: false; error: string }
  | null;

export async function submitQuiz(lessonId: string, answers: number[]): Promise<QuizResult> {
  const user = await requireUser();
  const lesson = getLessonWithCourse(lessonId);
  if (!lesson) return { ok: false, error: "Lesson not found" };
  if (!isEnrolledIn(user.id, lesson.course_id)) return { ok: false, error: "You are not enrolled in this course" };

  const quiz = quizForLesson(lessonId);
  if (!quiz) return { ok: false, error: "No quiz attached to this lesson" };

  // Grading happens here, server-side — correct answers are never shipped to the client.
  const questions = quizQuestionsWithGrading(quiz.id);
  const results = questions.map((q, i) => {
    const chosen = answers[i] ?? -1;
    return { correct: chosen === q.correctIndex, correctIndex: q.correctIndex, explanation: q.explanation };
  });

  const score = results.filter((r) => r.correct).length;
  const total = questions.length;
  const passed = total > 0 && (score / total) * 100 >= quiz.pass_score;

  insertQuizAttempt(quiz.id, user.id, score, total);
  if (passed) {
    setLessonCompleted(user.id, lesson.course_id, lessonId, true);
    maybeIssueCertificate(user.id, lesson.course_id);
  }
  revalidatePath(`/learn/${lesson.course_slug}`);
  return { ok: true, passed, score, total, results };
}

export async function latestAttempt(lessonId: string) {
  const user = await requireUser();
  const quiz = quizForLesson(lessonId);
  if (!quiz) return null;
  return latestAttemptForUser(quiz.id, user.id);
}

function latestAttemptForUser(quizId: string, userId: string) {
  return store.quizAttempts
    .filter((a) => a.quiz_id === quizId && a.user_id === userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0] ?? null;
}

/* ---------- assignments ---------- */

export type AssignmentState = { ok: boolean; error?: string } | null;

export async function submitAssignment(_prev: AssignmentState, formData: FormData): Promise<AssignmentState> {
  const user = await requireUser();
  const lessonId = String(formData.get("lessonId") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();

  const asg = assignmentForLesson(lessonId);
  if (!asg) return { ok: false, error: "Assignment not found" };
  if (notes.length < 20) return { ok: false, error: "Please describe your submission in at least 20 characters." };

  const lesson = getLessonWithCourse(lessonId);
  if (!lesson || !isEnrolledIn(user.id, lesson.course_id)) return { ok: false, error: "You are not enrolled in this course" };

  upsertSubmission(asg.id, user.id, notes);
  setLessonCompleted(user.id, lesson.course_id, lessonId, true);
  maybeIssueCertificate(user.id, lesson.course_id);
  revalidatePath("/dashboard/assignments");
  return { ok: true };
}
