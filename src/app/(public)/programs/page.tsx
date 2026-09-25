import Link from "next/link";
import type { Metadata } from "next";
import { getPrograms } from "@/lib/queries";
import { Breadcrumb } from "@/components/ui";
import { CoverArt, courseGlyph } from "@/components/CoverArt";
import { ArrowRight, Check, Clock, Layers } from "@/components/Icons";
import { rupees } from "@/lib/site";

export const metadata: Metadata = {
  title: "Programs",
  description: "Multi-course learning paths — Full Stack, Java Development and DSA & Interview Preparation tracks.",
};

export default function ProgramsPage() {
  const programs = getPrograms();
  return (
    <>
      <section className="border-b border-line bg-paper-deep/40">
        <div className="wrap py-10">
          <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "Programs" }]} />
          <h1 className="mt-4 font-display text-[1.9rem] font-bold tracking-tight sm:text-[2.2rem]">Programs</h1>
          <p className="mt-2 max-w-xl text-[0.93rem] leading-relaxed text-ink-500">
            A program sequences several courses into one coherent path with a combined price — built for students who
            know where they want to end up and want the route mapped.
          </p>
        </div>
      </section>

      <section className="wrap grid gap-6 py-12">
        {programs.map((p) => (
          <article key={p.id} className="card grid gap-0 overflow-hidden lg:grid-cols-[19rem_1fr]">
            <CoverArt
              category="Program"
              glyph={courseGlyph(p.cover_code)}
              code={p.cover_code}
              variant={p.cover_variant}
              layout="portrait"
              className="hidden h-full w-full border-r border-line lg:block"
            />
            <div className="flex flex-col p-7">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="badge">{p.level}</span>
                <span className="badge"><Clock width={12} height={12} /> {p.duration_months} months</span>
                <span className="badge"><Layers width={12} height={12} /> {p.course_count} courses</span>
              </div>
              <h2 className="font-display text-[1.35rem] font-bold">
                <Link href={`/programs/${p.slug}`} className="hover:text-accent-700">{p.title}</Link>
              </h2>
              <p className="mt-2 max-w-2xl text-[0.92rem] leading-relaxed text-ink-500">{p.subtitle}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {(p.course_titles ?? "").split(" · ").map((c) => (
                  <span key={c} className="rounded-md bg-paper-deep px-2.5 py-1 font-mono text-[0.7rem] text-ink-600">{c}</span>
                ))}
              </div>

              <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-[1.3rem] font-bold tabular">{rupees(p.price)}</span>
                  {p.original_price && (
                    <>
                      <span className="text-[0.88rem] text-ink-400 line-through tabular">{rupees(p.original_price)}</span>
                      <span className="badge badge-accent !py-0.5">
                        Save {rupees((p.original_price ?? 0) - p.price)}
                      </span>
                    </>
                  )}
                </div>
                <Link href={`/programs/${p.slug}`} className="btn btn-primary btn-sm">
                  View program <ArrowRight width={15} height={15} />
                </Link>
              </div>
            </div>
          </article>
        ))}

        <div className="rounded-[10px] border border-dashed border-line-strong bg-paper-deep/40 px-6 py-8 text-center">
          <h2 className="font-display text-[1.05rem] font-semibold text-ink-900">Need a custom path?</h2>
          <p className="mx-auto mt-1.5 max-w-md text-[0.87rem] leading-relaxed text-ink-500">
            If your goal combines courses across programs, our academic team can help you sequence them — and advise
            what to skip based on what you already know.
          </p>
          <Link href="/enquire" className="btn btn-outline btn-sm mt-4">Talk to an advisor</Link>
        </div>
      </section>
    </>
  );
}
