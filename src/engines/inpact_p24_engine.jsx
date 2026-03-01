import createINPACTEngine from "./inpact_engine_shared";

const NODES = [
  { id: "intro", type: "reveal", phase: "Problem", content: { tag: "PROBLEM #24", title: "Styled Component Pattern", body: `Build a themed button using CSS variables. Define --primary, --secondary on a wrapper or :root, and use them in inline styles or a style tag so the button reads var(--primary).`, usecase: "CSS variables enable theming without changing component code." } },
  { id: "objectives", type: "objectives", phase: "Objectives", items: ["Define CSS variables (e.g. --primary, --secondary) on a parent or :root", "Use var(--primary) in the button's style", "Render a button that uses the variables"] },
  { id: "step1", type: "question", phase: "Step 1 of 3", paal: "Create a wrapper div with a style tag or inline style that sets CSS variables: --primary: '#3b82f6', --secondary: '#6b7280'. In React you can do style={{ ['--primary']: '#3b82f6' }} on the wrapper.", hint: "Wrapper: style={{ ['--primary']: '#3b82f6', ['--secondary']: '#6b7280' }} or <style>:root { --primary: #3b82f6; }", answer_keywords: ["primary", "secondary", "variable", "style", "root"], seed_code: `export default function ThemedButton() {
  // Step 1: wrapper with CSS variables
  return (
    <div>
      <button>Click</button>
    </div>
  )
}`, feedback_correct: "✅ CSS variables defined.", feedback_partial: "Set --primary and --secondary somewhere.", feedback_wrong: "style={{ ['--primary']: '#3b82f6' }} on wrapper.", expected: "CSS variables on wrapper or :root." },
  { id: "step2", type: "question", phase: "Step 2 of 3", paal: "Style the button with the variable: backgroundColor: 'var(--primary)', color: 'white'. The button should pick up the theme from the wrapper.", hint: "style={{ backgroundColor: 'var(--primary)', color: 'white' }}", answer_keywords: ["var", "primary", "background", "button"], seed_code: `export default function ThemedButton() {
  return (
    <div style={{ ['--primary']: '#3b82f6', ['--secondary']: '#6b7280', padding: 20 }}>
      <button>Click</button>
    </div>
  )
}`, feedback_correct: "✅ Button uses var(--primary).", feedback_partial: "Button style with var(--primary).", feedback_wrong: "backgroundColor: 'var(--primary)'", expected: "button style={{ backgroundColor: 'var(--primary)', color: 'white' }}" },
  { id: "step3", type: "question", phase: "Step 3 of 3", paal: "Export the component. Optionally add a second button that uses var(--secondary). Theme is controlled by the wrapper's variables.", hint: "Second button: backgroundColor: 'var(--secondary)'", answer_keywords: ["export", "secondary"], seed_code: `export default function ThemedButton() {
  return (
    <div style={{ ['--primary']: '#3b82f6', ['--secondary']: '#6b7280', padding: 20 }}>
      <button style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '8px 16px', border: 'none', borderRadius: 6 }}>Primary</button>
      <button style={{ backgroundColor: 'var(--secondary)', color: 'white', marginLeft: 8, padding: '8px 16px', border: 'none', borderRadius: 6 }}>Secondary</button>
    </div>
  )
}`, feedback_correct: "✅ Themed buttons with CSS variables complete.", feedback_partial: "Both buttons use variables.", feedback_wrong: "Export and use var(--primary) and var(--secondary).", expected: "Same as seed." },
];

const sideItems = [{ label: "Problem", id: "intro" }, { label: "Objectives", id: "objectives" }, { label: "Step 1", id: "step1" }, { label: "Step 2", id: "step2" }, { label: "Step 3", id: "step3" }];

export default createINPACTEngine({ NODES, sideItems, problemNum: 24, title: "Styled Component Pattern", shortName: "CSS VARIABLES THEME" });
