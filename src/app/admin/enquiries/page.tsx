import { courseTitleMap, enquiryStatusCounts, listEnquiries } from "@/lib/queries";
import { EnquiryStatusSelect } from "@/components/EnquiryStatusSelect";
import { formatDateTime } from "@/lib/site";
import { EmptyState } from "@/components/ui";
import { Message } from "@/components/Icons";

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const rows = listEnquiries(status && ["new", "contacted", "closed"].includes(status) ? status : undefined);
  const courses = courseTitleMap();
  const counts = enquiryStatusCounts();

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[1.6rem] font-bold tracking-tight sm:text-[1.85rem]">Enquiries</h1>
          <p className="mt-1 text-[0.9rem] text-ink-500">
            {counts.new} new · {counts.contacted} contacted · {counts.closed} closed
          </p>
        </div>
        <nav className="flex gap-2" aria-label="Filter by status">
          {["", "new", "contacted", "closed"].map((s) => (
            <a
              key={s || "all"}
              href={s ? `/admin/enquiries?status=${s}` : "/admin/enquiries"}
              className={`rounded-full border px-3 py-1.5 font-display text-[0.78rem] font-medium ${
                (status ?? "") === s ? "border-ink-900 bg-ink-900 text-paper" : "border-line-strong bg-surface text-ink-600 hover:border-ink-300"
              }`}
            >
              {s || "All"}
            </a>
          ))}
        </nav>
      </header>

      {rows.length === 0 ? (
        <EmptyState icon={<Message />} title="No enquiries here" body="When students submit enquiries from the public site, they'll appear in this queue." />
      ) : (
        <ul className="space-y-4">
          {rows.map((e) => (
            <li key={e.id} className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-[1rem] font-semibold">{e.name}</span>
                    <span className="badge">{e.topic}</span>
                    {e.course_id && courses.get(e.course_id) && (
                      <span className="badge badge-accent">{courses.get(e.course_id)}</span>
                    )}
                  </p>
                  <p className="mt-1 text-[0.8rem] text-ink-500">
                    <a href={`mailto:${e.email}`} className="hover:text-accent-700">{e.email}</a>
                    {e.phone && <> · <a href={`tel:${e.phone.replace(/\s/g, "")}`} className="hover:text-accent-700">{e.phone}</a></>}
                    {" "}· prefers {e.preferred_contact} · {formatDateTime(e.created_at)}
                  </p>
                </div>
                <EnquiryStatusSelect id={e.id} status={e.status} />
              </div>
              <p className="mt-4 rounded-lg bg-paper-deep/50 px-4 py-3 text-[0.87rem] leading-relaxed text-ink-700">{e.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
