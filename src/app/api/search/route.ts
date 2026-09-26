import { NextRequest, NextResponse } from "next/server";
import { searchCourses, getPrograms, getInstructors } from "@/lib/queries";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const needle = q.toLowerCase();
  const results: { type: string; title: string; sub: string; href: string }[] = searchCourses(q)
    .slice(0, 6)
    .map((c) => ({ type: "course", title: c.title, sub: `${c.category_name} · Course`, href: `/courses/${c.slug}` }));

  for (const p of getPrograms()) {
    if (results.length >= 10) break;
    if (`${p.title} ${p.subtitle}`.toLowerCase().includes(needle))
      results.push({ type: "program", title: p.title, sub: "Program", href: `/programs/${p.slug}` });
  }

  for (const i of getInstructors()) {
    if (results.length >= 12) break;
    if (`${i.name} ${i.role}`.toLowerCase().includes(needle))
      results.push({ type: "instructor", title: i.name, sub: i.role, href: `/instructors/${i.slug}` });
  }

  return NextResponse.json({ results });
}
