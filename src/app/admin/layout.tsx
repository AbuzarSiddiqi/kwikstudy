import Link from "next/link";
import { requireAdmin } from "@/lib/session";
import { Logo } from "@/components/Logo";
import { Logout, Home, Message, Users, BookOpen, ArrowRight } from "@/components/Icons";

const NAV = [
  { href: "/admin", label: "Overview", icon: Home },
  { href: "/admin/enquiries", label: "Enquiries", icon: Message },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/payments", label: "Payments", icon: ArrowRight },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col border-r border-ink-800 bg-ink-950 lg:flex">
        <div className="flex h-16 items-center justify-between border-b border-ink-800 px-5">
          <Link href="/admin"><Logo dark /></Link>
          <span className="badge badge-accent !py-0.5 !text-[0.6rem]">Admin</span>
        </div>
        <nav aria-label="Admin" className="flex-1 space-y-1 px-3 py-5">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[0.87rem] font-medium text-ink-300 hover:bg-ink-800/60 hover:text-paper">
              <item.icon width={16} height={16} className="text-ink-400" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-ink-800 p-3">
          <p className="mb-2 px-3 font-display text-[0.85rem] font-semibold text-paper">{admin.name}</p>
          <div className="space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 rounded-md px-3 py-2 text-[0.83rem] text-ink-300 hover:bg-ink-800/60 hover:text-paper">
              <Users width={16} height={16} className="text-ink-400" /> Student view
            </Link>
            <form action="/logout" method="post">
              <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-[0.83rem] text-ink-300 hover:bg-ink-800/60 hover:text-paper">
                <Logout width={16} height={16} className="text-ink-400" /> Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1 lg:pl-56">
        <div className="flex h-14 items-center justify-between border-b border-line bg-surface px-4 lg:hidden">
          <Link href="/admin"><Logo /></Link>
          <nav className="flex gap-1 overflow-x-auto">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-md px-2.5 py-1.5 text-[0.78rem] font-medium text-ink-600 hover:bg-paper-deep">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <main className="px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
