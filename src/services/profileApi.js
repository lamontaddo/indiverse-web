// src/services/profileApi.js ✅ FULL DROP-IN (Vite Web)
// Keeps profileFetch behavior + adds profileFetchRaw
//
// Requires: ./profileRegistry exports getProfileByKey(profileKey)
// Profile shape can include:
// - apiBaseUrl
// - endpoints.apiBaseUrl
//
// Env fallback (Vite):
// - import.meta.env.VITE_API_BASE_URL
// - import.meta.env.VITE_EXPO_PUBLIC_API_BASE_URL (optional compatibility)

import { getProfileByKey } from './profileRegistry.js';

function normProfileKey(profileKey) {
  return String(profileKey || '').trim().toLowerCase();
}

function cleanBase(url) {
  return String(url || '').trim().replace(/\/+$/, '');
}

/**
 * Resolve API base URL for a profile.
 * Supports:
 * - profile.apiBaseUrl
 * - profile.endpoints.apiBaseUrl
 * - fallback env
 *
 * NOTE: requires profileKey (no silent lamont fallback)
 */
export function getApiBaseUrl(profileKey) {
  const pk = normProfileKey(profileKey);
  const p = pk ? getProfileByKey(pk) : null;

  const base =
    p?.apiBaseUrl ||
    p?.endpoints?.apiBaseUrl ||
    import.meta.env.VITE_EXPO_PUBLIC_API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    '';

  return cleanBase(base);
}

/**
 * ✅ RAW fetch (returns native Response)
 * Always includes:
 * - x-profile-key
 *
 * Use this when you want:
 * - res.ok / res.status / res.json()
 */
export async function profileFetchRaw(profileKey, path, options = {}) {
  const pk = normProfileKey(profileKey);
  if (!pk) throw new Error('Missing profileKey for profileFetchRaw');

  const base = getApiBaseUrl(pk);
  if (!base) throw new Error(`Missing apiBaseUrl for profileKey=${pk}`);

  const urlPath = String(path || '').startsWith('/') ? path : `/${path}`;
  const url = `${base}${urlPath}`;

  console.log('🌐 [profileFetchRaw] base=', base, 'url=', url, 'profileKey=', pk);

  const headers = {
    ...(options.headers || {}),
    'x-profile-key': pk,
  };

  return fetch(url, { ...options, headers });
}

/**
 * PUBLIC fetch that always includes:
 * - x-profile-key
 *
 * Returns normalized response object:
 * - { ok:true, ...data } for JSON
 * - { ok:false, status, error, raw } for errors
 *
 * ✅ Keep this for existing screens so nothing breaks.
 */
export async function profileFetch(profileKey, path, options = {}) {
  const pk = normProfileKey(profileKey);
  if (!pk) {
    return { ok: false, error: 'Missing profileKey for profileFetch' };
  }

  const base = getApiBaseUrl(pk);
  if (!base) {
    return { ok: false, error: `Missing apiBaseUrl for profileKey=${pk}` };
  }

  const urlPath = String(path || '').startsWith('/') ? path : `/${path}`;
  const url = `${base}${urlPath}`;

  console.log('🌐 [profileFetch] base=', base, 'url=', url, 'profileKey=', pk);

  const headers = {
    ...(options.headers || {}),
    'x-profile-key': pk,
  };

  let res;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (e) {
    return { ok: false, error: e?.message || 'Network error' };
  }

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `Request failed (${res.status})`;
    return { ok: false, status: res.status, error: msg, raw: data };
  }

  // If backend already returns { ok:true, ... } keep it
  if (data && typeof data === 'object') return data;

  return { ok: true, status: res.status, data };
}
