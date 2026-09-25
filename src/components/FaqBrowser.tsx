"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown } from "@/components/Icons";
import { FAQ_CATEGORIES } from "@/lib/faq";

export function FaqBrowser() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return FAQ_CATEGORIES.filter((c) => cat === "all" || c.id === cat)
      .map((c) => ({
        ...c,
        items: c.items.filter(
          (i) => !needle || i.q.toLowerCase().includes(needle) || i.a.toLowerCase().includes(needle)
        ),
      }))
      .filter((c) => c.items.length > 0);
  }, [q, cat]);

  const total = filtered.reduce((s, c) => s + c.items.length, 0);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search width={16} height={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search questions…"
            aria-label="Search FAQs"
            className="input !pl-9"
          />
        </div>
        <p className="font-mono text-[0.72rem] uppercase tracking-wider text-ink-400">
          {total} answer{total === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setCat("all")}
          className={`rounded-full border px-3.5 py-1.5 font-display text-[0.8rem] font-medium transition-colors ${
            cat === "all" ? "border-ink-900 bg-ink-900 text-paper" : "border-line-strong bg-surface text-ink-600 hover:border-ink-300"
          }`}
        >
          All
        </button>
        {FAQ_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`rounded-full border px-3.5 py-1.5 font-display text-[0.8rem] font-medium transition-colors ${
              cat === c.id ? "border-ink-900 bg-ink-900 text-paper" : "border-line-strong bg-surface text-ink-600 hover:border-ink-300"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card px-6 py-14 text-center">
          <h2 className="font-display text-[1.05rem] font-semibold">No answers match “{q}”</h2>
          <p className="mx-auto mt-2 max-w-sm text-[0.88rem] text-ink-500">
            Try different words, or write to support@kwikstudy.in — we answer within one working day.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {filtered.map((c) => (
            <section key={c.id} aria-labelledby={`faq-${c.id}`}>
              <h2 id={`faq-${c.id}`} className="eyebrow mb-3">{c.name}</h2>
              <div className="divide-y divide-line rounded-[10px] border border-line bg-surface px-5">
                {c.items.map((item) => (
                  <details key={item.q} className="acc group py-4 first:pt-5">
                    <summary className="flex items-center justify-between gap-4 font-display text-[0.95rem] font-semibold text-ink-900">
                      {item.q}
                      <ChevronDown width={15} height={15} className="acc-chevron shrink-0 text-ink-400" />
                    </summary>
                    <p className="mt-2.5 max-w-3xl text-[0.9rem] leading-relaxed text-ink-500">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
