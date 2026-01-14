// src/pages/OwnerPlaylistPage.jsx ✅ FULL DROP-IN (Web) — HARDENED
// Route: /world/:profileKey/owner/playlist
//
// Hits:
//  - GET    /api/owner/tracks
//  - POST   /api/owner/tracks        { spotifyUrl, tag? }
//  - DELETE /api/owner/tracks/:id
//
// Hardened:
// ✅ NO 'lamont' fallback
// ✅ profileKey resolved as: route param -> localStorage('profileKey') only
// ✅ If missing profileKey: blocks API + shows error banner
// ✅ res.ok checks everywhere
// ✅ Dedupe by id
// ✅ 401/403 redirects to owner login (web)

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getProfileByKey } from "../services/profileRegistry";

function normalizeProfileKey(pk) {
  return String(pk || "").trim().toLowerCase();
}

function getActiveProfileKeyWeb() {
  try {
    return normalizeProfileKey(localStorage.getItem("profileKey"));
  } catch {
    return "";
  }
}

function ownerTokenKey(profileKey) {
  return `ownerToken:${normalizeProfileKey(profileKey)}`;
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

// ✅ web version of ownerFetchRaw (no throw, returns Response)
async function ownerFetchRawWeb(path, { profileKey, method = "GET", body } = {}) {
  const pk = normalizeProfileKey(profileKey);
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

function normalizeItem(x) {
  if (!x) return null;
  const id = String(x._id || x.id || "").trim();
  if (!id) return null;

  return {
    ...x,
    _id: id,
    id,
    title: x.title || "Untitled",
    artist: x.artist || "",
    tag: x.tag || "",
    monogram: x.monogram || "LM",
  };
}

function normalizeList(data) {
  const raw = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
  const seen = new Set();
  const out = [];

  for (const it of raw) {
    const n = normalizeItem(it);
    if (!n) continue;
    if (seen.has(n.id)) continue;
    seen.add(n.id);
    out.push(n);
  }

  return out;
}

export default function OwnerPlaylistPage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const routeProfileKey = normalizeProfileKey(params?.profileKey);
  const storedProfileKey = getActiveProfileKeyWeb();
  const resolvedKey = routeProfileKey || storedProfileKey || "";

  const [profileKey, setProfileKey] = useState(resolvedKey || "");
  const [profileReady, setProfileReady] = useState(false);

  const [ownerLabel, setOwnerLabel] = useState("Owner");
  const [accent, setAccent] = useState("#818cf8");
  const bgUrl = location?.state?.bgUrl || null;

  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [tag, setTag] = useState("");

  const [tracks, setTracks] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [toast, setToast] = useState(null); // { type, message }
  const toastTimerRef = useRef(null);

  const canUseApi = useMemo(() => !!profileKey, [profileKey]);

  const showToast = (type, message) => {
    setToast({ type, message });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2600);
  };

  const goOwnerLogin = useCallback(
    (k) => {
      const key = normalizeProfileKey(k || profileKey);
      if (!key) return navigate("/", { replace: true });

      navigate(`/world/${encodeURIComponent(key)}/owner/login`, {
        replace: true,
        state: { profileKey: key, bgUrl },
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

  // Resolve profile meta
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const next = normalizeProfileKey(routeProfileKey || storedProfileKey || "");
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
  }, [routeProfileKey]);

  // Load tracks
  useEffect(() => {
    if (!profileReady) return;

    if (!profileKey) {
      setLoadingList(false);
      setTracks([]);
      setError("Missing profileKey. Open this page with /world/:profileKey/owner/playlist.");
      return;
    }

    let mounted = true;

    (async () => {
      try {
        setError(null);
        setLoadingList(true);

        const res = await ownerFetchRawWeb("/api/owner/tracks", { profileKey });
        const data = await readJsonSafe(res);

        if (res.status === 401 || res.status === 403) {
          if (mounted) {
            setError("Session expired. Please log in again.");
            setLoadingList(false);
          }
          goOwnerLogin(profileKey);
          return;
        }

        if (!res.ok) {
          const msg = data?.error || data?.message || "Failed to load tracks.";
          throw new Error(msg);
        }

        const list = normalizeList(data);
        if (mounted) setTracks(list);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || "Failed to load tracks.");
      } finally {
        if (mounted) setLoadingList(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [profileReady, profileKey, goOwnerLogin]);

  const handleAddTrack = async () => {
    const url = String(spotifyUrl || "").trim();
    if (!canUseApi) return;

    if (!url) {
      showToast("error", "Spotify link is required.");
      return;
    }

    if (saving) return;

    try {
      setSaving(true);
      setError(null);

      const res = await ownerFetchRawWeb("/api/owner/tracks", {
        method: "POST",
        profileKey,
        body: JSON.stringify({ spotifyUrl: url, tag: String(tag || "").trim() || undefined }),
      });

      const savedRaw = await readJsonSafe(res);

      if (res.status === 401 || res.status === 403) {
        showToast("error", "Session expired. Please log in again.");
        goOwnerLogin(profileKey);
        return;
      }

      if (!res.ok) {
        const msg = savedRaw?.error || savedRaw?.message || "Failed to add track.";
        throw new Error(msg);
      }

      const item = savedRaw?.item || savedRaw?.data || savedRaw;
      const saved = normalizeItem(item);

      if (saved?.id) {
        setTracks((prev) => normalizeList([saved, ...prev]));
      }

      setSpotifyUrl("");
      setTag("");
      showToast("success", "Track added to playlist");
    } catch (err) {
      const msg = err?.message || "Failed to add track.";
      setError(msg);
      showToast("error", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTrack = async (trackId) => {
    const id = String(trackId || "").trim();
    if (!id || !profileKey) return;

    const ok = window.confirm("Remove this track from the playlist?");
    if (!ok) return;

    try {
      const res = await ownerFetchRawWeb(`/api/owner/tracks/${encodeURIComponent(id)}`, {
        method: "DELETE",
        profileKey,
      });

      const data = await readJsonSafe(res);

      if (res.status === 401 || res.status === 403) {
        showToast("error", "Session expired. Please log in again.");
        goOwnerLogin(profileKey);
        return;
      }

      if (!res.ok) {
        const msg = data?.error || data?.message || "Failed to delete track.";
        throw new Error(msg);
      }

      setTracks((prev) => prev.filter((t) => String(t._id || t.id) !== id));
      showToast("success", "Track removed");
    } catch (err) {
      showToast("error", err?.message || "Failed to delete track.");
    }
  };

  return (
    <div style={styles.page}>
      <style>{css(accent)}</style>

      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={goBack} title="Back">
          ←
        </button>

        <div style={{ flex: 1 }}>
          <div style={styles.title}>{ownerLabel} Playlist</div>
          <div style={styles.subtitle}>
            Paste Spotify tracks that power your energy{profileKey ? ` • ${profileKey}` : ""}
          </div>
          {!canUseApi ? (
            <div style={{ ...styles.subtitle, color: "#fca5a5" }}>
              Missing profileKey for this page.
            </div>
          ) : null}
        </div>

        <div style={{ width: 42 }} />
      </div>

      {/* Error banner */}
      {error ? (
        <div style={styles.errorBox}>
          <div style={styles.errorText}>{error}</div>
        </div>
      ) : null}

      {/* Form */}
      <div style={styles.form}>
        <div style={styles.label}>Spotify link</div>
        <div style={styles.inputWrap}>
          <input
            value={spotifyUrl}
            onChange={(e) => setSpotifyUrl(e.target.value)}
            style={styles.input}
            placeholder="https://open.spotify.com/track/..."
            disabled={!canUseApi}
            autoCapitalize="none"
            autoCorrect="off"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTrack();
            }}
          />
        </div>

        <div style={{ height: 10 }} />

        <div style={styles.label}>Tag / mood</div>
        <div style={styles.inputWrap}>
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            style={styles.input}
            placeholder="ex: Lock-in mode, Night drive, Healing"
            disabled={!canUseApi}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTrack();
            }}
          />
        </div>

        <button
          style={{
            ...styles.addBtn,
            opacity: !canUseApi || saving ? 0.7 : 1,
            cursor: !canUseApi || saving ? "not-allowed" : "pointer",
          }}
          onClick={handleAddTrack}
          disabled={!canUseApi || saving}
        >
          {saving ? "Adding…" : "＋ Add to Playlist"}
        </button>
      </div>

      {/* List */}
      <div style={styles.sectionTitle}>Current playlist</div>

      {loadingList ? (
        <div style={styles.loadingBox}>
          <div className="spinner" />
          <div style={styles.loadingText}>Loading tracks…</div>
        </div>
      ) : tracks.length === 0 ? (
        <div style={styles.emptyText}>No tracks yet. Drop in a Spotify link to start.</div>
      ) : (
        <div style={styles.list}>
          {tracks.map((t) => (
            <div key={String(t._id || t.id)} style={styles.trackTile}>
              <div style={styles.trackRow}>
                <div style={styles.monogramCircle}>{String(t.monogram || "LM").slice(0, 3)}</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={styles.trackTitle} title={t.title}>
                    {t.title}
                  </div>
                  <div style={styles.trackArtist} title={t.artist}>
                    {t.artist}
                  </div>
                  {t.tag ? (
                    <div style={styles.trackTag} title={t.tag}>
                      {t.tag}
                    </div>
                  ) : null}
                </div>

                <button
                  style={styles.trashBtn}
                  onClick={() => handleDeleteTrack(t._id || t.id)}
                  title="Remove"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast ? (
        <div
          style={{
            ...styles.toast,
            background:
              toast.type === "success"
                ? "rgba(22,163,74,0.96)"
                : "rgba(239,68,68,0.96)",
          }}
        >
          <div style={styles.toastDot}>{toast.type === "success" ? "✓" : "!"}</div>
          <div style={styles.toastText}>{toast.message}</div>
        </div>
      ) : null}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #020617, #020617, #020617)",
    color: "#e5e7eb",
    padding: 18,
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    paddingBottom: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    border: "1px solid rgba(55,65,81,0.9)",
    background: "rgba(15,23,42,0.9)",
    color: "#e5e7eb",
    fontWeight: 900,
    cursor: "pointer",
  },
  title: { color: "#f9fafb", fontSize: 18, fontWeight: 900, letterSpacing: 0.4 },
  subtitle: { marginTop: 4, fontSize: 12, color: "#9ca3af" },

  errorBox: {
    marginBottom: 12,
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(248,113,113,0.08)",
    border: "1px solid rgba(248,113,113,0.55)",
  },
  errorText: { color: "#fecaca", fontSize: 12, fontWeight: 700 },

  form: {
    borderRadius: 16,
    border: "1px solid rgba(55,65,81,0.65)",
    background: "rgba(15,23,42,0.55)",
    padding: 12,
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#9ca3af",
    marginBottom: 6,
    fontWeight: 800,
  },
  inputWrap: {
    borderRadius: 999,
    border: "1px solid rgba(55,65,81,0.9)",
    overflow: "hidden",
    background: "rgba(2,6,23,0.65)",
  },
  input: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#f9fafb",
    padding: "12px 14px",
    fontSize: 14,
  },
  addBtn: {
    marginTop: 12,
    width: "100%",
    borderRadius: 999,
    border: "1px solid rgba(34,197,94,0.45)",
    background: "linear-gradient(90deg, rgba(34,197,94,0.95), rgba(22,163,74,0.95))",
    color: "#ecfdf5",
    padding: "11px 14px",
    fontWeight: 900,
    letterSpacing: 0.3,
  },

  sectionTitle: {
    marginTop: 6,
    marginBottom: 10,
    color: "#e5e7eb",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },

  loadingBox: { padding: 18, display: "flex", gap: 10, alignItems: "center" },
  loadingText: { color: "#9ca3af", fontSize: 13 },
  emptyText: { color: "#6b7280", fontSize: 13, padding: 6 },

  list: { display: "flex", flexDirection: "column", gap: 10, paddingBottom: 26 },
  trackTile: {
    borderRadius: 16,
    border: "1px solid rgba(55,65,81,0.9)",
    background:
      "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 55%, rgba(255,255,255,0) 70%)",
    padding: 10,
  },
  trackRow: { display: "flex", alignItems: "center", gap: 10 },

  monogramCircle: {
    width: 38,
    height: 38,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    background: "rgba(59,130,246,0.22)",
    border: "1px solid rgba(129,140,248,0.7)",
    color: "#e5e7eb",
    flex: "0 0 auto",
  },

  trackTitle: {
    fontWeight: 900,
    color: "#f9fafb",
    fontSize: 14,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  trackArtist: {
    color: "#cbd5f5",
    fontSize: 12,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginTop: 2,
  },
  trackTag: {
    color: "#9ca3af",
    fontSize: 11,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginTop: 2,
  },

  trashBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    border: "1px solid rgba(248,113,113,0.55)",
    background: "rgba(239,68,68,0.10)",
    cursor: "pointer",
    color: "#fecaca",
    fontSize: 16,
  },

  toast: {
    position: "fixed",
    right: 16,
    top: 16,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.16)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
    zIndex: 999,
  },
  toastDot: {
    width: 22,
    height: 22,
    borderRadius: 999,
    background: "rgba(255,255,255,0.88)",
    color: "#052e1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
  },
  toastText: { color: "#ecfdf5", fontWeight: 800, fontSize: 13, letterSpacing: 0.2 },
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
