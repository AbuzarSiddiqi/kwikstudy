/* Shared lesson content block model — used by the seed data and the renderer. */
export type Block =
  | { type: "text"; md: string }
  | { type: "code"; lang: string; code: string; filename?: string }
  | { type: "callout"; variant: "note" | "tip" | "warn"; title: string; body: string }
  | { type: "video"; duration: string; chapters?: { t: string; label: string }[] }
  | { type: "objectives"; items: string[] }
  | { type: "quiz" }
  | { type: "assignment" };
