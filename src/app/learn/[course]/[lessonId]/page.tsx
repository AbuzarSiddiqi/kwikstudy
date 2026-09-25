import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  getCourseBySlug, getCurriculum, getCourseProgress, isEnrolled,
} from "@/lib/queries";
import { db, parseJson, type LessonRow } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { LessonContent } from "@/components/LessonContent";
import { ViewPing, LessonFooterNav, AssignmentSubmitForm, LessonCompleteButton } from "@/components/LearnClient";
import { QuizRunner } from "@/components/QuizRunner";
import { ProgressBar } from "@/components/ui";
import { Check, ChevronDown, ArrowLeft, ArrowRight, Award, Clock, FileText, Lock, Play } from "@/components/Icons";
import type { Block } from "@/lib/blocks";
import { formatDate } from "@/lib/site";

type Params = Promise<{ course: string; lessonId: string }>;

const TYPE_META: Record<string, { label: string; icon: React.ReactNode }> = {
  video: { label: "Video lesson", icon: <Play width={13} height={13} /> },
  text: { label: "Lesson", icon: <FileText width={13} height={13} /> },
  quiz: { label: "Checkpoint quiz", icon: <Award width={13} height={13} /> },
  assignment: { label: "Assignment", icon: <FileText width={13} height={13} /> },
};

export default async function LearnLessonPage({ params }: { params: Params }) {
  const { course: slug, lessonId } = await params;
  const user = await requireUser();
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const enrolled = isEnrolled(user.id, course.id);
  const curriculum = getCurriculum(course.id);
  const progress = enrolled ? getCourseProgress(user.id, course.id) : null;

  /* locate the lesson within the curriculum */
  const flat = curriculum.flatMap((m) => m.lessons.map((l) => ({ lesson: l, module: m })));
  const position = flat.findIndex((x) => x.lesson.id === lessonId);
  if (position === -1) notFound();
  const { lesson, module: mod } = flat[position];

  const isPreviewAccess = !enrolled && lesson.is_free_preview === 1;
  if (!enrolled && !isPreviewAccess) redirect(`/courses/${slug}`);

  const completedIds = new Set(
    (db.prepare("SELECT lesson_id FROM lesson_progress WHERE user_id = ? AND course_id = ? AND status = 'completed'")
      .all(user.id, course.id) as { lesson_id: string }[]).map((r) => r.lesson_id)
  );
  const isCompleted = completedIds.has(lesson.id);
  const prev = position > 0 ? flat[position - 1] : null;
  const next = position < flat.length - 1 ? flat[position + 1] : null;

  const blocks = parseJson<Block[]>(lesson.content, []);
  const quiz = db.prepare("SELECT * FROM quizzes WHERE lesson_id = ?").get(lesson.id) as { id: string; title: string; pass_score: number } | undefined;
  const quizQuestions = quiz
    ? (db.prepare("SELECT id, question FROM quiz_questions WHERE quiz_id = ? ORDER BY idx").all(quiz.id) as { id: string; question: string }[])
        .map((q) => ({ ...q, options: (db.prepare("SELECT text FROM quiz_options WHERE question_id = ? ORDER BY idx").all(q.id) as { text: string }[]).map((o) => o.text) }))
    : [];
  const assignment = db.prepare("SELECT * FROM assignments WHERE lesson_id = ?").get(lesson.id) as { id: string; title: string; brief: string } | undefined;
  const submission = assignment
    ? db.prepare("SELECT submitted_at FROM assignment_submissions WHERE assignment_id = ? AND user_id = ?").get(assignment.id, user.id) as { submitted_at: string } | undefined
    : undefined;
  const lastAttempt = quiz
    ? (db.prepare("SELECT score, total, created_at FROM quiz_attempts WHERE quiz_id = ? AND user_id = ? ORDER BY created_at DESC LIMIT 1")
        .get(quiz.id, user.id) as { score: number; total: number; created_at: string } | undefined) ?? null
    : null;
  const resources = db.prepare("SELECT * FROM lesson_resources WHERE lesson_id = ?").all(lesson.id) as { id: string; title: string; kind: string; href: string }[];

  /* sidebar module open state: the module containing current lesson */
  const currentModuleId = mod.id;

  return (
    <div className="flex h-screen flex-col bg-paper">
      <ViewPing lessonId={lesson.id} />

      {/* top bar */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-line bg-surface px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link href={enrolled ? "/dashboard" : `/courses/${slug}`} className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-ink-500 hover:text-ink-900" aria-label="Back">
            <ArrowLeft width={16} height={16} />
          </Link>
          <div className="min-w-0">
            <p className="truncate font-display text-[0.88rem] font-bold leading-tight">{course.title}</p>
            <p className="font-mono text-[0.62rem] uppercase tracking-wider text-ink-400">
              {isPreviewAccess ? "Free preview — not enrolled" : `Module ${String(mod.idx).padStart(2, "0")} · Lesson ${position + 1} of ${flat.length}`}
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-4 sm:flex">
          {progress && (
            <div className="w-44">
              <ProgressBar value={progress.percent} showLabel />
            </div>
          )}
          {isCompleted && <span className="badge badge-moss">Completed</span>}
          {!enrolled && <Link href={`/checkout/${slug}`} className="btn btn-accent btn-sm">Enroll to continue</Link>}
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* curriculum sidebar */}
        <aside className="hidden w-72 shrink-0 overflow-y-auto border-r border-line bg-surface md:block" aria-label="Course curriculum">
          {curriculum.map((m) => {
            const isCurrent = m.id === currentModuleId;
            const open = isCurrent || m.lessons.some((l) => !completedIds.has(l.id) && false);
            const modDone = m.lessons.every((l) => completedIds.has(l.id));
            return (
              <details key={m.id} className="acc border-b border-line" open={open || m.idx === 1}>
                <summary className="flex items-center gap-2.5 px-4 py-3">
                  {modDone
                    ? <Check width={14} height={14} className="shrink-0 text-moss-500" />
                    : <span className="font-mono text-[0.7rem] font-semibold tabular text-ink-400">{String(m.idx).padStart(2, "0")}</span>}
                  <span className={`flex-1 font-display text-[0.82rem] font-semibold leading-snug ${isCurrent ? "text-ink-900" : "text-ink-600"}`}>
                    {m.title}
                  </span>
                  <ChevronDown width={13} height={13} className="acc-chevron shrink-0 text-ink-300" />
                </summary>
                <ul className="pb-2">
                  {m.lessons.map((l) => {
                    const done = completedIds.has(l.id);
                    const active = l.id === lesson.id;
                    const locked = !enrolled && !l.is_free_preview;
                    return (
                      <li key={l.id}>
                        <Link
                          href={locked ? `/courses/${slug}` : `/learn/${slug}/${l.id}`}
                          className={`flex items-center gap-2.5 py-2 pl-4 pr-3 text-[0.8rem] ${
                            active ? "bg-accent-50 font-semibold text-accent-800" : done ? "text-ink-500" : locked ? "text-ink-400" : "text-ink-700 hover:bg-paper-deep/60"
                          }`}
                          aria-current={active ? "page" : undefined}
                        >
                          {done ? (
                            <Check width={13} height={13} className="shrink-0 text-moss-500" />
                          ) : locked ? (
                            <Lock width={12} height={12} className="shrink-0 text-ink-300" />
                          ) : (
                            <span className={`h-2 w-2 shrink-0 rounded-full border ${active ? "border-accent-600 bg-accent-600" : "border-ink-300"}`} />
                          )}
                          <span className="flex-1 leading-snug">{l.title}</span>
                          {l.is_free_preview === 1 && !enrolled && <span className="badge badge-accent !py-0 !text-[0.58rem]">Free</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </details>
            );
          })}
          <div className="p-4">
            <Link href={`/courses/${slug}`} className="text-[0.78rem] font-medium text-accent-700 hover:text-accent-600">
              Course home page →
            </Link>
          </div>
        </aside>

        {/* lesson content */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="badge">{TYPE_META[lesson.type]?.label ?? "Lesson"}</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[0.72rem] tabular text-ink-400">
                <Clock width={13} height={13} /> {lesson.duration_min} min
              </span>
              <span className="font-mono text-[0.72rem] uppercase tracking-wider text-ink-400">{mod.title}</span>
            </div>

            <h1 className="mb-2 font-display text-[1.6rem] font-bold tracking-tight sm:text-[1.85rem]">{lesson.title}</h1>
            {!isPreviewAccess && progress?.lastCompletedAt && position === flat.findIndex((f) => f.lesson.id === progress.currentLessonId) && (
              <p className="mb-4 text-[0.82rem] text-ink-400">Up next after your last completed lesson.</p>
            )}

            <LessonContent
              blocks={blocks}
              courseCover={{ category: course.category_name ?? "Course", glyph: course.cover_code.split("-")[1] ?? "KS", code: course.cover_code, variant: course.cover_variant }}
            />

            {/* quiz */}
            {quiz && quizQuestions.length > 0 && (
              <div className="mt-10">
                <QuizRunner
                  lessonId={lesson.id}
                  title={quiz.title}
                  passScore={quiz.pass_score}
                  questions={quizQuestions}
                  lastAttempt={lastAttempt}
                />
              </div>
            )}

            {/* assignment */}
            {assignment && (
              <div className="mt-10">
                <div className="mb-4 rounded-[10px] border border-line bg-paper-deep/50 p-5">
                  <h3 className="font-display text-[1rem] font-semibold">{assignment.title}</h3>
                  <p className="mt-1.5 text-[0.88rem] leading-relaxed text-ink-600">{assignment.brief}</p>
                  {submission && (
                    <p className="mt-2 text-[0.78rem] text-moss-600">Submitted {formatDate(submission.submitted_at)} — resubmitting replaces it.</p>
                  )}
                </div>
                {!isPreviewAccess && <AssignmentSubmitForm lessonId={lesson.id} alreadySubmitted={!!submission} />}
              </div>
            )}

            <LessonFooterNav
              prev={prev ? { href: `/learn/${slug}/${prev.lesson.id}`, title: prev.lesson.title } : null}
              next={next ? { href: `/learn/${slug}/${next.lesson.id}`, title: next.lesson.title } : null}
              lessonId={lesson.id}
              completed={isCompleted}
              isPreview={isPreviewAccess}
            />
          </div>
        </main>

        {/* right rail */}
        <aside className="hidden w-64 shrink-0 overflow-y-auto border-l border-line bg-surface p-5 xl:block" aria-label="Lesson information">
          <p className="eyebrow mb-3">In this module</p>
          <ol className="mb-7 space-y-2">
            {mod.lessons.map((l) => {
              const done = completedIds.has(l.id);
              return (
                <li key={l.id} className="flex items-start gap-2 text-[0.8rem] leading-snug">
                  {done ? (
                    <Check width={13} height={13} className="mt-0.5 shrink-0 text-moss-500" />
                  ) : (
                    <span className={`mt-1 h-2 w-2 shrink-0 rounded-full border ${l.id === lesson.id ? "border-accent-600 bg-accent-600" : "border-ink-300"}`} />
                  )}
                  <span className={l.id === lesson.id ? "font-semibold text-ink-900" : "text-ink-500"}>{l.title}</span>
                </li>
              );
            })}
          </ol>

          {resources.length > 0 && (
            <>
              <p className="eyebrow mb-3">Resources</p>
              <ul className="mb-7 space-y-2.5">
                {resources.map((r) => (
                  <li key={r.id}>
                    <a href={r.href} className="flex items-center gap-2.5 rounded-lg border border-line px-3 py-2.5 text-[0.8rem] text-ink-700 hover:border-ink-300">
                      <FileText width={15} height={15} className="shrink-0 text-ink-400" />
                      {r.title}
                      <span className="ml-auto font-mono text-[0.62rem] uppercase text-ink-400">{r.kind}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}

          {progress && (
            <>
              <p className="eyebrow mb-3">Course progress</p>
              <ProgressBar value={progress.percent} showLabel />
              <p className="mt-2 text-[0.76rem] text-ink-400">
                {progress.completed} of {progress.total} lessons · {progress.percent}%
              </p>
            </>
          )}
        </aside>
      </div>

      {/* mobile lesson nav */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-line bg-surface px-4 py-3 md:hidden">
        {prev ? (
          <Link href={`/learn/${slug}/${prev.lesson.id}`} className="btn btn-outline btn-sm"><ArrowLeft width={14} height={14} /> Prev</Link>
        ) : <span />}
        {!isPreviewAccess && <LessonCompleteButton lessonId={lesson.id} completed={isCompleted} />}
        {next ? (
          <Link href={`/learn/${slug}/${next.lesson.id}`} className="btn btn-primary btn-sm">Next <ArrowRight width={14} height={14} /></Link>
        ) : <span />}
      </div>
    </div>
  );
}
