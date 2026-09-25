import Link from "next/link";
import { requireUser } from "@/lib/session";
import { getEnrolledCourses, getCourseProgress, getPublishedCourses, isEnrolled } from "@/lib/queries";
import { CourseCard } from "@/components/CourseCard";
import { EmptyState, ProgressBar } from "@/components/ui";
import { BookOpen, ArrowRight, Check } from "@/components/Icons";
import { formatDate } from "@/lib/site";

export default async function MyCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ enrolled?: string; already?: string }>;
}) {
  const { enrolled: enrolledTitle, already } = await searchParams;
  const user = await requireUser();
  const enrolled = getEnrolledCourses(user.id);
  const withProgress = enrolled.map((c) => ({ course: c, progress: getCourseProgress(user.id, c.id) }));
  const active = withProgress.filter((x) => x.progress.percent < 100);
  const completed = withProgress.filter((x) => x.progress.percent >= 100);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="font-display text-[1.65rem] font-bold tracking-tight sm:text-[1.9rem]">My courses</h1>
        <p className="mt-1 text-[0.9rem] text-ink-500">Your enrollments and progress — lifetime access to everything here.</p>
      </header>

      {enrolledTitle && (
        <div className="mb-6 flex items-center gap-2.5 rounded-lg border border-moss-100 bg-moss-50 px-4 py-3 text-[0.88rem] font-medium text-moss-700" role="status">
          <Check width={16} height={16} /> Payment successful — welcome to {enrolledTitle}. Your course is ready below.
        </div>
      )}
      {already && (
        <div className="mb-6 rounded-lg border border-line bg-paper-deep/60 px-4 py-3 text-[0.88rem] text-ink-600" role="status">
          You're already enrolled in this course — find it below or continue from the dashboard.
        </div>
      )}

      {enrolled.length === 0 ? (
        <EmptyState
          icon={<BookOpen />}
          title="You haven't enrolled in a course yet"
          body="Your enrolled courses will appear here with progress tracking, so you can pick up exactly where you left off."
          action={{ href: "/courses", label: "Explore Courses" }}
        />
      ) : (
        <div className="space-y-10">
          {active.length > 0 && (
            <section>
              <h2 className="eyebrow mb-4 !text-ink-500">In progress</h2>
              <ul className="space-y-3">
                {active.map(({ course, progress }) => (
                  <li key={course.id} className="card flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-[1.02rem] font-semibold">
                          <Link href={`/learn/${course.slug}`} className="hover:text-accent-700">{course.title}</Link>
                        </h3>
                        <span className="badge">{course.category_name}</span>
                      </div>
                      <p className="mt-1 text-[0.8rem] text-ink-400">
                        Enrolled {formatDate(course.enrolled_at)} · {progress.completed}/{progress.total} lessons
                      </p>
                      <ProgressBar value={progress.percent} showLabel className="mt-3 max-w-md" />
                    </div>
                    <Link href={`/learn/${course.slug}`} className="btn btn-accent btn-sm shrink-0">
                      Continue <ArrowRight width={15} height={15} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {completed.length > 0 && (
            <section>
              <h2 className="eyebrow mb-4 !text-ink-500">Completed</h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {completed.map(({ course }) => (
                  <li key={course.id} className="card p-5">
                    <h3 className="font-display text-[0.98rem] font-semibold">{course.title}</h3>
                    <p className="mt-0.5 text-[0.8rem] text-ink-500">Completed · certificate available</p>
                    <div className="mt-4 flex gap-2">
                      <Link href={`/learn/${course.slug}`} className="btn btn-outline btn-sm">Review</Link>
                      <Link href="/dashboard/certificates" className="btn btn-ghost btn-sm !text-accent-700">Certificate</Link>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      <section className="mt-12">
        <h2 className="eyebrow mb-4 !text-ink-500">Add another skill</h2>
        <Suggestions />
      </section>
    </div>
  );
}

async function Suggestions() {
  const user = await requireUser();
  const others = getPublishedCourses().filter((c) => !isEnrolled(user.id, c.id)).slice(0, 3);
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {others.map((c) => (
        <CourseCard key={c.id} course={c} />
      ))}
    </div>
  );
}
