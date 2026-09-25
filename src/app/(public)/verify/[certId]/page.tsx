import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCertificate } from "@/lib/queries";
import { Breadcrumb } from "@/components/ui";
import { CoverArt, courseGlyph } from "@/components/CoverArt";
import { db } from "@/lib/db";
import { ShieldCheck, X } from "@/components/Icons";
import { formatDate, site } from "@/lib/site";

type Params = Promise<{ certId: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { certId } = await params;
  return { title: `Certificate ${certId}`, robots: { index: false } };
}

export default async function VerifyPage({ params }: { params: Params }) {
  const { certId } = await params;
  const cert = getCertificate(certId.toUpperCase());
  if (!cert) notFound();

  const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(cert.course_id) as
    | { title: string; cover_code: string; cover_variant: string; category_id: string } | undefined;
  const cat = course
    ? (db.prepare("SELECT name FROM course_categories WHERE id = ?").get(cert.course_id) as { name: string } | undefined)?.name
    : undefined;

  const valid = cert.status === "valid";

  return (
    <>
      <section className="border-b border-line bg-paper-deep/40">
        <div className="wrap py-10">
          <Breadcrumb items={[{ href: "/", label: "Home" }, { label: "Verify certificate" }]} />
        </div>
      </section>

      <section className="wrap max-w-3xl py-12">
        <div className={`card overflow-hidden ${valid ? "" : "opacity-90"}`}>
          <div className={`flex items-center gap-3 px-6 py-3.5 ${valid ? "bg-moss-50 text-moss-700" : "bg-accent-50 text-accent-700"}`}>
            {valid ? <ShieldCheck width={18} height={18} /> : <X width={18} height={18} />}
            <p className="font-display text-[0.88rem] font-semibold">
              {valid ? "This certificate is valid" : "This certificate has been revoked"}
            </p>
          </div>

          <div className="p-6 sm:p-10">
            <div className="grid gap-8 sm:grid-cols-[1fr_11rem]">
              <div>
                <p className="eyebrow mb-4">Certificate of completion</p>
                <h1 className="font-display text-[1.5rem] font-bold leading-snug">
                  {cert.student_name}
                </h1>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-500">
                  has completed all lessons, quizzes and assignments of
                </p>
                <p className="mt-1 font-display text-[1.2rem] font-semibold text-accent-700">{cert.course_title}</p>

                <dl className="mt-7 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-line pt-6 text-[0.87rem]">
                  <div>
                    <dt className="text-ink-500">Certificate ID</dt>
                    <dd className="mt-0.5 font-mono font-medium text-ink-900">{cert.id}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-500">Issued on</dt>
                    <dd className="mt-0.5 font-display font-semibold">{formatDate(cert.issued_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-500">Issued by</dt>
                    <dd className="mt-0.5 font-display font-semibold">{site.name}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-500">Status</dt>
                    <dd className={`mt-0.5 font-display font-semibold ${valid ? "text-moss-600" : "text-accent-700"}`}>
                      {valid ? "Valid" : "Revoked"}
                    </dd>
                  </div>
                </dl>
              </div>
              {course && (
                <CoverArt
                  category={cat ?? "Course"}
                  glyph={courseGlyph(course.cover_code)}
                  code={course.cover_code}
                  variant={course.cover_variant}
                  className="hidden aspect-[16/9] w-full self-center rounded-lg border border-line sm:block"
                />
              )}
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-[0.8rem] leading-relaxed text-ink-400">
          Anyone holding this certificate ID can verify it at this page. Certificates confirm completion of a
          KwikStudy curriculum; they are not academic degrees.
        </p>
      </section>
    </>
  );
}
