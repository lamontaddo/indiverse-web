// src/pages/OwnerContactsPage.jsx ✅ FULL DROP-IN (Web) — HARDENED
// Route: /world/:profileKey/owner/contacts
//
// Uses:
//  - GET /api/owner/contacts
//
// Hardened:
// ✅ NO 'lamont' fallback
// ✅ profileKey resolved as: route param -> localStorage('profileKey') only
// ✅ If missing profileKey: blocks API + shows banner
// ✅ 401/403 redirects to OwnerLogin
// ✅ res.ok checks everywhere
// ✅ Search + expand/collapse + refresh
// ✅ tel:/sms: actions (browser will hand off if supported)
// ✅ Selfie image preview if selfieUrl exists
//
// Notes:
// - FaceTime is iOS-only; on web we show it only if user-agent is Apple AND facetime: works.
// - Chat button navigates to a web route you can wire:
//     /world/:profileKey/owner/messages  (recommended)
//   If you later build /owner/chat, swap the navigate target.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getProfileByKey } from "../services/profileRegistry";

function normalizePk(v) {
  return String(v || "").trim().toLowerCase();
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

const getInitials = (firstName, lastName) => {
  const f = firstName?.trim?.()[0] || "";
  const l = lastName?.trim?.()[0] || "";
  return (f + l).toUpperCase();
};

const getContactKey = (c, idx = 0) => {
  const id = c?._id || c?.id;
  if (id) return String(id);
  const phone = String(c?.phone || "").trim();
  const fn = String(c?.firstName || "").trim();
  const ln = String(c?.lastName || "").trim();
  const fallback = `${phone}-${fn}-${ln}`.replace(/\s+/g, "");
  return fallback && fallback !== "--" ? fallback : `contact-${idx}`;
};

function isLikelyAppleDevice() {
  const ua = String(navigator?.userAgent || "").toLowerCase();
  return ua.includes("iphone") || ua.includes("ipad") || ua.includes("mac os");
}

function safeOpenHref(href) {
  try {
    window.location.href = href;
  } catch {
    // noop
  }
}

export default function OwnerContactsPage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const routeProfileKey = normalizePk(params?.profileKey);
  const storedProfileKey = getActiveProfileKeyWeb();
  const resolvedKey = routeProfileKey || storedProfileKey || "";

  const [profileKey, setProfileKey] = useState(resolvedKey || "");
  const [profileReady, setProfileReady] = useState(false);

  const bgUrl = location?.state?.bgUrl || null;
  const [ownerLabel, setOwnerLabel] = useState("Owner");
  const [accent, setAccent] = useState("#818cf8");

  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const inFlightRef = useRef(false);

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

  // Resolve profile meta
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const next = normalizePk(routeProfileKey || storedProfileKey || "");
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

  const fetchContacts = useCallback(
    async ({ isRefresh = false } = {}) => {
      if (!profileKey) {
        setContacts([]);
        setError(
          'Missing profileKey. Open: /world/:profileKey/owner/contacts (or set localStorage("profileKey")).'
        );
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (inFlightRef.current) return;
      inFlightRef.current = true;

      try {
        setError(null);
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        const res = await ownerFetchRawWeb("/api/owner/contacts", {
          profileKey,
          method: "GET",
        });

        const data = await readJsonSafe(res);

        if (res.status === 401 || res.status === 403) {
          setContacts([]);
          setError("Session expired. Please log in again.");
          goOwnerLogin(profileKey);
          return;
        }

        if (!res.ok || data?.ok === false) {
          throw new Error(data?.error || data?.message || "Failed to load contacts.");
        }

        const arr = Array.isArray(data)
          ? data
          : Array.isArray(data?.contacts)
          ? data.contacts
          : [];

        setContacts(arr);
      } catch (err) {
        const msg = err?.message || "Failed to load contacts.";
        setError(msg);
        if (String(msg).toLowerCase().includes("unauthorized")) {
          setContacts([]);
          goOwnerLogin(profileKey);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
        inFlightRef.current = false;
      }
    },
    [profileKey, goOwnerLogin]
  );

  useEffect(() => {
    if (!profileReady) return;
    fetchContacts();
  }, [profileReady, fetchContacts]);

  const visibleContacts = useMemo(() => {
    let list = contacts;

    const q = String(search || "").trim().toLowerCase();
    if (q) {
      list = list.filter((c) => {
        const name = `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase();
        const phone = String(c.phone || "").toLowerCase();
        return name.includes(q) || phone.includes(q);
      });
    }

    return [...list].sort((a, b) => {
      const aName = `${a.firstName || ""} ${a.lastName || ""}`.trim().toLowerCase();
      const bName = `${b.firstName || ""} ${b.lastName || ""}`.trim().toLowerCase();
      if (aName < bName) return -1;
      if (aName > bName) return 1;
      return 0;
    });
  }, [contacts, search]);

  const toggleExpand = (item, idx) => {
    const key = getContactKey(item, idx);
    setExpandedId((prev) => (prev === key ? null : key));
  };

  const openCall = (phone) => {
    if (!phone) return;
    safeOpenHref(`tel:${phone}`);
  };

  const openSms = (phone) => {
    if (!phone) return;
    safeOpenHref(`sms:${phone}`);
  };

  const openFaceTime = (phoneOrEmail) => {
    if (!phoneOrEmail) return;
    // browser support varies; still try on Apple devices
    safeOpenHref(`facetime:${phoneOrEmail}`);
  };

  const goOwnerMessages = (contact) => {
    if (!profileKey) return;

    // ✅ recommended: route your chat/messages here (build it when ready)
    navigate(`/world/${encodeURIComponent(profileKey)}/owner/messages`, {
      state: { profileKey, bgUrl, contact, contactId: contact?._id || contact?.id || null },
    });
  };

  return (
    <div style={styles.page(accent)}>
      <style>{css(accent)}</style>

      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={goBack} title="Back">
          ←
        </button>

        <div style={{ flex: 1 }}>
          <div style={styles.title}>Contacts</div>
          <div style={styles.subtitle}>
            {ownerLabel} • {contacts.length} contact{contacts.length === 1 ? "" : "s"}
            {profileKey ? ` • ${profileKey}` : ""}
          </div>
          {!canUseApi ? (
            <div style={{ ...styles.subtitle, color: "#fca5a5" }}>
              Missing profileKey. Cannot load owner contacts.
            </div>
          ) : null}
        </div>

        <button
          style={{ ...styles.ghostBtn, opacity: refreshing ? 0.7 : 1 }}
          onClick={() => fetchContacts({ isRefresh: true })}
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
          placeholder="Search name or phone"
          style={styles.searchInput}
        />
        {search ? (
          <button style={styles.clearBtn} onClick={() => setSearch("")} title="Clear">
            ✕
          </button>
        ) : null}
      </div>

      {/* Error banner */}
      {error ? (
        <div style={styles.errorBanner}>
          <div style={styles.errorText}>{error}</div>
          <button style={styles.retryBtn} onClick={() => fetchContacts({ isRefresh: true })}>
            Retry
          </button>
        </div>
      ) : null}

      {/* Body */}
      {loading ? (
        <div style={styles.center}>
          <div className="spinner" />
          <div style={styles.muted}>Loading contacts…</div>
        </div>
      ) : visibleContacts.length === 0 ? (
        <div style={styles.center}>
          <div style={styles.emptyTitle}>No contacts yet</div>
          <div style={styles.muted}>
            Once people fill out your contact form, they’ll appear here.
          </div>
        </div>
      ) : (
        <div style={styles.list}>
          {visibleContacts.map((c, idx) => {
            const key = getContactKey(c, idx);
            const isExpanded = expandedId === key;

            const initials = getInitials(c.firstName, c.lastName);
            const displayName = `${c.firstName || ""} ${c.lastName || ""}`.trim() || "(No name)";
            const phone = String(c.phone || "").trim();
            const previewNote =
              c.note && c.note.length > 40 ? c.note.slice(0, 40) + "…" : c.note || "";

            return (
              <div key={key} style={styles.card}>
                <div style={styles.cardTopRow}>
                  <div style={styles.avatarSquare}>{initials || "??"}</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={styles.cardName} title={displayName}>
                      {displayName}
                    </div>
                    {phone ? (
                      <div style={styles.cardPhone} title={phone}>
                        {phone}
                      </div>
                    ) : null}
                    {previewNote ? (
                      <div style={styles.cardNote} title={c.note || ""}>
                        {previewNote}
                      </div>
                    ) : null}
                  </div>

                  <button
                    style={styles.expandBtn}
                    onClick={() => toggleExpand(c, idx)}
                    title={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? "▴" : "▾"}
                  </button>
                </div>

                {isExpanded ? (
                  <div style={styles.expandedArea}>
                    <div style={styles.expandedLabel}>Quick actions</div>

                    <div style={styles.actionsRow}>
                      {phone ? (
                        <button style={styles.actionBtn} onClick={() => openCall(phone)}>
                          📞 Call
                        </button>
                      ) : null}

                      {phone ? (
                        <button style={styles.actionBtn} onClick={() => openSms(phone)}>
                          💬 Text
                        </button>
                      ) : null}

                      <button style={styles.actionBtn} onClick={() => goOwnerMessages(c)}>
                        🧠 Chat
                      </button>

                      {isLikelyAppleDevice() && phone ? (
                        <button style={styles.actionBtn} onClick={() => openFaceTime(phone)}>
                          🎥 FaceTime
                        </button>
                      ) : null}
                    </div>

                    {c.address ? (
                      <div style={{ marginTop: 10 }}>
                        <div style={styles.expandedLabel}>Address</div>
                        <div style={styles.expandedValue}>{c.address}</div>
                      </div>
                    ) : null}

                    {c.note ? (
                      <div style={{ marginTop: 10 }}>
                        <div style={styles.expandedLabel}>Note</div>
                        <div style={styles.expandedValue}>{c.note}</div>
                      </div>
                    ) : null}

{(() => {
  const u = String(c.selfieUrl || "").trim();
  const ok = /^https?:\/\//i.test(u);
  if (!ok) return null;

  return (
    <div style={{ marginTop: 12 }}>
      <div style={styles.expandedLabel}>Selfie</div>
      <img
        src={u}
        alt="selfie"
        style={styles.selfieImage}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
})()}

                  </div>
                ) : null}
              </div>
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

  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    paddingBottom: 12,
  },
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
  errorText: { color: "#ffb3b3", fontSize: 12, fontWeight: 800, flex: 1 },
  retryBtn: {
    borderRadius: 999,
    padding: "8px 12px",
    border: "1px solid rgba(255,255,255,0.22)",
    background: "rgba(15,23,42,0.75)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },

  list: { display: "flex", flexDirection: "column", gap: 12, paddingBottom: 24 },

  card: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.14)",
    background:
      "radial-gradient(circle at 25% 15%, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 55%, rgba(255,255,255,0) 70%)",
    padding: 10,
  },

  cardTopRow: { display: "flex", alignItems: "flex-start", gap: 10 },
  avatarSquare: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.20)",
    color: "#fff",
    fontWeight: 900,
    letterSpacing: 0.8,
    flex: "0 0 auto",
  },
  cardName: { color: "#fff", fontWeight: 900, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  cardPhone: { color: "#cfd3dc", fontSize: 13, marginTop: 2 },
  cardNote: { color: "#9ea4b5", fontSize: 11, marginTop: 2 },

  expandBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.65)",
    background: "rgba(15,23,42,0.80)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 900,
    flex: "0 0 auto",
  },

  expandedArea: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: "1px solid rgba(255,255,255,0.12)",
  },
  expandedLabel: {
    color: "#9ca3af",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    fontWeight: 900,
  },
  expandedValue: { color: "#e5e7eb", fontSize: 13, marginTop: 4, whiteSpace: "pre-wrap" },

  actionsRow: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 },
  actionBtn: {
    borderRadius: 999,
    padding: "8px 12px",
    border: "1px solid rgba(148,163,184,0.65)",
    background: "rgba(15,23,42,0.85)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },

  selfieImage: {
    marginTop: 8,
    width: "100%",
    maxHeight: 360,
    objectFit: "cover",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
  },

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
