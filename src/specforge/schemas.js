/**
 * SpecForge — Zod schemas for the staged pipeline's JSON contracts.
 * v1 scope: Stage 1 (Requirement Normalizer) + Stage 2 (Domain Model Generator) only.
 * Nothing past this point writes to Workbench — output is for human review.
 */
import { z } from "zod";

export const ProductConceptInputSchema = z.object({
  product_name: z.string().min(1),
  description: z.string().min(1),
  target_users: z.array(z.string()).default([]),
  business_goal: z.string().min(1),
  constraints: z.array(z.string()).default([]),
});

export const Stage1OutputSchema = z.object({
  product_name: z.string(),
  problem_statement: z.string(),
  target_users: z.array(z.string()),
  business_outcomes: z.array(z.string()),
  known_integrations: z.array(z.string()).default([]),
  constraints: z.array(z.string()).default([]),
  assumptions: z.array(z.string()).default([]),
  questions: z
    .array(z.string())
    .max(5)
    .describe("The 3-5 most important missing questions, not an exhaustive list"),
});

export const EntitySchema = z.object({
  name: z.string(),
  description: z.string(),
  fields: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      required: z.boolean().default(false),
    })
  ),
  relationships: z.array(z.string()).default([]),
});

export const Stage2OutputSchema = z.object({
  entities: z.array(EntitySchema),
  suggested_tables: z.array(z.string()),
  validation_rules: z.array(z.string()).default([]),
  audit_requirements: z.array(z.string()).default([]),
});

/**
 * Stage 3 (Task Breakdown) — normalized definition + domain model -> assignable work.
 * `trade` is deliberately a free label, not an enum: IPF places any trade (coding, product
 * design, PM, QA, ...), not just engineering, and the breakdown should say what a task
 * actually needs rather than forcing it into a fixed set.
 */
export const Stage3TaskSchema = z.object({
  epic: z.string().min(1),
  story: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  trade: z.string().min(1).describe("Who this is for, e.g. Coding, Product design, PM, QA"),
  acceptance_criteria: z.array(z.string()).default([]),
  no_tutorial_needed: z
    .boolean()
    .default(false)
    .describe(
      "true only if THIS TASK involves no code at all (a manual test plan, a doc, a mockup, a policy decision). " +
        "A task's trade label alone doesn't decide this — writing automated tests is still code and needs false."
    ),
  tech_level: z
    .enum(["html-css", "js", "ts", "advanced"])
    .nullable()
    .default(null)
    .describe(
      "Only for tasks that involve writing code (no_tutorial_needed: false) — the real language/skill floor " +
        "this task needs, judged from what it actually asks for: html-css (markup/layout only, no logic), " +
        "js (functions, DOM/React state, no real type usage), ts (interfaces, generics, typed APIs), " +
        "advanced (architecture, security, performance, or state-management depth beyond typical CRUD). " +
        "null for any task where no_tutorial_needed is true — the level ladder doesn't apply to non-code work."
    ),
});

export const Stage3OutputSchema = z.object({
  tasks: z.array(Stage3TaskSchema).min(1),
});

/**
 * Tutorial drafting — for tasks Stage 3's classifier couldn't match to an existing Module
 * Library entry. One LLM call takes every unmatched task in a batch and groups them into
 * distinct *generic* teaching concepts (several similar tasks can share one module — that's
 * the point of a reusable library instead of a lesson per task). Output must stay as
 * product-agnostic as the ID Module Library itself: a moduleTag/concept/build/keyTeaching
 * shape identical to what a human fills in by hand in ID Studio.
 */
export const TutorialDraftGroupSchema = z.object({
  moduleTag: z.string().describe("short, generic, kebab-case — e.g. toggle-boolean-state"),
  concept: z.string(),
  build: z.string().describe("a generic worked example — never the product's own domain"),
  keyTeaching: z.string(),
  taskIndexes: z.array(z.number().int()).min(1).describe("indexes into the unmatched-tasks list this module covers"),
});

export const TutorialDraftOutputSchema = z.object({
  groups: z.array(TutorialDraftGroupSchema),
});
