import { CodeBlock } from "@/components/CodeBlock";
import { CoverArt, courseGlyph } from "@/components/CoverArt";
import { Play, ListChecks, Info, Alert, Check } from "@/components/Icons";
import type { Block } from "@/lib/blocks";

/* minimal inline markdown: **bold** and `code` */
function inline(md: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0, m: RegExpExecArray | null, key = 0;
  while ((m = re.exec(md))) {
    if (m.index > last) parts.push(md.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) parts.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    else parts.push(<code key={key++}>{tok.slice(1, -1)}</code>);
    last = m.index + tok.length;
  }
  if (last < md.length) parts.push(md.slice(last));
  return parts;
}

function Prose({ md }: { md: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = md.split("\n");
  let list: string[] = [];
  const flush = (key: string) => {
    if (list.length) {
      blocks.push(
        <ul key={key}>
          {list.map((li, i) => <li key={i}>{inline(li)}</li>)}
        </ul>
      );
      list = [];
    }
  };
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line) { flush(`ul-${i}`); return; }
    if (line.startsWith("- ")) { list.push(line.slice(2)); return; }
    if (line.startsWith("## ")) {
      flush(`ul-${i}`);
      blocks.push(<h3 key={i}>{inline(line.slice(3))}</h3>);
      return;
    }
    flush(`ul-${i}`);
    blocks.push(<p key={i}>{inline(line)}</p>);
  });
  flush("ul-end");
  return <div className="lesson-body">{blocks}</div>;
}

export function LessonContent({ blocks, courseCover }: { blocks: Block[]; courseCover: { category: string; glyph: string; code: string; variant: string } }) {
  return (
    <div className="space-y-6">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "video":
            return (
              <figure key={i} className="overflow-hidden rounded-[10px] border border-line">
                <div className="relative">
                  <CoverArt
                    category={courseCover.category}
                    glyph={courseCover.glyph}
                    code={courseCover.code}
                    variant={courseCover.variant}
                    className="aspect-video w-full opacity-90"
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-950/80 text-paper shadow-[var(--shadow-pop)] ring-1 ring-paper/20">
                      <Play width={26} height={26} className="ml-1" />
                    </span>
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-md bg-ink-950/80 px-2 py-1 font-mono text-[0.7rem] text-paper">
                    {b.duration}
                  </span>
                  <span className="absolute left-3 top-3 rounded-md bg-ink-950/70 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-ink-200">
                    Lecture video
                  </span>
                </div>
                {b.chapters && b.chapters.length > 0 && (
                  <figcaption className="border-t border-line bg-surface px-4 py-3">
                    <p className="eyebrow mb-2">Chapters</p>
                    <ol className="space-y-1.5">
                      {b.chapters.map((ch) => (
                        <li key={ch.t} className="flex items-baseline gap-3 text-[0.83rem] text-ink-600">
                          <span className="font-mono text-[0.72rem] tabular text-ink-400">{ch.t}</span>
                          {ch.label}
                        </li>
                      ))}
                    </ol>
                  </figcaption>
                )}
              </figure>
            );
          case "objectives":
            return (
              <div key={i} className="rounded-[10px] border border-line bg-paper-deep/50 p-5">
                <p className="mb-3 flex items-center gap-2 font-display text-[0.85rem] font-semibold text-ink-900">
                  <ListChecks width={16} height={16} className="text-accent-600" /> By the end of this lesson
                </p>
                <ul className="space-y-2">
                  {b.items.map((it) => (
                    <li key={it} className="flex items-start gap-2.5 text-[0.89rem] leading-relaxed text-ink-700">
                      <Check width={15} height={15} className="mt-0.5 shrink-0 text-moss-500" /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            );
          case "code":
            return <CodeBlock key={i} code={b.code} lang={b.lang} filename={b.filename} />;
          case "callout": {
            const styles = {
              note: { icon: <Info width={16} height={16} />, cls: "border-line bg-paper-deep/60 text-ink-700" },
              tip: { icon: <Check width={16} height={16} />, cls: "border-moss-100 bg-moss-50 text-moss-700" },
              warn: { icon: <Alert width={16} height={16} />, cls: "border-accent-200 bg-accent-50 text-accent-700" },
            }[b.variant];
            return (
              <aside key={i} className={`rounded-[10px] border px-4.5 py-4 ${styles.cls}`}>
                <p className="mb-1 flex items-center gap-2 font-display text-[0.83rem] font-semibold">{styles.icon} {b.title}</p>
                <div className="text-[0.87rem] leading-relaxed opacity-90">{inline(b.body)}</div>
              </aside>
            );
          }
          case "quiz":
            return <div key={i} className="rounded-[10px] border border-dashed border-accent-200 bg-accent-50/50 px-4.5 py-3.5 text-[0.87rem] text-accent-700">
              The checkpoint quiz for this lesson is below — answer all questions to complete the lesson.
            </div>;
          case "assignment":
            return <div key={i} className="rounded-[10px] border border-dashed border-accent-200 bg-accent-50/50 px-4.5 py-3.5 text-[0.87rem] text-accent-700">
              This lesson ends with an assignment. The submission form is below.
            </div>;
          case "text":
            return <Prose key={i} md={b.md} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
