import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function safeTrim(v) {
  return String(v || "").trim();
}

export default function AuthGoogleCallback() {
  const nav = useNavigate();
  const [sp] = useSearchParams();

  useEffect(() => {
    const token = safeTrim(sp.get("token"));
    const next = safeTrim(sp.get("next"));
    const userId = safeTrim(sp.get("userId"));
    const email = safeTrim(sp.get("email"));
    const firstName = safeTrim(sp.get("firstName"));
    const lastName = safeTrim(sp.get("lastName"));

    if (!token) {
      nav("/auth/login?error=google_missing_token", { replace: true });
      return;
    }

    localStorage.setItem("buyerToken", token);
    localStorage.setItem("auth:isAuthed", "1");

    if (userId) localStorage.setItem("buyerUserId", userId);

    localStorage.setItem(
      "buyerUser",
      JSON.stringify({
        id: userId,
        email,
        firstName,
        lastName,
      })
    );

    nav(next || "/", { replace: true });
  }, [nav, sp]);

  return (
    <div style={styles.root}>
      <div style={styles.card}>
        <div style={styles.title}>Signing you in…</div>
        <div style={styles.sub}>Connecting your Google account to IndiVerse.</div>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100dvh",
    background: "#05060b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
  },
  card: {
    width: "min(460px, 100%)",
    borderRadius: 22,
    padding: 20,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: 900,
  },
  sub: {
    marginTop: 8,
    color: "rgba(255,255,255,0.68)",
  },
};