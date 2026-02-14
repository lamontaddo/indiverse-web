// src/pages/OwnerContactsPage.jsx ✅ FULL DROP-IN (Web) — HARDENED + FIXED API BASE + SELFIE AVATAR + DELETE CONTACT
// Route: /world/:profileKey/owner/contacts
//
// Uses:
//  - GET    /api/owner/contacts
//  - DELETE /api/owner/contacts/:id   ✅ NEW
//
// Hardened:
// ✅ NO 'lamont' fallback
// ✅ profileKey resolved as: route param -> localStorage('profileKey') only
// ✅ If missing profileKey: blocks API + shows banner
// ✅ 401/403 redirects to OwnerLogin
// ✅ res.ok checks everywhere
// ✅ Search + expand/collapse + refresh
// ✅ tel:/sms: actions
// ✅ Selfie avatar + cache-bust + visible onError diagnostics
// ✅ Delete with confirm + optimistic UI + rollback on failure + "Deleting…" lock

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getProfileByKey } from "../services/profileRegistry";

/* ----------------------------- helpers ----------------------------- */

function normalizePk(v) {
  return String(v || "").trim().toLowerCase();
}

function cleanBase(url) {
  return String(url || "").trim().replace(/\/+$/, "");
}

// ✅ IMPORTANT: make sure web hits backend, not same-origin.
// If VITE_API_BASE_URL is empty, it will call relative (works with Vite proxy in dev).
function apiUrl(path) {
  const base = cleanBase(import.meta.env.VITE_API_BASE_URL || "");
  return base ? `${base}${path}` : path;
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
    const pk = normalizePk(profileKey);
    return localStorage.getItem(ownerTokenKey(pk)) || localStorage.getItem("ownerToken") || "";
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

// ✅ web owner fetch (returns Response)
async function ownerFetchRawWeb(path, { profileKey, method = "GET", body } = {}) {
  const pk = normalizePk(profileKey);
  const token = getOwnerToken(pk);

  const url = apiUrl(path);

  const headers = {
    Accept: "application/json",
    "x-profile-key": pk,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  };

  const isGet = String(method).toUpperCase() === "GET";

  const res = await fetch(url, {
    method,
    headers: {
      ...(isGet ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    credentials: "include",
    ...(body !== undefined ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {}),
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

function withCacheBust(url, seed) {
  const u = String(url || "").trim();
  if (!u) return "";
  const join = u.includes("?") ? "&" : "?";
  return `${u}${join}_cb=${encodeURIComponent(String(seed || Date.now()))}`;
}

/* ----------------------------- component ----------------------------- */

export default function OwnerContactsPage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const routeProfileKey = normalizePk(params?.profileKey);
  const storedProfileKey = getActiveProfileKeyWeb();

  // ✅ NO fallback. Only route param OR localStorage.
  const resolvedKey = routeProfileKey || storedProfileKey || "";

  const [profileKey, setProfileKey] = useState(resolvedKey);
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

  // ✅ delete lock
  const [deletingId, setDeletingId] = useState(null);

  const inFlightRef = useRef(false);

  const canUseApi = useMemo(() => !!profileKey, [profileKey]);

  // ✅ cache-bust seed so images refresh after uploads/refresh
  const [cacheSeed, setCacheSeed] = useState(Date.now());

  // ✅ image errors by contact key
  const [imgErr, setImgErr] = useState({}); // { [contactKey]: 'message' }

  // ✅ keep localStorage aligned when route param is present
  useEffect(() => {
    if (!routeProfileKey) return;
    try {
      localStorage.setItem("profileKey", routeProfileKey);
    } catch {}
  }, [routeProfileKey]);

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
          const msg = data?.error || data?.message || "Failed to load contacts.";
          throw new Error(`${msg} (status ${res.status}) @ ${apiUrl("/api/owner/contacts")}`);
        }

        const arr = Array.isArray(data) ? data : Array.isArray(data?.contacts) ? data.contacts : [];

        setContacts(arr);

        // ✅ bump cache seed after fetch so selfies refresh
        setCacheSeed(Date.now());

        // ✅ clear old image errors on refresh
        setImgErr({});
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

    const q = String(search || "")
      .trim()
      .toLowerCase();
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

  // ✅ DELETE contact: confirm + optimistic remove + rollback on failure
  const deleteContact = useCallback(
    async (contact) => {
      if (!profileKey) return;

      const id = contact?._id || contact?.id || null;
      if (!id) {
        setError("Cannot delete: contact is missing _id.");
        return;
      }

      const name = `${contact?.firstName || ""} ${contact?.lastName || ""}`.trim() || "this contact";
      const phone = String(contact?.phone || "").trim();

      const ok = window.confirm(`Delete ${name}${phone ? ` (${phone})` : ""}? This cannot be undone.`);
      if (!ok) return;

      // optimistic remove (id-based, safest)
      const prev = contacts;
      setDeletingId(String(id));
      setContacts((list) => list.filter((x) => String(x?._id || x?.id || "") !== String(id)));

      // collapse if currently expanded
      setExpandedId((prevExpanded) => (String(prevExpanded) === String(id) ? null : prevExpanded));

      try {
        setError(null);

        const res = await ownerFetchRawWeb(`/api/owner/contacts/${encodeURIComponent(String(id))}`, {
          profileKey,
          method: "DELETE",
        });

        const data = await readJsonSafe(res);

        if (res.status === 401 || res.status === 403) {
          setError("Session expired. Please log in again.");
          goOwnerLogin(profileKey);
          return;
        }

        if (!res.ok || data?.ok === false) {
          const msg = data?.error || data?.message || "Failed to delete contact.";
          throw new Error(`${msg} (status ${res.status})`);
        }

        // refresh cache seed for remaining avatars
        setCacheSeed(Date.now());
      } catch (err) {
        // rollback
        setContacts(prev);
        setError(err?.message || "Failed to delete contact.");
      } finally {
        setDeletingId(null);
      }
    },
    [profileKey, contacts, goOwnerLogin]
  );

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
          disabled={!canUseApi || refreshing || !!deletingId}
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
          <button style={styles.retryBtn} onClick={() => fetchContacts({ isRefresh: true })} disabled={!!deletingId}>
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
            const id = String(c?._id || c?.id || key);
            const isExpanded = expandedId === key;
            const isDeleting = deletingId === String(c?._id || c?.id || "");

            const initials = getInitials(c.firstName, c.lastName);
            const displayName = `${c.firstName || ""} ${c.lastName || ""}`.trim() || "(No name)";
            const phone = String(c.phone || "").trim();
            const previewNote = c.note && c.note.length > 40 ? c.note.slice(0, 40) + "…" : c.note || "";

            const rawSelfieUrl = String(c.selfieUrl || "").trim();
            const hasSelfie = /^https?:\/\//i.test(rawSelfieUrl);
            const selfieSrc = hasSelfie ? withCacheBust(rawSelfieUrl, cacheSeed) : "";

            const errMsg = imgErr?.[key] || "";

            return (
              <div key={id} style={styles.card}>
                <div style={styles.cardTopRow}>
                  <div style={styles.avatarSquare}>
                    {hasSelfie ? (
                      <img
                        src={selfieSrc}
                        alt="selfie"
                        style={styles.avatarImg}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={() => {
                          setImgErr((prev) => ({
                            ...prev,
                            [key]: "Image failed to load (likely S3 GetObject blocked for contacts/selfies).",
                          }));
                        }}
                        onLoad={() => {
                          if (imgErr?.[key]) {
                            setImgErr((prev) => {
                              const next = { ...prev };
                              delete next[key];
                              return next;
                            });
                          }
                        }}
                      />
                    ) : (
                      <span>{initials || "??"}</span>
                    )}
                  </div>

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

                    {hasSelfie ? <div style={styles.hasSelfieTag}>selfieUrl ✓</div> : null}
                  </div>

                  <button
                    style={{ ...styles.expandBtn, opacity: isDeleting ? 0.55 : 1, cursor: isDeleting ? "not-allowed" : "pointer" }}
                    onClick={isDeleting ? undefined : () => toggleExpand(c, idx)}
                    title={isExpanded ? "Collapse" : "Expand"}
                    disabled={isDeleting}
                  >
                    {isExpanded ? "▴" : "▾"}
                  </button>
                </div>

                {isExpanded ? (
                  <div style={styles.expandedArea}>
                    <div style={styles.expandedLabel}>Quick actions</div>

                    <div style={styles.actionsRow}>
                      {phone ? (
                        <button style={styles.actionBtn} onClick={() => openCall(phone)} disabled={isDeleting}>
                          📞 Call
                        </button>
                      ) : null}

                      {phone ? (
                        <button style={styles.actionBtn} onClick={() => openSms(phone)} disabled={isDeleting}>
                          💬 Text
                        </button>
                      ) : null}

                      <button style={styles.actionBtn} onClick={() => goOwnerMessages(c)} disabled={isDeleting}>
                        🧠 Chat
                      </button>

                      {isLikelyAppleDevice() && phone ? (
                        <button style={styles.actionBtn} onClick={() => openFaceTime(phone)} disabled={isDeleting}>
                          🎥 FaceTime
                        </button>
                      ) : null}

                      <button
                        style={{
                          ...styles.deleteBtn,
                          opacity: isDeleting ? 0.7 : 1,
                          cursor: isDeleting ? "not-allowed" : "pointer",
                        }}
                        onClick={isDeleting ? undefined : () => deleteContact(c)}
                        disabled={isDeleting}
                        title="Delete contact"
                      >
                        {isDeleting ? "Deleting…" : "🗑 Delete"}
                      </button>
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

                    {hasSelfie ? (
                      <div style={{ marginTop: 12 }}>
                        <div style={styles.expandedLabel}>Selfie</div>

                        <div style={styles.selfieToolsRow}>
                          <a style={styles.linkBtn} href={rawSelfieUrl} target="_blank" rel="noreferrer">
                            Open selfieUrl
                          </a>

                          <button
                            style={styles.linkBtn}
                            onClick={() => setCacheSeed(Date.now())}
                            title="Force refresh image"
                            disabled={isDeleting}
                          >
                            Refresh image
                          </button>
                        </div>

                        {errMsg ? <div style={styles.imgErrorText}>{errMsg}</div> : null}

                        <img
                          src={selfieSrc}
                          alt="selfie"
                          style={styles.selfieImage}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={() => {
                            setImgErr((prev) => ({
                              ...prev,
                              [key]:
                                "Image failed to load. Fix bucket policy: allow s3:GetObject on arn:aws:s3:::superappdb/contacts/selfies/*",
                            }));
                          }}
                        />

                        <div style={styles.urlTiny}>{rawSelfieUrl}</div>
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

/* ----------------------------- styles ----------------------------- */

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
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  cardName: {
    color: "#fff",
    fontWeight: 900,
    fontSize: 15,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  cardPhone: { color: "#cfd3dc", fontSize: 13, marginTop: 2 },
  cardNote: { color: "#9ea4b5", fontSize: 11, marginTop: 2 },
  hasSelfieTag: { color: "#7dd3fc", fontSize: 11, marginTop: 6, fontWeight: 900 },

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

  deleteBtn: {
    borderRadius: 999,
    padding: "8px 12px",
    border: "1px solid rgba(239,68,68,0.55)",
    background: "rgba(239,68,68,0.14)",
    color: "#fecaca",
    fontWeight: 900,
    cursor: "pointer",
  },

  selfieToolsRow: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 },

  linkBtn: {
    borderRadius: 999,
    padding: "8px 12px",
    border: "1px solid rgba(148,163,184,0.65)",
    background: "rgba(15,23,42,0.85)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },

  imgErrorText: {
    marginTop: 10,
    color: "#ffb3b3",
    fontSize: 12,
    fontWeight: 900,
  },

  selfieImage: {
    marginTop: 10,
    width: "100%",
    maxHeight: 360,
    objectFit: "cover",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    display: "block",
  },

  urlTiny: { marginTop: 8, color: "#9ea4b5", fontSize: 11, wordBreak: "break-all" },

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
