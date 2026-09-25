"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { SearchDialog } from "@/components/SearchDialog";
import { Search, Menu, X, Mail, Phone, ChevronDown, Logout, User as UserIcon } from "@/components/Icons";
import { mainNav, site } from "@/lib/site";
import type { SafeUser } from "@/lib/session";

export function Navbar({ user }: { user: SafeUser | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenu(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* utility strip */}
      <div className="hidden bg-ink-950 text-ink-300 md:block">
        <div className="wrap flex h-9 items-center justify-between text-[0.72rem]">
          <p className="tracking-wide">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-accent-500 align-middle" aria-hidden />
            Admissions open — new batches start the first Monday of every month
          </p>
          <div className="flex items-center gap-5">
            <a href={`mailto:${site.email}`} className="inline-flex items-center gap-1.5 hover:text-paper"><Mail width={13} height={13} />{site.email}</a>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 hover:text-paper"><Phone width={13} height={13} />{site.phone}</a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 border-b transition-all duration-150 ${
          scrolled ? "border-line bg-paper/95 shadow-[0_1px_0_rgba(17,32,43,0.04)] backdrop-blur" : "border-transparent bg-paper"
        }`}
      >
        <div className={`wrap flex items-center justify-between gap-4 ${scrolled ? "h-16" : "h-[4.5rem]"} transition-[height] duration-150`}>
          <Link href="/" aria-label="KwikStudy home"><Logo /></Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {mainNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-2 font-display text-[0.855rem] font-medium transition-colors ${
                    active ? "text-accent-700" : "text-ink-700 hover:bg-ink-900/5 hover:text-ink-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-9 items-center gap-2 rounded-md border border-line-strong/70 bg-surface px-2.5 text-ink-500 transition-colors hover:border-ink-300 hover:text-ink-800"
              aria-label="Search"
            >
              <Search width={16} height={16} />
              <span className="hidden text-[0.78rem] xl:inline">Search</span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu((v) => !v)}
                  className="flex h-9 items-center gap-2 rounded-md border border-line-strong/70 bg-surface px-2.5 font-display text-[0.83rem] font-semibold text-ink-800 hover:border-ink-300"
                  aria-expanded={userMenu}
                  aria-haspopup="menu"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-900 font-mono text-[0.62rem] text-paper">
                    {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </span>
                  <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
                  <ChevronDown width={14} height={14} className={`transition-transform ${userMenu ? "rotate-180" : ""}`} />
                </button>
                {userMenu && (
                  <div role="menu" className="absolute right-0 top-11 w-52 overflow-hidden rounded-lg border border-line bg-surface py-1 shadow-[var(--shadow-pop)]">
                    <div className="border-b border-line px-4 py-2.5">
                      <p className="text-[0.85rem] font-semibold text-ink-900">{user.name}</p>
                      <p className="truncate text-[0.72rem] text-ink-400">{user.email}</p>
                    </div>
                    {user.role === "admin" && (
                      <Link role="menuitem" href="/admin" className="block px-4 py-2 text-[0.85rem] text-ink-700 hover:bg-paper-deep">Admin panel</Link>
                    )}
                    <Link role="menuitem" href="/dashboard" className="block px-4 py-2 text-[0.85rem] text-ink-700 hover:bg-paper-deep">Dashboard</Link>
                    <Link role="menuitem" href="/dashboard/profile" className="block px-4 py-2 text-[0.85rem] text-ink-700 hover:bg-paper-deep">Profile</Link>
                    <form action="/logout" method="post">
                      <button role="menuitem" type="submit" className="flex w-full items-center gap-2 px-4 py-2 text-left text-[0.85rem] text-ink-700 hover:bg-paper-deep">
                        <Logout width={14} height={14} /> Sign out
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="btn btn-ghost btn-sm hidden sm:inline-flex">Log in</Link>
            )}

            <Link href="/courses" className="btn btn-accent btn-sm hidden md:inline-flex">Explore Courses</Link>

            <button
              className="rounded-md p-2 text-ink-700 hover:bg-ink-900/5 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {/* mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-paper lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="wrap flex h-16 items-center justify-between border-b border-line">
            <Logo />
            <button onClick={() => setMobileOpen(false)} className="rounded-md p-2 text-ink-700 hover:bg-ink-900/5" aria-label="Close menu">
              <X />
            </button>
          </div>
          <nav aria-label="Mobile" className="wrap flex-1 overflow-y-auto py-6">
            <ul className="divide-y divide-line">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="flex items-center justify-between py-4 font-display text-[1.15rem] font-semibold text-ink-900">
                    {item.label}
                    <ChevronDown width={16} height={16} className="-rotate-90 text-ink-300" />
                  </Link>
                </li>
              ))}
              {user && (
                <li>
                  <Link href="/dashboard" className="flex items-center justify-between py-4 font-display text-[1.15rem] font-semibold text-ink-900">
                    Dashboard <UserIcon width={18} height={18} className="text-ink-300" />
                  </Link>
                </li>
              )}
            </ul>
            <div className="mt-8 space-y-3">
              <Link href="/courses" className="btn btn-accent w-full">Explore Courses</Link>
              {!user && (
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" className="btn btn-outline w-full">Log in</Link>
                  <Link href="/register" className="btn btn-primary w-full">Create account</Link>
                </div>
              )}
            </div>
            <div className="mt-10 space-y-2 border-t border-line pt-6 text-[0.83rem] text-ink-500">
              <a href={`mailto:${site.email}`} className="block">{site.email}</a>
              <p>{site.hours}</p>
            </div>
          </nav>
        </div>
      )}

      {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} />}
    </>
  );
}
