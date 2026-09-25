type Tok = { cls: string | null; text: string };

const KEYWORDS: Record<string, string[]> = {
  java: ["abstract","assert","boolean","break","byte","case","catch","char","class","const","continue","default","do","double","else","enum","extends","final","finally","float","for","if","implements","import","instanceof","int","interface","long","native","new","package","private","protected","public","return","short","static","strictfp","super","switch","synchronized","this","throw","throws","transient","try","void","volatile","while","var","record","true","false","null"],
  python: ["and","as","assert","async","await","break","class","continue","def","del","elif","else","except","False","finally","for","from","global","if","import","in","is","lambda","None","nonlocal","not","or","pass","raise","return","True","try","while","with","yield","self","match","case"],
  javascript: ["async","await","break","case","catch","class","const","continue","default","delete","do","else","export","extends","finally","for","from","function","if","import","in","instanceof","let","new","null","of","return","super","switch","this","throw","true","false","try","typeof","undefined","var","void","while","yield"],
  cpp: ["alignas","alignof","auto","bool","break","case","catch","char","class","const","constexpr","continue","default","delete","do","double","else","enum","explicit","export","extern","false","float","for","friend","goto","if","inline","int","long","mutable","namespace","new","noexcept","nullptr","operator","private","protected","public","return","short","signed","sizeof","static","struct","switch","template","this","throw","true","try","typedef","typename","union","unsigned","using","virtual","void","volatile","while","#include","#define","std"],
  sql: ["select","from","where","insert","into","values","update","set","delete","create","table","primary","key","foreign","references","join","inner","left","right","outer","on","group","by","order","having","limit","offset","as","and","or","not","null","distinct","count","sum","avg","min","max","alter","add","column","index","view","union","all","between","in","like","exists","case","when","then","else","end","default","auto_increment","unique","check","drop","truncate","begin","commit","rollback","int","varchar","text","date","decimal","boolean","serial","timestamp"],
  bash: ["cd","ls","echo","mkdir","rm","cp","mv","git","npm","node","export","source","if","then","fi","for","do","done","while","sudo","chmod","touch","cat","grep"],
  html: [],
};

const LANG_ALIASES: Record<string, string> = {
  js: "javascript", ts: "javascript", jsx: "javascript", tsx: "javascript",
  py: "python", java: "java", c: "cpp", "c++": "cpp", cpp: "cpp",
  sql: "sql", mysql: "sql", sh: "bash", shell: "bash", bash: "bash",
  html: "html", css: "html", json: "javascript",
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function keywordsFor(langRaw: string): Set<string> {
  const lang = LANG_ALIASES[langRaw.toLowerCase()] ?? langRaw.toLowerCase();
  return new Set(KEYWORDS[lang] ?? []);
}

/** Lightweight deterministic highlighter — no client JS, safe HTML output. */
export function highlight(code: string, langRaw: string): string {
  const lang = LANG_ALIASES[langRaw.toLowerCase()] ?? langRaw.toLowerCase();
  const kw = keywordsFor(lang);
  const toks: Tok[] = [];
  let i = 0;
  const push = (cls: string | null, text: string) => {
    if (!text) return;
    const last = toks[toks.length - 1];
    if (last && last.cls === cls) last.text += text;
    else toks.push({ cls, text });
  };

  while (i < code.length) {
    const rest = code.slice(i);

    // comments
    const lineComment = rest.match(/^(\/\/|#)(.*)/);
    if (lang !== "sql" && lang !== "html" && lineComment) {
      const end = code.indexOf("\n", i);
      const stop = end === -1 ? code.length : end;
      push("tok-com", code.slice(i, stop));
      i = stop;
      continue;
    }
    if (lang === "sql" && rest.startsWith("--")) {
      const end = code.indexOf("\n", i);
      const stop = end === -1 ? code.length : end;
      push("tok-com", code.slice(i, stop));
      i = stop;
      continue;
    }
    if (lang === "html" && rest.startsWith("<!--")) {
      const end = code.indexOf("-->", i);
      const stop = end === -1 ? code.length : end + 3;
      push("tok-com", code.slice(i, stop));
      i = stop;
      continue;
    }
    if ((rest.startsWith("/*") || rest.startsWith("/**")) && (lang === "java" || lang === "cpp" || lang === "javascript" || lang === "css")) {
      const end = code.indexOf("*/", i);
      const stop = end === -1 ? code.length : end + 2;
      push("tok-com", code.slice(i, stop));
      i = stop;
      continue;
    }
    // triple-quoted python strings
    if (lang === "python" && (rest.startsWith('"""') || rest.startsWith("'''"))) {
      const q = rest.slice(0, 3);
      const end = code.indexOf(q, i + 3);
      const stop = end === -1 ? code.length : end + 3;
      push("tok-str", code.slice(i, stop));
      i = stop;
      continue;
    }
    // strings
    const q = rest[0];
    if (q === '"' || q === "'" || q === "`") {
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === "\\") j += 2;
        else if (code[j] === q) { j += 1; break; }
        else if (code[j] === "\n" && q !== "`") { break; }
        else j += 1;
      }
      push("tok-str", code.slice(i, j));
      i = j;
      continue;
    }
    // annotations @Override
    const ann = rest.match(/^(@[A-Za-z_]\w*)/);
    if (ann) { push("tok-ann", ann[1]); i += ann[1].length; continue; }
    // preprocessor / tags
    if (lang === "cpp" && rest.startsWith("#")) {
      const m = rest.match(/^#\w*/);
      push("tok-kw", m![0]); i += m![0].length; continue;
    }
    if (lang === "html" && rest.startsWith("<")) {
      const m = rest.match(/^<\/?[a-zA-Z][\w-]*/);
      if (m) { push("tok-kw", m[0]); i += m[0].length; continue; }
    }
    // numbers
    const num = rest.match(/^(0[xX][0-9a-fA-F_]+|\d[\d_]*\.?\d*[fFdDlL]?)\b/);
    if (num) { push("tok-num", num[1]); i += num[1].length; continue; }
    // identifiers
    const ident = rest.match(/^[A-Za-z_]\w*/);
    if (ident) {
      const w = ident[0];
      let cls: string | null = null;
      if (kw.has(w)) cls = "tok-kw";
      else if (/^[A-Z]/.test(w)) cls = "tok-typ";
      else if (code[i + w.length] === "(") cls = "tok-fn";
      push(cls, w);
      i += w.length;
      continue;
    }
    // punctuation / whitespace / other
    const other = rest.match(/^[\s\S]/)!;
    if (/[\s]/.test(other[0])) push(null, other[0]);
    else push("tok-pun", other[0]);
    i += other[0].length;
  }

  return toks
    .map((t) => (t.cls ? `<span class="${t.cls}">${escapeHtml(t.text)}</span>` : escapeHtml(t.text)))
    .join("");
}
