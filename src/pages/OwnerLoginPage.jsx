// src/pages/OwnerLoginPage.jsx ✅ FULL DROP-IN (Web) — FIXED + MOBILE OPTIMIZED
// Route: /world/:profileKey/owner/login
//
// ✅ Web version of your RN OwnerLoginScreen (terminal UI + typed intro + shake)
// ✅ NO silent profileKey fallback (fails loudly if missing)
// ✅ Single POST /api/admin/login (scoped by x-profile-key)
// ✅ Stores token in localStorage (profile-scoped)
// ✅ Uses ABSOLUTE API base via ownerApi.web (prevents indiverse-web /api 404)
// ✅ “Execute” button + Enter-to-submit
// ✅ Mobile-safe viewport, scroll, touch targets, and responsive terminal card
//
// Requires:
// - src/utils/ownerApi.web.js   (from my last message)
// - src/utils/ownerToken.web.js (from my last message)
//
// Env (optional):
// - VITE_REMOTE_CONFIG_URL (same one you use for MainScreen)
// - VITE_API_BASE_URL (e.g. https://indiverse-backend.onrender.com)

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ownerJsonWeb } from "../utils/ownerApi.web";
import { setOwnerToken } from "../utils/ownerToken.web";

const DEFAULT_REMOTE_CONFIG_URL =
  import.meta.env.VITE_REMOTE_CONFIG_URL ||
  "https://montech-remote-config.s3.amazonaws.com/superapp/config.json";

const INTRO_LINES = [
  "MONTECH_SECURE_OS v1.0",
  "Initializing encrypted channel...",
  "Verifying device fingerprint...",
  "Access level required: OWNER",
  "",
  "Manual override enabled.",
];
const INTRO_TEXT = INTRO_LINES.join("\n");

function normalizeProfileKey(pk) {
  return String(pk || "").trim().toLowerCase();
}

async function fetchRemoteConfig() {
  const res = await fetch(DEFAULT_REMOTE_CONFIG_URL, { cache: "no-store" });
  if (!res.ok) throw new Error(`Remote config fetch failed (${res.status})`);
  return res.json();
}

function findProfileFromConfig(config, profileKey) {
  if (!config || !profileKey) return null;

  const pk = String(profileKey);

  // Common shapes:
  // { profiles: [{ key, label, ... }] }
  // { worlds: { lamont: {...}, theresa: {...} } }
  // { lamont: {...}, theresa: {...} }
  if (Array.isArray(config?.profiles)) {
    return (
      config.profiles.find((p) => normalizeProfileKey(p?.key) === pk) || null
    );
  }
  if (config?.worlds && typeof config.worlds === "object") {
    return config.worlds[pk] || null;
  }
  if (typeof config === "object") {
    return config[pk] || null;
  }
  return null;
}

export default function OwnerLoginPage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  // Prefer param, then router state (for programmatic navigations)
  const rawProfileKey = params?.profileKey || location?.state?.profileKey || "";
  const profileKey = useMemo(
    () => normalizeProfileKey(rawProfileKey),
    [rawProfileKey]
  );

  const [profile, setProfile] = useState(null);
  const ownerName = profile?.label || profile?.brandTopTitle || profileKey || "Owner";

  const [introText, setIntroText] = useState("");
  const [introDone, setIntroDone] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | submitting | error | success
  const [error, setError] = useState("");

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [shake, setShake] = useState(false);

  // Fail loudly if missing tenant
  useEffect(() => {
    if (!profileKey) {
      setStatus("error");
      setError("Missing profileKey. Open this page as /world/:profileKey/owner/login");
    }
  }, [profileKey]);

  // Load profile branding from remote config (best-effort)
  useEffect(() => {
    let alive = true;

    (async () => {
      if (!profileKey) return;
      try {
        const cfg = await fetchRemoteConfig();
        const p = findProfileFromConfig(cfg, profileKey);
        if (alive) setProfile(p);
      } catch {
        // non-fatal
      }
    })();

    return () => {
      alive = false;
    };
  }, [profileKey]);

  // Typed intro
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setIntroText(INTRO_TEXT.slice(0, i));
      i += 1;
      if (i > INTRO_TEXT.length) {
        clearInterval(t);
        setIntroDone(true);
        setTimeout(() => emailRef.current?.focus?.(), 400);
      }
    }, 28);

    return () => clearInterval(t);
  }, []);

  function triggerShake() {
    setShake(true);
    window.setTimeout(() => setShake(false), 420);
  }

  async function handleLogin() {
    if (submitting) return;

    if (!profileKey) {
      setStatus("error");
      setError("Missing profileKey.");
      triggerShake();
      return;
    }

    const normalizedEmail = String(email || "").trim();
    const rawPassword = String(password || "");

    if (!normalizedEmail || !rawPassword) {
      setStatus("error");
      setError("Both email and password are required.");
      triggerShake();
      return;
    }

    setSubmitting(true);
    setStatus("submitting");
    setError("");

    try {
      // ✅ SINGLE request (ABSOLUTE base via ownerApi.web)
      const resp = await ownerJsonWeb("/api/admin/login", {
        method: "POST",
        profileKey,
        body: JSON.stringify({ email: normalizedEmail, password: rawPassword }),
      });

      const token =
        resp?.token || resp?.data?.token || resp?.json?.token || resp?.result?.token || "";

      if (!token) {
        setStatus("error");
        setError("No token returned from server.");
        triggerShake();
        setSubmitting(false);
        return;
      }

      // ✅ Store where ownerFetch expects it (profile-scoped)
      setOwnerToken(profileKey, token);

      setStatus("success");
      setSubmitting(false);

      window.setTimeout(() => {
        navigate(`/world/${encodeURIComponent(profileKey)}/owner/home`, {
          replace: true,
          state: { profileKey, bgUrl: location?.state?.bgUrl || null },
        });
      }, 650);
    } catch (err) {
      setStatus("error");
      setError(err?.message || "Network error, please try again.");
      triggerShake();
      setSubmitting(false);
    }
  }

  function onBack() {
    if (window.history.length > 1) navigate(-1);
    else if (profileKey) navigate(`/world/${encodeURIComponent(profileKey)}`, { replace: true });
    else navigate("/", { replace: true });
  }

  return (
    <div style={styles.page}>
      <style>{css}</style>

      <div style={styles.headerRow}>
        <button onClick={onBack} style={styles.backBtn} aria-label="Back">
          ‹
        </button>
        <div style={styles.headerTitle}>{ownerName} • Owner Console</div>
        <div style={{ width: 40, flex: "0 0 40px" }} />
      </div>

      <div style={styles.centerWrap}>
        <div className={shake ? "shake" : ""} style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.windowDots}>
              <span style={{ ...styles.dot, background: "#f97373" }} />
              <span style={{ ...styles.dot, background: "#facc15" }} />
              <span style={{ ...styles.dot, background: "#4ade80" }} />
            </div>
            <div style={styles.cardTitle}>monarch-owner:~</div>
            <div style={styles.shield}>🛡️</div>
          </div>

          <div style={styles.terminalBody}>
            <pre style={styles.pre}>
              {introText}
              {!introDone ? <span style={styles.cursor}>▋</span> : null}
            </pre>

            {introDone && (
              <>
                <div style={styles.promptLine}>
                  <span style={{ ...styles.prompt, color: "#22c55e" }}>{"> "}</span>
                  <span style={{ ...styles.prompt, color: "#e5e7eb" }}>email:&nbsp;</span>
                  <input
                    ref={emailRef}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@monarch.app"
                    style={styles.inputInline}
                    autoCapitalize="none"
                    autoCorrect="off"
                    inputMode="email"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") passwordRef.current?.focus?.();
                    }}
                  />
                </div>

                <div style={styles.promptLine}>
                  <span style={{ ...styles.prompt, color: "#22c55e" }}>{"> "}</span>
                  <span style={{ ...styles.prompt, color: "#e5e7eb" }}>password:&nbsp;</span>
                  <input
                    ref={passwordRef}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={styles.inputInline}
                    type="password"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleLogin();
                    }}
                  />
                </div>

                {status === "submitting" && (
                  <div style={styles.statusLine}>
                    <span style={{ ...styles.prompt, color: "#38bdf8" }}>{"> Authenticating "}</span>
                    <span className="spinner" />
                  </div>
                )}

                {status === "error" && (
                  <>
                    <div style={{ ...styles.line, color: "#f97373" }}>
                      {`> ACCESS DENIED: ${error}`}
                    </div>
                    <div style={{ ...styles.line, color: "#f97316" }}>
                      {"> Logging event to audit trail..."}
                    </div>
                  </>
                )}

                {status === "success" && (
                  <>
                    <div style={{ ...styles.line, color: "#4ade80" }}>{"> ACCESS GRANTED."}</div>
                    <div style={{ ...styles.line, color: "#a5b4fc" }}>
                      {`> Welcome back, ${ownerName}. You are allowed to be the architect of your world.`}
                    </div>
                  </>
                )}

                {status === "idle" && (
                  <div style={{ ...styles.line, color: "#6b7280" }}>
                    {"> Press ENTER on password or click Execute to submit."}
                  </div>
                )}

                <button
                  onClick={handleLogin}
                  disabled={submitting}
                  style={{ ...styles.button, opacity: submitting ? 0.7 : 1 }}
                >
                  <span style={styles.buttonInner}>
                    {submitting ? (
                      <>
                        <span className="spinner" />
                        <span>Executing…</span>
                      </>
                    ) : (
                      <>
                        <span>⌁</span>
                        <span>Execute</span>
                      </>
                    )}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    
    color: "#e5e7eb",
    background:
      "radial-gradient(900px 480px at 18% 8%, rgba(79,70,229,0.22), transparent 60%)," +
      "radial-gradient(720px 420px at 85% 24%, rgba(124,58,237,0.18), transparent 60%)," +
      "linear-gradient(180deg, #020617, #050816, #0b1120)",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
    overflowX: "hidden",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    paddingBottom: "max(22px, env(safe-area-inset-bottom))",
  },
  headerRow: {
    width: "min(620px, calc(100% - 28px))",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    padding: "max(14px, env(safe-area-inset-top)) 0 8px",
  },
  backBtn: {
    width: 40,
    height: 40,
    flex: "0 0 40px",
    borderRadius: 12,
    border: "1px solid rgba(148,163,184,0.25)",
    background: "rgba(15,23,42,0.58)",
    color: "#e5e7eb",
    cursor: "pointer",
    fontSize: 24,
    lineHeight: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    WebkitTapHighlightColor: "transparent",
  },
  headerTitle: {
    minWidth: 0,
    flex: 1,
    fontSize: "clamp(12px, 3.5vw, 14px)",
    fontWeight: 700,
    letterSpacing: 0.5,
    opacity: 0.95,
    textAlign: "center",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  centerWrap: {
    width: "min(620px, calc(100% - 28px))",
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "18px 0 34px",
  },
  card: {
    width: "100%",
    borderRadius: 24,
    padding: 14,
    border: "1px solid rgba(148,163,184,0.35)",
    background: "rgba(15,23,42,0.66)",
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    paddingBottom: 10,
    borderBottom: "1px solid rgba(148,163,184,0.25)",
    marginBottom: 12,
    minWidth: 0,
  },
  windowDots: { display: "flex", gap: 6, marginRight: 2 },
  dot: { width: 9, height: 9, borderRadius: 999 },
  cardTitle: { flex: 1, minWidth: 0, color: "#9ca3af", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  shield: { fontSize: 16, opacity: 0.9 },
  terminalBody: { minHeight: 220, overflowX: "hidden" },
  pre: {
    margin: 0,
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: "clamp(11px, 3.2vw, 12px)",
    lineHeight: "18px",
    color: "#e5e7eb",
  },
  cursor: { color: "#22c55e" },
  promptLine: {
    display: "flex",
    alignItems: "center",
    marginTop: 8,
    gap: 0,
    minWidth: 0,
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: "clamp(11px, 3.2vw, 12px)",
  },
  prompt: { fontSize: "inherit", flex: "0 0 auto" },
  inputInline: {
    minWidth: 0,
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#e5e7eb",
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: "max(16px, 1em)",
    lineHeight: "20px",
    padding: "8px 0",
  },
  statusLine: { display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" },
  line: {
    marginTop: 8,
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: "clamp(11px, 3.2vw, 12px)",
    lineHeight: "18px",
    overflowWrap: "anywhere",
  },
  button: {
    width: "100%",
    minHeight: 46,
    marginTop: 14,
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.25)",
    cursor: "pointer",
    background: "linear-gradient(90deg, #4f46e5, #7c3aed)",
    padding: 0,
    WebkitTapHighlightColor: "transparent",
  },
  buttonInner: {
    minHeight: 46,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    padding: "11px 16px",
    color: "#fff",
    fontWeight: 800,
    fontSize: 13,
    letterSpacing: 0.6,
  },
};

const css = `
*{ box-sizing: border-box; }
html{
  min-height: 100%;
  background: #020617;
}
body{
  margin: 0;
  min-height: 100%;
  background: #020617;
}
button, input{
  font-family: inherit;
}
input{
  -webkit-text-size-adjust: 100%;
}
button:disabled{
  cursor: not-allowed;
}

@keyframes shake {
  0% { transform: translateX(0); }
  15% { transform: translateX(-8px); }
  30% { transform: translateX(8px); }
  45% { transform: translateX(-6px); }
  60% { transform: translateX(6px); }
  75% { transform: translateX(-4px); }
  100% { transform: translateX(0); }
}
.shake { animation: shake 0.42s ease-in-out; }

.spinner{
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: rgba(255,255,255,0.95);
  display: inline-block;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 520px){
  .shake { animation: shakeMobile 0.42s ease-in-out; }
  @keyframes shakeMobile {
    0% { transform: translateX(0); }
    20% { transform: translateX(-4px); }
    40% { transform: translateX(4px); }
    60% { transform: translateX(-3px); }
    80% { transform: translateX(3px); }
    100% { transform: translateX(0); }
  }
}

@media (max-width: 420px){
  input::placeholder{
    color: rgba(148,163,184,0.58);
  }
}
`;
