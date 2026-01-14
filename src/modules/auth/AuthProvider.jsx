// src/modules/auth/AuthProvider.jsx ✅ FULL DROP-IN (WEB)
// Mirrors mobile API:
// - { booting, token, user, isAuthed, login, logout, signIn, signOut, fetchMe }
// Uses localStorage via authStorage.js
//
// NOTE: getApiBaseUrl(profileKey) must exist in web repo.
// If your web uses a single base URL, you can replace getApiBaseUrl with env var.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getApiBaseUrl } from "../../config/apiBase";
import { clearAuth, getCachedUser, getToken, setCachedUser, setToken } from "./authStorage";

const AuthContext = createContext(null);

function normalizeUser(u) {
  if (!u) return null;
  return {
    id: u.id || u._id || null,
    email: u.email || "",
    firstName: u.firstName || "",
    lastName: u.lastName || "",
  };
}

function pickToken(json) {
  return json?.token || json?.accessToken || json?.jwt || null;
}

function cleanBaseUrl(baseUrl) {
  return String(baseUrl || "").replace(/\/+$/, "");
}

export function AuthProvider({ children }) {
  const [booting, setBooting] = useState(true);
  const [token, setTokenState] = useState(null);
  const [user, setUser] = useState(null);

  // load cached auth on app start
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const t = await getToken();
        const u = await getCachedUser();
        if (!cancelled) {
          setTokenState(t || null);
          setUser(normalizeUser(u));
        }
      } finally {
        if (!cancelled) setBooting(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isAuthed = !!token;

  /**
   * fetchMe (optional / future-safe)
   * - uses existing token
   * - refreshes cached user
   */
  const fetchMe = useCallback(async ({ profileKey } = {}) => {
    const baseUrl = await getApiBaseUrl(profileKey || "lamont");
    const api = cleanBaseUrl(baseUrl);

    const t = await getToken();
    if (!t) return null;

    const res = await fetch(`${api}/api/auth/me`, {
      headers: { Authorization: `Bearer ${t}` },
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || json.message || "Failed to load me");

    const normalized = normalizeUser(json.user || json.me || json.data?.user);
    await setCachedUser(normalized);
    setUser(normalized);

    return normalized;
  }, []);

  /**
   * ✅ GLOBAL BUYER LOGIN
   * Backwards compat:
   * - accepts { email, password, profileKey } but profileKey is OPTIONAL
   */
  const login = useCallback(async ({ email, password, profileKey } = {}) => {
    const baseUrl = await getApiBaseUrl(profileKey || "lamont");
    const api = cleanBaseUrl(baseUrl);

    const e = String(email || "").trim().toLowerCase();
    const p = String(password || "").trim();

    if (!e || !p) throw new Error("Missing email or password");

    const res = await fetch(`${api}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: e, password: p }),
    });

    const json = await res.json().catch(() => ({}));

    const t = pickToken(json);
    if (!res.ok || !t) {
      throw new Error(json.error || json.message || "Login failed");
    }

    const normalizedUser = normalizeUser(json.user || json.me || json.data?.user);

    await setToken(t);
    await setCachedUser(normalizedUser);

    setTokenState(t);
    setUser(normalizedUser);

    return normalizedUser;
  }, []);

  const logout = useCallback(async () => {
    await clearAuth();
    setTokenState(null);
    setUser(null);
  }, []);

  // ✅ Preferred aliases
  const signIn = useCallback(async ({ email, password } = {}) => login({ email, password }), [login]);
  const signOut = useCallback(async () => logout(), [logout]);

  const value = useMemo(
    () => ({
      booting,
      token,
      user,
      isAuthed,
      login,
      logout,
      signIn,
      signOut,
      fetchMe,
    }),
    [booting, token, user, isAuthed, login, logout, signIn, signOut, fetchMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
