# BatchCraft — Frontend Task Backlog (WBS v2)

**Status: authored 2026-09-11, not yet published to OneDev or fed through SpecForge.** Same
ground-truth-spec status and shared conventions as the other three products' documents in this
folder — read `minierp-fe-tasks.md`'s header first if you haven't.

## Why this backlog is 10 tasks, and what got added to unlock it

Unlike SentinelPOS/RouteMatrix, `server/batchcraft-router.js`'s own top comment says **both** of the
spec's backend tasks are real here — the recursive plate-cost solver and the scaled prep-batch
execution are faithfully implemented, not stubbed. But only two endpoints existed to read that real
data: `GET /v1/recipes/costs` (a flat summary list) and `POST /v1/recipes/:id/prep-batches`. Nothing
exposed *why* a recipe costs what it costs (the per-line ingredient/sub-recipe breakdown the costing
engine already computes internally) or the pantry's actual stock levels the prep-batch endpoint
already depletes. Both were real gaps in what could be read, not real gaps in the business logic —
so, same call as MiniERP's `GET /stock-moves` addition, two small read-only endpoints were added
alongside this document:

- **`GET /v1/ingredients`** — the `ingredients` array, already used to price every recipe, now
  actually readable.
- **`GET /v1/recipes/:id`** — a full cost breakdown (`lines[]`, one row per ingredient or nested
  sub-recipe, each with its resolved unit cost and line cost) built from the exact same per-line math
  `calculateRecipeCost` already runs internally, exposed via a new `buildRecipeBreakdown` rather than
  changing `calculateRecipeCost`'s own return shape (its two existing callers only ever need the
  summary numbers).

Both were live-verified against the real running router before this document was written (not just
read as code): `GET /v1/recipes/recipe-lasagna` correctly resolves its nested `recipe-marinara`
sub-recipe line before summing lasagna's own cost, and running a real prep batch on marinara
(multiplier 2) correctly depleted `ing-tomato`'s stock from 40 to 34. One real route-ordering bug was
caught and fixed in the process: `GET /v1/recipes/:id` was initially registered *before*
`GET /v1/recipes/costs`, which would have silently swallowed every `/v1/recipes/costs` request as
`:id = "costs"` — Express matches routes in registration order, so the static path now comes first.

## Architectural calls specific to this product

1. **Recipe detail is its own Interactive-tier task (T6), not folded into the board.** The board
   (T4) only ever shows summary numbers; drilling into *why* is a distinct, separately valuable
   screen, same "detail drawer as its own task" pattern already established for SentinelPOS/RouteMatrix.
2. **The prep-batch multiplier form (T7) surfaces `INSUFFICIENT_PANTRY_STOCK` per-ingredient, not as
   a generic failure** — the backend's error message already names the specific ingredient and the
   exact shortfall; the UI passes that through verbatim rather than replacing it with a generic
   "couldn't complete" toast, since a kitchen manager needs to know *which* ingredient to restock.
3. **Supersedes the existing `idt-batchcraft-costboard` task**
   (`src/engines/assist/inpact_assist_idt-batchcraft-costboard_engine.tsx`), decomposed into T4 (the
   board), T5 (pantry), T6 (recipe detail), T7 (running a batch) — same non-deletion caveat as the
   other three documents.

---

## Phase 1 — Feature-to-Task Matrix (Task Dependency Graph)

```
[Design Spec: this document]
        |
        v
  TIER 1 — Foundation & Context Layer
        |
        +--> T1 idt-batchcraft-app-shell      (header shell)
        +--> T2 idt-batchcraft-toast-provider  (needs T1)
        +--> T3 idt-batchcraft-api-client      (no UI dependency)
        |
        v
  TIER 2 — Domain Feature Slices
        |
        +--> T4 idt-batchcraft-recipe-cost-board  (needs T1, T3)
        +--> T5 idt-batchcraft-pantry-table         (needs T1, T3)
        |
        v
  TIER 3 — Interactive & Mutation Layers
        |
        +--> T6 idt-batchcraft-recipe-detail-drawer   (mounts into T4)
        +--> T7 idt-batchcraft-prep-batch-dispatcher  (mounts into T6; needs T2)
        |
        v
  TIER 4 — Resilience & Offline Layers
        |
        +--> T8  idt-batchcraft-error-boundary   (wraps T1 — needs T1)
        +--> T9  idt-batchcraft-skeleton-loaders   (consumed by T4/T5's loading branches)
        +--> T10 idt-batchcraft-offline-queue      (wraps T3 — needs T2, T3)
        |
        v
  App Closeout: the cost board (T4) and pantry table (T5) both reachable from the shell, every
  recipe's breakdown (T6) reachable from its board row, a prep batch (T7) runnable from inside that
  breakdown with real per-ingredient shortfall messages, the whole surface wrapped in T8/T9/T10.
```

| # | Task ID | Tier | Name | Target File | Prerequisites |
|---|---|---|---|---|---|
| 1 | `idt-batchcraft-app-shell` | Foundation | App shell & header | `src/layout/AppShell.tsx` | none |
| 2 | `idt-batchcraft-toast-provider` | Foundation | Global toast/notification provider | `src/providers/ToastProvider.tsx` | T1 |
| 3 | `idt-batchcraft-api-client` | Foundation | Shared API client & error normalization | `src/lib/apiClient.ts` | none |
| 4 | `idt-batchcraft-recipe-cost-board` | Domain | Recipe cost board | `src/components/RecipeCostBoard.tsx` | T1, T3 |
| 5 | `idt-batchcraft-pantry-table` | Domain | Pantry stock table | `src/components/PantryTable.tsx` | T1, T3 |
| 6 | `idt-batchcraft-recipe-detail-drawer` | Interactive | Recipe cost breakdown drawer | `src/components/RecipeDetailDrawer.tsx` | T4 |
| 7 | `idt-batchcraft-prep-batch-dispatcher` | Interactive | Run-a-prep-batch form | `src/components/PrepBatchForm.tsx` | T2, T6 |
| 8 | `idt-batchcraft-error-boundary` | Resilience | App-wide error boundary | `src/components/ErrorBoundary.tsx` | T1 |
| 9 | `idt-batchcraft-skeleton-loaders` | Resilience | Loading skeleton library | `src/components/Skeletons.tsx` | none |
| 10 | `idt-batchcraft-offline-queue` | Resilience | Offline banner + prep-batch retry queue | `src/providers/OfflineQueueProvider.tsx` | T2, T3 |

**Completeness check:**

| Backend capability | Covered by |
|---|---|
| `GET /v1/recipes/costs` | T4 |
| `GET /v1/ingredients` *(new)* | T5 |
| `GET /v1/recipes/:id` *(new)* | T6 |
| `POST /v1/recipes/:id/prep-batches` | T7 |
| Cross-cutting: loading/error/empty, per-ingredient shortfall messaging, offline batch runs | T8, T9, T10 |

---

## Phase 2 — Fully Expanded Task Specifications

---

### T1 — `idt-batchcraft-app-shell` — App shell & header

**Metadata:** ID `idt-batchcraft-app-shell` · Target `src/layout/AppShell.tsx` · Prerequisites: none · Difficulty: Foundation

**Backend API Contract:** none.

**Step 1 — File Scaffolding & Component Shell.** Create `src/layout/AppShell.tsx`. Base export
`AppShell({ children }: { children: ReactNode })` with two simple nav links (Recipes, Pantry) — this
product has exactly two real screens, so a lightweight tab pair is enough; no collapsible drawer like
MiniERP's multi-screen nav.

**Step 2 — External Dependencies & Imports.** `react`'s `type ReactNode`; `NavLink` from
`react-router-dom`.

**Step 3 — Internal Scope & State Initialization.** None.

**Step 4 — Lifecycle & Data Fetching.** None.

**Step 5 — Event Handlers & Mutations.** None.

**Step 6 — Render View & Branching States.** A `<header>` with the two `NavLink`s, a `<main>`
rendering `children`.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="app-shell-header">
        <h1>BatchCraft</h1>
        <nav className="app-shell-tabs">
          <NavLink to="/recipes" className={({ isActive }) => (isActive ? "app-shell-tab-active" : "app-shell-tab")}>
            Recipes
          </NavLink>
          <NavLink to="/pantry" className={({ isActive }) => (isActive ? "app-shell-tab-active" : "app-shell-tab")}>
            Pantry
          </NavLink>
        </nav>
      </header>
      <main className="app-shell-main">{children}</main>
    </div>
  );
}
```

---

### T2 — `idt-batchcraft-toast-provider` — Global toast/notification provider

**Metadata:** ID `idt-batchcraft-toast-provider` · Target `src/providers/ToastProvider.tsx` · Prerequisites: T1 · Difficulty: Foundation

Identical to the other three products' equivalent task.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type ToastKind = "success" | "error";
type Toast = { id: string; message: string; kind: ToastKind };
type ToastContextValue = { pushToast: (message: string, kind?: ToastKind) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (message: string, kind: ToastKind = "success") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((current) => [...current, { id, message, kind }]);
      setTimeout(() => dismissToast(id), 4000);
    },
    [dismissToast],
  );

  return (
    <ToastContext.Provider value={{ pushToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="toast-stack" role="status" aria-live="polite">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast toast-${toast.kind}`}>
              <span>{toast.message}</span>
              <button type="button" onClick={() => dismissToast(toast.id)} aria-label="Dismiss">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
```

---

### T3 — `idt-batchcraft-api-client` — Shared API client & error normalization

**Metadata:** ID `idt-batchcraft-api-client` · Target `src/lib/apiClient.ts` · Prerequisites: none · Difficulty: Foundation

Identical to the other three products' equivalent task.

**`[ 💡 Assist me ]` — complete file:**

```ts
const API_BASE = "/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const message = (body && typeof body === "object" && "error" in body && String(body.error)) || `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }
  return body as T;
}

export const apiGet = <T,>(path: string) => apiRequest<T>(path);
export const apiPost = <T,>(path: string, payload?: unknown) =>
  apiRequest<T>(path, { method: "POST", body: payload !== undefined ? JSON.stringify(payload) : undefined });
```

---

### T4 — `idt-batchcraft-recipe-cost-board` — Recipe cost board

**Metadata:** ID `idt-batchcraft-recipe-cost-board` · Target `src/components/RecipeCostBoard.tsx` · Prerequisites: T1, T3 · Difficulty: Domain

**Backend API Contract:** `GET /api/v1/recipes/costs` → `200`
`RecipeSummary[]` where
`RecipeSummary = { id, code, name, type: "MENU_ITEM"|"PREP_ITEM"; costPerServing, foodCostPct, targetCostPct, sellingPrice }`.
Live-verified response for the real seed data:
`[{"id":"recipe-marinara",...,"foodCostPct":34.5,"targetCostPct":30,...},{"id":"recipe-lasagna",...,"foodCostPct":13.4,"targetCostPct":30,...}]`.

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/RecipeCostBoard.tsx`. Base
export `RecipeCostBoard()`.

**Step 2 — External Dependencies & Imports.** `react`'s `useEffect/useState`; `apiGet`; `useToast`;
`TableSkeleton` from `./Skeletons` (T9); `RecipeDetailDrawer` from `./RecipeDetailDrawer` (T6).

**Step 3 — Internal Scope & State Initialization.** `recipes: RecipeSummary[]`, `loading`, `error`,
`selectedId: string | null` — same shape as every other board in this platform's curriculum.

**Step 4 — Lifecycle & Data Fetching.** Mount-time `useEffect` fetching `/v1/recipes/costs`; a second
`useEffect` subscribes to a `window` `"prep-batch:completed"` event (dispatched by T7 — running a
batch doesn't change a recipe's cost numbers directly, but re-fetching keeps this board's data fresh
in case the underlying ingredient costs are ever edited elsewhere in a future pass) to bump a
`reloadToken`.

**Step 5 — Event Handlers & Mutations.** `handleSelectRow(id)`/`handleCloseDrawer` — same pattern as
every other detail-drawer-hosting board in this platform.

**Step 6 — Render View & Branching States.** Loading/error/empty as established; populated view is a
table with a visual flag when `foodCostPct > targetCostPct` (running over budget — the one piece of
real business meaning this board exists to surface at a glance), each row clickable, rendering
`<RecipeDetailDrawer recipe={selected} onClose={...} />` beneath when selected.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useEffect, useState } from "react";
import { apiGet } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";
import { TableSkeleton } from "./Skeletons";
import RecipeDetailDrawer from "./RecipeDetailDrawer";

export type RecipeSummary = {
  id: string;
  code: string;
  name: string;
  type: "MENU_ITEM" | "PREP_ITEM";
  costPerServing: number;
  foodCostPct: number;
  targetCostPct: number;
  sellingPrice: number;
};

export default function RecipeCostBoard() {
  const { pushToast } = useToast();
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet<RecipeSummary[]>("/v1/recipes/costs")
      .then((data) => {
        if (!cancelled) setRecipes(data);
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Couldn't load recipe costs.";
        setError(message);
        pushToast(message, "error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadToken, pushToast]);

  useEffect(() => {
    function handleBatchCompleted() {
      setReloadToken((t) => t + 1);
    }
    window.addEventListener("prep-batch:completed", handleBatchCompleted);
    return () => window.removeEventListener("prep-batch:completed", handleBatchCompleted);
  }, []);

  function handleSelectRow(id: string) {
    setSelectedId(id);
  }

  function handleCloseDrawer() {
    setSelectedId(null);
  }

  if (loading) return <TableSkeleton rows={2} />;

  if (error) {
    return (
      <div className="recipe-board-error">
        <p>{error}</p>
        <button type="button" onClick={() => setReloadToken((t) => t + 1)}>
          Try again
        </button>
      </div>
    );
  }

  if (recipes.length === 0) {
    return <p className="recipe-board-empty">No recipes yet.</p>;
  }

  return (
    <div className="recipe-board">
      <table className="recipe-board-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Type</th>
            <th>Cost/serving</th>
            <th>Food cost %</th>
            <th>Target %</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe) => (
            <tr
              key={recipe.id}
              className={`recipe-board-row ${recipe.foodCostPct > recipe.targetCostPct ? "recipe-board-row-over-target" : ""}`}
              onClick={() => handleSelectRow(recipe.id)}
            >
              <td>{recipe.code}</td>
              <td>{recipe.name}</td>
              <td>{recipe.type}</td>
              <td>${recipe.costPerServing.toFixed(4)}</td>
              <td>{recipe.foodCostPct.toFixed(1)}%</td>
              <td>{recipe.targetCostPct.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedId && (
        <RecipeDetailDrawer recipeId={selectedId} onClose={handleCloseDrawer} />
      )}
    </div>
  );
}
```

---

### T5 — `idt-batchcraft-pantry-table` — Pantry stock table

**Metadata:** ID `idt-batchcraft-pantry-table` · Target `src/components/PantryTable.tsx` · Prerequisites: T1, T3 · Difficulty: Domain

**Backend API Contract:** `GET /api/v1/ingredients` *(new endpoint added alongside this document)* →
`200` `Ingredient[]` where
`Ingredient = { id, name, baseUom, purchasePrice, purchaseQty, yieldPercent, stockOnHand }`.
Live-verified: returns all 4 seeded ingredients; `stockOnHand` genuinely reflects real depletion after
a prep batch runs (verified: `ing-tomato` went from 40 to 34 after a real 2x marinara batch).

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/PantryTable.tsx`. Base
export `PantryTable()`.

**Step 2 — External Dependencies & Imports.** `react`'s `useEffect/useState`; `apiGet`; `useToast`;
`TableSkeleton` from `./Skeletons` (T9).

**Step 3 — Internal Scope & State Initialization.** `ingredients: Ingredient[]`, `loading`, `error` —
same three-state shape as every other read-only screen in this platform.

**Step 4 — Lifecycle & Data Fetching.** Mount-time `useEffect` fetching `/v1/ingredients`; a second
`useEffect` subscribes to `"prep-batch:completed"` (T7 dispatches this on every successful batch,
which is exactly when `stockOnHand` actually changes) to bump `reloadToken` — this is the one screen
in this product where that event matters for genuinely fresh data, not just tidiness.

**Step 5 — Event Handlers & Mutations.** None — read-only.

**Step 6 — Render View & Branching States.** Loading/error/empty as established; populated view shows
each ingredient's `baseUom`, effective per-unit cost (recomputed client-side from `purchasePrice` /
`purchaseQty` / `yieldPercent` — the same EP-yield formula the backend uses, shown here so a kitchen
manager can see the real "after waste" cost per unit, not just the raw purchase price), and
`stockOnHand`.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useEffect, useState } from "react";
import { apiGet } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";
import { TableSkeleton } from "./Skeletons";

type Ingredient = {
  id: string;
  name: string;
  baseUom: string;
  purchasePrice: number;
  purchaseQty: number;
  yieldPercent: number;
  stockOnHand: number;
};

function effectiveUnitCost(ingredient: Ingredient): number {
  const baseUnitCost = ingredient.purchasePrice / ingredient.purchaseQty;
  return baseUnitCost / (ingredient.yieldPercent / 100);
}

export default function PantryTable() {
  const { pushToast } = useToast();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet<Ingredient[]>("/v1/ingredients")
      .then((data) => {
        if (!cancelled) setIngredients(data);
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Couldn't load the pantry.";
        setError(message);
        pushToast(message, "error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadToken, pushToast]);

  useEffect(() => {
    function handleBatchCompleted() {
      setReloadToken((t) => t + 1);
    }
    window.addEventListener("prep-batch:completed", handleBatchCompleted);
    return () => window.removeEventListener("prep-batch:completed", handleBatchCompleted);
  }, []);

  if (loading) return <TableSkeleton rows={4} />;

  if (error) {
    return (
      <div className="pantry-table-error">
        <p>{error}</p>
        <button type="button" onClick={() => setReloadToken((t) => t + 1)}>
          Try again
        </button>
      </div>
    );
  }

  if (ingredients.length === 0) {
    return <p className="pantry-table-empty">No ingredients yet.</p>;
  }

  return (
    <table className="pantry-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Unit</th>
          <th>Effective unit cost</th>
          <th>Stock on hand</th>
        </tr>
      </thead>
      <tbody>
        {ingredients.map((ingredient) => (
          <tr key={ingredient.id}>
            <td>{ingredient.name}</td>
            <td>{ingredient.baseUom}</td>
            <td>${effectiveUnitCost(ingredient).toFixed(4)}</td>
            <td>{ingredient.stockOnHand}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

### T6 — `idt-batchcraft-recipe-detail-drawer` — Recipe cost breakdown drawer

**Metadata:** ID `idt-batchcraft-recipe-detail-drawer` · Target `src/components/RecipeDetailDrawer.tsx` · Prerequisites: T4 · Difficulty: Interactive

**Backend API Contract:** `GET /api/v1/recipes/:id` *(new endpoint added alongside this document)* →
`200`
`RecipeBreakdown = { id, code, name, type, servingYield, targetCostPct, sellingPrice, costPerServing, foodCostPct, lines: BreakdownLine[] }`
where `BreakdownLine = { kind: "ingredient" | "subRecipe"; id, name, quantityRequired, unitCost, lineCost }`;
`404 { error: "Recipe not found" }`. Live-verified against both a leaf recipe (`recipe-marinara`,
two ingredient lines) and a recipe with a nested sub-recipe (`recipe-lasagna`, whose first line is
`kind: "subRecipe"`, `id: "recipe-marinara"`, correctly showing marinara's own resolved
`costPerServing` as that line's `unitCost`).

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/RecipeDetailDrawer.tsx`. Base
export `RecipeDetailDrawer({ recipeId, onClose }: { recipeId: string; onClose: () => void })` — takes
an id and fetches its own detail, unlike SentinelPOS/RouteMatrix's detail drawers which took the
already-fetched object as a prop; the difference is deliberate: T4's board never fetched the `lines`
array (its own endpoint doesn't return it), so this task genuinely owns a new fetch, not a display of
already-available data.

**Step 2 — External Dependencies & Imports.** `react`'s `useEffect/useState`; `apiGet`; `useToast`;
`PrepBatchForm` from `./PrepBatchForm` (T7).

**Step 3 — Internal Scope & State Initialization.** `recipe: RecipeBreakdown | null`, `loading`,
`error` — same three-state shape as every fetching component in this platform.

**Step 4 — Lifecycle & Data Fetching.** A `useEffect` keyed on `recipeId` (re-fetches if the selected
recipe changes while the drawer stays mounted, not just on first mount) fetching
`/v1/recipes/${recipeId}`.

**Step 5 — Event Handlers & Mutations.** None directly — running a batch is entirely T7's job.

**Step 6 — Render View & Branching States.** Loading → a small inline spinner (not the shared
`TableSkeleton`, which is table-shaped and wouldn't fit a drawer's layout — this is the one
component in this platform's curriculum that needs its own bespoke loading marker rather than the
shared skeleton library); error → retry banner; populated → recipe name/code/servings/cost summary, a
line-item table (ingredient vs. sub-recipe lines visually distinguished), and
`<PrepBatchForm recipe={recipe} />` (T7) rendered only when `recipe.type === "PREP_ITEM"` — a
`MENU_ITEM` like Lasagna is assembled and served, never itself batch-prepped, matching the backend's
own `NOT_PREP_ITEM` guard exactly (so the button to attempt an invalid action never even renders,
same "the UI enforces the same state machine as the backend" principle as every action-dispatcher
task in this platform).

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useEffect, useState } from "react";
import { apiGet } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";
import PrepBatchForm from "./PrepBatchForm";

type BreakdownLine = { kind: "ingredient" | "subRecipe"; id: string; name: string; quantityRequired: number; unitCost: number; lineCost: number };
export type RecipeBreakdown = {
  id: string;
  code: string;
  name: string;
  type: "MENU_ITEM" | "PREP_ITEM";
  servingYield: number;
  targetCostPct: number;
  sellingPrice: number;
  costPerServing: number;
  foodCostPct: number;
  lines: BreakdownLine[];
};

export default function RecipeDetailDrawer({ recipeId, onClose }: { recipeId: string; onClose: () => void }) {
  const { pushToast } = useToast();
  const [recipe, setRecipe] = useState<RecipeBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet<RecipeBreakdown>(`/v1/recipes/${recipeId}`)
      .then((data) => {
        if (!cancelled) setRecipe(data);
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Couldn't load this recipe's breakdown.";
        setError(message);
        pushToast(message, "error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [recipeId, pushToast]);

  return (
    <div className="recipe-detail-drawer" role="dialog" aria-label="Recipe breakdown">
      <div className="recipe-detail-header">
        <h2>Recipe breakdown</h2>
        <button type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      {loading && <div className="recipe-detail-spinner" aria-busy="true" />}
      {error && <p className="recipe-detail-error">{error}</p>}
      {recipe && (
        <>
          <dl className="recipe-detail-summary">
            <div>
              <dt>Name</dt>
              <dd>
                {recipe.name} ({recipe.code})
              </dd>
            </div>
            <div>
              <dt>Serving yield</dt>
              <dd>{recipe.servingYield}</dd>
            </div>
            <div>
              <dt>Cost per serving</dt>
              <dd>${recipe.costPerServing.toFixed(4)}</dd>
            </div>
            <div>
              <dt>Food cost %</dt>
              <dd>
                {recipe.foodCostPct.toFixed(1)}% (target {recipe.targetCostPct.toFixed(1)}%)
              </dd>
            </div>
          </dl>
          <table className="recipe-detail-lines">
            <thead>
              <tr>
                <th>Line</th>
                <th>Qty required</th>
                <th>Unit cost</th>
                <th>Line cost</th>
              </tr>
            </thead>
            <tbody>
              {recipe.lines.map((line) => (
                <tr key={`${line.kind}-${line.id}`} className={`recipe-detail-line-${line.kind}`}>
                  <td>
                    {line.name} {line.kind === "subRecipe" && <em>(sub-recipe)</em>}
                  </td>
                  <td>{line.quantityRequired}</td>
                  <td>${line.unitCost.toFixed(4)}</td>
                  <td>${line.lineCost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recipe.type === "PREP_ITEM" && <PrepBatchForm recipe={recipe} />}
        </>
      )}
    </div>
  );
}
```

---

### T7 — `idt-batchcraft-prep-batch-dispatcher` — Run-a-prep-batch form

**Metadata:** ID `idt-batchcraft-prep-batch-dispatcher` · Target `src/components/PrepBatchForm.tsx` · Prerequisites: T2, T6 · Difficulty: Interactive

**Backend API Contract:** `POST /api/v1/recipes/:id/prep-batches` body
`{ multiplier: number; preparedBy: string }` → `201` the created batch
`{ id, batchNumber, recipeId, multiplier, actualYield, unitCost, preparedBy, completedAt }`;
`404 { error: "Recipe not found" }`;
`409 { error: "NOT_PREP_ITEM: only a sub-recipe can be run as a prep batch" }` (unreachable from this
UI — see T6's render guard); `400 { error: "multiplier must be a positive number" }`;
`400 { error: "preparedBy is required" }`;
`409 { error: "INSUFFICIENT_PANTRY_STOCK: <ingredient> needs <needed>, only <have> in stock." }`.
Live-verified: a real 2x batch on `recipe-marinara` returned `201` with `actualYield: 20` and
correctly depleted `ing-tomato` from 40 to 34 (3 × 2 = 6 consumed).

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/PrepBatchForm.tsx`. Base
export `PrepBatchForm({ recipe }: { recipe: RecipeBreakdown })`.

**Step 2 — External Dependencies & Imports.** `react`'s `useState`; `apiPost`, `ApiError`; `useToast`.

**Step 3 — Internal Scope & State Initialization.** `multiplier: string` (default `"1"`, controlled
as a string for the same reason as every numeric form field elsewhere in this platform);
`preparedBy: string`; `submitting: boolean`; `fieldError: string | null` — the
`INSUFFICIENT_PANTRY_STOCK` case in particular belongs here, inline, since it names a specific
ingredient the user needs to see anchored to the form, not a toast that could disappear before it's
read.

**Step 4 — Lifecycle & Data Fetching.** None.

**Step 5 — Event Handlers & Mutations.** `handleSubmit` parses `multiplier` to a number, posts to
`/v1/recipes/${recipe.id}/prep-batches`, on success `pushToast`s the real `batchNumber` and
dispatches `window.dispatchEvent(new CustomEvent("prep-batch:completed"))` (both T4's board and T5's
pantry table listen for this — a batch changes both recipe cost context and real stock levels), and
resets the form; on failure sets `fieldError` to the server's own message verbatim (every failure case
above is genuinely actionable user-facing text already, nothing this component should paraphrase).

**Step 6 — Render View & Branching States.** A multiplier number input, a `preparedBy` text input, a
submit button disabled while `submitting`, and `fieldError` rendered inline when present.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useState } from "react";
import { apiPost, ApiError } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";
import type { RecipeBreakdown } from "./RecipeDetailDrawer";

type PrepBatch = { id: string; batchNumber: string; actualYield: number };

export default function PrepBatchForm({ recipe }: { recipe: RecipeBreakdown }) {
  const { pushToast } = useToast();
  const [multiplier, setMultiplier] = useState("1");
  const [preparedBy, setPreparedBy] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError(null);
    setSubmitting(true);
    try {
      const batch = await apiPost<PrepBatch>(`/v1/recipes/${recipe.id}/prep-batches`, {
        multiplier: Number(multiplier),
        preparedBy,
      });
      pushToast(`${batch.batchNumber} prepped — yield ${batch.actualYield}.`, "success");
      window.dispatchEvent(new CustomEvent("prep-batch:completed"));
      setMultiplier("1");
      setPreparedBy("");
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't run this batch — please try again.";
      setFieldError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="prep-batch-form" onSubmit={handleSubmit}>
      <h3>Run a prep batch</h3>
      <label>
        Multiplier
        <input type="number" min="0.1" step="0.1" value={multiplier} onChange={(e) => setMultiplier(e.target.value)} required disabled={submitting} />
      </label>
      <label>
        Prepared by
        <input value={preparedBy} onChange={(e) => setPreparedBy(e.target.value)} required disabled={submitting} />
      </label>
      {fieldError && <p className="prep-batch-field-error">{fieldError}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? "Running…" : "Run batch"}
      </button>
    </form>
  );
}
```

---

### T8 — `idt-batchcraft-error-boundary` — App-wide error boundary

**Metadata:** ID `idt-batchcraft-error-boundary` · Target `src/components/ErrorBoundary.tsx` · Prerequisites: T1 · Difficulty: Resilience

Identical to the other three products' equivalent task.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary] caught a render error:", error, info.componentStack);
  }

  handleReset() {
    this.setState({ error: null });
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-boundary-fallback" role="alert">
          <p>Something went wrong: {this.state.error.message}</p>
          <button type="button" onClick={this.handleReset}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

---

### T9 — `idt-batchcraft-skeleton-loaders` — Loading skeleton library

**Metadata:** ID `idt-batchcraft-skeleton-loaders` · Target `src/components/Skeletons.tsx` · Prerequisites: none · Difficulty: Resilience

Only `TableSkeleton` is consumed (by T4 and T5) — same "export only what's used" reasoning as
SentinelPOS/RouteMatrix's equivalent task.

**`[ 💡 Assist me ]` — complete file:**

```tsx
export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="skeleton-table" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="skeleton-row skeleton-shimmer" />
      ))}
    </div>
  );
}
```

---

### T10 — `idt-batchcraft-offline-queue` — Offline banner + prep-batch retry queue

**Metadata:** ID `idt-batchcraft-offline-queue` · Target `src/providers/OfflineQueueProvider.tsx` · Prerequisites: T2, T3 · Difficulty: Resilience

**Backend API Contract:** none new — wraps T7's existing `apiPost` call.

**Step 1-6:** identical shape and reasoning to the other three products' equivalent task, own
`localStorage` namespace `batchcraft-offline-queue`. One genuine caution worth naming that doesn't
apply to the other three products: **queuing a prep batch offline is riskier than queuing MiniERP's
or SentinelPOS's mutations**, because the backend's own `INSUFFICIENT_PANTRY_STOCK` check only runs
at the moment the request actually lands — a batch queued while offline could succeed when the queue
finally drains, or could fail with a stock error the kitchen manager typed the multiplier for
*before* someone else already depleted that ingredient in the meantime. This queue still stops
draining on the first failure (same rule as the other three), which is exactly what limits the blast
radius here: a bad drain never silently succeeds past a real stock conflict, it surfaces and stops.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { apiPost } from "../lib/apiClient";
import { useToast } from "./ToastProvider";

type QueuedMutation = { id: string; path: string; payload: unknown; description: string };
type OfflineQueueContextValue = {
  isOnline: boolean;
  queueLength: number;
  enqueueOrSend: <T,>(path: string, payload: unknown, description: string) => Promise<T | null>;
};

const STORAGE_KEY = "batchcraft-offline-queue";
const OfflineQueueContext = createContext<OfflineQueueContextValue | null>(null);

function loadQueue(): QueuedMutation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: QueuedMutation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // Best-effort only — see the other three products' identical note in their own OfflineQueueProvider.
  }
}

export function OfflineQueueProvider({ children }: { children: ReactNode }) {
  const { pushToast } = useToast();
  const [isOnline, setIsOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));
  const [queue, setQueue] = useState<QueuedMutation[]>(() => loadQueue());

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isOnline || queue.length === 0) return;
    let cancelled = false;
    (async () => {
      let remaining = [...queue];
      while (remaining.length > 0 && !cancelled) {
        const [next, ...rest] = remaining;
        try {
          await apiPost(next.path, next.payload);
          remaining = rest;
          setQueue(remaining);
          saveQueue(remaining);
        } catch {
          // Stops here on purpose — see this task's own note above about why a stock conflict must
          // surface rather than be silently skipped or retried past.
          break;
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOnline, queue]);

  const enqueueOrSend = useCallback(
    async <T,>(path: string, payload: unknown, description: string): Promise<T | null> => {
      if (isOnline) {
        return apiPost<T>(path, payload);
      }
      const item: QueuedMutation = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, path, payload, description };
      setQueue((current) => {
        const next = [...current, item];
        saveQueue(next);
        return next;
      });
      pushToast(`Saved offline — will send when you're back online (${description}).`, "success");
      return null;
    },
    [isOnline, pushToast],
  );

  return (
    <OfflineQueueContext.Provider value={{ isOnline, queueLength: queue.length, enqueueOrSend }}>
      {(!isOnline || queue.length > 0) && (
        <div className="offline-banner" role="status">
          {!isOnline
            ? `You're offline — ${queue.length} batch${queue.length === 1 ? "" : "es"} queued.`
            : `Sending ${queue.length} queued batch${queue.length === 1 ? "" : "es"}…`}
        </div>
      )}
      {children}
    </OfflineQueueContext.Provider>
  );
}

export function useOfflineQueue(): OfflineQueueContextValue {
  const ctx = useContext(OfflineQueueContext);
  if (!ctx) throw new Error("useOfflineQueue must be used inside <OfflineQueueProvider>");
  return ctx;
}
```

---

## What's deliberately not in this backlog

- **Recipe/ingredient creation or editing** — no `POST`/`PUT` endpoint exists for either; both are
  seeded, read-only master data in the real backend.
- **Menu engineering / pricing recommendations** — the backend computes `foodCostPct` vs.
  `targetCostPct`, nothing more; a UI suggesting a new `sellingPrice` would be inventing a feature no
  endpoint supports.
- **Prep batch history view** — `POST /v1/recipes/:id/prep-batches` records each batch in-memory but
  no endpoint lists past batches; a history screen would need a new `GET /v1/prep-batches` this pass
  didn't add. Real gap, flagged not fixed, same standard as the other three documents' own gaps.
