export type FaqItem = { q: string; a: string };
export type FaqCategory = { id: string; name: string; items: FaqItem[] };

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "courses",
    name: "Courses",
    items: [
      { q: "How are KwikStudy courses structured?", a: "Every course is built from numbered modules and lessons, following a written curriculum. Modules close with checkpoint quizzes or graded practice, and most courses end with a project you build yourself. You always know where you are and what comes next." },
      { q: "Do courses include live sessions?", a: "Core material is delivered through recorded lessons and written notes so you can learn at your own pace. Selected batches include weekly live doubt-solving sessions — the batch details are shown before you enroll." },
      { q: "How long do I have access to a course?", a: "Access does not expire. Once enrolled, you can revisit lessons, resources and quizzes whenever you like, including after you complete the course." },
      { q: "Can I see the curriculum before buying?", a: "Yes — the full module and lesson list is public on every course page, and each course includes free preview lessons so you can judge the teaching style before paying." },
      { q: "What if I fall behind?", a: "There is no falling behind. Courses are self-paced by design, and your progress is saved lesson by lesson so you can pick up exactly where you stopped." },
    ],
  },
  {
    id: "payments",
    name: "Payments",
    items: [
      { q: "Which payment methods do you accept?", a: "UPI, debit and credit cards, and net banking — all processed through a secure payment gateway. We never see or store your card details." },
      { q: "Do course prices include GST?", a: "The price shown on the course page is the amount you pay at checkout. Any applicable taxes are shown as a separate line before you confirm payment." },
      { q: "Can I get an invoice for reimbursement?", a: "Yes. A payment receipt is generated automatically for every enrollment and is available from your dashboard. Contact support if you need a GST invoice with additional details." },
      { q: "Do you offer coupons or discounts?", a: "We run occasional offers which are announced on the site and by email. A valid coupon code can be applied on the checkout page before payment." },
    ],
  },
  {
    id: "learning",
    name: "Learning",
    items: [
      { q: "How much time should I plan each week?", a: "Most students study 4–8 hours per week. Each lesson shows its expected duration so you can plan sessions that fit your schedule." },
      { q: "What if I get stuck on a lesson or exercise?", a: "Every lesson has a discussion space where instructors answer questions, usually within one working day. Enrolled students can also reach the academic team by email." },
      { q: "Are the checkpoint quizzes graded?", a: "Quizzes are graded instantly with explanations for every answer. You need the shown passing score to auto-complete the lesson, and you can retake quizzes as often as you like." },
      { q: "Do I need a powerful laptop?", a: "No. Everything in the current curriculum runs comfortably on any machine from the last 6–7 years. Specific setup steps are covered in the first module of each course." },
    ],
  },
  {
    id: "certificates",
    name: "Certificates",
    items: [
      { q: "Do I get a certificate when I finish a course?", a: "Yes. When you complete every lesson in a course, a certificate is issued automatically and appears in your dashboard under Certificates." },
      { q: "How can an employer verify my certificate?", a: "Every certificate carries a unique ID and a public verification page — anyone with the ID can confirm the student name, course and issue date at /verify/[certificate-id]." },
      { q: "Is the certificate recognised by universities or companies?", a: "Our certificates demonstrate completion of a structured curriculum and are verifiable, but they are not a degree or government-recognised accreditation. We are always upfront about this distinction." },
    ],
  },
  {
    id: "enrollment",
    name: "Enrollment",
    items: [
      { q: "Do I need an account to enroll?", a: "Yes — enrollment is tied to your account so your progress, certificates and receipts live in one place. Creating an account takes under a minute." },
      { q: "Can I switch between courses after enrolling?", a: "Enrollments are per course, so you can enroll in several courses and learn them in parallel. Your dashboard keeps each course's progress separate." },
      { q: "Do you enroll students from outside India?", a: "Yes. Courses are delivered online in English and payments are processed in INR — your bank or card provider handles the conversion." },
    ],
  },
  {
    id: "support",
    name: "Technical Support",
    items: [
      { q: "The lesson player or code editor isn't working. What should I do?", a: "First try a hard refresh (Ctrl/Cmd+Shift+R). If the problem persists, contact support with the course and lesson name and a screenshot — we respond within one working day." },
      { q: "I can't log in to my account.", a: "Use the reset link on the login page. If you no longer have access to your registered email, write to support@kwikstudy.in from any address with your full name and registered phone number." },
    ],
  },
  {
    id: "refunds",
    name: "Refunds",
    items: [
      { q: "What is your refund policy?", a: "If a course isn't right for you, write to us within 7 days of purchase and having completed less than 20% of the course, and we'll refund the full amount to the original payment method. The full policy is on our Refund Policy page." },
      { q: "How long do refunds take?", a: "Approved refunds are initiated within 3 working days. Depending on your bank, the amount typically appears in 5–10 working days." },
    ],
  },
];

export const HOME_FAQS: FaqItem[] = [
  FAQ_CATEGORIES[0].items[0],
  FAQ_CATEGORIES[2].items[0],
  FAQ_CATEGORIES[3].items[0],
  FAQ_CATEGORIES[5].items[0],
];
