// src/pages/PaidVideosPage.jsx ✅ FULL DROP-IN (Web / Vite) — BETTER WEB UI (NO LOGIC BREAKS)
// ✅ Uses profileFetchRaw(profileKey, path)
// ✅ FIX: DO NOT append cache-bust params to S3 presigned URLs (breaks signature)
// ✅ Instead: remount <img> via key + only bust non-signed URLs
// ✅ Link videos open in new tab
// ✅ S3 videos navigate to player page
// ✅ Soft CTA added (pill button) — no nested <button> (valid HTML)
// ✅ NEW: sends x-user-id + Authorization (derived from buyerToken / buyerUserId_v1) so backend can compute owned=true

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getProfileByKey } from "../services/profileRegistry";
import { profileFetchRaw } from "../services/profileApi";

function cleanTitle(s) {
  return String(s || "").trim() || "Untitled";
}

function pickUrl(v) {
  return (
    v?.externalUrl ||
    v?.externalURL ||
    v?.url ||
    v?.linkUrl ||
    v?.link ||
    v?.href ||
    ""
  );
}

// ✅ Detect S3 presigned urls (don’t mutate querystring)
function isPresignedUrl(url) {
  const u = String(url || "");
  return (
    u.includes("X-Amz-Signature=") ||
    u.includes("X-Amz-Algorithm=") ||
    u.includes("X-Amz-Credential=") ||
    u.includes("X-Amz-Date=")
  );
}

// ✅ only cache-bust NON-signed urls
function safeBust(url) {
  const u = String(url || "").trim();
  if (!u) return "";
  if (isPresignedUrl(u)) return u; // ✅ DO NOT TOUCH
  const join = u.includes("?") ? "&" : "?";
  return `${u}${join}v=${Date.now()}`;
}

/* -------------------- AUTH helpers -------------------- */
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
  if (!p) return "";

  const direct = p.userId || p.id || p._id || "";
  if (direct) return String(direct).trim();

  const sub = p.sub ? String(p.sub).trim() : "";
  if (isMongoObjectId(sub)) return sub;

  return "";
}

function readBuyerAuth() {
  let token = "";
  let userId = "";

  try {
    token = String(localStorage.getItem("buyerToken") || "").trim();
  } catch {}

  try {
    userId = String(localStorage.getItem("buyerUserId_v1") || "").trim();
  } catch {}

  if (!userId && token) {
    userId = decodeJwtUserId(token);
  }

  return { token, userId };
}

export default function PaidVideosPage() {
  const nav = useNavigate();
  const params = useParams();

  const profileKey = String(params.profileKey || "lamont").toLowerCase();
  const profile = useMemo(() => getProfileByKey(profileKey), [profileKey]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState(null);
  const [rows, setRows] = useState([]);
  const [brokenThumbs, setBrokenThumbs] = useState(() => new Set());

  // ✅ keep auth fresh when returning from Stripe pages
  const [{ token, userId }, setAuth] = useState(() => readBuyerAuth());

  useEffect(() => {
    const sync = () => setAuth(readBuyerAuth());
    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync);
    sync();
    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const fetchList = useCallback(async () => {
    try {
      setErr(null);

      // ✅ critical: send x-user-id so backend can compute owned
      const headers = {
        ...(userId ? { "x-user-id": userId } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await profileFetchRaw(profileKey, "/api/paid-videos", { headers });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `Request failed (${res.status})`);
      }

      const data = await res.json();
      const list =
        (Array.isArray(data) && data) ||
        data?.data ||
        data?.videos ||
        data?.items ||
        [];

      if (!Array.isArray(list)) throw new Error("Invalid paid-videos response");

      setRows(list);
      setBrokenThumbs(new Set());
    } catch (e) {
      setErr(e?.message || "Unable to load");
      setRows([]);
    }
  }, [profileKey, token, userId]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        await fetchList();
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [fetchList]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchList();
    setRefreshing(false);
  }, [fetchList]);

  const openVideo = useCallback(
    (video) => {
      const srcType = String(video?.sourceType || "s3").toLowerCase();

      if (srcType === "link") {
        const url = String(pickUrl(video) || "").trim();
        if (!url) return window.alert("Missing link: No URL found.");
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }

      const access = String(video?.access || "free").toLowerCase();
      const owned = !!video?.owned || access === "free";

      nav(`/world/${profileKey}/paid-videos/${String(video?._id || "")}`, {
        state: { video: { ...video, owned } },
      });
    },
    [nav, profileKey]
  );

  const titleLine = profile?.label ? `${profile.label} • ${profileKey}` : profileKey;

  const stats = useMemo(() => {
    let preview = 0;
    let full = 0;
    let links = 0;

    for (const v of rows) {
      const srcType = String(v?.sourceType || "s3").toLowerCase();
      if (srcType === "link") {
        links++;
        full++;
        continue;
      }
      const access = String(v?.access || "free").toLowerCase();
      const owned = !!v?.owned || access === "free";
      const locked = access === "paid" && !owned;
      if (locked) preview++;
      else full++;
    }

    return { total: rows.length, preview, full, links };
  }, [rows]);

  return (
    <div className="pv-root">
      <div className="pv-bg" />

      <header className="pv-topbar">
        <div className="pv-topbarInner">
          <button
            className="pv-iconBtn"
            onClick={() => window.history.back()}
            aria-label="Back"
            title="Back"
          >
            ✕
          </button>

          <div className="pv-titleBlock">
            <div className="pv-h1">Content</div>
            <div className="pv-h2" title={titleLine}>
              {titleLine}
            </div>

            <div className="pv-stats">
              <span className="pv-dot" />
              <span>{stats.total} items</span>
              {stats.preview ? <span className="pv-chip pv-chipDim">Preview {stats.preview}</span> : null}
              {stats.full ? <span className="pv-chip">Full {stats.full}</span> : null}
              {stats.links ? <span className="pv-chip pv-chipLink">Links {stats.links}</span> : null}
            </div>
          </div>

          <div className="pv-actions">
            <button
              className={`pv-refreshBtn ${refreshing ? "pv-refreshBtnBusy" : ""}`}
              onClick={onRefresh}
              disabled={refreshing}
              title="Refresh"
              aria-label="Refresh"
            >
              <span className={`pv-refreshIcon ${refreshing ? "pv-spin" : ""}`}>⟳</span>
              <span className="pv-refreshText">{refreshing ? "Refreshing" : "Refresh"}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="pv-shell">
        {loading ? (
          <div className="pv-centerCard">
            <div className="pv-spinner" />
            <div className="pv-centerText">Loading videos…</div>
          </div>
        ) : err ? (
          <div className="pv-centerCard">
            <div className="pv-errTitle">Couldn’t load videos</div>
            <div className="pv-errSub">{String(err)}</div>
            <div className="pv-row">
              <button className="pv-pill" onClick={fetchList}>
                Retry
              </button>
            </div>
          </div>
        ) : rows.length === 0 ? (
          <div className="pv-centerCard">
            <div className="pv-emptyIcon">🎬</div>
            <div className="pv-errTitle">No videos yet</div>
            <div className="pv-errSub">Publish videos from the owner dashboard to see them here.</div>
          </div>
        ) : (
          <main className="pv-grid">
            {rows.map((item, idx) => {
              const title = cleanTitle(item?.title);

              const srcType = String(item?.sourceType || "s3").toLowerCase();
              const isLink = srcType === "link";

              const access = isLink ? "free" : String(item?.access || "free").toLowerCase();
              const owned = isLink ? true : (!!item?.owned || access === "free");
              const locked = access === "paid" && !owned;

              const stateLabel = locked ? "Preview" : "Full access";

              const thumb =
                item?.thumbnailUrl ||
                item?.thumbUrl ||
                item?.thumbnail ||
                item?.thumb ||
                item?.posterUrl ||
                item?.coverUrl ||
                item?.imageUrl ||
                "";

              const thumbSrc = thumb ? safeBust(thumb) : "";
              const id = String(item?._id || idx);

              const isBroken = brokenThumbs?.has?.(id);
              const showImg = !!thumbSrc && !isBroken;

              const imgKey = thumb ? `${id}:${thumb}` : `${id}:no-thumb`;

              // ✅ Soft CTA label
              const ctaText = isLink ? "Open" : locked ? "Preview" : "Watch";

              return (
                <div
                  key={id}
                  className="pv-card"
                  role="button"
                  tabIndex={0}
                  aria-label={title}
                  onClick={() => openVideo(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openVideo(item);
                    }
                  }}
                >
                  <div className="pv-media">
                    {showImg ? (
                      <img
                        key={imgKey}
                        src={thumbSrc}
                        alt={title}
                        className="pv-img"
                        loading="lazy"
                        onError={() => {
                          setBrokenThumbs((prev) => {
                            const next = new Set(prev || []);
                            next.add(id);
                            return next;
                          });
                        }}
                      />
                    ) : (
                      <div className="pv-noThumb">
                        <div className="pv-noThumbIcon">🎥</div>
                      </div>
                    )}

                    <div className="pv-grad" />

                    {locked ? <div className="pv-dotIcon" title="Locked">🔒</div> : null}
                    {isLink ? (
                      <div className="pv-dotIcon pv-dotIconLink" title="Link">
                        🔗
                      </div>
                    ) : null}

                    <div className="pv-footer">
                      <div className="pv-footerRow">
                        <div className="pv-footerText">
                          <div className="pv-cardTitle" title={title}>
                            {title}
                          </div>
                          <div className="pv-cardSub">{stateLabel}</div>
                        </div>

                        {/* ✅ Soft CTA button (no nested button issue because outer is a div) */}
                        <button
                          className="pv-ctaBtn"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openVideo(item);
                          }}
                          aria-label={ctaText}
                          title={ctaText}
                        >
                          {ctaText} →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </main>
        )}
      </div>

      <StyleTag />
    </div>
  );
}

function StyleTag() {
  return (
    <style>{`
      .pv-root{
        min-height: 100vh;
        background:#000;
        color:#fff;
        position:relative;
        overflow-x:hidden;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
      }
      .pv-bg{
        position: fixed;
        inset: 0;
        pointer-events: none;
        background:
          radial-gradient(1200px 800px at 50% 15%, rgba(30,30,60,0.55), rgba(0,0,0,1)),
          radial-gradient(900px 600px at 15% 50%, rgba(0,140,255,0.10), rgba(0,0,0,0)),
          radial-gradient(900px 600px at 85% 55%, rgba(255,0,150,0.08), rgba(0,0,0,0));
      }

      .pv-topbar{
        position: sticky;
        top: 0;
        z-index: 20;
        background: linear-gradient(to bottom, rgba(0,0,0,0.92), rgba(0,0,0,0.55), rgba(0,0,0,0));
        backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }
      .pv-topbarInner{
        max-width: 1240px;
        margin: 0 auto;
        padding: 16px 18px 14px;
        display:flex;
        align-items:center;
        gap: 14px;
      }

      .pv-iconBtn{
        width: 42px;
        height: 42px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.06);
        color:#fff;
        font-size: 20px;
        cursor:pointer;
        transition: transform 120ms ease, background 120ms ease, border-color 120ms ease;
      }
      .pv-iconBtn:hover{ background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.18); }
      .pv-iconBtn:active{ transform: scale(0.98); }

      .pv-titleBlock{ flex: 1; min-width: 0; }
      .pv-h1{ font-size: 34px; font-weight: 950; letter-spacing: 0.2px; line-height: 36px; }
      .pv-h2{
        margin-top: 4px;
        color: rgba(255,255,255,0.72);
        font-weight: 800;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .pv-stats{
        margin-top: 10px;
        display:flex;
        align-items:center;
        gap: 10px;
        flex-wrap: wrap;
        color: rgba(255,255,255,0.70);
        font-weight: 800;
        font-size: 12px;
        letter-spacing: 0.2px;
      }
      .pv-dot{
        width: 7px;
        height: 7px;
        border-radius: 999px;
        background: rgba(255,255,255,0.55);
      }
      .pv-chip{
        padding: 6px 10px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.10);
        background: rgba(255,255,255,0.06);
        color: rgba(255,255,255,0.84);
      }
      .pv-chipDim{ background: rgba(0,0,0,0.28); }
      .pv-chipLink{ background: rgba(0,0,0,0.22); border-color: rgba(255,255,255,0.08); }

      .pv-actions{ display:flex; gap: 10px; align-items:center; }
      .pv-refreshBtn{
        display:flex;
        align-items:center;
        gap: 8px;
        padding: 10px 12px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(255,255,255,0.10);
        color:#fff;
        font-weight: 950;
        cursor:pointer;
        transition: transform 120ms ease, background 120ms ease, border-color 120ms ease, opacity 120ms ease;
      }
      .pv-refreshBtn:hover{ background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.20); }
      .pv-refreshBtn:active{ transform: scale(0.99); }
      .pv-refreshBtn:disabled{ opacity: 0.6; cursor: default; }
      .pv-refreshIcon{ display:inline-block; font-size: 16px; line-height: 1; }
      .pv-refreshText{ font-size: 12px; letter-spacing: 0.6px; text-transform: uppercase; }
      .pv-spin{ animation: pvspin 0.9s linear infinite; }

      .pv-shell{
        max-width: 1240px;
        margin: 0 auto;
        padding: 16px 18px 28px;
      }

      .pv-centerCard{
        margin-top: 18px;
        border-radius: 22px;
        border: 1px solid rgba(255,255,255,0.10);
        background: rgba(255,255,255,0.06);
        backdrop-filter: blur(10px);
        padding: 26px 18px;
        display:flex;
        flex-direction: column;
        align-items:center;
        gap: 10px;
        text-align:center;
      }
      .pv-centerText{ color: rgba(255,255,255,0.76); font-weight: 900; }
      .pv-errTitle{ font-weight: 950; font-size: 16px; letter-spacing: 0.2px; }
      .pv-errSub{ color: rgba(255,255,255,0.70); font-weight: 800; max-width: 780px; }
      .pv-row{ display:flex; gap: 10px; margin-top: 6px; }
      .pv-pill{
        padding: 10px 14px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.14);
        background: rgba(0,0,0,0.25);
        color:#fff;
        font-weight: 950;
        cursor:pointer;
      }
      .pv-pill:hover{ background: rgba(255,255,255,0.10); }

      .pv-emptyIcon{ font-size: 30px; opacity: 0.9; margin-bottom: 4px; }

      .pv-spinner{
        width: 30px;
        height: 30px;
        border-radius: 999px;
        border: 3px solid rgba(255,255,255,0.18);
        border-top-color: rgba(255,255,255,0.85);
        animation: pvspin 0.9s linear infinite;
      }

      .pv-grid{
        display:grid;
        gap: 14px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      @media (min-width: 860px){
        .pv-grid{ grid-template-columns: repeat(3, minmax(0, 1fr)); }
      }
      @media (min-width: 1180px){
        .pv-grid{ grid-template-columns: repeat(4, minmax(0, 1fr)); }
      }

      .pv-card{
        border-radius: 18px;
        outline: none;
        cursor: pointer;
      }
      .pv-card:focus-visible .pv-media{
        box-shadow: 0 0 0 3px rgba(0,255,255,0.25), 0 26px 60px rgba(0,0,0,0.45);
        border-color: rgba(0,255,255,0.22);
      }

      .pv-media{
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 9;
        min-height: 210px;
        overflow: hidden;
        border-radius: 18px;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.10);
        box-shadow: 0 18px 44px rgba(0,0,0,0.42);
        transform: translateZ(0);
        transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease, opacity 140ms ease;
      }
      .pv-card:hover .pv-media{
        transform: translateY(-2px);
        border-color: rgba(255,255,255,0.18);
        box-shadow: 0 26px 60px rgba(0,0,0,0.50);
      }
      .pv-card:active .pv-media{ transform: translateY(-1px) scale(0.995); opacity: 0.96; }

      .pv-img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        display:block;
      }

      .pv-noThumb{
        position:absolute;
        inset:0;
        display:flex;
        align-items:center;
        justify-content:center;
        background:
          radial-gradient(800px 400px at 30% 20%, rgba(255,255,255,0.06), rgba(255,255,255,0.02)),
          rgba(255,255,255,0.03);
      }
      .pv-noThumbIcon{ font-size: 28px; opacity: 0.70; }

      .pv-grad{
        position:absolute;
        left:0; right:0; bottom:0;
        height: 56%;
        background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.72));
        pointer-events:none;
      }

      .pv-badge{
        position:absolute;
        top: 12px;
        left: 12px;
        padding: 7px 11px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(0,0,0,0.36);
        color:#fff;
        font-weight: 950;
        font-size: 12px;
        letter-spacing: 0.2px;
        backdrop-filter: blur(10px);
      }
      .pv-badgeLocked{ background: rgba(0,0,0,0.56); }

      .pv-dotIcon{
        position:absolute;
        top: 12px;
        right: 12px;
        width: 34px;
        height: 34px;
        border-radius: 999px;
        display:flex;
        align-items:center;
        justify-content:center;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(0,0,0,0.36);
        font-size: 14px;
        backdrop-filter: blur(10px);
      }
      .pv-dotIconLink{ right: 52px; background: rgba(0,0,0,0.30); }

      .pv-footer{
        position:absolute;
        left: 14px;
        right: 14px;
        bottom: 12px;
      }
      .pv-footerRow{
        display:flex;
        align-items:flex-end;
        justify-content:space-between;
        gap: 10px;
      }
      .pv-footerText{ min-width: 0; }

      .pv-cardTitle{
        font-weight: 950;
        font-size: 15px;
        letter-spacing: 0.2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-shadow: 0 10px 24px rgba(0,0,0,0.55);
      }
      .pv-cardSub{
        margin-top: 4px;
        color: rgba(255,255,255,0.76);
        font-weight: 850;
        font-size: 12px;
        text-shadow: 0 10px 24px rgba(0,0,0,0.55);
      }

      /* ✅ Soft CTA */
      .pv-ctaBtn{
        flex: 0 0 auto;
        padding: 9px 12px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.16);
        background: rgba(255,255,255,0.10);
        color: #fff;
        font-weight: 950;
        cursor: pointer;
        backdrop-filter: blur(10px);
        transition: transform 120ms ease, background 120ms ease, border-color 120ms ease, opacity 120ms ease;
        white-space: nowrap;
      }
      .pv-ctaBtn:hover{
        background: rgba(255,255,255,0.14);
        border-color: rgba(255,255,255,0.22);
      }
      .pv-ctaBtn:active{ transform: scale(0.99); opacity: 0.92; }

      @keyframes pvspin{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @media (prefers-reduced-motion: reduce){
        .pv-card:hover .pv-media{ transform:none; }
        .pv-media{ transition:none; }
        .pv-spin{ animation:none; }
        .pv-spinner{ animation:none; }
      }
    `}</style>
  );
}
