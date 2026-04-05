/** Live branch: optional AI annotate — stub returns code unchanged when API module is not bundled. */
export async function fetchFeedbackAnnotate({ userCode = "" } = {}) {
  return { annotatedCode: userCode || "" };
}
