import { CourseSeed, t, c, tip, note, warn, vid, obj, quiz, assignment } from "../seedkit";

export const reactCourse: CourseSeed = {
  id: "crs_react",
  slug: "react-building-modern-interfaces",
  title: "React: Building Modern Interfaces",
  subtitle: "Components, state and data flow — build the interfaces users actually interact with.",
  description:
    "For developers comfortable with HTML, CSS and JavaScript. You learn React the way production teams use it: components as functions, state as the source of truth, effects for the outside world — with a course project that grows module by module.",
  category: "web-development",
  level: "Intermediate",
  duration_hours: 34,
  price: 3499,
  original_price: 4999,
  cover_variant: "rings",
  cover_code: "KS-RCT-06",
  outcomes: [
    "Think in components: composition, props and children",
    "Manage state with useState and lift it correctly",
    "Handle events and forms the React way",
    "Fetch data and handle loading and error states",
    "Route between pages with React Router",
    "Apply patterns used in real codebases: lists, keys, derived state",
  ],
  requirements: [
    "Solid HTML, CSS and JavaScript (the Web Development Fundamentals course or equivalent)",
    "Modern browser and Node.js 18+ (setup in Module 1)",
  ],
  projects: [
    { title: "Course Catalogue UI", description: "A filterable course catalogue with search, category filters and detail views — grown across the course.", tags: ["Components", "State"] },
    { title: "Dashboard with Live Data", description: "A dashboard that fetches from a public API with loading, empty and error states.", tags: ["Effects", "Data"] },
  ],
  faqs: [
    { q: "I only know a little JavaScript — can I start?", a: "You'll manage, but you'll move slowly. Arrow functions, array methods like map/filter and destructuring are prerequisites; Module 1 has a refresher checklist." },
    { q: "Does the course cover class components?", a: "Only briefly, for reading legacy code. Everything taught is the modern function-component + hooks style used by current teams." },
  ],
  instructors: [{ slug: "rahul-verma", role: "Lead Instructor" }],
  modules: [
    {
      title: "Thinking in Components",
      summary: "Why React exists, JSX, and your first components.",
      lessons: [
        {
          title: "Why React",
          type: "video",
          min: 10,
          free: true,
          blocks: [
            vid("09:05", [
              { t: "00:00", label: "The DOM update problem" },
              { t: "03:15", label: "UI = f(state)" },
              { t: "06:40", label: "Component thinking" },
            ]),
            t("Manual DOM code answers 'what changed?' by hand. React inverts it: you **describe** the UI for a given state and let React compute the updates. That one idea is the whole course."),
            c("jsx", `function Badge({ text }) {
  return <span className="badge">{text}</span>;
}

export default function App() {
  return (
    <main>
      <h1>Catalogue</h1>
      <Badge text="Programming" />
      <Badge text="Databases" />
    </main>
  );
}`, "App.jsx"),
          ],
        },
        {
          title: "JSX Rules",
          min: 12,
          blocks: [
            t("JSX is JavaScript that returns markup: one root element, `className` not class, `{}` for any expression, and components capitalized or treated as HTML tags."),
            c("jsx", `const name = "Aarav";
const el = (
  <div className="card">
    <h2>Hello, {name}</h2>
    {marks >= 60 && <Badge text="Pass" />}   {/* conditional */}
  </div>
);`),
            note("It's not a template engine", "Anything inside {} is plain JavaScript — map, ternaries, function calls. That's why you never learn a template mini-language."),
          ],
        },
        {
          title: "Props: Data Down",
          min: 12,
          blocks: [
            c("jsx", `function CourseCard({ title, level, price }) {
  return (
    <article className="card">
      <h3>{title}</h3>
      <span>{level}</span>
      <strong>₹{price.toLocaleString("en-IN")}</strong>
    </article>
  );
}

<CourseCard title="Java Programming" level="Beginner" price={2999} />`),
            tip("Props are read-only", "A component never edits its props — data flows down, events flow up. This discipline keeps large UIs debuggable."),
          ],
        },
        {
          title: "Project Setup with Vite",
          min: 10,
          blocks: [
            c("bash", `npm create vite@latest catalogue -- --template react
cd catalogue && npm install && npm run dev`),
            t("Vite gives instant dev reload and a production build. The files that matter: `src/main.jsx` (mounts App) and `src/App.jsx` (your root component)."),
          ],
        },
      ],
    },
    {
      title: "State and Events",
      summary: "useState, lifting state, forms and lists.",
      lessons: [
        {
          title: "useState",
          min: 13,
          blocks: [
            c("jsx", `import { useState } from "react";

function FilterBar() {
  const [query, setQuery] = useState("");
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search courses…"
    />
  );
}`),
            t("Calling the setter **re-renders** the component with new state. State is per-component-instance and survives re-renders — ordinary variables don't."),
            warn("Never mutate state directly", "`items.push(x)` changes nothing React can see. Replace: `setItems([...items, x])`."),
          ],
        },
        {
          title: "Rendering Lists and Keys",
          min: 11,
          blocks: [
            c("jsx", `{courses.map((course) => (
  <CourseCard key={course.id} {...course} />
))}`),
            t("Keys let React match items across renders — use a stable id, never the array index (breaks on reorder)."),
          ],
        },
        {
          title: "Lifting State Up",
          min: 13,
          blocks: [
            t("When two components need the same data, move the state to their **closest common parent** and pass values + setters down. This pattern resolves 90% of 'how do siblings share state?' questions."),
            c("jsx", `function App() {
  const [query, setQuery] = useState("");
  const visible = courses.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <>
      <SearchBox query={query} onQuery={setQuery} />
      <CourseList courses={visible} />
    </>
  );
}`),
          ],
        },
        {
          title: "Forms and Controlled Inputs",
          min: 12,
          blocks: [
            c("jsx", `const [form, setForm] = useState({ name: "", email: "" });

<input value={form.name}
  onChange={(e) => setForm({ ...form, name: e.target.value })} />

onSubmit={(e) => {
  e.preventDefault();
  if (!form.name.trim()) return setError("Name required");
  submit(form);
}}`),
          ],
        },
        {
          title: "Checkpoint Quiz: Components and State",
          type: "quiz",
          min: 8,
          blocks: [t("Five questions on Modules 1–2.")],
          quiz: {
            pass: 60,
            questions: [
              {
                q: "What re-renders a component with new data?",
                opts: ["Mutating a variable", "Calling its state setter", "Reloading the page", "Reassigning props"],
                correct: 1,
                why: "State setters schedule a re-render; mutation is invisible to React.",
              },
              {
                q: "Why do lists need a stable key?",
                opts: ["For CSS styling", "So React can match items across renders", "For SEO", "Keys are optional decoration"],
                correct: 1,
                why: "Keys identify items so updates, reorders and deletions stay correct.",
              },
              {
                q: "Props are…",
                opts: ["Editable by the child", "Read-only inputs", "Global variables", "Only strings"],
                correct: 1,
                why: "Data flows down; children communicate up via callbacks.",
              },
              {
                q: "Two siblings need the same state. You should…",
                opts: ["Duplicate it in both", "Use a global variable", "Lift it to the common parent", "Put it in the DOM"],
                correct: 2,
                why: "Lifting state up is the canonical sharing pattern.",
              },
              {
                q: "Which expression class is `className`?",
                opts: ["A typo", "JSX's name for the HTML class attribute", "A React prop", "A CSS module"],
                correct: 1,
                why: "JSX aligns with DOM property names — hence className and htmlFor.",
              },
            ],
          },
        },
      ],
    },
    {
      title: "Effects and Data",
      summary: "useEffect, fetching, loading/error states and cleanup.",
      lessons: [
        {
          title: "useEffect Basics",
          min: 13,
          blocks: [
            c("jsx", `import { useEffect, useState } from "react";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => { setCourses(data); setStatus("done"); })
      .catch(() => setStatus("error"));
  }, []);   // [] = run once after mount

  if (status === "loading") return <CoursesSkeleton />;
  if (status === "error") return <ErrorState onRetry={() => setStatus("loading")} />;
  return <CourseList courses={courses} />;
}`),
            tip("Render states, not spinners only", "Every data screen has four states: loading, empty, error, success. Design all four and your app instantly feels professional."),
          ],
        },
        {
          title: "Dependencies and Cleanup",
          min: 12,
          blocks: [
            t("Effects re-run when their dependency array changes; return a cleanup function to cancel subscriptions, timers or in-flight requests."),
            c("jsx", `useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal }).then(/* ... */);
  return () => controller.abort();     // runs before next run/unmount
}, [url]);`),
          ],
        },
        {
          title: "Custom Hooks",
          min: 12,
          blocks: [
            c("jsx", `function useCourses(url) {
  const [state, setState] = useState({ status: "loading", data: [] });
  useEffect(() => { /* fetch logic */ }, [url]);
  return state;
}

// every component now shares one tested data pattern
const { status, data } = useCourses("/api/courses");`),
            note("Rules of hooks", "Only call hooks at the top level of components or other hooks — never inside conditions or loops. The linter enforces this; let it."),
          ],
        },
        {
          title: "Project: Dashboard with Live Data",
          type: "assignment",
          min: 90,
          blocks: [t("Build a dashboard consuming a public API with all four UI states, retry on error, and a custom hook extracting the data logic.")],
          assignment: {
            title: "Dashboard with Live Data",
            brief: "Submit the repo link. Reviewed: the four states, cleanup in effects, one custom hook, and component structure.",
            max: 100,
          },
        },
      ],
    },
    {
      title: "Routing and Composition",
      summary: "Multi-page SPAs with React Router and component patterns.",
      lessons: [
        {
          title: "React Router",
          min: 13,
          blocks: [
            c("jsx", `import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

<BrowserRouter>
  <nav><Link to="/courses">Courses</Link></nav>
  <Routes>
    <Route path="/courses" element={<CourseList />} />
    <Route path="/courses/:slug" element={<CourseDetail />} />
  </Routes>
</BrowserRouter>`),
            t("`useParams()` reads route parameters; navigation is programmatic with `useNavigate()`. The URL becomes state you can share and bookmark."),
          ],
        },
        {
          title: "Composition Patterns",
          min: 12,
          blocks: [
            c("jsx", `function Card({ title, children, footer }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      <div>{children}</div>
      {footer && <footer>{footer}</footer>}
    </section>
  );
}`),
            t("`children` and slots make components **reusable without configuration** — the difference between a design system and a pile of one-off widgets."),
          ],
        },
        {
          title: "Final Project: Course Catalogue UI",
          type: "assignment",
          min: 180,
          blocks: [t("Assemble the course project: catalogue with search + filters, detail routes, dashboard with fetched data, designed empty and error states — deployed.")],
          assignment: {
            title: "Course Catalogue UI — Final",
            brief: "Submit the deployed link plus repo. Reviewed: component breakdown, state placement, data fetching with a custom hook, routing, and the polish of all UI states.",
            max: 100,
          },
        },
      ],
    },
  ],
};

export const dsaCourse: CourseSeed = {
  id: "crs_dsa",
  slug: "data-structures-algorithms-cpp",
  title: "Data Structures & Algorithms in C++",
  subtitle: "Big-O thinking, core data structures and the standard algorithm toolkit — problem-first.",
  description:
    "A rigorous, problem-driven course. Every concept is introduced through a problem it solves: arrays to two-pointers, hashing to frequency maps, trees to recursion you can actually trace. Weekly problem sets with hints and solutions included.",
  category: "data-structures",
  level: "Intermediate",
  duration_hours: 45,
  price: 3999,
  original_price: 5499,
  cover_variant: "grid",
  cover_code: "KS-DSA-07",
  outcomes: [
    "Analyse time and space with Big-O and reason about trade-offs",
    "Implement arrays, strings, stacks, queues, linked lists",
    "Use hashing for frequency, grouping and lookups",
    "Master binary search and its variants",
    "Write and trace recursion and backtracking",
    "Solve classic tree and graph traversals (BFS/DFS)",
    "Prepare a repeatable system for interview problems",
  ],
  requirements: [
    "Comfortable with one programming language (C++ taught from zero in Module 1)",
    "Weekly time for problem sets (this course is practice-heavy)",
  ],
  projects: [
    { title: "Problem Journal", description: "A structured journal of 50+ solved problems with patterns, complexity notes and retried failures.", tags: ["Practice"] },
    { title: "Contest Simulation", description: "Three timed mock contests with post-mortem analysis of approach and complexity.", tags: ["Interviews"] },
  ],
  faqs: [
    { q: "Why C++ for DSA?", a: "Its standard library exposes the structures you're studying as raw material — vectors, maps, sets, priority queues — so you learn the concepts, not framework conveniences. Patterns transfer to any language." },
    { q: "How is this different from a 'Java/Python DSA' course?", a: "Only the syntax. The thinking — patterns, complexity, tracing — is identical, and we say so explicitly wherever an idea is language-independent." },
    { q: "Is this course enough for product-company interviews?", a: "It covers the core canon interviewers draw from. Pair it with consistent weekly practice after the course; the final module gives you the system." },
  ],
  instructors: [{ slug: "sana-iqbal", role: "Lead Instructor" }],
  modules: [
    {
      title: "C++ Essentials and Complexity",
      summary: "Just enough C++, and the Big-O habit.",
      lessons: [
        {
          title: "Course Orientation + C++ Crash Start",
          type: "video",
          min: 14,
          free: true,
          blocks: [
            vid("12:30", [
              { t: "00:00", label: "How problem sets work" },
              { t: "04:00", label: "C++ skeleton program" },
              { t: "08:20", label: "Reading constraints" },
            ]),
            c("cpp", `#include <bits/stdc++.h>
using namespace std;

int main() {
    int n; cin >> n;                  // read input
    vector<int> a(n);
    for (int &x : a) cin >> x;

    long long sum = accumulate(a.begin(), a.end(), 0LL);
    cout << sum << "\\n";
}`, "main.cpp"),
            obj(["Set up a compiler + judge account", "Read a problem's constraints as complexity hints", "Use vector, cin/cout fluently"]),
            tip("Constraints are hints", "`n ≤ 10^5` rules out O(n²) — that's ~10^10 steps. Before coding, compute your intended complexity against the given bounds."),
          ],
        },
        {
          title: "Big-O Notation in Practice",
          min: 15,
          blocks: [
            t("Big-O describes how work grows with input size. The ladder you must internalise: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)."),
            c("cpp", `// O(n)    — one pass
for (int x : a) total += x;

// O(n^2)  — all pairs
for (int i = 0; i < n; i++)
  for (int j = i + 1; j < n; j++)
    check(a[i], a[j]);

// O(log n) — halving each step
while (lo <= hi) { /* binary search step */ }`),
            note("Space counts too", "A frequency map costs O(k) extra memory. Interviewers ask for both axes — get used to stating them."),
          ],
        },
        {
          title: "Arrays and Two Pointers",
          min: 14,
          blocks: [
            c("cpp", `// two-sum on a SORTED array — O(n)
int l = 0, r = n - 1;
while (l < r) {
    int s = a[l] + a[r];
    if (s == target) return {l, r};
    else if (s < target) l++;
    else r--;
}`),
            t("Two pointers converts 'check all pairs' (O(n²)) into a single sweep (O(n)) whenever order gives you a reason to move one side. It returns constantly: pairs, palindromes, partitioning, sliding windows."),
          ],
        },
        {
          title: "Prefix Sums and Sliding Windows",
          min: 14,
          blocks: [
            c("cpp", `// max sum of any k consecutive elements — O(n)
long long win = 0;
for (int i = 0; i < k; i++) win += a[i];
long long best = win;
for (int i = k; i < n; i++) {
    win += a[i] - a[i - k];     // slide: add new, drop old
    best = max(best, win);
}`),
          ],
        },
        {
          title: "Problem Set 1",
          min: 120,
          blocks: [t("Ten problems: two-pointer classics, window maxima, prefix-sum range queries. Hints unlock progressively; full solutions with complexity notes are provided after submission.")],
        },
      ],
    },
    {
      title: "Hashing and Sorting",
      summary: "Frequency thinking and the sort toolbox.",
      lessons: [
        {
          title: "Hash Maps and Sets",
          min: 13,
          blocks: [
            c("cpp", `unordered_map<string,int> freq;
for (string &w : words) freq[w]++;      // O(1) average per word

// first non-repeating character
for (char ch : s) if (freq[string(1,ch)] == 1) { /* found */ }`),
            t("Hashing trades memory for time: O(n²) 'does this exist?' loops become O(n) with a set. If a problem says 'find/count/unique', think map first."),
          ],
        },
        {
          title: "Sorting and Custom Comparators",
          min: 13,
          blocks: [
            c("cpp", `sort(a.begin(), a.end());                       // ascending

sort(items.begin(), items.end(), [](const Item &x, const Item &y) {
    return x.value > y.value;                   // descending by value
});

// stable sort keeps equal elements in original order
stable_sort(logs.begin(), logs.end(), cmp);`),
            tip("Sort to unlock", "Many hard problems become easy after sorting — two-sum, merge intervals, meeting rooms. 'Can I sort?' is always worth asking."),
          ],
        },
        {
          title: "Greedy Thinking",
          min: 13,
          blocks: [
            t("Greedy algorithms make the locally best choice and never look back. They work when a **proof** (exchange argument) backs them — intervals, scheduling, minimum coins with canonical systems."),
            c("cpp", `// max non-overlapping intervals: always take earliest end
sort(iv.begin(), iv.end(), byEnd);
int taken = 0, lastEnd = INT_MIN;
for (auto &[s, e] : iv)
    if (s >= lastEnd) { taken++; lastEnd = e; }`),
          ],
        },
        {
          title: "Problem Set 2",
          min: 120,
          blocks: [t("Ten problems: frequency maps, anagram grouping, interval merging, greedy scheduling.")],
        },
      ],
    },
    {
      title: "Stacks, Queues and Linked Lists",
      summary: "Linear structures and their canonical problems.",
      lessons: [
        {
          title: "Stacks",
          min: 12,
          blocks: [
            c("cpp", `stack<int> st;
st.push(3); st.pop(); st.top();

// classic: matching brackets
for (char ch : s) {
    if (ch == '(') st.push(ch);
    else if (!st.empty()) st.pop();
    else return false;
}
return st.empty();`),
            t("A stack (LIFO) powers undo, parsing, DFS and 'nearest greater element' families. If a problem involves nesting, reach for a stack."),
          ],
        },
        {
          title: "Queues and Deques",
          min: 12,
          blocks: [
            c("cpp", `queue<int> q; q.push(1); q.front(); q.pop();
deque<int> dq; dq.push_front(1); dq.push_back(2); dq.pop_back();`),
            t("Queues (FIFO) drive BFS and task scheduling; deques solve sliding-window max/min in O(n) with the monotonic trick."),
          ],
        },
        {
          title: "Linked Lists",
          min: 13,
          blocks: [
            c("cpp", `struct Node { int val; Node* next; };

// the two moves you must own:
// fast/slow pointers find the middle or detect cycles
Node *slow = head, *fast = head;
while (fast && fast->next) {
    slow = slow->next; fast = fast->next->next;
}`),
          ],
        },
        {
          title: "Problem Set 3",
          min: 120,
          blocks: [t("Ten problems: valid parentheses, min-stack, monotonic window max, list reversal, cycle detection, LRU design sketch.")],
        },
      ],
    },
    {
      title: "Recursion and Trees",
      summary: "Recursion you can trace; binary trees and BSTs.",
      lessons: [
        {
          title: "Recursion Fundamentals",
          min: 14,
          blocks: [
            c("cpp", `int fact(int n) {
    if (n <= 1) return 1;          // base case
    return n * fact(n - 1);        // shrink toward it
}`),
            t("Every recursion needs a **base case** and progress toward it. Trace on paper: call stack, returns bubbling up. If you can't trace it, you can't debug it."),
          ],
        },
        {
          title: "Binary Trees and Traversals",
          min: 14,
          blocks: [
            c("cpp", `struct TN { int val; TN *left, *right; };

void inorder(TN* r) {            // left-root-right
    if (!r) return;
    inorder(r->left); cout << r->val; inorder(r->right);
}
int height(TN* r) {
    if (!r) return 0;
    return 1 + max(height(r->left), height(r->right));
}`),
          ],
        },
        {
          title: "Binary Search Trees",
          min: 12,
          blocks: [
            c("cpp", `// BST: left < node < right — search is O(h)
TN* search(TN* r, int x) {
    if (!r || r->val == x) return r;
    return x < r->val ? search(r->left, x) : search(r->right, x);
}`),
            note("h vs log n", "Operations cost O(h) — logarithmic only when the tree is balanced. Unbalanced trees degrade to chains; that observation motivates std::map (red-black tree)."),
          ],
        },
        {
          title: "Backtracking",
          min: 14,
          blocks: [
            c("cpp", `void gen(string cur, int open, int close, int n) {
    if ((int)cur.size() == 2 * n) { out.push_back(cur); return; }
    if (open < n)      gen(cur + "(", open + 1, close, n);
    if (close < open)  gen(cur + ")", open, close + 1, n);
}`),
            t("Backtracking = recursion + undo. Choose, explore, un-choose. It solves permutations, subsets, N-queens, sudoku — and interviews love it."),
          ],
        },
        {
          title: "Problem Set 4",
          min: 120,
          blocks: [t("Ten problems: traversal variants, BST validation, subtree checks, subsets/permutations, path sums.")],
        },
      ],
    },
    {
      title: "Graphs and Interview System",
      summary: "BFS/DFS, shortest paths and your practice system.",
      lessons: [
        {
          title: "Graphs: Represent and Traverse",
          min: 15,
          blocks: [
            c("cpp", `vector<vector<int>> adj(n);
adj[u].push_back(v); adj[v].push_back(u);   // undirected edge

vector<int> vis(n, false);
void dfs(int u) {
    vis[u] = true;
    for (int v : adj[u]) if (!vis[v]) dfs(v);
}`),
            t("DFS dives (recursion/stack), BFS sweeps level by level (queue) — shortest unweighted paths come from BFS. Almost every graph problem is one of: connected components, cycles, reachability, shortest path, topological order."),
          ],
        },
        {
          title: "BFS Shortest Paths + Topological Sort",
          min: 14,
          blocks: [
            c("cpp", `// BFS gives shortest hop counts from src
queue<int> q; dist[src] = 0; q.push(src);
while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : adj[u]) if (dist[v] == -1) {
        dist[v] = dist[u] + 1; q.push(v);
    }
}`),
            c("cpp", `// topological order via Kahn's algorithm (in-degrees)
queue<int> ready;   // all nodes with in-degree 0
// pop, append to order, decrement neighbours; cycle iff order < n`),
          ],
        },
        {
          title: "Dynamic Programming — First Contact",
          min: 15,
          blocks: [
            c("cpp", `// climb stairs: ways(n) = ways(n-1) + ways(n-2)
vector<long long> dp(n + 1);
dp[0] = dp[1] = 1;
for (int i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];`),
            t("DP = recursion + memory. Start from the recurrence, build a table bottom-up. The course introduces the pattern and the standard families; mastery comes from the problem journal."),
          ],
        },
        {
          title: "Mock Contest 1",
          min: 120,
          blocks: [t("Timed: 4 problems, 2 hours. Post-mortem template: what pattern, what complexity, what you'd do differently.")],
        },
        {
          title: "Your Interview Practice System",
          min: 12,
          blocks: [
            t("Closing lesson: a weekly cadence that survives after the course — 3 problems/week from the journal's weak patterns, one timed set/week, re-solve failures after 7 days. Consistency beats intensity; the journal is the evidence."),
          ],
        },
      ],
    },
  ],
};
