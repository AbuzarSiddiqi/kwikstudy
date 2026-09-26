import { paymentsWithJoins } from "@/lib/queries";
import { formatDateTime, rupees } from "@/lib/site";
import { EmptyState } from "@/components/ui";
import { ArrowRight } from "@/components/Icons";

export default async function AdminPaymentsPage() {
  const rows = paymentsWithJoins();
  const captured = rows;

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[1.6rem] font-bold tracking-tight sm:text-[1.85rem]">Payments</h1>
          <p className="mt-1 text-[0.9rem] text-ink-500">
            {captured.length} captured payment{captured.length === 1 ? "" : "s"} · {rupees(captured.reduce((s, r) => s + r.amount, 0))} total
          </p>
        </div>
      </header>

      {rows.length === 0 ? (
        <EmptyState icon={<ArrowRight />} title="No payments yet" body="Completed checkout transactions will appear here with their order references." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-[0.87rem]">
            <thead>
              <tr className="border-b border-line font-mono text-[0.68rem] uppercase tracking-wider text-ink-400">
                <th className="px-5 py-3.5 font-medium">Order</th>
                <th className="px-5 py-3.5 font-medium">Student</th>
                <th className="px-5 py-3.5 font-medium">Course</th>
                <th className="px-5 py-3.5 font-medium">Method</th>
                <th className="px-5 py-3.5 font-medium">Date</th>
                <th className="px-5 py-3.5 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-paper-deep/40">
                  <td className="px-5 py-3.5">
                    <p className="font-mono text-[0.76rem] text-ink-700">{r.order_id.slice(0, 14)}</p>
                    {r.coupon_code && <p className="font-mono text-[0.68rem] text-accent-700">{r.coupon_code}</p>}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-display font-semibold text-ink-900">{r.student}</p>
                    <p className="text-[0.74rem] text-ink-400">{r.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-ink-600">{r.course}</td>
                  <td className="px-5 py-3.5"><span className="badge">{r.method}</span></td>
                  <td className="px-5 py-3.5 text-ink-600">{formatDateTime(r.paid_at)}</td>
                  <td className="px-5 py-3.5 text-right font-display font-bold tabular">{rupees(r.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
