// src/pages/OwnerHomePage.jsx
// Route: /world/:profileKey/owner/home
//
// ✅ Uses backend API_BASE (no same-origin calls)
// ✅ No silent profile fallback
// ✅ Hardened owner auth ping
// ✅ Build-safe (no stray braces)

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getProfileByKey } from '../services/profileRegistry';

/* ============================================================
   ENV / CONSTANTS
============================================================ */

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  'https://indiverse-backend.onrender.com';

const SPEED = 0.55;
const AMP_BOOST = 1.1;

/* ============================================================
   HELPERS
============================================================ */

function normalizeProfileKey(pk) {
  return String(pk || '').trim().toLowerCase();
}

function ownerTokenKey(profileKey) {
  return `ownerToken:${normalizeProfileKey(profileKey)}`;
}

function getOwnerToken(profileKey) {
  try {
    return localStorage.getItem(ownerTokenKey(profileKey)) || '';
  } catch {
    return '';
  }
}

function clearOwnerToken(profileKey) {
  try {
    localStorage.removeItem(ownerTokenKey(profileKey));
  } catch {}
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

/* ============================================================
   API (WEB OWNER)
============================================================ */

async function ownerFetchRawWeb(path, { profileKey, method = 'GET', body } = {}) {
  const pk = normalizeProfileKey(profileKey);
  const token = getOwnerToken(pk);

  const headers = {
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    'x-profile-key': pk,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body,
  });
}

/* ============================================================
   UI HELPERS
============================================================ */

function ionToEmoji(name = '') {
  const k = String(name).toLowerCase();
  if (k.includes('person')) return '👤';
  if (k.includes('people')) return '👥';
  if (k.includes('chat')) return '💬';
  if (k.includes('music')) return '🎵';
  if (k.includes('video')) return '🎬';
  if (k.includes('shirt')) return '👕';
  if (k.includes('list')) return '📃';
  return '◉';
}

function hexToRgba(hex, a = 1) {
  const h = String(hex || '').replace('#', '');
  const f = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  if (f.length !== 6) return `rgba(129,140,248,${a})`;
  const r = parseInt(f.slice(0, 2), 16);
  const g = parseInt(f.slice(2, 4), 16);
  const b = parseInt(f.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

/* ============================================================
   FALLBACK OWNER ITEMS
============================================================ */

const FALLBACK_OWNER_ITEMS = [
  { key: 'about', label: 'About', ionicon: 'person-circle', to: 'about', size: 130 },
  { key: 'contacts', label: 'Contacts', ionicon: 'people', to: 'contacts', size: 140 },
  { key: 'messages', label: 'Messages', ionicon: 'chatbubbles', to: 'messages', size: 130 },
  { key: 'music', label: 'Music', ionicon: 'musical-notes', to: 'music', size: 140 },
  { key: 'videos', label: 'Videos', ionicon: 'videocam', to: 'videos', size: 135 },
];

/* ============================================================
   PAGE
============================================================ */

export default function OwnerHomePage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const routeKey = normalizeProfileKey(params?.profileKey);
  const stateKey = normalizeProfileKey(location?.state?.profileKey);
  const storedKey = getActiveProfileKeyWeb();

  const [profileKey, setProfileKey] = useState(routeKey || stateKey || storedKey || '');
  const [status, setStatus] = useState('Synchronizing owner profile…');
  const [statusLevel, setStatusLevel] = useState('ok');

  useEffect(() => {
    setProfileKey(routeKey || stateKey || storedKey || '');
  }, [routeKey, stateKey, storedKey]);

  const profile = useMemo(
    () => (profileKey ? getProfileByKey(profileKey) : null),
    [profileKey]
  );

  const ownerItems =
    Array.isArray(profile?.ownerItems) && profile.ownerItems.length
      ? profile.ownerItems
      : FALLBACK_OWNER_ITEMS;

  /* ============================================================
     AUTH PING
  ============================================================ */

  useEffect(() => {
    if (!profileKey) {
      setStatus('Missing profileKey.');
      setStatusLevel('warn');
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await ownerFetchRawWeb('/api/owner/profile', { profileKey });
        const data = await readJsonSafe(res);

        if (cancelled) return;

        if (res.status === 401 || res.status === 403) {
          clearOwnerToken(profileKey);
          navigate(`/world/${profileKey}/owner/login`, { replace: true });
          return;
        }

        if (!res.ok) {
          setStatus(data?.error || `Sync failed (${res.status})`);
          setStatusLevel('warn');
          return;
        }

        setStatus('Owner session active.');
        setStatusLevel('ok');
      } catch {
        if (!cancelled) {
          setStatus('Backend unreachable.');
          setStatusLevel('warn');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [profileKey, navigate]);

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div style={styles.page}>
      <div style={{ ...styles.glow, background: hexToRgba(profile?.accent, 0.35) }} />

      <div style={styles.header}>
        <div>
          <div style={styles.title}>{profile?.label || 'OWNER'}</div>
          <div style={styles.subtitle}>Owner Console</div>
        </div>
        <button
          style={styles.back}
          onClick={() => navigate(`/world/${profileKey}`)}
        >
          🏠 Back
        </button>
      </div>

      <div style={styles.grid}>
        {ownerItems.map((item, i) => (
          <button
            key={item.key}
            style={{ ...styles.tile, width: item.size, height: item.size }}
            onClick={() =>
              navigate(`/world/${profileKey}/owner/${item.to}`, {
                state: { profileKey },
              })
            }
          >
            <div style={styles.icon}>{ionToEmoji(item.ionicon)}</div>
            <div style={styles.label}>{item.label}</div>
          </button>
        ))}
      </div>

      <div style={styles.status}>
        <span
          style={{
            ...styles.dot,
            background:
              statusLevel === 'ok' ? '#22c55e' : '#facc15',
          }}
        />
        {status}
      </div>
    </div>
  );
}

/* ============================================================
   STYLES
============================================================ */

const styles = {
  page: {
    minHeight: '100vh',
    background: '#020617',
    color: '#e5e7eb',
    padding: 22,
    position: 'relative',
  },
  glow: {
    position: 'fixed',
    width: 260,
    height: 260,
    borderRadius: '50%',
    top: -60,
    right: -60,
    filter: 'blur(90px)',
    pointerEvents: 'none',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  title: { fontSize: 28, fontWeight: 900 },
  subtitle: { fontSize: 12, opacity: 0.7 },
  back: {
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: 999,
    padding: '8px 12px',
    color: '#fff',
    cursor: 'pointer',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
  },
  tile: {
    borderRadius: 22,
    background: '#0f172a',
    border: '1px solid #334155',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  icon: { fontSize: 28, marginBottom: 8 },
  label: { fontSize: 13, fontWeight: 700 },
  status: {
    marginTop: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 12,
    opacity: 0.8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
};
