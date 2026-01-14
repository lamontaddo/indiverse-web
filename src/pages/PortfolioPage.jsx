// src/pages/PortfolioPage.jsx ✅ FULL DROP-IN (Web) — profileKey-aware public portfolio
// Route: /world/:profileKey/portfolio
//
// ✅ profileKey resolved from route param -> location.state.profileKey
// ✅ profile-aware PUBLIC fetch with x-profile-key
// ✅ Grid (2 cols) + glass tiles
// ✅ Refresh + Retry states
// ✅ Click tile -> navigates to /world/:profileKey/portfolio/view with state { url, id, profileKey }
//
// Requires: react-router-dom, getProfileByKey(profileKey)

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getProfileByKey } from '../services/profileRegistry';

const GAP = 10;
const PAD = 16;

// ✅ tiny helper: profile-aware PUBLIC fetch (web)
async function publicFetchRawWeb(path, { profileKey, method = 'GET', body } = {}) {
  const key = String(profileKey || '').trim().toLowerCase();
  if (!key) throw new Error('Missing profileKey');

  const profile = getProfileByKey(key);

  // Prefer profile.apiBaseUrl if present, else dev device base
  const base = profile?.apiBaseUrl || profile?.apiBaseUrlDev?.device || '';
  if (!base) throw new Error('Missing apiBaseUrl for profile.');

  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;

  return fetch(url, {
    method,
    headers: {
      ...(body ? { 'content-type': 'application/json' } : {}),
      'x-profile-key': key,
    },
    body,
  });
}

export default function PortfolioPage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const routeProfileKey = String(params?.profileKey || '').trim().toLowerCase();
  const stateProfileKey = String(location?.state?.profileKey || '').trim().toLowerCase();
  const profileKey = routeProfileKey || stateProfileKey || '';

  const profile = useMemo(() => (profileKey ? getProfileByKey(profileKey) : null), [profileKey]);
  const accent = profile?.accent || '#818cf8';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    if (!profileKey) {
      setItems([]);
      setLoading(false);
      setErr('Missing profileKey.');
      return;
    }

    setLoading(true);
    setErr('');

    try {
      const res = await publicFetchRawWeb('/api/portfolio', { profileKey, method: 'GET' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Failed to load portfolio');
      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch (e) {
      console.log(e);
      setItems([]);
      setErr(e?.message || 'Failed to load portfolio.');
    } finally {
      setLoading(false);
    }
  }, [profileKey]);

  useEffect(() => {
    load();
  }, [load]);

  const onBack = () => {
    if (!profileKey) navigate('/');
    else navigate(`/world/${encodeURIComponent(profileKey)}`, { state: { profileKey } });
  };

  const openViewer = (item) => {
    navigate(`/world/${encodeURIComponent(profileKey)}/portfolio/view`, {
      state: { url: item?.url, id: item?._id, profileKey },
    });
  };

  return (
    <div style={styles.page}>
      <style>{css}</style>

      <div style={{ ...styles.glowOne, background: hexToRgba(accent, 0.35) }} />
      <div style={styles.glowTwo} />

      <div style={styles.wrap}>
        <div style={styles.headerRow}>
          <button className="pf-btn" onClick={onBack} title="Back">
            ←
          </button>

          <div style={{ flex: 1 }}>
            <div style={styles.headerTitle}>PORTFOLIO</div>
            <div style={styles.headerSub}>images curated by Kerry</div>
            {!profileKey ? (
              <div style={{ marginTop: 8, color: '#fca5a5', fontSize: 12, fontWeight: 800 }}>
                Missing profileKey (open with /world/:profileKey/portfolio).
              </div>
            ) : null}
          </div>

          <button className="pf-btn" onClick={load} title="Refresh">
            ⟳
          </button>
        </div>

        {loading ? (
          <div style={styles.center}>
            <div className="pf-spinner" />
            <div style={styles.dim}>Loading…</div>
          </div>
        ) : err ? (
          <div style={styles.center}>
            <div style={styles.dim}>{err}</div>
            <button className="pf-retry" onClick={load}>
              Retry
            </button>
          </div>
        ) : items.length ? (
          <div style={styles.grid}>
            {items.map((it) => (
              <button
                key={String(it._id)}
                className="pf-tile"
                onClick={() => openViewer(it)}
                title="Open"
              >
                <img src={it.url} alt="" style={styles.img} loading="lazy" />
              </button>
            ))}
          </div>
        ) : (
          <div style={styles.center}>
            <div style={styles.dim}>No portfolio images yet.</div>
          </div>
        )}
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
  wrap: { position: 'relative', zIndex: 2, maxWidth: 980, margin: '0 auto', padding: '26px 18px 26px' },
  headerRow: { display: 'flex', alignItems: 'center', gap: 12, paddingTop: 12, paddingBottom: 10 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 900, letterSpacing: 3 },
  headerSub: { marginTop: 6, color: 'rgba(255,255,255,0.72)', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  center: { minHeight: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '0 24px' },
  dim: { color: 'rgba(255,255,255,0.75)', textAlign: 'center', fontWeight: 800 },
  grid: {
    marginTop: 10,
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: GAP,
    padding: `${GAP}px ${PAD}px ${PAD}px`,
  },
  img: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
};

const css = `
.pf-btn{
  width: 38px; height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.06);
  color: #e5e7eb;
  cursor: pointer;
  font-weight: 900;
  display:grid;
  place-items:center;
}
.pf-btn:active{ opacity: 0.92; transform: scale(0.99); }

.pf-retry{
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.06);
  color: #fff;
  cursor: pointer;
  font-weight: 900;
}

.pf-tile{
  border: none;
  padding: 0;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 18px;
  overflow: hidden;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.14);
  box-shadow: 0 18px 40px rgba(0,0,0,0.35);
  cursor: pointer;
  transition: transform 140ms ease, opacity 140ms ease;
}
.pf-tile:hover{ border-color: rgba(34,211,238,0.45); }
.pf-tile:active{ opacity: 0.9; transform: scale(0.99); }

.pf-spinner{
  width: 18px; height: 18px;
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: rgba(255,255,255,0.85);
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
`;
