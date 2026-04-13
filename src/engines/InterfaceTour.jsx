import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

const OVERLAY_Z = 100050;
const TOOLTIP_Z = 100051;
const TOOLTIP_MAX_W = 380;

/**
 * Guided tour overlay: dims the screen, spotlights `[data-tour-id="…"]` targets, and shows step copy.
 * Props:
 * - steps: { selector: string, text: string, action?: { type: string } }[]
 * - onRequestAction: (action) => void — e.g. switch lesson/editor tab before measuring
 * - forceStartNonce: increment to (re)start the tour from step 0
 * - lessonKey: change closes an open tour
 */
export default function InterfaceTour({
  steps = [],
  onRequestAction,
  forceStartNonce = 0,
  lessonKey = "",
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [box, setBox] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (forceStartNonce <= 0) return undefined;
    const id = requestAnimationFrame(() => {
      setIndex(0);
      setOpen(true);
    });
    return () => cancelAnimationFrame(id);
  }, [forceStartNonce]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setOpen(false);
    });
    return () => cancelAnimationFrame(id);
  }, [lessonKey]);

  const step = steps[index];
  const total = steps.length;
  const isLast = index >= total - 1;

  const measureStep = useCallback(() => {
    if (!step?.selector) {
      setBox(null);
      setMissing(true);
      return;
    }
    const el = document.querySelector(step.selector);
    if (el) {
      el.scrollIntoView({ block: "nearest", behavior: "instant" });
      const r = el.getBoundingClientRect();
      if (r.width >= 0 && r.height >= 0) {
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

  if (!open || !step || total === 0) return null;

  const goNext = () => {
    if (isLast) setOpen(false);
    else setIndex((i) => i + 1);
  };

  const tooltipPos = (() => {
    if (missing || !box) {
      return {
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: TOOLTIP_MAX_W,
      };
    }
    const margin = 16;
    const approxH = 200;
    let left = box.left + box.width / 2 - TOOLTIP_MAX_W / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - TOOLTIP_MAX_W - margin));
    let top = box.bottom + 12;
    if (top + approxH > window.innerHeight - margin) {
      top = box.top - approxH - 12;
    }
    if (top < margin) top = margin;
    return {
      left,
      top,
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
      {missing ? (
        <p style={{ margin: "0 0 14px", fontSize: "12px", color: "#64748b", lineHeight: 1.45 }}>
          This control is not on screen right now (for example, no concept guide for this step). You can still continue the tour.
        </p>
      ) : null}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <span style={{ fontSize: "11px", color: "#94a3b8" }}>
          {index + 1} / {total}
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setOpen(false)}
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
