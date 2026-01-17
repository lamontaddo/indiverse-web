// src/pages/OwnerContactsPage.jsx ✅ FULL DROP-IN (Web) — HARDENED + FIXED API BASE + BIG ICON LOOK
// Route: /world/:profileKey/owner/contacts
//
// ✅ Uses ABSOLUTE backend base via ownerApi.web (NO same-origin /api 404)
// ✅ NO 'lamont' fallback
// ✅ profileKey resolved: route param -> localStorage('profileKey') only
// ✅ If missing profileKey: blocks API + shows banner
// ✅ 401/403 redirects to OwnerLogin
// ✅ Search + expand/collapse + refresh
// ✅ tel:/sms: actions
// ✅ Selfie preview if selfieUrl exists
//
// IMPORTANT:
// - Uses ONLY 'x-profile-key' header (NO 'X-Profile' header) to avoid CORS preflight blocks.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getProfileByKey } from "../services/profileRegistry";
import { ownerFetchRawWeb, ownerJsonWeb, normalizeProfileKey } from "../utils/ownerApi.web";

function getActiveProfileKeyWeb() {
  try {
    return normalizeProfileKey(localStorage.getItem("profileKey"));
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
  } catch {}
}

export default function OwnerContactsPage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const routeProfileKey = normalizeProfileKey(params?.profileKey);
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
      const k = normalizeProfileKey(key || profileKey);
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

        // ✅ absolute backend call via ownerApi.web
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
          throw new Error(data?.error || data?.message || `Failed to load contacts (${res.status}).`);
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

  const openCall = (phone) => phone && safeOpenHref(`tel:${phone}`);
  const openSms = (phone) => phone && safeOpenHref(`sms:${phone}`);
  const openFaceTime = (phoneOrEmail) => phoneOrEmail && safeOpenHref(`facetime:${phoneOrEmail}`);

  const goOwnerMessages = (contact) => {
    if (!profileKey) return;
    navigate(`/world/${encodeURIComponent(profileKey)}/owner/messages`, {
      state: { profileKey, bgUrl, contact, contactId: contact?._id || contact?.id || null },
    });
  };

  return (
    <div style={styles.page(accent)}>
      <style>{css(accent)}</style>

      {/* Header */}
      <div style={styles.header}>
        <button className="oc-btn" style={styles.backBtn} onClick={goBack} title="Back">
          ←
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
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
          className="oc-btn"
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
        <span style={{ fontSize: 16, opacity: 0.95 }}>🔎</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or phone"
          style={styles.searchInput}
        />
        {search ? (
          <button className="oc-btn" style={styles.clearBtn} onClick={() => setSearch("")} title="Clear">
            ✕
          </button>
        ) : null}
      </div>

      {/* Error banner */}
      {error ? (
        <div style={styles.errorBanner}>
          <div style={styles.errorText}>{error}</div>
          <button className="oc-btn" style={styles.retryBtn} onClick={() => fetchContacts({ isRefresh: true })}>
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
          <div style={styles.muted}>Once people fill out your contact form, they’ll appear here.</div>
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
              c.note && String(c.note).length > 44 ? String(c.note).slice(0, 44) + "…" : c.note || "";

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
                      <div style={styles.cardNote} title={String(c.note || "")}>
                        {previewNote}
                      </div>
                    ) : null}
                  </div>

                  <button
                    className="oc-btn"
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
                        <button className="oc-btn" style={styles.actionBtn} onClick={() => openCall(phone)}>
                          <span className="oc-ico">📞</span> Call
                        </button>
                      ) : null}

                      {phone ? (
                        <button className="oc-btn" style={styles.actionBtn} onClick={() => openSms(phone)}>
                          <span className="oc-ico">💬</span> Text
                        </button>
                      ) : null}

                      <button className="oc-btn" style={styles.actionBtn} onClick={() => goOwnerMessages(c)}>
                        <span className="oc-ico">🧠</span> Chat
                      </button>

                      {isLikelyAppleDevice() && phone ? (
                        <button className="oc-btn" style={styles.actionBtn} onClick={() => openFaceTime(phone)}>
                          <span className="oc-ico">🎥</span> FaceTime
                        </button>
                      ) : null}
                    </div>

                    {c.address ? (
                      <div style={{ marginTop: 12 }}>
                        <div style={styles.expandedLabel}>Address</div>
                        <div style={styles.expandedValue}>{c.address}</div>
                      </div>
                    ) : null}

                    {c.note ? (
                      <div style={{ marginTop: 12 }}>
                        <div style={styles.expandedLabel}>Note</div>
                        <div style={styles.expandedValue}>{c.note}</div>
                      </div>
                    ) : null}

                    {c.selfieUrl ? (
                      <div style={{ marginTop: 12 }}>
                        <div style={styles.expandedLabel}>Selfie</div>
                        <img
                          src={c.selfieUrl}
                          alt="selfie"
                          style={styles.selfieImage}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    ) : null}
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
    background:
      "radial-gradient(1100px 600px at 20% 10%, rgba(79,70,229,0.20), transparent 60%)," +
      "radial-gradient(900px 520px at 80% 30%, rgba(124,58,237,0.16), transparent 60%)," +
      "linear-gradient(180deg, #020617, #0b1120, #020617)",
    color: "#e5e7eb",
    padding: 16,
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
  }),

  header: { display: "flex", alignItems: "center", gap: 12, paddingBottom: 12 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.28)",
    background: "rgba(15,23,42,0.62)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
    fontSize: 18,
  },
  ghostBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.28)",
    background: "rgba(15,23,42,0.52)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
    fontSize: 18,
  },

  title: { color: "#fff", fontSize: 22, fontWeight: 900, letterSpacing: 0.8 },
  subtitle: { marginTop: 4, color: "#cfd3dc", fontSize: 12 },

  searchWrap: {
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.24)",
    background: "rgba(15,23,42,0.40)",
    padding: "12px 14px",
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
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
    fontSize: 14,
  },

  errorBanner: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 16,
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  errorText: { color: "#fecaca", fontSize: 12, fontWeight: 800, flex: 1 },
  retryBtn: {
    borderRadius: 999,
    padding: "10px 14px",
    border: "1px solid rgba(148,163,184,0.35)",
    background: "rgba(15,23,42,0.75)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },

  list: { display: "flex", flexDirection: "column", gap: 12, paddingBottom: 24 },

  card: {
    borderRadius: 18,
    border: "1px solid rgba(148,163,184,0.22)",
    background: "rgba(15,23,42,0.55)",
    boxShadow: "0 18px 42px rgba(0,0,0,0.35)",
    padding: 12,
  },

  cardTopRow: { display: "flex", alignItems: "flex-start", gap: 12 },
  avatarSquare: {
    width: 52,
    height: 52,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(148,163,184,0.25)",
    color: "#fff",
    fontWeight: 900,
    letterSpacing: 0.9,
    flex: "0 0 auto",
    fontSize: 16,
  },

  cardName: {
    color: "#fff",
    fontWeight: 900,
    fontSize: 16,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  cardPhone: { color: "#cfd3dc", fontSize: 13, marginTop: 3 },
  cardNote: { color: "#9ea4b5", fontSize: 12, marginTop: 4 },

  expandBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.28)",
    background: "rgba(15,23,42,0.80)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 900,
    flex: "0 0 auto",
    fontSize: 16,
  },

  expandedArea: {
    marginTop: 12,
    paddingTop: 12,
    borderTop: "1px solid rgba(148,163,184,0.18)",
  },
  expandedLabel: {
    color: "#9ca3af",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: 900,
  },
  expandedValue: { color: "#e5e7eb", fontSize: 13, marginTop: 6, whiteSpace: "pre-wrap" },

  actionsRow: { display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 },
  actionBtn: {
    borderRadius: 999,
    padding: "10px 14px",
    border: "1px solid rgba(148,163,184,0.30)",
    background: "rgba(2,6,23,0.35)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    letterSpacing: 0.3,
  },

  selfieImage: {
    marginTop: 10,
    width: "100%",
    maxHeight: 420,
    objectFit: "cover",
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.20)",
  },

  center: { padding: 26, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  emptyTitle: { color: "#fff", fontSize: 18, fontWeight: 900 },
  muted: { color: "#cfd3dc", fontSize: 13, textAlign: "center" },
};

function css(accent) {
  return `
    .oc-btn{ transition: transform 120ms ease, opacity 120ms ease; }
    .oc-btn:active{ transform: scale(0.98); opacity: 0.92; }

    .oc-ico{
      font-size: 18px;
      line-height: 1;
      filter: drop-shadow(0 8px 16px rgba(0,0,0,0.35));
    }

    .spinner{
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.22);
      border-top-color: ${accent || "rgba(255,255,255,0.85)"};
      border-radius: 999px;
      animation: spin 0.9s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `;
}
