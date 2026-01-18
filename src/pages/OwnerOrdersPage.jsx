// src/pages/OwnerOrdersPage.jsx ✅ FULL DROP-IN (Web) — MATCHES OTHER WEB OWNER PAGES
// Route: /world/:profileKey/owner/orders
//
// ✅ Web rewrite of RN OwnerOrdersScreen
// ✅ Uses BACKEND base URL (VITE_API_BASE_URL) like the fixed Products page
// ✅ Calls /api/owner/orders (GET) and /api/owner/orders/:id (GET)
// ✅ Owner token: localStorage ownerToken:<profileKey> (fallback ownerToken)
// ✅ Back to Owner + Back to IndiVerse buttons
// ✅ Filters (status, purchaseType), search, refresh
// ✅ Detail modal renders items + shipping nicely
//
// IMPORTANT ENV (Vite):
//   VITE_API_BASE_URL=https://indiverse-backend.onrender.com

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

/* -------------------- config -------------------- */

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://indiverse-backend.onrender.com";

/* -------------------- helpers -------------------- */

function normalizeProfileKey(pk) {
  return String(pk || "").trim().toLowerCase();
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

function joinUrl(base, path) {
  const b = String(base || "").replace(/\/+$/, "");
  const p = String(path || "");
  if (!p) return b;
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  return p.startsWith("/") ? `${b}${p}` : `${b}/${p}`;
}

async function readJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function ownerFetchWeb(path, { profileKey, method = "GET", body } = {}) {
  const pk = normalizeProfileKey(profileKey);
  const token = getOwnerToken(pk);

  const url = joinUrl(API_BASE, path);

  const res = await fetch(url, {
    method,
    headers: {
      ...(body ? { "content-type": "application/json" } : {}),
      "x-profile-key": pk,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });

  return res;
}

function moneyFromCents(cents, currency = "usd") {
  const n = Number(cents || 0) / 100;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: String(currency || "usd").toUpperCase(),
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

function shortId(s, n = 10) {
  const x = String(s || "");
  if (!x) return "";
  return x.length <= n ? x : `${x.slice(0, n)}…`;
}

function toIsoDisplay(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso || "");
    return d.toLocaleString();
  } catch {
    return String(iso || "");
  }
}

function purchaseTypeLabel(v) {
  const s = String(v || "").toLowerCase();
  if (!s) return "Unknown";
  if (s === "products") return "Products";
  if (s === "music") return "Music";
  if (s === "flowers") return "Flowers";
  return s;
}

// supports { shipping:{name,phone,address{line1,line2,city,state,postalCode/postal_code,country}} }
function formatShippingLines(shipping) {
  const s = shipping || null;
  const a = s?.address || null;
  if (!s && !a) return [];

  const line1 = a?.line1 ? String(a.line1) : "";
  const line2 = a?.line2 ? String(a.line2) : "";
  const city = a?.city ? String(a.city) : "";
  const state = a?.state ? String(a.state) : "";
  const postal = a?.postalCode || a?.postal_code ? String(a.postalCode || a.postal_code) : "";
  const country = a?.country ? String(a.country) : "";

  const cityLine = [city, state].filter(Boolean).join(", ");
  const lastLine = [postal, country].filter(Boolean).join(" ");

  const out = [];
  if (s?.name) out.push(String(s.name));
  if (s?.phone) out.push(String(s.phone));
  if (line1) out.push(line1);
  if (line2) out.push(line2);
  if (cityLine || lastLine) out.push([cityLine, lastLine].filter(Boolean).join(" "));

  return out.filter(Boolean);
}

/* -------------------- page -------------------- */

export default function OwnerOrdersPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const routeProfileKey = normalizeProfileKey(params?.profileKey);
  const [profileKey] = useState(routeProfileKey || "");

  const bgUrl = location?.state?.bgUrl || null;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [status, setStatus] = useState("paid"); // paid|pending|all|failed|refunded etc
  const [purchaseType, setPurchaseType] = useState("products"); // products|all
  const [search, setSearch] = useState("");

  const [items, setItems] = useState([]);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState(null);

  const canUse = useMemo(() => !!profileKey, [profileKey]);

  const goOwnerHome = () => {
    if (!profileKey) return navigate("/", { replace: false });
    navigate(`/world/${encodeURIComponent(profileKey)}/owner/home`, {
      state: { profileKey, bgUrl },
    });
  };

  const goBackToIndiVerse = () => {
    if (!profileKey) return navigate("/", { replace: false });
    navigate(`/world/${encodeURIComponent(profileKey)}`, { state: { profileKey, bgUrl } });
  };

  const goOwnerLogin = useCallback(() => {
    if (!profileKey) return navigate("/", { replace: true });
    navigate(`/world/${encodeURIComponent(profileKey)}/owner/login`, {
      replace: true,
      state: { profileKey, bgUrl },
    });
  }, [navigate, profileKey, bgUrl]);

  const fetchList = useCallback(
    async ({ isRefresh = false } = {}) => {
      if (!profileKey) return;

      try {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        const qs = new URLSearchParams();
        qs.set("limit", "200");
        qs.set("skip", "0");

        if (status && status !== "all") qs.set("status", status);
        if (purchaseType && purchaseType !== "all") qs.set("purchaseType", purchaseType);
        if (search) qs.set("search", search);

        const res = await ownerFetchWeb(`/api/owner/orders?${qs.toString()}`, { profileKey });
        const json = await readJsonSafe(res);

        if (res.status === 401 || res.status === 403) {
          goOwnerLogin();
          return;
        }

        if (!res.ok) {
          const msg =
            json?.error ||
            json?.message ||
            `Request failed (${res.status}${res.statusText ? ` ${res.statusText}` : ""})`;
          throw new Error(msg);
        }

        setItems(Array.isArray(json?.items) ? json.items : []);
      } catch (e) {
        alert(e?.message || "Unable to load orders");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [profileKey, status, purchaseType, search, goOwnerLogin]
  );

  useEffect(() => {
    if (!profileKey) return;
    fetchList();
  }, [fetchList, profileKey]);

  const openDetail = useCallback(
    async (order) => {
      const id = order?._id || null;
      if (!id || !profileKey) return;

      setDetailOpen(true);
      setDetailLoading(true);
      setDetail(null);

      try {
        const res = await ownerFetchWeb(`/api/owner/orders/${id}`, { profileKey });
        const json = await readJsonSafe(res);

        if (res.status === 401 || res.status === 403) {
          setDetailOpen(false);
          goOwnerLogin();
          return;
        }

        if (!res.ok) {
          const msg =
            json?.error ||
            json?.message ||
            `Request failed (${res.status}${res.statusText ? ` ${res.statusText}` : ""})`;
          throw new Error(msg);
        }

        setDetail(json?.item || null);
      } catch (e) {
        alert(e?.message || "Unable to load order");
        setDetailOpen(false);
      } finally {
        setDetailLoading(false);
      }
    },
    [profileKey, goOwnerLogin]
  );

  const closeDetail = () => {
    if (detailLoading) return;
    setDetailOpen(false);
  };

  if (!canUse) {
    return (
      <div style={styles.page}>
        <style>{css()}</style>

        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />
        <div style={styles.grid} />

        <div style={styles.header}>
          <button className="oo-back" onClick={() => navigate("/", { replace: false })}>
            Home
          </button>
          <div style={styles.headerTitle}>Orders</div>
          <div style={{ width: 140 }} />
        </div>

        <div style={styles.center}>
          <div style={styles.errTitle}>Missing profileKey</div>
          <div style={styles.errText}>
            Open as <code>/world/:profileKey/owner/orders</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{css()}</style>

      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />
      <div style={styles.grid} />

      <div style={styles.header}>
        <button className="oo-back" onClick={goOwnerHome} title="Back to Owner Home">
          ← Owner
        </button>

        <div style={styles.headerTitle}>Orders</div>

        <div style={styles.headerRight}>
          <button className="oo-pill" onClick={goBackToIndiVerse} title="Back to IndiVerse">
            <span className="oo-dot" />
            Back to IndiVerse
          </button>

          <button className="oo-btn" onClick={() => fetchList({ isRefresh: true })}>
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      <div style={styles.panelWrap}>
        <div style={styles.filters}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search session / userId / paymentIntent…"
            className="oo-search"
            onKeyDown={(e) => {
              if (e.key === "Enter") fetchList();
            }}
          />

          <div style={styles.filterRow}>
            <Chip on={status === "paid"} onClick={() => setStatus("paid")}>Paid</Chip>
            <Chip on={status === "all"} onClick={() => setStatus("all")}>All</Chip>
            <Chip on={status === "pending"} onClick={() => setStatus("pending")}>Pending</Chip>
            <Chip on={status === "failed"} onClick={() => setStatus("failed")}>Failed</Chip>
            <Chip on={status === "refunded"} onClick={() => setStatus("refunded")}>Refunded</Chip>

            <span style={{ width: 10 }} />

            <Chip on={purchaseType === "products"} onClick={() => setPurchaseType("products")}>
              Products
            </Chip>
            <Chip on={purchaseType === "all"} onClick={() => setPurchaseType("all")}>
              All types
            </Chip>

            <div style={{ flex: 1 }} />
            <button className="oo-btn oo-apply" onClick={() => fetchList()}>
              Apply
            </button>
          </div>

          <div style={styles.apiNote}>
            API: {API_BASE.replace(/^https?:\/\//, "")}
          </div>
        </div>

        {loading ? (
          <div style={styles.center}>
            <div className="spinner" />
            <div style={styles.muted}>Loading…</div>
          </div>
        ) : items.length === 0 ? (
          <div style={styles.center}>
            <div style={styles.muted}>No orders.</div>
          </div>
        ) : (
          <div style={styles.list}>
            {items.map((o) => {
              const total = moneyFromCents(o?.amountTotalCents, o?.currency);
              const when = o?.paidAt || o?.createdAt;
              const itemCount = Array.isArray(o?.items)
                ? o.items.reduce((a, x) => a + Number(x?.quantity || 0), 0)
                : 0;

              return (
                <button key={String(o?._id)} className="oo-row" onClick={() => openDetail(o)}>
                  <div style={{ minWidth: 0, flex: 1, textAlign: "left" }}>
                    <div style={styles.rowTitle}>
                      {total} <span style={{ opacity: 0.55 }}>•</span>{" "}
                      {String(o?.status || "unknown").toUpperCase()}
                    </div>

                    <div style={styles.rowSub}>
                      {purchaseTypeLabel(o?.purchaseType)} • {itemCount} item(s) •{" "}
                      {toIsoDisplay(when)}
                    </div>

                    <div style={styles.rowMeta}>
                      Session: {shortId(o?.stripeSessionId, 18)} • User:{" "}
                      {shortId(o?.userId, 12)}
                    </div>
                  </div>

                  <div className="oo-chev">›</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailOpen && (
        <div style={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && closeDetail()}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <button className="oo-link" onClick={closeDetail} disabled={detailLoading}>
                ← Back
              </button>

              <div style={styles.modalTitle}>Order</div>

              <button className="oo-link oo-linkPrimary" onClick={closeDetail} disabled={detailLoading}>
                Close
              </button>
            </div>

            {detailLoading ? (
              <div style={styles.center}>
                <div className="spinner" />
                <div style={styles.muted}>Loading order…</div>
              </div>
            ) : (
              <div style={styles.modalBody}>
                <Section title="Summary">
                  <RowKV label="Status" value={String(detail?.status || "unknown")} />
                  <RowKV label="Total" value={moneyFromCents(detail?.amountTotalCents, detail?.currency)} />
                  <RowKV label="Purchase Type" value={purchaseTypeLabel(detail?.purchaseType)} />
                  <RowKV label="Paid At" value={toIsoDisplay(detail?.paidAt || detail?.createdAt)} />
                </Section>

                <Section title="IDs">
                  <RowKV label="Order ID" value={String(detail?._id || "")} mono />
                  <RowKV label="Session" value={String(detail?.stripeSessionId || "")} mono />
                  <RowKV label="PaymentIntent" value={String(detail?.stripePaymentIntentId || "")} mono />
                  <RowKV label="Stripe Acct" value={String(detail?.stripeAccountId || "")} mono />
                  <RowKV label="User ID" value={String(detail?.userId || "")} mono />
                </Section>

                <Section title={`Items (${Array.isArray(detail?.items) ? detail.items.length : 0})`}>
                  {(Array.isArray(detail?.items) ? detail.items : []).map((it, idx) => {
                    const lineTotal = Number(it?.unitAmountCents || 0) * Number(it?.quantity || 0);
                    const variants = [
                      it?.selectedSize ? `Size: ${it.selectedSize}` : null,
                      it?.selectedColor ? `Color: ${it.selectedColor}` : null,
                    ]
                      .filter(Boolean)
                      .join(" • ");

                    return (
                      <div key={String(it?.productId || idx)} style={styles.itemCard}>
                        <div style={styles.itemName}>{it?.name || "(item)"}</div>
                        {!!variants && <div style={styles.itemMeta}>{variants}</div>}
                        <div style={styles.itemMeta}>
                          Qty: {Number(it?.quantity || 0)} • Unit:{" "}
                          {moneyFromCents(it?.unitAmountCents, it?.currency || detail?.currency)}
                        </div>
                        <div style={styles.itemTotal}>
                          Line Total: {moneyFromCents(lineTotal, it?.currency || detail?.currency)}
                        </div>
                        <div style={styles.itemMeta}>ProductId: {String(it?.productId || "")}</div>
                      </div>
                    );
                  })}
                </Section>

                <Section title="Shipping">
                  {(() => {
                    const lines = formatShippingLines(detail?.shipping);
                    if (!lines.length) return <div style={styles.mutedSmall}>No shipping captured yet.</div>;
                    return (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {lines.map((t, i) => (
                          <div key={`${t}-${i}`} style={styles.shipLine}>
                            {t}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </Section>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------- ui pieces -------------------- */

function Chip({ on, onClick, children }) {
  return (
    <button type="button" onClick={onClick} className={on ? "oo-chip oo-chipOn" : "oo-chip"}>
      {children}
    </button>
  );
}

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionTitle}>{title}</div>
      {children}
    </div>
  );
}

function RowKV({ label, value, mono }) {
  return (
    <div style={styles.kvRow}>
      <div style={styles.kvLabel}>{label}</div>
      <div style={{ flex: 1 }} />
      <div style={{ ...styles.kvValue, ...(mono ? styles.mono : null) }}>{String(value || "")}</div>
    </div>
  );
}

/* -------------------- styles -------------------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #020617, #0b1220, #020617)",
    color: "#e5e7eb",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
    position: "relative",
    overflow: "hidden",
  },

  glowOne: {
    position: "fixed",
    width: 360,
    height: 360,
    borderRadius: 999,
    top: -120,
    right: -140,
    background: hexToRgba("#818cf8", 0.28),
    filter: "blur(90px)",
    opacity: 0.8,
    pointerEvents: "none",
    zIndex: 0,
  },
  glowTwo: {
    position: "fixed",
    width: 360,
    height: 360,
    borderRadius: 999,
    bottom: -140,
    left: -160,
    background: "rgba(236,72,153,0.22)",
    filter: "blur(90px)",
    opacity: 0.7,
    pointerEvents: "none",
    zIndex: 0,
  },
  grid: {
    position: "fixed",
    inset: 0,
    backgroundImage:
      "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.10) 1px, rgba(0,0,0,0) 0)",
    backgroundSize: "26px 26px",
    maskImage: "radial-gradient(circle at 50% 18%, rgba(0,0,0,0.85), rgba(0,0,0,0) 62%)",
    WebkitMaskImage: "radial-gradient(circle at 50% 18%, rgba(0,0,0,0.85), rgba(0,0,0,0) 62%)",
    pointerEvents: "none",
    zIndex: 0,
    opacity: 0.9,
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 5,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(2,6,23,0.62)",
    backdropFilter: "blur(12px)",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: 900,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerRight: { display: "flex", gap: 10, alignItems: "center" },

  panelWrap: {
    position: "relative",
    zIndex: 2,
    maxWidth: 980,
    margin: "0 auto",
    padding: "14px 14px 40px",
  },

  filters: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(15,23,42,0.66)",
    padding: 12,
    boxShadow: "0 18px 42px rgba(0,0,0,0.35)",
  },
  filterRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    marginTop: 10,
  },
  apiNote: {
    marginTop: 10,
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    opacity: 0.65,
  },

  list: {
    marginTop: 14,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(15,23,42,0.52)",
    overflow: "hidden",
    boxShadow: "0 18px 42px rgba(0,0,0,0.35)",
  },

  rowTitle: { fontSize: 14, fontWeight: 900, color: "#f9fafb" },
  rowSub: { color: "rgba(203,213,225,0.85)", marginTop: 3, fontSize: 12 },
  rowMeta: { color: "rgba(148,163,184,0.85)", marginTop: 6, fontSize: 12 },

  center: {
    padding: 18,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 240,
  },
  muted: { color: "rgba(148,163,184,0.9)", marginTop: 10, fontWeight: 700 },
  mutedSmall: { color: "rgba(148,163,184,0.9)", fontSize: 12, lineHeight: "18px" },

  errTitle: { fontSize: 18, fontWeight: 900, marginBottom: 8 },
  errText: { color: "rgba(148,163,184,0.9)", textAlign: "center" },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.62)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    zIndex: 50,
    backdropFilter: "blur(6px)",
  },
  modal: {
    width: "min(980px, 100%)",
    maxHeight: "92vh",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(2,6,23,0.96)",
    overflow: "hidden",
    boxShadow: "0 30px 90px rgba(0,0,0,0.65)",
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(2,6,23,0.92)",
  },
  modalTitle: { fontWeight: 900, letterSpacing: 0.8, textTransform: "uppercase" },
  modalBody: { padding: 14, overflow: "auto" },

  section: {
    marginBottom: 16,
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 14,
    padding: 12,
    background: "rgba(15,23,42,0.50)",
  },
  sectionTitle: { fontWeight: 900, marginBottom: 10, letterSpacing: 0.6, textTransform: "uppercase", fontSize: 12 },

  kvRow: { display: "flex", alignItems: "center", gap: 10, padding: "6px 0" },
  kvLabel: { color: "rgba(148,163,184,0.92)", fontWeight: 900, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6 },
  kvValue: { color: "rgba(255,255,255,0.94)", fontWeight: 800, fontSize: 13, textAlign: "right", overflowWrap: "anywhere" },
  mono: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize: 12 },

  itemCard: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(2,6,23,0.55)",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  itemName: { fontWeight: 900, marginBottom: 4, color: "rgba(255,255,255,0.95)" },
  itemMeta: { color: "rgba(203,213,225,0.85)", marginTop: 2, fontSize: 12 },
  itemTotal: { color: "rgba(255,255,255,0.95)", fontWeight: 900, marginTop: 8, fontSize: 12 },
  shipLine: { color: "rgba(255,255,255,0.95)", fontWeight: 800, fontSize: 13 },
};

function css() {
  return `
  *{ box-sizing: border-box; }
  button{ font-family: inherit; }

  .spinner{
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255,255,255,0.25);
    border-top-color: rgba(255,255,255,0.9);
    border-radius: 999px;
    animation: spin 0.9s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .oo-back{
    height: 40px;
    border-radius: 999px;
    padding: 0 12px;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(2,6,23,0.35);
    color: rgba(255,255,255,0.92);
    font-weight: 900;
    letter-spacing: 0.6px;
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: transform 140ms ease, background 140ms ease, border-color 140ms ease;
    user-select:none;
    white-space: nowrap;
  }
  .oo-back:hover{ transform: translateY(-1px); background: rgba(15,23,42,0.55); border-color: rgba(129,140,248,0.45); }
  .oo-back:active{ transform: translateY(0) scale(0.995); opacity:0.95; }

  .oo-pill{
    height: 40px;
    border-radius: 999px;
    padding: 0 14px 0 12px;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(2,6,23,0.35);
    color: rgba(255,255,255,0.92);
    font-weight: 900;
    letter-spacing: 0.6px;
    cursor: pointer;
    display:flex;
    align-items:center;
    gap: 10px;
    backdrop-filter: blur(10px);
    transition: transform 140ms ease, background 140ms ease, border-color 140ms ease;
    user-select:none;
    text-transform: uppercase;
    font-size: 11px;
    white-space: nowrap;
  }
  .oo-pill:hover{ transform: translateY(-1px); background: rgba(15,23,42,0.55); border-color: rgba(129,140,248,0.45); }
  .oo-pill:active{ transform: translateY(0) scale(0.995); opacity:0.95; }
  .oo-dot{
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: rgba(129,140,248,0.95);
    box-shadow: 0 0 0 6px rgba(129,140,248,0.18);
  }

  .oo-btn{
    height: 40px;
    border-radius: 999px;
    padding: 0 14px;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(2,6,23,0.35);
    color: rgba(255,255,255,0.92);
    font-weight: 900;
    cursor: pointer;
    letter-spacing: 0.4px;
    white-space: nowrap;
  }
  .oo-btn:hover{ border-color: rgba(129,140,248,0.35); background: rgba(15,23,42,0.55); }
  .oo-apply{ border-color: rgba(34,197,94,0.35); }
  .oo-apply:hover{ border-color: rgba(34,197,94,0.55); }

  .oo-search{
    height: 44px;
    width: 100%;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.14);
    padding: 0 14px;
    color: rgba(255,255,255,0.94);
    background: rgba(2,6,23,0.45);
    outline: none;
    font-weight: 700;
  }
  .oo-search::placeholder{ color: rgba(148,163,184,0.9); }

  .oo-chip{
    padding: 7px 11px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(2,6,23,0.35);
    color: rgba(226,232,240,0.92);
    font-size: 12px;
    cursor: pointer;
    font-weight: 900;
    letter-spacing: 0.3px;
    white-space: nowrap;
  }
  .oo-chip:hover{ border-color: rgba(129,140,248,0.35); background: rgba(15,23,42,0.55); }
  .oo-chipOn{
    background: rgba(129,140,248,0.18);
    border-color: rgba(129,140,248,0.55);
    color: rgba(255,255,255,0.96);
  }

  .oo-row{
    width: 100%;
    display: flex;
    gap: 12px;
    padding: 12px 12px;
    align-items: center;
    background: transparent;
    color: rgba(255,255,255,0.94);
    cursor: pointer;
    border: none;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    transition: background 140ms ease;
  }
  .oo-row:hover{ background: rgba(255,255,255,0.04); }
  .oo-chev{
    color: rgba(148,163,184,0.85);
    font-weight: 900;
    font-size: 22px;
    padding: 0 6px;
  }

  .oo-link{
    background: rgba(2,6,23,0.35);
    border: 1px solid rgba(255,255,255,0.14);
    color: rgba(255,255,255,0.92);
    cursor: pointer;
    font-weight: 900;
    padding: 8px 12px;
    border-radius: 999px;
    letter-spacing: 0.4px;
    white-space: nowrap;
  }
  .oo-linkPrimary{
    border-color: rgba(56,189,248,0.35);
    background: rgba(56,189,248,0.14);
  }
  .oo-link:disabled{ opacity: 0.6; cursor: not-allowed; }

  @media (max-width: 760px){
    .oo-pill{ display:none; }
  }
  `;
}
