import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getInstructorBySlug } from "@/lib/queries";
import { parseJson } from "@/lib/store";
import { Breadcrumb, EmptyState } from "@/components/ui";
import { CourseCard } from "@/components/CourseCard";
import { initials } from "@/lib/site";
import { Message } from "@/components/Icons";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const ins = getInstructorBySlug(slug);
  if (!ins) return { title: "Instructor not found" };
  return { title: `${ins.name} — ${ins.role}`, description: ins.bio.slice(0, 155) };
}

export default async function InstructorPage({ params }: { params: Params }) {
  const { slug } = await params;
  const instructor = getInstructorBySlug(slug);
  if (!instructor) notFound();

  const expertise = parseJson<string[]>(instructor.expertise, []);

  return (
    <>
      <section className="border-b border-line bg-paper-deep/40">
        <div className="wrap py-10">
          <Breadcrumb items={[{ href: "/", label: "Home" }, { href: "/instructors", label: "Instructors" }, { label: instructor.name }]} />
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-ink-900 font-mono text-[1.4rem] text-paper">
              {initials(instructor.name)}
            </span>
            <div>
              <h1 className="font-display text-[1.8rem] font-bold tracking-tight sm:text-[2rem]">{instructor.name}</h1>
              <p className="mt-1 text-[0.95rem] text-ink-500">{instructor.role}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {expertise.map((e) => <span key={e} className="badge !py-0.5">{e}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-10 py-12 lg:grid-cols-[1fr_19rem]">
        <div className="min-w-0">
          <h2 className="font-display text-[1.3rem] font-bold">Biography</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-ink-600">{instructor.bio}</p>

          <h2 className="mt-10 font-display text-[1.3rem] font-bold">Teaching approach</h2>
          <div className="mt-3 rounded-[10px] border border-line bg-paper-deep/50 p-5">
            <Message width={18} height={18} className="mb-2 text-accent-600" />
            <p className="leading-relaxed text-ink-700">{instructor.teaching_approach}</p>
          </div>

          <h2 className="mt-10 font-display text-[1.3rem] font-bold">Courses taught</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {instructor.courses.length === 0 ? (
              <div className="sm:col-span-2">
                <EmptyState
                  icon={<Message />}
                  title="No published courses yet"
                  body="This instructor is building their first KwikStudy course. Check back soon."
                  action={{ href: "/courses", label: "Browse other courses" }}
                />
              </div>
            ) : (
              instructor.courses.map((c) => (
                <CourseCard
                  key={c.id}
                  course={{ ...c, instructor_name: instructor.name }}
                />
              ))
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="card p-6">
            <p className="eyebrow mb-3">At a glance</p>
            <dl className="space-y-3 text-[0.88rem]">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Experience</dt>
                <dd className="font-display font-semibold">{instructor.experience_years} years</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Courses</dt>
                <dd className="font-display font-semibold">{instructor.courses.length}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Specialisation</dt>
                <dd className="text-right font-display font-semibold">{expertise[0] ?? "—"}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>
    </>
  );
}
