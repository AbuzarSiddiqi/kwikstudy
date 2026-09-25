/* Consistent generated course artwork — one family, six pattern variants, no stock imagery. */

const PATTERNS: Record<string, (id: string) => React.ReactNode> = {
  grid: (id) => (
    <pattern id={id} width="28" height="28" patternUnits="userSpaceOnUse">
      <path d="M28 0H0v28" fill="none" stroke="rgba(250,248,242,0.10)" strokeWidth="1" />
    </pattern>
  ),
  dots: (id) => (
    <pattern id={id} width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.4" fill="rgba(250,248,242,0.14)" />
    </pattern>
  ),
  diagonal: (id) => (
    <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="6" height="14" fill="rgba(250,248,242,0.06)" />
    </pattern>
  ),
  waves: (id) => (
    <pattern id={id} width="120" height="26" patternUnits="userSpaceOnUse">
      <path d="M0 13 Q 30 0 60 13 T 120 13" fill="none" stroke="rgba(250,248,242,0.12)" strokeWidth="1.2" />
    </pattern>
  ),
  blocks: (id) => (
    <pattern id={id} width="46" height="46" patternUnits="userSpaceOnUse">
      <rect width="20" height="20" fill="rgba(250,248,242,0.07)" />
      <rect x="24" y="24" width="20" height="20" fill="rgba(250,248,242,0.05)" />
    </pattern>
  ),
  rings: (id) => (
    <pattern id={id} width="90" height="90" patternUnits="userSpaceOnUse">
      <circle cx="45" cy="45" r="30" fill="none" stroke="rgba(250,248,242,0.10)" strokeWidth="1.2" />
      <circle cx="45" cy="45" r="14" fill="none" stroke="rgba(250,248,242,0.08)" strokeWidth="1" />
    </pattern>
  ),
};

export function CoverArt({
  category,
  glyph,
  code,
  variant = "grid",
  layout = "landscape",
  className = "",
}: {
  category: string;
  glyph: string;
  code: string;
  variant?: keyof typeof PATTERNS | string;
  layout?: "landscape" | "portrait";
  className?: string;
}) {
  const pid = `pat-${code}`;
  const pattern = (PATTERNS[variant] ?? PATTERNS.grid)(pid);
  if (layout === "portrait") {
    return (
      <svg viewBox="0 0 400 225" className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${category} artwork`}>
        <rect width="400" height="225" fill="#11202b" />
        <rect width="400" height="225" fill={`url(#${pid})`} />
        <rect x="191" y="38" width="18" height="3" fill="#d5571b" />
        <text x="200" y="62" textAnchor="middle" fill="rgba(250,248,242,0.62)" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="2.2" style={{ textTransform: "uppercase" }}>
          {category.toUpperCase()}
        </text>
        <text x="200" y="140" textAnchor="middle" fill="rgba(250,248,242,0.94)" fontFamily="var(--font-mono)" fontSize="58" fontWeight="500" letterSpacing="2">
          {glyph}
        </text>
        <text x="200" y="186" textAnchor="middle" fill="rgba(250,248,242,0.38)" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1.8">
          {code}
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 225" className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-label={`${category} course artwork`}>
      <rect width="400" height="225" fill="#11202b" />
      <rect width="400" height="225" fill={`url(#${pid})`} />
      <rect x="28" y="30" width="18" height="3" fill="#d5571b" />
      <text x="28" y="52" fill="rgba(250,248,242,0.62)" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="2.2" style={{ textTransform: "uppercase" }}>
        {category.toUpperCase()}
      </text>
      <text
        x="28" y="140"
        fill="rgba(250,248,242,0.94)"
        fontFamily="var(--font-mono)"
        fontSize="64"
        fontWeight="500"
        letterSpacing="1"
      >
        {glyph}
      </text>
      <text x="28" y="196" fill="rgba(250,248,242,0.38)" fontFamily="var(--font-mono)" fontSize="10.5" letterSpacing="1.8">
        {code}
      </text>
      <path d="M336 180h36M354 162l18 18-18 18" stroke="rgba(250,248,242,0.30)" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function courseGlyph(coverCode: string): string {
  const seg = coverCode.split("-")[1] ?? "KS";
  return seg;
}
