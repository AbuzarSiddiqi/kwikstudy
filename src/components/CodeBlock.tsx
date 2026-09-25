import { highlight } from "@/lib/highlight";
import { CopyCodeButton } from "@/components/CopyCodeButton";

export function CodeBlock({ code, lang, filename }: { code: string; lang: string; filename?: string }) {
  const html = highlight(code, lang);
  return (
    <figure className="codeblock overflow-hidden">
      <figcaption className="flex items-center justify-between gap-3 border-b border-[#1c2f3d] px-4 py-2">
        <span className="font-mono text-[0.7rem] tracking-wide text-ink-400">
          {filename ?? lang.toUpperCase()}
        </span>
        <CopyCodeButton code={code} />
      </figcaption>
      <pre className="overflow-x-auto px-4 py-3.5">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </figure>
  );
}
