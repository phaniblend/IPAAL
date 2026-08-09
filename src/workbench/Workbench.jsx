import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth.js";
import "./Workbench.css";

const MODULE_LIBRARY_PROJECT_ID = 4;

async function api(path, opts) {
  const res = await fetch(`/onedev-api${path}`, {
    headers: { "Content-Type": "application/json", ...(opts?.headers || {}) },
    ...opts,
  });
  if (!res.ok) throw new Error(`OneDev API ${res.status}: ${await res.text()}`);
  return res.json();
}

const EMPTY_ISSUE = { title: "", description: "" };

/** A task published by SpecForge always carries one of these markers (server/specforge-router.js).
 * A task created by hand in Workbench carries neither — that's the "none" fallback below, which
 * keeps the old manual picker so nothing breaks for tasks outside the SpecForge pipeline. */
function parseAssistInfo(description) {
  const wired = /^AssistModule:\s*(.+)$/m.exec(description || "");
  if (wired) return { status: "wired", tag: wired[1].trim() };
  if (/^NeedsTutorial:\s*true/m.test(description || "")) return { status: "blocked" };
  if (/^NoTutorialNeeded:\s*true/m.test(description || "")) return { status: "exempt" };
  return { status: "none" };
}

/** "Assist me" button + choice: code here (3-column workspace) vs code locally (instructions only).
 * A task wired to a specific tutorial (AssistModule:) launches straight into it — no picker, because
 * the wiring was already decided at publish time by SpecForge's classifier / ID Studio's review.
 * A task still waiting on a tutorial (NeedsTutorial: true) shows as blocked, not clickable — it was
 * never made assignable without one. Anything with neither marker falls back to the old manual picker. */
function AssistMeButton({ task, publishedModules }) {
  const info = parseAssistInfo(task.description);
  const [open, setOpen] = useState(false);
  const [pickedTag, setPickedTag] = useState("");
  // Derived, not synced via effect: publishedModules can arrive after this button already mounted
  // with an empty list, so the default has to be computed at render time, not pushed into state.
  const moduleTag = pickedTag || publishedModules[0]?.tag || "";

  function launch(mode, tag) {
    window.location.hash = `#/assist-me?module=${encodeURIComponent(tag)}&mode=${mode}`;
  }

  if (info.status === "blocked") {
    return <span className="workbench-assist-blocked">⏳ Tutorial pending ID Studio review</span>;
  }

  if (info.status === "exempt") {
    return <span className="workbench-assist-exempt">No tutorial needed for this trade</span>;
  }

  if (!open) {
    return (
      <button type="button" className="workbench-assist-btn" onClick={() => setOpen(true)}>
        🧩 Assist me
      </button>
    );
  }

  if (info.status === "wired") {
    return (
      <div className="workbench-assist-popover">
        <p className="workbench-assist-wired">
          Wired tutorial: <code>{info.tag}</code>
        </p>
        <p className="workbench-assist-question">How do you want to work on this?</p>
        <button type="button" onClick={() => launch("local", info.tag)}>
          I'll follow instructions from here and code in my local
        </button>
        <button type="button" className="workbench-assist-primary" onClick={() => launch("here", info.tag)}>
          I'll develop here
        </button>
        <button type="button" className="workbench-assist-cancel" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    );
  }

  // info.status === "none" — a task from outside the SpecForge pipeline; no wiring decision was
  // ever made for it, so fall back to picking manually from whatever's published.
  if (publishedModules.length === 0) {
    return (
      <div className="workbench-assist-popover">
        <p>No published assistance modules yet — nothing in the Module Library to launch.</p>
        <button type="button" onClick={() => setOpen(false)}>
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="workbench-assist-popover">
      <label>
        Module
        <select value={moduleTag} onChange={(e) => setPickedTag(e.target.value)}>
          {publishedModules.map((m) => (
            <option key={m.tag} value={m.tag}>
              {m.tag}
            </option>
          ))}
        </select>
      </label>
      <p className="workbench-assist-question">How do you want to work on this?</p>
      <button type="button" onClick={() => launch("local", moduleTag)}>
        I'll follow instructions from here and code in my local
      </button>
      <button type="button" className="workbench-assist-primary" onClick={() => launch("here", moduleTag)}>
        I'll develop here
      </button>
      <button type="button" className="workbench-assist-cancel" onClick={() => setOpen(false)}>
        Cancel
      </button>
    </div>
  );
}

/** A real task's description is a `Key: value` marker block (Epic/Story/Trade/TechLevel/Cohort/
 * NeedsTutorial), not prose — found live, feeding the raw block to scoreOverlap diluted every
 * match with unrelated label words and turned a real curated-tier match into "none." Pull out just
 * the actual descriptive content: the title plus AcceptanceCriteria's text, marker label stripped. */
function taskSearchText(task) {
  const acRaw = /^AcceptanceCriteria:\s*(.+)$/m.exec(task.description || "")?.[1] || "";
  return `${task.title} ${acRaw.replace(/;/g, " ")}`;
}

/** Core-lesson routing with a real assistance session (docs/IPF_DEVGUIDE.md §5a-4) — additive
 * alongside AssistMeButton, never replacing it. Picking a lesson is a real, logged human choice
 * (same "logged decision, not an algorithm's guess" philosophy as everywhere else) — the server
 * re-validates the choice and owns the session/token, so this component only ever asks for a
 * match, asks to launch one of the results, and navigates. Same-tab, not a new tab: now that
 * completion redirects back here automatically, a new tab would just orphan itself instead of
 * closing the loop. */
function TryCoreLesson({ task }) {
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error | launching
  const [error, setError] = useState("");

  function check() {
    setStatus("loading");
    fetch(`/api/id/core-lesson-match?query=${encodeURIComponent(taskSearchText(task))}`)
      .then((r) => r.json())
      .then((data) => {
        setResult(data);
        setStatus("done");
      })
      .catch(() => setStatus("error"));
  }

  async function launch(lesson) {
    setStatus("launching");
    setError("");
    try {
      const res = await fetch("/api/id/assistance-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: task.id, taskTitle: task.title, lessonKey: lesson.lessonKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Session creation failed (${res.status})`);
      window.location.assign(data.url);
    } catch (err) {
      setError(err.message);
      setStatus("done"); // back to the results view, showing the error, rather than a dead-end
    }
  }

  if (status === "idle") {
    return (
      <button type="button" className="workbench-core-lesson-check" onClick={check}>
        📘 Try a core lesson
      </button>
    );
  }
  if (status === "loading") return <span className="workbench-core-lesson-loading">Checking core lessons…</span>;
  if (status === "launching") return <span className="workbench-core-lesson-loading">Opening lesson…</span>;
  if (status === "error" || !result) return <span className="workbench-core-lesson-loading">Core lessons unreachable — is the lessons app running?</span>;
  if (result.none) return <span className="workbench-core-lesson-loading">No close core lesson found for this task.</span>;

  const options = result.auto ? [result.auto] : result.curated;
  return (
    <div className="workbench-core-lesson-results">
      {!result.auto && <p className="workbench-core-lesson-hint">No confident match — closest core lessons:</p>}
      {options.map((lesson) => (
        <button key={lesson.lessonKey} type="button" className="workbench-core-lesson-link" onClick={() => launch(lesson)}>
          {lesson.title} →
        </button>
      ))}
      {error && <p className="workbench-core-lesson-error">{error}</p>}
    </div>
  );
}

export default function Workbench() {
  const { session, status: authStatus } = useAuth();
  // A JS applicant gets a "your tasks only" view (myTasks* state below) — a -core account gets the
  // existing full admin-style board (every project, every task). Was undifferentiated until now:
  // founder call 2026-08-09, found live when a JS's "View your task" link landed on the exact same
  // full project switcher + every product's board that Core Studio uses to manage everything.
  const isJS = session?.accountType === "js";

  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newIssue, setNewIssue] = useState(EMPTY_ISSUE);
  const [creating, setCreating] = useState(false);
  const [publishedModules, setPublishedModules] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const completedTaskId = searchParams.get("tutorialCompleted");
  // Deep link from Apply's "You're matched" screen (recruit-router.js's response carries both ids) —
  // lands you on the right project with your actual task highlighted, instead of the default first
  // project with no indication which of possibly 100+ cards is yours. Only meaningful for the
  // -core board view below; the JS view doesn't need it (there's nothing to scroll through).
  const highlightTaskId = searchParams.get("highlightTaskId");
  const highlightProjectId = searchParams.get("highlightProjectId");

  const [myTasks, setMyTasks] = useState([]);
  const [myTasksLoading, setMyTasksLoading] = useState(true);
  const [myTasksError, setMyTasksError] = useState("");

  useEffect(() => {
    if (!isJS) return;
    setMyTasksLoading(true);
    setMyTasksError("");
    fetch("/api/recruit/my-tasks")
      .then((r) => r.json().then((data) => ({ ok: r.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || "Couldn't load your tasks");
        setMyTasks(data.tasks);
      })
      .catch((err) => setMyTasksError(err.message))
      .finally(() => setMyTasksLoading(false));
  }, [isJS]);

  useEffect(() => {
    api(`/issues?offset=0&count=200`)
      .then((all) =>
        setPublishedModules(
          all
            .filter((i) => i.projectId === MODULE_LIBRARY_PROJECT_ID && i.title.startsWith("Module:"))
            .map((i) => ({ tag: i.title.replace("Module: ", "") }))
        )
      )
      .catch(() => {});
  }, []); // needed by both views — AssistMeButton renders in the JS view's cards too

  const loadIssues = useCallback(async (pid) => {
    if (!pid) return;
    const data = await api(`/issues?query=&offset=0&count=100`);
    setIssues(data.filter((i) => i.projectId === pid));
  }, []);

  useEffect(() => {
    // Wait for auth to resolve before deciding which board to load — a JS account doesn't need the
    // full every-project/every-task fetch this effect does at all (myTasks* above covers it).
    if (authStatus === "loading") return;
    if (isJS) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const data = await api("/projects?offset=0&count=100");
        setProjects(data);
        if (data.length > 0) {
          const targetId = highlightProjectId ? Number(highlightProjectId) : data[0].id;
          const initialProject = data.some((p) => p.id === targetId) ? targetId : data[0].id;
          setProjectId(initialProject);
          await loadIssues(initialProject);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
    // highlightProjectId deliberately only matters at first mount (the URL that got you here) —
    // same reasoning as the lazy-capture pattern in Apply.jsx's login-code exchange.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadIssues, authStatus, isJS]);

  // Scroll the highlighted card into view exactly once, after the board has actually rendered —
  // an inline ref callback re-fires on every render and fights itself mid-scroll (found live: the
  // card ended up correctly highlighted but nowhere near the viewport). A one-shot effect gated on
  // `loading` flipping false is the fix; requestAnimationFrame waits one more paint so layout is settled.
  useEffect(() => {
    if (loading || !highlightTaskId) return;
    const raf = requestAnimationFrame(() => {
      document.querySelector(`[data-task-id="${highlightTaskId}"]`)?.scrollIntoView({ block: "center" });
    });
    return () => cancelAnimationFrame(raf);
  }, [loading, highlightTaskId]);

  async function handleProjectChange(e) {
    const pid = Number(e.target.value);
    setProjectId(pid);
    setLoading(true);
    try {
      await loadIssues(pid);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      await api("/issues", {
        method: "POST",
        body: JSON.stringify({ projectId, title: newIssue.title, description: newIssue.description }),
      });
      setNewIssue(EMPTY_ISSUE);
      await loadIssues(projectId);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  // A JS applicant only ever sees their own matched task(s) — no project switcher, no other
  // products' boards, no "+ Add task" (that's core-team territory). Deliberately a separate return,
  // not another branch woven into the board below: the two views share almost nothing structurally
  // once the full project/task board is off the table.
  if (isJS) {
    return (
      <div className="workbench">
        <header className="workbench-header">
          <div className="workbench-kicker">Workbench</div>
          <h1>Your tasks</h1>
          <p className="workbench-sub">Whatever you're matched to shows up here — click in and start building.</p>
        </header>

        {myTasksError && <div className="workbench-error">{myTasksError}</div>}
        {myTasksLoading && <div className="workbench-loading">Loading your tasks…</div>}

        {!myTasksLoading && myTasks.length === 0 && !myTasksError && (
          <div className="workbench-empty-state">
            No tasks assigned yet. If you just applied, you're queued — we'll match you automatically the moment
            something opens up. <a href="#/apply">Check your application status</a>.
          </div>
        )}

        {!myTasksLoading && myTasks.length > 0 && (
          <div className="workbench-cards workbench-my-tasks">
            {myTasks.map((issue) => (
              <div className="workbench-card" key={issue.id} data-task-id={issue.id}>
                <div className="workbench-card-num">
                  #{issue.number} · {issue.project}
                </div>
                <div className="workbench-card-title">{issue.title}</div>
                {issue.description && <div className="workbench-card-desc">{issue.description}</div>}
                <AssistMeButton task={issue} publishedModules={publishedModules} />
                <TryCoreLesson task={issue} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const states = ["Open", "Closed"];
  const grouped = states.map((s) => ({
    state: s,
    items: issues.filter((i) => i.state === s),
  }));
  // Anything with a state outside the two known ones (custom workflow) still shows up.
  const otherStates = [...new Set(issues.map((i) => i.state).filter((s) => !states.includes(s)))];
  for (const s of otherStates) grouped.push({ state: s, items: issues.filter((i) => i.state === s) });

  return (
    <div className="workbench">
      <header className="workbench-header">
        <div className="workbench-kicker">Workbench</div>
        <h1>Where the work actually happens</h1>
        <p className="workbench-sub">
          Backed by OneDev — invisible plumbing underneath. This is the only screen PJT and JS use day to day.
        </p>
      </header>

      {projects.length > 0 && (
        <div className="workbench-project-select">
          <label>
            Project
            <select value={projectId ?? ""} onChange={handleProjectChange}>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {completedTaskId && (
        <div className="workbench-tutorial-done">
          ✓ Tutorial completed
          {(() => {
            const completedTask = issues.find((i) => i.id === Number(completedTaskId));
            return completedTask ? ` — "${completedTask.title}"` : ` for task #${completedTaskId}`;
          })()}
          . You're back — pick up the task below.
          <button type="button" onClick={() => setSearchParams({})}>
            Dismiss
          </button>
        </div>
      )}

      {error && <div className="workbench-error">{error}</div>}
      {loading && <div className="workbench-loading">Loading…</div>}

      {!loading && projectId && (
        <>
          <form className="workbench-new" onSubmit={handleCreate}>
            <input
              required
              placeholder="New task title"
              value={newIssue.title}
              onChange={(e) => setNewIssue((v) => ({ ...v, title: e.target.value }))}
            />
            <input
              placeholder="Description (optional)"
              value={newIssue.description}
              onChange={(e) => setNewIssue((v) => ({ ...v, description: e.target.value }))}
            />
            <button type="submit" disabled={creating}>
              {creating ? "Adding…" : "+ Add task"}
            </button>
          </form>

          <div className="workbench-board">
            {grouped.map((col) => (
              <div className="workbench-column" key={col.state}>
                <h2>
                  {col.state} <span className="workbench-count">{col.items.length}</span>
                </h2>
                <div className="workbench-cards">
                  {col.items.map((issue) => (
                    <div
                      className={`workbench-card${String(issue.id) === highlightTaskId ? " workbench-card-highlight" : ""}`}
                      key={issue.id}
                      data-task-id={issue.id}
                    >
                      <div className="workbench-card-num">#{issue.number}</div>
                      <div className="workbench-card-title">{issue.title}</div>
                      {issue.description && <div className="workbench-card-desc">{issue.description}</div>}
                      <AssistMeButton task={issue} publishedModules={publishedModules} />
                      <TryCoreLesson task={issue} />
                    </div>
                  ))}
                  {col.items.length === 0 && <div className="workbench-empty">Nothing here</div>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && projects.length === 0 && (
        <div className="workbench-empty-state">No projects in OneDev yet — create one via its API or admin UI first.</div>
      )}
    </div>
  );
}
