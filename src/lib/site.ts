export const site = {
  name: "KwikStudy",
  tagline: "Practical programming education for the next generation of developers.",
  email: "hello@kwikstudy.in",
  admissionsEmail: "admissions@kwikstudy.in",
  supportEmail: "support@kwikstudy.in",
  phone: "+91 80471 22600",
  hours: "Mon–Sat · 9:00 AM – 7:00 PM IST",
  established: 2021,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export const mainNav = [
  { href: "/courses", label: "Courses" },
  { href: "/programs", label: "Programs" },
  { href: "/about", label: "About" },
  { href: "/instructors", label: "Instructors" },
  { href: "/faq", label: "Resources" },
  { href: "/contact", label: "Contact" },
] as const;

export function rupees(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

export function formatDate(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(iso: string | Date | null | undefined): string {
  if (!iso) return "—";
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}
