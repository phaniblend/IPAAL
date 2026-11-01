# Curriculum authoring — the standing process

This folder holds one FE task-backlog spec per finalized product (`<product>-fe-tasks.md`). This file
is the process those docs follow — read it before starting a new product, and before re-deriving from
scratch anything that already has a rule below.

## The sequencing rule (non-negotiable)

**BE/DB tasks are developed and deployed to a real, running endpoint *before* a single word of FE task
spec is written.** Never the other way around, and never in parallel guessing at a contract. Concretely,
for a newly finalized product:

1. **Backend first, real, deployed.** Every API the product needs is implemented in
   `server/<product>-router.js` (or extended in an existing one) — real routes, real validation, real
   status codes, real business logic. In-memory storage is an accepted stand-in for a real database
   (matches every product so far: MiniERP, SentinelPOS, RouteMatrix, BatchCraft all use plain arrays,
   not Postgres) — what's not accepted is a route that doesn't exist yet, or one whose response shape
   is guessed rather than run.
2. **Live-verify every endpoint before it's cited in a spec.** Not "read the code and assume it's
   right" — actually call it. A quick throwaway script (`node some-temp-file.mjs` hitting the router
   with real `fetch()` calls, deleted after) is enough; BatchCraft's pass caught a real Express
   route-ordering bug this way (`GET /v1/recipes/:id` registered before the more specific
   `GET /v1/recipes/costs`, which would have silently swallowed it) that reading the code alone did not
   surface.
3. **Only then write the FE task spec**, and every "Backend API Contract" section in it quotes the
   real, just-verified request/response shape — method, path, exact JSON, every real status code the
   router actually returns. Never a shape from the product's original design doc/spec if the real
   implementation adapted it (money-as-plain-numbers instead of a Decimal library, in-memory instead
   of Postgres, etc.) — the FE spec must match what a developer will actually get back from a real
   `fetch()` call, not what an idealized backend would have returned.
4. **If the FE backlog needs to read data the backend already has but never exposed** (MiniERP's
   `stockMoves` audit log, BatchCraft's `ingredients` list and per-recipe cost breakdown), add the
   small, real, read-only endpoint to expose it — live-verify that too — rather than either inventing
   a task against data that doesn't exist, or silently dropping a feature the mandate calls for.

**Why this order, specifically**: an FE task's whole value is that a developer can build against a
real contract and get a real response while doing it — "fetch the user list from `/api/users`" only
means something if `/api/users` is already live. Writing the FE spec first (or alongside) means either
guessing the contract (which drifts from reality the moment the backend is actually built) or blocking
the FE task on backend work that hasn't happened yet. Backend-first removes both failure modes.

## Division of labor this reflects

- **FE tasks** go into the assignment pipeline — these are what JS applicants get matched to and build,
  gated the same way every other IPF task is (trade/skill-level matching, `NeedsTutorial`/`AssistModule`
  wiring where applicable).
- **BE/DB tasks are never assigned to applicants** — they're developed and deployed by internal
  engineering (in this repo, that's a `server/*-router.js` change, same as the ones described above),
  finished and live before the corresponding FE task is ever written, let alone assigned.

## What each FE spec doc must do (recap of the per-product standard)

- Ground every API contract in the real router, not the product's original abstract spec.
- Use this project's real established frontend stack (plain `fetch()` + `useState`/`useEffect` — no
  TanStack Query or other dependency not already in `package.json`).
- Decompose into the four-tier WBS (Foundation & Context → Domain Feature Slices → Interactive &
  Mutation → Resilience & Offline), each task following the 6-step authoring order (scaffold → imports
  → state → lifecycle → handlers → render) with complete, non-placeholder reference code.
- Size the backlog to the real backend surface — a two-endpoint product gets a small backlog, not a
  padded-to-20 one (see `sentinelpos-fe-tasks.md`, 9 tasks, and `routematrix-fe-tasks.md`, 10, versus
  `minierp-fe-tasks.md`'s 20 for a five-capability backend).
- Name what a superseded coarse task is being replaced by, without deleting it — retiring the old task
  in OneDev/Workbench is a separate, deliberate migration step.
- Close with an explicit "what's deliberately not in this backlog" section naming any real backend gap
  that was flagged rather than filled.

## Status: not yet automated, and not going through SpecForge

This process is currently run by hand (a person or a Claude session doing the backend-then-spec work
directly), not through SpecForge's Stage 3/tutorial-drafting pipeline — see
`docs/IPF_DEVGUIDE.md` §5a-8 for why that pipeline was retired for this purpose. If it's ever worth
automating, whatever does it must preserve the sequencing rule above, not just the output shape.
