import Link from "next/link";
import { CoverArt, courseGlyph } from "@/components/CoverArt";
import { ArrowRight, BookOpen, Clock, ListChecks, User } from "@/components/Icons";
import { rupees } from "@/lib/site";
import type { CourseCard as CourseCardRow } from "@/lib/queries";

export function CourseCard({ course, showStatus = false, enrolled = false }: { course: CourseCardRow; showStatus?: boolean; enrolled?: boolean }) {
  return (
    <article className="card group relative flex flex-col overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
      <Link href={`/courses/${course.slug}`} className="block" tabIndex={-1} aria-hidden>
        <CoverArt
          category={course.category_name ?? ""}
          glyph={courseGlyph(course.cover_code)}
          code={course.cover_code}
          variant={course.cover_variant}
          className="aspect-[16/9] w-full border-b border-line"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <span className="eyebrow">{course.category_name}</span>
          {showStatus && (
            <span className={`badge ${enrolled ? "badge-moss" : "badge-accent"}`}>{enrolled ? "Enrolled" : "New batch"}</span>
          )}
        </div>
        <h3 className="mb-1.5 font-display text-[1.05rem] font-semibold leading-snug">
          <Link href={`/courses/${course.slug}`} className="hover:text-accent-700">
            {course.title}
          </Link>
        </h3>
        <p className="mb-4 line-clamp-2 text-[0.86rem] leading-relaxed text-ink-500">{course.subtitle}</p>

        <dl className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.78rem] text-ink-500">
          <span className="inline-flex items-center gap-1.5"><ListChecks width={14} height={14} />{course.level}</span>
          <span className="inline-flex items-center gap-1.5"><Clock width={14} height={14} />{course.duration_hours} hrs</span>
          <span className="inline-flex items-center gap-1.5"><User width={14} height={14} />{course.instructor_name}</span>
        </dl>

        <div className="mt-auto flex items-end justify-between border-t border-line pt-4">
          <div>
            <span className="font-display text-[1.05rem] font-bold text-ink-900 tabular">{rupees(course.price)}</span>
            {course.original_price && (
              <span className="ml-2 text-[0.8rem] text-ink-400 line-through tabular">{rupees(course.original_price)}</span>
            )}
          </div>
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center gap-1.5 font-display text-[0.83rem] font-semibold text-accent-700 transition-colors group-hover:text-accent-600"
          >
            View Course <ArrowRight width={15} height={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
