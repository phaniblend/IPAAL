import { useState, useEffect, useMemo, useContext, useRef } from "react";
import CodeEditor from "./CodeEditor";
import MultiFileEditor from "./MultiFileEditor";
import { LessonValidationContext } from "../ai-lessons/lessonValidationContext.jsx";
import { fetchLessonCodeValidation } from "../ai-lessons/clientLessonValidation.js";
import CssTabsEditor from "./css/CssTabsEditor";
import AngularTabbedEditor from "./angular/AngularTabbedEditor";
import { mergeAngularTsWithHtml, mergeAngularCssIntoTS, splitAngularSeed } from "./angular/angularTabMerge.js";
import LessonEditorOutputTabs from "./LessonEditorOutputTabs";

if (typeof document !== "undefined" && !document.getElementById("dm-sans-font")) {
  const link = document.createElement("link");
  link.id = "dm-sans-font";
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap";
  document.head.appendChild(link);
}

/** Build JSON answer for angular-tabs from step seed (object, merged string, or inline template). */
function seedCodeToAngularTabsAnswer(seed) {
  if (typeof seed === "object" && seed !== null && ("ts" in seed || "html" in seed)) {
    return JSON.stringify({ ts: seed.ts ?? "", html: seed.html ?? "", css: seed.css ?? "" });
  }
  if (typeof seed === "string" && /template\s*:\s*`/.test(seed)) {
    const { tsPart, htmlPart } = splitAngularSeed(seed);
    return JSON.stringify({ ts: tsPart, html: htmlPart, css: "" });
  }
  return JSON.stringify({ ts: typeof seed === "string" ? seed : "", html: "", css: "" });
}

function seedCodeToMultiFileAnswer(seed) {
  if (typeof seed === "object" && seed !== null && !Array.isArray(seed)) {
    const files = Object.fromEntries(
      Object.entries(seed).map(([k, v]) => [String(k), typeof v === "string" ? v : String(v ?? "")])
    );
    const firstFile = Object.keys(files)[0] || "App.tsx";
    return JSON.stringify({ activeFile: firstFile, files });
  }
  return JSON.stringify({ activeFile: "App.tsx", files: { "App.tsx": typeof seed === "string" ? seed : "" } });
}

function parseMultiFileAnswer(answer, fallback = "App.tsx") {
  try {
    const p = JSON.parse(answer || "{}");
    const files = p && typeof p.files === "object" ? p.files : {};
    const normalized = Object.fromEntries(
      Object.entries(files).map(([k, v]) => [String(k), typeof v === "string" ? v : String(v ?? "")])
    );
    const activeFile =
      typeof p.activeFile === "string" && normalized[p.activeFile]
        ? p.activeFile
        : Object.keys(normalized)[0] || fallback;
    return { files: normalized, activeFile };
  } catch (_) {
    return { files: { [fallback]: answer || "" }, activeFile: fallback };
  }
}

function mergeMultiFileForValidation(answer) {
  const parsed = parseMultiFileAnswer(answer);
  const entries = Object.entries(parsed.files);
  if (entries.length === 0) return "";
  return entries.map(([name, code]) => `// FILE: ${name}\n${code}`).join("\n\n");
}

function getMultiFilePreviewCode(answer) {
  const parsed = parseMultiFileAnswer(answer);
  const names = Object.keys(parsed.files);
  if (names.length === 0) return "";
  const appFile =
    names.find((n) => /^app\.(t|j)sx?$/i.test(n)) ||
    names.find((n) => /^index\.(t|j)sx?$/i.test(n)) ||
    parsed.activeFile;
  return parsed.files[appFile] || "";
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
  const {
    NODES,
    sideItems,
    problemNum,
    title,
    shortName,
    language,
    getOutputPreview,
    answerShape,
    defaultHtml,
    lessonIntro: configLessonIntro,
    lessonObjectives: configLessonObjectives,
    intro: configIntro,
    objectives: configObjectives,
    onValidateCode: configOnValidateCode,
    onAskMentor,
    validateWithAI = true,
  } = config;
  const lessonIntro = configLessonIntro ?? configIntro ?? null;
  const lessonObjectives = configLessonObjectives ?? (Array.isArray(configObjectives) ? configObjectives : null);
  const pad = String(problemNum).padStart(2, "0");

  return function INPACTEngine({ onNextProblem }) {
    const [nodeIndex, setNodeIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [mainTab, setMainTab] = useState("editor");
    const [result, setResult] = useState(null);
    const [attempts, setAttempts] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [showExampleModal, setShowExampleModal] = useState(false);
    const [exampleModalOffset, setExampleModalOffset] = useState({ x: 0, y: 0 });
    const [exampleModalDragging, setExampleModalDragging] = useState(false);
    const exampleModalDragRef = useRef(null);
    const [feedbackModalOffset, setFeedbackModalOffset] = useState({ x: 0, y: 0 });
    const [feedbackModalDragging, setFeedbackModalDragging] = useState(false);
    const feedbackModalDragRef = useRef(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [taskInstructionPulseNonce, setTaskInstructionPulseNonce] = useState(0);
    const [showMentorModal, setShowMentorModal] = useState(false);
    const [mentorDraft, setMentorDraft] = useState("");
    const [mentorReply, setMentorReply] = useState("");
    const [mentorLoading, setMentorLoading] = useState(false);
    const [mentorError, setMentorError] = useState("");
    const [checking, setChecking] = useState(false);
    const [completedNodes, setCompletedNodes] = useState([]);
    const [passedCodeByStepId, setPassedCodeByStepId] = useState({});
    const [aiFeedback, setAiFeedback] = useState("");
    const [validationFallbackNote, setValidationFallbackNote] = useState("");
    const lessonValidationCtx = useContext(LessonValidationContext);
    const node = NODES[nodeIndex];
    const progress = NODES.length <= 1 ? 0 : Math.min(100, Math.round((nodeIndex / (NODES.length - 1)) * 100));

    const onValidateCodeResolved = useMemo(() => {
      if (configOnValidateCode) return configOnValidateCode;
      if (validateWithAI === false) return undefined;
      if (!lessonValidationCtx?.track) return undefined;
      return async (n, userCode) =>
        fetchLessonCodeValidation({
          track: lessonValidationCtx.track,
          node: n,
          userCode,
          language: language || undefined,
        });
    }, [configOnValidateCode, validateWithAI, lessonValidationCtx, language]);

    const onAskMentorResolved = useMemo(() => {
      if (onAskMentor) return onAskMentor;
      if (!lessonValidationCtx?.track) return undefined;
      const lessonKey =
        lessonValidationCtx.lessonKey ??
        `${lessonValidationCtx.track}:${lessonValidationCtx.lessonIndex ?? ""}:${lessonValidationCtx.lessonTitle ?? ""}`;
      return async (n, userMessage) => {
        const res = await fetch("/api/lessons/mentor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            step: { id: n.id, instruction: n.paal, paal: n.paal },
            userMessage: String(userMessage).trim(),
            track: lessonValidationCtx.track,
            lessonKey,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error || res.statusText || "Mentor unavailable");
        }
        const data = await res.json();
        return data.reply ?? "";
      };
    }, [onAskMentor, lessonValidationCtx]);

    useEffect(() => {
      setResult(null);
      setAttempts(0);
      setShowHint(false);
      setShowExampleModal(false);
      setExampleModalOffset({ x: 0, y: 0 });
      setFeedbackModalOffset({ x: 0, y: 0 });
      setShowFeedbackModal(false);
      setShowMentorModal(false);
      setMentorDraft("");
      setMentorReply("");
      setMentorError("");
      setMentorLoading(false);
      setChecking(false);
      setAiFeedback("");
      setValidationFallbackNote("");
      setMainTab("editor");
      if (node?.type === "question") {
        let initialCode = "";
        if (node.id && passedCodeByStepId[node.id]) {
          initialCode = passedCodeByStepId[node.id];
        } else {
          for (let i = nodeIndex - 1; i >= 0; i--) {
            const prev = NODES[i];
            if (prev?.type === "question" && prev.id && passedCodeByStepId[prev.id]) {
              initialCode = passedCodeByStepId[prev.id];
              break;
            }
          }
          if (initialCode === "") {
            if (answerShape === "css-tabs") {
              initialCode = JSON.stringify({ html: defaultHtml || "", css: node.starter_code || node.seed_code || "" });
            } else if (answerShape === "angular-tabs") {
              const seed = node.starter_code || node.seed_code || "";
              initialCode = seedCodeToAngularTabsAnswer(seed);
            } else if (answerShape === "multi-file") {
              const seed = node.starter_code || node.seed_code || "";
              initialCode = seedCodeToMultiFileAnswer(seed);
            } else if (node.starter_code) {
              initialCode = node.starter_code;
            }
          }
        }
        setAnswer(initialCode);
      }
    }, [nodeIndex, passedCodeByStepId]);

    function handleExampleModalPointerDown(e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      setExampleModalDragging(true);
      exampleModalDragRef.current = {
        id: e.pointerId,
        sx: e.clientX,
        sy: e.clientY,
        ox: exampleModalOffset.x,
        oy: exampleModalOffset.y,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    function handleExampleModalPointerMove(e) {
      const d = exampleModalDragRef.current;
      if (!d || e.pointerId !== d.id) return;
      setExampleModalOffset({
        x: d.ox + (e.clientX - d.sx),
        y: d.oy + (e.clientY - d.sy),
      });
    }

    function handleExampleModalPointerUp(e) {
      const d = exampleModalDragRef.current;
      if (!d || e.pointerId !== d.id) return;
      setExampleModalDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {
        /* ignore */
      }
      exampleModalDragRef.current = null;
    }

    function handleFeedbackModalPointerDown(e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      setFeedbackModalDragging(true);
      feedbackModalDragRef.current = {
        id: e.pointerId,
        sx: e.clientX,
        sy: e.clientY,
        ox: feedbackModalOffset.x,
        oy: feedbackModalOffset.y,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    function handleFeedbackModalPointerMove(e) {
      const d = feedbackModalDragRef.current;
      if (!d || e.pointerId !== d.id) return;
      setFeedbackModalOffset({
        x: d.ox + (e.clientX - d.sx),
        y: d.oy + (e.clientY - d.sy),
      });
    }

    function handleFeedbackModalPointerUp(e) {
      const d = feedbackModalDragRef.current;
      if (!d || e.pointerId !== d.id) return;
      setFeedbackModalDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {
        /* ignore */
      }
      feedbackModalDragRef.current = null;
    }

    function next() {
      if (node?.type === "question" && node?.id && result === "correct") {
        setPassedCodeByStepId((prev) => ({ ...prev, [node.id]: answer }));
      }
      if (node?.id) setCompletedNodes((p) => (p.includes(node.id) ? p : [...p, node.id]));
      setNodeIndex((i) => Math.min(i + 1, NODES.length));
    }

    function getMergedCodeForKeywordEval() {
      return answerShape === "css-tabs"
        ? (() => {
            try {
              const p = JSON.parse(answer);
              return p && typeof p.css === "string" ? p.css : answer;
            } catch (_) {
              return answer;
            }
          })()
        : answerShape === "angular-tabs"
          ? (() => {
              try {
                const p = JSON.parse(answer);
                if (p && typeof p === "object") {
                  let ts = (p.ts ?? "").trim();
                  const html = (p.html ?? "").trim();
                  const css = (p.css ?? "").trim();
                  ts = mergeAngularTsWithHtml(ts, html);
                  ts = mergeAngularCssIntoTS(ts, css);
                  return ts;
                }
                return answer;
              } catch (_) {
                return answer;
              }
            })()
          : answerShape === "multi-file"
            ? mergeMultiFileForValidation(answer)
            : answer;
    }

    function getUserCodeForServerValidation() {
      if (answerShape === "css-tabs") return answer;
      return getMergedCodeForKeywordEval();
    }

    async function submit() {
      const toEval = getMergedCodeForKeywordEval();
      if (!toEval.trim()) return;
      setChecking(true);
      setAiFeedback("");
      setValidationFallbackNote("");
      const minCheckingMs = 500;
      const start = Date.now();
      const done = () => {
        const elapsed = Date.now() - start;
        setTimeout(() => setChecking(false), Math.max(0, minCheckingMs - elapsed));
      };

      let res = "wrong";
      let feedbackFromAi = "";
      try {
        if (onValidateCodeResolved && node?.type === "question") {
          const userCodeForApi = getUserCodeForServerValidation();
          const ai = await onValidateCodeResolved(node, userCodeForApi);
          const r = ai?.result;
          if (r === "correct" || r === "partial" || r === "wrong") {
            res = r;
            if (typeof ai.feedback === "string" && ai.feedback.trim()) {
              feedbackFromAi = ai.feedback.trim();
              setAiFeedback(feedbackFromAi);
            }
          } else {
            throw new Error("Invalid validation response");
          }
        } else {
          res = evaluate(node, toEval);
        }
      } catch (err) {
        res = evaluate(node, toEval);
        const msg = err && typeof err.message === "string" ? err.message : "Validation unavailable";
        setValidationFallbackNote(`Keyword check used: ${msg}`);
      }

      setResult(res);
      setAttempts((a) => a + 1);
      if (attempts >= 1) setShowHint(true);
      const staticFb = node[`feedback_${res}`];
      if (node.hint || staticFb || feedbackFromAi) {
        setFeedbackModalOffset({ x: 0, y: 0 });
        setShowFeedbackModal(true);
      }
      done();
    }

    async function sendMentor() {
      if (!onAskMentorResolved || node?.type !== "question") return;
      const msg = mentorDraft.trim();
      if (!msg) return;
      setMentorLoading(true);
      setMentorError("");
      try {
        const reply = await onAskMentorResolved(node, msg);
        setMentorReply(typeof reply === "string" ? reply : String(reply ?? ""));
      } catch (e) {
        setMentorError(e && typeof e.message === "string" ? e.message : "Mentor unavailable");
      } finally {
        setMentorLoading(false);
      }
    }

    const parsedCssTabs = useMemo(() => {
      if (answerShape !== "css-tabs") return null;
      try {
        const p = JSON.parse(answer || "{}");
        return { html: p.html ?? "", css: p.css ?? "" };
      } catch (_) {
        return { html: defaultHtml || "", css: answer || "" };
      }
    }, [answer, answerShape, defaultHtml]);

    const parsedAngularTabs = useMemo(() => {
      if (answerShape !== "angular-tabs") return null;
      try {
        const p = JSON.parse(answer || "{}");
        return { ts: p.ts ?? "", html: p.html ?? "", css: p.css ?? "" };
      } catch (_) {
        return { ts: answer || "", html: "", css: "" };
      }
    }, [answer, answerShape]);

    const angularPlaceholder = useMemo(() => {
      if (answerShape !== "angular-tabs" || !node) return undefined;
      const seed = node.starter_code ?? node.seed_code ?? "";
      try {
        return JSON.parse(seedCodeToAngularTabsAnswer(seed));
      } catch (_) {
        return { ts: "", html: "", css: "" };
      }
    }, [answerShape, node]);

    const parsedMultiFile = useMemo(() => {
      if (answerShape !== "multi-file") return null;
      return parseMultiFileAnswer(answer);
    }, [answer, answerShape]);

    const s = {
      wrap: { height: "100vh", overflow: "hidden", background: "#ffffff", color: "#1e293b", fontFamily: "'DM Sans', sans-serif", display: "flex", flexDirection: "column", paddingTop: "52px", boxSizing: "border-box" },
      body: { display: "flex", flex: 1, minHeight: 0, minWidth: 0, overflowX: "hidden" },
      sidebar: { width: "240px", background: "#f1f5f9", borderRight: "1px solid #e2e8f0", padding: "20px 0", flexShrink: 0, overflowY: "auto" },
      sidebarLabel: { fontSize: "10px", fontWeight: "700", letterSpacing: "0.15em", color: "#64748b", padding: "0 20px 10px", marginBottom: "4px" },
      sideItem: (a, d) => ({ padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", background: a ? "#e0f2fe" : "transparent", borderLeft: a ? "3px solid #0891b2" : "3px solid transparent" }),
      sideItemDot: (a, d) => ({ width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0, ...(d ? { background: "#10b981" } : a ? { background: "#0891b2" } : { background: "transparent", border: "2px solid #94a3b8" }) }),
      sideItemText: (a, d) => ({ fontSize: "13px", color: d ? "#059669" : a ? "#0f172a" : "#64748b", lineHeight: 1.35, fontWeight: (a ? 600 : 400) }),
      main: { flex: 1, padding: "4px 20px 24px 20px", paddingLeft: "96px", minWidth: "75vw", maxWidth: "75vw", minHeight: 0, display: "flex", flexDirection: "column", overflowX: "hidden", boxSizing: "border-box" },
      phase: { fontSize: "10px", letterSpacing: "3px", color: "#0891b2", marginBottom: "16px" },
      tag: { fontSize: "11px", color: "#7c3aed", fontWeight: "600", letterSpacing: "0.15em", marginBottom: "12px" },
      h1: { fontSize: "28px", fontWeight: "400", color: "#0f172a", marginBottom: "32px", lineHeight: "1.2" },
      pre: { fontSize: "13px", lineHeight: "1.8", color: "#475569", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "24px", whiteSpace: "pre-wrap", marginBottom: "32px" },
      paalBox: { background: "#f1f5f9", border: "1px solid #e2e8f0", borderLeft: "3px solid #0891b2", borderRadius: "8px", padding: "20px 24px", marginBottom: "24px" },
      paalLabel: { fontSize: "10px", color: "#0891b2", letterSpacing: "2px", marginBottom: "10px" },
      paalText: { fontSize: "16px", color: "#334155", lineHeight: "1.6", whiteSpace: "pre-wrap" },
      btnRow: { display: "flex", gap: "12px", marginTop: "4px", flexWrap: "wrap" },
      btn: (v) => ({ padding: "14px 32px", borderRadius: "16px", cursor: "pointer", fontSize: "14px", fontWeight: "600", letterSpacing: "0.02em", background: v === "primary" ? "#00D2FF" : v === "ghost" ? "transparent" : "#e0f2fe", color: v === "primary" ? "#00334E" : v === "ghost" ? "#64748b" : "#0f172a", border: v === "ghost" ? "1px solid #cbd5e1" : v === "secondary" ? "1px solid #bae6fd" : "none" }),
      feedback: (t) => ({ marginTop: "20px", padding: "16px 20px", borderRadius: "8px", fontSize: "12px", lineHeight: "1.8", background: t === "correct" ? "rgba(16,185,129,0.1)" : t === "partial" ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${t === "correct" ? "#10b981" : t === "partial" ? "#f59e0b" : "#ef4444"}`, color: t === "correct" ? "#059669" : t === "partial" ? "#d97706" : "#dc2626", whiteSpace: "pre-wrap" }),
      hintBox: { marginTop: "12px", padding: "12px 16px", background: "rgba(124,58,237,0.08)", border: "1px solid #7c3aed", borderRadius: "6px", fontSize: "11px", color: "#6d28d9", lineHeight: "1.7" },
      expectedBox: { marginTop: "12px", padding: "16px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "12px", color: "#475569", whiteSpace: "pre-wrap", lineHeight: "1.7" },
      completeBanner: { textAlign: "center", padding: "60px 20px" },
    };

    function renderReveal() {
      const c = node.content;
      const revealPadding = { paddingLeft: "44px" };
      return (
        <div>
          <div style={revealPadding}>
            <div style={s.phase}>{node.phase}</div>
            {c.tag && <div style={s.tag}>{c.tag}</div>}
            <h1 style={s.h1}>{c.title}</h1>
            <div style={s.pre}>{c.body}</div>
          </div>
          {c.usecase && <div style={{ ...revealPadding, background: "rgba(8,145,178,0.08)", border: "1px solid rgba(8,145,178,0.25)", borderLeft: "3px solid #0891b2", borderRadius: "8px", padding: "16px 20px", marginBottom: "28px" }}><div style={{ fontSize: "10px", letterSpacing: "2px", color: "#0891b2", marginBottom: "8px" }}>💡 WHY THIS MATTERS</div><div style={{ fontSize: "14px", color: "#475569", lineHeight: "1.7" }}>{c.usecase}</div></div>}
          <div style={s.btnRow}><button type="button" className="inpact-btn-primary" style={s.btn("primary")} onClick={next}>CONTINUE →</button></div>
        </div>
      );
    }

    function renderObjectives() {
      return (
        <div>
          <div style={s.phase}>{node.phase}</div>
          <h1 style={s.h1}>After completing this Lesson, you'll be able to:</h1>
          {node.items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "16px", padding: "14px 0", borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "11px", color: "#0891b2", flexShrink: 0, minWidth: "20px" }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ fontSize: "15px", color: "#334155", lineHeight: "1.6" }}>{item}</div>
            </div>
          ))}
          <div style={s.btnRow}><button type="button" className="inpact-btn-primary" style={s.btn("primary")} onClick={next}>LET'S BUILD →</button></div>
        </div>
      );
    }

    const stepNum = nodeIndex + 1;
    const totalSteps = NODES.length;

    function renderEditorBlockScrollable() {
      const codeForCursor = answerShape === "css-tabs" ? (parsedCssTabs?.css || "") : answerShape === "angular-tabs" ? (parsedAngularTabs?.ts || "") : (answer || "");
      const stepLineIndex = codeForCursor.split("\n").findIndex((l) => l.includes("// Step"));
      const cursorAtStartOfLine = node.cursorAtStartOfLine ?? (stepLineIndex >= 0 ? stepLineIndex + 2 : undefined);
      return (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", color: "#0891b2", fontWeight: 600 }}>Step {stepNum} of {totalSteps}</span>
            {stepNum > 1 && (
              <>
                <span style={{ fontSize: "11px", color: "#64748b" }}>·</span>
                <span style={{ fontSize: "11px", color: "#0891b2", fontWeight: 600, letterSpacing: "0.05em" }}>CODE BUILT SO FAR — edit below</span>
              </>
            )}
          </div>
          {cursorAtStartOfLine != null && answerShape !== "css-tabs" && answerShape !== "angular-tabs" && answerShape !== "multi-file" && <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "6px" }}>Type your code below the comment.</div>}
          {answerShape === "angular-tabs" && (
            <div style={{ fontSize: "12px", color: "#0e7490", marginBottom: "8px", padding: "8px 12px", background: "rgba(8,145,178,0.08)", border: "1px solid rgba(8,145,178,0.25)", borderRadius: "6px", lineHeight: 1.5 }}>
              <strong>Tip:</strong> Use <code style={{ background: "rgba(0,0,0,0.06)", padding: "2px 6px", borderRadius: "4px", fontSize: "11px" }}>{"template: `" + "`"}</code> in the TypeScript tab and put your markup in the <strong>HTML</strong> tab; put CSS in the <strong>CSS</strong> tab. All three merge when you click Check.
            </div>
          )}
          <div style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #e2e8f0", marginBottom: "4px", height: "480px", minHeight: "480px", width: "100%", maxWidth: "100%" }}>
            {answerShape === "css-tabs" ? (
              <CssTabsEditor
                key={node?.id}
                value={parsedCssTabs || { html: "", css: "" }}
                onChange={(v) => setAnswer(JSON.stringify(v))}
                height="480px"
              />
            ) : answerShape === "angular-tabs" ? (
              <AngularTabbedEditor
                key={node?.id}
                value={parsedAngularTabs || { ts: "", html: "", css: "" }}
                onChange={(v) => setAnswer(JSON.stringify(v))}
                height="480px"
                placeholder={angularPlaceholder}
              />
            ) : answerShape === "multi-file" ? (
              <MultiFileEditor
                key={node?.id}
                value={answer}
                onChange={setAnswer}
                height="480px"
                defaultFileName={(node?.language || language || "typescript").includes("ts") ? "App.tsx" : "App.jsx"}
                language={language || node.language || "typescript"}
              />
            ) : (
              <CodeEditor key={node?.id} value={answer} onChange={setAnswer} height="480px" cursorAtEndOfLine={cursorAtStartOfLine == null ? node.cursorLine : undefined} cursorAtStartOfLine={cursorAtStartOfLine} language={language || node.language || "javascript"} />
            )}
          </div>
        </>
      );
    }

    function renderEditorBlockButtons(fbMsg) {
      const canSubmit = answerShape === "css-tabs"
        ? (parsedCssTabs?.css?.trim())
        : answerShape === "angular-tabs"
          ? (parsedAngularTabs?.ts?.trim() || parsedAngularTabs?.html?.trim() || parsedAngularTabs?.css?.trim())
          : answerShape === "multi-file"
            ? Object.values(parsedMultiFile?.files || {}).some((v) => String(v || "").trim())
            : answer.trim();
      // Priority: example_code → multiline expected → seed_code fallback → short expected label
      const exampleEntry = node.example_code
        ? { label: "EXAMPLE (similar pattern — not the exact answer)", code: node.example_code }
        : (node.expected && node.expected.includes("\n"))
          ? { label: "EXPECTED", code: node.expected }
          : node.seed_code
            ? { label: "EXAMPLE", code: node.seed_code }
            : node.expected
              ? { label: "EXPECTED", code: node.expected }
              : null;
      const exampleContent = exampleEntry ? (
        <>
          <div style={{ ...s.paalLabel, marginBottom: "6px" }}>{exampleEntry.label}</div>
          <div style={s.expectedBox}>{exampleEntry.code}</div>
        </>
      ) : null;
      const hasHintOrFeedback = node.hint || fbMsg;
      return (
        <>
          <div style={s.btnRow}>
            {result !== "correct" ? (
              <>
                <button type="button" className={`inpact-btn-primary ${checking ? "inpact-btn-checking" : ""}`} style={s.btn("primary")} onClick={submit} disabled={!canSubmit || checking}>{checking ? "Checking..." : "CHECK MY CODE"}</button>
                {exampleContent && (
                  <button
                    type="button"
                    style={s.btn("secondary")}
                    onClick={() => {
                      setExampleModalOffset({ x: 0, y: 0 });
                      setShowExampleModal(true);
                    }}
                  >
                    SHOW ME AN EXAMPLE
                  </button>
                )}
                {attempts > 0 && !showHint && (
                  <button
                    type="button"
                    style={s.btn("secondary")}
                    onClick={() => {
                      setShowHint(true);
                      setFeedbackModalOffset({ x: 0, y: 0 });
                      setShowFeedbackModal(true);
                    }}
                  >
                    SHOW HINT
                  </button>
                )}
                {hasHintOrFeedback && (
                  <button
                    type="button"
                    style={s.btn("secondary")}
                    onClick={() => {
                      setFeedbackModalOffset({ x: 0, y: 0 });
                      setShowFeedbackModal(true);
                    }}
                  >
                    💡 VIEW HINT & FEEDBACK
                  </button>
                )}
                {onAskMentorResolved && (
                  <button type="button" style={s.btn("secondary")} onClick={() => { setShowMentorModal(true); setMentorError(""); }}>Ask mentor</button>
                )}
              </>
            ) : (
              <>
                {!(showFeedbackModal && hasHintOrFeedback) && (
                  <button type="button" className="inpact-btn-primary" style={s.btn("primary")} onClick={next}>NEXT STEP →</button>
                )}
                {hasHintOrFeedback && !showFeedbackModal && (
                  <button
                    type="button"
                    style={s.btn("secondary")}
                    onClick={() => {
                      setFeedbackModalOffset({ x: 0, y: 0 });
                      setShowFeedbackModal(true);
                    }}
                  >
                    💡 VIEW HINT & FEEDBACK
                  </button>
                )}
                {onAskMentorResolved && (
                  <button type="button" style={s.btn("secondary")} onClick={() => { setShowMentorModal(true); setMentorError(""); }}>Ask mentor</button>
                )}
              </>
            )}
          </div>
          {showExampleModal && exampleContent && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 10000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(15, 23, 42, 0.5)",
                padding: "24px",
                boxSizing: "border-box",
              }}
              onClick={() => setShowExampleModal(false)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="example-modal-title"
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  padding: "24px",
                  maxWidth: "560px",
                  width: "100%",
                  maxHeight: "80vh",
                  overflowY: "auto",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                  border: "1px solid #e2e8f0",
                  transform: `translate(${exampleModalOffset.x}px, ${exampleModalOffset.y}px)`,
                  touchAction: "none",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  role="presentation"
                  onPointerDown={handleExampleModalPointerDown}
                  onPointerMove={handleExampleModalPointerMove}
                  onPointerUp={handleExampleModalPointerUp}
                  onPointerCancel={handleExampleModalPointerUp}
                  style={{
                    cursor: exampleModalDragging ? "grabbing" : "grab",
                    margin: "-4px -8px 8px -8px",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    userSelect: "none",
                    touchAction: "none",
                  }}
                  title="Drag to move"
                >
                  <div id="example-modal-title" style={{ ...s.paalLabel, marginBottom: 0 }}>{exampleEntry.label}</div>
                </div>
                <div style={s.expectedBox}>{exampleEntry.code}</div>
                <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                  <button type="button" className="inpact-btn-primary" style={s.btn("primary")} onClick={() => setShowExampleModal(false)}>Close</button>
                </div>
              </div>
            </div>
          )}
          {showFeedbackModal && hasHintOrFeedback && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 10000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(15, 23, 42, 0.5)",
                padding: "24px",
                boxSizing: "border-box",
              }}
              onClick={() => setShowFeedbackModal(false)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="feedback-modal-title"
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  padding: "24px",
                  maxWidth: "520px",
                  width: "100%",
                  maxHeight: "80vh",
                  overflowY: "auto",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                  border: "1px solid #e2e8f0",
                  transform: `translate(${feedbackModalOffset.x}px, ${feedbackModalOffset.y}px)`,
                  touchAction: "none",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  role="presentation"
                  onPointerDown={handleFeedbackModalPointerDown}
                  onPointerMove={handleFeedbackModalPointerMove}
                  onPointerUp={handleFeedbackModalPointerUp}
                  onPointerCancel={handleFeedbackModalPointerUp}
                  style={{
                    cursor: feedbackModalDragging ? "grabbing" : "grab",
                    margin: "-4px -8px 12px -8px",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    userSelect: "none",
                    touchAction: "none",
                  }}
                  title="Drag to move"
                >
                  <div id="feedback-modal-title" style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", color: "#64748b", marginBottom: 0 }}>HINT & FEEDBACK</div>
                </div>
                {node.hint && <div style={{ ...s.hintBox, marginBottom: fbMsg ? "16px" : 0 }}>💡 {node.hint}</div>}
                {fbMsg && <div style={s.feedback(result)}>{fbMsg}</div>}
                <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    className="inpact-btn-primary"
                    style={s.btn("primary")}
                    onClick={() => {
                      setShowFeedbackModal(false);
                      if (result === "correct") next();
                    }}
                  >
                    {result === "correct" ? "NEXT STEP →" : "Close"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {showMentorModal && onAskMentorResolved && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 10001,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(15, 23, 42, 0.5)",
                padding: "24px",
                boxSizing: "border-box",
              }}
              onClick={() => setShowMentorModal(false)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="mentor-modal-title"
            >
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  padding: "24px",
                  maxWidth: "520px",
                  width: "100%",
                  maxHeight: "80vh",
                  overflowY: "auto",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                  border: "1px solid #e2e8f0",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div id="mentor-modal-title" style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", color: "#64748b", marginBottom: "8px" }}>ASK YOUR MENTOR</div>
                <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5, margin: "0 0 16px" }}>Ask about this step in your own words. You will get a short explanation or hint tailored to the instruction above.</p>
                <textarea
                  value={mentorDraft}
                  onChange={(e) => setMentorDraft(e.target.value)}
                  placeholder="What would you like help with?"
                  rows={4}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px 14px",
                    fontSize: "13px",
                    fontFamily: "inherit",
                    lineHeight: 1.5,
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    resize: "vertical",
                    marginBottom: "12px",
                  }}
                />
                {mentorError ? <div style={{ fontSize: "12px", color: "#dc2626", marginBottom: "8px" }}>{mentorError}</div> : null}
                {mentorReply ? (
                  <div style={{ ...s.expectedBox, marginTop: "4px", whiteSpace: "pre-wrap" }}>{mentorReply}</div>
                ) : null}
                <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}>
                  <button type="button" style={s.btn("ghost")} onClick={() => setShowMentorModal(false)}>Close</button>
                  <button
                    type="button"
                    className="inpact-btn-primary"
                    style={s.btn("primary")}
                    onClick={sendMentor}
                    disabled={!mentorDraft.trim() || mentorLoading}
                  >
                    {mentorLoading ? "Sending…" : "Send"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }

    function renderEditorContent() {
      const rawFb = result === "correct" ? node.feedback_correct : result === "partial" ? node.feedback_partial : result === "wrong" ? node.feedback_wrong : null;
      const staticFbMsg = typeof rawFb === "function" ? rawFb(answer) : rawFb;
      const fbMsg = aiFeedback || staticFbMsg;
      return (
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", maxWidth: "100%" }}>
            {renderEditorBlockScrollable()}
          </div>
          <div style={{ flexShrink: 0, paddingTop: "20px", marginTop: "8px", borderTop: "1px solid #e2e8f0" }}>
            {validationFallbackNote ? (
              <div style={{ fontSize: "11px", color: "#b45309", marginBottom: "10px", padding: "8px 12px", background: "rgba(245,158,11,0.12)", borderRadius: "6px", lineHeight: 1.5 }}>
                {validationFallbackNote}
              </div>
            ) : null}
            {renderEditorBlockButtons(fbMsg)}
          </div>
        </div>
      );
    }

    function renderComplete() {
      return (
        <div style={s.completeBanner}>
          <div style={{ fontSize: "48px", marginBottom: "24px" }}>🎯</div>
          <h1 style={{ ...s.h1, textAlign: "center" }}>Problem #{problemNum} Complete</h1>
          <p style={{ color: "#4a5568", fontSize: "13px" }}>{title} done. Ready for the Next Lesson.</p>
          {onNextProblem && <div style={s.btnRow}><button type="button" className="inpact-btn-primary" style={s.btn("primary")} onClick={onNextProblem}>Next Lesson →</button></div>}
        </div>
      );
    }

    function renderNode() {
      if (nodeIndex >= NODES.length) return renderComplete();
      switch (node.type) {
        case "reveal": return renderReveal();
        case "objectives": return renderObjectives();
        case "question": return renderEditorContent();
        default: return renderReveal();
      }
    }

    return (
      <div style={s.wrap}>
        <div style={s.body}>
          <div style={s.sidebar}>
            <div style={s.sidebarLabel}>PROGRESS</div>
            {sideItems.map((item, i) => {
              const isActive = NODES[nodeIndex]?.id === item.id || (nodeIndex >= NODES.length && i === sideItems.length - 1);
              const isDone = completedNodes.includes(item.id);
              return (
                <div key={item.id} style={s.sideItem(isActive, isDone)} onClick={() => setNodeIndex(i)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setNodeIndex(i); } }}>
                  <div style={s.sideItemDot(isActive, isDone)} /><div style={s.sideItemText(isActive, isDone)}>{item.label}</div>
                </div>
              );
            })}
          </div>
          <div style={{ ...s.main, overflowY: "auto" }}>
            {node?.type === "question" ? (
              <LessonEditorOutputTabs
                node={node}
                nodes={NODES}
                mainTab={mainTab}
                setMainTab={setMainTab}
                taskInstructionPulseNonce={taskInstructionPulseNonce}
                answer={answer}
                previewCode={answerShape === "multi-file" ? getMultiFilePreviewCode(answer) : undefined}
                getOutputPreview={getOutputPreview ?? (answerShape === "angular-tabs" ? (ans) => {
                  try {
                    const p = typeof ans === "string" ? JSON.parse(ans || "{}") : ans;
                    const html = (p?.html ?? "").trim();
                    const css = (p?.css ?? "").trim();
                    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html || "<p>Add markup in the HTML tab to see a preview.</p>"}</body></html>`;
                  } catch (_) { return "<!DOCTYPE html><html><body><p>Invalid answer format.</p></body></html>"; }
                } : undefined)}
                lessonIntro={lessonIntro}
                lessonObjectives={lessonObjectives}
              >
                {renderEditorContent()}
              </LessonEditorOutputTabs>
            ) : (
              renderNode()
            )}
          </div>
        </div>
      </div>
    );
  };
}
