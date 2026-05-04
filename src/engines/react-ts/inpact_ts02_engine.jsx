import createINPACTEngine from "../inpact_engine_shared";

// ─── evaluators — Lesson 2: inventory row types (readonly, unions, nesting, &) ─

function isDeclaredAtModuleScope(raw, declarationStartIndex) {
  if (!Number.isFinite(declarationStartIndex) || declarationStartIndex < 0) return false;
  const firstComponentIndex = raw.search(
    /(?:const\s+[A-Z][A-Za-z0-9_]*\s*=\s*\(|function\s+[A-Z][A-Za-z0-9_]*\s*\()/m,
  );
  if (firstComponentIndex < 0) return true;
  return declarationStartIndex < firstComponentIndex;
}

function evalLesson2Step1(answer) {
  const raw = String(answer || "");
  const m = raw.match(/interface\s+StockLineAudit\s*\{([\s\S]*?)\}/m);
  if (!m || m.index == null) return "wrong";
  const body = m[1] || "";
  const hasReadonlyId = /\breadonly\s+id\s*:\s*string\b/.test(body);
  const hasReadonlyStamp = /\breadonly\s+lastVerifiedAt\s*:\s*string\b/.test(body);
  const moduleScoped = isDeclaredAtModuleScope(raw, m.index);
  if (hasReadonlyId && hasReadonlyStamp && moduleScoped) return "correct";
  if ((hasReadonlyId || hasReadonlyStamp) && moduleScoped) return "partial";
  return "wrong";
}

function evalLesson2Step2(answer) {
  const raw = String(answer || "");
  if (!/\btype\s+ShelfBand\b/.test(raw)) return "wrong";
  const after = raw.split(/\btype\s+ShelfBand\s*=\s*/)[1];
  if (!after) return "wrong";
  const segment = after.split(/;/)[0] || "";
  const hasOk = /'ok'|"ok"/.test(segment);
  const hasLow = /'low'|"low"/.test(segment);
  const hasOut = /'out'|"out"/.test(segment);
  const isUnion = segment.includes("|");
  if (hasOk && hasLow && hasOut && isUnion) return "correct";
  if (isUnion && (hasOk || hasLow || hasOut)) return "partial";
  return "wrong";
}

function evalLesson2Step3(answer) {
  const raw = String(answer || "");
  const hall = raw.match(/interface\s+KitchenHall\s*\{([\s\S]*?)\}/m);
  if (!hall) return "wrong";
  const hallBody = hall[1] || "";
  if (!/\bcity\s*:\s*string\b/.test(hallBody) || !/\bstall\s*:\s*string\b/.test(hallBody)) return "wrong";
  const pantry = raw.match(/interface\s+PantryLine\s+extends\s+StockLineAudit\s*\{([\s\S]*?)\}/m);
  if (!pantry) return "wrong";
  const pb = pantry[1] || "";
  if (!/\bskuLabel\s*:\s*string\b/.test(pb)) return "wrong";
  if (!/\bhall\s*:\s*KitchenHall\b/.test(pb)) return "wrong";
  if (!/\bband\s*:\s*ShelfBand\b/.test(pb)) return "wrong";
  const audit = raw.match(/interface\s+StockLineAudit\s*\{([\s\S]*?)\}/m);
  if (!audit) return "wrong";
  return "correct";
}

function evalLesson2Step4(answer) {
  const raw = String(answer || "");
  if (
    !/\btype\s+PantryLineWithNote\s*=\s*PantryLine\s*&\s*\{\s*kitchenNote\s*:\s*string\s*\}\s*;?/m.test(raw)
  ) {
    return "wrong";
  }
  return "correct";
}

const NODES = [
  {
    id: "intro",
    type: "reveal",
    phase: "Lesson",
    content: {
      tag: "LESSON #2 · Shapes behind the row",
      title: "Inventory row — readonly fields, unions, nested types",
      body: `You already built a **visible** grocery card in lesson 1. Before we render dozens of rows, we model the **data** TypeScript will guard: audit metadata that should not be reassigned by accident, a small set of shelf states, where the stock came from inside the building, and occasionally an extra note layered on top.

This lesson stays at **module-scope types only** — no new JSX — so you can focus on how interfaces, type aliases, \`extends\`, and \`&\` combine the same way your API payloads and UI props will later.`,
    },
  },
  {
    id: "objectives",
    type: "objectives",
    phase: "Objectives",
    items: [
      "Freeze identity and audit timestamps with **readonly** fields on a dedicated interface",
      "Describe a **fixed set of labels** using a string-literal **union** (\`type\` alias)",
      "Give a nested location its **own interface**, then **extend** a base row type to embed it",
      "Use a **type intersection** (\`&\`) when one row temporarily carries an extra field without duplicating the whole shape",
    ],
  },
  {
    id: "step1",
    type: "question",
    phase: "Step 1 of 4",
    paal:
      "At module scope, declare `interface StockLineAudit` with two **readonly string** fields: `id` (stable row identifier) and `lastVerifiedAt` (ISO-ish timestamp or human audit string for this lesson). Keep both readonly so later code cannot silently reassign audit metadata.",
    hint: "Pattern: each field starts with `readonly` before the name, then `: string`. Declare this interface **above** any future component so it reads like shared kitchen paperwork, not an implementation detail buried inside JSX.",
    think_prompt:
      "You want TypeScript to treat `id` and `lastVerifiedAt` as **immutable** on every object typed as `StockLineAudit`. What does putting `readonly` in front of each field communicate to both the compiler and teammates?",
    mc_options: [
      "`readonly` is only for numbers, not strings",
      "`readonly` stops reassignment after the object is created while still allowing reads everywhere",
      "`readonly` deletes the field from the type",
    ],
    mc_correct_option: "`readonly` stops reassignment after the object is created while still allowing reads everywhere",
    mc_anchor:
      "Readonly fields can still be **read** and passed into JSX or helpers — they just cannot be reassigned (`row.id = …` becomes a type error).",
    why_this_matters:
      "Inventory rows bounce through loaders, optimists, and audits. Locking identity and timestamps at the type level prevents “helpful” hotfixes from corrupting history.",
    answer_keywords: ["interface", "StockLineAudit", "readonly", "id", "lastVerifiedAt", "string"],
    evaluate: evalLesson2Step1,
    seed_code: "",
    starter_code: "// declare interface StockLineAudit here (readonly id + lastVerifiedAt, both string)",
    feedback_correct:
      "Good — audit metadata is now expressed as readonly strings at module scope. That is the same pattern you will reuse for any row that needs a stable key and a last-checked stamp.",
    feedback_partial:
      "You are close — confirm both fields are marked **readonly**, typed as **string**, and spelled exactly `id` and `lastVerifiedAt` so the next steps can extend this shape.",
    feedback_wrong:
      "Declare **one** interface named `StockLineAudit` with **two readonly string fields**: `id` and `lastVerifiedAt`. Put it at module scope (outside any component).",
    expected: `interface StockLineAudit {
  readonly id: string;
  readonly lastVerifiedAt: string;
}`,
  },
  {
    id: "step2",
    type: "question",
    phase: "Step 2 of 4",
    paal:
      "Still at module scope, add `type ShelfBand = 'ok' | 'low' | 'out'` — three literal states the UI can branch on later without accepting arbitrary strings.",
    hint: "A **type alias** with quoted literals is how you spell “only these tokens are valid.” Order of literals does not matter as long as all three appear joined by `|`.",
    think_prompt:
      "Why prefer a **union of string literals** here instead of `string` for the shelf state field you will add next?",
    mc_options: [
      "`string` already prevents typos at compile time",
      "Literals narrow the allowed values so typos like `'lo'` fail in the editor instead of at runtime",
      "Unions only work for numbers",
    ],
    mc_correct_option:
      "Literals narrow the allowed values so typos like `'lo'` fail in the editor instead of at runtime",
    mc_anchor:
      "`'ok' | 'low' | 'out'` tells TypeScript the **set** of meaningful states. Autocomplete improves and impossible states never compile.",
    why_this_matters:
      "Kitchen dashboards rely on a handful of bands (green / amber / red). Modelling them as literals keeps your future `switch` exhaustive and honest.",
    answer_keywords: ["type", "ShelfBand", "'ok'", "'low'", "'out'"],
    evaluate: evalLesson2Step2,
    seed_code: `interface StockLineAudit {
  readonly id: string;
  readonly lastVerifiedAt: string;
}`,
    starter_code: `interface StockLineAudit {
  readonly id: string;
  readonly lastVerifiedAt: string;
}

// add: type ShelfBand = 'ok' | 'low' | 'out'`,
    feedback_correct:
      "Nice — shelf state is now a closed vocabulary. When you wire UI later, your branches can cover every case the type allows.",
    feedback_partial:
      "Check that the alias is named `ShelfBand` and that all three literals `'ok'`, `'low'`, and `'out'` appear in one union expression.",
    feedback_wrong:
      "Add a **type alias** `ShelfBand` equal to a union of exactly the three string literals `'ok'`, `'low'`, and `'out'`.",
    expected: `interface StockLineAudit {
  readonly id: string;
  readonly lastVerifiedAt: string;
}

type ShelfBand = "ok" | "low" | "out";`,
  },
  {
    id: "step3",
    type: "question",
    phase: "Step 3 of 4",
    paal:
      "Add `interface KitchenHall` with `city: string` and `stall: string`. Then declare `interface PantryLine extends StockLineAudit` with `skuLabel: string`, `hall: KitchenHall`, and `band: ShelfBand`.",
    hint: "`extends` copies the audit fields forward — you only list what **this** row adds. Nested `KitchenHall` keeps the “where in the building” shape reusable instead of flattening four mystery strings.",
    think_prompt:
      "`PantryLine` needs both audit fields **and** new row fields. Which option matches how TypeScript expects you to spell that relationship?",
    mc_options: [
      "Redefine `readonly id` and `readonly lastVerifiedAt` manually inside `PantryLine`",
      "Use `interface PantryLine extends StockLineAudit { … }` and list only the extra fields",
      "Use `type PantryLine = string`",
    ],
    mc_correct_option: "Use `interface PantryLine extends StockLineAudit { … }` and list only the extra fields",
    mc_anchor:
      "`extends` inherits the base checklist — you declare the delta (`skuLabel`, nested `hall`, `band`) once and stay aligned if `StockLineAudit` ever picks up another readonly field.",
    why_this_matters:
      "Real payloads nest venue, vendor, or hall metadata. Giving nested blobs their own interface keeps diffs readable when procurement changes a field name.",
    answer_keywords: ["KitchenHall", "PantryLine", "extends", "StockLineAudit", "skuLabel", "hall", "band"],
    evaluate: evalLesson2Step3,
    seed_code: `interface StockLineAudit {
  readonly id: string;
  readonly lastVerifiedAt: string;
}

type ShelfBand = "ok" | "low" | "out";`,
    starter_code: `interface StockLineAudit {
  readonly id: string;
  readonly lastVerifiedAt: string;
}

type ShelfBand = "ok" | "low" | "out";

// add KitchenHall, then PantryLine extends StockLineAudit`,
    feedback_correct:
      "Great — the row type now composes audit metadata, a nested hall, and a banded shelf state without repeating yourself.",
    feedback_partial:
      "Verify `KitchenHall` has both string fields, `PantryLine` **extends** `StockLineAudit`, and the three added fields use the exact names `skuLabel`, `hall`, and `band` with the expected types.",
    feedback_wrong:
      "Create a small **KitchenHall** interface (city + stall strings). Then define **PantryLine** with `extends StockLineAudit` and only the extra fields: label text, nested hall, and `ShelfBand`.",
    expected: `interface StockLineAudit {
  readonly id: string;
  readonly lastVerifiedAt: string;
}

type ShelfBand = "ok" | "low" | "out";

interface KitchenHall {
  city: string;
  stall: string;
}

interface PantryLine extends StockLineAudit {
  skuLabel: string;
  hall: KitchenHall;
  band: ShelfBand;
}`,
  },
  {
    id: "step4",
    type: "question",
    phase: "Step 4 of 4",
    paal:
      "Add `type PantryLineWithNote = PantryLine & { kitchenNote: string }` — an intersection that layers a memo field onto the full row type without rewriting every property.",
    hint: "Intersections merge two object shapes. Here the right-hand side is a tiny anonymous object type with a single string field. Watch for typos: the field must be `kitchenNote`.",
    think_prompt:
      "You already have `PantryLine`. The head chef sometimes adds a free-text memo for tonight’s service only. When should you reach for `& { … }` instead of editing `PantryLine` itself?",
    mc_options: [
      "When the extra field is universal for every row in the database forever",
      "When a temporary or situational field should combine with an existing type without mutating the base interface",
      "When you want to delete fields from `PantryLine`",
    ],
    mc_correct_option:
      "When a temporary or situational field should combine with an existing type without mutating the base interface",
    mc_anchor:
      "`PantryLine & { kitchenNote: string }` is the lightweight pattern for “same row, plus an overlay.” Promotion to a first-class field belongs in the base type only if *every* consumer needs it.",
    why_this_matters:
      "UI-only overlays (flags, memos, optimistic badges) come and go. Intersections let you experiment without destabilising the canonical row type the API team owns.",
    answer_keywords: ["type", "PantryLineWithNote", "PantryLine", "&", "kitchenNote"],
    evaluate: evalLesson2Step4,
    seed_code: `interface StockLineAudit {
  readonly id: string;
  readonly lastVerifiedAt: string;
}

type ShelfBand = "ok" | "low" | "out";

interface KitchenHall {
  city: string;
  stall: string;
}

interface PantryLine extends StockLineAudit {
  skuLabel: string;
  hall: KitchenHall;
  band: ShelfBand;
}`,
    starter_code: `interface StockLineAudit {
  readonly id: string;
  readonly lastVerifiedAt: string;
}

type ShelfBand = "ok" | "low" | "out";

interface KitchenHall {
  city: string;
  stall: string;
}

interface PantryLine extends StockLineAudit {
  skuLabel: string;
  hall: KitchenHall;
  band: ShelfBand;
}

// add type PantryLineWithNote = PantryLine & { kitchenNote: string }`,
    feedback_correct:
      "Exactly — you combined the existing row with a memo overlay using `&`, which is the idiomatic escape hatch for situational fields.",
    feedback_partial:
      "Check the alias name `PantryLineWithNote`, the intersection with `PantryLine`, and the memo field name `kitchenNote` typed as `string`.",
    feedback_wrong:
      "Declare a **type alias** `PantryLineWithNote` as **PantryLine** intersected with a one-field object type whose only property is `kitchenNote: string`.",
    expected: `interface StockLineAudit {
  readonly id: string;
  readonly lastVerifiedAt: string;
}

type ShelfBand = "ok" | "low" | "out";

interface KitchenHall {
  city: string;
  stall: string;
}

interface PantryLine extends StockLineAudit {
  skuLabel: string;
  hall: KitchenHall;
  band: ShelfBand;
}

type PantryLineWithNote = PantryLine & { kitchenNote: string };`,
  },
];

const sideItems = [
  { label: "Lesson", id: "intro" },
  { label: "Objectives", id: "objectives" },
  { label: "Step 1", id: "step1" },
  { label: "Step 2", id: "step2" },
  { label: "Step 3", id: "step3" },
  { label: "Step 4", id: "step4" },
];

export default createINPACTEngine({
  NODES,
  sideItems,
  lessonNum: 2,
  title: "Inventory row — readonly fields, unions, nested types",
  shortName: "REST — ROW TYPES",
});
