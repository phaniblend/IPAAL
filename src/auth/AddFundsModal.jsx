import { useState } from "react";
import { getBalanceCents, addFundsCents, FUND_BUCKETS_CENTS, PRICE_PER_LESSON_CENTS, TOTAL_FREE_LESSONS } from "./lessonAccess.js";

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,0.85)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10000,
  fontFamily: "'DM Sans', sans-serif",
};
const card = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "28px 32px",
  maxWidth: "380px",
  width: "90%",
  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
};
const title = { fontSize: "18px", fontWeight: 600, color: "#0f172a", marginBottom: "8px" };
const sub = { fontSize: "13px", color: "#64748b", marginBottom: "16px", lineHeight: 1.5 };
const balance = { fontSize: "14px", fontWeight: 600, color: "#00d4ff", marginBottom: "16px" };
const btn = (primary) => ({
  padding: "10px 20px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  background: primary ? "#00d4ff" : "transparent",
  color: primary ? "#052545" : "#0f172a",
  border: primary ? "none" : "1px solid #0f172a",
  marginRight: "8px",
  marginBottom: "8px",
});

export default function AddFundsModal({ onDone }) {
  const [balanceCents, setBalanceCents] = useState(getBalanceCents());

  const add = (cents) => {
    addFundsCents(cents);
    setBalanceCents(getBalanceCents());
  };

  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onDone?.()}>
      <div style={card} onClick={(e) => e.stopPropagation()}>
        <div style={title}>Add funds</div>
        <div style={sub}>
          Lessons after your {TOTAL_FREE_LESSONS} free ones cost ${(PRICE_PER_LESSON_CENTS / 100).toFixed(0)} each (lifetime access per lesson). Load a bucket to continue — real payments when we wire the processor.
        </div>
        <div style={balance}>Balance: ${(balanceCents / 100).toFixed(2)}</div>
        <div>
          {FUND_BUCKETS_CENTS.map((cents) => (
            <button key={cents} type="button" style={btn(true)} onClick={() => add(cents)}>
              +${(cents / 100).toFixed(0)}
            </button>
          ))}
        </div>
        <button type="button" style={{ ...btn(false), marginTop: "16px" }} onClick={onDone}>
          Done
        </button>
      </div>
    </div>
  );
}
