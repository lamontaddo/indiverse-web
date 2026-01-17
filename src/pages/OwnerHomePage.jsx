// src/pages/OwnerHomePage.jsx ✅ FULL DROP-IN (Web)
// Route: /world/:profileKey/owner/home
//
// ✅ Restores original large icon look
// ✅ Fixes tile → page navigation perception
// ✅ Keeps hardened auth + routing
// ✅ No lamont fallback
// ✅ Emoji icons intentionally large (RN parity)

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getProfileByKey } from '../services/profileRegistry';

const SPEED = 0.55;
const AMP_BOOST = 1.1;

const FALLBACK_OWNER_ITEMS = [
  { key: 'about', label: 'About', ionicon: 'person-circle', to: 'ownerabout', size: 150 },
  { key: 'contacts', label: 'Contacts', ionicon: 'people', to: 'ownercontacts', size: 160 },
  { key: 'messages', label: 'Messages', ionicon: 'chatbubbles', to: 'ownermessages', size: 150 },
  { key: 'playlist', label: 'Playlist', ionicon: 'list', to: 'ownerplaylist', size: 165 },
  { key: 'music', label: 'Music', ionicon: 'musical-notes', to: 'ownermusic', size: 160 },
  { key: 'fashion', label: 'Fashion', ionicon: 'shirt', to: 'ownerfashion', size: 155 },
  { key: 'videos', label: 'Videos', ionicon: 'videocam', to: 'ownervideos', size: 155 },
];

function normalizeProfileKey(pk) {
  return String(pk || '').trim().toLowerCase();
}

function normalizeOwnerItems(profile) {
  const raw =
    Array.isArray(profile?.ownerItems) && profile.ownerItems.length
      ? profile.ownerItems
      : FALLBACK_OWNER_ITEMS;

  return raw.map((it, idx) => ({
    key: String(it.key ?? `owner-${idx}`),
    label: String(it.label ?? it.key ?? 'Item'),
    ionicon: it.ionicon || it.icon || 'ellipse',
    to: String(it.to ?? it.key ?? ''),
    size: Number(it.size ?? 150),
    params: it.params || null,
  }));
}

// --- Ionicon → Emoji (intentional web stand-in) ---
function ionToEmoji(name = '') {
  const k = String(name).toLowerCase();
  if (k.includes('person')) return '👤';
  if (k.includes('people')) return '👥';
  if (k.includes('chat')) return '💬';
  if (k.includes('list')) return '📃';
  if (k.includes('music')) return '🎵';
  if (k.includes('shirt')) return '👕';
  if (k.includes('video')) return '🎬';
  if (k.includes('home')) return '🏠';
  return '◉';
}

export default function OwnerHomePage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const routeProfileKey = normalizeProfileKey(params?.profileKey);
  const stateProfileKey = normalizeProfileKey(location?.state?.profileKey);
  const storedProfileKey = normalizeProfileKey(localStorage.getItem('profileKey'));

  const profileKey = routeProfileKey || stateProfileKey || storedProfileKey || null;
  const profile = useMemo(() => (profileKey ? getProfileByKey(profileKey) : null), [profileKey]);

  const OWNER_NAME = profile?.label || 'Owner';
  const OWNER_NAME_CAPS = String(profile?.brandTopTitle || OWNER_NAME).toUpperCase();
  const accent = profile?.accent || '#818cf8';

  const TILES = useMemo(() => normalizeOwnerItems(profile), [profile]);

  const phases = useMemo(
    () =>
      TILES.map((_, idx) => ({
        ax: [5, 6, 4, 6, 5][idx % 5] * AMP_BOOST,
        ay: [4, 4, 6, 6, 5][idx % 5] * AMP_BOOST,
        sx: 0.35 + idx * 0.03,
        sy: 0.3 + idx * 0.025,
      })),
    [TILES]
  );

  const t0Ref = useRef(performance.now());
  const [, setTick] = useState(0);

  useEffect(() => {
    const loop = () => {
      setTick((x) => (x + 1) % 1_000_000);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }, []);

  const tileTransform = (idx) => {
    const t = ((performance.now() - t0Ref.current) / 1000) * SPEED;
    const p = phases[idx];
    return `translate3d(${Math.sin(t * p.sx) * p.ax}px, ${Math.cos(t * p.sy) * p.ay}px, 0)`;
  };

  const routeMap = {
    ownerabout: 'about',
    ownercontacts: 'contacts',
    ownermessages: 'messages',
    ownerplaylist: 'playlist',
    ownermusic: 'music',
    ownerfashion: 'fashion',
    ownervideos: 'videos',
  };

  const builtOwnerRoutes = new Set([
    'home',
    'about',
    'contacts',
    'messages',
    'playlist',
    'music',
    'fashion',
    'videos',
  ]);

  const handleTilePress = (tile) => {
    const raw = String(tile.to).toLowerCase();
    const tool = routeMap[raw] || raw.replace(/^owner/, '');

    if (builtOwnerRoutes.has(tool)) {
      navigate(`/world/${profileKey}/owner/${tool}`, {
        state: { profileKey, bgUrl: location?.state?.bgUrl || null },
      });
    }
  };

  return (
    <div style={styles.page}>
      <style>{css}</style>

      <div style={styles.header}>
        <div>
          <div style={styles.title}>{OWNER_NAME_CAPS}</div>
          <div style={styles.subtitle}>Owner Console</div>
        </div>
      </div>

      <div style={styles.field}>
        {TILES.map((t, idx) => (
          <button
            key={t.key}
            className="oh-tile"
            style={{ width: t.size, height: t.size, transform: tileTransform(idx) }}
            onClick={() => handleTilePress(t)}
          >
            <div className="oh-tileInner">
              <div className="oh-icon">{ionToEmoji(t.ionicon)}</div>
              <div className="oh-label">{t.label}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #020617, #0b1220)',
    color: '#e5e7eb',
    overflow: 'hidden',
  },
  header: {
    padding: '42px 22px 10px',
  },
  title: {
    fontSize: 32,
    fontWeight: 900,
    letterSpacing: 4,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 12,
    letterSpacing: 1,
    color: '#9ca3af',
    textTransform: 'uppercase',
  },
  field: {
    padding: 18,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 18,
  },
};

const css = `
.oh-tile{
  border-radius: 28px;
  background: rgba(15,23,42,0.75);
  border: 1px solid rgba(129,140,248,0.6);
  box-shadow: 0 18px 42px rgba(0,0,0,0.45);
  cursor: pointer;
}

.oh-tileInner{
  width: 100%;
  height: 100%;
  display:flex;
  flex-direction: column;
  align-items:center;
  justify-content:center;
  gap: 14px;
}

.oh-icon{
  font-size: 48px;
  line-height: 1;
  filter: drop-shadow(0 10px 22px rgba(0,0,0,0.45));
}

.oh-label{
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 1px;
}

@media (max-width: 520px){
  .oh-icon{ font-size: 42px; }
  .oh-label{ font-size: 13px; }
}
`;
