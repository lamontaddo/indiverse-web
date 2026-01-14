// src/pages/OwnerAboutPage.jsx ✅ FULL DROP-IN (Web)
// Route: /world/:profileKey/owner/about
//
// ✅ Web port of OwnerAboutScreen (hardened)
// ✅ NO silent profileKey fallback (param or router state only)
// ✅ Uses cached remote config (profileRegistry) for branding
// ✅ Owner auth (POST /api/admin/login) stores owner token in localStorage (profile-scoped)
// ✅ Loads public bio from GET /api/about
// ✅ Saves bio via OWNER PUT /api/owner/about using owner token
// ✅ Handles 401/403 -> marks logged out + redirects to /world/:profileKey/owner/login
//
// Requires (existing in your web build):
// - src/services/profileRegistry.js exports getProfileByKey
// - src/services/remoteConfigClient.js boots config in App (BootGate)
// - backend accepts header: x-profile-key
// - backend owner auth expects Authorization: Bearer <token>

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getProfileByKey } from "../services/profileRegistry";

const API_BASE = import.meta.env.VITE_API_BASE_URL || ""; // "" = same origin

function normalizeProfileKey(pk) {
  return String(pk || "").trim().toLowerCase();
}

function ownerTokenKey(profileKey) {
  return `ownerToken:${normalizeProfileKey(profileKey)}`;
}

function getOwnerToken(profileKey) {
  try {
    return localStorage.getItem(ownerTokenKey(profileKey)) || "";
  } catch {
    return "";
  }
}

function setOwnerToken(profileKey, token) {
  const k = normalizeProfileKey(profileKey);
  localStorage.setItem(ownerTokenKey(k), token);
  // convenience / legacy
  localStorage.setItem("ownerToken", token);
  localStorage.setItem("profileKey", k);
  localStorage.setItem("lastOwnerProfileKey", k);
}

function clearOwnerToken(profileKey) {
  try {
    localStorage.removeItem(ownerTokenKey(profileKey));
  } catch {}
  try {
    localStorage.removeItem("ownerToken");
  } catch {}
}

async function apiJson(path, { method = "GET", profileKey, body, headers } = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      ...(headers || {}),
      "content-type": "application/json",
      "x-profile-key": normalizeProfileKey(profileKey),
    },
    body,
  });

  let json = null;
  try {
    json = await res.json();
  } catch {}

  if (!res.ok) {
    const msg = json?.error || json?.message || `Request failed (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.body = json;
    throw err;
  }

  return json;
}

async function ownerFetchRaw(path, { method = "GET", profileKey, body, headers } = {}) {
  const url = `${API_BASE}${path}`;
  const token = getOwnerToken(profileKey);

  const res = await fetch(url, {
    method,
    headers: {
      ...(headers || {}),
      "x-profile-key": normalizeProfileKey(profileKey),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });

  return res;
}

function fmtWhen(ts) {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return String(ts || "");
  }
}

export default function OwnerAboutPage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  // ✅ NO silent fallback: param wins, else router state
  const rawProfileKey = params?.profileKey || location?.state?.profileKey || "";
  const profileKey = useMemo(() => normalizeProfileKey(rawProfileKey), [rawProfileKey]);

  const profile = useMemo(() => (profileKey ? getProfileByKey(profileKey) : null), [profileKey]);
  const ownerLabel = profile?.label || profile?.brandTopTitle || profileKey || "Owner";

  const [bio, setBio] = useState("");
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Owner auth UI state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  const toastTimerRef = useRef(null);

  const showToast = useCallback(() => {
    setSavedToast(true);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setSavedToast(false), 2200);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  // token presence
  useEffect(() => {
    if (!profileKey) {
      setHasToken(false);
      return;
    }
    setHasToken(!!getOwnerToken(profileKey));
  }, [profileKey]);

  // load public bio
  useEffect(() => {
    let alive = true;

    (async () => {
      if (!profileKey) {
        setError("Missing profileKey. Open this page as /world/:profileKey/owner/about");
        setBio("");
        setLastUpdated(null);
        setInitialLoaded(true);
        return;
      }

      try {
        setError(null);
        setInitialLoaded(false);

        const data = await apiJson(`/api/about?ts=${Date.now()}`, { profileKey });

        if (!alive) return;
        setBio(data?.bio || "");
        setLastUpdated(data?.updatedAt || null);
      } catch (err) {
        if (!alive) return;
        setError(err?.message || "Failed to load bio.");
      } finally {
        if (alive) setInitialLoaded(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, [profileKey]);

  const goBack = () => {
    if (window.history.length > 1) navigate(-1);
    else if (profileKey) navigate(`/world/${profileKey}`, { replace: true });
    else navigate("/", { replace: true });
  };

  const goOwnerLogin = useCallback(() => {
    if (!profileKey) {
      navigate("/", { replace: true });
      return;
    }
    navigate(`/world/${profileKey}/owner/login`, {
      replace: true,
      state: { profileKey, bgUrl: location?.state?.bgUrl || null },
    });
  }, [navigate, profileKey, location?.state?.bgUrl]);

  const handleLogin = async () => {
    if (authBusy) return;

    if (!profileKey) {
      setError("Missing profileKey. Open this page as /world/:profileKey/owner/about");
      return;
    }

    try {
      setAuthBusy(true);
      setError(null);

      const normalizedEmail = String(email || "").trim();
      const rawPassword = String(password || "");

      if (!normalizedEmail || !rawPassword) throw new Error("Enter email + password.");

      const data = await apiJson("/api/admin/login", {
        method: "POST",
        profileKey,
        body: JSON.stringify({ email: normalizedEmail, password: rawPassword }),
      });

      const token = String(data?.token || "");
      if (!token) throw new Error("Login failed: no token returned.");

      setOwnerToken(profileKey, token);
      setHasToken(true);
      setPassword("");
      showToast();
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogout = () => {
    if (!profileKey) return;
    clearOwnerToken(profileKey);
    setHasToken(false);
    setPassword("");
    showToast();
  };

  const handleSave = async () => {
    if (saving) return;

    if (!profileKey) {
      setError("Missing profileKey. Open this page as /world/:profileKey/owner/about");
      return;
    }

    if (!hasToken) {
      setError("Owner login required to save.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const res = await ownerFetchRaw("/api/owner/about", {
        method: "PUT",
        profileKey,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ bio }),
      });

      const text = await res.text().catch(() => "");
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {}

      console.log("[OwnerAboutWeb][SAVE]", {
        status: res.status,
        ok: res.ok,
        bodyPreview: String(text || "").slice(0, 220),
      });

      if (!res.ok) {
        const msg = data?.error || data?.message || `Save failed (${res.status})`;
        const err = new Error(msg);
        err.status = res.status;

        if (res.status === 401 || res.status === 403) err.code = "OWNER_UNAUTHORIZED";
        throw err;
      }

      setLastUpdated(data?.updatedAt || new Date().toISOString());
      if (typeof data?.bio === "string") setBio(data.bio);

      showToast();
    } catch (err) {
      if (err?.code === "OWNER_UNAUTHORIZED" || err?.status === 401 || err?.status === 403) {
        setHasToken(false);
        clearOwnerToken(profileKey);
        setError("Session expired. Please log in again.");
        goOwnerLogin();
        return;
      }

      setError(err?.message || "Failed to save bio.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="oa-root">
      <style>{css}</style>

      <div className="oa-header">
        <button className="oa-backBtn" onClick={goBack} aria-label="Back">
          ‹
        </button>

        <div className="oa-headerText">
          <div className="oa-title">About / Bio</div>
          <div className="oa-subtitle">
            {profileKey
              ? `This text powers the About screen for ${ownerLabel}. • ${profileKey}`
              : "Missing profileKey for this page."}
          </div>
        </div>

        <div style={{ width: 36 }} />
      </div>

      <div className="oa-body">
        {error ? (
          <div className="oa-errorBox">
            <div className="oa-errorText">{error}</div>
          </div>
        ) : null}

        <div className="oa-authRow">
          <div className="oa-authTitle">Owner Auth {hasToken ? "• Logged in" : "• Not logged in"}</div>

          {hasToken ? (
            <button className="oa-miniBtn" onClick={handleLogout}>
              <span style={{ opacity: 0.9 }}>⎋</span>
              <span>Logout</span>
            </button>
          ) : null}
        </div>

        {!hasToken ? (
          <div className="oa-authCard">
            <input
              className="oa-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Owner email"
              autoCapitalize="none"
              autoCorrect="off"
              inputMode="email"
              disabled={!profileKey}
            />
            <input
              className="oa-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Owner password"
              type="password"
              disabled={!profileKey}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            />

            <button className="oa-authBtn" onClick={handleLogin} disabled={authBusy || !profileKey}>
              {authBusy ? <span className="oa-spinner" /> : <span>🔑</span>}
              <span>{profileKey ? "Login" : "Missing profileKey"}</span>
            </button>
          </div>
        ) : null}

        <div className="oa-label">Bio</div>

        <div className="oa-textAreaWrap">
          {!initialLoaded ? (
            <div className="oa-loading">
              <span className="oa-spinner" />
              <div className="oa-loadingText">Loading bio…</div>
            </div>
          ) : (
            <textarea
              className="oa-textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write your story here – who you are, what you stand for, your journey, & your philosophy."
              disabled={!profileKey}
            />
          )}
        </div>

        <button
          className="oa-saveBtn"
          onClick={handleSave}
          disabled={!hasToken || !profileKey || saving}
          style={{ opacity: !hasToken || !profileKey ? 0.55 : saving ? 0.8 : 1 }}
        >
          {saving ? <span className="oa-spinner" /> : <span>💾</span>}
          <span>{!profileKey ? "Missing profileKey" : hasToken ? "Save Bio" : "Login to Save"}</span>
        </button>

        {lastUpdated ? <div className="oa-meta">Last updated: {fmtWhen(lastUpdated)}</div> : null}
      </div>

      {savedToast ? (
        <div className="oa-toast">
          <div className="oa-toastCheck">✓</div>
          <div className="oa-toastText">{hasToken ? "Saved / Auth OK" : "Done"}</div>
        </div>
      ) : null}
    </div>
  );
}

const css = `
.oa-root{
  min-height: 100vh;
  color:#e5e7eb;
  background:
    radial-gradient(1200px 600px at 20% 10%, rgba(79,70,229,0.22), transparent 60%),
    radial-gradient(900px 500px at 80% 30%, rgba(34,211,238,0.10), transparent 60%),
    linear-gradient(180deg, #020617, #020617, #020617);
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
  padding: 0 18px;
}

.oa-header{
  display:flex;
  align-items:center;
  gap: 12px;
  padding: 18px 0 14px;
}
.oa-backBtn{
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid rgba(55,65,81,0.9);
  background: rgba(15,23,42,0.9);
  color:#e5e7eb;
  font-size: 22px;
  line-height: 32px;
  cursor:pointer;
}
.oa-headerText{ flex: 1; min-width: 0; }
.oa-title{
  color:#f9fafb;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.4px;
}
.oa-subtitle{
  margin-top: 3px;
  font-size: 12px;
  color:#9ca3af;
}

.oa-body{ padding-bottom: 26px; }

.oa-errorBox{
  margin-bottom: 10px;
  padding: 10px 10px;
  border-radius: 10px;
  background: rgba(248,113,113,0.08);
  border: 1px solid rgba(248,113,113,0.7);
}
.oa-errorText{ color:#fecaca; font-size: 12px; }

.oa-authRow{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}
.oa-authTitle{ color:#cbd5e1; font-size: 12px; letter-spacing: 0.6px; }

.oa-miniBtn{
  display:inline-flex;
  align-items:center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  color:#e5e7eb;
  cursor:pointer;
  font-size: 12px;
  font-weight: 700;
}

.oa-authCard{
  border-radius: 14px;
  border: 1px solid #374151;
  background: rgba(15,23,42,0.55);
  box-shadow: 0 18px 50px rgba(0,0,0,0.35);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  overflow:hidden;
  padding: 12px;
  margin-bottom: 14px;
  display:flex;
  flex-direction: column;
  gap: 10px;
}
.oa-input{
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(0,0,0,0.15);
  border-radius: 12px;
  padding: 10px 12px;
  color:#f9fafb;
  font-size: 14px;
  outline:none;
}
.oa-input:disabled{ opacity: 0.6; }

.oa-authBtn{
  border-radius: 999px;
  border: 1px solid rgba(96,165,250,0.35);
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  padding: 10px 14px;
  color:#eff6ff;
  font-weight: 800;
  font-size: 13px;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  gap: 8px;
}
.oa-authBtn:disabled{ opacity: 0.75; cursor:not-allowed; }

.oa-label{
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #9ca3af;
  margin-bottom: 6px;
  margin-top: 4px;
}

.oa-textAreaWrap{
  border-radius: 14px;
  border: 1px solid #374151;
  overflow:hidden;
  min-height: 260px;
  max-height: 420px;
  background: rgba(15,23,42,0.7);
  position: relative;
}
.oa-textarea{
  width: 100%;
  height: 100%;
  min-height: 260px;
  max-height: 420px;
  resize: vertical;
  border: none;
  outline: none;
  background: transparent;
  padding: 12px 14px;
  color:#f9fafb;
  font-size: 15px;
  line-height: 22px;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
}
.oa-textarea:disabled{ opacity: 0.65; }

.oa-loading{
  height: 260px;
  display:flex;
  flex-direction: column;
  align-items:center;
  justify-content:center;
  gap: 8px;
}
.oa-loadingText{ color:#9ca3af; font-size: 13px; }

.oa-saveBtn{
  margin-top: 16px;
  border-radius: 999px;
  border: 1px solid rgba(34,197,94,0.35);
  background: linear-gradient(135deg, #22c55e, #16a34a);
  padding: 11px 20px;
  color:#ecfdf5;
  font-weight: 900;
  font-size: 14px;
  letter-spacing: 0.3px;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  gap: 8px;
}
.oa-saveBtn:disabled{ cursor:not-allowed; }

.oa-meta{ margin-top: 10px; font-size: 12px; color: #6b7280; }

.oa-toast{
  position: fixed;
  right: 16px;
  top: 16px;
  z-index: 50;
  display:flex;
  align-items:center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(22,163,74,0.98);
  box-shadow: 0 18px 60px rgba(0,0,0,0.45);
}
.oa-toastCheck{
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display:flex;
  align-items:center;
  justify-content:center;
  background: #bbf7d0;
  color: #022c22;
  font-weight: 900;
}
.oa-toastText{ color:#ecfdf5; font-weight: 700; font-size: 13px; }

.oa-spinner{
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: rgba(255,255,255,0.95);
  display:inline-block;
  animation: oa_spin 0.8s linear infinite;
}
@keyframes oa_spin{ to { transform: rotate(360deg); } }

@media (max-width: 520px){
  .oa-root{ padding: 0 14px; }
}
`;
