import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProgramBySlug, getCourseStats } from "@/lib/queries";
import { parseJson } from "@/lib/db";
import { Breadcrumb } from "@/components/ui";
import { CoverArt, courseGlyph } from "@/components/CoverArt";
import { ArrowRight, Check, ChevronDown, Clock, FileText, Play } from "@/components/Icons";
import { rupees } from "@/lib/site";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProgramBySlug(slug);
  if (!p) return { title: "Program not found" };
  return {
    title: p.title,
    description: p.subtitle,
    alternates: { canonical: `/programs/${p.slug}` },
  };
}

export default async function ProgramDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const program = getProgramBySlug(slug);
  if (!program) notFound();

  const outcomes = parseJson<string[]>(program.outcomes, []);
  const projects = parseJson<string[]>(program.projects, []);
  const faqs = parseJson<{ q: string; a: string }[]>(program.faqs, []);
  const statsPerCourse = program.courses.map((c) => ({ course: c, stats: getCourseStats(c.id) }));
  const totalLessons = statsPerCourse.reduce((s, x) => s + x.stats.lesson_count, 0);
  const totalHours = statsPerCourse.reduce((s, x) => s + x.course.duration_hours, 0);
  const discount = program.original_price ? Math.round(((program.original_price - program.price) / program.original_price) * 100) : 0;

  return (
    <>
      <section className="border-b border-line bg-paper-deep/40">
        <div className="wrap py-10">
          <Breadcrumb items={[{ href: "/", label: "Home" }, { href: "/programs", label: "Programs" }, { label: program.title }]} />
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="badge badge-accent">Program</span>
                <span className="badge">{program.level}</span>
              </div>
              <h1 className="font-display text-[1.9rem] font-bold tracking-tight sm:text-[2.25rem]">{program.title}</h1>
              <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-ink-600">{program.subtitle}</p>
              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[0.84rem] text-ink-600">
                <span className="inline-flex items-center gap-1.5"><Clock width={15} height={15} className="text-ink-400" />{program.duration_months} months recommended</span>
                <span className="inline-flex items-center gap-1.5"><FileText width={15} height={15} className="text-ink-400" />{program.courses.length} courses · {totalLessons} lessons</span>
                <span className="inline-flex items-center gap-1.5"><Play width={15} height={15} className="text-ink-400" />≈ {totalHours} hours of material</span>
              </dl>
            </div>
            <CoverArt
              category="Program"
              glyph={courseGlyph(program.cover_code)}
              code={program.cover_code}
              variant={program.cover_variant}
              className="hidden aspect-[16/9] w-full rounded-[10px] border border-line lg:block"
            />
          </div>
        </div>
      </section>

      <section className="wrap grid gap-10 py-12 lg:grid-cols-[1fr_21rem] lg:gap-14">
        <div>
          <h2 className="font-display text-[1.3rem] font-bold">About this program</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink-600">{program.description}</p>

          <h2 className="mt-12 font-display text-[1.3rem] font-bold">What you'll achieve</h2>
          <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {outcomes.map((o) => (
              <li key={o} className="flex items-start gap-2.5 text-[0.92rem] leading-relaxed text-ink-700">
                <Check width={16} height={16} className="mt-1 shrink-0 text-moss-500" /> {o}
              </li>
            ))}
          </ul>

          <h2 className="mt-12 font-display text-[1.3rem] font-bold">Courses in this program</h2>
          <div className="mt-5 space-y-4">
            {statsPerCourse.map(({ course, stats }, i) => (
              <article key={course.id} className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                <span className="font-mono text-[0.8rem] font-semibold tabular text-accent-600">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex-1">
                  <p className="mb-1 font-mono text-[0.66rem] uppercase tracking-wider text-accent-700">{course.note}</p>
                  <h3 className="font-display text-[1.05rem] font-semibold">
                    <Link href={`/courses/${course.slug}`} className="hover:text-accent-700">{course.title}</Link>
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[0.87rem] text-ink-500">{course.subtitle}</p>
                  <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-wider text-ink-400">
                    {stats.module_count} modules · {stats.lesson_count} lessons · {course.duration_hours}h · {course.level}
                  </p>
                </div>
                <Link href={`/courses/${course.slug}`} className="btn btn-outline btn-sm shrink-0">Course details</Link>
              </article>
            ))}
          </div>

          <h2 className="mt-12 font-display text-[1.3rem] font-bold">Portfolio outcomes</h2>
          <ul className="mt-4 space-y-2.5">
            {projects.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-[0.92rem] leading-relaxed text-ink-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden /> {p}
              </li>
            ))}
          </ul>

          <h2 className="mt-12 font-display text-[1.3rem] font-bold">Program FAQs</h2>
          <div className="mt-4 divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <details key={f.q} className="acc py-4">
                <summary className="flex items-center justify-between gap-4 font-display text-[0.95rem] font-semibold text-ink-900">
                  {f.q}
                  <ChevronDown width={15} height={15} className="acc-chevron shrink-0 text-ink-400" />
                </summary>
                <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-500">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card p-6">
            <div className="flex items-baseline gap-2.5">
              <span className="font-display text-[1.9rem] font-bold tabular">{rupees(program.price)}</span>
              {program.original_price && (
                <>
                  <span className="text-[0.95rem] text-ink-400 line-through tabular">{rupees(program.original_price)}</span>
                  <span className="badge badge-accent !py-0.5">{discount}% off</span>
                </>
              )}
            </div>
            <p className="mt-1.5 text-[0.78rem] text-ink-400">
              {program.courses.length} courses, purchased together — lifetime access to all.
            </p>
            <div className="mt-5 space-y-2.5">
              <a
                href={`/enquire?topic=${encodeURIComponent("Programs")}&course=${program.courses[0]?.slug ?? ""}`}
                className="btn btn-accent w-full"
              >
                Enroll via advisor <ArrowRight width={15} height={15} />
              </a>
              <Link href="/enquire" className="btn btn-outline w-full">Ask about this program</Link>
            </div>
            <hr className="hr-rule my-5" />
            <p className="eyebrow mb-3">How enrollment works</p>
            <ol className="space-y-3 text-[0.85rem] leading-relaxed text-ink-600">
              <li className="flex gap-2.5"><span className="font-mono text-[0.7rem] text-accent-600">01</span>Submit an enquiry — an advisor confirms your starting point.</li>
              <li className="flex gap-2.5"><span className="font-mono text-[0.7rem] text-accent-600">02</span>You receive a payment link for the program price.</li>
              <li className="flex gap-2.5"><span className="font-mono text-[0.7rem] text-accent-600">03</span>All courses appear in your dashboard immediately after payment.</li>
            </ol>
          </div>
        </aside>
      </section>
    </>
  );
}
