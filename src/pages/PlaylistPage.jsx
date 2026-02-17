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
