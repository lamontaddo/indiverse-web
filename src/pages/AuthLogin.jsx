// src/pages/AuthLogin.jsx ✅ FULL DROP-IN (WEB)
// ✅ Saves buyerToken -> localStorage
// ✅ Supports return via router state OR ?next=...
// ✅ POST /api/auth/login
// ✅ Adds Continue with Google

import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../utils/apiClient";

function safeTrim(v) {
  return String(v || "").trim();
}

export default function AuthLogin() {
  const nav = useNavigate();
  const location = useLocation();
  const [sp] = useSearchParams();

  const prefillEmail = useMemo(() => safeTrim(sp.get("email")), [sp]);
  const nextFromQuery = useMemo(() => safeTrim(sp.get("next")), [sp]);
  const nextRoute = safeTrim(location?.state?.nextRoute) || nextFromQuery || "";
  const nextState = location?.state?.nextState || null;

  const [email, setEmail] = useState(prefillEmail || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const goNextOrHome = () => {
    if (nextRoute) {
      nav(nextRoute, nextState ? { state: nextState } : undefined);
      return;
    }
    nav("/");
  };

  const startGoogleLogin = () => {
    const next = nextRoute ? `?next=${encodeURIComponent(nextRoute)}` : "";
    window.location.href = `/api/auth/google/start${next}`;
  };

  const onLogin = async () => {
    const em = safeTrim(email).toLowerCase();
    const pw = String(password || "");

    if (!em || !pw) {
      alert("Enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: em, password: pw }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data) {
        alert(data?.error || "Unable to log in.");
        return;
      }

      const token =
        safeTrim(data?.token) ||
        safeTrim(data?.buyerToken) ||
        safeTrim(data?.accessToken) ||
        safeTrim(data?.jwt) ||
        "";

      if (token) {
        localStorage.setItem("buyerToken", token);
        localStorage.setItem("auth:isAuthed", "1");
      }

      const uid = safeTrim(data?.userId || data?.id || data?._id || data?.user?.id);
      if (uid) localStorage.setItem("buyerUserId", uid);

      if (data?.user) {
        try {
          localStorage.setItem(
            "buyerUser",
            JSON.stringify({
              id: safeTrim(data?.user?.id),
              email: safeTrim(data?.user?.email),
              firstName: safeTrim(data?.user?.firstName),
              lastName: safeTrim(data?.user?.lastName),
            })
          );
        } catch {
          // ignore
        }
      }

      goNextOrHome();
    } catch (err) {
      alert(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      <div style={styles.bg} />

      <div style={styles.center}>
        <div style={styles.card}>
          <div style={styles.title}>Sign in</div>
          <div style={styles.sub}>Your IndiVerse account</div>

          <button
            onClick={startGoogleLogin}
            disabled={loading}
            style={styles.googleBtn}
            type="button"
          >
            <span style={styles.googleIcon}>G</span>
            Continue with Google
          </button>

          <div style={styles.divider}>
            <span style={styles.dividerLine} />
            <span style={styles.dividerText}>or sign in with email</span>
            <span style={styles.dividerLine} />
          </div>

          <div style={styles.field}>
            <span style={styles.icon}>✉️</span>
            <input
              style={styles.input}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              type="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              disabled={loading}
            />
          </div>

          <div style={styles.field}>
            <span style={styles.icon}>🔒</span>
            <input
              style={styles.input}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPass ? "text" : "password"}
              onKeyDown={(e) => (e.key === "Enter" ? onLogin() : null)}
              autoComplete="current-password"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              disabled={loading}
            />

            <button
              onClick={() => setShowPass((v) => !v)}
              style={styles.eyeBtn}
              type="button"
              disabled={loading}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>

          <button onClick={onLogin} disabled={loading} style={styles.btn} type="button">
            {loading ? "Logging in…" : "Login"}
          </button>

          <button
            onClick={() => nav(`/auth/signup?email=${encodeURIComponent(email || "")}`)}
            style={styles.signupLink}
            disabled={loading}
            type="button"
          >
            Need an account? Sign up
          </button>

          <button onClick={() => nav(-1)} style={styles.link} disabled={loading} type="button">
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100dvh",
    background: "#05060b",
    position: "relative",
    overflowX: "hidden",
    overflowY: "auto",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  bg: {
    position: "fixed",
    inset: 0,
    background:
      "radial-gradient(circle at 20% 10%, rgba(129,140,248,0.22), rgba(0,0,0,0) 34%), linear-gradient(180deg, #0b1020, #090b14, #06070d)",
  },
  center: {
    position: "relative",
    zIndex: 1,
    minHeight: "100dvh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding:
      "max(18px, env(safe-area-inset-top)) 16px max(22px, env(safe-area-inset-bottom))",
  },
  card: {
    width: "min(520px, 100%)",
    borderRadius: 22,
    padding: "20px 16px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.42)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    boxShadow: "0 22px 70px rgba(0,0,0,0.34)",
  },
  title: {
    color: "#fff",
    fontSize: "clamp(24px, 7vw, 30px)",
    fontWeight: 900,
  },
  sub: {
    marginTop: 6,
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
  },
  googleBtn: {
    marginTop: 16,
    minHeight: 52,
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    background: "#fff",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#111827",
    fontWeight: 900,
    cursor: "pointer",
    width: "100%",
    WebkitTapHighlightColor: "transparent",
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    fontWeight: 900,
    boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
  },
  divider: {
    marginTop: 14,
    marginBottom: 6,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: "rgba(255,255,255,0.12)",
  },
  dividerText: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },
  field: {
    marginTop: 14,
    minHeight: 52,
    borderRadius: 15,
    padding: "0 12px",
    border: "1px solid rgba(255,255,255,0.13)",
    background: "rgba(255,255,255,0.055)",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  icon: { opacity: 0.75 },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 50,
    color: "#fff",
    fontSize: 16,
    background: "transparent",
    border: "none",
    outline: "none",
  },
  eyeBtn: {
    minWidth: 42,
    minHeight: 42,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    opacity: 0.85,
    fontSize: 18,
    WebkitTapHighlightColor: "transparent",
  },
  btn: {
    marginTop: 16,
    minHeight: 52,
    borderRadius: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
    width: "100%",
    WebkitTapHighlightColor: "transparent",
  },
  signupLink: {
    marginTop: 12,
    minHeight: 44,
    width: "100%",
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.86)",
    textDecoration: "underline",
    cursor: "pointer",
    fontSize: 13,
    WebkitTapHighlightColor: "transparent",
  },
  link: {
    marginTop: 4,
    minHeight: 44,
    width: "100%",
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.62)",
    cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
  },
};