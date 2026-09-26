/* KwikStudy relational schema — source of truth for the SQLite database.
   Kept as a TypeScript module so the SQL is bundled into the server build
   (required for serverless deploys where only traced files are available). */

export const SCHEMA_SQL = `
-- KwikStudy relational schema (SQLite)
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student','instructor','admin')),
  phone         TEXT,
  created_at    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS course_categories (
  id          TEXT PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS instructors (
  id                TEXT PRIMARY KEY,
  slug              TEXT NOT NULL UNIQUE,
  name              TEXT NOT NULL,
  role              TEXT NOT NULL,
  bio               TEXT NOT NULL,
  expertise         TEXT NOT NULL DEFAULT '[]',   -- json array
  experience_years  INTEGER NOT NULL DEFAULT 0,
  teaching_approach TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS courses (
  id             TEXT PRIMARY KEY,
  slug           TEXT NOT NULL UNIQUE,
  title          TEXT NOT NULL,
  subtitle       TEXT NOT NULL,
  description    TEXT NOT NULL,
  category_id    TEXT NOT NULL REFERENCES course_categories(id),
  level          TEXT NOT NULL,
  language       TEXT NOT NULL DEFAULT 'English',
  duration_hours INTEGER NOT NULL,
  price          INTEGER NOT NULL,
  original_price INTEGER,
  status         TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published','draft','waitlist')),
  cover_variant  TEXT NOT NULL DEFAULT 'grid',
  cover_code     TEXT NOT NULL DEFAULT '',
  projects       TEXT NOT NULL DEFAULT '[]',     -- json [{title, description, tags}]
  outcomes       TEXT NOT NULL DEFAULT '[]',     -- json [string]
  requirements   TEXT NOT NULL DEFAULT '[]',     -- json [string]
  faqs           TEXT NOT NULL DEFAULT '[]',     -- json [{q,a}]
  created_at     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS programs (
  id             TEXT PRIMARY KEY,
  slug           TEXT NOT NULL UNIQUE,
  title          TEXT NOT NULL,
  subtitle       TEXT NOT NULL,
  description    TEXT NOT NULL,
  level          TEXT NOT NULL,
  duration_months INTEGER NOT NULL,
  price          INTEGER NOT NULL,
  original_price INTEGER,
  status         TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published','draft')),
  cover_variant  TEXT NOT NULL DEFAULT 'grid',
  cover_code     TEXT NOT NULL DEFAULT '',
  outcomes       TEXT NOT NULL DEFAULT '[]',
  projects       TEXT NOT NULL DEFAULT '[]',
  faqs           TEXT NOT NULL DEFAULT '[]',
  created_at     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS program_courses (
  program_id TEXT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  course_id  TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  idx        INTEGER NOT NULL,
  note       TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (program_id, course_id)
);

CREATE TABLE IF NOT EXISTS course_instructors (
  course_id     TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  instructor_id TEXT NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'Instructor',
  PRIMARY KEY (course_id, instructor_id)
);

CREATE TABLE IF NOT EXISTS modules (
  id        TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  idx       INTEGER NOT NULL,
  title     TEXT NOT NULL,
  summary   TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS lessons (
  id              TEXT PRIMARY KEY,
  module_id       TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  idx             INTEGER NOT NULL,
  title           TEXT NOT NULL,
  type            TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('video','text','quiz','assignment')),
  duration_min    INTEGER NOT NULL DEFAULT 10,
  is_free_preview INTEGER NOT NULL DEFAULT 0,
  content         TEXT NOT NULL DEFAULT '[]'     -- json blocks
);

CREATE TABLE IF NOT EXISTS lesson_resources (
  id        TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title     TEXT NOT NULL,
  kind      TEXT NOT NULL DEFAULT 'pdf',
  href      TEXT NOT NULL DEFAULT '#'
);

CREATE TABLE IF NOT EXISTS quizzes (
  id         TEXT PRIMARY KEY,
  lesson_id  TEXT NOT NULL UNIQUE REFERENCES lessons(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  pass_score INTEGER NOT NULL DEFAULT 60
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id           TEXT PRIMARY KEY,
  quiz_id      TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  idx          INTEGER NOT NULL,
  question     TEXT NOT NULL,
  explanation  TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS quiz_options (
  id          TEXT PRIMARY KEY,
  question_id TEXT NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  idx         INTEGER NOT NULL,
  text        TEXT NOT NULL,
  is_correct  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id         TEXT PRIMARY KEY,
  quiz_id    TEXT NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score      INTEGER NOT NULL,
  total      INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS assignments (
  id        TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL UNIQUE REFERENCES lessons(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title     TEXT NOT NULL,
  brief     TEXT NOT NULL,
  max_score INTEGER NOT NULL DEFAULT 100
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
  id            TEXT PRIMARY KEY,
  assignment_id TEXT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notes         TEXT NOT NULL DEFAULT '',
  submitted_at  TEXT NOT NULL,
  UNIQUE (assignment_id, user_id)
);

CREATE TABLE IF NOT EXISTS enrollments (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id   TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed')),
  order_id    TEXT,
  UNIQUE (user_id, course_id)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id    TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id    TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed')),
  completed_at TEXT,
  last_viewed_at TEXT,
  UNIQUE (user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS coupons (
  code        TEXT PRIMARY KEY,
  percent_off INTEGER NOT NULL,
  active      INTEGER NOT NULL DEFAULT 1,
  description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS orders (
  id               TEXT PRIMARY KEY,
  user_id          TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id        TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  amount           INTEGER NOT NULL,
  discount         INTEGER NOT NULL DEFAULT 0,
  total            INTEGER NOT NULL,
  coupon_code      TEXT,
  status           TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created','paid','failed')),
  provider         TEXT NOT NULL DEFAULT 'mock',
  provider_order_id TEXT,
  created_at       TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id                  TEXT PRIMARY KEY,
  order_id            TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  provider_payment_id TEXT,
  method              TEXT NOT NULL DEFAULT 'upi',
  amount              INTEGER NOT NULL,
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','captured','failed','refunded')),
  paid_at             TEXT
);

CREATE TABLE IF NOT EXISTS enquiries (
  id                TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  email             TEXT NOT NULL,
  phone             TEXT,
  topic             TEXT NOT NULL,
  course_id         TEXT REFERENCES courses(id) ON DELETE SET NULL,
  preferred_contact TEXT NOT NULL DEFAULT 'email',
  message           TEXT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','closed')),
  created_at        TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS certificates (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id  TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  issued_at  TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid','revoked'))
);

CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id, idx);
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id, idx);
CREATE INDEX IF NOT EXISTS idx_progress_user_course ON lesson_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
`;
