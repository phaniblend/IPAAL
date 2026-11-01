# SentinelPOS — Frontend Task Backlog (WBS v2)

**Status: authored 2026-09-11, not yet published to OneDev or fed through SpecForge.** Same
ground-truth-spec status as `docs/curriculum/minierp-fe-tasks.md` — read that file's header first if
you haven't; the architectural reasoning there (real backend contract, no TanStack Query, supersedes
rather than deletes the old task) applies here identically and isn't re-argued line by line below.

## Why this backlog is 9 tasks, not 20

MiniERP's real backend has five independent capability groups (ledger, items, purchase orders, sales
orders, reports) — SentinelPOS's real backend (`server/sentinelpos-router.js`) has exactly **two**
endpoints: `GET /api/v1/incidents` and `POST /api/v1/incidents/:id/resolve`. The router's own top
comment is explicit about why: the spec's other four backend tasks (tenant-isolated API-key
middleware, the Redis-buffered POS event ingestion pipeline, the real sliding-window Z-score anomaly
engine, the WORM evidence vault) were never built, because there's no real event stream to feed them
and no FE task that calls them. A frontend task backlog can only be as complete as the backend it's
honestly scoped against — decomposing two endpoints into 20 tasks would mean inventing 11 tasks
against capabilities that don't exist. This backlog is proportionally smaller because the real system
is smaller, not because it received less rigor. If the backend's remaining four capabilities get
built later, this document gets a second pass then, not before.

## Architectural calls specific to this product

1. **No multi-page navigation.** SentinelPOS is one working surface — an incident queue an analyst
   triages — not a multi-screen app like MiniERP. T1 is still a real "Foundation" task (a shell,
   a header showing the live open-incident count, room to mount the toast stack) but deliberately
   has no nav drawer, because there is nowhere else in this app to navigate to.
2. **Supersedes the existing `idt-sentinelpos-triage` task**
   (`src/engines/assist/inpact_assist_idt-sentinelpos-triage_engine.tsx`), which taught the whole
   queue-plus-resolve flow as one 1,261-line task. Decomposed here into T4 (queue), T5 (detail
   drawer — the existing task never had one; an analyst currently resolves blind to the event
   timeline, a real gap this closes), and T6 (the resolve action itself). Same non-deletion caveat as
   MiniERP's document: retiring the old task in OneDev/Workbench is a deliberate migration step, not
   done by writing this file.
3. **`Incident`/`Case` naming.** The existing (pre-rename) lesson content mixes `Case` and `Incident`
   terminology from before the KioskGuard→SentinelPOS rename. Every task below uses `Incident`
   consistently, matching the real router's own field/endpoint names (`incidentCode`, `/v1/incidents`)
   — no lingering `Case` naming carried forward.

---

## Phase 1 — Feature-to-Task Matrix (Task Dependency Graph)

```
[Design Spec: this document]
        |
        v
  TIER 1 — Foundation & Context Layer
        |
        +--> T1 idt-sentinelpos-app-shell      (header shell — everything else renders inside it)
        +--> T2 idt-sentinelpos-toast-provider  (needs T1 to mount into)
        +--> T3 idt-sentinelpos-api-client      (no UI dependency)
        |
        v
  TIER 2 — Domain Feature Slice
        |
        +--> T4 idt-sentinelpos-incident-queue  (needs T1, T3)
        |
        v
  TIER 3 — Interactive & Mutation Layers
        |
        +--> T5 idt-sentinelpos-incident-detail-drawer  (mounts into T4)
        +--> T6 idt-sentinelpos-resolve-dispatcher       (mounts into T5; needs T2)
        |
        v
  TIER 4 — Resilience & Offline Layers
        |
        +--> T7 idt-sentinelpos-error-boundary   (wraps T1 — needs T1)
        +--> T8 idt-sentinelpos-skeleton-loaders  (consumed by T4's loading branch)
        +--> T9 idt-sentinelpos-offline-queue     (wraps T3 — needs T2, T3)
        |
        v
  App Closeout: the queue (T4) reachable from the shell, every open incident's detail (T5) reachable
  from its row, resolve (T6) wired from the detail drawer to the queue's refresh, the whole surface
  wrapped in T7/T8/T9.
```

| # | Task ID | Tier | Name | Target File | Prerequisites |
|---|---|---|---|---|---|
| 1 | `idt-sentinelpos-app-shell` | Foundation | App shell & header | `src/layout/AppShell.tsx` | none |
| 2 | `idt-sentinelpos-toast-provider` | Foundation | Global toast/notification provider | `src/providers/ToastProvider.tsx` | T1 |
| 3 | `idt-sentinelpos-api-client` | Foundation | Shared API client & error normalization | `src/lib/apiClient.ts` | none |
| 4 | `idt-sentinelpos-incident-queue` | Domain | Open-incident queue | `src/components/IncidentQueue.tsx` | T1, T3 |
| 5 | `idt-sentinelpos-incident-detail-drawer` | Interactive | Incident detail drawer + event timeline | `src/components/IncidentDetailDrawer.tsx` | T4 |
| 6 | `idt-sentinelpos-resolve-dispatcher` | Interactive | Resolve action + confirm + notes | `src/components/ResolveIncidentAction.tsx` | T2, T5 |
| 7 | `idt-sentinelpos-error-boundary` | Resilience | App-wide error boundary | `src/components/ErrorBoundary.tsx` | T1 |
| 8 | `idt-sentinelpos-skeleton-loaders` | Resilience | Loading skeleton library | `src/components/Skeletons.tsx` | none |
| 9 | `idt-sentinelpos-offline-queue` | Resilience | Offline banner + resolve retry queue | `src/providers/OfflineQueueProvider.tsx` | T2, T3 |

**Completeness check:**

| Backend capability | Covered by |
|---|---|
| `GET /api/v1/incidents` | T4 |
| `POST /api/v1/incidents/:id/resolve` | T6 |
| Cross-cutting: loading/error/empty, event-timeline detail, offline resolve | T5, T7, T8, T9 |

---

## Phase 2 — Fully Expanded Task Specifications

Tasks T1-T3 and T7-T8 are the same reusable Foundation/Resilience primitives as MiniERP's document
(same reasoning, same 6-step breakdown) — reproduced here in full per this document's own
completeness standard, not cross-referenced, since this is a separate delivery repo with its own
copy of each file.

---

### T1 — `idt-sentinelpos-app-shell` — App shell & header

**Metadata:** ID `idt-sentinelpos-app-shell` · Target `src/layout/AppShell.tsx` · Prerequisites: none · Difficulty: Foundation

**Backend API Contract:** none — pure layout.

**Step 1 — File Scaffolding & Component Shell.** Create `src/layout/AppShell.tsx`. Base export
`AppShell({ children, openIncidentCount }: { children: ReactNode; openIncidentCount: number })` — the
count is a prop, not fetched here, since T4 (the one screen that actually knows the real count) is
what owns that data; the shell just displays whatever it's given.

**Step 2 — External Dependencies & Imports.** `react`'s `type ReactNode` only — no hooks, this is a
static header wrapper.

**Step 3 — Internal Scope & State Initialization.** None — no local state; `openIncidentCount` is
fully controlled by the caller.

**Step 4 — Lifecycle & Data Fetching.** None.

**Step 5 — Event Handlers & Mutations.** None.

**Step 6 — Render View & Branching States.** A `<header>` showing "SentinelPOS" and the open-incident
count as a badge, and a `<main>` rendering `children`. No loading/error branches — nothing here is
async.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import type { ReactNode } from "react";

export default function AppShell({ children, openIncidentCount }: { children: ReactNode; openIncidentCount: number }) {
  return (
    <div className="app-shell">
      <header className="app-shell-header">
        <h1>SentinelPOS</h1>
        <span className="app-shell-badge">{openIncidentCount} open</span>
      </header>
      <main className="app-shell-main">{children}</main>
    </div>
  );
}
```

---

### T2 — `idt-sentinelpos-toast-provider` — Global toast/notification provider

**Metadata:** ID `idt-sentinelpos-toast-provider` · Target `src/providers/ToastProvider.tsx` · Prerequisites: T1 · Difficulty: Foundation

**Backend API Contract:** none.

**Steps 1-6:** identical reasoning to MiniERP's T2 — one provider/hook pair, `pushToast(message,
kind)` appends a toast that removes itself after 4s via a `setTimeout` scheduled inside the handler,
`dismissToast(id)` for manual close.

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

### T3 — `idt-sentinelpos-api-client` — Shared API client & error normalization

**Metadata:** ID `idt-sentinelpos-api-client` · Target `src/lib/apiClient.ts` · Prerequisites: none · Difficulty: Foundation

**Backend API Contract:** wraps the common shape of both real endpoints — every error is
`{ error: string }` at 400/404/409; every success is the bare resource at 200. `API_BASE` is `/api`
here too (`server/sentinelpos-router.js` is mounted at `/api`, its own routes start `/v1/...`).

**Steps 1-6:** identical to MiniERP's T3 (same `ApiError` class, same `apiRequest`/`apiGet`/`apiPost`
primitives) — this file is genuinely identical across every product in this platform, since it wraps
nothing product-specific.

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

### T4 — `idt-sentinelpos-incident-queue` — Open-incident queue

**Metadata:** ID `idt-sentinelpos-incident-queue` · Target `src/components/IncidentQueue.tsx` · Prerequisites: T1, T3 · Difficulty: Domain

**Backend API Contract:** `GET /api/v1/incidents` → `200`
`Incident[]` where
`Incident = { id, incidentCode, cashier: { name, employeeNumber }, severity: "CRITICAL"|"HIGH"|"MEDIUM"; zScore: number; flaggedAmount: number; status: "OPEN"; events: { type: string; amount: number; at: string }[] }`
— the endpoint only ever returns `OPEN` incidents (a resolved one drops off the list server-side).

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/IncidentQueue.tsx`. Base
export `IncidentQueue()` — no props; this is the top-level screen for the whole app.

**Step 2 — External Dependencies & Imports.** `react`'s `useEffect/useState`; `apiGet`; `useToast`;
`TableSkeleton` from `./Skeletons` (T8); `IncidentDetailDrawer` from `./IncidentDetailDrawer` (T5).

**Step 3 — Internal Scope & State Initialization.** `incidents: Incident[]`, `loading`, `error`
(same three-state shape used everywhere in this platform's curriculum); `selectedId: string | null` —
which row's detail drawer is open, owned here (not inside T5 itself) since only one drawer can be
open at a time and the queue is what renders the row that triggers it.

**Step 4 — Lifecycle & Data Fetching.** Mount-time `useEffect` fetching `/v1/incidents`; a second
`useEffect` subscribes to a `window` `"incident:resolved"` event (dispatched by T6 on a successful
resolve) that both clears `selectedId` (closing the drawer, since its incident no longer exists in the
open queue) and bumps a `reloadToken` to re-fetch.

**Step 5 — Event Handlers & Mutations.** `handleSelectRow(id)` sets `selectedId`;
`handleCloseDrawer` clears it back to `null`.

**Step 6 — Render View & Branching States.** `loading` → `<TableSkeleton rows={3} />`; `error` → retry
banner; empty → "No open incidents — the queue is clear."; populated → a table sorted by severity
(`CRITICAL` first), each row clickable, rendering `<IncidentDetailDrawer incident={selected}
onClose={handleCloseDrawer} />` beneath the table when `selectedId` resolves to a real incident.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useEffect, useState } from "react";
import { apiGet } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";
import { TableSkeleton } from "./Skeletons";
import IncidentDetailDrawer from "./IncidentDetailDrawer";

export type Incident = {
  id: string;
  incidentCode: string;
  cashier: { name: string; employeeNumber: string };
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  zScore: number;
  flaggedAmount: number;
  status: "OPEN";
  events: { type: string; amount: number; at: string }[];
};

const SEVERITY_RANK: Record<Incident["severity"], number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2 };

export default function IncidentQueue() {
  const { pushToast } = useToast();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet<Incident[]>("/v1/incidents")
      .then((data) => {
        if (!cancelled) setIncidents(data);
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Couldn't load the incident queue.";
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
    function handleResolved() {
      setSelectedId(null);
      setReloadToken((t) => t + 1);
    }
    window.addEventListener("incident:resolved", handleResolved);
    return () => window.removeEventListener("incident:resolved", handleResolved);
  }, []);

  function handleSelectRow(id: string) {
    setSelectedId(id);
  }

  function handleCloseDrawer() {
    setSelectedId(null);
  }

  if (loading) return <TableSkeleton rows={3} />;

  if (error) {
    return (
      <div className="incident-queue-error">
        <p>{error}</p>
        <button type="button" onClick={() => setReloadToken((t) => t + 1)}>
          Try again
        </button>
      </div>
    );
  }

  if (incidents.length === 0) {
    return <p className="incident-queue-empty">No open incidents — the queue is clear.</p>;
  }

  const sorted = [...incidents].sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);
  const selected = sorted.find((i) => i.id === selectedId) ?? null;

  return (
    <div className="incident-queue">
      <table className="incident-queue-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Cashier</th>
            <th>Severity</th>
            <th>Z-score</th>
            <th>Flagged amount</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((incident) => (
            <tr
              key={incident.id}
              className={`incident-queue-row incident-queue-row-${incident.severity.toLowerCase()}`}
              onClick={() => handleSelectRow(incident.id)}
            >
              <td>{incident.incidentCode}</td>
              <td>{incident.cashier.name}</td>
              <td>{incident.severity}</td>
              <td>{incident.zScore.toFixed(1)}</td>
              <td>${incident.flaggedAmount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && <IncidentDetailDrawer incident={selected} onClose={handleCloseDrawer} />}
    </div>
  );
}
```

---

### T5 — `idt-sentinelpos-incident-detail-drawer` — Incident detail drawer + event timeline

**Metadata:** ID `idt-sentinelpos-incident-detail-drawer` · Target `src/components/IncidentDetailDrawer.tsx` · Prerequisites: T4 · Difficulty: Interactive

**Backend API Contract:** none directly — every field this task renders (`events`, `cashier`,
`zScore`) is already present on the `Incident` object T4 fetched; this task takes it as a prop rather
than re-fetching a single-incident detail endpoint (the real backend has none — `GET /v1/incidents`
is the only read, list-shaped, and it already embeds the full `events` array per incident).

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/IncidentDetailDrawer.tsx`.
Base export `IncidentDetailDrawer({ incident, onClose }: { incident: Incident; onClose: () => void })`.

**Step 2 — External Dependencies & Imports.** `react` only, for the `Incident` type (re-declared or
imported from `./IncidentQueue` — imported here, since T4 is this task's one real prerequisite and
already exports the type). `ResolveIncidentAction` from `./ResolveIncidentAction` (T6).

**Step 3 — Internal Scope & State Initialization.** None — this component has no state of its own; it
is a pure display of the `incident` prop plus a mount point for T6's own (separately stateful)
resolve action.

**Step 4 — Lifecycle & Data Fetching.** None.

**Step 5 — Event Handlers & Mutations.** None directly — `onClose` is called verbatim on the drawer's
own close button; resolving is entirely T6's responsibility.

**Step 6 — Render View & Branching States.** A panel showing the incident code, cashier, severity,
flagged amount, a chronological list of every event in `incident.events` (type, amount, timestamp),
a close button, and `<ResolveIncidentAction incident={incident} />` at the bottom. No loading/error
branches — everything here is already-loaded data, nothing async happens in this file itself.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import type { Incident } from "./IncidentQueue";
import ResolveIncidentAction from "./ResolveIncidentAction";

export default function IncidentDetailDrawer({ incident, onClose }: { incident: Incident; onClose: () => void }) {
  return (
    <div className="incident-detail-drawer" role="dialog" aria-label={`Incident ${incident.incidentCode}`}>
      <div className="incident-detail-header">
        <h2>{incident.incidentCode}</h2>
        <button type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      <dl className="incident-detail-summary">
        <div>
          <dt>Cashier</dt>
          <dd>
            {incident.cashier.name} (#{incident.cashier.employeeNumber})
          </dd>
        </div>
        <div>
          <dt>Severity</dt>
          <dd>{incident.severity}</dd>
        </div>
        <div>
          <dt>Z-score</dt>
          <dd>{incident.zScore.toFixed(1)}</dd>
        </div>
        <div>
          <dt>Flagged amount</dt>
          <dd>${incident.flaggedAmount.toFixed(2)}</dd>
        </div>
      </dl>
      <h3>Event timeline</h3>
      <ol className="incident-detail-events">
        {incident.events.map((event, index) => (
          <li key={index}>
            <span className="incident-detail-event-type">{event.type}</span>
            <span className="incident-detail-event-amount">${event.amount.toFixed(2)}</span>
            <span className="incident-detail-event-at">{new Date(event.at).toLocaleString()}</span>
          </li>
        ))}
      </ol>
      <ResolveIncidentAction incident={incident} />
    </div>
  );
}
```

---

### T6 — `idt-sentinelpos-resolve-dispatcher` — Resolve action + confirm + notes

**Metadata:** ID `idt-sentinelpos-resolve-dispatcher` · Target `src/components/ResolveIncidentAction.tsx` · Prerequisites: T2, T5 · Difficulty: Interactive

**Backend API Contract:** `POST /api/v1/incidents/:id/resolve` body
`{ status: "RESOLVED_CONFIRMED_LOSS" | "RESOLVED_DISMISSED"; resolutionNotes?: string }` → `200`
the updated incident; `404 { error: "Incident not found" }`;
`409 { error: "ALREADY_RESOLVED: incident is <status>" }`;
`400 { error: "status must be RESOLVED_CONFIRMED_LOSS or RESOLVED_DISMISSED" }`.

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/ResolveIncidentAction.tsx`.
Base export `ResolveIncidentAction({ incident }: { incident: Incident })`.

**Step 2 — External Dependencies & Imports.** `react`'s `useState`; `apiPost`, `ApiError`; `useToast`.

**Step 3 — Internal Scope & State Initialization.** `resolutionNotes: string` (the analyst's free-text
justification, required by neither the UI nor the backend, but always collected before either
resolution path fires — a real analyst tool should never let a loss get confirmed or dismissed with
zero paper trail, even though the backend itself treats it as optional); `pendingStatus:
"RESOLVED_CONFIRMED_LOSS" | "RESOLVED_DISMISSED" | null` (which resolution is mid-confirm);
`submitting: boolean`.

**Step 4 — Lifecycle & Data Fetching.** None.

**Step 5 — Event Handlers & Mutations.** `handleAskConfirmLoss`/`handleAskDismiss` set `pendingStatus`
(both routes are genuinely destructive — an incident leaves the queue forever either way — so both
get a confirm step, unlike MiniERP's asymmetric approve-vs-cancel treatment); `handleConfirm` posts
to `/v1/incidents/:id/resolve` with `{ status: pendingStatus, resolutionNotes }`, dispatches
`window.dispatchEvent(new CustomEvent("incident:resolved"))` on success (T4 listens for exactly this),
and `pushToast`s the outcome either way; `handleCancelConfirm` clears `pendingStatus` without calling
anything.

**Step 6 — Render View & Branching States.** A `<textarea>` for `resolutionNotes` always visible;
below it, two buttons ("Confirm loss" / "Dismiss as false positive") when `!pendingStatus`; a confirm
strip ("Really mark this as a confirmed loss?" + Confirm/Back) when `pendingStatus` is set, both
disabled while `submitting`.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useState } from "react";
import { apiPost, ApiError } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";
import type { Incident } from "./IncidentQueue";

type ResolutionStatus = "RESOLVED_CONFIRMED_LOSS" | "RESOLVED_DISMISSED";

export default function ResolveIncidentAction({ incident }: { incident: Incident }) {
  const { pushToast } = useToast();
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [pendingStatus, setPendingStatus] = useState<ResolutionStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleAskConfirmLoss() {
    setPendingStatus("RESOLVED_CONFIRMED_LOSS");
  }

  function handleAskDismiss() {
    setPendingStatus("RESOLVED_DISMISSED");
  }

  function handleCancelConfirm() {
    setPendingStatus(null);
  }

  async function handleConfirm() {
    if (!pendingStatus) return;
    setSubmitting(true);
    try {
      await apiPost(`/v1/incidents/${incident.id}/resolve`, { status: pendingStatus, resolutionNotes });
      pushToast(
        `${incident.incidentCode} ${pendingStatus === "RESOLVED_CONFIRMED_LOSS" ? "marked as a confirmed loss" : "dismissed"}.`,
        "success",
      );
      window.dispatchEvent(new CustomEvent("incident:resolved"));
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't resolve this incident — please try again.";
      pushToast(message, "error");
    } finally {
      setSubmitting(false);
      setPendingStatus(null);
    }
  }

  return (
    <div className="resolve-incident-action">
      <label>
        Resolution notes
        <textarea
          value={resolutionNotes}
          onChange={(e) => setResolutionNotes(e.target.value)}
          disabled={submitting}
          placeholder="What did you find while reviewing this incident?"
        />
      </label>
      {pendingStatus ? (
        <div className="resolve-incident-confirm">
          <p>
            Really {pendingStatus === "RESOLVED_CONFIRMED_LOSS" ? "mark this as a confirmed loss" : "dismiss this as a false positive"}?
          </p>
          <button type="button" onClick={handleConfirm} disabled={submitting}>
            {submitting ? "Working…" : "Confirm"}
          </button>
          <button type="button" onClick={handleCancelConfirm} disabled={submitting}>
            Back
          </button>
        </div>
      ) : (
        <div className="resolve-incident-buttons">
          <button type="button" onClick={handleAskConfirmLoss} disabled={submitting}>
            Confirm loss
          </button>
          <button type="button" onClick={handleAskDismiss} disabled={submitting}>
            Dismiss as false positive
          </button>
        </div>
      )}
    </div>
  );
}
```

---

### T7 — `idt-sentinelpos-error-boundary` — App-wide error boundary

**Metadata:** ID `idt-sentinelpos-error-boundary` · Target `src/components/ErrorBoundary.tsx` · Prerequisites: T1 · Difficulty: Resilience

Identical in every respect to MiniERP's T18 — same class-component mechanism, same reasoning for why
it must be a class, same honest "no error-monitoring service wired in yet" note in
`componentDidCatch`.

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

### T8 — `idt-sentinelpos-skeleton-loaders` — Loading skeleton library

**Metadata:** ID `idt-sentinelpos-skeleton-loaders` · Target `src/components/Skeletons.tsx` · Prerequisites: none · Difficulty: Resilience

Only `TableSkeleton` is actually consumed (by T4) — `BoardSkeleton`/`ReportSkeleton` aren't needed by
any real screen in this product (there's no board or report view here), so this file exports only
what's used rather than padding in unused exports for symmetry with MiniERP's library.

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

### T9 — `idt-sentinelpos-offline-queue` — Offline banner + resolve retry queue

**Metadata:** ID `idt-sentinelpos-offline-queue` · Target `src/providers/OfflineQueueProvider.tsx` · Prerequisites: T2, T3 · Difficulty: Resilience

**Backend API Contract:** none new — wraps T6's existing `apiPost` call.

**Step 1 — File Scaffolding & Component Shell.** Create `src/providers/OfflineQueueProvider.tsx`.
Same provider/hook shape as MiniERP's T20, scoped to this product's one real mutation (resolving an
incident) rather than six.

**Step 2 — External Dependencies & Imports.** Identical to MiniERP's T20.

**Step 3 — Internal Scope & State Initialization.** Identical shape (`isOnline`, `queue`), with the
`localStorage` key namespaced `sentinelpos-offline-queue` so it can never collide with another
product's queue if these apps are ever served from the same browser profile during local testing.

**Step 4 — Lifecycle & Data Fetching.** Identical to MiniERP's T20 — online/offline listeners, drain
effect.

**Step 5 — Event Handlers & Mutations.** Identical `enqueueOrSend` passthrough-or-queue behavior. The
one real caller in this product would be T6's `handleConfirm`, swapping its direct `apiPost` call for
`enqueueOrSend` if this task is wired in after T6 — same explicit, not-automatic integration note as
MiniERP's equivalent task.

**Step 6 — Render View & Branching States.** Identical banner.

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

const STORAGE_KEY = "sentinelpos-offline-queue";
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
    // Best-effort only — see MiniERP's identical note in its own OfflineQueueProvider.
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

---

## What's deliberately not in this backlog

- **The four unbuilt backend capabilities** (API-key tenant middleware, Redis-buffered ingestion, the
  real Z-score anomaly engine, the WORM evidence vault) — no FE task invents a screen against them.
- **A single-incident detail endpoint** — not needed; the list endpoint already embeds full event
  data per incident, so T5 reads from what T4 already fetched rather than issuing a second request.
- **Filtering/sorting controls beyond severity-sort** — the real dataset is three seeded incidents;
  a filter bar over three rows would be speculative UI against no real demonstrated need. Worth
  revisiting once/if the ingestion pipeline is real and the queue can actually grow unbounded.
