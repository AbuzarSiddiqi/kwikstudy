import { CourseSeed, t, c, tip, note, warn, vid, obj, quiz, assignment } from "../seedkit";

export const javaCourse: CourseSeed = {
  id: "crs_java",
  slug: "java-programming",
  title: "Java Programming",
  subtitle: "From fundamentals to object-oriented programming, collections, exception handling and practical development.",
  description:
    "A structured, first-principles course in Java. You start with how the language and the JVM actually work, build a strong base in syntax and control flow, then move into object-oriented design, collections, exceptions and file handling. Every module closes with practice problems, and the course ends with a complete console application you build yourself.",
  category: "programming",
  level: "Beginner → Intermediate",
  duration_hours: 42,
  price: 2999,
  original_price: 4499,
  cover_variant: "grid",
  cover_code: "KS-JVA-01",
  outcomes: [
    "Understand how Java programs compile and run on the JVM",
    "Write clean Java using variables, operators and control flow",
    "Model real problems with classes, objects and inheritance",
    "Use polymorphism, abstract classes and interfaces with confidence",
    "Handle errors properly with try-catch and custom exceptions",
    "Work with collections, generics, files and lambdas",
    "Build and structure a complete console application",
  ],
  requirements: [
    "No prior programming experience needed — Module 1 starts from zero",
    "A laptop with Windows, macOS or Linux (setup is covered in Module 1)",
    "Comfortable installing software and working with a keyboard",
  ],
  projects: [
    {
      title: "Student Grade Analyser",
      description: "Read marks from a file, compute averages and grade distributions using arrays, loops and methods.",
      tags: ["Arrays", "Methods", "File I/O"],
    },
    {
      title: "Bank Account Simulator",
      description: "Model accounts and transactions with classes, encapsulation, inheritance and exception handling.",
      tags: ["OOP", "Exceptions"],
    },
    {
      title: "Library Management System",
      description: "The capstone: books, members, issues and returns with collections, search and a menu-driven interface.",
      tags: ["Collections", "OOP", "Capstone"],
    },
  ],
  faqs: [
    { q: "Do I need prior coding experience for this course?", a: "No. The course begins with how Java works and assumes nothing. If you have coded before, the early modules will still be useful for setting up a correct, professional workflow." },
    { q: "Which Java version is used?", a: "The course targets Java 17 (an LTS release). Concepts taught apply to Java 8 and above, and version-specific features are called out when used." },
    { q: "How much time should I plan each week?", a: "Most students complete the course in 10–12 weeks studying 4–6 hours a week. The curriculum is self-paced, so you can go faster or slower." },
    { q: "Will this course prepare me for interviews?", a: "It builds the core Java skills interviews test — OOP, collections and exceptions. For dedicated interview practice, see the DSA & Interview Preparation track." },
  ],
  instructors: [{ slug: "arjun-mehta", role: "Lead Instructor" }],
  modules: [
    {
      title: "Getting Started with Java",
      summary: "How Java works, installing your tools, and writing your first program.",
      lessons: [
        {
          title: "Introduction: How Java Works",
          type: "video",
          min: 12,
          free: true,
          blocks: [
            vid("11:42", [
              { t: "00:00", label: "What Java is used for" },
              { t: "03:20", label: "Source code, bytecode, JVM" },
              { t: "07:05", label: "Why 'write once, run anywhere'" },
              { t: "09:48", label: "The learning path for this course" },
            ]),
            obj([
              "Explain what happens between writing Java code and running it",
              "Describe the roles of the JDK, JRE and JVM",
              "Decide whether Java fits the kind of software you want to build",
            ]),
            t("Java is a **general-purpose, statically typed** language that has run enterprise software for nearly three decades. Banks, e-commerce backends, Android apps and large internal systems rely on it because it is predictable: strong types, explicit structure and a huge ecosystem of libraries."),
            t("The key idea to hold on to is the **compile–run split**. You write human-readable source code (`.java` files). A compiler turns that into **bytecode** (`.class` files). The **Java Virtual Machine (JVM)** then executes that bytecode on any operating system. That is why the same compiled program runs on Windows, macOS and Linux without changes."),
            c("java", `// HelloWorld.java — your first look at the shape of a Java program
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, KwikStudy!");
    }
}`, "HelloWorld.java"),
            t("Don't worry about what `public`, `class` and `static` mean yet — each gets a full lesson later. For now, notice that every Java program lives inside a **class**, and execution starts at the `main` method."),
            note("JDK vs JRE vs JVM", "The **JVM** executes bytecode. The **JRE** is the JVM plus core libraries (enough to run programs). The **JDK** is the JRE plus development tools like the compiler (enough to write them). As a developer you install the JDK."),
          ],
        },
        {
          title: "Installing the JDK and an IDE",
          min: 15,
          blocks: [
            vid("09:18", [
              { t: "00:00", label: "Choosing a JDK distribution" },
              { t: "02:30", label: "Installing on Windows / macOS / Linux" },
              { t: "06:10", label: "Setting up IntelliJ IDEA Community" },
            ]),
            t("We standardise on **Java 17 (LTS)** from Eclipse Temurin — a free, well-maintained OpenJDK build. For editing, we use **IntelliJ IDEA Community Edition**, which is free and the de-facto standard for Java development."),
            t("**Windows:** run the Temurin MSI installer, then IntelliJ's `.exe` installer. **macOS:** install both `.pkg` files (or use Homebrew: `brew install --cask temurin@17 intellij-idea-ce`). **Linux (Ubuntu/Debian):** `sudo apt install temurin-17-jdk` from the Adoptium repository, and install IDEA from the tarball or snap."),
            c("bash", `# verify the installation from any terminal
java -version
# -> openjdk version "17.0.x" ...

javac -version
# -> javac 17.0.x`, "terminal"),
            tip("JAVA_HOME", "Some tools want a `JAVA_HOME` environment variable pointing at the JDK folder. The Temurin installers offer a 'Set JAVA_HOME' checkbox on Windows — leave it enabled and you will never think about it again."),
            warn("Version mismatch", "If `javac -version` and `java -version` show different major versions, an older JDK is still on your PATH. Uninstall old JDKs or fix your PATH order before continuing — subtle class-version errors later in the course are almost always this."),
          ],
        },
        {
          title: "Your First Program",
          min: 13,
          blocks: [
            t("Let's dissect the program from Lesson 1 line by line, then run it three ways: from the IDE, from the terminal with `javac` + `java`, and with the single-file command introduced in Java 11."),
            c("java", `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, KwikStudy!");
    }
}`),
            t("**`public class HelloWorld`** — every Java file holds at least one class; the public class name must match the file name exactly (`HelloWorld.java`). **`main`** — the entry point the JVM looks for. Its signature must be exactly `public static void main(String[] args)`. **`System.out.println`** — prints its argument and a newline to the standard output."),
            c("bash", `# classic two-step: compile, then run
javac HelloWorld.java     # produces HelloWorld.class (bytecode)
java HelloWorld           # JVM executes the class

# one-step convenience for single files (Java 11+)
java HelloWorld.java`, "terminal"),
            note("Print variants", "`println` prints with a newline, `print` without one, and `printf` gives formatted output like C: `System.out.printf(\"Total: %d items%n\", 42);`"),
          ],
        },
        {
          title: "How Compilation Works",
          min: 11,
          blocks: [
            t("Compilation errors will be your most frequent companion for the first few weeks, so it pays to understand what the compiler is actually checking."),
            t("When you run `javac`, the compiler: **1)** tokenises and parses your code into a syntax tree, **2)** performs type checking (does every variable hold what its type promises?), **3)** resolves names (does that method exist with those argument types?), and **4)** emits bytecode. It will refuse to produce a `.class` file until every check passes — which is exactly why Java programs catch whole categories of bugs before they ever run."),
            c("java", `int count = 5;
count = "five";   // compile error: incompatible types
                  // error: incompatible types: String cannot be
                  // converted to int`, "Mistake.java"),
            t("Compare this with a dynamically typed language, where that mistake would surface at runtime, possibly deep inside a running system. Static typing feels strict at first; within a few modules you will feel it working **for** you."),
            tip("Read errors bottom-up", "Compiler output lists the first error it hit, often with a caret pointing at the exact column. Fix the **first** error, recompile — later errors are frequently cascades of the first one."),
          ],
        },
      ],
    },
    {
      title: "Language Fundamentals",
      summary: "Variables, primitive types, operators, input/output and casting.",
      lessons: [
        {
          title: "Variables and Data Types",
          min: 16,
          blocks: [
            t("A **variable** is a named location in memory with a fixed type. Java's eight **primitive types** cover numbers, characters and booleans; everything else is an **object**. For everyday work you mostly need `int`, `double`, `boolean`, `char` and `String` (which is a class, not a primitive)."),
            c("java", `public class Variables {
    public static void main(String[] args) {
        int age = 21;                    // whole numbers
        double price = 2999.00;          // decimals
        boolean isEnrolled = true;       // true / false
        char grade = 'A';                // single quote!
        String name = "Aarav";           // double quote!

        final int MAX_ENROLL = 60;       // constant — cannot change
        System.out.println(name + " is " + age);
    }
}`, "Variables.java"),
            t("The **compiler infers nothing by default**: you must state the type on the left. Since Java 10 you can write `var` for local variables when the right-hand side makes the type obvious — `var count = 10;` — but the variable still has a fixed type underneath."),
            note("int vs double", "Use `int` for counts and indices, `double` for measurements and money-in-demos. (Real financial code uses `BigDecimal` — covered as a tip in Module 7.)"),
          ],
        },
        {
          title: "Operators",
          min: 14,
          blocks: [
            t("Java's operators will look familiar if you've done school algebra, with a few programming-specific additions: `++`/`--` for increment/decrement, `%` for remainder, and integer division that **truncates**."),
            c("java", `int a = 17, b = 5;

System.out.println(a + b);    // 22
System.out.println(a / b);    // 3   <- integer division!
System.out.println(a % b);    // 2   remainder
System.out.println(a / 5.0);  // 3.4 double division

int count = 0;
count++;                      // 1 (post-increment)
++count;                      // 2 (pre-increment)

boolean ok = (a > b) && (b > 0);   // logical AND
boolean alt = (a < b) || (b > 0);  // logical OR`),
            warn("Integer division trap", "`(3 + 4) / 2` gives `3`, not `3.5`. When you need the decimal result, make at least one operand a double: `(3 + 4) / 2.0`."),
            t("String concatenation with `+` reuses the same operator: `\"Page \" + 3` produces `\"Page 3\"`. Just be careful that `+` stays in string context — `System.out.println(1 + 2 + \"abc\")` prints `3abc`, but `System.out.println(\"abc\" + 1 + 2)` prints `abc12` — evaluation is left to right."),
          ],
        },
        {
          title: "Type Casting and Conversion",
          min: 10,
          blocks: [
            t("Converting between numeric types comes in two flavours. **Widening** (small → large, e.g. `int` → `double`) is automatic and lossless. **Narrowing** (large → small, e.g. `double` → `int`) requires an explicit cast and can lose information."),
            c("java", `int marks = 86;
double exact = marks;          // widening: 86.0 (automatic)

double average = 86.6;
int rounded = (int) average;   // narrowing: 86 (explicit cast)
                               // truncates toward zero!`),
            t("For **text ↔ number** conversion you use the wrapper classes:"),
            c("java", `String input = "42";
int n = Integer.parseInt(input);        // "42" -> 42
double d = Double.parseDouble("3.14");  // "3.14" -> 3.14
String back = String.valueOf(n);        // 42 -> "42"`),
            warn("NumberFormatException", "`Integer.parseInt(\"4x2\")` throws a `NumberFormatException` at runtime. When input comes from users or files, parse inside a try-catch — you'll learn how in Module 6."),
          ],
        },
        {
          title: "Input and Output",
          min: 12,
          blocks: [
            t("Interactive programs read from **standard input** using a `Scanner`. This is the tool every exercise in this course uses, so learn its common methods well."),
            c("java", `import java.util.Scanner;

public class Greeter {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Your name: ");
        String name = sc.nextLine();          // whole line

        System.out.print("Your age: ");
        int age = sc.nextInt();               // one integer

        System.out.println("Hi " + name
            + ", next year you will be " + (age + 1));
    }
}`, "Greeter.java"),
            note("nextInt + nextLine gotcha", "After `nextInt()`, a pending newline stays in the buffer and a following `nextLine()` returns an empty string. The standard fix: call an extra `sc.nextLine()` once after the last `nextInt()`."),
            t("For **formatted output**, `printf` uses format specifiers: `%d` integers, `%f` decimals, `%s` strings, `%.2f` decimals with two places, `%n` a portable newline."),
          ],
        },
        {
          title: "Checkpoint Quiz: Fundamentals",
          type: "quiz",
          min: 10,
          blocks: [t("A short check on Modules 1–2. You need 60% to pass; wrong answers come back with explanations, and you can retake the quiz as many times as you like.")],
          quiz: {
            pass: 60,
            questions: [
              {
                q: "What does JVM stand for?",
                opts: ["Java Virtual Machine", "Java Variable Method", "Java Verified Module", "Just Virtual Memory"],
                correct: 0,
                why: "The Java Virtual Machine is the runtime engine that executes compiled bytecode.",
              },
              {
                q: "What is the output of System.out.println(7 / 2)?",
                opts: ["3.5", "3", "4", "Compile error"],
                correct: 1,
                why: "Both operands are int, so integer division truncates: 7 / 2 = 3.",
              },
              {
                q: "Which type would you use for a single character?",
                opts: ["String", "char", "text", "Character[]"],
                correct: 1,
                why: "char holds a single 16-bit Unicode character, written in single quotes like 'A'.",
              },
              {
                q: "Which keyword makes a variable a constant?",
                opts: ["static", "const", "final", "sealed"],
                correct: 2,
                why: "final marks a variable as assignable only once. (const is reserved but unused in Java.)",
              },
              {
                q: "What does Integer.parseInt(\"86\") return?",
                opts: ["The String \"86\"", "An Integer object only", "The int value 86", "It throws an exception"],
                correct: 2,
                why: "parseInt converts valid numeric text to the primitive int 86.",
              },
            ],
          },
        },
      ],
    },
    {
      title: "Control Flow",
      summary: "Decisions, switch expressions, loops and loop patterns.",
      lessons: [
        {
          title: "Conditional Statements",
          min: 14,
          blocks: [
            t("Programs make decisions with `if`, `else if` and `else`. Conditions are boolean expressions — comparisons joined with `&&` (AND), `||` (OR), `!` (NOT)."),
            c("java", `int score = 72;

if (score >= 90) {
    System.out.println("Grade A");
} else if (score >= 75) {
    System.out.println("Grade B");
} else if (score >= 60) {
    System.out.println("Grade C");
} else {
    System.out.println("Keep practising");
}`),
            tip("Order matters", "Conditions are tested top to bottom. Since `72 >= 60` is true but the earlier branch catches it first, put the most specific condition first — a classic source of bugs is checking `>= 60` before `>= 90`."),
            t("A ternary expression is a compact one-line if/else for choosing a **value**: `String label = score >= 60 ? \"Pass\" : \"Fail\";`. Use it for simple picks, never for side effects."),
          ],
        },
        {
          title: "Switch Statements and Expressions",
          min: 12,
          blocks: [
            t("`switch` selects one branch from many based on a single value — cleaner than an `else-if` chain when comparing one variable against fixed cases. Modern Java (14+) also gives us **switch expressions** that return a value and don't fall through."),
            c("java", `int day = 3;

// classic statement form
switch (day) {
    case 1:
    case 7:
        System.out.println("Weekend");
        break;
    default:
        System.out.println("Weekday");
}

// modern arrow form (Java 14+)
String kind = switch (day) {
    case 6, 7 -> "Weekend";
    default   -> "Weekday";
};`),
            note("break vs arrow", "In the classic form, a missing `break` makes execution **fall through** into the next case. The arrow form (`->`) never falls through and is preferred in new code."),
          ],
        },
        {
          title: "Loops: for, while, do-while",
          min: 15,
          blocks: [
            t("Loops repeat work. Choose **`for`** when the number of iterations is known, **`while`** when it depends on a condition, and **`do-while`** when the body must run at least once."),
            c("java", `// sum of 1..5 with a counting loop
int sum = 0;
for (int i = 1; i <= 5; i++) {
    sum += i;
}
System.out.println(sum);   // 15

// sentinel loop: keep asking until valid
Scanner sc = new Scanner(System.in);
int age;
do {
    System.out.print("Enter age (1-120): ");
    age = sc.nextInt();
} while (age < 1 || age > 120);`),
            t("`break` exits the loop immediately; `continue` skips to the next iteration. Both make loop logic easier to read than deeply nested negated conditions — but don't overuse them in long loops."),
          ],
        },
        {
          title: "Nested Loops and Patterns",
          min: 13,
          blocks: [
            t("A loop inside a loop is how you walk grids, print shapes and compare every pair. The inner loop runs completely for **each** iteration of the outer loop."),
            c("java", `// right triangle of stars
for (int row = 1; row <= 4; row++) {
    for (int col = 1; col <= row; col++) {
        System.out.print("* ");
    }
    System.out.println();
}
// * 
// * * 
// * * * 
// * * * *`),
            t("Trace it with a **trace table**: for each outer iteration, note `row`, then how many times the inner loop runs (`row` times). If nested loops feel slippery, slow down here — they return in Module 4 (2D arrays) and in every DSA course."),
            tip("Complexity seed", "Nested loops where both run n times do n×n steps. Remember this instinct — it becomes Big-O thinking in the DSA course."),
          ],
        },
      ],
    },
    {
      title: "Methods and Arrays",
      summary: "Structuring code with methods, and working with 1-D and 2-D arrays.",
      lessons: [
        {
          title: "Defining and Calling Methods",
          min: 14,
          blocks: [
            t("A **method** is a named, reusable unit of behaviour. Methods are how you stop copying code and start composing it."),
            c("java", `public class Metric {
    static double celsiusToFahrenheit(double celsius) {
        return celsius * 9 / 5 + 32;
    }

    static void printLine() {              // void = returns nothing
        System.out.println("----------------");
    }

    public static void main(String[] args) {
        System.out.println(celsiusToFahrenheit(37));  // 98.6
        printLine();
    }
}`),
            t("Anatomy: `static double celsiusToFahrenheit(double celsius)` — `static` (callable without an object for now), `double` **return type**, name, **parameters** in brackets. `return` hands a value back and exits."),
            tip("One job per method", "A good method does one thing you can name in a short phrase. If you need 'and' to describe it, split it."),
          ],
        },
        {
          title: "Parameters, Return Values and Overloading",
          min: 13,
          blocks: [
            t("Arguments in Java are **passed by value**: primitives copy their value, objects copy their **reference** — so a method can modify the object it receives but not reassign the caller's variable."),
            c("java", `static void reset(int x) { x = 0; }          // caller unchanged

static int max(int a, int b) { return a >= b ? a : b; }

// overloading: same name, different parameter lists
static int    square(int v)    { return v * v; }
static double square(double v) { return v * v; }`),
            t("The compiler picks the overload whose parameter types best match the arguments. Note that return type alone **cannot** distinguish overloads."),
          ],
        },
        {
          title: "Arrays",
          min: 15,
          blocks: [
            t("An **array** holds a fixed number of values of one type, accessed by zero-based index. Length is fixed at creation — flexible collections arrive in Module 7."),
            c("java", `int[] marks = { 86, 72, 91, 64, 88 };

System.out.println(marks[0]);        // 86   (first)
System.out.println(marks.length);    // 5    (not a method!)

int total = 0;
for (int i = 0; i < marks.length; i++) {
    total += marks[i];
}
double average = (double) total / marks.length;   // 80.2

// enhanced for when you don't need the index
for (int m : marks) System.out.println(m);`),
            warn("ArrayIndexOutOfBoundsException", "Valid indexes run `0` to `length - 1`. `marks[5]` on a 5-element array compiles fine and crashes at runtime."),
          ],
        },
        {
          title: "2-D Arrays",
          min: 11,
          blocks: [
            t("A 2-D array is an **array of arrays** — the natural structure for grids, matrices and board games."),
            c("java", `int[][] grid = {
    { 3, 8, 1 },
    { 4, 0, 9 },
    { 7, 2, 5 }
};

// row by row, then cell by cell
int sum = 0;
for (int r = 0; r < grid.length; r++) {
    for (int col = 0; col < grid[r].length; col++) {
        sum += grid[r][col];
    }
}
System.out.println(sum);   // 39`),
            note("Jagged rows", "Rows may have different lengths (`grid[r].length` per row), because each row is itself an array."),
          ],
        },
        {
          title: "Checkpoint Quiz: Methods and Arrays",
          type: "quiz",
          min: 10,
          blocks: [t("Five questions on Modules 3–4. Passing score 60%.")],
          quiz: {
            pass: 60,
            questions: [
              {
                q: "What is printed? int[] a = {2, 4, 6}; System.out.println(a[1]);",
                opts: ["2", "4", "6", "ArrayIndexOutOfBoundsException"],
                correct: 1,
                why: "Arrays are zero-indexed, so a[1] is the second element: 4.",
              },
              {
                q: "How do you read the number of elements in int[] a?",
                opts: ["a.length()", "a.length", "a.size()", "len(a)"],
                correct: 1,
                why: "Arrays expose length as a public final field — no parentheses.",
              },
              {
                q: "Which method return type means 'returns nothing'?",
                opts: ["null", "empty", "void", "None"],
                correct: 2,
                why: "void declares that a method returns no value.",
              },
              {
                q: "Can two methods have the same name and different parameter types?",
                opts: ["No, names must be unique", "Yes — that's overloading", "Only in interfaces", "Only if static"],
                correct: 1,
                why: "Overloading lets one method name serve several parameter lists.",
              },
              {
                q: "What does (int) 9.99 evaluate to?",
                opts: ["10", "9", "9.99", "Compile error"],
                correct: 1,
                why: "Casting a double to int truncates toward zero — 9.99 becomes 9.",
              },
            ],
          },
        },
      ],
    },
    {
      title: "Object-Oriented Programming I",
      summary: "Classes, objects, constructors, encapsulation and inheritance.",
      lessons: [
        {
          title: "Classes and Objects",
          min: 16,
          free: true,
          blocks: [
            vid("14:05", [
              { t: "00:00", label: "From variables to objects" },
              { t: "04:12", label: "Fields and methods" },
              { t: "08:40", label: "Creating objects with new" },
              { t: "12:00", label: "Object state vs behaviour" },
            ]),
            t("Object orientation bundles **data** (fields) and **behaviour** (methods) into a single unit — the object — defined by its **class**. A class is the blueprint; objects are the buildings."),
            c("java", `public class Student {
    String name;         // fields = state
    int rollNo;

    void introduce() {   // method = behaviour
        System.out.println("I'm " + name + ", roll " + rollNo);
    }
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student();   // object #1
        s1.name = "Aarav";
        s1.rollNo = 1;
        s1.introduce();               // I'm Aarav, roll 1

        Student s2 = new Student();   // object #2 — independent state
        s2.name = "Meera";
        s2.rollNo = 2;
        s2.introduce();               // I'm Meera, roll 2
    }
}`),
            t("`s1` and `s2` each hold their **own** copy of the fields. The variable holds a reference to the object on the heap — two variables can point at the same object, which is why `==` on objects compares references, not contents."),
          ],
        },
        {
          title: "Constructors",
          min: 12,
          blocks: [
            t("A **constructor** initialises a new object. It has no return type, and its name matches the class exactly. If you write none, Java supplies a do-nothing default."),
            c("java", `public class Book {
    String title;
    String author;
    double price;

    Book(String title, String author, double price) {
        this.title = title;      // this.title = field,
        this.author = author;    // title = parameter
        this.price = price;
    }
}

Book b = new Book("Effective Java", "Joshua Bloch", 699.0);`),
            t("You can define several constructors with different parameter lists (**overloaded constructors**) and chain them with `this(...)` to avoid repeating initialisation logic."),
          ],
        },
        {
          title: "this, Encapsulation and Getters/Setters",
          min: 14,
          blocks: [
            t("**Encapsulation** = keep fields `private` and expose controlled access. The class then guards its own rules — invalid states become impossible to create from outside."),
            c("java", `public class Account {
    private double balance;         // hidden

    public double getBalance() { return balance; }

    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("amount must be positive");
        balance += amount;          // rule lives in ONE place
    }
}`),
            tip("Why not public fields?", "With a public field, every caller can set `balance = -500`. With a method, the rule is enforced everywhere the class is used — including code you write next year."),
          ],
        },
        {
          title: "Static Members and Constants",
          min: 11,
          blocks: [
            t("`static` members belong to the **class**, not to any object. All instances share one copy — right for constants and counters, wrong for per-object state."),
            c("java", `public class Counter {
    static int totalCreated = 0;        // shared
    final static int MAX_ID = 999999;   // constant convention

    int id;                             // per object

    Counter() { totalCreated++; id = totalCreated; }
}

new Counter(); new Counter(); new Counter();
System.out.println(Counter.totalCreated);   // 3`),
            note("static main, revisited", "Now `public static void main` makes sense: the JVM calls it on your class before any objects exist, so it must be static."),
          ],
        },
        {
          title: "Inheritance",
          min: 15,
          blocks: [
            t("Inheritance lets a class (**subclass**) reuse and extend another (**superclass**) with `extends`. The subclass gains every non-private member and can add its own."),
            c("java", `class Vehicle {
    protected String brand;
    Vehicle(String brand) { this.brand = brand; }

    void describe() {
        System.out.println("Vehicle: " + brand);
    }
}

class Car extends Vehicle {
    private int doors;

    Car(String brand, int doors) {
        super(brand);            // initialise the parent part first
        this.doors = doors;
    }

    @Override
    void describe() {            // specialise the behaviour
        super.describe();        // reuse parent logic
        System.out.println("Doors: " + doors);
    }
}`),
            t("`super(...)` must be the **first statement** in the constructor. `@Override` is optional but essential in practice — the compiler then errors if the signature doesn't actually override anything."),
            note("Java is single-inheritance", "A class extends exactly one class. Multiple 'parents' are modelled with interfaces (Module 6)."),
          ],
        },
        {
          title: "Checkpoint Quiz: OOP",
          type: "quiz",
          min: 12,
          blocks: [t("Six questions covering Modules 5 so far: classes, constructors, encapsulation, static and inheritance.")],
          quiz: {
            pass: 60,
            questions: [
              {
                q: "Where does execution of every Java program begin?",
                opts: ["The first class defined", "main()", "The constructor", "run()"],
                correct: 1,
                why: "The JVM starts the program at the main method of the class you run.",
              },
              {
                q: "What does encapsulation primarily achieve?",
                opts: ["Faster code", "Fields hidden behind methods that enforce rules", "Multiple inheritance", "Smaller class files"],
                correct: 1,
                why: "Private fields plus controlled access protect an object's invariants.",
              },
              {
                q: "Which keyword calls the parent class constructor?",
                opts: ["parent()", "base()", "super()", "this()"],
                correct: 2,
                why: "super(...) invokes the superclass constructor and must be the first statement.",
              },
              {
                q: "A static field is shared by…",
                opts: ["each object separately", "the whole class — one copy", "the JVM globally across programs", "only subclasses"],
                correct: 1,
                why: "static members belong to the class itself; all instances see the same value.",
              },
              {
                q: "What is the purpose of @Override?",
                opts: ["It enables overriding", "It asks the compiler to verify the method really overrides", "It hides the parent method", "It is required by the JVM"],
                correct: 1,
                why: "It's a compile-time safety net: without a matching parent method, compilation fails.",
              },
              {
                q: "How many classes can a Java class extend?",
                opts: ["Any number", "Exactly one", "Two", "Zero or two"],
                correct: 1,
                why: "Java has single inheritance of classes; interfaces provide the multi-parent shape.",
              },
            ],
          },
        },
      ],
    },
    {
      title: "Object-Oriented Programming II",
      summary: "Polymorphism, abstraction, interfaces and exception handling.",
      lessons: [
        {
          title: "Polymorphism and Method Overriding",
          min: 15,
          blocks: [
            t("**Polymorphism** — 'many forms' — lets one variable type refer to different concrete objects, with the **object's own** version of a method running. This is the mechanism behind flexible, extensible designs."),
            c("java", `class Shape {
    double area() { return 0; }
}
class Circle extends Shape {
    private double r;
    Circle(double r) { this.r = r; }
    @Override double area() { return Math.PI * r * r; }
}
class Rect extends Shape {
    private double w, h;
    Rect(double w, double h) { this.w = w; this.h = h; }
    @Override double area() { return w * h; }
}

// one array, many shapes — each answers area() its own way
Shape[] shapes = { new Circle(2), new Rect(3, 4) };
for (Shape s : shapes) {
    System.out.println(s.area());   // 12.566..., 12.0
}`),
            t("The compiler only checks that `Shape` **has** `area()`; the JVM dispatches to the runtime type. Add a `Triangle` later and the loop above needs **zero changes** — that is what 'program to an abstraction' buys you."),
          ],
        },
        {
          title: "Abstract Classes and Interfaces",
          min: 16,
          blocks: [
            t("Two tools declare 'what subclasses must provide' without saying how: **abstract classes** (partial implementation allowed) and **interfaces** (pure contracts a class can implement several of)."),
            c("java", `abstract class Payment {
    abstract double total();                 // subclasses must implement

    void receipt() {                          // shared, concrete
        System.out.println("Total due: " + total());
    }
}

interface Refundable {
    boolean refund(double amount);
}

class UpiPayment extends Payment implements Refundable {
    @Override double total() { return 499.0; }
    @Override public boolean refund(double amount) { return true; }
}`),
            note("Choosing between them", "Use an abstract class when subclasses share code and state ('is-a' with reuse). Use an interface when you're defining a capability any class can have ('can-do'), and implement many."),
            t("Modern interfaces may also carry `default` methods (shared behaviour without state) and `static` helper methods — Java 8+."),
          ],
        },
        {
          title: "Exception Handling: try, catch, finally",
          min: 16,
          blocks: [
            t("Exceptions are objects describing runtime failures. Uncaught, they crash the thread; caught, they become recoverable events. Java divides them into **checked** exceptions (the compiler forces you to handle, e.g. `IOException`) and **unchecked** (`RuntimeException` subclasses, e.g. `NullPointerException`)."),
            c("java", `public class ParseAge {
    public static void main(String[] args) {
        String input = "4x2";
        try {
            int age = Integer.parseInt(input);
            System.out.println("Age: " + age);
        } catch (NumberFormatException e) {
            System.out.println("'" + input + "' is not a number");
        } finally {
            System.out.println("Done trying");   // always runs
        }
    }
}`),
            t("Rules of thumb: **catch only what you can handle**; never swallow an exception with an empty catch; log or wrap with context when rethrowing; put cleanup in `finally` (or try-with-resources, next module's cousin of file handling)."),
            warn("Catching Exception", "`catch (Exception e)` hides real bugs. Catch the most specific type that applies, and let truly unexpected failures surface."),
          ],
        },
        {
          title: "Custom Exceptions and throw",
          min: 12,
          blocks: [
            t("Domain rules deserve domain exceptions. Extending `Exception` makes a checked exception; extending `RuntimeException` makes it unchecked."),
            c("java", `class InsufficientBalanceException extends RuntimeException {
    InsufficientBalanceException(String msg) { super(msg); }
}

class Account {
    private double balance = 500;

    void withdraw(double amount) {
        if (amount > balance) {
            throw new InsufficientBalanceException(
                "balance " + balance + " < requested " + amount);
        }
        balance -= amount;
    }
}`),
            tip("Message quality", "Write exception messages someone can act on: what failed, and the values involved. 'Error' helps nobody at 2 a.m."),
          ],
        },
        {
          title: "Practice: Exception Scenarios",
          type: "assignment",
          min: 45,
          blocks: [
            t("Time to apply Modules 5–6 to realistic failure cases. Work in your IDE, then submit a short reflection below."),
            obj([
              "Make a method `int divide(int a, int b)` that throws ArithmeticException-like behaviour with your own message when b is 0",
              "Handle it in a caller with a friendly message and a retry prompt",
              "Create a checked exception `InvalidMarksException` for marks outside 0–100",
              "Ensure a Scanner is closed in a finally block",
            ]),
          ],
          assignment: {
            title: "Exception Scenarios Worksheet",
            brief:
              "Implement the four exception scenarios listed in the lesson objectives. Submit the code as a single file or paste key methods, plus 3–4 sentences on where you chose checked vs unchecked exceptions and why.",
            max: 100,
          },
        },
      ],
    },
    {
      title: "Collections and Generics",
      summary: "Lists, maps, sets and writing type-safe generic code.",
      lessons: [
        {
          title: "The Collections Framework Overview",
          min: 12,
          blocks: [
            t("The **Java Collections Framework** (`java.util`) provides ready-made data structures. The two core interfaces: **`List`** (ordered, index-based) and **`Set`** (no duplicates), plus **`Map`** (key → value pairs, technically not a Collection)."),
            c("java", `import java.util.List;
import java.util.ArrayList;

List<String> names = new ArrayList<>();   // interface on the left,
names.add("Aarav");                       // implementation on the right
names.add("Meera");
System.out.println(names.get(0));         // Aarav
System.out.println(names.size());         // 2`),
            tip("Program to the interface", "Declaring `List<String> x = new ArrayList<>()` (not `ArrayList x = ...`) keeps your options open and is the professional convention."),
          ],
        },
        {
          title: "ArrayList and LinkedList",
          min: 14,
          blocks: [
            t("Two `List` implementations with different cost profiles: **`ArrayList`** is a resizable array — O(1) random access, amortised O(1) append, O(n) middle insert. **`LinkedList`** is a doubly-linked list — O(1) insert at ends via iterators, O(n) access."),
            c("java", `List<Integer> scores = new ArrayList<>();
scores.add(86); scores.add(72); scores.add(91);

scores.remove(Integer.valueOf(72));   // removes the VALUE 72
scores.set(0, 90);                    // replace index 0
System.out.println(scores);           // [90, 91]

// sorting
scores.sort(Integer::compareTo);`),
            note("Default choice", "Reach for `ArrayList` by default. Choose `LinkedList` only when you genuinely insert/remove at the head constantly while walking the list."),
          ],
        },
        {
          title: "HashMap, HashSet and Hashing",
          min: 15,
          blocks: [
            t("**`HashMap<K,V>`** stores key→value pairs with ~O(1) average lookup. **`HashSet<E>`** is just a `HashMap` used to answer 'have I seen this?' — constant-time membership tests."),
            c("java", `Map<String, Integer> stock = new HashMap<>();
stock.put("pen", 120);
stock.put("book", 40);

System.out.println(stock.get("pen"));          // 120
System.out.println(stock.getOrDefault("ink", 0)); // 0

stock.put("pen", stock.get("pen") - 30);       // update
for (var entry : stock.entrySet()) {
    System.out.println(entry.getKey() + " -> " + entry.getValue());
}

Set<String> seen = new HashSet<>();
seen.add("a"); seen.add("a");
System.out.println(seen.size());               // 1`),
            warn("Keys need equals/hashCode", "If you use your own class as a key, override `equals()` and `hashCode()` together or lookups will misbehave."),
          ],
        },
        {
          title: "Generics",
          min: 13,
          blocks: [
            t("**Generics** parameterise types: a `Box<T>` works for any `T`, checked at compile time — no casts, no `ClassCastException` surprises."),
            c("java", `class Box<T> {
    private T item;
    void put(T item) { this.item = item; }
    T get() { return item; }
}

Box<String> bs = new Box<>();
bs.put("hello");
String s = bs.get();          // no cast needed

// bounded type parameter
static <T extends Comparable<T>> T maxOf(List<T> list) {
    T best = list.get(0);
    for (T item : list) if (item.compareTo(best) > 0) best = item;
    return best;
}`),
          ],
        },
        {
          title: "Practice: Collection Problems",
          min: 40,
          blocks: [
            t("Six small problems to make collections automatic: word frequency from a sentence (`HashMap`), de-duplicate a list (`HashSet`), sort students by marks (`Comparator`), invert a map, find the first non-repeated character, and merge two lists alternately."),
            tip("Method reference", "`list.sort(Comparator.comparing(Student::getMarks).reversed())` sorts by marks descending in one line. `Comparator.comparing` is the modern idiom."),
          ],
        },
      ],
    },
    {
      title: "Practical Java",
      summary: "Files, lambdas and streams, and the capstone project.",
      lessons: [
        {
          title: "Working with Files",
          min: 15,
          blocks: [
            t("Java's NIO (`java.nio.file`) makes reading and writing text files short and safe — always with try-with-resources so files close even on error."),
            c("java", `import java.nio.file.*;
import java.util.List;
import java.io.IOException;

// read all lines
List<String> lines = Files.readAllLines(Path.of("marks.txt"));

// write (CREATE + TRUNCATE by default)
Files.write(Path.of("report.txt"),
    List.of("Average: 80.2", "Top: 91"));

// line by line with streams (large files)
try (var stream = Files.lines(Path.of("marks.txt"))) {
    stream.filter(l -> !l.isBlank()).forEach(System.out::println);
} catch (IOException e) {
    System.out.println("Could not read file: " + e.getMessage());
}`),
            warn("Checked exceptions", "File APIs throw checked `IOException` — the compiler makes you catch it or declare `throws IOException`. This is your first routine encounter with checked exceptions."),
          ],
        },
        {
          title: "Lambdas and Streams",
          min: 16,
          blocks: [
            t("A **lambda** is an inline function — `(a, b) -> a + b`. The **Streams API** processes collections through declarative pipelines: describe *what*, not *how*."),
            c("java", `List<String> names = List.of("Aarav", "Meera", "Zoya", "Ishaan");

List<String> shortNames = names.stream()
    .filter(n -> n.length() <= 5)     // keep short ones
    .map(String::toUpperCase)         // transform
    .sorted()                         // order
    .toList();                        // [AARAV, MEERA, ZOYA]

int total = List.of(86, 72, 91).stream()
    .mapToInt(Integer::intValue)
    .sum();`),
            tip("Streams replace loop-bookkeeping", "Filter/map/reduce pipelines read like the requirement itself. Keep individual lambdas tiny — if one grows past a line, name it a method."),
          ],
        },
        {
          title: "Structuring a Console Application",
          min: 14,
          blocks: [
            t("Before the capstone, one lesson on **structure**: a menu loop, command dispatch, and separation of model / logic / UI. This is the skeleton you'll flesh out in the project."),
            c("java", `public class App {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Library library = new Library();          // model
        boolean running = true;

        while (running) {
            printMenu();                          // UI
            switch (sc.nextLine().trim()) {
                case "1" -> library.addBook(sc);  // logic in model
                case "2" -> library.listBooks();
                case "0" -> running = false;
                default -> System.out.println("Unknown option");
            }
        }
    }
}`),
            note("Why this shape", "Menu logic never touches data directly; the model enforces its own rules. The same separation scales up to Spring services later in your learning path."),
          ],
        },
        {
          title: "Capstone: Library Management System",
          type: "assignment",
          min: 240,
          blocks: [
            t("The capstone brings the whole course together: a menu-driven library system with books, members, issue/return, file persistence and search. Build it in layers — model first, then logic, then UI — and commit often with Git."),
            obj([
              "Model Book, Member and Loan with proper encapsulation",
              "Implement issue/return rules with custom exceptions (e.g. BookUnavailableException)",
              "Persist books and loans to a file; load on startup",
              "Search by title/author; list overdue loans",
              "Write a short README describing your design decisions",
            ]),
            tip("Milestone plan", "Day 1: model + add/list. Day 2: issue/return + exceptions. Day 3: file persistence + search. Small, committed milestones beat a single heroic session."),
          ],
          assignment: {
            title: "Library Management System — Capstone Submission",
            brief:
              "Submit your project as a Git repository link (or a single .zip of source files) including the README. Describe: class responsibilities, where you used collections vs arrays, your custom exceptions, and one thing you would add next.",
            max: 100,
          },
        },
      ],
    },
  ],
};
