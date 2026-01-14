// src/config/apiBase.js ✅ FULL DROP-IN (WEB)
// Mirrors the MOBILE exports so imports never break:
// - getActiveProfileKey()
// - getApiBaseUrl(profileKey?)
//
// Web storage: localStorage (instead of AsyncStorage)
// Base URL resolution order:
//  1) profileRegistry fields (apiBaseUrl / baseUrl / apiUrl / backendUrl)
//  2) VITE_API_BASE_URL env fallback
//  3) same-origin fallback (window.location.origin)
//
// NOTE: Your mobile version currently hard-returns render.com.
// If you want web to behave exactly like that, set VITE_API_BASE_URL to Render and ignore registry.

import { getProfileByKey } from '../services/profileRegistry';

function clean(url) {
  return String(url || '').replace(/\/+$/, '');
}

export async function getActiveProfileKey() {
  try {
    return localStorage.getItem('profileKey') || 'lamont';
  } catch {
    return 'lamont';
  }
}

/**
 * getApiBaseUrl(profileKey?)
 * - If profileKey is passed, use it.
 * - Else read from localStorage.
 * - Uses profileRegistry when available.
 * - Falls back to env.
 */
export async function getApiBaseUrl(profileKey) {
  // 0) If you want web to match your current mobile "always render" behavior,
  //    uncomment this and you’re done:
  // return 'https://indiverse-backend.onrender.com';

  const pk = String(profileKey || '').trim().toLowerCase() || (await getActiveProfileKey());
  const profile = getProfileByKey(pk);

  // 1) profileRegistry-driven base url (preferred for multi-tenant)
  const base =
    profile?.apiBaseUrl ||
    profile?.baseUrl ||
    profile?.apiUrl ||
    profile?.backendBaseUrl ||
    profile?.backendUrl ||
    '';

  if (base) return clean(base);

  // 2) env fallback
  const envBase = import.meta.env.VITE_API_BASE_URL;
  if (envBase) return clean(envBase);

  // 3) last resort: same-origin (works if you proxy /api in dev)
  return clean(window.location.origin);
}
