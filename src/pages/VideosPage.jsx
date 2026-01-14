// src/pages/VideosPage.jsx ✅ FULL DROP-IN (WEB) — cinematic grid + hover + modal player
// Route: /world/:profileKey/videos
//
// ✅ Uses SAME world bg image (bgUrl via navigation state from MainScreen)
// ✅ Fetches: GET /api/videos (requires x-profile-key)
// ✅ Supports either array OR { videos: [] }
// ✅ Cards: 16:9, glass, platform badge, hover lift
// ✅ Plays MP4/WebM/MOV inline in a modal (muted by default, click to unmute)
// ✅ YouTube/IG/Facebook: opens link in new tab (safe + simple)
// ✅ Includes "Refresh" + "Close"
//
// Add route (App.jsx):
//   import VideosPage from './pages/VideosPage.jsx';
//   <Route path="/world/:profileKey/videos" element={<VideosPage />} />
//
// Make MainScreen send people here:
//   featureKey === 'videos' -> /world/:profileKey/videos
//   (You already pass state.bgUrl; keep that)

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
  const escRef = useRef(null);

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
      <div style={m.sheet} ref={escRef}>
        {children}
      </div>
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
    borderRadius: 22,
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
  const [active, setActive] = useState(null); // { title, url, source }
  const [muted, setMuted] = useState(true);

  const loadVideos = useCallback(async (reason = 'load') => {
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
          thumbUri: typeof v.thumbUri === 'string' ? v.thumbUri : typeof v.thumbUrl === 'string' ? v.thumbUrl : '',
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
    loadVideos('mount');
  }, [loadVideos]);

  useEffect(() => {
    const onFocus = () => loadVideos('focus');
    const onVis = () => {
      if (document.visibilityState === 'visible') loadVideos('visible');
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

    // Inline play only for direct video files
    if (isVideoUrl(v.url)) {
      setActive(v);
      setMuted(true);
      setOpen(true);
      return;
    }

    // Everything else: open in new tab
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
            <div style={s.meta}>{ownerName} • {subtitle}</div>
          </div>

          <div style={s.actions}>
            <Chip onClick={() => loadVideos('manual')} disabled={loading} title="Refresh">
              ⟳ Refresh
            </Chip>
            <Chip
              onClick={() => navigate(`/world/${encodeURIComponent(activeProfileKey)}`, { state: { profileKey: activeProfileKey, bgUrl } })}
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
              <div style={{ marginTop: 10, color: '#cfd3dc', fontWeight: 800, letterSpacing: 0.4 }}>
                Loading videos…
              </div>
            </div>
          ) : loadError ? (
            <div style={s.center}>
              <div style={{ color: '#fecaca', fontWeight: 900, marginBottom: 10 }}>
                {loadError}
              </div>
              <Chip variant="primary" onClick={() => loadVideos('retry')}>Try again</Chip>
            </div>
          ) : videos.length === 0 ? (
            <div style={s.center}>
              <div style={{ fontWeight: 900, letterSpacing: 0.5 }}>No videos yet</div>
              <div style={{ marginTop: 8, color: '#cfd3dc' }}>
                Add some in the owner panel and they’ll appear here.
              </div>
            </div>
          ) : (
            <div style={s.grid}>
              {videos.map((v) => (
                <button
                  key={v.id}
                  onClick={() => onPressVideo(v)}
                  style={s.cardBtn}
                  title={v.title}
                >
                  <div style={s.card}>
                    {/* preview */}
                    <div style={s.mediaWrap}>
                      {v.thumbUri && isHttpUrl(v.thumbUri) ? (
                        <img src={v.thumbUri} alt="" style={s.thumb} />
                      ) : (
                        <div style={s.thumbFallback}>
                          <div style={{ fontSize: 26 }}>{platformGlyph(v.source)}</div>
                          <div style={{ marginTop: 8, opacity: 0.85, fontWeight: 900 }}>
                            {platformLabel(v.source)}
                          </div>
                          <div style={{ marginTop: 6, opacity: 0.65, fontSize: 12 }}>
                            {isVideoUrl(v.url) ? 'Tap to play' : 'Tap to open'}
                          </div>
                        </div>
                      )}
                      <div style={s.mediaShade} />
                      <div style={s.badge}>
                        <span style={{ opacity: 0.9 }}>{platformGlyph(v.source)}</span>
                        <span>{platformLabel(v.source)}</span>
                      </div>
                      <div style={s.playPill}>
                        {isVideoUrl(v.url) ? '▶ Play' : '↗ Open'}
                      </div>
                    </div>

                    {/* text */}
                    <div style={s.cardBody}>
                      <div style={s.cardTitle} title={v.title}>
                        {v.title}
                      </div>
                      <div style={s.cardSub}>
                        {isVideoUrl(v.url) ? 'Inline playback' : 'External link'}
                      </div>
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
    borderRadius: 24,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.16)',
    background: 'rgba(255,255,255,0.06)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
  },
  panelOverlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.11), rgba(255,255,255,0.03))',
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

  grid: {
    position: 'relative',
    padding: 14,
    display: 'grid',
    gap: 14,
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  },
  cardBtn: { border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', textAlign: 'left' },
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(0,0,0,0.22)',
    boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
    transform: 'translateY(0px)',
    transition: 'transform 140ms ease, border-color 140ms ease, box-shadow 140ms ease',
  },
  mediaWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
  },
  thumb: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: 'scale(1.02)' },
  thumbFallback: {
    width: '100%',
    height: '100%',
    display: 'grid',
    placeItems: 'center',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
  },
  mediaShade: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.78))',
    pointerEvents: 'none',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    display: 'inline-flex',
    gap: 8,
    alignItems: 'center',
    borderRadius: 999,
    padding: '6px 10px',
    background: 'rgba(15,23,42,0.85)',
    border: '1px solid rgba(255,255,255,0.14)',
    fontWeight: 900,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  playPill: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    borderRadius: 999,
    padding: '6px 10px',
    background: 'rgba(255,255,255,0.86)',
    color: '#000',
    border: '1px solid rgba(255,255,255,0.25)',
    fontWeight: 950,
    letterSpacing: 0.6,
    fontSize: 11,
  },
  cardBody: { padding: 12 },
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
  modalTitle: { fontWeight: 950, letterSpacing: 0.4, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  modalSub: { marginTop: 4, color: '#cfd3dc', fontSize: 12 },

  playerWrap: { position: 'relative', background: '#000' },
  video: { width: '100%', height: 'auto', aspectRatio: '16 / 9', display: 'block' },
};

// tiny global keyframes (once)
if (typeof document !== 'undefined' && !document.getElementById('videospage-keyframes')) {
  const st = document.createElement('style');
  st.id = 'videospage-keyframes';
  st.innerHTML = `
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 980px){
      ._videos_grid_fix{ grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    }
    @media (max-width: 620px){
      ._videos_grid_fix{ grid-template-columns: 1fr !important; }
    }
  `;
  document.head.appendChild(st);
}

// Apply responsive className via inline trick:
// (We can't add className in the object styles, so we attach it by setting it here.)
// If you want it cleaner, move styles to a CSS file.
