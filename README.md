# KwikStudy

A production-quality website and learning platform for a programming education institute — public marketing site, course catalogue, enrollment & payments, a full student LMS (dashboard, lessons, quizzes, assignments, certificates) and an admin panel.

Built with **Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · better-sqlite3**.

---

## Quick start

```bash
npm install
npm run db:reset     # creates data/kwikstudy.db and seeds all content
npm run dev          # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

### Demo accounts

| Role    | Email                 | Password    |
| ------- | --------------------- | ----------- |
| Student | `student@kwikstudy.in`| `Student@123` |
| Admin   | `admin@kwikstudy.in`  | `Admin@123` |

The student account comes pre-seeded with a realistic learning record: Java Programming at 68% (module 6, exception handling), a completed Git & GitHub Essentials course with issued certificate `CERT-2026-0147` (verify at `/verify/CERT-2026-0147`), and a Web Development course just started. The admin account sees the management panel at `/admin`.

---

## What's inside

### Public site
- **Homepage** — hero with a real product-UI composition, institutional principles, teaching method, course catalogue, programs band, lesson feature split, faculty, FAQ + enquiry panel.
- **Courses** — catalogue with search, category filters, empty states; every course has a full detail page (overview, outcomes, expandable curriculum with free-preview lessons, projects, requirements, FAQs, sticky enroll card).
- **Programs** — multi-course learning tracks (Full Stack, Java Track, DSA & Interview Prep).
- **Instructors** — directory + full profiles (bio, expertise, teaching approach, courses).
- **About / Contact / FAQ / Enquire / Legal** — institutional pages with working enquiry and contact forms (server-validated, stored in DB, visible in the admin panel).
- **Certificates** — public verification at `/verify/[certificateId]`.
- SEO: per-page metadata, canonical URLs, Open Graph, JSON-LD `Course` schema, `sitemap.xml`, `robots.txt`, semantic HTML throughout.

### Student platform (authenticated)
- **Dashboard** — greeting, continue-learning, per-course progress, 4-week learning activity + streak (computed from real completion timestamps), upcoming assignments, certificates, recommendations.
- **Learning interface** (`/learn/[course]/[lesson]`) — curriculum sidebar with completion states, lesson content (video shell with chapters, objectives, syntax-highlighted code with copy, callouts), right rail with module map, resources and progress, prev/mark-complete/next navigation. Free-preview lessons are viewable without enrollment.
- **Quizzes** — one-question-at-a-time runner with progress, instant server-side grading (correct answers never sent to the client), explanations, pass score, retakes, attempts history.
- **Assignments** — brief, submission form (resubmittable), status tracking.
- **Certificates** — issued automatically when 100% of a course's lessons are completed.
- Profile management and password change (scrypt-hashed).

### Admin panel (`/admin`, role-gated)
Overview metrics, enquiry queue with status workflow (new → contacted → closed), students table with lifetime value, course structure view, payments ledger.

---

## Architecture

```
src/
  app/
    (public)/          # marketing + catalogue + checkout (navbar/footer shell)
    (auth)/            # login / register (split-screen shell)
    dashboard/         # student LMS (dark sidebar shell)
    learn/             # immersive lesson interface (own chrome)
    admin/             # admin panel (own shell, role-gated)
    api/search/        # global search endpoint
    logout/            # POST logout route
    sitemap.ts, robots.ts, icon.svg, not-found, error
  components/          # design-system + feature components
  lib/
    db.ts              # better-sqlite3 singleton + row types
    schema.sql         # normalized relational schema
    queries.ts         # read layer (catalog, curriculum, progress)
    session.ts         # cookie sessions (httpOnly), guards
    auth-core.ts       # scrypt hashing, tokens, HMAC signing
    payments.ts        # payment provider abstraction
    highlight.ts       # zero-dependency syntax highlighter
    blocks.ts          # lesson content block model
    actions/           # server actions: auth, enquiry, checkout, learn, profile, admin
scripts/seed.ts        # seed: categories, instructors, users, 7 courses, 3 programs, demo progress
scripts/seed/courses/  # per-course curriculum content (authoring format)
```

### Data model (normalized, relational)

`users · sessions · course_categories · instructors · courses · course_instructors · programs · program_courses · modules · lessons · lesson_resources · quizzes · quiz_questions · quiz_options · quiz_attempts · assignments · assignment_submissions · enrollments · lesson_progress · coupons · orders · payments · enquiries · certificates`

No giant JSON blobs — relationships are real foreign keys with indexes; lesson *content* (a sequence of typed blocks) is the one documented JSON column.

### Security

- scrypt password hashing, timing-safe verification; httpOnly, SameSite=Lax session cookies stored server-side.
- Middleware guards `/dashboard`, `/learn`, `/admin`, `/checkout`; role checks re-verified server-side in layouts and every action.
- Server actions validate all input (zod-style checks) and re-check authorization; enrollment-gated lesson access; quiz answers graded server-side only.
- Payments: orders, capture and enrollment activation happen exclusively on the server — frontend state can never mark an enrollment as paid.

### Payments abstraction

`src/lib/payments.ts` defines the provider interface (`createOrder` → `capture` with server-side verification). A deterministic **mock provider** keeps the checkout fully working without keys; selecting Razorpay is a matter of implementing the same interface and setting `PAYMENT_PROVIDER=razorpay` (stub included, keys via env). Coupons (`WELCOME10`, `EARLY20`) are seeded and validated server-side.

### Adding content

Curriculum lives in `scripts/seed/courses/*.ts` using a small authoring DSL (`t`, `c`, `tip`, `vid`, `obj`, quiz + assignment builders). Add a course file, register it in `scripts/seed.ts`, run `npm run db:reset`. The site (catalogue, detail pages, search, sitemap, admin) picks it up automatically.

### Honest-by-design

No fabricated statistics, testimonials, ratings, accreditations or campus photos. Course art is a generated SVG system; instructor avatars are designed initials; the "video" lessons use a designed player shell with chapters. Swap in real media by replacing the `video`/resource blocks.
