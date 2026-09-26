/* In-memory data store for the KwikStudy demo.
   All content and demo state lives in plain JavaScript structures that are
   built once per server instance — no database, no filesystem. Writes
   (enrollments, progress, enquiries, orders…) mutate these arrays and last
   until the instance restarts or the app is redeployed, which is exactly the
   right lifetime for a demo. Swap this module for a real database later;
   src/lib/queries.ts is the only read layer above it. */

import { hashPassword, newId } from "@/lib/auth-core";
import { javaCourse } from "@/content/courses/java";
import { webDevCourse, gitCourse } from "@/content/courses/webdev-git";
import { pythonCourse, sqlCourse } from "@/content/courses/python-sql";
import { reactCourse, dsaCourse } from "@/content/courses/react-dsa";
import type { CourseSeed, LessonSeed } from "@/content/seedkit";

/* ---------- row types (previously the SQLite schema) ---------- */

export type UserRow = {
  id: string; email: string; password_hash: string; name: string;
  role: "student" | "instructor" | "admin"; phone: string | null; created_at: string;
};
export type CategoryRow = { id: string; slug: string; name: string; description: string };
export type InstructorRow = {
  id: string; slug: string; name: string; role: string; bio: string;
  expertise: string; experience_years: number; teaching_approach: string;
};
export type CourseRow = {
  id: string; slug: string; title: string; subtitle: string; description: string;
  category_id: string; level: string; language: string; duration_hours: number;
  price: number; original_price: number | null;
  status: "published" | "draft" | "waitlist";
  cover_variant: string; cover_code: string;
  projects: string; outcomes: string; requirements: string; faqs: string;
  created_at: string;
};
export type CourseInstructorRow = { course_id: string; instructor_id: string; role: string };
export type ProgramRow = {
  id: string; slug: string; title: string; subtitle: string; description: string; level: string;
  duration_months: number; price: number; original_price: number | null;
  status: "published" | "draft"; cover_variant: string; cover_code: string;
  outcomes: string; projects: string; faqs: string; created_at: string;
};
export type ProgramCourseRow = { program_id: string; course_id: string; idx: number; note: string };
export type ModuleRow = { id: string; course_id: string; idx: number; title: string; summary: string };
export type LessonRow = {
  id: string; module_id: string; idx: number; title: string;
  type: "video" | "text" | "quiz" | "assignment";
  duration_min: number; is_free_preview: number; content: string;
};
export type LessonResourceRow = { id: string; lesson_id: string; title: string; kind: string; href: string };
export type QuizRow = { id: string; lesson_id: string; title: string; pass_score: number };
export type QuizQuestionRow = { id: string; quiz_id: string; idx: number; question: string; explanation: string };
export type QuizOptionRow = { id: string; question_id: string; idx: number; text: string; is_correct: number };
export type QuizAttemptRow = { id: string; quiz_id: string; user_id: string; score: number; total: number; created_at: string };
export type AssignmentRow = { id: string; lesson_id: string; course_id: string; title: string; brief: string; max_score: number };
export type AssignmentSubmissionRow = { id: string; assignment_id: string; user_id: string; notes: string; submitted_at: string };
export type EnrollmentRow = { id: string; user_id: string; course_id: string; enrolled_at: string; status: "active" | "completed"; order_id: string | null };
export type ProgressRow = {
  id: string; user_id: string; course_id: string; lesson_id: string;
  status: "in_progress" | "completed"; completed_at: string | null; last_viewed_at: string | null;
};
export type CouponRow = { code: string; percent_off: number; active: number; description: string };
export type OrderRow = {
  id: string; user_id: string; course_id: string; amount: number; discount: number; total: number;
  coupon_code: string | null; status: "created" | "paid" | "failed";
  provider: string; provider_order_id: string | null; created_at: string;
};
export type PaymentRow = {
  id: string; order_id: string; provider_payment_id: string | null; method: string;
  amount: number; status: "pending" | "captured" | "failed" | "refunded"; paid_at: string | null;
};
export type EnquiryRow = {
  id: string; name: string; email: string; phone: string | null; topic: string;
  course_id: string | null; preferred_contact: string; message: string;
  status: "new" | "contacted" | "closed"; created_at: string;
};
export type CertificateRow = { id: string; user_id: string; course_id: string; issued_at: string; status: "valid" | "revoked" };

export function parseJson<T>(s: string | null | undefined, fallback: T): T {
  if (!s) return fallback;
  try { return JSON.parse(s) as T; } catch { return fallback; }
}

/* ---------- demo clock ---------- */
const NOW = Date.now();
const d = (daysAgo: number, hoursAgo = 0) =>
  new Date(NOW - daysAgo * 86400_000 - hoursAgo * 3600_000).toISOString();

/* ---------- institute content ---------- */

const CATEGORIES: CategoryRow[] = [
  { id: "cat_prog", slug: "programming", name: "Programming", description: "Core language skills — Java, Python, Git and the craft of writing clean code." },
  { id: "cat_web", slug: "web-development", name: "Web Development", description: "HTML, CSS, JavaScript and React — build for the browser." },
  { id: "cat_dsa", slug: "data-structures", name: "Data Structures", description: "Algorithms, problem patterns and interview preparation." },
  { id: "cat_db", slug: "databases", name: "Databases", description: "SQL, relational modelling and working with real data." },
  { id: "cat_aiml", slug: "ai-ml", name: "AI & ML", description: "Python-driven machine learning — courses launching soon." },
  { id: "cat_cloud", slug: "cloud", name: "Cloud", description: "Cloud fundamentals and deployment — courses launching soon." },
  { id: "cat_interview", slug: "interview-preparation", name: "Interview Preparation", description: "Structured practice for technical interviews." },
];

const INSTRUCTORS: InstructorRow[] = [
  {
    id: "ins_arjun", slug: "arjun-mehta", name: "Arjun Mehta",
    role: "Senior Instructor · Java & Backend",
    bio: "Arjun spent eleven years building enterprise backend systems — payment platforms serving millions of daily transactions among them — before moving to teaching full-time. He has taught Java to more than two thousand working professionals and students, and is known for explaining the 'why' behind every line of code. At KwikStudy he leads the Java curriculum and mentors capstone projects.",
    expertise: JSON.stringify(["Java", "Spring Boot", "System Design Basics", "Mentoring"]),
    experience_years: 11,
    teaching_approach: "Arjun teaches by building. Every concept appears first in a small working program, then in the edge cases where it breaks — because that's where understanding actually forms. He reviews every capstone submission personally.",
  },
  {
    id: "ins_priya", slug: "priya-raghavan", name: "Priya Raghavan",
    role: "Instructor · Python & Data",
    bio: "Priya worked as a data engineer for eight years, building pipelines that moved millions of records a day, before she discovered that her favourite part of the job was teaching new teammates. She now designs KwikStudy's Python and SQL curricula, with a focus on making beginners comfortable fast and correct faster.",
    expertise: JSON.stringify(["Python", "SQL", "Data Engineering", "Automation"]),
    experience_years: 8,
    teaching_approach: "Priya's lessons are short, and every one ends with something running on your machine. She believes confidence comes from small working programs, and correctness comes from reading errors carefully — a skill she drills deliberately.",
  },
  {
    id: "ins_rahul", slug: "rahul-verma", name: "Rahul Verma",
    role: "Lead Instructor · Web & Frontend",
    bio: "Rahul has built web interfaces for nine years — from early jQuery dashboards to design systems used by dozens of teams. As a freelancer-turned-instructor he brings a practitioner's eye for what actually ships: accessibility, performance and interfaces that hold up under real users. He leads the Web Development and React courses.",
    expertise: JSON.stringify(["JavaScript", "React", "CSS Architecture", "Accessibility"]),
    experience_years: 9,
    teaching_approach: "Rahul teaches layout before syntax and design sense alongside code. His students learn to question every pixel ('why is this centred?') — the habit that separates developers who build pages from developers who build products.",
  },
  {
    id: "ins_sana", slug: "sana-iqbal", name: "Sana Iqbal",
    role: "Instructor · Algorithms & Interview Prep",
    bio: "Sana is a competitive programmer with seven years of problem-setting and coaching experience, including three years running a university programming club that produced multiple national finalists. She teaches KwikStudy's DSA track, where her problem sets are known for being genuinely hard — and for the hints that make them possible.",
    expertise: JSON.stringify(["Data Structures", "Algorithms", "Competitive Programming", "Interview Coaching"]),
    experience_years: 7,
    teaching_approach: "Sana teaches patterns, not problems. Every problem in her sets maps back to a named idea — two pointers, monotonic stacks, the DP table — and she insists students can name the pattern before they code it. Her mock interviews are feared and requested in equal measure.",
  },
];

const USERS: UserRow[] = [
  { id: "usr_admin", email: "admin@kwikstudy.in", password_hash: hashPassword("Admin@123"), name: "Ravi Deshmukh", role: "admin", phone: "+91 98860 11223", created_at: d(300) },
  { id: "usr_aarav", email: "student@kwikstudy.in", password_hash: hashPassword("Student@123"), name: "Aarav Sharma", role: "student", phone: "+91 98450 33221", created_at: d(60) },
  { id: "usr_ishaan", email: "ishaan.g@example.com", password_hash: hashPassword("Student@123"), name: "Ishaan Gupta", role: "student", phone: "+91 99001 45532", created_at: d(20) },
];

const PROGRAMS: ProgramRow[] = [
  {
    id: "prg_fullstack", slug: "full-stack-developer-program",
    title: "Full Stack Developer Program",
    subtitle: "Frontend, backend and everything between — one coherent path from first webpage to deployed application.",
    description:
      "The most complete path KwikStudy offers. You build the web foundation (HTML, CSS, JavaScript), learn React for modern interfaces, add Git for collaboration, and finish by building and deploying a full-stack project. Designed for students who want breadth with depth — every module assumes and reinforces the previous one.",
    level: "Beginner → Intermediate", duration_months: 6,
    price: 8999, original_price: 11997, status: "published",
    cover_variant: "blocks", cover_code: "KS-FSP-01",
    outcomes: JSON.stringify([
      "Build responsive, accessible web pages from scratch",
      "Develop interactive applications with React",
      "Collaborate professionally with Git and GitHub",
      "Ship a complete, deployed full-stack portfolio project",
    ]),
    projects: JSON.stringify(["Personal portfolio site", "React dashboard application", "Full-stack capstone with deployment"]),
    faqs: JSON.stringify([
      { q: "Is the program self-paced?", a: "Yes. The recommended schedule is 6 months at 8–10 hours per week, but your access does not expire and you can move faster or slower." },
      { q: "Do I get a certificate for the program?", a: "Yes — a program certificate is issued when all component courses are completed, alongside each course's individual certificate." },
    ]),
    created_at: d(120),
  },
  {
    id: "prg_javatrack", slug: "java-development-track",
    title: "Java Development Track",
    subtitle: "Java language, SQL and version control — the classic backend foundation done properly.",
    description:
      "A focused track for aspiring backend developers. Master core Java through OOP, collections and the capstone project; learn to model and query relational data with SQL; and adopt the Git workflow used by professional teams. Ends with a portfolio of two substantial Java projects.",
    level: "Beginner → Intermediate", duration_months: 5,
    price: 6499, original_price: 7797, status: "published",
    cover_variant: "grid", cover_code: "KS-JDT-02",
    outcomes: JSON.stringify([
      "Write object-oriented Java with collections and exceptions",
      "Design and query relational databases with SQL",
      "Use Git for disciplined, reviewable development",
      "Complete a Java console capstone and an SQL reporting pack",
    ]),
    projects: JSON.stringify(["Library Management System (Java)", "Academy Reporting Pack (SQL)"]),
    faqs: JSON.stringify([
      { q: "I know basic Java already. Should I start from Module 1?", a: "Take the Module 2 checkpoint quiz early — if you clear it comfortably, skim Module 1 and start properly at Module 3. Your progress tracking adapts to whatever you complete." },
      { q: "Does this track cover Spring Boot?", a: "Not yet. This track builds the Java and SQL foundation Spring assumes; a Spring-focused course is planned as a follow-on." },
    ]),
    created_at: d(120),
  },
  {
    id: "prg_dsa", slug: "dsa-interview-preparation",
    title: "DSA & Interview Preparation",
    subtitle: "Algorithms, patterns and a repeatable practice system for technical interviews.",
    description:
      "Built around how interviews actually evaluate you: pattern recognition, complexity reasoning and calm problem-solving under time pressure. The DSA course gives you the canon and the habit; Git rounds out the professional toolkit. Weekly problem sets, mock contests and a personal problem journal carry your preparation beyond the course.",
    level: "Intermediate", duration_months: 4,
    price: 4499, original_price: 4798, status: "published",
    cover_variant: "dots", cover_code: "KS-DIP-03",
    outcomes: JSON.stringify([
      "Recognise and apply the core interview patterns",
      "Reason about time and space complexity confidently",
      "Solve tree, graph and DP problems methodically",
      "Run a self-sustaining weekly practice system",
    ]),
    projects: JSON.stringify(["50-problem journal", "Three timed mock contests with post-mortems"]),
    faqs: JSON.stringify([
      { q: "Which language is used?", a: "C++, taught from zero in Module 1. The patterns transfer directly to Java or Python if that's your interview language." },
      { q: "How much weekly time does this need?", a: "Plan for 8 hours: roughly 3 hours of lessons and 5 hours of problem sets. The problem sets are the course — protect that time." },
    ]),
    created_at: d(120),
  },
];

const PROGRAM_COURSES: ProgramCourseRow[] = [
  { program_id: "prg_fullstack", course_id: "crs_webdev", idx: 1, note: "Months 1–2 · Foundation" },
  { program_id: "prg_fullstack", course_id: "crs_react", idx: 2, note: "Months 3–4 · Interfaces" },
  { program_id: "prg_fullstack", course_id: "crs_git", idx: 3, note: "Throughout · Collaboration" },
  { program_id: "prg_javatrack", course_id: "crs_java", idx: 1, note: "Months 1–3 · Core language" },
  { program_id: "prg_javatrack", course_id: "crs_sql", idx: 2, note: "Months 3–4 · Data" },
  { program_id: "prg_javatrack", course_id: "crs_git", idx: 3, note: "Throughout · Collaboration" },
  { program_id: "prg_dsa", course_id: "crs_dsa", idx: 1, note: "Months 1–3 · Algorithms" },
  { program_id: "prg_dsa", course_id: "crs_git", idx: 2, note: "Throughout · Toolkit" },
];

const COUPONS: CouponRow[] = [
  { code: "WELCOME10", percent_off: 10, active: 1, description: "10% off your first course" },
  { code: "EARLY20", percent_off: 20, active: 1, description: "Early-access offer — 20% off" },
];

/* ---------- build courses + curriculum from the authoring modules ---------- */

const COURSE_SEEDS: CourseSeed[] = [javaCourse, webDevCourse, gitCourse, pythonCourse, sqlCourse, reactCourse, dsaCourse];
const pad = (n: number, w = 2) => String(n).padStart(w, "0");

const COURSES: CourseRow[] = [];
const COURSE_INSTRUCTORS: CourseInstructorRow[] = [];
const MODULES: ModuleRow[] = [];
const LESSONS: LessonRow[] = [];
const LESSON_RESOURCES: LessonResourceRow[] = [];
const QUIZZES: QuizRow[] = [];
const QUIZ_QUESTIONS: QuizQuestionRow[] = [];
const QUIZ_OPTIONS: QuizOptionRow[] = [];
const ASSIGNMENTS: AssignmentRow[] = [];

const catId = (slug: string) => CATEGORIES.find((c) => c.slug === slug)!.id;

for (const course of COURSE_SEEDS) {
  COURSES.push({
    id: course.id, slug: course.slug, title: course.title, subtitle: course.subtitle,
    description: course.description, category_id: catId(course.category), level: course.level,
    language: course.language ?? "English", duration_hours: course.duration_hours,
    price: course.price, original_price: course.original_price ?? null,
    status: course.status ?? "published", cover_variant: course.cover_variant,
    cover_code: course.cover_code,
    projects: JSON.stringify(course.projects), outcomes: JSON.stringify(course.outcomes),
    requirements: JSON.stringify(course.requirements), faqs: JSON.stringify(course.faqs),
    created_at: d(120),
  });
  for (const ci of course.instructors) {
    const ins = INSTRUCTORS.find((i) => i.slug === ci.slug)!;
    COURSE_INSTRUCTORS.push({ course_id: course.id, instructor_id: ins.id, role: ci.role });
  }
  course.modules.forEach((mod, mi) => {
    const short = course.id.replace("crs_", "");
    MODULES.push({ id: `mod_${short}_${pad(mi + 1)}`, course_id: course.id, idx: mi + 1, title: mod.title, summary: mod.summary ?? "" });
    mod.lessons.forEach((lesson: LessonSeed, li) => {
      const lid = `les_${short}_${pad(mi + 1)}${pad(li + 1)}`;
      const type = lesson.type ?? (lesson.quiz ? "quiz" : lesson.assignment ? "assignment" : "text");
      LESSONS.push({
        id: lid, module_id: `mod_${short}_${pad(mi + 1)}`, idx: li + 1, title: lesson.title,
        type, duration_min: lesson.min ?? 10, is_free_preview: lesson.free ? 1 : 0,
        content: JSON.stringify(lesson.blocks),
      });
      (lesson.resources ?? []).forEach((r, ri) =>
        LESSON_RESOURCES.push({ id: `res_${lid}_${ri}`, lesson_id: lid, title: r.title, kind: r.kind, href: "#" })
      );
      if (lesson.quiz) {
        const qid = `qz_${lid}`;
        QUIZZES.push({ id: qid, lesson_id: lid, title: lesson.title.replace(/^Checkpoint Quiz:? /, "Checkpoint Quiz — "), pass_score: lesson.quiz.pass });
        lesson.quiz.questions.forEach((q, qi) => {
          const qqId = `qq_${lid}_${qi}`;
          QUIZ_QUESTIONS.push({ id: qqId, quiz_id: qid, idx: qi, question: q.q, explanation: q.why });
          q.opts.forEach((opt, oi) =>
            QUIZ_OPTIONS.push({ id: `qo_${qqId}_${oi}`, question_id: qqId, idx: oi, text: opt, is_correct: oi === q.correct ? 1 : 0 })
          );
        });
      }
      if (lesson.assignment) {
        ASSIGNMENTS.push({ id: `asg_${lid}`, lesson_id: lid, course_id: course.id, title: lesson.assignment.title, brief: lesson.assignment.brief, max_score: lesson.assignment.max ?? 100 });
      }
    });
  });
}

/* ---------- demo student state ---------- */

const ENROLLMENTS: EnrollmentRow[] = [];
const LESSON_PROGRESS: ProgressRow[] = [];
const ORDERS: OrderRow[] = [];
const PAYMENTS: PaymentRow[] = [];
const CERTIFICATES: CertificateRow[] = [];
const QUIZ_ATTEMPTS: QuizAttemptRow[] = [];
const ASSIGNMENT_SUBMISSIONS: AssignmentSubmissionRow[] = [];
const ENQUIRIES: EnquiryRow[] = [];

const lessonIdsOf = (courseId: string) =>
  LESSONS.filter((l) => MODULES.find((m) => m.id === l.module_id)?.course_id === courseId)
    .sort((a, b) => {
      const ma = MODULES.find((m) => m.id === a.module_id)!.idx;
      const mb = MODULES.find((m) => m.id === b.module_id)!.idx;
      return ma - mb || a.idx - b.idx;
    })
    .map((l) => l.id);

function completeLessons(userId: string, courseId: string, ids: string[], days: number[]) {
  ids.forEach((id, i) => {
    const at = d(days[i] ?? 30 + i, (i * 3) % 6);
    LESSON_PROGRESS.push({ id: `lp_${userId}_${id}`, user_id: userId, course_id: courseId, lesson_id: id, status: "completed", completed_at: at, last_viewed_at: at });
  });
}

// Aarav — Java: 26 of 38 lessons complete (68%), currently on exception handling
ENROLLMENTS.push({ id: "enr_aarav_java", user_id: "usr_aarav", course_id: "crs_java", enrolled_at: d(32), status: "active", order_id: "ord_seed_1" });
completeLessons("usr_aarav", "crs_java", lessonIdsOf("crs_java").slice(0, 26), [30, 30, 29, 29, 28, 27, 26, 26, 25, 24, 23, 22, 21, 20, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 8]);
LESSON_PROGRESS.push({ id: "lp_usr_aarav_les_java_0603", user_id: "usr_aarav", course_id: "crs_java", lesson_id: "les_java_0603", status: "in_progress", completed_at: null, last_viewed_at: d(0, 3) });
ORDERS.push({ id: "ord_seed_1", user_id: "usr_aarav", course_id: "crs_java", amount: 2999, discount: 0, total: 2999, coupon_code: null, status: "paid", provider: "mock", provider_order_id: "mo_seed_1", created_at: d(32) });
PAYMENTS.push({ id: "pay_seed_1", order_id: "ord_seed_1", provider_payment_id: "pay_seed_1_mock", method: "upi", amount: 2999, status: "captured", paid_at: d(32) });
QUIZ_ATTEMPTS.push({ id: "qa_seed_1", quiz_id: "qz_les_java_0205", user_id: "usr_aarav", score: 4, total: 5, created_at: d(26) });
QUIZ_ATTEMPTS.push({ id: "qa_seed_2", quiz_id: "qz_les_java_0405", user_id: "usr_aarav", score: 5, total: 5, created_at: d(17) });

// Aarav — Git: complete, certified
ENROLLMENTS.push({ id: "enr_aarav_git", user_id: "usr_aarav", course_id: "crs_git", enrolled_at: d(28), status: "completed", order_id: "ord_seed_2" });
completeLessons("usr_aarav", "crs_git", lessonIdsOf("crs_git"), gitDays(lessonIdsOf("crs_git").length));
ORDERS.push({ id: "ord_seed_2", user_id: "usr_aarav", course_id: "crs_git", amount: 799, discount: 80, total: 719, coupon_code: "WELCOME10", status: "paid", provider: "mock", provider_order_id: "mo_seed_2", created_at: d(28) });
PAYMENTS.push({ id: "pay_seed_2", order_id: "ord_seed_2", provider_payment_id: "pay_seed_2_mock", method: "card", amount: 719, status: "captured", paid_at: d(28) });
CERTIFICATES.push({ id: "CERT-2026-0147", user_id: "usr_aarav", course_id: "crs_git", issued_at: d(13), status: "valid" });

// Aarav — Web Dev: just started
ENROLLMENTS.push({ id: "enr_aarav_web", user_id: "usr_aarav", course_id: "crs_webdev", enrolled_at: d(4), status: "active", order_id: "ord_seed_3" });
completeLessons("usr_aarav", "crs_webdev", lessonIdsOf("crs_webdev").slice(0, 3), [3, 2, 1]);
LESSON_PROGRESS.push({ id: "lp_usr_aarav_les_webdev_0104", user_id: "usr_aarav", course_id: "crs_webdev", lesson_id: "les_webdev_0104", status: "in_progress", completed_at: null, last_viewed_at: d(0, 20) });
ORDERS.push({ id: "ord_seed_3", user_id: "usr_aarav", course_id: "crs_webdev", amount: 2199, discount: 440, total: 1759, coupon_code: "EARLY20", status: "paid", provider: "mock", provider_order_id: "mo_seed_3", created_at: d(4) });
PAYMENTS.push({ id: "pay_seed_3", order_id: "ord_seed_3", provider_payment_id: "pay_seed_3_mock", method: "upi", amount: 1759, status: "captured", paid_at: d(4) });

// Ishaan — Python: 4 lessons in
ENROLLMENTS.push({ id: "enr_ishaan_python", user_id: "usr_ishaan", course_id: "crs_python", enrolled_at: d(10), status: "active", order_id: "ord_seed_4" });
completeLessons("usr_ishaan", "crs_python", lessonIdsOf("crs_python").slice(0, 4), [9, 8, 6, 5]);
ORDERS.push({ id: "ord_seed_4", user_id: "usr_ishaan", course_id: "crs_python", amount: 2499, discount: 0, total: 2499, coupon_code: null, status: "paid", provider: "mock", provider_order_id: "mo_seed_4", created_at: d(10) });
PAYMENTS.push({ id: "pay_seed_4", order_id: "ord_seed_4", provider_payment_id: "pay_seed_4_mock", method: "netbanking", amount: 2499, status: "captured", paid_at: d(10) });

function gitDays(n: number) {
  return Array.from({ length: n }, (_, i) => 27 - i * 1.1);
}

// Aarav submitted the exception worksheet
ASSIGNMENT_SUBMISSIONS.push({
  id: "subs_seed_1", assignment_id: "asg_les_java_0605", user_id: "usr_aarav",
  notes: "Implemented all four scenarios. Used a checked exception for InvalidMarksException since callers must handle bad input; kept divide() unchecked for zero as it signals a programming error.",
  submitted_at: d(1, 4),
});

// Enquiry queue for the admin panel
const ENQUIRY_SEED: Omit<EnquiryRow, "created_at">[] = [
  { id: "enq_001", name: "Meera Krishnan", email: "meera.k@example.com", phone: "+91 98861 22001", topic: "Course fees", course_id: "crs_java", preferred_contact: "phone", message: "Hi, I'm a final-year BSc student. Could you share the fee structure for the Java course and whether there is a student discount? Also, are weekend batches available?", status: "new" },
  { id: "enq_002", name: "Karthik Rao", email: "karthik.rao@example.com", phone: "+91 97402 88310", topic: "Corporate training", course_id: null, preferred_contact: "email", message: "We are a 40-person fintech team in Bengaluru looking for a custom Java + SQL refresher for our QA engineers. Could someone from the academic team call to discuss scope and pricing?", status: "contacted" },
  { id: "enq_003", name: "Fatima Sheikh", email: "fatima.s@example.com", phone: null, topic: "Batches", course_id: "crs_python", preferred_contact: "email", message: "When does the next Python batch start, and are the live sessions recorded? I work weekdays till 7pm.", status: "closed" },
];
for (const e of ENQUIRY_SEED) ENQUIRIES.push({ ...e, created_at: d(e.id === "enq_001" ? 1 : e.id === "enq_002" ? 3 : 9, e.id === "enq_001" ? 5 : e.id === "enq_002" ? 2 : 0) });

/* ---------- exported mutable store ---------- */

export const store = {
  users: USERS,
  categories: CATEGORIES,
  instructors: INSTRUCTORS,
  courses: COURSES,
  courseInstructors: COURSE_INSTRUCTORS,
  programs: PROGRAMS,
  programCourses: PROGRAM_COURSES,
  modules: MODULES,
  lessons: LESSONS,
  lessonResources: LESSON_RESOURCES,
  quizzes: QUIZZES,
  quizQuestions: QUIZ_QUESTIONS,
  quizOptions: QUIZ_OPTIONS,
  quizAttempts: QUIZ_ATTEMPTS,
  assignments: ASSIGNMENTS,
  assignmentSubmissions: ASSIGNMENT_SUBMISSIONS,
  enrollments: ENROLLMENTS,
  lessonProgress: LESSON_PROGRESS,
  coupons: COUPONS,
  orders: ORDERS,
  payments: PAYMENTS,
  enquiries: ENQUIRIES,
  certificates: CERTIFICATES,
};

export { newId };
