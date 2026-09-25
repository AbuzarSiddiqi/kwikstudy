/* KwikStudy mark + wordmark. */
export function Logo({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  const ink = dark ? "#faf8f2" : "#11202b";
  const accent = "#c04a12";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
        <rect x="1" y="1" width="30" height="30" rx="7" fill={ink} />
        <path d="M11 8v16M11 16l8-8M11 16l8 8" stroke="#faf8f2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="21.5" y="8" width="3.5" height="3.5" rx="0.75" fill={accent} />
      </svg>
      <span
        className="font-display text-[1.15rem] font-bold tracking-tight"
        style={{ color: ink }}
      >
        Kwik<span style={{ color: accent }}>Study</span>
      </span>
    </span>
  );
}
