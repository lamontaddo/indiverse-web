// src/pages/CheckoutReturnPage.jsx ✅ FULL DROP-IN
// Handles PayPal product return:
// /checkout/success?mode=products&pk=lamont&checkout=success&provider=paypal
// /checkout/cancel?mode=products&pk=lamont&checkout=cancelled&provider=paypal

import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function normLower(v) {
  return String(v || "").trim().toLowerCase();
}

function apiBase() {
  return String(import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/+$/, "");
}

async function apiJsonOrThrow(path, { method = "GET", headers = {}, body } = {}) {
  const base = apiBase();
  const url = `${base}${path}`;

  const res = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      ...headers,
    },
    body,
    credentials: "include",
  });

  const text = await res.text().catch(() => "");

  if (!res.ok) {
    throw new Error(`${method} ${path} failed (${res.status}): ${text || res.statusText}`);
  }

  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export default function CheckoutReturnPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = useMemo(() => new URLSearchParams(location.search || ""), [location.search]);

  const mode = normLower(params.get("mode"));
  const profileKey = normLower(params.get("pk") || params.get("profileKey"));
  const provider = normLower(params.get("provider"));
  const isCancel = location.pathname.includes("/checkout/cancel");

  const [status, setStatus] = useState(isCancel ? "cancelled" : "loading");
  const [message, setMessage] = useState(isCancel ? "Checkout was cancelled." : "Finalizing your checkout…");
  const [orderId, setOrderId] = useState("");
  const [purchaseId, setPurchaseId] = useState("");

  useEffect(() => {
    if (isCancel) return;

    let alive = true;

    async function finalizePayPalProducts() {
      if (mode !== "products" || provider !== "paypal" || !profileKey) {
        setStatus("error");
        setMessage("Missing checkout return information.");
        return;
      }

      const storageKey = `paypalPendingProducts:${profileKey}`;
      const raw = localStorage.getItem(storageKey);

      if (!raw) {
        setStatus("error");
        setMessage("PayPal returned successfully, but no pending product checkout was found on this browser.");
        return;
      }

      let pending = null;
      try {
        pending = JSON.parse(raw);
      } catch {
        pending = null;
      }

      const pendingOrderId = String(pending?.orderId || "").trim();
      const pendingPurchaseId = String(pending?.pendingPurchaseId || "").trim();

      if (!pendingOrderId) {
        setStatus("error");
        setMessage("PayPal returned successfully, but the order ID was missing.");
        return;
      }

      try {
        setStatus("loading");
        setMessage("Capturing PayPal payment and creating your order…");

        const data = await apiJsonOrThrow("/api/paypal/checkout/capture", {
          method: "POST",
          headers: {
            "x-profile-key": profileKey,
          },
          body: JSON.stringify({
            orderId: pendingOrderId,
            pendingPurchaseId,
          }),
        });

        localStorage.removeItem(storageKey);

        if (!alive) return;

        setOrderId(String(data?.orderId || pendingOrderId || ""));
        setPurchaseId(String(data?.purchaseId || ""));
        setStatus("success");
        setMessage("Payment complete. Your order has been created.");
      } catch (e) {
        if (!alive) return;
        console.error("[CheckoutReturnPage] PayPal product capture error:", e);
        setStatus("error");
        setMessage(e?.message || "PayPal payment completed, but we could not create your order yet.");
      }
    }

    finalizePayPalProducts();

    return () => {
      alive = false;
    };
  }, [isCancel, mode, provider, profileKey]);

  const goOrders = () => navigate("/account/orders");
  const goProducts = () => navigate(profileKey ? `/world/${profileKey}/products` : "/");

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>
          {status === "success" ? "✅" : status === "cancelled" ? "↩️" : status === "error" ? "⚠️" : "⏳"}
        </div>

        <h1 style={styles.title}>
          {status === "success"
            ? "Checkout complete"
            : status === "cancelled"
            ? "Checkout cancelled"
            : status === "error"
            ? "Checkout needs attention"
            : "Finalizing checkout"}
        </h1>

        <p style={styles.message}>{message}</p>

        {orderId ? <div style={styles.meta}>PayPal Order: {orderId}</div> : null}
        {purchaseId ? <div style={styles.meta}>Order ID: {purchaseId}</div> : null}

        <div style={styles.actions}>
          <button style={styles.primaryBtn} onClick={goOrders}>
            View Orders
          </button>

          <button style={styles.secondaryBtn} onClick={goProducts}>
            Back to Products
          </button>
        </div>

        <Link style={styles.link} to={profileKey ? `/world/${profileKey}` : "/"}>
          Back to indiVerse
        </Link>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(900px 500px at 50% 10%, rgba(34,197,94,0.16), transparent 60%), linear-gradient(180deg, #020617, #000)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  },
  card: {
    width: "min(520px, 100%)",
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(15,23,42,0.72)",
    boxShadow: "0 30px 100px rgba(0,0,0,0.45)",
    padding: 24,
    textAlign: "center",
    backdropFilter: "blur(14px)",
  },
  icon: { fontSize: 44, marginBottom: 12 },
  title: { margin: 0, fontSize: 26, fontWeight: 950 },
  message: { margin: "12px 0 0", color: "rgba(255,255,255,0.78)", lineHeight: 1.45, fontWeight: 700 },
  meta: {
    marginTop: 10,
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: 800,
    wordBreak: "break-word",
  },
  actions: { marginTop: 20, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" },
  primaryBtn: {
    border: "none",
    borderRadius: 999,
    padding: "12px 16px",
    background: "linear-gradient(90deg, #22c55e, #16a34a)",
    color: "#fff",
    fontWeight: 950,
    cursor: "pointer",
  },
  secondaryBtn: {
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: 999,
    padding: "12px 16px",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontWeight: 950,
    cursor: "pointer",
  },
  link: {
    display: "inline-block",
    marginTop: 18,
    color: "rgba(255,255,255,0.70)",
    fontWeight: 800,
    textDecoration: "none",
  },
};