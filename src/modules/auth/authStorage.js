// src/modules/auth/authStorage.js ✅ FULL DROP-IN (WEB)
// localStorage-backed version of your mobile authStorage

const KEY_TOKEN = "auth:token";
const KEY_USER = "auth:user";

export async function getToken() {
  try {
    return localStorage.getItem(KEY_TOKEN);
  } catch {
    return null;
  }
}

export async function setToken(token) {
  try {
    if (!token) localStorage.removeItem(KEY_TOKEN);
    else localStorage.setItem(KEY_TOKEN, String(token));
  } catch {}
}

export async function getCachedUser() {
  try {
    const raw = localStorage.getItem(KEY_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function setCachedUser(user) {
  try {
    if (!user) localStorage.removeItem(KEY_USER);
    else localStorage.setItem(KEY_USER, JSON.stringify(user));
  } catch {}
}

export async function clearAuth() {
  try {
    localStorage.removeItem(KEY_TOKEN);
    localStorage.removeItem(KEY_USER);
  } catch {}
}
