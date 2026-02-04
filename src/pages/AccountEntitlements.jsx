// src/pages/AccountEntitlements.jsx ✅ FULL DROP-IN (Vault Playback – Paid Videos FIXED)
// ✅ FIX: play call now uses the realm's apiBaseUrl (not current origin)
// ✅ Handles link videos (mode=link -> opens externalUrl)
// ✅ Keeps music entitlements listed (no playback yet)

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

export default function AccountEntitlements() {
  const nav = useNavigate();
  const [buyerUser] = useState(readBuyerUser);
  const authed = useMemo(isAuthedNow, []);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // 🎬 vault player
  const [player, setPlayer] = useState(null); // { title, url }

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

      try {
        if (!userId) throw new Error("Missing buyer user id (buyerUserId / buyerUser.id).");
        const cfg = await fetchRemoteConfig();
        const realms = normalizeProfiles(cfg);

        const out = [];

        for (const r of realms) {
          // ----- Paid videos -----
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
                  apiBaseUrl: r.apiBaseUrl, // ✅ CRITICAL for play
                  id: v?._id,
                  title: safeTrim(v?.title) || "Paid Video",
                });
              }
            }
          } catch (e) {
            console.log("[entitlements] paid-videos list error", r.key, e?.message);
          }

          // ----- Music (IDs only for now) -----
          try {
            const mRes = await fetch(`${r.apiBaseUrl}/api/music/purchases`, {
              headers: {
                "x-profile-key": r.key,
                "x-user-id": userId,
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
              },
            });

            const m = await mRes.json().catch(() => null);
            if (!mRes.ok) {
              console.log("[entitlements] music purchases failed", r.key, m?.error || mRes.status);
            } else {
              for (const t of m?.trackIds || []) {
                out.push({
                  kind: "music_track",
                  realmKey: r.key,
                  realmLabel: r.label,
                  apiBaseUrl: r.apiBaseUrl,
                  title: `Track • ${t}`,
                });
              }
              for (const a of m?.albumIds || []) {
                out.push({
                  kind: "music_album",
                  realmKey: r.key,
                  realmLabel: r.label,
                  apiBaseUrl: r.apiBaseUrl,
                  title: `Album • ${a}`,
                });
              }
            }
          } catch (e) {
            console.log("[entitlements] music purchases error", r.key, e?.message);
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

  const openPaidVideo = async (it) => {
    try {
      if (!it?.apiBaseUrl) {
        alert("Missing apiBaseUrl for this realm.");
        return;
      }
      if (!it?.id) {
        alert("Missing video id.");
        return;
      }

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

      // ✅ Link videos: open externalUrl
      if (data.mode === "link" && safeTrim(data.externalUrl)) {
        window.open(safeTrim(data.externalUrl), "_blank", "noopener,noreferrer");
        return;
      }

      // ✅ S3 videos: play signed URL
      if (!safeTrim(data.url)) {
        alert(data?.error || "No playable URL returned.");
        return;
      }

      setPlayer({ title: it.title, url: safeTrim(data.url) });
    } catch (e) {
      alert(e?.message || "Playback failed");
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
            key={`${it.kind}-${it.realmKey}-${it.title}-${i}`}
            className="row"
            onClick={() =>
              it.kind === "paid_video"
                ? openPaidVideo(it)
                : alert("Music playback is next step")
            }
          >
            <div className="title">{it.title}</div>
            <div className="meta">
              {it.kind.replace("_", " ")} • {it.realmLabel}
            </div>
          </button>
        ))}
      </div>

      {/* 🎬 PLAYER MODAL */}
      {player && (
        <div className="modal" onClick={() => setPlayer(null)}>
          <div className="modalInner" onClick={(e) => e.stopPropagation()}>
            <div className="modalTop">
              <div className="modalTitle">{player.title}</div>
              <button className="xBtn" onClick={() => setPlayer(null)}>
                ✕
              </button>
            </div>
            <video src={player.url} controls autoPlay style={{ width: "100%" }} />
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
        .title{ font-weight:900; }
        .meta{ opacity:.7; font-size:12px; margin-top:6px; }

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
      `}</style>
    </div>
  );
}
