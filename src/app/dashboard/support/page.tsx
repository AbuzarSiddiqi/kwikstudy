import Link from "next/link";
import { requireUser } from "@/lib/session";
import { BookOpen, Message, ArrowRight, Alert } from "@/components/Icons";
import { site } from "@/lib/site";

export default async function SupportPage() {
  const user = await requireUser();
  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <h1 className="font-display text-[1.65rem] font-bold tracking-tight sm:text-[1.9rem]">Support</h1>
        <p className="mt-1 text-[0.9rem] text-ink-500">Stuck on something? Here's the fastest route for each kind of problem.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/faq" className="card group p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
          <BookOpen width={20} height={20} className="mb-3 text-accent-600" />
          <h2 className="font-display text-[1rem] font-semibold group-hover:text-accent-700">Help center &amp; FAQs</h2>
          <p className="mt-1.5 text-[0.86rem] leading-relaxed text-ink-500">
            Answers about payments, certificates, refunds and how the platform works.
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-accent-700">
            Browse FAQs <ArrowRight width={14} height={14} />
          </span>
        </Link>

        <Link href="/contact" className="card group p-6 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
          <Message width={20} height={20} className="mb-3 text-accent-600" />
          <h2 className="font-display text-[1rem] font-semibold group-hover:text-accent-700">Contact support</h2>
          <p className="mt-1.5 text-[0.86rem] leading-relaxed text-ink-500">
            Platform issues, account access, receipts — replies within one working day.
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-accent-700">
            Contact us <ArrowRight width={14} height={14} />
          </span>
        </Link>

        <div className="card p-6 sm:col-span-2">
          <Alert width={19} height={19} className="mb-3 text-accent-600" />
          <h2 className="font-display text-[1rem] font-semibold">Reporting a lesson problem</h2>
          <p className="mt-1.5 max-w-2xl text-[0.86rem] leading-relaxed text-ink-500">
            If a lesson, quiz or code example misbehaves, email{" "}
            <a href={`mailto:${site.supportEmail}`} className="link-underline">{site.supportEmail}</a> with the course
            name, the lesson title, and a screenshot if you can. The instructor who owns that course gets the report
            directly.
          </p>
        </div>
      </div>
    </div>
  );
}
