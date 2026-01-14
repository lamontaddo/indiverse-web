// src/utils/apiClient.js ✅ FULL DROP-IN (WEB SAFE + BACKWARDS COMPAT)
// Keeps exports: apiFetch/apiFetchOrThrow/apiJson/apiJsonMeta/apiJsonOrThrow/apiTextOrThrow
// Adds: profile-lead header (always), x-user-id (stable), optional Authorization
// IMPORTANT: NO x-profile-key by default (global buyer auth safe)

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  'https://indiverse-backend.onrender.com';

const PROFILE_LEAD =
  import.meta.env.VITE_PROFILE_LEAD?.trim() ||
  'web';

let buyerTokenGetter = null;
export function setBuyerTokenGetter(fn) {
  buyerTokenGetter = typeof fn === 'function' ? fn : null;
}
function getBuyerToken() {
  try {
    return buyerTokenGetter ? buyerTokenGetter() : null;
  } catch {
    return null;
  }
}

let buyerUserIdGetter = null;
export function setBuyerUserIdGetter(fn) {
  buyerUserIdGetter = typeof fn === 'function' ? fn : null;
}

const BUYER_UID_KEY = 'buyerUserId_v1';
let _cachedBuyerUserId = null;

function _rand() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

async function getBuyerUserId() {
  // 1) prefer injected getter
  try {
    if (buyerUserIdGetter) {
      const v = await Promise.resolve(buyerUserIdGetter());
      const s = String(v || '').trim();
      if (s) return s;
    }
  } catch {}

  // 2) cached
  if (_cachedBuyerUserId) return _cachedBuyerUserId;

  // 3) localStorage stable id
  try {
    const existing = localStorage.getItem(BUYER_UID_KEY);
    if (existing) {
      _cachedBuyerUserId = existing;
      return existing;
    }
    const created = `buyer_web_${_rand()}`;
    localStorage.setItem(BUYER_UID_KEY, created);
    _cachedBuyerUserId = created;
    return created;
  } catch {
    const fallback = `buyer_web_${_rand()}`;
    _cachedBuyerUserId = fallback;
    return fallback;
  }
}

function isFormData(x) {
  return typeof FormData !== 'undefined' && x instanceof FormData;
}

function addNoCacheHeaders(headers = {}) {
  return {
    ...headers,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  };
}

function joinUrl(base, path) {
  const cleanBase = String(base || '').replace(/\/+$/, '');
  const p = String(path || '');
  const cleanPath = p.startsWith('/') ? p : `/${p}`;
  return `${cleanBase}${cleanPath}`;
}

function withCacheBust(url) {
  const bust = `_ts=${Date.now()}`;
  return url.includes('?') ? `${url}&${bust}` : `${url}?${bust}`;
}

// case-insensitive header helpers
function hasHeader(headers, name) {
  if (!headers) return false;
  const target = String(name || '').toLowerCase();
  return Object.keys(headers).some((k) => String(k).toLowerCase() === target);
}
function setHeader(headers, name, value) {
  const target = String(name || '').toLowerCase();
  const keys = Object.keys(headers || {});
  const existingKey = keys.find((k) => String(k).toLowerCase() === target);
  if (existingKey) headers[existingKey] = value;
  else headers[name] = value;
}

/**
 * ✅ apiFetch (WEB SAFE)
 * - Always returns Response
 * - Always sends profile-lead
 * - Adds x-user-id by default
 * - Adds Authorization if buyer token exists (unless auth:'none')
 * - Does NOT add x-profile-key unless you pass profileKey explicitly
 */
export async function apiFetch(path, options = {}) {
  const {
    profileKey, // optional (only for profile-scoped endpoints)
    headers: headersOverride,
    auth = 'buyer', // 'buyer' | 'none'
    userId: userIdOverride,
    includeUserId = true,
    ...rest
  } = options;

  const url = withCacheBust(joinUrl(API_BASE, path));

  const method = String(rest.method || 'GET').toUpperCase();
  const hasBody = rest.body != null;
  const bodyIsForm = isFormData(rest.body);

  let headers = {
    Accept: 'application/json',
    'profile-lead': PROFILE_LEAD, // ✅ required
    ...(headersOverride || {}),
  };

  headers = addNoCacheHeaders(headers);

  // Only attach x-profile-key if explicitly provided (web buyer auth should not)
  if (profileKey && !hasHeader(headers, 'x-profile-key')) {
    setHeader(headers, 'x-profile-key', String(profileKey));
  }

  if (hasBody && !bodyIsForm && !hasHeader(headers, 'Content-Type')) {
    setHeader(headers, 'Content-Type', 'application/json');
  }

  if (includeUserId && !hasHeader(headers, 'x-user-id')) {
    const uid = String(userIdOverride || (await getBuyerUserId()) || '').trim();
    if (uid) setHeader(headers, 'x-user-id', uid);
  }

  if (auth !== 'none' && !hasHeader(headers, 'Authorization')) {
    const token = getBuyerToken();
    if (token) setHeader(headers, 'Authorization', `Bearer ${String(token)}`);
  }

  const res = await fetch(url, {
    ...rest,
    method,
    headers,
    mode: 'cors',
    credentials: 'include', // ✅ if your backend uses cookies/sessions; OK even if not
    cache: 'no-store',
  });

  return res;
}

export async function apiFetchOrThrow(path, options = {}) {
  const res = await apiFetch(path, options);
  if (!res.ok) {
    let bodyText = '';
    try {
      bodyText = await res.text();
    } catch {}
    throw new Error(`apiFetch failed (${res.status}) ${path}\n${bodyText}`);
  }
  return res;
}

export async function apiJson(path, options = {}) {
  const res = await apiFetch(path, options);
  const raw = await res.text().catch(() => '');

  let parsed = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = null;
  }

  const out =
    parsed && typeof parsed === 'object'
      ? parsed
      : { value: parsed ?? raw ?? null };

  try {
    out.__ok = res.ok;
    out.__status = res.status;
    out.__raw = String(raw || '');
  } catch {}

  return out;
}

export async function apiJsonMeta(path, options = {}) {
  const res = await apiFetch(path, options);
  const text = await res.text().catch(() => '');
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }
  return { ok: res.ok, status: res.status, data, res, raw: text };
}

export async function apiJsonOrThrow(path, options = {}) {
  const meta = await apiJsonMeta(path, options);

  if (!meta.ok) {
    const msg =
      (meta.data && typeof meta.data === 'object' && (meta.data.error || meta.data.message)) ||
      (typeof meta.data === 'string' ? meta.data : null) ||
      meta.raw ||
      'Request failed.';
    throw new Error(`apiJsonOrThrow failed (${meta.status}) ${path}\n${msg}`);
  }

  return meta.data;
}

export async function apiTextOrThrow(path, options = {}) {
  const res = await apiFetchOrThrow(path, options);
  return await res.text().catch(() => '');
}

export function _debugGetBuyerAuthHeader() {
  const t = getBuyerToken();
  return t ? `Bearer ${String(t)}` : null;
}
