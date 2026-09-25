"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { submitQuiz } from "@/lib/actions/learn";
import { Check, X, Alert, ArrowRight, ArrowLeft } from "@/components/Icons";

export type QuizQuestion = { id: string; question: string; options: string[] };

type Result = { passed: boolean; score: number; total: number; results: { correct: boolean; correctIndex: number; explanation: string }[] };

export function QuizRunner({
  lessonId,
  title,
  passScore,
  questions,
  lastAttempt,
}: {
  lessonId: string;
  title: string;
  passScore: number;
  questions: QuizQuestion[];
  lastAttempt: { score: number; total: number; created_at: string } | null;
}) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>(() => questions.map(() => -1));
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const q = questions[idx];
  const answered = answers.filter((a) => a >= 0).length;
  const allAnswered = answered === questions.length;

  const doSubmit = () => {
    setError(null);
    startTransition(async () => {
      const res = await submitQuiz(lessonId, answers);
      if (!res) { setError("Could not submit the quiz. Please try again."); return; }
      if (!res.ok) { setError(res.error ?? "Submission failed"); return; }
      setResult({ passed: res.passed, score: res.score, total: res.total, results: res.results });
    });
  };

  const retry = () => {
    setAnswers(questions.map(() => -1));
    setIdx(0);
    setResult(null);
  };

  if (result) {
    const pct = result.total ? Math.round((result.score / result.total) * 100) : 0;
    return (
      <section className="card overflow-hidden" aria-label="Quiz results">
        <div className={`px-6 py-8 text-center ${result.passed ? "bg-moss-50" : "bg-accent-50"}`}>
          <span className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full ${result.passed ? "bg-moss-500 text-white" : "bg-accent-600 text-white"}`}>
            {result.passed ? <Check width={26} height={26} /> : <X width={26} height={26} />}
          </span>
          <h3 className="font-display text-[1.25rem] font-bold">
            {result.passed ? "Quiz passed" : "Not quite there yet"}
          </h3>
          <p className="mt-1 text-[0.9rem] text-ink-600">
            You scored <strong className="tabular">{result.score} / {result.total}</strong> ({pct}%) · passing score {passScore}%
          </p>
          {result.passed && <p className="mt-1 text-[0.83rem] text-moss-700">This lesson has been marked complete.</p>}
        </div>
        <div className="divide-y divide-line border-t border-line px-6 py-2">
          {questions.map((qq, i) => {
            const r = result.results[i];
            return (
              <div key={qq.id} className="py-4">
                <p className="flex items-start gap-2.5 font-display text-[0.9rem] font-semibold text-ink-900">
                  {r.correct ? <Check width={16} height={16} className="mt-0.5 shrink-0 text-moss-500" /> : <X width={16} height={16} className="mt-0.5 shrink-0 text-accent-600" />}
                  <span>
                    <span className="mr-1.5 font-mono text-[0.72rem] text-ink-400">Q{i + 1}</span>
                    {qq.question}
                  </span>
                </p>
                <p className="mt-1.5 pl-6 text-[0.85rem] text-ink-600">
                  Correct answer: <strong>{qq.options[r.correctIndex]}</strong>
                  {!r.correct && answers[i] >= 0 && (
                    <> · you chose <span className="text-accent-700">{qq.options[answers[i]]}</span></>
                  )}
                </p>
                <p className="mt-1 pl-6 text-[0.82rem] leading-relaxed text-ink-500">{r.explanation}</p>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end border-t border-line px-6 py-4">
          <button onClick={retry} className="btn btn-outline btn-sm">Retry quiz</button>
        </div>
      </section>
    );
  }

  return (
    <section className="card overflow-hidden" aria-label={title}>
      <div className="flex items-center justify-between border-b border-line bg-paper-deep/50 px-5 py-3">
        <span className="eyebrow">Checkpoint Quiz</span>
        <span className="font-mono text-[0.7rem] tabular text-ink-400">Q{idx + 1} / {questions.length}</span>
      </div>

      {/* progress */}
      <div className="h-1 bg-ink-200/60">
        <div className="h-full bg-accent-500 transition-[width] duration-300" style={{ width: `${(answered / questions.length) * 100}%` }} />
      </div>

      <div className="p-6">
        {error && (
          <p className="mb-4 flex items-center gap-2 rounded-lg border border-accent-200 bg-accent-50 px-3.5 py-2.5 text-[0.83rem] font-medium text-accent-700" role="alert">
            <Alert width={15} height={15} /> {error}
          </p>
        )}
        <p className="mb-1 font-mono text-[0.68rem] uppercase tracking-wider text-ink-400">Question {idx + 1}</p>
        <h3 className="mb-5 font-display text-[1.05rem] font-semibold leading-snug">{q.question}</h3>

        <div className="space-y-2.5" role="radiogroup" aria-label={`Options for question ${idx + 1}`}>
          {q.options.map((opt, oi) => {
            const selected = answers[idx] === oi;
            return (
              <label
                key={opt}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-[0.92rem] transition-colors ${
                  selected ? "border-accent-600 bg-accent-50/70 text-ink-900" : "border-line text-ink-700 hover:border-ink-300"
                }`}
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={selected}
                  onChange={() => setAnswers((a) => a.map((v, i) => (i === idx ? oi : v)))}
                  className="accent-[#c04a12]"
                />
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line-strong font-mono text-[0.7rem]">
                  {String.fromCharCode(65 + oi)}
                </span>
                {opt}
              </label>
            );
          })}
        </div>

        {lastAttempt && !pending && (
          <p className="mt-5 rounded-lg bg-paper-deep/60 px-3.5 py-2.5 text-[0.8rem] text-ink-500">
            Last attempt: {lastAttempt.score}/{lastAttempt.total}. Retaking is fine — the latest score counts.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-line px-6 py-4">
        <button
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="btn btn-ghost btn-sm"
        >
          <ArrowLeft width={15} height={15} /> Previous
        </button>
        {idx < questions.length - 1 ? (
          <button onClick={() => setIdx((i) => i + 1)} className="btn btn-outline btn-sm">
            Next <ArrowRight width={15} height={15} />
          </button>
        ) : (
          <button onClick={doSubmit} disabled={!allAnswered || pending} className="btn btn-accent btn-sm">
            {pending ? "Scoring…" : allAnswered ? "Submit quiz" : `Answer all (${answered}/${questions.length})`}
          </button>
        )}
      </div>
    </section>
  );
}
