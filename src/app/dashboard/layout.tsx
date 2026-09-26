import Link from "next/link";
import { requireUser } from "@/lib/session";
import { Logo } from "@/components/Logo";
import { Logout, Home, BookOpen, ListChecks, Briefcase, Award, User, Message, ShieldCheck } from "@/components/Icons";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/assignments", label: "Assignments", icon: ListChecks },
  { href: "/dashboard/projects", label: "Projects", icon: Briefcase },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/support", label: "Support", icon: Message },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen">
      {/* sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-ink-800 bg-ink-950 lg:flex">
        <div className="flex h-16 items-center border-b border-ink-800 px-5">
          <Link href="/"><Logo dark /></Link>
        </div>
        <nav aria-label="Dashboard" className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {user.role === "admin" && (
            <Link
              href="/admin"
              className="mb-3 flex items-center gap-3 rounded-md border border-accent-700 bg-accent-600/15 px-3 py-2.5 text-[0.87rem] font-semibold text-accent-200 transition-colors hover:bg-accent-600/25"
            >
              <ShieldCheck width={17} height={17} />
              Admin panel
            </Link>
          )}
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[0.87rem] font-medium text-ink-300 transition-colors hover:bg-ink-800/60 hover:text-paper"
            >
              <item.icon width={17} height={17} className="text-ink-400" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-ink-800 p-3">
          <div className="mb-2 px-3">
            <p className="font-display text-[0.85rem] font-semibold text-paper">{user.name}</p>
            <p className="truncate text-[0.72rem] text-ink-400">{user.email}</p>
          </div>
          <form action="/logout" method="post">
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[0.85rem] text-ink-300 hover:bg-ink-800/60 hover:text-paper">
              <Logout width={17} height={17} className="text-ink-400" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* content */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        {/* mobile top bar */}
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-paper/95 px-4 backdrop-blur lg:hidden">
          <Link href="/"><Logo /></Link>
          <div className="flex items-center gap-1 overflow-x-auto" id="dash-mobile-nav">
            {NAV.slice(1, 6).map((item) => (
              <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-md px-2.5 py-1.5 text-[0.78rem] font-medium text-ink-600 hover:bg-paper-deep">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
