// src/pages/AuthLogin.jsx ✅ FULL DROP-IN (WEB) — FIXED
// ✅ Saves buyerToken -> localStorage (so Music/Products stop re-sending you to login)
// ✅ Supports return via router state (preferred) OR ?next=...
// ✅ POST /api/auth/login

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

  // ✅ support BOTH: router state AND query param
  const nextFromQuery = useMemo(() => safeTrim(sp.get("next")), [sp]);
  const nextRoute = safeTrim(location?.state?.nextRoute) || nextFromQuery || "";
  const nextState = location?.state?.nextState || null;

  const [email, setEmail] = useState(prefillEmail || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const goNextOrHome = () => {
    if (nextRoute) {
      // ✅ preserve state (bgUrl etc)
      nav(nextRoute, nextState ? { state: nextState } : undefined);
      return;
    }
    nav("/"); // UniverseHome web
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

      // ✅ CRITICAL: persist token the same way MusicPage / Products expect it
      // Support a few common backend response shapes:
      const token =
        safeTrim(data?.token) ||
        safeTrim(data?.buyerToken) ||
        safeTrim(data?.accessToken) ||
        safeTrim(data?.jwt) ||
        "";

        if (token) {
            localStorage.setItem("buyerToken", token);
            localStorage.setItem("auth:isAuthed", "1"); // ✅ critical for MainScreen gate
          }
          

      // Optional: if backend also returns userId, store it (not required if JWT contains it)
      const uid = safeTrim(data?.userId || data?.id || data?._id);
      if (uid) localStorage.setItem("buyerUserId", uid);

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

          <div style={styles.field}>
            <span style={styles.icon}>✉️</span>
            <input
              style={styles.input}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoCapitalize="none"
              autoComplete="email"
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

          <button onClick={onLogin} disabled={loading} style={styles.btn}>
            {loading ? "Logging in…" : "Login"}
          </button>

          <button onClick={() => nav(-1)} style={styles.link} disabled={loading}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#05060b",
    position: "relative",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  bg: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, #0b1020, #090b14, #06070d)",
  },
  center: {
    position: "relative",
    zIndex: 1,
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "min(520px, 92vw)",
    borderRadius: 18,
    padding: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.35)",
    backdropFilter: "blur(14px)",
  },
  title: { color: "#fff", fontSize: 22, fontWeight: 800 },
  sub: { marginTop: 6, color: "rgba(255,255,255,0.7)" },
  field: {
    marginTop: 14,
    height: 50,
    borderRadius: 14,
    padding: "0 12px",
    border: "1px solid rgba(255,255,255,0.10)",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  icon: { opacity: 0.75 },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    background: "transparent",
    border: "none",
    outline: "none",
  },
  eyeBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    opacity: 0.85,
    fontSize: 16,
  },
  btn: {
    marginTop: 16,
    height: 50,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.14)",
    border: "none",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
    width: "100%",
  },
  link: {
    marginTop: 12,
    width: "100%",
    background: "transparent",
    border: "none",
    color: "rgba(255,255,255,0.75)",
    cursor: "pointer",
  },
};
