import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui";
import { FaqBrowser } from "@/components/FaqBrowser";

export const metadata: Metadata = {
  title: "Help Center & FAQs",
  description: "Answers about courses, payments, learning, certificates, enrollment, technical support and refunds.",
};

export default function FaqPage() {
  return (
    <>
      <section className="border-b border-line bg-paper-deep/40">
        <div className="wrap py-10">
          <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "FAQs" }]} />
          <h1 className="mt-4 font-display text-[1.9rem] font-bold tracking-tight sm:text-[2.2rem]">Help center</h1>
          <p className="mt-2 max-w-xl text-[0.93rem] leading-relaxed text-ink-500">
            Straight answers about how KwikStudy works. If something isn't covered here, our support team replies
            within one working day.
          </p>
        </div>
      </section>
      <section className="wrap py-12">
        <FaqBrowser />
      </section>
    </>
  );
}
