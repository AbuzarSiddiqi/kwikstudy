import type { MetadataRoute } from "next";
import { getPublishedCourses, getPrograms, getInstructors } from "@/lib/queries";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");
  const statics = ["", "/courses", "/programs", "/about", "/instructors", "/contact", "/enquire", "/faq", "/legal/terms", "/legal/privacy", "/legal/refund-policy"];
  const entries: MetadataRoute.Sitemap = statics.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.7,
  }));
  for (const c of getPublishedCourses()) entries.push({ url: `${base}/courses/${c.slug}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 });
  for (const p of getPrograms()) entries.push({ url: `${base}/programs/${p.slug}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 });
  for (const i of getInstructors()) entries.push({ url: `${base}/instructors/${i.slug}`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 });
  return entries;
}
