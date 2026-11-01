# RouteMatrix — Frontend Task Backlog (WBS v2)

**Status: authored 2026-09-11, not yet published to OneDev or fed through SpecForge.** Same
ground-truth-spec status and shared conventions as `docs/curriculum/minierp-fe-tasks.md` — read that
file's header first; it isn't re-argued line by line here.

## Why this backlog is 10 tasks, not 20

`server/routematrix-router.js`'s own top comment is explicit: the spec's capacitated Haversine
route-optimizer (its TASK 1) has no FE task calling it — RouteStopBoard never creates a route, only
ever shows a driver's already-assigned one and completes stops on it — so it was never built; a route
is seeded pre-optimized instead. The real, buildable surface is two endpoints:
`GET /v1/routes/active` and `POST /v1/routes/stops/:stopId/complete`. Same proportional-scoping
reasoning as the SentinelPOS document — a backlog this small reflects a backend this small, not less
rigor spent on it.

## Architectural calls specific to this product

1. **Signature capture is a real, distinct interactive task (T6), not a stub.** The backend requires
   a non-empty `signatureData` string to complete a stop — this is the one product in the four where
   a genuinely new interaction primitive (freehand canvas drawing) is needed, not just forms and
   buttons. Given its own task rather than folded into the completion dispatcher, since "capture a
   signature" and "submit a completion" are two different concerns a reader shouldn't have to learn
   at once.
2. **Offline support is the single most product-relevant resilience task in this entire four-product
   backlog.** A route stop is completed by a driver in the field, plausibly out of signal — unlike
   MiniERP's back-office clerk or SentinelPOS's desk analyst. T10 is written with that real scenario
   in mind, not as a generic checkbox item.
3. **Supersedes the existing `idt-routematrix-stopboard` task**
   (`src/engines/assist/inpact_assist_idt-routematrix-stopboard_engine.tsx`), decomposed into T4
   (the board), T5 (stop detail), T6 (signature capture), T7 (the actual complete action) — same
   non-deletion caveat as the other two documents.

---

## Phase 1 — Feature-to-Task Matrix (Task Dependency Graph)

```
[Design Spec: this document]
        |
        v
  TIER 1 — Foundation & Context Layer
        |
        +--> T1 idt-routematrix-app-shell      (header shell)
        +--> T2 idt-routematrix-toast-provider  (needs T1)
        +--> T3 idt-routematrix-api-client      (no UI dependency)
        |
        v
  TIER 2 — Domain Feature Slice
        |
        +--> T4 idt-routematrix-stop-board      (needs T1, T3)
        |
        v
  TIER 3 — Interactive & Mutation Layers
        |
        +--> T5 idt-routematrix-stop-detail-drawer   (mounts into T4)
        +--> T6 idt-routematrix-signature-capture    (standalone primitive, no data dependency)
        +--> T7 idt-routematrix-complete-stop-dispatcher  (mounts into T5; needs T2, T6)
        |
        v
  TIER 4 — Resilience & Offline Layers
        |
        +--> T8  idt-routematrix-error-boundary   (wraps T1 — needs T1)
        +--> T9  idt-routematrix-skeleton-loaders  (consumed by T4's loading branch)
        +--> T10 idt-routematrix-offline-queue     (wraps T3 — needs T2, T3; the real field-driver case)
        |
        v
  App Closeout: the active route's stops (T4) reachable from the shell, each stop's detail (T5)
  reachable from its row, a real signature (T6) required before completion (T7) can fire, the whole
  surface wrapped in T8/T9/T10 — completion attempted in a dead zone queues instead of failing.
```

| # | Task ID | Tier | Name | Target File | Prerequisites |
|---|---|---|---|---|---|
| 1 | `idt-routematrix-app-shell` | Foundation | App shell & route header | `src/layout/AppShell.tsx` | none |
| 2 | `idt-routematrix-toast-provider` | Foundation | Global toast/notification provider | `src/providers/ToastProvider.tsx` | T1 |
| 3 | `idt-routematrix-api-client` | Foundation | Shared API client & error normalization | `src/lib/apiClient.ts` | none |
| 4 | `idt-routematrix-stop-board` | Domain | Active route's stop board | `src/components/StopBoard.tsx` | T1, T3 |
| 5 | `idt-routematrix-stop-detail-drawer` | Interactive | Stop detail drawer | `src/components/StopDetailDrawer.tsx` | T4 |
| 6 | `idt-routematrix-signature-capture` | Interactive | Signature capture pad | `src/components/SignatureCapture.tsx` | none |
| 7 | `idt-routematrix-complete-stop-dispatcher` | Interactive | Complete-stop action | `src/components/CompleteStopAction.tsx` | T2, T5, T6 |
| 8 | `idt-routematrix-error-boundary` | Resilience | App-wide error boundary | `src/components/ErrorBoundary.tsx` | T1 |
| 9 | `idt-routematrix-skeleton-loaders` | Resilience | Loading skeleton library | `src/components/Skeletons.tsx` | none |
| 10 | `idt-routematrix-offline-queue` | Resilience | Offline banner + completion retry queue | `src/providers/OfflineQueueProvider.tsx` | T2, T3 |

**Completeness check:**

| Backend capability | Covered by |
|---|---|
| `GET /v1/routes/active` (including the `null` no-active-route case) | T4 |
| `POST /v1/routes/stops/:stopId/complete` | T5, T6, T7 |
| Cross-cutting: loading/error/empty, signature capture, offline completion | T8, T9, T10 |

---

## Phase 2 — Fully Expanded Task Specifications

---

### T1 — `idt-routematrix-app-shell` — App shell & route header

**Metadata:** ID `idt-routematrix-app-shell` · Target `src/layout/AppShell.tsx` · Prerequisites: none · Difficulty: Foundation

**Backend API Contract:** none — pure layout.

**Step 1 — File Scaffolding & Component Shell.** Create `src/layout/AppShell.tsx`. Base export
`AppShell({ children, routeCode, routeStatus }: { children: ReactNode; routeCode: string | null; routeStatus: string | null })`
— both route fields are props (owned by T4, the only component that actually knows them), `null`
when there's no active route.

**Step 2 — External Dependencies & Imports.** `react`'s `type ReactNode` only.

**Step 3 — Internal Scope & State Initialization.** None.

**Step 4 — Lifecycle & Data Fetching.** None.

**Step 5 — Event Handlers & Mutations.** None.

**Step 6 — Render View & Branching States.** A `<header>` showing "RouteMatrix" plus the route code
and status when both are non-null, or "No active route" when `routeCode` is `null`; a `<main>`
rendering `children`.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import type { ReactNode } from "react";

export default function AppShell({
  children,
  routeCode,
  routeStatus,
}: {
  children: ReactNode;
  routeCode: string | null;
  routeStatus: string | null;
}) {
  return (
    <div className="app-shell">
      <header className="app-shell-header">
        <h1>RouteMatrix</h1>
        <span className="app-shell-route-info">{routeCode ? `${routeCode} — ${routeStatus}` : "No active route"}</span>
      </header>
      <main className="app-shell-main">{children}</main>
    </div>
  );
}
```

---

### T2 — `idt-routematrix-toast-provider` — Global toast/notification provider

**Metadata:** ID `idt-routematrix-toast-provider` · Target `src/providers/ToastProvider.tsx` · Prerequisites: T1 · Difficulty: Foundation

Identical to MiniERP's T2 / SentinelPOS's T2 — same provider/hook pair, same 4s auto-dismiss.

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

### T3 — `idt-routematrix-api-client` — Shared API client & error normalization

**Metadata:** ID `idt-routematrix-api-client` · Target `src/lib/apiClient.ts` · Prerequisites: none · Difficulty: Foundation

Identical to the other two products' equivalent task.

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

### T4 — `idt-routematrix-stop-board` — Active route's stop board

**Metadata:** ID `idt-routematrix-stop-board` · Target `src/components/StopBoard.tsx` · Prerequisites: T1, T3 · Difficulty: Domain

**Backend API Contract:** `GET /api/v1/routes/active` → `200`
`Route | null` where
`Route = { id, routeCode, status: "ASSIGNED"|"ACTIVE"|"COMPLETED"; stops: Stop[] }` and
`Stop = { id, sequence, status: "PENDING"|"COMPLETED"; customerName, customerAddress; signatureData?: string; completedAt?: string }`.
A `null` body is a real, valid 200 response (no active route), not an error — this is the one screen
in the whole four-product backlog whose "empty" state is a genuinely different HTTP shape (`null`
instead of `[]`), not just an empty array, and the code below has to check for it explicitly.

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/StopBoard.tsx`. Base export
`StopBoard()` — no props.

**Step 2 — External Dependencies & Imports.** `react`'s `useEffect/useState`; `apiGet`; `useToast`;
`TableSkeleton` from `./Skeletons` (T9); `StopDetailDrawer` from `./StopDetailDrawer` (T5).

**Step 3 — Internal Scope & State Initialization.** `route: Route | null` (distinct from `loading` —
`null` after loading finishes means "genuinely no active route," not "hasn't loaded yet"), `loading`,
`error`, `selectedStopId: string | null`.

**Step 4 — Lifecycle & Data Fetching.** Mount-time `useEffect` fetching `/v1/routes/active`; a second
`useEffect` subscribes to `window`'s `"stop:completed"` event (dispatched by T7) to clear
`selectedStopId` and bump a `reloadToken`.

**Step 5 — Event Handlers & Mutations.** `handleSelectStop(id)`/`handleCloseDrawer` — same pattern as
SentinelPOS's T4.

**Step 6 — Render View & Branching States.** `loading` → `<TableSkeleton rows={3} />`; `error` → retry
banner; `route === null` (post-load) → "No active route assigned — check back once one is dispatched
to you."; `route.status === "COMPLETED"` → a distinct "Route complete — nice work!" state (not the
same as no-route-at-all, and not hidden — a driver should see confirmation their last stop closed out
the whole route); otherwise a sequence-ordered list of stops, each row showing sequence/customer/
status, clickable when `PENDING`, rendering `<StopDetailDrawer stop={selected} onClose={...} />`
beneath when a stop is selected.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useEffect, useState } from "react";
import { apiGet } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";
import { TableSkeleton } from "./Skeletons";
import StopDetailDrawer from "./StopDetailDrawer";

export type Stop = {
  id: string;
  sequence: number;
  status: "PENDING" | "COMPLETED";
  customerName: string;
  customerAddress: string;
  signatureData?: string;
  completedAt?: string;
};
export type Route = { id: string; routeCode: string; status: "ASSIGNED" | "ACTIVE" | "COMPLETED"; stops: Stop[] };

export default function StopBoard() {
  const { pushToast } = useToast();
  const [route, setRoute] = useState<Route | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet<Route | null>("/v1/routes/active")
      .then((data) => {
        if (!cancelled) setRoute(data);
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Couldn't load your active route.";
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
    function handleStopCompleted() {
      setSelectedStopId(null);
      setReloadToken((t) => t + 1);
    }
    window.addEventListener("stop:completed", handleStopCompleted);
    return () => window.removeEventListener("stop:completed", handleStopCompleted);
  }, []);

  function handleSelectStop(id: string) {
    setSelectedStopId(id);
  }

  function handleCloseDrawer() {
    setSelectedStopId(null);
  }

  if (loading) return <TableSkeleton rows={3} />;

  if (error) {
    return (
      <div className="stop-board-error">
        <p>{error}</p>
        <button type="button" onClick={() => setReloadToken((t) => t + 1)}>
          Try again
        </button>
      </div>
    );
  }

  if (route === null) {
    return <p className="stop-board-empty">No active route assigned — check back once one is dispatched to you.</p>;
  }

  if (route.status === "COMPLETED") {
    return <p className="stop-board-complete">Route {route.routeCode} complete — nice work!</p>;
  }

  const sorted = [...route.stops].sort((a, b) => a.sequence - b.sequence);
  const selected = sorted.find((s) => s.id === selectedStopId) ?? null;

  return (
    <div className="stop-board">
      <ol className="stop-board-list">
        {sorted.map((stop) => (
          <li
            key={stop.id}
            className={`stop-board-row stop-board-row-${stop.status.toLowerCase()}`}
            onClick={() => stop.status === "PENDING" && handleSelectStop(stop.id)}
          >
            <span className="stop-board-sequence">#{stop.sequence}</span>
            <span className="stop-board-customer">{stop.customerName}</span>
            <span className="stop-board-status">{stop.status}</span>
          </li>
        ))}
      </ol>
      {selected && <StopDetailDrawer stop={selected} onClose={handleCloseDrawer} />}
    </div>
  );
}
```

---

### T5 — `idt-routematrix-stop-detail-drawer` — Stop detail drawer

**Metadata:** ID `idt-routematrix-stop-detail-drawer` · Target `src/components/StopDetailDrawer.tsx` · Prerequisites: T4 · Difficulty: Interactive

**Backend API Contract:** none directly — every field rendered here (`customerName`,
`customerAddress`, `sequence`) is already on the `Stop` object T4 fetched; passed as a prop, no
second fetch (the real backend has no single-stop detail endpoint).

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/StopDetailDrawer.tsx`. Base
export `StopDetailDrawer({ stop, onClose }: { stop: Stop; onClose: () => void })`.

**Step 2 — External Dependencies & Imports.** `Stop` type imported from `./StopBoard`;
`CompleteStopAction` from `./CompleteStopAction` (T7).

**Step 3 — Internal Scope & State Initialization.** None — pure display plus a mount point for T7.

**Step 4 — Lifecycle & Data Fetching.** None.

**Step 5 — Event Handlers & Mutations.** None directly.

**Step 6 — Render View & Branching States.** Customer name/address/sequence, a close button, and
`<CompleteStopAction stop={stop} />` at the bottom.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import type { Stop } from "./StopBoard";
import CompleteStopAction from "./CompleteStopAction";

export default function StopDetailDrawer({ stop, onClose }: { stop: Stop; onClose: () => void }) {
  return (
    <div className="stop-detail-drawer" role="dialog" aria-label={`Stop #${stop.sequence}`}>
      <div className="stop-detail-header">
        <h2>Stop #{stop.sequence}</h2>
        <button type="button" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      <dl className="stop-detail-summary">
        <div>
          <dt>Customer</dt>
          <dd>{stop.customerName}</dd>
        </div>
        <div>
          <dt>Address</dt>
          <dd>{stop.customerAddress}</dd>
        </div>
      </dl>
      <CompleteStopAction stop={stop} />
    </div>
  );
}
```

---

### T6 — `idt-routematrix-signature-capture` — Signature capture pad

**Metadata:** ID `idt-routematrix-signature-capture` · Target `src/components/SignatureCapture.tsx` · Prerequisites: none · Difficulty: Interactive

**Backend API Contract:** none directly — this component only ever produces the `signatureData`
string value T7 will send; it never calls the network itself.

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/SignatureCapture.tsx`. Base
export `SignatureCapture({ onChange }: { onChange: (dataUrl: string | null) => void })`, rendering a
bare `<canvas>` for now.

**Step 2 — External Dependencies & Imports.** `react`'s `useRef/useState`. No external drawing
library — freehand capture is implemented directly against the Canvas 2D API, since the real
requirement is "a non-empty signature string," not a specific vendor's signature-pad widget.

**Step 3 — Internal Scope & State Initialization.** `canvasRef = useRef<HTMLCanvasElement>(null)`;
`isDrawingRef = useRef(false)` (a ref, not state — whether the pointer is currently down doesn't need
to trigger a re-render, it only gates what the pointer-move handler does); `hasSignature: boolean`
(state — this *does* need to re-render, since it drives the "Clear" button's disabled state and is
what tells the parent whether there's anything to capture).

**Step 4 — Lifecycle & Data Fetching.** None — canvas setup (getting the 2D context, setting stroke
style) happens lazily inside the pointer handlers themselves via `canvasRef.current`, not in a
`useEffect`, since there's no external resource to synchronize with on mount.

**Step 5 — Event Handlers & Mutations.** `handlePointerDown` starts a path at the pointer's canvas-
relative coordinates and sets `isDrawingRef.current = true`; `handlePointerMove` draws a line segment
to the new position only while `isDrawingRef.current`; `handlePointerUp` sets it back `false`, flips
`hasSignature` to `true` on the first stroke, and calls `onChange(canvas.toDataURL())` so the parent
always has the latest drawing; `handleClear` wipes the canvas, resets `hasSignature` to `false`, and
calls `onChange(null)`.

**Step 6 — Render View & Branching States.** The `<canvas>` (pointer events wired to the three
handlers above) and a "Clear" button disabled when `!hasSignature`. No loading/error branches — a
canvas has neither.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useRef, useState } from "react";

export default function SignatureCapture({ onChange }: { onChange: (dataUrl: string | null) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);

  function getContext() {
    return canvasRef.current?.getContext("2d") ?? null;
  }

  function pointerPosition(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = getContext();
    if (!ctx) return;
    const { x, y } = pointerPosition(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawingRef.current = true;
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return;
    const ctx = getContext();
    if (!ctx) return;
    const { x, y } = pointerPosition(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  }

  function handlePointerUp() {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    setHasSignature(true);
    const dataUrl = canvasRef.current?.toDataURL() ?? null;
    onChange(dataUrl);
  }

  function handleClear() {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onChange(null);
  }

  return (
    <div className="signature-capture">
      <canvas
        ref={canvasRef}
        width={320}
        height={140}
        className="signature-capture-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      <button type="button" onClick={handleClear} disabled={!hasSignature}>
        Clear
      </button>
    </div>
  );
}
```

---

### T7 — `idt-routematrix-complete-stop-dispatcher` — Complete-stop action

**Metadata:** ID `idt-routematrix-complete-stop-dispatcher` · Target `src/components/CompleteStopAction.tsx` · Prerequisites: T2, T5, T6 · Difficulty: Interactive

**Backend API Contract:** `POST /api/v1/routes/stops/:stopId/complete` body
`{ signatureData: string }` → `200` the updated `Stop`; `404 { error: "Stop not found" }`;
`409 { error: "ALREADY_COMPLETED" }`; `400 { error: "signatureData is required" }`.

**Step 1 — File Scaffolding & Component Shell.** Create `src/components/CompleteStopAction.tsx`. Base
export `CompleteStopAction({ stop }: { stop: Stop })`.

**Step 2 — External Dependencies & Imports.** `react`'s `useState`; `apiPost`, `ApiError`; `useToast`;
`SignatureCapture` from `./SignatureCapture` (T6).

**Step 3 — Internal Scope & State Initialization.** `signatureData: string | null` (mirrors T6's
`onChange` output — this is the one piece of state this task adds beyond what T6 already manages
internally); `submitting: boolean`.

**Step 4 — Lifecycle & Data Fetching.** None.

**Step 5 — Event Handlers & Mutations.** `handleSignatureChange` is passed straight to
`<SignatureCapture onChange={...}>`, just setting `signatureData`; `handleComplete` posts
`{ signatureData }` to `/v1/routes/stops/:stopId/complete` (button disabled unless `signatureData` is
non-null — the backend's own 400 case for a missing signature should never actually be reachable
from this UI, since a real driver physically cannot submit without drawing first), dispatches
`window.dispatchEvent(new CustomEvent("stop:completed"))` on success, `pushToast`s either outcome.

**Step 6 — Render View & Branching States.** The signature pad always rendered, a "Complete stop"
button disabled while `!signatureData || submitting`. No confirm-dialog step here (unlike MiniERP's
destructive actions) — capturing a real signature *is* the confirmation; a second "are you sure"
prompt after a driver already signed would be redundant friction, not real safety.

**`[ 💡 Assist me ]` — complete file:**

```tsx
import { useState } from "react";
import { apiPost, ApiError } from "../lib/apiClient";
import { useToast } from "../providers/ToastProvider";
import SignatureCapture from "./SignatureCapture";
import type { Stop } from "./StopBoard";

export default function CompleteStopAction({ stop }: { stop: Stop }) {
  const { pushToast } = useToast();
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSignatureChange(dataUrl: string | null) {
    setSignatureData(dataUrl);
  }

  async function handleComplete() {
    if (!signatureData) return;
    setSubmitting(true);
    try {
      await apiPost(`/v1/routes/stops/${stop.id}/complete`, { signatureData });
      pushToast(`Stop #${stop.sequence} completed.`, "success");
      window.dispatchEvent(new CustomEvent("stop:completed"));
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Couldn't complete this stop — please try again.";
      pushToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="complete-stop-action">
      <p>Have the customer sign below to complete this stop.</p>
      <SignatureCapture onChange={handleSignatureChange} />
      <button type="button" onClick={handleComplete} disabled={!signatureData || submitting}>
        {submitting ? "Completing…" : "Complete stop"}
      </button>
    </div>
  );
}
```

---

### T8 — `idt-routematrix-error-boundary` — App-wide error boundary

**Metadata:** ID `idt-routematrix-error-boundary` · Target `src/components/ErrorBoundary.tsx` · Prerequisites: T1 · Difficulty: Resilience

Identical to the other two products' equivalent task.

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

### T9 — `idt-routematrix-skeleton-loaders` — Loading skeleton library

**Metadata:** ID `idt-routematrix-skeleton-loaders` · Target `src/components/Skeletons.tsx` · Prerequisites: none · Difficulty: Resilience

Only `TableSkeleton` is consumed (by T4), same "export only what's used" reasoning as SentinelPOS's
equivalent task.

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

### T10 — `idt-routematrix-offline-queue` — Offline banner + completion retry queue

**Metadata:** ID `idt-routematrix-offline-queue` · Target `src/providers/OfflineQueueProvider.tsx` · Prerequisites: T2, T3 · Difficulty: Resilience

**Backend API Contract:** none new — wraps T7's existing `apiPost` call. This is the one task across
all three products' documents so far where the offline scenario is a first-order real requirement,
not a generic checkbox: a driver completing a stop in a building's basement or a rural dead zone is
exactly what this queue exists for, and the signature the driver just captured (T6) must not be lost
just because the network happened to be down at that exact moment.

**Step 1-6:** identical shape and reasoning to the other two products' equivalent task (own
`localStorage` namespace `routematrix-offline-queue`, same online/offline listeners, same
drain-in-order-stop-on-first-failure behavior). The one integration difference worth naming: T7's
`handleComplete` would swap its direct `apiPost` call for `enqueueOrSend(path, { signatureData },
"stop completion")` if this task is wired in after T7 — and because `signatureData` is a full
canvas-exported PNG string (potentially tens of kilobytes), a real deployment should watch
`localStorage`'s ~5MB per-origin ceiling if a driver queues many stops offline in one shift; not
solved here, flagged as a real, size-dependent limit of this approach rather than assumed away.

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

const STORAGE_KEY = "routematrix-offline-queue";
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
    // Best-effort only — a full/blocked storage quota (real risk here given signatureData's size)
    // loses persistence across reloads, not correctness of the in-memory queue for this session.
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
      pushToast(`Saved offline — will send when you're back in signal (${description}).`, "success");
      return null;
    },
    [isOnline, pushToast],
  );

  return (
    <OfflineQueueContext.Provider value={{ isOnline, queueLength: queue.length, enqueueOrSend }}>
      {(!isOnline || queue.length > 0) && (
        <div className="offline-banner" role="status">
          {!isOnline
            ? `You're offline — ${queue.length} stop${queue.length === 1 ? "" : "s"} queued.`
            : `Sending ${queue.length} queued stop${queue.length === 1 ? "" : "s"}…`}
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

- **Route creation/optimization UI** — no FE task ever creates a route; the backend's optimizer isn't
  built, and there's no endpoint to call even if a UI existed for it.
- **Live map/GPS tracking** — the real backend has no location data at all (stops carry a static
  address string, not coordinates); a map view would be pure fiction against this contract.
- **Multi-route / route history for a driver** — `GET /v1/routes/active` returns at most one route;
  there's no endpoint listing past or future routes to build a history screen against.
