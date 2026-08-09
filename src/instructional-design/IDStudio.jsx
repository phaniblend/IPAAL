import { useState, useEffect } from "react";
import DraftReviewOverlay from "./DraftReviewOverlay.jsx";
import "./IDStudio.css";

const EMPTY = { moduleTag: "", concept: "", build: "", keyTeaching: "", newConcepts: "" };

async function api(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

async function getJson(path) {
  const res = await fetch(path);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export default function IDStudio() {
  const [tab, setTab] = useState("pending"); // "pending" | "generate"
  const [form, setForm] = useState(EMPTY);
  const [matches, setMatches] = useState(null);
  const [matchStatus, setMatchStatus] = useState("idle");
  const [generated, setGenerated] = useState(null);
  const [genStatus, setGenStatus] = useState("idle");
  const [publishStatus, setPublishStatus] = useState("idle");
  const [publishResult, setPublishResult] = useState(null);
  const [error, setError] = useState("");
  const [catalog, setCatalog] = useState([]);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [activeRequest, setActiveRequest] = useState(null); // the pending request currently open for review, if any
  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => {
    fetch("/api/id/catalog")
      .then((r) => r.json())
      .then((d) => setCatalog(d.catalog || []))
      .catch(() => {});
    loadPendingRequests();
  }, []);

  async function loadPendingRequests() {
    setPendingLoading(true);
    try {
      const data = await getJson("/api/id/pending-requests");
      setPendingRequests(data.requests);
    } catch {
      // OneDev unreachable or nothing pending yet — leave the list empty rather than blocking the page.
    } finally {
      setPendingLoading(false);
    }
  }

  function pickFromCatalog(entry) {
    setForm({
      moduleTag: entry.tag,
      concept: entry.concept,
      build: entry.build,
      keyTeaching: entry.keyTeaching,
      newConcepts: "",
    });
    setCatalogOpen(false);
    resetReviewState();
  }

  function resetReviewState() {
    setMatches(null);
    setMatchStatus("idle");
    setGenerated(null);
    setGenStatus("idle");
    setPublishStatus("idle");
    setPublishResult(null);
    setActiveRequest(null);
    setReviewOpen(false);
    setError("");
  }

  function handlePublished(data) {
    setPublishStatus("done");
    setPublishResult(data);
    loadPendingRequests();
  }

  function startFresh() {
    setForm(EMPTY);
    resetReviewState();
    setTab("generate");
  }

  async function openPendingRequest(req) {
    resetReviewState();
    setActiveRequest(req);
    setForm({ moduleTag: req.tag, concept: req.concept, build: req.build, keyTeaching: req.keyTeaching, newConcepts: "" });
    setTab("generate");
    if (req.filePath) {
      try {
        const data = await getJson(`/api/id/draft?filePath=${encodeURIComponent(req.filePath)}`);
        setGenerated({ filePath: data.filePath, code: data.code });
        setGenStatus("done");
      } catch (err) {
        setError(`Couldn't load the auto-generated draft (${err.message}) — generate again below.`);
      }
    }
  }

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function checkMatch(e) {
    e.preventDefault();
    setMatchStatus("loading");
    setError("");
    setMatches(null);
    try {
      const data = await api("/api/id/match", { moduleTag: form.moduleTag, concept: form.concept });
      setMatches(data.matches);
      setMatchStatus("done");
    } catch (err) {
      setError(err.message);
      setMatchStatus("error");
    }
  }

  async function generate() {
    setGenStatus("loading");
    setError("");
    setGenerated(null);
    try {
      const data = await api("/api/id/generate", form);
      setGenerated(data);
      setGenStatus("done");
    } catch (err) {
      setError(err.message);
      setGenStatus("error");
    }
  }

  // Publishing itself now happens inside DraftReviewOverlay (it needs to save any content edits
  // first, then publish) — see handlePublished above for how the result flows back here.

  return (
    <div className="ids">
      <header className="ids-header">
        <div className="ids-kicker">Instructional Design (ID) Module</div>
        <h1>Reuse first. Generate only if nothing fits.</h1>
        <p className="ids-sub">
          This is per assignable task, per the PD-flow diagram — never product-specific. SpecForge already checks
          the Module Library automatically when a task is published; anything it couldn't match shows up in{" "}
          <strong>Pending requests</strong> below, already Gemini-drafted and waiting on your review.
        </p>
        <div className="ids-tabs">
          <button type="button" className={tab === "pending" ? "ids-tab-active" : ""} onClick={() => setTab("pending")}>
            Pending requests {pendingRequests.length > 0 ? `(${pendingRequests.length})` : ""}
          </button>
          <button type="button" className={tab === "generate" ? "ids-tab-active" : ""} onClick={startFresh}>
            Generate new
          </button>
        </div>
        {tab === "generate" && (
          <button type="button" className="ids-catalog-toggle" onClick={() => setCatalogOpen((o) => !o)}>
            {catalogOpen ? "Hide" : "Browse"} planned catalog ({catalog.length})
          </button>
        )}
      </header>

      {tab === "pending" && (
        <section className="ids-pending">
          {pendingLoading && <p className="ids-sub">Loading…</p>}
          {!pendingLoading && pendingRequests.length === 0 && (
            <p className="ids-sub">Nothing waiting — every task SpecForge has published so far matched an existing tutorial.</p>
          )}
          {pendingRequests.map((req) => (
            <button type="button" className="ids-pending-card" key={req.issueId} onClick={() => openPendingRequest(req)}>
              <div className="ids-pending-top">
                <span className="ids-match-tag">{req.tag}</span>
                <span className={`ids-status-tag ${req.filePath ? "ids-status-published" : "ids-status-planned"}`}>
                  {req.filePath ? "draft ready" : "generation failed"}
                </span>
              </div>
              <p className="ids-pending-concept">{req.concept}</p>
              <div className="ids-pending-meta">
                For <strong>{req.product}</strong> · blocks {req.taskCount} task{req.taskCount === 1 ? "" : "s"}
              </div>
            </button>
          ))}
        </section>
      )}

      {tab === "generate" && (
        <>
          {catalogOpen && (
            <section className="ids-catalog">
              {Object.entries(
                catalog.reduce((acc, c) => {
                  (acc[c.category] ??= []).push(c);
                  return acc;
                }, {})
              ).map(([category, entries]) => (
                <div className="ids-catalog-group" key={category}>
                  <h3>{category}</h3>
                  {entries.map((c) => (
                    <button type="button" className="ids-catalog-item" key={c.tag} onClick={() => pickFromCatalog(c)}>
                      <span className={`ids-tier-tag ids-tier-${c.tier}`}>{c.tier}</span>
                      <span className="ids-catalog-item-tag">{c.tag}</span>
                    </button>
                  ))}
                </div>
              ))}
            </section>
          )}

          {activeRequest && (
            <div className="ids-request-banner">
              Reviewing an auto-drafted tutorial requested by SpecForge for <strong>{activeRequest.product}</strong> —
              publishing this will unblock {activeRequest.taskCount} task{activeRequest.taskCount === 1 ? "" : "s"}.
            </div>
          )}

          <form className="ids-form" onSubmit={checkMatch}>
            <label>
              Module tag <span className="ids-hint">short, generic — e.g. toggle-boolean-state</span>
              <input required value={form.moduleTag} onChange={update("moduleTag")} placeholder="toggle-boolean-state" />
            </label>
            <label>
              Concept
              <input required value={form.concept} onChange={update("concept")} placeholder="Flipping a boolean piece of state and reflecting it in the UI" />
            </label>
            <label>
              Build <span className="ids-hint">generic worked example, never a named product</span>
              <input value={form.build} onChange={update("build")} placeholder="A Card with a Save button that toggles saved/unsaved" />
            </label>
            <label>
              Key teaching
              <input value={form.keyTeaching} onChange={update("keyTeaching")} placeholder="Functional updater prev => !prev, not !state directly" />
            </label>
            <label>
              New concepts <span className="ids-hint">optional</span>
              <input value={form.newConcepts} onChange={update("newConcepts")} placeholder="useState<boolean>, conditional className" />
            </label>
            <button type="submit" disabled={matchStatus === "loading"}>
              {matchStatus === "loading" ? "Checking…" : "Check Module Library"}
            </button>
          </form>

          {error && <div className="ids-error">{error}</div>}

          {matchStatus === "done" && (
            <section className="ids-section">
              <h2>Module Library check</h2>
              {matches.length === 0 && (
                <div className="ids-nomatch">
                  <p>Nothing close enough exists — generating a new module is warranted.</p>
                  <button type="button" onClick={generate} disabled={genStatus === "loading"}>
                    {genStatus === "loading" ? "Generating with Gemini…" : "Generate with Gemini"}
                  </button>
                </div>
              )}
              {matches.length > 0 && (
                <div className="ids-matches">
                  <p>
                    Found {matches.length} close match(es) — {matches.filter((m) => m.status === "published").length}{" "}
                    already published and reusable, {matches.filter((m) => m.status === "planned").length} planned but
                    not generated yet:
                  </p>
                  {matches.map((m) => (
                    <div className="ids-match-card" key={m.tag}>
                      <span className={`ids-status-tag ids-status-${m.status}`}>{m.status}</span>
                      <div className="ids-match-tag">{m.tag}</div>
                      <div className="ids-match-score">{Math.round(m.score * 100)}% overlap</div>
                      <div className="ids-match-desc">{m.description}</div>
                    </div>
                  ))}
                  <button type="button" className="ids-generate-anyway" onClick={generate} disabled={genStatus === "loading"}>
                    Generate anyway
                  </button>
                </div>
              )}
            </section>
          )}

          {genStatus === "done" && generated && (
            <section className="ids-section">
              <h2>{activeRequest ? "Auto-drafted — review before publishing" : "Generated — review before publishing"}</h2>
              <p className="ids-filepath">{generated.filePath}</p>
              {publishStatus !== "done" ? (
                <button type="button" onClick={() => setReviewOpen(true)}>
                  Review content &amp; publish →
                </button>
              ) : (
                <p className="ids-unblocked">
                  Published ✓{" "}
                  {publishResult?.unblockedTaskCount > 0
                    ? `— unblocked ${publishResult.unblockedTaskCount} task${publishResult.unblockedTaskCount === 1 ? "" : "s"} that were waiting on this tutorial.`
                    : "— nothing else was waiting on this one."}
                </p>
              )}
            </section>
          )}

          {reviewOpen && generated && (
            <DraftReviewOverlay
              filePath={generated.filePath}
              moduleTag={form.moduleTag}
              concept={form.concept}
              onClose={() => setReviewOpen(false)}
              onPublished={(data) => {
                handlePublished(data);
                setReviewOpen(false);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
