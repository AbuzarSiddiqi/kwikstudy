import { db, parseJson } from "@/lib/db";
import { getCurriculum } from "@/lib/queries";
import { rupees } from "@/lib/site";
import { Eye } from "@/components/Icons";
import Link from "next/link";

export default async function AdminCoursesPage() {
  const courses = db.prepare(
    `SELECT c.*, cat.name AS category_name,
       (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) AS enrollments
     FROM courses c JOIN course_categories cat ON cat.id = c.category_id ORDER BY c.created_at`
  ).all() as { id: string; slug: string; title: string; status: string; price: number; category_name: string; enrollments: number; cover_code: string }[];

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[1.6rem] font-bold tracking-tight sm:text-[1.85rem]">Courses</h1>
          <p className="mt-1 text-[0.9rem] text-ink-500">Course catalogue structure — curriculum and content live in the database.</p>
        </div>
        <span className="badge">{courses.length} courses</span>
      </header>

      <ul className="space-y-3">
        {courses.map((c) => {
          const curriculum = getCurriculum(c.id);
          const lessons = curriculum.reduce((s, m) => s + m.lessons.length, 0);
          return (
            <li key={c.id} className="card flex flex-wrap items-center gap-5 p-5">
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-[0.98rem] font-semibold">{c.title}</span>
                  <span className="badge">{c.category_name}</span>
                  <span className={`badge ${c.status === "published" ? "badge-moss" : c.status === "waitlist" ? "badge-accent" : ""}`}>{c.status}</span>
                </p>
                <p className="mt-1 font-mono text-[0.72rem] uppercase tracking-wider text-ink-400">
                  {c.cover_code} · {curriculum.length} modules · {lessons} lessons
                </p>
              </div>
              <p className="font-display text-[0.9rem] font-bold tabular">{rupees(c.price)}</p>
              <p className="font-mono text-[0.75rem] tabular text-ink-500">{c.enrollments} enrolled</p>
              <Link href={`/courses/${c.slug}`} className="btn btn-outline btn-sm">
                <Eye width={14} height={14} /> View
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
