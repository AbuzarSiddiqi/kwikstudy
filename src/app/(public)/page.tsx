import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedCourses, getInstructors, getPrograms } from "@/lib/queries";
import { CourseCard } from "@/components/CourseCard";
import { SectionHeading } from "@/components/ui";
import { CoverArt, courseGlyph } from "@/components/CoverArt";
import { CodeBlock } from "@/components/CodeBlock";
import { ArrowRight, Check, ChevronDown, Spark, Target, Compass, Award, ShieldCheck } from "@/components/Icons";
import { HOME_FAQS } from "@/lib/faq";
import { initials, rupees } from "@/lib/site";

export const metadata: Metadata = {
  title: "KwikStudy — Practical Programming Education",
  description:
    "Structured programming courses in Java, Python, web development, SQL and data structures — designed around understanding, practice and progression.",
};

/* ---------------- hero visual: the learning environment ---------------- */

function LessonVisual() {
  return (
          <div className="relative min-w-0" aria-hidden>
            <div className="bp-grid absolute -inset-4 rounded-2xl border border-line bg-paper-deep/40 sm:-inset-6" />
      {/* main lesson window */}
      <div className="card relative z-10 overflow-hidden">
        <div className="flex items-center justify-between border-b border-line bg-paper-deep/50 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#e0876a]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#e5c07b]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#9bb876]" />
          </div>
          <span className="font-mono text-[0.66rem] tracking-wider text-ink-400">KS LEARN · JAVA PROGRAMMING</span>
          <span className="badge badge-moss !py-0.5 !text-[0.6rem]">M06 · LESSON 3</span>
        </div>
        <div className="p-5">
          <p className="eyebrow mb-1.5">Module 06 — Object-Oriented Programming II</p>
          <h3 className="font-display text-[1.05rem] font-semibold">Exception Handling: try, catch, finally</h3>
          <div className="mt-2 mb-4 flex items-center gap-3">
            <div className="h-1.5 w-40 overflow-hidden rounded-full bg-ink-200/70">
              <div className="h-full w-[68%] rounded-full bg-moss-500" />
            </div>
            <span className="font-mono text-[0.66rem] tabular text-ink-500">68% complete</span>
          </div>
          <div className="text-left">
            <CodeBlock
              lang="java"
              filename="Account.java"
              code={`try {
    account.withdraw(amount);
    System.out.println("New balance: " + account.balance());
} catch (InsufficientBalanceException e) {
    System.out.println("Cannot withdraw: " + e.getMessage());
} finally {
    auditLog.record("withdraw", amount);   // always runs
}`}
            />
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-3.5">
            <span className="inline-flex items-center gap-1.5 text-[0.78rem] text-ink-500">
              <Check width={14} height={14} className="text-moss-500" /> 26 of 38 lessons done
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-ink-900 px-3 py-1.5 font-display text-[0.72rem] font-semibold text-paper">
              Mark complete
            </span>
          </div>
        </div>
      </div>

      {/* curriculum card */}
      <div className="card absolute -bottom-10 -left-4 z-20 hidden w-56 p-4 sm:block lg:-left-10">
        <p className="eyebrow mb-2.5">Module 06</p>
        <ul className="space-y-2 text-[0.78rem] text-ink-600">
          <li className="flex items-center gap-2"><Check width={13} height={13} className="text-moss-500" />Polymorphism</li>
          <li className="flex items-center gap-2"><Check width={13} height={13} className="text-moss-500" />Abstract classes & interfaces</li>
          <li className="flex items-center gap-2 font-semibold text-ink-900"><span className="h-2 w-2 rounded-full bg-accent-500" aria-hidden />Exception handling</li>
          <li className="flex items-center gap-2 text-ink-400"><span className="h-2 w-2 rounded-full border border-ink-300" aria-hidden />Custom exceptions</li>
        </ul>
      </div>

      {/* streak chip */}
      <div className="card absolute -right-2 -top-5 z-20 flex items-center gap-2.5 px-3.5 py-2.5 lg:-right-6">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-50 text-accent-700">
          <Spark width={15} height={15} />
        </span>
        <div className="leading-tight">
          <p className="font-display text-[0.8rem] font-bold text-ink-900">4-day streak</p>
          <p className="font-mono text-[0.6rem] uppercase tracking-wider text-ink-400">Keep it going</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- page ---------------- */

const PRINCIPLES = [
  { title: "Structured curriculum", body: "Numbered modules and lessons, written before a course is taught — never improvised." },
  { title: "Practice first", body: "Checkpoint quizzes and graded exercises follow every module." },
  { title: "Project-based", body: "Each course ends in a project you built yourself, not a certificate for watching." },
  { title: "Taught by engineers", body: "Instructors who have shipped the systems they teach." },
  { title: "Progress you can see", body: "Every lesson completed is tracked — your dashboard is the record." },
  { title: "Career-oriented", body: "Curricula aim at what interviews and engineering teams actually expect." },
];

const METHOD = [
  { n: "01", title: "Learn", body: "Concepts from first principles in short, focused lessons — each one answering a question you'd actually ask." },
  { n: "02", title: "Practice", body: "Checkpoint quizzes and exercises convert reading into recall, with explanations on every wrong answer." },
  { n: "03", title: "Build", body: "Projects turn concepts into artefacts — a grade analyser, a quiz widget, a library management system." },
  { n: "04", title: "Improve", body: "Instructor feedback and visible progress tracking show you exactly what to strengthen next." },
];

export default function HomePage() {
  const courses = getPublishedCourses();
  const programs = getPrograms();
  const instructors = getInstructors();
  const featured = courses.slice(0, 6);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="border-b border-line">
        <div className="wrap grid items-center gap-14 py-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-20">
          <div className="min-w-0">
            <p className="eyebrow mb-5 flex items-center gap-2">
              <span className="inline-block h-[3px] w-[18px] bg-accent-600" aria-hidden />
              Programming Education
            </p>
            <h1 className="font-display text-[2.35rem] font-bold leading-[1.12] tracking-tight sm:text-[2.9rem] lg:text-[3.1rem]">
              Build the skills.
              <br />
              Write the code.
              <br />
              <span className="text-accent-700">Shape your career.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[1.02rem] leading-relaxed text-ink-600">
              Structured programming courses designed to take you from fundamentals to practical software
              development — with the curriculum, practice and feedback to prove it.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/courses" className="btn btn-accent btn-lg">
                Explore Courses <ArrowRight width={17} height={17} />
              </Link>
              <Link href="/enquire" className="btn btn-outline btn-lg">Talk to an Advisor</Link>
            </div>
            <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6">
              {[
                ["7", "structured courses"],
                ["4", "instructor-led tracks"],
                ["140+", "lessons, all previewable"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-display text-[1.35rem] font-bold tabular text-ink-900">{v}</dd>
                  <dd className="text-[0.78rem] text-ink-500">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <LessonVisual />
        </div>
      </section>

      {/* ---------------- PRINCIPLES BAND ---------------- */}
      <section className="border-b border-line bg-paper-deep/50">
        <div className="wrap py-12">
          <p className="eyebrow mb-1.5 text-center">Why students stay</p>
          <p className="mx-auto mb-10 max-w-xl text-center text-[1.02rem] text-ink-600">
            Learning built around understanding, practice and progression — not video hours.
          </p>
          <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title} className="flex gap-4 border-l-2 border-line pl-5">
                <span className="font-mono text-[0.72rem] font-semibold tabular text-accent-600">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="mb-1 font-display text-[0.95rem] font-semibold text-ink-900">{p.title}</h3>
                  <p className="text-[0.85rem] leading-relaxed text-ink-500">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- METHOD ---------------- */}
      <section className="border-b border-line">
        <div className="wrap grid gap-12 py-16 lg:grid-cols-[0.9fr_1.4fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              eyebrow="How the learning works"
              title="A method, not a playlist."
              lead="KwikStudy courses follow the same four-stage rhythm. It's how the material sticks — and how you can tell it's working."
            />
            <Link href="/about" className="mt-6 inline-flex items-center gap-1.5 font-display text-[0.88rem] font-semibold text-accent-700 hover:text-accent-600">
              Our teaching philosophy <ArrowRight width={15} height={15} />
            </Link>
          </div>
          <ol className="divide-y divide-line border-y border-line">
            {METHOD.map((m) => (
              <li key={m.n} className="grid grid-cols-[3.5rem_1fr] gap-4 py-7 sm:grid-cols-[5rem_1fr]">
                <span className="font-mono text-[1.05rem] font-medium tabular text-accent-600">{m.n}</span>
                <div>
                  <h3 className="mb-1.5 font-display text-[1.2rem] font-semibold">{m.title}</h3>
                  <p className="max-w-xl text-[0.92rem] leading-relaxed text-ink-500">{m.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- COURSES ---------------- */}
      <section className="border-b border-line bg-surface">
        <div className="wrap py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Course catalogue"
              title="Find your next skill."
              lead="Explore by goal — a first language, a deeper framework, or the problem-solving interviews test."
            />
            <Link href="/courses" className="btn btn-outline btn-sm shrink-0">All courses <ArrowRight width={15} height={15} /></Link>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {["Programming", "Web Development", "Data Structures", "Databases"].map((c) => (
              <Link
                key={c}
                href={`/courses?category=${c.toLowerCase().replace(/ & /, "-").replace(/\s+/g, "-")}`}
                className="badge transition-colors hover:border-accent-500 hover:text-accent-700"
              >
                {c}
              </Link>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => <CourseCard key={c.id} course={c} showStatus={c.status === "waitlist"} />)}
          </div>
        </div>
      </section>

      {/* ---------------- PROGRAMS (dark editorial band) ---------------- */}
      <section className="bp-grid-dark border-b border-line bg-ink-950 text-paper">
        <div className="wrap py-16">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow mb-3 flex items-center gap-2 !text-ink-400">
                <span className="inline-block h-[3px] w-[18px] bg-accent-500" aria-hidden />
                Programs
              </p>
              <h2 className="font-display text-[1.65rem] font-bold leading-tight text-paper sm:text-[2rem]">
                Learning paths with an end in sight.
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-300">
                Programs sequence multiple courses into one coherent track — with a combined price and a portfolio
                at the end.
              </p>
            </div>
            <Link href="/programs" className="btn btn-sm border-ink-600 bg-transparent text-paper hover:border-paper">
              Compare programs <ArrowRight width={15} height={15} />
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {programs.map((p) => (
              <Link
                key={p.id}
                href={`/programs/${p.slug}`}
                className="group flex flex-col rounded-[10px] border border-ink-700 bg-ink-900/60 p-6 transition-colors hover:border-ink-500"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink-400">{p.cover_code}</span>
                  <span className="badge border-ink-600 bg-transparent !text-ink-300">{p.duration_months} months</span>
                </div>
                <h3 className="mb-2 font-display text-[1.15rem] font-semibold text-paper">{p.title}</h3>
                <p className="mb-5 line-clamp-2 flex-1 text-[0.85rem] leading-relaxed text-ink-300">{p.subtitle}</p>
                <div className="flex items-baseline justify-between border-t border-ink-700 pt-4">
                  <span className="font-display text-[1.05rem] font-bold text-paper tabular">{rupees(p.price)}</span>
                  <span className="inline-flex items-center gap-1.5 font-display text-[0.8rem] font-semibold text-accent-200 group-hover:text-accent-100">
                    View program <ArrowRight width={14} height={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SPLIT: inside a lesson ---------------- */}
      <section className="border-b border-line">
        <div className="wrap grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Inside a lesson"
              title="Short lessons. Real code. Checkpoints that check."
              lead="A KwikStudy lesson is 8–16 minutes of material you can apply immediately — then a quiz or exercise to prove it landed."
            />
            <ul className="mt-7 space-y-4">
              {[
                { icon: <Target width={17} height={17} />, t: "Written objectives", b: "Every lesson opens by stating exactly what you'll be able to do after it." },
                { icon: <Compass width={17} height={17} />, t: "Copy-ready code", b: "Syntax-highlighted examples with one-click copy, runnable in your own editor." },
                { icon: <Award width={17} height={17} />, t: "Checkpoint quizzes", b: "Graded instantly, with an explanation for every option — right or wrong." },
                { icon: <ShieldCheck width={17} height={17} />, t: "Verifiable certificates", b: "Complete a course, earn a certificate anyone can verify by its ID." },
              ].map((f) => (
                <li key={f.t} className="flex gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-paper text-accent-700">
                    {f.icon}
                  </span>
                  <div>
                    <h3 className="font-display text-[0.95rem] font-semibold text-ink-900">{f.t}</h3>
                    <p className="mt-0.5 text-[0.87rem] leading-relaxed text-ink-500">{f.b}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <span className="eyebrow">Checkpoint Quiz · Module 02</span>
                <span className="font-mono text-[0.7rem] tabular text-ink-400">Q2 / 5</span>
              </div>
              <div className="p-5">
                <p className="mb-1 font-mono text-[0.68rem] uppercase tracking-wider text-ink-400">Question 2</p>
                <p className="mb-4 font-display text-[1.02rem] font-semibold text-ink-900">
                  What is the output of <code className="rounded bg-paper-deep px-1.5 py-0.5 font-mono text-[0.85rem]">System.out.println(7 / 2)</code> in Java?
                </p>
                <div className="space-y-2.5">
                  {["3.5", "3", "4", "Compile error"].map((o, i) => (
                    <div
                      key={o}
                      className={`flex items-center gap-3 rounded-lg border px-3.5 py-2.5 text-[0.88rem] ${
                        i === 1 ? "border-moss-500 bg-moss-50 text-moss-700" : "border-line text-ink-600"
                      }`}
                    >
                      <span className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full border font-mono text-[0.65rem]">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="font-mono">{o}</span>
                      {i === 1 && <Check width={15} height={15} className="ml-auto text-moss-500" />}
                    </div>
                  ))}
                </div>
                <p className="mt-4 rounded-lg bg-paper-deep/70 px-3.5 py-2.5 text-[0.82rem] leading-relaxed text-ink-600">
                  <strong className="font-semibold text-ink-900">Why:</strong> both operands are <code className="font-mono text-[0.78rem]">int</code>, so
                  integer division truncates toward zero.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-6 right-4 hidden rotate-1 sm:block">
              <CoverArt category="Certificate" glyph="✓" code="CERT-2026-0147" variant="rings" className="w-44 rounded-lg border border-line shadow-[var(--shadow-lift)]" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- INSTRUCTORS ---------------- */}
      <section className="border-b border-line bg-paper-deep/50">
        <div className="wrap py-16">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Faculty"
              title="Taught by people who ship."
              lead="Every KwikStudy course is designed and taught by a practising engineer — and you can read exactly who."
            />
            <Link href="/instructors" className="btn btn-outline btn-sm shrink-0">All instructors <ArrowRight width={15} height={15} /></Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {instructors.map((ins) => (
              <li key={ins.id}>
                <Link href={`/instructors/${ins.slug}`} className="card group flex h-full flex-col p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 font-mono text-[0.85rem] font-medium text-paper">
                    {initials(ins.name)}
                  </span>
                  <h3 className="font-display text-[1rem] font-semibold text-ink-900 group-hover:text-accent-700">{ins.name}</h3>
                  <p className="mb-3 text-[0.8rem] text-ink-500">{ins.role}</p>
                  <p className="mt-auto font-mono text-[0.68rem] uppercase tracking-wider text-ink-400">
                    {ins.experience_years} yrs experience · {ins.course_count} course{ins.course_count > 1 ? "s" : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- FAQ + ENQUIRY ---------------- */}
      <section className="border-b border-line">
        <div className="wrap grid gap-12 py-16 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Common questions"
              title="Answers before you ask."
            />
            <div className="mt-6 divide-y divide-line border-y border-line">
              {HOME_FAQS.map((f) => (
                <details key={f.q} className="acc group py-4">
                  <summary className="flex items-center justify-between gap-4 font-display text-[0.98rem] font-semibold text-ink-900">
                    {f.q}
                    <ChevronDown width={16} height={16} className="acc-chevron shrink-0 text-ink-400" />
                  </summary>
                  <p className="mt-2.5 max-w-xl text-[0.9rem] leading-relaxed text-ink-500">{f.a}</p>
                </details>
              ))}
            </div>
            <Link href="/faq" className="mt-5 inline-flex items-center gap-1.5 font-display text-[0.88rem] font-semibold text-accent-700 hover:text-accent-600">
              Browse all FAQs <ArrowRight width={15} height={15} />
            </Link>
          </div>

          <aside className="card h-fit p-7 lg:sticky lg:top-28">
            <p className="eyebrow mb-3">Enquiries</p>
            <h3 className="font-display text-[1.3rem] font-bold leading-snug text-ink-900">
              Not sure where to start?
            </h3>
            <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-500">
              Tell us your background and goal, and our academic team will suggest a course or program — and a
              realistic weekly schedule to finish it.
            </p>
            <ul className="mt-5 space-y-2.5 text-[0.87rem] text-ink-600">
              {["Course and batch guidance", "Fee and offer details", "Corporate training proposals"].map((x) => (
                <li key={x} className="flex items-center gap-2.5">
                  <Check width={15} height={15} className="shrink-0 text-moss-500" /> {x}
                </li>
              ))}
            </ul>
            <Link href="/enquire" className="btn btn-primary mt-6 w-full">Submit an enquiry</Link>
            <p className="mt-3 text-center text-[0.75rem] text-ink-400">We usually respond within one working day.</p>
          </aside>
        </div>
      </section>
    </>
  );
}
