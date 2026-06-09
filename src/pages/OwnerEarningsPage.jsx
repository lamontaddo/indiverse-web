import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getProfileByKey } from "../services/profileRegistry";
import { ownerJsonWeb } from "../utils/ownerApi.web";

function normalizeProfileKey(pk) {
  return String(pk || "").trim().toLowerCase();
}

function hexToRgba(hex, a = 1) {
  const h = String(hex || "").replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (full.length !== 6) return `rgba(129,140,248,${a})`;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function formatMoney(value) {
  const num = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(num);
}

function centsToDollars(cents) {
  return Number((Number(cents || 0) / 100).toFixed(2));
}

function pickMoneyFromPossibleCents(dollarsValue, centsValue) {
  if (Number.isFinite(Number(dollarsValue))) return Number(dollarsValue);
  if (Number.isFinite(Number(centsValue))) return centsToDollars(centsValue);
  return 0;
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fallbackEmojiForSale(type) {
  if (type === "album") return "💿";
  if (type === "video") return "🎬";
  if (type === "product") return "🛍️";
  return "🎵";
}

function pickNumber(...values) {
  for (const value of values) {
    const num = Number(value);
    if (Number.isFinite(num)) return num;
  }
  return 0;
}

function normalizeSale(sale = {}) {
  return {
    ...sale,
    _id: sale._id || sale.id || `${sale.type || "sale"}-${sale.createdAt || Math.random()}`,
    amount: pickMoneyFromPossibleCents(
      sale.amount ?? sale.netAmount ?? sale.ownerNet ?? sale.netEarnings ?? sale.totalAmount ?? sale.price,
      sale.amountCents ??
        sale.netAmountCents ??
        sale.ownerNetCents ??
        sale.netEarningsCents ??
        sale.totalAmountCents ??
        sale.priceCents
    ),
    paymentProvider: String(sale.paymentProvider || sale.provider || "paypal").toLowerCase(),
    paymentStatus: String(sale.paymentStatus || sale.status || "paid").toLowerCase(),
    payoutStatus: String(sale.payoutStatus || "pending").toLowerCase(),
  };
}

export default function OwnerEarningsPage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const routeProfileKey = normalizeProfileKey(params?.profileKey);
  const stateProfileKey = normalizeProfileKey(location?.state?.profileKey);
  const storedProfileKey = normalizeProfileKey(localStorage.getItem("profileKey"));

  const profileKey = routeProfileKey || stateProfileKey || storedProfileKey || "";
  const profile = useMemo(() => (profileKey ? getProfileByKey(profileKey) : null), [profileKey]);

  const accent = profile?.accent || "#818cf8";
  const ownerName = profile?.label || "Owner";
  const ownerNameCaps = String(profile?.brandTopTitle || ownerName).toUpperCase();
  const bgUrl = location?.state?.bgUrl || null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalSales: 0,
    netEarnings: 0,
    pendingPayout: 0,
    paidOut: 0,
    paypalEmail: "",
    paypalPayoutEmail: "",
    payoutReady: false,
    recentSales: [],
  });

  const payoutEmail = summary.paypalPayoutEmail || summary.paypalEmail;
  const withdrawableAmount = Number(summary.pendingPayout || summary.netEarnings || 0);

  async function loadSummary() {
    if (!profileKey) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await ownerJsonWeb("/api/owner/earnings/summary", {
        method: "GET",
        profileKey,
      });

      const rawSummary = data?.summary || data || {};
      const recentSales = Array.isArray(rawSummary?.recentSales)
        ? rawSummary.recentSales.map(normalizeSale)
        : [];

      const paypalEmail = String(rawSummary?.paypalEmail || "").trim();
      const paypalPayoutEmail = String(rawSummary?.paypalPayoutEmail || "").trim();
      const payoutEmailFromSummary = paypalPayoutEmail || paypalEmail;

      setSummary({
        totalRevenue: pickMoneyFromPossibleCents(
          rawSummary?.totalRevenue ?? rawSummary?.grossRevenue ?? rawSummary?.grossEarnings,
          rawSummary?.totalRevenueCents ?? rawSummary?.grossRevenueCents ?? rawSummary?.grossEarningsCents
        ),
        totalSales: pickNumber(rawSummary?.totalSales, rawSummary?.salesCount, recentSales.length),
        netEarnings: pickMoneyFromPossibleCents(
          rawSummary?.netEarnings ?? rawSummary?.ownerNet ?? rawSummary?.availableBalance,
          rawSummary?.netEarningsCents ?? rawSummary?.ownerNetCents ?? rawSummary?.availableBalanceCents
        ),
        pendingPayout: pickMoneyFromPossibleCents(
          rawSummary?.pendingPayout ?? rawSummary?.pendingBalance ?? rawSummary?.unpaidEarnings,
          rawSummary?.pendingPayoutCents ?? rawSummary?.pendingBalanceCents ?? rawSummary?.unpaidEarningsCents
        ),
        paidOut: pickMoneyFromPossibleCents(
          rawSummary?.paidOut ?? rawSummary?.paidOutAmount ?? rawSummary?.totalPaidOut,
          rawSummary?.paidOutCents ?? rawSummary?.paidOutAmountCents ?? rawSummary?.totalPaidOutCents
        ),
        paypalEmail,
        paypalPayoutEmail,
        payoutReady: Boolean(rawSummary?.payoutReady ?? rawSummary?.canReceivePayouts ?? payoutEmailFromSummary),
        recentSales,
      });
    } catch (err) {
      setError(err?.message || "Unable to load earnings");
    } finally {
      setLoading(false);
    }
  }

  async function requestWithdrawal() {
    if (!profileKey || withdrawing) return;

    if (!payoutEmail) {
      setError("Add your PayPal payout email before requesting a withdrawal.");
      setSuccess("");
      return;
    }

    if (withdrawableAmount <= 0) {
      setError("No unpaid earnings are available for withdrawal yet.");
      setSuccess("");
      return;
    }

    setWithdrawing(true);
    setError("");
    setSuccess("");

    try {
      const data = await ownerJsonWeb("/api/owner/withdrawals", {
        method: "POST",
        profileKey,
      });

      const withdrawal = data?.withdrawal || data || {};
      const requestedAmount = withdrawal?.amount || withdrawal?.netAmount || withdrawableAmount;

      setSuccess(
        `Withdrawal requested for ${formatMoney(requestedAmount)}. Admin will process it manually.`
      );

      await loadSummary();
    } catch (err) {
      setError(err?.message || "Unable to request withdrawal");
    } finally {
      setWithdrawing(false);
    }
  }

  useEffect(() => {
    loadSummary();
  }, [profileKey]);

  const goBackHome = () => {
    if (!profileKey) return navigate("/", { replace: false });
    navigate(`/world/${encodeURIComponent(profileKey)}/owner/home`, {
      state: { profileKey, bgUrl },
    });
  };

  return (
    <div style={styles.page}>
      <style>{css(accent)}</style>

      <div style={{ ...styles.glowOne, background: hexToRgba(accent, 0.32) }} />
      <div style={styles.glowTwo} />
      <div style={styles.grid} />

      <div style={styles.headerWrap}>
        <div>
          <div style={styles.title}>{ownerNameCaps}</div>
          <div style={styles.subtitle}>Earnings</div>
        </div>

        <div style={styles.headerActions}>
          <button className="oe-pill" onClick={loadSummary} disabled={loading || withdrawing}>
            Refresh
          </button>

          <button
            className="oe-pill oe-primary"
            onClick={requestWithdrawal}
            disabled={loading || withdrawing || !summary.payoutReady || withdrawableAmount <= 0}
          >
            {withdrawing ? "Requesting…" : "Request Withdrawal"}
          </button>

          <button className="oe-pill" onClick={goBackHome}>
            Back to Owner Home
          </button>
        </div>
      </div>

      {!profileKey ? (
        <div style={styles.noticeBox}>
          <div style={styles.noticeTitle}>Missing profileKey</div>
          <div style={styles.noticeText}>
            Open this page as: /world/&lt;profileKey&gt;/owner/earnings
          </div>
        </div>
      ) : null}

      {error ? (
        <div style={styles.errorBox}>
          <div style={styles.errorTitle}>Could not load earnings</div>
          <div style={styles.errorText}>{error}</div>
        </div>
      ) : null}

      {success ? (
        <div style={styles.successBox}>
          <div style={styles.successTitle}>Withdrawal requested</div>
          <div style={styles.successText}>{success}</div>
        </div>
      ) : null}

      <div style={styles.cardsRow}>
        <div className="oe-card">
          <div className="oe-cardLabel">Total Revenue</div>
          <div className="oe-cardValue">
            {loading ? "—" : formatMoney(summary.totalRevenue)}
          </div>
        </div>

        <div className="oe-card">
          <div className="oe-cardLabel">Net Earnings</div>
          <div className="oe-cardValue">
            {loading ? "—" : formatMoney(summary.netEarnings)}
          </div>
        </div>

        <div className="oe-card">
          <div className="oe-cardLabel">Pending Payout</div>
          <div className="oe-cardValue">
            {loading ? "—" : formatMoney(withdrawableAmount)}
          </div>
        </div>

        <div className="oe-card">
          <div className="oe-cardLabel">Paid Out</div>
          <div className="oe-cardValue">
            {loading ? "—" : formatMoney(summary.paidOut)}
          </div>
        </div>

        <div className="oe-card">
          <div className="oe-cardLabel">Total Sales</div>
          <div className="oe-cardValue">
            {loading ? "—" : summary.totalSales}
          </div>
        </div>

        <div className="oe-card">
          <div className="oe-cardLabel">PayPal Payout</div>
          <div className="oe-cardValue oe-cardValueSmall">
            {loading ? "—" : payoutEmail || "Not set"}
          </div>
          {!loading ? (
            <div className={summary.payoutReady ? "oe-statusGood" : "oe-statusWarn"}>
              {summary.payoutReady ? "Ready for payouts" : "Add PayPal email on Payment Info"}
            </div>
          ) : null}
        </div>
      </div>

      <div className="oe-panel">
        <div style={styles.panelHeader}>
          <div>
            <div style={styles.panelTitle}>Recent Sales</div>
            <div style={styles.panelSubtext}>Latest creator sales activity</div>
          </div>
        </div>

        {loading ? (
          <div style={styles.emptyState}>Loading earnings…</div>
        ) : summary.recentSales.length === 0 ? (
          <div style={styles.emptyState}>No sales to show yet.</div>
        ) : (
          <div style={styles.salesList}>
            {summary.recentSales.map((sale) => (
              <div key={sale._id} className="oe-saleRow">
                <div style={styles.saleLeft}>
                  {sale.coverImageUrl ? (
                    <img
                      src={sale.coverImageUrl}
                      alt={sale.title || "Sale cover"}
                      style={styles.saleImage}
                    />
                  ) : (
                    <div style={styles.saleFallback}>{fallbackEmojiForSale(sale.type)}</div>
                  )}
                </div>

                <div style={styles.saleCenter}>
                  <div style={styles.saleTitle}>{sale.title || "Untitled"}</div>
                  <div style={styles.saleMeta}>
                    {(sale.typeLabel || "Sale")} • {(sale.subtitle || "—")} • {formatDate(sale.createdAt)}
                  </div>
                  <div style={styles.saleMetaTiny}>
                    {sale.paymentProvider.toUpperCase()} • {sale.paymentStatus || "paid"} • payout{" "}
                    {sale.payoutStatus || "pending"}
                  </div>
                </div>

                <div style={styles.saleAmount}>{formatMoney(sale.amount)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #020617, #0b1220)",
    color: "#e5e7eb",
    overflow: "hidden",
    position: "relative",
    paddingBottom: 40,
  },
  glowOne: {
    position: "fixed",
    width: 360,
    height: 360,
    borderRadius: 999,
    top: -120,
    right: -140,
    filter: "blur(90px)",
    opacity: 0.7,
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
    opacity: 0.6,
    pointerEvents: "none",
    zIndex: 0,
  },
  grid: {
    position: "fixed",
    inset: 0,
    backgroundImage:
      "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.10) 1px, rgba(0,0,0,0) 0)",
    backgroundSize: "26px 26px",
    maskImage: "radial-gradient(circle at 50% 15%, rgba(0,0,0,0.9), rgba(0,0,0,0) 62%)",
    WebkitMaskImage: "radial-gradient(circle at 50% 15%, rgba(0,0,0,0.9), rgba(0,0,0,0) 62%)",
    pointerEvents: "none",
    zIndex: 0,
    opacity: 0.8,
  },
  headerWrap: {
    position: "relative",
    zIndex: 2,
    padding: "34px 22px 16px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  title: {
    fontSize: 32,
    fontWeight: 900,
    letterSpacing: 4,
    textShadow: "0 18px 48px rgba(0,0,0,0.55)",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 12,
    letterSpacing: 1,
    color: "#9ca3af",
    textTransform: "uppercase",
  },
  noticeBox: {
    position: "relative",
    zIndex: 2,
    margin: "0 22px 14px",
    padding: 12,
    borderRadius: 16,
    border: "1px solid rgba(248,113,113,0.7)",
    background: "rgba(248,113,113,0.08)",
  },
  noticeTitle: {
    color: "#fecaca",
    fontWeight: 900,
    fontSize: 13,
  },
  noticeText: {
    marginTop: 6,
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: 700,
  },
  errorBox: {
    position: "relative",
    zIndex: 2,
    margin: "0 22px 14px",
    padding: 14,
    borderRadius: 16,
    border: "1px solid rgba(252,165,165,0.55)",
    background: "rgba(127,29,29,0.18)",
  },
  errorTitle: {
    color: "#fecaca",
    fontSize: 13,
    fontWeight: 900,
  },
  errorText: {
    color: "rgba(255,255,255,0.82)",
    marginTop: 6,
    fontSize: 13,
  },
  successBox: {
    position: "relative",
    zIndex: 2,
    margin: "0 22px 14px",
    padding: 14,
    borderRadius: 16,
    border: "1px solid rgba(134,239,172,0.55)",
    background: "rgba(20,83,45,0.18)",
  },
  successTitle: {
    color: "#bbf7d0",
    fontSize: 13,
    fontWeight: 900,
  },
  successText: {
    color: "rgba(255,255,255,0.82)",
    marginTop: 6,
    fontSize: 13,
  },
  cardsRow: {
    position: "relative",
    zIndex: 2,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    padding: "0 22px",
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: 0.5,
  },
  panelSubtext: {
    marginTop: 4,
    fontSize: 12,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  emptyState: {
    padding: "22px 10px",
    color: "rgba(226,232,240,0.72)",
    fontSize: 14,
    textAlign: "center",
  },
  salesList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  saleLeft: {
    flexShrink: 0,
  },
  saleImage: {
    width: 58,
    height: 58,
    borderRadius: 14,
    objectFit: "cover",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  saleFallback: {
    width: 58,
    height: 58,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(30,41,59,0.9)",
    border: "1px solid rgba(255,255,255,0.10)",
    fontSize: 24,
  },
  saleCenter: {
    flex: 1,
    minWidth: 0,
  },
  saleTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: "#f8fafc",
  },
  saleMeta: {
    marginTop: 6,
    fontSize: 12,
    color: "#94a3b8",
  },
  saleMetaTiny: {
    marginTop: 5,
    fontSize: 11,
    color: "rgba(148,163,184,0.72)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  saleAmount: {
    flexShrink: 0,
    fontSize: 15,
    fontWeight: 900,
    color: "#e5e7eb",
  },
};

function css(accent) {
  return `
  * { box-sizing: border-box; }
  button { font-family: inherit; }

  .oe-pill{
    height: 40px;
    border-radius: 999px;
    padding: 0 14px;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(2,6,23,0.45);
    color: rgba(255,255,255,0.92);
    font-weight: 900;
    letter-spacing: 0.6px;
    cursor: pointer;
    display:flex;
    align-items:center;
    gap: 10px;
    backdrop-filter: blur(10px);
    box-shadow: 0 18px 42px rgba(0,0,0,0.35);
    transition: transform 140ms ease, border-color 140ms ease, background 140ms ease;
    user-select: none;
    text-transform: uppercase;
    font-size: 11px;
  }

  .oe-primary{
    border-color: ${hexToRgba(accent, 0.75)};
    background: linear-gradient(135deg, ${hexToRgba(accent, 0.72)}, rgba(15,23,42,0.70));
  }

  .oe-pill:hover{
    transform: translateY(-1px);
    border-color: ${hexToRgba(accent, 0.65)};
    background: rgba(15,23,42,0.55);
  }

  .oe-pill:disabled{
    opacity: 0.55;
    cursor: not-allowed;
  }

  .oe-card{
    border-radius: 24px;
    background: rgba(15,23,42,0.66);
    border: 1px solid rgba(255,255,255,0.10);
    box-shadow: 0 18px 42px rgba(0,0,0,0.42);
    padding: 22px;
    min-height: 130px;
    position: relative;
    overflow: hidden;
  }

  .oe-card:before{
    content:'';
    position:absolute;
    inset:0;
    background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.10), rgba(255,255,255,0.03) 55%, rgba(0,0,0,0) 70%);
    opacity: 0.85;
    pointer-events:none;
  }

  .oe-cardLabel{
    position: relative;
    z-index: 1;
    font-size: 12px;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-weight: 800;
  }

  .oe-cardValue{
    position: relative;
    z-index: 1;
    margin-top: 16px;
    font-size: 34px;
    line-height: 1.1;
    font-weight: 900;
    color: #f8fafc;
    text-shadow: 0 10px 28px rgba(0,0,0,0.4);
    word-break: break-word;
  }

  .oe-cardValueSmall{
    font-size: 18px;
    line-height: 1.35;
  }

  .oe-statusGood,
  .oe-statusWarn{
    position: relative;
    z-index: 1;
    margin-top: 12px;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.7px;
    text-transform: uppercase;
  }

  .oe-statusGood{
    color: #86efac;
  }

  .oe-statusWarn{
    color: #fbbf24;
  }

  .oe-panel{
    position: relative;
    z-index: 2;
    margin: 18px 22px 0;
    border-radius: 24px;
    background: rgba(15,23,42,0.66);
    border: 1px solid rgba(255,255,255,0.10);
    box-shadow: 0 18px 42px rgba(0,0,0,0.42);
    padding: 20px;
  }

  .oe-saleRow{
    display:flex;
    align-items:center;
    gap: 14px;
    padding: 12px;
    border-radius: 18px;
    background: rgba(2,6,23,0.42);
    border: 1px solid rgba(255,255,255,0.06);
  }

  @media (max-width: 640px){
    .oe-cardValue{
      font-size: 28px;
    }

    .oe-cardValueSmall{
      font-size: 16px;
    }

    .oe-saleRow{
      align-items:flex-start;
      flex-direction: column;
    }

    .oe-saleRow > div:last-child{
      align-self: flex-end;
    }
  }
  `;
}