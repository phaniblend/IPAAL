/**
 * DeepSeek API client — OpenAI-compatible chat completions.
 * Used when AI_PROVIDER=deepseek. Economical alternative to Claude.
 */

const DEEPSEEK_BASE = "https://api.deepseek.com";
const DEFAULT_MODEL = "deepseek-chat";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Call DeepSeek chat completions API; return assistant message text.
 * @param {{ system: string, user: string, maxTokens?: number, model?: string, apiKey: string }} opts
 * @returns {Promise<string>}
 */
export async function completeWithDeepSeek({ system, user, maxTokens = 2048, model = DEFAULT_MODEL, apiKey }) {
  if (!apiKey) throw new Error("DeepSeek API key not configured");

  const url = `${DEEPSEEK_BASE}/v1/chat/completions`;
  const body = {
    model,
    max_tokens: maxTokens,
    messages: [
      ...(system ? [{ role: "system", content: system }] : []),
      { role: "user", content: user },
    ],
  };

  const maxRetries = 3;
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        const err = new Error(`DeepSeek API ${res.status}: ${errText}`);
        err.status = res.status;
        throw err;
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content == null) throw new Error("No content in DeepSeek response");
      return content;
    } catch (err) {
      lastError = err;
      const msg = (err?.message ?? "").toLowerCase();
      const is429 = err?.status === 429 || msg.includes("rate") || msg.includes("429");
      if (is429 && attempt < maxRetries) {
        const backoffMs = Math.min(60_000, 15_000 * Math.pow(2, attempt));
        await sleep(backoffMs);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}
