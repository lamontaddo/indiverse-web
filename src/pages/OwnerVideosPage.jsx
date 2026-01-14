// src/pages/OwnerVideosPage.jsx ✅ FULL DROP-IN (Web) — HARDENED
// Route: /world/:profileKey/owner/videos
//
// ✅ NO silent 'lamont' fallback
// ✅ profileKey resolved as: route param -> router state -> localStorage('profileKey') ONLY
// ✅ If missing profileKey: blocks API + shows error + disables actions
// ✅ All owner fetch calls ALWAYS include x-profile-key + Bearer token (profile-scoped)
// ✅ 401/403 -> redirects to /world/:profileKey/owner/login
// ✅ Sends NEW DB field names: { source } (and supports thumbUri if you add later)
// ✅ Reads BOTH old+new shapes safely: source/platform + thumbUri/thumbUrl
// ✅ Dedupes by _id to prevent duplicate-key warnings
//
// Requires:
// - bootRemoteConfigOnce() already runs in App.jsx BootGate ✅
// - getProfileByKey from ../services/profileRegistry
// - Owner token stored by OwnerLoginPage into localStorage under ownerToken:<profileKey>

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getProfileByKey } from '../services/profileRegistry';

const PLATFORM_OPTIONS = [
  { value: '', label: 'No platform / original' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'original', label: 'Original upload' },
];

function normalizeProfileKey(pk) {
  return String(pk || '').trim().toLowerCase();
}

function ownerTokenKey(profileKey) {
  return `ownerToken:${normalizeProfileKey(profileKey)}`;
}

function getOwnerToken(profileKey) {
  try {
    return (
      localStorage.getItem(ownerTokenKey(profileKey)) ||
      localStorage.getItem('ownerToken') ||
      ''
    );
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

function normalizeVideo(v) {
  if (!v) return null;
  const _id = String(v._id || v.id || '');
  if (!_id) return null;

  return {
    _id,
    title: v.title || 'Untitled',
    source: v.source || v.platform || 'other',
    url: v.url || '',
    thumbUri: v.thumbUri || v.thumbUrl || null,
    isFeatured: !!v.isFeatured,
    isPublished: v.isPublished !== undefined ? !!v.isPublished : true,
    tags: Array.isArray(v.tags) ? v.tags : [],
    createdAt: v.createdAt || null,
  };
}

function dedupeById(list) {
  const seen = new Set();
  const out = [];
  for (const raw of list || []) {
    const v = normalizeVideo(raw);
    if (!v) continue;
    if (seen.has(v._id)) continue;
    seen.add(v._id);
    out.push(v);
  }
  return out;
}

async function readJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

// ✅ Web ownerFetchRaw (never throws, returns Response)
async function ownerFetchRawWeb(path, { profileKey, method = 'GET', body } = {}) {
  const token = getOwnerToken(profileKey);

  return fetch(path, {
    method,
    headers: {
      ...(body ? { 'content-type': 'application/json' } : {}),
      'x-profile-key': normalizeProfileKey(profileKey),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });
}

export default function OwnerVideosPage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const routeProfileKey = normalizeProfileKey(params?.profileKey);
  const stateProfileKey = normalizeProfileKey(location?.state?.profileKey);
  const storedProfileKey = getActiveProfileKeyWeb();

  const resolvedKey = routeProfileKey || stateProfileKey || storedProfileKey || '';
  const [profileKey, setProfileKey] = useState(resolvedKey || null);

  // form
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState(''); // UI selection -> DB "source"
  const [url, setUrl] = useState('');

  // list
  const [videos, setVideos] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null); // { type, message }
  const [platformPickerOpen, setPlatformPickerOpen] = useState(false);

  const canUseApi = useMemo(() => !!profileKey, [profileKey]);

  const profile = useMemo(() => (profileKey ? getProfileByKey(profileKey) : null), [profileKey]);
  const OWNER_LABEL = profile?.label || profile?.brandTopTitle || 'Owner';
  const accent = profile?.accent || '#818cf8';

  // keep bgUrl if passed
  const [bgUrl, setBgUrl] = useState(location?.state?.bgUrl || null);

  // Re-resolve when route changes
  useEffect(() => {
    const next = routeProfileKey || stateProfileKey || storedProfileKey || '';
    setProfileKey(next ? next : null);
    setBgUrl(location?.state?.bgUrl || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeProfileKey, stateProfileKey, location?.state?.bgUrl]);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 2600);
  };

  const goOwnerLogin = useCallback(
    (key) => {
      const k = normalizeProfileKey(key) || profileKey || '';
      if (!k) {
        navigate('/', { replace: true });
        return;
      }
      navigate(`/world/${encodeURIComponent(k)}/owner/login`, {
        replace: true,
        state: { profileKey: k, bgUrl },
      });
    },
    [navigate, profileKey, bgUrl]
  );

  const resetForm = () => {
    setTitle('');
    setPlatform('');
    setUrl('');
    setPlatformPickerOpen(false);
  };

  // ✅ Load videos
  const loadVideos = useCallback(async () => {
    if (!profileKey) {
      setLoadingList(false);
      setVideos([]);
      setError('Missing profileKey. Open this page as /world/:profileKey/owner/videos');
      return;
    }

    try {
      setError(null);
      setLoadingList(true);

      const res = await ownerFetchRawWeb('/api/owner/videos', { profileKey });
      const data = await readJsonSafe(res);

      if (res.status === 401 || res.status === 403) {
        setVideos([]);
        goOwnerLogin(profileKey);
        return;
      }

      if (!res.ok) {
        const msg = data?.error || data?.message || `Failed to load videos (${res.status})`;
        throw new Error(msg);
      }

      const list = Array.isArray(data) ? data : Array.isArray(data?.videos) ? data.videos : [];
      setVideos(dedupeById(list));
    } catch (err) {
      const msg = err?.message || 'Failed to load videos.';
      setError(msg);
      if (String(msg).toLowerCase().includes('unauthorized')) goOwnerLogin(profileKey);
    } finally {
      setLoadingList(false);
    }
  }, [profileKey, goOwnerLogin]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  // ✅ Add video
  const handleAddVideo = async () => {
    const t = String(title || '').trim();
    const u = String(url || '').trim();
    const sourceRaw = String(platform || '').trim().toLowerCase();

    if (!u) return showToast('error', 'Video URL is required.');
    if (!profileKey) return showToast('error', 'Missing profileKey for this page.');
    if (saving) return;

    try {
      setSaving(true);
      setError(null);

      const payload = {
        title: t,
        url: u,
        ...(sourceRaw ? { source: sourceRaw } : {}),
      };

      const res = await ownerFetchRawWeb('/api/owner/videos', {
        profileKey,
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const data = await readJsonSafe(res);

      if (res.status === 401 || res.status === 403) {
        goOwnerLogin(profileKey);
        return;
      }

      if (!res.ok) {
        const msg = data?.error || data?.message || `Failed to add video (${res.status})`;
        throw new Error(msg);
      }

      const saved = normalizeVideo(data);
      if (!saved) throw new Error('Server returned an invalid video payload.');

      setVideos((prev) => dedupeById([saved, ...prev]));
      resetForm();
      showToast('success', 'Video added');
    } catch (err) {
      const msg = err?.message || 'Failed to add video.';
      setError(msg);
      showToast('error', msg);
      if (String(msg).toLowerCase().includes('unauthorized')) goOwnerLogin(profileKey);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Delete video
  const handleDeleteVideo = async (id) => {
    const vid = String(id || '');
    if (!vid) return;
    if (!profileKey) return showToast('error', 'Missing profileKey.');

    try {
      const res = await ownerFetchRawWeb(`/api/owner/videos/${encodeURIComponent(vid)}`, {
        profileKey,
        method: 'DELETE',
      });
      const data = await readJsonSafe(res);

      if (res.status === 401 || res.status === 403) {
        goOwnerLogin(profileKey);
        return;
      }

      if (!res.ok) {
        const msg = data?.error || data?.message || `Failed to delete (${res.status})`;
        throw new Error(msg);
      }

      setVideos((prev) => prev.filter((v) => v._id !== vid));
      showToast('success', 'Video removed');
    } catch (err) {
      const msg = err?.message || 'Failed to delete video.';
      showToast('error', msg);
      if (String(msg).toLowerCase().includes('unauthorized')) goOwnerLogin(profileKey);
    }
  };

  const selectedPlatformLabel =
    PLATFORM_OPTIONS.find((opt) => opt.value === platform)?.label || 'Select platform (optional)';

  return (
    <div style={styles.page}>
      <style>{css}</style>

      <div style={{ ...styles.glowOne, background: hexToRgba(accent, 0.35) }} />
      <div style={styles.glowTwo} />

      <div style={styles.wrap}>
        {/* Header */}
        <div style={styles.header}>
          <button
            className="ov-back"
            onClick={() => navigate(-1)}
            title="Back"
            aria-label="Back"
          >
            ‹
          </button>

          <div style={{ flex: 1 }}>
            <div style={styles.title}>{OWNER_LABEL} Videos</div>
            <div style={styles.subtitle}>
              Drop the reels & clips you want showing in your video grid.
              {profileKey ? ` • ${profileKey}` : ''}
            </div>
            {!canUseApi ? <div style={styles.subtitle}>Missing profileKey for this page.</div> : null}
          </div>

          <div style={{ width: 36 }} />
        </div>

        {/* Error */}
        {error ? (
          <div style={styles.errorBox}>
            <div style={styles.errorText}>{error}</div>
          </div>
        ) : null}

        {/* Form */}
        <div style={styles.label}>Title (optional)</div>
        <div style={styles.inputWrap}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            placeholder="Reel title, performance clip, etc."
            disabled={!canUseApi}
          />
        </div>

        <div style={{ height: 10 }} />

        <div style={styles.label}>Platform (optional)</div>
        <div style={{ position: 'relative' }}>
          <button
            className="ov-select"
            disabled={!canUseApi}
            onClick={() => canUseApi && setPlatformPickerOpen((x) => !x)}
          >
            <span style={{ color: platform ? '#f9fafb' : '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {selectedPlatformLabel}
            </span>
            <span style={{ opacity: 0.7 }}>{platformPickerOpen ? '▲' : '▼'}</span>
          </button>

          {platformPickerOpen ? (
            <div style={styles.dropdown}>
              {PLATFORM_OPTIONS.map((opt) => (
                <button
                  key={opt.value || 'none'}
                  className="ov-opt"
                  onClick={() => {
                    setPlatform(opt.value);
                    setPlatformPickerOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div style={{ height: 10 }} />

        <div style={styles.label}>Video URL</div>
        <div style={styles.inputWrap}>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={styles.input}
            placeholder="https://instagram.com/reel/... or mp4 link"
            disabled={!canUseApi}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddVideo();
            }}
          />
        </div>

        <button
          className="ov-add"
          onClick={handleAddVideo}
          disabled={!canUseApi || saving}
        >
          {saving ? 'Adding…' : 'Add Video'}
        </button>

        {/* List */}
        <div style={{ ...styles.sectionTitle, marginTop: 18 }}>Current videos</div>

        {loadingList ? (
          <div style={styles.loadingBox}>Loading videos…</div>
        ) : videos.length === 0 ? (
          <div style={styles.emptyText}>No videos yet. Drop your first reel link to start.</div>
        ) : (
          <div style={{ marginTop: 10, paddingBottom: 26 }}>
            {videos.map((v) => (
              <div key={v._id} style={styles.videoTile}>
                <div style={styles.videoRow}>
                  <div style={styles.monogram}>
                    {(v.title?.[0] || 'V').toUpperCase()}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={styles.videoTitle}>{v.title || '(No title)'}</div>
                    <div style={styles.videoMeta}>
                      {String(v.source || 'other')} • {v.url}
                    </div>
                    <div style={styles.videoThumb}>
                      Thumb: {v.thumbUri ? '✅' : '❌'}
                    </div>
                  </div>

                  <button
                    className="ov-del"
                    onClick={() => handleDeleteVideo(v._id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast ? (
        <div
          style={{
            ...styles.toast,
            backgroundColor:
              toast.type === 'success' ? 'rgba(22,163,74,0.98)' : 'rgba(239,68,68,0.98)',
          }}
        >
          <div style={styles.toastBadge}>{toast.type === 'success' ? '✓' : '!'}</div>
          <div style={styles.toastText}>{toast.message}</div>
        </div>
      ) : null}
    </div>
  );
}

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
    maxWidth: 860,
    margin: '0 auto',
    padding: '18px 18px 40px',
  },

  header: { display: 'flex', alignItems: 'center', gap: 12, paddingTop: 12, paddingBottom: 14 },
  title: { color: '#f9fafb', fontSize: 18, fontWeight: 800, letterSpacing: 0.4 },
  subtitle: { marginTop: 4, fontSize: 12, color: '#9ca3af' },

  label: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.2, color: '#9ca3af', marginBottom: 6 },

  inputWrap: {
    borderRadius: 999,
    border: '1px solid #374151',
    background: 'rgba(15,23,42,0.72)',
    overflow: 'hidden',
    minHeight: 44,
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: '#f9fafb',
    padding: '12px 14px',
    fontSize: 14,
  },

  sectionTitle: { color: '#e5e7eb', fontSize: 13, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase' },
  loadingBox: { marginTop: 10, padding: '12px 0', color: '#9ca3af' },
  emptyText: { marginTop: 10, color: '#6b7280', fontSize: 13 },

  videoTile: {
    borderRadius: 16,
    border: '1px solid #374151',
    background: 'rgba(15,23,42,0.72)',
    padding: 10,
    marginBottom: 10,
  },
  videoRow: { display: 'flex', alignItems: 'center', gap: 10 },
  monogram: {
    width: 36,
    height: 36,
    borderRadius: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(56,189,248,0.18)',
    border: '1px solid rgba(129,140,248,0.9)',
    fontWeight: 900,
    color: '#e5e7eb',
  },
  videoTitle: { color: '#f9fafb', fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  videoMeta: { color: '#cbd5f5', fontSize: 11, marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  videoThumb: { color: '#9ca3af', fontSize: 11, marginTop: 3 },

  errorBox: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    background: 'rgba(248,113,113,0.08)',
    border: '1px solid rgba(248,113,113,0.7)',
  },
  errorText: { color: '#fecaca', fontSize: 12 },

  dropdown: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    borderRadius: 16,
    border: '1px solid #374151',
    background: 'rgba(15,23,42,0.98)',
    overflow: 'hidden',
    zIndex: 20,
  },

  toast: {
    position: 'fixed',
    right: 16,
    top: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    borderRadius: 999,
    boxShadow: '0 18px 36px rgba(0,0,0,0.35)',
    zIndex: 50,
  },
  toastBadge: {
    width: 22,
    height: 22,
    borderRadius: 999,
    background: '#bbf7d0',
    color: '#022c22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
  },
  toastText: { color: '#ecfdf5', fontWeight: 700, fontSize: 13 },
};

const css = `
.ov-back{
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid rgba(55,65,81,0.9);
  background: rgba(15,23,42,0.9);
  color: #e5e7eb;
  cursor: pointer;
  font-size: 20px;
  line-height: 34px;
}
.ov-back:active{ opacity: 0.8; }

.ov-select{
  width: 100%;
  border-radius: 999px;
  border: 1px solid #374151;
  background: rgba(15,23,42,0.72);
  color: #e5e7eb;
  cursor: pointer;
  min-height: 44px;
  padding: 10px 14px;
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
}
.ov-select:disabled{ opacity: 0.65; cursor: not-allowed; }

.ov-opt{
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  color: #e5e7eb;
  padding: 10px 14px;
  cursor: pointer;
}
.ov-opt:hover{ background: rgba(55,65,81,0.55); }

.ov-add{
  margin-top: 14px;
  width: 100%;
  border-radius: 999px;
  border: 1px solid rgba(56,189,248,0.35);
  background: linear-gradient(90deg, #38bdf8, #a855f7);
  color: #ecfeff;
  font-weight: 900;
  letter-spacing: 0.4px;
  padding: 12px 16px;
  cursor: pointer;
}
.ov-add:disabled{ opacity: 0.7; cursor: not-allowed; }
.ov-add:active{ transform: scale(0.997); opacity: 0.95; }

.ov-del{
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid rgba(248,113,113,0.55);
  background: rgba(239,68,68,0.10);
  cursor: pointer;
}
.ov-del:active{ opacity: 0.85; }
`;
