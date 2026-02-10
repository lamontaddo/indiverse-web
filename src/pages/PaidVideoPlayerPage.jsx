// src/pages/PaidVideoPlayerPage.jsx ✅ FULL DROP-IN (Web / Vite)
// Route: /world/:profileKey/paid-videos/:videoId
// ✅ Uses backend: GET /api/paid-videos/:id + GET /api/paid-videos/:id/play?mode=preview|full
// ✅ 30s PREVIEW enforced client-side
// ✅ At 30s: shows Purchase Box with Buy -> Stripe redirect (via /api/checkout/session)
// ✅ Like / Comment / Share (web)
// ✅ Comments drawer + safe fallbacks if endpoints don’t exist
// ✅ TOP-RIGHT LABEL FIX: shows "Preview" only when locked, otherwise "Full Access" (no toggle)
// ✅ Auto-switches mode to full when owned (paid + purchased) or free
//
// ✅ FIX: sends title/currency/priceCents to /api/checkout/session (prevents Invalid priceCents)

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { getProfileByKey } from "../services/profileRegistry";
import { profileFetchRaw } from "../services/profileApi";

const PREVIEW_LIMIT_MS = 30_000;

function cleanStr(v) {
  const s = String(v || "").trim();
  return s || "";
}

async function readJsonSafe(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text || null;
  }
}

function unwrapCountLike(meta, field, fallback = 0) {
  const n = Number(meta?.[field]);
  return Number.isFinite(n) ? n : fallback;
}

function unwrapBool(meta, field, fallback = false) {
  const v = meta?.[field];
  if (typeof v === "boolean") return v;
  if (v === 1 || v === "1") return true;
  if (v === 0 || v === "0") return false;
  return fallback;
}

function fmtCount(n) {
  const x = Number(n || 0);
  if (!Number.isFinite(x) || x <= 0) return "0";
  if (x >= 1_000_000) return `${(x / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (x >= 1_000) return `${(x / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(x);
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
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

// ✅ uses your existing checkout route (same one MusicPage uses)
async function createVideoCheckoutSession({
  profileKey,
  videoId,
  token = "",
  buyerUserId = "",
  title = "Purchase",
  currency = "usd",
  priceCents = 0,
}) {
  const headers = {
    "Content-Type": "application/json",
    "x-profile-key": String(profileKey || ""),
  };
  if (token) headers.Authorization = `Bearer ${String(token)}`;
  if (buyerUserId) headers["x-user-id"] = String(buyerUserId);

  const res = await profileFetchRaw(profileKey, `/api/checkout/session`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      itemType: "video",
      videoId: String(videoId),
      title: String(title || "Purchase"),
      currency: String(currency || "usd").toLowerCase(),
      priceCents: Number(priceCents || 0),
    }),
  });

  const data = await readJsonSafe(res);
  if (!res.ok) throw new Error((data && (data.error || data.message)) || "Unable to start checkout");

  const url = cleanStr(data?.url);
  if (!url) throw new Error("No checkout URL returned");
  return url;
}

/* -------------------- optional: same JWT helpers as MusicPage -------------------- */
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



export default function PaidVideoPlayerPage() {
  const nav = useNavigate();
  const params = useParams();
  const loc = useLocation();

  const profileKey = String(params.profileKey || "lamont").toLowerCase();
  const videoId = String(params.videoId || "").trim();

  useMemo(() => getProfileByKey(profileKey), [profileKey]);
  const videoFromRoute = loc?.state?.video || null;

  const [videoMeta, setVideoMeta] = useState(videoFromRoute);
  const [loadingMeta, setLoadingMeta] = useState(!videoFromRoute);
  const [loadingPlay, setLoadingPlay] = useState(true);
  const [err, setErr] = useState(null);

  const [mode, setMode] = useState("preview"); // preview|full
  const [playUrl, setPlayUrl] = useState(null);

  const videoRef = useRef(null);
  const previewStoppedRef = useRef(false);

  const access = String(videoMeta?.access || "free").toLowerCase();
  const owned = !!videoMeta?.owned || access === "free";
  const isLocked = access === "paid" && !owned;

  // ---- auth (same storage key as MusicPage) ----
  const [token, setToken] = useState(() => localStorage.getItem("buyerToken") || "");
  const isAuthed = !!token;
  const buyerUserId = useMemo(() => decodeJwtUserId(token), [token]);

  const loadEngagement = useCallback(async () => {
    if (!videoId) return;
  
    try {
      console.log("[ENG] loadEngagement start", { profileKey, videoId, hasToken: !!token, buyerUserId });
  
      const headers = {
        "Content-Type": "application/json",
        "x-profile-key": String(profileKey || ""),
      };
      if (token) headers.Authorization = `Bearer ${String(token)}`;
      if (buyerUserId) headers["x-user-id"] = String(buyerUserId);
      // optional but nice:
      // headers["x-username"] = "Web";
  
      const res = await profileFetchRaw(profileKey, `/api/paid-videos/${encodeURIComponent(videoId)}/engagement`, {
        method: "GET",
        headers,
      });
  
      const data = await readJsonSafe(res);
      console.log("[ENG] loadEngagement response", { ok: res.ok, status: res.status, data });
  
      if (!res.ok) {
        // do not throw; keep UI stable
        return;
      }
  
      setLikeCount(Number(data?.likeCount || 0));
      setCommentCount(Number(data?.commentCount || 0));
      setLiked(!!data?.myLike);
      setComments(Array.isArray(data?.comments) ? data.comments : []);
    } catch (e) {
      console.log("[ENG] loadEngagement error", e?.message || e);
    }
  }, [videoId, profileKey, token, buyerUserId]);
  

  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem("buyerToken") || "");
    window.addEventListener("focus", syncToken);
    window.addEventListener("storage", syncToken);
    syncToken();
    return () => {
      window.removeEventListener("focus", syncToken);
      window.removeEventListener("storage", syncToken);
    };
  }, [loc?.key]);

  // ✅ keep mode correct:
  // - locked => preview
  // - owned/free => full
  useEffect(() => {
    if (isLocked && mode !== "preview") setMode("preview");
    if (!isLocked && mode !== "full") setMode("full");
  }, [isLocked, mode]);

  useEffect(() => {
    loadEngagement();
  }, [loadEngagement]);
  

  // --- purchase box state ---
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutErr, setCheckoutErr] = useState(null);

  // --- social state ---
  const [liked, setLiked] = useState(() => unwrapBool(videoFromRoute, "liked", false));
  const [likeCount, setLikeCount] = useState(() => unwrapCountLike(videoFromRoute, "likeCount", 0));
  const [commentCount, setCommentCount] = useState(() => unwrapCountLike(videoFromRoute, "commentCount", 0));

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsErr, setCommentsErr] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  // load meta if not provided
  useEffect(() => {
    if (!videoId || videoFromRoute) return;

    let alive = true;
    (async () => {
      try {
        setLoadingMeta(true);
        setErr(null);

        const res = await profileFetchRaw(profileKey, `/api/paid-videos/${encodeURIComponent(videoId)}`);
        const data = await readJsonSafe(res);

        if (!res.ok) throw new Error((data && (data.error || data.message)) || "Unable to load video");

        if (alive) {
          setVideoMeta(data);
          setLiked(unwrapBool(data, "liked", false));
          setLikeCount(unwrapCountLike(data, "likeCount", 0));
          setCommentCount(unwrapCountLike(data, "commentCount", 0));
        }
      } catch (e) {
        if (alive) setErr(e?.message || "Unable to load video");
      } finally {
        if (alive) setLoadingMeta(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [profileKey, videoId, videoFromRoute]);

  const loadPlayable = useCallback(
    async (m) => {
      if (!videoId) return;

      try {
        previewStoppedRef.current = false;
        setLoadingPlay(true);
        setErr(null);
        setPlayUrl(null);

        const res = await profileFetchRaw(
          profileKey,
          `/api/paid-videos/${encodeURIComponent(videoId)}/play?mode=${encodeURIComponent(m)}`
        );
        const data = await readJsonSafe(res);

        if (!res.ok) throw new Error((data && (data.error || data.message)) || "Playback unavailable");

        if (data?.mode === "link") {
          const url = cleanStr(data?.externalUrl);
          if (url) window.open(url, "_blank", "noopener,noreferrer");
          throw new Error("This is a link video. Opened in a new tab.");
        }

        const url = cleanStr(data?.url);
        if (!url) throw new Error("Missing playback URL");

        setPlayUrl(url);
      } catch (e) {
        setErr(e?.message || "Playback unavailable");
        setPlayUrl(null);
      } finally {
        setLoadingPlay(false);
      }
    },
    [profileKey, videoId]
  );

  useEffect(() => {
    loadPlayable(mode);
  }, [mode, loadPlayable]);

  const openPurchase = useCallback(() => {
    setCheckoutErr(null);
    setPurchaseOpen(true);
  }, []);

  const ensureAuthed = useCallback(() => {
    if (isAuthed && token) return true;
    nav("/auth/login", {
      state: { nextRoute: `/world/${profileKey}/paid-videos/${videoId}`, nextState: { video: videoMeta || null } },
    });
    return false;
  }, [isAuthed, token, nav, profileKey, videoId, videoMeta]);


  const requireLoginToast = useCallback((msg = "Please sign in first.") => {
    console.log("[AUTH] blocked action:", msg, { hasToken: !!token, buyerUserId });
    setErr(msg);
    setTimeout(() => setErr(null), 1400);
  }, [token, buyerUserId]);
  
  const canInteract = !!buyerUserId; // string id OR mongo id — both fine now
  

  const startCheckout = useCallback(async () => {
    if (!videoId || checkoutBusy) return;
    if (!ensureAuthed()) return;

    try {
      setCheckoutBusy(true);
      setCheckoutErr(null);

      const effectiveTitle = cleanStr(videoMeta?.title) || "Purchase";
      const effectiveCurrency = String(videoMeta?.currency || "usd").toLowerCase();
      const effectivePriceCents = Number(videoMeta?.priceCents || 0);

      const url = await createVideoCheckoutSession({
        profileKey,
        videoId,
        token,
        buyerUserId: buyerUserId || "",
        title: effectiveTitle,
        currency: effectiveCurrency,
        priceCents: effectivePriceCents,
      });

      window.location.href = url;
    } catch (e) {
      setCheckoutErr(e?.message || "Checkout failed");
    } finally {
      setCheckoutBusy(false);
    }
  }, [buyerUserId, checkoutBusy, ensureAuthed, profileKey, token, videoId, videoMeta]);

  // enforce 30s preview client-side -> pause + show purchase box
  const onTimeUpdate = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (!isLocked || mode !== "preview") return;
    if (previewStoppedRef.current) return;

    const ms = Math.floor((el.currentTime || 0) * 1000);
    if (ms >= PREVIEW_LIMIT_MS) {
      previewStoppedRef.current = true;
      try {
        el.pause();
      } catch {}
      setErr(null);
      openPurchase();
    }
  }, [isLocked, mode, openPurchase]);

  // prevent seeking beyond 30s in preview
  const onSeeking = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (!isLocked || mode !== "preview") return;

    const limitSec = PREVIEW_LIMIT_MS / 1000;
    if (el.currentTime > limitSec) el.currentTime = limitSec;
  }, [isLocked, mode]);

  const title = videoMeta?.title || "Video";
  const currency = String(videoMeta?.currency || "usd");
  const priceCents = Number(videoMeta?.priceCents || 0);
  const priceLabel = priceCents > 0 ? moneyFromCents(priceCents, currency) : "Purchase";

  // ✅ subtitle under title
  const sub = access === "paid" && isLocked ? "Preview only" : "FULL ACCESS";

  // Like
// ✅ Like (server truth) — sends auth + profile headers + debug logs ✅ FULL DROP-IN
const toggleLike = useCallback(async () => {
    if (!videoId) return;
  
    // must have user id to pass mustUser()
    if (!buyerUserId) {
      console.log("[LIKE] blocked: missing buyerUserId", { hasToken: !!token, buyerUserId });
      setErr("Please sign in to like.");
      setTimeout(() => setErr(null), 1400);
      return;
    }
  
    const url = `/api/paid-videos/${encodeURIComponent(videoId)}/like`;
  
    // optimistic UI (fast), but we will reconcile to server response
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((c) => Math.max(0, Number(c || 0) + (nextLiked ? 1 : -1)));
  
    try {
      const headers = {
        "Content-Type": "application/json",
        "x-profile-key": String(profileKey || ""),
        "x-user-id": String(buyerUserId || ""),
      };
      if (token) headers.Authorization = `Bearer ${String(token)}`;
  
      console.log("[LIKE] start", { profileKey, videoId, url, hasToken: !!token, buyerUserId, optimistic: nextLiked });
  
      const res = await profileFetchRaw(profileKey, url, {
        method: "POST",
        headers,
        body: JSON.stringify({ action: "toggle" }), // harmless; backend ignores it
      });
  
      const data = await readJsonSafe(res);
  
      console.log("[LIKE] response", { ok: res.ok, status: res.status, data });
  
      if (!res.ok) {
        // rollback optimistic change
        setLiked(!nextLiked);
        setLikeCount((c) => Math.max(0, Number(c || 0) + (nextLiked ? -1 : 1)));
  
        const msg = (data && (data.error || data.message)) || "Like failed.";
        setErr(msg);
        setTimeout(() => setErr(null), 1400);
        return;
      }
  
      // server truth
      if (typeof data?.liked === "boolean") setLiked(!!data.liked);
      if (data?.likeCount != null) setLikeCount(Number(data.likeCount) || 0);
    } catch (e) {
      console.log("[LIKE] error", e?.message || e);
  
      // rollback optimistic change
      setLiked(!nextLiked);
      setLikeCount((c) => Math.max(0, Number(c || 0) + (nextLiked ? -1 : 1)));
  
      setErr("Like failed.");
      setTimeout(() => setErr(null), 1400);
    }
  }, [videoId, buyerUserId, token, profileKey, liked]);
  

  // Share
  const share = useCallback(async () => {
    const url = window.location.href;
    const shareTitle = title || "Video";

    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, text: shareTitle, url });
        return;
      }
    } catch {}

    const ok = await copyToClipboard(url);
    if (ok) {
      setErr("Link copied to clipboard.");
      setTimeout(() => setErr(null), 1400);
    } else {
      window.prompt("Copy link:", url);
    }
  }, [title]);


const loadComments = useCallback(async () => {
    if (!videoId) return;
  
    if (!canInteract) {
      console.log("[COMMENTS] skip load: not signed in");
      setComments([]);
      setCommentsErr("Sign in to view and post comments.");
      return;
    }
  
    const url = `/api/paid-videos/${encodeURIComponent(videoId)}/engagement`;
  
    try {
      setCommentsLoading(true);
      setCommentsErr(null);
  
      const headers = {
        "Content-Type": "application/json",
        "x-profile-key": String(profileKey || ""),
      };
      if (token) headers.Authorization = `Bearer ${String(token)}`;
      if (buyerUserId) headers["x-user-id"] = String(buyerUserId);
  
      console.log("[COMMENTS] load start", { profileKey, videoId, url, hasToken: !!token, buyerUserId });
  
      const res = await profileFetchRaw(profileKey, url, {
        method: "GET",
        headers,
      });
  
      const data = await readJsonSafe(res);
  
      console.log("[COMMENTS] load response", {
        ok: res.ok,
        status: res.status,
        data,
      });
  
      if (!res.ok) {
        setComments([]);
        setCommentsErr((data && (data.error || data.message)) || "Comments aren’t available yet for this video.");
        return;
      }
  
      const list = Array.isArray(data?.comments) ? data.comments : [];
      setComments(list);
  
      // backend source of truth
      setCommentCount(Number(data?.commentCount || 0));
    } catch (e) {
      console.log("[COMMENTS] load error", e?.message || e);
      setComments([]);
      setCommentsErr("Unable to load comments.");
    } finally {
      setCommentsLoading(false);
    }
  }, [profileKey, videoId, token, buyerUserId, canInteract]);
  

  useEffect(() => {
    if (!commentsOpen) return;
    loadComments();
  }, [commentsOpen, loadComments]);

// ✅ FULL DROP-IN: postComment (auth headers + logs + safe UI)
const postComment = useCallback(async () => {
    const text = cleanStr(commentText);
    if (!text || postingComment) return;
    if (!videoId) return;
  
    // must have buyerUserId for backend mustUser()
    if (!buyerUserId) {
      console.log("[COMMENTS] post blocked: missing buyerUserId", { hasToken: !!token, buyerUserId });
      setCommentsErr("Please sign in to comment.");
      return;
    }
  
    setPostingComment(true);
    setCommentsErr(null);
  
    const url = `/api/paid-videos/${encodeURIComponent(videoId)}/comments`;
  
    try {
      const headers = {
        "Content-Type": "application/json",
        "x-profile-key": String(profileKey || ""),
        "x-user-id": String(buyerUserId || ""),
        // optional but nice for display:
      
      };
      if (token) headers.Authorization = `Bearer ${String(token)}`;
  
      console.log("[COMMENTS] post start", { profileKey, videoId, url, hasToken: !!token, buyerUserId, textLen: text.length });
  
      const res = await profileFetchRaw(profileKey, url, {
        method: "POST",
        headers,
        body: JSON.stringify({ text }),
      });
  
      const data = await readJsonSafe(res);
  
      console.log("[COMMENTS] post response", { ok: res.ok, status: res.status, data });
  
      if (!res.ok) {
        setCommentsErr((data && (data.error || data.message)) || "Unable to post comment.");
        return;
      }
  
      const created = data?.comment || null;
  
      if (created && typeof created === "object") {
        setComments((prev) => [created, ...(prev || [])]);
        setCommentCount(Number(data?.commentCount || 0));
      } else {
        // fallback: reload list via engagement
        await loadComments();
      }
  
      setCommentText("");
    } catch (e) {
      console.log("[COMMENTS] post error", e?.message || e);
      setCommentsErr("Unable to post comment.");
    } finally {
      setPostingComment(false);
    }
  }, [commentText, postingComment, videoId, buyerUserId, token, profileKey, loadComments]);
  
  // ESC closes comments / purchase
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setCommentsOpen(false);
        setPurchaseOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div style={S.root}>
      <div style={S.bg} />

      <div style={S.topOverlay}>
        <button onClick={() => nav(-1)} style={S.backBtn} aria-label="Back" title="Back">
          ←
        </button>

        <div style={{ minWidth: 0 }}>
          <div style={S.title} title={title}>
            {title}
          </div>
          <div style={S.sub}>{sub}</div>
        </div>

        {/* ✅ TOP-RIGHT: show Preview only if locked; otherwise Full Access (no toggle) */}
        <span style={S.modeBtn} title={isLocked ? "Preview only" : "Full access"}>
          {isLocked ? "Preview" : "Full Access"}
        </span>
      </div>

      <div style={S.playerWrap}>
        {loadingMeta || loadingPlay ? (
          <div style={S.center}>
            <div style={S.spinner} />
            <div style={S.centerText}>Loading…</div>
          </div>
        ) : err && !playUrl ? (
          <div style={S.center}>
            <div style={S.err}>{err}</div>
            <button onClick={() => loadPlayable(mode)} style={S.retryBtn}>
              Retry
            </button>
          </div>
        ) : playUrl ? (
          <video
            key={playUrl}
            ref={videoRef}
            src={playUrl}
            style={S.video}
            controls
            autoPlay
            playsInline
            onTimeUpdate={onTimeUpdate}
            onSeeking={onSeeking}
            onError={() => setErr("Playback error")}
          />
        ) : (
          <div style={S.center}>
            <div style={S.centerText}>No playable source</div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div style={S.actionBar}>
        <button onClick={toggleLike} style={{ ...S.actionBtn, ...(liked ? S.actionBtnActive : {}) }} title="Like">
          <span style={S.actionIcon}>{liked ? "❤️" : "🤍"}</span>
          <span style={S.actionText}>Like</span>
          <span style={S.actionCount}>{fmtCount(likeCount)}</span>
        </button>

        <button
  onClick={() => (canInteract ? setCommentsOpen(true) : requireLoginToast("Please sign in to comment."))}
  style={S.actionBtn}
  title={canInteract ? "Comments" : "Sign in to comment"}
>
          <span style={S.actionIcon}>💬</span>
          <span style={S.actionText}>Comments</span>
          <span style={S.actionCount}>{fmtCount(commentCount)}</span>
        </button>

        <button onClick={share} style={S.actionBtn} title="Share">
          <span style={S.actionIcon}>🔗</span>
          <span style={S.actionText}>Share</span>
        </button>

        {isLocked ? (
          <button onClick={openPurchase} style={{ ...S.actionBtn, ...S.buyBtn }} title="Buy full access">
            <span style={S.actionIcon}>🛒</span>
            <span style={S.actionText}>Buy</span>
          </button>
        ) : null}
      </div>

      {/* Purchase Box */}
      {purchaseOpen ? (
        <div style={S.modalOverlay} onMouseDown={() => setPurchaseOpen(false)}>
          <div style={S.modal} onMouseDown={(e) => e.stopPropagation()}>
            <div style={S.modalTop}>
              <div style={{ minWidth: 0 }}>
                <div style={S.modalTitle}>Unlock full video</div>
                <div style={S.modalSub} title={title}>
                  {title}
                </div>
              </div>
              <button style={S.modalClose} onClick={() => setPurchaseOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>

            <div style={S.modalBody}>
              <div style={S.modalMsg}>Your preview ended. Purchase full access to keep watching.</div>

              {!isAuthed ? (
                <div style={S.modalHint}>
                  You must sign in first to purchase. Click <b>Buy</b> and you’ll be sent to login.
                </div>
              ) : null}

              {checkoutErr ? <div style={S.modalErr}>{checkoutErr}</div> : null}

              <div style={S.modalRow}>
                <button
                  onClick={startCheckout}
                  style={{ ...S.primaryBtn, ...(checkoutBusy ? S.primaryBtnBusy : {}) }}
                  disabled={checkoutBusy}
                >
                  {checkoutBusy ? "Redirecting…" : `Buy (${priceLabel})`}
                </button>

                <button onClick={() => setPurchaseOpen(false)} style={S.secondaryBtn} disabled={checkoutBusy}>
                  Not now
                </button>
              </div>

              <div style={S.modalHint}>Secure checkout via Stripe.</div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Lock note */}
      {isLocked ? <div style={S.lockNote}>Preview is limited to 30 seconds.</div> : null}

      {/* Comments Drawer */}
{/* Comments Drawer */}
{commentsOpen ? (
  <div style={S.drawerOverlay} onMouseDown={() => setCommentsOpen(false)}>
    <div style={S.drawer} onMouseDown={(e) => e.stopPropagation()}>
      <div style={S.drawerHeader}>
        <div style={{ minWidth: 0 }}>
          <div style={S.drawerTitle}>Comments</div>
          <div style={S.drawerSub} title={title}>
            {title}
          </div>
        </div>
        <button onClick={() => setCommentsOpen(false)} style={S.drawerClose} aria-label="Close comments">
          ✕
        </button>
      </div>

      {/* ✅ BODY FIRST (comments list) */}
      <div style={S.drawerBody}>
        {!canInteract ? (
          <div style={{ ...S.centerText, padding: 12 }}>Sign in to see comments.</div>
        ) : commentsLoading ? (
          <div style={{ ...S.centerText, padding: 12 }}>Loading comments…</div>
        ) : comments?.length ? (
          <div style={S.commentList}>
            {comments.map((c, i) => {
              const id = String(c?._id || c?.id || i);
              const name = cleanStr(c?.username || c?.userName || c?.name || c?.author || "User");
              const text = cleanStr(c?.text || c?.body || c?.message || "");
              const when = cleanStr(c?.createdAt || c?.created_at || "");
              return (
                <div key={id} style={S.commentCard}>
                  <div style={S.commentTop}>
                    <div style={S.commentName} title={name}>
                      {name}
                    </div>
                    {when ? <div style={S.commentWhen}>{when}</div> : null}
                  </div>
                  <div style={S.commentText}>{text || "…"}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ ...S.centerText, padding: 12 }}>No comments yet.</div>
        )}
      </div>

      {/* ✅ COMPOSER NOW AT BOTTOM */}
      <div style={S.drawerComposer}>
        {!canInteract ? (
          <div style={S.commentsErr}>Please sign in to view and post comments.</div>
        ) : null}

        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={canInteract ? "Write a comment…" : "Sign in to comment…"}
          style={{ ...S.textarea, ...(canInteract ? null : { opacity: 0.6, cursor: "not-allowed" }) }}
          rows={3}
          disabled={!canInteract}
        />

        <div style={S.drawerComposerRow}>
          <button
            onClick={canInteract ? postComment : () => requireLoginToast("Please sign in to comment.")}
            style={{
              ...S.postBtn,
              ...(postingComment || !cleanStr(commentText) || !canInteract ? S.postBtnDisabled : {}),
            }}
            disabled={postingComment || !cleanStr(commentText) || !canInteract}
          >
            {postingComment ? "Posting…" : "Post"}
          </button>
        </div>

        {commentsErr ? <div style={S.commentsErr}>{commentsErr}</div> : null}
      </div>

      <div style={S.drawerFooter}>
        <button
          onClick={canInteract ? loadComments : () => requireLoginToast("Please sign in to view comments.")}
          style={S.drawerReload}
        >
          Refresh
        </button>
        <div style={S.drawerHint}>Press Esc to close</div>
      </div>
    </div>
  </div>
) : null}



      {/* status line */}
      {err && playUrl ? <div style={S.toast}>{err}</div> : null}
    </div>
  );
}

const S = {
  root: {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    position: "relative",
    overflow: "hidden",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
  },
  bg: {
    position: "fixed",
    inset: 0,
    background: "radial-gradient(1200px 800px at 50% 20%, rgba(20,20,40,0.6), rgba(0,0,0,1))",
    pointerEvents: "none",
  },

  topOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 14px",
    background: "linear-gradient(to bottom, rgba(0,0,0,0.88), rgba(0,0,0,0.40), rgba(0,0,0,0))",
    backdropFilter: "blur(10px)",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.40)",
    color: "#fff",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 900,
  },
  title: {
    fontWeight: 900,
    letterSpacing: 0.2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "70vw",
  },
  sub: { color: "rgba(255,255,255,0.7)", fontWeight: 700, fontSize: 12, marginTop: 2 },
  modeBtn: {
    marginLeft: "auto",
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.10)",
    color: "#fff",
    fontWeight: 900,
    minWidth: 110,
    textAlign: "center",
    userSelect: "none",
  },

  playerWrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 70,
    paddingBottom: 98,
  },
  video: {
    width: "100%",
    height: "calc(100vh - 170px)",
    maxWidth: 1200,
    background: "#000",
    objectFit: "contain",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
  },

  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    padding: 24,
    textAlign: "center",
  },
  centerText: { color: "rgba(255,255,255,0.78)", fontWeight: 800 },
  err: { color: "#fca5a5", fontWeight: 900, maxWidth: 720 },

  retryBtn: {
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.10)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },

  spinner: {
    width: 28,
    height: 28,
    borderRadius: 999,
    border: "3px solid rgba(255,255,255,0.18)",
    borderTopColor: "rgba(255,255,255,0.85)",
    animation: "pvspin 0.9s linear infinite",
  },

  actionBar: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 18,
    zIndex: 12,
    display: "flex",
    justifyContent: "center",
    padding: "0 14px",
    pointerEvents: "none",
  },
  actionBtn: {
    pointerEvents: "auto",
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(12px)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 900,
    letterSpacing: 0.2,
    margin: "0 6px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.50)",
  },
  actionBtnActive: {
    border: "1px solid rgba(255,255,255,0.22)",
    background: "rgba(255,255,255,0.10)",
  },
  buyBtn: { border: "1px solid rgba(0,255,255,0.20)" },
  actionIcon: { fontSize: 16 },
  actionText: { fontSize: 13 },
  actionCount: { fontSize: 12, color: "rgba(255,255,255,0.78)", fontWeight: 900, marginLeft: -2 },

  lockNote: {
    position: "fixed",
    left: 14,
    right: 14,
    bottom: 78,
    zIndex: 10,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.55)",
    color: "rgba(255,255,255,0.82)",
    fontWeight: 800,
    fontSize: 12,
    textAlign: "center",
  },

  // Purchase modal
  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 60,
    background: "rgba(0,0,0,0.60)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    width: "min(520px, 94vw)",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(10,10,14,0.96)",
    boxShadow: "0 40px 120px rgba(0,0,0,0.70)",
    overflow: "hidden",
  },
  modalTop: {
    padding: "14px 14px 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  modalTitle: { fontSize: 16, fontWeight: 950, letterSpacing: 0.2 },
  modalSub: {
    marginTop: 2,
    color: "rgba(255,255,255,0.65)",
    fontWeight: 800,
    fontSize: 12,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 380,
  },
  modalClose: {
    width: 40,
    height: 40,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 900,
  },
  modalBody: { padding: 14 },
  modalMsg: { color: "rgba(255,255,255,0.86)", fontWeight: 900, lineHeight: 1.35 },
  modalErr: { marginTop: 10, color: "#fca5a5", fontWeight: 950, fontSize: 12 },
  modalRow: { marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" },
  primaryBtn: {
    padding: "11px 14px",
    borderRadius: 999,
    border: "1px solid rgba(0,255,255,0.22)",
    background: "rgba(0,255,255,0.12)",
    color: "#fff",
    fontWeight: 950,
    cursor: "pointer",
  },
  primaryBtnBusy: { opacity: 0.75, cursor: "progress" },
  secondaryBtn: {
    padding: "11px 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontWeight: 950,
    cursor: "pointer",
  },
  modalHint: { marginTop: 10, color: "rgba(255,255,255,0.60)", fontWeight: 800, fontSize: 12 },

  // Comments drawer
  drawerOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "flex-end",
  },
  drawer: {
    width: "min(460px, 92vw)",
    height: "100%",
    background: "rgba(10,10,14,0.96)",
    borderLeft: "1px solid rgba(255,255,255,0.10)",
    boxShadow: "-30px 0 80px rgba(0,0,0,0.65)",
    display: "flex",
    flexDirection: "column",
  },
  drawerHeader: {
    padding: "16px 14px 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  drawerTitle: { fontSize: 18, fontWeight: 950, letterSpacing: 0.2 },
  drawerSub: {
    marginTop: 2,
    color: "rgba(255,255,255,0.65)",
    fontWeight: 800,
    fontSize: 12,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 300,
  },
  drawerClose: {
    width: 40,
    height: 40,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 900,
  },

  drawerComposer: { padding: 14, borderTop: "1px solid rgba(255,255,255,0.08)" },
  textarea: {
    width: "100%",
    resize: "none",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    padding: 12,
    fontWeight: 700,
    outline: "none",
    lineHeight: 1.3,
  },
  drawerComposerRow: { display: "flex", justifyContent: "flex-end", paddingTop: 10 },
  postBtn: {
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.10)",
    color: "#fff",
    fontWeight: 950,
    cursor: "pointer",
  },
  postBtnDisabled: { opacity: 0.55, cursor: "not-allowed" },
  commentsErr: { marginTop: 10, color: "#fca5a5", fontWeight: 900, fontSize: 12 },

  drawerBody: { flex: 1, overflow: "auto", padding: 14 },
  commentList: { display: "flex", flexDirection: "column", gap: 10 },
  commentCard: {
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    padding: 12,
  },
  commentTop: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
  commentName: { fontWeight: 950, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  commentWhen: { color: "rgba(255,255,255,0.55)", fontWeight: 800, fontSize: 11, whiteSpace: "nowrap" },
  commentText: { marginTop: 6, color: "rgba(255,255,255,0.88)", fontWeight: 700, fontSize: 13, lineHeight: 1.35 },

  drawerFooter: {
    padding: 14,
    borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  drawerReload: {
    padding: "10px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontWeight: 950,
    cursor: "pointer",
  },
  drawerHint: { color: "rgba(255,255,255,0.55)", fontWeight: 800, fontSize: 12 },

  toast: {
    position: "fixed",
    left: 14,
    right: 14,
    bottom: 140,
    zIndex: 20,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.65)",
    color: "rgba(255,255,255,0.86)",
    fontWeight: 900,
    fontSize: 12,
    textAlign: "center",
  },
};

// inject keyframes once
if (typeof document !== "undefined" && !document.getElementById("pvspin-style")) {
  const s = document.createElement("style");
  s.id = "pvspin-style";
  s.textContent = `@keyframes pvspin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`;
  document.head.appendChild(s);
}
