import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import CodeEditor from "../engines/CodeEditor.jsx";
import "./AssistMeWorkspace.css";

// Eagerly loads every generated assist module's NODES export, keyed by filename.
// import.meta.glob is Vite's supported way to dynamically register a set of modules —
// this is how a module generated at runtime by ID Studio becomes loadable here without
// a manual import list. Matches both extensions: new modules are written as .tsx (they contain
// real TypeScript syntax), older ones on disk may still be plain .jsx — both are valid here.
const ASSIST_MODULES = import.meta.glob("../engines/assist/*.{jsx,tsx}", { eager: true });

function findModuleBySlug(slug) {
  const entry = Object.entries(ASSIST_MODULES).find(([path]) => path.includes(`inpact_assist_${slug}_engine`));
  return entry ? entry[1] : null;
}

/** Simplified local grading fallback for nodes without a custom evaluate() — NOT a byte-exact
 * port of inpact_engine_shared.jsx's fallback (which has extra sophistication this doesn't
 * replicate), just an honest, working approximation: keyword-ratio matching. */
function localEvaluate(node, answer) {
  if (typeof node.evaluate === "function") return node.evaluate(answer);
  const a = String(answer || "").toLowerCase().replace(/\s/g, "");
  const keywords = node.answer_keywords || [];
  if (keywords.length === 0) return a.trim() ? "partial" : "wrong";
  const hits = keywords.filter((kw) => a.includes(String(kw).toLowerCase().replace(/\s/g, ""))).length;
  const ratio = hits / keywords.length;
  if (ratio >= 0.8) return "correct";
  if (ratio >= 0.5) return "partial";
  return "wrong";
}

function ChatBubble({ label, children, tone = "default" }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`amw-bubble amw-bubble-${tone}`}>
      <button type="button" className="amw-bubble-head" onClick={() => setOpen((o) => !o)}>
        <span>{label}</span>
        <span className="amw-bubble-toggle">{open ? "–" : "+"}</span>
      </button>
      {open && <div className="amw-bubble-body">{children}</div>}
    </div>
  );
}

export default function AssistMeWorkspace() {
  const [params] = useSearchParams();
  const slug = params.get("module");
  const mode = params.get("mode") || "here"; // "here" | "local"

  const mod = useMemo(() => (slug ? findModuleBySlug(slug) : null), [slug]);
  const nodes = mod?.NODES || [];
  const questionNodes = nodes.filter((n) => n.type === "question");
  const introNode = nodes.find((n) => n.type === "reveal");
  const objectivesNode = nodes.find((n) => n.type === "objectives");

  const [activeId, setActiveId] = useState(questionNodes[0]?.id || introNode?.id || null);
  const activeNode = nodes.find((n) => n.id === activeId) || introNode;
  const [code, setCode] = useState(activeNode?.seed_code || "");
  const [result, setResult] = useState(null); // "correct" | "partial" | "wrong" | null
  const [attempts, setAttempts] = useState(0);
  const [mentorThread, setMentorThread] = useState([]);
  const [mentorDraft, setMentorDraft] = useState("");
  const [mentorLoading, setMentorLoading] = useState(false);
  const [mentorError, setMentorError] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    setCode(activeNode?.seed_code || activeNode?.starter_code || "");
    setResult(null);
    setAttempts(0);
  }, [activeId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [result, mentorThread]);

  function checkCode() {
    if (!activeNode || activeNode.type !== "question") return;
    const res = localEvaluate(activeNode, code);
    setResult(res);
    setAttempts((a) => a + 1);
  }

  async function sendMentorMessage() {
    const msg = mentorDraft.trim();
    if (!msg) return;
    setMentorLoading(true);
    setMentorError("");
    try {
      const res = await fetch("/api/assist-me/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleTag: slug, node: activeNode, question: msg, thread: mentorThread }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Mentor unavailable");
      setMentorThread((t) => [...t, { role: "user", content: msg }, { role: "assistant", content: data.reply }]);
      setMentorDraft("");
    } catch (err) {
      setMentorError(err.message);
    } finally {
      setMentorLoading(false);
    }
  }

  if (!slug) {
    return <div className="amw-empty">No module specified — open this from a task's "Assist me" button.</div>;
  }
  if (!mod) {
    return (
      <div className="amw-empty">
        No published module found for <code>{slug}</code>. It may still be pending generation/review in ID
        Studio.
      </div>
    );
  }

  // --- Instructions column content, shared between "here" and "local" modes ---
  const instructionsColumn = (
    <div className="amw-chat">
      <div className="amw-chat-scroll">
        {introNode && (
          <ChatBubble label={`📘 ${introNode.content?.title || "Lesson"}`} tone="intro">
            <p>{introNode.content?.body}</p>
            {introNode.content?.usecase && <p className="amw-usecase">{introNode.content.usecase}</p>}
          </ChatBubble>
        )}
        {objectivesNode && (
          <ChatBubble label="🎯 Objectives" tone="intro">
            <ul>
              {objectivesNode.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          </ChatBubble>
        )}
        {activeNode?.type === "question" && (
          <>
            <ChatBubble label={`✅ ${activeNode.phase || "Task"}`} tone="task">
              <p>{activeNode.paal}</p>
            </ChatBubble>
            {attempts > 0 && activeNode.hint && (
              <ChatBubble label="💡 Hint" tone="hint">
                <p>{activeNode.hint}</p>
              </ChatBubble>
            )}
            {activeNode.example_code && (
              <ChatBubble label="🧩 Example (different domain, same pattern)" tone="example">
                <pre>{activeNode.example_code}</pre>
              </ChatBubble>
            )}
            {mode === "here" && result && (
              <ChatBubble label={result === "correct" ? "✅ Correct" : result === "partial" ? "🟡 Almost" : "🔴 Not quite"} tone={result}>
                <p>{activeNode[`feedback_${result}`]}</p>
              </ChatBubble>
            )}
          </>
        )}
        {mentorThread.map((m, i) => (
          <ChatBubble key={i} label={m.role === "user" ? "🙋 You asked" : "🤖 Mentor"} tone={m.role}>
            <p>{m.content}</p>
          </ChatBubble>
        ))}
        {mentorError && <div className="amw-mentor-error">{mentorError}</div>}
        <div ref={chatEndRef} />
      </div>
      <div className="amw-mentor-box">
        <input
          value={mentorDraft}
          onChange={(e) => setMentorDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMentorMessage()}
          placeholder="Ask Mentor…"
          disabled={mentorLoading}
        />
        <button type="button" onClick={sendMentorMessage} disabled={mentorLoading || !mentorDraft.trim()}>
          {mentorLoading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );

  if (mode === "local") {
    return (
      <div className="amw amw-local">
        <div className="amw-local-banner">Coding locally — this panel is instructions + mentor only.</div>
        <div className="amw-col-instructions amw-col-instructions-solo">{instructionsColumn}</div>
      </div>
    );
  }

  return (
    <div className="amw amw-three-col">
      <div className="amw-col-explorer">
        <div className="amw-col-label">STEPS</div>
        {introNode && (
          <button type="button" className={`amw-explorer-item ${activeId === introNode.id ? "active" : ""}`} onClick={() => setActiveId(introNode.id)}>
            Lesson
          </button>
        )}
        {objectivesNode && (
          <button type="button" className={`amw-explorer-item ${activeId === objectivesNode.id ? "active" : ""}`} onClick={() => setActiveId(objectivesNode.id)}>
            Objectives
          </button>
        )}
        {questionNodes.map((n, i) => (
          <button key={n.id} type="button" className={`amw-explorer-item ${activeId === n.id ? "active" : ""}`} onClick={() => setActiveId(n.id)}>
            Step {i + 1}
          </button>
        ))}
      </div>
      <div className="amw-col-editor">
        {activeNode?.type === "question" ? (
          <>
            <CodeEditor value={code} onChange={setCode} height="100%" language="typescript" onSubmitShortcut={checkCode} />
            <div className="amw-editor-actions">
              <button type="button" onClick={checkCode}>
                Check my code {"{ctrl+shift+enter}"}
              </button>
            </div>
          </>
        ) : (
          <div className="amw-editor-placeholder">Select a step to start coding.</div>
        )}
      </div>
      <div className="amw-col-instructions">{instructionsColumn}</div>
    </div>
  );
}
