import { db } from "@/lib/db";
import { formatDate, rupees } from "@/lib/site";
import { EmptyState } from "@/components/ui";
import { Users } from "@/components/Icons";

export default async function AdminStudentsPage() {
  const students = db.prepare(
    `SELECT u.*,
       (SELECT COUNT(*) FROM enrollments e WHERE e.user_id = u.id) AS enrollments,
       (SELECT COUNT(*) FROM certificates ct WHERE ct.user_id = u.id) AS certificates,
       (SELECT COALESCE(SUM(o.total),0) FROM orders o WHERE o.user_id = u.id AND o.status = 'paid') AS spent
     FROM users u WHERE u.role = 'student' ORDER BY u.created_at DESC`
  ).all() as { id: string; name: string; email: string; phone: string | null; created_at: string; enrollments: number; certificates: number; spent: number }[];

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <h1 className="font-display text-[1.6rem] font-bold tracking-tight sm:text-[1.85rem]">Students</h1>
        <p className="mt-1 text-[0.9rem] text-ink-500">{students.length} registered student{students.length === 1 ? "" : "s"}.</p>
      </header>

      {students.length === 0 ? (
        <EmptyState icon={<Users />} title="No students yet" body="Student accounts will appear here as people register." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-[0.87rem]">
            <thead>
              <tr className="border-b border-line font-mono text-[0.68rem] uppercase tracking-wider text-ink-400">
                <th className="px-5 py-3.5 font-medium">Student</th>
                <th className="px-5 py-3.5 font-medium">Joined</th>
                <th className="px-5 py-3.5 text-right font-medium">Enrollments</th>
                <th className="px-5 py-3.5 text-right font-medium">Certificates</th>
                <th className="px-5 py-3.5 text-right font-medium">Lifetime value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-paper-deep/40">
                  <td className="px-5 py-3.5">
                    <p className="font-display font-semibold text-ink-900">{s.name}</p>
                    <p className="text-[0.76rem] text-ink-400">{s.email}{s.phone ? ` · ${s.phone}` : ""}</p>
                  </td>
                  <td className="px-5 py-3.5 text-ink-600">{formatDate(s.created_at)}</td>
                  <td className="px-5 py-3.5 text-right tabular">{s.enrollments}</td>
                  <td className="px-5 py-3.5 text-right tabular">{s.certificates}</td>
                  <td className="px-5 py-3.5 text-right font-medium tabular">{rupees(s.spent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
