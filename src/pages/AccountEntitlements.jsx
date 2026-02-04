// src/pages/AccountEntitlements.jsx ✅ FULL DROP-IN (Vault Playback – Paid Videos)
// ✅ Paid video playback happens directly inside Account (no realm navigation)
// ✅ Uses existing /api/paid-videos/:id/play enforcement
// ✅ Music entitlements still listed (no playback yet)

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
  });
  if (!res.ok) throw new Error("remote config failed");
  return res.json();
}

function normalizeProfiles(cfg) {
  return (cfg?.profiles || [])
    .filter((p) => p?.enabled !== false && p?.apiBaseUrl)
    .map((p) => ({
      key: p.key.toLowerCase(),
      label: p.label || p.key,
      apiBaseUrl: p.apiBaseUrl.replace(/\/+$/, ""),
    }));
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
    safeTrim(localStorage.getItem("buyerUserId")) ||
    safeTrim(buyerUser?.id);
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
        const cfg = await fetchRemoteConfig();
        const realms = normalizeProfiles(cfg);
        const out = [];

        for (const r of realms) {
          // ----- Paid videos -----
          const pvRes = await fetch(`${r.apiBaseUrl}/api/paid-videos`, {
            headers: {
              "x-profile-key": r.key,
              "x-user-id": userId,
              Authorization: `Bearer ${token}`,
            },
          });

          const pv = await pvRes.json();
          for (const v of pv || []) {
            if (v.access === "paid" && !v.owned) continue;

            out.push({
              kind: "paid_video",
              realmKey: r.key,
              realmLabel: r.label,
              id: v._id,
              title: v.title,
            });
          }

          // ----- Music (IDs only for now) -----
          const mRes = await fetch(`${r.apiBaseUrl}/api/music/purchases`, {
            headers: {
              "x-profile-key": r.key,
              "x-user-id": userId,
            },
          });

          const m = await mRes.json();
          for (const t of m?.trackIds || []) {
            out.push({
              kind: "music_track",
              realmKey: r.key,
              realmLabel: r.label,
              title: `Track • ${t}`,
            });
          }
          for (const a of m?.albumIds || []) {
            out.push({
              kind: "music_album",
              realmKey: r.key,
              realmLabel: r.label,
              title: `Album • ${a}`,
            });
          }
        }

        setItems(out);
      } catch (e) {
        setErr(e.message || "Failed to load entitlements");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [authed, nav, token, userId]);

  const openPaidVideo = async (it) => {
    try {
      const res = await fetch(
        `/api/paid-videos/${it.id}/play?mode=full`,
        {
          headers: {
            "x-profile-key": it.realmKey,
            "x-user-id": userId,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok || !data?.url) {
        alert(data?.error || "Unable to play video");
        return;
      }

      setPlayer({ title: it.title, url: data.url });
    } catch {
      alert("Playback failed");
    }
  };

  if (!authed) return null;

  return (
    <div className="vaultRoot">
      <h2>Entitlements</h2>

      {loading ? <div>Loading…</div> : null}
      {err ? <div className="err">{err}</div> : null}

      <div className="list">
        {items.map((it, i) => (
          <button
            key={i}
            className="row"
            onClick={() =>
              it.kind === "paid_video"
                ? openPaidVideo(it)
                : alert("Music playback next step")
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
        <div className="modal">
          <div className="modalInner">
            <div className="modalTop">
              <div>{player.title}</div>
              <button onClick={() => setPlayer(null)}>✕</button>
            </div>
            <video
              src={player.url}
              controls
              autoPlay
              style={{ width: "100%" }}
            />
          </div>
        </div>
      )}

      <style>{`
        .vaultRoot{ padding:20px; color:#fff; }
        .row{
          width:100%;
          text-align:left;
          padding:12px;
          border-radius:14px;
          border:1px solid rgba(255,255,255,.1);
          background:rgba(0,0,0,.35);
          margin-bottom:10px;
          cursor:pointer;
        }
        .title{ font-weight:800 }
        .meta{ opacity:.7; font-size:12px }
        .modal{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,.7);
          display:flex;
          align-items:center;
          justify-content:center;
          z-index:999;
        }
        .modalInner{
          width:min(800px,90vw);
          background:#000;
          padding:12px;
          border-radius:16px;
        }
        .modalTop{
          display:flex;
          justify-content:space-between;
          margin-bottom:8px;
        }
        .err{ color:#ff8080 }
      `}</style>
    </div>
  );
}
