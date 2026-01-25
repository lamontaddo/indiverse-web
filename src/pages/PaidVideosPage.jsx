// src/pages/PaidVideosPage.jsx ✅ FULL DROP-IN (Web / Vite) — COMPATIBLE WITH profileFetch()
// ✅ Uses your existing profileFetch(profileKey, path)
// ✅ Signed thumbnail safe: cache-bust + <img> remount
// ✅ Link videos open in new tab
// ✅ S3 videos navigate to player page (change path if you use a different route)

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getProfileByKey } from "../services/profileRegistry";
import { profileFetch } from "../services/profileApi";

function cleanTitle(s) {
  return String(s || "").trim() || "Untitled";
}

function unwrapList(res) {
  if (Array.isArray(res)) return res;

  if (res && typeof res === "object") {
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.videos)) return res.videos;
    if (Array.isArray(res.items)) return res.items;
    if (Array.isArray(res.rows)) return res.rows;

    // normalized ok shape
    if (res.ok === true && Array.isArray(res.data)) return res.data;
    if (res.__ok === true && Array.isArray(res.data)) return res.data;
  }

  return null;
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

function bust(url) {
  const u = String(url || "").trim();
  if (!u) return "";
  const join = u.includes("?") ? "&" : "?";
  return `${u}${join}v=${Date.now()}`;
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

  const fetchList = useCallback(async () => {
    try {
      setErr(null);
  
      // 🔑 use RAW fetch so we fully control parsing
      const res = await profileFetchRaw(profileKey, "/api/paid-videos");
  
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `Request failed (${res.status})`);
      }
  
      const data = await res.json();
  
      // backend may return:
      // - array
      // - { ok:true, data: [...] }
      // - { videos: [...] }
      const list =
        (Array.isArray(data) && data) ||
        data?.data ||
        data?.videos ||
        data?.items ||
        [];
  
      if (!Array.isArray(list)) {
        throw new Error("Invalid paid-videos response");
      }
  
      setRows(list);
    } catch (e) {
      setErr(e?.message || "Unable to load");
      setRows([]);
    }
  }, [profileKey]);
  

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

      // ✅ Link behavior
      if (srcType === "link") {
        const url = String(pickUrl(video) || "").trim();
        if (!url) {
          window.alert("Missing link: No URL found.");
          return;
        }
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }

      // ✅ S3 behavior -> go to player page
      const access = String(video?.access || "free").toLowerCase();
      const owned = !!video?.owned || access === "free";

      // ⚠️ IMPORTANT:
      // This route must exist in your App.jsx to work.
      // If you don't have a player page yet, leave this for now or change to your existing route.
      nav(`/world/${profileKey}/paid-videos/${String(video?._id || "")}`, {
        state: { video: { ...video, owned } },
      });
    },
    [nav, profileKey]
  );

  const titleLine = profile?.label ? `${profile.label} • ${profileKey}` : profileKey;

  return (
    <div style={S.root}>
      <div style={S.bg} />

      <header style={S.header}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={S.h1}>Content</div>
          <div style={S.h2} title={titleLine}>
            {titleLine}
          </div>
        </div>

        <button
          onClick={() => window.history.back()}
          style={S.closeBtn}
          aria-label="Back"
          title="Back"
        >
          ✕
        </button>
      </header>

      <div style={S.actions}>
        <button onClick={onRefresh} style={S.refreshBtn} disabled={refreshing}>
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {loading ? (
        <div style={S.center}>
          <div style={S.spinner} />
          <div style={S.centerText}>Loading videos…</div>
        </div>
      ) : err ? (
        <div style={S.center}>
          <div style={{ ...S.centerText, color: "#fca5a5" }}>{err}</div>
          <button onClick={fetchList} style={S.retryBtn}>
            Retry
          </button>
        </div>
      ) : (
        <main style={S.gridWrap}>
          <div style={S.grid}>
            {rows.map((item, idx) => {
              const title = cleanTitle(item?.title);

              const srcType = String(item?.sourceType || "s3").toLowerCase();
              const isLink = srcType === "link";

              const access = isLink ? "free" : String(item?.access || "free").toLowerCase();
              const owned = isLink ? true : (!!item?.owned || access === "free");
              const locked = access === "paid" && !owned;

              const badgeText = locked ? "Preview" : "Full";
              const stateLabel = locked ? "Preview" : "Full access";

              const thumb = item?.thumbnailUrl || "";
              const thumbSrc = thumb ? bust(thumb) : "";

              return (
                <button
                  key={String(item?._id || idx)}
                  onClick={() => openVideo(item)}
                  style={{
                    ...S.card,
                    borderRight: idx % 2 === 0 ? S.hairlineBorder : "none",
                  }}
                >
                  <div style={S.thumb}>
                    {thumbSrc ? (
                      <img
                        key={thumbSrc || "no-thumb"} // ✅ remount if signed URL changes
                        src={thumbSrc}
                        alt={title}
                        style={S.thumbImg}
                        loading="lazy"
                        onError={(e) => {
                          // hide broken img and show placeholder underneath
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : null}

                    {!thumbSrc ? (
                      <div style={S.noThumb}>
                        <div style={S.noThumbIcon}>🎥</div>
                      </div>
                    ) : null}

                    <div style={S.footerGrad} />

                    <div style={{ ...S.badge, ...(locked ? S.badgeLocked : {}) }}>
                      {badgeText}
                    </div>

                    {locked ? <div style={S.lockDot}>🔒</div> : null}
                    {isLink ? <div style={S.linkDot}>🔗</div> : null}

                    <div style={S.footer}>
                      <div style={S.cardTitle} title={title}>
                        {title}
                      </div>
                      <div style={S.cardSub}>{stateLabel}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {rows.length === 0 ? (
            <div style={S.empty}>
              <div style={S.emptyTitle}>No videos yet</div>
              <div style={S.emptySub}>
                Publish videos from the owner dashboard to see them here.
              </div>
            </div>
          ) : null}
        </main>
      )}
    </div>
  );
}

const S = {
  root: {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    position: "relative",
    overflowX: "hidden",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
  },
  bg: {
    position: "fixed",
    inset: 0,
    background:
      "radial-gradient(1200px 800px at 50% 20%, rgba(20,20,40,0.6), rgba(0,0,0,1))",
    pointerEvents: "none",
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 5,
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "18px 16px 12px",
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.92), rgba(0,0,0,0.55), rgba(0,0,0,0))",
    backdropFilter: "blur(10px)",
  },
  h1: { fontSize: 34, fontWeight: 900, letterSpacing: 0.2, lineHeight: "38px" },
  h2: {
    marginTop: 4,
    color: "rgba(255,255,255,0.7)",
    fontWeight: 700,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: 18,
    cursor: "pointer",
  },

  actions: { padding: "0 16px 10px" },
  refreshBtn: {
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.10)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },

  center: {
    paddingTop: 80,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  centerText: { color: "rgba(255,255,255,0.75)", fontWeight: 800 },
  spinner: {
    width: 28,
    height: 28,
    borderRadius: 999,
    border: "3px solid rgba(255,255,255,0.18)",
    borderTopColor: "rgba(255,255,255,0.85)",
    animation: "spin 0.9s linear infinite",
  },
  retryBtn: {
    marginTop: 6,
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.10)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },

  gridWrap: { paddingBottom: 18 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
  hairlineBorder: "1px solid rgba(255,255,255,0.08)",
  card: {
    padding: 0,
    margin: 0,
    border: "none",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "transparent",
    cursor: "pointer",
    textAlign: "left",
  },
  thumb: {
    position: "relative",
    width: "100%",
    height: 230,
    background: "rgba(255,255,255,0.04)",
    overflow: "hidden",
  },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },

  noThumb: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.04)",
  },
  noThumbIcon: { fontSize: 28, opacity: 0.65 },

  footerGrad: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 96,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.62))",
  },

  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(0,0,0,0.40)",
    border: "1px solid rgba(255,255,255,0.12)",
    fontWeight: 900,
    fontSize: 12,
    letterSpacing: 0.2,
  },
  badgeLocked: { background: "rgba(0,0,0,0.60)" },

  lockDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.40)",
    border: "1px solid rgba(255,255,255,0.12)",
    fontSize: 14,
  },
  linkDot: {
    position: "absolute",
    top: 10,
    right: 46,
    width: 30,
    height: 30,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.32)",
    border: "1px solid rgba(255,255,255,0.10)",
    fontSize: 14,
  },

  footer: { position: "absolute", left: 12, right: 12, bottom: 10 },
  cardTitle: {
    fontWeight: 900,
    fontSize: 15,
    letterSpacing: 0.2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardSub: {
    marginTop: 3,
    color: "rgba(255,255,255,0.72)",
    fontWeight: 800,
    fontSize: 12,
  },

  empty: { paddingTop: 40, textAlign: "center" },
  emptyTitle: { fontWeight: 900, marginTop: 4 },
  emptySub: {
    marginTop: 8,
    color: "rgba(255,255,255,0.65)",
    fontWeight: 700,
    maxWidth: 520,
    marginInline: "auto",
  },
};

// inject keyframes once
if (typeof document !== "undefined" && !document.getElementById("pv-spin-style")) {
  const s = document.createElement("style");
  s.id = "pv-spin-style";
  s.textContent = `@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`;
  document.head.appendChild(s);
}
