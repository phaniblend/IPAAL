/**
 * Free tier & gates (unique lessons per browser, localStorage until backend APIs exist).
 *
 * Business rules (summary):
 * - 1–5: no prompt.
 * - 6: soft — "Register to save… unlock 7 more" / "I'll register later"
 * - 7: no prompt (still within 8 anonymous)
 * - 8: soft — "Last chance!…" / "I promise…"
 * - 9: hard register — "limit for anonymous… Register to access 7 more"
 * - 10–15: free after registration (7 more). 16+: $1 per new lesson (balance).
 * - Logged-out but has registered before (ever_registered): banner; 1–8 allowed; 9+ requires log in (login wall).
 */

const STORAGE_KEY_ACCESSED = "inpact_lessons_accessed";
const STORAGE_KEY_REGISTERED = "inpact_user_registered";
const STORAGE_KEY_EVER_REGISTERED = "inpact_ever_registered";
const STORAGE_KEY_BALANCE = "inpact_balance_cents";
const STORAGE_KEY_USER = "inpact_user";
const STORAGE_KEY_DISMISS_COUNT = "inpact_register_dismiss_count";

/** First N unique lessons with no register prompt. */
export const FREE_LESSONS_SILENT = 5;
/** Max unique lessons without an account (anonymous cap before lesson 9 gate). */
export const MAX_FREE_UNREGISTERED = 8;
/** Total free unique lessons once logged in with an account (8 anon + 7 after register). */
export const TOTAL_FREE_LESSONS = 15;
/** Extra free lessons after registering (copy / product). */
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

/** True if this browser has completed registration at least once (persists after logout). */
export function hasEverRegistered() {
  try {
    return localStorage.getItem(STORAGE_KEY_EVER_REGISTERED) === "true";
  } catch {
    return false;
  }
}

export function setRegistered(user = null) {
  try {
    localStorage.setItem(STORAGE_KEY_REGISTERED, "true");
    localStorage.setItem(STORAGE_KEY_EVER_REGISTERED, "true");
    if (user) localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } catch (_) {}
}

export function logout() {
  try {
    if (localStorage.getItem(STORAGE_KEY_REGISTERED) === "true") {
      localStorage.setItem(STORAGE_KEY_EVER_REGISTERED, "true");
    }
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
 * @typedef {{ loggedIn?: boolean }} LessonGateOpts
 */

/**
 * Which soft prompt applies when opening the 6th or 8th unique lesson (never-registered anonymous only).
 * @returns {"six" | "eight" | null}
 */
export function getSoftGateKind(track, index, opts = {}) {
  const keys = getAccessedKeys();
  const key = lessonKey(track, index);
  if (keys.includes(key)) return null;
  if (isRegistered() || opts.loggedIn) return null;
  if (hasEverRegistered()) return null;
  if (keys.length !== FREE_LESSONS_SILENT && keys.length !== MAX_FREE_UNREGISTERED - 1) return null;
  return keys.length === FREE_LESSONS_SILENT ? "six" : "eight";
}

/** Soft gate: lesson 6 and lesson 8 only (not lesson 7). */
export function mustSoftRegisterToAccess(track, index, opts = {}) {
  return getSoftGateKind(track, index, opts) != null;
}

/**
 * Hard register gate: never-registered anonymous user hitting lesson 9 (9th unique).
 */
export function mustHardRegisterToAccess(track, index, opts = {}) {
  const keys = getAccessedKeys();
  const key = lessonKey(track, index);
  if (keys.includes(key)) return false;
  if (opts.loggedIn || isRegistered()) return false;
  if (hasEverRegistered()) return false;
  return keys.length >= MAX_FREE_UNREGISTERED;
}

/**
 * Returning user: registered before, logged out — must log in to open lesson 9+ (new unique past 8).
 */
export function mustLoginToUnlockPastAnonymousLimit(track, index, opts = {}) {
  const keys = getAccessedKeys();
  const key = lessonKey(track, index);
  if (keys.includes(key)) return false;
  if (opts.loggedIn || isRegistered()) return false;
  if (!hasEverRegistered()) return false;
  return keys.length >= MAX_FREE_UNREGISTERED;
}

/** Registered user past free tier opening a new lesson — needs balance (mock until payment). */
export function mustPayToAccess(track, index, opts = {}) {
  const keys = getAccessedKeys();
  const key = lessonKey(track, index);
  if (keys.includes(key)) return false;
  if (!isRegistered() && !opts.loggedIn) return false;
  return keys.length >= TOTAL_FREE_LESSONS;
}

export function canAccessLesson(track, index, opts = {}) {
  const keys = getAccessedKeys();
  const key = lessonKey(track, index);
  if (keys.includes(key)) return true;
  if (mustLoginToUnlockPastAnonymousLimit(track, index, opts)) return false;
  if (!opts.loggedIn && !isRegistered() && hasEverRegistered()) {
    return keys.length < MAX_FREE_UNREGISTERED;
  }
  if (!isRegistered() && !opts.loggedIn) {
    if (keys.length < FREE_LESSONS_SILENT) return true;
    if (keys.length < MAX_FREE_UNREGISTERED) return true;
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

/** Remaining free slots out of 15 for logged-in / registered local session (UI). */
export function getFreeLessonsRemaining(opts = {}) {
  if (!opts.loggedIn && !isRegistered()) return null;
  const used = getAccessedCount();
  return Math.max(0, TOTAL_FREE_LESSONS - used);
}

/** Line for anonymous users: how many of 8 anonymous slots used. */
export function getAnonymousFreeSlotsRemaining() {
  const used = getAccessedCount();
  return Math.max(0, MAX_FREE_UNREGISTERED - used);
}

const STORAGE_KEY_PENDING_LESSON = "inpact_pending_lesson";
/** Drop stale pending resume payloads (e.g. abandoned sign-in) so we do not hijack a later visit. */
const PENDING_LESSON_MAX_AGE_MS = 60 * 60 * 1000; // 1 hour

/** Persist the lesson the user was trying to open when the auth gate triggered (survives full-page reloads). */
export function savePendingLesson(track, index, item) {
  try {
    const payload = JSON.stringify({ track, index, item, savedAt: Date.now() });
    localStorage.setItem(STORAGE_KEY_PENDING_LESSON, payload);
    sessionStorage.setItem(STORAGE_KEY_PENDING_LESSON, payload);
  } catch (_) {}
}

/** Read pending lesson without removing (used after sign-in before navigation commits). */
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
