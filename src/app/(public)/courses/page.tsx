import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, getPublishedCourses, searchCourses } from "@/lib/queries";
import { CourseCard } from "@/components/CourseCard";
import { Breadcrumb, EmptyState } from "@/components/ui";
import { Search } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Courses",
  description: "Browse structured programming courses in Java, Python, web development, SQL, React and data structures.",
};

type SearchParams = Promise<{ q?: string; category?: string }>;

export default async function CoursesPage({ searchParams }: { searchParams: SearchParams }) {
  const { q, category } = await searchParams;
  const categories = getCategories();

  const courses =
    (q?.trim() || (category && category !== "all"))
      ? searchCourses(q?.trim() ?? "", category)
      : getPublishedCourses();

  const activeCat = categories.find((c) => c.slug === category);
  const filters = [{ slug: "all", name: "All courses" }, ...categories.filter((c) => courses.some((x) => x.category_slug === c.slug) || c.slug === activeCat?.slug || !q)];

  return (
    <>
      <section className="border-b border-line bg-paper-deep/40">
        <div className="wrap py-10">
          <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "Courses" }]} />
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="font-display text-[1.9rem] font-bold tracking-tight sm:text-[2.2rem]">
                {activeCat ? `${activeCat.name} courses` : q ? `Results for “${q}”` : "Courses"}
              </h1>
              <p className="mt-2 max-w-xl text-[0.93rem] text-ink-500">
                {activeCat?.description ||
                  "Every course follows a written curriculum — numbered modules, checkpoint quizzes and a project. Free preview lessons are marked in each course."}
              </p>
            </div>
            <form action="/courses" method="get" className="flex w-full max-w-sm items-center gap-2" role="search">
              {category && <input type="hidden" name="category" value={category} />}
              <div className="relative flex-1">
                <Search width={16} height={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="search"
                  name="q"
                  defaultValue={q}
                  placeholder="Search courses…"
                  aria-label="Search courses"
                  className="input !pl-9"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm">Search</button>
            </form>
          </div>
        </div>
      </section>

      <section className="wrap py-10">
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {filters.map((f) => {
            const active = (category ?? "all") === f.slug && !q;
            const href = f.slug === "all" ? "/courses" : `/courses?category=${f.slug}`;
            return (
              <Link
                key={f.slug}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full border px-3.5 py-1.5 font-display text-[0.8rem] font-medium transition-colors ${
                  active
                    ? "border-ink-900 bg-ink-900 text-paper"
                    : "border-line-strong bg-surface text-ink-600 hover:border-ink-300 hover:text-ink-900"
                }`}
              >
                {f.name}
              </Link>
            );
          })}
          <span className="ml-auto font-mono text-[0.72rem] uppercase tracking-wider text-ink-400">
            {courses.length} course{courses.length === 1 ? "" : "s"}
          </span>
        </div>

        {courses.length === 0 ? (
          <EmptyState
            icon={<Search />}
            title="No courses match your search"
            body={`We couldn't find a course matching “${q}”. Try a different keyword, or browse the full catalogue.`}
            action={{ href: "/courses", label: "Browse all courses" }}
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} showStatus={c.status === "waitlist"} />
            ))}
          </div>
        )}

        <div className="mt-12 rounded-[10px] border border-dashed border-line-strong bg-paper-deep/40 px-6 py-8 text-center">
          <h2 className="font-display text-[1.05rem] font-semibold text-ink-900">More courses are in the works</h2>
          <p className="mx-auto mt-1.5 max-w-md text-[0.87rem] leading-relaxed text-ink-500">
            Cloud fundamentals and AI &amp; ML tracks are being built with the same curriculum-first process. Have a
            subject you want prioritised? Tell us in an enquiry.
          </p>
          <Link href="/enquire" className="btn btn-outline btn-sm mt-4">Request a topic</Link>
        </div>
      </section>
    </>
  );
}
