/**
 * postinstall: prisma generate needs PRODUCTS_DATABASE_URL to exist for schema validation
 * even though generate does not connect. Use a dummy URL when unset (local/CI/Railway build
 * without Postgres yet) so `npm install` never fails with P1012.
 */
import { spawnSync } from "node:child_process";

if (!process.env.PRODUCTS_DATABASE_URL) {
  process.env.PRODUCTS_DATABASE_URL =
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@127.0.0.1:5432/postgres?schema=inpact_products";
  console.log("[postinstall] PRODUCTS_DATABASE_URL unset — using placeholder for prisma generate");
}

const result = spawnSync("npx", ["prisma", "generate"], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

process.exit(result.status === null ? 1 : result.status);
