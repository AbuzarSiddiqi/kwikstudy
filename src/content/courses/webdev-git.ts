import { CourseSeed, t, c, tip, note, warn, vid, obj, quiz, assignment } from "../seedkit";

export const webDevCourse: CourseSeed = {
  id: "crs_webdev",
  slug: "web-development-fundamentals",
  title: "Web Development Fundamentals",
  subtitle: "How the web works — semantic HTML, modern CSS layout, and programming the page with JavaScript.",
  description:
    "Start from how a browser actually turns code into a page. You learn to write semantic, accessible HTML, style with CSS flexbox and grid, and make pages interactive with JavaScript — building real pages at every step instead of memorising tags.",
  category: "web-development",
  level: "Beginner",
  duration_hours: 30,
  price: 2199,
  original_price: 3299,
  cover_variant: "diagonal",
  cover_code: "KS-WEB-02",
  outcomes: [
    "Explain how browsers, servers, HTTP and DNS fit together",
    "Write semantic, accessible HTML documents",
    "Lay out pages with CSS flexbox and grid",
    "Make pages responsive from phone to desktop",
    "Program the DOM with JavaScript: events, forms, state",
    "Build and publish a small multi-section website",
  ],
  requirements: [
    "No coding experience required",
    "A computer with any modern browser",
    "Willingness to build small pages after every module",
  ],
  projects: [
    { title: "Personal Profile Page", description: "A semantic, accessible one-page profile with your own content and styling.", tags: ["HTML", "CSS"] },
    { title: "Responsive Landing Page", description: "A marketing-style landing page with grid layout, responsive nav and dark text system.", tags: ["CSS Grid", "Responsive"] },
    { title: "Interactive Quiz Widget", description: "A JavaScript quiz component with score tracking and dynamic DOM updates.", tags: ["JavaScript", "DOM"] },
  ],
  faqs: [
    { q: "Is this course enough to become a front-end developer?", a: "It gives you the foundation the role is built on — HTML, CSS and JavaScript. The React course that follows applies these skills to modern component frameworks." },
    { q: "Do I need to memorise all HTML tags?", a: "No. You learn the two dozen tags that matter daily and, more importantly, how to choose the right element semantically." },
    { q: "Which editor is used?", a: "Visual Studio Code, free on all platforms. Setup takes five minutes in Module 1." },
  ],
  instructors: [{ slug: "rahul-verma", role: "Lead Instructor" }],
  modules: [
    {
      title: "How the Web Works",
      summary: "Browsers, HTTP, DNS — and your first HTML document.",
      lessons: [
        {
          title: "Browsers, Servers and HTTP",
          type: "video",
          min: 12,
          free: true,
          blocks: [
            vid("10:24", [
              { t: "00:00", label: "What happens when you type a URL" },
              { t: "03:10", label: "Requests and responses" },
              { t: "06:45", label: "HTML, CSS and JS roles" },
            ]),
            obj([
              "Trace a URL from address bar to rendered page",
              "Name the three core web technologies and their roles",
              "Read a simple HTTP request/response exchange",
            ]),
            t("Typing a URL triggers a chain: **DNS** turns the name into an IP address, your browser opens a connection and sends an **HTTP request**, the server responds with status, headers and a body — usually HTML. The browser then fetches referenced CSS and JavaScript and **renders** the page."),
            c("bash", `$ curl -i https://example.com
HTTP/2 200
content-type: text/html; charset=UTF-8

<!doctype html>
<html>...`, "terminal"),
            note("View source is a textbook", "Open any page's source (Ctrl/Cmd+U) and you're reading the HTML the server actually sent — the fastest way to see how real sites are structured."),
          ],
        },
        {
          title: "Your First HTML Document",
          min: 12,
          blocks: [
            t("HTML describes **structure and meaning** — not appearance. A minimal valid page has a doctype, a root `html` element and two children: `head` (metadata) and `body` (content)."),
            c("html", `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My first page</title>
  </head>
  <body>
    <h1>Hello, web</h1>
    <p>My first <strong>semantic</strong> paragraph.</p>
  </body>
</html>`, "index.html"),
            tip("Elements vs tags", "`<p>` opens, `</p>` closes; the whole thing (content included) is an **element**. Void elements like `<img>` and `<br>` have no closing tag."),
          ],
        },
        {
          title: "Text, Links and Lists",
          min: 14,
          blocks: [
            t("Choose elements by **meaning**: `h1–h6` for heading hierarchy (one `h1` per page), `p` for paragraphs, `ul/ol` + `li` for lists, `a` for links, `strong`/`em` for emphasis."),
            c("html", `<h1>KwikStudy Notes</h1>
<nav aria-label="Main">
  <ul>
    <li><a href="#courses">Courses</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="https://developer.mozilla.org" target="_blank" rel="noopener">MDN ↗</a></li>
  </ul>
</nav>
<article>
  <h2>Week 1 summary</h2>
  <p>Links need <strong>descriptive text</strong> — never 'click here'.</p>
</article>`),
            warn("Accessibility habit", "Screen readers navigate by headings and link text. 'Click here' tells them nothing; 'Download the week 1 PDF (PDF, 240 KB)' tells them everything."),
          ],
        },
        {
          title: "Images, Media and Attributes",
          min: 11,
          blocks: [
            t("Images use `src`, `alt`, and sizing attributes; modern formats and `loading=\"lazy\"` keep pages fast."),
            c("html", `<img
  src="campus.png"
  alt="Students collaborating at a study table"
  width="800" height="450"
  loading="lazy">

<figure>
  <img src="chart.svg" alt="Enrolments by month, rising trend">
  <figcaption>Figure 1 — Enrolments since January</figcaption>
</figure>`),
            note("alt text rule", "Describe the image's **purpose**, not its pixels. Decorative images get an empty `alt=\"\"` so screen readers skip them."),
          ],
        },
      ],
    },
    {
      title: "Styling with CSS",
      summary: "Selectors, the box model, colours and typography.",
      lessons: [
        {
          title: "CSS Basics: Selectors and the Cascade",
          min: 13,
          blocks: [
            t("CSS matches elements with **selectors** and applies declarations from most to least specific — the **cascade**. Learn element, class, id and combination selectors; that covers 95% of daily work."),
            c("css", `/* element */  p { line-height: 1.6; }
/* class */    .btn { padding: 8px 16px; }
/* id (use sparingly) */ #header { border-bottom: 1px solid #ddd; }
/* combo */    ul.nav > li a:hover { text-decoration: underline; }

/* variables keep colour use consistent */
:root { --ink: #11202b; --accent: #c04a12; }
a { color: var(--accent); }`, "styles.css"),
            tip("Specificity discipline", "Prefer classes over ids in selectors — lower specificity is easier to override later. If a style 'won't apply', an equal-or-higher specificity rule is usually winning."),
          ],
        },
        {
          title: "The Box Model",
          min: 12,
          blocks: [
            t("Every element is a box: **content → padding → border → margin**. Master the box model and half of CSS mysteries disappear."),
            c("css", `.card {
  width: 320px;
  padding: 16px;        /* inside space */
  border: 1px solid #ddd;
  margin: 24px auto;    /* outside space, centred */
  box-sizing: border-box;   /* width includes padding+border */
}
* , *::before, *::after { box-sizing: border-box; } /* sensible default */`),
            note("DevTools box view", "In the browser DevTools, the Computed panel draws the box model live — the fastest way to debug unexpected spacing."),
          ],
        },
        {
          title: "Colour, Typography and Spacing Systems",
          min: 13,
          blocks: [
            t("Good pages come from **restraint**: one text colour, one muted colour, one accent; a type scale of 4–5 sizes; spacing in consistent steps (4, 8, 12, 16, 24, 32…)."),
            c("css", `body  { font: 16px/1.6 system-ui, sans-serif; color: #2a4152; }
h1    { font-size: 2rem; line-height: 1.2; }
h2    { font-size: 1.5rem; }
small { font-size: 0.8rem; color: #617484; }

:root {
  --space-1: 8px; --space-2: 16px; --space-3: 24px; --space-4: 32px;
}`),
          ],
        },
        {
          title: "Project: Personal Profile Page",
          type: "assignment",
          min: 60,
          blocks: [
            t("Build a one-page profile: header with name and tagline, an about section, a list of skills, and contact links — all semantic HTML styled with the systems from this module."),
          ],
          assignment: {
            title: "Personal Profile Page",
            brief: "Submit your index.html and styles.css (or a link to your repo). Checklist: one h1, semantic sections, images with alt text, a spacing scale, and one accent colour used for links/buttons only.",
            max: 100,
          },
        },
      ],
    },
    {
      title: "Layout: Flexbox and Grid",
      summary: "Modern layout systems and responsive design.",
      lessons: [
        {
          title: "Flexbox for Components",
          min: 15,
          blocks: [
            t("Flexbox lays out children **along one axis** — nav bars, button rows, card interiors. Learn `justify-content` (main axis), `align-items` (cross axis), `gap`, and `flex: 1` for growing items."),
            c("css", `.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.card-list { display: flex; flex-wrap: wrap; gap: 24px; }
.card      { flex: 1 1 260px; }  /* grow, shrink, base width */`),
          ],
        },
        {
          title: "CSS Grid for Pages",
          min: 15,
          blocks: [
            t("Grid lays out content in **two dimensions** — page scaffolding, image galleries, dashboard areas. Define columns/rows, place items, done."),
            c("css", `.page {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
}
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}`),
            tip("Which one when?", "Content-out, one direction, roughly unknown sizes → flexbox. Layout-in, both directions, known areas → grid. They compose: grid for the page, flex inside each card."),
          ],
        },
        {
          title: "Responsive Design and Media Queries",
          min: 14,
          blocks: [
            t("Start from a small screen and add breakpoints **when the content asks for them** — commonly near 640px, 900px and 1200px. Use `rem` units, fluid images and `clamp()` for type that scales smoothly."),
            c("css", `.cards { display: grid; gap: 16px; }

@media (min-width: 700px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1100px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}

h1 { font-size: clamp(1.75rem, 4vw, 2.75rem); }`),
          ],
        },
        {
          title: "Checkpoint Quiz: HTML and CSS",
          type: "quiz",
          min: 8,
          blocks: [t("Five questions on Modules 1–3.")],
          quiz: {
            pass: 60,
            questions: [
              {
                q: "Which element best marks a standalone, self-contained post?",
                opts: ["<div>", "<section>", "<article>", "<span>"],
                correct: 2,
                why: "article is for content that makes sense on its own — a post, a card, a comment.",
              },
              {
                q: "In the box model, which layer sits directly outside the border?",
                opts: ["padding", "margin", "content", "outline"],
                correct: 1,
                why: "Order: content → padding → border → margin.",
              },
              {
                q: "Which property adds space between flex items without outer gaps?",
                opts: ["margin", "padding", "gap", "space"],
                correct: 2,
                why: "gap spaces children cleanly without collapsing-margin headaches.",
              },
              {
                q: "Best tool for a full two-dimensional page skeleton?",
                opts: ["floats", "CSS grid", "flexbox", "tables"],
                correct: 1,
                why: "Grid handles rows AND columns — two-dimensional layout.",
              },
              {
                q: "When should you add a breakpoint?",
                opts: ["Every 100px", "Only at 768px and 1024px", "When the content starts to look cramped", "Never, sites should be desktop-only"],
                correct: 2,
                why: "Content-driven breakpoints beat device-driven ones.",
              },
            ],
          },
        },
      ],
    },
    {
      title: "JavaScript and the DOM",
      summary: "Making pages interactive: events, forms and dynamic content.",
      lessons: [
        {
          title: "JavaScript in the Page",
          min: 13,
          blocks: [
            t("JavaScript gives pages behaviour. Start with variables (`const`/`let`), functions, and **selecting** elements to change."),
            c("html", `<script src="app.js" defer></script>`, "index.html"),
            c("javascript", `// app.js — runs after HTML is parsed thanks to defer
const heading = document.querySelector("h1");
heading.textContent = "Edited by JavaScript";

const btn = document.createElement("button");
btn.textContent = "Say hi";
btn.addEventListener("click", () => alert("Hi!"));
document.body.append(btn);`),
            note("defer by default", "`defer` loads the script without blocking HTML parsing and runs it in order — the right choice for almost every script tag."),
          ],
        },
        {
          title: "Events and Interaction",
          min: 14,
          blocks: [
            t("Code responds to **events** — clicks, input, submit. Attach listeners, read event data, update the page in response."),
            c("javascript", `const form = document.querySelector("#signup");

form.addEventListener("submit", (event) => {
  event.preventDefault();                 // stop the page reload
  const name = form.elements.name.value.trim();
  if (!name) {
    document.querySelector("#error").textContent = "Name is required";
    return;
  }
  document.querySelector("#greeting").textContent = \`Welcome, \${name}!\`;
  form.reset();
});`),
          ],
        },
        {
          title: "Building DOM Content Dynamically",
          min: 14,
          blocks: [
            t("Real interfaces render data. Keep a JS array as the source of truth and build elements from it — the mental model behind every framework you'll learn later."),
            c("javascript", `const courses = [
  { title: "Java Programming", price: 2999 },
  { title: "SQL & Databases",  price: 1999 },
];

const list = document.querySelector("#course-list");
for (const course of courses) {
  const li = document.createElement("li");
  li.textContent = \`\${course.title} — ₹\${course.price.toLocaleString("en-IN")}\`;
  list.append(li);
}`),
            warn("innerHTML with data", "Building HTML strings with user data invites XSS. Prefer `createElement` + `textContent`, which treat data as text, never markup."),
          ],
        },
        {
          title: "Project: Interactive Quiz Widget",
          type: "assignment",
          min: 90,
          blocks: [
            t("Capstone for the module: a quiz widget that shows one question at a time, tracks the score, and displays a results screen with a retry button."),
          ],
          assignment: {
            title: "Interactive Quiz Widget",
            brief: "Submit the HTML/CSS/JS files or a repo link. Requirements: at least 3 questions, score tracking, feedback after each answer, and a results screen. Bonus: timer per question.",
            max: 100,
          },
        },
      ],
    },
  ],
};

export const gitCourse: CourseSeed = {
  id: "crs_git",
  slug: "git-github-essentials",
  title: "Git & GitHub Essentials",
  subtitle: "Version control from first commit to pull requests — the workflow used by real teams every day.",
  description:
    "A focused, practical course on version control. You learn to track history with Git, undo mistakes safely, branch and merge, collaborate through GitHub, and follow team conventions like meaningful commits and pull-request reviews.",
  category: "programming",
  level: "Beginner",
  duration_hours: 8,
  price: 799,
  original_price: 1299,
  cover_variant: "dots",
  cover_code: "KS-GIT-03",
  outcomes: [
    "Track a project's history with commits",
    "Undo changes safely at three levels",
    "Branch, merge and resolve conflicts calmly",
    "Push, pull and open pull requests on GitHub",
    "Write commit messages and PR descriptions teams appreciate",
  ],
  requirements: ["Any computer with Git installed (covered in Module 1)", "A free GitHub account (Module 4)"],
  projects: [
    { title: "Your Public Portfolio Repo", description: "A real GitHub repository with a README, history and one merged pull request — created by you.", tags: ["Git", "GitHub"] },
  ],
  faqs: [
    { q: "I know the basic commands already — is this course useful?", a: "Yes if undo, rebase vs merge, or conflict resolution feel uncertain. Module 2 and Module 3 are built around exactly those moments." },
    { q: "Do I need a coding project to follow along?", a: "No. All exercises work on plain text files; you can apply the workflow to any project afterwards." },
  ],
  instructors: [{ slug: "arjun-mehta", role: "Instructor" }],
  modules: [
    {
      title: "Version Control Basics",
      summary: "Why Git exists, installation and your first repository.",
      lessons: [
        {
          title: "Why Version Control",
          type: "video",
          min: 9,
          free: true,
          blocks: [
            vid("08:12", [
              { t: "00:00", label: "The copy_final_v3 problem" },
              { t: "02:40", label: "Commits as checkpoints" },
              { t: "05:30", label: "How teams use Git" },
            ]),
            t("Version control records **who changed what, when, and why** — and lets you rewind to any point. Git is distributed: every clone holds the full history, so almost everything works offline."),
          ],
        },
        {
          title: "Installing and Configuring Git",
          min: 8,
          blocks: [
            c("bash", `# install: git-scm.com, or:
brew install git          # macOS
sudo apt install git      # Ubuntu

# one-time identity (appears on every commit)
git config --global user.name "Aarav Sharma"
git config --global user.email "aarav@example.com"

# the two settings that prevent future pain
git config --global init.defaultBranch main
git config --global pull.rebase false`, "terminal"),
            tip("Check your config", "`git config --global --list` shows everything you've set. If commits show the wrong author, it's fixed here in one line."),
          ],
        },
        {
          title: "Your First Repository",
          min: 12,
          blocks: [
            t("A **repository** is a project folder whose history Git tracks. `git init` creates one; `git status` is your ever-present guide."),
            c("bash", `mkdir notes && cd notes
git init                    # -> Initialized empty Git repository
echo "# Study Notes" > README.md
git status                  # README.md listed under "Untracked"

git add README.md           # stage it
git commit -m "Add notes skeleton"   # record the checkpoint
git log --oneline           # see the history`, "terminal"),
            note("Staging area", "`git add` stages changes into a snapshot proposal; `git commit` records it. This two-step is what makes partial commits possible."),
          ],
        },
      ],
    },
    {
      title: "Everyday Git",
      summary: "The commit loop, history, undo and .gitignore.",
      lessons: [
        {
          title: "Staging and Committing Well",
          min: 11,
          blocks: [
            t("Small, frequent commits with **descriptive messages** turn history into documentation. A good message completes: 'If applied, this commit will ___'."),
            c("bash", `git add index.html styles.css
git commit -m "Add responsive course card styles"

# stage interactively, hunk by hunk
git add -p

# amend the last commit's message (before pushing!)
git commit --amend -m "Add responsive card grid styles"`, "terminal"),
            warn("Amend only unpushed work", "Amending rewrites history. Once others have your commit, write a new commit instead."),
          ],
        },
        {
          title: "Viewing History and Diffs",
          min: 10,
          blocks: [
            c("bash", `git log --oneline --graph --all -15
git show HEAD                 # what the last commit changed
git diff                      # unstaged changes
git diff --staged             # what's about to be committed
git diff main..feature/quiz   # branch vs branch`, "terminal"),
            tip("diff before every commit", "Reading your own diff is the cheapest code review there is — stray debug lines get caught before they land."),
          ],
        },
        {
          title: "Undoing Changes Safely",
          min: 13,
          blocks: [
            t("Three common rescues, from safest to sharpest:"),
            c("bash", `# 1. discard edits in one file (last commit's version)
git restore styles.css

# 2. unstage, keep the edits
git restore --staged app.js

# 3. undo the last commit, keep changes in the working area
git reset --soft HEAD~1

# 4. revert a commit that is already public
git revert a1b2c3d            # creates a new 'undo' commit`, "terminal"),
            warn("reset --hard", "`git reset --hard` deletes uncommitted work permanently. If you must, run `git stash` first — it keeps a recoverable copy."),
          ],
        },
        {
          title: "Ignoring Files with .gitignore",
          min: 8,
          blocks: [
            c("bash", `# .gitignore
node_modules/
dist/
*.log
.env
.DS_Store`, ".gitignore"),
            t("Ignored files stay local: secrets, build output and OS clutter never enter history. Note that ignoring a file **already tracked** requires `git rm --cached <file>` first."),
          ],
        },
        {
          title: "Checkpoint Quiz: Everyday Git",
          type: "quiz",
          min: 8,
          blocks: [t("Five questions on Module 2.")],
          quiz: {
            pass: 60,
            questions: [
              {
                q: "Which command records staged changes into history?",
                opts: ["git save", "git add", "git commit", "git push"],
                correct: 2,
                why: "add stages, commit records the staged snapshot locally.",
              },
              {
                q: "How do you safely undo a pushed commit?",
                opts: ["git reset --hard HEAD~1", "Delete the repo", "git revert <sha>", "git undo"],
                correct: 2,
                why: "revert adds a new undo commit — safe for shared history.",
              },
              {
                q: "What belongs in .gitignore?",
                opts: ["README.md", "Source files", "node_modules and .env", "Git itself"],
                correct: 2,
                why: "Dependencies, secrets and build output never belong in history.",
              },
              {
                q: "git status shows…",
                opts: ["Remote server status", "Working tree vs staging vs last commit", "Your config", "Branch permissions"],
                correct: 1,
                why: "It compares the three areas and is the best first command when lost.",
              },
              {
                q: "A good commit message should…",
                opts: ["Be one letter to save typing", "Complete 'If applied, this commit will…'", "Include 'update' only", "Be written after 10 commits"],
                correct: 1,
                why: "Imperative, specific messages make history searchable and reviewable.",
              },
            ],
          },
        },
      ],
    },
    {
      title: "Branching and Merging",
      summary: "Isolate work in branches and combine it without fear.",
      lessons: [
        {
          title: "Branches",
          min: 11,
          blocks: [
            c("bash", `git switch -c feature/quiz-widget   # create + switch
# ...work, commit, repeat...
git switch main                     # back to main
git merge feature/quiz-widget       # bring the work in
git branch -d feature/quiz-widget   # tidy up`, "terminal"),
            t("A branch is just a movable pointer to a commit — creating one is instant. Feature-branch workflow keeps `main` shippable while you experiment freely."),
          ],
        },
        {
          title: "Merging and Resolving Conflicts",
          min: 14,
          blocks: [
            t("Conflicts happen when two branches change the same lines. Git pauses mid-merge and marks both versions — you edit the file to the **intended result** and commit the resolution."),
            c("bash", `git merge feature/pricing
# CONFLICT in prices.html
# <<<<<<< HEAD
# <p>₹2,999</p>
# =======
# <p>₹2,499</p>
# >>>>>>> feature/pricing`, "terminal"),
            c("bash", `# 1. open prices.html, keep the correct version, delete markers
# 2.
git add prices.html
git commit                          # completes the merge`, "terminal"),
            tip("Conflict prevention", "Pull main into your branch often (or rebase) so conflicts arrive as small, easy ones instead of one giant one at merge time."),
          ],
        },
        {
          title: "Pull Requests on GitHub",
          min: 12,
          blocks: [
            t("A **pull request** proposes merging your branch: it shows the diff, hosts review comments and runs checks. Teams merge to `main` only through PRs — that's where code review lives."),
            c("bash", `git push -u origin feature/quiz-widget
# GitHub prints a link: "Create pull request for ..."
# Open PR -> write description -> request review -> merge`, "terminal"),
            note("PR description formula", "What it does, why it's needed, how to test it. Three short sections; reviewers will thank you."),
          ],
        },
      ],
    },
    {
      title: "Collaborating with GitHub",
      summary: "Remotes, push/pull and contributing to projects.",
      lessons: [
        {
          title: "Remotes: Pushing and Pulling",
          min: 11,
          blocks: [
            c("bash", `git remote add origin git@github.com:you/notes.git
git push -u origin main       # first push links the branches
git pull                      # fetch + integrate others' work`, "terminal"),
            t("Push publishes local commits; pull integrates remote ones. Do a `git pull` before starting work each session and pushes stay boring — which is the goal."),
          ],
        },
        {
          title: "Cloning and Contributing to Open Source",
          min: 12,
          blocks: [
            t("To contribute to a project you don't own: **fork** it on GitHub, clone **your fork**, create a branch, push, then open a PR against the upstream repository."),
            c("bash", `git clone git@github.com:you/docs.git
cd docs
git switch -c fix/typo-contributing
# ...fix, commit...
git push -u origin fix/typo-contributing`, "terminal"),
            tip("Read CONTRIBUTING.md first", "Almost every project lists its conventions there — branch naming, tests to run, PR format. Following it gets your PR merged faster."),
          ],
        },
        {
          title: "Portfolio Repo: Final Project",
          type: "assignment",
          min: 45,
          blocks: [t("Create your public portfolio repository: README with an introduction, meaningful commit history, a feature branch merged via pull request, and a .gitignore.")],
          assignment: {
            title: "Public Portfolio Repository",
            brief: "Submit the GitHub repo URL. Reviewers check: descriptive README, at least 6 meaningful commits, one merged pull request, and a sensible .gitignore.",
            max: 100,
          },
        },
      ],
    },
  ],
};
