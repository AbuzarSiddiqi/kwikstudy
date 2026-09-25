import Link from "next/link";
import type { Metadata } from "next";
import { getInstructors } from "@/lib/queries";
import { Breadcrumb, SectionHeading } from "@/components/ui";
import { initials } from "@/lib/site";
import { ArrowRight, Check, Compass, ListChecks, Layers, Target } from "@/components/Icons";

export const metadata: Metadata = {
  title: "About",
  description: "KwikStudy is a programming education institute built on structured curricula, practical projects and instructor guidance.",
};

const APPROACH = [
  { n: "01", t: "Learn", b: "New concepts arrive in short lessons written from first principles — each one states what you'll be able to do before it teaches you how." },
  { n: "02", t: "Practice", b: "Checkpoint quizzes and exercises follow every module, with explanations for every answer so mistakes become lessons too." },
  { n: "03", t: "Build", b: "Projects convert knowledge into artefacts: a grade analyser, a quiz widget, a library management system you designed." },
  { n: "04", t: "Improve", b: "Progress tracking and instructor feedback show precisely where you stand and what to strengthen next." },
];

const WHY = [
  { icon: <ListChecks width={17} height={17} />, t: "Curriculum before content", b: "Every course is written as a curriculum first — numbered modules, defined outcomes, reviewed sequencing. Lessons exist to serve it, not to pad it." },
  { icon: <Compass width={17} height={17} />, t: "Honest about what things are", b: "No invented placement statistics, no borrowed logos, no certifications pretending to be degrees. The work speaks; we keep the claims modest." },
  { icon: <Target width={17} height={17} />, t: "Practice is the product", b: "Reading about code isn't knowing code. Quizzes, exercises and projects are built into every module — the lesson is where learning starts, not ends." },
  { icon: <Layers width={17} height={17} />, t: "Small, deep catalogue", b: "Seven courses, four tracks, no thousand-course marketplace. Each one is maintained by the instructor who teaches it." },
];

export default function AboutPage() {
  const instructors = getInstructors();

  return (
    <>
      {/* intro */}
      <section className="border-b border-line bg-paper-deep/40">
        <div className="wrap py-14">
          <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "About" }]} />
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <p className="eyebrow mb-4 flex items-center gap-2">
                <span className="inline-block h-[3px] w-[18px] bg-accent-600" aria-hidden />
                About KwikStudy
              </p>
              <h1 className="font-display text-[2rem] font-bold leading-tight tracking-tight sm:text-[2.4rem]">
                An institute built around how engineering is actually learned.
              </h1>
              <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-ink-600">
                KwikStudy was started by engineers who spent years interviewing candidates who could recite syntax but
                not solve problems — and who believed most online learning failed because it optimised for watching,
                not doing. So we build courses the way good teams build software: a written curriculum first, practice
                at every step, and projects that prove the learning.
              </p>
              <p className="mt-4 max-w-2xl text-[1rem] leading-relaxed text-ink-600">
                We are deliberately small. Seven courses across four disciplines, each designed and taught by a
                practising engineer, each maintained like software — reviewed, versioned and improved as the field
                moves.
              </p>
            </div>
            <div className="card h-fit p-6 lg:mt-2">
              <p className="eyebrow mb-4">Our commitment</p>
              <ul className="space-y-3.5 text-[0.89rem] leading-relaxed text-ink-600">
                {[
                  "Real curricula, published in full before you pay",
                  "Free preview lessons in every course",
                  "Certificates that anyone can verify by ID",
                  "We name what we don't offer — no fake placements, no invented numbers",
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2.5">
                    <Check width={16} height={16} className="mt-0.5 shrink-0 text-moss-500" /> {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* approach */}
      <section className="border-b border-line">
        <div className="wrap py-16">
          <SectionHeading
            eyebrow="Our approach"
            title="Learn → Practice → Build → Improve"
            lead="The same loop runs through every course, at every level. It's not a slogan — it's the structure of the curriculum itself."
          />
          <ol className="mt-10 grid gap-px overflow-hidden rounded-[10px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {APPROACH.map((a) => (
              <li key={a.n} className="bg-surface p-6">
                <span className="font-mono text-[0.8rem] font-semibold tabular text-accent-600">{a.n}</span>
                <h3 className="mb-2 mt-2 font-display text-[1.1rem] font-semibold">{a.t}</h3>
                <p className="text-[0.87rem] leading-relaxed text-ink-500">{a.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* teaching philosophy — dark editorial */}
      <section className="border-b border-line bg-ink-950 text-paper">
        <div className="wrap grid gap-10 py-16 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <p className="eyebrow mb-3 !text-ink-400">Teaching philosophy</p>
            <h2 className="font-display text-[1.65rem] font-bold leading-tight text-paper sm:text-[2rem]">
              Understanding compounds. Memorising doesn't.
            </h2>
          </div>
          <div className="space-y-5 text-[0.95rem] leading-relaxed text-ink-300">
            <p>
              Our lessons are short because attention is finite; our curricula are long because competence isn't. We
              would rather teach you twenty things you can use than two hundred you can recognise.
            </p>
            <p>
              Every concept is introduced with a problem it solves, then practised until recall is automatic, then
              applied in a project where the scaffolding disappears. That sequence — problem, practice, project — is
              the only teaching method we've found that survives contact with a real job.
            </p>
            <p>
              And we show our work: the full curriculum of every course is public, every lesson states its objective,
              and every certificate can be verified independently. An institute that asks for your trust should be
              inspectable.
            </p>
          </div>
        </div>
      </section>

      {/* why */}
      <section className="border-b border-line">
        <div className="wrap py-16">
          <SectionHeading eyebrow="Why KwikStudy" title="What we do differently, and why." />
          <div className="mt-10 grid gap-x-12 gap-y-9 sm:grid-cols-2">
            {WHY.map((w) => (
              <div key={w.t} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-accent-700">
                  {w.icon}
                </span>
                <div>
                  <h3 className="mb-1 font-display text-[1rem] font-semibold">{w.t}</h3>
                  <p className="text-[0.89rem] leading-relaxed text-ink-500">{w.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* faculty */}
      <section className="border-b border-line bg-paper-deep/50">
        <div className="wrap py-16">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Faculty"
              title="The people in front of the room."
              lead="Four instructors, each responsible for the courses they know professionally — and accountable for how they teach."
            />
            <Link href="/instructors" className="btn btn-outline btn-sm">Meet the faculty <ArrowRight width={15} height={15} /></Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {instructors.map((ins) => (
              <li key={ins.id} className="card p-5">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-ink-900 font-mono text-[0.8rem] text-paper">
                  {initials(ins.name)}
                </span>
                <h3 className="font-display text-[0.98rem] font-semibold">{ins.name}</h3>
                <p className="text-[0.78rem] text-ink-500">{ins.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* learning environment */}
      <section>
        <div className="wrap py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <SectionHeading
              eyebrow="Learning environment"
              title="Online-first, discipline everywhere."
              lead="KwikStudy is an online institute. That's a design decision, not a limitation: every lesson, quiz and project works the same on a hostel laptop at midnight and a work desk at 6 a.m. — and your progress follows you."
            />
            <ul className="space-y-4">
              {[
                ["Self-paced by design", "No cohorts to fall behind, no expiry dates. Access to enrolled courses doesn't end."],
                ["Structured like a semester", "Modules and lessons are numbered and sequenced; you always know what's next and why."],
                ["Instructor support included", "Doubt support from the teaching team is part of enrollment, not an upsell."],
                ["Built for working students", "4–8 focused hours a week is enough. The dashboard tracks momentum without nagging."],
              ].map(([t, b]) => (
                <li key={t} className="card p-5">
                  <h3 className="font-display text-[0.95rem] font-semibold">{t}</h3>
                  <p className="mt-1 text-[0.87rem] leading-relaxed text-ink-500">{b}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
