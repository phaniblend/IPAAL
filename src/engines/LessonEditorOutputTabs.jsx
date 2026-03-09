import { useRef, useEffect } from "react";

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
    code.match(/(?:const|let|var)\s+([A-Z][a-zA-Z0-9]*)\s*=/);
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
  <script type="text/babel">
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
    body { margin: 0; padding: 20px; background: #1a1d2e; font-family: monospace; font-size: 13px; }
    pre { color: #a5f3fc; white-space: pre-wrap; word-break: break-word; line-height: 1.7; margin: 0; }
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
  phase: { fontSize: "10px", letterSpacing: "3px", color: "#00d4ff", marginBottom: "16px" },
  badge: { display: "inline-block", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "#f59e0b", marginBottom: "12px", background: "rgba(245,158,11,0.12)", padding: "6px 12px", borderRadius: "6px", border: "1px solid rgba(245,158,11,0.4)" },
  card: { background: "linear-gradient(135deg, rgba(0,212,255,0.06) 0%, rgba(124,58,237,0.06) 100%)", border: "1px solid rgba(0,212,255,0.25)", borderLeft: "4px solid #00d4ff", borderRadius: "12px", padding: "24px 28px", marginBottom: "24px", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" },
  paalLabel: { fontSize: "10px", color: "#00d4ff", letterSpacing: "2px", marginBottom: "10px", fontWeight: 600 },
  paalText: { fontSize: "16px", color: "#e2e8f0", lineHeight: "1.75", whiteSpace: "pre-wrap" },
  taskCard: { background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.35)", borderLeft: "4px solid #f59e0b", borderRadius: "10px", padding: "18px 22px", marginTop: "20px", marginBottom: "24px" },
  taskLabel: { fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", color: "#f59e0b", marginBottom: "8px" },
  taskText: { fontSize: "15px", color: "#fef3c7", lineHeight: "1.65", whiteSpace: "pre-wrap" },
  editorTaskWrap: { maxWidth: "760px", marginBottom: "14px" },
  editorTaskBox: { background: "#0d1117", border: "1px solid #1e2733", borderLeft: "3px solid #00d4ff", borderRadius: "8px", padding: "14px 16px" },
  editorTaskLabel: { fontSize: "10px", color: "#00d4ff", letterSpacing: "2px", marginBottom: "8px", fontWeight: 700 },
  editorTaskText: { fontSize: "14px", color: "#cbd5e0", lineHeight: "1.6", whiteSpace: "pre-wrap" },
  cta: { marginTop: "28px", padding: "14px 20px", background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)", borderRadius: "8px", fontSize: "13px", color: "#a5f3fc", lineHeight: "1.6", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" },
  tabBar: { display: "flex", gap: "4px", marginBottom: "16px", borderBottom: "1px solid #1e2733", paddingBottom: "12px" },
  tab: (active) => ({ padding: "8px 16px", fontSize: "12px", fontWeight: 600, background: active ? "#1a2332" : "transparent", border: active ? "1px solid #00d4ff" : "1px solid #2d3748", color: active ? "#00d4ff" : "#64748b", borderRadius: "6px", cursor: "pointer" }),
  outputPlaceholder: { height: "calc(100vh - 180px)", minHeight: "320px", background: "#0d1117", borderRadius: "8px", border: "1px solid #1e2733", padding: "32px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px", textAlign: "center", fontSize: "14px", color: "#64748b", lineHeight: 1.6, maxWidth: "420px", margin: "0 auto" },
  outputIframe: { width: "100%", height: "calc(100vh - 180px)", minHeight: "400px", background: "#0d1117", borderRadius: "8px", border: "1px solid #1e2733", overflow: "hidden" },
};

/** Same task block shown above the editor everywhere (tabs and non-tabs). Parses "Your task:" / "Your turn:" for callout. */
export function EditorTaskBlock({ node }) {
  const paal = node?.paal || "";
  const markerMatch = paal.match(/your\s+(?:task|turn)\s*:/i);
  const markerIdx = markerMatch ? markerMatch.index : -1;
  const mainText = markerIdx >= 0 ? paal.slice(0, markerIdx).trim() : paal;
  const taskText = markerIdx >= 0 ? paal.slice(markerIdx).trim() : "";
  if (!paal) return null;
  return (
    <div style={lessonStyles.editorTaskWrap}>
      <div style={lessonStyles.editorTaskBox}>
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
  getOutputPreview,
  showTaskInEditor = true,
  children,
}) {
  const code = typeof answer === "string" ? answer : "";
  const hasOutput = typeof getOutputPreview === "function";
  const isReact = !hasOutput && isReactCode(code);
  const isAngular = !hasOutput && !isReact && isAngularTemplate(code);
  const lessonScrollRef = useRef(null);
  const introNode = introNodeFromNodes(nodes);
  const objectivesNode = objectivesNodeFromNodes(nodes);
  const problemContent = introNode?.content || {};
  const objectives = objectivesNode?.items || [];
  const paal = node?.paal || "";
  const markerMatch = paal.match(/your\s+(?:task|turn)\s*:/i);
  const markerIdx = markerMatch ? markerMatch.index : -1;
  const mainText = markerIdx >= 0 ? paal.slice(0, markerIdx).trim() : paal;
  const taskText = markerIdx >= 0 ? paal.slice(markerIdx).trim() : "";

  useEffect(() => {
    if (mainTab !== "lesson") return;
    const el = lessonScrollRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
    return () => cancelAnimationFrame(id);
  }, [mainTab]);

  return (
    <>
      <div style={lessonStyles.tabBar}>
        <button type="button" style={lessonStyles.tab(mainTab === "lesson")} onClick={() => setMainTab("lesson")}>Lesson</button>
        <button type="button" style={lessonStyles.tab(mainTab === "editor")} onClick={() => setMainTab("editor")}>Editor</button>
        <button type="button" style={lessonStyles.tab(mainTab === "output")} onClick={() => setMainTab("output")}>Output</button>
      </div>
      {mainTab === "lesson" && (
        <div ref={lessonScrollRef} style={lessonStyles.lessonScroll}>
          <div style={lessonStyles.wrap}>
            <div style={lessonStyles.badge}>📖 LESSON</div>
            {(problemContent.title || problemContent.body || problemContent.usecase) && (
              <div style={lessonStyles.card}>
                <div style={lessonStyles.paalLabel}>TOPICS & CONCEPTS</div>
                {problemContent.tag && <div style={{ fontSize: "11px", color: "#a78bfa", marginBottom: "8px" }}>{problemContent.tag}</div>}
                {problemContent.title && <div style={{ fontSize: "18px", fontWeight: 600, color: "#e2e8f0", marginBottom: "12px" }}>{problemContent.title}</div>}
                {problemContent.body && <div style={lessonStyles.paalText}>{problemContent.body}</div>}
                {problemContent.usecase && <div style={{ marginTop: "14px", fontSize: "14px", color: "#94a3b8", fontStyle: "italic" }}>{problemContent.usecase}</div>}
              </div>
            )}
            {objectives.length > 0 && (
              <div style={lessonStyles.card}>
                <div style={lessonStyles.paalLabel}>LEARNING OBJECTIVES</div>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#e2e8f0", lineHeight: 1.85, fontSize: "15px" }}>
                  {objectives.map((item, i) => (
                    <li key={i} style={{ marginBottom: "6px" }}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {node?.phase && (
              <div style={{ ...lessonStyles.card, borderLeftColor: "rgba(245,158,11,0.6)" }}>
                <div style={{ ...lessonStyles.paalLabel, color: "#f59e0b" }}>THIS STEP — {node.phase}</div>
                <div style={lessonStyles.paalText}>{mainText}</div>
                {taskText ? (
                  <div style={lessonStyles.taskCard} className="inpact-task-callout">
                    <div style={lessonStyles.taskLabel} className="inpact-task-badge">YOUR TASK</div>
                    <div style={lessonStyles.taskText}>{taskText}</div>
                  </div>
                ) : null}
              </div>
            )}
            <div style={lessonStyles.cta}>
              <span style={{ fontSize: "18px" }}>👉</span>
              <span>Switch to the <strong style={{ color: "#00d4ff" }}>Editor</strong> tab to write your code, then <strong style={{ color: "#00d4ff" }}>Output</strong> to see the result.</span>
            </div>
          </div>
        </div>
      )}
      {mainTab === "editor" && (
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, width: "100%" }}>
          {showTaskInEditor && <EditorTaskBlock node={node} />}
          <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
            {children}
          </div>
        </div>
      )}
      {mainTab === "output" && (() => {
        if (hasOutput) {
          return (
            <div style={lessonStyles.outputIframe}>
              <iframe
                title="Preview"
                srcDoc={injectBaseStyles(getOutputPreview(answer))}
                style={{ width: "100%", height: "100%", border: "none" }}
                sandbox="allow-scripts"
              />
            </div>
          );
        }
        if (isReact) {
          return (
            <div style={lessonStyles.outputIframe}>
              <iframe
                title="React Preview"
                srcDoc={generateReactPreview(code)}
                style={{ width: "100%", height: "100%", border: "none" }}
                sandbox="allow-scripts"
              />
            </div>
          );
        }
        if (isAngular) {
          return (
            <div style={lessonStyles.outputIframe}>
              <iframe
                title="Template Preview"
                srcDoc={generateTemplatePreview(code)}
                style={{ width: "100%", height: "100%", border: "none" }}
                sandbox="allow-scripts"
              />
            </div>
          );
        }
        return (
          <div style={lessonStyles.outputPlaceholder}>
            <span style={{ fontSize: "32px" }}>🖥️</span>
            <div>Write your code in the <strong style={{ color: "#00d4ff" }}>Editor</strong> tab, then come back here to see the output.</div>
            <div style={{ fontSize: "12px", color: "#4a5568", marginTop: "4px" }}>You can also paste your code into <a href="https://codesandbox.io" target="_blank" rel="noreferrer" style={{ color: "#00d4ff" }}>CodeSandbox</a> for a full live environment.</div>
          </div>
        );
      })()}
    </>
  );
}
