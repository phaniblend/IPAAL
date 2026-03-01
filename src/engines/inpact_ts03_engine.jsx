import createINPACTEngine from "./inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Problem", content: { tag: "PROBLEM #3 (TypeScript)", title: "Controlled Input — Typed", body: "Build a controlled text input with character count. Type the state as string and type the change handler's event.", usecase: "Typing form state and React.ChangeEvent is essential for forms." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Use useState<string>('') for the input value", "Type onChange as (e: React.ChangeEvent<HTMLInputElement>) => void", "Display value.length for character count"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Declare state: const [text, setText] = useState<string>('').", hint: "useState<string>('')", answer_keywords: ["usestate", "string", "text", "settext"], seed_code: `import { useState } from 'react'

export default function ControlledInput() {
  // Step 1: useState<string>
}`, feedback_correct: "✅ String state typed.", feedback_partial: "useState<string>('').", feedback_wrong: "const [text, setText] = useState<string>('')", expected: "useState<string>" },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Add an input with value={text} and onChange that calls setText(e.target.value). You can type e as React.ChangeEvent<HTMLInputElement>.", hint: "onChange={(e) => setText(e.target.value)} or (e: React.ChangeEvent<HTMLInputElement>) => ...", answer_keywords: ["input", "value", "onchange", "target", "value"], seed_code: `import { useState } from 'react'

export default function ControlledInput() {
  const [text, setText] = useState<string>('')
  // Step 2: controlled input
}`, feedback_correct: "✅ Controlled input with typed state.", feedback_partial: "value and onChange with setText(e.target.value).", feedback_wrong: "input value={text} onChange={e => setText(e.target.value)}", expected: "Controlled input" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Show character count: {text.length}. Return a div with the input and the count. Export the component.", hint: "<p>Count: {text.length}</p>", answer_keywords: ["length", "return", "div", "export"], seed_code: `import { useState } from 'react'

export default function ControlledInput() {
  const [text, setText] = useState<string>('')
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <p>Count: {text.length}</p>
    </div>
  )
}`, feedback_correct: "✅ Controlled input with TypeScript complete.", feedback_partial: "Display text.length.", feedback_wrong: "Show count and export.", expected: "Same as seed" },
];

const sideItems = [{ label: "Problem", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];

export default createINPACTEngine({ NODES, sideItems, problemNum: 3, title: "Controlled Input (TypeScript)", shortName: "TS — CONTROLLED INPUT" });
