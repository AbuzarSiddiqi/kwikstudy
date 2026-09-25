import { CourseSeed, t, c, tip, note, warn, vid, obj, quiz } from "../seedkit";

export const pythonCourse: CourseSeed = {
  id: "crs_python",
  slug: "python-programming",
  title: "Python Programming",
  subtitle: "Python from zero: syntax, data structures, functions, files and OOP — with practice at every step.",
  description:
    "A complete beginner course in Python 3. You learn the language through short explanations and immediate practice — from the first print statement to writing classes, reading files and structuring small programs properly.",
  category: "programming",
  level: "Beginner",
  duration_hours: 38,
  price: 2499,
  original_price: 3999,
  cover_variant: "waves",
  cover_code: "KS-PYT-04",
  outcomes: [
    "Write and run Python 3 programs confidently",
    "Use lists, dictionaries, sets and tuples idiomatically",
    "Structure code with functions and modules",
    "Read and write files, handle errors properly",
    "Apply OOP: classes, methods, inheritance",
    "Use the standard library and pip packages",
  ],
  requirements: ["No programming experience needed", "Any computer — Python and VS Code setup is in Module 1"],
  projects: [
    { title: "Expense Tracker CLI", description: "Track expenses in a JSON file with summaries by category and month.", tags: ["Files", "dict"] },
    { title: "Quiz Engine", description: "A configurable quiz runner that loads questions, scores answers and reports results.", tags: ["OOP", "dict"] },
  ],
  faqs: [
    { q: "Python 2 or Python 3?", a: "Python 3 only — Python 2 reached end of life in 2020. Everything in this course targets Python 3.10+." },
    { q: "Is this course enough before learning data science?", a: "It covers the Python that data science builds on: data structures, functions, files and OOP. Dedicated data courses build directly on these foundations." },
  ],
  instructors: [{ slug: "priya-raghavan", role: "Lead Instructor" }],
  modules: [
    {
      title: "Getting Started",
      summary: "Install Python, run programs and read real code.",
      lessons: [
        {
          title: "Welcome to Python",
          type: "video",
          min: 10,
          free: true,
          blocks: [
            vid("09:40", [
              { t: "00:00", label: "Why Python reads like English" },
              { t: "03:30", label: "Where Python is used" },
              { t: "06:20", label: "Course structure" },
            ]),
            t("Python trades ceremony for clarity. The same Java program that needs a class and a main method is one line in Python — and that closeness to plain language is why it's the standard first language and a favourite for scripting, automation, data and AI work."),
            c("python", `# the entire 'hello world' program
print("Hello, KwikStudy!")`),
            obj(["Run Python from the terminal and from VS Code", "Read the shape of a Python file: imports, code, main guard"]),
          ],
        },
        {
          title: "Installing Python and VS Code",
          min: 10,
          blocks: [
            t("Install Python 3.12 from python.org (or `brew install python` on macOS). On Windows, tick **'Add python.exe to PATH'** in the installer — it saves a lot of confusion."),
            c("bash", `python --version      # or python3 --version
# Python 3.12.x

# create a scratch folder and open it in VS Code
mkdir ks-python && cd ks-python && code .`, "terminal"),
            tip("The REPL is a calculator", "Type `python` with no arguments to get an interactive shell — perfect for testing one-liners while you study. Exit with `exit()` or Ctrl+D."),
          ],
        },
        {
          title: "Variables and Types",
          min: 12,
          blocks: [
            t("Variables need no type declaration — Python figures the type out, and you can ask for it with `type()`. The core types: `int`, `float`, `str`, `bool`."),
            c("python", `age = 21               # int
price = 2999.0         # float
name = "Aarav"         # str
enrolled = True        # bool (capital T!)

print(type(price))     # <class 'float'>

# f-strings put values inside text cleanly
print(f"{name} is {age}")   # Aarav is 21`),
            note("Dynamic but strong", "Types are checked at runtime and never coerce silently: `\"3\" + 4` is an error, not `7`. Convert explicitly: `int(\"3\") + 4`."),
          ],
        },
        {
          title: "Input, Output and Comments",
          min: 9,
          blocks: [
            c("python", `name = input("Your name: ")        # input() always returns str
age = int(input("Your age: "))     # convert before maths
print(f"Next year {name} turns {age + 1}")

# comments explain WHY, not WHAT
# and good names make most comments unnecessary`),
          ],
        },
      ],
    },
    {
      title: "Control Flow and Loops",
      summary: "if/elif/else, for and while, with Python's clean syntax.",
      lessons: [
        {
          title: "if / elif / else",
          min: 11,
          blocks: [
            t("Indentation **is** the syntax in Python — four spaces define blocks, so correct-looking code is correct code."),
            c("python", `score = 72

if score >= 90:
    grade = "A"
elif score >= 75:
    grade = "B"
elif score >= 60:
    grade = "C"
else:
    grade = "Keep practising"

print(grade)`),
          ],
        },
        {
          title: "for Loops and range",
          min: 12,
          blocks: [
            t("`for` iterates over **things** — lists, strings, ranges — not counters. When you need a counter, `range()` provides one."),
            c("python", `for ch in "abc":        # strings iterate char by char
    print(ch)

for i in range(1, 6):   # 1,2,3,4,5 (end exclusive)
    print(i, end=" ")

total = sum(range(1, 101))    # built-ins love iterables
print(total)                  # 5050`),
          ],
        },
        {
          title: "while Loops and break/continue",
          min: 10,
          blocks: [
            c("python", `import random
secret = random.randint(1, 20)
tries = 0
while True:
    guess = int(input("Guess (1-20): "))
    tries += 1
    if guess == secret:
        print(f"Got it in {tries} tries!")
        break                    # leave the loop
    print("too low" if guess < secret else "too high")`),
          ],
        },
        {
          title: "Checkpoint Quiz: Basics and Control Flow",
          type: "quiz",
          min: 8,
          blocks: [t("Five questions on Modules 1–2.")],
          quiz: {
            pass: 60,
            questions: [
              {
                q: "What does print(7 // 2) show?",
                opts: ["3.5", "3", "4", "Error"],
                correct: 1,
                why: "// is floor division in Python: 7 // 2 = 3.",
              },
              {
                q: "Which type does input() return?",
                opts: ["int", "str", "float", "It depends"],
                correct: 1,
                why: "input() always returns a string; convert with int() or float().",
              },
              {
                q: "How many times does range(2, 10, 3) yield a value?",
                opts: ["2", "3", "4", "8"],
                correct: 1,
                why: "It yields 2, 5, 8 — three values, stepping by 3, end exclusive.",
              },
              {
                q: "What ends a while True loop?",
                opts: ["stop", "exit", "break", "return"],
                correct: 2,
                why: "break exits the nearest enclosing loop immediately.",
              },
              {
                q: "Which is the correct Boolean literal?",
                opts: ["true", "True", "TRUE", "bool.on"],
                correct: 1,
                why: "Python booleans are True and False — capitalised.",
              },
            ],
          },
        },
      ],
    },
    {
      title: "Core Data Structures",
      summary: "Lists, tuples, dictionaries and sets.",
      lessons: [
        {
          title: "Lists",
          min: 13,
          blocks: [
            t("Lists are ordered, mutable collections — the workhorse of Python data."),
            c("python", `marks = [86, 72, 91, 64]
marks.append(88)
marks[0]            # 86
marks[-1]           # 88 — negative indexes from the end
marks[1:3]          # [72, 91] — slicing
len(marks)          # 5
marks.sort()        # in place: [64, 72, 86, 88, 91]`),
            tip("Slicing everywhere", "Slices work on lists and strings alike: `name[:3]` is the first three characters of any string."),
          ],
        },
        {
          title: "Dictionaries",
          min: 13,
          blocks: [
            t("Dictionaries map keys to values with O(1) lookup — the tool for anything you'd describe as 'records' or 'lookups'."),
            c("python", `student = {"name": "Aarav", "marks": 86}
student["grade"] = "B"          # add/update
student.get("phone", "—")       # safe read with default

for key, value in student.items():
    print(key, "->", value)`),
          ],
        },
        {
          title: "Tuples and Sets",
          min: 11,
          blocks: [
            t("**Tuples** are immutable sequences — right for fixed records and dict keys. **Sets** hold unique items with instant membership tests."),
            c("python", `point = (3, 4)                # tuple
x, y = point                   # unpacking

seen = {1, 2, 3}
seen.add(3)                    # no duplicate
2 in seen                      # True — instant

unique_letters = set("mississippi")   # de-duplicate`),
          ],
        },
        {
          title: "Comprehensions",
          min: 12,
          blocks: [
            t("Comprehensions build collections in one readable line — Python's signature move."),
            c("python", `marks = [86, 72, 91, 64]
passed = [m for m in marks if m >= 75]      # [86, 91]
squares = [n * n for n in range(1, 6)]

lengths = {name: len(name) for name in ["Aarav", "Meera"]}
evens   = {n for n in range(10) if n % 2 == 0}`),
            warn("Comprehension restraint", "One condition and one transform per comprehension reads best. Beyond that, a plain for-loop is clearer."),
          ],
        },
      ],
    },
    {
      title: "Functions and Modules",
      summary: "Defining functions, arguments, and organising code into modules.",
      lessons: [
        {
          title: "Defining Functions",
          min: 12,
          blocks: [
            c("python", `def celsius_to_fahrenheit(celsius):
    """Convert a temperature. (docstrings power help())"""
    return celsius * 9 / 5 + 32

def greet(name, greeting="Hello"):     # default argument
    return f"{greeting}, {name}!"

print(greet("Aarav"))                  # Hello, Aarav!
print(greet("Aarav", "Namaste"))       # Namaste, Aarav!`),
          ],
        },
        {
          title: "*args, **kwargs and Return Values",
          min: 12,
          blocks: [
            t("Functions can accept any number of positional (`*args`) or keyword (`**kwargs`) arguments — the basis of flexible APIs."),
            c("python", `def total(*prices, discount=0):
    return sum(prices) * (1 - discount)

total(2999, 1999, discount=0.1)   # 4498.0`),
          ],
        },
        {
          title: "Modules and the Standard Library",
          min: 11,
          blocks: [
            t("Any `.py` file is a module; `import` brings it in. The standard library ships 'batteries included' — start with `math`, `random`, `datetime`, `json`, `pathlib`."),
            c("python", `import json, pathlib

data = {"course": "Python", "price": 2499}
pathlib.Path("course.json").write_text(json.dumps(data))
print(json.loads(pathlib.Path("course.json").read_text())["price"])`),
          ],
        },
        {
          title: "Project: Expense Tracker CLI",
          type: "assignment",
          min: 90,
          blocks: [t("Build a menu-driven expense tracker that stores records in a JSON file and reports totals by category and month.")],
          assignment: {
            title: "Expense Tracker CLI",
            brief: "Submit the .py file(s) or repo link. Requirements: add/list expenses, persistence to JSON, monthly and category summaries, input validation with friendly errors.",
            max: 100,
          },
        },
      ],
    },
    {
      title: "Files, Errors and OOP",
      summary: "Robust file handling, exceptions, classes and inheritance.",
      lessons: [
        {
          title: "Reading and Writing Files",
          min: 12,
          blocks: [
            c("python", `with open("notes.txt", "w") as f:   # 'with' closes for you
    f.write("line one\\n")

with open("notes.txt") as f:
    for line in f:                   # streams, handles big files
        print(line.rstrip())`),
          ],
        },
        {
          title: "Exceptions",
          min: 11,
          blocks: [
            c("python", `try:
    age = int(input("Age: "))
except ValueError:
    print("Please enter a whole number")
else:
    print("Thanks!")                 # runs only if no error
finally:
    print("Done")                    # always runs`),
            tip("Catch narrow", "Catch ValueError, not Exception — specific handlers keep real bugs visible."),
          ],
        },
        {
          title: "Classes and Objects",
          min: 14,
          blocks: [
            c("python", `class Student:
    def __init__(self, name, marks):
        self.name = name
        self.marks = marks

    def grade(self):
        return "A" if self.marks >= 85 else "B"

    def __str__(self):                        # print() support
        return f"{self.name} ({self.marks})"

s = Student("Aarav", 86)
print(s, s.grade())`),
          ],
        },
        {
          title: "Inheritance and Methods",
          min: 12,
          blocks: [
            c("python", `class Vehicle:
    def __init__(self, brand): self.brand = brand
    def describe(self): return f"Vehicle: {self.brand}"

class Car(Vehicle):
    def __init__(self, brand, doors):
        super().__init__(brand)
        self.doors = doors
    def describe(self):                        # override
        return f"Car: {self.brand}, {self.doors} doors"

print(Car("Hyundai", 5).describe())`),
          ],
        },
      ],
    },
  ],
};

export const sqlCourse: CourseSeed = {
  id: "crs_sql",
  slug: "sql-relational-databases",
  title: "SQL & Relational Databases",
  subtitle: "Query, model and maintain relational data — SELECT to JOINs to schema design.",
  description:
    "SQL is the one language every technical role touches. This course takes you from single-table SELECTs to multi-table JOINs, aggregation, subqueries and sane schema design, using a realistic student-courses-enrolments database throughout.",
  category: "databases",
  level: "Beginner → Intermediate",
  duration_hours: 24,
  price: 1999,
  original_price: 2999,
  cover_variant: "blocks",
  cover_code: "KS-SQL-05",
  outcomes: [
    "Write SELECT queries with WHERE, ORDER BY and LIMIT",
    "Filter and summarise with aggregate functions and GROUP BY",
    "Combine tables with INNER, LEFT and multi-table JOINs",
    "Use subqueries and CTEs for layered questions",
    "Design normalised schemas with keys and constraints",
    "Modify data safely with INSERT, UPDATE, DELETE",
  ],
  requirements: ["Basic computer literacy", "No programming background required"],
  projects: [
    { title: "Academy Reporting Pack", description: "Ten real reporting queries over an academy database — revenue, enrolments, drop-offs.", tags: ["JOINs", "Aggregation"] },
  ],
  faqs: [
    { q: "Which database does the course use?", a: "MySQL syntax in lessons, with notes where PostgreSQL differs. Everything taught is standard SQL that transfers to either." },
    { q: "Do I need to install anything?", a: "Module 1 walks through installing MySQL Community Server and a client. A browser-based alternative is provided if you can't install software." },
  ],
  instructors: [{ slug: "priya-raghavan", role: "Instructor" }],
  modules: [
    {
      title: "Relational Basics",
      summary: "Tables, keys and your first SELECT.",
      lessons: [
        {
          title: "Data as Tables",
          type: "video",
          min: 9,
          free: true,
          blocks: [
            vid("08:30", [
              { t: "00:00", label: "Why relational wins" },
              { t: "03:00", label: "Tables, rows, columns" },
              { t: "06:10", label: "Primary and foreign keys" },
            ]),
            t("Relational databases store data in **tables** — rows are records, columns are typed attributes, and keys connect tables. Integrity lives **in the database**, which is why almost every serious system keeps SQL at its core."),
          ],
        },
        {
          title: "Your First SELECT",
          min: 11,
          blocks: [
            c("sql", `SELECT title, price FROM courses;

SELECT * FROM students LIMIT 5;      -- * = all columns (exploring only)

SELECT title AS course_name, price   -- alias for readable output
FROM courses;`),
            tip("No SELECT * in production", "Select the columns you use — faster, stable against schema changes, and self-documenting."),
          ],
        },
        {
          title: "WHERE, ORDER BY, LIMIT",
          min: 12,
          blocks: [
            c("sql", `SELECT title, price, level
FROM courses
WHERE price < 3000 AND level LIKE 'Beginner%'
ORDER BY price DESC, title
LIMIT 10;`),
            note("NULL is not a value", "`WHERE phone = NULL` matches nothing. Use `IS NULL` / `IS NOT NULL` — the classic first SQL gotcha."),
          ],
        },
        {
          title: "Filtering Patterns",
          min: 10,
          blocks: [
            c("sql", `WHERE name LIKE 'A%'          -- starts with A
WHERE email LIKE '%@gmail.com'
WHERE level IN ('Beginner', 'Intermediate')
WHERE price BETWEEN 1000 AND 3000
WHERE title IS NOT NULL`),
          ],
        },
      ],
    },
    {
      title: "Aggregation",
      summary: "COUNT, SUM, GROUP BY and HAVING.",
      lessons: [
        {
          title: "Aggregate Functions",
          min: 10,
          blocks: [
            c("sql", `SELECT COUNT(*)      AS courses,
       MIN(price)    AS cheapest,
       MAX(price)    AS priciest,
       ROUND(AVG(price)) AS avg_price
FROM courses;`),
          ],
        },
        {
          title: "GROUP BY",
          min: 12,
          blocks: [
            c("sql", `SELECT level, COUNT(*) AS courses, ROUND(AVG(price)) AS avg_price
FROM courses
GROUP BY level
ORDER BY courses DESC;`),
            tip("Every non-aggregated column must be in GROUP BY", "If you SELECT level and COUNT(*), then level must appear in GROUP BY. Databases enforce this for your own good."),
          ],
        },
        {
          title: "HAVING vs WHERE",
          min: 10,
          blocks: [
            c("sql", `SELECT category_id, COUNT(*) AS n
FROM courses
WHERE status = 'published'      -- filters ROWS first
GROUP BY category_id
HAVING COUNT(*) >= 2            -- filters GROUPS after
ORDER BY n DESC;`),
          ],
        },
        {
          title: "Practice: Reporting Queries",
          min: 30,
          blocks: [t("Eight reporting questions over the academy dataset — cheapest course per category, students with no enrolments, monthly revenue, top courses by enrolment count.")],
        },
      ],
    },
    {
      title: "JOINs",
      summary: "Combining tables — the heart of relational SQL.",
      lessons: [
        {
          title: "INNER JOIN",
          min: 13,
          blocks: [
            c("sql", `SELECT c.title, cat.name AS category
FROM courses c
INNER JOIN course_categories cat ON cat.id = c.category_id;`),
            t("A JOIN pairs rows whose keys match. Alias tables (`c`, `cat`) immediately — every real query uses them."),
          ],
        },
        {
          title: "LEFT JOIN and Finding Gaps",
          min: 12,
          blocks: [
            c("sql", `-- courses with no enrolments at all
SELECT c.title
FROM courses c
LEFT JOIN enrollments e ON e.course_id = c.id
WHERE e.id IS NULL;`),
            note("LEFT JOIN keeps the left side", "Unmatched right rows come back as NULLs — exactly what makes 'show me the gaps' queries possible."),
          ],
        },
        {
          title: "Three-Table JOINs",
          min: 13,
          blocks: [
            c("sql", `SELECT s.name, c.title, e.enrolled_at
FROM enrollments e
JOIN students s ON s.id = e.user_id
JOIN courses  c ON c.id = e.course_id
ORDER BY e.enrolled_at DESC;`),
          ],
        },
        {
          title: "Subqueries and CTEs",
          min: 13,
          blocks: [
            c("sql", `WITH avg_price AS (
    SELECT category_id, AVG(price) AS avg_p
    FROM courses GROUP BY category_id
)
SELECT c.title, c.price, a.avg_p,
       c.price - a.avg_p AS diff
FROM courses c
JOIN avg_price a ON a.category_id = c.category_id;`),
            tip("CTEs read top-down", "WITH names a query you can reuse and layer — much easier to review than nested subqueries. Modern engines optimise them identically."),
          ],
        },
      ],
    },
    {
      title: "Modifying Data",
      summary: "INSERT, UPDATE, DELETE and safe habits.",
      lessons: [
        {
          title: "INSERT",
          min: 10,
          blocks: [
            c("sql", `INSERT INTO students (id, name, email)
VALUES ('usr_101', 'Ishaan Gupta', 'ishaan@example.com');

INSERT INTO students (id, name, email)
VALUES ('usr_102', 'Zoya Khan', 'zoya@example.com'),
       ('usr_103', 'Dev Patel', 'dev@example.com');`),
          ],
        },
        {
          title: "UPDATE and DELETE — Carefully",
          min: 12,
          blocks: [
            c("sql", `UPDATE courses SET price = 1799 WHERE slug = 'sql-relational-databases';

DELETE FROM enquiries WHERE status = 'spam';

-- habit 1: run the SELECT first
SELECT * FROM courses WHERE slug = 'sql-relational-databases';
-- habit 2: wrap in a transaction
START TRANSACTION;
UPDATE ...;
-- check, then COMMIT;  (or ROLLBACK;)`),
            warn("The forgotten WHERE", "UPDATE/DELETE without WHERE hits **every row**. Professional habit: always write the WHERE clause first, even before the SET."),
          ],
        },
        {
          title: "Schema Design and Normalisation",
          min: 15,
          blocks: [
            t("Normalisation in one line: **one fact in one place**. Students, courses and enrolments are three tables — not one spreadsheet with repeated student rows. Relationships get foreign keys; the database then refuses impossible data."),
            c("sql", `CREATE TABLE enrollments (
    id          VARCHAR(40) PRIMARY KEY,
    user_id     VARCHAR(40) NOT NULL,
    course_id   VARCHAR(40) NOT NULL,
    enrolled_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, course_id),
    FOREIGN KEY (user_id)  REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);`),
          ],
        },
        {
          title: "Checkpoint Quiz: SQL",
          type: "quiz",
          min: 8,
          blocks: [t("Five questions across the course.")],
          quiz: {
            pass: 60,
            questions: [
              {
                q: "How do you match rows where a column has no value?",
                opts: ["= NULL", "== NULL", "IS NULL", "NULL()"],
                correct: 2,
                why: "NULL comparisons use IS NULL / IS NOT NULL — = NULL matches nothing.",
              },
              {
                q: "Which clause filters groups after aggregation?",
                opts: ["WHERE", "HAVING", "GROUP BY", "FILTER"],
                correct: 1,
                why: "WHERE filters rows before grouping; HAVING filters aggregated groups.",
              },
              {
                q: "LEFT JOIN keeps…",
                opts: ["Only matching rows", "All left-table rows, NULLs where no match", "All right-table rows", "Only NULL rows"],
                correct: 1,
                why: "That's the definition — and the basis of gap-finding queries.",
              },
              {
                q: "A primary key…",
                opts: ["Can repeat", "Uniquely identifies each row", "Must be a number", "Is optional in every table"],
                correct: 1,
                why: "It's the unique row identifier — the anchor every relationship points at.",
              },
              {
                q: "Safest sequence before a risky UPDATE?",
                opts: ["Run it fast", "SELECT with the same WHERE, then wrap in a transaction", "Delete first", "Ask a friend"],
                correct: 1,
                why: "Preview the affected rows, then commit only after checking — reversible by design.",
              },
            ],
          },
        },
      ],
    },
  ],
};
