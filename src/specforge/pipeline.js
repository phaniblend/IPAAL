/**
 * SpecForge staged pipeline — v1: Stage 1 (Normalizer) + Stage 2 (Domain Model) only.
 * Each stage is a separate model call with its own schema, per the "no giant prompt" rule.
 * Nothing here writes to Workbench (OneDev) — output is for human review only.
 */
import { generateStructured } from "./llmProvider.js";
import {
  ProductConceptInputSchema,
  Stage1OutputSchema,
  Stage2OutputSchema,
  Stage3OutputSchema,
  TutorialDraftOutputSchema,
} from "./schemas.js";

const STAGE1_SYSTEM = `You are the Requirement Normalizer stage of SpecForge, a product-spec pipeline for a
software apprenticeship platform. You turn a founder's free-form product concept into
structured, traceable requirements input. Be concrete and specific to the domain described —
never generic boilerplate. Surface only the 3-5 questions that would most change the design
if left unanswered; do not pad the list.`;

const STAGE2_SYSTEM = `You are the Domain Model Generator stage of SpecForge. Given a normalized
product definition, identify the core entities, their fields, relationships, suggested database
tables, validation rules, and audit requirements. Be specific to this product's actual domain —
e.g. for an inventory/consumption product, model units of measure and yield/conversion explicitly
rather than treating quantities as directly comparable across units.

The entities array is the domain model — validation_rules, relationships, suggested_tables, and
audit_requirements describe *that same, already-scoped* set of entities in more detail, they don't
get to introduce a wider one. If a real product would need an Ingredient or Location concept, either
give it its own entry in entities, or don't write a validation rule/table/audit line that assumes it
exists. A downstream stage sizes its own output off how many entities you listed here — a
validation_rules list that quietly implies five entities you never formalized will make that stage
think the domain is five entities' worth of work, not the one or two you actually modeled.`;

/** Stage 1: free-form concept -> normalized JSON + clarifying questions. */
export async function runNormalizer(rawInput, apiKey) {
  const input = ProductConceptInputSchema.parse(rawInput);
  const user = `Product concept:\n${JSON.stringify(input, null, 2)}\n\nProduce the normalized requirement JSON.`;
  return generateStructured({ system: STAGE1_SYSTEM, user, schema: Stage1OutputSchema, apiKey });
}

/** Stage 2: normalized JSON -> domain model. */
export async function runDomainModel(stage1Output, apiKey) {
  const user = `Normalized product definition:\n${JSON.stringify(stage1Output, null, 2)}\n\nProduce the domain model JSON.`;
  return generateStructured({ system: STAGE2_SYSTEM, user, schema: Stage2OutputSchema, apiKey });
}

/** Runs Stage 1 then Stage 2. Throws if either stage fails validation. */
export async function runStages1And2(rawInput, apiKey) {
  const stage1 = await runNormalizer(rawInput, apiKey);
  const stage2 = await runDomainModel(stage1, apiKey);
  return { stage1, stage2 };
}

const STAGE3_SYSTEM = `You are the Task Breakdown stage of SpecForge. Given a normalized product definition and
its domain model, produce the assignable work: epics, then stories under each epic, then concrete tasks under
each story. IPF places apprentices across every trade an app needs, not just engineering — a task's "trade"
should honestly say who it needs (Coding, Product design, PM, QA, Content, etc.), not default everything to
Coding. Each task must be small enough for one person to complete and specific enough that "done" is checkable
from its acceptance criteria alone. Ground every task in the actual entities and fields from the domain model —
never generic placeholders like "build the frontend."

Size the breakdown to the domain model's entities array specifically, not to a habitual template and not to
how much surrounding detail the domain model happens to include: roughly 4-6 tasks per entity is normal for a
real product. One entity means one CRUD-shaped story (model, validation, API, UI, tests) and roughly 5-8 tasks
total — not 15, not 25. Two entities: roughly 10-16. A long validation-rules or relationships list on one
entity is detail to fold into a handful of tasks' acceptance criteria — it is not, by itself, a reason to add
more tasks, and it is never a reason to add a second or third epic.

Before finalizing, count the distinct data-worthy nouns you gave their own model/CRUD/validation/UI story across
the *whole* breakdown (e.g. if you wrote stories for "Ingredient", "InventoryTransaction", and "WasteEntry", that
count is 3). That count must equal the number of entries in stage2.entities, exactly — not "close enough," not
"one real entity plus a couple of adjacent ones the product will obviously need." If your draft breakdown has
more distinct nouns getting their own CRUD story than stage2.entities has entries, you invented entities that
were never modeled — delete those epics/stories entirely rather than trimming them down, they don't belong in
this breakdown at all, no matter how naturally they'd follow from the product's problem statement.

Some domain models carry validation_rules, relationships, suggested_tables, or audit_requirements entries that
mention a concept with no corresponding entry in entities (e.g. a rule about "locations" or "menu items" when
neither is a listed entity) — that happens when Stage 2 described a fuller system than it formally modeled, or
when a human trimmed entities down after generation without editing that supporting detail to match. Either
way, treat any such mention as out of scope: don't infer an entity that isn't listed, and don't let it inflate
the task count. Ground every task in entities that are actually present.

The SAME discipline applies to the normalized product definition (stage1) you're also given: its
problem_statement, business_outcomes, assumptions, and open_questions describe the founder's eventual full
vision for the product — they are motivating context for *why* the entities that made it into stage2 matter,
not a checklist to expand into their own epics. A specific, vivid business outcome (e.g. "compare our usage to
similar restaurants in the area") is not, by itself, permission to build a benchmarking epic, an auth system,
multi-location support, onboarding, or reporting — build those only if stage2 actually modeled entities for
them. entities is authoritative for scope; stage1 explains motivation. When stage2 lists one or two entities,
the right output is a small, tight breakdown for exactly those entities (CRUD, validation, the UI to drive
them, the tests that cover them) — not the full product stage1 describes. The unbuilt remainder of stage1's
vision is deliberately left for a future spec revision once this slice has its own delivery cohort; that's the
whole reason a human publishes a narrow domain model instead of a broad one.

Set no_tutorial_needed: true only when the task genuinely involves no code at all — a PM decision
document, UX copywriting, a design mockup, a manual test *plan* (the document, not the tests). Judge this by
what the task actually asks for, never by trade label alone. In particular: "QA" is NOT automatically
exempt — writing or automating tests (unit, integration, E2E: setup, assertions, mocking, fixtures) is a
coding skill the Module Library has a whole category for (component-unit-testing, e2e-testing,
visual-regression-testing) and must go through the normal match-or-draft path exactly like a Coding task.
Only a QA task that's pure human test-plan authorship, with no test code written, is exempt.

For every task where no_tutorial_needed is false, also set tech_level to the real skill floor it needs —
this is what IPF's matching queue uses to place apprentices only on work they're actually ready for, so
judge it honestly from the task's real content, not from habit:
- "html-css": markup/layout/styling only, no real logic (a static section, a CSS layout fix).
- "js": functions, event handlers, component state, basic API calls — no meaningful type usage.
- "ts": interfaces, generics, typed API contracts, discriminated unions — the task requires reasoning about
  types, not just writing them.
- "advanced": architecture-level decisions, security-sensitive code (auth, tokens, injection risks),
  performance/scale work, or non-trivial state-management design.
A CRUD endpoint or component is usually "js" even if the codebase happens to be TypeScript everywhere —
only mark "ts" when the task itself is about the types, not merely written in a typed language. Leave
tech_level null whenever no_tutorial_needed is true.

Keep every description and acceptance_criteria entry to one plain sentence — this stage produces the largest
output in the whole pipeline (one full entry per task, and a real domain model runs to dozens of tasks), and
a bloated per-task write-up risks the response getting cut off before the JSON closes.`;

/** Stage 3: normalized definition + domain model -> epics/stories/tasks. Review-only, like stages 1-2 —
 * nothing here writes to Workbench. That happens only once a human has edited and approved the list.
 * Given a much bigger maxTokens than the other stages: this is structurally the largest output SpecForge
 * produces, and DeepSeek silently truncates mid-JSON rather than erroring when it runs out of room —
 * discovered live twice: once against a real 6-entity domain model, and again against a single-entity
 * one whose long validation-rules list still pushed the model into a 40+ task breakdown at 8000 tokens.
 * The prompt itself now also caps task count relative to domain size — 14000 tokens is headroom for
 * when it doesn't perfectly comply, not a substitute for that cap. DeepSeek's API accepts requests
 * well above this (confirmed live to 16000) if it ever needs raising further. */
export async function runTaskBreakdown(stage1, stage2, apiKey) {
  const user = `Normalized product definition:\n${JSON.stringify(stage1, null, 2)}\n\nDomain model:\n${JSON.stringify(
    stage2,
    null,
    2
  )}\n\nProduce the full task breakdown as epics -> stories -> tasks.`;
  const result = await generateStructured({ system: STAGE3_SYSTEM, user, schema: Stage3OutputSchema, apiKey, maxTokens: 14000 });
  return result.tasks;
}

const TUTORIAL_DRAFT_SYSTEM = `You are the Tutorial Drafting stage of SpecForge. You've been given a batch of
engineering tasks that IPF's Module Library has no existing tutorial for. Group them into the smallest number
of distinct, reusable teaching modules that would cover them — several similar tasks (e.g. "add item to cart"
and "add item to wishlist") should share ONE generic module about the underlying pattern, not get one each.
Every module you propose must follow the ID Module Library's own house rule: concept, build, and keyTeaching
must all be generic and reusable — never name the product's own domain, business, or specific feature. Describe
the underlying UI/engineering pattern only (e.g. "adding an item to a persisted collection with optimistic
count update"), the same way every other entry in the library is written.

Consolidate hard: each group is a real Gemini generation call downstream, so a batch of 20-30 unmatched tasks
should still land around 6-10 groups, not one per task or even one per trade-adjacent cluster. Two tasks belong
in the same group whenever the underlying pattern is the same even if the surface feature differs — a rate-limit
check and a role check are both "gate a request against a rule before it proceeds"; a health endpoint and a
metrics endpoint are both "expose read-only operational state"; unit/integration/E2E tests for different
features are still "write automated tests against this kind of behavior," one module, not three. Reserve a
separate group only for a pattern that's genuinely a different skill (e.g. schema design vs. request validation
vs. UI list rendering) — never for a difference in which entity or feature the task happens to touch.`;

/** Hard ceiling on distinct groups per publish, independent of how well the model follows the
 * consolidation guidance above — the same "prompt guidance alone isn't enough" lesson Stage 3's
 * token budget already taught (see runTaskBreakdown's comment). Each group costs one full
 * sequential Gemini generation call in specforge-router.js; unbounded groups is what turned a
 * single-entity demo publish into an hour-long run generating 15 tutorials live. Tasks whose group
 * gets dropped by this cap aren't lost or silently exposed — specforge-router.js already falls
 * back to a bare `NeedsTutorial: true` (no DraftModule tag) for any task with no covering group,
 * same as a generation failure — still gated, just needs a manual draft from ID Studio instead of
 * an auto-generated one. */
const MAX_TUTORIAL_GROUPS = 10;

/** Batches every task Stage 3's classifier couldn't match against the Module Library into a small
 * set of generic tutorial drafts, deduping near-duplicate tasks under one module. Does not call
 * Gemini or touch the filesystem — that happens per-group in specforge-router.js after this returns,
 * so a failure generating one group's code doesn't lose the others. */
export async function runTutorialDrafting(unmatchedTasks, productName, apiKey) {
  if (unmatchedTasks.length === 0) return [];
  const taskList = unmatchedTasks
    .map((t, i) => `[${i}] (${t.trade}) ${t.title} — ${t.description}`)
    .join("\n");
  const user = `Product: ${productName}\n\nUnmatched tasks (index, trade, title, description):\n${taskList}\n\nGroup these into generic tutorial modules.`;
  const result = await generateStructured({ system: TUTORIAL_DRAFT_SYSTEM, user, schema: TutorialDraftOutputSchema, apiKey });
  if (result.groups.length > MAX_TUTORIAL_GROUPS) {
    console.warn(
      `[specforge] tutorial drafting returned ${result.groups.length} groups, over the ${MAX_TUTORIAL_GROUPS} cap — ` +
        `keeping the largest ${MAX_TUTORIAL_GROUPS} by task coverage; the rest fall back to a plain NeedsTutorial (manual draft).`
    );
    return [...result.groups].sort((a, b) => b.taskIndexes.length - a.taskIndexes.length).slice(0, MAX_TUTORIAL_GROUPS);
  }
  return result.groups;
}
