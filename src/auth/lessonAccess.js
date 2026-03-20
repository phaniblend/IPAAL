/**
 * Access gate: first 3 lessons free, then require register; 7 more free after register; then $1/lesson.
 * Persists to localStorage until backend auth exists.
 */

const STORAGE_KEY_ACCESSED = "inpact_lessons_accessed";
const STORAGE_KEY_REGISTERED = "inpact_user_registered";
const STORAGE_KEY_BALANCE = "inpact_balance_cents"; // store in cents to avoid float issues
const STORAGE_KEY_USER = "inpact_user"; // { name, emailOrPhone } for display

export const FREE_LESSONS_BEFORE_REGISTER = 3;
export const FREE_LESSONS_AFTER_REGISTER = 7;
export const TOTAL_FREE_LESSONS = FREE_LESSONS_BEFORE_REGISTER + FREE_LESSONS_AFTER_REGISTER;
export const PRICE_PER_LESSON_CENTS = 100; // $1
export const FUND_BUCKETS_CENTS = [500, 1000, 1500, 2000, 2500]; // $5, $10, $15, $20, $25

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

/** Call when user actually enters a lesson (so we count the access). */
export function recordLessonAccess(track, index) {
  const keys = getAccessedKeys();
  const key = lessonKey(track, index);
  if (keys.includes(key)) return;
  keys.push(key);
  setAccessedKeys(keys);
}

/** Number of unique lessons ever accessed. */
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

/** Clear registered state and stored user (log out). Does not clear lesson access count or balance. */
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

/** True if this lesson would be the 4th (first that requires register). */
export function mustRegisterToAccess(track, index) {
  const keys = getAccessedKeys();
  const key = lessonKey(track, index);
  if (keys.includes(key)) return false; // re-visit allowed
  if (isRegistered()) return false;
  return keys.length >= FREE_LESSONS_BEFORE_REGISTER;
}

/** True if user is registered but this lesson is past the free 10 and they need to pay. */
export function mustPayToAccess(track, index) {
  const keys = getAccessedKeys();
  const key = lessonKey(track, index);
  if (keys.includes(key)) return false;
  if (!isRegistered()) return false;
  return keys.length >= TOTAL_FREE_LESSONS;
}

/** True if user can open this lesson without any modal (free or already paid/within free). */
export function canAccessLesson(track, index) {
  const keys = getAccessedKeys();
  const key = lessonKey(track, index);
  if (keys.includes(key)) return true;
  if (!isRegistered()) return keys.length < FREE_LESSONS_BEFORE_REGISTER;
  if (keys.length < TOTAL_FREE_LESSONS) return true;
  return getBalanceCents() >= PRICE_PER_LESSON_CENTS;
}

/** Deduct one lesson payment. Call after allowing access to a paid lesson. */
export function deductLessonPayment() {
  const balance = getBalanceCents();
  if (balance >= PRICE_PER_LESSON_CENTS) {
    setBalanceCents(balance - PRICE_PER_LESSON_CENTS);
  }
}

/** Simple fingerprint hint for backend later (browser + screen + tz). */
export function getFingerprintHint() {
  if (typeof navigator === "undefined") return "";
  const ua = navigator.userAgent || "";
  const lang = (navigator.languages && navigator.languages[0]) || navigator.language || "";
  const screen = typeof screen !== "undefined" ? `${screen.width}x${screen.height}` : "";
  const tz = typeof Intl !== "undefined" && Intl.DateTimeFormat ? Intl.DateTimeFormat().resolvedOptions().timeZone : "";
  return [ua, lang, screen, tz].join("|");
}
