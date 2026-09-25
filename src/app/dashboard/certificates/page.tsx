import Link from "next/link";
import { requireUser } from "@/lib/session";
import { getUserCertificates } from "@/lib/queries";
import { EmptyState } from "@/components/ui";
import { Award, External, ShieldCheck } from "@/components/Icons";
import { formatDate } from "@/lib/site";

export default async function CertificatesPage() {
  const user = await requireUser();
  const certificates = getUserCertificates(user.id);

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <h1 className="font-display text-[1.65rem] font-bold tracking-tight sm:text-[1.9rem]">Certificates</h1>
        <p className="mt-1 text-[0.9rem] text-ink-500">
          Issued automatically when you complete every lesson of a course. Each carries a public verification ID.
        </p>
      </header>

      {certificates.length === 0 ? (
        <EmptyState
          icon={<Award />}
          title="No certificates yet"
          body="Complete all lessons in an enrolled course and your certificate will be issued automatically — with an ID anyone can verify."
          action={{ href: "/dashboard/courses", label: "Continue learning" }}
        />
      ) : (
        <ul className="space-y-4">
          {certificates.map((cert) => (
            <li key={cert.id} className="card flex flex-wrap items-center justify-between gap-5 p-6">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink-900 text-paper">
                  <Award width={20} height={20} />
                </span>
                <div>
                  <h2 className="font-display text-[1.02rem] font-semibold">{cert.course_title}</h2>
                  <p className="mt-0.5 font-mono text-[0.72rem] text-ink-400">
                    {cert.id} · issued {formatDate(cert.issued_at)}
                  </p>
                  <p className={`mt-1 inline-flex items-center gap-1 text-[0.75rem] font-medium ${cert.status === "valid" ? "text-moss-600" : "text-accent-700"}`}>
                    <ShieldCheck width={13} height={13} /> {cert.status === "valid" ? "Valid" : "Revoked"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/verify/${cert.id}`} className="btn btn-outline btn-sm">
                  Verification page <External width={13} height={13} />
                </Link>
                <Link href={`/courses/${cert.course_slug}`} className="btn btn-ghost btn-sm">Course</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
