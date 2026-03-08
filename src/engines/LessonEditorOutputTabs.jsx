import { useRef, useEffect } from "react";

/**
 * Shared Lesson | Editor | Output tabs + YOUR TASK callout.
 * Use in any custom engine (Angular, React P01, etc.) for uniform UX.
 * - Lesson: parses node.paal for "Your task:" / "Your turn:" and shows callout.
 * - Editor: task block (same as EditorTaskBlock) + children.
 * - Output: getOutputPreview(answer) if provided, else placeholder.
 *
 * EditorTaskBlock is exported so engines without tabs (P02–P11) can show
 * the same task-above-editor UI for consistency app-wide.
 */
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
  outputIframe: { height: "calc(100vh - 180px)", minHeight: "400px", background: "#0d1117", borderRadius: "8px", border: "1px solid #1e2733", overflow: "hidden" },
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
  const lessonScrollRef = useRef(null);
  const hasOutput = typeof getOutputPreview === "function";
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
              <span>Switch to the <strong style={{ color: "#00d4ff" }}>Editor</strong> tab to write your code{hasOutput ? ", then " : ""}{hasOutput ? <><strong style={{ color: "#00d4ff" }}>Output</strong> to see the result</> : null}.</span>
            </div>
          </div>
        </div>
      )}
      {mainTab === "editor" && (
        <>
          {showTaskInEditor && <EditorTaskBlock node={node} />}
          {children}
        </>
      )}
      {mainTab === "output" && (
        hasOutput ? (
          <div style={lessonStyles.outputIframe}>
            <iframe title="Preview" srcDoc={getOutputPreview(answer)} style={{ width: "100%", height: "100%", border: "none" }} />
          </div>
        ) : (
          <div style={lessonStyles.outputPlaceholder}>
            No live preview for this problem. Run your code in your local environment, CodeSandbox, or your app to see the result.
          </div>
        )
      )}
    </>
  );
}
