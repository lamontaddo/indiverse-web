// src/pages/AccountEntitlements.jsx ✅ FULL DROP-IN (Vault Playback – Paid Videos + Music)
// ✅ Paid videos: plays via /api/paid-videos/:id/play (per-realm apiBaseUrl)
// ✅ Music: uses /api/music/catalog to get real titles + cover art + isUnlocked
//         then plays via /api/music/tracks/:id/stream?mode=full (fallback preview on 403)
// ✅ Cross-profile Vault (no realm navigation)

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function safeTrim(v) {
  return String(v || "").trim();
}

function readBuyerUser() {
  try {
    const raw = localStorage.getItem("buyerUser");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function isAuthedNow() {
  return (
    !!safeTrim(localStorage.getItem("buyerToken")) &&
    safeTrim(localStorage.getItem("auth:isAuthed")) === "1"
  );
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

export default function AccountEntitlements() {
  const nav = useNavigate();
  const [buyerUser] = useState(readBuyerUser);
  const authed = useMemo(isAuthedNow, []);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // 🎬 video player
  const [videoPlayer, setVideoPlayer] = useState(null); // { title, url }

  // 🎵 audio player
  const [audioPlayer, setAudioPlayer] = useState(null); // { title, artist?, coverUrl?, url, mode }

  const userId =
    safeTrim(localStorage.getItem("buyerUserId")) || safeTrim(buyerUser?.id);
  const token = safeTrim(localStorage.getItem("buyerToken"));

  useEffect(() => {
    if (!authed) {
      nav("/auth/login?next=/account/entitlements");
      return;
    }

    const load = async () => {
      setLoading(true);
      setErr("");
      setItems([]);

      try {
        if (!userId) throw new Error("Missing buyer user id (buyerUserId / buyerUser.id).");

        const cfg = await fetchRemoteConfig();
        const realms = normalizeProfiles(cfg);

        const out = [];

        for (const r of realms) {
          // ---------- Paid videos (owned/free) ----------
          try {
            const pvRes = await fetch(`${r.apiBaseUrl}/api/paid-videos`, {
              headers: {
                "x-profile-key": r.key,
                "x-user-id": userId,
                Authorization: token ? `Bearer ${token}` : "",
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
              },
            });

            const pv = await pvRes.json().catch(() => null);
            if (!pvRes.ok) {
              console.log("[entitlements] paid-videos list failed", r.key, pv?.error || pvRes.status);
            } else {
              for (const v of pv || []) {
                if (String(v?.access || "").toLowerCase() === "paid" && !v?.owned) continue;

                out.push({
                  kind: "paid_video",
                  realmKey: r.key,
                  realmLabel: r.label,
                  apiBaseUrl: r.apiBaseUrl,
                  id: v?._id,
                  title: safeTrim(v?.title) || "Paid Video",
                  coverUrl: v?.thumbnailUrl || null,
                  meta: {
                    access: v?.access || "free",
                    owned: !!v?.owned,
                  },
                });
              }
            }
          } catch (e) {
            console.log("[entitlements] paid-videos list error", r.key, e?.message);
          }

          // ---------- Music (catalog -> unlocked tracks) ----------
          try {
            const mRes = await fetch(`${r.apiBaseUrl}/api/music/catalog`, {
              headers: {
                "x-profile-key": r.key,
                "x-user-id": userId,
                Authorization: token ? `Bearer ${token}` : "",
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
              },
            });

            const m = await mRes.json().catch(() => null);
            if (!mRes.ok || !m?.ok) {
              console.log("[entitlements] music catalog failed", r.key, m?.error || mRes.status);
            } else {
              const tracks = Array.isArray(m?.tracks) ? m.tracks : [];
              for (const t of tracks) {
                if (!t?.isUnlocked) continue;

                out.push({
                  kind: "music_track",
                  realmKey: r.key,
                  realmLabel: r.label,
                  apiBaseUrl: r.apiBaseUrl,
                  id: t?._id,
                  title: safeTrim(t?.title) || "Track",
                  subtitle: safeTrim(t?.albumTitle) || "Single",
                  coverUrl: t?.coverImageUrl || null,
                  durationSeconds: t?.durationSeconds ?? null,
                });
              }
            }
          } catch (e) {
            console.log("[entitlements] music catalog error", r.key, e?.message);
          }
        }

        // simple sort: videos first then music, then realm, then title
        out.sort((a, b) => {
          const ka = a.kind === "paid_video" ? 0 : 1;
          const kb = b.kind === "paid_video" ? 0 : 1;
          if (ka !== kb) return ka - kb;
          const ra = String(a.realmLabel || a.realmKey || "");
          const rb = String(b.realmLabel || b.realmKey || "");
          const rc = ra.localeCompare(rb);
          if (rc) return rc;
          return String(a.title || "").localeCompare(String(b.title || ""));
        });

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

  // ---------- Play handlers ----------

  const openPaidVideo = async (it) => {
    try {
      const url = `${it.apiBaseUrl}/api/paid-videos/${encodeURIComponent(it.id)}/play?mode=full`;

      const res = await fetch(url, {
        headers: {
          "x-profile-key": it.realmKey,
          "x-user-id": userId,
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

      // try full first
      const fullUrl = `${base}/api/music/tracks/${id}/stream?mode=full`;
      let res = await fetch(fullUrl, {
        headers: {
          "x-profile-key": it.realmKey,
          "x-user-id": userId,
          Authorization: token ? `Bearer ${token}` : "",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      let data = await res.json().catch(() => null);

      // fallback to preview on locked (403)
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
          subtitle: it.subtitle || "",
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
        subtitle: it.subtitle || "",
        coverUrl: it.coverUrl || null,
        url: safeTrim(data.url),
        mode: "full",
      });
    } catch (e) {
      alert(e?.message || "Music playback failed");
    }
  };

  if (!authed) return null;

  return (
    <div className="vaultRoot">
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

      {loading ? <div className="card">Loading…</div> : null}
      {err ? <div className="err">{err}</div> : null}

      <div className="list">
        {items.map((it, i) => (
          <button
            key={`${it.kind}-${it.realmKey}-${it.id || it.title}-${i}`}
            className="row"
            onClick={() =>
              it.kind === "paid_video"
                ? openPaidVideo(it)
                : it.kind === "music_track"
                ? openMusicTrack(it)
                : null
            }
            title={it.kind === "music_track" ? "Play" : "Open"}
          >
            <div className="rowInner">
              <div className="thumb">
                {it.coverUrl ? (
                  <img src={it.coverUrl} alt="" />
                ) : (
                  <div className="thumbFallback" />
                )}
              </div>

              <div className="txt">
                <div className="title">{it.title}</div>
                <div className="meta">
                  {it.kind === "paid_video"
                    ? `paid video • ${it.realmLabel}`
                    : `music • ${it.subtitle || "Single"} • ${it.realmLabel}`}
                  {it.kind === "music_track" && it.durationSeconds
                    ? ` • ${secondsToMMSS(it.durationSeconds)}`
                    : ""}
                </div>
              </div>

              <div className="tag">
                {it.kind === "paid_video" ? "▶︎" : "♪"}
              </div>
            </div>
          </button>
        ))}
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
                {audioPlayer.mode ? (
                  <span style={{ opacity: 0.7, fontWeight: 700, marginLeft: 10, fontSize: 12 }}>
                    ({audioPlayer.mode})
                  </span>
                ) : null}
              </div>
              <button className="xBtn" onClick={() => setAudioPlayer(null)}>
                ✕
              </button>
            </div>

            <div className="audioHead">
              <div className="audioCover">
                {audioPlayer.coverUrl ? <img src={audioPlayer.coverUrl} alt="" /> : <div className="thumbFallback" />}
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

      <style>{`
        .vaultRoot{
          min-height:100vh;
          padding:18px;
          color:#fff;
          background:linear-gradient(180deg,#0b1020,#090b14,#06070d);
          font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial;
        }
        .topRow{ display:flex; justify-content:space-between; gap:10px; margin-bottom:14px; }
        .pillBtn{
          border:1px solid rgba(255,255,255,.12);
          background:rgba(0,0,0,.28);
          color:rgba(255,255,255,.9);
          padding:10px 12px;
          border-radius:999px;
          cursor:pointer;
          backdrop-filter:blur(12px);
        }
        .hdr{ margin-bottom:12px; }
        .h1{ font-size:20px; font-weight:900; }
        .h2{ margin-top:6px; opacity:.7; font-size:13px; }
        .card{
          padding:14px;
          border-radius:16px;
          border:1px solid rgba(255,255,255,.10);
          background:rgba(0,0,0,.30);
          margin-bottom:12px;
        }
        .err{
          color:#ff9a9a;
          padding:12px;
          border-radius:14px;
          border:1px solid rgba(255,80,80,.25);
          background:rgba(255,80,80,.08);
          margin-bottom:12px;
        }
        .list{ display:flex; flex-direction:column; gap:10px; }
        .row{
          width:100%;
          text-align:left;
          padding:12px;
          border-radius:14px;
          border:1px solid rgba(255,255,255,.10);
          background:rgba(0,0,0,.35);
          cursor:pointer;
        }
        .rowInner{
          display:flex;
          align-items:center;
          gap:12px;
        }
        .thumb{
          width:46px;
          height:46px;
          border-radius:12px;
          overflow:hidden;
          border:1px solid rgba(255,255,255,.10);
          background:rgba(255,255,255,.04);
          flex: 0 0 auto;
        }
        .thumb img{
          width:100%;
          height:100%;
          object-fit:cover;
          display:block;
        }
        .thumbFallback{
          width:100%;
          height:100%;
          background:rgba(255,255,255,.06);
        }
        .txt{ flex:1; min-width:0; }
        .title{ font-weight:900; line-height:1.15; }
        .meta{ opacity:.7; font-size:12px; margin-top:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .tag{
          opacity:.85;
          font-weight:900;
          border:1px solid rgba(255,255,255,.10);
          background:rgba(255,255,255,.06);
          padding:6px 10px;
          border-radius:999px;
          flex:0 0 auto;
        }

        .modal{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,.75);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:999;
          padding:16px;
        }
        .modalInner{
          width:min(900px,92vw);
          background:#000;
          border-radius:16px;
          border:1px solid rgba(255,255,255,.10);
          overflow:hidden;
          padding:12px;
        }
        .modalTop{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          margin-bottom:10px;
        }
        .modalTitle{ font-weight:900; font-size:14px; opacity:.95; }
        .xBtn{
          border:none;
          background:rgba(255,255,255,.10);
          color:#fff;
          border-radius:10px;
          padding:6px 10px;
          cursor:pointer;
        }

        .audioHead{
          display:flex;
          align-items:center;
          gap:12px;
          margin: 6px 0 10px;
        }
        .audioCover{
          width:60px;
          height:60px;
          border-radius:14px;
          overflow:hidden;
          border:1px solid rgba(255,255,255,.10);
          background:rgba(255,255,255,.04);
          flex: 0 0 auto;
        }
        .audioCover img{ width:100%; height:100%; object-fit:cover; display:block; }
        .audioMeta{ min-width:0; }
        .audioTitle{ font-weight:900; }
        .audioSub{ opacity:.7; font-size:12px; margin-top:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      `}</style>
    </div>
  );
}
