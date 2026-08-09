/**
 * Server-side Team Messaging helper — same webhook as src/team-messaging/notify.js,
 * but called directly (no Vite dev-proxy available from a plain Node process).
 */
export async function notifyTeamServer(text) {
  const webhookId = process.env.VITE_MATTERMOST_WEBHOOK_ID;
  if (!webhookId) {
    console.warn("[team-messaging] VITE_MATTERMOST_WEBHOOK_ID not set — skipping notification:", text);
    return;
  }
  try {
    await fetch(`http://localhost:8065/hooks/${webhookId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch (err) {
    console.warn("[team-messaging] notify failed:", err.message);
  }
}
