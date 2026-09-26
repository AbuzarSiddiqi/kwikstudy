import Link from "next/link";
import { requireUser } from "@/lib/session";
import {
  getEnrolledCourses, getCourseProgress, getLearningActivity, getPublishedCourses,
  isEnrolled, pendingAssignmentsForUser, countUserCertificates,
} from "@/lib/queries";
import { ProgressBar, EmptyState } from "@/components/ui";
import { ArrowRight, BookOpen, Award, ListChecks, Spark, ShieldCheck } from "@/components/Icons";
import { formatDate } from "@/lib/site";

export default async function DashboardHome() {
  const user = await requireUser();
  const enrolled = getEnrolledCourses(user.id);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const withProgress = enrolled.map((c) => ({ course: c, progress: getCourseProgress(user.id, c.id) }));
  const active = withProgress.filter((x) => x.progress.percent < 100);
  const current = active.sort((a, b) => b.progress.percent - a.progress.percent)[0];
  const completed = withProgress.filter((x) => x.progress.percent >= 100);
  const activity = getLearningActivity(user.id);

  /* pending assignments across enrolled courses */
  const pendingAssignments = pendingAssignmentsForUser(user.id);

  /* recommended: first 2 published courses not enrolled */
  const recommended = getPublishedCourses().filter((c) => !isEnrolled(user.id, c.id)).slice(0, 2);

  const certificates = { n: countUserCertificates(user.id) };

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="font-display text-[1.65rem] font-bold tracking-tight sm:text-[1.9rem]">
          {greeting}, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-[0.9rem] text-ink-500">
          {active.length > 0
            ? `You're ${current?.progress.percent}% through ${current?.course.title}.`
            : completed.length > 0
              ? "All caught up — consider starting your next course."
              : "Your learning record lives here. Enroll in a course to begin."}
        </p>
      </header>

      {user.role === "admin" && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-accent-200 bg-accent-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-600 text-white">
              <ShieldCheck width={17} height={17} />
            </span>
            <div>
              <p className="font-display text-[0.92rem] font-semibold text-ink-900">You're signed in as an administrator</p>
              <p className="text-[0.82rem] text-ink-500">Manage enquiries, students, courses and payments from the admin panel.</p>
            </div>
          </div>
          <Link href="/admin" className="btn btn-accent btn-sm">Open admin panel <ArrowRight width={14} height={14} /></Link>
        </div>
      )}

      {enrolled.length === 0 ? (
        <EmptyState
          icon={<BookOpen />}
          title="You haven't enrolled in a course yet"
          body="Browse the catalogue and start with a course that matches your goal — every course has free preview lessons."
          action={{ href: "/courses", label: "Explore Courses" }}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* main column */}
          <div className="space-y-6">
            {/* continue learning */}
            {current && (
              <section className="card p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="eyebrow !text-ink-500">Continue learning</h2>
                  <span className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-400">
                    started {formatDate(current.course.enrolled_at)}
                  </span>
                </div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-display text-[1.2rem] font-bold">{current.course.title}</h3>
                    <p className="mt-0.5 text-[0.85rem] text-ink-500">{current.course.category_name} · {current.course.level}</p>
                  </div>
                  <Link href={`/learn/${current.course.slug}`} className="btn btn-accent btn-sm">
                    {current.progress.completed === 0 ? "Start learning" : "Resume"} <ArrowRight width={15} height={15} />
                  </Link>
                </div>
                <ProgressBar value={current.progress.percent} showLabel className="mt-4" />
                <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-[0.83rem] text-ink-500">
                  <span>{current.progress.completed} of {current.progress.total} lessons complete</span>
                  <span className="font-mono text-[0.72rem] uppercase tracking-wider">{current.progress.percent >= 100 ? "Completed" : "In progress"}</span>
                </div>
              </section>
            )}

            {/* my courses */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="eyebrow !text-ink-500">My courses</h2>
                <Link href="/dashboard/courses" className="text-[0.82rem] font-medium text-accent-700 hover:text-accent-600">View all</Link>
              </div>
              <ul className="space-y-3">
                {withProgress.slice(0, 4).map(({ course, progress }) => (
                  <li key={course.id} className="card flex items-center gap-5 p-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-display text-[0.95rem] font-semibold">
                        <Link href={`/learn/${course.slug}`} className="hover:text-accent-700">{course.title}</Link>
                      </h3>
                      <ProgressBar value={progress.percent} showLabel className="mt-2" />
                    </div>
                    <span className={`badge ${progress.percent >= 100 ? "badge-moss" : ""}`}>
                      {progress.percent >= 100 ? "Completed" : `${progress.total - progress.completed} left`}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* side column */}
          <div className="space-y-6">
            {/* activity */}
            <section className="card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="eyebrow !text-ink-500">Learning activity</h2>
                {activity.streak > 1 && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-2.5 py-1 font-mono text-[0.68rem] font-medium text-accent-700">
                    <Spark width={12} height={12} /> {activity.streak}-day streak
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1" aria-label="Lessons completed per day, last 4 weeks">
                {activity.days.map((day) => (
                  <span
                    key={day.date}
                    title={`${day.date}: ${day.count} lesson${day.count === 1 ? "" : "s"}`}
                    className={`h-4 w-4 rounded-[4px] ${
                      day.count === 0 ? "bg-ink-200/50" : day.count < 2 ? "bg-moss-100" : day.count < 4 ? "bg-moss-500/60" : "bg-moss-600"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-3 text-[0.78rem] leading-relaxed text-ink-400">
                Lessons completed per day, last 4 weeks. Consistency beats intensity.
              </p>
            </section>

            {/* assignments */}
            <section className="card p-6">
              <h2 className="eyebrow mb-4 !text-ink-500">Upcoming assignments</h2>
              {pendingAssignments.length === 0 ? (
                <p className="text-[0.85rem] text-ink-400">No assignments due right now.</p>
              ) : (
                <ul className="space-y-3.5">
                  {pendingAssignments.map((a) => (
                    <li key={a.id}>
                      <p className="flex items-start gap-2 font-display text-[0.88rem] font-semibold text-ink-900">
                        <ListChecks width={15} height={15} className="mt-0.5 shrink-0 text-accent-600" />
                        {a.title}
                      </p>
                      <p className="mt-0.5 pl-6 text-[0.78rem] text-ink-400">{a.course_title}</p>
                      <Link href={`/learn/${a.course_slug}/${a.lesson_id}`} className="ml-6 mt-1 inline-block text-[0.78rem] font-medium text-accent-700 hover:text-accent-600">
                        Open lesson →
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* certificates */}
            <section className="card flex items-center gap-4 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-900 text-paper">
                <Award width={19} height={19} />
              </span>
              <div className="flex-1">
                <p className="font-display text-[1.3rem] font-bold tabular">{certificates.n}</p>
                <p className="text-[0.78rem] text-ink-500">certificate{certificates.n === 1 ? "" : "s"} earned</p>
              </div>
              <Link href="/dashboard/certificates" className="btn btn-outline btn-sm">View</Link>
            </section>
          </div>
        </div>
      )}

      {/* recommended */}
      {recommended.length > 0 && (
        <section className="mt-10">
          <h2 className="eyebrow mb-4 !text-ink-500">Recommended next</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {recommended.map((c) => (
              <Link key={c.id} href={`/courses/${c.slug}`} className="card group flex items-center gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-paper-deep font-mono text-[0.65rem] font-semibold text-ink-500">
                  {c.cover_code.split("-")[1]}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-display text-[0.92rem] font-semibold group-hover:text-accent-700">{c.title}</h3>
                  <p className="truncate text-[0.78rem] text-ink-500">{c.category_name} · {c.level}</p>
                </div>
                <ArrowRight width={15} height={15} className="shrink-0 text-ink-300 group-hover:text-accent-600" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
