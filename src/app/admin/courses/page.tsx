import { coursesWithStats } from "@/lib/queries";
import { rupees } from "@/lib/site";
import { Eye } from "@/components/Icons";
import Link from "next/link";

export default async function AdminCoursesPage() {
  const courses = coursesWithStats();

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[1.6rem] font-bold tracking-tight sm:text-[1.85rem]">Courses</h1>
          <p className="mt-1 text-[0.9rem] text-ink-500">Course catalogue structure — curriculum and content live in the data layer.</p>
        </div>
        <span className="badge">{courses.length} courses</span>
      </header>

      <ul className="space-y-3">
        {courses.map((c) => (
          <li key={c.id} className="card flex flex-wrap items-center gap-5 p-5">
            <div className="min-w-0 flex-1">
              <p className="flex flex-wrap items-center gap-2">
                <span className="font-display text-[0.98rem] font-semibold">{c.title}</span>
                <span className="badge">{c.category_name}</span>
                <span className={`badge ${c.status === "published" ? "badge-moss" : c.status === "waitlist" ? "badge-accent" : ""}`}>{c.status}</span>
              </p>
              <p className="mt-1 font-mono text-[0.72rem] uppercase tracking-wider text-ink-400">
                {c.cover_code} · {c.moduleCount} modules · {c.lessonCount} lessons
              </p>
            </div>
            <p className="font-display text-[0.9rem] font-bold tabular">{rupees(c.price)}</p>
            <p className="font-mono text-[0.75rem] tabular text-ink-500">{c.enrollments} enrolled</p>
            <Link href={`/courses/${c.slug}`} className="btn btn-outline btn-sm">
              <Eye width={14} height={14} /> View
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
