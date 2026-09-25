import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Mail, Phone, Clock } from "@/components/Icons";
import { site } from "@/lib/site";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Learn",
    links: [
      { href: "/courses", label: "Courses" },
      { href: "/programs", label: "Programs" },
      { href: "/courses?category=data-structures", label: "Data Structures" },
      { href: "/courses?category=databases", label: "Databases" },
      { href: "/courses?category=web-development", label: "Web Development" },
    ],
  },
  {
    title: "Institute",
    links: [
      { href: "/about", label: "About KwikStudy" },
      { href: "/instructors", label: "Instructors" },
      { href: "/contact", label: "Contact" },
      { href: "/enquire", label: "Enquire" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/faq", label: "Help Center & FAQs" },
      { href: "/contact", label: "Contact Support" },
      { href: "/legal/refund-policy", label: "Refund Policy" },
      { href: "/legal/terms", label: "Terms of Use" },
      { href: "/legal/privacy", label: "Privacy Policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-deep/60">
      <div className="wrap py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-[0.87rem] leading-relaxed text-ink-500">{site.tagline}</p>
            <ul className="mt-5 space-y-2 text-[0.83rem] text-ink-500">
              <li><a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-ink-800"><Mail width={14} height={14} />{site.email}</a></li>
              <li><a href={`tel:${site.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:text-ink-800"><Phone width={14} height={14} />{site.phone}</a></li>
              <li><span className="inline-flex items-center gap-2"><Clock width={14} height={14} />{site.hours}</span></li>
            </ul>
          </div>
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="eyebrow mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[0.87rem] text-ink-600 transition-colors hover:text-accent-700">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="wrap flex flex-col items-start justify-between gap-3 py-5 text-[0.78rem] text-ink-400 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} KwikStudy Education LLP. All rights reserved.</p>
          <p className="font-mono text-[0.72rem] tracking-wider">EST. {site.established}</p>
        </div>
      </div>
    </footer>
  );
}
