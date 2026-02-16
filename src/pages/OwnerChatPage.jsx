// src/pages/OwnerChatPage.jsx ✅ FULL DROP-IN (Web) — ABSOLUTE API + HARDENED
// Route: /world/:profileKey/owner/chat
//
// ✅ Sticky composer (no bottom gap) + tight keyboard feel
// ✅ Auto-scroll to bottom on initial load + after send
// ✅ While typing, keeps list pinned to bottom
// ✅ AUTH thread: header uses real name/email if backend returns { user, messages }
//    OR if passed via route state { user } from OwnerMessagesPage
// ✅ CONTACT thread: supports contact endpoints fallbacks
// ✅ Missing profileKey blocks API + shows banner
// ✅ 401/403 redirects to /world/:profileKey/owner/login
// ✅ Polling 3s only when tab visible
//
// Uses (owner auth):
// - AUTH:
//    GET    /api/owner/chat/:userId/messages
//    POST   /api/owner/chat/:userId/messages   { body }
//    DELETE /api/owner/chat/:userId/messages
// - CONTACT (compat fallbacks):
//    GET    /api/owner/messages/:contactId
//    GET    /api/contacts/:contactId/messages
//    GET    /api/messages?contactId=...
//
//    POST   /api/owner/messages                { contactId, body }
//    POST   /api/contacts/:contactId/messages  { body, sender:'owner' }
//    POST   /api/messages                      { contactId, body, sender:'owner' }
//
//    DELETE /api/contacts/:contactId/messages
//    DELETE /api/messages?contactId=...
//    POST   /api/messages/clear                { contactId }
//
// Requires:
// - src/utils/ownerApi.web.js (exports ownerFetchRawWeb, normalizeProfileKey)
// - src/services/profileRegistry.js (getProfileByKey)

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getProfileByKey } from "../services/profileRegistry";
import { ownerFetchRawWeb, normalizeProfileKey } from "../utils/ownerApi.web";

const POLL_MS = 3000;

/* -------------------- helpers -------------------- */

function isPlainObject(v) {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function safeUserObj(x) {
  if (!isPlainObject(x)) return null;
  return x;
}

function authDisplayName(u, userId) {
  const user = safeUserObj(u);

  const full =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
    user?.name ||
    user?.fullName ||
    user?.displayName ||
    user?.username ||
    user?.handle ||
    "";

  if (full) return String(full).trim();
  if (user?.email) return String(user.email).trim();
  if (userId) return `User ${String(userId).slice(0, 8)}…`;
  return "(Unknown user)";
}

function normalizeMessagesResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.messages)) return data.messages;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

async function readJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

function formatTime(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  } catch {
    return "";
  }
}

function isAtBottom(el, thresholdPx = 28) {
  if (!el) return true;
  return el.scrollHeight - el.scrollTop - el.clientHeight < thresholdPx;
}

/* -------------------- CONTACT compat helpers -------------------- */

async function fetchOwnerMessagesForContact(profileKey, contactId) {
  let res = await ownerFetchRawWeb(`/api/owner/messages/${encodeURIComponent(contactId)}`, {
    profileKey,
    method: "GET",
  });
  if (res.status !== 404) return res;

  res = await ownerFetchRawWeb(`/api/contacts/${encodeURIComponent(contactId)}/messages`, {
    profileKey,
    method: "GET",
  });
  if (res.status !== 404) return res;

  return ownerFetchRawWeb(`/api/messages?contactId=${encodeURIComponent(contactId)}`, {
    profileKey,
    method: "GET",
  });
}

async function postOwnerMessageToContact(profileKey, contactId, body) {
  let res = await ownerFetchRawWeb(`/api/owner/messages`, {
    profileKey,
    method: "POST",
    body: JSON.stringify({ contactId, body }),
  });
  if (res.status !== 404) return res;

  res = await ownerFetchRawWeb(`/api/contacts/${encodeURIComponent(contactId)}/messages`, {
    profileKey,
    method: "POST",
    body: JSON.stringify({ body, sender: "owner" }),
  });
  if (res.status !== 404) return res;

  return ownerFetchRawWeb(`/api/messages`, {
    profileKey,
    method: "POST",
    body: JSON.stringify({ contactId, body, sender: "owner" }),
  });
}

async function deleteOwnerChatForContact(profileKey, contactId) {
  let res = await ownerFetchRawWeb(`/api/contacts/${encodeURIComponent(contactId)}/messages`, {
    profileKey,
    method: "DELETE",
  });
  if (res.status !== 404) return res;

  res = await ownerFetchRawWeb(`/api/messages?contactId=${encodeURIComponent(contactId)}`, {
    profileKey,
    method: "DELETE",
  });
  if (res.status !== 404) return res;

  return ownerFetchRawWeb(`/api/messages/clear`, {
    profileKey,
    method: "POST",
    body: JSON.stringify({ contactId }),
  });
}

/* -------------------- AUTH thread helpers -------------------- */

async function fetchOwnerMessagesForAuthUser(profileKey, userId) {
  return ownerFetchRawWeb(`/api/owner/chat/${encodeURIComponent(userId)}/messages`, {
    profileKey,
    method: "GET",
  });
}

async function postOwnerMessageToAuthUser(profileKey, userId, body) {
  return ownerFetchRawWeb(`/api/owner/chat/${encodeURIComponent(userId)}/messages`, {
    profileKey,
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

async function deleteOwnerChatForAuthUser(profileKey, userId) {
  return ownerFetchRawWeb(`/api/owner/chat/${encodeURIComponent(userId)}/messages`, {
    profileKey,
    method: "DELETE",
  });
}

/* -------------------- page -------------------- */

export default function OwnerChatPage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const routePk = normalizeProfileKey(params?.profileKey);
  const storedPk = (() => {
    try {
      return normalizeProfileKey(localStorage.getItem("profileKey"));
    } catch {
      return "";
    }
  })();

  const profileKey = routePk || storedPk || "";

  // thread params come from navigation state
  const state = location?.state || {};
  const threadType = String(state?.threadType || "contact").toLowerCase();
  const userId = state?.userId ? String(state.userId) : null;

  const contact = state?.contact || {};
  const contactId = state?.contactId || contact?._id || contact?.id || null;

  const isAuthThread = threadType === "auth" || (!!userId && !contactId);

  const [threadUser, setThreadUser] = useState(() => safeUserObj(state?.user));
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const listRef = useRef(null);
  const didInitialLoadRef = useRef(false);
  const inFlightRef = useRef(false);
  const pollRef = useRef(null);
  const shouldStickToBottomRef = useRef(true);

  const profile = useMemo(() => (profileKey ? getProfileByKey(profileKey) : null), [profileKey]);
  const ownerLabel = profile?.label || profile?.brandTopTitle || "Owner";
  const accent = profile?.accent || "#818cf8";

  const nameFromParts = `${contact?.firstName || ""} ${contact?.lastName || ""}`.trim();

  const displayName = useMemo(() => {
    return isAuthThread
      ? authDisplayName(threadUser, userId)
      : nameFromParts || contact?.name || "Unknown";
  }, [isAuthThread, threadUser, userId, nameFromParts, contact?.name]);

  const headerSubtitle = useMemo(() => {
    const bits = [];
  
    // contact thread → show phone
    if (!isAuthThread && contact?.phone) {
      bits.push(String(contact.phone));
    }
  
    // auth thread → show email instead (if available)
    if (isAuthThread && threadUser?.email) {
      bits.push(String(threadUser.email));
    }
  
    // show profileKey only if you still want it
    // if (profileKey) bits.push(profileKey);
  
    return bits.join(" • ");
  }, [isAuthThread, contact?.phone, threadUser?.email]);
  

  const goOwnerLogin = useCallback(() => {
    if (!profileKey) return navigate("/", { replace: true });
    navigate(`/world/${encodeURIComponent(profileKey)}/owner/login`, {
      replace: true,
      state: { profileKey, next: location.pathname + location.search },
    });
  }, [navigate, profileKey, location.pathname, location.search]);

  const scrollToBottom = useCallback((smooth = true) => {
    const el = listRef.current;
    if (!el) return;
    try {
      el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    } catch {}
  }, []);

  // track whether user scrolled up; only auto-stick if at bottom
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const onScroll = () => {
      shouldStickToBottomRef.current = isAtBottom(el, 36);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // keep pinned while typing only if already at bottom
  useEffect(() => {
    if (!shouldStickToBottomRef.current) return;
    const t = setTimeout(() => scrollToBottom(true), 35);
    return () => clearTimeout(t);
  }, [input, scrollToBottom]);

  const loadMessages = useCallback(async () => {
    if (!profileKey) {
      setLoading(false);
      setError("Missing profileKey.");
      return;
    }

    if (isAuthThread) {
      if (!userId) {
        setLoading(false);
        setError("Missing userId for auth thread.");
        return;
      }
    } else {
      if (!contactId) {
        setLoading(false);
        setError("Missing contact id.");
        return;
      }
    }

    if (inFlightRef.current) return;
    inFlightRef.current = true;

    const isInitial = !didInitialLoadRef.current;

    try {
      if (isInitial) setLoading(true);
      setError(null);

      const res = isAuthThread
        ? await fetchOwnerMessagesForAuthUser(profileKey, userId)
        : await fetchOwnerMessagesForContact(profileKey, contactId);

      const data = await readJsonSafe(res);

      if (res.status === 401 || res.status === 403) {
        setMessages([]);
        setError("Session expired. Please log in again.");
        goOwnerLogin();
        return;
      }

      if (!res.ok) throw new Error(data?.error || data?.message || "Failed to load messages");

      if (isAuthThread && safeUserObj(data?.user)) setThreadUser(data.user);

      const arr = normalizeMessagesResponse(data);

      // decide whether to stick: if user is at bottom OR it's initial load
      const el = listRef.current;
      const wasAtBottom = isInitial || isAtBottom(el, 60);

      setMessages((prev) => {
        const prevLastId = prev.length ? String(prev[prev.length - 1]?._id || prev[prev.length - 1]?.id) : null;
        const newLastId = arr.length ? String(arr[arr.length - 1]?._id || arr[arr.length - 1]?.id) : null;
        if (prev.length === arr.length && prevLastId && newLastId && prevLastId === newLastId) return prev;
        return arr;
      });

      if (isInitial) {
        didInitialLoadRef.current = true;
        setTimeout(() => scrollToBottom(false), 45);
      } else if (wasAtBottom) {
        setTimeout(() => scrollToBottom(true), 45);
      }
    } catch (err) {
      setError(err?.message || "Failed to load messages");
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  }, [profileKey, isAuthThread, userId, contactId, goOwnerLogin, scrollToBottom]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // poll only when visible
  useEffect(() => {
    if (!profileKey) return;
    if (isAuthThread && !userId) return;
    if (!isAuthThread && !contactId) return;

    const start = () => {
      if (pollRef.current) return;
      pollRef.current = setInterval(loadMessages, POLL_MS);
    };
    const stop = () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    };
    const onVis = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };

    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVis);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      stop();
    };
  }, [profileKey, isAuthThread, userId, contactId, loadMessages]);

  const handleSend = useCallback(async () => {
    if (!profileKey) return setError("Missing profileKey.");

    const text = String(input || "").trim();
    if (!text || sending) return;

    if (isAuthThread) {
      if (!userId) return setError("Missing userId for auth thread.");
    } else {
      if (!contactId) return setError("Missing contactId.");
    }

    const optimistic = {
      _id: `tmp-${Date.now()}`,
      sender: "owner",
      body: text,
      createdAt: new Date().toISOString(),
      _optimistic: true,
    };

    setMessages((prev) => [...prev, optimistic]);
    setInput("");
    setSending(true);
    setTimeout(() => scrollToBottom(true), 35);

    try {
      const res = isAuthThread
        ? await postOwnerMessageToAuthUser(profileKey, userId, text)
        : await postOwnerMessageToContact(profileKey, contactId, text);

      const data = await readJsonSafe(res);

      if (res.status === 401 || res.status === 403) {
        setError("Session expired. Please log in again.");
        goOwnerLogin();
        return;
      }

      if (!res.ok) throw new Error(data?.error || data?.message || "Failed to send message");

      const saved = data?.message || data;

      setMessages((prev) => {
        const withoutTmp = prev.filter((m) => String(m._id || m.id) !== String(optimistic._id));
        return [...withoutTmp, saved];
      });

      setTimeout(() => scrollToBottom(true), 45);
    } catch (err) {
      setError(err?.message || "Failed to send message");
      setMessages((prev) => prev.filter((m) => String(m._id || m.id) !== String(optimistic._id)));
      setInput(text);
    } finally {
      setSending(false);
    }
  }, [profileKey, input, sending, isAuthThread, userId, contactId, goOwnerLogin, scrollToBottom]);

  const handleDeleteChat = useCallback(async () => {
    if (!profileKey) return setError("Missing profileKey.");
    if (deleting) return;

    if (isAuthThread) {
      if (!userId) return setError("Missing userId for auth thread.");
    } else {
      if (!contactId) return setError("Missing contactId.");
    }

    const ok = window.confirm("Delete chat?\n\nThis will delete all messages in this thread. This cannot be undone.");
    if (!ok) return;

    try {
      setDeleting(true);
      setError(null);

      const res = isAuthThread
        ? await deleteOwnerChatForAuthUser(profileKey, userId)
        : await deleteOwnerChatForContact(profileKey, contactId);

      const data = await readJsonSafe(res);

      if (res.status === 401 || res.status === 403) {
        setError("Session expired. Please log in again.");
        goOwnerLogin();
        return;
      }

      if (!res.ok) throw new Error(data?.error || data?.message || "Failed to delete chat");

      setMessages([]);
    } catch (err) {
      setError(err?.message || "Failed to delete chat");
    } finally {
      setDeleting(false);
    }
  }, [profileKey, deleting, isAuthThread, userId, contactId, goOwnerLogin]);

  const goBack = () => {
    if (!profileKey) return navigate("/", { replace: false });
    navigate(`/world/${encodeURIComponent(profileKey)}/owner/messages`, { state: { profileKey } });
  };

  const canUseApi = !!profileKey && (isAuthThread ? !!userId : !!contactId);
  const disabledSend = !canUseApi || sending;

  return (
    <div style={styles.page}>
      <style>{css(accent)}</style>

      {/* Header */}
      <div style={styles.header}>
        <button style={styles.iconBtn} onClick={goBack} title="Back">
          ←
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={styles.headerName} title={displayName}>
            {displayName}
          </div>
          {headerSubtitle ? <div style={styles.headerSub}>{headerSubtitle}</div> : null}
        </div>

        <button
          style={styles.iconBtn}
          onClick={() => {
            const choice = window.prompt("Type: r = refresh, d = delete", "r");
            if (!choice) return;
            if (choice.toLowerCase() === "d") handleDeleteChat();
            else loadMessages();
          }}
          title="Menu"
        >
          ⋯
        </button>
      </div>

      {/* Body */}
      {!profileKey ? (
        <div style={styles.center}>
          <div style={styles.errorText}>Missing profileKey.</div>
          <div style={styles.muted}>Open: /world/:profileKey/owner/chat</div>
        </div>
      ) : !canUseApi ? (
        <div style={styles.center}>
          <div style={styles.errorText}>
            {isAuthThread ? "Missing userId for auth thread." : "Missing contactId for contact thread."}
          </div>
          <div style={styles.muted}>Navigate here from OwnerMessagesPage with state params.</div>
        </div>
      ) : loading ? (
        <div style={styles.center}>
          <div className="spinner" />
          <div style={styles.muted}>Loading messages…</div>
        </div>
      ) : error ? (
        <div style={styles.center}>
          <div style={styles.errorText}>{error}</div>
          <button style={styles.retryBtn} onClick={loadMessages}>
            Retry
          </button>
        </div>
      ) : (
        <div style={styles.listWrap}>
          <div ref={listRef} style={styles.list}>
            <div style={styles.pad}>
              {messages.map((m, idx) => {
                const isOwner = String(m?.sender || "").toLowerCase() === "owner";
                const body = String(m?.body || "");
                const when = formatTime(m?.createdAt);

                return (
                  <div
                    key={String(m?._id || m?.id || idx)}
                    style={{
                      display: "flex",
                      justifyContent: isOwner ? "flex-end" : "flex-start",
                      margin: "10px 0",
                      gap: 8,
                    }}
                  >
                    {!isOwner ? (
                      <div style={styles.smallAvatar}>
                        {(displayName?.[0] || "A").toUpperCase()}
                      </div>
                    ) : null}

                    <div style={{ ...styles.bubble, ...(isOwner ? styles.bUser : styles.bOwner) }}>
                      <div style={styles.msg}>{body}</div>
                      <div style={styles.time}>{when}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Composer */}
      <div style={styles.composerWrap}>
        <div style={styles.composer}>
          <span style={{ color: "#fff", opacity: 0.9 }}>💬</span>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="what's up..."
            style={styles.textarea}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={!canUseApi}
          />

          <button
            style={{ ...styles.sendBtn, opacity: disabledSend ? 0.6 : 1 }}
            disabled={disabledSend}
            onClick={handleSend}
            title="Send"
          >
            {sending ? <span className="miniSpinner" /> : "Send"}
          </button>
        </div>

        <div style={styles.footerHint}>
          {ownerLabel} chat • {isAuthThread ? "auth" : "contact"}
          {deleting ? " • deleting…" : ""}
        </div>
      </div>
    </div>
  );
}

/* -------------------- styles -------------------- */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(180deg, #050509, #0b1220, #020617)",
    color: "#e5e7eb",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
  },

  header: {
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    position: "sticky",
    top: 0,
    zIndex: 10,
    backdropFilter: "blur(10px)",
    background: "rgba(2,6,23,0.65)",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
  headerName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 900,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  headerSub: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 3,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  listWrap: { flex: 1, display: "flex", minHeight: 0 },
  list: { flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" },
  pad: { padding: "10px 16px 12px" },

  center: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 24,
  },
  muted: { color: "#9ca3af", fontSize: 13, textAlign: "center" },
  errorText: { color: "#fca5a5", textAlign: "center", fontWeight: 900 },
  retryBtn: {
    padding: "8px 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(15,23,42,0.75)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },

  smallAvatar: {
    width: 26,
    height: 26,
    borderRadius: 999,
    background: "rgba(148,163,255,0.40)",
    border: "1px solid rgba(191,219,254,0.70)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#0b1020",
    fontWeight: 900,
    flex: "0 0 auto",
    marginTop: 2,
  },

  bubble: {
    maxWidth: "78%",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.16)",
    padding: "10px 12px",
    backdropFilter: "blur(10px)",
  },
  bOwner: {
    borderTopLeftRadius: 6,
    background: "linear-gradient(180deg, rgba(124,58,237,0.35), rgba(15,23,42,0.70))",
  },
  bUser: {
    borderTopRightRadius: 6,
    background: "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(148,163,184,0.26))",
  },
  msg: { color: "#fff", fontSize: 14, lineHeight: "20px", whiteSpace: "pre-wrap" },
  time: { color: "#9ca3af", fontSize: 11, marginTop: 6, textAlign: "right" },

  composerWrap: {
    position: "sticky",
    bottom: 0,
    zIndex: 10,
    padding: "10px 12px 0",
    background: "linear-gradient(180deg, rgba(2,6,23,0), rgba(2,6,23,0.85) 30%, rgba(2,6,23,0.96))",
    backdropFilter: "blur(10px)",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },
  composer: {
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(15,23,42,0.90)",
    display: "flex",
    alignItems: "flex-end",
    gap: 10,
    padding: "10px 12px",
  },
  textarea: {
    flex: 1,
    resize: "none",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#fff",
    fontSize: 14,
    lineHeight: "20px",
    maxHeight: 120,
    padding: "2px 0",
  },
  sendBtn: {
    borderRadius: 999,
    border: "none",
    background: "#ffffff",
    color: "#000",
    fontWeight: 900,
    padding: "10px 14px",
    cursor: "pointer",
    minWidth: 72,
  },
  footerHint: {
    paddingBottom: 10,
    display: "flex",
    justifyContent: "center",
    fontSize: 11,
    color: "rgba(148,163,184,0.85)",
  },
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
    .miniSpinner{
      display:inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(0,0,0,0.25);
      border-top-color: rgba(0,0,0,0.85);
      border-radius: 999px;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `;
}
