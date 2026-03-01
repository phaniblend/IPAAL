import createINPACTEngine from "../inpact_engine_shared";

const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Problem",
    content: {
      tag: "TS FUNDAMENTALS #9",
      title: "Typing Uncertain Output",
      body: `The hardest question in TypeScript:
"How do I type a function whose output I don't know yet?"

You have a hierarchy of tools, from most to least safe:

1. Generics <T>         — caller determines the type at call time
2. Union types          — output is one of a finite set
3. unknown              — output exists but shape is unknown (must narrow)
4. Conditional types    — output type depends on input type
5. any                  — no safety (last resort)

Choosing the right tool is what separates TypeScript
experts from people who add : any everywhere.`,
      usecase: `fetch wrappers, generic data transformers, event emitters, plugin systems, config loaders — anywhere the return type is dynamic or caller-determined.`,
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Use generics to let the caller declare the return type",
      "Use unknown for truly opaque outputs — force narrowing downstream",
      "Use union return types for finite output possibilities",
      "Use conditional types to derive return type from input type",
      "Type a fetch wrapper that returns Promise<T> safely",
      "Use overloads to give different return types per input",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 5",
    paal: "Write a typed fetch wrapper: function get<T>(url: string): Promise<T>. The caller specifies T — your function trusts that the API returns it.",
    answer_keywords: ["<t>", "promise", "fetch", "generic"],
    seed_code: `// Step 1: generic fetch wrapper — caller determines T

async function get<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}: \${url}\`)
  }
  return response.json() as Promise<T>
  // Caller decides T — no validation here (use zod for that)
}

// Usage — T inferred from explicit annotation:
interface User { id: number; name: string }
const user = await get<User>('/api/users/1')
console.log(user.name)   // ✅ typed as string

// Safer version — accept a validator function:
async function safeGet<T>(
  url: string,
  validate: (data: unknown) => T   // caller provides runtime validation
): Promise<T> {
  const res = await fetch(url)
  const raw: unknown = await res.json()
  return validate(raw)   // validate throws if shape is wrong
}

export { get, safeGet }`,
    feedback_correct: "✅ Generic fetch wrapper is the foundational pattern — every typed API layer starts here.",
    feedback_partial: "function get<T>(url: string): Promise<T> — T is provided by the caller at the call site.",
    feedback_wrong: "async function get<T>(url: string): Promise<T> { return fetch(url).then(r => r.json()) }",
    expected: "Generic fetch wrapper",
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 5",
    paal: "Return unknown from a function and force callers to narrow before using. Show why this is safer than any.",
    answer_keywords: ["unknown", "narrow", "typeof", "return"],
    seed_code: `// Step 2: returning unknown — force callers to narrow

function parseConfig(raw: string): unknown {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// Caller must narrow before using:
const config = parseConfig('{"theme":"dark","version":2}')

// config.theme   // ❌ TS error — Object is of type 'unknown'

if (typeof config === 'object' && config !== null && 'theme' in config) {
  const themed = config as { theme: string; version: number }
  console.log(themed.theme)   // 'dark'
}

// CONTRAST with any:
function parseConfigUnsafe(raw: string): any {
  return JSON.parse(raw)
}
const cfg = parseConfigUnsafe('...')
cfg.theme.whatever.nested.gone   // ✅ TS says fine. Runtime: 💥 crash

// unknown forces callers to think. any silences them.

export { parseConfig, parseConfigUnsafe }`,
    feedback_correct: "✅ unknown is the honest return type when shape is truly unknown — any is the cowardly one.",
    feedback_partial: "Return unknown to force callers to narrow. Return any to trust callers blindly.",
    feedback_wrong: "function parse(): unknown — callers must check type before accessing properties.",
    expected: "unknown vs any for uncertain output",
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 5",
    paal: "Use conditional return types: if input is a string array, output is string; if input is a number array, output is number.",
    answer_keywords: ["conditional", "extends", "t extends", "infer"],
    seed_code: `// Step 3: conditional types — return type depends on input type

// T extends string[] → return type is string
// T extends number[] → return type is number
type ElementType<T> =
  T extends string[]  ? string  :
  T extends number[]  ? number  :
  T extends boolean[] ? boolean :
  never

function first<T extends unknown[]>(arr: T): ElementType<T> {
  return arr[0] as ElementType<T>
}

const s = first(['a', 'b', 'c'])   // TS infers: string
const n = first([1, 2, 3])         // TS infers: number

// A more direct approach — infer the element type generically:
function firstOf<T>(arr: T[]): T | undefined {
  return arr[0]
}
// This is usually simpler. Use conditional types only when the output
// genuinely depends on which case of the input was matched.

export { first, firstOf }
export type { ElementType }`,
    feedback_correct: "✅ Conditional types (T extends X ? A : B) are powerful but complex — prefer simple generics when possible.",
    feedback_partial: "type Cond<T> = T extends X ? A : B — the ternary-style type-level conditional.",
    feedback_wrong: "type Result<T> = T extends string[] ? string : T extends number[] ? number : never",
    expected: "Conditional return type",
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 5",
    paal: "Use overloads to give different return types per input: transform('string input') → string, transform(42) → number.",
    answer_keywords: ["overload", "string", "number", "different return"],
    seed_code: `// Step 4: overloads for different return types

// Overload signatures — what callers see:
function transform(value: string): string
function transform(value: number): number

// Implementation signature — must accept union of all overload params:
function transform(value: string | number): string | number {
  if (typeof value === 'string') {
    return value.trim().toLowerCase()
  }
  return value * 2
}

const s = transform('  Hello  ')   // TS knows: returns string
const n = transform(21)            // TS knows: returns number

// Overloads vs conditional type:
// Use OVERLOADS when the return type is determined by a specific param type
// Use CONDITIONAL TYPES when the logic is more complex or type-level

// NO OVERLOADS when a simple generic works:
// function wrap<T>(value: T): { data: T } — don't overcomplicate

export { transform }`,
    feedback_correct: "✅ Overloads give callers precise return types per input signature — TypeScript picks the matching overload.",
    feedback_partial: "Declare multiple overload signatures above the implementation. Implementation uses a union.",
    feedback_wrong: "function transform(v: string): string  (then)  function transform(v: number): number  (then)  implementation",
    expected: "Overloads for different return types",
  },
  {
    id: "step5",
    type: "question",
    phase: "Step 5 of 5",
    paal: "Build a Result<T, E> type — the functional alternative to throw/catch for uncertain operations.",
    answer_keywords: ["result", "ok", "err", "discriminated", "union"],
    seed_code: `// Step 5: Result<T, E> — typed error handling without exceptions

// Discriminated union for success / failure — no throws
type Ok<T>  = { ok: true;  value: T }
type Err<E> = { ok: false; error: E }
type Result<T, E = Error> = Ok<T> | Err<E>

// Helpers
function ok<T>(value: T): Ok<T>       { return { ok: true, value } }
function err<E>(error: E): Err<E>     { return { ok: false, error } }

// Function returns Result — caller is forced to handle both cases
async function fetchUser(id: number): Promise<Result<User, string>> {
  try {
    const res = await fetch(\`/api/users/\${id}\`)
    if (!res.ok) return err(\`HTTP \${res.status}\`)
    const data = await res.json()
    return ok(data as User)
  } catch (e) {
    return err('Network error')
  }
}

// Caller must handle both:
const result = await fetchUser(1)
if (result.ok) {
  console.log(result.value.name)   // ✅ TS narrows to Ok<User>
} else {
  console.error(result.error)      // ✅ TS narrows to Err<string>
}

interface User { id: number; name: string }
export type { Result, Ok, Err }
export { ok, err, fetchUser }`,
    feedback_correct: "✅ Result<T, E> makes errors explicit in the type system — no silent exceptions, no unhandled cases.",
    feedback_partial: "type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }",
    feedback_wrong: "Result is a discriminated union — ok: true gives value, ok: false gives error.",
    expected: "Result type for typed error handling",
  },
];

const sideItems = [
  { label: "Problem", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1 — Generic fetch", id: "step1" },
  { label: "Step 2 — unknown return", id: "step2" },
  { label: "Step 3 — Conditional type", id: "step3" },
  { label: "Step 4 — Overloads", id: "step4" },
  { label: "Step 5 — Result<T,E>", id: "step5" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  problemNum: "F09",
  title: "Typing Uncertain Output",
  shortName: "TS — UNCERTAIN OUTPUT",
});
