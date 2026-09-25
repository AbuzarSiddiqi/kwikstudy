import Link from "next/link";
import { ChevronRight } from "@/components/Icons";

export function SectionHeading({
  eyebrow, title, lead, align = "left", dark = false,
}: {
  eyebrow?: string; title: string; lead?: string; align?: "left" | "center"; dark?: boolean;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-2xl`}>
      {eyebrow && (
        <p className={`eyebrow mb-3 flex items-center gap-2 ${align === "center" ? "justify-center" : ""}`}>
          <span className="inline-block h-[3px] w-[18px] bg-accent-600" aria-hidden />
          {eyebrow}
        </p>
      )}
      <h2 className={`font-display text-[1.65rem] font-bold leading-tight sm:text-[2rem] ${dark ? "text-paper" : ""}`}>{title}</h2>
      {lead && <p className={`mt-3 text-[0.95rem] leading-relaxed ${dark ? "text-ink-300" : "text-ink-500"}`}>{lead}</p>}
    </div>
  );
}

export function ProgressBar({ value, className = "", showLabel = false }: { value: number; className?: string; showLabel?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-200/60"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-moss-500 transition-[width] duration-500" style={{ width: `${value}%` }} />
      </div>
      {showLabel && <span className="font-mono text-[0.7rem] font-medium tabular text-ink-500">{value}%</span>}
    </div>
  );
}

export function EmptyState({
  icon, title, body, action,
}: {
  icon: React.ReactNode; title: string; body: string; action?: { href: string; label: string };
}) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-paper-deep text-ink-400">{icon}</div>
      <h3 className="mb-1.5 font-display text-[1.05rem] font-semibold text-ink-900">{title}</h3>
      <p className="mb-5 max-w-sm text-[0.88rem] leading-relaxed text-ink-500">{body}</p>
      {action && (
        <Link href={action.href} className="btn btn-primary btn-sm">
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-[0.78rem] text-ink-500">
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          {i > 0 && <ChevronRight width={12} height={12} className="text-ink-300" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-ink-800 hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-ink-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function StatLine({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="text-[0.85rem] text-ink-500">{label}</dt>
      <dd className="text-right font-display text-[0.88rem] font-semibold text-ink-900">{value}</dd>
    </div>
  );
}
