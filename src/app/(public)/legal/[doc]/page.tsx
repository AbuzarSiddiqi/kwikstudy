import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui";
import { site } from "@/lib/site";

type Doc = { title: string; updated: string; sections: { h: string; p: string[] }[] };

const DOCS: Record<string, Doc> = {
  terms: {
    title: "Terms of Use",
    updated: "March 2026",
    sections: [
      { h: "1. About these terms", p: [
        `These terms govern your use of the ${site.name} website and learning platform. By creating an account or enrolling in a course, you accept them. If you have questions, write to ${site.email} before enrolling.`,
      ]},
      { h: "2. Your account", p: [
        "You are responsible for the accuracy of your registration details and for keeping your password secure. Accounts are personal: sharing access with others, or enrolling on behalf of another person, is not permitted and may lead to suspension.",
      ]},
      { h: "3. Courses and access", p: [
        "Enrollment grants you a personal, non-transferable licence to access the enrolled course for your own learning. Access does not expire, but we may modify or discontinue individual courses; where a course is retired, enrolled students retain access to their completed progress and certificates.",
      ]},
      { h: "4. Acceptable use", p: [
        "Course content — lessons, code examples, quizzes, assignments — is copyrighted by KwikStudy and its instructors. You may take notes and use examples in your own projects, but you may not redistribute, resell or publicly republish course material, or scrape the platform.",
      ]},
      { h: "5. Certificates", p: [
        "Certificates confirm completion of a KwikStudy curriculum and carry a verifiable ID. They are not academic degrees or government-recognised accreditation, and we make no claim otherwise.",
      ]},
      { h: "6. Liability", p: [
        "The platform is provided with care but without warranty of uninterrupted availability. To the extent permitted by law, KwikStudy's liability for any claim relating to a course is limited to the amount you paid for that course.",
      ]},
      { h: "7. Changes", p: [
        "We may update these terms as the platform evolves. Material changes are announced on the site or by email at least 14 days before taking effect.",
      ]},
    ],
  },
  privacy: {
    title: "Privacy Policy",
    updated: "March 2026",
    sections: [
      { h: "1. What we collect", p: [
        "Account data: your name, email address and (optionally) phone number. Learning data: your enrollments, lesson progress, quiz attempts and assignment submissions. Enquiry data: whatever you choose to tell us in an enquiry or support message. Payment data is handled by our payment gateway; we store only the transaction record, never card details.",
      ]},
      { h: "2. How we use it", p: [
        "To run your learning experience — progress tracking, certificates, receipts; to respond to enquiries and provide support; to send service announcements such as batch updates. We do not sell personal data, and we do not display enquiry or account information publicly.",
      ]},
      { h: "3. Certificates", p: [
        "Certificate verification pages display the student name, course and issue date to anyone who has the certificate ID. This is the intended function of verification; there is no way to look up certificates by person.",
      ]},
      { h: "4. Cookies", p: [
        "We use a single first-party session cookie to keep you logged in. We do not use advertising or cross-site tracking cookies.",
      ]},
      { h: "5. Your choices", p: [
        `You can update your profile from the dashboard. To export or delete your account data, write to ${site.supportEmail} — deletion requests are processed within 30 days, except records we must retain for accounting.`,
      ]},
    ],
  },
  "refund-policy": {
    title: "Refund Policy",
    updated: "March 2026",
    sections: [
      { h: "1. The 7-day window", p: [
        "If a course isn't right for you, write to " + site.supportEmail + " within 7 days of purchase, having completed less than 20% of the course, and we will refund the full amount to your original payment method. No interrogation, no alternative-offer pressure.",
      ]},
      { h: "2. Beyond 7 days", p: [
        "Refund requests after 7 days, or where more than 20% of the course is completed, are considered individually — for example in cases of accidental duplicate purchase or platform failure. Our default is fairness, decided by a person, not a template.",
      ]},
      { h: "3. Programs and bundles", p: [
        "For multi-course programs, the same rules apply to the program price as a whole. Individual courses already completed inside a program are deducted at their standalone price if a partial refund is agreed.",
      ]},
      { h: "4. Processing", p: [
        "Approved refunds are initiated within 3 working days. Depending on your bank or UPI provider, the amount typically appears in 5–10 working days. Transaction charges, where the gateway levies them on refunds, are borne by KwikStudy.",
      ]},
      { h: "5. Certificates and refunds", p: [
        "If a certificate was issued before a refund is granted, the certificate is voided and its verification page will show it as revoked.",
      ]},
    ],
  },
};

type Params = Promise<{ doc: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { doc } = await params;
  const d = DOCS[doc];
  return d ? { title: d.title, description: `${d.title} of KwikStudy.` } : { title: "Not found" };
}

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}

export default async function LegalPage({ params }: { params: Params }) {
  const { doc } = await params;
  const d = DOCS[doc];
  if (!d) notFound();

  return (
    <>
      <section className="border-b border-line bg-paper-deep/40">
        <div className="wrap py-10">
          <Breadcrumb items={[{ href: "/", label: "Home" }, { label: d.title }]} />
          <h1 className="mt-4 font-display text-[1.8rem] font-bold tracking-tight sm:text-[2.1rem]">{d.title}</h1>
          <p className="mt-2 font-mono text-[0.75rem] uppercase tracking-wider text-ink-400">Last updated — {d.updated}</p>
        </div>
      </section>
      <section className="wrap max-w-3xl py-12">
        <div className="space-y-9">
          {d.sections.map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-[1.15rem] font-bold">{s.h}</h2>
              {s.p.map((p, i) => (
                <p key={i} className="mt-2.5 leading-relaxed text-ink-600">{p}</p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
