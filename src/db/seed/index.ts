/* Seed core: deterministic demo content for KwikStudy.
   Runs against any open SQLite handle — used by `npm run db:reset` and by the
   server on first boot when no database exists yet (e.g. serverless deploys). */

import { SCHEMA_SQL } from "@/db/schema";
import { hashPassword } from "@/lib/auth-core";
import type { Db } from "@/lib/db";
import { javaCourse } from "./courses/java";
import { webDevCourse, gitCourse } from "./courses/webdev-git";
import { pythonCourse, sqlCourse } from "./courses/python-sql";
import { reactCourse, dsaCourse } from "./courses/react-dsa";
import type { CourseSeed, LessonSeed } from "./seedkit";

/* ---------- helpers ---------- */
const NOW = Date.now();
const d = (daysAgo: number, hoursAgo = 0) =>
  new Date(NOW - daysAgo * 86400_000 - hoursAgo * 3600_000).toISOString();

const CATEGORIES = [
  { id: "cat_prog", slug: "programming", name: "Programming", description: "Core language skills — Java, Python, Git and the craft of writing clean code." },
  { id: "cat_web", slug: "web-development", name: "Web Development", description: "HTML, CSS, JavaScript and React — build for the browser." },
  { id: "cat_dsa", slug: "data-structures", name: "Data Structures", description: "Algorithms, problem patterns and interview preparation." },
  { id: "cat_db", slug: "databases", name: "Databases", description: "SQL, relational modelling and working with real data." },
  { id: "cat_aiml", slug: "ai-ml", name: "AI & ML", description: "Python-driven machine learning — courses launching soon." },
  { id: "cat_cloud", slug: "cloud", name: "Cloud", description: "Cloud fundamentals and deployment — courses launching soon." },
  { id: "cat_interview", slug: "interview-preparation", name: "Interview Preparation", description: "Structured practice for technical interviews." },
];

const INSTRUCTORS = [
  {
    id: "ins_arjun", slug: "arjun-mehta", name: "Arjun Mehta",
    role: "Senior Instructor · Java & Backend",
    bio: "Arjun spent eleven years building enterprise backend systems — payment platforms serving millions of daily transactions among them — before moving to teaching full-time. He has taught Java to more than two thousand working professionals and students, and is known for explaining the 'why' behind every line of code. At KwikStudy he leads the Java curriculum and mentors capstone projects.",
    expertise: ["Java", "Spring Boot", "System Design Basics", "Mentoring"],
    experience_years: 11,
    teaching_approach: "Arjun teaches by building. Every concept appears first in a small working program, then in the edge cases where it breaks — because that's where understanding actually forms. He reviews every capstone submission personally.",
  },
  {
    id: "ins_priya", slug: "priya-raghavan", name: "Priya Raghavan",
    role: "Instructor · Python & Data",
    bio: "Priya worked as a data engineer for eight years, building pipelines that moved millions of records a day, before she discovered that her favourite part of the job was teaching new teammates. She now designs KwikStudy's Python and SQL curricula, with a focus on making beginners comfortable fast and correct faster.",
    expertise: ["Python", "SQL", "Data Engineering", "Automation"],
    experience_years: 8,
    teaching_approach: "Priya's lessons are short, and every one ends with something running on your machine. She believes confidence comes from small working programs, and correctness comes from reading errors carefully — a skill she drills deliberately.",
  },
  {
    id: "ins_rahul", slug: "rahul-verma", name: "Rahul Verma",
    role: "Lead Instructor · Web & Frontend",
    bio: "Rahul has built web interfaces for nine years — from early jQuery dashboards to design systems used by dozens of teams. As a freelancer-turned-instructor he brings a practitioner's eye for what actually ships: accessibility, performance and interfaces that hold up under real users. He leads the Web Development and React courses.",
    expertise: ["JavaScript", "React", "CSS Architecture", "Accessibility"],
    experience_years: 9,
    teaching_approach: "Rahul teaches layout before syntax and design sense alongside code. His students learn to question every pixel ('why is this centred?') — the habit that separates developers who build pages from developers who build products.",
  },
  {
    id: "ins_sana", slug: "sana-iqbal", name: "Sana Iqbal",
    role: "Instructor · Algorithms & Interview Prep",
    bio: "Sana is a competitive programmer with seven years of problem-setting and coaching experience, including three years running a university programming club that produced multiple national finalists. She teaches KwikStudy's DSA track, where her problem sets are known for being genuinely hard — and for the hints that make them possible.",
    expertise: ["Data Structures", "Algorithms", "Competitive Programming", "Interview Coaching"],
    experience_years: 7,
    teaching_approach: "Sana teaches patterns, not problems. Every problem in her sets maps back to a named idea — two pointers, monotonic stacks, the DP table — and she insists students can name the pattern before they code it. Her mock interviews are feared and requested in equal measure.",
  },
];

const USERS = [
  { id: "usr_admin", email: "admin@kwikstudy.in", password: "Admin@123", name: "Ravi Deshmukh", role: "admin", phone: "+91 98860 11223", created: d(300) },
  { id: "usr_aarav", email: "student@kwikstudy.in", password: "Student@123", name: "Aarav Sharma", role: "student", phone: "+91 98450 33221", created: d(60) },
  { id: "usr_ishaan", email: "ishaan.g@example.com", password: "Student@123", name: "Ishaan Gupta", role: "student", phone: "+91 99001 45532", created: d(20) },
];

const PROGRAMS = [
  {
    id: "prg_fullstack", slug: "full-stack-developer-program",
    title: "Full Stack Developer Program",
    subtitle: "Frontend, backend and everything between — one coherent path from first webpage to deployed application.",
    description:
      "The most complete path KwikStudy offers. You build the web foundation (HTML, CSS, JavaScript), learn React for modern interfaces, add Git for collaboration, and finish by building and deploying a full-stack project. Designed for students who want breadth with depth — every module assumes and reinforces the previous one.",
    level: "Beginner → Intermediate", duration_months: 6,
    price: 8999, original_price: 11997,
    cover_variant: "blocks", cover_code: "KS-FSP-01",
    outcomes: [
      "Build responsive, accessible web pages from scratch",
      "Develop interactive applications with React",
      "Collaborate professionally with Git and GitHub",
      "Ship a complete, deployed full-stack portfolio project",
    ],
    projects: ["Personal portfolio site", "React dashboard application", "Full-stack capstone with deployment"],
    faqs: [
      { q: "Is the program self-paced?", a: "Yes. The recommended schedule is 6 months at 8–10 hours per week, but your access does not expire and you can move faster or slower." },
      { q: "Do I get a certificate for the program?", a: "Yes — a program certificate is issued when all component courses are completed, alongside each course's individual certificate." },
    ],
    courses: [
      { course: "crs_webdev", note: "Months 1–2 · Foundation" },
      { course: "crs_react", note: "Months 3–4 · Interfaces" },
      { course: "crs_git", note: "Throughout · Collaboration" },
    ],
  },
  {
    id: "prg_javatrack", slug: "java-development-track",
    title: "Java Development Track",
    subtitle: "Java language, SQL and version control — the classic backend foundation done properly.",
    description:
      "A focused track for aspiring backend developers. Master core Java through OOP, collections and the capstone project; learn to model and query relational data with SQL; and adopt the Git workflow used by professional teams. Ends with a portfolio of two substantial Java projects.",
    level: "Beginner → Intermediate", duration_months: 5,
    price: 6499, original_price: 7797,
    cover_variant: "grid", cover_code: "KS-JDT-02",
    outcomes: [
      "Write object-oriented Java with collections and exceptions",
      "Design and query relational databases with SQL",
      "Use Git for disciplined, reviewable development",
      "Complete a Java console capstone and an SQL reporting pack",
    ],
    projects: ["Library Management System (Java)", "Academy Reporting Pack (SQL)"],
    faqs: [
      { q: "I know basic Java already. Should I start from Module 1?", a: "Take the Module 2 checkpoint quiz early — if you clear it comfortably, skim Module 1 and start properly at Module 3. Your progress tracking adapts to whatever you complete." },
      { q: "Does this track cover Spring Boot?", a: "Not yet. This track builds the Java and SQL foundation Spring assumes; a Spring-focused course is planned as a follow-on." },
    ],
    courses: [
      { course: "crs_java", note: "Months 1–3 · Core language" },
      { course: "crs_sql", note: "Months 3–4 · Data" },
      { course: "crs_git", note: "Throughout · Collaboration" },
    ],
  },
  {
    id: "prg_dsa", slug: "dsa-interview-preparation",
    title: "DSA & Interview Preparation",
    subtitle: "Algorithms, patterns and a repeatable practice system for technical interviews.",
    description:
      "Built around how interviews actually evaluate you: pattern recognition, complexity reasoning and calm problem-solving under time pressure. The DSA course gives you the canon and the habit; Git rounds out the professional toolkit. Weekly problem sets, mock contests and a personal problem journal carry your preparation beyond the course.",
    level: "Intermediate", duration_months: 4,
    price: 4499, original_price: 4798,
    cover_variant: "dots", cover_code: "KS-DIP-03",
    outcomes: [
      "Recognise and apply the core interview patterns",
      "Reason about time and space complexity confidently",
      "Solve tree, graph and DP problems methodically",
      "Run a self-sustaining weekly practice system",
    ],
    projects: ["50-problem journal", "Three timed mock contests with post-mortems"],
    faqs: [
      { q: "Which language is used?", a: "C++, taught from zero in Module 1. The patterns transfer directly to Java or Python if that's your interview language." },
      { q: "How much weekly time does this need?", a: "Plan for 8 hours: roughly 3 hours of lessons and 5 hours of problem sets. The problem sets are the course — protect that time." },
    ],
    courses: [
      { course: "crs_dsa", note: "Months 1–3 · Algorithms" },
      { course: "crs_git", note: "Throughout · Toolkit" },
    ],
  },
];

const COUPONS = [
  { code: "WELCOME10", percent_off: 10, description: "10% off your first course" },
  { code: "EARLY20", percent_off: 20, description: "Early-access offer — 20% off" },
];

const ENQUIRIES = [
  { id: "enq_001", name: "Meera Krishnan", email: "meera.k@example.com", phone: "+91 98861 22001", topic: "Course fees", course: "crs_java", preferred_contact: "phone", message: "Hi, I'm a final-year BSc student. Could you share the fee structure for the Java course and whether there is a student discount? Also, are weekend batches available?", status: "new", created: d(1, 5) },
  { id: "enq_002", name: "Karthik Rao", email: "karthik.rao@example.com", phone: "+91 97402 88310", topic: "Corporate training", course: null, preferred_contact: "email", message: "We are a 40-person fintech team in Bengaluru looking for a custom Java + SQL refresher for our QA engineers. Could someone from the academic team call to discuss scope and pricing?", status: "contacted", created: d(3, 2) },
  { id: "enq_003", name: "Fatima Sheikh", email: "fatima.s@example.com", phone: null, topic: "Batches", course: "crs_python", preferred_contact: "email", message: "When does the next Python batch start, and are the live sessions recorded? I work weekdays till 7pm.", status: "closed", created: d(9) },
];

/* ---------- wipe & insert ---------- */

function wipe(db: Db) {
  const tables = [
    "quiz_options", "quiz_questions", "quiz_attempts", "quizzes",
    "assignment_submissions", "assignments",
    "lesson_resources", "lessons", "modules",
    "course_instructors", "program_courses", "programs",
    "certificates", "lesson_progress", "enrollments",
    "payments", "orders", "enquiries", "coupons",
    "courses", "course_categories", "instructors", "sessions", "users",
  ];
  db.pragma("foreign_keys = OFF");
  for (const t of tables) db.exec(`DROP TABLE IF EXISTS ${t}`);
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA_SQL);
}

export function seedDatabase(db: Db) {
  wipe(db);

  const st = db.prepare("INSERT INTO course_categories (id, slug, name, description) VALUES (?,?,?,?)");
  for (const c of CATEGORIES) st.run(c.id, c.slug, c.name, c.description);

  const iSt = db.prepare("INSERT INTO instructors (id, slug, name, role, bio, expertise, experience_years, teaching_approach) VALUES (?,?,?,?,?,?,?,?)");
  for (const i of INSTRUCTORS) iSt.run(i.id, i.slug, i.name, i.role, i.bio, JSON.stringify(i.expertise), i.experience_years, i.teaching_approach);

  const uSt = db.prepare("INSERT INTO users (id, email, password_hash, name, role, phone, created_at) VALUES (?,?,?,?,?,?,?)");
  for (const u of USERS) uSt.run(u.id, u.email, hashPassword(u.password), u.name, u.role, u.phone, u.created);

  /* courses + curriculum */
  const courses: CourseSeed[] = [javaCourse, webDevCourse, gitCourse, pythonCourse, sqlCourse, reactCourse, dsaCourse];
  const cSt = db.prepare(`INSERT INTO courses (id, slug, title, subtitle, description, category_id, level, language, duration_hours, price, original_price, status, cover_variant, cover_code, projects, outcomes, requirements, faqs, created_at)
    VALUES (@id,@slug,@title,@subtitle,@description,@category_id,@level,@language,@duration_hours,@price,@original_price,@status,@cover_variant,@cover_code,@projects,@outcomes,@requirements,@faqs,@created_at)`);
  const ciSt = db.prepare("INSERT INTO course_instructors (course_id, instructor_id, role) VALUES (?,?,?)");
  const mSt = db.prepare("INSERT INTO modules (id, course_id, idx, title, summary) VALUES (?,?,?,?,?)");
  const lSt = db.prepare("INSERT INTO lessons (id, module_id, idx, title, type, duration_min, is_free_preview, content) VALUES (?,?,?,?,?,?,?,?)");
  const rSt = db.prepare("INSERT INTO lesson_resources (id, lesson_id, title, kind, href) VALUES (?,?,?,?,?)");
  const qSt = db.prepare("INSERT INTO quizzes (id, lesson_id, title, pass_score) VALUES (?,?,?,?)");
  const qqSt = db.prepare("INSERT INTO quiz_questions (id, quiz_id, idx, question, explanation) VALUES (?,?,?,?,?)");
  const qoSt = db.prepare("INSERT INTO quiz_options (id, question_id, idx, text, is_correct) VALUES (?,?,?,?,?)");
  const aSt = db.prepare("INSERT INTO assignments (id, lesson_id, course_id, title, brief, max_score) VALUES (?,?,?,?,?,?)");

  const catBySlug = new Map(CATEGORIES.map((c) => [c.slug, c.id]));

  for (const course of courses) {
    const catId = catBySlug.get(course.category)!;
    cSt.run({
      id: course.id, slug: course.slug, title: course.title, subtitle: course.subtitle,
      description: course.description, category_id: catId, level: course.level,
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
      ciSt.run(course.id, ins.id, ci.role);
    }

    course.modules.forEach((mod, mi) => {
      const mid = `mod_${course.id.replace("crs_", "")}_${String(mi + 1).padStart(2, "0")}`;
      mSt.run(mid, course.id, mi + 1, mod.title, mod.summary ?? "");

      mod.lessons.forEach((lesson: LessonSeed, li) => {
        const lid = `les_${course.id.replace("crs_", "")}_${String(mi + 1).padStart(2, "0")}${String(li + 1).padStart(2, "0")}`;
        const type = lesson.type ?? (lesson.quiz ? "quiz" : lesson.assignment ? "assignment" : "text");
        lSt.run(lid, mid, li + 1, lesson.title, type, lesson.min ?? 10, lesson.free ? 1 : 0, JSON.stringify(lesson.blocks));

        if (lesson.resources) {
          lesson.resources.forEach((r, ri) => rSt.run(`res_${lid}_${ri}`, lid, r.title, r.kind, "#"));
        }
        if (lesson.quiz) {
          const qid = `qz_${lid}`;
          qSt.run(qid, lid, lesson.title.replace(/^Checkpoint Quiz:? /, "Checkpoint Quiz — "), lesson.quiz.pass);
          lesson.quiz.questions.forEach((q, qi) => {
            const qqId = `qq_${lid}_${qi}`;
            qqSt.run(qqId, qid, qi, q.q, q.why);
            q.opts.forEach((opt, oi) => {
              qoSt.run(`qo_${qqId}_${oi}`, qqId, oi, opt, oi === q.correct ? 1 : 0);
            });
          });
        }
        if (lesson.assignment) {
          aSt.run(`asg_${lid}`, lid, course.id, lesson.assignment.title, lesson.assignment.brief, lesson.assignment.max ?? 100);
        }
      });
    });
  }

  /* programs */
  const pSt = db.prepare(`INSERT INTO programs (id, slug, title, subtitle, description, level, duration_months, price, original_price, status, cover_variant, cover_code, outcomes, projects, faqs, created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
  const pcSt = db.prepare("INSERT INTO program_courses (program_id, course_id, idx, note) VALUES (?,?,?,?)");
  for (const p of PROGRAMS) {
    pSt.run(p.id, p.slug, p.title, p.subtitle, p.description, p.level, p.duration_months, p.price, p.original_price, "published", p.cover_variant, p.cover_code, JSON.stringify(p.outcomes), JSON.stringify(p.projects), JSON.stringify(p.faqs), d(120));
    p.courses.forEach((c, i) => pcSt.run(p.id, c.course, i + 1, c.note));
  }

  /* demo student activity */
  const insEnroll = db.prepare("INSERT INTO enrollments (id, user_id, course_id, enrolled_at, status, order_id) VALUES (?,?,?,?,?,?)");
  const insProg = db.prepare("INSERT INTO lesson_progress (id, user_id, course_id, lesson_id, status, completed_at, last_viewed_at) VALUES (?,?,?,?,?,?,?)");
  const insCert = db.prepare("INSERT INTO certificates (id, user_id, course_id, issued_at, status) VALUES (?,?,?,?,?)");
  const insAttempt = db.prepare("INSERT INTO quiz_attempts (id, quiz_id, user_id, score, total, created_at) VALUES (?,?,?,?,?,?)");
  const insOrder = db.prepare(`INSERT INTO orders (id, user_id, course_id, amount, discount, total, coupon_code, status, provider, provider_order_id, created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)`);
  const insPay = db.prepare(`INSERT INTO payments (id, order_id, provider_payment_id, method, amount, status, paid_at) VALUES (?,?,?,?,?,?,?)`);
  const insSub = db.prepare("INSERT INTO assignment_submissions (id, assignment_id, user_id, notes, submitted_at) VALUES (?,?,?,?,?)");

  const lessonIds = (course: string) => {
    const rows = db.prepare("SELECT l.id FROM lessons l JOIN modules m ON m.id = l.module_id WHERE m.course_id = ? ORDER BY m.idx, l.idx").all(course) as { id: string }[];
    return rows.map((r) => r.id);
  };
  const complete = (userId: string, course: string, ids: string[], days: number[]) => {
    ids.forEach((id, i) => {
      insProg.run(`lp_${userId}_${id}`, userId, course, id, "completed", d(days[i] ?? 30 + i, (i * 3) % 6), d(days[i] ?? 30 + i, (i * 3) % 6));
    });
  };

  /* Aarav — Java: 26 of 38 lessons complete (68%) */
  insEnroll.run("enr_aarav_java", "usr_aarav", "crs_java", d(32), "active", "ord_seed_1");
  const java = lessonIds("crs_java");
  const javaDays = [30, 30, 29, 29, 28, 27, 26, 26, 25, 24, 23, 22, 21, 20, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 8];
  complete("usr_aarav", "crs_java", java.slice(0, 26), javaDays);
  insProg.run("lp_usr_aarav_les_java_0603", "usr_aarav", "crs_java", "les_java_0603", "in_progress", null, d(0, 3));
  insOrder.run("ord_seed_1", "usr_aarav", "crs_java", 2999, 0, 2999, null, "paid", "mock", "mo_seed_1", d(32));
  insPay.run("pay_seed_1", "ord_seed_1", "pay_seed_1_mock", "upi", 2999, "captured", d(32));
  insAttempt.run("qa_seed_1", "qz_les_java_0205", "usr_aarav", 4, 5, d(26));
  insAttempt.run("qa_seed_2", "qz_les_java_0405", "usr_aarav", 5, 5, d(17));

  /* Aarav — Git: complete, certified */
  insEnroll.run("enr_aarav_git", "usr_aarav", "crs_git", d(28), "completed", "ord_seed_2");
  const git = lessonIds("crs_git");
  const gitDays = git.map((_, i) => 27 - i * 1.1);
  complete("usr_aarav", "crs_git", git, gitDays);
  insOrder.run("ord_seed_2", "usr_aarav", "crs_git", 799, 80, 719, "WELCOME10", "paid", "mock", "mo_seed_2", d(28));
  insPay.run("pay_seed_2", "ord_seed_2", "pay_seed_2_mock", "card", 719, "captured", d(28));
  insCert.run("CERT-2026-0147", "usr_aarav", "crs_git", d(13), "valid");

  /* Aarav — Web Dev: 3 of lessons complete (13%), started 4 days ago */
  insEnroll.run("enr_aarav_web", "usr_aarav", "crs_webdev", d(4), "active", "ord_seed_3");
  const web = lessonIds("crs_webdev");
  complete("usr_aarav", "crs_webdev", web.slice(0, 3), [3, 2, 1]);
  insProg.run("lp_usr_aarav_les_webdev_0104", "usr_aarav", "crs_webdev", "les_webdev_0104", "in_progress", null, d(0, 20));
  insOrder.run("ord_seed_3", "usr_aarav", "crs_webdev", 2199, 440, 1759, "EARLY20", "paid", "mock", "mo_seed_3", d(4));
  insPay.run("pay_seed_3", "ord_seed_3", "pay_seed_3_mock", "upi", 1759, "captured", d(4));

  /* Ishaan — Python: 4 lessons complete (20%) */
  insEnroll.run("enr_ishaan_python", "usr_ishaan", "crs_python", d(10), "active", "ord_seed_4");
  const py = lessonIds("crs_python");
  complete("usr_ishaan", "crs_python", py.slice(0, 4), [9, 8, 6, 5]);
  insOrder.run("ord_seed_4", "usr_ishaan", "crs_python", 2499, 0, 2499, null, "paid", "mock", "mo_seed_4", d(10));
  insPay.run("pay_seed_4", "ord_seed_4", "pay_seed_4_mock", "netbanking", 2499, "captured", d(10));

  /* Aarav submitted the exception worksheet */
  insSub.run("subs_seed_1", "asg_les_java_0605", "usr_aarav",
    "Implemented all four scenarios. Used a checked exception for InvalidMarksException since callers must handle bad input; kept divide() unchecked for zero as it signals a programming error.",
    d(1, 4));

  /* coupons + enquiries */
  const insCoupon = db.prepare("INSERT INTO coupons (code, percent_off, active, description) VALUES (?,?,1,?)");
  for (const c of COUPONS) insCoupon.run(c.code, c.percent_off, c.description);
  const insEnq = db.prepare("INSERT INTO enquiries (id, name, email, phone, topic, course_id, preferred_contact, message, status, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)");
  for (const e of ENQUIRIES) insEnq.run(e.id, e.name, e.email, e.phone, e.topic, e.course, e.preferred_contact, e.message, e.status, e.created);
}
