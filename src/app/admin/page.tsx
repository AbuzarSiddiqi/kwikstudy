import { db } from "@/lib/db";
import { formatDate, formatDateTime, rupees } from "@/lib/site";
import { Message, Users, BookOpen, ArrowRight } from "@/components/Icons";

export default async function AdminOverview() {
  const count = (sql: string, ...args: unknown[]) => (db.prepare(sql).get(...args) as { n: number }).n;

  const stats = [
    { label: "Published courses", value: count("SELECT COUNT(*) n FROM courses WHERE status = 'published'"), icon: <BookOpen width={18} height={18} /> },
    { label: "Registered users", value: count("SELECT COUNT(*) n FROM users WHERE role = 'student'"), icon: <Users width={18} height={18} /> },
    { label: "Active enrollments", value: count("SELECT COUNT(*) n FROM enrollments WHERE status = 'active'"), icon: <Users width={18} height={18} /> },
    { label: "Revenue (captured)", value: rupees((db.prepare("SELECT COALESCE(SUM(amount),0) n FROM payments WHERE status = 'captured'").get() as { n: number }).n), icon: <ArrowRight width={18} height={18} /> },
  ];

  const recentEnquiries = db.prepare(
    "SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 5"
  ).all() as { id: string; name: string; topic: string; status: string; created_at: string }[];

  const recentPayments = db.prepare(
    `SELECT p.*, o.id AS order_id, u.name AS student, c.title AS course
     FROM payments p JOIN orders o ON o.id = p.order_id JOIN users u ON u.id = o.user_id JOIN courses c ON c.id = o.course_id
     ORDER BY p.paid_at DESC LIMIT 5`
  ).all() as { id: string; student: string; course: string; amount: number; method: string; paid_at: string }[];

  const topCourses = db.prepare(
    `SELECT c.title, COUNT(e.id) AS enrollments
     FROM courses c LEFT JOIN enrollments e ON e.course_id = c.id
     GROUP BY c.id ORDER BY enrollments DESC LIMIT 5`
  ).all() as { title: string; enrollments: number }[];

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="font-display text-[1.6rem] font-bold tracking-tight sm:text-[1.85rem]">Institute overview</h1>
        <p className="mt-1 text-[0.9rem] text-ink-500">Operational snapshot — enrollments, payments and enquiries.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-paper-deep text-ink-500">{s.icon}</span>
            <p className="mt-3 font-display text-[1.45rem] font-bold tabular">{s.value}</p>
            <p className="text-[0.78rem] text-ink-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="eyebrow !text-ink-500">Latest enquiries</h2>
            <a href="/admin/enquiries" className="text-[0.8rem] font-medium text-accent-700 hover:text-accent-600">All enquiries →</a>
          </div>
          {recentEnquiries.length === 0 ? (
            <p className="text-[0.85rem] text-ink-400">No enquiries yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentEnquiries.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate font-display text-[0.88rem] font-semibold">{e.name}</p>
                    <p className="text-[0.75rem] text-ink-400">{e.topic} · {formatDate(e.created_at)}</p>
                  </div>
                  <span className={`badge ${e.status === "new" ? "badge-accent" : e.status === "closed" ? "" : "badge-moss"}`}>{e.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="eyebrow !text-ink-500">Recent payments</h2>
            <a href="/admin/payments" className="text-[0.8rem] font-medium text-accent-700 hover:text-accent-600">All payments →</a>
          </div>
          {recentPayments.length === 0 ? (
            <p className="text-[0.85rem] text-ink-400">No payments yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentPayments.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate font-display text-[0.88rem] font-semibold">{p.student}</p>
                    <p className="truncate text-[0.75rem] text-ink-400">{p.course} · {p.method.toUpperCase()} · {formatDateTime(p.paid_at)}</p>
                  </div>
                  <span className="font-display text-[0.9rem] font-bold tabular">{rupees(p.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card mt-6 p-6">
        <h2 className="eyebrow mb-4 !text-ink-500">Enrollments by course</h2>
        <ul className="space-y-3">
          {topCourses.map((c) => (
            <li key={c.title} className="flex items-center gap-4">
              <span className="w-56 shrink-0 truncate font-display text-[0.88rem] font-medium">{c.title}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-200/50">
                <div
                  className="h-full rounded-full bg-ink-800"
                  style={{ width: `${Math.max(6, (c.enrollments / Math.max(1, topCourses[0].enrollments)) * 100)}%` }}
                />
              </div>
              <span className="w-8 text-right font-mono text-[0.78rem] tabular text-ink-500">{c.enrollments}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
