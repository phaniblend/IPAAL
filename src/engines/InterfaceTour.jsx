import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** Above editor workspace (10020) and app chrome (~10k), below lesson modals (11009+), reading/deep-dive (11040+). */
const OVERLAY_Z = 10028;
const TOOLTIP_Z = 10029;
const TOOLTIP_MAX_W = 380;
/** Keep tooltip clear of fixed “Help: Tour” (top-right, z-index ~12040 — above this card). */
const RESERVE_TOP_RIGHT_FOR_HELP_PX = 140;

function isTourTargetVisible(el) {
  if (!(el instanceof Element)) return false;
  if (el.closest?.("[data-inpact-editor-workspace=\"closed\"]")) return false;
  let n = el;
  while (n && n instanceof Element) {
    const st = window.getComputedStyle(n);
    if (st.display === "none" || st.visibility === "hidden" || Number(st.opacity) === 0) return false;
    n = n.parentElement;
  }
  return true;
}

/**
 * Prefer the first matching element that is actually on-screen (avoids duplicate `data-tour-id`
 * in hidden modals or `visibility:hidden` shells).
 */
function queryTourTargetElement(selector) {
  if (typeof selector !== "string" || !selector.trim()) return null;
  let list;
  try {
    list = document.querySelectorAll(selector);
  } catch {
    try {
      const el = document.querySelector(selector);
      if (!(el instanceof Element) || !isTourTargetVisible(el)) return null;
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return null;
      return el;
    } catch {
      return null;
    }
  }
  if (!list?.length) return null;
  /** Prefer a target inside the open editor workspace when duplicates exist (lesson shell vs modal). */
  const candidates = [];
  for (const el of list) {
    if (!(el instanceof Element)) continue;
    if (!isTourTargetVisible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    candidates.push(el);
  }
  if (candidates.length === 0) return null;
  const inOpenWorkspace = candidates.find((el) => el.closest?.('[data-inpact-editor-workspace="open"]'));
  return inOpenWorkspace || candidates[0];
}

/**
 * Guided tour overlay: dims the screen, spotlights `[data-tour-id="…"]` targets, and shows step copy.
 * Props:
 * - steps: { selector: string, text: string, action?: { type: string } }[]
 * - onRequestAction: (action) => void — e.g. switch lesson/editor tab before measuring
 * - forceStartNonce: increment to (re)start the tour (uses initialStepIndex for the first step)
 * - lessonKey: when it changes to a different lesson, closes the tour (initial mount does not auto-close)
 * - blockTour: when true, closes the tour (e.g. example / feedback / mentor dialogs stacked above it)
 * - initialStepIndex: starting step when forceStartNonce fires (0 … steps.length-1)
 * - onOpenChange: notifies parent when the tour opens or closes
 * - onLastStepDone: called when the learner finishes the final step (Done) or skips on the last step
 */
export default function InterfaceTour({
  steps = [],
  onRequestAction,
  forceStartNonce = 0,
  lessonKey = "",
  blockTour = false,
  initialStepIndex = 0,
  onOpenChange,
  onLastStepDone,
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [box, setBox] = useState(null);
  const [missing, setMissing] = useState(false);
  const prevLessonKeyRef = useRef(null);

  useEffect(() => {
    if (forceStartNonce <= 0) return undefined;
    const id = requestAnimationFrame(() => {
      // Clear stale geometry from the previous run (e.g. last step = Help) so we never
      // position the first frame off-screen or under the fixed Help button (higher z-index).
      setBox(null);
      setMissing(false);
      const last = Math.max(0, steps.length - 1);
      const raw =
        typeof initialStepIndex === "number" && Number.isFinite(initialStepIndex)
          ? Math.trunc(initialStepIndex)
          : 0;
      setIndex(Math.max(0, Math.min(raw, last)));
      setOpen(true);
    });
    return () => cancelAnimationFrame(id);
  }, [forceStartNonce, initialStepIndex, steps.length]);

  useEffect(() => {
    const prev = prevLessonKeyRef.current;
    prevLessonKeyRef.current = lessonKey;
    if (prev === null || prev === lessonKey) return undefined;
    const id = requestAnimationFrame(() => {
      setOpen(false);
    });
    return () => cancelAnimationFrame(id);
  }, [lessonKey]);

  useEffect(() => {
    if (!blockTour) return undefined;
    setOpen(false);
  }, [blockTour]);

  useEffect(() => {
    if (!open) setBox(null);
  }, [open]);

  const step = steps[index];
  const total = steps.length;
  const isLast = index >= total - 1;

  const measureStep = useCallback(() => {
    if (!step?.selector) {
      setBox(null);
      setMissing(true);
      return;
    }
    const el = queryTourTargetElement(step.selector);
    if (el) {
      el.scrollIntoView({ block: "nearest", behavior: "instant" });
      const r = el.getBoundingClientRect();
      if (r.width >= 2 && r.height >= 2) {
        setBox({ left: r.left, top: r.top, width: r.width, height: r.height });
        setMissing(false);
        return;
      }
    }
    setBox(null);
    setMissing(true);
  }, [step]);

  useLayoutEffect(() => {
    if (!open || !step) return undefined;
    onRequestAction?.(step.action);
    let cancelled = false;
    const run = () => {
      if (!cancelled) measureStep();
    };
    run();
    const t1 = setTimeout(run, 90);
    const t2 = setTimeout(run, 280);
    const t3 = setTimeout(run, 520);
    return () => {
      cancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [open, index, step, onRequestAction, measureStep]);

  useEffect(() => {
    if (!open) return undefined;
    const onResize = () => measureStep();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open, measureStep]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  if (!open || !step || total === 0) return null;

  const goNext = () => {
    if (isLast) {
      onLastStepDone?.();
      setOpen(false);
    } else setIndex((i) => i + 1);
  };

  const tooltipPos = (() => {
    if (missing || !box) {
      return {
        left: "50%",
        top: "50%",
        // Nudge left so the card clears fixed “Help: Tour” (top-right) while still centered-ish.
        transform: "translate(calc(-50% - min(56px, 8vw)), -50%)",
        maxWidth: TOOLTIP_MAX_W,
      };
    }
    const margin = 16;
    /** Gap between tooltip and spotlight target (px). */
    const gap = 10;
    /** Estimated max tooltip height for placement (card can grow; keep conservative). */
    const approxH = 260;
    let left = box.left + box.width / 2 - TOOLTIP_MAX_W / 2;
    const maxLeft = window.innerWidth - TOOLTIP_MAX_W - margin - RESERVE_TOP_RIGHT_FOR_HELP_PX;
    left = Math.max(margin, Math.min(left, maxLeft));

    // Prefer tooltip *above* the feature: bottom edge `gap` px above target top.
    const fitsAbove = box.top - gap - approxH >= margin;
    if (fitsAbove) {
      return {
        left,
        bottom: window.innerHeight - box.top + gap,
        top: "auto",
        maxWidth: TOOLTIP_MAX_W,
        transform: "none",
      };
    }
    // Not enough room above viewport: place below target with same gap.
    return {
      left,
      top: box.bottom + gap,
      bottom: "auto",
      maxWidth: TOOLTIP_MAX_W,
      transform: "none",
    };
  })();

  const spotlight =
    box && !missing ? (
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: box.left - 8,
          top: box.top - 8,
          width: box.width + 16,
          height: box.height + 16,
          borderRadius: 12,
          boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.75)",
          pointerEvents: "none",
          zIndex: OVERLAY_Z,
          transition: "left 0.12s ease-out, top 0.12s ease-out, width 0.12s ease-out, height 0.12s ease-out",
        }}
      />
    ) : (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.75)",
          zIndex: OVERLAY_Z,
          pointerEvents: "auto",
        }}
      />
    );

  const card = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="inpact-tour-title"
      style={{
        position: "fixed",
        zIndex: TOOLTIP_Z,
        padding: "18px 20px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
        border: "1px solid #e2e8f0",
        pointerEvents: "auto",
        ...tooltipPos,
      }}
    >
      <p id="inpact-tour-title" style={{ margin: "0 0 14px", fontSize: "15px", lineHeight: 1.55, color: "#0f172a" }}>
        {step.text}
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "11px", color: "#94a3b8" }}>
          {index + 1} / {total}
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => {
              if (isLast) onLastStepDone?.();
              setOpen(false);
            }}
            style={{
              padding: "8px 14px",
              fontSize: "13px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              background: "#fff",
              color: "#475569",
              cursor: "pointer",
            }}
          >
            Skip
          </button>
          <button
            type="button"
            onClick={goNext}
            style={{
              padding: "8px 14px",
              fontSize: "13px",
              borderRadius: "8px",
              border: "none",
              background: "#0891b2",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {isLast ? "Done" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(
    <>
      {spotlight}
      {card}
    </>,
    document.body
  );
}
