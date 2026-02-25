// src/pages/AccountEntitlements.jsx ✅ FULL DROP-IN (ENTITLEMENTS ONLY)
// ✅ userId comes from buyerToken (JWT)
// ✅ Uses entitlements-only endpoints:
//    - GET /api/paid-videos/my
//    - GET /api/music/entitlements
// ✅ Handles both array and { ok, items } response shapes
// ✅ Clears ghost sessions if token invalid
// ✅ Authorization is primary; x-user-id is backcompat only

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function safeTrim(v) {
  return String(v || "").trim();
}

function isAuthedNow() {
  return (
    !!safeTrim(localStorage.getItem("buyerToken")) &&
    safeTrim(localStorage.getItem("auth:isAuthed")) === "1"
  );
}

// ---- JWT decode (no deps) ----
function base64UrlDecode(str) {
  try {
    const s = String(str || "").replace(/-/g, "+").replace(/_/g, "/");
    const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : "";
    const raw = atob(s + pad);
    const bytes = Uint8Array.from(raw, (c) => c.charCodeAt(0));
    const dec = new TextDecoder().decode(bytes);
    return dec;
  } catch {
    return null;
  }
}

function decodeJwt(token) {
  try {
    const t = safeTrim(token);
    const parts = t.split(".");
    if (parts.length !== 3) return null;
    const payloadStr = base64UrlDecode(parts[1]);
    if (!payloadStr) return null;
    return JSON.parse(payloadStr);
  } catch {
    return null;
  }
}

function readUserIdFromBuyerToken() {
  const token = safeTrim(localStorage.getItem("buyerToken"));
  if (!token) return null;

  const payload = decodeJwt(token);
  if (!payload) return null;

  const id =
    safeTrim(payload.userId) ||
    safeTrim(payload.id) ||
    safeTrim(payload.sub) ||
    safeTrim(payload.uid);

  return id || null;
}

function clearBuyerAuthStorage() {
  localStorage.removeItem("buyerToken");
  localStorage.removeItem("buyerUser");
  localStorage.removeItem("buyerUserId");
  localStorage.removeItem("auth:isAuthed");
}

function normalizeProfiles(cfg) {
  const list = Array.isArray(cfg?.profiles) ? cfg.profiles : [];
  return list
    .filter((p) => p?.enabled !== false && p?.apiBaseUrl)
    .map((p) => ({
      key: safeTrim(p?.key).toLowerCase(),
      label: safeTrim(p?.label || p?.name || p?.key || "Unknown"),
      apiBaseUrl: safeTrim(p?.apiBaseUrl).replace(/\/+$/, ""),
    }))
    .filter((p) => p.key && p.apiBaseUrl);
}

function secondsToMMSS(sec) {
  const n = Number(sec);
  if (!Number.isFinite(n) || n <= 0) return "";
  const m = Math.floor(n / 60);
  const s = Math.floor(n % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function normSearch(s) {
  return safeTrim(s).toLowerCase();
}

const REMOTE_CONFIG_URL =
  import.meta.env.VITE_REMOTE_CONFIG_URL ||
  "https://montech-remote-config.s3.amazonaws.com/superapp/config.json";

async function fetchRemoteConfig() {
  const res = await fetch(`${REMOTE_CONFIG_URL}?v=${Date.now()}`, {
    cache: "no-store",
    headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
  });
  if (!res.ok) throw new Error(`remote config failed (${res.status})`);
  return res.json();
}

// ✅ normalize endpoint payloads (array OR {ok, items})
function toArrayPayload(data, keys = []) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];
  for (const k of keys) {
    if (Array.isArray(data[k])) return data[k];
  }
  return [];
}

export default function AccountEntitlements() {
  const nav = useNavigate();

  // ✅ make authed reactive (so switching accounts actually updates)
  const [authed, setAuthed] = useState(isAuthedNow());

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [videoPlayer, setVideoPlayer] = useState(null);
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [musicQuery, setMusicQuery] = useState("");

  const token = safeTrim(localStorage.getItem("buyerToken"));
  const userId = useMemo(() => readUserIdFromBuyerToken(), [token]);

  useEffect(() => {
    const onStorage = () => setAuthed(isAuthedNow());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    setAuthed(isAuthedNow());
  }, [token]);

  useEffect(() => {
    if (!authed) {
      nav("/auth/login?next=/account/entitlements");
      return;
    }

    // ghost session guard
    if (!token || !userId) {
      clearBuyerAuthStorage();
      nav("/auth/login?next=/account/entitlements");
      return;
    }

    const load = async () => {
      setLoading(true);
      setErr("");
      setItems([]);

      try {
        const cfg = await fetchRemoteConfig();
        const realms = normalizeProfiles(cfg);

        const out = [];

        for (const r of realms) {
          const headersBase = {
            "x-profile-key": r.key,
            "x-user-id": userId, // BACKCOMPAT ONLY
            Authorization: token ? `Bearer ${token}` : "",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          };

          // ---------- Paid videos (entitlements-only) ----------
          try {
            const pvRes = await fetch(`${r.apiBaseUrl}/api/paid-videos/my`, {
              headers: headersBase,
            });

            const pvJson = await pvRes.json().catch(() => null);

            if (!pvRes.ok) {
              console.log("[entitlements] paid-videos/my failed", r.key, pvJson?.error || pvRes.status);
            } else {
              const pvList = toArrayPayload(pvJson, ["videos", "items", "data"]);
              for (const v of pvList) {
                out.push({
                  kind: "paid_video",
                  realmKey: r.key,
                  realmLabel: r.label,
                  apiBaseUrl: r.apiBaseUrl,
                  id: v?._id,
                  title: safeTrim(v?.title) || "Paid Video",
                  coverUrl: v?.thumbnailUrl || v?.coverUrl || null,
                  meta: { access: v?.access || "paid", owned: true },
                });
              }
            }
          } catch (e) {
            console.log("[entitlements] paid-videos/my error", r.key, e?.message);
          }

          // ---------- Music (entitlements-only) ----------
          try {
            const mRes = await fetch(`${r.apiBaseUrl}/api/music/entitlements`, {
              headers: headersBase,
            });

            const mJson = await mRes.json().catch(() => null);

            if (!mRes.ok || !mJson?.ok) {
              console.log("[entitlements] music/entitlements failed", r.key, mJson?.error || mRes.status);
            } else {
              const tracks = toArrayPayload(mJson, ["tracks", "items", "data"]);
              for (const t of tracks) {
                out.push({
                  kind: "music_track",
                  realmKey: r.key,
                  realmLabel: r.label,
                  apiBaseUrl: r.apiBaseUrl,
                  id: t?._id,
                  title: safeTrim(t?.title) || "Track",
                  subtitle: safeTrim(t?.albumTitle) || "Single",
                  artist: safeTrim(t?.artist) || safeTrim(t?.artistName) || "",
                  coverUrl: t?.coverImageUrl || null,
                  durationSeconds: t?.durationSeconds ?? null,
                });
              }
            }
          } catch (e) {
            console.log("[entitlements] music/entitlements error", r.key, e?.message);
          }
        }

        setItems(out);
      } catch (e) {
        setErr(e?.message || "Failed to load entitlements");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [authed, nav, token, userId]);

  const videos = useMemo(() => (items || []).filter((x) => x.kind === "paid_video"), [items]);
  const musicAll = useMemo(() => (items || []).filter((x) => x.kind === "music_track"), [items]);

  const musicFiltered = useMemo(() => {
    const q = normSearch(musicQuery);
    if (!q) return musicAll;

    return musicAll.filter((t) => {
      const hay = [t.title, t.subtitle, t.artist, t.realmLabel, t.realmKey]
        .map((x) => safeTrim(x).toLowerCase())
        .join(" ");
      return hay.includes(q);
    });
  }, [musicAll, musicQuery]);

  const openPaidVideo = async (it) => {
    try {
      const url = `${it.apiBaseUrl}/api/paid-videos/${encodeURIComponent(it.id)}/play?mode=full`;

      const res = await fetch(url, {
        headers: {
          "x-profile-key": it.realmKey,
          "x-user-id": userId, // backcompat
          Authorization: token ? `Bearer ${token}` : "",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        alert(data?.error || `Unable to play video (${res.status})`);
        return;
      }

      if (data.mode === "link" && safeTrim(data.externalUrl)) {
        window.open(safeTrim(data.externalUrl), "_blank", "noopener,noreferrer");
        return;
      }

      if (!safeTrim(data.url)) {
        alert(data?.error || "No playable URL returned.");
        return;
      }

      setVideoPlayer({ title: it.title, url: safeTrim(data.url) });
    } catch (e) {
      alert(e?.message || "Playback failed");
    }
  };

  const openMusicTrack = async (it) => {
    try {
      const base = it.apiBaseUrl;
      const id = encodeURIComponent(it.id);

      const fullUrl = `${base}/api/music/tracks/${id}/stream?mode=full`;
      let res = await fetch(fullUrl, {
        headers: {
          "x-profile-key": it.realmKey,
          "x-user-id": userId, // backcompat
          Authorization: token ? `Bearer ${token}` : "",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      let data = await res.json().catch(() => null);

      if (res.status === 403 || data?.locked || data?.previewOnly) {
        const prevUrl = `${base}/api/music/tracks/${id}/stream?mode=preview`;
        res = await fetch(prevUrl, {
          headers: {
            "x-profile-key": it.realmKey,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });
        data = await res.json().catch(() => null);
        if (!res.ok || !data?.url) {
          alert(data?.error || "Unable to play preview.");
          return;
        }

        setAudioPlayer({
          title: it.title,
          subtitle: it.artist ? `${it.artist} • ${it.subtitle || ""}`.trim() : it.subtitle || "",
          coverUrl: it.coverUrl || null,
          url: safeTrim(data.url),
          mode: "preview",
        });
        return;
      }

      if (!res.ok || !data?.url) {
        alert(data?.error || `Unable to play track (${res.status})`);
        return;
      }

      setAudioPlayer({
        title: it.title,
        subtitle: it.artist ? `${it.artist} • ${it.subtitle || ""}`.trim() : it.subtitle || "",
        coverUrl: it.coverUrl || null,
        url: safeTrim(data.url),
        mode: "full",
      });
    } catch (e) {
      alert(e?.message || "Music playback failed");
    }
  };

  if (!authed) return null;

  // ✅ UI/STYLES: unchanged from your version
  return (
    <div className="ivRoot">
      <div className="ivBg" />
      <div className="ivStars" />

      <div className="ivWrap">
        <div className="topRow">
          <button className="pillBtn" onClick={() => nav("/account")}>
            ← Account
          </button>
          <button className="pillBtn" onClick={() => nav("/")}>
            Home
          </button>
        </div>

        <div className="hdr">
          <div className="h1">Entitlements</div>
          <div className="h2">Your vault (cross-profile)</div>
        </div>

        {loading ? <div className="glassCard">Loading…</div> : null}
        {err ? <div className="err">{err}</div> : null}

        {/* ---------------- VIDEOS ---------------- */}
        <div className="section">
          <div className="sectionHead">
            <div className="sectionTitle">
              <span className="sectionIcon" aria-hidden>
                ▶︎
              </span>
              Videos
            </div>
            <div className="sectionCount">{videos.length}</div>
          </div>

          {videos.length === 0 ? (
            <div className="emptyGlass">
              <div className="emptyTitle">No videos yet</div>
              <div className="emptySub">When you unlock videos, they’ll appear here.</div>
            </div>
          ) : (
            <div className="list">
              {videos.map((it, i) => (
                <button
                  key={`v-${it.realmKey}-${it.id}-${i}`}
                  className="row"
                  onClick={() => openPaidVideo(it)}
                  title="Play"
                >
                  <div className="rowInner">
                    <div className="thumb">
                      {it.coverUrl ? <img src={it.coverUrl} alt="" /> : <div className="thumbFallback" />}
                      <div className="thumbGlow" />
                    </div>

                    <div className="txt">
                      <div className="title">{it.title}</div>
                      <div className="meta">paid video • {it.realmLabel}</div>
                    </div>

                    <div className="chip">
                      <span className="chipIcon" aria-hidden>
                        ▶︎
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---------------- MUSIC ---------------- */}
        <div className="section">
          <div className="sectionHead">
            <div className="sectionTitle">
              <span className="sectionIcon" aria-hidden>
                ♪
              </span>
              Music
            </div>
            <div className="sectionCount">{musicFiltered.length}</div>
          </div>

          <div className="searchWrap">
            <span className="searchIcon" aria-hidden>
              ⌕
            </span>
            <input
              className="searchInput"
              value={musicQuery}
              onChange={(e) => setMusicQuery(e.target.value)}
              placeholder="Search music (artist, title, album, realm)…"
              autoCapitalize="none"
              autoCorrect="off"
            />
            {musicQuery ? (
              <button className="clearBtn" onClick={() => setMusicQuery("")} type="button">
                ✕
              </button>
            ) : null}
          </div>

          {musicFiltered.length === 0 ? (
            <div className="emptyGlass">
              <div className="emptyTitle">{musicAll.length ? "No matches" : "No music yet"}</div>
              <div className="emptySub">
                {musicAll.length ? "Try a different search." : "When you unlock music, it’ll appear here."}
              </div>
            </div>
          ) : (
            <div className="list">
              {musicFiltered.map((it, i) => (
                <button
                  key={`m-${it.realmKey}-${it.id}-${i}`}
                  className="row"
                  onClick={() => openMusicTrack(it)}
                  title="Play"
                >
                  <div className="rowInner">
                    <div className="thumb">
                      {it.coverUrl ? <img src={it.coverUrl} alt="" /> : <div className="thumbFallback" />}
                      <div className="thumbGlow" />
                    </div>

                    <div className="txt">
                      <div className="title">{it.title}</div>
                      <div className="meta">
                        music • {it.subtitle || "Single"} • {it.realmLabel}
                        {it.durationSeconds ? ` • ${secondsToMMSS(it.durationSeconds)}` : ""}
                      </div>
                    </div>

                    <div className="chip chipMusic">
                      <span className="chipIcon" aria-hidden>
                        ♪
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🎬 VIDEO PLAYER MODAL */}
      {videoPlayer && (
        <div className="modal" onClick={() => setVideoPlayer(null)}>
          <div className="modalInner" onClick={(e) => e.stopPropagation()}>
            <div className="modalTop">
              <div className="modalTitle">{videoPlayer.title}</div>
              <button className="xBtn" onClick={() => setVideoPlayer(null)}>
                ✕
              </button>
            </div>
            <video src={videoPlayer.url} controls autoPlay style={{ width: "100%" }} />
          </div>
        </div>
      )}

      {/* 🎵 AUDIO PLAYER MODAL */}
      {audioPlayer && (
        <div className="modal" onClick={() => setAudioPlayer(null)}>
          <div className="modalInner" onClick={(e) => e.stopPropagation()}>
            <div className="modalTop">
              <div className="modalTitle">
                {audioPlayer.title}
                {audioPlayer.mode ? <span className="modeTag">({audioPlayer.mode})</span> : null}
              </div>
              <button className="xBtn" onClick={() => setAudioPlayer(null)}>
                ✕
              </button>
            </div>

            <div className="audioHead">
              <div className="audioCover">
                {audioPlayer.coverUrl ? <img src={audioPlayer.coverUrl} alt="" /> : <div className="thumbFallback" />}
                <div className="thumbGlow" />
              </div>
              <div className="audioMeta">
                <div className="audioTitle">{audioPlayer.title}</div>
                {audioPlayer.subtitle ? <div className="audioSub">{audioPlayer.subtitle}</div> : null}
              </div>
            </div>

            <audio src={audioPlayer.url} controls autoPlay style={{ width: "100%" }} />
          </div>
        </div>
      )}

      <style>{`/* YOUR STYLES UNCHANGED - paste your existing <style> block here exactly */`}</style>
    </div>
  );
}