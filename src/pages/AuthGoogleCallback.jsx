import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function safeTrim(v) {
  return String(v || "").trim();
}

function getParam(name) {
  const normalParams = new URLSearchParams(window.location.search);
  const fromNormal = safeTrim(normalParams.get(name));
  if (fromNormal) return fromNormal;

  const hash = String(window.location.hash || "");
  const queryIndex = hash.indexOf("?");
  if (queryIndex >= 0) {
    const hashQuery = hash.slice(queryIndex + 1);
    const hashParams = new URLSearchParams(hashQuery);
    return safeTrim(hashParams.get(name));
  }

  return "";
}

export default function AuthGoogleCallback() {
  const nav = useNavigate();

  useEffect(() => {
    const token = getParam("token");
    const next = getParam("next");
    const userId = getParam("userId");
    const email = getParam("email");
    const firstName = getParam("firstName");
    const lastName = getParam("lastName");

    console.log("[AuthGoogleCallback] token exists:", !!token);
    console.log("[AuthGoogleCallback] email:", email);

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

    window.dispatchEvent(new Event("storage"));

    nav(next || "/", { replace: true });
  }, [nav]);

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