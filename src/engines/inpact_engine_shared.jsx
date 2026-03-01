import { useState, useEffect } from "react";
import CodeEditor from "./CodeEditor";

if (typeof document !== "undefined" && !document.getElementById("dm-sans-font")) {
  const link = document.createElement("link");
  link.id = "dm-sans-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(link);
}

function evaluate(node, answer) {
  if (node.evaluate) return node.evaluate(answer);
  const lower = (answer || "").toLowerCase().replace(/\s/g, "");
  const keywords = node.answer_keywords || [];
  const hits = keywords.filter((kw) => lower.includes(kw.toLowerCase().replace(/\s/g, "")));
  const ratio = keywords.length ? hits.length / keywords.length : 0;
  if (ratio >= 0.8) return "correct";
  if (ratio >= 0.5) return "partial";
  return "wrong";
}

export default function createINPACTEngine(config) {
  const { NODES, sideItems, problemNum, title, shortName } = config;
  const pad = String(problemNum).padStart(2, "0");

  return function INPACTEngine({ onNextProblem }) {
    const [nodeIndex, setNodeIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [result, setResult] = useState(null);
    const [attempts, setAttempts] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [showExpected, setShowExpected] = useState(false);
    const [completedNodes, setCompletedNodes] = useState([]);
    const node = NODES[nodeIndex];
    const progress = NODES.length <= 1 ? 0 : Math.min(100, Math.round((nodeIndex / (NODES.length - 1)) * 100));

    useEffect(() => {
      setAnswer(node?.seed_code ?? "");
      setResult(null);
      setAttempts(0);
      setShowHint(false);
      setShowExpected(false);
    }, [nodeIndex]);

    function next() {
      if (node?.id) setCompletedNodes((p) => (p.includes(node.id) ? p : [...p, node.id]));
      setNodeIndex((i) => Math.min(i + 1, NODES.length));
    }

    function submit() {
      if (!answer.trim()) return;
      const res = evaluate(node, answer);
      setResult(res);
      setAttempts((a) => a + 1);
      if (attempts >= 1) setShowHint(true);
      if (attempts >= 2) setShowExpected(true);
    }

    const s = {
      wrap: { minHeight: "100vh", background: "#080c14", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column" },
      topbar: { background: "#0d1117", borderBottom: "1px solid #1e2733", padding: "12px 24px", display: "flex", alignItems: "center", gap: "16px" },
      logo: { fontSize: "13px", fontWeight: "700", letterSpacing: "3px", color: "#00d4ff" },
      progressTrack: { flex: 1, height: "3px", background: "#1e2733", borderRadius: "2px", overflow: "hidden" },
      progressFill: { height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#00d4ff,#7c3aed)", transition: "width 0.5s ease" },
      progressLabel: { fontSize: "11px", color: "#4a5568", letterSpacing: "1px" },
      body: { display: "flex", flex: 1 },
      sidebar: { width: "220px", background: "#0d1117", borderRight: "1px solid #1e2733", padding: "24px 0", flexShrink: 0 },
      sidebarLabel: { fontSize: "10px", color: "#4a5568", letterSpacing: "2px", padding: "0 20px 12px" },
      sideItem: (a, d) => ({ padding: "10px 20px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", background: a ? "#1a2332" : "transparent", borderLeft: a ? "2px solid #00d4ff" : "2px solid transparent" }),
      sideItemDot: (a, d) => ({ width: "8px", height: "8px", borderRadius: "50%", background: d ? "#10b981" : a ? "#00d4ff" : "#2d3748", flexShrink: 0 }),
      sideItemText: (a, d) => ({ fontSize: "11px", color: d ? "#10b981" : a ? "#e2e8f0" : "#4a5568" }),
      main: { flex: 1, padding: "48px", maxWidth: "760px", margin: "0 auto", width: "100%" },
      phase: { fontSize: "10px", letterSpacing: "3px", color: "#00d4ff", marginBottom: "16px" },
      tag: { fontSize: "11px", color: "#a78bfa", fontWeight: "600", letterSpacing: "0.15em", marginBottom: "12px" },
      h1: { fontSize: "28px", fontWeight: "400", color: "#f8fafc", marginBottom: "32px", lineHeight: "1.2" },
      pre: { fontSize: "13px", lineHeight: "1.8", color: "#a0aec0", background: "#0d1117", border: "1px solid #1e2733", borderRadius: "8px", padding: "24px", whiteSpace: "pre-wrap", marginBottom: "32px" },
      paalBox: { background: "#0d1117", border: "1px solid #1e2733", borderLeft: "3px solid #00d4ff", borderRadius: "8px", padding: "20px 24px", marginBottom: "24px" },
      paalLabel: { fontSize: "10px", color: "#00d4ff", letterSpacing: "2px", marginBottom: "10px" },
      paalText: { fontSize: "16px", color: "#e2e8f0", lineHeight: "1.6", whiteSpace: "pre-wrap" },
      btnRow: { display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" },
      btn: (v) => ({ padding: "10px 24px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: "700", letterSpacing: "0.08em", background: v === "primary" ? "#00d4ff" : v === "ghost" ? "transparent" : "#1a2332", color: v === "primary" ? "#080c14" : v === "ghost" ? "#4a5568" : "#a0aec0", border: v === "ghost" ? "1px solid #2d3748" : "none" }),
      feedback: (t) => ({ marginTop: "20px", padding: "16px 20px", borderRadius: "8px", fontSize: "12px", lineHeight: "1.8", background: t === "correct" ? "rgba(16,185,129,0.08)" : t === "partial" ? "rgba(245,158,11,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${t === "correct" ? "#10b981" : t === "partial" ? "#f59e0b" : "#ef4444"}`, color: t === "correct" ? "#10b981" : t === "partial" ? "#f59e0b" : "#ef4444", whiteSpace: "pre-wrap" }),
      hintBox: { marginTop: "12px", padding: "12px 16px", background: "rgba(124,58,237,0.08)", border: "1px solid #7c3aed", borderRadius: "6px", fontSize: "11px", color: "#9f7aea", lineHeight: "1.7" },
      expectedBox: { marginTop: "12px", padding: "16px", background: "#0d1117", border: "1px solid #2d3748", borderRadius: "6px", fontSize: "12px", color: "#718096", whiteSpace: "pre-wrap", lineHeight: "1.7" },
      completeBanner: { textAlign: "center", padding: "60px 20px" },
    };

    function renderReveal() {
      const c = node.content;
      return (
        <div>
          <div style={s.phase}>{node.phase}</div>
          {c.tag && <div style={s.tag}>{c.tag}</div>}
          <h1 style={s.h1}>{c.title}</h1>
          <div style={s.pre}>{c.body}</div>
          {c.usecase && <div style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)", borderLeft: "3px solid #00d4ff", borderRadius: "8px", padding: "16px 20px", marginBottom: "28px" }}><div style={{ fontSize: "10px", letterSpacing: "2px", color: "#00d4ff", marginBottom: "8px" }}>💡 WHY THIS MATTERS</div><div style={{ fontSize: "14px", color: "#a0aec0", lineHeight: "1.7" }}>{c.usecase}</div></div>}
          <div style={s.btnRow}><button style={s.btn("primary")} onClick={next}>CONTINUE →</button></div>
        </div>
      );
    }

    function renderObjectives() {
      return (
        <div>
          <div style={s.phase}>{node.phase}</div>
          <h1 style={s.h1}>After completing this problem, you'll be able to:</h1>
          {node.items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "16px", padding: "14px 0", borderBottom: "1px solid #1e2733" }}>
              <div style={{ fontSize: "11px", color: "#00d4ff", flexShrink: 0, minWidth: "20px" }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ fontSize: "15px", color: "#cbd5e0", lineHeight: "1.6" }}>{item}</div>
            </div>
          ))}
          <div style={s.btnRow}><button style={s.btn("primary")} onClick={next}>LET'S BUILD →</button></div>
        </div>
      );
    }

    function renderQuestion() {
      const rawFb = result === "correct" ? node.feedback_correct : result === "partial" ? node.feedback_partial : result === "wrong" ? node.feedback_wrong : null;
      const fbMsg = typeof rawFb === "function" ? rawFb(answer) : rawFb;
      return (
        <div>
          <div style={s.phase}>{node.phase}</div>
          <div style={s.paalBox}><div style={s.paalLabel}>PAAL</div><div style={s.paalText}>{node.paal}</div></div>
          {node.seed_code && <div style={{ fontSize: "10px", color: "#4a5568", marginBottom: "8px" }}>CODE BUILT SO FAR — edit below</div>}
          <CodeEditor value={answer} onChange={setAnswer} height="320px" cursorAtEndOfLine={node.cursorLine} />
          {showHint && <div style={s.hintBox}>💡 {node.hint}</div>}
          {fbMsg && <div style={s.feedback(result)}>{fbMsg}</div>}
          {showExpected && (
            <div style={{ marginTop: "16px" }}>
              {node.example_code ? (
                <div>
                  <div style={{ ...s.paalLabel, marginBottom: "6px" }}>EXAMPLE (similar pattern — not the exact answer)</div>
                  <div style={s.expectedBox}>{node.example_code}</div>
                </div>
              ) : (
                node.expected && <div><div style={{ ...s.paalLabel, marginBottom: "6px" }}>EXPECTED</div><div style={s.expectedBox}>{node.expected}</div></div>
              )}
            </div>
          )}
          <div style={s.btnRow}>
            {result !== "correct" ? (
              <>
                <button style={s.btn("primary")} onClick={submit}>CHECK MY CODE</button>
                {!showExpected && <button style={s.btn("secondary")} onClick={() => setShowExpected(true)}>SHOW ME EXAMPLE</button>}
                {attempts > 0 && !showHint && <button style={s.btn("secondary")} onClick={() => setShowHint(true)}>SHOW HINT</button>}
              </>
            ) : (
              <button style={s.btn("primary")} onClick={next}>NEXT STEP →</button>
            )}
          </div>
        </div>
      );
    }

    function renderComplete() {
      return (
        <div style={s.completeBanner}>
          <div style={{ fontSize: "48px", marginBottom: "24px" }}>🎯</div>
          <h1 style={{ ...s.h1, textAlign: "center" }}>Problem #{problemNum} Complete</h1>
          <p style={{ color: "#4a5568", fontSize: "13px" }}>{title} done. Ready for the next problem.</p>
          {onNextProblem && <div style={s.btnRow}><button style={s.btn("primary")} onClick={onNextProblem}>NEXT PROBLEM →</button></div>}
        </div>
      );
    }

    function renderNode() {
      if (nodeIndex >= NODES.length) return renderComplete();
      switch (node.type) {
        case "reveal": return renderReveal();
        case "objectives": return renderObjectives();
        case "question": return renderQuestion();
        default: return renderReveal();
      }
    }

    return (
      <div style={s.wrap}>
        <div style={s.topbar}>
          <div style={s.logo}>INPACT</div>
          <div style={s.progressTrack}><div style={s.progressFill} /></div>
          <div style={s.progressLabel}>{progress}%</div>
          <div style={{ ...s.progressLabel, marginLeft: "8px" }}>P{pad} — {shortName}</div>
        </div>
        <div style={s.body}>
          <div style={s.sidebar}>
            <div style={s.sidebarLabel}>PROGRESS</div>
            {sideItems.map((item, i) => {
              const isActive = NODES[nodeIndex]?.id === item.id || (nodeIndex >= NODES.length && i === sideItems.length - 1);
              const isDone = completedNodes.includes(item.id);
              return (
                <div key={item.id} style={s.sideItem(isActive, isDone)} onClick={() => setNodeIndex(i)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setNodeIndex(i); } }}>
                  <div style={s.sideItemDot(isActive, isDone)} /><div style={s.sideItemText(isActive, isDone)}>{item.label}</div>
                  {isDone && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
              );
            })}
          </div>
          <div style={s.main}>{renderNode()}</div>
        </div>
      </div>
    );
  };
}
