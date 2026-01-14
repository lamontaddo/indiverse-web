// src/pages/ChatPage.jsx ✅ FULL DROP-IN (WEB) — NO AuthProvider required
// Route: /world/:profileKey/chat
//
// ✅ Uses localStorage auth:isAuthed + buyerToken
// ✅ x-profile-key always set
// ✅ Fetches /api/chat/me/messages + POST /api/chat/me/messages
// ✅ Does NOT loop-navigate; shows “Go to Login” CTA
// ✅ Redirects to login using nextRoute/nextState (matches AuthLogin)

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const POLL_MS = 3000;
const LOGIN_ROUTE = "/auth/login";

// 🔐 For now hard-coded
const IS_SUBSCRIBER = true;

/* -------------------- auth shim -------------------- */

function useAuthWeb() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const read = () => {
      try {
        const ok = localStorage.getItem("auth:isAuthed") === "1";
        const t = String(localStorage.getItem("buyerToken") || "").trim();
        setIsAuthed(ok);
        setToken(t);
      } catch {
        setIsAuthed(false);
        setToken("");
      }
    };

    read();
    window.addEventListener("focus", read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener("focus", read);
      window.removeEventListener("storage", read);
    };
  }, []);

  return { booting: false, isAuthed, token };
}

/* -------------------- helpers -------------------- */

function normalizePk(v) {
  return String(v || "").trim().toLowerCase() || "";
}
function nowIso() {
  try {
    return new Date().toISOString();
  } catch {
    return "";
  }
}
async function apiFetch(path, options = {}) {
  return fetch(path, options);
}
function mapIncomingMessages(data, OWNER_KEY) {
  const raw = Array.isArray(data) ? data : Array.isArray(data?.messages) ? data.messages : [];
  return raw.map((m) => ({
    id: String(m._id || m.id || `${m.createdAt || ""}:${Math.random()}`),
    from: m.sender === "owner" ? OWNER_KEY : "user",
    text: m.body || m.text || "",
    createdAt: m.createdAt || nowIso(),
  }));
}

/* -------------------- component -------------------- */

export default function ChatPage() {
  const nav = useNavigate();
  const params = useParams();
  const location = useLocation();

  const { booting, isAuthed, token } = useAuthWeb();

  const routePk = normalizePk(params?.profileKey);
  const profileKey = routePk || "";

  const OWNER_LABEL = profileKey ? profileKey.toUpperCase() : "Owner";
  const OWNER_KEY = profileKey || "owner";

  const [messages, setMessages] = useState([
    { id: "intro-1", from: OWNER_KEY, text: `This is your direct line to ${OWNER_LABEL}.`, createdAt: nowIso(), _intro: true },
    { id: "intro-2", from: OWNER_KEY, text: "Share what you're working on. I read everything and reply when I can.", createdAt: nowIso(), _intro: true },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  const listRef = useRef(null);
  const pollRef = useRef(null);
  const inFlightRef = useRef(false);

  const allowed = isAuthed && !!token;

  const scrollToBottom = useCallback((smooth = true) => {
    const el = listRef.current;
    if (!el) return;
    try {
      el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    } catch {}
  }, []);

  useEffect(() => {
    const t = setTimeout(() => scrollToBottom(true), 50);
    return () => clearTimeout(t);
  }, [messages, scrollToBottom]);

  const loadMessages = useCallback(async () => {
    if (!allowed) return;
    if (!profileKey) return;
    if (inFlightRef.current) return;

    inFlightRef.current = true;
    try {
      if (!initialLoaded) setLoading(true);
      setError(null);

      const res = await apiFetch(`/api/chat/me/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-profile-key": profileKey,
        },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to load messages.");

      const mapped = mapIncomingMessages(data, OWNER_KEY);

      setMessages((prev) => {
        const prevIntro = prev.filter((m) => m._intro);
        return [...prevIntro, ...mapped];
      });

      if (!initialLoaded) setInitialLoaded(true);
    } catch (e) {
      console.error("[ChatPage] loadMessages error:", e);
      setError(e?.message || "Failed to load messages.");
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  }, [allowed, profileKey, token, OWNER_KEY, initialLoaded]);

  useEffect(() => {
    if (!allowed) return;
    loadMessages();
  }, [allowed, loadMessages]);

  useEffect(() => {
    if (!allowed) return;
    if (!profileKey) return;

    const start = () => {
      if (pollRef.current) return;
      pollRef.current = setInterval(loadMessages, POLL_MS);
    };
    const stop = () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    };
    const onVis = () => (document.visibilityState === "visible" ? start() : stop());

    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      stop();
    };
  }, [allowed, profileKey, loadMessages]);

  const handleSend = useCallback(async () => {
    const trimmed = String(input || "").trim();
    if (!trimmed || sending) return;
    if (!allowed) return;

    const localMsg = { id: `user-${Date.now()}`, from: "user", text: trimmed, createdAt: nowIso() };
    setMessages((p) => [...p, localMsg]);
    setInput("");
    setSending(true);
    setTimeout(() => scrollToBottom(true), 30);

    try {
      const res = await apiFetch(`/api/chat/me/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-profile-key": profileKey,
        },
        body: JSON.stringify({ body: trimmed }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to send message.");

      const saved = data?.message || data;

      setMessages((prev) => {
        const withoutLocal = prev.filter((m) => m.id !== localMsg.id);
        return [
          ...withoutLocal,
          {
            id: String(saved._id || saved.id || `srv-${Date.now()}`),
            from: saved.sender === "owner" ? OWNER_KEY : "user",
            text: saved.body || saved.text || trimmed,
            createdAt: saved.createdAt || nowIso(),
          },
        ];
      });
    } catch (e) {
      console.error("[ChatPage] send error:", e);
      setError(e?.message || "Failed to send message.");
    } finally {
      setSending(false);
    }
  }, [input, sending, allowed, token, profileKey, OWNER_KEY, scrollToBottom]);

  const goLogin = () => {
    nav(LOGIN_ROUTE, {
      state: {
        profileKey,
        nextRoute: `/world/${encodeURIComponent(profileKey)}/chat`,
        nextState: { profileKey },
      },
    });
  };

  if (!IS_SUBSCRIBER) {
    return (
      <div style={ui.page}>
        <style>{ui.css()}</style>
        <div style={ui.center}>
          <div style={ui.h1}>Members-only access</div>
          <div style={ui.muted}>Unlock Direct Line with membership.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={ui.page}>
      <style>{ui.css()}</style>

      <div style={ui.header}>
        <button style={ui.iconBtn} onClick={() => nav(`/world/${encodeURIComponent(profileKey || "")}`)} title="Back">
          ←
        </button>

        <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
          <div style={ui.title}>Direct Line</div>
          <div style={ui.subtitle}>{OWNER_LABEL} • private messages</div>
        </div>

        <div style={ui.badge}>
          <span style={{ fontSize: 12 }}>★</span>
          <span style={ui.badgeText}>Member</span>
        </div>
      </div>

      {booting ? (
        <div style={ui.center}>
          <div className="spinner" />
          <div style={ui.muted}>Opening your direct line…</div>
        </div>
      ) : !allowed ? (
        <div style={ui.lockWrap}>
          <div style={ui.lockCard}>
            <div style={ui.lockHeader}>
              <div style={ui.lockTitle}>Direct Line Locked</div>
              <div style={{ opacity: 0.9 }}>🔒</div>
            </div>

            <div style={ui.lockText}>Please log in to use Direct Line.</div>

            <button style={ui.primaryBtn} onClick={goLogin}>
              Go to Login
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={ui.chatWrap}>
            {loading ? (
              <div style={ui.center}>
                <div className="spinner" />
                <div style={ui.muted}>Loading messages…</div>
              </div>
            ) : error ? (
              <div style={ui.center}>
                <div style={ui.error}>{error}</div>
                <button style={ui.retryBtn} onClick={loadMessages}>
                  Retry
                </button>
              </div>
            ) : (
              <div ref={listRef} style={ui.list}>
                <div style={{ padding: "10px 16px 20px" }}>
                  {messages.map((m) => (
                    <ChatBubble
                      key={m.id}
                      ownerKey={OWNER_KEY}
                      from={m.from}
                      text={m.text}
                      ownerLetter={(OWNER_LABEL?.[0] || "O").toUpperCase()}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={ui.composerWrap}>
            <div style={ui.composer}>
              <span style={{ color: "#fff", opacity: 0.9 }}>💬</span>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="what's up..."
                style={ui.textarea}
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />

              <button style={{ ...ui.sendBtn, opacity: sending ? 0.85 : 1 }} onClick={handleSend} disabled={sending}>
                {sending ? <span className="miniSpinner" /> : "Send"}
              </button>
            </div>

            <div style={ui.footerHint}>No filters. Be honest. I’ll respond as I’m able.</div>
          </div>
        </>
      )}
    </div>
  );
}

function ChatBubble({ ownerKey, from, text, ownerLetter }) {
  const isOwner = from === ownerKey;
  return (
    <div style={{ display: "flex", justifyContent: isOwner ? "flex-start" : "flex-end", gap: 8, margin: "10px 0" }}>
      {isOwner ? <div style={ui.avatar}>{ownerLetter}</div> : null}
      <div style={{ ...ui.bubble, ...(isOwner ? ui.bOwner : ui.bUser) }}>
        <div style={ui.msg}>{text}</div>
      </div>
    </div>
  );
}

const ui = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(180deg, rgba(0,0,0,0.95), rgba(0,0,0,0.98))",
    color: "#e5e7eb",
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    position: "sticky",
    top: 0,
    zIndex: 10,
    backdropFilter: "blur(10px)",
    background: "rgba(0,0,0,0.70)",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
  title: { color: "#fff", fontSize: 18, fontWeight: 900, letterSpacing: 0.8 },
  subtitle: { color: "#cfd3dc", fontSize: 11, letterSpacing: 0.6, marginTop: 2, textTransform: "uppercase" },
  badge: { display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", borderRadius: 999, background: "#fff", color: "#000", fontWeight: 900 },
  badgeText: { fontSize: 11, letterSpacing: 0.6 },

  chatWrap: { flex: 1, display: "flex", flexDirection: "column" },
  list: { flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" },

  bubble: { maxWidth: "78%", padding: "10px 12px", borderRadius: 18, border: "1px solid rgba(255,255,255,0.16)" },
  bOwner: { borderTopLeftRadius: 6, background: "linear-gradient(180deg, rgba(124,58,237,0.35), rgba(15,23,42,0.7))" },
  bUser: { borderTopRightRadius: 6, background: "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(148,163,184,0.3))" },
  msg: { color: "#fff", fontSize: 14, lineHeight: "20px", whiteSpace: "pre-wrap" },

  avatar: { width: 26, height: 26, borderRadius: 999, background: "rgba(148,163,255,0.40)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0b1020", fontWeight: 900, marginTop: 2, flex: "0 0 auto" },

  composerWrap: { position: "sticky", bottom: 0, zIndex: 10, padding: "10px 12px 14px", borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" },
  composer: { borderRadius: 999, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.14)", display: "flex", alignItems: "flex-end", gap: 10, background: "rgba(15,23,42,0.90)" },
  textarea: { flex: 1, resize: "none", border: "none", outline: "none", background: "transparent", color: "#fff", fontSize: 14, lineHeight: "20px", maxHeight: 120, padding: "2px 0" },
  sendBtn: { background: "#fff", color: "#000", fontWeight: 900, border: "none", borderRadius: 999, padding: "10px 14px", cursor: "pointer", minWidth: 72 },
  footerHint: { marginTop: 6, color: "#6b7280", fontSize: 11, textAlign: "center" },

  lockWrap: { padding: "24px 18px" },
  lockCard: { borderRadius: 24, border: "1px solid rgba(255,255,255,0.18)", background: "rgba(15,23,42,0.90)", padding: 16 },
  lockHeader: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  lockTitle: { color: "#fff", fontSize: 16, fontWeight: 900, letterSpacing: 0.6 },
  lockText: { color: "#e5edff", fontSize: 13, lineHeight: "20px", marginTop: 10 },
  primaryBtn: { marginTop: 12, width: "100%", borderRadius: 999, border: "none", background: "#fff", color: "#000", fontWeight: 900, letterSpacing: 0.8, padding: "12px 14px", cursor: "pointer" },

  center: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 24 },
  muted: { color: "#9ca3af", fontSize: 13, textAlign: "center" },
  error: { color: "#fca5a5", textAlign: "center", fontWeight: 900 },
  retryBtn: { marginTop: 10, padding: "8px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)", background: "rgba(15,23,42,0.75)", color: "#fff", fontWeight: 900, cursor: "pointer" },

  h1: { color: "#fff", fontSize: 18, fontWeight: 900 },
  css: () => `
    .spinner{ width:18px;height:18px;border:2px solid rgba(255,255,255,0.25);border-top-color: rgba(255,255,255,0.85);border-radius:999px;animation: spin 0.9s linear infinite;}
    .miniSpinner{ display:inline-block;width:14px;height:14px;border:2px solid rgba(0,0,0,0.25);border-top-color: rgba(0,0,0,0.85);border-radius:999px;animation: spin 0.7s linear infinite;}
    @keyframes spin { to { transform: rotate(360deg); } }
  `,
};
