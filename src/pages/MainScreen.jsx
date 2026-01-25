// src/pages/MainScreen.jsx ✅ FULL DROP-IN (Web) — FIXED bgUrl order + bg inheritance
// Route: /world/:profileKey

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const DEFAULT_REMOTE_CONFIG_URL =
  import.meta.env.VITE_REMOTE_CONFIG_URL ||
  'https://montech-remote-config.s3.amazonaws.com/superapp/config.json';

const FALLBACK_BUBBLES = [
  { key: 'about', label: 'About', ionicon: 'person', to: 'about', size: 110, x: 24, y: 90 },
  { key: 'videos', label: 'Videos', ionicon: 'videocam', to: 'videos', size: 132, x: 220, y: 150 },
  { key: 'playlist', label: 'Playlist', ionicon: 'musical-notes', to: 'playlist', size: 118, x: 24, y: 280 },
  { key: 'music', label: 'Music', ionicon: 'radio', to: 'music', size: 118, x: 210, y: 280 },
  { key: 'fashion', label: 'Fashion', ionicon: 'shirt', to: 'fashion', size: 140, x: 200, y: 400 },
  { key: 'contact', label: 'Connect', ionicon: 'mail', to: 'contact', size: 110, x: 40, y: 460 },
];

const FALLBACK_NAV_TABS = [
  { key: 'projects', label: 'Projects', to: 'projects' },
  { key: 'energy', label: 'Energy', to: 'energy' },
  { key: 'games', label: 'Games', to: 'games' },
];

const MUNIVERSE_SENTINEL = '__MUNIVERSE__';

function isHttpUrl(s) {
  return typeof s === 'string' && /^https?:\/\//i.test(s);
}
function safeUrl(s) {
  const v = typeof s === 'string' ? s.trim() : '';
  return v ? v : null;
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

function normalizeBubbles(profile) {
  const items =
    Array.isArray(profile?.homeItems) && profile.homeItems.length ? profile.homeItems : FALLBACK_BUBBLES;

  const hasLayout = items.some((it) => it?.x != null || it?.y != null);

  const pickExtras = (it) => ({
    portalKey: it?.portalKey || null,
    params: it?.params || null,
  });

  if (!hasLayout) {
    const auto = [
      { x: 0.12, y: 0.18, size: 120 },
      { x: 0.64, y: 0.22, size: 140 },
      { x: 0.12, y: 0.48, size: 128 },
      { x: 0.64, y: 0.52, size: 128 },
      { x: 0.40, y: 0.74, size: 116 },
      { x: 0.14, y: 0.80, size: 116 },
    ];

    return items.map((it, idx) => {
      const p = auto[idx % auto.length];
      return {
        key: String(it.key ?? `item-${idx}`),
        label: String(it.label ?? it.key ?? 'Item'),
        ionicon: it.ionicon || it.icon || 'ellipse',
        to: it.to ? String(it.to) : String(it.key),
        ...pickExtras(it),
        size: Number(it.size ?? p.size),
        _rx: Number(it.x ?? p.x),
        _ry: Number(it.y ?? p.y),
        _layoutMode: 'ratio',
      };
    });
  }

  return items.map((it, idx) => ({
    key: String(it.key ?? `item-${idx}`),
    label: String(it.label ?? it.key ?? 'Item'),
    ionicon: it.ionicon || it.icon || 'ellipse',
    to: it.to ? String(it.to) : String(it.key),
    ...pickExtras(it),
    size: Number(it.size ?? 118),
    x: Number(it.x ?? 24),
    y: Number(it.y ?? 90),
    _layoutMode: 'px',
  }));
}

function normalizeNavTabs(profile) {
  const raw = Array.isArray(profile?.navTabs) && profile.navTabs.length ? profile.navTabs : FALLBACK_NAV_TABS;

  const cleaned = raw
    .filter(Boolean)
    .map((t, idx) => ({
      key: String(t.key ?? `tab-${idx}`),
      label: String(t.label ?? t.key ?? 'Tab'),
      to: String(t.to ?? t.key ?? ''),
    }))
    .filter((t) => !!t.to);

  const hasMUniverse = cleaned.some(
    (t) => String(t.key).toLowerCase() === 'muniverse' || String(t.to).toLowerCase() === 'muniverse'
  );

  if (!hasMUniverse) cleaned.push({ key: 'muniverse', label: 'indiVerse', to: MUNIVERSE_SENTINEL });

  return cleaned;
}

// --- simple auth shim (swap later for real auth provider) ---
function useAuthWeb() {
    const [isAuthed, setIsAuthed] = useState(false);
  
    useEffect(() => {
      const read = () => {
        try {
          setIsAuthed(localStorage.getItem('auth:isAuthed') === '1');
        } catch {
          setIsAuthed(false);
        }
      };
  
      read();
  
      // ✅ fires in same tab
      window.addEventListener('focus', read);
  
      // ✅ fires in other tabs
      window.addEventListener('storage', read);
  
      return () => {
        window.removeEventListener('focus', read);
        window.removeEventListener('storage', read);
      };
    }, []);
  
    return { isAuthed };
  }
  

// Map ionicon names -> emoji (quick web stand-in)
function ionToEmoji(name = '') {
    const k = String(name || '').trim().toLowerCase();
  
    // exact matches first (your generator options)
    const map = {
      person: '👤',
      'person-circle': '👤',
      people: '👥',
  
      'musical-notes': '🎵',
      radio: '📻',
      list: '📃',
  
      hammer: '🛠️',
      chatbubbles: '💬',
      call: '📞',
      mail: '✉️',
  
      shirt: '👕',
      videocam: '🎬',
      heart: '❤️',
  
      sparkles: '✨',
      flower: '🌸',
      rose: '🌹',
  
      cart: '🛒',
      cash: '💵',
  
      images: '🖼️',
      camera: '📷',
  
      globe: '🌍',
      link: '🔗',
  
      play: '▶️',
    };
  
    if (map[k]) return map[k];
  
    // tolerant fallbacks if a value drifts a little (optional)
    if (k.includes('person')) return '👤';
    if (k.includes('people')) return '👥';
    if (k.includes('musical') || k.includes('music')) return '🎵';
    if (k.includes('video')) return '🎬';
    if (k.includes('shirt')) return '👕';
    if (k.includes('chat')) return '💬';
    if (k.includes('call')) return '📞';
    if (k.includes('mail')) return '✉️';
    if (k.includes('image')) return '🖼️';
    if (k.includes('camera')) return '📷';
    if (k.includes('globe')) return '🌍';
    if (k.includes('link')) return '🔗';
    if (k.includes('play')) return '▶️';
  
    return '◉';
  }
  
  


  function resolveWorldRoute(profileKey, bubble, bgUrl) {
    const raw = bubble?.to || bubble?.key || '';
  
    // normalize once, predictably
    const k = String(raw)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[_]/g, '');
  
    const state = { profileKey, bgUrl };
  
    // ✅ PAID VIDEOS (explicit + stable)
    if (k === 'paidvideos' || k === 'paidvideo') {
      return { path: `/world/${profileKey}/paidvideos`, state };
    }
  
    // ✅ PRODUCTS
    if (['products', 'product', 'productscreen', 'shop', 'store'].includes(k)) {
      return { path: `/world/${profileKey}/products`, state };
    }
  
    // ✅ CART
    if (['cart', 'cartscreen', 'checkout'].includes(k)) {
      return { path: `/world/${profileKey}/cart?mode=products`, state };
    }
  
    // ✅ FLOWER ORDERS / CONSULTATION
    if (
      [
        'flowerorders',
        'flowerorder',
        'flowers',
        'flower',
        'florals',
        'floral',
        'consultation',
        'consultations',
        'bookflowers',
        'orderflowers',
      ].includes(k)
    ) {
      return { path: `/world/${profileKey}/flowerorders`, state };
    }
  
    // ✅ KNOWN STATIC ROUTES
    if (
      ['about', 'contact', 'videos', 'playlist', 'music', 'fashion', 'energy', 'games', 'chat'].includes(k)
    ) {
      return { path: `/world/${profileKey}/${k}`, state };
    }
  
    // ✅ FALLBACK (generic feature → placeholder or real page)
    return { path: `/world/${profileKey}/${k}`, state };
  }
  
  
  

export default function MainScreen() {
  const navigate = useNavigate();
  const { profileKey: rawKey } = useParams();
  const location = useLocation();

  const activeProfileKey = (rawKey || 'lamont').toLowerCase();
  const { isAuthed } = useAuthWeb();

  const [cfg, setCfg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bgReady, setBgReady] = useState(false);

  // drift tick
  const rafRef = useRef(0);
  const t0Ref = useRef(performance.now());
  const [, setTick] = useState(0);

  // measure field
  const fieldRef = useRef(null);
  const [fieldRect, setFieldRect] = useState({ w: 0, h: 0 });

  // secret-hold timers by bubble key
  const holdTimersRef = useRef(Object.create(null));
  const holdTriggeredRef = useRef(Object.create(null));

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

  const profile = useMemo(() => getProfileByKeyFromCfg(cfg, activeProfileKey), [cfg, activeProfileKey]);

  // ✅ bgUrl must be defined BEFORE we reference it
  const bgUrl = useMemo(() => {
    const paramBg = safeUrl(location?.state?.bgUrl);
    const remoteIntro = safeUrl(profile?.assets?.introBgImageUrl);
    const remoteIcon = safeUrl(profile?.assets?.iconUrl);

    if (paramBg && isHttpUrl(paramBg)) return paramBg;
    if (remoteIntro && isHttpUrl(remoteIntro)) return remoteIntro;
    if (remoteIcon && isHttpUrl(remoteIcon)) return remoteIcon;
    return null;
  }, [location?.state?.bgUrl, profile]);

  const worldBgUrl = bgUrl; // ✅ now safe

  const titleText = useMemo(() => {
    const t = profile?.worldTitle || profile?.label || 'INDIVERSE';
    return String(t).toUpperCase();
  }, [profile]);

  const taglineText = profile?.tagline || 'presence • style • energy';

  const bubbles = useMemo(() => normalizeBubbles(profile), [profile]);
  const navTabs = useMemo(() => normalizeNavTabs(profile), [profile]);

  const [activeTab, setActiveTab] = useState(navTabs?.[0]?.label || '');

  useEffect(() => {
    if (navTabs?.length) setActiveTab(navTabs[0].label);
  }, [activeProfileKey, navTabs]);

  // measure field
  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setFieldRect({ w: r.width, h: r.height });
    });

    ro.observe(el);
    const r = el.getBoundingClientRect();
    setFieldRect({ w: r.width, h: r.height });

    return () => ro.disconnect();
  }, []);

  // animation tick (drift)
  useEffect(() => {
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      setTick((x) => (x + 1) % 600000);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // cleanup holds
  useEffect(() => {
    return () => {
      const timers = holdTimersRef.current;
      Object.keys(timers).forEach((k) => {
        clearTimeout(timers[k]);
        delete timers[k];
      });
    };
  }, [activeProfileKey]);

  const handleMessageMe = useCallback(() => {
    const nextRoute = `/world/${encodeURIComponent(activeProfileKey)}/chat`;
    const nextState = { profileKey: activeProfileKey, bgUrl: worldBgUrl };
  
    if (!isAuthed) {
      navigate('/auth/login', {
        state: { profileKey: activeProfileKey, nextRoute, nextState },
      });
      return;
    }
  
    navigate(nextRoute, { state: nextState });
  }, [activeProfileKey, isAuthed, navigate, worldBgUrl]);
  
  // ✅ navigate to /world/:profileKey/<featureKey>
  const handleBubblePress = useCallback(
    (b, idx) => {
      const keyId = `${String(b.key || idx)}`;
      if (holdTriggeredRef.current[keyId]) return;
  
      // portal special-case stays intact
      if (String(b.to || '').toLowerCase() === 'linkportal') {
        navigate(
          `/portal/${encodeURIComponent(activeProfileKey)}/${encodeURIComponent(b.portalKey || '')}`,
          { state: { profileKey: activeProfileKey, bgUrl: worldBgUrl, ...(b.params || {}) } }
        );
        return;
      }
  
      const { path, state } = resolveWorldRoute(activeProfileKey, b, worldBgUrl);
      navigate(path, { state: { ...state, ...(b.params || {}) } });
    },
    [activeProfileKey, navigate, worldBgUrl]
  );
  

  const handleTabPress = useCallback(
    (tab) => {
      setActiveTab(tab.label);
  
      // indiVerse home
      if (tab.to === MUNIVERSE_SENTINEL) {
        navigate('/');
        return;
      }
  
      // route tabs through the SAME resolver as bubbles
      const bubbleLike = { key: tab.key, to: tab.to };
      const { path, state } = resolveWorldRoute(activeProfileKey, bubbleLike, worldBgUrl);
  
      navigate(path, { state });
    },
    [activeProfileKey, navigate, worldBgUrl]
  );
  

  // secret hold handlers
  const isConnectBubble = (b) => {
    const k = String(b.key || '').toLowerCase();
    const to = String(b.to || '').toLowerCase();
    return k === 'contact' || to === 'contact';
  };

  const startHold = (b, idx) => {
    if (!isConnectBubble(b)) return;
  
    const keyId = `${String(b.key || idx)}`;
    holdTriggeredRef.current[keyId] = false;
  
    if (holdTimersRef.current[keyId]) return;
  
    holdTimersRef.current[keyId] = setTimeout(() => {
      holdTimersRef.current[keyId] = null;
      holdTriggeredRef.current[keyId] = true;
  
      // ✅ correct route (matches App.jsx): /world/:profileKey/owner/login
      navigate(`/world/${encodeURIComponent(activeProfileKey)}/owner/login`, {
        state: { profileKey: activeProfileKey, bgUrl: worldBgUrl },
        replace: false,
      });
    }, 3000);
  };
  

  const clearHold = (b, idx) => {
    if (!isConnectBubble(b)) return;
    const keyId = `${String(b.key || idx)}`;
    const t = holdTimersRef.current[keyId];
    if (t) clearTimeout(t);
    delete holdTimersRef.current[keyId];
  };

  const bubbleStyle = (b, idx) => {
    const now = performance.now();
    const t = (now - t0Ref.current) / 1000;

    const ampX = 6 + (idx % 5);
    const ampY = 6 + ((idx + 2) % 5);

    const dx = Math.sin(t * (0.35 + idx * 0.03)) * ampX;
    const dy = Math.cos(t * (0.30 + idx * 0.025)) * ampY;

    let leftPx = 24;
    let topPx = 90;

    if (b._layoutMode === 'ratio') {
      leftPx = Math.round((fieldRect.w || 0) * (b._rx ?? 0.2));
      topPx = Math.round((fieldRect.h || 0) * (b._ry ?? 0.2));
    } else {
      leftPx = b.x ?? 24;
      topPx = b.y ?? 90;
    }

    const size = Number(b.size || 118);
    const pad = 10;
    const maxL = Math.max(pad, (fieldRect.w || 0) - size - pad);
    const maxT = Math.max(pad, (fieldRect.h || 0) - size - pad);

    const L = Math.max(pad, Math.min(maxL, leftPx));
    const T = Math.max(pad, Math.min(maxT, topPx));

    return {
      width: size,
      height: size,
      left: L,
      top: T,
      transform: `translate3d(${dx}px, ${dy}px, 0)`,
    };
  };

  if (!loading && !profile) {
    return (
      <div className="ms-root">
        <div className="ms-bgFallback" />
        <div className="ms-center" style={{ zIndex: 3 }}>
          <div style={{ opacity: 0.85 }}>Profile not found: {activeProfileKey}</div>
          <button className="ms-ghostBtn" onClick={() => navigate('/')}>
            ← Back to indiVerse
          </button>
        </div>
        <StyleTag />
      </div>
    );
  }

  return (
    <div className="ms-root">
      <div className="ms-bg" style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined} />
      <div className="ms-dim" />

      <div className={`ms-content ${bgReady ? 'ms-contentIn' : ''}`}>
        <div className="ms-headerWrap">
          <div className="ms-headerRow">
            <div className="ms-title">{titleText}</div>

            <button className="ms-messagePill" onClick={handleMessageMe}>
              <span className="ms-pillIcon" aria-hidden>
                💬
              </span>
              <span className="ms-messageText">Message me</span>
            </button>
          </div>

          <div className="ms-tagline">{taglineText}</div>
        </div>

        <div className="ms-field" ref={fieldRef}>
          {bubbles.map((b, idx) => (
            <button
              key={`${b.key}-${idx}`}
              className="ms-bubbleWrap"
              style={bubbleStyle(b, idx)}
              onMouseDown={() => startHold(b, idx)}
              onMouseUp={() => clearHold(b, idx)}
              onMouseLeave={() => clearHold(b, idx)}
              onTouchStart={() => startHold(b, idx)}
              onTouchEnd={() => clearHold(b, idx)}
              onTouchCancel={() => clearHold(b, idx)}
              onClick={() => handleBubblePress(b, idx)}
              title={b.label}
            >
              <div className="ms-bubble">
                <div className="ms-bubbleShine" />
                <div className="ms-bubbleInner">
                  <div className="ms-bubbleIcon" aria-hidden>
                    {ionToEmoji(b.ionicon)}
                  </div>
                  <div className="ms-bubbleLabel">{b.label}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="ms-bottomNavHint">
          <div className="ms-navPill">
            {navTabs.map((tab) => (
              <button
                key={tab.key}
                className={`ms-navItem ${activeTab === tab.label ? 'ms-navItemActive' : ''}`}
                onClick={() => handleTabPress(tab)}
              >
                <span className={`ms-navText ${activeTab === tab.label ? 'ms-navTextActive' : 'ms-navTextDim'}`}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {bgUrl ? (
        <img
          src={bgUrl}
          alt=""
          style={{ display: 'none' }}
          onLoad={() => setBgReady(true)}
          onError={() => setBgReady(true)}
        />
      ) : (
        <span style={{ display: 'none' }}>{bgReady || setBgReady(true)}</span>
      )}

      <StyleTag />
    </div>
  );
}

function StyleTag() {
  return (
    <style>{`
      .ms-root{
        min-height: 100vh;
        background:#000;
        color:#fff;
        overflow:hidden;
        position:relative;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
      }
      .ms-bg{
        position: fixed;
        inset: 0;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 0;
        transform: translateZ(0);
      }
      .ms-bgFallback{
        position: fixed;
        inset: 0;
        z-index: 0;
        background: #000;
      }
      .ms-dim{
        position: fixed;
        inset: 0;
        z-index: 1;
        background: linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.75));
      }
      .ms-content{
        position: relative;
        z-index: 2;
        min-height: 100vh;
        opacity: 0;
        transition: opacity 800ms ease;
      }
      .ms-contentIn{ opacity: 1; }
      .ms-headerWrap{
        padding-top: 64px;
        padding-left: 22px;
        padding-right: 22px;
      }
      .ms-headerRow{
        display:flex;
        align-items:center;
        justify-content: space-between;
        gap: 12px;
      }
      .ms-title{
        font-size: 42px;
        font-weight: 800;
        letter-spacing: 4px;
        color: #fff;
        line-height: 1;
      }
      .ms-tagline{
        margin-top: 6px;
        color: #cfd3dc;
        letter-spacing: 1px;
        font-size: 13px;
        text-transform: uppercase;
      }
      .ms-messagePill{
        display:flex;
        align-items:center;
        gap: 8px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.18);
        background: rgba(255,255,255,0.72);
        color:#000;
        padding: 8px 12px;
        cursor:pointer;
        font-weight: 800;
        font-size: 12px;
        letter-spacing: 0.8px;
        box-shadow: 0 18px 28px rgba(0,0,0,0.35);
        transition: transform 120ms ease, opacity 120ms ease;
      }
      .ms-messagePill:active{ transform: scale(0.98); opacity: 0.92; }
      .ms-field{
        position: relative;
        height: calc(100vh - 220px);
        min-height: 420px;
        margin-top: 8px;
      }
      .ms-bubbleWrap{
        position: absolute;
        border: none;
        background: transparent;
        padding: 0;
        border-radius: 999px;
        cursor: pointer;
        will-change: transform;
      }
      .ms-bubble{
        width: 100%;
        height: 100%;
        border-radius: 999px;
        overflow:hidden;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.12);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        box-shadow: 0 18px 40px rgba(0,0,0,0.40);
        transition: transform 120ms ease, opacity 120ms ease, border-color 120ms ease;
      }
      .ms-bubbleWrap:active .ms-bubble{
        transform: scale(0.97);
        opacity: 0.95;
        border-color: rgba(0,255,255,0.20);
      }
      .ms-bubbleShine{
        position:absolute;
        inset: 0;
        background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18), rgba(255,255,255,0.03) 55%, rgba(255,255,255,0) 70%);
        pointer-events:none;
      }
      .ms-bubbleInner{
        height: 100%;
        display:flex;
        flex-direction: column;
        align-items:center;
        justify-content:center;
        gap: 6px;
      }
      .ms-bubbleIcon{
        font-size: 28px;
        filter: drop-shadow(0 8px 18px rgba(0,0,0,0.35));
      }
      .ms-bubbleLabel{
        color:#fff;
        font-weight: 700;
        letter-spacing: 0.6px;
        font-size: 13px;
        text-shadow: 0 10px 22px rgba(0,0,0,0.5);
      }
      .ms-bottomNavHint{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 18px;
        z-index: 3;
        display:flex;
        justify-content:center;
        padding: 0 16px;
      }
      .ms-navPill{
        display:flex;
        gap: 10px;
        padding: 10px 16px;
        border-radius: 999px;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.12);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
      }
      .ms-navItem{
        border: none;
        background: transparent;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 999px;
      }
      .ms-navItemActive{
        background: rgba(255,255,255,0.08);
      }
      .ms-navText{
        font-weight: 700;
        letter-spacing: 0.8px;
        font-size: 12px;
      }
      .ms-navTextActive{ color: #fff; }
      .ms-navTextDim{ color: #cfd3dc; }
      .ms-ghostBtn{
        margin-top: 12px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.18);
        background: rgba(2,6,23,0.55);
        color: #e5e7eb;
        padding: 10px 14px;
        cursor:pointer;
      }
      .ms-center{
        position: relative;
        z-index: 3;
        min-height: 100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        flex-direction: column;
        padding: 24px;
        text-align: center;
      }
      @media (max-width: 420px){
        .ms-title{ font-size: 34px; }
        .ms-field{ height: calc(100vh - 240px); }
      }
      @media (prefers-reduced-motion: reduce){
        .ms-bubbleWrap{ transform: none !important; }
        .ms-content{ transition: none; }
      }
    `}</style>
  );
}
