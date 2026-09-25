"use client";

import { useState } from "react";
import { Copy, Check } from "@/components/Icons";

export function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard unavailable */
        }
      }}
      aria-label={copied ? "Copied" : "Copy code"}
      className="inline-flex items-center gap-1.5 rounded-md border border-[#2a4152] px-2.5 py-1 font-mono text-[0.68rem] text-ink-300 transition-colors hover:border-ink-400 hover:text-paper"
    >
      {copied ? <Check width={13} height={13} className="text-moss-500" /> : <Copy width={13} height={13} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
