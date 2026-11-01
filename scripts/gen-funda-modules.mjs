// One-off: generate real, self-hosted funda-prerequisite modules using the SAME pipeline as the
// mainstream Assist Me modules (generateAssistModule), instead of linking out to YouTube. Run once,
// then delete — see the OneInbox module-gen scripts this replaces the video links in.
import "dotenv/config";
import { generateAssistModule } from "../src/id-module/generateModule.js";
import { fundaGenerationSpec } from "../src/id-module/fundaPrereqs.js";

const LABELS = [
  "Array methods (map / forEach)",
  "useEffect (fetching on mount / when id changes)",
  "TypeScript interfaces",
  "TypeScript union types",
  "useState hook",
  "HTTP methods & status codes",
];

for (const label of LABELS) {
  const spec = fundaGenerationSpec(label);
  process.stdout.write(`Generating "${label}" -> ${spec.moduleTag} ... `);
  try {
    const { fileName, slug } = await generateAssistModule(spec);
    console.log(`OK (${fileName}, slug=${slug})`);
  } catch (err) {
    console.log(`FAILED: ${err.message}`);
  }
}
