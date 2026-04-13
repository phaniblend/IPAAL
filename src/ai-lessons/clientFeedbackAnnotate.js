/**
 * Browser client for POST /api/lessons/feedback-annotate (DeepSeek on server).
 */

function aiValidationDisabled() {
  if (typeof import.meta === "undefined" || !import.meta.env) return false;
  return String(import.meta.env.VITE_DISABLE_AI_VALIDATION || "").toLowerCase() === "true";
}

/**
 * @param {{ instruction?: string, feedback: string, hint?: string, userCode: string, language?: string }} opts
 * @returns {Promise<{ annotatedCode: string }>}
 */
export async function fetchFeedbackAnnotate({ instruction, feedback, hint, userCode, language }) {
  if (aiValidationDisabled()) {
    throw new Error("AI validation disabled (VITE_DISABLE_AI_VALIDATION)");
  }
  const res = await fetch("/api/lessons/feedback-annotate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      instruction: instruction ?? "",
      feedback: feedback ?? "",
      hint: hint ?? "",
      userCode: userCode ?? "",
      language: language ?? "typescript",
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg =
      err?.error ||
      (res.status === 404
        ? "Feedback annotate service not available. Run the server (npm run server) and try again."
        : res.status === 429
          ? "Rate limit exceeded. Please try again in a moment."
          : res.statusText || "Feedback annotate request failed.");
    throw new Error(msg);
  }
  return res.json();
}
