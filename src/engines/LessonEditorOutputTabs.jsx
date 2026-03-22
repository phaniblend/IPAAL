import { useRef, useEffect, useState } from "react";

/**
 * Shared Lesson | Editor | Output tabs + YOUR TASK callout.
 * - Lesson: parses node.paal for "Your task:" / "Your turn:" and shows callout.
 * - Editor: task block (same as EditorTaskBlock) + children.
 * - Output: getOutputPreview(answer) if provided; auto React live preview via
 *   Babel Standalone when code looks like a React component; formatted code
 *   preview for Angular/other templates.
 */

/** Inject reset + background into any HTML string returned by getOutputPreview */
function injectBaseStyles(html) {
  if (typeof html !== "string" || !html) return html;
  const base = `<style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; padding: 20px; background: #f0f4f8; font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; font-size: 14px; color: #1a202c; line-height: 1.5; }
  </style>`;
  return html.includes("</head>")
    ? html.replace("</head>", base + "</head>")
    : base + html;
}

/** Detect if code looks like a React component */
function isReactCode(code) {
  return (
    /\breturn\s*\(?\s*</.test(code) ||
    /React\.createElement/.test(code) ||
    /useState|useEffect|useRef|useMemo|useCallback|useReducer/.test(code)
  );
}

/** Detect if code looks like an Angular/HTML template */
function isAngularTemplate(code) {
  return (
    /\*ngFor|\*ngIf|\[\(ngModel\)\]|\[ngClass\]|\(click\)/.test(code) ||
    (/<[a-z][\s\S]*>/i.test(code) && !isReactCode(code))
  );
}

/** Generate a live React preview iframe HTML using Babel Standalone CDN */
function generateReactPreview(code) {
  if (!code || !code.trim()) {
    return `<!DOCTYPE html><html><body style="background:#f0f4f8;padding:24px;font-family:system-ui,sans-serif;color:#64748b;font-size:14px">Write your React component in the Editor tab to see a live preview here.</body></html>`;
  }

  // Find the main component name from the source code
  const nameMatch =
    code.match(/(?:export\s+default\s+)?function\s+([A-Z][a-zA-Z0-9]*)\s*[({]/) ||
    code.match(/(?:const|let|var)\s+([A-Z][a-zA-Z0-9]*)\s*=/) ||
    code.match(/export\s+default\s+([A-Z][a-zA-Z0-9]*)/);
  const componentName = nameMatch ? nameMatch[1] : "App";

  // Strip import lines and convert `export default function X` → `function X`
  const safeCode = code
    .split("\n")
    .filter((l) => !l.trim().startsWith("import "))
    .join("\n")
    .replace(/export\s+default\s+function\s+/g, "function ")
    .replace(/export\s+default\s+/g, "")
    .replace(/export\s+/g, "")
    .replace(/<\/script>/gi, "<\\/script>");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { margin: 0; padding: 20px; background: #f0f4f8; font-family: system-ui, -apple-system, sans-serif; font-size: 14px; color: #1a202c; }
    .error-box { background: #fff1f0; border: 1px solid #ffa39e; color: #c0392b; padding: 12px 16px; border-radius: 6px; font-family: monospace; font-size: 12px; white-space: pre-wrap; margin-top: 8px; }
    .loading { color: #94a3b8; font-size: 13px; }
  </style>
</head>
<body>
  <div id="root"><span class="loading">Loading preview…</span></div>
  <script type="text/babel" data-presets="typescript,react">
    const { useState, useEffect, useRef, useMemo, useCallback, useReducer, useContext } = React;
    try {
      ${safeCode}
      ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(${componentName}));
    } catch(e) {
      document.getElementById('root').innerHTML = '<div class="error-box">Error: ' + e.message + '</div>';
    }
  </script>
</body>
</html>`;
}

/** Generate a formatted Angular/HTML template preview */
function generateTemplatePreview(code) {
  if (!code || !code.trim()) {
    return `<!DOCTYPE html><html><body style="background:#f0f4f8;padding:24px;font-family:system-ui,sans-serif;color:#64748b;font-size:14px">Write your template code in the Editor tab to see a preview here.</body></html>`;
  }
  const escaped = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 20px; background: #f8fafc; font-family: monospace; font-size: 13px; color: #334155; }
    pre { color: #0f172a; white-space: pre-wrap; word-break: break-word; line-height: 1.7; margin: 0; }
    .note { font-family: system-ui, sans-serif; font-size: 12px; color: #64748b; margin-bottom: 14px; padding: 10px 14px; background: rgba(100,116,139,0.1); border-left: 3px solid #475569; border-radius: 4px; }
    .tag { color: #7dd3fc; }
    .attr { color: #86efac; }
    .val { color: #fde68a; }
  </style>
</head>
<body>
  <div class="note">📋 Angular template — code preview (runtime execution requires a full Angular environment)</div>
  <pre>${escaped}</pre>
</body>
</html>`;
}
const lessonStyles = {
  wrap: { maxWidth: "640px" },
  lessonScroll: { maxHeight: "calc(100vh - 220px)", overflowY: "auto", overflowX: "hidden" },
  phase: { fontSize: "10px", letterSpacing: "3px", color: "#0891b2", marginBottom: "16px" },
  badge: { display: "inline-block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "#b45309", marginBottom: "12px", background: "rgba(245,158,11,0.15)", padding: "6px 12px", borderRadius: "6px", border: "1px solid rgba(245,158,11,0.4)" },
  card: { background: "#ffffff", border: "1px solid #e2e8f0", borderLeft: "4px solid #0891b2", borderRadius: "12px", padding: "24px 28px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  paalLabel: { fontSize: "10px", color: "#0891b2", letterSpacing: "2px", marginBottom: "10px", fontWeight: 600 },
  paalText: { fontSize: "16px", color: "#334155", lineHeight: "1.75", whiteSpace: "pre-wrap" },
  taskCard: { background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.35)", borderLeft: "4px solid #f59e0b", borderRadius: "10px", padding: "18px 22px", marginTop: "20px", marginBottom: "24px" },
  taskLabel: { fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", color: "#b45309", marginBottom: "8px" },
  taskText: { fontSize: "15px", color: "#422006", lineHeight: "1.65", whiteSpace: "pre-wrap" },
  editorTaskWrap: { width: "100%", marginBottom: "4px", flexShrink: 0 },
  editorTaskBox: { background: "#ffffff", border: "1px solid #e2e8f0", borderLeft: "4px solid #0891b2", borderRadius: "8px", padding: "8px 12px", boxShadow: "0 1px 2px rgba(0,0,0,0.04)" },
  editorTaskLabel: { fontSize: "9px", color: "#0891b2", letterSpacing: "0.12em", marginBottom: "2px", fontWeight: 700 },
  editorTaskText: { fontSize: "13px", color: "#334155", lineHeight: "1.45", whiteSpace: "pre-wrap" },
  cta: { marginTop: "28px", padding: "14px 20px", background: "rgba(8,145,178,0.08)", border: "1px solid rgba(8,145,178,0.25)", borderRadius: "8px", fontSize: "13px", color: "#0e7490", lineHeight: "1.6", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" },
  tabBar: { display: "flex", gap: "6px", marginBottom: "4px", borderBottom: "none", paddingBottom: "0", flexShrink: 0 },
  tab: (active) => ({ padding: "10px 18px", fontSize: "12px", fontWeight: 600, background: "#ffffff", border: active ? "1px solid #0891b2" : "1px solid #e2e8f0", color: active ? "#0891b2" : "#64748b", borderRadius: "8px", cursor: "pointer" }),
  outputPlaceholder: { height: "calc(100vh - 180px)", minHeight: "320px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", padding: "32px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px", textAlign: "center", fontSize: "14px", color: "#64748b", lineHeight: 1.6, maxWidth: "420px", margin: "0 auto" },
  outputIframe: { width: "100%", height: "calc(100vh - 180px)", minHeight: "400px", background: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", overflow: "hidden" },
};

/** Same task block shown above the editor everywhere (tabs and non-tabs). Parses "Your task:" / "Your turn:" for callout. */
export function EditorTaskBlock({ node, taskInstructionPulseNonce = 0 }) {
  const paal = node?.paal || "";
  const markerMatch = paal.match(/your\s+(?:task|turn)\s*:/i);
  const markerIdx = markerMatch ? markerMatch.index : -1;
  const mainText = markerIdx >= 0 ? paal.slice(0, markerIdx).trim() : paal;
  const taskText = markerIdx >= 0 ? paal.slice(markerIdx).trim() : "";
  if (!paal) return null;
  const pulseClass = taskInstructionPulseNonce > 0 ? " inpact-editor-task-box--pulse" : "";
  return (
    <div style={lessonStyles.editorTaskWrap}>
      <div
        key={taskInstructionPulseNonce}
        style={lessonStyles.editorTaskBox}
        className={`inpact-editor-task-box${pulseClass}`}
      >
        <div style={lessonStyles.editorTaskLabel}>TASK</div>
        {mainText ? <div style={lessonStyles.editorTaskText}>{mainText}</div> : null}
        {taskText ? (
          <div style={{ ...lessonStyles.taskCard, marginTop: "12px", marginBottom: 0 }} className="inpact-task-callout">
            <div style={lessonStyles.taskLabel} className="inpact-task-badge">YOUR TASK</div>
            <div style={lessonStyles.taskText}>{taskText}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const introNodeFromNodes = (nodes) => nodes?.find((n) => n.type === "reveal" && (n.id === "intro" || n.phase === "Problem")) || nodes?.find((n) => n.type === "reveal");
const objectivesNodeFromNodes = (nodes) => nodes?.find((n) => n.type === "objectives");

export default function LessonEditorOutputTabs({
  node,
  nodes,
  mainTab,
  setMainTab,
  answer = "",
  previewCode = "",
  getOutputPreview,
  showTaskInEditor = true,
  tabsInSidebar = false,
  lessonIntro = null,
  lessonObjectives = null,
  /** Increment when learner advances from feedback modal "Next step" — subtle pulse on TASK box */
  taskInstructionPulseNonce = 0,
  children,
}) {
  const code = typeof previewCode === "string" && previewCode.trim() ? previewCode : (typeof answer === "string" ? answer : "");
  const hasOutput = typeof getOutputPreview === "function";
  const isReact = !hasOutput && isReactCode(code);
  const isAngular = !hasOutput && !isReact && isAngularTemplate(code);
  const [showOutputModal, setShowOutputModal] = useState(false);
  const lessonScrollRef = useRef(null);
  const introNode = introNodeFromNodes(nodes);
  const objectivesNode = objectivesNodeFromNodes(nodes);
  const problemContent = introNode?.content || (lessonIntro && { tag: lessonIntro.tag, title: lessonIntro.title, body: lessonIntro.body, usecase: lessonIntro.usecase }) || {};
  const objectives = objectivesNode?.items || (Array.isArray(lessonObjectives) ? lessonObjectives : []);

  /** Same content as former Output tab: HTML for iframe or placeholder */
  const outputContent = hasOutput
    ? injectBaseStyles(getOutputPreview(answer))
    : isReact
      ? generateReactPreview(code)
      : isAngular
        ? generateTemplatePreview(code)
        : null;

  useEffect(() => {
    if (mainTab !== "lesson") return;
    const el = lessonScrollRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => { el.scrollTop = 0; });
    return () => cancelAnimationFrame(id);
  }, [mainTab]);

  return (
    <>
      {!tabsInSidebar && (
        <div style={{ ...lessonStyles.tabBar, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <button type="button" style={lessonStyles.tab(mainTab === "lesson")} onClick={() => setMainTab("lesson")}>Lesson</button>
            <button type="button" style={lessonStyles.tab(mainTab === "editor")} onClick={() => setMainTab("editor")}>Editor</button>
          </div>
          <button
            type="button"
            style={{ ...lessonStyles.tab(false), borderColor: "#0891b2", color: "#0891b2", fontSize: "11px" }}
            onClick={() => setShowOutputModal(true)}
          >
            🖥️ Preview
          </button>
        </div>
      )}
      {mainTab === "lesson" && (
        <div ref={lessonScrollRef} style={lessonStyles.lessonScroll}>
          <div style={lessonStyles.wrap}>
            <div style={lessonStyles.badge}>📖 LESSON</div>
            {(problemContent.title || problemContent.body || problemContent.usecase) && (
              <div style={lessonStyles.card}>
                <div style={lessonStyles.paalLabel}>TOPICS & CONCEPTS</div>
                {problemContent.tag && <div style={{ fontSize: "11px", color: "#7c3aed", marginBottom: "8px" }}>{problemContent.tag}</div>}
                {problemContent.title && <div style={{ fontSize: "18px", fontWeight: 600, color: "#0f172a", marginBottom: "12px" }}>{problemContent.title}</div>}
                {problemContent.body && <div style={lessonStyles.paalText}>{problemContent.body}</div>}
                {problemContent.usecase && <div style={{ marginTop: "14px", fontSize: "14px", color: "#94a3b8", fontStyle: "italic" }}>{problemContent.usecase}</div>}
              </div>
            )}
            {objectives.length > 0 && (
              <div style={lessonStyles.card}>
                <div style={lessonStyles.paalLabel}>LEARNING OBJECTIVES</div>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#334155", lineHeight: 1.85, fontSize: "15px" }}>
                  {objectives.map((item, i) => (
                    <li key={i} style={{ marginBottom: "6px" }}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <div style={lessonStyles.cta}>
              <span style={{ fontSize: "18px" }}>👉</span>
              <span>Switch to the <strong style={{ color: "#0891b2" }}>Editor</strong> tab to write your code, then click <strong style={{ color: "#0891b2" }}>Preview</strong> to see the output.</span>
            </div>
          </div>
        </div>
      )}
      {mainTab === "editor" && (
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, width: "100%", maxWidth: "100%", overflow: "hidden" }}>
          {showTaskInEditor && <EditorTaskBlock node={node} taskInstructionPulseNonce={taskInstructionPulseNonce} />}
          <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", minWidth: 0, maxWidth: "100%", overflow: "hidden" }}>
            {children}
          </div>
        </div>
      )}
      {showOutputModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(15, 23, 42, 0.6)",
            padding: "24px",
            boxSizing: "border-box",
          }}
          onClick={() => setShowOutputModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="output-modal-title"
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "12px",
              overflow: "hidden",
              width: "100%",
              maxWidth: "900px",
              height: "85vh",
              maxHeight: "720px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
              border: "1px solid #e2e8f0",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
              <span id="output-modal-title" style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>🖥️ Output preview</span>
              <button type="button" onClick={() => setShowOutputModal(false)} style={{ padding: "6px 14px", fontSize: "12px", fontWeight: 600, background: "#0891b2", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}>Close</button>
            </div>
            <div style={{ flex: 1, minHeight: 0, background: "#f8fafc" }}>
              {outputContent ? (
                <iframe
                  title="Preview"
                  srcDoc={outputContent}
                  style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                  sandbox="allow-scripts"
                />
              ) : (
                <div style={{ ...lessonStyles.outputPlaceholder, height: "100%", minHeight: "280px", maxWidth: "none" }}>
                  <span style={{ fontSize: "32px" }}>🖥️</span>
                  <div>Write your code in the <strong style={{ color: "#0891b2" }}>Editor</strong> tab, then click Preview to see the output here.</div>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>You can also paste your code into <a href="https://codesandbox.io" target="_blank" rel="noreferrer" style={{ color: "#0891b2" }}>CodeSandbox</a> for a full live environment.</div>
                  <button type="button" onClick={() => setShowOutputModal(false)} style={{ marginTop: "12px", padding: "8px 16px", fontSize: "12px", fontWeight: 600, background: "#e2e8f0", color: "#475569", border: "none", borderRadius: "6px", cursor: "pointer" }}>Close</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
