import { NextRequest, NextResponse } from "next/server";
import { searchCourses } from "@/lib/queries";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const courses = searchCourses(q).slice(0, 6);
  const results: { type: string; title: string; sub: string; href: string }[] = courses.map((c) => ({
    type: "course",
    title: c.title,
    sub: `${c.category_name} · Course`,
    href: `/courses/${c.slug}`,
  }));

  const like = `%${q}%`;
  const programs = db
    .prepare("SELECT slug, title FROM programs WHERE status = 'published' AND (title LIKE ? OR subtitle LIKE ?) LIMIT 3")
    .all(like, like) as { slug: string; title: string }[];
  for (const p of programs) results.push({ type: "program", title: p.title, sub: "Program", href: `/programs/${p.slug}` });

  const instructors = db
    .prepare("SELECT slug, name, role FROM instructors WHERE name LIKE ? OR role LIKE ? LIMIT 3")
    .all(like, like) as { slug: string; name: string; role: string }[];
  for (const i of instructors) results.push({ type: "instructor", title: i.name, sub: i.role, href: `/instructors/${i.slug}` });

  return NextResponse.json({ results });
}
