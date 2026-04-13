/**
 * Map step feedback onto the learner's code (inline comments / minimal fixes) via DeepSeek.
 * Used by POST /api/lessons/feedback-annotate on the server.
 */

import { z } from "zod";
import { completeWithAI } from "../providers/aiProvider.js";
import { FEEDBACK_ANNOTATE_SYSTEM, buildFeedbackAnnotateUserPrompt } from "../prompt-templates/feedbackAnnotate.js";
import { parseAndValidate } from "../utils/parseJson.js";

const annotateResponseSchema = z.object({
  annotatedCode: z.string(),
});

function commentSyntaxForLanguage(language) {
  const l = String(language || "").toLowerCase();
  if (l.includes("python")) return "#";
  if (l.includes("css") && !l.includes("tsx") && !l.includes("jsx")) return "/* */";
  return "//";
}

/**
 * @param {{ instruction?: string, feedback: string, hint?: string, userCode: string, language?: string }} params
 * @param {{ apiKey: string, provider?: string }} options
 * @returns {Promise<{ annotatedCode: string }>}
 */
export async function annotateFeedbackOnCode(params, options = {}) {
  const { apiKey, provider = "deepseek" } = options;
  const {
    instruction = "",
    feedback = "",
    hint = "",
    userCode = "",
    language = "typescript",
  } = params;

  const user = buildFeedbackAnnotateUserPrompt({
    instruction,
    feedback,
    hint,
    userCode: String(userCode),
    language,
    commentSyntax: commentSyntaxForLanguage(language),
  });

  const raw = await completeWithAI({
    system: FEEDBACK_ANNOTATE_SYSTEM,
    user,
    maxTokens: 4096,
    apiKey,
    provider,
  });

  const parsed = parseAndValidate(raw, annotateResponseSchema);
  if (!parsed.success) {
    throw new Error(parsed.error || "Feedback annotate response invalid");
  }
  return { annotatedCode: parsed.data.annotatedCode };
}
