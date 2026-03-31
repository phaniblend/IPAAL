import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Lesson", content: { tag: "LESSON #114", title: "Session Timeout Hook", body: "Enterprise apps require auto-logout after inactivity. Builds useSessionTimeout that tracks user activity, fires a warning modal at T-2 minutes, and triggers logout — covering setTimeout cleanup and the Page Visibility API.", usecase: "Inactivity timeout and logout." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Track activity (mousemove, keydown)", "Show warning modal before timeout", "Clear timeouts on cleanup", "Use Visibility API"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Create useSessionTimeout that resets a timer on user activity.", answer_keywords: ["useEffect", "setTimeout", "clearTimeout"], seed_code: "import { useEffect, useState } from 'react'\n\nexport default function App() {\n  // Step 1\n}", feedback_correct: "✅ Step 1 done.", feedback_partial: "Timer and activity.", feedback_wrong: "Set up hook", expected: "Activity-based timer" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Add a warning state at T-2 minutes and a modal.", answer_keywords: ["modal", "warning", "state"], seed_code: "import { useEffect, useState } from 'react'\n\nexport default function App() {\n  // Step 2\n}", feedback_correct: "✅ Step 2 done.", feedback_partial: "Warning modal.", feedback_wrong: "Warning at T-2", expected: "Warning modal" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Trigger logout on timeout and clean up on unmount; export.", answer_keywords: ["export", "logout", "cleanup"], seed_code: "import { useEffect, useState } from 'react'\n\nexport default function App() {\n  // Step 3\n}", feedback_correct: "✅ Lesson #114 complete.", feedback_partial: "Export and finish.", feedback_wrong: "Export component", expected: "Complete" },
];

const sideItems = [{ label: "Lesson", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];
export default createINPACTEngine({ NODES, sideItems, lessonNum: 114, title: "Session Timeout Hook", shortName: "SESSION TIMEOUT HOOK" });
