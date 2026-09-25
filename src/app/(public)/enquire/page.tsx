import type { Metadata } from "next";
import { getPublishedCourses } from "@/lib/queries";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Breadcrumb } from "@/components/ui";
import { Check } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Enquire",
  description: "Ask about courses, fees, batches or corporate training — the KwikStudy academic team responds within one working day.",
};

export default async function EnquirePage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; topic?: string }>;
}) {
  const { course, topic } = await searchParams;
  const courses = getPublishedCourses().map((c) => ({ slug: c.slug, title: c.title }));

  return (
    <>
      <section className="border-b border-line bg-paper-deep/40">
        <div className="wrap py-10">
          <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "Enquire" }]} />
          <h1 className="mt-4 font-display text-[1.9rem] font-bold tracking-tight sm:text-[2.2rem]">Talk to our academic team</h1>
          <p className="mt-2 max-w-xl text-[0.93rem] leading-relaxed text-ink-500">
            Whether you're choosing a first language, planning a career switch or training a team — tell us where you
            are, and we'll suggest the honest next step.
          </p>
        </div>
      </section>

      <section className="wrap grid gap-10 py-12 lg:grid-cols-[1fr_20rem] lg:gap-14">
        <div>
          <EnquiryForm
            courses={courses}
            defaultCourse={course ?? ""}
            defaultTopic={topic ?? "Course enquiry"}
          />
        </div>

        <aside className="space-y-4">
          <div className="card p-6">
            <p className="eyebrow mb-3">What happens next</p>
            <ol className="space-y-3.5 text-[0.87rem] leading-relaxed text-ink-600">
              <li className="flex gap-3"><span className="font-mono text-[0.72rem] font-semibold text-accent-600">01</span>Your enquiry reaches the academic team instantly.</li>
              <li className="flex gap-3"><span className="font-mono text-[0.72rem] font-semibold text-accent-600">02</span>We reply within one working day, by your preferred channel.</li>
              <li className="flex gap-3"><span className="font-mono text-[0.72rem] font-semibold text-accent-600">03</span>If it's useful, we schedule a 15-minute advisory call — free, no pressure.</li>
            </ol>
          </div>
          <div className="card p-6">
            <p className="eyebrow mb-3">We can help with</p>
            <ul className="space-y-2.5 text-[0.87rem] text-ink-600">
              {["Choosing between courses and programs", "Fee structures and current offers", "Batch schedules and formats", "Custom corporate training", "Career-transition planning"].map((x) => (
                <li key={x} className="flex items-start gap-2.5">
                  <Check width={15} height={15} className="mt-0.5 shrink-0 text-moss-500" /> {x}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
