// src/pages/OwnerHomePage.jsx ✅ FULL DROP-IN (Web)
// Route: /world/:profileKey/owner/home
//
// ✅ Keeps owner PayPal payout info modal
// ✅ Hydrates saved PayPal email on dashboard load and modal open
// ✅ Moves Payment Info + Withdraw into compact payout tabs
// ✅ Keeps Earnings as a dashboard tile
// ✅ Routes Earnings tile to /world/:profileKey/owner/earnings

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getProfileByKey } from "../services/profileRegistry";
import { ownerJsonWeb } from "../utils/ownerApi.web";

const SPEED = 0.55;
const AMP_BOOST = 1.1;

const FALLBACK_OWNER_ITEMS = [
  { key: "earnings", label: "Earnings", ionicon: "cash", to: "ownerearnings", size: 136 },
  { key: "about", label: "About", ionicon: "person-circle", to: "ownerabout", size: 136 },
  { key: "contacts", label: "Contacts", ionicon: "people", to: "ownercontacts", size: 136 },
  { key: "messages", label: "Messages", ionicon: "chatbubbles", to: "ownermessages", size: 136 },
  { key: "playlist", label: "Playlist", ionicon: "list", to: "ownerplaylist", size: 136 },
  { key: "music", label: "Music", ionicon: "musical-notes", to: "ownermusic", size: 136 },
  { key: "flowerorders", label: "Flower Orders", ionicon: "rose", to: "ownerconsultation", size: 136 },
  { key: "products", label: "Products", ionicon: "cart", to: "ownerproducts", size: 136 },
  { key: "portfolio", label: "Portfolio", ionicon: "images", to: "ownerportfolio", size: 136 },
  { key: "fashion", label: "Fashion", ionicon: "shirt", to: "ownerfashion", size: 136 },
  { key: "videos", label: "Videos", ionicon: "videocam", to: "ownervideos", size: 136 },
];

function normalizeProfileKey(pk) {
  return String(pk || "").trim().toLowerCase();
}

function normalizeOwnerItems(profile) {
  const raw =
    Array.isArray(profile?.ownerItems) && profile.ownerItems.length
      ? profile.ownerItems
      : FALLBACK_OWNER_ITEMS;

  return raw.map((it, idx) => ({
    key: String(it.key ?? `owner-${idx}`),
    label: String(it.label ?? it.key ?? "Item"),
    ionicon: it.ionicon || it.icon || "ellipse",
    to: String(it.to ?? it.key ?? ""),
    size: Math.min(Number(it.size ?? 136), 142),
    params: it.params || null,
  }));
}

function ionToEmoji(name = "", tile = null) {
  const k = String(name).toLowerCase();
  const key = String(tile?.key || "").toLowerCase();
  const to = String(tile?.to || "").toLowerCase();
  const label = String(tile?.label || "").toLowerCase();

  if (key === "messages" || to.includes("messages") || label === "messages") return "🗨️";
  if (key === "flowerorders" || to.includes("consultation") || to.includes("flowerorders") || label.includes("flower")) return "🌹";
  if (key === "stripepayouts") return "💳";
  if (key === "withdraw" || to.includes("withdraw") || label.includes("withdraw")) return "🏦";
  if (key === "earnings" || to.includes("earnings") || label.includes("earning")) return "💸";

  if (k.includes("person")) return "👤";
  if (k.includes("people") || k.includes("contacts") || k.includes("users")) return "👥";
  if (k.includes("call") || k.includes("phone")) return "📞";
  if (k.includes("mail") || k.includes("email")) return "✉️";
  if (k.includes("chat") || k.includes("message")) return "💬";
  if (k.includes("list")) return "📃";
  if (k.includes("music") || k.includes("musical")) return "🎵";
  if (k.includes("shirt")) return "👕";
  if (k.includes("video") || k.includes("videocam")) return "🎬";
  if (k.includes("images") || k.includes("image") || k.includes("camera")) return "🖼️";
  if (k.includes("cart") || k.includes("bag")) return "🛒";
  if (k.includes("card")) return "💳";
  if (k.includes("cash") || k.includes("wallet")) return "💸";
  if (k.includes("home")) return "🏠";
  return "◉";
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

export default function OwnerHomePage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const routeProfileKey = normalizeProfileKey(params?.profileKey);
  const stateProfileKey = normalizeProfileKey(location?.state?.profileKey);
  const storedProfileKey = normalizeProfileKey(localStorage.getItem("profileKey"));

  const profileKey = routeProfileKey || stateProfileKey || storedProfileKey || "";
  const profile = useMemo(() => (profileKey ? getProfileByKey(profileKey) : null), [profileKey]);

  const OWNER_NAME = profile?.label || "Owner";
  const OWNER_NAME_CAPS = String(profile?.brandTopTitle || OWNER_NAME).toUpperCase();
  const accent = profile?.accent || "#818cf8";
  const bgUrl = location?.state?.bgUrl || null;

  const baseTiles = useMemo(() => normalizeOwnerItems(profile), [profile]);

  const [stripeStatus, setStripeStatus] = useState({
    loading: true,
    ready: false,
    hasAccount: false,
    detailsSubmitted: false,
    chargesEnabled: false,
    payoutsEnabled: false,
    error: "",
  });

  const [paypalModalOpen, setPaypalModalOpen] = useState(false);
  const [paypalEmail, setPaypalEmail] = useState("");
  const [paypalSaving, setPaypalSaving] = useState(false);

  const [earningsSummary, setEarningsSummary] = useState({
    loading: true,
    availableToWithdraw: 0,
    pendingWithdrawal: 0,
    paidOut: 0,
    payoutReady: false,
    paypalPayoutEmail: "",
    error: "",
  });
  const [withdrawSaving, setWithdrawSaving] = useState(false);

  async function loadStripeStatus() {
    if (!profileKey) return;

    setStripeStatus((s) => ({ ...s, loading: true, error: "" }));

    try {
      const data = await ownerJsonWeb("/api/owner/stripe/status", {
        method: "GET",
        profileKey,
      });

      const ready = !!data?.ready;
      const hasAccount = !!data?.stripeAccountId;

      setStripeStatus({
        loading: false,
        ready,
        hasAccount,
        detailsSubmitted: !!data?.detailsSubmitted,
        chargesEnabled: !!data?.chargesEnabled,
        payoutsEnabled: !!data?.payoutsEnabled,
        error: "",
      });
    } catch (err) {
      setStripeStatus({
        loading: false,
        ready: false,
        hasAccount: false,
        detailsSubmitted: false,
        chargesEnabled: false,
        payoutsEnabled: false,
        error: err?.message || "Unable to load Stripe status",
      });
    }
  }

  async function loadEarningsSummary() {
    if (!profileKey) return;

    setEarningsSummary((s) => ({ ...s, loading: true, error: "" }));

    try {
      const data = await ownerJsonWeb("/api/owner/earnings/summary", {
        method: "GET",
        profileKey,
      });

      const summary = data?.summary || {};

      const savedPayPalEmail = String(summary?.paypalPayoutEmail || summary?.paypalEmail || "")
        .trim()
        .toLowerCase();

      setEarningsSummary({
        loading: false,
        availableToWithdraw: Number(summary?.availableToWithdraw ?? summary?.pendingPayout ?? 0),
        pendingWithdrawal: Number(summary?.pendingWithdrawal || 0),
        paidOut: Number(summary?.paidOut || 0),
        payoutReady: Boolean(summary?.payoutReady || savedPayPalEmail),
        paypalPayoutEmail: savedPayPalEmail,
        error: "",
      });

      if (savedPayPalEmail) {
        setPaypalEmail(savedPayPalEmail);
      }
    } catch (err) {
      setEarningsSummary((s) => ({
        ...s,
        loading: false,
        error: err?.message || "Unable to load earnings summary",
      }));
    }
  }

  async function loadPayPalPaymentInfo() {
    if (!profileKey) return;

    try {
      const data = await ownerJsonWeb("/api/owner/paypal/payment-info", {
        method: "GET",
        profileKey,
      });

      const email = String(
        data?.paypalEmail ||
          data?.paypalPayoutEmail ||
          data?.paymentInfo?.paypalEmail ||
          data?.paymentInfo?.paypalPayoutEmail ||
          data?.summary?.paypalEmail ||
          data?.summary?.paypalPayoutEmail ||
          ""
      )
        .trim()
        .toLowerCase();

      if (email) {
        setPaypalEmail(email);
        setEarningsSummary((s) => ({
          ...s,
          payoutReady: true,
          paypalPayoutEmail: email,
        }));
      }
    } catch (err) {
      console.warn("[OwnerHomePage] unable to load PayPal payment info", err?.message || err);
    }
  }

  useEffect(() => {
    loadStripeStatus();
    loadEarningsSummary();
    loadPayPalPaymentInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileKey]);


  const earningsTile = useMemo(
    () => ({
      key: "earnings",
      label: "Earnings",
      ionicon: "cash",
      to: "ownerearnings",
      size: 136,
    }),
    []
  );

  const TILES = useMemo(() => {
    const filtered = baseTiles.filter((t) => {
      const key = String(t.key || "").toLowerCase();
      return key !== "stripepayouts" && key !== "earnings" && key !== "withdraw";
    });

    return [earningsTile, ...filtered];
  }, [baseTiles, earningsTile]);

  const phases = useMemo(
    () =>
      TILES.map((_, idx) => ({
        ax: [5, 6, 4, 6, 5][idx % 5] * AMP_BOOST,
        ay: [4, 4, 6, 6, 5][idx % 5] * AMP_BOOST,
        sx: 0.35 + idx * 0.03,
        sy: 0.3 + idx * 0.025,
      })),
    [TILES]
  );

  const t0Ref = useRef(performance.now());
  const [, setTick] = useState(0);

  useEffect(() => {
    const loop = () => {
      setTick((x) => (x + 1) % 1_000_000);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }, []);

  const tileTransform = (idx) => {
    const t = ((performance.now() - t0Ref.current) / 1000) * SPEED;
    const p = phases[idx];
    return `translate3d(${Math.sin(t * p.sx) * p.ax}px, ${Math.cos(t * p.sy) * p.ay}px, 0)`;
  };

  const routeMap = {
    ownerearnings: "earnings",
    ownerabout: "about",
    ownercontacts: "contacts",
    ownermessages: "messages",
    ownerplaylist: "playlist",
    ownermusic: "music",
    ownerfashion: "fashion",
    ownervideos: "videos",
    ownerproducts: "products",
    ownerorders: "orders",
    ownerportfolio: "portfolio",
    ownerflowerorders: "flowerorders",
    ownerconsultation: "flowerorders",
    ownerpaidvideos: "paid-videos",
  };

  const builtOwnerRoutes = new Set([
    "home",
    "earnings",
    "about",
    "contacts",
    "messages",
    "playlist",
    "music",
    "products",
    "orders",
    "portfolio",
    "fashion",
    "videos",
    "flowerorders",
    "paid-videos",
  ]);

  async function handleSavePayPalInfo() {
    if (!profileKey) return;

    const email = String(paypalEmail || "").trim().toLowerCase();
    if (!email || !email.includes("@")) {
      window.alert("Enter a valid PayPal email address.");
      return;
    }

    try {
      setPaypalSaving(true);

      await ownerJsonWeb("/api/owner/paypal/payment-info", {
        method: "POST",
        profileKey,
        body: JSON.stringify({ paypalEmail: email }),
      });

      setPaypalEmail(email);
      setEarningsSummary((s) => ({
        ...s,
        payoutReady: true,
        paypalPayoutEmail: email,
      }));

      window.alert("PayPal payment info saved.");
      setPaypalModalOpen(false);
      await loadEarningsSummary();
      await loadPayPalPaymentInfo();
    } catch (err) {
      window.alert(err?.message || "Unable to save PayPal payment info.");
    } finally {
      setPaypalSaving(false);
    }
  }

  async function handleRequestWithdrawal() {
    if (!profileKey || withdrawSaving) return;

    if (!earningsSummary.payoutReady) {
      await loadPayPalPaymentInfo();
    }

    if (!earningsSummary.payoutReady && !paypalEmail) {
      window.alert("Add your PayPal payout email before requesting a withdrawal.");
      setPaypalModalOpen(true);
      return;
    }

    if (Number(earningsSummary.availableToWithdraw || 0) <= 0) {
      if (Number(earningsSummary.pendingWithdrawal || 0) > 0) {
        window.alert(`You already have a withdrawal request pending for ${formatMoney(earningsSummary.pendingWithdrawal)}.`);
      } else {
        window.alert("No earnings are currently available to withdraw.");
      }
      return;
    }

    const ok = window.confirm(
      `Request withdrawal of ${formatMoney(earningsSummary.availableToWithdraw)} to ${earningsSummary.paypalPayoutEmail || "your PayPal email"}?`
    );

    if (!ok) return;

    try {
      setWithdrawSaving(true);

      const data = await ownerJsonWeb("/api/owner/withdrawals/request", {
        method: "POST",
        profileKey,
        body: JSON.stringify({}),
      });

      window.alert(
        `Withdrawal requested: ${formatMoney(data?.summary?.requestedAmount || earningsSummary.availableToWithdraw)}. Admin will process it.`
      );

      await loadEarningsSummary();
    } catch (err) {
      window.alert(err?.message || "Unable to request withdrawal.");
      await loadEarningsSummary();
    } finally {
      setWithdrawSaving(false);
    }
  }

  const handleTilePress = async (tile) => {
    if (!profileKey) return;

    const raw = String(tile.to).toLowerCase().trim();

    if (raw === "__paypal_payment_info__" || raw === "__stripe_payouts__") {
      setPaypalModalOpen(true);
      return;
    }

    if (raw === "__owner_withdraw__") {
      await handleRequestWithdrawal();
      return;
    }

    let tool = routeMap[raw] || raw.replace(/^owner/, "");
    if (tool === "consultation") tool = "flowerorders";

    if (builtOwnerRoutes.has(tool)) {
      navigate(`/world/${encodeURIComponent(profileKey)}/owner/${tool}`, {
        state: { profileKey, bgUrl },
      });
    } else {
      console.warn("[OwnerHomePage] unknown owner route:", tool, "from:", raw);
    }
  };

  const goBackToIndiVerse = () => {
    if (!profileKey) return navigate("/", { replace: false });
    navigate(`/world/${encodeURIComponent(profileKey)}`, { state: { profileKey, bgUrl } });
  };

  const stripeHint = earningsSummary.loading
    ? "Loading payout status..."
    : earningsSummary.pendingWithdrawal > 0
      ? `Withdrawal requested: ${formatMoney(earningsSummary.pendingWithdrawal)} pending admin processing.`
      : earningsSummary.availableToWithdraw > 0
        ? `Available to withdraw: ${formatMoney(earningsSummary.availableToWithdraw)}.`
        : earningsSummary.paidOut > 0
          ? `Paid out: ${formatMoney(earningsSummary.paidOut)}.`
          : "Add your PayPal email so admin can send payouts.";

  return (
    <div style={styles.page}>
      <style>{css(accent)}</style>

      <div style={{ ...styles.glowOne, background: hexToRgba(accent, 0.33) }} />
      <div style={styles.glowTwo} />
      <div style={styles.grid} />

      <div style={styles.headerWrap}>
        <div style={styles.headerLeft}>
          <div style={styles.title}>{OWNER_NAME_CAPS}</div>
          <div style={styles.subtitle}>Owner Console</div>
        </div>

        <div style={styles.headerRight}>
          <button className="oh-pill" onClick={goBackToIndiVerse} title="Back to IndiVerse">
            <span className="oh-pillDot" />
            Back to IndiVerse
          </button>
        </div>
      </div>

      {!profileKey ? (
        <div style={styles.missingBox}>
          <div style={styles.missingTitle}>Missing profileKey</div>
          <div style={styles.missingText}>Open this page as: /world/&lt;profileKey&gt;/owner/home</div>
        </div>
      ) : null}

      {profileKey ? (
        <div style={styles.payoutPanel}>
          <div style={styles.payoutCopy}>
            <span style={styles.stripeBarLabel}>PayPal Payouts</span>
            <span style={styles.stripeBarValue}>{stripeHint}</span>
            {!!earningsSummary.error ? <span style={styles.stripeBarError}>• {earningsSummary.error}</span> : null}
            {!!stripeStatus.error ? <span style={styles.stripeBarError}>• {stripeStatus.error}</span> : null}
          </div>

          <div style={styles.payoutTabs}>
            <button
              className="oh-tab"
              onClick={async () => {
                await loadPayPalPaymentInfo();
                setPaypalModalOpen(true);
              }}
              disabled={!profileKey}
            >
              Payment Info
            </button>

            <button
              className="oh-tab oh-tabPrimary"
              onClick={handleRequestWithdrawal}
              disabled={!profileKey || withdrawSaving || earningsSummary.loading}
            >
              {withdrawSaving ? "Requesting…" : "Withdraw"}
            </button>
          </div>
        </div>
      ) : null}

      <div style={styles.field}>
        {TILES.map((t, idx) => (
          <button
            key={t.key}
            className="oh-tile"
            style={{ width: t.size, height: t.size, transform: tileTransform(idx) }}
            onClick={() => handleTilePress(t)}
            disabled={!profileKey}
            aria-label={t.label}
            title={t.label}
          >
            <div className="oh-tileInner">
              <div className="oh-icon">{ionToEmoji(t.ionicon, t)}</div>
              <div className="oh-label">
                {t.key === "withdraw" && withdrawSaving ? "Requesting…" : t.label}
              </div>
            </div>
          </button>
        ))}
      </div>

      {paypalModalOpen ? (
        <div style={styles.modalOverlay} onMouseDown={(e) => e.target === e.currentTarget && setPaypalModalOpen(false)}>
          <div style={styles.modalCard}>
            <div style={styles.modalTop}>
              <div>
                <div style={styles.modalTitle}>PayPal Payment Info</div>
                <div style={styles.modalSub}>This is the email admin will use to send your payouts.</div>
              </div>

              <button className="oh-pill" onClick={() => setPaypalModalOpen(false)}>
                Close
              </button>
            </div>

            <label style={styles.modalLabel}>PayPal Email</label>
            <input
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              placeholder={earningsSummary.paypalPayoutEmail || "you@example.com"}
              style={styles.modalInput}
              type="email"
              autoFocus
            />

            <div style={styles.modalActions}>
              <button className="oh-pill" onClick={() => setPaypalModalOpen(false)} disabled={paypalSaving}>
                Cancel
              </button>

              <button className="oh-pill" onClick={handleSavePayPalInfo} disabled={paypalSaving}>
                {paypalSaving ? "Saving…" : "Save PayPal Info"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div style={styles.footerNote}>
        <span style={{ opacity: 0.9 }}>Profile:</span>{" "}
        <span style={{ color: "rgba(226,232,240,0.95)", fontWeight: 900 }}>{profileKey || "—"}</span>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #020617, #0b1220)",
    color: "#e5e7eb",
    overflowX: "hidden",
    overflowY: "auto",
    position: "relative",
    paddingBottom: 84,
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
    width: "min(760px, calc(100% - 28px))",
    margin: "0 auto",
    padding: "28px 0 10px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  headerLeft: {},
  headerRight: { display: "flex", alignItems: "center", gap: 10 },
  title: {
    fontSize: "clamp(24px, 7vw, 32px)",
    fontWeight: 900,
    letterSpacing: 3,
    textShadow: "0 18px 48px rgba(0,0,0,0.55)",
    lineHeight: 1.05,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 12,
    letterSpacing: 1,
    color: "#9ca3af",
    textTransform: "uppercase",
  },
  missingBox: {
    position: "relative",
    zIndex: 2,
    width: "min(760px, calc(100% - 28px))",
    margin: "10px auto 0",
    padding: 12,
    borderRadius: 16,
    border: "1px solid rgba(248,113,113,0.7)",
    background: "rgba(248,113,113,0.08)",
  },
  missingTitle: { color: "#fecaca", fontWeight: 900, fontSize: 13 },
  missingText: { marginTop: 6, color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 700 },
  payoutPanel: {
    position: "relative",
    zIndex: 2,
    width: "min(760px, calc(100% - 28px))",
    margin: "8px auto 0",
    padding: "10px",
    borderRadius: 18,
    border: "1px solid rgba(148,163,184,0.2)",
    background: "rgba(15,23,42,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  },
  payoutCopy: {
    minWidth: 0,
    flex: "1 1 260px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  payoutTabs: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    flex: "0 0 auto",
  },
  stripeBarLabel: {
    fontSize: 12,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontWeight: 800,
  },
  stripeBarValue: {
    fontSize: 12,
    color: "#e5e7eb",
    fontWeight: 800,
  },
  stripeBarError: {
    fontSize: 12,
    color: "#fca5a5",
    fontWeight: 700,
  },
  field: {
    position: "relative",
    zIndex: 2,
    width: "min(760px, calc(100% - 28px))",
    margin: "0 auto",
    padding: "16px 0 18px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(126px, 1fr))",
    gap: 14,
    justifyItems: "center",
  },
  footerNote: {
    position: "fixed",
    left: 18,
    bottom: 14,
    zIndex: 2,
    fontSize: 11,
    color: "rgba(148,163,184,0.85)",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    userSelect: "none",
    background: "rgba(2,6,23,0.45)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "8px 10px",
    borderRadius: 999,
    backdropFilter: "blur(10px)",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    background: "rgba(0,0,0,0.62)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: {
    width: "min(520px, 94vw)",
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(15,23,42,0.96)",
    boxShadow: "0 30px 90px rgba(0,0,0,0.65)",
    padding: 16,
  },
  modalTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  modalSub: {
    marginTop: 6,
    fontSize: 12,
    color: "rgba(203,213,225,0.8)",
    lineHeight: "18px",
  },
  modalLabel: {
    display: "block",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "rgba(203,213,225,0.85)",
    marginBottom: 8,
  },
  modalInput: {
    width: "100%",
    height: 46,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(2,6,23,0.65)",
    color: "#fff",
    padding: "0 14px",
    outline: "none",
    fontWeight: 800,
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 14,
    flexWrap: "wrap",
  },
};

function css(accent) {
  return `
  *{ box-sizing: border-box; }
  button{ font-family: inherit; }

  .oh-pill{
    height: 40px;
    border-radius: 999px;
    padding: 0 14px 0 12px;
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
  .oh-pill:hover{
    transform: translateY(-1px);
    border-color: rgba(129,140,248,0.55);
    background: rgba(15,23,42,0.55);
  }
  .oh-pill:active{ transform: translateY(0px) scale(0.995); opacity: 0.95; }
  .oh-pillDot{
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: ${accent || "#818cf8"};
    box-shadow: 0 0 0 6px rgba(129,140,248,0.18);
  }

  .oh-tab{
    height: 36px;
    border-radius: 999px;
    padding: 0 13px;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(2,6,23,0.48);
    color: rgba(255,255,255,0.9);
    font-weight: 900;
    letter-spacing: 0.55px;
    cursor: pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    white-space: nowrap;
    backdrop-filter: blur(10px);
    transition: transform 140ms ease, border-color 140ms ease, background 140ms ease;
    user-select: none;
    text-transform: uppercase;
    font-size: 10.5px;
  }
  .oh-tabPrimary{
    border-color: ${hexToRgba(accent || "#818cf8", 0.42)};
    background: ${hexToRgba(accent || "#818cf8", 0.16)};
  }
  .oh-tab:hover{
    transform: translateY(-1px);
    border-color: rgba(129,140,248,0.55);
    background: rgba(15,23,42,0.65);
  }
  .oh-tab:active{ transform: translateY(0px) scale(0.995); opacity: 0.95; }
  .oh-tab:disabled{
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .oh-tile{
    width: min(136px, 100%) !important;
    height: 136px !important;
    border-radius: 24px;
    background: rgba(15,23,42,0.66);
    border: 1px solid rgba(255,255,255,0.10);
    box-shadow: 0 18px 42px rgba(0,0,0,0.45);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 140ms ease, border-color 140ms ease, background 140ms ease, box-shadow 140ms ease;
    outline: none;
  }

  .oh-tile:before{
    content:'';
    position:absolute;
    inset:0;
    background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.10), rgba(255,255,255,0.03) 55%, rgba(0,0,0,0) 70%);
    opacity: 0.85;
    pointer-events:none;
  }

  .oh-tile:hover{
    border-color: rgba(129,140,248,0.55);
    background: rgba(15,23,42,0.78);
    box-shadow: 0 24px 64px rgba(0,0,0,0.52);
  }
  .oh-tile:active{
    transform: translate3d(0,0,0) scale(0.992);
    opacity: 0.98;
  }
  .oh-tile:disabled{
    opacity: 0.5;
    cursor: not-allowed;
  }

  .oh-tileInner{
    width: 100%;
    height: 100%;
    display:flex;
    flex-direction: column;
    align-items:center;
    justify-content:center;
    gap: 14px;
    position: relative;
    z-index: 1;
  }

  .oh-icon{
    font-size: 42px;
    line-height: 1;
    filter: drop-shadow(0 10px 22px rgba(0,0,0,0.45));
  }

  .oh-label{
    font-size: 12.5px;
    font-weight: 900;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(226,232,240,0.95);
    text-shadow: 0 14px 32px rgba(0,0,0,0.45);
    text-align: center;
    padding: 0 8px;
  }

  @media (max-width: 620px){
    .oh-pill{ height: 34px; font-size: 9.5px; padding: 0 10px; }
    .oh-tab{ flex: 1 1 0; min-width: 0; height: 34px; padding: 0 10px; font-size: 9.5px; }
    .oh-icon{ font-size: 38px; }
    .oh-label{ font-size: 11.5px; letter-spacing: 0.7px; }
  }

  @media (max-width: 390px){
    .oh-tile{ height: 124px !important; }
  }
  `;
}