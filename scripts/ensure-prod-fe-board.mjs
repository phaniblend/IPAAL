/**
 * CLI / prestart wrapper around server/ensure-fe-board.js (in-process OneDev calls).
 */
import "dotenv/config";
import { ensureFeBoard } from "../server/ensure-fe-board.js";

try {
  const result = await ensureFeBoard();
  for (const line of result.log || []) console.log(`[ensure-prod-fe] ${line}`);
  process.exit(0);
} catch (err) {
  console.warn(`[ensure-prod-fe] skipped/failed: ${err.message}`);
  process.exit(0);
}
