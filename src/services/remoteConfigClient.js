// src/services/remoteConfigClient.js ✅ FULL DROP-IN (GitHub Pages-safe)
// - Uses VITE_REMOTE_CONFIG_URL if provided, else S3 default
// - ✅ On GitHub Pages: skips remote fetch and falls back to last-known config (or minimal empty config)
// - Prevents “Loading indiVerse… Failed to fetch” on gh-pages
// - Re-exports getProfileByKey for convenience

import { setRemoteConfig, getProfileByKey } from "./profileRegistry";

/* -------------------- GitHub Pages detection -------------------- */
const IS_GITHUB_PAGES =
  typeof window !== "undefined" &&
  window.location.hostname.includes("github.io");

/* -------------------- Remote config URL -------------------- */
const DEFAULT_REMOTE_CONFIG_URL =
  import.meta.env.VITE_REMOTE_CONFIG_URL ||
  "https://montech-remote-config.s3.amazonaws.com/superapp/config.json";

let _bootPromise = null;

/* -------------------- Optional: local fallback cache -------------------- */
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

/* -------------------- Fetch remote config -------------------- */
async function fetchRemoteConfig({ url = DEFAULT_REMOTE_CONFIG_URL, timeoutMs = 9000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { cache: "no-store", signal: ctrl.signal });
    if (!res.ok) throw new Error(`remote config fetch failed: ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

/* -------------------- Boot once at app start -------------------- */
export function bootRemoteConfigOnce() {
  if (_bootPromise) return _bootPromise;

  _bootPromise = (async () => {
    // ✅ GitHub Pages: avoid network fetch so the site always loads
    if (IS_GITHUB_PAGES) {
      const cached = readCachedConfig();

      const fallback =
        cached ||
        {
          version: "gh-pages-fallback",
          mode: "local",
          profiles: [],
        };

      setRemoteConfig(fallback);

      console.log("✅ bootRemoteConfigOnce (GH Pages): using fallback", {
        fromCache: !!cached,
        version: fallback?.version,
        mode: fallback?.mode,
        profileKeys: (fallback?.profiles || []).map((p) => p?.key).filter(Boolean),
      });

      return fallback;
    }

    // ✅ Normal mode: fetch from remote URL
    const cfg = await fetchRemoteConfig();
    setRemoteConfig(cfg);
    writeCachedConfig(cfg);

    console.log("✅ bootRemoteConfigOnce: loaded", {
      url: DEFAULT_REMOTE_CONFIG_URL,
      version: cfg?.version,
      mode: cfg?.mode,
      profileKeys: (cfg?.profiles || []).map((p) => p?.key).filter(Boolean),
    });

    return cfg;
  })().catch((e) => {
    console.log("❌ bootRemoteConfigOnce failed:", e?.message || e);
    _bootPromise = null;
    throw e;
  });

  return _bootPromise;
}

// ✅ IMPORTANT: re-export so pages can import from remoteConfigClient
export { getProfileByKey };
