// src/pages/MusicPage.jsx ✅ FULL DROP-IN (WEB) — DIRECT FIX (NO EXTRA CHANGES)
// ✅ Fixes blank screen by hardening apiJsonOrThrow JSON parsing (prevents crash on non-JSON/empty responses)
// ✅ Keeps YOUR existing layout + logic (catalog, stream, checkout, preview stop, refresh on focus)

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const DEFAULT_REMOTE_CONFIG_URL =
  import.meta.env.VITE_REMOTE_CONFIG_URL ||
  "https://montech-remote-config.s3.amazonaws.com/superapp/config.json";

function cleanKey(v) {
  return String(v || "").trim().toLowerCase();
}
function safeUrl(s) {
  const v = typeof s === "string" ? s.trim() : "";
  return v ? v : null;
}
function isHttpUrl(s) {
  return typeof s === "string" && /^https?:\/\//i.test(s.trim());
}

/* -------------------- JWT decode helpers (no deps) -------------------- */
function isMongoObjectId(s) {
  return typeof s === "string" && /^[a-f0-9]{24}$/i.test(s.trim());
}
function decodeJwtPayload(jwtToken) {
  try {
    const t = String(jwtToken || "").trim();
    if (!t) return null;
    const parts = t.split(".");
    if (parts.length < 2) return null;

    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4 ? "=".repeat(4 - (b64.length % 4)) : "";
    const json = atob(b64 + pad);

    return JSON.parse(json);
  } catch {
    return null;
  }
}
function decodeJwtUserId(jwtToken) {
  const p = decodeJwtPayload(jwtToken);
  if (!p) return null;

  const direct = p.userId || p.id || p._id || null;
  if (direct) return String(direct);

  const sub = p.sub ? String(p.sub) : "";
  if (isMongoObjectId(sub)) return sub;

  return null;
}

/* -------------------- API helpers -------------------- */
function apiBase() {
  const base = String(import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/+$/, "");
  return base;
}

// ✅ DIRECT FIX: harden JSON parsing so page never crashes to blank screen
async function apiJsonOrThrow(path, { method = "GET", headers = {}, body } = {}) {
  const base = apiBase();
  const url = `${base}${path}`;

  const res = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      ...headers,
    },
    body,
    credentials: "include",
  });

  const text = await res.text().catch(() => "");

  if (!res.ok) {
    throw new Error(`${method} ${path} failed (${res.status}): ${text || res.statusText}`);
  }

  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    // if backend/proxy returns HTML or empty-ish payload, do not crash UI
    return {};
  }
}

async function fetchRemoteConfig({ url = DEFAULT_REMOTE_CONFIG_URL, timeoutMs = 9000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { cache: "no-store", signal: ctrl.signal });
    if (!res.ok) throw new Error(`remote config fetch failed: ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}
function getProfileByKeyFromCfg(cfg, key) {
  const list = Array.isArray(cfg?.profiles) ? cfg.profiles : [];
  const k = String(key || "").trim();
  return list.find((p) => String(p?.key || "").trim() === k) || null;
}

function moneyFromCents(cents, currency = "usd") {
  const n = Number(cents || 0) / 100;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: String(currency || "usd").toUpperCase(),
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}
function formatTime(seconds) {
  const s = Math.max(0, Math.floor(Number(seconds || 0)));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export default function MusicPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profileKey: paramsProfileKey } = useParams();
  const profileKey = useMemo(() => cleanKey(paramsProfileKey) || "lamont", [paramsProfileKey]);

  // auth token (match your app) ✅ FIX: reactive token
  const [token, setToken] = useState(() => localStorage.getItem("buyerToken") || "");
  const isAuthed = !!token;
  const buyerUserId = useMemo(() => decodeJwtUserId(token), [token]);

  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem("buyerToken") || "");

    window.addEventListener("focus", syncToken);
    window.addEventListener("storage", syncToken);
    syncToken();

    return () => {
      window.removeEventListener("focus", syncToken);
      window.removeEventListener("storage", syncToken);
    };
  }, [location?.key]);

  useEffect(() => {
    const payload = decodeJwtPayload(token);
    console.log("[MusicPage] auth =>", {
      isAuthed,
      hasToken: !!token,
      tokenParts: token ? token.split(".").length : 0,
      buyerUserId: buyerUserId || null,
      jwtKeys: payload ? Object.keys(payload) : [],
      sub: payload?.sub || null,
    });
  }, [isAuthed, token, buyerUserId]);

  // remote config for bg + label
  const [cfg, setCfg] = useState(null);
  const profile = useMemo(() => getProfileByKeyFromCfg(cfg, profileKey), [cfg, profileKey]);

  const bgUrl = useMemo(() => {
    const paramBg = safeUrl(location?.state?.bgUrl);
    const remoteIntro = safeUrl(profile?.assets?.introBgImageUrl);
    const remoteIcon = safeUrl(profile?.assets?.iconUrl);

    if (paramBg && isHttpUrl(paramBg)) return paramBg;
    if (remoteIntro && isHttpUrl(remoteIntro)) return remoteIntro;
    if (remoteIcon && isHttpUrl(remoteIcon)) return remoteIcon;
    return null;
  }, [location?.state?.bgUrl, profile]);

  const OWNER_NAME = useMemo(() => {
    return (
      profile?.label ||
      profile?.brandTopTitle ||
      profile?.OWNER_NAME ||
      (profileKey ? profileKey.charAt(0).toUpperCase() + profileKey.slice(1) : "Owner")
    );
  }, [profile, profileKey]);

  useEffect(() => {
    let alive = true;
    fetchRemoteConfig()
      .then((d) => alive && setCfg(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // catalog
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [errorNote, setErrorNote] = useState("");

  // player
  const audioRef = useRef(null);
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPreview, setIsPreview] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [positionSec, setPositionSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const tickRef = useRef(null);

  const buildHeaders = useCallback(
    (extra = {}) => {
      const h = { "x-profile-key": String(profileKey || ""), ...extra };
      if (token) h.Authorization = `Bearer ${token}`;
      if (buyerUserId) h["x-user-id"] = String(buyerUserId);
      return h;
    },
    [profileKey, token, buyerUserId]
  );

  const stopTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const stopCurrent = useCallback(async () => {
    stopTick();
    try {
      const a = audioRef.current;
      if (a) {
        a.pause();
        a.src = "";
        audioRef.current = null;
      }
    } catch {}
    setPlayingTrackId(null);
    setCurrentTrack(null);
    setIsPlaying(false);
    setPositionSec(0);
    setDurationSec(0);
  }, [stopTick]);

  const normalizeCatalogTracks = useCallback((arr) => {
    return (arr || []).map((t) => ({
      ...t,
      isOwned: typeof t.isOwned === "boolean" ? t.isOwned : !!t.isUnlocked,
    }));
  }, []);

  const reloadCatalog = useCallback(async () => {
    setErrorNote("");
    try {
      const data = await apiJsonOrThrow("/api/music/catalog", {
        headers: buildHeaders(),
      });

      setAlbums(Array.isArray(data?.albums) ? data.albums : []);
      setTracks(normalizeCatalogTracks(Array.isArray(data?.tracks) ? data.tracks : []));
    } catch (e) {
      console.error("[MusicPage] reloadCatalog error =>", e?.message || e);
      setErrorNote(String(e?.message || "Unable to load music right now."));
    }
  }, [buildHeaders, normalizeCatalogTracks]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        await reloadCatalog();
      } finally {
        if (alive) setLoading(false);
      }
    })();

    const onFocus = () => reloadCatalog();
    window.addEventListener("focus", onFocus);

    return () => {
      alive = false;
      window.removeEventListener("focus", onFocus);
      stopCurrent();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileKey]);

  const filteredTracks = useMemo(() => {
    if (!selectedAlbumId) return tracks;

    const selectedAlbum = albums.find((a) => a._id === selectedAlbumId);
    if (!selectedAlbum) return tracks;

    return tracks.filter((t) => {
      if (t.albumId && t.albumId === selectedAlbumId) return true;
      if (t.albumTitle && t.albumTitle === selectedAlbum.title) return true;
      return false;
    });
  }, [tracks, albums, selectedAlbumId]);

  const currentAlbumLabel = useMemo(() => {
    return selectedAlbumId ? albums.find((a) => a._id === selectedAlbumId)?.title : null;
  }, [albums, selectedAlbumId]);

  const ensureAuthed = useCallback(() => {
    if (isAuthed && token) return true;
    navigate("/auth/login", {
      state: { nextRoute: `/world/${profileKey}/music`, nextState: { bgUrl } },
    });
    return false;
  }, [isAuthed, token, navigate, profileKey, bgUrl]);

  const createCheckoutSession = useCallback(
    async ({ itemType, itemId }) => {
      if (!ensureAuthed()) throw new Error("Please log in to unlock.");

      const body =
        itemType === "track"
          ? { itemType: "track", trackId: itemId }
          : itemType === "album"
          ? { itemType: "album", albumId: itemId }
          : { itemType, itemId };

      const json = await apiJsonOrThrow("/api/checkout/session", {
        method: "POST",
        headers: {
          "x-profile-key": String(profileKey || ""),
          Authorization: `Bearer ${String(token)}`,
          ...(buyerUserId ? { "x-user-id": String(buyerUserId) } : {}),
        },
        body: JSON.stringify(body),
      });

      if (!json?.url) throw new Error("No checkout URL returned");
      return String(json.url);
    },
    [ensureAuthed, profileKey, token, buyerUserId]
  );

  const startTrack = useCallback(
    async (track, preview = true) => {
      try {
        await stopCurrent();

        const mode = preview ? "preview" : "full";
        setIsPreview(preview);
        setPlayingTrackId(track._id);
        setCurrentTrack(track);
        setIsPlaying(false);
        setPositionSec(0);
        setDurationSec(0);

        const data = await apiJsonOrThrow(`/api/music/tracks/${track._id}/stream?mode=${mode}`, {
          headers: buildHeaders(),
        });

        if (!data?.url) throw new Error("No stream url returned");

        const a = new Audio();
        a.src = data.url;
        a.preload = "auto";
        a.crossOrigin = "anonymous";
        audioRef.current = a;

        a.onloadedmetadata = () => {
          const d = Number.isFinite(a.duration) ? a.duration : 0;
          setDurationSec(d || (track.durationSeconds ? Number(track.durationSeconds) : 0));
        };

        const previewLimit = Math.max(1, Number(track.previewSeconds || 30));

        stopTick();
        tickRef.current = setInterval(() => {
          if (!audioRef.current) return;
          const cur = Number(audioRef.current.currentTime || 0);
          setPositionSec(cur);

          if (preview && cur >= previewLimit) {
            stopCurrent();
          }
        }, 250);

        a.onended = () => {
          if (!preview && isRepeating) {
            try {
              a.currentTime = 0;
              a.play().catch(() => {});
            } catch {}
          } else {
            stopCurrent();
          }
        };

        await a.play();
        setIsPlaying(true);
      } catch (e) {
        console.error("[MusicPage] play error =>", e?.message || e);
        stopCurrent();
        alert("Playback error: unable to play this track right now.");
      }
    },
    [buildHeaders, isRepeating, stopCurrent, stopTick]
  );

  const togglePlayPause = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return;

    try {
      if (!isPlaying) {
        await a.play();
        setIsPlaying(true);
      } else {
        a.pause();
        setIsPlaying(false);
      }
    } catch (e) {
      console.error("[MusicPage] toggle play/pause error =>", e?.message || e);
    }
  }, [isPlaying]);

  const seekTo = useCallback(
    (sec) => {
      const a = audioRef.current;
      if (!a) return;

      const maxBase = Number.isFinite(a.duration) ? a.duration : durationSec || 0;
      let max = maxBase;

      if (isPreview && currentTrack) {
        const previewLimit = Math.max(1, Number(currentTrack.previewSeconds || 30));
        max = Math.min(max || previewLimit, previewLimit);
      }

      const target = Math.max(0, Math.min(Number(sec || 0), max || 0));
      try {
        a.currentTime = target;
        setPositionSec(target);
      } catch {}
    },
    [durationSec, isPreview, currentTrack]
  );

  const seekBy = useCallback(
    (delta) => {
      seekTo(positionSec + delta);
    },
    [seekTo, positionSec]
  );

  const effectiveDurationSec = useMemo(() => {
    if (isPreview && currentTrack) return Math.max(1, Number(currentTrack.previewSeconds || 30));
    return Math.max(
      0,
      durationSec || (currentTrack?.durationSeconds ? Number(currentTrack.durationSeconds) : 0)
    );
  }, [isPreview, currentTrack, durationSec]);

  const progressPct = useMemo(() => {
    const d = effectiveDurationSec || 1;
    return Math.max(0, Math.min(100, (positionSec / d) * 100));
  }, [positionSec, effectiveDurationSec]);

  const unlockTrack = useCallback(
    async (track) => {
      if (!ensureAuthed()) return;

      const ok = confirm(`Open checkout to unlock "${track.title}"?`);
      if (!ok) return;

      // ✅ Use your existing approach (no new behavior)
      let win = null;
      try {
        win = window.open("", "_blank");
        if (win && win.document) {
          win.document.write(`
            <html>
              <head><title>Checkout</title></head>
              <body style="font-family:system-ui; padding:24px;">
                <h3>Opening secure checkout…</h3>
                <p>If nothing happens, return to the previous tab.</p>
              </body>
            </html>
          `);
          win.document.close();
        }
      } catch {
        win = null;
      }

      try {
        const url = await createCheckoutSession({ itemType: "track", itemId: String(track._id) });

        let navigated = false;
        if (win && !win.closed) {
          try {
            win.location.href = url;
            win.focus?.();
            navigated = true;
          } catch {
            navigated = false;
          }
        }

        if (!navigated) {
          window.location.href = url;
        }
      } catch (e) {
        try {
          win?.close?.();
        } catch {}
        alert(e?.message || "Could not start checkout.");
        console.error("[MusicPage] unlockTrack checkout error =>", e);
      }
    },
    [ensureAuthed, createCheckoutSession]
  );

  const unlockAlbum = useCallback(
    async (album) => {
      if (!ensureAuthed()) return;

      const ok = confirm(`Open checkout to unlock album "${album.title}"?`);
      if (!ok) return;

      let win = null;
      try {
        win = window.open("", "_blank");
        if (win && win.document) {
          win.document.write(`
            <html>
              <head><title>Checkout</title></head>
              <body style="font-family:system-ui; padding:24px;">
                <h3>Opening secure checkout…</h3>
                <p>If nothing happens, return to the previous tab.</p>
              </body>
            </html>
          `);
          win.document.close();
        }
      } catch {
        win = null;
      }

      try {
        const url = await createCheckoutSession({ itemType: "album", itemId: String(album._id) });

        let navigated = false;
        if (win && !win.closed) {
          try {
            win.location.href = url;
            win.focus?.();
            navigated = true;
          } catch {
            navigated = false;
          }
        }

        if (!navigated) {
          window.location.href = url;
        }
      } catch (e) {
        try {
          win?.close?.();
        } catch {}
        alert(e?.message || "Could not start checkout.");
        console.error("[MusicPage] unlockAlbum checkout error =>", e);
      }
    },
    [ensureAuthed, createCheckoutSession]
  );

  const handleBack = useCallback(() => {
    stopCurrent();
    navigate(-1);
  }, [navigate, stopCurrent]);

  return (
    <div className="ms-root">
      <div className="ms-bg" style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined} />
      <div className="ms-dim" />

      <div className="ms-shell">
        {/* header */}
        <div className="ms-top">
          <button className="ms-iconBtn" onClick={handleBack} aria-label="Close">
            ✕
          </button>

          <div className="ms-topCenter">
            <div className="ms-title">Music</div>
            {!isAuthed ? <div className="ms-authHint">Sign in to unlock full tracks.</div> : null}
          </div>

          <div className="ms-chip">
            <span className="ms-chipIcon">♫</span>
            <span className="ms-chipText">{OWNER_NAME} Radio</span>
          </div>
        </div>

        {errorNote ? <div className="ms-error">{errorNote}</div> : null}

        {/* content */}
        {loading ? (
          <div className="ms-center">
            <div className="ms-muted">Loading vibes…</div>
          </div>
        ) : (
          <div className="ms-body">
            {/* albums */}
            {albums.length ? (
              <div className="ms-section ms-narrow">
                <div className="ms-sectionHead">
                  <div className="ms-sectionTitle">Albums</div>
                  {selectedAlbumId ? (
                    <button className="ms-clear" onClick={() => setSelectedAlbumId(null)}>
                      Clear
                    </button>
                  ) : null}
                </div>

                <div className="ms-albums">
                  {albums.map((a) => {
                    const price = moneyFromCents(a.priceCents || 0, a.currency || "usd");
                    const selected = selectedAlbumId === a._id;
                    return (
                      <button
                        key={a._id}
                        className={`ms-albumCard ${selected ? "ms-albumCardSelected" : ""}`}
                        onClick={() => setSelectedAlbumId((prev) => (prev === a._id ? null : a._id))}
                      >
                        <div className="ms-albumArt">
                          {a.coverImageUrl ? (
                            <img src={a.coverImageUrl} alt="" />
                          ) : (
                            <div className="ms-albumArtPh">♫</div>
                          )}
                        </div>

                        <div className="ms-albumInfo">
                          <div className="ms-albumTop">
                            <div className="ms-albumTitle" title={a.title}>
                              {a.title}
                            </div>

                            <button
                              className="ms-unlockBtn"
                              onClick={(e) => {
                                e.stopPropagation();
                                unlockAlbum(a);
                              }}
                              title="Unlock (opens web checkout)"
                            >
                              <span className="ms-globe">🌐</span>
                              <span>Unlock</span>
                              <span className="ms-price">{price}</span>
                            </button>
                          </div>

                          <div className="ms-albumMeta">{a.trackCount || 0} tracks • Album</div>
                          {selected ? <div className="ms-viewing">Viewing</div> : null}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* tracks */}
            <div className="ms-section ms-narrow ms-sectionGrow">
              <div className="ms-sectionTitle">Tracks{currentAlbumLabel ? ` • ${currentAlbumLabel}` : ""}</div>

              <div className="ms-tracks">
                {filteredTracks.map((t) => {
                  const owned = !!t.isOwned;
                  const price = moneyFromCents(t.priceCents || 0, t.currency || "usd");
                  const isThis = playingTrackId === t._id;

                  const minutes = t.durationSeconds ? Math.round(Number(t.durationSeconds) / 60) : 0;
                  const sub = `${t.albumTitle || "Single"}${minutes ? ` • ${minutes} min` : ""}`;
                  const playIcon = isThis && isPlaying ? "⏸" : "▶";

                  return (
                    <div className={`ms-trackRow ${isThis ? "ms-trackRowActive" : ""}`} key={t._id}>
                      <div className="ms-trackLeft">
                        <div className="ms-trackArt">
                          {t.coverImageUrl ? (
                            <img src={t.coverImageUrl} alt="" />
                          ) : (
                            <div className="ms-trackArtPh">♫</div>
                          )}
                        </div>

                        <button
                          className={`ms-playBtn ${isThis ? "ms-playBtnActive" : ""}`}
                          onClick={() => {
                            if (isThis && audioRef.current) togglePlayPause();
                            else startTrack(t, !owned);
                          }}
                          aria-label="Play/Pause"
                          title={owned ? "Play" : "Play preview"}
                        >
                          {playIcon}
                        </button>

                        <div className="ms-trackText">
                          <div className="ms-trackTitle" title={t.title}>
                            {t.title}
                          </div>
                          <div className="ms-trackSub" title={sub}>
                            {sub}
                          </div>
                        </div>
                      </div>

                      <div className="ms-trackActions">
                        {!owned ? (
                          <button className="ms-unlockPill" onClick={() => unlockTrack(t)} title="Unlock (opens web checkout)">
                            <span className="ms-globe">🌐</span>
                            <span className="ms-unlockWord">Unlock</span>
                            <span className="ms-price">{price}</span>
                          </button>
                        ) : (
                          <div className="ms-ownedPill" title="Unlocked">
                            ✓ Unlocked
                          </div>
                        )}

                        <div className={`ms-badge ${owned ? "ms-badgeOwned" : ""}`}>
                          {owned ? "Full Access" : "30s Preview"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* player */}
        {currentTrack ? (
          <div className="ms-player">
            <div className="ms-playerTop">
              <div className="ms-playerArt">
                {currentTrack.coverImageUrl ? <img src={currentTrack.coverImageUrl} alt="" /> : <div className="ms-playerArtPh">♫</div>}
              </div>

              <div className="ms-playerText">
                <div className="ms-playerTitle" title={currentTrack.title}>
                  {currentTrack.title}
                </div>
                <div className="ms-playerSub" title={currentTrack.albumTitle || "Single"}>
                  {(currentTrack.albumTitle || "Single") + (isPreview ? " • Preview" : "")}
                </div>
              </div>

              <div className="ms-playerTime">
                {formatTime(positionSec)} / {formatTime(effectiveDurationSec)}
              </div>
            </div>

            <div
              className="ms-bar"
              role="slider"
              aria-label="Seek"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                seekTo(pct * effectiveDurationSec);
              }}
            >
              <div className="ms-barFill" style={{ width: `${progressPct}%` }} />
            </div>

            <div className="ms-controls">
              <button className="ms-ctl" onClick={() => seekBy(-10)} title="Rewind 10s">
                ⏮
              </button>
              <button className="ms-ctl ms-ctlPrimary" onClick={togglePlayPause} title="Play/Pause">
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button className="ms-ctl" onClick={() => seekBy(10)} title="Forward 10s">
                ⏭
              </button>
              <button className="ms-ctl" onClick={stopCurrent} title="Stop">
                ⏹
              </button>
              <button
                className={`ms-ctl ${isRepeating ? "ms-repeatOn" : ""}`}
                onClick={() => {
                  if (isPreview) return;
                  setIsRepeating((p) => !p);
                }}
                title={isPreview ? "Repeat disabled in preview" : "Repeat"}
                disabled={isPreview}
              >
                ⟲
              </button>
            </div>

            <div className="ms-playerNote">
              Tip: Locked tracks play a short preview. Use <span className="ms-noteStrong">Unlock</span> to open checkout.
            </div>
          </div>
        ) : null}
      </div>

      <style>{`
        :root{
          --glass: rgba(255,255,255,0.06);
          --stroke: rgba(255,255,255,0.12);
          --stroke2: rgba(255,255,255,0.16);
          --cyan: #00ffff;
        }

        .ms-root{
          min-height: 100vh;
          background:#000;
          color:#fff;
          position:relative;
          overflow:hidden;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        }

        .ms-bg{
          position: fixed;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 0;
          filter: saturate(1.05) contrast(1.05);
          transform: translateZ(0);
        }
        .ms-dim{
          position: fixed;
          inset: 0;
          z-index: 1;
          background:
            radial-gradient(900px 600px at 22% 8%, rgba(255,255,255,0.10), rgba(0,0,0,0) 55%),
            radial-gradient(900px 600px at 78% 0%, rgba(255,255,255,0.06), rgba(0,0,0,0) 60%),
            linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.90));
        }

        .ms-shell{
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 22px 22px 140px;
        }

        .ms-narrow{
          max-width: 980px;
          margin: 0 auto;
        }

        .ms-top{
          display:flex;
          align-items:center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 14px;
        }
        .ms-iconBtn{
          width: 36px; height: 36px;
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
        .ms-iconBtn:hover{ border-color: var(--stroke2); }
        .ms-iconBtn:active{ transform: scale(0.98); opacity: 0.92; }

        .ms-topCenter{
          flex: 1;
          display:flex;
          flex-direction: column;
          align-items: center;
          min-width: 0;
        }
        .ms-title{
          font-size: 34px;
          font-weight: 950;
          letter-spacing: 0.6px;
          text-shadow: 0 24px 60px rgba(0,0,0,0.45);
          line-height: 1.06;
        }
        .ms-authHint{
          margin-top: 6px;
          font-size: 12px;
          color: rgba(255,255,255,0.70);
          letter-spacing: 0.2px;
        }

        .ms-chip{
          height: 34px;
          display:flex;
          align-items:center;
          gap: 8px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.30);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 10px 26px rgba(0,0,0,0.28);
          white-space: nowrap;
        }
        .ms-chipIcon{ opacity: 0.9; }
        .ms-chipText{
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.4px;
          color: rgba(255,255,255,0.88);
        }

        .ms-error{
          margin-top: 6px;
          color: rgba(252,165,165,0.95);
          font-size: 12px;
          letter-spacing: 0.2px;
        }

        .ms-center{
          margin-top: 22px;
          min-height: 44vh;
          display:flex;
          align-items:center;
          justify-content:center;
          text-align:center;
          padding: 18px;
        }
        .ms-muted{
          color: rgba(255,255,255,0.70);
          letter-spacing: 0.3px;
        }

        .ms-body{
          display:flex;
          flex-direction: column;
          gap: 18px;
        }

        .ms-sectionGrow{ margin-top: 6px; }

        .ms-sectionHead{
          display:flex;
          align-items:center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 10px;
        }
        .ms-sectionTitle{
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 0.9px;
          color: rgba(255,255,255,0.90);
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .ms-sectionHead .ms-sectionTitle{ margin-bottom: 0; }

        .ms-clear{
          height: 30px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.28);
          color: rgba(255,255,255,0.86);
          cursor:pointer;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.3px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        /* Albums */
        .ms-albums{
          display:grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 12px;
        }
        .ms-albumCard{
          grid-column: span 6;
          border-radius: 18px;
          border: 1px solid var(--stroke);
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.035));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 18px 48px rgba(0,0,0,0.42);
          overflow:hidden;
          padding: 12px;
          display:flex;
          gap: 12px;
          align-items:center;
          cursor:pointer;
          text-align:left;
          color:#fff;
          transition: transform 140ms ease, border-color 140ms ease;
        }
        .ms-albumCard:hover{ transform: translateY(-1px); border-color: var(--stroke2); }
        .ms-albumCardSelected{ border-color: rgba(0,255,255,0.55); }

        .ms-albumArt{
          width: 82px; height: 82px;
          border-radius: 16px;
          overflow:hidden;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(0,0,0,0.25);
          flex: 0 0 auto;
        }
        .ms-albumArt img{ width:100%; height:100%; object-fit: cover; display:block; }
        .ms-albumArtPh{
          width:100%; height:100%;
          display:grid; place-items:center;
          color: rgba(0,255,255,0.9);
          font-weight: 950;
          font-size: 18px;
          background: radial-gradient(500px 220px at 30% 20%, rgba(0,255,255,0.18), rgba(0,0,0,0) 60%);
        }
        .ms-albumInfo{ flex:1; min-width:0; }
        .ms-albumTop{ display:flex; align-items:center; justify-content: space-between; gap: 12px; }
        .ms-albumTitle{
          font-weight: 950;
          font-size: 14px;
          letter-spacing: 0.2px;
          overflow:hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width:0;
          flex: 1;
        }
        .ms-albumMeta{ margin-top: 6px; color: rgba(255,255,255,0.68); font-size: 12px; }
        .ms-viewing{ margin-top: 6px; font-size: 11px; font-weight: 950; color: rgba(0,255,255,0.95); }

        .ms-unlockBtn{
          height: 30px;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(0,0,0,0.55);
          color: rgba(255,255,255,0.92);
          display:flex;
          align-items:center;
          gap: 8px;
          cursor:pointer;
          flex: 0 0 auto;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.2px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .ms-unlockBtn:hover{ border-color: rgba(255,255,255,0.22); }
        .ms-globe{ opacity: 0.9; }
        .ms-price{ opacity: 0.88; }

        /* Tracks */
        .ms-tracks{
          display:flex;
          flex-direction: column;
          gap: 12px;
        }

        .ms-trackRow{
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.10);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 18px 52px rgba(0,0,0,0.42);
          padding: 12px 12px;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 14px;
        }
        .ms-trackRow:hover{
          border-color: rgba(255,255,255,0.16);
          transform: translateY(-1px);
        }
        .ms-trackRowActive{
          border-color: rgba(0,255,255,0.34);
          box-shadow: 0 22px 60px rgba(0,0,0,0.50);
        }

        .ms-trackLeft{
          display:flex;
          align-items:center;
          gap: 12px;
          min-width:0;
        }

        .ms-trackArt{
          width: 46px;
          height: 46px;
          border-radius: 14px;
          overflow:hidden;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(0,0,0,0.25);
          flex: 0 0 auto;
        }
        .ms-trackArt img{ width:100%; height:100%; object-fit: cover; display:block; }
        .ms-trackArtPh{
          width:100%; height:100%;
          display:grid; place-items:center;
          color: rgba(0,255,255,0.9);
          font-weight: 950;
          font-size: 14px;
          background: radial-gradient(400px 180px at 30% 20%, rgba(0,255,255,0.16), rgba(0,0,0,0) 60%);
        }

        .ms-playBtn{
          width: 38px;
          height: 38px;
          border-radius: 999px;
          border: 1px solid rgba(0,255,255,0.55);
          background: rgba(0,0,0,0.35);
          color: rgba(0,255,255,0.95);
          display:grid;
          place-items:center;
          cursor:pointer;
          flex: 0 0 auto;
          transition: transform 120ms ease, background 120ms ease;
        }
        .ms-playBtn:hover{ background: rgba(0,255,255,0.10); }
        .ms-playBtn:active{ transform: scale(0.98); }
        .ms-playBtnActive{ background: rgba(0,255,255,0.12); }

        .ms-trackText{ min-width:0; }
        .ms-trackTitle{
          font-weight: 950;
          font-size: 15px;
          letter-spacing: 0.2px;
          overflow:hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 52vw;
        }
        .ms-trackSub{
          margin-top: 5px;
          color: rgba(255,255,255,0.64);
          font-size: 12px;
          overflow:hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 52vw;
        }

        .ms-trackActions{
          display:flex;
          flex-direction: column;
          align-items:flex-end;
          gap: 8px;
          min-width: 190px;
        }

        .ms-unlockPill{
          height: 34px;
          width: 100%;
          justify-content: center;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(0,0,0,0.55);
          color: rgba(255,255,255,0.92);
          display:flex;
          align-items:center;
          gap: 8px;
          cursor:pointer;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.2px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .ms-unlockPill:hover{ border-color: rgba(255,255,255,0.22); }
        .ms-unlockWord{ opacity: 0.95; }

        .ms-ownedPill{
          height: 34px;
          width: 100%;
          border-radius: 999px;
          border: 1px solid rgba(0,255,0,0.28);
          background: rgba(0,0,0,0.45);
          color: rgba(0,255,0,0.92);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.2px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .ms-badge{
          height: 24px;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid rgba(0,255,255,0.30);
          color: rgba(0,255,255,0.95);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.25px;
          display:flex;
          align-items:center;
          justify-content:center;
          background: rgba(0,0,0,0.26);
          width: fit-content;
        }
        .ms-badgeOwned{
          border-color: rgba(0,255,0,0.35);
          color: rgba(0,255,0,0.95);
        }

        .ms-player{
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          bottom: 16px;
          width: min(1200px, calc(100% - 32px));
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(0,0,0,0.38);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 20px 70px rgba(0,0,0,0.55);
          padding: 12px 12px 10px;
          z-index: 5;
        }

        .ms-playerTop{
          display:flex;
          align-items:center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .ms-playerArt{
          width: 44px;
          height: 44px;
          border-radius: 12px;
          overflow:hidden;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(0,0,0,0.25);
          flex: 0 0 auto;
        }
        .ms-playerArt img{ width:100%; height:100%; object-fit: cover; display:block; }
        .ms-playerArtPh{ width:100%; height:100%; display:grid; place-items:center; color: rgba(0,255,255,0.9); font-weight: 950; }

        .ms-playerText{ flex: 1; min-width:0; }
        .ms-playerTitle{ font-weight: 950; font-size: 13px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ms-playerSub{ margin-top: 4px; color: rgba(255,255,255,0.62); font-size: 12px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ms-playerTime{ color: rgba(255,255,255,0.80); font-size: 12px; font-weight: 900; white-space: nowrap; }

        .ms-bar{ height: 6px; border-radius: 999px; background: rgba(255,255,255,0.10); overflow:hidden; cursor:pointer; margin-bottom: 10px; }
        .ms-barFill{ height: 100%; border-radius: 999px; background: var(--cyan); width: 0%; }

        .ms-controls{ display:flex; align-items:center; justify-content: space-between; gap: 10px; }
        .ms-ctl{
          width: 36px;
          height: 36px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(0,0,0,0.28);
          color: rgba(255,255,255,0.92);
          display:grid;
          place-items:center;
          cursor:pointer;
          transition: transform 120ms ease, opacity 120ms ease;
        }
        .ms-ctl:active{ transform: scale(0.98); opacity: 0.92; }
        .ms-ctlPrimary{ background: var(--cyan); border-color: var(--cyan); color: #020617; font-weight: 950; }
        .ms-repeatOn{ background: var(--cyan); border-color: var(--cyan); color: #020617; }
        .ms-ctl:disabled{ opacity: 0.45; cursor:not-allowed; }

        .ms-playerNote{ margin-top: 8px; color: rgba(255,255,255,0.62); font-size: 12px; }
        .ms-noteStrong{ color: rgba(255,255,255,0.88); font-weight: 950; }

        @media (max-width: 980px){
          .ms-albumCard{ grid-column: span 12; }
          .ms-trackActions{ min-width: 170px; }
          .ms-trackTitle, .ms-trackSub{ max-width: 46vw; }
        }
        @media (max-width: 720px){
          .ms-title{ font-size: 28px; }
          .ms-chip{ display:none; }

          .ms-trackRow{
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .ms-trackActions{
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            min-width: 0;
          }
          .ms-unlockPill, .ms-ownedPill{ width: auto; padding: 0 12px; }
          .ms-trackTitle, .ms-trackSub{ max-width: 70vw; }
        }
        @media (prefers-reduced-motion: reduce){
          .ms-iconBtn, .ms-albumCard, .ms-playBtn, .ms-ctl, .ms-trackRow{ transition: none; }
        }
      `}</style>
    </div>
  );
}