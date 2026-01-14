// src/services/remoteConfigClient.js ✅ FULL DROP-IN
import { setRemoteConfig, getProfileByKey } from "./profileRegistry";

const DEFAULT_REMOTE_CONFIG_URL =
  import.meta.env.VITE_REMOTE_CONFIG_URL ||
  "https://montech-remote-config.s3.amazonaws.com/superapp/config.json";

let _bootPromise = null;

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

// ✅ call once at app start (safe to call multiple times)
export function bootRemoteConfigOnce() {
  if (_bootPromise) return _bootPromise;

  _bootPromise = (async () => {
    const cfg = await fetchRemoteConfig();
    setRemoteConfig(cfg);
    console.log("✅ bootRemoteConfigOnce: loaded", {
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
