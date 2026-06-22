import React, { useEffect, useMemo, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.trim() || "https://indiverse-backend.onrender.com";

const STATUS_OPTIONS = ["all", "pending", "processing", "paid", "cancelled", "failed"];

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
}

function fmtDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function normalizeStatus(value) {
  return String(value || "pending").trim().toLowerCase();
}

function formatPayoutMethod(value) {
  const method = String(value || "").trim().toLowerCase();

  const labels = {
    paypal: "PayPal",
    zelle: "Zelle",
    cashapp: "Cash App",
    cash_app: "Cash App",
    venmo: "Venmo",
    apple_cash: "Apple Cash",
    applecash: "Apple Cash",
    chime: "Chime",
    bank: "Bank Transfer",
    manual: "Manual Payout",
    other: "Other",
  };

  return labels[method] || (value ? String(value) : "Not specified");
}

function statusStyle(status) {
  const s = normalizeStatus(status);

  if (s === "paid") return { ...styles.badge, ...styles.badgePaid };
  if (s === "pending") return { ...styles.badge, ...styles.badgePending };
  if (s === "processing") return { ...styles.badge, ...styles.badgeProcessing };
  if (s === "failed" || s === "cancelled") return { ...styles.badge, ...styles.badgeDanger };

  return styles.badge;
}

export default function AdminWithdrawalsPage() {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem("indiverseAdminToken") || "");
  const [profileKey, setProfileKey] = useState(() => localStorage.getItem("adminWithdrawalsProfileKey") || "olori");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [data, setData] = useState({ summary: null, withdrawals: [] });

  const cleanProfileKey = profileKey.trim().toLowerCase();
  const canLoad = adminToken.trim().length > 0;

  const queryPath = useMemo(() => {
    const params = new URLSearchParams();
    if (cleanProfileKey) params.set("profileKey", cleanProfileKey);
    if (status && status !== "all") params.set("status", status);
    return `/api/admin/withdrawals?${params.toString()}`;
  }, [cleanProfileKey, status]);

  async function adminFetch(path, options = {}) {
    const token = adminToken.trim();

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-admin-token": token,
        "x-profile-key": cleanProfileKey || "olori",
        ...(options.headers || {}),
      },
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || json?.ok === false) {
      throw new Error(json?.error || `Request failed (${res.status})`);
    }

    return json;
  }

  async function loadWithdrawals() {
    if (!canLoad) {
      setError("Enter your admin token first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setNotice("");

      localStorage.setItem("indiverseAdminToken", adminToken.trim());
      localStorage.setItem("adminWithdrawalsProfileKey", cleanProfileKey || "olori");

      const json = await adminFetch(queryPath);

      setData({
        summary: json.summary || null,
        withdrawals: Array.isArray(json.withdrawals) ? json.withdrawals : [],
      });
    } catch (err) {
      setError(err?.message || "Failed to load withdrawals");
      setData({ summary: null, withdrawals: [] });
    } finally {
      setLoading(false);
    }
  }

  async function rejectWithdrawal(id) {
    const reason = window.prompt("Reason for rejection?", "Rejected by admin");
    if (reason === null) return;

    try {
      setActionId(id);
      setError("");
      setNotice("");

      await adminFetch(`/api/admin/withdrawals/${id}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });

      setNotice("Withdrawal rejected.");
      await loadWithdrawals();
    } catch (err) {
      setError(err?.message || "Failed to reject withdrawal");
    } finally {
      setActionId("");
    }
  }

  async function processWithdrawal(id) {
    const ref = window.prompt("Manual payout reference / transaction note?", "manual-payout");
    if (ref === null) return;

    const ok = window.confirm("Mark this withdrawal as PAID? Only do this after you have sent the manual payout.");
    if (!ok) return;

    try {
      setActionId(id);
      setError("");
      setNotice("");

      await adminFetch(`/api/admin/withdrawals/${id}/process`, {
        method: "POST",
        body: JSON.stringify({ manualReference: ref }),
      });

      setNotice("Withdrawal marked paid.");
      await loadWithdrawals();
    } catch (err) {
      setError(err?.message || "Failed to process withdrawal");
    } finally {
      setActionId("");
    }
  }

  useEffect(() => {
    if (canLoad) loadWithdrawals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summary = data.summary || {};
  const withdrawals = data.withdrawals || [];

  return (
    <div style={styles.page}>
      <div style={styles.bgGlowOne} />
      <div style={styles.bgGlowTwo} />

      <main style={styles.shell}>
        <section style={styles.hero}>
          <div>
            <div style={styles.kicker}>IndiVerse Admin</div>
            <h1 style={styles.title}>Withdrawal Queue</h1>
            <p style={styles.subtitle}>
              Review creator withdrawal requests, verify payout details, and mark manual payouts as paid.
            </p>
          </div>

          <button style={styles.primaryButton} onClick={loadWithdrawals} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh Queue"}
          </button>
        </section>

        <section style={styles.controls}>
          <label style={styles.field}>
            <span style={styles.label}>Admin Token</span>
            <input
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              placeholder="Admin token"
              type="password"
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Profile Key</span>
            <input
              value={profileKey}
              onChange={(e) => setProfileKey(e.target.value)}
              placeholder="olori"
              style={styles.input}
            />
          </label>

          <label style={styles.field}>
            <span style={styles.label}>Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.input}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s[0].toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </section>

        {error ? <div style={styles.error}>{error}</div> : null}
        {notice ? <div style={styles.notice}>{notice}</div> : null}

        <section style={styles.cards}>
          <div style={styles.card}>
            <div style={styles.cardLabel}>Total Requests</div>
            <div style={styles.cardValue}>{summary.count ?? withdrawals.length}</div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardLabel}>Total Amount</div>
            <div style={styles.cardValue}>{money(summary.totalAmount)}</div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardLabel}>Pending</div>
            <div style={styles.cardValue}>{money(summary.pendingAmount)}</div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardLabel}>Paid</div>
            <div style={styles.cardValue}>{money(summary.paidAmount)}</div>
          </div>
        </section>

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <div style={styles.panelTitle}>Requests</div>
              <div style={styles.panelSub}>
                {cleanProfileKey ? `Filtered by ${cleanProfileKey}` : "All profiles"} · {status}
              </div>
            </div>
          </div>

          {loading ? (
            <div style={styles.empty}>Loading withdrawals…</div>
          ) : withdrawals.length === 0 ? (
            <div style={styles.empty}>No withdrawals found.</div>
          ) : (
            <div style={styles.list}>
              {withdrawals.map((w) => {
                const isPending = normalizeStatus(w.status) === "pending";
                const busy = actionId === w._id;
                const payoutMethod = formatPayoutMethod(w.payoutMethod || w.method || w.type || w.provider);
                const payoutInfo = w.paypalEmail || w.payoutHandle || w.payoutEmail || w.accountHandle || "—";
                const reference = w.paypalTransactionId || w.manualReference || w.reference || "";

                return (
                  <article key={w._id} style={styles.row}>
                    <div style={styles.rowTop}>
                      <div>
                        <div style={styles.rowTitle}>
                          {w.profileKey || "—"} · {money(w.amount)} · {payoutMethod}
                        </div>
                        <div style={styles.rowSub}>
                          Revenue {money(w.totalRevenue)} · Platform Fee {money(w.platformFee)}
                        </div>
                      </div>

                      <span style={statusStyle(w.status)}>{normalizeStatus(w.status)}</span>
                    </div>

                    <div style={styles.detailsGrid}>
                      <div style={styles.detail}>
                        <span style={styles.detailLabel}>Payout Type</span>
                        <span style={styles.detailValue}>{payoutMethod}</span>
                      </div>

                      <div style={styles.detail}>
                        <span style={styles.detailLabel}>Payout Info</span>
                        <span style={styles.detailValue}>{payoutInfo}</span>
                      </div>

                      <div style={styles.detail}>
                        <span style={styles.detailLabel}>Requested</span>
                        <span style={styles.detailValue}>{fmtDate(w.requestedAt || w.createdAt)}</span>
                      </div>

                      <div style={styles.detail}>
                        <span style={styles.detailLabel}>Processed</span>
                        <span style={styles.detailValue}>{fmtDate(w.processedAt)}</span>
                      </div>

                      <div style={styles.detail}>
                        <span style={styles.detailLabel}>Sources</span>
                        <span style={styles.detailValue}>
                          Music {w.sourceSummary?.musicCount || 0} · Videos {w.sourceSummary?.videoCount || 0} · Products{" "}
                          {w.sourceSummary?.productCount || 0}
                        </span>
                      </div>
                    </div>

                    {reference ? <div style={styles.smallNote}>Reference: {reference}</div> : null}
                    {w.failureReason ? <div style={styles.failure}>Reason: {w.failureReason}</div> : null}

                    <div style={styles.actions}>
                      <button
                        style={{
                          ...styles.actionButton,
                          ...(isPending ? styles.actionPrimary : styles.actionDisabled),
                        }}
                        disabled={!isPending || busy}
                        onClick={() => processWithdrawal(w._id)}
                      >
                        {busy ? "Working…" : "Mark Paid"}
                      </button>

                      <button
                        style={{
                          ...styles.actionButton,
                          ...styles.actionDanger,
                          ...(!isPending ? styles.actionDisabled : {}),
                        }}
                        disabled={!isPending || busy}
                        onClick={() => rejectWithdrawal(w._id)}
                      >
                        Reject
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #020617, #07111f)",
    color: "#e5e7eb",
    fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
    position: "relative",
    overflowX: "hidden",
  },
  bgGlowOne: {
    position: "fixed",
    width: 440,
    height: 440,
    borderRadius: 999,
    top: -160,
    right: -150,
    background: "rgba(56,189,248,0.18)",
    filter: "blur(90px)",
    pointerEvents: "none",
  },
  bgGlowTwo: {
    position: "fixed",
    width: 420,
    height: 420,
    borderRadius: 999,
    bottom: -180,
    left: -150,
    background: "rgba(168,85,247,0.16)",
    filter: "blur(90px)",
    pointerEvents: "none",
  },
  shell: {
    width: "min(1180px, calc(100% - 32px))",
    margin: "0 auto",
    padding: "30px 0 44px",
    position: "relative",
    zIndex: 2,
  },
  hero: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    alignItems: "flex-end",
    flexWrap: "wrap",
    marginBottom: 22,
  },
  kicker: {
    color: "#38bdf8",
    fontSize: 12,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  title: {
    margin: "8px 0 0",
    fontSize: "clamp(34px, 6vw, 58px)",
    lineHeight: 0.95,
    fontWeight: 950,
    letterSpacing: -1.6,
  },
  subtitle: {
    maxWidth: 620,
    margin: "12px 0 0",
    color: "#94a3b8",
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: 700,
  },
  primaryButton: {
    height: 44,
    borderRadius: 999,
    border: "1px solid rgba(56,189,248,0.35)",
    background: "rgba(56,189,248,0.14)",
    color: "#e0f2fe",
    padding: "0 18px",
    cursor: "pointer",
    fontWeight: 950,
    boxShadow: "0 18px 44px rgba(0,0,0,0.34)",
  },
  controls: {
    display: "grid",
    gridTemplateColumns: "minmax(220px, 1fr) minmax(160px, 220px) minmax(140px, 180px)",
    gap: 12,
    marginBottom: 16,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    color: "#94a3b8",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: 900,
  },
  input: {
    height: 46,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.13)",
    background: "rgba(15,23,42,0.76)",
    color: "#fff",
    padding: "0 13px",
    fontWeight: 800,
    outline: "none",
  },
  error: {
    marginTop: 14,
    padding: 13,
    borderRadius: 16,
    background: "rgba(127,29,29,0.35)",
    color: "#fecaca",
    border: "1px solid rgba(248,113,113,0.30)",
    fontWeight: 800,
  },
  notice: {
    marginTop: 14,
    padding: 13,
    borderRadius: 16,
    background: "rgba(20,83,45,0.28)",
    color: "#bbf7d0",
    border: "1px solid rgba(134,239,172,0.26)",
    fontWeight: 800,
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 12,
    marginTop: 18,
  },
  card: {
    padding: 18,
    borderRadius: 20,
    background: "rgba(15,23,42,0.68)",
    border: "1px solid rgba(255,255,255,0.09)",
    boxShadow: "0 18px 44px rgba(0,0,0,0.28)",
  },
  cardLabel: {
    color: "#94a3b8",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: 900,
  },
  cardValue: {
    marginTop: 10,
    fontSize: 26,
    fontWeight: 950,
    color: "#f8fafc",
  },
  panel: {
    marginTop: 16,
    borderRadius: 24,
    background: "rgba(15,23,42,0.68)",
    border: "1px solid rgba(255,255,255,0.09)",
    boxShadow: "0 22px 60px rgba(0,0,0,0.36)",
    overflow: "hidden",
  },
  panelHeader: {
    padding: 18,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 950,
  },
  panelSub: {
    marginTop: 5,
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: 14,
  },
  row: {
    borderRadius: 20,
    background: "rgba(2,6,23,0.45)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: 16,
  },
  rowTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: 950,
    lineHeight: 1.25,
  },
  rowSub: {
    marginTop: 5,
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 800,
  },
  badge: {
    padding: "7px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "#e5e7eb",
    fontSize: 11,
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  badgePending: {
    borderColor: "rgba(251,191,36,0.28)",
    background: "rgba(251,191,36,0.10)",
    color: "#fde68a",
  },
  badgeProcessing: {
    borderColor: "rgba(56,189,248,0.28)",
    background: "rgba(56,189,248,0.10)",
    color: "#bae6fd",
  },
  badgePaid: {
    borderColor: "rgba(134,239,172,0.28)",
    background: "rgba(134,239,172,0.10)",
    color: "#bbf7d0",
  },
  badgeDanger: {
    borderColor: "rgba(248,113,113,0.28)",
    background: "rgba(248,113,113,0.10)",
    color: "#fecaca",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 10,
    marginTop: 14,
  },
  detail: {
    padding: 12,
    borderRadius: 16,
    background: "rgba(15,23,42,0.54)",
    border: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  detailLabel: {
    color: "#64748b",
    fontSize: 10,
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  detailValue: {
    color: "#e5e7eb",
    fontSize: 13,
    fontWeight: 850,
    wordBreak: "break-word",
  },
  smallNote: {
    marginTop: 12,
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 800,
  },
  failure: {
    marginTop: 12,
    color: "#fecaca",
    fontSize: 12,
    fontWeight: 900,
  },
  actions: {
    display: "flex",
    gap: 10,
    marginTop: 14,
    flexWrap: "wrap",
  },
  actionButton: {
    height: 40,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(30,41,59,0.9)",
    color: "#fff",
    padding: "0 14px",
    cursor: "pointer",
    fontWeight: 950,
  },
  actionPrimary: {
    borderColor: "rgba(134,239,172,0.28)",
    background: "rgba(22,101,52,0.38)",
  },
  actionDanger: {
    borderColor: "rgba(248,113,113,0.28)",
    background: "rgba(127,29,29,0.48)",
  },
  actionDisabled: {
    opacity: 0.45,
    cursor: "not-allowed",
  },
  empty: {
    padding: 28,
    color: "#94a3b8",
    textAlign: "center",
    fontWeight: 800,
  },
};
