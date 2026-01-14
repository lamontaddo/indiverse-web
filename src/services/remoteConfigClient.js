// src/services/remoteConfigClient.js ✅ FULL DROP-IN (GH Pages robust)
// - Still tries remote fetch on GitHub Pages (works if S3 CORS allows)
// - If fetch fails: falls back to last-known config (localStorage)
// - If no cache: uses minimal config so app doesn't crash
// - Re-exports getProfileByKey for convenience

import { setRemoteConfig, getProfileByKey } from "./profileRegistry";

/* -------------------- GitHub Pages detection -------------------- */
const IS_GITHUB_PAGES =
  typeof window !== "undefined" &&
  String(window.location?.hostname || "").includes("github.io");

/* -------------------- Remote config URL -------------------- */
const DEFAULT_REMOTE_CONFIG_URL =
  import.meta.env.VITE_REMOTE_CONFIG_URL ||
  "https://montech-remote-config.s3.amazonaws.com/superapp/config.json";

let _bootPromise = null;

/* -------------------- Local fallback cache -------------------- */
const LS_KEY = "indiverse:remoteConfig:lastGood";

function readCachedConfig() {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function writeCachedConfig(cfg) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LS_KEY, JSON.stringify(cfg));
  } catch {}
}

/* -------------------- Fetch helpers -------------------- */
async function safeReadText(res) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

async function fetchRemoteConfig({ url = DEFAULT_REMOTE_CONFIG_URL, timeoutMs = 12000 } = {}) {
  const finalUrl = String(url || "").trim();
  if (!finalUrl) throw new Error("remote config url missing");

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);

  console.log("[remoteConfig] fetch start", { finalUrl, IS_GITHUB_PAGES });

  try {
    const res = await fetch(finalUrl, {
      signal: ctrl.signal,
      // NOTE: `no-store` can be flaky on some setups; default is safest for GH Pages
      // cache: "no-store",
    });

    if (!res.ok) {
      const body = await safeReadText(res);
      throw new Error(
        `remote config fetch failed: ${res.status}${body ? ` | ${body.slice(0, 160)}` : ""}`
      );
    }

    const json = await res.json();
    return json;
  } catch (e) {
    // AbortError, TypeError (CORS), etc.
    throw new Error(e?.message || String(e));
  } finally {
    clearTimeout(t);
  }
}

/* -------------------- Boot once at app start -------------------- */
export function bootRemoteConfigOnce() {
  if (_bootPromise) return _bootPromise;

  _bootPromise = (async () => {
    // 1) Always try remote first (even on GH Pages)
    try {
      const cfg = await fetchRemoteConfig();
      setRemoteConfig(cfg);
      writeCachedConfig(cfg);

      console.log("✅ bootRemoteConfigOnce: loaded remote", {
        url: DEFAULT_REMOTE_CONFIG_URL,
        version: cfg?.version,
        mode: cfg?.mode,
        profileKeys: (cfg?.profiles || []).map((p) => p?.key).filter(Boolean),
      });

      return cfg;
    } catch (err) {
      console.log("⚠️ remote config fetch failed, falling back", {
        message: err?.message || err,
        IS_GITHUB_PAGES,
      });
    }

    // 2) Fall back to last cached config (works great on GH Pages)
    const cached = readCachedConfig();
    if (cached) {
      setRemoteConfig(cached);

      console.log("✅ bootRemoteConfigOnce: using cached config", {
        version: cached?.version,
        mode: cached?.mode,
        profileKeys: (cached?.profiles || []).map((p) => p?.key).filter(Boolean),
      });

      return cached;
    }

    // 3) Last resort: minimal config (site still loads, but no profiles)
    const fallback = {
      version: "fallback-empty",
      mode: "local",
      profiles: [],
    };

    setRemoteConfig(fallback);

    console.log("✅ bootRemoteConfigOnce: using minimal fallback", fallback);

    return fallback;
  })().catch((e) => {
    console.log("❌ bootRemoteConfigOnce failed hard:", e?.message || e);
    _bootPromise = null;
    throw e;
  });

  return _bootPromise;
}

// ✅ IMPORTANT: re-export so pages can import from remoteConfigClient
export { getProfileByKey };
