// src/services/profileApi.js ✅ FULL DROP-IN (Vite Web)
// Keeps profileFetch behavior + adds profileFetchRaw
// ✅ FIX: Automatically attaches buyer auth headers (Authorization + x-user-id) when present
// ✅ FIX: Adds credentials:'include' (safe default)

import { getProfileByKey } from './profileRegistry.js';

function normProfileKey(profileKey) {
  return String(profileKey || '').trim().toLowerCase();
}

function cleanBase(url) {
  return String(url || '').trim().replace(/\/+$/, '');
}

function readBuyerToken() {
  try {
    return String(localStorage.getItem('buyerToken') || '').trim();
  } catch {
    return '';
  }
}

function readBuyerUserId() {
  try {
    // your storage key already exists
    const direct = String(localStorage.getItem('buyerUserId_v1') || '').trim();
    if (direct) return direct;

    // fallback: try to decode from JWT "sub"
    const token = readBuyerToken();
    if (!token) return '';
    const parts = token.split('.');
    if (parts.length < 2) return '';

    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4 ? '='.repeat(4 - (b64.length % 4)) : '';
    const json = atob(b64 + pad);
    const payload = JSON.parse(json);

    return String(payload?.userId || payload?.id || payload?._id || payload?.sub || '').trim();
  } catch {
    return '';
  }
}

function normalizeHeaders(h) {
  // supports plain object OR Headers instance
  try {
    if (!h) return {};
    if (h instanceof Headers) {
      const out = {};
      h.forEach((v, k) => (out[k] = v));
      return out;
    }
    if (typeof h === 'object') return { ...h };
    return {};
  } catch {
    return {};
  }
}

/**
 * Resolve API base URL for a profile.
 * Supports:
 * - profile.apiBaseUrl
 * - profile.endpoints.apiBaseUrl
 * - fallback env
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
 * If buyer is logged in, also includes:
 * - Authorization: Bearer <buyerToken>
 * - x-user-id: <buyerUserId>
 */
export async function profileFetchRaw(profileKey, path, options = {}) {
  const pk = normProfileKey(profileKey);
  if (!pk) throw new Error('Missing profileKey for profileFetchRaw');

  const base = getApiBaseUrl(pk);
  if (!base) throw new Error(`Missing apiBaseUrl for profileKey=${pk}`);

  const urlPath = String(path || '').startsWith('/') ? path : `/${path}`;
  const url = `${base}${urlPath}`;

  const token = readBuyerToken();
  const buyerUserId = readBuyerUserId();

  const inHeaders = normalizeHeaders(options.headers);

  const headers = {
    ...inHeaders,
    'x-profile-key': pk,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(buyerUserId ? { 'x-user-id': buyerUserId } : {}),
  };

  return fetch(url, {
    ...options,
    headers,
    credentials: options.credentials || 'include',
  });
}

/**
 * PUBLIC fetch that always includes:
 * - x-profile-key
 * + buyer auth headers when present
 *
 * Returns normalized response object:
 * - { ok:true, ...data } for JSON
 * - { ok:false, status, error, raw } for errors
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

  const token = readBuyerToken();
  const buyerUserId = readBuyerUserId();

  const inHeaders = normalizeHeaders(options.headers);

  const headers = {
    ...inHeaders,
    'x-profile-key': pk,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(buyerUserId ? { 'x-user-id': buyerUserId } : {}),
  };

  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers,
      credentials: options.credentials || 'include',
    });
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
