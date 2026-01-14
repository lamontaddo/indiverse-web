// src/pages/OwnerHomePage.jsx ✅ FULL DROP-IN (Web) — HARDENED + CLEANED
// Route: /world/:profileKey/owner/home
//
// ✅ NO "lamont" fallback anywhere
// ✅ profileKey resolved as: route param -> location.state -> localStorage('profileKey')
// ✅ If missing profileKey: blocks API + shows warning banner
// ✅ Owner auth ping uses ownerFetchRawWeb so we can handle 401/403 without throwing
// ✅ Push token registration is stubbed (web) but kept per-profile hook point
// ✅ Tile navigation always passes { profileKey } and keeps bgUrl in router state
// ✅ FIX: removed duplicate keys (ownermessages/ownercontacts/ownerplaylist)
// ✅ FIX: removed profileKey localStorage fallback inside getOwnerToken (no cross-profile leakage)
// ✅ FIX: stable route mapping + built route set
//
// Requires:
// - bootRemoteConfigOnce() already runs in App.jsx BootGate ✅
// - getProfileByKey(profileKey) from your profileRegistry (remote-config backed)
// - owner token stored by OwnerLoginPage into localStorage under ownerToken:<profileKey>

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getProfileByKey } from '../services/profileRegistry';

const SPEED = 0.55;
const AMP_BOOST = 1.1;

// fallback if a profile has no ownerItems
const FALLBACK_OWNER_ITEMS = [
  { key: 'about', label: 'About', ionicon: 'person-circle', to: 'ownerabout', size: 130 },
  { key: 'contacts', label: 'Contacts', ionicon: 'people', to: 'ownercontacts', size: 140 },
  { key: 'messages', label: 'Messages', ionicon: 'chatbubbles', to: 'ownermessages', size: 130 },
  { key: 'playlist', label: 'Playlist', ionicon: 'list', to: 'ownerplaylist', size: 145 },
  { key: 'music', label: 'Music', ionicon: 'musical-notes', to: 'ownermusic', size: 140 },
  { key: 'fashion', label: 'Fashion', ionicon: 'shirt', to: 'ownerfashion', size: 135 },
  { key: 'videos', label: 'Videos', ionicon: 'videocam', to: 'ownervideos', size: 135 },
];

function normalizeProfileKey(pk) {
  return String(pk || '').trim().toLowerCase();
}

function normalizeOwnerItems(profile) {
  const raw =
    Array.isArray(profile?.ownerItems) && profile.ownerItems.length
      ? profile.ownerItems
      : FALLBACK_OWNER_ITEMS;

  return raw
    .filter(Boolean)
    .map((it, idx) => ({
      key: String(it.key ?? `owner-${idx}`),
      label: String(it.label ?? it.key ?? 'Item'),
      ionicon: it.ionicon || it.icon || 'ellipse',
      to: String(it.to ?? it.key ?? ''),
      size: Number(it.size ?? 132),
      params: it.params || null,
    }))
    .filter((x) => !!x.to);
}

function ownerTokenKey(profileKey) {
  return `ownerToken:${normalizeProfileKey(profileKey)}`;
}

function getOwnerToken(profileKey) {
  // ✅ HARDENED: only per-profile token (no generic 'ownerToken' fallback)
  try {
    const k = normalizeProfileKey(profileKey);
    if (!k) return '';
    return localStorage.getItem(ownerTokenKey(k)) || '';
  } catch {
    return '';
  }
}

function getActiveProfileKeyWeb() {
  try {
    return normalizeProfileKey(localStorage.getItem('profileKey'));
  } catch {
    return '';
  }
}

async function readJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

// ✅ web version of ownerFetchRaw (no throw, returns Response)
async function ownerFetchRawWeb(path, { profileKey, method = 'GET', body } = {}) {
  const pk = normalizeProfileKey(profileKey);
  const token = getOwnerToken(pk);

  return fetch(path, {
    method,
    headers: {
      ...(body ? { 'content-type': 'application/json' } : {}),
      'x-profile-key': pk,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });
}

// --- Ionicon name -> emoji (web stand-in) ---
function ionToEmoji(name = '') {
  const k = String(name).toLowerCase();
  if (k.includes('person')) return '👤';
  if (k.includes('people') || k.includes('contacts')) return '👥';
  if (k.includes('chat')) return '💬';
  if (k.includes('list') || k.includes('playlist')) return '📃';
  if (k.includes('music') || k.includes('musical')) return '🎵';
  if (k.includes('shirt') || k.includes('fashion')) return '👕';
  if (k.includes('video') || k.includes('videocam')) return '🎬';
  if (k.includes('home')) return '🏠';
  return '◉';
}

// --- Web "push token" stub (keep hook point) ---
function registerOwnerPushTokenWeb(profileKey) {
  void profileKey;
  // Web push is totally different; keep as a no-op for now.
  // Later: service workers + VAPID + permission prompts (per profile).
}

export default function OwnerHomePage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const routeProfileKey = normalizeProfileKey(params?.profileKey);
  const stateProfileKey = normalizeProfileKey(location?.state?.profileKey);
  const storedProfileKey = getActiveProfileKeyWeb();

  // ✅ Resolve profileKey: route param -> state -> localStorage only (NO lamont fallback)
  const resolvedKey = routeProfileKey || stateProfileKey || storedProfileKey || '';
  const [profileKey, setProfileKey] = useState(resolvedKey || null);

  const [statusText, setStatusText] = useState('Synchronizing owner profile…');
  const [statusLevel, setStatusLevel] = useState('ok'); // ok | warn | err

  const [bgUrl, setBgUrl] = useState(location?.state?.bgUrl || null);

  // For fade-in
  const [mounted, setMounted] = useState(false);

  // Drift tick
  const rafRef = useRef(0);
  const t0Ref = useRef(performance.now());
  const [, setTick] = useState(0);

  useEffect(() => setMounted(true), []);

  // Resolve profileKey again if route changes
  useEffect(() => {
    const next = routeProfileKey || stateProfileKey || storedProfileKey || '';
    setProfileKey(next ? next : null);
    setBgUrl(location?.state?.bgUrl || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeProfileKey, stateProfileKey, location?.state?.bgUrl]);

  const profile = useMemo(() => (profileKey ? getProfileByKey(profileKey) : null), [profileKey]);

  const OWNER_NAME = profile?.label || 'Owner';
  const OWNER_NAME_CAPS = String(profile?.brandTopTitle || profile?.label || 'OWNER').toUpperCase();
  const accent = profile?.accent || '#818cf8';

  const TILES = useMemo(() => normalizeOwnerItems(profile), [profile]);

  // ✅ stable per-tile phases for drift
  const phases = useMemo(() => {
    return TILES.map((_, idx) => ({
      ax: [5, 6, 4, 6, 5][idx % 5] * AMP_BOOST,
      ay: [4, 4, 6, 6, 5][idx % 5] * AMP_BOOST,
      sx: 0.35 + idx * 0.03,
      sy: 0.3 + idx * 0.025,
    }));
  }, [TILES]);

  // animation tick (drift)
  useEffect(() => {
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      setTick((x) => (x + 1) % 600000);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const goOwnerLogin = useCallback(
    (k) => {
      const key = normalizeProfileKey(k) || profileKey || '';
      if (!key) {
        navigate('/', { replace: true });
        return;
      }
      navigate(`/world/${encodeURIComponent(key)}/owner/login`, {
        replace: true,
        state: { profileKey: key, bgUrl },
      });
    },
    [navigate, profileKey, bgUrl]
  );

  // Owner auth ping + push token (per-profile)
  useEffect(() => {
    if (!profileKey) {
      setStatusText('Missing profileKey. Open OwnerHome with { profileKey }.');
      setStatusLevel('warn');
      return;
    }

    try {
      registerOwnerPushTokenWeb(profileKey);
    } catch {}

    let cancelled = false;

    (async () => {
      try {
        const res = await ownerFetchRawWeb('/api/owner/profile', { profileKey });
        const data = await readJsonSafe(res);

        if (cancelled) return;

        if (res.status === 401 || res.status === 403) {
          setStatusText('Session expired. Please log in again.');
          setStatusLevel('warn');
          goOwnerLogin(profileKey);
          return;
        }

        if (!res.ok || data?.ok === false) {
          setStatusText(data?.error || data?.message || `Sync failed (${res.status})`);
          setStatusLevel('warn');
          return;
        }

        setStatusText('Owner link secure. All systems nominal.');
        setStatusLevel('ok');
      } catch (err) {
        if (cancelled) return;
        setStatusText(err?.message || 'Unable to sync profile. Check connection or token.');
        setStatusLevel('warn');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [profileKey, goOwnerLogin]);

  const statusColor = statusLevel === 'ok' ? '#22c55e' : statusLevel === 'warn' ? '#facc15' : '#f97373';

  const handleBackToMain = () => {
    if (!profileKey) {
      navigate('/', { replace: false });
      return;
    }
    navigate(`/world/${encodeURIComponent(profileKey)}`, {
      state: { profileKey, bgUrl },
    });
  };

  // ✅ ONE canonical mapping (no duplicates)
  const routeMap = useMemo(
    () => ({
      ownerabout: 'about',
      ownerhome: 'home',
      ownerlogin: 'login',
      ownervideos: 'videos',

      ownercontacts: 'contacts',
      ownermessages: 'messages',
      ownerchat: 'chat',

      ownerplaylist: 'playlist',
      ownermusic: 'music',
      ownerfashion: 'fashion',
    

      ownerflowerorders: 'flowerorders',
      ownerproducts: 'products',
      ownerportfolio: 'portfolio',

    }),
    []
  );

  // ✅ routes you have ACTUALLY built in App.jsx
// ✅ add Fashion to the list of routes you've actually built
const builtOwnerRoutes = useMemo(
    () =>
      new Set([
        'home',
        'about',
        'login',
        'videos',
        'products',
        'playlist',
        'contacts',
        'music',
        'messages',
        'chat',
        'fashion',
        'flowerorders', // ✅ ADD THIS (owner flower orders exists)
        'portfolio',

      ]),
    []
  );
  
  

  const handleTilePress = (tile) => {
    if (!tile?.to) return;
  
    if (!profileKey) {
      setStatusText('Missing profileKey. Cannot open owner tools.');
      setStatusLevel('warn');
      return;
    }
  
    const raw = String(tile.to || '').trim().toLowerCase();
  
    // ✅ PORTAL SPECIAL-CASE (web routes are /world/:profileKey/portal[/portalKey])
    // Supports tile.to values like:
    // - "portal"
    // - "portal:<portalKey>"
    // - "linkportal"
    // - "ownerportal"
    // Also supports tile.params.portalKey or tile.params.portal object
    const isPortal =
      raw === 'portal' ||
      raw.startsWith('portal:') ||
      raw === 'linkportal' ||
      raw === 'ownerportal';
  
    if (isPortal) {
      const portalKeyFromTo = raw.startsWith('portal:') ? raw.split(':')[1] : null;
      const portalKey = String(tile?.params?.portalKey || portalKeyFromTo || '').trim();
  
      const base = `/world/${encodeURIComponent(profileKey)}/portal`;
  
      navigate(portalKey ? `${base}/${encodeURIComponent(portalKey)}` : base, {
        state: {
          profileKey,
          bgUrl,
          // if you pass a portal object in params, LinkPortalPage prefers it
          ...(tile?.params?.portal ? { portal: tile.params.portal } : {}),
          ...(tile?.params || {}),
        },
      });
      return;
    }
  
    // ✅ normal owner route flow
    const toolKey = routeMap[raw] || raw.replace(/^owner/, '');
  
    if (builtOwnerRoutes.has(toolKey)) {
      navigate(`/world/${encodeURIComponent(profileKey)}/owner/${toolKey}`, {
        state: { profileKey, bgUrl, ...(tile.params || {}) },
      });
      return;
    }
  
    // fallback: route to placeholder feature page
    navigate(`/world/${encodeURIComponent(profileKey)}/${encodeURIComponent(raw)}`, {
      state: { profileKey, bgUrl, ...(tile.params || {}) },
    });
  };
  

  // compute drift transforms
  const tileTransform = (idx) => {
    const now = performance.now();
    const t = ((now - t0Ref.current) / 1000) * SPEED;

    const p = phases[idx] || { ax: 5, ay: 4, sx: 0.35, sy: 0.3 };
    const dx = Math.sin(t * p.sx) * p.ax;
    const dy = Math.cos(t * p.sy) * p.ay;

    return `translate3d(${dx}px, ${dy}px, 0)`;
  };

  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* subtle glow */}
      <div style={{ ...styles.glowOne, background: hexToRgba(accent, 0.35) }} />
      <div style={styles.glowTwo} />

      <div className={`oh-wrap ${mounted ? 'oh-in' : ''}`}>
        <div style={styles.headerWrap}>
          <div>
            <div style={styles.title}>{OWNER_NAME_CAPS}</div>
            <div style={styles.subtitle}>Owner Console</div>

            {!profileKey ? (
              <div style={{ ...styles.subtitle, color: '#fca5a5', marginTop: 8 }}>
                Missing profileKey (open with {'{'} profileKey {'}'}).
              </div>
            ) : null}
          </div>

          <button className="oh-backBtn" onClick={handleBackToMain}>
            <span style={{ fontSize: 14 }}>🏠</span>
            <span style={{ fontWeight: 800, letterSpacing: 0.7, fontSize: 12 }}>Back to app</span>
          </button>
        </div>

        <div style={styles.field}>
          {TILES.map((t, idx) => (
            <button
              key={t.key}
              className="oh-tile"
              style={{ width: t.size, height: t.size, transform: tileTransform(idx) }}
              onClick={() => handleTilePress(t)}
              title={t.label}
            >
              <div className="oh-tileInner">
                <div className="oh-icon" aria-hidden>
                  {ionToEmoji(t.ionicon)}
                </div>
                <div className="oh-label">{t.label}</div>
              </div>
            </button>
          ))}
        </div>

        <div style={styles.bottom}>
          <div style={styles.bottomPill}>
            <span style={{ ...styles.statusDot, background: statusColor }} />
            <div style={styles.bottomText}>{OWNER_NAME + ' mode • ' + statusText}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** helpers */
function hexToRgba(hex, a = 1) {
  const h = String(hex || '').replace('#', '').trim();
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  if (full.length !== 6) return `rgba(129,140,248,${a})`;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #020617, #0b1220, #020617)',
    color: '#e5e7eb',
    overflow: 'hidden',
    position: 'relative',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
  },
  glowOne: {
    position: 'fixed',
    width: 260,
    height: 260,
    borderRadius: 999,
    top: -40,
    right: -60,
    opacity: 0.65,
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },
  glowTwo: {
    position: 'fixed',
    width: 260,
    height: 260,
    borderRadius: 999,
    background: 'rgba(236,72,153,0.26)',
    bottom: -60,
    left: -40,
    opacity: 0.55,
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },
  headerWrap: {
    paddingTop: 46,
    paddingLeft: 22,
    paddingRight: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  title: { fontSize: 30, fontWeight: 900, letterSpacing: 4 },
  subtitle: {
    marginTop: 8,
    color: '#9ca3af',
    letterSpacing: 0.9,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  field: {
    paddingTop: 18,
    paddingLeft: 18,
    paddingRight: 18,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
    gap: 16,
    minHeight: 'calc(100vh - 210px)',
  },
  bottom: {
    paddingLeft: 22,
    paddingRight: 22,
    paddingBottom: 22,
    display: 'flex',
    justifyContent: 'center',
  },
  bottomPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    borderRadius: 999,
    background: 'rgba(15,23,42,0.85)',
    border: '1px solid rgba(148,163,184,0.6)',
    maxWidth: 760,
    width: 'fit-content',
  },
  bottomText: { color: '#9ca3af', fontSize: 12, letterSpacing: 0.7, whiteSpace: 'nowrap' },
  statusDot: { width: 8, height: 8, borderRadius: 999, display: 'inline-block' },
};

const css = `
.oh-wrap{
  position: relative;
  z-index: 2;
  min-height: 100vh;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 650ms ease, transform 650ms ease;
}
.oh-in{ opacity: 1; transform: translateY(0); }

.oh-backBtn{
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(148,163,248,0.55);
  background: rgba(15,23,42,0.65);
  color: #e5e7eb;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  cursor: pointer;
  box-shadow: 0 18px 36px rgba(0,0,0,0.35);
}
.oh-backBtn:active{ transform: scale(0.99); opacity: 0.92; }

.oh-tile{
  border: none;
  border-radius: 26px;
  overflow: hidden;
  background: rgba(15,23,42,0.72);
  border: 1px solid rgba(129,140,248,0.6);
  box-shadow: 0 18px 40px rgba(0,0,0,0.40);
  cursor: pointer;
  transition: transform 140ms ease, opacity 140ms ease, border-color 140ms ease;
  display:flex;
  align-items: stretch;
  justify-content: stretch;
  padding: 0;
}
.oh-tile:hover{ border-color: rgba(34,211,238,0.45); }
.oh-tile:active{ opacity: 0.95; }

.oh-tileInner{
  width: 100%;
  height: 100%;
  display:flex;
  flex-direction: column;
  align-items:center;
  justify-content:center;
  gap: 10px;
  padding: 12px;
  background:
    radial-gradient(circle at 35% 20%, rgba(255,255,255,0.12), rgba(255,255,255,0.03) 55%, rgba(255,255,255,0) 70%);
}

.oh-icon{
  font-size: 28px;
  filter: drop-shadow(0 8px 18px rgba(0,0,0,0.35));
}
.oh-label{
  color: #e5e7eb;
  font-weight: 800;
  letter-spacing: 0.8px;
  font-size: 13px;
  text-align: center;
}

@media (max-width: 520px){
  .oh-label{ font-size: 12px; }
}
@media (prefers-reduced-motion: reduce){
  .oh-wrap{ transition: none; }
  .oh-tile{ transition: none; }
}
`;
