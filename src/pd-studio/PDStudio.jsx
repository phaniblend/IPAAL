import { useState } from "react";
import { TASK_TECH_LEVELS } from "../cohort-matching/skillLevels.js";
import "./PDStudio.css";

const EMPTY_FORM = {
  product_name: "",
  description: "",
  target_users: "",
  business_goal: "",
  constraints: "",
};

const TEAM_OPS_PROJECT_ID = 3;

function toList(text) {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

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

/** Editable bullet list: each item is a text input, plus add/remove. Used for
 * business_outcomes, assumptions, questions, validation_rules, acceptance criteria —
 * anything SpecForge generates that PD should be able to correct before it's reviewed. */
function EditableList({ items, onChange, placeholder }) {
  function updateAt(i, value) {
    const next = [...items];
    next[i] = value;
    onChange(next);
  }
  function removeAt(i) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function add() {
    onChange([...items, ""]);
  }
  return (
    <div className="pdstudio-editlist">
      {items.map((item, i) => (
        <div className="pdstudio-editrow" key={i}>
          <input value={item} onChange={(e) => updateAt(i, e.target.value)} placeholder={placeholder} />
          <button type="button" className="pdstudio-remove" onClick={() => removeAt(i)} aria-label="Remove">
            ×
          </button>
        </div>
      ))}
      <button type="button" className="pdstudio-add" onClick={add}>
        + Add
      </button>
    </div>
  );
}

function MatchChip({ task }) {
  if (task.no_tutorial_needed) {
    return <span className="pdstudio-chip pdstudio-chip-exempt">— no tutorial needed for this trade</span>;
  }
  if (task.matchStatus === "matched") {
    return (
      <span className="pdstudio-chip pdstudio-chip-matched">
        ✓ wired to <code>{task.moduleTag}</code> ({Math.round((task.matchScore ?? 0) * 100)}%)
      </span>
    );
  }
  if (task.matchStatus === "unmatched") {
    return <span className="pdstudio-chip pdstudio-chip-blocked">⚠ needs a tutorial — drafted on publish</span>;
  }
  return null;
}

export default function PDStudio() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle"); // idle | loading | error | done
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // the editable, human-reviewed spec

  // --- Stage 3 ---
  const [tasks, setTasks] = useState([]);
  const [stage3Status, setStage3Status] = useState("idle"); // idle | breaking-down | classifying | done | error
  const [existingCohorts, setExistingCohorts] = useState([]);
  const [selectedCohortId, setSelectedCohortId] = useState(""); // "" = create a new cohort
  const [publishStatus, setPublishStatus] = useState("idle"); // idle | loading | error | done
  const [publishResult, setPublishResult] = useState(null);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    setResult(null);
    setTasks([]);
    setStage3Status("idle");
    setPublishStatus("idle");
    setPublishResult(null);
    try {
      const res = await fetch("/api/specforge/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: form.product_name,
          description: form.description,
          target_users: toList(form.target_users),
          business_goal: form.business_goal,
          constraints: toList(form.constraints),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
      setResult(data);
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  // --- Stage 1 edits ---
  function updateStage1(field, value) {
    setResult((r) => ({ ...r, stage1: { ...r.stage1, [field]: value } }));
  }

  // --- Stage 2 edits ---
  function updateEntity(entityIdx, field, value) {
    setResult((r) => {
      const entities = [...r.stage2.entities];
      entities[entityIdx] = { ...entities[entityIdx], [field]: value };
      return { ...r, stage2: { ...r.stage2, entities } };
    });
  }
  function updateEntityFieldRow(entityIdx, fieldIdx, key, value) {
    setResult((r) => {
      const entities = [...r.stage2.entities];
      const fields = [...entities[entityIdx].fields];
      fields[fieldIdx] = { ...fields[fieldIdx], [key]: value };
      entities[entityIdx] = { ...entities[entityIdx], fields };
      return { ...r, stage2: { ...r.stage2, entities } };
    });
  }
  function addEntityFieldRow(entityIdx) {
    setResult((r) => {
      const entities = [...r.stage2.entities];
      entities[entityIdx] = {
        ...entities[entityIdx],
        fields: [...entities[entityIdx].fields, { name: "", type: "string", required: false }],
      };
      return { ...r, stage2: { ...r.stage2, entities } };
    });
  }
  function removeEntityFieldRow(entityIdx, fieldIdx) {
    setResult((r) => {
      const entities = [...r.stage2.entities];
      entities[entityIdx] = {
        ...entities[entityIdx],
        fields: entities[entityIdx].fields.filter((_, i) => i !== fieldIdx),
      };
      return { ...r, stage2: { ...r.stage2, entities } };
    });
  }
  function updateEntityRelationships(entityIdx, relationships) {
    setResult((r) => {
      const entities = [...r.stage2.entities];
      entities[entityIdx] = { ...entities[entityIdx], relationships };
      return { ...r, stage2: { ...r.stage2, entities } };
    });
  }
  function updateStage2List(field, value) {
    setResult((r) => ({ ...r, stage2: { ...r.stage2, [field]: value } }));
  }
  /** Deleting an entity must also clean up every free-text mention of it elsewhere in stage2 —
   * discovered live: removeEntity() used to only filter stage2.entities, leaving the removed
   * entity's name behind in stage2.validation_rules and in other entities' own `relationships`
   * strings (both are plain free-text arrays, not linked references). Stage 3 reads the whole
   * stage2 object as context, so those dangling mentions silently pulled the *removed* entities'
   * scope back in — a domain model trimmed to one real entity still produced a task breakdown for
   * the entire original product, because eleven leftover validation rules and a relationship
   * string kept naming entities that were supposedly gone. This is a data-integrity cleanup, not
   * an editorial override — a rule/relationship naming an entity that no longer exists is just
   * stale, not a preserved human decision — so it's safe to strip automatically rather than only
   * warn. Matches on the entity's name as a whole word (case-insensitive) so removing "Purchase"
   * doesn't false-positive on "PurchaseItem". */
  function removeEntity(entityIdx) {
    setResult((r) => {
      const removedName = r.stage2.entities[entityIdx]?.name?.trim();
      const mentionsRemoved = (text) =>
        removedName ? new RegExp(`\\b${removedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text) : false;

      const entities = r.stage2.entities
        .filter((_, i) => i !== entityIdx)
        .map((e) => ({ ...e, relationships: (e.relationships || []).filter((rel) => !mentionsRemoved(rel)) }));
      const validation_rules = (r.stage2.validation_rules || []).filter((rule) => !mentionsRemoved(rule));
      const suggested_tables = (r.stage2.suggested_tables || []).filter((t) => !mentionsRemoved(t));
      const audit_requirements = (r.stage2.audit_requirements || []).filter((a) => !mentionsRemoved(a));

      return { ...r, stage2: { ...r.stage2, entities, validation_rules, suggested_tables, audit_requirements } };
    });
  }

  function downloadEditedSpec() {
    const blob = new Blob([JSON.stringify({ ...result, stage3: tasks }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.product_name || "spec"}.specforge.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // --- Stage 3: breakdown + classify ---
  async function runBreakdown() {
    setStage3Status("breaking-down");
    setError("");
    try {
      const data = await api("/api/specforge/breakdown", { stage1: result.stage1, stage2: result.stage2 });
      setStage3Status("classifying");
      const classified = await api("/api/specforge/classify", { tasks: data.tasks });
      setTasks(classified.tasks);
      setStage3Status("done");
      loadCohorts();
    } catch (err) {
      setError(err.message);
      setStage3Status("error");
    }
  }

  async function loadCohorts() {
    try {
      const res = await fetch("/onedev-api/issues?offset=0&count=200");
      if (!res.ok) return;
      const all = await res.json();
      const cohorts = all
        .filter((i) => i.projectId === TEAM_OPS_PROJECT_ID && i.title.startsWith("Cohort:"))
        .map((i) => {
          const projectMatch = /DeliveryProject:\s*(.+?)\s*\(#\d+\)/.exec(i.description || "");
          const productMatch = /^Product:\s*(.+)$/m.exec(i.description || "");
          return {
            issueId: i.id,
            name: i.title.replace("Cohort:", "").trim(),
            projectName: projectMatch?.[1] ?? "?",
            productName: productMatch?.[1]?.trim() ?? "",
          };
        });
      setExistingCohorts(cohorts);
    } catch {
      // Non-fatal — "create a new cohort" still works without the existing-cohort list.
    }
  }

  function updateTask(i, field, value) {
    setTasks((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  }
  function updateTaskCriteria(i, criteria) {
    setTasks((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], acceptance_criteria: criteria };
      return next;
    });
  }
  function removeTask(i) {
    setTasks((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handlePublish() {
    setPublishStatus("loading");
    setError("");
    try {
      const body = {
        productName: form.product_name,
        tasks: tasks.map(({ epic, story, title, description, trade, acceptance_criteria, no_tutorial_needed, tech_level }) => ({
          epic,
          story,
          title,
          description,
          trade,
          acceptance_criteria,
          no_tutorial_needed: !!no_tutorial_needed,
          tech_level: no_tutorial_needed ? null : tech_level || null,
        })),
      };
      if (selectedCohortId) {
        body.cohortIssueId = Number(selectedCohortId);
      } else {
        // One cohort = one project, always named after the product — no separate cohort/project
        // name to type, since form.product_name already says what this is. Reuse (above) is the
        // only path that attaches to something pre-existing; a brand-new cohort always gets its
        // own brand-new project of the same name, never an existing one.
        body.cohortName = form.product_name;
        body.deliveryProjectName = form.product_name;
      }

      const data = await api("/api/specforge/publish", body);
      setPublishResult(data);
      setPublishStatus("done");
    } catch (err) {
      setError(err.message);
      setPublishStatus("error");
    }
  }

  const canPublish =
    tasks.length > 0 &&
    (selectedCohortId || form.product_name.trim()) &&
    publishStatus !== "loading" &&
    publishStatus !== "done";

  const groupedTasks = tasks.reduce((acc, task, i) => {
    const key = `${task.epic} :: ${task.story}`;
    (acc[key] ??= { epic: task.epic, story: task.story, items: [] }).items.push({ ...task, i });
    return acc;
  }, {});

  return (
    <div className="pdstudio">
      <header className="pdstudio-header">
        <div className="pdstudio-kicker">PD Studio · SpecForge</div>
        <h1>Idea in. Assignable, tutor-wired work out.</h1>
        <p className="pdstudio-sub">
          Generate → Review → Edit → Approve → Publish. Stages 1–2 (Normalizer, Domain Model) and Stage 3 (Task
          Breakdown) are all editable before anything is created. Publishing is the one step that writes to
          Workbench — every task lands either wired to an existing tutorial or blocked pending one.
        </p>
      </header>

      <form className="pdstudio-form" onSubmit={handleSubmit}>
        <label>
          Product name
          <input
            required
            value={form.product_name}
            onChange={update("product_name")}
            placeholder="Restaurant Inventory Manager"
          />
        </label>
        <label>
          Description
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={update("description")}
            placeholder="Monitor groceries purchased against menu items sold, identify unexplained ingredient losses, and show food-waste trends."
          />
        </label>
        <label>
          Target users <span className="pdstudio-hint">comma-separated</span>
          <input
            value={form.target_users}
            onChange={update("target_users")}
            placeholder="Restaurant owner, Kitchen manager, Inventory manager"
          />
        </label>
        <label>
          Business goal
          <input
            required
            value={form.business_goal}
            onChange={update("business_goal")}
            placeholder="Reduce food waste and catch unusual ingredient consumption"
          />
        </label>
        <label>
          Constraints <span className="pdstudio-hint">comma-separated, optional</span>
          <input
            value={form.constraints}
            onChange={update("constraints")}
            placeholder="Must integrate with common POS platforms"
          />
        </label>
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Generating spec…" : "Generate spec"}
        </button>
      </form>

      {status === "error" && <div className="pdstudio-error">{error}</div>}

      {result && (
        <div className="pdstudio-results">
          <div className="pdstudio-results-bar">
            <span className="pdstudio-editing-note">Editing — nothing is saved until you publish or download it</span>
            <button type="button" className="pdstudio-download" onClick={downloadEditedSpec}>
              Download edited spec (.json)
            </button>
          </div>

          <section className="pdstudio-panel">
            <h2>Stage 1 — Normalized definition</h2>
            <label className="pdstudio-field">
              <span className="pdstudio-label">Problem statement</span>
              <textarea
                rows={2}
                value={result.stage1.problem_statement}
                onChange={(e) => updateStage1("problem_statement", e.target.value)}
              />
            </label>

            <label className="pdstudio-field">
              <span className="pdstudio-label">Target users</span>
              <EditableList
                items={result.stage1.target_users}
                onChange={(v) => updateStage1("target_users", v)}
                placeholder="e.g. Kitchen manager"
              />
            </label>

            <label className="pdstudio-field">
              <span className="pdstudio-label">Business outcomes</span>
              <EditableList
                items={result.stage1.business_outcomes}
                onChange={(v) => updateStage1("business_outcomes", v)}
                placeholder="e.g. Reduce food waste"
              />
            </label>

            <label className="pdstudio-field">
              <span className="pdstudio-label">Assumptions</span>
              <EditableList
                items={result.stage1.assumptions}
                onChange={(v) => updateStage1("assumptions", v)}
                placeholder="e.g. Recipes contain standard ingredient quantities"
              />
            </label>

            <div className="pdstudio-questions">
              <h3>Open questions before this can go further</h3>
              <EditableList
                items={result.stage1.questions}
                onChange={(v) => updateStage1("questions", v)}
                placeholder="e.g. Is inventory measured by weight, units, or both?"
              />
            </div>
          </section>

          <section className="pdstudio-panel">
            <h2>Stage 2 — Domain model</h2>
            {result.stage2.entities.map((entity, entityIdx) => (
              <div className="pdstudio-entity" key={entityIdx}>
                <div className="pdstudio-entity-head">
                  <input
                    className="pdstudio-entity-name"
                    value={entity.name}
                    onChange={(e) => updateEntity(entityIdx, "name", e.target.value)}
                  />
                  <button
                    type="button"
                    className="pdstudio-entity-remove"
                    onClick={() => removeEntity(entityIdx)}
                    aria-label={`Remove entity ${entity.name}`}
                    title="Remove this entity entirely"
                  >
                    × Remove entity
                  </button>
                </div>
                <textarea
                  className="pdstudio-entity-desc"
                  rows={2}
                  value={entity.description}
                  onChange={(e) => updateEntity(entityIdx, "description", e.target.value)}
                />
                <table>
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>Type</th>
                      <th>Required</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {entity.fields.map((f, fieldIdx) => (
                      <tr key={fieldIdx}>
                        <td>
                          <input
                            value={f.name}
                            onChange={(e) => updateEntityFieldRow(entityIdx, fieldIdx, "name", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            value={f.type}
                            onChange={(e) => updateEntityFieldRow(entityIdx, fieldIdx, "type", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={f.required}
                            onChange={(e) => updateEntityFieldRow(entityIdx, fieldIdx, "required", e.target.checked)}
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="pdstudio-remove"
                            onClick={() => removeEntityFieldRow(entityIdx, fieldIdx)}
                            aria-label="Remove field"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" className="pdstudio-add" onClick={() => addEntityFieldRow(entityIdx)}>
                  + Add field
                </button>

                <div className="pdstudio-field">
                  <span className="pdstudio-label">Relates to</span>
                  <EditableList
                    items={entity.relationships}
                    onChange={(v) => updateEntityRelationships(entityIdx, v)}
                    placeholder="e.g. Recipe"
                  />
                </div>
              </div>
            ))}

            <div className="pdstudio-field">
              <span className="pdstudio-label">Validation rules</span>
              <EditableList
                items={result.stage2.validation_rules}
                onChange={(v) => updateStage2List("validation_rules", v)}
                placeholder="e.g. Quantity must be greater than zero"
              />
            </div>
          </section>

          <section className="pdstudio-panel">
            <h2>Stage 3 — Task breakdown</h2>
            {tasks.length === 0 && (
              <>
                <p className="pdstudio-stage3-intro">
                  Turns the domain model above into epics → stories → tasks, then checks every task against the
                  ID Module Library right away — so you see what's already teachable and what isn't before you
                  publish anything.
                </p>
                <button type="button" onClick={runBreakdown} disabled={stage3Status === "breaking-down" || stage3Status === "classifying"}>
                  {stage3Status === "breaking-down"
                    ? "Breaking down into tasks…"
                    : stage3Status === "classifying"
                      ? "Checking Module Library…"
                      : "Break down into tasks"}
                </button>
              </>
            )}

            {tasks.length > 0 && (
              <>
                {(() => {
                  // Second layer, independent of the prompt: DeepSeek has missed a soft "size
                  // appropriately" instruction four times now (token budget, tutorial-group count,
                  // business-outcomes scope creep, and — even after that fix — inventing whole extra
                  // entities like InventoryTransaction/WasteEntry that landed at a coincidentally
                  // "in-band" task count) — don't rely on prompt compliance alone to catch an
                  // over-scoped breakdown. entityCount/expectedMax mirror STAGE3_SYSTEM's own
                  // *tightened* per-entity bands (1 entity ≈ 5-8 tasks, 2 ≈ 10-16, beyond that ~6/entity),
                  // so a trip of this warning means the actual output disagrees with what the prompt
                  // itself claims is normal — this threshold is the load-bearing check now, not the prompt.
                  // Calibrated once live: 8 for one entity fired on a legitimately-scoped 11-task
                  // breakdown (list, create/edit, delete, schema, API, two kinds of tests, and an
                  // audit trail on a field with a real validation rule) where every task traced to
                  // the one real entity — no phantom entities invented. The count is a blunt proxy;
                  // "does every epic trace to a real entity" is the actual question, and a human
                  // scanning the list answers that in seconds, so this only needs to catch the
                  // dramatic cases (2-3x over), not fire on a thorough-but-legitimate single entity.
                  const entityCount = result.stage2.entities.length;
                  const expectedMax = entityCount === 1 ? 14 : entityCount === 2 ? 22 : entityCount * 7;
                  if (tasks.length <= expectedMax) return null;
                  return (
                    <div className="pdstudio-scope-warning">
                      ⚠ {tasks.length} tasks for {entityCount} {entityCount === 1 ? "entity" : "entities"} — more
                      than the ~{expectedMax} expected. Stage 1's business outcomes, assumptions, or open
                      questions may be pulling in scope beyond what Stage 2 actually modeled (check for epics
                      that don't trace to any entity above). Consider trimming Stage 1's list to just what
                      this slice needs, or review carefully before publishing.
                    </div>
                  );
                })()}
                <div className="pdstudio-task-summary">
                  {tasks.filter((t) => t.matchStatus === "matched").length} of {tasks.length} tasks already have a
                  tutorial wired, {tasks.filter((t) => t.no_tutorial_needed).length} are marked as not needing one.
                  The rest get a generic draft tutorial generated automatically on publish, and queue for ID
                  Studio's review before a JS can be assigned to them.
                </div>

                {Object.entries(groupedTasks).map(([key, group]) => (
                  <div className="pdstudio-epic-group" key={key}>
                    <div className="pdstudio-epic-label">
                      {group.epic} <span className="pdstudio-story-label">→ {group.story}</span>
                    </div>
                    {group.items.map((task) => (
                      <div className="pdstudio-task-card" key={task.i}>
                        <div className="pdstudio-task-top">
                          <input
                            className="pdstudio-task-title"
                            value={task.title}
                            onChange={(e) => updateTask(task.i, "title", e.target.value)}
                          />
                          <input
                            className="pdstudio-task-trade"
                            value={task.trade}
                            onChange={(e) => updateTask(task.i, "trade", e.target.value)}
                            placeholder="Trade"
                          />
                          <button
                            type="button"
                            className="pdstudio-remove"
                            onClick={() => removeTask(task.i)}
                            aria-label="Remove task"
                          >
                            ×
                          </button>
                        </div>
                        <textarea
                          className="pdstudio-task-desc"
                          rows={2}
                          value={task.description}
                          onChange={(e) => updateTask(task.i, "description", e.target.value)}
                        />
                        <div className="pdstudio-field">
                          <span className="pdstudio-label">Acceptance criteria</span>
                          <EditableList
                            items={task.acceptance_criteria || []}
                            onChange={(v) => updateTaskCriteria(task.i, v)}
                            placeholder="e.g. Quantity field rejects zero and negative values"
                          />
                        </div>
                        <div className="pdstudio-task-bottom">
                          <label className="pdstudio-exempt-toggle">
                            <input
                              type="checkbox"
                              checked={!!task.no_tutorial_needed}
                              onChange={(e) => updateTask(task.i, "no_tutorial_needed", e.target.checked)}
                            />
                            No tutorial needed for this trade
                          </label>
                          {!task.no_tutorial_needed && (
                            <label className="pdstudio-tech-level">
                              Tech level
                              <select
                                value={task.tech_level || ""}
                                onChange={(e) => updateTask(task.i, "tech_level", e.target.value || null)}
                              >
                                <option value="">— unset —</option>
                                {TASK_TECH_LEVELS.map((l) => (
                                  <option key={l.value} value={l.value}>
                                    {l.label}
                                  </option>
                                ))}
                              </select>
                            </label>
                          )}
                        </div>
                        <MatchChip task={task} />
                      </div>
                    ))}
                  </div>
                ))}

                <div className="pdstudio-publish-panel">
                  <h3>Cohort &amp; delivery project</h3>
                  {/* Every product gets a new cohort + project by default — reuse is only offered when a
                   * cohort already exists for *this exact product*, never a flat list of every cohort ever
                   * published. Found live: the dropdown used to list every product's cohort unfiltered, so
                   * publishing "Restaurant Manager" could accidentally select "Shift Swap Board"'s cohort and
                   * silently merge two unrelated products' tasks into one delivery project. */}
                  {(() => {
                    const sameProductCohorts = existingCohorts.filter(
                      (c) => c.productName.trim().toLowerCase() === form.product_name.trim().toLowerCase()
                    );
                    return (
                      sameProductCohorts.length > 0 && (
                        <label>
                          Cohort <span className="pdstudio-hint">adding to one keeps the same delivery project — only cohorts already published for "{form.product_name}" are listed</span>
                          <select value={selectedCohortId} onChange={(e) => setSelectedCohortId(e.target.value)}>
                            <option value="">+ Create a new cohort</option>
                            {sameProductCohorts.map((c) => (
                              <option key={c.issueId} value={c.issueId}>
                                {c.name} — {c.projectName}
                              </option>
                            ))}
                          </select>
                        </label>
                      )
                    );
                  })()}
                  {!selectedCohortId && (
                    // One cohort = one project, always. Both are just named after the product —
                    // that's already typed in Stage 1, so there's nothing left to fill in here.
                    <p className="pdstudio-hint">
                      Publishing creates a new cohort <strong>and</strong> a new delivery project, both named{" "}
                      <strong>{form.product_name || "(set a product name above)"}</strong>.
                    </p>
                  )}
                  <button type="button" onClick={handlePublish} disabled={!canPublish}>
                    {publishStatus === "loading" ? "Publishing…" : publishStatus === "done" ? "Published ✓" : "Publish to Workbench"}
                  </button>
                </div>

                {publishResult && (
                  <div className="pdstudio-publish-result">
                    <p>
                      <strong>{publishResult.totalTasks}</strong> tasks created in{" "}
                      <strong>{publishResult.deliveryProjectName}</strong> under cohort{" "}
                      <strong>{publishResult.cohortName}</strong>
                      {publishResult.reusedCohort ? " (added to the existing cohort)" : ""}.
                    </p>
                    <p>
                      {publishResult.matchedCount} wired immediately to existing tutorials ·{" "}
                      {publishResult.exemptCount} exempt (no tutorial needed) · {publishResult.blockedCount}{" "}
                      blocked pending a tutorial.
                    </p>
                    {publishResult.draftedGroups.length > 0 && (
                      <ul className="plain">
                        {publishResult.draftedGroups.map((g) => (
                          <li key={g.tag}>
                            <code>{g.tag}</code> — covers {g.taskCount} task{g.taskCount === 1 ? "" : "s"}
                            {g.generationFailed ? " — draft generation failed, needs manual attention in ID Studio" : " — draft ready for ID Studio review"}
                          </li>
                        ))}
                      </ul>
                    )}
                    <a href="#/workbench" className="pdstudio-download" style={{ display: "inline-block", marginTop: 8 }}>
                      Go to Workbench →
                    </a>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
