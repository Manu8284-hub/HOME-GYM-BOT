// Local-only account + progress store for FitBot AI.
//
// IMPORTANT: This is browser-local persistence, NOT real authentication.
// Passwords are only base64-obscured (not encrypted or hashed) and never
// leave the browser. Everything here lives in localStorage on this device.

const ACCOUNTS_KEY = 'fitbot:accounts';
const SESSION_KEY = 'fitbot:sessionEmail';
const AUTH_KEY = 'fitbot:isLoggedIn';
const USER_PREFIX = 'fitbot:user:';

/* ----------------------------- low-level I/O ----------------------------- */

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('localStore write failed:', key, err);
  }
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function nameFromEmail(email) {
  return normalizeEmail(email).split('@')[0].replace(/[._-]+/g, ' ').trim();
}

function encodePass(password) {
  try {
    // encodeURIComponent keeps btoa unicode-safe.
    return btoa(unescape(encodeURIComponent(String(password))));
  } catch {
    return String(password);
  }
}

/* -------------------------- date helper (local) -------------------------- */

export function todayKey(date) {
  const d = date instanceof Date ? date : new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/* ------------------------------- accounts -------------------------------- */

export function getAccounts() {
  return readJSON(ACCOUNTS_KEY, {}) || {};
}

export function accountExists(email) {
  return Boolean(getAccounts()[normalizeEmail(email)]);
}

export function signUp({ name, email, password }) {
  const key = normalizeEmail(email);
  if (!key) return { ok: false, error: 'Please enter your email.' };
  if (!password) return { ok: false, error: 'Please choose a password.' };

  const accounts = getAccounts();
  if (accounts[key]) {
    return { ok: false, error: 'An account with this email already exists. Try signing in.' };
  }

  const account = {
    name: String(name || '').trim() || nameFromEmail(key),
    email: key,
    pass: encodePass(password),
    createdAt: new Date().toISOString()
  };
  accounts[key] = account;
  writeJSON(ACCOUNTS_KEY, accounts);

  // Seed an empty per-user record so onboarding starts fresh.
  ensureUserData(key);
  return { ok: true, account: { name: account.name, email: account.email } };
}

export function signIn({ email, password }) {
  const key = normalizeEmail(email);
  const account = getAccounts()[key];
  if (!account) {
    return { ok: false, error: 'No account found for this email. Sign up to get started.' };
  }
  if (account.pass !== encodePass(password)) {
    return { ok: false, error: 'Incorrect password. Please try again.' };
  }
  return { ok: true, account: { name: account.name, email: account.email } };
}

/* -------------------------------- session -------------------------------- */

export function getSessionEmail() {
  try {
    return normalizeEmail(localStorage.getItem(SESSION_KEY) || '');
  } catch {
    return '';
  }
}

export function setSession(email) {
  const key = normalizeEmail(email);
  try {
    localStorage.setItem(SESSION_KEY, key);
    localStorage.setItem(AUTH_KEY, 'true');
  } catch (err) {
    console.error('setSession failed:', err);
  }
  return key;
}

export function clearSession() {
  // Only clears the active session — accounts and per-user data are kept,
  // which is what keeps different accounts isolated on this device.
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(AUTH_KEY);
  } catch (err) {
    console.error('clearSession failed:', err);
  }
}

export function isLoggedIn() {
  try {
    return localStorage.getItem(AUTH_KEY) === 'true' && Boolean(getSessionEmail());
  } catch {
    return false;
  }
}

/* ----------------------------- per-user data ----------------------------- */

function userKey(email) {
  return USER_PREFIX + normalizeEmail(email);
}

function emptyUserData() {
  return {
    profile: null,
    plan: null,
    onboardingComplete: false,
    progress: {
      water: { date: todayKey(), cups: 0 },
      completions: {},
      notes: []
    }
  };
}

export function getUserData(email) {
  const key = normalizeEmail(email);
  if (!key) return emptyUserData();

  const data = readJSON(userKey(key), null);
  if (!data) return emptyUserData();

  // Merge defaults so older/partial records never crash a reader.
  return {
    profile: data.profile ?? null,
    plan: data.plan ?? null,
    onboardingComplete: Boolean(data.onboardingComplete),
    progress: {
      water: data.progress?.water ?? { date: todayKey(), cups: 0 },
      completions: data.progress?.completions ?? {},
      notes: Array.isArray(data.progress?.notes) ? data.progress.notes : []
    }
  };
}

function ensureUserData(email) {
  const key = normalizeEmail(email);
  if (!key) return emptyUserData();
  if (!readJSON(userKey(key), null)) {
    writeJSON(userKey(key), emptyUserData());
  }
  return getUserData(key);
}

function saveUserData(email, data) {
  const key = normalizeEmail(email);
  if (!key) return;
  writeJSON(userKey(key), data);
}

export function saveProfile(email, profile) {
  const data = getUserData(email);
  data.profile = profile;
  saveUserData(email, data);
  return data.profile;
}

/* --------------------------- generated plan ------------------------------ */

export function getPlan(email) {
  return getUserData(email).plan;
}

export function savePlan(email, plan) {
  const data = getUserData(email);
  data.plan = plan;
  saveUserData(email, data);
  return data.plan;
}

export function isOnboarded(email) {
  return getUserData(email).onboardingComplete;
}

export function setOnboarded(email) {
  const data = getUserData(email);
  data.onboardingComplete = true;
  saveUserData(email, data);
}

/* ----------------------- progress: water (daily) ------------------------- */

export function getWater(email) {
  const water = getUserData(email).progress.water;
  if (!water || water.date !== todayKey()) return 0; // resets on a new local day
  return Number(water.cups) || 0;
}

export function setWater(email, cups) {
  const safeCups = Math.max(0, Number(cups) || 0);
  const data = getUserData(email);
  data.progress.water = { date: todayKey(), cups: safeCups };
  saveUserData(email, data);
  return safeCups;
}

/* -------------------- progress: completion / streak ---------------------- */

export function isTodayComplete(email) {
  return Boolean(getUserData(email).progress.completions[todayKey()]);
}

export function toggleTodayComplete(email) {
  const data = getUserData(email);
  const key = todayKey();
  if (data.progress.completions[key]) {
    delete data.progress.completions[key];
  } else {
    data.progress.completions[key] = true;
  }
  saveUserData(email, data);
  return Boolean(data.progress.completions[key]);
}

export function getSessionsCount(email) {
  return Object.keys(getUserData(email).progress.completions).length;
}

// Consecutive completed days ending today. If today isn't logged yet, an
// active streak still counts back from yesterday (so it doesn't read as 0
// until you tick today off).
export function getStreak(email) {
  const completions = getUserData(email).progress.completions;
  if (!completions || Object.keys(completions).length === 0) return 0;

  const cursor = new Date();
  if (!completions[todayKey(cursor)]) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (completions[todayKey(cursor)]) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/* ------------------------- progress: journal ----------------------------- */

export function getNotes(email) {
  return getUserData(email).progress.notes;
}

export function addNote(email, text) {
  const clean = String(text || '').trim();
  if (!clean) return getUserData(email).progress.notes;

  const data = getUserData(email);
  const note = {
    id: Date.now(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    text: clean
  };
  data.progress.notes = [note, ...data.progress.notes];
  saveUserData(email, data);
  return data.progress.notes;
}
