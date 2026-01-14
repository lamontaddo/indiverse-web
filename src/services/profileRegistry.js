// src/services/profileRegistry.js ✅ FULL DROP-IN (REMOTE ONLY, no hard-coded imports)

// in-memory remote overlay
let REMOTE_PROFILES = [];

function normalizeArr(arr) {
  return Array.isArray(arr) ? arr.filter(Boolean) : [];
}

function normKey(k) {
  return String(k || "").trim().toLowerCase();
}

function sanitizeProfile(p) {
  if (!p) return null;
  const key = normKey(p.key);
  if (!key) return null;
  return { ...p, key };
}

// ✅ recommended: pass full config { version, mode, profiles }
export function setRemoteConfig(cfg = {}) {
  REMOTE_PROFILES = normalizeArr(cfg?.profiles).map(sanitizeProfile).filter(Boolean);
}

// ✅ backwards compatibility: pass only profiles array
export function setRemoteProfiles(profilesArray = []) {
  REMOTE_PROFILES = normalizeArr(profilesArray).map(sanitizeProfile).filter(Boolean);
}

export function getProfiles() {
  return REMOTE_PROFILES.filter((p) => p?.enabled !== false);
}

export function getProfileByKey(key) {
  const k = normKey(key);
  if (!k) return null;
  return getProfiles().find((p) => p.key === k) || null;
}
