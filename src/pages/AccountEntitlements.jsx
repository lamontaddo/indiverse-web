// src/pages/AccountEntitlements.jsx ✅ FULL DROP-IN (HARDENED IDENTITY + ENTITLEMENT SAFETY)
// ✅ userId comes from buyerToken (JWT) — NOT buyerUserId/buyerUser storage
// ✅ Clears stale auth storage if token invalid
// ✅ Sends x-user-id only as BACKCOMPAT (from token), but Authorization is primary
// ✅ UI + grouping + music search + playback logic kept intact

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
    // handle UTF-8
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

  // support common claim keys
  const id =
    safeTrim(payload.userId) ||
    safeTrim(payload.id) ||
    safeTrim(payload.sub) ||
    safeTrim(payload.uid);

  // basic sanity: mongodb-ish ids are 24 hex; but allow others
  return id || null;
}

function clearBuyerAuthStorage() {
  // keep it explicit so you don’t end up “half logged in”
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

export default function AccountEntitlements() {
  const nav = useNavigate();
  const authed = useMemo(isAuthedNow, []);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // 🎬 video player
  const [videoPlayer, setVideoPlayer] = useState(null); // { title, url }

  // 🎵 audio player
  const [audioPlayer, setAudioPlayer] = useState(null); // { title, subtitle?, coverUrl?, url, mode }

  // 🔎 music search
  const [musicQuery, setMusicQuery] = useState("");

  const token = safeTrim(localStorage.getItem("buyerToken"));
  const userId = useMemo(() => readUserIdFromBuyerToken(), [token]);

  useEffect(() => {
    if (!authed) {
      nav("/auth/login?next=/account/entitlements");
      return;
    }

    // If token is missing/invalid but authed flag exists, kill the “ghost session”
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
            // BACKCOMPAT ONLY — sourced from token, never from localStorage
            "x-user-id": userId,
            Authorization: token ? `Bearer ${token}` : "",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          };

          // ---------- Paid videos (owned/free) ----------
          try {
            // ✅ entitlements-only endpoint (must exist on backend)
            const pvRes = await fetch(`${r.apiBaseUrl}/api/paid-videos/my`, {
              headers: headersBase, // includes Authorization Bearer token
            });
          
            const pv = await pvRes.json().catch(() => null);
          
            if (!pvRes.ok) {
              console.log("[entitlements] paid-videos/my failed", r.key, pv?.error || pvRes.status);
            } else {
              for (const v of pv || []) {
                out.push({
                  kind: "paid_video",
                  realmKey: r.key,
                  realmLabel: r.label,
                  apiBaseUrl: r.apiBaseUrl,
                  id: v?._id,
                  title: safeTrim(v?.title) || "Paid Video",
                  coverUrl: v?.thumbnailUrl || null,
                  meta: {
                    access: v?.access || "paid",
                    owned: true, // because /my should only return owned/free entitlements
                  },
                });
              }
            }
          } catch (e) {
            console.log("[entitlements] paid-videos/my error", r.key, e?.message);
          }

          // ---------- Music (catalog -> unlocked tracks) ----------
          try {
            // ✅ entitlements-only endpoint (must exist on backend)
            const mRes = await fetch(`${r.apiBaseUrl}/api/music/entitlements`, {
              headers: headersBase, // includes Authorization Bearer token
            });
          
            const m = await mRes.json().catch(() => null);
          
            if (!mRes.ok || !m?.ok) {
              console.log("[entitlements] music/entitlements failed", r.key, m?.error || mRes.status);
            } else {
              const tracks = Array.isArray(m?.tracks) ? m.tracks : [];
              for (const t of tracks) {
                out.push({
                  kind: "music_track",
                  realmKey: r.key,
                  realmLabel: r.label,
                  apiBaseUrl: r.apiBaseUrl,
                  id: t?._id,
                  title: safeTrim(t?.title) || "Track",
                  subtitle: safeTrim(t?.albumTitle) || "Single",
                  artist: safeTrim(t?.artist) || "",
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

  // ---------- Grouping ----------
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

  // ---------- Play handlers ----------
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

      // try full first
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

      <style>{`
        .ivRoot{
          min-height:100vh;
          position:relative;
          overflow:hidden;
          color:#fff;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
          background:#03040a;
        }
        .ivBg{
          position:fixed;
          inset:0;
          background:
            radial-gradient(1200px 700px at 50% 0%, rgba(0,255,255,0.10), transparent 55%),
            radial-gradient(900px 500px at 15% 25%, rgba(124,58,237,0.10), transparent 55%),
            radial-gradient(900px 500px at 85% 35%, rgba(59,130,246,0.10), transparent 55%),
            linear-gradient(180deg, #0b1020, #090b14, #06070d);
          z-index:0;
        }
        .ivStars{
          position:fixed;
          inset:0;
          background-image:
            radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.45) 0, transparent 2px),
            radial-gradient(1px 1px at 30% 80%, rgba(255,255,255,0.35) 0, transparent 2px),
            radial-gradient(1px 1px at 70% 30%, rgba(255,255,255,0.30) 0, transparent 2px),
            radial-gradient(1px 1px at 85% 70%, rgba(255,255,255,0.28) 0, transparent 2px),
            radial-gradient(1px 1px at 55% 55%, rgba(255,255,255,0.22) 0, transparent 2px);
          opacity:0.55;
          z-index:0;
          pointer-events:none;
        }
        .ivWrap{
          position:relative;
          z-index:1;
          max-width: 980px;
          margin: 0 auto;
          padding: 18px 16px 60px;
        }
        .topRow{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:10px;
          margin-bottom:14px;
        }
        .pillBtn{
          border:1px solid rgba(255,255,255,.14);
          background:rgba(0,0,0,.24);
          color:rgba(255,255,255,.92);
          padding:10px 14px;
          border-radius:999px;
          cursor:pointer;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 18px 24px rgba(0,0,0,0.35);
        }
        .pillBtn:active{ transform: scale(0.99); opacity:0.95; }

        .hdr{ margin: 8px 0 14px; }
        .h1{ font-size: 24px; font-weight: 900; letter-spacing: 0.2px; }
        .h2{ margin-top: 6px; opacity: 0.72; font-size: 13px; }

        .glassCard{
          padding: 14px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.28);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 22px 30px rgba(0,0,0,0.35);
          margin-bottom: 12px;
        }

        .err{
          color:#ffb3b3;
          padding:12px;
          border-radius:16px;
          border:1px solid rgba(255,80,80,.25);
          background: rgba(255,80,80,.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          margin-bottom:12px;
        }

        .section{
          margin-top: 14px;
          padding: 14px;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.22);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 26px 34px rgba(0,0,0,0.38);
        }

        .sectionHead{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          margin-bottom: 12px;
        }

        .sectionTitle{
          display:flex;
          align-items:center;
          gap:10px;
          font-weight: 900;
          font-size: 14px;
          letter-spacing: 0.3px;
          opacity: 0.95;
          text-transform: uppercase;
        }

        .sectionIcon{
          width: 30px;
          height: 30px;
          border-radius: 12px;
          display:flex;
          align-items:center;
          justify-content:center;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 18px 22px rgba(0,0,0,0.28);
        }

        .sectionCount{
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.80);
        }

        .searchWrap{
          display:flex;
          align-items:center;
          gap:10px;
          padding: 10px 12px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.22);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          margin-bottom: 12px;
        }
        .searchIcon{ opacity: 0.75; }
        .searchInput{
          flex:1;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 14px;
        }
        .clearBtn{
          border:none;
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.9);
          border-radius: 12px;
          padding: 6px 10px;
          cursor:pointer;
        }

        .list{
          display:flex;
          flex-direction:column;
          gap: 10px;
        }

        .row{
          width: 100%;
          text-align:left;
          padding: 12px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.20);
          cursor:pointer;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition: transform 120ms ease, opacity 120ms ease, border-color 120ms ease;
        }
        .row:hover{ border-color: rgba(0,255,255,0.16); }
        .row:active{ transform: scale(0.995); opacity: 0.96; }

        .rowInner{
          display:flex;
          align-items:center;
          gap: 12px;
        }

        .thumb{
          width: 48px;
          height: 48px;
          border-radius: 16px;
          overflow:hidden;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.05);
          position: relative;
          flex: 0 0 auto;
        }
        .thumb img{ width:100%; height:100%; object-fit: cover; display:block; }
        .thumbFallback{ width:100%; height:100%; background: rgba(255,255,255,0.06); }
        .thumbGlow{
          position:absolute;
          inset:-40%;
          background: radial-gradient(circle at 50% 50%, rgba(0,255,255,0.16), transparent 60%);
          pointer-events:none;
          opacity: 0.7;
        }

        .txt{ flex:1; min-width:0; }
        .title{ font-weight: 900; letter-spacing: 0.15px; line-height: 1.15; }
        .meta{
          margin-top: 6px;
          opacity: 0.72;
          font-size: 12px;
          white-space: nowrap;
          overflow:hidden;
          text-overflow: ellipsis;
        }

        .chip{
          flex: 0 0 auto;
          width: 36px;
          height: 36px;
          border-radius: 14px;
          display:flex;
          align-items:center;
          justify-content:center;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 18px 22px rgba(0,0,0,0.28);
        }
        .chipMusic{ border-color: rgba(0,255,255,0.14); }
        .chipIcon{ opacity: 0.9; font-weight: 900; }

        .emptyGlass{
          padding: 16px;
          border-radius: 18px;
          border: 1px dashed rgba(255,255,255,0.12);
          background: rgba(0,0,0,0.18);
        }
        .emptyTitle{ font-weight: 900; }
        .emptySub{ margin-top: 6px; opacity: 0.72; font-size: 13px; }

        .modal{
          position:fixed;
          inset:0;
          background: rgba(0,0,0,0.78);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:999;
          padding:16px;
        }
        .modalInner{
          width: min(900px, 92vw);
          background: rgba(0,0,0,0.92);
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.10);
          overflow:hidden;
          padding: 12px;
          box-shadow: 0 30px 40px rgba(0,0,0,0.45);
        }
        .modalTop{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          margin-bottom: 10px;
        }
        .modalTitle{ font-weight: 900; font-size: 14px; opacity: 0.96; }
        .modeTag{ opacity: 0.7; font-weight: 800; margin-left: 10px; font-size: 12px; }
        .xBtn{
          border:none;
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.9);
          border-radius: 12px;
          padding: 6px 10px;
          cursor:pointer;
        }

        .audioHead{
          display:flex;
          align-items:center;
          gap:12px;
          margin: 6px 0 10px;
        }
        .audioCover{
          width: 64px;
          height: 64px;
          border-radius: 18px;
          overflow:hidden;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.05);
          position: relative;
          flex: 0 0 auto;
        }
        .audioCover img{ width:100%; height:100%; object-fit:cover; display:block; }
        .audioMeta{ min-width:0; }
        .audioTitle{ font-weight: 900; }
        .audioSub{
          margin-top: 6px;
          opacity: 0.72;
          font-size: 12px;
          white-space: nowrap;
          overflow:hidden;
          text-overflow: ellipsis;
        }

        @media (min-width: 980px){
          .ivWrap{ padding-top: 22px; }
          .h1{ font-size: 26px; }
        }
      `}</style>
    </div>
  );
}