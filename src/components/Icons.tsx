/* Single icon family: 24px grid, 1.6 stroke, currentColor. */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  width: 20, height: 20, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const, "aria-hidden": true, ...props,
});

export const ChevronDown = (p: P) => <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>;
export const ChevronRight = (p: P) => <svg {...base(p)}><path d="m9 6 6 6-6 6" /></svg>;
export const ArrowRight = (p: P) => <svg {...base(p)}><path d="M4 12h16m0 0-6-6m6 6-6 6" /></svg>;
export const ArrowLeft = (p: P) => <svg {...base(p)}><path d="M20 12H4m0 0 6-6m-6 6 6 6" /></svg>;
export const Check = (p: P) => <svg {...base(p)}><path d="m4.5 12.5 5 5L20 7" /></svg>;
export const Search = (p: P) => <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
export const Menu = (p: P) => <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
export const X = (p: P) => <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>;
export const Play = (p: P) => <svg {...base(p)}><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg>;
export const FileText = (p: P) => <svg {...base(p)}><path d="M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5L14 3Z" /><path d="M14 3v4.5h4.5M9 12h6M9 16h6" /></svg>;
export const Clock = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></svg>;
export const BookOpen = (p: P) => <svg {...base(p)}><path d="M12 6.5c-1.5-1.3-3.5-2-6-2H4v13h2c2.5 0 4.5.7 6 2 1.5-1.3 3.5-2 6-2h2v-13h-2c-2.5 0-4.5.7-6 2Z" /><path d="M12 6.5v13" /></svg>;
export const ListChecks = (p: P) => <svg {...base(p)}><path d="m3.5 6 1.5 1.5L8 4.5M3.5 12l1.5 1.5L8 10.5M3.5 18l1.5 1.5L8 16.5M11 6h9.5M11 12h9.5M11 18h9.5" /></svg>;
export const User = (p: P) => <svg {...base(p)}><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.8-3.2 3.6-5 7-5s6.2 1.8 7 5" /></svg>;
export const Users = (p: P) => <svg {...base(p)}><circle cx="9" cy="8.5" r="3" /><path d="M3.5 19c.6-2.8 2.8-4.5 5.5-4.5s4.9 1.7 5.5 4.5M15.5 5.7a3 3 0 0 1 0 5.6M17.5 14.9c1.7.7 2.8 2.1 3.2 4.1" /></svg>;
export const Mail = (p: P) => <svg {...base(p)}><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4.5 7 7.5 6 7.5-6" /></svg>;
export const Phone = (p: P) => <svg {...base(p)}><path d="M6.8 3.5c.6 0 1.2.4 1.4 1l.9 2.3a1.5 1.5 0 0 1-.4 1.7L7.5 9.6a12.5 12.5 0 0 0 6.9 6.9l1.1-1.2a1.5 1.5 0 0 1 1.7-.4l2.3.9c.6.2 1 .8 1 1.4v2.1c0 .9-.7 1.6-1.6 1.5C10.8 20.2 3.8 13.2 3.2 5.1A1.5 1.5 0 0 1 4.7 3.5h2.1Z" /></svg>;
export const Calendar = (p: P) => <svg {...base(p)}><rect x="4" y="5.5" width="16" height="15" rx="2" /><path d="M4 10h16M8.5 3.5v3.5M15.5 3.5v3.5" /></svg>;
export const Award = (p: P) => <svg {...base(p)}><circle cx="12" cy="9" r="5" /><path d="m8.8 13.5-1.3 7 4.5-2.4 4.5 2.4-1.3-7" /></svg>;
export const ShieldCheck = (p: P) => <svg {...base(p)}><path d="M12 3 5 5.8v5.4c0 4.4 3 7.9 7 9.8 4-1.9 7-5.4 7-9.8V5.8L12 3Z" /><path d="m9 11.8 2.2 2.2 4-4.5" /></svg>;
export const Alert = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.8v5M12 16.2v.1" /></svg>;
export const Info = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 7.8v.1" /></svg>;
export const External = (p: P) => <svg {...base(p)}><path d="M14 5h5v5M19 5l-8 8M19 14v4.5A1.5 1.5 0 0 1 17.5 20h-11A1.5 1.5 0 0 1 5 18.5v-11A1.5 1.5 0 0 1 6.5 6H11" /></svg>;
export const Copy = (p: P) => <svg {...base(p)}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" /></svg>;
export const Lock = (p: P) => <svg {...base(p)}><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7" /></svg>;
export const Logout = (p: P) => <svg {...base(p)}><path d="M14 4h4.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H14M10 8l-4 4 4 4M6 12h10" /></svg>;
export const Home = (p: P) => <svg {...base(p)}><path d="m4 11 8-7 8 7M6 9.5V20h12V9.5" /></svg>;
export const Briefcase = (p: P) => <svg {...base(p)}><rect x="3.5" y="7.5" width="17" height="12" rx="2" /><path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5M3.5 12.5h17" /></svg>;
export const Message = (p: P) => <svg {...base(p)}><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H12l-5 4v-4H6.5A2.5 2.5 0 0 1 4 14.5v-8Z" /></svg>;
export const Spark = (p: P) => <svg {...base(p)}><path d="M12 3.5c.7 4.2 1.8 5.3 6 6-4.2.7-5.3 1.8-6 6-.7-4.2-1.8-5.3-6-6 4.2-.7 5.3-1.8 6-6ZM19 15.5c.3 1.8.8 2.3 2.5 2.5-1.7.3-2.2.8-2.5 2.5-.3-1.7-.8-2.2-2.5-2.5 1.7-.2 2.2-.7 2.5-2.5Z" /></svg>;
export const Layers = (p: P) => <svg {...base(p)}><path d="m12 3.5 8.5 4.5L12 12.5 3.5 8 12 3.5ZM3.5 12.5l8.5 4.5 8.5-4.5M3.5 16.5l8.5 4.5 8.5-4.5" /></svg>;
export const Target = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" /></svg>;
export const Compass = (p: P) => <svg {...base(p)}><circle cx="12" cy="12" r="8.5" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></svg>;
export const Eye = (p: P) => <svg {...base(p)}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></svg>;
export const EyeOff = (p: P) => <svg {...base(p)}><path d="M4 4l16 16" /><path d="M10.6 5.9A9.8 9.8 0 0 1 12 5.8c6 0 9.5 6.2 9.5 6.2a17 17 0 0 1-2.5 3.3M6.6 6.9C4 8.5 2.5 12 2.5 12S6 18.2 12 18.2c1.3 0 2.5-.3 3.5-.8" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></svg>;
