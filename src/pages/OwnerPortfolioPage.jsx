// src/pages/OwnerPortfolioPage.jsx ✅ FULL DROP-IN (Web) — HARDENED + BASE URL AWARE
// Route: /world/:profileKey/owner/portfolio
//
// ✅ Requires profileKey (no silent fallback)
// ✅ All owner calls include x-profile-key + Authorization (token per profileKey)
// ✅ Uses profile.base (or VITE_API_BASE_URL) so this works hosted anywhere
// ✅ 401/403 -> redirect to OwnerLogin
//
// Upload flow:
// 0) GET  /api/owner/profile (auth ping)
// 1) POST /api/owner/portfolio/upload-url  -> { uploadUrl, key }
// 2) PUT  file bytes to S3 uploadUrl
// 3) POST /api/owner/portfolio             -> save DB record
// 4) GET  /api/owner/portfolio             -> refresh list
//
// Requires: react-router-dom, BootGate ran bootRemoteConfigOnce

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getProfileByKey } from '../services/profileRegistry';

function normalizeProfileKey(pk) {
  return String(pk || '').trim().toLowerCase();
}

function ownerTokenKey(profileKey) {
  return `ownerToken:${normalizeProfileKey(profileKey)}`;
}

function getOwnerToken(profileKey) {
  try {
    const k = normalizeProfileKey(profileKey);
    if (!k) return '';
    return localStorage.getItem(ownerTokenKey(k)) || '';
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

function joinUrl(base, path) {
  const b = String(base || '').replace(/\/+$/, '');
  const p = String(path || '').startsWith('/') ? String(path || '') : `/${path || ''}`;
  if (!b) return p; // same-origin
  return `${b}${p}`;
}

// ✅ web version of ownerFetchRaw (no throw, returns Response)
async function ownerFetchRawWeb(path, { baseUrl = '', profileKey, method = 'GET', headers = {}, body } = {}) {
  const pk = normalizeProfileKey(profileKey);
  const token = getOwnerToken(pk);

  const finalHeaders = {
    'x-profile-key': pk,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const hasBody = body !== undefined && body !== null;

  // only set JSON content-type automatically if caller didn't provide one
  if (hasBody && !finalHeaders['content-type'] && !finalHeaders['Content-Type']) {
    // if body is a string we assume JSON string; if it's FormData/Blob caller should set/omit explicitly
    if (typeof body === 'string') finalHeaders['content-type'] = 'application/json';
  }

  return fetch(joinUrl(baseUrl, path), {
    method,
    headers: finalHeaders,
    body: hasBody ? body : undefined,
  });
}

export default function OwnerPortfolioPage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const routeProfileKey = normalizeProfileKey(params?.profileKey);
  const stateProfileKey = normalizeProfileKey(location?.state?.profileKey);

  // ✅ REQUIRE profileKey (no “lamont” fallback)
  const profileKey = routeProfileKey || stateProfileKey || '';

  const profile = useMemo(() => (profileKey ? getProfileByKey(profileKey) : null), [profileKey]);
  const accent = profile?.accent || '#818cf8';
  const profileLabel = profile?.label || profile?.name || profileKey || 'Unknown';

  // Base URL: profile.base OR env OR same-origin
  const baseUrl =
    profile?.base ||
    import.meta.env.VITE_API_BASE_URL ||
    '';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState({ level: 'ok', text: 'Ready.' });

  const fileInputRef = useRef(null);

  const goOwnerLogin = useCallback(() => {
    if (!profileKey) {
      navigate('/', { replace: true });
      return;
    }
    navigate(`/world/${encodeURIComponent(profileKey)}/owner/login`, {
      replace: true,
      state: { profileKey, bgUrl: location?.state?.bgUrl || null },
    });
  }, [navigate, profileKey, location?.state?.bgUrl]);

  const load = useCallback(async () => {
    if (!profileKey) {
      setItems([]);
      setLoading(false);
      setStatus({ level: 'warn', text: 'Missing profileKey.' });
      return;
    }

    setLoading(true);
    try {
      const res = await ownerFetchRawWeb('/api/owner/portfolio', { baseUrl, profileKey });
      const data = await readJsonSafe(res);

      if (res.status === 401 || res.status === 403) {
        setItems([]);
        setStatus({ level: 'warn', text: 'Session expired. Please log in again.' });
        goOwnerLogin();
        return;
      }

      if (!res.ok) throw new Error(data?.error || `Load failed (${res.status})`);

      const list = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
      setItems(list);
      setStatus({ level: 'ok', text: 'Portfolio synced.' });
    } catch (e) {
      console.log('LOAD ERROR:', e?.message || e);
      setStatus({ level: 'err', text: e?.message || 'Failed to load portfolio items.' });
    } finally {
      setLoading(false);
    }
  }, [profileKey, baseUrl, goOwnerLogin]);

  useEffect(() => {
    load();
  }, [load]);

  const onBack = () => {
    if (!profileKey) navigate('/');
    else navigate(`/world/${encodeURIComponent(profileKey)}/owner/home`, { state: { profileKey } });
  };

  const openFilePicker = () => {
    if (!profileKey) {
      setStatus({ level: 'warn', text: 'Missing profileKey. Open with /world/:profileKey/owner/portfolio' });
      return;
    }
    if (uploading) return;
    fileInputRef.current?.click?.();
  };

  const pickAndUpload = useCallback(
    async (file) => {
      if (!profileKey || !file) return;
      if (uploading) return;

      const contentType = String(file.type || '').toLowerCase();
      const isImage =
        contentType.startsWith('image/') ||
        /\.(png|jpg|jpeg|webp)$/i.test(String(file.name || ''));

      if (!isImage) {
        setStatus({ level: 'warn', text: 'Please select an image (png/jpg/webp).' });
        return;
      }

      setUploading(true);
      setStatus({ level: 'ok', text: 'Uploading…' });

      try {
        // STEP 0: confirm owner auth works
        const ping = await ownerFetchRawWeb('/api/owner/profile', { baseUrl, profileKey });
        if (ping.status === 401 || ping.status === 403) {
          setStatus({ level: 'warn', text: 'Session expired. Please log in again.' });
          goOwnerLogin();
          return;
        }
        if (!ping.ok) {
          const t = await ping.text().catch(() => '');
          throw new Error(t || 'Owner auth failed (check token / login)');
        }

        // STEP 1: presigned URL
        const filename = String(file.name || `upload-${Date.now()}.jpg`);
        const r1 = await ownerFetchRawWeb('/api/owner/portfolio/upload-url', {
          baseUrl,
          profileKey,
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ filename, contentType: contentType || 'image/jpeg' }),
        });

        const j1 = await readJsonSafe(r1);

        if (r1.status === 401 || r1.status === 403) {
          setStatus({ level: 'warn', text: 'Session expired. Please log in again.' });
          goOwnerLogin();
          return;
        }

        if (!r1.ok) throw new Error(j1?.error || `upload-url HTTP ${r1.status}`);
        if (!j1?.uploadUrl || !j1?.key) throw new Error('upload-url missing uploadUrl/key');

        // STEP 2: PUT to S3
        const put = await fetch(j1.uploadUrl, {
          method: 'PUT',
          headers: {
            ...(contentType ? { 'Content-Type': contentType } : {}),
          },
          body: file,
        });

        if (!put.ok) {
          const txt = await put.text().catch(() => '');
          throw new Error(txt || `Upload to S3 failed (${put.status})`);
        }

        // STEP 3: save DB record
        const r3 = await ownerFetchRawWeb('/api/owner/portfolio', {
          baseUrl,
          profileKey,
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ key: j1.key, contentType: contentType || 'image/jpeg' }),
        });

        const j3 = await readJsonSafe(r3);

        if (r3.status === 401 || r3.status === 403) {
          setStatus({ level: 'warn', text: 'Session expired. Please log in again.' });
          goOwnerLogin();
          return;
        }

        if (!r3.ok) throw new Error(j3?.error || `save HTTP ${r3.status}`);

        setStatus({ level: 'ok', text: 'Uploaded. Refreshing…' });
        await load();
        setStatus({ level: 'ok', text: 'Upload complete.' });
      } catch (e) {
        console.log('UPLOAD ERROR:', e?.message || e);
        setStatus({ level: 'err', text: e?.message || 'Upload failed.' });
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    },
    [profileKey, uploading, baseUrl, goOwnerLogin, load]
  );

  const onDelete = useCallback(
    async (id) => {
      if (!profileKey) return;
      const ok = window.confirm('Delete image?\n\nThis will remove it from the portfolio.');
      if (!ok) return;

      try {
        const res = await ownerFetchRawWeb(`/api/owner/portfolio/${encodeURIComponent(id)}`, {
          baseUrl,
          profileKey,
          method: 'DELETE',
        });
        const j = await readJsonSafe(res);

        if (res.status === 401 || res.status === 403) {
          setStatus({ level: 'warn', text: 'Session expired. Please log in again.' });
          goOwnerLogin();
          return;
        }

        if (!res.ok) throw new Error(j?.error || 'Delete failed');
        setStatus({ level: 'ok', text: 'Deleted. Refreshing…' });
        await load();
      } catch (e) {
        setStatus({ level: 'err', text: e?.message || 'Failed to delete.' });
      }
    },
    [profileKey, baseUrl, goOwnerLogin, load]
  );

  const statusColor =
    status.level === 'ok' ? '#22c55e' : status.level === 'warn' ? '#facc15' : '#fb7185';

  return (
    <div style={styles.page}>
      <style>{css}</style>

      <div style={{ ...styles.glowOne, background: hexToRgba(accent, 0.35) }} />
      <div style={styles.glowTwo} />

      <div style={styles.wrap}>
        <div style={styles.headerRow}>
          <button className="op-btn" onClick={onBack} title="Back">
            ←
          </button>

          <div style={{ flex: 1 }}>
            <div style={styles.title}>OWNER PORTFOLIO</div>
            <div style={styles.subTitle}>upload images for {profileLabel}</div>
            {!profileKey ? (
              <div style={{ marginTop: 8, color: '#fca5a5', fontSize: 12, fontWeight: 800 }}>
                Missing profileKey (open with /world/:profileKey/owner/portfolio).
              </div>
            ) : null}
          </div>

          <button
            className="op-btn"
            onClick={openFilePicker}
            disabled={uploading || !profileKey}
            title="Upload"
          >
            {uploading ? '…' : '+'}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => pickAndUpload(e.target.files?.[0])}
          />
        </div>

        <div style={styles.statusPill}>
          <span style={{ ...styles.statusDot, background: statusColor }} />
          <div style={styles.statusText}>{status.text}</div>
        </div>

        {loading ? (
          <div style={styles.center}>
            <div className="op-spinner" />
            <div style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 800 }}>Loading…</div>
          </div>
        ) : items.length ? (
          <div style={styles.list}>
            {items.map((it) => (
              <div key={String(it._id)} className="op-card">
                <div style={styles.cardRow}>
                  <div style={styles.thumb}>🖼️</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={styles.itemTitle} title={it.key}>
                      {it.key}
                    </div>
                    <div style={styles.itemSub}>
                      {it?.createdAt ? new Date(it.createdAt).toLocaleString() : ''}
                    </div>
                  </div>

                  <button className="op-trash" onClick={() => onDelete(it._id)} title="Delete">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.center}>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 800 }}>
              No images yet. Tap + to upload.
            </div>
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
  wrap: {
    position: 'relative',
    zIndex: 2,
    padding: '26px 18px 26px',
    maxWidth: 980,
    margin: '0 auto',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    paddingBottom: 10,
  },
  title: { fontSize: 16, fontWeight: 900, letterSpacing: 2, color: '#fff' },
  subTitle: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statusPill: {
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    borderRadius: 999,
    background: 'rgba(15,23,42,0.85)',
    border: '1px solid rgba(148,163,184,0.6)',
    width: 'fit-content',
    maxWidth: '100%',
  },
  statusDot: { width: 8, height: 8, borderRadius: 999 },
  statusText: { color: '#9ca3af', fontSize: 12, letterSpacing: 0.7, whiteSpace: 'nowrap' },
  center: {
    minHeight: 360,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  list: { marginTop: 14, display: 'grid', gridTemplateColumns: '1fr', gap: 12 },
  cardRow: { display: 'flex', alignItems: 'center', gap: 12 },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(0,0,0,0.35)',
    display: 'grid',
    placeItems: 'center',
  },
  itemTitle: {
    color: '#fff',
    fontWeight: 900,
    fontSize: 12,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  itemSub: { color: 'rgba(255,255,255,0.65)', marginTop: 4, fontSize: 11 },
};

const css = `
.op-btn{
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.06);
  color: #e5e7eb;
  cursor: pointer;
  font-weight: 900;
  display:grid;
  place-items:center;
}
.op-btn:disabled{ opacity: 0.5; cursor: not-allowed; }
.op-btn:active{ opacity: 0.92; transform: scale(0.99); }

.op-card{
  border-radius: 20px;
  padding: 14px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.05);
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(0,0,0,0.35);
}
.op-trash{
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  color: #fff;
  cursor: pointer;
  display:grid;
  place-items:center;
}
.op-trash:active{ opacity: 0.9; transform: scale(0.99); }

.op-spinner{
  width: 18px; height: 18px;
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: rgba(255,255,255,0.85);
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
`;
