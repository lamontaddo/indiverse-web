// src/pages/UniverseScreen.jsx ✅ FULL DROP-IN (Web)
// Route: /universe/:profileKey
// - Pulls profile intro bg from remote config (assets.introBgImageUrl)
// - Intro animation: dim -> title -> subtitle -> breathe -> fade out
// - Floating blobs (CSS)
// - After intro, saves profileKey to localStorage and navigates to /world/:profileKey

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DEFAULT_REMOTE_CONFIG_URL =
  import.meta.env.VITE_REMOTE_CONFIG_URL ||
  'https://montech-remote-config.s3.amazonaws.com/superapp/config.json';

const TIMINGS = {
  bgFade: 700,
  titleIn: 1200,
  subIn: 900,
  breatheUp: 350,
  breatheDown: 350,
  sceneFadeOut: 650,
};

function isHttpUrl(s) {
  return typeof s === 'string' && /^https?:\/\//i.test(s);
}

async function fetchRemoteConfig({ url = DEFAULT_REMOTE_CONFIG_URL, timeoutMs = 9000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { cache: 'no-store', signal: ctrl.signal });
    if (!res.ok) throw new Error(`remote config fetch failed: ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

function getProfileByKeyFromCfg(cfg, key) {
  const list = Array.isArray(cfg?.profiles) ? cfg.profiles : [];
  return list.find((p) => String(p?.key || '').trim() === String(key || '').trim()) || null;
}

function pickIntroBgUrl(profile) {
  const remote = profile?.assets?.introBgImageUrl;
  if (isHttpUrl(remote)) return remote;

  // fallback: iconUrl if it’s an image
  const icon = profile?.assets?.iconUrl;
  if (isHttpUrl(icon)) return icon;

  // last resort: nothing
  return null;
}

export default function UniverseScreen() {
  const navigate = useNavigate();
  const { profileKey: rawKey } = useParams();
  const profileKey = rawKey || 'lamont';

  const [cfg, setCfg] = useState(null);
  const [loading, setLoading] = useState(true);

  const rootRef = useRef(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchRemoteConfig()
      .then((data) => alive && setCfg(data))
      .catch((e) => console.log('❌ remote config failed:', e?.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const profile = useMemo(() => getProfileByKeyFromCfg(cfg, profileKey), [cfg, profileKey]);

  const bgUrl = useMemo(() => pickIntroBgUrl(profile), [profile]);
  const titleText = profile?.introTitle || 'Welcome to my universe.';
  const subText = profile?.introSubtitle || 'I am ineffible.';

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    // reset animation by toggling class
    el.classList.remove('us-animate');
    // force reflow
    void el.offsetHeight;
    el.classList.add('us-animate');

    const total =
      TIMINGS.bgFade +
      TIMINGS.titleIn +
      TIMINGS.subIn +
      TIMINGS.breatheUp +
      TIMINGS.breatheDown +
      TIMINGS.sceneFadeOut;

    const id = setTimeout(() => {
      try {
        localStorage.setItem('profileKey', profileKey);
      } catch {}
      // next screen (stub for now)
      navigate(`/world/${encodeURIComponent(profileKey)}`);
    }, total + 40);

    return () => clearTimeout(id);
  }, [navigate, profileKey, titleText, subText, bgUrl]);

  if (!loading && !profile) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'grid', placeItems: 'center' }}>
        <div style={{ opacity: 0.85 }}>Profile not found: {profileKey}</div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="us-root">
      <div className="us-bg" style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined} />
      <div className="us-dim" />

      {/* floating blobs */}
      <div className="us-blob us-blobA" />
      <div className="us-blob us-blobB" />
      <div className="us-blob us-blobC" />

      <div className="us-center">
        <div className="us-title">{titleText}</div>
        <div className="us-sub">{subText}</div>
      </div>

      <style>{`
        .us-root{
          min-height: 100vh;
          background:#000;
          color:#fff;
          overflow:hidden;
          position:relative;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
          opacity: 1;
        }

        .us-bg{
          position: fixed;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          filter: none;
          z-index: 0;
          transform: translateZ(0);
        }

        .us-dim{
          position: fixed;
          inset: 0;
          z-index: 1;
          opacity: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.18), rgba(0,0,0,0.58), rgba(0,0,0,0.75));
        }

        .us-center{
          position: relative;
          z-index: 3;
          min-height: 100vh;
          display:flex;
          flex-direction: column;
          align-items:center;
          justify-content:center;
          padding: 0 24px;
          text-align:center;
        }

        .us-title{
          font-size: 28px;
          font-weight: 800;
          opacity: 0;
          transform: scale(0.985);
        }

        .us-sub{
          margin-top: 12px;
          color: #c9c9d4;
          font-size: 16px;
          opacity: 0;
          transform: translateY(6px);
        }

        /* blobs */
        .us-blob{
          position: fixed;
          border-radius: 999px;
          z-index: 2;
          filter: blur(0px);
          opacity: 0.22;
          pointer-events:none;
        }

        .us-blobA{
          width: 300px; height: 300px;
          top: -110px; left: -70px;
          background: radial-gradient(circle at 30% 20%, rgba(124,58,237,0.30), rgba(34,211,238,0.18));
          animation: blobFloatA 11s ease-in-out infinite;
        }

        .us-blobB{
          width: 220px; height: 220px;
          bottom: -90px; right: -30px;
          background: radial-gradient(circle at 30% 20%, rgba(34,211,238,0.22), rgba(124,58,237,0.14));
          opacity: 0.20;
          animation: blobFloatB 9.5s ease-in-out infinite;
        }

        .us-blobC{
          width: 200px; height: 200px;
          top: 160px; left: 58vw;
          background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.10), rgba(124,58,237,0.10));
          opacity: 0.18;
          animation: blobFloatC 12s ease-in-out infinite;
        }

        @keyframes blobFloatA{
          0%{ transform: translate(0,0) scale(1); }
          50%{ transform: translate(10px,-18px) scale(1.02); }
          100%{ transform: translate(0,0) scale(1); }
        }
        @keyframes blobFloatB{
          0%{ transform: translate(0,0) scale(1); }
          50%{ transform: translate(-10px,-14px) scale(1.02); }
          100%{ transform: translate(0,0) scale(1); }
        }
        @keyframes blobFloatC{
          0%{ transform: translate(0,0) scale(1); }
          50%{ transform: translate(8px,-10px) scale(1.02); }
          100%{ transform: translate(0,0) scale(1); }
        }

        /* Animation sequence driven by CSS delays */
        .us-root.us-animate .us-dim{
          animation: usDimIn ${TIMINGS.bgFade}ms cubic-bezier(0.22,1,0.36,1) forwards;
        }

        .us-root.us-animate .us-title{
          animation:
            usTitleIn ${TIMINGS.titleIn}ms cubic-bezier(0.22,1,0.36,1) forwards ${TIMINGS.bgFade}ms,
            usBreatheUp ${TIMINGS.breatheUp}ms cubic-bezier(0.22,1,0.36,1) forwards ${TIMINGS.bgFade + TIMINGS.titleIn + TIMINGS.subIn}ms,
            usBreatheDown ${TIMINGS.breatheDown}ms cubic-bezier(0.22,1,0.36,1) forwards ${TIMINGS.bgFade + TIMINGS.titleIn + TIMINGS.subIn + TIMINGS.breatheUp}ms;
        }

        .us-root.us-animate .us-sub{
          animation: usSubIn ${TIMINGS.subIn}ms cubic-bezier(0.22,1,0.36,1) forwards ${TIMINGS.bgFade + TIMINGS.titleIn}ms;
        }

        .us-root.us-animate{
          animation: usSceneOut ${TIMINGS.sceneFadeOut}ms ease-in-out forwards ${TIMINGS.bgFade + TIMINGS.titleIn + TIMINGS.subIn + TIMINGS.breatheUp + TIMINGS.breatheDown}ms;
        }

        @keyframes usDimIn{
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes usTitleIn{
          from { opacity: 0; transform: scale(0.985); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes usSubIn{
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0px); }
        }
        @keyframes usBreatheUp{
          from { transform: scale(1); }
          to   { transform: scale(1.01); }
        }
        @keyframes usBreatheDown{
          from { transform: scale(1.01); }
          to   { transform: scale(1); }
        }
        @keyframes usSceneOut{
          from { opacity: 1; }
          to   { opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce){
          .us-root.us-animate .us-dim,
          .us-root.us-animate .us-title,
          .us-root.us-animate .us-sub,
          .us-root.us-animate{
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
