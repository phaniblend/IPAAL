# MiniERP — Frontend Task Backlog (WBS v2)

**Status: authored 2026-09-11, not yet published to OneDev or fed through SpecForge.** This document
is the ground-truth spec; publishing it as real `idt-erp-*` task issues in OneDev (delivery project
id 13) is a separate, deliberate next step — not done automatically by writing this file.

## Architectural calls made while authoring this (read before publishing)

This backlog authors real, buildable tasks against **the system that actually exists**, not the
generic enterprise stack implied by a from-scratch spec template. Three decisions, stated plainly
so they aren't silently discovered later:

1. **Backend contract is Express + in-memory (`server/minierp-router.js`), not Prisma/PostgreSQL +
   Fastify/WebSocket + Redis.** Every request/response shape below is copied from the real, running
   router, not invented. `server/minierp-router.js`'s own top comment already documents this
   adaptation for the backend side; this is the same call made consistently for the frontend spec.
2. **Data fetching is plain `fetch()` + `useState`/`useEffect`, not TanStack Query.** The Task
   Authoring Standard's Step 4 template assumes React Query (query keys, cache invalidation). This
   project has no `@tanstack/react-query` dependency and none of the 5,492 existing lines across
   MiniERP's four already-shipped engine files use it — introducing it here would contradict every
   already-published lesson for the one product meant to be the flagship. The 6-step **ordering
   discipline** (imports before state before effects before handlers before render) is preserved
   exactly; only the Step 4 implementation detail is adapted to match the real, established stack.
3. **This backlog supersedes the four existing coarse-grained tasks**
   (`idt-erp-inventory-table`, `idt-erp-po-form`, `idt-erp-reports-dashboard`, `idt-erp-so-pipeline`
   — `src/engines/assist/inpact_assist_idt-erp-*_engine.tsx`), decomposing the same real feature
   surface into 20 properly atomic, dependency-ordered tasks per the completeness mandate. Those
   four files are **not deleted** by this document — retiring them in OneDev/Workbench is a real
   migration step (existing task issues, any JS already assigned, Assist Me wiring) that needs doing
   deliberately, not as a side effect of authoring a spec. Do not publish this backlog's tasks
   alongside the old four without first retiring the old ones — an applicant would otherwise see two
   different tasks claiming to build the same screen.
4. **One tiny real backend addition was made to unlock task #9**: `GET /api/stock-moves`
   (`server/minierp-router.js`) — the `stockMoves` audit array already existed (written by both
   `/po/:id/receive` and `/so/:id/fulfill`) but nothing could read it. Exposed read-only, newest
   first. Everything else below is spec-only; this one line item is the sole code change bundled
   with this document.
5. **No Customer or Vendor master data exists in the real backend** — `POST /so` takes a raw
   `customerId` string with no lookup, and `POST /po`'s `vendorId` defaults silently to one hardcoded
   `DEFAULT_VENDOR` if omitted. Rather than invent a fictional master-data CRUD surface, every task
   below that touches customer/vendor treats it as a free-text identifier, matching the real contract
   exactly. Flagged here so it reads as a deliberate scope decision, not an oversight.

---

## Phase 1 — Feature-to-Task Matrix (Task Dependency Graph)

```
[Design Spec: this document]
        |
        v
  TIER 1 — Foundation & Context Layer
        |
        +--> T1  idt-erp-app-shell          (root layout + nav — everything else renders inside it)
        +--> T2  idt-erp-toast-provider      (needs T1's shell to mount into)
        +--> T3  idt-erp-api-client          (no UI dependency — pure utility, can build alongside T1/T2)
        +--> T4  idt-erp-accounts-context    (needs T3's client; feeds T6, T10, T11, T17)
        |
        v
  TIER 2 — Domain Feature Slices  (each needs T1 shell + T2 toasts + T3 client; T4 where noted)
        |
        +--> T5  idt-erp-items-table         (needs T3)
        +--> T6  idt-erp-ledger-viewer       (needs T3, T4)
        +--> T7  idt-erp-po-board            (needs T3, T5's item lookup)
        +--> T8  idt-erp-so-board            (needs T3, T5's item lookup)
        +--> T9  idt-erp-stock-ledger        (needs T3, T5's item lookup)
        +--> T10 idt-erp-trial-balance       (needs T3, T4)
        +--> T11 idt-erp-income-statement    (needs T3, T4)
        |
        v
  TIER 3 — Interactive & Mutation Layers  (each needs its Tier 2 host screen + T2 toasts)
        |
        +--> T12 idt-erp-item-create-drawer      (mounts into T5)
        +--> T13 idt-erp-po-create-drawer        (mounts into T7; needs T5 for item picker)
        +--> T14 idt-erp-po-action-dispatcher    (mounts into T7)
        +--> T15 idt-erp-so-create-drawer        (mounts into T8; needs T5 for item picker)
        +--> T16 idt-erp-so-action-dispatcher    (mounts into T8)
        +--> T17 idt-erp-gl-entry-form           (mounts into T6; needs T4)
        |
        v
  TIER 4 — Resilience & Offline Layers  (wrap/harden everything above)
        |
        +--> T18 idt-erp-error-boundary      (wraps T1's route outlet — needs T1)
        +--> T19 idt-erp-skeleton-loaders    (consumed by every Tier 2 screen's loading branch)
        +--> T20 idt-erp-offline-queue       (wraps T3's client — needs T2, T3)
        |
        v
  App Closeout: every screen in T5-T11 reachable from T1's nav, every mutation in T12-T17 wired to
  its host screen and to T2's toasts, every screen using T19's skeletons and T18's boundary,
  T20 queuing writes made while offline and flushing them on reconnect.
```

| # | Task ID | Tier | Name | Target File | Prerequisites |
|---|---|---|---|---|---|
| 1 | `idt-erp-app-shell` | Foundation | App shell, layout & navigation drawer | `src/layout/AppShell.tsx` | none |
| 2 | `idt-erp-toast-provider` | Foundation | Global toast/notification provider | `src/providers/ToastProvider.tsx` | T1 |
| 3 | `idt-erp-api-client` | Foundation | Shared API client & error normalization | `src/lib/apiClient.ts` | none |
| 4 | `idt-erp-accounts-context` | Foundation | Chart of Accounts context provider | `src/providers/AccountsProvider.tsx` | T3 |
| 5 | `idt-erp-items-table` | Domain | Items master table | `src/components/ItemsTable.tsx` | T1, T3 |
| 6 | `idt-erp-ledger-viewer` | Domain | General ledger entries viewer | `src/components/LedgerViewer.tsx` | T1, T3, T4 |
| 7 | `idt-erp-po-board` | Domain | Purchase order board | `src/components/PurchaseOrderBoard.tsx` | T1, T3, T5 |
| 8 | `idt-erp-so-board` | Domain | Sales order board | `src/components/SalesOrderBoard.tsx` | T1, T3, T5 |
| 9 | `idt-erp-stock-ledger` | Domain | Stock movement ledger | `src/components/StockLedger.tsx` | T1, T3, T5 |
| 10 | `idt-erp-trial-balance` | Domain | Trial balance report | `src/components/TrialBalanceReport.tsx` | T1, T3, T4 |
| 11 | `idt-erp-income-statement` | Domain | Income statement report | `src/components/IncomeStatementReport.tsx` | T1, T3, T4 |
| 12 | `idt-erp-item-create-drawer` | Interactive | Create-item drawer | `src/components/CreateItemDrawer.tsx` | T2, T5 |
| 13 | `idt-erp-po-create-drawer` | Interactive | Create-purchase-order drawer | `src/components/CreatePurchaseOrderDrawer.tsx` | T2, T5, T7 |
| 14 | `idt-erp-po-action-dispatcher` | Interactive | PO status action buttons + confirm dialogs | `src/components/PurchaseOrderActions.tsx` | T2, T7 |
| 15 | `idt-erp-so-create-drawer` | Interactive | Create-sales-order drawer | `src/components/CreateSalesOrderDrawer.tsx` | T2, T5, T8 |
| 16 | `idt-erp-so-action-dispatcher` | Interactive | SO status action buttons + confirm dialogs | `src/components/SalesOrderActions.tsx` | T2, T8 |
| 17 | `idt-erp-gl-entry-form` | Interactive | Manual journal entry form | `src/components/ManualJournalEntryForm.tsx` | T2, T4, T6 |
| 18 | `idt-erp-error-boundary` | Resilience | App-wide error boundary | `src/components/ErrorBoundary.tsx` | T1 |
| 19 | `idt-erp-skeleton-loaders` | Resilience | Loading skeleton library | `src/components/Skeletons.tsx` | none |
| 20 | `idt-erp-offline-queue` | Resilience | Offline banner + mutation retry queue | `src/providers/OfflineQueueProvider.tsx` | T2, T3 |

**Completeness check** — every real capability in `server/minierp-router.js` maps to at least one
task, and every task maps to a real endpoint (no fictional surface):

| Backend capability | Covered by |
|---|---|
| `GET/POST /accounts`, `/gl/entries` | T4, T6, T10, T11, T17 |
| `GET/POST /items` | T5, T12 |
| `GET/POST /po`, `/po/:id/approve\|cancel\|receive` | T7, T13, T14 |
| `GET/POST /so`, `/so/:id/fulfill\|mark-paid\|cancel` | T8, T15, T16 |
| `GET /stock-moves` *(new, this pass)* | T9 |
| `GET /reports/trial-balance`, `/income-statement` | T10, T11 |
| Cross-cutting: loading/error/empty states, offline writes | T18, T19, T20 |

---

## Phase 2 — Fully Expanded Task Specifications

Every task's final `[ 💡 Assist me ]` code block is the complete file — copy it in at Step 1 as the
starting shell, then Steps 2-6 below explain what each successive edit adds, in the order it must be
added (never referencing a hook, handler, or JSX branch before the step that introduces it).

---

### T1 — `idt-erp-app-shell` — App shell, layout & navigation drawer

**Metadata:** ID `idt-erp-app-shell` · Target `src/layout/AppShell.tsx` · Prerequisites: none · Difficulty: Foundation

**Backend API Contract:** none — pure layout, no data.

**Step 1 — File Scaffolding & Component Shell.** Create `src/layout/AppShell.tsx`. Base export is a
function component taking `children: React.ReactNode` and rendering them, nothing else yet.

**Step 2 — External Dependencies & Imports.** `react` (`ReactNode` type only — no hooks needed for a
static shell) and `react-router-dom`'s `NavLink`/`Outlet` if this repo uses react-router; MiniERP's
own router setup is out of scope for this task (assumed already present at `src/main.tsx` — this
component is mounted *inside* that router, it doesn't create one).

**Step 3 — Internal Scope & State Initialization.** One piece of local UI state: `const [navOpen,
setNavOpen] = useState(true)` — whether the nav drawer is expanded (collapsible on narrow viewports).

**Step 4 — Lifecycle & Data Fetching.** None — this component fetches nothing.

**Step 5 — Event Handlers & Mutations.** One handler: `toggleNav` flips `navOpen`.

**Step 6 — Render View & Branching States.** A `<div>` with a fixed-width `<nav>` (width depends on
`navOpen`) containing one `NavLink` per screen (Items, Purchase Orders, Sales Orders, Stock Ledger,
Ledger, Trial Balance, Income Statement) and a `<main>` rendering `children`. No loading/error
branches — nothing here is async.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { type ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/items", label: "Items" },
  { to: "/purchase-orders", label: "Purchase Orders" },
  { to: "/sales-orders", label: "Sales Orders" },
  { to: "/stock-ledger", label: "Stock Ledger" },
  { to: "/ledger", label: "General Ledger" },
  { to: "/reports/trial-balance", label: "Trial Balance" },
  { to: "/reports/income-statement", label: "Income Statement" },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(true);

  function toggleNav() {
    setNavOpen((open) => !open);
  }

  return (
    <div className="app-shell">
      <nav className={`app-shell-nav ${navOpen ? "app-shell-nav-open" : "app-shell-nav-collapsed"}`}>
        <button type="button" className="app-shell-nav-toggle" onClick={toggleNav} aria-label="Toggle navigation">
          {navOpen ? "«" : "»"}
        </button>
        {navOpen && (
          <ul className="app-shell-nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={({ isActive }) => (isActive ? "app-shell-nav-link-active" : "app-shell-nav-link")}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </nav>
      <main className="app-shell-main">{children}</main>
    </div>
  );
}
```

---

### T2 — `idt-erp-toast-provider` — Global toast/notification provider

**Metadata:** ID `idt-erp-toast-provider` · Target `src/providers/ToastProvider.tsx` · Prerequisites: T1 · Difficulty: Foundation

**Backend API Contract:** none — client-only UI state.

**Step 1 — File Scaffolding & Component Shell.** Create `src/providers/ToastProvider.tsx`. Base
export is `ToastProvider({ children })`, plus a `useToast()` hook consumers will call — both exported
from this one file since a provider and its matching hook are one indivisible unit.

**Step 2 — External Dependencies & Imports.** `react`'s `createContext`, `useContext`, `useState`,
`useCallback`, `type ReactNode`.

**Step 3 — Internal Scope & State Initialization.** `const [toasts, setToasts] = useState<Toast[]>([])`
where `Toast = { id: string; message: string; kind: "success" | "error" }`.

**Step 4 — Lifecycle & Data Fetching.** None directly, but each toast schedules its own removal: a
`setTimeout` fired from inside the `pushToast` handler (Step 5), not a component-level `useEffect`,
since it's per-toast, not per-mount.

**Step 5 — Event Handlers & Mutations.** `pushToast(message, kind)` appends a toast with a generated
id and schedules its own removal after 4s; `dismissToast(id)` removes one immediately (manual close).

**Step 6 — Render View & Branching States.** Renders `children`, plus a fixed-position toast stack
rendered only `toasts.length > 0` — each toast is a `<div>` with a dismiss button.

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

### T3 — `idt-erp-api-client` — Shared API client & error normalization

**Metadata:** ID `idt-erp-api-client` · Target `src/lib/apiClient.ts` · Prerequisites: none · Difficulty: Foundation

**Backend API Contract:** wraps every MiniERP endpoint's common shape: every error response from
`server/minierp-router.js` is `{ error: string }` with a 400/404/409 status; every success response
is the bare resource JSON with a 200 or 201 status. This client normalizes both into one shape so no
component below has to repeat `if (!res.ok) throw ...` by hand.

**Step 1 — File Scaffolding & Component Shell.** Create `src/lib/apiClient.ts` (no `.tsx` — no JSX
here). Base export is a single async function `apiRequest<T>(path, options?)`.

**Step 2 — External Dependencies & Imports.** None external — this file only uses the global `fetch`.

**Step 3 — Internal Scope & State Initialization.** N/A — a plain utility module has no component
state; the one module-level constant is `const API_BASE = "/api"`.

**Step 4 — Lifecycle & Data Fetching.** N/A at the module level — this *is* the fetching primitive
every other task's `useEffect` (their own Step 4) will call.

**Step 5 — Event Handlers & Mutations.** N/A — this file exposes the primitive; handlers live in the
components that call it.

**Step 6 — Render View & Branching States.** N/A — no UI in this file.

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

/** Every MiniERP endpoint returns either the bare resource (200/201) or `{ error: string }`
 * (400/404/409) — normalized here once so every caller can just `await apiRequest(...)` and
 * `catch (err) { if (err instanceof ApiError) ... }` instead of re-checking `res.ok` everywhere. */
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

### T4 — `idt-erp-accounts-context` — Chart of Accounts context provider

**Metadata:** ID `idt-erp-accounts-context` · Target `src/providers/AccountsProvider.tsx` · Prerequisites: T3 · Difficulty: Foundation

**Backend API Contract:** `GET /api/accounts` → `200` `Account[]` where
`Account = { id: string; code: string; name: string; type: "ASSET"|"LIABILITY"|"REVENUE"|"EXPENSE" }`.
No error shape documented for this endpoint in the real router (it never fails) — the client still
handles a network-level rejection generically (Step 4).

**Step 1 — File Scaffolding & Component Shell.** Create `src/providers/AccountsProvider.tsx`. Base
export: `AccountsProvider({ children })` + `useAccounts()` hook, same one-file pairing as T2.

**Step 2 — External Dependencies & Imports.** `react`'s `createContext/useContext/useState/useEffect`,
`type ReactNode`; `apiGet` from `../lib/apiClient` (T3).

**Step 3 — Internal Scope & State Initialization.** `const [accounts, setAccounts] = useState<Account[]>([])`
and `const [loading, setLoading] = useState(true)` — accounts are fetched once and cached for every
consumer (T6, T10, T11, T17 all need the same list; fetching it four times would be wasteful and
could show four different loading spinners for identical data).

**Step 4 — Lifecycle & Data Fetching.** One `useEffect` with an empty dependency array — fetch once on
mount, set `accounts` and flip `loading` false in a `finally`.

**Step 5 — Event Handlers & Mutations.** None — this provider is read-only; nothing ever creates or
edits an Account through the UI (matches the real backend: there's no `POST /accounts` at all).

**Step 6 — Render View & Branching States.** Renders `children` unconditionally — consumers decide
their own loading UI from the `loading` flag this hook exposes, since "accounts still loading" means
something different on a report page (show a skeleton) than on a dropdown (show it disabled).

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { apiGet } from "../lib/apiClient";

export type Account = { id: string; code: string; name: string; type: "ASSET" | "LIABILITY" | "REVENUE" | "EXPENSE" };
type AccountsContextValue = { accounts: Account[]; loading: boolean };

const AccountsContext = createContext<AccountsContextValue | null>(null);

export function AccountsProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    apiGet<Account[]>("/accounts")
      .then((data) => {
        if (!cancelled) setAccounts(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <AccountsContext.Provider value={{ accounts, loading }}>{children}</AccountsContext.Provider>;
}

export function useAccounts(): AccountsContextValue {
  const ctx = useContext(AccountsContext);
  if (!ctx) throw new Error("useAccounts must be used inside <AccountsProvider>");
  return ctx;
}
```

---

### T5 — `idt-erp-items-table` — Items master table

**Metadata:** ID `idt-erp-items-table` · Target `src/components/ItemsTable.tsx` · Prerequisites: T1, T3 · Difficulty: Domain

**Backend API Contract:** `GET /api/items` → `200`
`Item[]` where `Item = { id, sku, name, sellingPrice, costPrice, stockOnHand, reorderPoint, reorderQuantity }`.
No path/query params. No documented error response (never fails in the real router beyond a network error).

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/ItemsTable.tsx`. Base export
`ItemsTable()`, no props yet (T12's create-drawer mounts *alongside* this component, not as a prop
into it — kept decoupled so this task doesn't have to anticipate T12's shape).

**Step 2 — External Dependencies & Imports.** `react`'s `useEffect/useState`; `apiGet` from
`../lib/apiClient`; `useToast` from `../providers/ToastProvider` (to report a fetch failure).

**Step 3 — Internal Scope & State Initialization.** `items: Item[]` (default `[]`), `loading: boolean`
(default `true`), `error: string | null` (default `null`).

**Step 4 — Lifecycle & Data Fetching.** One mount-time `useEffect`, empty dependency array: fetch
`/items`, set `items` on success, set `error` + call `pushToast(message, "error")` on failure, always
flip `loading` false in `finally`.

**Step 5 — Event Handlers & Mutations.** None in this task — read-only table. (Item creation is T12's
job, wired in separately.)

**Step 6 — Render View & Branching States.** `loading` → skeleton rows; `error` → retry banner with a
"Try again" button that re-runs the fetch; empty (`items.length === 0`) → "No items yet" placeholder;
populated → a `<table>` with one row per item, a low-stock badge when `stockOnHand <= reorderPoint`.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useEffect, useState } from "react";
import { apiGet } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";

type Item = {
  id: string;
  sku: string;
  name: string;
  sellingPrice: number;
  costPrice: number;
  stockOnHand: number;
  reorderPoint: number;
  reorderQuantity: number;
};

export default function ItemsTable() {
  const { pushToast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet<Item[]>("/items")
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Couldn't load items.";
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

  if (loading) {
    return (
      <div className="items-table-loading" aria-busy="true">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="items-table-skeleton-row" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="items-table-error">
        <p>{error}</p>
        <button type="button" onClick={() => setReloadToken((t) => t + 1)}>
          Try again
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="items-table-empty">No items yet — create one to get started.</p>;
  }

  return (
    <table className="items-table">
      <thead>
        <tr>
          <th>SKU</th>
          <th>Name</th>
          <th>Selling price</th>
          <th>Cost price</th>
          <th>Stock on hand</th>
          <th>Reorder point</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} className={item.stockOnHand <= item.reorderPoint ? "items-table-row-low-stock" : ""}>
            <td>{item.sku}</td>
            <td>{item.name}</td>
            <td>${item.sellingPrice.toFixed(2)}</td>
            <td>${item.costPrice.toFixed(2)}</td>
            <td>
              {item.stockOnHand}
              {item.stockOnHand <= item.reorderPoint && <span className="items-table-low-badge"> low</span>}
            </td>
            <td>{item.reorderPoint}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

### T6 — `idt-erp-ledger-viewer` — General ledger entries viewer

**Metadata:** ID `idt-erp-ledger-viewer` · Target `src/components/LedgerViewer.tsx` · Prerequisites: T1, T3, T4 · Difficulty: Domain

**Backend API Contract:** no dedicated `GET /gl/entries` endpoint exists in the real router — journal
entries are only ever readable indirectly, through `GET /reports/trial-balance`'s per-account
`debit`/`credit` totals. This task is scoped honestly to what the backend can actually answer: a
**per-account ledger summary**, not a raw entry-by-entry feed (that would require a real
`GET /gl/entries` endpoint this pass doesn't add — flagged as a fast-follow, not silently assumed).
`GET /api/reports/trial-balance` → `200`
`{ accounts: { accountId, code, name, debit: string, credit: string }[]; totalDebit: string; totalCredit: string; balanced: boolean }`.

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/LedgerViewer.tsx`. Base
export `LedgerViewer()`.

**Step 2 — External Dependencies & Imports.** `react`'s `useEffect/useState`; `apiGet`; `useToast`;
`useAccounts` from T4 (used for the empty-state copy — "no postings yet against N known accounts").

**Step 3 — Internal Scope & State Initialization.** `rows` (the trial-balance response's `accounts`
array), `loading`, `error` — same three-state shape as T5 for consistency across the app.

**Step 4 — Lifecycle & Data Fetching.** Mount-time `useEffect` fetching `/reports/trial-balance`,
same success/error/finally pattern as T5.

**Step 5 — Event Handlers & Mutations.** None — read-only.

**Step 6 — Render View & Branching States.** Loading/error/empty branches identical in spirit to T5;
populated view is a table of every account with a nonzero debit or credit, each row's net shown as
debit-minus-credit so a reader can see the balance at a glance.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useEffect, useState } from "react";
import { apiGet } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";
import { useAccounts } from "../providers/AccountsProvider";

type TrialBalanceRow = { accountId: string; code: string; name: string; debit: string; credit: string };
type TrialBalanceResponse = { accounts: TrialBalanceRow[]; totalDebit: string; totalCredit: string; balanced: boolean };

export default function LedgerViewer() {
  const { pushToast } = useToast();
  const { accounts } = useAccounts();
  const [rows, setRows] = useState<TrialBalanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet<TrialBalanceResponse>("/reports/trial-balance")
      .then((data) => {
        if (!cancelled) setRows(data.accounts.filter((r) => Number(r.debit) > 0 || Number(r.credit) > 0));
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Couldn't load the ledger.";
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

  if (loading) return <div className="ledger-viewer-loading" aria-busy="true" />;

  if (error) {
    return (
      <div className="ledger-viewer-error">
        <p>{error}</p>
        <button type="button" onClick={() => setReloadToken((t) => t + 1)}>
          Try again
        </button>
      </div>
    );
  }

  if (rows.length === 0) {
    return <p className="ledger-viewer-empty">No postings yet against any of the {accounts.length} known accounts.</p>;
  }

  return (
    <table className="ledger-viewer-table">
      <thead>
        <tr>
          <th>Code</th>
          <th>Account</th>
          <th>Debit</th>
          <th>Credit</th>
          <th>Net</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.accountId}>
            <td>{row.code}</td>
            <td>{row.name}</td>
            <td>${row.debit}</td>
            <td>${row.credit}</td>
            <td>${(Number(row.debit) - Number(row.credit)).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

### T7 — `idt-erp-po-board` — Purchase order board

**Metadata:** ID `idt-erp-po-board` · Target `src/components/PurchaseOrderBoard.tsx` · Prerequisites: T1, T3, T5 · Difficulty: Domain

**Backend API Contract:** `GET /api/po` → `200`
`PurchaseOrder[]` where
`PurchaseOrder = { id, poNumber, vendorId, totalAmount, status: "DRAFT"|"APPROVED"|"RECEIVED"|"CANCELLED", items: { itemId, quantity, unitPrice }[] }`.

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/PurchaseOrderBoard.tsx`.
Base export `PurchaseOrderBoard()`.

**Step 2 — External Dependencies & Imports.** `react`'s `useEffect/useState`; `apiGet`; `useToast`.

**Step 3 — Internal Scope & State Initialization.** `orders: PurchaseOrder[]`, `loading`, `error` —
same shape as T5/T6. A `refresh` counter (`reloadToken`) is included from the start (unlike T5/T6,
whose only trigger is a manual retry button) because T14's action dispatcher needs a way to make this
board re-fetch after an approve/cancel/receive call succeeds elsewhere in the tree — exposed via a
tiny custom event rather than prop-drilling a callback through two unrelated components (T7 and T14
are siblings mounted by the same parent route, not parent/child).

**Step 4 — Lifecycle & Data Fetching.** Mount-time `useEffect` fetching `/po`; a second `useEffect`
subscribes to a `window` `"po:changed"` `CustomEvent` (dispatched by T14 after a successful mutation)
and bumps `reloadToken`, cleaning up the listener on unmount.

**Step 5 — Event Handlers & Mutations.** None owned directly by this board — T14 owns the actual
mutations; this component only reacts to their completion.

**Step 6 — Render View & Branching States.** Loading/error/empty as before; populated view groups
orders into four columns by status (DRAFT / APPROVED / RECEIVED / CANCELLED) — a real "board", not
just a flat table, matching the task's own name. Each card renders `<PurchaseOrderActions po={po} />`
(T14) so the two tasks compose without either needing to know the other's internals beyond that one
prop.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useEffect, useState } from "react";
import { apiGet } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";
import PurchaseOrderActions from "./PurchaseOrderActions";

type PurchaseOrder = {
  id: string;
  poNumber: string;
  vendorId: string;
  totalAmount: number;
  status: "DRAFT" | "APPROVED" | "RECEIVED" | "CANCELLED";
  items: { itemId: string; quantity: number; unitPrice: number }[];
};

const STATUSES: PurchaseOrder["status"][] = ["DRAFT", "APPROVED", "RECEIVED", "CANCELLED"];

export default function PurchaseOrderBoard() {
  const { pushToast } = useToast();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet<PurchaseOrder[]>("/po")
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Couldn't load purchase orders.";
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
    function handlePoChanged() {
      setReloadToken((t) => t + 1);
    }
    window.addEventListener("po:changed", handlePoChanged);
    return () => window.removeEventListener("po:changed", handlePoChanged);
  }, []);

  if (loading) return <div className="po-board-loading" aria-busy="true" />;

  if (error) {
    return (
      <div className="po-board-error">
        <p>{error}</p>
        <button type="button" onClick={() => setReloadToken((t) => t + 1)}>
          Try again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return <p className="po-board-empty">No purchase orders yet — create one to get started.</p>;
  }

  return (
    <div className="po-board">
      {STATUSES.map((status) => (
        <div key={status} className="po-board-column">
          <h3>{status}</h3>
          {orders
            .filter((po) => po.status === status)
            .map((po) => (
              <div key={po.id} className="po-board-card">
                <p className="po-board-card-number">{po.poNumber}</p>
                <p className="po-board-card-total">${po.totalAmount.toFixed(2)}</p>
                <PurchaseOrderActions po={po} />
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
```

---

### T8 — `idt-erp-so-board` — Sales order board

**Metadata:** ID `idt-erp-so-board` · Target `src/components/SalesOrderBoard.tsx` · Prerequisites: T1, T3, T5 · Difficulty: Domain

**Backend API Contract:** `GET /api/so` → `200`
`SalesOrder[]` where
`SalesOrder = { id, soNumber, customerId, totalAmount, status: "CONFIRMED"|"SHIPPED"|"PAID"|"CANCELLED", items: { itemId, quantity, unitPrice }[] }`.

**Step 1-6:** identical shape and reasoning to T7 (same board pattern, same `"so:changed"` event
convention so T16's action dispatcher can trigger a refresh the same way T14 does), applied to the
Sales Order lifecycle's four real statuses. Spelled out in full below rather than "see T7" — the
completeness mandate applies to reading this document as much as to the product itself.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useEffect, useState } from "react";
import { apiGet } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";
import SalesOrderActions from "./SalesOrderActions";

type SalesOrder = {
  id: string;
  soNumber: string;
  customerId: string;
  totalAmount: number;
  status: "CONFIRMED" | "SHIPPED" | "PAID" | "CANCELLED";
  items: { itemId: string; quantity: number; unitPrice: number }[];
};

const STATUSES: SalesOrder["status"][] = ["CONFIRMED", "SHIPPED", "PAID", "CANCELLED"];

export default function SalesOrderBoard() {
  const { pushToast } = useToast();
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet<SalesOrder[]>("/so")
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Couldn't load sales orders.";
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
    function handleSoChanged() {
      setReloadToken((t) => t + 1);
    }
    window.addEventListener("so:changed", handleSoChanged);
    return () => window.removeEventListener("so:changed", handleSoChanged);
  }, []);

  if (loading) return <div className="so-board-loading" aria-busy="true" />;

  if (error) {
    return (
      <div className="so-board-error">
        <p>{error}</p>
        <button type="button" onClick={() => setReloadToken((t) => t + 1)}>
          Try again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return <p className="so-board-empty">No sales orders yet — create one to get started.</p>;
  }

  return (
    <div className="so-board">
      {STATUSES.map((status) => (
        <div key={status} className="so-board-column">
          <h3>{status}</h3>
          {orders
            .filter((so) => so.status === status)
            .map((so) => (
              <div key={so.id} className="so-board-card">
                <p className="so-board-card-number">{so.soNumber}</p>
                <p className="so-board-card-customer">{so.customerId}</p>
                <p className="so-board-card-total">${so.totalAmount.toFixed(2)}</p>
                <SalesOrderActions so={so} />
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
```

---

### T9 — `idt-erp-stock-ledger` — Stock movement ledger

**Metadata:** ID `idt-erp-stock-ledger` · Target `src/components/StockLedger.tsx` · Prerequisites: T1, T3, T5 · Difficulty: Domain

**Backend API Contract:** `GET /api/stock-moves` *(new endpoint added alongside this document — see
architectural call #4 above)* → `200`
`StockMove[]`, newest first, where
`StockMove = { id, itemId, change: number, unitCost: number, reference: string, at: string }` —
`change` is positive for a PO receipt, negative for an SO fulfillment; `reference` is the PO/SO number
that caused the move.

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/StockLedger.tsx`. Base export
`StockLedger()`.

**Step 2 — External Dependencies & Imports.** `react`'s `useEffect/useState`; `apiGet`; `useToast`.

**Step 3 — Internal Scope & State Initialization.** `moves: StockMove[]`, `loading`, `error` — same
three-state shape as every other read-only screen in this backlog.

**Step 4 — Lifecycle & Data Fetching.** Mount-time `useEffect` fetching `/stock-moves`; no
`"...:changed"` event subscription like T7/T8 — this is a pure audit log nobody directly mutates
through this screen, so a manual "Refresh" button (Step 5/6) is enough; it isn't hiding a missed
real-time update the way a board showing live status would be.

**Step 5 — Event Handlers & Mutations.** One handler: `handleRefresh` bumps `reloadToken`.

**Step 6 — Render View & Branching States.** Loading/error/empty as before; populated view is a table
sorted newest-first (already sorted server-side), each row showing the item id, the signed quantity
change (`+12` / `-4`), unit cost, and the originating PO/SO reference as a plain string (no deep link
— that would need item/PO/SO id cross-referencing this task doesn't own).

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useEffect, useState } from "react";
import { apiGet } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";

type StockMove = { id: string; itemId: string; change: number; unitCost: number; reference: string; at: string };

export default function StockLedger() {
  const { pushToast } = useToast();
  const [moves, setMoves] = useState<StockMove[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet<StockMove[]>("/stock-moves")
      .then((data) => {
        if (!cancelled) setMoves(data);
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Couldn't load the stock ledger.";
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

  function handleRefresh() {
    setReloadToken((t) => t + 1);
  }

  if (loading) return <div className="stock-ledger-loading" aria-busy="true" />;

  if (error) {
    return (
      <div className="stock-ledger-error">
        <p>{error}</p>
        <button type="button" onClick={handleRefresh}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="stock-ledger">
      <button type="button" onClick={handleRefresh} className="stock-ledger-refresh">
        Refresh
      </button>
      {moves.length === 0 ? (
        <p className="stock-ledger-empty">No stock movements yet.</p>
      ) : (
        <table className="stock-ledger-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Change</th>
              <th>Unit cost</th>
              <th>Reference</th>
              <th>At</th>
            </tr>
          </thead>
          <tbody>
            {moves.map((move) => (
              <tr key={move.id}>
                <td>{move.itemId}</td>
                <td className={move.change >= 0 ? "stock-ledger-positive" : "stock-ledger-negative"}>
                  {move.change >= 0 ? `+${move.change}` : move.change}
                </td>
                <td>${move.unitCost.toFixed(2)}</td>
                <td>{move.reference}</td>
                <td>{new Date(move.at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

---

### T10 — `idt-erp-trial-balance` — Trial balance report

**Metadata:** ID `idt-erp-trial-balance` · Target `src/components/TrialBalanceReport.tsx` · Prerequisites: T1, T3, T4 · Difficulty: Domain

**Backend API Contract:** `GET /api/reports/trial-balance` → `200`
`{ accounts: { accountId, code, name, debit: string, credit: string }[]; totalDebit: string; totalCredit: string; balanced: boolean }`.

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/TrialBalanceReport.tsx`. Base
export `TrialBalanceReport()`.

**Step 2 — External Dependencies & Imports.** `react`'s `useEffect/useState`; `apiGet`; `useToast`.

**Step 3 — Internal Scope & State Initialization.** `report: TrialBalanceResponse | null` (default
`null`, not an empty object — this report either fully loaded or it didn't, there's no meaningful
partial state), `loading`, `error`.

**Step 4 — Lifecycle & Data Fetching.** Mount-time `useEffect` fetching `/reports/trial-balance`.

**Step 5 — Event Handlers & Mutations.** `handleRefresh` bumps `reloadToken` — a report a user is
actively reconciling against benefits from an explicit manual refresh, same reasoning as T9.

**Step 6 — Render View & Branching States.** Loading/error as before (no separate "empty" branch —
every account always appears, even at $0, since a trial balance's whole point is showing the full
chart, not just active lines); populated view is every account with its debit/credit, a totals row,
and a `balanced` badge — red "OUT OF BALANCE" if `balanced` is `false`, which per the backend's own
`assertParity` invariant should never actually happen, but the UI still renders it honestly rather
than assuming the invariant can never be violated by a future backend change.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useEffect, useState } from "react";
import { apiGet } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";

type TrialBalanceRow = { accountId: string; code: string; name: string; debit: string; credit: string };
type TrialBalanceResponse = { accounts: TrialBalanceRow[]; totalDebit: string; totalCredit: string; balanced: boolean };

export default function TrialBalanceReport() {
  const { pushToast } = useToast();
  const [report, setReport] = useState<TrialBalanceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet<TrialBalanceResponse>("/reports/trial-balance")
      .then((data) => {
        if (!cancelled) setReport(data);
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Couldn't load the trial balance.";
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

  function handleRefresh() {
    setReloadToken((t) => t + 1);
  }

  if (loading) return <div className="trial-balance-loading" aria-busy="true" />;

  if (error || !report) {
    return (
      <div className="trial-balance-error">
        <p>{error || "Something went wrong loading the trial balance."}</p>
        <button type="button" onClick={handleRefresh}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="trial-balance">
      <button type="button" onClick={handleRefresh} className="trial-balance-refresh">
        Refresh
      </button>
      <table className="trial-balance-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Account</th>
            <th>Debit</th>
            <th>Credit</th>
          </tr>
        </thead>
        <tbody>
          {report.accounts.map((row) => (
            <tr key={row.accountId}>
              <td>{row.code}</td>
              <td>{row.name}</td>
              <td>${row.debit}</td>
              <td>${row.credit}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2}>Totals</td>
            <td>${report.totalDebit}</td>
            <td>${report.totalCredit}</td>
          </tr>
        </tfoot>
      </table>
      <p className={report.balanced ? "trial-balance-ok" : "trial-balance-out-of-balance"}>
        {report.balanced ? "Balanced" : "OUT OF BALANCE"}
      </p>
    </div>
  );
}
```

---

### T11 — `idt-erp-income-statement` — Income statement report

**Metadata:** ID `idt-erp-income-statement` · Target `src/components/IncomeStatementReport.tsx` · Prerequisites: T1, T3, T4 · Difficulty: Domain

**Backend API Contract:** `GET /api/reports/income-statement` → `200`
`{ revenue: string; cogs: string; netIncome: string }`.

**Step 1-6:** same read-once-report pattern as T10 (`report | null`, `loading`, `error`, manual
refresh) — spelled out in full rather than cross-referenced, per this document's own completeness
standard.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useEffect, useState } from "react";
import { apiGet } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";

type IncomeStatement = { revenue: string; cogs: string; netIncome: string };

export default function IncomeStatementReport() {
  const { pushToast } = useToast();
  const [report, setReport] = useState<IncomeStatement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet<IncomeStatement>("/reports/income-statement")
      .then((data) => {
        if (!cancelled) setReport(data);
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Couldn't load the income statement.";
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

  function handleRefresh() {
    setReloadToken((t) => t + 1);
  }

  if (loading) return <div className="income-statement-loading" aria-busy="true" />;

  if (error || !report) {
    return (
      <div className="income-statement-error">
        <p>{error || "Something went wrong loading the income statement."}</p>
        <button type="button" onClick={handleRefresh}>
          Try again
        </button>
      </div>
    );
  }

  const netIncome = Number(report.netIncome);

  return (
    <div className="income-statement">
      <button type="button" onClick={handleRefresh} className="income-statement-refresh">
        Refresh
      </button>
      <dl className="income-statement-lines">
        <div>
          <dt>Revenue</dt>
          <dd>${report.revenue}</dd>
        </div>
        <div>
          <dt>Cost of goods sold</dt>
          <dd>${report.cogs}</dd>
        </div>
        <div className={netIncome >= 0 ? "income-statement-net-positive" : "income-statement-net-negative"}>
          <dt>Net income</dt>
          <dd>${report.netIncome}</dd>
        </div>
      </dl>
    </div>
  );
}
```

---

### T12 — `idt-erp-item-create-drawer` — Create-item drawer

**Metadata:** ID `idt-erp-item-create-drawer` · Target `src/components/CreateItemDrawer.tsx` · Prerequisites: T2, T5 · Difficulty: Interactive

**Backend API Contract:** `POST /api/items` body
`{ sku: string; name: string; sellingPrice: number; reorderPoint?: number; reorderQuantity?: number }`
→ `201` the created `Item`; `400 { error: "sku, name, and sellingPrice are required." }`;
`400 { error: "sellingPrice cannot be negative." }`; `409 { error: "SKU <sku> already exists" }`.

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/CreateItemDrawer.tsx`. Base
export `CreateItemDrawer({ onCreated }: { onCreated: () => void })` — `onCreated` lets T5's table
(the sibling that mounts this drawer) know to re-fetch, same decoupling principle as T7/T8's window
events, but a plain callback prop here since drawer and table are direct siblings under one parent
route component, not two independent screens.

**Step 2 — External Dependencies & Imports.** `react`'s `useState`; `apiPost`, `ApiError` from
`../lib/apiClient`; `useToast`.

**Step 3 — Internal Scope & State Initialization.** `open: boolean` (drawer visibility, default
`false`); form fields `sku`, `name`, `sellingPrice`, `reorderPoint`, `reorderQuantity` (all strings —
number inputs are controlled as strings and parsed on submit, avoiding the `NaN`-while-typing problem
a `useState<number>` bound directly to an `<input type="number">` would cause); `submitting: boolean`;
`fieldError: string | null` (server-side validation message, distinct from a toast since it must
anchor to the form, not float away after 4s).

**Step 4 — Lifecycle & Data Fetching.** None — nothing to fetch before the form opens.

**Step 5 — Event Handlers & Mutations.** `handleOpen`/`handleClose` toggle `open` (close also resets
every field and `fieldError`); `handleSubmit` parses numeric fields, calls `apiPost("/items", ...)`,
on success calls `onCreated()`, `pushToast(...)`, and closes; on an `ApiError` sets `fieldError` to
its message (400/409 are both genuinely the user's fault here — bad input or a duplicate SKU — so
they render inline, not as a toast that could be missed).

**Step 6 — Render View & Branching States.** A trigger button when `!open`; the drawer form when
`open`, disabling all inputs and the submit button while `submitting`, rendering `fieldError` inline
above the submit button when present.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useState } from "react";
import { apiPost, ApiError } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";

type Item = {
  id: string;
  sku: string;
  name: string;
  sellingPrice: number;
  costPrice: number;
  stockOnHand: number;
  reorderPoint: number;
  reorderQuantity: number;
};

export default function CreateItemDrawer({ onCreated }: { onCreated: () => void }) {
  const { pushToast } = useToast();
  const [open, setOpen] = useState(false);
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [reorderPoint, setReorderPoint] = useState("10");
  const [reorderQuantity, setReorderQuantity] = useState("50");
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  function resetForm() {
    setSku("");
    setName("");
    setSellingPrice("");
    setReorderPoint("10");
    setReorderQuantity("50");
    setFieldError(null);
  }

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    resetForm();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError(null);
    setSubmitting(true);
    try {
      await apiPost<Item>("/items", {
        sku,
        name,
        sellingPrice: Number(sellingPrice),
        reorderPoint: Number(reorderPoint),
        reorderQuantity: Number(reorderQuantity),
      });
      pushToast(`Item ${sku} created.`, "success");
      onCreated();
      handleClose();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't create the item — please try again.";
      setFieldError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button type="button" className="create-item-trigger" onClick={handleOpen}>
        + New item
      </button>
    );
  }

  return (
    <div className="create-item-drawer" role="dialog" aria-label="Create item">
      <form onSubmit={handleSubmit}>
        <label>
          SKU
          <input value={sku} onChange={(e) => setSku(e.target.value)} required disabled={submitting} />
        </label>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required disabled={submitting} />
        </label>
        <label>
          Selling price
          <input
            type="number"
            min="0"
            step="0.01"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            required
            disabled={submitting}
          />
        </label>
        <label>
          Reorder point
          <input type="number" min="0" value={reorderPoint} onChange={(e) => setReorderPoint(e.target.value)} disabled={submitting} />
        </label>
        <label>
          Reorder quantity
          <input type="number" min="0" value={reorderQuantity} onChange={(e) => setReorderQuantity(e.target.value)} disabled={submitting} />
        </label>
        {fieldError && <p className="create-item-field-error">{fieldError}</p>}
        <div className="create-item-actions">
          <button type="button" onClick={handleClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" disabled={submitting}>
            {submitting ? "Creating…" : "Create item"}
          </button>
        </div>
      </form>
    </div>
  );
}
```

---

### T13 — `idt-erp-po-create-drawer` — Create-purchase-order drawer

**Metadata:** ID `idt-erp-po-create-drawer` · Target `src/components/CreatePurchaseOrderDrawer.tsx` · Prerequisites: T2, T5, T7 · Difficulty: Interactive

**Backend API Contract:** `POST /api/po` body
`{ vendorId?: string; items: { itemId: string; quantity: number; unitPrice: number }[] }` → `201` the
created `PurchaseOrder` (status always starts `"DRAFT"`); `400 { error: "At least one line item is required." }`.
No item-existence validation happens server-side on creation (only on receive) — matches the real
router exactly, so this form doesn't invent a client-side check the backend itself doesn't enforce
either, beyond requiring the item picker to only ever offer real items (Step 6).

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/CreatePurchaseOrderDrawer.tsx`.
Base export `CreatePurchaseOrderDrawer({ onCreated }: { onCreated: () => void })`.

**Step 2 — External Dependencies & Imports.** `react`'s `useState/useEffect`; `apiGet`, `apiPost`,
`ApiError`; `useToast`. Needs its own `useEffect` fetch of `/items` (Step 4) for the line-item picker
— it does not import T5's `ItemsTable` component (that renders a whole table, not a picker), so it
fetches the same `/items` list independently; a small, deliberate duplication rather than an awkward
cross-task import of a display component for its data.

**Step 3 — Internal Scope & State Initialization.** `open: boolean`; `items: Item[]` (for the
picker, distinct state from any other task's `items`); `vendorId: string` (free text, optional —
matches architectural call #5); `lines: { itemId: string; quantity: string; unitPrice: string }[]`
(starts as one empty line); `submitting`, `fieldError`.

**Step 4 — Lifecycle & Data Fetching.** A `useEffect` gated on `open` (only fetches `/items` the
first time the drawer opens, not on every mount of its parent) to populate the picker's item list.

**Step 5 — Event Handlers & Mutations.** `handleAddLine`/`handleRemoveLine` mutate the `lines` array;
`handleLineChange(index, field, value)` updates one line; `handleSubmit` parses every line's
`quantity`/`unitPrice` to numbers, posts to `/po`, dispatches `window.dispatchEvent(new
CustomEvent("po:changed"))` on success (the same event T7's board already listens for) in addition to
calling `onCreated()`, since T7 needs the refresh even though it isn't this drawer's direct parent.

**Step 6 — Render View & Branching States.** Trigger button when closed; when open, a repeating
line-item row (item `<select>` populated from `items`, quantity/unit-price number inputs, a remove
button) plus an "Add line" button, a running total computed from `lines` on every render (no extra
state needed for this — it's a pure derived value), and the same field-error/submitting pattern as
T12.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useEffect, useState } from "react";
import { apiGet, apiPost, ApiError } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";

type Item = { id: string; sku: string; name: string };
type Line = { itemId: string; quantity: string; unitPrice: string };
type PurchaseOrder = { id: string; poNumber: string; status: string };

const EMPTY_LINE: Line = { itemId: "", quantity: "1", unitPrice: "0" };

export default function CreatePurchaseOrderDrawer({ onCreated }: { onCreated: () => void }) {
  const { pushToast } = useToast();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [vendorId, setVendorId] = useState("");
  const [lines, setLines] = useState<Line[]>([{ ...EMPTY_LINE }]);
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    apiGet<Item[]>("/items").then((data) => {
      if (!cancelled) setItems(data);
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  function handleOpen() {
    setOpen(true);
  }

  function resetForm() {
    setVendorId("");
    setLines([{ ...EMPTY_LINE }]);
    setFieldError(null);
  }

  function handleClose() {
    setOpen(false);
    resetForm();
  }

  function handleAddLine() {
    setLines((current) => [...current, { ...EMPTY_LINE }]);
  }

  function handleRemoveLine(index: number) {
    setLines((current) => current.filter((_, i) => i !== index));
  }

  function handleLineChange(index: number, field: keyof Line, value: string) {
    setLines((current) => current.map((line, i) => (i === index ? { ...line, [field]: value } : line)));
  }

  const total = lines.reduce((sum, line) => sum + Number(line.quantity || 0) * Number(line.unitPrice || 0), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError(null);
    setSubmitting(true);
    try {
      const payload = {
        vendorId: vendorId || undefined,
        items: lines.map((line) => ({
          itemId: line.itemId,
          quantity: Number(line.quantity),
          unitPrice: Number(line.unitPrice),
        })),
      };
      const po = await apiPost<PurchaseOrder>("/po", payload);
      pushToast(`Purchase order ${po.poNumber} created.`, "success");
      window.dispatchEvent(new CustomEvent("po:changed"));
      onCreated();
      handleClose();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't create the purchase order — please try again.";
      setFieldError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button type="button" className="create-po-trigger" onClick={handleOpen}>
        + New purchase order
      </button>
    );
  }

  return (
    <div className="create-po-drawer" role="dialog" aria-label="Create purchase order">
      <form onSubmit={handleSubmit}>
        <label>
          Vendor (optional)
          <input value={vendorId} onChange={(e) => setVendorId(e.target.value)} disabled={submitting} />
        </label>
        <div className="create-po-lines">
          {lines.map((line, index) => (
            <div key={index} className="create-po-line">
              <select value={line.itemId} onChange={(e) => handleLineChange(index, "itemId", e.target.value)} required disabled={submitting}>
                <option value="" disabled>
                  Select item
                </option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.sku} — {item.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={line.quantity}
                onChange={(e) => handleLineChange(index, "quantity", e.target.value)}
                disabled={submitting}
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={line.unitPrice}
                onChange={(e) => handleLineChange(index, "unitPrice", e.target.value)}
                disabled={submitting}
              />
              {lines.length > 1 && (
                <button type="button" onClick={() => handleRemoveLine(index)} disabled={submitting}>
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={handleAddLine} disabled={submitting}>
          + Add line
        </button>
        <p className="create-po-total">Total: ${total.toFixed(2)}</p>
        {fieldError && <p className="create-po-field-error">{fieldError}</p>}
        <div className="create-po-actions">
          <button type="button" onClick={handleClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" disabled={submitting}>
            {submitting ? "Creating…" : "Create purchase order"}
          </button>
        </div>
      </form>
    </div>
  );
}
```

---

### T14 — `idt-erp-po-action-dispatcher` — PO status action buttons + confirm dialogs

**Metadata:** ID `idt-erp-po-action-dispatcher` · Target `src/components/PurchaseOrderActions.tsx` · Prerequisites: T2, T7 · Difficulty: Interactive

**Backend API Contract:**
`POST /api/po/:id/approve` → `200` updated PO; `404 { error: "Purchase order not found" }`;
`409 { error: "NOT_DRAFT: cannot approve a <status> order" }`.
`POST /api/po/:id/cancel` → `200`; `404`; `409 { error: "CANNOT_CANCEL: order is already <status>" }`.
`POST /api/po/:id/receive` → `200`; `404`; `409 { error: "ALREADY_RECEIVED" }`;
`409 { error: "NOT_APPROVED: order is <status>" }`; `400` unknown item on the order.

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/PurchaseOrderActions.tsx`.
Base export `PurchaseOrderActions({ po }: { po: PurchaseOrder })` — takes the PO T7 already fetched
as a prop rather than re-fetching it, since T7 is always this component's mounting parent.

**Step 2 — External Dependencies & Imports.** `react`'s `useState`; `apiPost`, `ApiError`; `useToast`.

**Step 3 — Internal Scope & State Initialization.** `pendingAction: "approve" | "cancel" | "receive" | null`
(which action is mid-flight, drives per-button disabled state and a confirm dialog);
`confirmAction: "cancel" | "receive" | null` (cancel and receive are destructive/hard-to-reverse —
each opens a confirm step before firing; approve does not, since a DRAFT→APPROVED move is low-risk
and reversible via cancel).

**Step 4 — Lifecycle & Data Fetching.** None — this component only ever reacts to clicks.

**Step 5 — Event Handlers & Mutations.** `handleApprove` fires immediately; `handleAskCancel`/
`handleAskReceive` set `confirmAction` instead of firing immediately; `handleConfirm` actually calls
the endpoint for whichever action was pending, and `handleCancelConfirm` clears `confirmAction`
without calling anything. Every real mutation dispatches `window.dispatchEvent(new
CustomEvent("po:changed"))` on success so T7's board re-fetches (this component never mutates its own
`po` prop directly — it isn't the source of truth, T7's fetched list is), and calls `pushToast` on
both success and failure (an error here is exactly the kind of thing a user must see, not miss).

**Step 6 — Render View & Branching States.** Only the button(s) valid for the PO's *current* status
render at all (`DRAFT` → Approve + Cancel; `APPROVED` → Receive + Cancel; `RECEIVED`/`CANCELLED` →
nothing, a plain "No actions available" note) — this is itself a real state-machine guard mirroring
the backend's own transition rules, so an applicant can't even attempt an invalid transition from the
UI. When `confirmAction` is set, an inline confirm strip replaces the button row ("Really receive
this order? [Confirm] [Back]").

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useState } from "react";
import { apiPost, ApiError } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";

type PurchaseOrder = { id: string; poNumber: string; status: "DRAFT" | "APPROVED" | "RECEIVED" | "CANCELLED" };
type ActionKind = "approve" | "cancel" | "receive";

export default function PurchaseOrderActions({ po }: { po: PurchaseOrder }) {
  const { pushToast } = useToast();
  const [pendingAction, setPendingAction] = useState<ActionKind | null>(null);
  const [confirmAction, setConfirmAction] = useState<"cancel" | "receive" | null>(null);

  async function runAction(action: ActionKind) {
    setPendingAction(action);
    try {
      await apiPost(`/po/${po.id}/${action}`);
      pushToast(`${po.poNumber} ${action === "approve" ? "approved" : action === "cancel" ? "cancelled" : "received"}.`, "success");
      window.dispatchEvent(new CustomEvent("po:changed"));
    } catch (err) {
      const message = err instanceof ApiError ? err.message : `Couldn't ${action} this order — please try again.`;
      pushToast(message, "error");
    } finally {
      setPendingAction(null);
      setConfirmAction(null);
    }
  }

  function handleApprove() {
    runAction("approve");
  }

  function handleAskCancel() {
    setConfirmAction("cancel");
  }

  function handleAskReceive() {
    setConfirmAction("receive");
  }

  function handleConfirm() {
    if (confirmAction) runAction(confirmAction);
  }

  function handleCancelConfirm() {
    setConfirmAction(null);
  }

  const busy = pendingAction !== null;

  if (confirmAction) {
    return (
      <div className="po-actions-confirm">
        <p>Really {confirmAction} {po.poNumber}?</p>
        <button type="button" onClick={handleConfirm} disabled={busy}>
          {busy ? "Working…" : "Confirm"}
        </button>
        <button type="button" onClick={handleCancelConfirm} disabled={busy}>
          Back
        </button>
      </div>
    );
  }

  if (po.status === "DRAFT") {
    return (
      <div className="po-actions">
        <button type="button" onClick={handleApprove} disabled={busy}>
          {pendingAction === "approve" ? "Approving…" : "Approve"}
        </button>
        <button type="button" onClick={handleAskCancel} disabled={busy}>
          Cancel order
        </button>
      </div>
    );
  }

  if (po.status === "APPROVED") {
    return (
      <div className="po-actions">
        <button type="button" onClick={handleAskReceive} disabled={busy}>
          Receive goods
        </button>
        <button type="button" onClick={handleAskCancel} disabled={busy}>
          Cancel order
        </button>
      </div>
    );
  }

  return <p className="po-actions-none">No actions available.</p>;
}
```

---

### T15 — `idt-erp-so-create-drawer` — Create-sales-order drawer

**Metadata:** ID `idt-erp-so-create-drawer` · Target `src/components/CreateSalesOrderDrawer.tsx` · Prerequisites: T2, T5, T8 · Difficulty: Interactive

**Backend API Contract:** `POST /api/so` body
`{ customerId: string; items: { itemId: string; quantity: number; unitPrice: number }[] }` → `201`
the created `SalesOrder` (status always starts `"CONFIRMED"`);
`400 { error: "customerId and at least one line item are required." }`;
`400 { error: "Unknown item <id>" }` (unlike PO creation, SO creation *does* validate every item id
server-side before creating the order — matches the real router exactly, so a stale/removed item
picked in a slow-typing session surfaces as this exact message, not a generic failure).

**Step 1-6:** same shape as T13 (own independent `/items` fetch for the picker, repeating line-item
rows, running total, `"so:changed"` event dispatch on success) with `customerId` (required free text,
per architectural call #5) replacing T13's optional `vendorId`, and the 400 unknown-item response
surfaced as `fieldError` rather than assumed impossible.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useEffect, useState } from "react";
import { apiGet, apiPost, ApiError } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";

type Item = { id: string; sku: string; name: string };
type Line = { itemId: string; quantity: string; unitPrice: string };
type SalesOrder = { id: string; soNumber: string; status: string };

const EMPTY_LINE: Line = { itemId: "", quantity: "1", unitPrice: "0" };

export default function CreateSalesOrderDrawer({ onCreated }: { onCreated: () => void }) {
  const { pushToast } = useToast();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [lines, setLines] = useState<Line[]>([{ ...EMPTY_LINE }]);
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    apiGet<Item[]>("/items").then((data) => {
      if (!cancelled) setItems(data);
    });
    return () => {
      cancelled = true;
    };
  }, [open]);

  function handleOpen() {
    setOpen(true);
  }

  function resetForm() {
    setCustomerId("");
    setLines([{ ...EMPTY_LINE }]);
    setFieldError(null);
  }

  function handleClose() {
    setOpen(false);
    resetForm();
  }

  function handleAddLine() {
    setLines((current) => [...current, { ...EMPTY_LINE }]);
  }

  function handleRemoveLine(index: number) {
    setLines((current) => current.filter((_, i) => i !== index));
  }

  function handleLineChange(index: number, field: keyof Line, value: string) {
    setLines((current) => current.map((line, i) => (i === index ? { ...line, [field]: value } : line)));
  }

  const total = lines.reduce((sum, line) => sum + Number(line.quantity || 0) * Number(line.unitPrice || 0), 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError(null);
    setSubmitting(true);
    try {
      const payload = {
        customerId,
        items: lines.map((line) => ({
          itemId: line.itemId,
          quantity: Number(line.quantity),
          unitPrice: Number(line.unitPrice),
        })),
      };
      const so = await apiPost<SalesOrder>("/so", payload);
      pushToast(`Sales order ${so.soNumber} created.`, "success");
      window.dispatchEvent(new CustomEvent("so:changed"));
      onCreated();
      handleClose();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't create the sales order — please try again.";
      setFieldError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button type="button" className="create-so-trigger" onClick={handleOpen}>
        + New sales order
      </button>
    );
  }

  return (
    <div className="create-so-drawer" role="dialog" aria-label="Create sales order">
      <form onSubmit={handleSubmit}>
        <label>
          Customer
          <input value={customerId} onChange={(e) => setCustomerId(e.target.value)} required disabled={submitting} />
        </label>
        <div className="create-so-lines">
          {lines.map((line, index) => (
            <div key={index} className="create-so-line">
              <select value={line.itemId} onChange={(e) => handleLineChange(index, "itemId", e.target.value)} required disabled={submitting}>
                <option value="" disabled>
                  Select item
                </option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.sku} — {item.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={line.quantity}
                onChange={(e) => handleLineChange(index, "quantity", e.target.value)}
                disabled={submitting}
              />
              <input
                type="number"
                min="0"
                step="0.01"
                value={line.unitPrice}
                onChange={(e) => handleLineChange(index, "unitPrice", e.target.value)}
                disabled={submitting}
              />
              {lines.length > 1 && (
                <button type="button" onClick={() => handleRemoveLine(index)} disabled={submitting}>
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={handleAddLine} disabled={submitting}>
          + Add line
        </button>
        <p className="create-so-total">Total: ${total.toFixed(2)}</p>
        {fieldError && <p className="create-so-field-error">{fieldError}</p>}
        <div className="create-so-actions">
          <button type="button" onClick={handleClose} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" disabled={submitting}>
            {submitting ? "Creating…" : "Create sales order"}
          </button>
        </div>
      </form>
    </div>
  );
}
```

---

### T16 — `idt-erp-so-action-dispatcher` — SO status action buttons + confirm dialogs

**Metadata:** ID `idt-erp-so-action-dispatcher` · Target `src/components/SalesOrderActions.tsx` · Prerequisites: T2, T8 · Difficulty: Interactive

**Backend API Contract:**
`POST /api/so/:id/fulfill` → `200`; `404`; `409 { error: "ALREADY_SHIPPED" }`;
`409 { error: "INSUFFICIENT_STOCK: <sku>" }`.
`POST /api/so/:id/mark-paid` → `200`; `404`; `409 { error: "NOT_SHIPPED: order is <status>" }`.
`POST /api/so/:id/cancel` → `200`; `404`; `409 { error: "CANNOT_CANCEL: order is already <status>" }`.

**Step 1-6:** same state-machine-gated pattern as T14 — `CONFIRMED` → Fulfill + Cancel;
`SHIPPED` → Mark paid (no confirm needed — non-destructive, unlike fulfill/cancel which both consume
real stock or foreclose the order and do get a confirm step); `PAID`/`CANCELLED` → no actions.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useState } from "react";
import { apiPost, ApiError } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";

type SalesOrder = { id: string; soNumber: string; status: "CONFIRMED" | "SHIPPED" | "PAID" | "CANCELLED" };
type ActionKind = "fulfill" | "mark-paid" | "cancel";

export default function SalesOrderActions({ so }: { so: SalesOrder }) {
  const { pushToast } = useToast();
  const [pendingAction, setPendingAction] = useState<ActionKind | null>(null);
  const [confirmAction, setConfirmAction] = useState<"fulfill" | "cancel" | null>(null);

  async function runAction(action: ActionKind) {
    setPendingAction(action);
    try {
      await apiPost(`/so/${so.id}/${action}`);
      pushToast(
        `${so.soNumber} ${action === "fulfill" ? "fulfilled" : action === "mark-paid" ? "marked paid" : "cancelled"}.`,
        "success",
      );
      window.dispatchEvent(new CustomEvent("so:changed"));
    } catch (err) {
      const message = err instanceof ApiError ? err.message : `Couldn't complete that action — please try again.`;
      pushToast(message, "error");
    } finally {
      setPendingAction(null);
      setConfirmAction(null);
    }
  }

  function handleAskFulfill() {
    setConfirmAction("fulfill");
  }

  function handleAskCancel() {
    setConfirmAction("cancel");
  }

  function handleMarkPaid() {
    runAction("mark-paid");
  }

  function handleConfirm() {
    if (confirmAction) runAction(confirmAction);
  }

  function handleCancelConfirm() {
    setConfirmAction(null);
  }

  const busy = pendingAction !== null;

  if (confirmAction) {
    return (
      <div className="so-actions-confirm">
        <p>Really {confirmAction} {so.soNumber}?</p>
        <button type="button" onClick={handleConfirm} disabled={busy}>
          {busy ? "Working…" : "Confirm"}
        </button>
        <button type="button" onClick={handleCancelConfirm} disabled={busy}>
          Back
        </button>
      </div>
    );
  }

  if (so.status === "CONFIRMED") {
    return (
      <div className="so-actions">
        <button type="button" onClick={handleAskFulfill} disabled={busy}>
          Fulfill
        </button>
        <button type="button" onClick={handleAskCancel} disabled={busy}>
          Cancel order
        </button>
      </div>
    );
  }

  if (so.status === "SHIPPED") {
    return (
      <div className="so-actions">
        <button type="button" onClick={handleMarkPaid} disabled={busy}>
          {pendingAction === "mark-paid" ? "Marking paid…" : "Mark paid"}
        </button>
      </div>
    );
  }

  return <p className="so-actions-none">No actions available.</p>;
}
```

---

### T17 — `idt-erp-gl-entry-form` — Manual journal entry form

**Metadata:** ID `idt-erp-gl-entry-form` · Target `src/components/ManualJournalEntryForm.tsx` · Prerequisites: T2, T4, T6 · Difficulty: Interactive

**Backend API Contract:** `POST /api/gl/entries` body
`{ reference?: string; lines: { accountId: string; debit?: number; credit?: number }[] }` → `201` the
created `JournalEntry`; `400 { error: "At least two ledger lines are required." }`;
`400 { error: "Unbalanced entry: total debits must equal total credits." }`.

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/ManualJournalEntryForm.tsx`.
Base export `ManualJournalEntryForm({ onPosted }: { onPosted: () => void })`.

**Step 2 — External Dependencies & Imports.** `react`'s `useState`; `apiPost`, `ApiError`; `useToast`;
`useAccounts` from T4 (populates the account picker — this is exactly why T17 depends on T4 directly
rather than fetching `/accounts` a third time).

**Step 3 — Internal Scope & State Initialization.** `reference: string`; `lines: { accountId: string;
side: "debit" | "credit"; amount: string }[]` (starts as two empty lines — the real minimum this
endpoint accepts — modeling debit/credit as one `side` selector per line rather than two separate
number fields per line, since a real line is always exactly one or the other, never both);
`submitting`, `fieldError`.

**Step 4 — Lifecycle & Data Fetching.** None owned here — `useAccounts()` already did the fetching in
T4; this component only reads its `accounts` array.

**Step 5 — Event Handlers & Mutations.** `handleAddLine`/`handleRemoveLine` (minimum two lines
enforced — remove is disabled at exactly two); `handleLineChange`; a derived (not stored)
`totalDebit`/`totalCredit`/`balanced` computed on every render from `lines`, so the form can disable
its own submit button and show a live imbalance warning *before* ever hitting the server's own parity
check — a real UX improvement over waiting for a 400; `handleSubmit` converts each line to
`{ accountId, debit, credit }` (zero on whichever side wasn't selected) and posts.

**Step 6 — Render View & Branching States.** A repeating line row (account `<select>` from
`useAccounts()`, a debit/credit `<select>`, an amount input, remove button gated on `lines.length >
2`), a live running total row, submit disabled when `!balanced` or `submitting`, and `fieldError`
rendered inline for the two 400 cases above (both are genuinely the user's fault — too few lines or
an unbalanced entry — never a toast that could be missed on a form still open).

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useState } from "react";
import { apiPost, ApiError } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";
import { useAccounts } from "../providers/AccountsProvider";

type Side = "debit" | "credit";
type Line = { accountId: string; side: Side; amount: string };
type JournalEntry = { id: string; entryNumber: string };

const EMPTY_LINE: Line = { accountId: "", side: "debit", amount: "" };

export default function ManualJournalEntryForm({ onPosted }: { onPosted: () => void }) {
  const { pushToast } = useToast();
  const { accounts } = useAccounts();
  const [reference, setReference] = useState("");
  const [lines, setLines] = useState<Line[]>([{ ...EMPTY_LINE }, { ...EMPTY_LINE, side: "credit" }]);
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  function handleAddLine() {
    setLines((current) => [...current, { ...EMPTY_LINE }]);
  }

  function handleRemoveLine(index: number) {
    if (lines.length <= 2) return;
    setLines((current) => current.filter((_, i) => i !== index));
  }

  function handleLineChange(index: number, field: keyof Line, value: string) {
    setLines((current) => current.map((line, i) => (i === index ? { ...line, [field]: value } : line)));
  }

  const totalDebit = lines.reduce((sum, l) => sum + (l.side === "debit" ? Number(l.amount || 0) : 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (l.side === "credit" ? Number(l.amount || 0) : 0), 0);
  const balanced = totalDebit > 0 && Math.round(totalDebit * 100) === Math.round(totalCredit * 100);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError(null);
    setSubmitting(true);
    try {
      const payload = {
        reference: reference || undefined,
        lines: lines.map((l) => ({
          accountId: l.accountId,
          debit: l.side === "debit" ? Number(l.amount) : 0,
          credit: l.side === "credit" ? Number(l.amount) : 0,
        })),
      };
      const entry = await apiPost<JournalEntry>("/gl/entries", payload);
      pushToast(`Journal entry ${entry.entryNumber} posted.`, "success");
      onPosted();
      setReference("");
      setLines([{ ...EMPTY_LINE }, { ...EMPTY_LINE, side: "credit" }]);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't post this entry — please try again.";
      setFieldError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="gl-entry-form" onSubmit={handleSubmit}>
      <label>
        Reference (optional)
        <input value={reference} onChange={(e) => setReference(e.target.value)} disabled={submitting} />
      </label>
      <div className="gl-entry-lines">
        {lines.map((line, index) => (
          <div key={index} className="gl-entry-line">
            <select value={line.accountId} onChange={(e) => handleLineChange(index, "accountId", e.target.value)} required disabled={submitting}>
              <option value="" disabled>
                Select account
              </option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.code} — {acc.name}
                </option>
              ))}
            </select>
            <select value={line.side} onChange={(e) => handleLineChange(index, "side", e.target.value)} disabled={submitting}>
              <option value="debit">Debit</option>
              <option value="credit">Credit</option>
            </select>
            <input
              type="number"
              min="0"
              step="0.01"
              value={line.amount}
              onChange={(e) => handleLineChange(index, "amount", e.target.value)}
              required
              disabled={submitting}
            />
            <button type="button" onClick={() => handleRemoveLine(index)} disabled={submitting || lines.length <= 2}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={handleAddLine} disabled={submitting}>
        + Add line
      </button>
      <p className={balanced ? "gl-entry-balanced" : "gl-entry-unbalanced"}>
        Debit ${totalDebit.toFixed(2)} / Credit ${totalCredit.toFixed(2)} {balanced ? "(balanced)" : "(unbalanced)"}
      </p>
      {fieldError && <p className="gl-entry-field-error">{fieldError}</p>}
      <button type="submit" disabled={submitting || !balanced}>
        {submitting ? "Posting…" : "Post entry"}
      </button>
    </form>
  );
}
```

---

### T18 — `idt-erp-error-boundary` — App-wide error boundary

**Metadata:** ID `idt-erp-error-boundary` · Target `src/components/ErrorBoundary.tsx` · Prerequisites: T1 · Difficulty: Resilience

**Backend API Contract:** none — this catches render-time JavaScript errors (a bad prop, a
`.map()` over `undefined`, a third-party crash), not network failures — those are already handled per
task by each screen's own `error` state (T5-T11) and toasts (T2). An error boundary is a real, distinct
React mechanism (`static getDerivedStateFromError`/`componentDidCatch`) that only a **class**
component can implement — the one deliberate exception to "everything else in this backlog is a
function component."

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/ErrorBoundary.tsx`. Base
export is a class `ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }>`.

**Step 2 — External Dependencies & Imports.** `react`'s `Component`, `type ReactNode`,
`type ErrorInfo`.

**Step 3 — Internal Scope & State Initialization.** Class state `{ error: Error | null }`, initialized
in the constructor to `{ error: null }` — a class component's state is initialized in its constructor,
not a `useState` call, since this is the one task in this backlog that isn't a function component.

**Step 4 — Lifecycle & Data Fetching.** `static getDerivedStateFromError(error)` returns `{ error }`
(runs during the failed render, before `componentDidCatch`); `componentDidCatch(error, info)` logs to
`console.error` — this project has no Sentry/error-monitoring service wired in yet (a real,
already-flagged gap elsewhere), so a console log is the honest current ceiling, not a placeholder for
a call that doesn't exist.

**Step 5 — Event Handlers & Mutations.** `handleReset` (an instance method, bound in the constructor)
clears `error` back to `null`, letting the user retry rendering the subtree without a full page reload.

**Step 6 — Render View & Branching States.** `this.state.error` → a fallback panel with the error's
message and a "Try again" button calling `handleReset`; otherwise renders `this.props.children`
unchanged.

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
    // No error-monitoring service is wired into this project yet — console.error is the honest
    // current ceiling, not a stand-in for a real call that was left out.
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

### T19 — `idt-erp-skeleton-loaders` — Loading skeleton library

**Metadata:** ID `idt-erp-skeleton-loaders` · Target `src/components/Skeletons.tsx` · Prerequisites: none · Difficulty: Resilience

**Backend API Contract:** none — pure presentational components.

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/Skeletons.tsx`. Three named
exports, no default export (this file is a small shared library, not one screen): `TableSkeleton`,
`BoardSkeleton`, `ReportSkeleton`.

**Step 2 — External Dependencies & Imports.** `react` only, for typing props (`{ rows?: number }`
etc.) — no hooks anywhere in this file, since a skeleton never has real state or lifecycle of its own.

**Step 3 — Internal Scope & State Initialization.** N/A — every export here is a pure function of
its props, no `useState` anywhere.

**Step 4 — Lifecycle & Data Fetching.** N/A.

**Step 5 — Event Handlers & Mutations.** N/A — nothing here is interactive.

**Step 6 — Render View & Branching States.** Each export renders a fixed number of `aria-hidden`
placeholder rows/cards/lines with a `skeleton-shimmer` CSS class (the animation itself lives in
global CSS, out of scope for this task, same as every other component's styling in this backlog).

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

export function BoardSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="skeleton-board" aria-hidden="true">
      {Array.from({ length: columns }, (_, i) => (
        <div key={i} className="skeleton-column">
          <div className="skeleton-column-header skeleton-shimmer" />
          <div className="skeleton-card skeleton-shimmer" />
          <div className="skeleton-card skeleton-shimmer" />
        </div>
      ))}
    </div>
  );
}

export function ReportSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="skeleton-report" aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="skeleton-line skeleton-shimmer" />
      ))}
    </div>
  );
}
```

---

### T20 — `idt-erp-offline-queue` — Offline banner + mutation retry queue

**Metadata:** ID `idt-erp-offline-queue` · Target `src/providers/OfflineQueueProvider.tsx` · Prerequisites: T2, T3 · Difficulty: Resilience

**Backend API Contract:** none new — this task wraps *existing* mutation calls (the `apiPost` calls
already written in T12-T17) in a queue; it does not add or change any endpoint.

**Step 1 — File Scaffolding & Component Shell.** Create `src/providers/OfflineQueueProvider.tsx`.
Base export `OfflineQueueProvider({ children })` + `useOfflineQueue()` hook exposing `enqueueOrSend`,
the one function T12-T17 would each swap their direct `apiPost` call for if this task is wired in
after them (a real, explicit integration step — this task does not retroactively edit those six
files itself).

**Step 2 — External Dependencies & Imports.** `react`'s `createContext/useContext/useState/useEffect/
useCallback`, `type ReactNode`; `apiPost`, `ApiError` from `../lib/apiClient`; `useToast`.

**Step 3 — Internal Scope & State Initialization.** `isOnline: boolean` (initialized from
`navigator.onLine`); `queue: QueuedMutation[]` (each `{ id, path, payload, description }`) — persisted
to `localStorage` on every change (Step 4) so a real page reload while offline doesn't silently lose
queued work, matching the wrapper's own "browser storage for lightweight per-viewer state" guidance
rather than trusting in-memory state alone to survive a reload.

**Step 4 — Lifecycle & Data Fetching.** Two `useEffect`s: one subscribes to `window`'s `"online"`/
`"offline"` events to keep `isOnline` current, cleaning up both listeners on unmount; a second runs
whenever `isOnline` flips `true`, draining the queue in order (each item is only removed from
`localStorage`/state after its `apiPost` call actually succeeds — a failure mid-drain stops the drain
there rather than silently discarding the rest).

**Step 5 — Event Handlers & Mutations.** `enqueueOrSend(path, payload, description)`: if `isOnline`,
calls `apiPost` immediately and returns its result (the common case — this hook is a transparent
passthrough when the network is fine); if offline, appends to `queue`, shows a toast ("Saved offline
— will send when you're back online"), and returns `null` instead of throwing, since "queued" is a
real, different outcome a caller may want to branch on, not a failure.

**Step 6 — Render View & Branching States.** Renders `children` always, plus a fixed banner rendered
only when `!isOnline` ("You're offline — N change(s) queued") or when `queue.length > 0` right after
reconnecting and before the drain finishes.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { apiPost, ApiError } from "../lib/apiClient";
import { useToast } from "./ToastProvider";

type QueuedMutation = { id: string; path: string; payload: unknown; description: string };
type OfflineQueueContextValue = {
  isOnline: boolean;
  queueLength: number;
  enqueueOrSend: <T,>(path: string, payload: unknown, description: string) => Promise<T | null>;
};

const STORAGE_KEY = "minierp-offline-queue";
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
    // Best-effort only — a private-browsing/storage-blocked viewer just loses persistence across
    // reloads, not correctness of the in-memory queue for the current session.
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
          // Stop draining on the first failure — the rest of the queue stays intact rather than
          // being silently discarded; the user can retry once conditions genuinely improve.
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
            ? `You're offline — ${queue.length} change${queue.length === 1 ? "" : "s"} queued.`
            : `Sending ${queue.length} queued change${queue.length === 1 ? "" : "s"}…`}
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

*Instances thrown by `apiPost`/`enqueueOrSend` are `ApiError` where a status code matters to the
caller (imported above for parity with every other mutation task, even though this file only checks
success/failure, not status codes, at the queue level itself).*

---

## What's deliberately not in this backlog

- **Real-time updates** (a second user's change appearing without a manual refresh) — every board
  above refreshes on a same-tab custom event or a manual button, never a poll or websocket. Matches
  the real backend, which has no push mechanism of any kind (`server/minierp-router.js` is a plain
  REST API).
- **Raw journal-entry-by-entry drill-down** (T6 is a per-account summary, not a transaction feed) —
  would need a new `GET /gl/entries` endpoint this pass didn't add. Real gap, flagged not fixed.
- **Customer/Vendor master data screens** — no backend entity exists for either; both are free-text
  fields throughout, matching the real contract exactly (architectural call #5).
- **Multi-tenant/auth-aware views** — MiniERP's backend has no session or tenant concept of its own
  (unlike IPF's own `-core`/JS session model); every endpoint here is unauthenticated by design,
  matching the real router.
