// src/pages/AboutPage.jsx ✅ FULL DROP-IN (WEB) (WORLD BG INHERIT + MATCHES app.js ROUTES)
// ✅ Uses GET /api/about?ts=...
// ✅ Sends x-profile-key header
// ✅ Refetches on mount, route change, window focus, tab visibility
// ✅ Typewriter + blinking cursor
// ✅ Shows updated timestamp
// ✅ Manual refresh + Back-to-world + Close
// ✅ Inherits world background image via navigation state (state.bgUrl)

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const FALLBACK_TEXT = `
Hey — Welcome to indiVerse.

This creator hasn’t added an About section yet.
But you can still explore what’s live right now: music, products, and updates.

Want to reach them directly?
Send a message and you’ll get a response when they’re available.
`;

function cleanKey(v) {
  return String(v || '').trim().toLowerCase();
}

function resolveProfileKeyWeb(paramsProfileKey) {
  const fromParams = cleanKey(paramsProfileKey);
  if (fromParams) return fromParams;

  try {
    const saved = cleanKey(localStorage.getItem('profileKey'));
    if (saved) return saved;
  } catch {}

  return 'lamont';
}

function isLikelyHttpUrl(s) {
  return typeof s === 'string' && /^https?:\/\//i.test(s.trim());
}

async function apiJson(path, { profileKey } = {}) {
  // If web is same origin as Express, leave VITE_API_BASE_URL empty.
  // If web is separate (Vercel/Netlify), set VITE_API_BASE_URL=https://<your-backend-host>
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
  const url = `${base}${path}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(profileKey ? { 'x-profile-key': profileKey } : {}),
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GET ${path} failed (${res.status}): ${text || res.statusText}`);
  }

  return res.json();
}

export default function AboutPage() {
  const navigate = useNavigate();
  const { profileKey: paramsProfileKey } = useParams();
  const location = useLocation();

  // ✅ bgUrl inherited from MainScreen navigate state
  const navStateBgUrl = useMemo(() => {
    const v = location?.state?.bgUrl;
    const s = typeof v === 'string' ? v.trim() : '';
    return isLikelyHttpUrl(s) ? s : null;
  }, [location?.state?.bgUrl]);

  const [activeProfileKey, setActiveProfileKey] = useState(() =>
    resolveProfileKeyWeb(paramsProfileKey)
  );

  const ownerName = useMemo(() => {
    const k = activeProfileKey || 'owner';
    return k === 'lamont' ? 'Lamont' : k.charAt(0).toUpperCase() + k.slice(1);
  }, [activeProfileKey]);

  const [fullText, setFullText] = useState('');
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [errorNote, setErrorNote] = useState('');

  const scrollRef = useRef(null);
  const intervalRef = useRef(null);

  const stopTyping = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Sync key (params -> localStorage -> fallback)
  useEffect(() => {
    const key = resolveProfileKeyWeb(paramsProfileKey);
    setActiveProfileKey(key);
    try {
      localStorage.setItem('profileKey', key);
    } catch {}
  }, [paramsProfileKey]);

  const loadBio = useCallback(
    async (reason = 'load') => {
      stopTyping();
      setDone(false);
      setLoading(true);
      setErrorNote('');

      try {
        try {
          localStorage.setItem('profileKey', String(activeProfileKey));
        } catch {}

        const ts = Date.now();
        const json = await apiJson(`/api/about?ts=${ts}`, { profileKey: activeProfileKey });

        const rawBio = typeof json?.bio === 'string' ? json.bio : '';
        const updatedAt = json?.updatedAt || null;

        console.log('[AboutPage] fetched', {
          reason,
          profileKey: activeProfileKey,
          bioLen: rawBio.length,
          updatedAt,
        });

        setLastUpdated(updatedAt);
        setFullText(rawBio ? rawBio : FALLBACK_TEXT);
      } catch (err) {
        const msg = String(err?.message || '');
        console.warn('[AboutPage] load error:', msg || err);

        setLastUpdated(null);
        setFullText(FALLBACK_TEXT);

        // nicer message for common cases
        if (msg.includes('(404)')) setErrorNote('About not set yet (API 404).');
        else if (msg.includes('(401)') || msg.includes('(403)')) setErrorNote('Not authorized (profileKey/auth).');
        else setErrorNote(msg || 'Failed to load');
      } finally {
        setLoading(false);
      }
    },
    [activeProfileKey, stopTyping]
  );

  // Reload when route changes OR profileKey changes
  useEffect(() => {
    loadBio('mount/route');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, activeProfileKey]);

  // Reload on focus + tab visible
  useEffect(() => {
    const onFocus = () => loadBio('windowFocus');
    const onVis = () => {
      if (document.visibilityState === 'visible') loadBio('visibility');
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [loadBio]);

  // Typewriter
  useEffect(() => {
    if (!fullText) return;

    stopTyping();
    setDisplayed('');
    setDone(false);

    const speed = 18;
    let i = 0;

    intervalRef.current = setInterval(() => {
      i += 1;

      if (i >= fullText.length) {
        stopTyping();
        setDisplayed(fullText);
        setDone(true);
        return;
      }

      setDisplayed(fullText.slice(0, i));
    }, speed);

    return () => stopTyping();
  }, [fullText, stopTyping]);

  // Auto-scroll as text types
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const t = window.setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 30);
    return () => window.clearTimeout(t);
  }, [displayed]);

  const updatedLabel = useMemo(() => {
    if (!lastUpdated) return '';
    try {
      return new Date(lastUpdated).toLocaleString();
    } catch {
      return String(lastUpdated);
    }
  }, [lastUpdated]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBio('manualRefresh');
    setRefreshing(false);
  }, [loadBio]);

  const goBackToWorld = useCallback(() => {
    navigate(`/world/${encodeURIComponent(activeProfileKey)}`);
  }, [activeProfileKey, navigate]);

  return (
    <div className="ap-root">
      {/* ✅ Background inherited from world (if provided) */}
      <div
        className="ap-bg"
        style={
          navStateBgUrl
            ? {
                backgroundImage: `url(${navStateBgUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      />
      <div className="ap-vignette" />
      <div className="ap-noise" />

      <div className="ap-shell">
        <header className="ap-header">
          <div className="ap-headLeft">
            <div className="ap-titleRow">
              <h1 className="ap-title">About {ownerName}</h1>
              <span className="ap-dot" />
              <div className="ap-subtitle">presence • style • energy</div>
            </div>

            <div className="ap-metaRow">
             

              {loading ? <span className="ap-pill ap-pillInfo">Fetching…</span> : null}
              {refreshing ? <span className="ap-pill ap-pillInfo">Refreshing…</span> : null}
              {errorNote ? <span className="ap-pill ap-pillWarn">{errorNote}</span> : null}
            </div>
          </div>

          <div className="ap-actions">
            <button
              className="ap-iconBtn"
              onClick={onRefresh}
              disabled={loading || refreshing}
              title="Refresh"
              aria-label="Refresh"
            >
              ⟳
            </button>

            <button
              className="ap-iconBtn"
              onClick={goBackToWorld}
              title="Back to World"
              aria-label="Back to World"
            >
              ←
            </button>

            <button className="ap-iconBtn" onClick={() => navigate(-1)} title="Close" aria-label="Close">
              ✕
            </button>
          </div>
        </header>

        <main className="ap-main">
          <div className="ap-card">
            <div className="ap-cardGlow" />
            <div className="ap-cardEdge" />

            <div className="ap-scroll" ref={scrollRef}>
              <pre className="ap-body">
                {displayed || (loading ? 'Loading…' : '')}
                {!done && <span className="ap-cursor blink-cursor">|</span>}
              </pre>
            </div>
          </div>

        </main>
      </div>

      <style>{`
        .ap-root{
          min-height:100vh;
          background:#000;
          color:#fff;
          position:relative;
          overflow:hidden;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        }

        .ap-bg{
          position:fixed;
          inset:0;
          z-index:0;
          transform: translateZ(0);
          /* default background if no image provided */
          background:
            radial-gradient(1200px 700px at 22% 12%, rgba(255,255,255,0.08), rgba(0,0,0,0) 55%),
            radial-gradient(900px 600px at 78% 18%, rgba(34,197,94,0.10), rgba(0,0,0,0) 60%),
            radial-gradient(1100px 800px at 50% 80%, rgba(0,255,255,0.08), rgba(0,0,0,0) 62%),
            linear-gradient(180deg, rgba(0,0,0,0.58), rgba(0,0,0,0.92));
          background-repeat:no-repeat;
          background-size:cover;
          background-position:center;
          filter: saturate(1.05) contrast(1.05);
        }

        /* Vignette + dim on top of image */
        .ap-vignette{
          position:fixed;
          inset:0;
          z-index:1;
          pointer-events:none;
          background:
            radial-gradient(1200px 900px at 50% 18%, rgba(0,0,0,0.18), rgba(0,0,0,0.62) 62%),
            linear-gradient(180deg, rgba(0,0,0,0.38), rgba(0,0,0,0.86));
        }

        .ap-noise{
          position:fixed;
          inset:0;
          z-index:2;
          pointer-events:none;
          opacity:0.08;
          background-image:
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");
          background-size: 180px 180px;
        }

        .ap-shell{
          position:relative;
          z-index:3;
          max-width: 1040px;
          margin: 0 auto;
          padding: 28px 18px 34px;
        }

        .ap-header{
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:14px;
          padding-top: 10px;
        }

        .ap-titleRow{
          display:flex;
          align-items:baseline;
          gap:10px;
          flex-wrap:wrap;
        }

        .ap-title{
          margin:0;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 0.6px;
          line-height: 1.1;
        }

        .ap-dot{
          width:7px; height:7px;
          border-radius:999px;
          background: rgba(255,255,255,0.35);
          transform: translateY(-2px);
        }

        .ap-subtitle{
          color:#cfd3dc;
          font-size: 12px;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          opacity: 0.95;
        }

        .ap-metaRow{
          margin-top: 10px;
          display:flex;
          align-items:center;
          gap:10px;
          flex-wrap:wrap;
        }

        .ap-meta{
          color:#94a3b8;
          font-size: 12px;
          letter-spacing: 0.2px;
        }
        .ap-metaDim{ opacity: 0.6; }

        .ap-pill{
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.4px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          max-width: min(72vw, 720px);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ap-pillInfo{ color:#e5e7eb; }
        .ap-pillWarn{
          color:#fecaca;
          border-color: rgba(239,68,68,0.25);
          background: rgba(239,68,68,0.10);
        }

        .ap-actions{
          display:flex;
          align-items:center;
          gap:10px;
          padding-top: 2px;
        }

        .ap-iconBtn{
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.08);
          color:#fff;
          cursor:pointer;
          display:grid;
          place-items:center;
          box-shadow: 0 18px 40px rgba(0,0,0,0.35);
          transition: transform 120ms ease, opacity 120ms ease, border-color 120ms ease;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          font-weight: 900;
        }
        .ap-iconBtn:hover{ border-color: rgba(0,255,255,0.20); }
        .ap-iconBtn:active{ transform: scale(0.97); opacity: 0.92; }
        .ap-iconBtn:disabled{ opacity: 0.55; cursor: not-allowed; }

        .ap-main{
          margin-top: 18px;
        }

        .ap-card{
          position:relative;
          border-radius: 22px;
          overflow:hidden;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 28px 70px rgba(0,0,0,0.55);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .ap-cardGlow{
          position:absolute;
          inset:-1px;
          background:
            radial-gradient(600px 280px at 30% 18%, rgba(255,255,255,0.12), rgba(0,0,0,0) 62%),
            radial-gradient(520px 260px at 78% 24%, rgba(34,197,94,0.10), rgba(0,0,0,0) 64%),
            linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02));
          pointer-events:none;
        }

        .ap-cardEdge{
          position:absolute;
          inset:0;
          pointer-events:none;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
        }

        .ap-scroll{
          position:relative;
          max-height: min(68vh, 680px);
          overflow:auto;
          padding: 18px 18px 20px;
        }

        .ap-body{
          margin:0;
          white-space: pre-wrap;
          word-break: break-word;
          color:#f9fafb;
          font-size: 14px;
          line-height: 22px;
          letter-spacing: 0.25px;
          font-weight: 450;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New", monospace;
        }

        .ap-cursor{ color:#22c55e; font-weight: 900; }

        .ap-hint{
          margin-top: 10px;
          color:#94a3b8;
          font-size: 11px;
          letter-spacing: 0.2px;
          opacity: 0.9;
        }

        .blink-cursor{ animation: blink 0.9s infinite; }
        @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

        @media (max-width: 520px){
          .ap-title{ font-size: 22px; }
          .ap-shell{ padding: 20px 14px 28px; }
          .ap-iconBtn{ width: 38px; height: 38px; }
          .ap-scroll{ padding: 16px; }
        }

        @media (prefers-reduced-motion: reduce){
          .blink-cursor{ animation:none; }
        }
      `}</style>
    </div>
  );
}
