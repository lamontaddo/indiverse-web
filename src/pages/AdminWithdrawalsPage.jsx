import React, { useEffect, useMemo, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.trim() || "https://indiverse-backend.onrender.com";

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
  return d.toLocaleString();
}

export default function AdminWithdrawalsPage() {
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem("indiverseAdminToken") || "");
  const [profileKey, setProfileKey] = useState("lamont");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState({ summary: null, withdrawals: [] });

  const canLoad = adminToken.trim().length > 0;

  const url = useMemo(() => {
    const params = new URLSearchParams();
    if (profileKey.trim()) params.set("profileKey", profileKey.trim().toLowerCase());
    if (status && status !== "all") params.set("status", status);
    return `${API_BASE}/api/admin/withdrawals?${params.toString()}`;
  }, [profileKey, status]);

  async function adminFetch(path, options = {}) {
    const token = adminToken.trim();

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-admin-token": token,
        "x-profile-key": profileKey.trim().toLowerCase() || "lamont",
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
      localStorage.setItem("indiverseAdminToken", adminToken.trim());

      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "x-admin-token": adminToken.trim(),
          "x-profile-key": profileKey.trim().toLowerCase() || "lamont",
        },
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || json?.ok === false) {
        throw new Error(json?.error || `Failed to load withdrawals (${res.status})`);
      }

      setData({
        summary: json.summary || null,
        withdrawals: Array.isArray(json.withdrawals) ? json.withdrawals : [],
      });
    } catch (err) {
      setError(err?.message || "Failed to load withdrawals");
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

      await adminFetch(`/api/admin/withdrawals/${id}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });

      await loadWithdrawals();
    } catch (err) {
      setError(err?.message || "Failed to reject withdrawal");
    } finally {
      setActionId("");
    }
  }

  async function processWithdrawal(id) {
    const ref = window.prompt("Manual PayPal reference / transaction note?", "manual-paypal-payout");
    if (ref === null) return;

    const ok = window.confirm("Mark this withdrawal as PAID? Only do this after sending PayPal.");
    if (!ok) return;

    try {
      setActionId(id);
      setError("");

      await adminFetch(`/api/admin/withdrawals/${id}/process`, {
        method: "POST",
        body: JSON.stringify({ manualReference: ref }),
      });

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

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>Admin Withdrawals</div>
          <div style={styles.subtitle}>Process creator PayPal withdrawal requests</div>
        </div>

        <button style={styles.button} onClick={loadWithdrawals} disabled={loading}>
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      <div style={styles.controls}>
        <input
          value={adminToken}
          onChange={(e) => setAdminToken(e.target.value)}
          placeholder="Admin token"
          type="password"
          style={styles.input}
        />

        <input
          value={profileKey}
          onChange={(e) => setProfileKey(e.target.value)}
          placeholder="profileKey"
          style={styles.input}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.input}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {error ? <div style={styles.error}>{error}</div> : null}

      {data.summary ? (
        <div style={styles.cards}>
          <div style={styles.card}>Total: {money(data.summary.totalAmount)}</div>
          <div style={styles.card}>Pending: {money(data.summary.pendingAmount)}</div>
          <div style={styles.card}>Paid: {money(data.summary.paidAmount)}</div>
          <div style={styles.card}>Cancelled: {money(data.summary.cancelledAmount)}</div>
        </div>
      ) : null}

      <div style={styles.panel}>
        {data.withdrawals.length === 0 ? (
          <div style={styles.empty}>No withdrawals found.</div>
        ) : (
          data.withdrawals.map((w) => (
            <div key={w._id} style={styles.row}>
              <div style={styles.main}>
                <div style={styles.rowTitle}>
                  {w.profileKey} · {money(w.amount)}
                </div>
                <div style={styles.meta}>PayPal: {w.paypalEmail || "—"}</div>
                <div style={styles.meta}>Status: {w.status}</div>
                <div style={styles.meta}>Requested: {fmtDate(w.requestedAt)}</div>
                <div style={styles.meta}>Processed: {fmtDate(w.processedAt)}</div>
                {w.paypalTransactionId ? <div style={styles.meta}>Reference: {w.paypalTransactionId}</div> : null}
                {w.failureReason ? <div style={styles.meta}>Reason: {w.failureReason}</div> : null}
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.button}
                  disabled={w.status !== "pending" || actionId === w._id}
                  onClick={() => processWithdrawal(w._id)}
                >
                  Mark Paid
                </button>

                <button
                  style={{ ...styles.button, ...styles.danger }}
                  disabled={w.status !== "pending" || actionId === w._id}
                  onClick={() => rejectWithdrawal(w._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#020617",
    color: "#e5e7eb",
    padding: 24,
    fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "center",
    flexWrap: "wrap",
  },
  title: {
    fontSize: 30,
    fontWeight: 900,
  },
  subtitle: {
    marginTop: 6,
    color: "#94a3b8",
    fontSize: 13,
  },
  controls: {
    display: "grid",
    gridTemplateColumns: "minmax(220px, 1fr) 180px 160px",
    gap: 12,
    marginTop: 22,
  },
  input: {
    height: 42,
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(15,23,42,0.85)",
    color: "#fff",
    padding: "0 12px",
    fontWeight: 700,
  },
  button: {
    height: 40,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(30,41,59,0.9)",
    color: "#fff",
    padding: "0 14px",
    cursor: "pointer",
    fontWeight: 900,
  },
  danger: {
    background: "rgba(127,29,29,0.65)",
  },
  error: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    background: "rgba(127,29,29,0.35)",
    color: "#fecaca",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
    marginTop: 18,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    background: "rgba(15,23,42,0.85)",
    border: "1px solid rgba(255,255,255,0.09)",
    fontWeight: 900,
  },
  panel: {
    marginTop: 18,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    padding: 16,
    borderRadius: 18,
    background: "rgba(15,23,42,0.85)",
    border: "1px solid rgba(255,255,255,0.09)",
    flexWrap: "wrap",
  },
  main: {
    minWidth: 260,
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: 900,
  },
  meta: {
    marginTop: 5,
    color: "#94a3b8",
    fontSize: 13,
  },
  actions: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
  },
  empty: {
    padding: 20,
    color: "#94a3b8",
    textAlign: "center",
  },
};