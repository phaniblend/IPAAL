/**
 * Railway / production prestart: apply Prisma migrations for the products schema.
 *
 * Prisma requires PRODUCTS_DATABASE_URL (see prisma/schema.prisma). On Railway the Postgres
 * plugin usually injects DATABASE_URL only — derive PRODUCTS_DATABASE_URL from that with
 * schema=inpact_products (same convention as the schema.prisma header comment).
 *
 * If neither URL is set, skip migrate so the IPF Node process can still boot (lessons/ops);
 * product-desk DB tasks simply won't have a migrated schema until Postgres is wired.
 */
import { spawnSync } from "node:child_process";

function withInpactProductsSchema(rawUrl) {
  const u = new URL(rawUrl);
  u.searchParams.set("schema", "inpact_products");
  return u.toString();
}

if (!process.env.PRODUCTS_DATABASE_URL) {
  const base = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;
  if (base) {
    process.env.PRODUCTS_DATABASE_URL = withInpactProductsSchema(base);
    console.log(
      "[prestart] PRODUCTS_DATABASE_URL derived from DATABASE_URL/POSTGRES_* (+schema=inpact_products)"
    );
  } else {
    console.warn(
      "[prestart] No PRODUCTS_DATABASE_URL or DATABASE_URL — skipping prisma migrate deploy"
    );
    process.exit(0);
  }
}

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  env: process.env,
  shell: true,
});

process.exit(result.status === null ? 1 : result.status);
