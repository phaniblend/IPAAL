import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #109", title: "React Server Components & SSR vs SSG", body: "RSC is the biggest architectural shift in React since hooks. Teaches what runs on server vs client, 'use client', async Server Components for data fetching, SSG vs SSR vs ISR, and Suspense-based streaming.", usecase: "Server Components and rendering strategies." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Understand server vs client boundary", "Use 'use client' where needed", "Write async Server Components", "Compare SSG, SSR, ISR"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Create an async Server Component that fetches data (no 'use client').", answer_keywords: ["async", "await", "fetch"], seed_code: "export default async function Page() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "Async component.", feedback_wrong: "Server Component", expected: "Async Server Component" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Add a client component with 'use client' for interactivity and wrap with Suspense if needed.", answer_keywords: ["use client", "Suspense"], seed_code: "'use client'\n\nexport default function ClientPart() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "Client component.", feedback_wrong: "use client", expected: "Client component + Suspense" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Wire and export.", answer_keywords: ["export", "default"], seed_code: "export default function Page() {\n  // Step 3\n}", feedback_correct: "✅ Lesson #109 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, lessonNum: 109, title: "React Server Components & SSR vs SSG", shortName: "RSC & SSR VS SSG" });
