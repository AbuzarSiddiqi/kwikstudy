import Link from "next/link";
import { requireUser } from "@/lib/session";
import { getEnrolledCourses, getCourseProgress } from "@/lib/queries";
import { parseJson } from "@/lib/db";
import { EmptyState } from "@/components/ui";
import { Briefcase, Check, ArrowRight } from "@/components/Icons";

export default async function ProjectsPage() {
  const user = await requireUser();
  const enrolled = getEnrolledCourses(user.id);

  const projects = enrolled.flatMap((course) => {
    const progress = getCourseProgress(user.id, course.id);
    return parseJson<{ title: string; description: string; tags: string[] }[]>(course.projects, []).map((p) => ({
      course, progress, ...p,
    }));
  });

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <h1 className="font-display text-[1.65rem] font-bold tracking-tight sm:text-[1.9rem]">Projects</h1>
        <p className="mt-1 text-[0.9rem] text-ink-500">
          The practical builds attached to your courses. Projects unlock with their lessons and become portfolio pieces.
        </p>
      </header>

      {projects.length === 0 ? (
        <EmptyState
          icon={<Briefcase />}
          title="No projects yet"
          body="Every KwikStudy course includes hands-on projects. Enroll in a course and its projects will be tracked here."
          action={{ href: "/courses", label: "Explore Courses" }}
        />
      ) : (
        <ul className="space-y-4">
          {projects.map((p) => {
            const ready = p.progress.percent >= 60;
            return (
              <li key={`${p.course.id}-${p.title}`} className="card p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-mono text-[0.66rem] uppercase tracking-wider text-accent-700">{p.course.title}</p>
                    <h2 className="mt-1 font-display text-[1.08rem] font-semibold">{p.title}</h2>
                    <p className="mt-1.5 max-w-2xl text-[0.87rem] leading-relaxed text-ink-500">{p.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.tags.map((t) => <span key={t} className="badge !py-0.5">{t}</span>)}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {p.progress.percent >= 100 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-moss-50 px-3 py-1.5 font-display text-[0.78rem] font-semibold text-moss-700">
                        <Check width={14} height={14} /> Course complete
                      </span>
                    ) : ready ? (
                      <Link href={`/learn/${p.course.slug}`} className="btn btn-accent btn-sm">
                        Start building <ArrowRight width={14} height={14} />
                      </Link>
                    ) : (
                      <span className="badge">{p.progress.percent}% of course done</span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
