"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, FileText } from "@/components/Icons";

type Result = { type: "course" | "program" | "instructor"; title: string; sub: string; href: string };

export function SearchDialog({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      setState("idle");
      return;
    }
    setState("loading");
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        const data = (await res.json()) as { results: Result[] };
        setResults(data.results);
        setState("done");
      } catch {
        if (!ctrl.signal.aborted) setState("error");
      }
    }, 180);
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [q]);

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Search KwikStudy">
      <button className="absolute inset-0 bg-ink-950/45" aria-label="Close search" onClick={onClose} />
      <div className="absolute inset-x-4 top-[12vh] mx-auto max-w-xl overflow-hidden rounded-xl border border-line bg-surface shadow-[var(--shadow-pop)]">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search width={17} height={17} className="text-ink-400" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results[0]) {
                onClose();
                router.push(results[0].href);
              }
            }}
            placeholder="Search courses, programs, instructors…"
            className="w-full bg-transparent py-3.5 text-[0.95rem] text-ink-900 outline-none placeholder:text-ink-400"
            aria-label="Search"
          />
          <button onClick={onClose} className="rounded p-1 text-ink-400 hover:bg-paper-deep hover:text-ink-700" aria-label="Close">
            <X width={18} height={18} />
          </button>
        </div>

        <div className="max-h-[52vh] overflow-y-auto p-2">
          {q.trim().length < 2 && (
            <div className="px-3 py-6 text-center text-[0.83rem] text-ink-400">
              Try “Java”, “React”, “SQL” or an instructor’s name.
            </div>
          )}
          {state === "loading" && (
            <div className="space-y-2 px-3 py-3">
              {[0, 1, 2].map((i) => <div key={i} className="skel h-10" />)}
            </div>
          )}
          {state === "done" && results.length === 0 && (
            <div className="px-3 py-6 text-center text-[0.85rem] text-ink-500">
              No results for “{q}”. Try a different term or browse <Link className="link-underline" href="/courses" onClick={onClose}>all courses</Link>.
            </div>
          )}
          {results.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              onClick={onClose}
              className="group flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-paper-deep"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line bg-paper text-ink-500">
                <FileText width={15} height={15} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.9rem] font-medium text-ink-900">{r.title}</span>
                <span className="block truncate font-mono text-[0.68rem] uppercase tracking-wider text-ink-400">{r.sub}</span>
              </span>
              <ArrowRight width={15} height={15} className="shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-accent-600" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
