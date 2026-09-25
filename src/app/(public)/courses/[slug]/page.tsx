import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCourseBySlug, getCurriculum, getCourseStats, isEnrolled, getCourseProgress } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import { parseJson } from "@/lib/db";
import { Breadcrumb, StatLine, ProgressBar } from "@/components/ui";
import { CoverArt, courseGlyph } from "@/components/CoverArt";
import { Check, ChevronDown, Clock, FileText, Play, User, ArrowRight, Award, Lock, Target } from "@/components/Icons";
import { rupees } from "@/lib/site";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) return { title: "Course not found" };
  return {
    title: course.title,
    description: course.subtitle,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      title: `${course.title} · KwikStudy`,
      description: course.subtitle,
      type: "website",
    },
  };
}

function LessonIcon({ type }: { type: string }) {
  if (type === "video") return <Play width={13} height={13} />;
  if (type === "quiz") return <Award width={13} height={13} />;
  if (type === "assignment") return <FileText width={13} height={13} />;
  return <FileText width={13} height={13} />;
}

const TYPE_LABEL: Record<string, string> = { video: "Video", text: "Lesson", quiz: "Quiz", assignment: "Assignment" };

export default async function CourseDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course || course.status === "draft") notFound();

  const curriculum = getCurriculum(course.id);
  const stats = getCourseStats(course.id);
  const outcomes = parseJson<string[]>(course.outcomes, []);
  const requirements = parseJson<string[]>(course.requirements, []);
  const projects = parseJson<{ title: string; description: string; tags: string[] }[]>(course.projects, []);
  const faqs = parseJson<{ q: string; a: string }[]>(course.faqs, []);

  const user = await getCurrentUser();
  const enrolled = user ? isEnrolled(user.id, course.id) : false;
  const progress = enrolled && user ? getCourseProgress(user.id, course.id) : null;
  const discount = course.original_price ? Math.round(((course.original_price - course.price) / course.original_price) * 100) : 0;

  const firstFree = curriculum.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleIdx: m.idx }))).find((l) => l.is_free_preview);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.subtitle,
    provider: { "@type": "Organization", name: "KwikStudy", sameAs: "/" },
    educationalLevel: course.level,
    inLanguage: course.language,
    offers: {
      "@type": "Offer",
      price: course.price,
      priceCurrency: "INR",
      availability: course.status === "waitlist" ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: `PT${course.duration_hours}H`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* header */}
      <section className="border-b border-line bg-paper-deep/40">
        <div className="wrap py-10">
          <Breadcrumb items={[{ href: "/", label: "Home" }, { href: "/courses", label: "Courses" }, { label: course.title }]} />
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Link href={`/courses?category=${course.category_slug}`} className="badge badge-accent">{course.category_name}</Link>
                <span className="badge">{course.level}</span>
                <span className="badge">{course.language}</span>
              </div>
              <h1 className="font-display text-[1.9rem] font-bold tracking-tight sm:text-[2.25rem]">{course.title}</h1>
              <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-ink-600">{course.subtitle}</p>
              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-[0.84rem] text-ink-600">
                <span className="inline-flex items-center gap-1.5"><Clock width={15} height={15} className="text-ink-400" />{course.duration_hours} hours total</span>
                <span className="inline-flex items-center gap-1.5"><FileText width={15} height={15} className="text-ink-400" />{stats.module_count} modules · {stats.lesson_count} lessons</span>
                <span className="inline-flex items-center gap-1.5"><Play width={15} height={15} className="text-ink-400" />{projects.length} projects</span>
                <span className="inline-flex items-center gap-1.5"><User width={15} height={15} className="text-ink-400" />{course.instructor_name}</span>
              </dl>
            </div>
            <div className="hidden lg:block">
              <CoverArt
                category={course.category_name}
                glyph={courseGlyph(course.cover_code)}
                code={course.cover_code}
                variant={course.cover_variant}
                className="aspect-[16/9] w-full rounded-[10px] border border-line"
              />
            </div>
          </div>
        </div>
      </section>

      {/* body */}
      <section className="wrap grid gap-10 py-12 lg:grid-cols-[1fr_21rem] lg:gap-14">
        <div className="min-w-0">
          {/* overview */}
          <h2 className="font-display text-[1.3rem] font-bold">Overview</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink-600">{course.description}</p>

          {/* outcomes */}
          <h2 className="mt-12 font-display text-[1.3rem] font-bold">What you'll learn</h2>
          <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {outcomes.map((o) => (
              <li key={o} className="flex items-start gap-2.5 text-[0.92rem] leading-relaxed text-ink-700">
                <Check width={16} height={16} className="mt-1 shrink-0 text-moss-500" /> {o}
              </li>
            ))}
          </ul>

          {/* curriculum */}
          <div id="curriculum" className="mt-12 scroll-mt-28">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-[1.3rem] font-bold">Curriculum</h2>
              <p className="font-mono text-[0.72rem] uppercase tracking-wider text-ink-400">
                {stats.module_count} modules · {stats.lesson_count} lessons · {Math.round(stats.total_min / 60)}h content
              </p>
            </div>
            <div className="mt-5 divide-y divide-line rounded-[10px] border border-line bg-surface">
              {curriculum.map((mod) => {
                const modMin = mod.lessons.reduce((s, l) => s + l.duration_min, 0);
                return (
                  <details key={mod.id} className="acc" open={mod.idx === 1}>
                    <summary className="flex items-center gap-4 px-5 py-4">
                      <span className="font-mono text-[0.72rem] font-semibold tabular text-accent-600">
                        {String(mod.idx).padStart(2, "0")}
                      </span>
                      <span className="flex-1">
                        <span className="block font-display text-[0.98rem] font-semibold text-ink-900">{mod.title}</span>
                        <span className="block font-mono text-[0.68rem] uppercase tracking-wider text-ink-400">
                          {mod.lessons.length} lessons · {Math.floor(modMin / 60)}h {modMin % 60}m
                        </span>
                      </span>
                      <ChevronDown width={16} height={16} className="acc-chevron shrink-0 text-ink-400" />
                    </summary>
                    <ul className="border-t border-line px-5 pb-2">
                      {mod.lessons.map((l) => (
                        <li key={l.id} className="flex items-center gap-3 border-b border-line/70 py-2.5 last:border-0">
                          <span className="text-ink-400"><LessonIcon type={l.type} /></span>
                          <span className="flex-1 text-[0.88rem] text-ink-700">{l.title}</span>
                          {l.is_free_preview ? (
                            <span className="badge badge-accent !py-0.5">Free preview</span>
                          ) : (
                            <Lock width={13} height={13} className="text-ink-300" />
                          )}
                          <span className="w-12 text-right font-mono text-[0.7rem] tabular text-ink-400">{l.duration_min}m</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                );
              })}
            </div>
          </div>

          {/* projects */}
          <h2 className="mt-12 font-display text-[1.3rem] font-bold">Projects you'll build</h2>
          <ol className="mt-5 space-y-4">
            {projects.map((p, i) => (
              <li key={p.title} className="card flex gap-5 p-5">
                <span className="font-mono text-[0.75rem] font-semibold tabular text-accent-600">P{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-[0.98rem] font-semibold text-ink-900">{p.title}</h3>
                  <p className="mt-1 text-[0.88rem] leading-relaxed text-ink-500">{p.description}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => <span key={t} className="badge !py-0.5">{t}</span>)}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {/* requirements */}
          <h2 className="mt-12 font-display text-[1.3rem] font-bold">Requirements</h2>
          <ul className="mt-4 space-y-2.5">
            {requirements.map((r) => (
              <li key={r} className="flex items-start gap-2.5 text-[0.92rem] leading-relaxed text-ink-600">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-300" aria-hidden /> {r}
              </li>
            ))}
          </ul>

          {/* faqs */}
          <h2 className="mt-12 font-display text-[1.3rem] font-bold">Course FAQs</h2>
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

        {/* sidebar */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card p-6">
            {enrolled && progress ? (
              <>
                <p className="eyebrow mb-2">Your progress</p>
                <div className="mb-1 flex items-baseline justify-between">
                  <span className="font-display text-[1.6rem] font-bold tabular">{progress.percent}%</span>
                  <span className="font-mono text-[0.7rem] text-ink-400">{progress.completed}/{progress.total} lessons</span>
                </div>
                <ProgressBar value={progress.percent} className="mb-5" />
                <Link href={`/learn/${course.slug}`} className="btn btn-accent w-full">
                  {progress.percent === 100 ? "Review course" : "Continue learning"} <ArrowRight width={15} height={15} />
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-display text-[1.9rem] font-bold tabular text-ink-900">{rupees(course.price)}</span>
                  {course.original_price && (
                    <>
                      <span className="text-[0.95rem] text-ink-400 line-through tabular">{rupees(course.original_price)}</span>
                      <span className="badge badge-accent !py-0.5">{discount}% off</span>
                    </>
                  )}
                </div>
                <p className="mt-1.5 text-[0.78rem] text-ink-400">One-time payment · Lifetime access</p>

                <div className="mt-5 space-y-2.5">
                  {course.status === "waitlist" ? (
                    <Link href={`/enquire?course=${course.slug}`} className="btn btn-primary w-full">Join the waitlist</Link>
                  ) : (
                    <Link href={`/checkout/${course.slug}`} className="btn btn-accent w-full">Enroll now</Link>
                  )}
                  <Link href={`/enquire?course=${course.slug}`} className="btn btn-outline w-full">Enquire about this course</Link>
                  {firstFree && (
                    <Link
                      href={`/learn/${course.slug}/${firstFree.id}`}
                      className="btn btn-ghost w-full !text-accent-700"
                    >
                      <Play width={14} height={14} /> Preview a free lesson
                    </Link>
                  )}
                </div>
              </>
            )}

            <hr className="hr-rule my-5" />
            <p className="eyebrow mb-3">This course includes</p>
            <ul className="space-y-2.5 text-[0.87rem] text-ink-600">
              <li className="flex items-center gap-2.5"><Play width={14} height={14} className="text-ink-400" />{Math.round(stats.total_min / 60)} hours of lessons</li>
              <li className="flex items-center gap-2.5"><FileText width={14} height={14} className="text-ink-400" />{stats.module_count} modules · {stats.lesson_count} lessons</li>
              <li className="flex items-center gap-2.5"><Award width={14} height={14} className="text-ink-400" />Checkpoint quizzes &amp; exercises</li>
              <li className="flex items-center gap-2.5"><Target width={14} height={14} className="text-ink-400" />{projects.length} hands-on project{projects.length > 1 ? "s" : ""}</li>
              <li className="flex items-center gap-2.5"><User width={14} height={14} className="text-ink-400" />Instructor doubt support</li>
              <li className="flex items-center gap-2.5"><Award width={14} height={14} className="text-ink-400" />Verifiable certificate on completion</li>
            </ul>
            <p className="mt-5 rounded-lg bg-paper-deep/70 px-3.5 py-3 text-[0.78rem] leading-relaxed text-ink-500">
              Questions about batches or fees? Write to{" "}
              <Link href="/enquire" className="link-underline">our academic team</Link> — replies within one working day.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
