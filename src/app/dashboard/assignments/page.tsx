import Link from "next/link";
import { requireUser } from "@/lib/session";
import { assignmentsForUser } from "@/lib/queries";
import { EmptyState } from "@/components/ui";
import { ListChecks, Check, ArrowRight } from "@/components/Icons";
import { formatDate } from "@/lib/site";

export default async function AssignmentsPage() {
  const user = await requireUser();

  const rows = assignmentsForUser(user.id);

  const pending = rows.filter((r) => !r.submitted_at);
  const submitted = rows.filter((r) => r.submitted_at);

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <h1 className="font-display text-[1.65rem] font-bold tracking-tight sm:text-[1.9rem]">Assignments</h1>
        <p className="mt-1 text-[0.9rem] text-ink-500">
          Practice tasks attached to your enrolled courses. Submit from the lesson page.
        </p>
      </header>

      {rows.length === 0 ? (
        <EmptyState
          icon={<ListChecks />}
          title="No assignments yet"
          body="Assignments appear here when you enroll in courses that include them. Most checkpoint practice happens as quizzes inside lessons."
          action={{ href: "/courses", label: "Browse courses" }}
        />
      ) : (
        <div className="space-y-10">
          {pending.length > 0 && (
            <section>
              <h2 className="eyebrow mb-4 !text-ink-500">Awaiting submission</h2>
              <ul className="space-y-3">
                {pending.map((a) => (
                  <li key={a.id} className="card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-mono text-[0.66rem] uppercase tracking-wider text-accent-700">{a.course_title}</p>
                        <h3 className="mt-1 font-display text-[1rem] font-semibold">{a.title}</h3>
                        <p className="mt-1.5 line-clamp-2 max-w-xl text-[0.85rem] leading-relaxed text-ink-500">{a.brief}</p>
                      </div>
                      <Link href={`/learn/${a.course_slug}/${a.lesson_id}`} className="btn btn-accent btn-sm shrink-0">
                        Open lesson <ArrowRight width={14} height={14} />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {submitted.length > 0 && (
            <section>
              <h2 className="eyebrow mb-4 !text-ink-500">Submitted</h2>
              <ul className="space-y-3">
                {submitted.map((a) => (
                  <li key={a.id} className="card flex flex-wrap items-center justify-between gap-4 p-5">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-display text-[0.95rem] font-semibold text-ink-900">
                        <Check width={15} height={15} className="text-moss-500" /> {a.title}
                      </p>
                      <p className="mt-0.5 text-[0.78rem] text-ink-400">
                        {a.course_title} · submitted {formatDate(a.submitted_at)}
                      </p>
                    </div>
                    <Link href={`/learn/${a.course_slug}/${a.lesson_id}`} className="btn btn-outline btn-sm shrink-0">View</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
