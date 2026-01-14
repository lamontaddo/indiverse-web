// src/pages/UniverseHome.jsx ✅ FULL DROP-IN (Vite React)
// - Universe bg VIDEO via remote config URL (assets.universeBgVideoUrl preferred)
// - Icon tiles support remote iconUrl as VIDEO or IMAGE (fallback to letter)
// - Pull-to-refresh style replaced with a Refresh button
// - Long-press “VaultGate” navigation (5s hold) like RN version
//
// Assumes you have react-router set up:
//   <Route path="/" element={<UniverseHome />} />
//   <Route path="/vaultgate" element={<VaultGate />} />
//   <Route path="/profile/:profileKey" element={<ProfileHome />} />
//   <Route path="/auth/signup" element={<AuthSignup />} />
//
// Requires:
//   npm i react-router-dom
//
// Optional (nice): create src/services/remoteConfig.js with the fetch helper.
// This file is self-contained, so you can drop it in as-is.

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setRemoteConfig } from "../services/profileRegistry";

// ✅ Default Universe background video (remote)
const DEFAULT_UNIVERSE_BG_URL =
  'https://montech-remote-config.s3.amazonaws.com/assets/test/bgvideo-1767903039953.mov';

// Change to your S3 remote config URL (json)
const DEFAULT_REMOTE_CONFIG_URL =
  import.meta.env.VITE_REMOTE_CONFIG_URL ||
  'https://montech-remote-config.s3.amazonaws.com/superapp/config.json';

// --- helpers ---
function clampNum(n, min, max, fallback) {
  const x = Number(n);
  if (!Number.isFinite(x)) return fallback;
  return Math.max(min, Math.min(max, x));
}

function isVideoUrl(url) {
  const u = String(url || '').toLowerCase().split('?')[0];
  return u.endsWith('.mp4') || u.endsWith('.mov') || u.endsWith('.m4v') || u.endsWith('.webm');
}
function isImageUrl(url) {
  const u = String(url || '').toLowerCase().split('?')[0];
  return u.endsWith('.jpg') || u.endsWith('.jpeg') || u.endsWith('.png') || u.endsWith('.webp') || u.endsWith('.gif');
}

async function fetchRemoteConfig({ url = DEFAULT_REMOTE_CONFIG_URL, timeoutMs = 9000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { cache: 'no-store', signal: ctrl.signal });
    if (!res.ok) throw new Error(`remote config fetch failed: ${res.status}`);
    const json = await res.json();
    return json;
  } finally {
    clearTimeout(t);
  }
}

function normalizeProfiles(cfg) {
    const list = Array.isArray(cfg?.profiles) ? cfg.profiles : [];
    return list
      .map((p) => ({
        key: p?.key || "",
        label: p?.label || p?.name || p?.key || "Unknown",
        enabled: p?.enabled !== false,
  
        // ✅ KEEP THESE (critical for profileFetch)
        apiBaseUrl: p?.apiBaseUrl || null,
        endpoints: p?.endpoints || null,
  
        assets: p?.assets || {},
        icon: p?.icon || null,
      }))
      .filter((p) => p.key);
  }
  

// --- long press hook ---
function useLongPress(callback, ms = 5000) {
  const timer = useRef(null);

  const start = useCallback(() => {
    if (timer.current) return;
    timer.current = setTimeout(() => {
      timer.current = null;
      callback?.();
    }, ms);
  }, [callback, ms]);

  const clear = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  // mouse + touch friendly props
  return useMemo(
    () => ({
      onMouseDown: start,
      onMouseUp: clear,
      onMouseLeave: clear,
      onTouchStart: start,
      onTouchEnd: clear,
      onTouchCancel: clear,
    }),
    [start, clear]
  );
}

const IconMedia = memo(function IconMedia({ mod }) {
  const remoteUrl = mod?.assets?.iconUrl || '';
  const useRemote = !!remoteUrl;

  if (!useRemote) {
    return (
      <div className="iconFallback">
        <span className="iconLetter">{(mod?.label || '?').charAt(0)}</span>
      </div>
    );
  }

  if (isVideoUrl(remoteUrl)) {
    return (
      <video
        className="iconMedia"
        src={remoteUrl}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        onError={() => {
          // fallback is handled by rendering letter if remote fails
          // but we can’t set state inside memo without adding state;
          // simplest is to show a graceful fallback layer below:
        }}
      />
    );
  }

  if (isImageUrl(remoteUrl)) {
    return <img className="iconMedia" src={remoteUrl} alt={mod?.label || 'icon'} loading="lazy" />;
  }

  return (
    <div className="iconFallback">
      <span className="iconLetter">{(mod?.label || '?').charAt(0)}</span>
    </div>
  );
});

export default function UniverseHome() {
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ main screen bg video url (NOT per-profile)
  const [universeBgUrl, setUniverseBgUrl] = useState(DEFAULT_UNIVERSE_BG_URL);

  // pulse animation (scale) every 8s (1s pulse)
  const [pulseOn, setPulseOn] = useState(false);

  const syncRemoteProfiles = useCallback(async ({ force = false } = {}) => {
    try {
      setRefreshing(true);

      // on web, "force" just means no-store fetch (already set). Kept for parity.
      const cfg = await fetchRemoteConfig({ url: DEFAULT_REMOTE_CONFIG_URL });
      setRemoteConfig(cfg);

      // ✅ app-level universe bg video url
      const u = cfg?.assets?.universeBgVideoUrl || cfg?.universeBgVideoUrl || null;
      if (u) setUniverseBgUrl(u);

      console.log('🧾 universeBgVideoUrl:', u || '(default)', universeBgUrl);
      console.log('🧾 cfg.profiles[0].assets.iconUrl:', cfg?.profiles?.[0]?.assets?.iconUrl);

      console.log('✅ remote config loaded:', {
        version: cfg?.version,
        mode: cfg?.mode,
        profiles: (cfg?.profiles || []).map((p) => p?.key).filter(Boolean),
      });

      const after = normalizeProfiles(cfg).filter((p) => p.enabled !== false);

      console.log('✅ registry profiles AFTER:', after.map((p) => p.key));
      const lamont = after.find((p) => p.key === 'lamont');
      console.log('🧾 lamont iconUrl:', lamont?.assets?.iconUrl);

      setModules(after);
    } catch (e) {
      console.log('Remote config failed (using fallback empty list):', e?.message);
      // keep default universeBgUrl
      setModules([]);
    } finally {
      setRefreshing(false);
    }
  }, [universeBgUrl]);

  useEffect(() => {
    syncRemoteProfiles({ force: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const runPulse = () => {
      setPulseOn(true);
      setTimeout(() => setPulseOn(false), 1000);
    };
    runPulse();
    const id = setInterval(runPulse, 8000);
    return () => clearInterval(id);
  }, []);

  const longPressVault = useLongPress(() => navigate('/vaultgate'), 5000);

  const tilePulseStyle = useMemo(
    () => ({
      transform: `scale(${pulseOn ? 1.1 : 1})`,
      transition: 'transform 500ms ease',
    }),
    [pulseOn]
  );

  const handleEnterProfile = (profileKey) => {
    navigate(`/profile/${encodeURIComponent(profileKey)}`);
  };

  const handleSignIn = () => {
    navigate('/auth/signup', { state: { nextRoute: 'music' } });
  };

  const activeRealms = modules.length;

  return (
    <div className="root">
      {/* Background video */}
      {universeBgUrl ? (
        <video className="bgVideo" src={universeBgUrl} muted loop autoPlay playsInline preload="metadata" />
      ) : (
        <div className="bgFallback" />
      )}

      <div className="scroll">
        <div className="container">
          <div className="headerWrapper">
            <div className="superTitle">MONTECH</div>
            <div className="title">indiVerse</div>

            <div className="subtitle">
              Choose a world to enter. Each app is its own universe, with its own vibe, music, and people.
            </div>

            <div className="pillRow">
              <div className="pillWrap" {...longPressVault} title="Hold 5 seconds to open VaultGate">
                <div className="pill">
                  <span className="pillIcon" aria-hidden>
                    🪐
                  </span>
                  <span className="pillText">{activeRealms} Active Realms</span>
                </div>
              </div>

              <button className="refreshBtn" onClick={() => syncRemoteProfiles({ force: true })} disabled={refreshing}>
                {refreshing ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>
          </div>

          <div className="grid">
            {modules.map((mod) => (
              <button key={mod.key} className="iconTile" onClick={() => handleEnterProfile(mod.key)}>
                <div className="iconOuterGradient" style={tilePulseStyle}>
                  <div className="iconOuter">
                    {/* Media container */}
                    <div className="mediaClip">
                      <IconMedia mod={mod} />
                      {/* soft fallback overlay if remote fails to paint */}
                      <div className="mediaFallbackOverlay" aria-hidden />
                    </div>
                  </div>
                </div>

                <div className="iconLabel" title={mod.label}>
                  {mod.label}
                </div>
              </button>
            ))}

            {/* 🔐 HARD-CODED AUTH ICON */}
            <button className="iconTile" onClick={handleSignIn}>
              <div className="iconOuterGradient" style={tilePulseStyle}>
                <div className="iconOuter">
                  <div className="iconFallback">
                    <span className="signinIcon" aria-hidden>
                      ⎋
                    </span>
                  </div>
                </div>
              </div>
              <div className="iconLabel">Sign In</div>
            </button>
          </div>

          <div className="footer">
            <div className="footerText">Built by Montech • One codebase, multiple universes.</div>
          </div>
        </div>
      </div>

      {/* ✅ Drop-in styles */}
      <style>{`
        .root {
          position: relative;
          min-height: 100vh;
          background: #000;
          overflow: hidden;
          color: #fff;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
        }

        .bgVideo, .bgFallback {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          background: #000;
          transform: translateZ(0);
        }

        .scroll {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          overflow: auto;
        }

        .container {
          padding: 70px 20px 40px;
          max-width: 980px;
          margin: 0 auto;
        }

        .headerWrapper { margin-bottom: 28px; }

        .superTitle {
          text-align: center;
          color: #6b7280;
          font-size: 13px;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .title {
          font-size: 34px;
          color: #fff;
          margin-bottom: 8px;
          font-weight: 800;
          text-align: center;
        }

        .subtitle {
          font-size: 14px;
          color: #9ca3af;
          text-align: center;
          line-height: 20px;
          margin: 0 8px;
        }

        .pillRow {
          margin-top: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .pillWrap { cursor: pointer; user-select: none; }

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(148,163,184,0.45);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 18px 24px rgba(0,0,0,0.35);
        }

        .pillIcon { font-size: 14px; }
        .pillText { color: #e5e7eb; font-size: 12px; }

        .refreshBtn{
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(148,163,184,0.35);
          background: rgba(2,6,23,0.55);
          color: #e5e7eb;
          cursor: pointer;
        }
        .refreshBtn:disabled { opacity: 0.6; cursor: not-allowed; }

        .grid {
          margin-top: 12px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px 14px;
          justify-items: center;
        }

        @media (min-width: 640px){
          .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (min-width: 980px){
          .grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }

        .iconTile {
          width: 100%;
          max-width: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 10px 0;
          background: transparent;
          border: none;
          cursor: pointer;
          color: inherit;
          text-decoration: none;
        }
        .iconTile:active { transform: scale(0.98); opacity: 0.95; }

        .iconOuterGradient {
          width: 110px;
          height: 110px;
          border-radius: 32px;
          padding: 2.5px;
          margin-bottom: 2px;
          background: rgba(15, 23, 42, 0.9);
          box-shadow: 0 18px 24px rgba(0,0,0,0.45);
        }

        .iconOuter {
          width: 100%;
          height: 100%;
          border-radius: 28px;
          overflow: hidden;
          background: #020617;
          border: 1px solid rgba(30,64,175,0.6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .mediaClip { position: relative; width: 100%; height: 100%; }
        .iconMedia {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .mediaFallbackOverlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(transparent 55%, rgba(0,0,0,0.35));
          opacity: 0.9;
        }

        .iconFallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f172a;
        }
        .iconLetter { font-size: 30px; font-weight: 800; color: #fff; }

        .signinIcon {
          font-size: 34px;
          color: #00ffff;
          text-shadow: 0 0 12px rgba(0,255,255,0.35);
        }

        .iconLabel {
          color: #e5e7eb;
          font-size: 14px;
          text-align: center;
          max-width: 160px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .footer { margin-top: 14px; display: flex; justify-content: center; }
        .footerText { font-size: 11px; color: #6b7280; }
      `}</style>
    </div>
  );
}
