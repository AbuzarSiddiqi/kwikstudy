/* Seed toolkit: block types, terse authoring helpers, deterministic ids. */

export type { Block } from "@/lib/blocks";
import type { Block } from "@/lib/blocks";

export const t = (md: string): Block => ({ type: "text", md });
export const c = (lang: string, code: string, filename?: string): Block => ({ type: "code", lang, code, filename });
export const tip = (title: string, body: string): Block => ({ type: "callout", variant: "tip", title, body });
export const note = (title: string, body: string): Block => ({ type: "callout", variant: "note", title, body });
export const warn = (title: string, body: string): Block => ({ type: "callout", variant: "warn", title, body });
export const vid = (duration: string, chapters?: { t: string; label: string }[]): Block => ({ type: "video", duration, chapters });
export const obj = (items: string[]): Block => ({ type: "objectives", items });
export const quiz = (): Block => ({ type: "quiz" });
export const assignment = (): Block => ({ type: "assignment" });

export type LessonSeed = {
  title: string;
  type?: "video" | "text" | "quiz" | "assignment";
  min?: number;
  free?: boolean;
  blocks: Block[];
  quiz?: { pass: number; questions: { q: string; opts: string[]; correct: number; why: string }[] };
  assignment?: { title: string; brief: string; max?: number };
  resources?: { title: string; kind: string }[];
};

export type ModuleSeed = { title: string; summary?: string; lessons: LessonSeed[] };

export type CourseSeed = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  level: string;
  language?: string;
  duration_hours: number;
  price: number;
  original_price?: number;
  status?: "published" | "draft" | "waitlist";
  cover_variant: "grid" | "dots" | "diagonal" | "waves" | "blocks" | "rings";
  cover_code: string;
  outcomes: string[];
  requirements: string[];
  projects: { title: string; description: string; tags: string[] }[];
  faqs: { q: string; a: string }[];
  instructors: { slug: string; role: string }[];
  modules: ModuleSeed[];
};

/* ---------- id helpers ---------- */

const pad = (n: number, w = 2) => String(n).padStart(w, "0");

export function lessonId(courseId: string, m: number, l: number) {
  return `les_${courseId.replace(/^crs_/, "")}_${pad(m)}${pad(l)}`;
}

export { pad };
