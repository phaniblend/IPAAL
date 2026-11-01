/**
 * Generates ONE real Express router implementing every SMB product's backend resource — the
 * exact validate/conflict/derive logic already fully specified in write-smb-assist-engines.mjs's
 * conflictApiModule/derivedApiModule configs (via each module's `apiConfig`), as genuinely running
 * code instead of only ever being a lesson spec nobody actually deployed.
 *
 * Why this exists: the platform is going FE-only (2026-09-06 call) — backend is no longer a trade
 * applicants get matched into, so these ~16 resources will never actually get built by a learner.
 * But the FE tasks (list+form screens) were always meant to talk to a real API, same as the Mini
 * ERP tasks already do against a real Fastify+Prisma backend. So "the backend is already built by
 * us" has to be literally true, not simulated — this script is what makes it true: it emits a real
 * router meant to be committed into phaniblend/inpact_services (the actual deployed backend) and
 * mounted at `/api`, so every resourcePath already written into the lesson content
 * (`/api/appointments`, `/api/quotes`, etc.) becomes a real, live endpoint.
 *
 * Deliberately in-memory (a `let store = []` per resource, no database) — matches exactly what
 * every one of these tasks was already specced as; a real database is future work, not required to
 * make these genuinely real, running endpoints today. Each resource's store resets on a deploy/
 * restart, same tradeoff the lesson spec always had.
 *
 * Run: node scripts/generate-smb-backend-routes.mjs
 * Writes: generated-backend/smb-desk-router.js (copy this into inpact_services/server/routes/ and
 * mount it: `import smbDeskRouter from "./routes/smb-desk-router.js"; app.use("/api", smbDeskRouter);`
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MODULES } from "./write-smb-assist-engines.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../generated-backend");

function validateChecks(fields) {
  return fields
    .map((f) => {
      if (f.ts === "number") {
        if (/^used/i.test(f.name)) {
          return `  if (typeof input?.${f.name} !== "number" || input.${f.name} < 0) return "${f.name} must be >= 0";`;
        }
        return `  if (typeof input?.${f.name} !== "number" || input.${f.name} <= 0) return "${f.name} must be > 0";`;
      }
      return `  if (typeof input?.${f.name} !== "string" || !input.${f.name}.trim()) return "${f.name} is required";`;
    })
    .join("\n");
}

function renderConflict(cfg, tag) {
  const { store, validateFn, overlapFn, resourcePath, fields, conflictHint, conflictFields } = cfg;
  const routePath = resourcePath.replace(/^\/api/, "");
  const rowAssign = fields.map((f) => `${f.name}: req.body.${f.name}`).join(", ");
  const counter = `${store}IdCounter`;
  const [fieldA, fieldB] = conflictFields || [fields[0].name, fields[fields.length - 1].name];
  return `
// ${tag}: ${resourcePath} — conflict rule: ${conflictHint}
let ${store} = [];
let ${counter} = 1;
function ${store}NextId() { return String(${counter}++); }
function ${validateFn}(input) {
${validateChecks(fields)}
  return null;
}
function ${overlapFn}(candidate) {
  return ${store}.some((row) => row.${fieldA} === candidate.${fieldA} && row.${fieldB} === candidate.${fieldB});
}
router.get("${routePath}", (_req, res) => {
  res.json(${store});
});
router.post("${routePath}", (req, res) => {
  const err = ${validateFn}(req.body);
  if (err) return res.status(400).json({ error: err });
  if (${overlapFn}(req.body)) return res.status(409).json({ error: "conflict" });
  const row = { id: ${store}NextId(), ${rowAssign} };
  ${store}.push(row);
  res.status(201).json(row);
});
`;
}

function renderDerived(cfg, tag) {
  const {
    store,
    validateFn,
    deriveFn,
    resourcePath,
    fields,
    deriveHint,
    paidField,
    statusDone,
    statusLate,
    statusOpen,
    remainingPair,
    twoState,
    presenceField,
    claimActionName,
    staleAfterDays,
  } = cfg;
  const routePath = resourcePath.replace(/^\/api/, "");
  const rowAssign = fields.map((f) => `${f.name}: req.body.${f.name}`).join(", ");
  const counter = `${store}IdCounter`;
  const extraCreate = paidField ? `, ${paidField}: false` : remainingPair ? `, ${remainingPair.used}: 0` : "";
  const dateField =
    fields.find((f) => /date|At|at|Due|due|When|when|Until|until/i.test(f.name))?.name || fields[fields.length - 1].name;
  const deriveBody = remainingPair
    ? `  if ((row.${remainingPair.used} || 0) >= row.${remainingPair.total}) return "${remainingPair.emptyStatus || "empty"}";\n  return "${remainingPair.activeStatus || "active"}";`
    : presenceField
      ? `  return row.${presenceField} ? "${statusDone}" : "${statusOpen}";`
      : twoState
        ? `  return row.${paidField} === true ? "${statusDone}" : "${statusOpen}";`
        : paidField
          ? `  if (row.${paidField} === true) return "${statusDone}";\n  if (new Date(row.${dateField}) < now) return "${statusLate}";\n  return "${statusOpen}";`
          : staleAfterDays
            ? `  const staleMs = ${staleAfterDays} * 24 * 60 * 60 * 1000;\n  if (now.getTime() - new Date(row.${dateField}).getTime() > staleMs) return "stale";\n  return "fresh";`
            : `  if (new Date(row.${dateField}) < now) return "stale";\n  return "fresh";`;
  // A presence-checked field (e.g. claimedBy) is never part of the create payload — nobody claims
  // a request at the moment they open it — so it needs its own real action endpoint to ever
  // become true, instead of a status nothing can ever reach.
  const claimRoute = presenceField
    ? `router.post("${routePath}/:id/${claimActionName}", (req, res) => {
  const row = ${store}.find((r) => r.id === req.params.id);
  if (!row) return res.status(404).json({ error: "not found" });
  row.${presenceField} = req.body?.${presenceField} || true;
  res.json({ ...row, status: ${deriveFn}(row) });
});
`
    : "";
  return `
// ${tag}: ${resourcePath} — derived status: ${deriveHint}
let ${store} = [];
let ${counter} = 1;
function ${store}NextId() { return String(${counter}++); }
function ${validateFn}(input) {
${validateChecks(fields)}
  return null;
}
function ${deriveFn}(row, now = new Date()) {
${deriveBody}
}
router.get("${routePath}", (_req, res) => {
  res.json(${store}.map((r) => ({ ...r, status: ${deriveFn}(r) })));
});
router.post("${routePath}", (req, res) => {
  const err = ${validateFn}(req.body);
  if (err) return res.status(400).json({ error: err });
  const row = { id: ${store}NextId(), ${rowAssign}${extraCreate} };
  ${store}.push(row);
  res.status(201).json({ ...row, status: ${deriveFn}(row) });
});
${claimRoute}`;
}

// idt-punch-redeem-api's real rule ("package already at totalPunches used -> conflict") checks a
// *different* resource (packages) by packageId — conflictApiModule's generic overlap check only
// ever compares a candidate against other rows in its own store, so it was never actually capable
// of expressing this (caught live 2026-09-06 building the real backend: the generic version
// checked for a duplicate punch at the same timestamp, not package capacity at all). Redeeming a
// punch for real should also consume one from the package, which the generic template has no
// concept of either — hand-written here instead of forcing the shared template to grow a
// cross-resource special case for one resource.
function renderPunchRedeem(cfg, tag) {
  const { store, validateFn, resourcePath, fields } = cfg;
  const routePath = resourcePath.replace(/^\/api/, "");
  const rowAssign = fields.map((f) => `${f.name}: req.body.${f.name}`).join(", ");
  return `
// ${tag}: ${resourcePath} — real rule: the referenced package must have punches left (checked
// against the packages store above, not against other punches)
let ${store} = [];
let ${store}IdCounter = 1;
function ${store}NextId() { return String(${store}IdCounter++); }
function ${validateFn}(input) {
${validateChecks(fields)}
  return null;
}
router.get("${routePath}", (_req, res) => {
  res.json(${store});
});
router.post("${routePath}", (req, res) => {
  const err = ${validateFn}(req.body);
  if (err) return res.status(400).json({ error: err });
  const pkg = packages.find((p) => p.id === req.body.packageId);
  if (!pkg) return res.status(400).json({ error: "packageId does not match a real package" });
  if ((pkg.usedPunches || 0) >= pkg.totalPunches) return res.status(409).json({ error: "package has no punches left" });
  pkg.usedPunches = (pkg.usedPunches || 0) + 1;
  const row = { id: ${store}NextId(), ${rowAssign} };
  ${store}.push(row);
  res.status(201).json(row);
});
`;
}

const apiModules = MODULES.filter((m) => m.apiConfig);
console.log(`Found ${apiModules.length} real backend resources to generate.`);

const CUSTOM_RENDERERS = { "idt-punch-redeem-api": renderPunchRedeem };

const sections = apiModules.map((m) =>
  CUSTOM_RENDERERS[m.tag]
    ? CUSTOM_RENDERERS[m.tag](m.apiConfig, m.tag)
    : m.apiConfig.kind === "conflict"
      ? renderConflict(m.apiConfig, m.tag)
      : renderDerived(m.apiConfig, m.tag)
);

const banner = `/**
 * SMB desk backend — every resource the FE product tasks call for real.
 *
 * GENERATED by IPAAL's scripts/generate-smb-backend-routes.mjs from the exact same specs the
 * lesson content is built from (write-smb-assist-engines.mjs's conflictApiModule/derivedApiModule
 * configs) — do not hand-edit; regenerate and re-copy instead so the two never drift apart.
 *
 * In-memory only (resets on deploy/restart) — matches what every one of these resources was
 * already specced as. A real database is future work.
 *
 * Mount in server/index.js:
 *   import smbDeskRouter from "./routes/smb-desk-router.js";
 *   app.use("/api", smbDeskRouter);
 */
import express from "express";

const router = express.Router();
${sections.join("\n")}
export default router;
`;

fs.mkdirSync(OUT_DIR, { recursive: true });
const outFile = path.join(OUT_DIR, "smb-desk-router.js");
fs.writeFileSync(outFile, banner, "utf8");
console.log("wrote", outFile);

// Also drop a manifest of resourcePath -> tag, useful for double-checking coverage against the FE
// tasks that are meant to call each one.
const manifest = apiModules.map((m) => ({ tag: m.tag, resourcePath: m.apiConfig.resourcePath, kind: m.apiConfig.kind }));
fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
console.log("wrote", path.join(OUT_DIR, "manifest.json"));
