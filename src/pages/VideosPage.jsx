// src/pages/VideosPage.jsx ✅ FULL DROP-IN (WEB) — FLAT THUMB GRID + modal player
// Route: /world/:profileKey/videos
//
// ✅ Flat image tiles (no bubbles)
// ✅ Responsive grid works (3 -> 2 -> 1) via className
// ✅ Plays MP4/WebM/MOV inline in a modal (muted by default, click to unmute)
// ✅ YouTube/IG/Facebook: opens link in new tab
// ✅ Includes "Refresh" + "Close"

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const FALLBACK_BG =
  'https://images.unsplash.com/photo-1520975682071-a4a3a8a92dd7?auto=format&fit=crop&w=1600&q=60';

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

function isHttpUrl(s) {
  return typeof s === 'string' && /^https?:\/\//i.test(s);
}

function isVideoUrl(url) {
  return typeof url === 'string' && /\.(mp4|mov|m4v|webm)(\?|$)/i.test(url);
}

function platformLabel(source) {
  const s = String(source || '').toLowerCase();
  if (s.includes('youtube')) return 'YouTube';
  if (s.includes('instagram')) return 'Instagram';
  if (s.includes('facebook')) return 'Facebook';
  if (s.includes('local')) return 'Local';
  return 'Original';
}

function platformGlyph(source) {
  const s = String(source || '').toLowerCase();
  if (s.includes('youtube')) return '▶️';
  if (s.includes('instagram')) return '📸';
  if (s.includes('facebook')) return 'f';
  if (s.includes('local')) return '🎞️';
  return '◉';
}

async function apiJson(path, { profileKey } = {}) {
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

  const text = await res.text().catch(() => '');
  const json = text ? (() => { try { return JSON.parse(text); } catch { return null; } })() : null;

  if (!res.ok) {
    const msg =
      json?.message || json?.error || (text && text.length < 220 ? text : '') || res.statusText;
    throw new Error(`GET ${path} failed (${res.status}): ${msg || 'Request failed'}`);
  }

  return json ?? {};
}

function Chip({ children, onClick, variant = 'ghost', disabled, title }) {
  const styles = {
    base: {
      borderRadius: 999,
      padding: '8px 12px',
      border: '1px solid rgba(255,255,255,0.16)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      fontWeight: 900,
      letterSpacing: 0.7,
      fontSize: 12,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      userSelect: 'none',
      background: 'rgba(255,255,255,0.08)',
      color: '#fff',
    },
    primary: {
      background: 'rgba(255,255,255,0.86)',
      color: '#000',
      border: '1px solid rgba(255,255,255,0.25)',
    },
  };

  return (
    <button
      title={title}
      onClick={disabled ? undefined : onClick}
      style={{ ...styles.base, ...(variant === 'primary' ? styles.primary : null) }}
    >
      {children}
    </button>
  );
}

function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div style={m.modalRoot} role="dialog" aria-modal="true">
      <div style={m.backdrop} onClick={onClose} />
      <div style={m.sheet}>{children}</div>
    </div>
  );
}

const m = {
  modalRoot: { position: 'fixed', inset: 0, zIndex: 50, display: 'grid', placeItems: 'center', padding: 16 },
  backdrop: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(8px)' },
  sheet: {
    position: 'relative',
    zIndex: 2,
    width: 'min(980px, 96vw)',
    borderRadius: 14,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.16)',
    background: 'rgba(15,23,42,0.55)',
    boxShadow: '0 30px 90px rgba(0,0,0,0.55)',
  },
};

export default function VideosPage() {
  const navigate = useNavigate();
  const { profileKey: paramsProfileKey } = useParams();
  const location = useLocation();

  const activeProfileKey = useMemo(() => resolveProfileKeyWeb(paramsProfileKey), [paramsProfileKey]);

  useEffect(() => {
    try {
      localStorage.setItem('profileKey', activeProfileKey);
    } catch {}
  }, [activeProfileKey]);

  const bgUrl = useMemo(() => {
    const fromState = typeof location?.state?.bgUrl === 'string' ? location.state.bgUrl.trim() : '';
    return fromState || FALLBACK_BG;
  }, [location?.state?.bgUrl]);

  const ownerName = useMemo(() => {
    const k = activeProfileKey || 'owner';
    return k === 'lamont' ? 'Lamont' : k.charAt(0).toUpperCase() + k.slice(1);
  }, [activeProfileKey]);

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // modal player state
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [muted, setMuted] = useState(true);

  const loadVideos = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError('');

      const ts = Date.now();
      const data = await apiJson(`/api/videos?ts=${ts}`, { profileKey: activeProfileKey });

      const list = Array.isArray(data) ? data : Array.isArray(data?.videos) ? data.videos : [];

      const mapped = list
        .filter(Boolean)
        .map((v, idx) => ({
          id: String(v.id || v._id || `v-${idx}`),
          title: String(v.title || 'Untitled'),
          source: String(v.source || v.platform || 'other').toLowerCase(),
          url: typeof v.url === 'string' ? v.url : '',
          thumbUri:
            typeof v.thumbUri === 'string'
              ? v.thumbUri
              : typeof v.thumbUrl === 'string'
                ? v.thumbUrl
                : '',
        }))
        .filter((v) => !!v.url);

      setVideos(mapped);
    } catch (e) {
      setLoadError(String(e?.message || 'Unable to load videos'));
    } finally {
      setLoading(false);
    }
  }, [activeProfileKey]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  useEffect(() => {
    const onFocus = () => loadVideos();
    const onVis = () => {
      if (document.visibilityState === 'visible') loadVideos();
    };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [loadVideos]);

  const onPressVideo = useCallback((v) => {
    if (!v?.url) return;

    if (isVideoUrl(v.url)) {
      setActive(v);
      setMuted(true);
      setOpen(true);
      return;
    }

    try {
      window.open(v.url, '_blank', 'noopener,noreferrer');
    } catch {}
  }, []);

  const subtitle = useMemo(() => {
    const n = videos.length;
    return n === 1 ? '1 video' : `${n} videos`;
  }, [videos.length]);

  return (
    <div style={s.page}>
      <div style={{ ...s.bg, backgroundImage: `url(${bgUrl})` }} />
      <div style={s.dim} />

      <div style={s.shell}>
        <div style={s.header}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={s.titleRow}>
              <div style={s.title}>Videos</div>
              <div style={s.kicker}>presence • reels • energy</div>
            </div>
            <div style={s.meta}>
              {ownerName} • {subtitle}
            </div>
          </div>

          <div style={s.actions}>
            <Chip onClick={loadVideos} disabled={loading} title="Refresh">
              ⟳ Refresh
            </Chip>
            <Chip
              onClick={() =>
                navigate(`/world/${encodeURIComponent(activeProfileKey)}`, {
                  state: { profileKey: activeProfileKey, bgUrl },
                })
              }
              title="Close"
            >
              ✕ Close
            </Chip>
          </div>
        </div>

        <div style={s.panel}>
          <div style={s.panelOverlay} />

          {loading ? (
            <div style={s.center}>
              <div style={s.spinner} />
              <div style={s.loadingText}>Loading videos…</div>
            </div>
          ) : loadError ? (
            <div style={s.center}>
              <div style={s.errorText}>{loadError}</div>
              <Chip variant="primary" onClick={loadVideos}>
                Try again
              </Chip>
            </div>
          ) : videos.length === 0 ? (
            <div style={s.center}>
              <div style={s.emptyTitle}>No videos yet</div>
              <div style={s.emptySub}>Add some in the owner panel and they’ll appear here.</div>
            </div>
          ) : (
            <div className="_videos_grid_fix" style={s.grid}>
              {videos.map((v) => (
                <button
                  key={v.id}
                  className="_videos_card_btn"
                  onClick={() => onPressVideo(v)}
                  style={s.cardBtn}
                  title={v.title}
                >
                  <div className="_videos_card" style={s.card}>
                    <div style={s.mediaWrap}>
                      {v.thumbUri && isHttpUrl(v.thumbUri) ? (
                        <img src={v.thumbUri} alt="" style={s.thumb} />
                      ) : (
                        <div style={s.thumbFallback}>
                          <div style={{ fontSize: 22 }}>{platformGlyph(v.source)}</div>
                          <div style={{ marginTop: 8, fontWeight: 900, opacity: 0.9 }}>
                            {platformLabel(v.source)}
                          </div>
                          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
                            {isVideoUrl(v.url) ? 'Play' : 'Open'}
                          </div>
                        </div>
                      )}

      
                    </div>

                    <div style={s.cardBody}>
                      <div style={s.cardTitle} title={v.title}>
                        {v.title}
                      </div>
                      <div style={s.cardSub}>{isVideoUrl(v.url) ? 'Plays here' : 'Opens new tab'}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={s.footer}>
          Tip: MP4/WebM/MOV plays in-app. YouTube/IG/Facebook opens in a new tab.
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setActive(null);
        }}
      >
        <div style={s.modalTop}>
          <div style={{ minWidth: 0 }}>
            <div style={s.modalTitle}>{active?.title || 'Video'}</div>
            <div style={s.modalSub}>{platformLabel(active?.source || '')}</div>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Chip onClick={() => setMuted((m) => !m)} title="Toggle mute">
              {muted ? '🔇 Muted' : '🔊 Sound'}
            </Chip>
            <Chip onClick={() => setOpen(false)} title="Close player">
              ✕
            </Chip>
          </div>
        </div>

        <div style={s.playerWrap}>
          {active?.url ? (
            <video
              key={active.url}
              src={active.url}
              style={s.video}
              controls
              autoPlay
              playsInline
              muted={muted}
            />
          ) : (
            <div style={s.center}>No source</div>
          )}
        </div>
      </Modal>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#000',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
  },
  bg: {
    position: 'fixed',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transform: 'translateZ(0)',
    zIndex: 0,
  },
  dim: {
    position: 'fixed',
    inset: 0,
    zIndex: 1,
    background:
      'radial-gradient(circle at 20% 10%, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 45%, rgba(0,0,0,0.70) 78%), linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.90))',
  },
  shell: {
    position: 'relative',
    zIndex: 2,
    maxWidth: 1120,
    margin: '0 auto',
    padding: '18px 18px 28px',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-end',
    marginTop: 6,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  titleRow: { display: 'flex', flexDirection: 'column', gap: 6 },
  title: { fontSize: 26, fontWeight: 950, letterSpacing: 1.2, textTransform: 'uppercase' },
  kicker: { color: '#cfd3dc', fontSize: 12, letterSpacing: 0.8, textTransform: 'uppercase' },
  meta: { color: '#94a3b8', fontSize: 12, letterSpacing: 0.3, fontWeight: 800 },
  actions: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' },

  panel: {
    position: 'relative',
    borderRadius: 18,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.16)',
    background: 'rgba(255,255,255,0.06)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
  },
  panelOverlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))',
  },

  center: {
    minHeight: '60vh',
    display: 'grid',
    placeItems: 'center',
    textAlign: 'center',
    padding: 18,
  },

  spinner: {
    width: 42,
    height: 42,
    borderRadius: 999,
    border: '3px solid rgba(255,255,255,0.18)',
    borderTopColor: 'rgba(255,255,255,0.75)',
    animation: 'spin 0.9s linear infinite',
  },
  loadingText: { marginTop: 10, color: '#cfd3dc', fontWeight: 800, letterSpacing: 0.4 },
  errorText: { color: '#fecaca', fontWeight: 900, marginBottom: 10 },
  emptyTitle: { fontWeight: 900, letterSpacing: 0.5 },
  emptySub: { marginTop: 8, color: '#cfd3dc' },

  // FLAT GRID
  grid: {
    position: 'relative',
    padding: 14,
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  },

  cardBtn: {
    border: 'none',
    background: 'transparent',
    padding: 0,
    cursor: 'pointer',
    textAlign: 'left',
  },

  // flatter tile
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(0,0,0,0.18)',
    boxShadow: '0 10px 22px rgba(0,0,0,0.28)',
    transform: 'translateY(0px)',
    transition: 'transform 140ms ease, border-color 140ms ease, box-shadow 140ms ease',
  },

  mediaWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
    background: 'rgba(255,255,255,0.04)',
  },
  thumb: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  thumbFallback: {
    width: '100%',
    height: '100%',
    display: 'grid',
    placeItems: 'center',
    color: '#fff',
  },

  topBar: {
    position: 'absolute',
    inset: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    pointerEvents: 'none',
  },
  leftTag: {
    display: 'inline-flex',
    gap: 8,
    alignItems: 'center',
    borderRadius: 8,
    padding: '6px 8px',
    background: 'rgba(0,0,0,0.55)',
    border: '1px solid rgba(255,255,255,0.14)',
    fontWeight: 900,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    backdropFilter: 'blur(6px)',
  },
  rightTag: {
    borderRadius: 8,
    padding: '6px 8px',
    background: 'rgba(255,255,255,0.86)',
    color: '#000',
    border: '1px solid rgba(255,255,255,0.25)',
    fontWeight: 950,
    letterSpacing: 0.6,
    fontSize: 11,
  },

  cardBody: { padding: 10 },
  cardTitle: {
    fontWeight: 950,
    letterSpacing: 0.3,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cardSub: { marginTop: 6, color: '#cfd3dc', fontSize: 12, letterSpacing: 0.3 },

  footer: { marginTop: 10, fontSize: 11, color: '#94a3b8' },

  modalTop: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
    padding: 14,
    borderBottom: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(0,0,0,0.20)',
  },
  modalTitle: {
    fontWeight: 950,
    letterSpacing: 0.4,
    fontSize: 14,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  modalSub: { marginTop: 4, color: '#cfd3dc', fontSize: 12 },

  playerWrap: { position: 'relative', background: '#000' },
  video: { width: '100%', height: 'auto', aspectRatio: '16 / 9', display: 'block' },
};

// tiny global keyframes + responsive + hover
if (typeof document !== 'undefined' && !document.getElementById('videospage-keyframes')) {
  const st = document.createElement('style');
  st.id = 'videospage-keyframes';
  st.innerHTML = `
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Responsive grid */
    @media (max-width: 980px){
      ._videos_grid_fix{ grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    }
    @media (max-width: 620px){
      ._videos_grid_fix{ grid-template-columns: 1fr !important; }
    }

    /* Subtle hover lift (kept minimal) */
    ._videos_card_btn:hover ._videos_card{
      transform: translateY(-2px);
      border-color: rgba(255,255,255,0.22);
      box-shadow: 0 16px 30px rgba(0,0,0,0.35);
    }
  `;
  document.head.appendChild(st);
}
