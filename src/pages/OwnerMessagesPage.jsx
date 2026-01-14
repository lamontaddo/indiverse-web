// src/pages/OwnerMessagesPage.jsx ✅ FULL DROP-IN (Web) — AUTH THREADS v3 + DISPLAY NAME
// Route: /world/:profileKey/owner/messages
//
// Uses:
//  - GET /api/owner/chat/threads
//
// Adds:
// ✅ Auth thread title uses user info (name/username/email) when available
// ✅ Passes { user } into OwnerChat route state for header
//
// Hardened:
// ✅ NO 'lamont' fallback
// ✅ profileKey: route param -> localStorage('profileKey') only
// ✅ If missing profileKey: blocks API + shows banner
// ✅ 401/403 redirects to OwnerLogin
// ✅ res.ok checks everywhere
// ✅ Polling (3s) only when tab is visible
//
// Notes:
// - This navigates to: /world/:profileKey/owner/chat
//   If you haven’t built it yet, it still navigates (you can add later).

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getProfileByKey } from "../services/profileRegistry";

const POLL_MS = 3000;

function normalizePk(pk) {
  return String(pk || "").trim().toLowerCase();
}

function getActiveProfileKeyWeb() {
  try {
    return normalizePk(localStorage.getItem("profileKey"));
  } catch {
    return "";
  }
}

function ownerTokenKey(profileKey) {
  return `ownerToken:${normalizePk(profileKey)}`;
}

function getOwnerToken(profileKey) {
  try {
    return (
      localStorage.getItem(ownerTokenKey(profileKey)) ||
      localStorage.getItem("ownerToken") ||
      ""
    );
  } catch {
    return "";
  }
}

async function readJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

// ✅ web owner fetch (no throw, returns Response)
async function ownerFetchRawWeb(path, { profileKey, method = "GET", body } = {}) {
  const pk = normalizePk(profileKey);
  const token = getOwnerToken(pk);

  const res = await fetch(path, {
    method,
    headers: {
      "content-type": "application/json",
      "x-profile-key": pk,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });

  return res;
}

function formatThreadTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;

  const min = Math.floor(diffMs / 60000);
  const hr = Math.floor(diffMs / 3600000);
  const day = Math.floor(diffMs / 86400000);

  if (min < 1) return "Now";
  if (min < 60) return `${min}m`;
  if (hr < 24) return `${hr}h`;
  if (day === 1) return "Yesterday";

  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function normalizeThreadsPayload(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.threads)) return data.threads;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
}

const getDisplayNameFromContact = (c) =>
  `${c?.firstName || ""} ${c?.lastName || ""}`.trim() || "(No name)";

function isPlainObject(v) {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function pickAuthUserObject(t) {
  const candidates = [t?.user, t?.authUser, t?.account, t?.customer, t?.profile, t?.identity];
  for (const c of candidates) {
    if (isPlainObject(c)) return c;
  }
  return null;
}

function getDisplayNameFromAuth(t) {
  const u = pickAuthUserObject(t);

  const full =
    `${u?.firstName || ""} ${u?.lastName || ""}`.trim() ||
    u?.name ||
    u?.fullName ||
    u?.displayName ||
    u?.username ||
    u?.handle ||
    "";

  if (full) return String(full).trim();
  if (u?.email) return String(u.email).trim();
  if (t?.userId) return `User ${String(t.userId).slice(0, 8)}…`;
  return "(Unknown user)";
}

function getThreadTitle(t) {
  if (t?.contact) return getDisplayNameFromContact(t.contact);
  if (t?.threadType === "auth" || t?.userId) return getDisplayNameFromAuth(t);
  return "(Unknown user)";
}

function getThreadSubtitle(t) {
  const lastBody = t?.lastMessage?.body || "";
  if (lastBody) return lastBody.length > 60 ? lastBody.slice(0, 57) + "…" : lastBody;
  return "No messages yet. Tap to open.";
}

function getInitialsForThread(t) {
  if (t?.contact) {
    const f = t.contact?.firstName?.trim?.()[0] || "";
    const l = t.contact?.lastName?.trim?.()[0] || "";
    const s = (f + l).toUpperCase();
    return s || "?";
  }

  const u = pickAuthUserObject(t);
  const f =
    (u?.firstName || u?.name || u?.displayName || u?.username || "").trim?.()[0] || "";
  const l = (u?.lastName || "").trim?.()[0] || "";
  const s = (f + l).toUpperCase().trim();
  return s || "U";
}

function threadsSignature(arr) {
  return (arr || [])
    .map((t) => {
      const id =
        t?.threadType === "auth"
          ? `auth:${t?.userId || ""}`
          : `c:${t?.contact?._id || t?.contactId || ""}`;
      const ts = t?.lastAt || t?.lastMessage?.createdAt || "";
      const u = Number(t?.unreadCount || 0);
      return `${id}:${ts}:${u}`;
    })
    .join("|");
}

export default function OwnerMessagesPage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const routePk = normalizePk(params?.profileKey);
  const storedPk = getActiveProfileKeyWeb();
  const resolved = routePk || storedPk || "";

  const [profileKey, setProfileKey] = useState(resolved || "");
  const [profileReady, setProfileReady] = useState(false);

  const bgUrl = location?.state?.bgUrl || null;

  const [ownerLabel, setOwnerLabel] = useState("Owner");
  const [accent, setAccent] = useState("#818cf8");

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true); // first load only
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");

  // anti-blink / anti-overlap
  const didInitialLoadRef = useRef(false);
  const lastSigRef = useRef("");
  const inFlightRef = useRef(false);
  const pollRef = useRef(null);

  const canUseApi = useMemo(() => !!profileKey, [profileKey]);

  const goOwnerLogin = useCallback(
    (key) => {
      const k = normalizePk(key || profileKey);
      if (!k) return navigate("/", { replace: true });

      navigate(`/world/${encodeURIComponent(k)}/owner/login`, {
        replace: true,
        state: { profileKey: k, bgUrl },
      });
    },
    [navigate, profileKey, bgUrl]
  );

  const goBack = () => {
    if (!profileKey) return navigate("/", { replace: false });
    navigate(`/world/${encodeURIComponent(profileKey)}/owner/home`, {
      state: { profileKey, bgUrl },
    });
  };

  // resolve profile meta
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const next = normalizePk(routePk || storedPk || "");
        if (!mounted) return;

        setProfileKey(next || "");
        if (!next) {
          setOwnerLabel("Owner");
          setAccent("#818cf8");
          setProfileReady(true);
          return;
        }

        const profile = getProfileByKey(next);
        setOwnerLabel(profile?.label || profile?.brandTopTitle || "Owner");
        setAccent(profile?.accent || "#818cf8");
        setProfileReady(true);
      } catch {
        if (!mounted) return;
        setProfileReady(true);
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routePk]);

  const fetchThreads = useCallback(
    async ({ isRefresh = false } = {}) => {
      if (!profileReady) return;

      if (!profileKey) {
        setThreads([]);
        setError("Missing profileKey. Open this page with /world/:profileKey/owner/messages.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (inFlightRef.current) return;
      inFlightRef.current = true;

      const isInitial = !didInitialLoadRef.current;

      try {
        setError(null);
        if (isInitial) setLoading(true);
        if (isRefresh) setRefreshing(true);

        const res = await ownerFetchRawWeb("/api/owner/chat/threads", { profileKey });
        const data = await readJsonSafe(res);

        if (res.status === 401 || res.status === 403) {
          setThreads([]);
          setError("Session expired. Please log in again.");
          goOwnerLogin(profileKey);
          return;
        }

        if (!res.ok || data?.ok === false) {
          throw new Error(
            data?.error || data?.message || `Failed to load message threads (${res.status}).`
          );
        }

        const raw = normalizeThreadsPayload(data);

        // ✅ hide threads that have no messages at all (unless unread > 0)
        const arr = raw.filter((t) => {
          const ts = t?.lastAt || t?.lastMessage?.createdAt;
          const hasMsg = !!t?.lastMessage?.body || !!ts;
          const unread = Number(t?.unreadCount || 0);
          return hasMsg || unread > 0;
        });

        const sig = threadsSignature(arr);
        if (sig !== lastSigRef.current) {
          lastSigRef.current = sig;
          setThreads(arr);
        }

        if (!didInitialLoadRef.current) didInitialLoadRef.current = true;
      } catch (err) {
        const msg = err?.message || "Failed to load messages.";
        setError(msg);

        if (String(msg).toLowerCase().includes("unauthorized")) {
          setThreads([]);
          goOwnerLogin(profileKey);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
        inFlightRef.current = false;
      }
    },
    [profileReady, profileKey, goOwnerLogin]
  );

  useEffect(() => {
    if (!profileReady) return;
    fetchThreads();
  }, [profileReady, fetchThreads]);

  // ✅ Poll only when visible
  useEffect(() => {
    if (!profileReady || !profileKey) return;

    const start = () => {
      if (pollRef.current) return;
      pollRef.current = setInterval(() => fetchThreads(), POLL_MS);
    };

    const stop = () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    };

    const onVis = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };

    // start immediately if visible
    if (document.visibilityState === "visible") start();

    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      stop();
    };
  }, [profileReady, profileKey, fetchThreads]);

  const visibleThreads = useMemo(() => {
    const q = String(search || "").trim().toLowerCase();
    if (!q) return threads;

    return threads.filter((t) => {
      const name = (t?.contact ? getDisplayNameFromContact(t.contact) : getDisplayNameFromAuth(t)).toLowerCase();
      const phone = String(t?.contact?.phone || "").toLowerCase();
      const lastBody = String(t?.lastMessage?.body || "").toLowerCase();
      const userId = String(t?.userId || "").toLowerCase();
      const email = String(pickAuthUserObject(t)?.email || "").toLowerCase();
      return (
        name.includes(q) ||
        phone.includes(q) ||
        lastBody.includes(q) ||
        userId.includes(q) ||
        email.includes(q)
      );
    });
  }, [threads, search]);

  const openThread = useCallback(
    (thread) => {
      if (!profileKey) return;

      const isAuth = thread?.threadType === "auth" || (!!thread?.userId && !thread?.contact);

      const state = isAuth
        ? {
            profileKey,
            bgUrl,
            threadType: "auth",
            userId: thread?.userId || null,
            user: pickAuthUserObject(thread), // ✅ pass through for header
            contact: null,
            contactId: null,
          }
        : {
            profileKey,
            bgUrl,
            threadType: "contact",
            contact: thread?.contact || null,
            contactId: thread?.contact?._id || thread?.contactId || null,
            user: null,
          };

      navigate(`/world/${encodeURIComponent(profileKey)}/owner/chat`, { state });
    },
    [navigate, profileKey, bgUrl]
  );

  return (
    <div style={styles.page(accent)}>
      <style>{css(accent)}</style>

      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={goBack} title="Back">
          ←
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={styles.title}>{ownerLabel} Messages</div>
          <div style={styles.subtitle}>
            {threads.length} thread{threads.length === 1 ? "" : "s"}
            {profileKey ? ` • ${profileKey}` : ""}
          </div>
          {!canUseApi ? (
            <div style={{ ...styles.subtitle, color: "#fca5a5" }}>Missing profileKey.</div>
          ) : null}
        </div>

        <button
          style={{ ...styles.ghostBtn, opacity: refreshing ? 0.7 : 1 }}
          onClick={() => fetchThreads({ isRefresh: true })}
          disabled={!canUseApi || refreshing}
          title="Refresh"
        >
          ⟳
        </button>
      </div>

      {/* Search */}
      <div style={styles.searchWrap}>
        <span style={{ opacity: 0.9 }}>🔎</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, phone, userId, email, or message"
          style={styles.searchInput}
        />
        {search ? (
          <button style={styles.clearBtn} onClick={() => setSearch("")} title="Clear">
            ✕
          </button>
        ) : null}
      </div>

      {/* Error */}
      {error ? (
        <div style={styles.errorBanner}>
          <div style={styles.errorText}>{error}</div>
          <button style={styles.retryBtn} onClick={() => fetchThreads({ isRefresh: true })}>
            Retry
          </button>
        </div>
      ) : null}

      {/* Body */}
      {loading ? (
        <div style={styles.center}>
          <div className="spinner" />
          <div style={styles.muted}>Loading messages…</div>
        </div>
      ) : !profileKey ? (
        <div style={styles.center}>
          <div style={styles.emptyTitle}>Missing profileKey</div>
          <div style={styles.muted}>Open with /world/:profileKey/owner/messages.</div>
        </div>
      ) : visibleThreads.length === 0 ? (
        <div style={styles.center}>
          <div style={styles.emptyTitle}>No conversations yet</div>
          <div style={styles.muted}>
            Once people start messaging you, their chats will appear here.
          </div>
        </div>
      ) : (
        <div style={styles.list}>
          {visibleThreads.map((t, idx) => {
            const title = getThreadTitle(t);
            const subtitle = getThreadSubtitle(t);
            const initials = getInitialsForThread(t);

            const timeLabel = formatThreadTime(t?.lastAt || t?.lastMessage?.createdAt);
            const unread = Number(t?.unreadCount || 0);

            const phone = t?.contact?.phone ? String(t.contact.phone) : "";
            const isAuth = t?.threadType === "auth" || (!!t?.userId && !t?.contact);

            const authUser = pickAuthUserObject(t);
            const authMeta =
              authUser?.email ||
              (t?.userId ? `${String(t.userId).slice(0, 12)}…` : "");

            const key =
              (t?.threadType === "auth"
                ? `auth:${t?.userId || idx}`
                : `c:${t?.contact?._id || t?.contactId || t?._id || idx}`) || String(idx);

            return (
              <button
                key={key}
                style={styles.threadRowBtn}
                onClick={() => openThread(t)}
                title="Open thread"
              >
                <div style={styles.threadRow}>
                  <div style={styles.avatar}>{initials || "?"}</div>

                  <div style={styles.threadMid}>
                    <div style={styles.nameRow}>
                      <div style={styles.threadName} title={title}>
                        {title}
                      </div>

                      {phone ? (
                        <div style={styles.threadMeta} title={phone}>
                          {phone}
                        </div>
                      ) : isAuth && authMeta ? (
                        <div style={styles.threadMeta} title={authMeta}>
                          {authMeta}
                        </div>
                      ) : null}
                    </div>

                    <div style={styles.threadSub} title={subtitle}>
                      {subtitle}
                    </div>
                  </div>

                  <div style={styles.threadRight}>
                    {unread ? (
                      <div style={styles.unreadPill}>
                        <span style={styles.unreadText}>{unread > 99 ? "99+" : String(unread)}</span>
                      </div>
                    ) : null}

                    {timeLabel ? <div style={styles.time}>{timeLabel}</div> : null}
                    <div style={{ opacity: 0.7 }}>›</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: (accent) => ({
    minHeight: "100vh",
    background: "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.92))",
    color: "#e5e7eb",
    padding: 16,
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
    position: "relative",
  }),

  header: { display: "flex", alignItems: "center", gap: 12, paddingBottom: 12 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.10)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
  ghostBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },

  title: { color: "#fff", fontSize: 22, fontWeight: 900, letterSpacing: 0.8 },
  subtitle: { marginTop: 4, color: "#cfd3dc", fontSize: 12 },

  searchWrap: {
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.06)",
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#fff",
    fontSize: 14,
  },
  clearBtn: {
    border: "none",
    background: "transparent",
    color: "#cfd3dc",
    cursor: "pointer",
    fontWeight: 900,
  },

  errorBanner: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 12,
    background: "rgba(255,0,0,0.12)",
    border: "1px solid rgba(255,0,0,0.40)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  errorText: { color: "#ffb3b3", fontSize: 12, fontWeight: 900, flex: 1 },
  retryBtn: {
    borderRadius: 999,
    padding: "8px 12px",
    border: "1px solid rgba(255,255,255,0.22)",
    background: "rgba(15,23,42,0.75)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },

  list: { display: "flex", flexDirection: "column", gap: 10, paddingBottom: 24 },

  threadRowBtn: {
    border: "none",
    background: "transparent",
    padding: 0,
    textAlign: "left",
    cursor: "pointer",
  },

  threadRow: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.12)",
    background:
      "radial-gradient(circle at 25% 15%, rgba(255,255,255,0.12), rgba(255,255,255,0.03) 55%, rgba(255,255,255,0) 70%)",
    padding: 12,
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(96,165,250,0.30)",
    border: "1px solid rgba(191,219,254,0.90)",
    color: "#0b1020",
    fontWeight: 900,
    letterSpacing: 0.8,
    flex: "0 0 auto",
  },

  threadMid: { flex: 1, minWidth: 0 },
  nameRow: { display: "flex", alignItems: "baseline", gap: 10 },
  threadName: {
    color: "#f9fafb",
    fontWeight: 900,
    fontSize: 15,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "70%",
  },
  threadMeta: {
    color: "#94a3b8",
    fontSize: 11,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: "1 1 auto",
  },
  threadSub: {
    color: "#cfd3dc",
    opacity: 0.85,
    fontSize: 12,
    marginTop: 4,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  threadRight: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 6,
    flex: "0 0 auto",
  },

  unreadPill: {
    minWidth: 22,
    height: 22,
    padding: "0 7px",
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(34,197,94,0.95)",
    border: "1px solid rgba(187,247,208,0.95)",
  },
  unreadText: { color: "#052e16", fontWeight: 900, fontSize: 11 },

  time: { color: "#9ca3af", fontSize: 11 },

  center: { padding: 26, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 },
  emptyTitle: { color: "#fff", fontSize: 18, fontWeight: 900 },
  muted: { color: "#cfd3dc", fontSize: 13, textAlign: "center" },
};

function css(accent) {
  return `
    .spinner{
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.25);
      border-top-color: ${accent || "rgba(255,255,255,0.85)"};
      border-radius: 999px;
      animation: spin 0.9s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `;
}
