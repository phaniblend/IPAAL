/**
 * Access gate (unique lessons per browser, localStorage until backend exists):
 * - Lessons 1–5: no prompt.
 * - Lessons 6–8: soft “register” prompt (dismissible — “slide” three times).
 * - Lesson 9: must register (Google or form) before access.
 * - Lessons 10–15: free after registration (7 more after account).
 * - Lesson 16+: $1 per new lesson (balance); lifetime access once unlocked for that lesson.
 */

const STORAGE_KEY_ACCESSED = "inpact_lessons_accessed";
const STORAGE_KEY_REGISTERED = "inpact_user_registered";
const STORAGE_KEY_BALANCE = "inpact_balance_cents";
const STORAGE_KEY_USER = "inpact_user";
const STORAGE_KEY_DISMISS_COUNT = "inpact_register_dismiss_count";

/** First N unique lessons with no register prompt. */
export const FREE_LESSONS_SILENT = 5;
/** Lessons 6–8: soft register modal (dismissible). */
export const SOFT_REGISTER_COUNT = 3;
/** Max unique lessons without an account (after 3 dismissible prompts on 6–8). */
export const MAX_FREE_UNREGISTERED = FREE_LESSONS_SILENT + SOFT_REGISTER_COUNT; // 8
/** Total free unique lessons once registered (includes the 8 anonymous tier). */
export const TOTAL_FREE_LESSONS = 15;
/** Extra free lessons after registering (for copy): 15 − 8 = 7. */
export const FREE_LESSONS_AFTER_REGISTER = TOTAL_FREE_LESSONS - MAX_FREE_UNREGISTERED;

export const PRICE_PER_LESSON_CENTS = 100; // $1
/** Fund buckets: $5–$25 in steps of $5 (payment integration later). */
export const FUND_BUCKETS_CENTS = [500, 1000, 1500, 2000, 2500];

function getAccessedKeys() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACCESSED);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function setAccessedKeys(keys) {
  try {
    localStorage.setItem(STORAGE_KEY_ACCESSED, JSON.stringify(keys));
  } catch (_) {}
}

function lessonKey(track, index) {
  return `${track}:${index}`;
}

/** Call when user actually enters a lesson (counts toward limits). */
export function recordLessonAccess(track, index) {
  const keys = getAccessedKeys();
  const key = lessonKey(track, index);
  if (keys.includes(key)) return;
  keys.push(key);
  setAccessedKeys(keys);
}

export function getAccessedCount() {
  return getAccessedKeys().length;
}

export function isRegistered() {
  try {
    return localStorage.getItem(STORAGE_KEY_REGISTERED) === "true";
  } catch {
    return false;
  }
}

export function setRegistered(user = null) {
  try {
    localStorage.setItem(STORAGE_KEY_REGISTERED, "true");
    if (user) localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } catch (_) {}
}

export function logout() {
  try {
    localStorage.removeItem(STORAGE_KEY_REGISTERED);
    localStorage.removeItem(STORAGE_KEY_USER);
  } catch (_) {}
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getBalanceCents() {
  try {
    const v = localStorage.getItem(STORAGE_KEY_BALANCE);
    return v != null ? parseInt(v, 10) : 0;
  } catch {
    return 0;
  }
}

export function setBalanceCents(cents) {
  try {
    localStorage.setItem(STORAGE_KEY_BALANCE, String(Math.max(0, cents)));
  } catch (_) {}
}

export function addFundsCents(cents) {
  setBalanceCents(getBalanceCents() + cents);
}

/**
 * Soft prompt: unregistered user opening 6th, 7th, or 8th unique lesson (keys length 5, 6, or 7 before add).
 */
export function mustSoftRegisterToAccess(track, index) {
  const keys = getAccessedKeys();
  const key = lessonKey(track, index);
  if (keys.includes(key)) return false;
  if (isRegistered()) return false;
  return keys.length >= FREE_LESSONS_SILENT && keys.length < MAX_FREE_UNREGISTERED;
}

/**
 * Hard gate: unregistered user opening 9th unique lesson.
 */
export function mustHardRegisterToAccess(track, index) {
  const keys = getAccessedKeys();
  const key = lessonKey(track, index);
  if (keys.includes(key)) return false;
  if (isRegistered()) return false;
  return keys.length >= MAX_FREE_UNREGISTERED;
}

/** Registered user past free tier opening a new lesson — needs balance (mock until payment). */
export function mustPayToAccess(track, index) {
  const keys = getAccessedKeys();
  const key = lessonKey(track, index);
  if (keys.includes(key)) return false;
  if (!isRegistered()) return false;
  return keys.length >= TOTAL_FREE_LESSONS;
}

export function canAccessLesson(track, index) {
  const keys = getAccessedKeys();
  const key = lessonKey(track, index);
  if (keys.includes(key)) return true;
  if (!isRegistered()) {
    if (keys.length < FREE_LESSONS_SILENT) return true;
    if (keys.length < MAX_FREE_UNREGISTERED) return true; // soft gate handled in UI
    return false;
  }
  if (keys.length < TOTAL_FREE_LESSONS) return true;
  return getBalanceCents() >= PRICE_PER_LESSON_CENTS;
}

export function deductLessonPayment() {
  const balance = getBalanceCents();
  if (balance >= PRICE_PER_LESSON_CENTS) {
    setBalanceCents(balance - PRICE_PER_LESSON_CENTS);
  }
}

export function getRegisterDismissCount() {
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY_DISMISS_COUNT) || "0", 10);
  } catch {
    return 0;
  }
}

export function incrementRegisterDismissCount() {
  try {
    const c = getRegisterDismissCount() + 1;
    localStorage.setItem(STORAGE_KEY_DISMISS_COUNT, String(c));
    return c;
  } catch {
    return 0;
  }
}

const STORAGE_KEY_PENDING_LESSON = "inpact_pending_lesson";
/** Drop stale pending resume payloads (e.g. abandoned OAuth) so we do not hijack a later visit. */
const PENDING_LESSON_MAX_AGE_MS = 60 * 60 * 1000; // 1 hour

/** Persist the lesson the user was trying to open when the auth gate triggered (survives OAuth redirects). */
export function savePendingLesson(track, index, item) {
  try {
    const payload = JSON.stringify({ track, index, item, savedAt: Date.now() });
    localStorage.setItem(STORAGE_KEY_PENDING_LESSON, payload);
    sessionStorage.setItem(STORAGE_KEY_PENDING_LESSON, payload);
  } catch (_) {}
}

/** Read pending lesson without removing (used after OAuth before navigation commits). */
export function peekPendingLesson() {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY_PENDING_LESSON) ?? sessionStorage.getItem(STORAGE_KEY_PENDING_LESSON);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (p?.savedAt != null && Date.now() - p.savedAt > PENDING_LESSON_MAX_AGE_MS) {
      clearPendingLesson();
      return null;
    }
    return p;
  } catch {
    return null;
  }
}

/** Read and clear the stored pending lesson (returns null if none). */
export function consumePendingLesson() {
  const p = peekPendingLesson();
  clearPendingLesson();
  return p;
}

export function clearPendingLesson() {
  try {
    localStorage.removeItem(STORAGE_KEY_PENDING_LESSON);
    sessionStorage.removeItem(STORAGE_KEY_PENDING_LESSON);
  } catch (_) {}
}

export function getFingerprintHint() {
  if (typeof navigator === "undefined") return "";
  const ua = navigator.userAgent || "";
  const lang = (navigator.languages && navigator.languages[0]) || navigator.language || "";
  const screen = typeof screen !== "undefined" ? `${screen.width}x${screen.height}` : "";
  const tz = typeof Intl !== "undefined" && Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone : "";
  return [ua, lang, screen, tz].join("|");
}
