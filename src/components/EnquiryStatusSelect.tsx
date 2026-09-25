"use client";

import { useTransition } from "react";
import { updateEnquiryStatus } from "@/lib/actions/admin";

const OPTIONS = ["new", "contacted", "closed"] as const;

export function EnquiryStatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as (typeof OPTIONS)[number];
        startTransition(async () => { await updateEnquiryStatus(id, next); });
      }}
      aria-label="Enquiry status"
      className={`select w-auto !py-1 !text-[0.78rem] font-medium ${
        status === "new" ? "!border-accent-200 !bg-accent-50 !text-accent-700"
        : status === "closed" ? "!border-line !bg-paper-deep/60 !text-ink-500"
        : "!border-moss-100 !bg-moss-50 !text-moss-700"
      }`}
    >
      {OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
