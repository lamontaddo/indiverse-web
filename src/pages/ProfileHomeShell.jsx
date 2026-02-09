// src/pages/ProfileHomeShell.jsx ✅ FULL DROP-IN (Web)
// - Fullscreen blurred bg layer + centered circular portal
// - Portal subtle pulse/glow
// - ENTER animates "through" portal (portal expands + brightens) then routes
// - Shows profile label under portal
// - Mobile tuned
// - Uses remote config: profile.assets.bgVideoUrl -> iconUrl

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DEFAULT_REMOTE_CONFIG_URL =
  import.meta.env.VITE_REMOTE_CONFIG_URL ||
  'https://montech-remote-config.s3.amazonaws.com/superapp/config.json';

function isHttpUrl(s) {
  return typeof s === 'string' && /^https?:\/\//i.test(s);
}
function isVideoUrl(url) {
  const u = String(url || '').toLowerCase().split('?')[0];
  return u.endsWith('.mp4') || u.endsWith('.mov') || u.endsWith('.m4v') || u.endsWith('.webm');
}
function isImageUrl(url) {
  const u = String(url || '').toLowerCase().split('?')[0];
  return u.endsWith('.jpg') || u.endsWith('.jpeg') || u.endsWith('.png') || u.endsWith('.webp');
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

export default function ProfileHomeShell() {
  const navigate = useNavigate();
  const { profileKey: rawKey } = useParams();
  const profileKey = rawKey || 'lamont';

  const [cfg, setCfg] = useState(null);
  const [loading, setLoading] = useState(true);

  const [entered, setEntered] = useState(false);

  // enter layer fade
  const [enterOpacity, setEnterOpacity] = useState(0);

  // portal enter animation
  const [portalEntering, setPortalEntering] = useState(false);

  const isAnimatingOut = useRef(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchRemoteConfig()
      .then((data) => {
        if (!alive) return;
        setCfg(data);
      })
      .catch((e) => console.log('❌ remote config failed:', e?.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const profile = useMemo(() => getProfileByKeyFromCfg(cfg, profileKey), [cfg, profileKey]);

  const displayLabel = useMemo(() => {
    const raw = profile?.worldTitle || profile?.brandTopTitle || profile?.label || profile?.key || profileKey;
    return String(raw || '').trim() || profileKey;
  }, [profile, profileKey]);

  // bg selection: bgVideoUrl -> iconUrl -> null
  const bgUrl = useMemo(() => {
    const u1 = profile?.assets?.bgVideoUrl;
    const u2 = profile?.assets?.iconUrl;
    if (isHttpUrl(u1)) return u1;
    if (isHttpUrl(u2)) return u2;
    return null;
  }, [profile]);

  const bgType = useMemo(() => {
    if (!bgUrl) return 'none';
    if (isVideoUrl(bgUrl)) return 'video';
    if (isImageUrl(bgUrl)) return 'image';
    return 'none';
  }, [bgUrl]);

  // reset per profile change
  useEffect(() => {
    setEntered(false);
    setPortalEntering(false);
    isAnimatingOut.current = false;

    setEnterOpacity(0);
    const id = setTimeout(() => setEnterOpacity(1), 60);
    return () => clearTimeout(id);
  }, [profileKey]);

  const goBackToIndiverse = () => navigate('/');

  const handleEnterPress = () => {
    if (isAnimatingOut.current) return;
    isAnimatingOut.current = true;

    // fade out enter UI
    setEnterOpacity(0);

    // start portal "go through" animation
    setPortalEntering(true);

    // route after the animation completes
    setTimeout(() => {
      setEntered(true);
      navigate(`/universe/${encodeURIComponent(profileKey)}`);
    }, 820);
  };

  // fallback if profile missing
  if (!loading && !profile) {
    return (
      <div className="ph-root">
        <div className="ph-bgFallback" />
        <div className="ph-topBar">
          <button className="ph-topBtn" onClick={goBackToIndiverse}>
            <span aria-hidden>🪐</span>
            <span>indiVerse</span>
          </button>
        </div>
        <div className="ph-center">
          <div style={{ opacity: 0.85 }}>Profile not found: {profileKey}</div>
        </div>
        <StyleTag />
      </div>
    );
  }

  return (
    <div className="ph-root">
      {/* ✅ FULLSCREEN BLUR BACKGROUND */}
      {bgType === 'video' ? (
        <video className="ph-bgBlur" src={bgUrl} muted loop autoPlay playsInline preload="metadata" />
      ) : bgType === 'image' ? (
        <img className="ph-bgBlur" src={bgUrl} alt="" />
      ) : (
        <div className="ph-bgFallback" />
      )}

      {/* ✅ CENTER PORTAL */}
      {bgType !== 'none' && (
        <div className="ph-portalWrap" aria-hidden>
          <div className={`ph-portalRing ${portalEntering ? 'ph-portalEntering' : ''}`}>
            {bgType === 'video' ? (
              <video className="ph-portalMedia" src={bgUrl} muted loop autoPlay playsInline preload="metadata" />
            ) : (
              <img className="ph-portalMedia" src={bgUrl} alt="" />
            )}
          </div>

          {/* profile label under portal */}
          <div className={`ph-profileLabel ${portalEntering ? 'ph-profileLabelEntering' : ''}`}>
            {displayLabel}
          </div>
        </div>
      )}

      {/* overlay */}
      <div className={`ph-overlay ${portalEntering ? 'ph-overlayEntering' : ''}`} />

      {/* top bar */}
      <div className="ph-topBar">
        <button className="ph-topBtn" onClick={goBackToIndiverse}>
          <span aria-hidden>🪐</span>
          <span>indiVerse</span>
        </button>
      </div>

      {/* enter layer */}
      {!entered && (
        <div
          className="ph-enterLayer"
          style={{
            opacity: enterOpacity,
            transition: 'opacity 900ms ease',
          }}
        >
          <div className="ph-enterButtonWrapper">
            <button className="ph-enterButton" onClick={handleEnterPress}>
              <span className="ph-enterText">ENTER</span>
            </button>
          </div>
        </div>
      )}

      <StyleTag />
    </div>
  );
}

function StyleTag() {
  return (
    <style>{`
      .ph-root{
        min-height: 100vh;
        background:#000;
        color:#fff;
        overflow:hidden;
        position:relative;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
      }

      /* ✅ FULLSCREEN BLUR BACKGROUND */
      .ph-bgBlur{
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 0;
        filter: blur(28px) saturate(1.08);
        transform: scale(1.12);
        opacity: 0.78;
        background: #000;
      }

      .ph-bgFallback{
        position: fixed;
        inset: 0;
        z-index: 0;
        background: #000;
      }

      /* ✅ PORTAL */
      .ph-portalWrap{
        position: fixed;
        inset: 0;
        z-index: 1;
        display:flex;
        flex-direction: column;
        align-items:center;
        justify-content:center;
        gap: 14px;
        pointer-events:none;
        padding: 18px;
      }

      .ph-portalRing{
        width: min(78vw, 560px);
        height: min(78vw, 560px);
        border-radius: 50%;
        padding: 6px;
        overflow:hidden;

        background: radial-gradient(
          circle at 30% 20%,
          rgba(255,255,255,0.20),
          rgba(255,255,255,0.05) 35%,
          rgba(0,0,0,0.0) 70%
        );

        border: 1px solid rgba(255,255,255,0.16);
        box-shadow:
          0 24px 60px rgba(0,0,0,0.55),
          0 0 40px rgba(0,255,255,0.10),
          inset 0 0 22px rgba(255,255,255,0.10);

        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);

        /* ✅ subtle pulse */
        animation: phPulse 7.5s ease-in-out infinite;
        transform: translateZ(0);
      }

      @keyframes phPulse{
        0%   { transform: scale(1); }
        50%  { transform: scale(1.014); }
        100% { transform: scale(1); }
      }

      .ph-portalMedia{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
        display:block;
        background:#000;
      }

      /* ENTER "go through portal" */
      .ph-portalEntering{
        animation: none;
        transition: transform 820ms cubic-bezier(0.22, 1, 0.36, 1), filter 820ms cubic-bezier(0.22, 1, 0.36, 1);
        transform: scale(1.22);
        filter: brightness(1.18) saturate(1.1);
      }

      .ph-profileLabel{
        text-align: center;
        font-weight: 800;
        letter-spacing: 3px;
        text-transform: uppercase;
        font-size: 12px;
        color: rgba(229,231,235,0.88);
        text-shadow: 0 8px 24px rgba(0,0,0,0.6);
        user-select: none;
      }

      .ph-profileLabelEntering{
        transition: opacity 520ms ease;
        opacity: 0.0;
      }

      /* overlay */
      .ph-overlay{
        position: fixed;
        inset: 0;
        z-index: 2;
        background: linear-gradient(to bottom, rgba(0,0,0,0.18), rgba(0,0,0,0.86));
        transition: opacity 820ms ease;
        opacity: 1;
      }

      .ph-overlayEntering{
        opacity: 0.82;
      }

      /* top bar */
      .ph-topBar{
        position: fixed;
        top: 16px;
        left: 16px;
        right: 16px;
        z-index: 6;
        display:flex;
        justify-content: space-between;
        pointer-events: none;
      }

      .ph-topBtn{
        pointer-events: auto;
        display:flex;
        align-items:center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 999px;
        background: rgba(15,23,42,0.55);
        border: 1px solid rgba(148,163,184,0.35);
        color: #e5e7eb;
        cursor: pointer;
      }

      /* enter UI */
      .ph-enterLayer{
        position: relative;
        z-index: 5;
        min-height: 100vh;
        padding-top: 120px;
        padding-left: 20px;
        padding-right: 20px;
      }

      .ph-enterButtonWrapper{
        min-height: calc(100vh - 120px);
        display:flex;
        align-items:flex-end;
        justify-content:center;
        padding-bottom: 62px;
      }

      .ph-enterButton{
        width: 220px;
        border-radius: 999px;
        border: 1px solid rgba(148,163,184,0.35);
        background: rgba(2,6,23,0.55);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        padding: 16px 0;
        cursor:pointer;
        box-shadow: 0 18px 30px rgba(0,0,0,0.45);
        transition: transform 120ms ease, opacity 120ms ease, border-color 120ms ease;
      }

      .ph-enterButton:hover{
        border-color: rgba(0,255,255,0.35);
      }

      .ph-enterButton:active{
        transform: scale(0.98);
        opacity: 0.95;
      }

      .ph-enterText{
        display:block;
        text-align:center;
        color:#fff;
        font-weight: 800;
        font-size: 18px;
        letter-spacing: 1px;
      }

      .ph-center{
        position: relative;
        z-index: 5;
        min-height: 100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        padding: 24px;
      }

      /* mobile tuning */
      @media (max-width: 420px){
        .ph-portalRing{
          width: min(86vw, 520px);
          height: min(86vw, 520px);
        }
        .ph-enterButtonWrapper{ padding-bottom: 50px; }
      }

      /* reduce motion */
      @media (prefers-reduced-motion: reduce){
        .ph-portalRing{ animation: none; }
        .ph-portalEntering{ transition: none; transform: none; filter: none; }
        .ph-overlay{ transition: none; }
      }
    `}</style>
  );
}
