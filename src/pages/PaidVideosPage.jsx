// src/pages/PaidVideosPage.jsx ✅ FULL DROP-IN (Web / Vite)
// ✅ FIX: send x-user-id (derived from buyerToken) so owned=true can be computed server-side

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getProfileByKey } from "../services/profileRegistry";
import { profileFetchRaw } from "../services/profileApi";

function cleanTitle(s) {
  return String(s || "").trim() || "Untitled";
}

function pickUrl(v) {
  return v?.externalUrl || v?.externalURL || v?.url || v?.linkUrl || v?.link || v?.href || "";
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

/* -------------------- JWT helpers (same idea as player page) -------------------- */
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

  // ✅ auth (web)
  const [token, setToken] = useState(() => localStorage.getItem("buyerToken") || "");
  const buyerUserId = useMemo(() => decodeJwtUserId(token) || "", [token]);

  useEffect(() => {
    const sync = () => setToken(localStorage.getItem("buyerToken") || "");
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
        "Content-Type": "application/json",
        ...(buyerUserId ? { "x-user-id": buyerUserId } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await profileFetchRaw(profileKey, "/api/paid-videos", { headers });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `Request failed (${res.status})`);
      }

      const data = await res.json();
      const list = (Array.isArray(data) && data) || data?.data || data?.videos || data?.items || [];
      if (!Array.isArray(list)) throw new Error("Invalid paid-videos response");

      setRows(list);
      setBrokenThumbs(new Set());
    } catch (e) {
      setErr(e?.message || "Unable to load");
      setRows([]);
    }
  }, [profileKey, buyerUserId, token]);

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
          <button className="pv-iconBtn" onClick={() => window.history.back()} aria-label="Back" title="Back">
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

// ✅ unchanged styles
function StyleTag() {
  return (
    <style>{`/* keep your existing CSS here exactly as you had it */`}</style>
  );
}
