import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #106", title: "TanStack Query Basics", body: "Production teams use TanStack Query for server state. Teaches QueryClient, useQuery, useMutation, cache invalidation, stale-while-revalidate, and React Query DevTools — replacing manual fetch with industry-standard server state management.", usecase: "Server state with TanStack Query." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Set up QueryClientProvider", "Use useQuery for fetching", "Use useMutation and invalidateQueries", "Understand stale-while-revalidate"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Wrap the app with QueryClientProvider and create QueryClient.", answer_keywords: ["QueryClient", "QueryClientProvider"], seed_code: "import { QueryClient, QueryClientProvider } from '@tanstack/react-query'\n\nexport default function App() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "Add provider.", feedback_wrong: "Set up QueryClient", expected: "QueryClientProvider" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Use useQuery to fetch data and useMutation with invalidateQueries for updates.", answer_keywords: ["useQuery", "useMutation", "invalidateQueries"], seed_code: "import { useQuery, useMutation } from '@tanstack/react-query'\n\nexport default function App() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "Query and mutation.", feedback_wrong: "useQuery/useMutation", expected: "useQuery + useMutation" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Wire UI and export.", answer_keywords: ["export", "default"], seed_code: "import { useQuery } from '@tanstack/react-query'\n\nexport default function App() {\n  // Step 3\n}", feedback_correct: "✅ Lesson #106 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, lessonNum: 106, title: "TanStack Query Basics", shortName: "TANSTACK QUERY BASICS" });
