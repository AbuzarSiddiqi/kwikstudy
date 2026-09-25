import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Check } from "@/components/Icons";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* brand panel */}
      <aside className="relative hidden flex-col justify-between bg-ink-950 p-10 text-paper lg:flex">
        <div className="bp-grid-dark absolute inset-0" aria-hidden />
        <div className="relative">
          <Link href="/" aria-label="KwikStudy home" className="inline-block">
            <Logo dark />
          </Link>
        </div>
        <div className="relative max-w-md">
          <p className="eyebrow mb-4 !text-ink-400">Why students choose KwikStudy</p>
          <ul className="space-y-4 text-[0.92rem] leading-relaxed text-ink-300">
            {[
              "Structured curricula with published module plans — see exactly what you'll learn before you enroll.",
              "Checkpoint quizzes and projects in every course, so progress is proven, not assumed.",
              "Certificates verifiable by ID, lifetime access to enrolled courses.",
            ].map((x) => (
              <li key={x} className="flex gap-3">
                <Check width={17} height={17} className="mt-0.5 shrink-0 text-accent-500" />
                {x}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-[0.78rem] text-ink-400">
          © {new Date().getFullYear()} KwikStudy Education LLP
        </p>
      </aside>

      {/* form panel */}
      <main className="flex flex-col px-6 py-8 sm:px-12">
        <div className="lg:hidden">
          <Link href="/"><Logo /></Link>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
