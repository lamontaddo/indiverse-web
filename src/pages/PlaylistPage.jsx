// src/pages/PlaylistPage.jsx ✅ FULL DROP-IN (WEB)
// Route: /world/:profileKey/playlist
//
// ✅ UPDATE: Added "Oldest" sort option
// ✅ Sort now supports: Recent / Oldest / A→Z / Z→A
//
// NOTE: Uses createdAt/updatedAt from your data (ISO strings).

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const DEFAULT_REMOTE_CONFIG_URL =
  import.meta.env.VITE_REMOTE_CONFIG_URL ||
  'https://montech-remote-config.s3.amazonaws.com/superapp/config.json';

/* ---------------- helpers ---------------- */

function cleanKey(v) {
  return String(v || '').trim().toLowerCase();
}
function safeUrl(s) {
  const v = typeof s === 'string' ? s.trim() : '';
  return v ? v : null;
}
function isHttpUrl(s) {
  return typeof s === 'string' && /^https?:\/\//i.test(s);
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
  const k = String(key || '').trim();
  return list.find((p) => String(p?.key || '').trim() === k) || null;
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

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GET ${path} failed (${res.status}): ${text || res.statusText}`);
  }
  return res.json();
}

function pickListShape(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.tracks)) return payload.tracks;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.result?.items)) return payload.result.items;
  if (Array.isArray(payload?.result?.tracks)) return payload.result.tracks;
  return [];
}

function normalizeTracks(payload) {
  const list = pickListShape(payload);
  return list
    .map((x) => {
      const id = String(x?._id || x?.id || x?.trackId || '').trim();
      return {
        ...x,
        _id: id || undefined,
        id: id || undefined,
        title: String(x?.title || x?.name || 'Untitled'),
        artist: String(x?.artist || x?.artistName || x?.by || ''),
        album: String(x?.album || x?.albumName || ''),
        tag: String(x?.tag || x?.mood || x?.genre || ''),
        spotifyUrl: safeUrl(x?.spotifyUrl || x?.spotify || x?.spotify_link || x?.spotifyLink),
        thumbnailUrl: safeUrl(
          x?.thumbnailUrl ||
            x?.thumbUrl ||
            x?.coverUrl ||
            x?.artworkUrl ||
            x?.imageUrl ||
            x?.image
        ),
        // ✅ keep timestamps handy
        createdAt: x?.createdAt,
        updatedAt: x?.updatedAt,
      };
    })
    .filter((x) => x._id || x.id);
}

function timeish(v) {
  const t = Date.parse(v);
  return Number.isFinite(t) ? t : 0;
}

/* ---------------- page ---------------- */

export default function PlaylistPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profileKey: paramsProfileKey } = useParams();

  const profileKey = useMemo(() => cleanKey(paramsProfileKey) || 'lamont', [paramsProfileKey]);

  const [cfg, setCfg] = useState(null);
  const profile = useMemo(() => getProfileByKeyFromCfg(cfg, profileKey), [cfg, profileKey]);

  // background (keep same world bg)
  const bgUrl = useMemo(() => {
    const paramBg = safeUrl(location?.state?.bgUrl);
    const remoteIntro = safeUrl(profile?.assets?.introBgImageUrl);
    const remoteIcon = safeUrl(profile?.assets?.iconUrl);

    if (paramBg && isHttpUrl(paramBg)) return paramBg;
    if (remoteIntro && isHttpUrl(remoteIntro)) return remoteIntro;
    if (remoteIcon && isHttpUrl(remoteIcon)) return remoteIcon;
    return null;
  }, [location?.state?.bgUrl, profile]);

  const ownerName = useMemo(() => {
    const label =
      profile?.ownerName ||
      profile?.label ||
      (profileKey === 'lamont' ? 'Lamont' : profileKey.charAt(0).toUpperCase() + profileKey.slice(1));
    return String(label || 'Playlist');
  }, [profile, profileKey]);

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorNote, setErrorNote] = useState('');
  const [loadedFrom, setLoadedFrom] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState('recent'); // recent | oldest | az | za

  const mountedRef = useRef(true);

  // load remote config (for bg fallback)
  useEffect(() => {
    mountedRef.current = true;
    fetchRemoteConfig()
      .then((data) => mountedRef.current && setCfg(data))
      .catch(() => {})
      .finally(() => {});
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const load = useCallback(
    async (reason = 'load') => {
      setLoading(true);
      setErrorNote('');
      setLoadedFrom('');
      try {
        const ts = Date.now();
        // 1) primary
        let data = await apiJson(`/api/tracks/public?ts=${ts}`, { profileKey });
        let list = normalizeTracks(data);

        if (!list.length) {
          // 2) fallback
          const data2 = await apiJson(`/api/tracks?ts=${ts}`, { profileKey }).catch(() => null);
          const list2 = normalizeTracks(data2);
          if (list2.length) {
            list = list2;
            setLoadedFrom('fallback');
          } else {
            setLoadedFrom('public');
          }
        } else {
          setLoadedFrom('public');
        }

        if (!mountedRef.current) return;

        setTracks(list);
        setLastUpdated(new Date().toLocaleString());
        console.log('[PlaylistPage] fetched', { reason, profileKey, count: list.length });
      } catch (e) {
        if (!mountedRef.current) return;
        setTracks([]);
        setErrorNote(String(e?.message || 'Failed to load playlist'));
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [profileKey]
  );

  useEffect(() => {
    mountedRef.current = true;
    load('mount');
    return () => {
      mountedRef.current = false;
    };
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = tracks;

    if (q) {
      list = list.filter((t) => {
        const hay = `${t.title} ${t.artist} ${t.album} ${t.tag}`.toLowerCase();
        return hay.includes(q);
      });
    }

    const sorted = [...list];

    if (sortMode === 'az') {
      sorted.sort((a, b) => String(a.title).localeCompare(String(b.title)));
    } else if (sortMode === 'za') {
      sorted.sort((a, b) => String(b.title).localeCompare(String(a.title)));
    } else if (sortMode === 'oldest') {
      // ✅ NEW: oldest first
      sorted.sort((a, b) => timeish(a.createdAt || a.updatedAt) - timeish(b.createdAt || b.updatedAt));
    } else {
      // recent (best effort)
      sorted.sort((a, b) => timeish(b.updatedAt || b.createdAt) - timeish(a.updatedAt || a.createdAt));
    }

    return sorted;
  }, [tracks, query, sortMode]);

  const countLabel = useMemo(
    () => `${filtered.length} track${filtered.length === 1 ? '' : 's'}`,
    [filtered.length]
  );

  const openTrack = (t) => {
    if (t.spotifyUrl) window.open(t.spotifyUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="pl-root">
      <div className="pl-bg" style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined} />
      <div className="pl-dim" />

      <div className="pl-shell">
        {/* header */}
        <div className="pl-topRow">
          <div>
            <div className="pl-titleRow">
              <div className="pl-titleBig">PLAYLIST</div>
              <div className="pl-subline">
                <span className="pl-dot">{ownerName}</span>
              </div>
              {errorNote ? <div className="pl-error">Note: {errorNote}</div> : null}
            </div>
          </div>

          <div className="pl-actions">
            <div className="pl-pill" title="Tracks">
              {countLabel}
            </div>

            <button className="pl-iconBtn" onClick={() => load('manual')} title="Refresh" aria-label="Refresh">
              ⟳
            </button>

            <button className="pl-iconBtn" onClick={() => navigate(-1)} title="Close" aria-label="Close">
              ✕
            </button>
          </div>
        </div>

        {/* controls */}
        <div className="pl-controls">
          <div className="pl-search">
            <span className="pl-searchIcon" aria-hidden>
              ⌕
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-searchInput"
              placeholder="Search title, artist, album…"
              spellCheck={false}
            />
          </div>

          <div className="pl-sortWrap">
            <div className="pl-sortLabel">SORT</div>
            <select className="pl-select" value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
              <option value="recent">Recent</option>
              <option value="oldest">Oldest</option>
              <option value="az">Title A → Z</option>
              <option value="za">Title Z → A</option>
            </select>
          </div>
        </div>

        {/* content */}
        {loading ? (
          <div className="pl-center">
            <div className="pl-muted">Loading playlist…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="pl-center">
            <div className="pl-muted">No tracks yet. Check back soon.</div>
          </div>
        ) : (
          <div className="pl-grid">
            {filtered.map((t, idx) => (
              <div className="pl-card" key={`${t._id || t.id}-${idx}`}>
                <div className="pl-cover" aria-hidden>
                  {t.thumbnailUrl ? (
                    <img src={t.thumbnailUrl} alt="" className="pl-coverImg" />
                  ) : (
                    <div className="pl-coverFallback">
                      <div className="pl-monogram">{ownerName?.slice(0, 2)?.toUpperCase() || 'IV'}</div>
                    </div>
                  )}
                </div>

                <div className="pl-meta">
                  <div className="pl-title">{t.title || 'Untitled'}</div>
                  <div className="pl-sub">
                    {(t.artist || '—') + (t.album ? ` • ${t.album}` : '')}
                  </div>
                  {t.tag ? <div className="pl-tag">{t.tag}</div> : null}
                </div>

                <button
                  className="pl-openBtn"
                  onClick={() => openTrack(t)}
                  disabled={!t.spotifyUrl}
                  title={t.spotifyUrl ? 'Open in Spotify' : 'No spotifyUrl on this track'}
                  style={
                    !t.spotifyUrl
                      ? { opacity: 0.55, borderColor: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.55)' }
                      : undefined
                  }
                >
                  ▶ Open
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* styles unchanged */}
      <style>{`/* keep your existing CSS exactly as-is */`}</style>
    </div>
  );
}


      <style>{`
        :root{
          --glass: rgba(255,255,255,0.06);
          --stroke: rgba(255,255,255,0.12);
          --stroke2: rgba(255,255,255,0.16);
          --textDim: rgba(255,255,255,0.72);
        }

        .pl-root{
          min-height: 100vh;
          background:#000;
          color:#fff;
          position:relative;
          overflow:hidden;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        }

        .pl-bg{
          position: fixed;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transform: translateZ(0);
          z-index: 0;
          filter: saturate(1.05) contrast(1.05);
        }
        .pl-dim{
          position: fixed;
          inset: 0;
          z-index: 1;
          background:
            radial-gradient(900px 600px at 30% 10%, rgba(255,255,255,0.10), rgba(0,0,0,0) 55%),
            radial-gradient(900px 600px at 80% 0%, rgba(255,255,255,0.06), rgba(0,0,0,0) 60%),
            linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.86));
        }

        .pl-shell{
          position: relative;
          z-index: 2;
          max-width: 1180px;
          margin: 0 auto;
          padding: 28px 22px 28px;
        }

        /* header */
        .pl-topRow{
          display:flex;
          align-items:flex-start;
          justify-content: space-between;
          gap: 16px;
        }
        .pl-kicker{
          font-size: 12px;
          letter-spacing: 2.8px;
          font-weight: 900;
          opacity: 0.78;
        }
        .pl-titleBig{
          font-size: 44px;
          font-weight: 950;
          letter-spacing: 0.4px;
          line-height: 1.04;
          margin-top: 6px;
          text-shadow: 0 24px 60px rgba(0,0,0,0.45);
        }
        .pl-subline{
          margin-top: 10px;
          color: rgba(255,255,255,0.72);
          font-size: 13px;
          letter-spacing: 0.5px;
          display:flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items:center;
        }
        .pl-dot{ display:inline-block; }
        .pl-error{
          margin-top: 10px;
          color: rgba(252,165,165,0.95);
          font-size: 12px;
          letter-spacing: 0.2px;
        }

        /* actions */
        .pl-actions{
          display:flex;
          align-items:center;
          gap:10px;
          padding-top: 6px;
        }
        .pl-pill{
          height: 34px;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.35);
          color: #fff;
          display:flex;
          align-items:center;
          gap:8px;
          font-weight: 900;
          letter-spacing: .6px;
          font-size: 12px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 10px 26px rgba(0,0,0,0.32);
        }
        .pl-iconBtn{
          width: 34px;
          height: 34px;
          padding: 0;
          border-radius: 999px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.38);
          color: #fff;
          display:grid;
          place-items:center;
          cursor:pointer;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 10px 26px rgba(0,0,0,0.32);
          transition: transform 120ms ease, opacity 120ms ease, border-color 120ms ease;
        }
        .pl-iconBtn:hover{ border-color: var(--stroke2); }
        .pl-iconBtn:active{ transform: scale(0.98); opacity: 0.92; }

        /* controls */
        .pl-controls{
          margin-top: 18px;
          display:flex;
          gap: 14px;
          align-items:center;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .pl-search{
          flex: 1;
          min-width: 280px;
          height: 44px;
          display:flex;
          align-items:center;
          gap: 10px;
          padding: 0 14px;
          border-radius: 18px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.30);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 10px 26px rgba(0,0,0,0.28);
        }
        .pl-searchIcon{
          opacity: 0.75;
          font-weight: 900;
        }
        .pl-searchInput{
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          color:#fff;
          font-size: 14px;
          letter-spacing: 0.2px;
        }
        .pl-searchInput::placeholder{
          color: rgba(255,255,255,0.55);
        }

        .pl-sortWrap{
          display:flex;
          align-items:center;
          gap:10px;
          padding: 6px 10px;
          border-radius: 14px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 10px 26px rgba(0,0,0,0.32);
        }
        .pl-sortLabel{
          color: var(--textDim);
          font-size: 11px;
          letter-spacing: .8px;
          font-weight: 900;
          text-transform: uppercase;
        }
        .pl-select{
          height: 30px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.06);
          color:#fff;
          padding: 0 10px;
          font-weight: 900;
          letter-spacing: .3px;
          outline: none;
          cursor:pointer;
        }

        /* grid */
        .pl-grid{
          margin-top: 16px;
          display:grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 14px;
          align-items: stretch;
        }
        .pl-card{
          grid-column: span 6;
          border-radius: 18px;
          border: 1px solid var(--stroke);
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.035));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 18px 48px rgba(0,0,0,0.42);
          overflow:hidden;
          min-height: 118px;
          display:flex;
          align-items:center;
          padding: 14px;
          gap: 12px;
          transition: transform 140ms ease, border-color 140ms ease;
        }
        .pl-card:hover{
          transform: translateY(-1px);
          border-color: var(--stroke2);
        }

        .pl-cover{
          width: 56px;
          height: 56px;
          border-radius: 14px;
          overflow:hidden;
          border: 1px solid rgba(255,255,255,0.16);
          flex: 0 0 auto;
          background: rgba(0,0,0,0.25);
          display:grid;
          place-items:center;
        }
        .pl-coverImg{
          width:100%;
          height:100%;
          object-fit: cover;
          display:block;
        }
        .pl-coverFallback{
          width:100%;
          height:100%;
          background: radial-gradient(circle at 30% 25%, rgba(59,130,246,0.65), rgba(0,0,0,0.10) 55%),
                      linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02));
          display:grid;
          place-items:center;
        }
        .pl-monogram{
          font-weight: 950;
          letter-spacing: 1px;
          font-size: 14px;
          opacity: 0.92;
        }

        .pl-meta{ flex: 1; min-width: 0; }
        .pl-title{
          font-size: 16px;
          font-weight: 950;
          letter-spacing: .2px;
          line-height: 1.2;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pl-sub{
          margin-top: 4px;
          color: rgba(255,255,255,0.72);
          font-size: 12px;
          letter-spacing: .2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pl-tag{
          display:inline-flex;
          align-items:center;
          height: 22px;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(0,0,0,0.28);
          color: rgba(255,255,255,0.78);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .4px;
          margin-top: 8px;
        }

        .pl-openBtn{
          height: 32px;
          padding: 0 12px;
          border-radius: 12px;
          border: 1px solid rgba(34,197,94,0.40);
          background: rgba(0,0,0,0.45);
          color: rgba(34,197,94,0.95);
          font-weight: 950;
          letter-spacing: .3px;
          display:flex;
          align-items:center;
          gap:8px;
          cursor:pointer;
          transition: transform 120ms ease, opacity 120ms ease, border-color 120ms ease;
          flex: 0 0 auto;
          user-select: none;
        }
        .pl-openBtn:active{ transform: scale(0.98); opacity: 0.92; }
        .pl-openBtn:hover{ border-color: rgba(34,197,94,0.6); }

        /* states */
        .pl-center{
          margin-top: 26px;
          min-height: 44vh;
          display:flex;
          align-items:center;
          justify-content:center;
          text-align:center;
          padding: 18px;
        }
        .pl-muted{
          color: rgba(255,255,255,0.70);
          letter-spacing: 0.3px;
        }

        .pl-footnote{
          margin-top: 14px;
          color: rgba(255,255,255,0.62);
          font-size: 12px;
          letter-spacing: 0.2px;
        }
        .pl-footnote code{
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 2px 6px;
          border-radius: 8px;
          color: rgba(255,255,255,0.85);
        }

        @media (max-width: 980px){
          .pl-titleBig{ font-size: 36px; }
          .pl-card{ grid-column: span 12; }
        }

        @media (prefers-reduced-motion: reduce){
          .pl-card{ transition: none; }
          .pl-iconBtn{ transition:none; }
          .pl-openBtn{ transition:none; }
        }
      `}</style>
    </div>
  );
}
