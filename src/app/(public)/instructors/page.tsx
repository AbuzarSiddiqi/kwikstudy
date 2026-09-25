import Link from "next/link";
import type { Metadata } from "next";
import { getInstructors } from "@/lib/queries";
import { parseJson } from "@/lib/db";
import { Breadcrumb } from "@/components/ui";
import { initials } from "@/lib/site";

export const metadata: Metadata = {
  title: "Instructors",
  description: "Meet the practising engineers who design and teach KwikStudy courses.",
};

export default function InstructorsPage() {
  const instructors = getInstructors();
  return (
    <>
      <section className="border-b border-line bg-paper-deep/40">
        <div className="wrap py-10">
          <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "Instructors" }]} />
          <h1 className="mt-4 font-display text-[1.9rem] font-bold tracking-tight sm:text-[2.2rem]">Instructors</h1>
          <p className="mt-2 max-w-xl text-[0.93rem] leading-relaxed text-ink-500">
            KwikStudy courses are designed and taught by practising engineers. Every instructor's background, courses
            and teaching approach are public — because you should know who you're learning from.
          </p>
        </div>
      </section>

      <section className="wrap grid gap-5 py-12 sm:grid-cols-2">
        {instructors.map((ins) => {
          const expertise = parseJson<string[]>(ins.expertise, []);
          return (
            <article key={ins.id} className="card flex flex-col p-7">
              <div className="mb-5 flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-900 font-mono text-[1rem] text-paper">
                  {initials(ins.name)}
                </span>
                <div>
                  <h2 className="font-display text-[1.15rem] font-bold">
                    <Link href={`/instructors/${ins.slug}`} className="hover:text-accent-700">{ins.name}</Link>
                  </h2>
                  <p className="text-[0.83rem] text-ink-500">{ins.role}</p>
                </div>
              </div>
              <p className="line-clamp-3 flex-1 text-[0.9rem] leading-relaxed text-ink-600">{ins.bio}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {expertise.slice(0, 3).map((e) => <span key={e} className="badge !py-0.5">{e}</span>)}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                <span className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-400">
                  {ins.experience_years} yrs · {ins.course_count} course{ins.course_count > 1 ? "s" : ""}
                </span>
                <Link href={`/instructors/${ins.slug}`} className="font-display text-[0.85rem] font-semibold text-accent-700 hover:text-accent-600">
                  View profile →
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
