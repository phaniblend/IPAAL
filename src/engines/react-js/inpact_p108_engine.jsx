import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #108", title: "Next.js App Router Fundamentals", body: "A significant portion of React jobs require Next.js. Teaches App Router file conventions — page.tsx, layout.tsx, loading.tsx, error.tsx — dynamic routes, Link, and the Metadata API. Bridges client-side React to full-stack thinking.", usecase: "Next.js App Router." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Use page, layout, loading, error conventions", "Create dynamic routes", "Use Link and Metadata API", "Understand client vs server components"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Set up a page and layout in the app directory (or describe structure).", answer_keywords: ["page", "layout", "export"], seed_code: "export default function Page() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "Add page/layout.", feedback_wrong: "Set up App Router", expected: "Page and layout" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Add a dynamic route and Link navigation.", answer_keywords: ["Link", "params", "dynamic"], seed_code: "import Link from 'next/link'\n\nexport default function Page() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "Dynamic route.", feedback_wrong: "Link and params", expected: "Dynamic route + Link" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Add loading or error file and export metadata if applicable.", answer_keywords: ["export", "metadata", "loading"], seed_code: "export default function Page() {\n  // Step 3\n}", feedback_correct: "✅ Lesson #108 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, lessonNum: 108, title: "Next.js App Router Fundamentals", shortName: "NEXT.JS APP ROUTER" });
