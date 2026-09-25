import type { Metadata } from "next";
import { getPublishedCourses } from "@/lib/queries";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Breadcrumb } from "@/components/ui";
import { Mail, Phone, Clock, Alert } from "@/components/Icons";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the KwikStudy team — admissions, academic support and general enquiries.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course } = await searchParams;
  const courses = getPublishedCourses().map((c) => ({ slug: c.slug, title: c.title }));

  return (
    <>
      <section className="border-b border-line bg-paper-deep/40">
        <div className="wrap py-10">
          <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "Contact" }]} />
          <h1 className="mt-4 font-display text-[1.9rem] font-bold tracking-tight sm:text-[2.2rem]">Contact us</h1>
          <p className="mt-2 max-w-xl text-[0.93rem] leading-relaxed text-ink-500">
            Pick the channel that fits. Admissions questions go to the academic team; account and platform issues go
            straight to support.
          </p>
        </div>
      </section>

      <section className="wrap grid gap-10 py-12 lg:grid-cols-[1fr_21rem] lg:gap-14">
        <div>
          <EnquiryForm courses={courses} defaultTopic="General" defaultCourse={course ?? ""} />
        </div>

        <aside className="space-y-4">
          <div className="card p-6">
            <p className="eyebrow mb-4">Direct channels</p>
            <ul className="space-y-4 text-[0.9rem]">
              <li className="flex gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-paper text-ink-500">
                  <Mail width={16} height={16} />
                </span>
                <div>
                  <p className="font-display text-[0.85rem] font-semibold text-ink-900">Admissions &amp; academic</p>
                  <a href={`mailto:${site.admissionsEmail}`} className="text-ink-600 hover:text-accent-700">{site.admissionsEmail}</a>
                </div>
              </li>
              <li className="flex gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-paper text-ink-500">
                  <Alert width={16} height={16} />
                </span>
                <div>
                  <p className="font-display text-[0.85rem] font-semibold text-ink-900">Student support</p>
                  <a href={`mailto:${site.supportEmail}`} className="text-ink-600 hover:text-accent-700">{site.supportEmail}</a>
                </div>
              </li>
              <li className="flex gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-paper text-ink-500">
                  <Phone width={16} height={16} />
                </span>
                <div>
                  <p className="font-display text-[0.85rem] font-semibold text-ink-900">Phone</p>
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-ink-600 hover:text-accent-700">{site.phone}</a>
                </div>
              </li>
              <li className="flex gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-paper text-ink-500">
                  <Clock width={16} height={16} />
                </span>
                <div>
                  <p className="font-display text-[0.85rem] font-semibold text-ink-900">Working hours</p>
                  <p className="text-ink-600">{site.hours}</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="card p-6">
            <p className="eyebrow mb-3">Before you write</p>
            <p className="text-[0.87rem] leading-relaxed text-ink-500">
              Many questions about fees, certificates and batches are answered in the{" "}
              <a href="/faq" className="link-underline">FAQ</a>. Refund eligibility is documented in the{" "}
              <a href="/legal/refund-policy" className="link-underline">refund policy</a>.
            </p>
          </div>

          <div className="rounded-[10px] border border-dashed border-line-strong bg-paper-deep/40 p-6">
            <p className="eyebrow mb-2">Campus visits</p>
            <p className="text-[0.85rem] leading-relaxed text-ink-500">
              KwikStudy is an online institute, so we don't publish a walk-in address. If your employer is arranging
              corporate training and would like an on-site visit, mention it in your enquiry and we'll schedule one.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
