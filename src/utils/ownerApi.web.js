// src/utils/ownerApi.web.js ✅ FULL DROP-IN (WEB OWNER API)
// Fixes Render static-site 404 by ALWAYS calling the backend base URL.
//
// ✅ Uses VITE_API_BASE_URL (fallback to https://indiverse-backend.onrender.com)
// ✅ Adds x-profile-key ALWAYS for owner/admin endpoints
// ✅ Adds Authorization: Bearer <ownerToken> (profile-scoped)
// ✅ Clears token on 401/403
// ✅ Returns Response (raw) OR throws with err.code='OWNER_UNAUTHORIZED'

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  "https://indiverse-backend.onrender.com";

function clean(url) {
  return String(url || "").replace(/\/+$/, "");
}
function joinUrl(base, path) {
  const b = clean(base);
  const p = String(path || "");
  if (!p) return b;
  return `${b}${p.startsWith("/") ? p : `/${p}`}`;
}
export function normalizeProfileKey(pk) {
  return String(pk || "").trim().toLowerCase();
}

function ownerTokenKey(profileKey) {
  return `ownerToken:${normalizeProfileKey(profileKey)}`;
}

// ✅ keep same behavior as your login page
export function getOwnerToken(profileKey) {
  const pk = normalizeProfileKey(profileKey);
  try {
    return (
      localStorage.getItem(ownerTokenKey(pk)) ||
      localStorage.getItem("ownerToken") ||
      ""
    );
  } catch {
    return "";
  }
}

export function clearOwnerToken(profileKey) {
  const pk = normalizeProfileKey(profileKey);
  try {
    localStorage.removeItem(ownerTokenKey(pk));
    // keep legacy key too (optional)
    localStorage.removeItem("ownerToken");
  } catch {}
}

function isOwnerOrAdminPath(path) {
  const p = String(path || "");
  return p.startsWith("/api/owner") || p.startsWith("/api/admin");
}

function requireProfileKeyOrThrow(path, profileKey) {
  if (!isOwnerOrAdminPath(path)) return;
  if (!profileKey) {
    const err = new Error(
      `Missing profileKey for owner/admin request: ${String(path)}`
    );
    err.code = "MISSING_PROFILE_KEY";
    throw err;
  }
}

async function readJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

/**
 * ✅ ownerFetchRawWeb(path, options)
 * - ALWAYS returns Response (even 404)
 * - ALWAYS calls API_BASE (never same-origin)
 */
export async function ownerFetchRawWeb(path, options = {}) {
  const {
    profileKey: profileKeyOverride,
    headers: headersOverride,
    method = "GET",
    body,
    ...rest
  } = options;

  const profileKey = normalizeProfileKey(profileKeyOverride);
  requireProfileKeyOrThrow(path, profileKey);

  const token = getOwnerToken(profileKey);
  const url = joinUrl(API_BASE, path);

  const bodyIsFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const headers = {
    Accept: "application/json",
    ...(bodyIsFormData ? {} : { "Content-Type": "application/json" }),
    ...(profileKey ? { "x-profile-key": profileKey, "X-Profile": profileKey } : {}),
    ...(headersOverride || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // 🔎 keep one debug line so you can SEE the host
  console.log("[ownerFetchRawWeb]", method, url, "pk=", profileKey, "hasToken=", !!token);

  const res = await fetch(url, {
    method,
    headers,
    body,
    mode: "cors",
    credentials: "include",
    cache: "no-store",
    ...rest,
  });

  if ((res.status === 401 || res.status === 403) && profileKey) {
    clearOwnerToken(profileKey);
  }

  return res;
}

/**
 * ✅ ownerJsonWeb(path, options)
 * - throws on non-2xx
 * - err.code='OWNER_UNAUTHORIZED' on 401/403
 */
export async function ownerJsonWeb(path, options = {}) {
  const res = await ownerFetchRawWeb(path, options);
  const data = await readJsonSafe(res);

  if (!res.ok || data?.ok === false) {
    const err = new Error(
      data?.error ||
        data?.message ||
        `Owner request failed (${res.status}) ${String(path)}`
    );
    err.status = res.status;
    err.data = data;
    if (res.status === 401 || res.status === 403) err.code = "OWNER_UNAUTHORIZED";
    throw err;
  }

  return data;
}
