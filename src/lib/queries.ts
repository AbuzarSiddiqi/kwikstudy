import { store, parseJson, newId } from "@/lib/store";
import type { CourseRow, LessonRow } from "@/lib/store";

/* ---------- shared view types ---------- */

export type CourseCard = CourseRow & { category_name: string; category_slug: string; instructor_name: string };

const categoryName = (id: string) => store.categories.find((c) => c.id === id)?.name ?? "";
const categorySlug = (id: string) => store.categories.find((c) => c.id === id)?.slug ?? "";
export function instructorNameFor(courseId: string): string {
  const links = store.courseInstructors.filter((ci) => ci.course_id === courseId);
  const lead = links.find((l) => l.role === "Lead Instructor") ?? links[0];
  return store.instructors.find((i) => i.id === lead?.instructor_id)?.name ?? "";
}
const withCardMeta = (c: CourseRow): CourseCard => ({
  ...c,
  category_name: categoryName(c.category_id),
  category_slug: categorySlug(c.category_id),
  instructor_name: instructorNameFor(c.id),
});

const lessonsOfCourse = (courseId: string) =>
  store.lessons
    .filter((l) => store.modules.find((m) => m.id === l.module_id)?.course_id === courseId)
    .sort((a, b) => {
      const ma = store.modules.find((m) => m.id === a.module_id)!.idx;
      const mb = store.modules.find((m) => m.id === b.module_id)!.idx;
      return ma - mb || a.idx - b.idx;
    });

/* ---------- catalog ---------- */

export function getPublishedCourses(): CourseCard[] {
  return store.courses.filter((c) => c.status === "published").sort((a, b) => a.created_at.localeCompare(b.created_at)).map(withCardMeta);
}

export function getCourseBySlug(slug: string): CourseCard | null {
  const c = store.courses.find((x) => x.slug === slug);
  return c ? withCardMeta(c) : null;
}

export function searchCourses(q: string, category?: string): CourseCard[] {
  const needle = q.trim().toLowerCase();
  return store.courses
    .filter((c) => c.status === "published")
    .filter((c) => {
      if (category && category !== "all" && categorySlug(c.category_id) !== category) return false;
      if (!needle) return true;
      const hay = [c.title, c.subtitle, c.description, categoryName(c.category_id), c.cover_code].join(" ").toLowerCase();
      return hay.includes(needle);
    })
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map(withCardMeta);
}

export function getCategories() {
  return store.categories;
}

/* ---------- curriculum ---------- */

export type CurriculumModule = { id: string; course_id: string; idx: number; title: string; summary: string; lessons: LessonRow[] };

export function getCurriculum(courseId: string): CurriculumModule[] {
  const mods = store.modules.filter((m) => m.course_id === courseId).sort((a, b) => a.idx - b.idx);
  return mods.map((m) => ({ ...m, lessons: store.lessons.filter((l) => l.module_id === m.id).sort((a, b) => a.idx - b.idx) }));
}

export function getCourseStats(courseId: string) {
  const lessons = lessonsOfCourse(courseId);
  return {
    lesson_count: lessons.length,
    total_min: lessons.reduce((s, l) => s + l.duration_min, 0),
    free_count: lessons.reduce((s, l) => s + l.is_free_preview, 0),
    module_count: store.modules.filter((m) => m.course_id === courseId).length,
  };
}

export function getLessonWithCourse(lessonId: string) {
  const lesson = store.lessons.find((l) => l.id === lessonId);
  const mod = lesson && store.modules.find((m) => m.id === lesson.module_id);
  const course = mod && store.courses.find((c) => c.id === mod.course_id);
  if (!lesson || !mod || !course) return undefined;
  return {
    ...lesson,
    course_id: course.id,
    module_idx: mod.idx,
    module_title: mod.title,
    course_slug: course.slug,
    course_title: course.title,
  };
}

export function instructorNameForCourse(courseId: string) {
  return instructorNameFor(courseId);
}

/* ---------- instructors ---------- */

export type Instructor = {
  id: string; slug: string; name: string; role: string; bio: string;
  expertise: string; experience_years: number; teaching_approach: string;
};

export function getInstructors() {
  return store.instructors
    .map((i) => ({ ...i, course_count: store.courseInstructors.filter((ci) => ci.instructor_id === i.id).length }))
    .sort((a, b) => b.experience_years - a.experience_years);
}

export function getInstructorBySlug(slug: string) {
  const ins = store.instructors.find((i) => i.slug === slug);
  if (!ins) return null;
  const courses = store.courseInstructors
    .filter((ci) => ci.instructor_id === ins.id)
    .map((ci) => {
      const c = store.courses.find((x) => x.id === ci.course_id)!;
      return { ...withCardMeta(c), ci_role: ci.role };
    })
    .sort((a, b) => b.price - a.price);
  return { ...ins, expertiseList: parseJson<string[]>(ins.expertise, []), courses };
}

/* ---------- programs ---------- */

export function getPrograms() {
  return store.programs
    .filter((p) => p.status === "published")
    .sort((a, b) => b.price - a.price)
    .map((p) => {
      const links = store.programCourses.filter((pc) => pc.program_id === p.id).sort((a, b) => a.idx - b.idx);
      return {
        ...p,
        course_titles: links.map((l) => store.courses.find((c) => c.id === l.course_id)?.title ?? "").join(" · "),
        course_count: links.length,
      };
    });
}

export type ProgramRow = {
  id: string; slug: string; title: string; subtitle: string; description: string; level: string;
  duration_months: number; price: number; original_price: number | null; cover_variant: string; cover_code: string;
  outcomes: string; projects: string; faqs: string; course_titles: string; course_count: number;
};

export function getProgramBySlug(slug: string) {
  const program = store.programs.find((p) => p.slug === slug && p.status === "published");
  if (!program) return null;
  const courses = store.programCourses
    .filter((pc) => pc.program_id === program.id)
    .sort((a, b) => a.idx - b.idx)
    .map((pc) => ({ ...withCardMeta(store.courses.find((c) => c.id === pc.course_id)!), note: pc.note }));
  return { ...program, courses };
}

/* ---------- users ---------- */

export function getUserByEmail(email: string) {
  return store.users.find((u) => u.email === email.toLowerCase());
}
export function getUserById(id: string) {
  return store.users.find((u) => u.id === id);
}
export function createUser(input: { email: string; passwordHash: string; name: string; phone: string | null }) {
  const user = {
    id: newId("usr"),
    email: input.email.toLowerCase(),
    password_hash: input.passwordHash,
    name: input.name,
    role: "student" as const,
    phone: input.phone,
    created_at: new Date().toISOString(),
  };
  store.users.push(user);
  return user;
}
export function updateUserProfile(userId: string, name: string, phone: string | null) {
  const u = getUserById(userId);
  if (u) { u.name = name; u.phone = phone; }
}
export function updateUserPassword(userId: string, hash: string) {
  const u = getUserById(userId);
  if (u) u.password_hash = hash;
}
export function countUserEnrollments(userId: string) {
  return store.enrollments.filter((e) => e.user_id === userId).length;
}
export function countUserCertificates(userId: string) {
  return store.certificates.filter((c) => c.user_id === userId).length;
}

/* ---------- enrollment & progress ---------- */

export function isEnrolled(userId: string, courseId: string): boolean {
  return store.enrollments.some((e) => e.user_id === userId && e.course_id === courseId);
}

export function findEnrollment(userId: string, courseId: string) {
  return store.enrollments.find((e) => e.user_id === userId && e.course_id === courseId);
}

export function createEnrollment(userId: string, courseId: string, orderId: string) {
  if (findEnrollment(userId, courseId)) return;
  store.enrollments.push({
    id: newId("enr"), user_id: userId, course_id: courseId,
    enrolled_at: new Date().toISOString(), status: "active", order_id: orderId,
  });
}

export type CourseProgress = {
  completed: number; total: number; percent: number;
  currentLessonId: string | null; lastCompletedAt: string | null;
};

export function getCourseProgress(userId: string, courseId: string): CourseProgress {
  const lessons = lessonsOfCourse(courseId);
  const rows = lessons.map((l) => store.lessonProgress.find((p) => p.user_id === userId && p.lesson_id === l.id) ?? null);
  const completedRows = rows.filter((r) => r?.status === "completed");
  const current = lessons[rows.findIndex((r) => r?.status !== "completed")] ?? null;
  const last = completedRows.at(-1) ?? null;
  return {
    completed: completedRows.length,
    total: lessons.length,
    percent: lessons.length ? Math.round((completedRows.length / lessons.length) * 100) : 0,
    currentLessonId: current?.id ?? null,
    lastCompletedAt: last?.completed_at ?? null,
  };
}

export function getCompletedLessonIds(userId: string, courseId: string): Set<string> {
  return new Set(store.lessonProgress.filter((p) => p.user_id === userId && p.course_id === courseId && p.status === "completed").map((p) => p.lesson_id));
}

export function setLessonCompleted(userId: string, courseId: string, lessonId: string, complete: boolean) {
  const row = store.lessonProgress.find((p) => p.user_id === userId && p.lesson_id === lessonId);
  const now = new Date().toISOString();
  if (complete) {
    if (row) { row.status = "completed"; row.completed_at = now; row.last_viewed_at = now; }
    else store.lessonProgress.push({ id: newId("lp"), user_id: userId, course_id: courseId, lesson_id: lessonId, status: "completed", completed_at: now, last_viewed_at: now });
  } else if (row) {
    store.lessonProgress.splice(store.lessonProgress.indexOf(row), 1);
  }
}

export function touchLesson(userId: string, courseId: string, lessonId: string) {
  const row = store.lessonProgress.find((p) => p.user_id === userId && p.lesson_id === lessonId);
  const now = new Date().toISOString();
  if (row) row.last_viewed_at = now;
  else store.lessonProgress.push({ id: newId("lp"), user_id: userId, course_id: courseId, lesson_id: lessonId, status: "in_progress", completed_at: null, last_viewed_at: now });
}

export function countLessonCompletion(userId: string, courseId: string) {
  const total = lessonsOfCourse(courseId).length;
  const done = store.lessonProgress.filter((p) => p.user_id === userId && p.course_id === courseId && p.status === "completed").length;
  return { total, done };
}

export function getEnrolledCourses(userId: string) {
  return store.enrollments
    .filter((e) => e.user_id === userId)
    .sort((a, b) => b.enrolled_at.localeCompare(a.enrolled_at))
    .map((e) => {
      const c = store.courses.find((x) => x.id === e.course_id)!;
      return { ...withCardMeta(c), enrolled_at: e.enrolled_at, enroll_status: e.status };
    });
}

export function getLearningActivity(userId: string, days = 28) {
  const since = Date.now() - days * 86400_000;
  const byDay = new Map<string, number>();
  for (const p of store.lessonProgress) {
    if (p.user_id !== userId || p.status !== "completed" || !p.completed_at) continue;
    const t = new Date(p.completed_at).getTime();
    if (t < since) continue;
    const day = p.completed_at.slice(0, 10);
    byDay.set(day, (byDay.get(day) ?? 0) + 1);
  }
  const daysArr: { date: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10);
    daysArr.push({ date, count: byDay.get(date) ?? 0 });
  }
  let streak = 0;
  for (let i = daysArr.length - 1; i >= 0; i--) {
    if (daysArr[i].count > 0) streak++;
    else if (i === daysArr.length - 1) continue; // today with no activity yet doesn't break
    else break;
  }
  return { days: daysArr, streak };
}

/* ---------- certificates ---------- */

export function certificateExists(userId: string, courseId: string) {
  return store.certificates.some((c) => c.user_id === userId && c.course_id === courseId);
}

export function createCertificate(userId: string, courseId: string) {
  const id = `CERT-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  store.certificates.push({ id, user_id: userId, course_id: courseId, issued_at: new Date().toISOString(), status: "valid" });
  const e = findEnrollment(userId, courseId);
  if (e) e.status = "completed";
  return id;
}

export function getCertificate(certId: string) {
  const cert = store.certificates.find((c) => c.id === certId.toUpperCase());
  if (!cert) return undefined;
  const user = store.users.find((u) => u.id === cert.user_id)!;
  const course = store.courses.find((c) => c.id === cert.course_id)!;
  return {
    ...cert,
    student_name: user.name,
    student_email: user.email,
    course_title: course.title,
    course_slug: course.slug,
    category_name: categoryName(course.category_id),
    cover_code: course.cover_code,
    cover_variant: course.cover_variant,
  };
}

export function getUserCertificates(userId: string) {
  return store.certificates
    .filter((c) => c.user_id === userId)
    .sort((a, b) => b.issued_at.localeCompare(a.issued_at))
    .map((c) => ({
      id: c.id, issued_at: c.issued_at, status: c.status,
      course_title: store.courses.find((x) => x.id === c.course_id)?.title ?? "",
      course_slug: store.courses.find((x) => x.id === c.course_id)?.slug ?? "",
    }));
}

/* ---------- quizzes ---------- */

export function quizForLesson(lessonId: string) {
  return store.quizzes.find((q) => q.lesson_id === lessonId);
}

export function quizQuestionsWithGrading(quizId: string) {
  return store.quizQuestions
    .filter((q) => q.quiz_id === quizId)
    .sort((a, b) => a.idx - b.idx)
    .map((q) => ({
      id: q.id,
      question: q.question,
      explanation: q.explanation,
      options: store.quizOptions.filter((o) => o.question_id === q.id).sort((a, b) => a.idx - b.idx).map((o) => o.text),
      correctIndex: store.quizOptions.find((o) => o.question_id === q.id && o.is_correct === 1)?.idx ?? 0,
    }));
}

export function insertQuizAttempt(quizId: string, userId: string, score: number, total: number) {
  store.quizAttempts.push({ id: newId("qa"), quiz_id: quizId, user_id: userId, score, total, created_at: new Date().toISOString() });
}

export function latestAttemptFor(quizId: string, userId: string) {
  return store.quizAttempts
    .filter((a) => a.quiz_id === quizId && a.user_id === userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0] ?? null;
}

/* ---------- assignments ---------- */

export function assignmentForLesson(lessonId: string) {
  return store.assignments.find((a) => a.lesson_id === lessonId);
}

export function submissionFor(assignmentId: string, userId: string) {
  return store.assignmentSubmissions.find((s) => s.assignment_id === assignmentId && s.user_id === userId);
}

export function upsertSubmission(assignmentId: string, userId: string, notes: string) {
  const now = new Date().toISOString();
  const existing = submissionFor(assignmentId, userId);
  if (existing) { existing.notes = notes; existing.submitted_at = now; }
  else store.assignmentSubmissions.push({ id: newId("sub"), assignment_id: assignmentId, user_id: userId, notes, submitted_at: now });
}

export function resourcesForLesson(lessonId: string) {
  return store.lessonResources.filter((r) => r.lesson_id === lessonId);
}

/* ---------- orders & payments (checkout) ---------- */

export function courseBySlugPublished(slug: string) {
  return store.courses.find((c) => c.slug === slug && c.status === "published");
}

export function validCoupon(code: string) {
  return store.coupons.find((c) => c.code === code && c.active === 1);
}

export function createOrder(input: { userId: string; courseId: string; amount: number; discount: number; total: number; couponCode: string | null; provider: string }) {
  const order = {
    id: newId("ord"),
    user_id: input.userId,
    course_id: input.courseId,
    amount: input.amount,
    discount: input.discount,
    total: input.total,
    coupon_code: input.couponCode,
    status: "created" as const,
    provider: input.provider,
    provider_order_id: null,
    created_at: new Date().toISOString(),
  };
  store.orders.push(order);
  return order;
}

export function setOrderProviderRef(orderId: string, ref: string) {
  const o = store.orders.find((x) => x.id === orderId);
  if (o) o.provider_order_id = ref;
}

export function setOrderStatus(orderId: string, status: "paid" | "failed") {
  const o = store.orders.find((x) => x.id === orderId);
  if (o) o.status = status;
}

export function createPayment(orderId: string, providerPaymentId: string, method: string, amount: number) {
  store.payments.push({
    id: newId("pay"), order_id: orderId, provider_payment_id: providerPaymentId,
    method, amount, status: "captured", paid_at: new Date().toISOString(),
  });
}

/* ---------- enquiries ---------- */

export function courseIsPublished(courseId: string) {
  return store.courses.some((c) => c.id === courseId && c.status === "published");
}

export function insertEnquiry(input: Omit<import("@/lib/store").EnquiryRow, "id" | "status" | "created_at">) {
  store.enquiries.push({ ...input, id: newId("enq"), status: "new", created_at: new Date().toISOString() });
}

export function listEnquiries(status?: string) {
  const rows = [...store.enquiries].sort((a, b) => b.created_at.localeCompare(a.created_at));
  return status ? rows.filter((e) => e.status === status) : rows;
}

export function enquiryStatusCounts() {
  return {
    new: store.enquiries.filter((e) => e.status === "new").length,
    contacted: store.enquiries.filter((e) => e.status === "contacted").length,
    closed: store.enquiries.filter((e) => e.status === "closed").length,
  };
}

export function setEnquiryStatus(id: string, status: "new" | "contacted" | "closed") {
  const e = store.enquiries.find((x) => x.id === id);
  if (e) e.status = status;
}

export function courseTitleMap() {
  return new Map(store.courses.map((c) => [c.id, c.title]));
}

/* ---------- admin views ---------- */

export function adminStats() {
  const revenue = store.payments.filter((p) => p.status === "captured").reduce((s, p) => s + p.amount, 0);
  return {
    publishedCourses: store.courses.filter((c) => c.status === "published").length,
    students: store.users.filter((u) => u.role === "student").length,
    activeEnrollments: store.enrollments.filter((e) => e.status === "active").length,
    revenue,
  };
}

export function paymentsWithJoins() {
  return store.payments
    .filter((p) => p.status === "captured")
    .sort((a, b) => (b.paid_at ?? "").localeCompare(a.paid_at ?? ""))
    .map((p) => {
      const order = store.orders.find((o) => o.id === p.order_id)!;
      const user = store.users.find((u) => u.id === order.user_id)!;
      const course = store.courses.find((c) => c.id === order.course_id)!;
      return {
        id: p.id, order_id: order.id, coupon_code: order.coupon_code,
        student: user.name, email: user.email, course: course.title,
        amount: p.amount, method: p.method, status: p.status, paid_at: p.paid_at,
      };
    });
}

export function studentRows() {
  return store.users
    .filter((u) => u.role === "student")
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((u) => ({
      id: u.id, name: u.name, email: u.email, phone: u.phone, created_at: u.created_at,
      enrollments: store.enrollments.filter((e) => e.user_id === u.id).length,
      certificates: store.certificates.filter((c) => c.user_id === u.id).length,
      spent: store.orders.filter((o) => o.user_id === u.id && o.status === "paid").reduce((s, o) => s + o.total, 0),
    }));
}

export function coursesWithStats() {
  return store.courses
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((c) => ({
      ...withCardMeta(c),
      enrollments: store.enrollments.filter((e) => e.course_id === c.id).length,
      moduleCount: store.modules.filter((m) => m.course_id === c.id).length,
      lessonCount: lessonsOfCourse(c.id).length,
    }));
}

export function enrollmentCountsByCourse() {
  return store.courses
    .map((c) => ({ title: c.title, enrollments: store.enrollments.filter((e) => e.course_id === c.id).length }))
    .sort((a, b) => b.enrollments - a.enrollments);
}

/* ---------- dashboard reads ---------- */

export function assignmentsForUser(userId: string) {
  const enrolledCourseIds = new Set(store.enrollments.filter((e) => e.user_id === userId).map((e) => e.course_id));
  return store.assignments
    .filter((a) => enrolledCourseIds.has(a.course_id))
    .map((a) => {
      const course = store.courses.find((c) => c.id === a.course_id)!;
      const lesson = store.lessons.find((l) => l.id === a.lesson_id)!;
      const submission = submissionFor(a.id, userId);
      const progress = store.lessonProgress.find((p) => p.user_id === userId && p.lesson_id === a.lesson_id);
      return {
        id: a.id, title: a.title, brief: a.brief, max_score: a.max_score,
        course_title: course.title, course_slug: course.slug, lesson_id: a.lesson_id,
        lesson_title: lesson.title,
        submitted_at: submission?.submitted_at ?? null,
        lesson_status: progress?.status ?? null,
      };
    })
    .sort((a, b) => (a.submitted_at ? 1 : 0) - (b.submitted_at ? 1 : 0) || (b.submitted_at ?? "").localeCompare(a.submitted_at ?? ""));
}

export function pendingAssignmentsForUser(userId: string, limit = 3) {
  const submittedIds = new Set(store.assignmentSubmissions.filter((s) => s.user_id === userId).map((s) => s.assignment_id));
  const activeCourseIds = new Set(store.enrollments.filter((e) => e.user_id === userId && e.status === "active").map((e) => e.course_id));
  return store.assignments
    .filter((a) => activeCourseIds.has(a.course_id) && !submittedIds.has(a.id))
    .slice(0, limit)
    .map((a) => {
      const course = store.courses.find((c) => c.id === a.course_id)!;
      return { id: a.id, title: a.title, brief: a.brief, course_title: course.title, course_slug: course.slug, lesson_id: a.lesson_id };
    });
}
