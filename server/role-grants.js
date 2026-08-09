/**
 * Role grants for JS accounts — the other half of the founder's stated design: "-core roles are
 * fixed identities; PD, PMGT, ID (no -core suffix) are roles that can also be assigned to a JS as
 * they grow into them." A -core employee's role comes straight from LDAP (see ldap-auth.js); a
 * JS's roles are explicit, human-logged grants — same "logged decision, not an algorithm's guess"
 * philosophy as every placement/aspiration/match in this app. Stored as `RoleGrant: <email> —
 * <role>` issues in team-ops, most recent per (email, role) pair wins, matching the Aspiration
 * check-in pattern already established.
 */
import { listIssues } from "./onedev-client.js";

const TEAM_OPS_PROJECT_ID = 3;
const GRANTABLE_ROLES = new Set(["PD", "PMGT", "ID", "CD"]);

/** All roles currently granted to this email, newest grant/revoke per role wins. A `RoleGrant`
 * issue's description carries `Action: grant` or `Action: revoke` — revocable, not just additive,
 * since growing into a role is a real reversible people decision, not a one-way ratchet. */
export async function rolesForEmail(email) {
  if (!email) return [];
  const issues = await listIssues({ count: 250 });
  const grants = issues
    .filter((i) => i.projectId === TEAM_OPS_PROJECT_ID && i.title === `RoleGrant: ${email}`)
    .sort((a, b) => new Date(b.submitDate) - new Date(a.submitDate));

  const latestActionPerRole = new Map();
  for (const issue of grants) {
    const role = /^Role:\s*(.+)$/m.exec(issue.description || "")?.[1]?.trim();
    const action = /^Action:\s*(.+)$/m.exec(issue.description || "")?.[1]?.trim();
    if (!role || !GRANTABLE_ROLES.has(role)) continue;
    if (!latestActionPerRole.has(role)) latestActionPerRole.set(role, action); // first hit = newest, list is sorted
  }
  return [...latestActionPerRole.entries()].filter(([, action]) => action === "grant").map(([role]) => role);
}
