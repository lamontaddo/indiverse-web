// src/pages/CartPage.jsx ✅ FULL DROP-IN (Web Cart)
// Supports BOTH carts:
//  - Flowers (default): POST /api/flowers/checkout
//  - Products: POST /api/checkout/products
//
// ✅ Profile-aware list (only this profile)
// ✅ Clear cart for this profile (products-only if products mode)
// ✅ Stripe checkout opens via window.location (Safari-safe)
// ✅ Products checkout sends userId (reads from localStorage; optional)
// ✅ No Expo deps

import React, { useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { useCart } from "../CartContext.jsx";
import { profileFetch } from "../services/profileApi.js";

function formatPrice(priceCents) {
  const n = Number(priceCents || 0);
  if (!n || n <= 0) return "Pricing on request";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n / 100);
}

function normLower(v) {
  return String(v || "").trim().toLowerCase();
}

function normalizeCartMode(v) {
  const s = normLower(v);
  if (s === "products") return "products";
  return "flowers";
}

function normalizeItemType(v) {
  const t = normLower(v);
  if (!t) return "";
  if (t === "products") return "product";
  if (t === "flowers") return "flower";
  return t;
}

function getLineId(it) {
  // Prefer productId if present (variant-safe cart lines)
  // but backend payload expects productId for products checkout
  return it?.productId || it?.id || it?._id || null;
}

function getBuyerUserIdFromStorage() {
    // ✅ MUST match apiClient + login storage
    const keys = [
      "buyerUserId_v1",     // ✅ our canonical stable key
      "buyerUserId",
      "userId",
      "auth:userId",
      "indiverse:userId",
    ];
  
    for (const k of keys) {
      const v = localStorage.getItem(k);
      if (v && String(v).trim()) return String(v).trim();
    }
  
    // Optional: if you store a JSON user object
    const raw = localStorage.getItem("buyerUser");
    if (raw) {
      try {
        const u = JSON.parse(raw);
        return u?.id || u?._id || u?.userId || u?.user?.id || u?.user?._id || null;
      } catch {}
    }
  
    return null;
  }
  

export default function CartPage() {
  const nav = useNavigate();
  const { profileKey } = useParams();
  const [sp] = useSearchParams();

  const cartMode = normalizeCartMode(sp.get("mode") || sp.get("cartMode"));
  const pkLower = normLower(profileKey);

  const { items, addItem, removeItem, clearCartForProfile } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  // ✅ Profile-aware + mode-aware filtering
  const filteredItems = useMemo(() => {
    return (items || []).filter((it) => {
      const itPk = normLower(it?.profileKey);
      if (itPk !== pkLower) return false;

      const t = normalizeItemType(it?.itemType || it?.type || "");

      if (cartMode === "products") {
        // explicit type preferred
        if (t) return t === "product";
        // inference fallback
        return !!(
          it?.selectedSize ||
          it?.selectedColor ||
          Array.isArray(it?.sizes) ||
          Array.isArray(it?.colors)
        );
      }

      // flowers mode
      if (t) return t === "arrangement" || t === "flower";
      return !(
        it?.selectedSize ||
        it?.selectedColor ||
        Array.isArray(it?.sizes) ||
        Array.isArray(it?.colors)
      );
    });
  }, [items, cartMode, pkLower]);

  const hasPriceForAll = useMemo(() => {
    return (
      filteredItems.length > 0 &&
      filteredItems.every((it) => it?.priceCents && Number(it.priceCents) > 0)
    );
  }, [filteredItems]);

  const subtotalCents = useMemo(() => {
    return filteredItems.reduce((sum, it) => {
      const qty = Number(it?.quantity || 1);
      const pc = Number(it?.priceCents || 0);
      if (pc > 0) return sum + pc * qty;
      return sum;
    }, 0);
  }, [filteredItems]);

  const subtotalText = hasPriceForAll ? formatPrice(subtotalCents) : "Pricing on request";

  const totalQty = useMemo(() => {
    return filteredItems.reduce((sum, it) => sum + Number(it?.quantity || 1), 0);
  }, [filteredItems]);

  const isEmpty = filteredItems.length === 0;

  const subtitleText = isEmpty
    ? "Your cart is empty"
    : `${totalQty} item${totalQty === 1 ? "" : "s"} • Stripe-secured checkout`;

  const emptyCtaLabel = cartMode === "products" ? "Browse products" : "Browse arrangements";
  const browseHref =
    cartMode === "products"
      ? `/world/${profileKey}/products`
      : `/world/${profileKey}/arrangements`; // if you don’t have arrangements on web yet, you can swap this

  const handleIncrement = (item) => addItem(item, 1, { profileKey });
  const handleDecrement = (item) => {
    const currentQty = Number(item?.quantity || 1);
    if (currentQty <= 1) return;
    addItem(item, -1, { profileKey });
  };

  const handleRemove = (item) => {
    // ✅ your CartContext supports lineKey string OR item OR legacy id
    if (item?.lineKey) return removeItem(item.lineKey);
    const id = item?.id || item?._id || null;
    if (id) return removeItem(String(id));
    removeItem(item);
  };

  const handleClearCart = () => {
    if (cartMode === "products") {
      clearCartForProfile?.(profileKey, { onlyItemType: "product" });
      return;
    }
    clearCartForProfile?.(profileKey);
  };

  const openCheckoutUrl = (json) => {
    const u = json?.checkoutUrl || json?.url || null;
    if (!u) throw new Error("Checkout URL was not returned by the server.");

    // Safari-safe, simplest
    window.location.href = u;
  };

  const handleCheckout = async () => {
    if (!filteredItems.length) {
      alert(cartMode === "products" ? "Add a product to your cart first." : "Add an arrangement to your cart first.");
      return;
    }

    if (!hasPriceForAll) {
      alert("Some items require pricing confirmation. Please request a consultation instead.");
      return;
    }

    setCheckingOut(true);
    try {
      if (cartMode === "products") {
        const userId = getBuyerUserIdFromStorage();
        if (!userId) {
          alert("Please log in — you must be logged in to checkout.");
          nav(`/auth/login?next=${encodeURIComponent(`/world/${profileKey}/cart?mode=products`)}`);
          return;
        }

        const payload = {
          userId,
          items: filteredItems.map((it) => ({
            productId: String(getLineId(it) || ""), // backend expects productId
            quantity: Number(it?.quantity || 1),
            selectedSize: it?.selectedSize || it?.size || null,
            selectedColor: it?.selectedColor || it?.color || null,
          })),
        };

        const res = await profileFetch(profileKey, "/api/checkout/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res?.ok) throw new Error(res?.error || "Unable to start checkout.");
        openCheckoutUrl(res);
        return;
      }

      // flowers checkout
      const res = await profileFetch(profileKey, "/api/flowers/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: filteredItems.map((it) => ({
            id: String(getLineId(it) || ""),
            name: it?.name || "Arrangement",
            priceCents: Number(it?.priceCents || 0),
            quantity: Number(it?.quantity || 1),
            imageUrl: it?.imageUrl || null,
          })),
        }),
      });

      if (!res?.ok) throw new Error(res?.error || "Unable to start checkout.");
      openCheckoutUrl(res);
    } catch (err) {
      console.log("Checkout error:", err);
      alert(err?.message || "Something went wrong starting checkout.");
    } finally {
      setCheckingOut(false);
    }
  };

  // (Optional) consultation route placeholder for web
  const handleConsultation = () => {
    const summary = filteredItems
      .map((it) => `${Number(it?.quantity || 1)} × ${it?.name || (cartMode === "products" ? "Product" : "Arrangement")}`)
      .join("\n");
    alert(`Consultation request:\n\n${summary}\n\n(Implement your web contact form / order request page next.)`);
  };

  return (
    <div style={styles.page}>
      <div style={styles.bg} />

      {/* Header */}
      <div style={styles.headerRow}>
        <button onClick={() => nav(-1)} style={styles.iconBtn} aria-label="Back">
          ←
        </button>

        <div style={styles.headerCenter}>
          <div style={styles.headerTitleRow}>
            <div style={styles.cartDot} />
            <div style={styles.h1}>Cart</div>
          </div>
          <div style={styles.sub}>{subtitleText}</div>
        </div>

        <div style={{ width: 36 }} />
      </div>

      {isEmpty ? (
        <div style={styles.center}>
          <div style={styles.emptyText}>Your cart is currently empty.</div>
          <Link to={browseHref} style={styles.primaryLink}>
            {emptyCtaLabel}
          </Link>
        </div>
      ) : (
        <>
          <div style={styles.list}>
            {filteredItems.map((item, idx) => {
              const qty = Number(item?.quantity || 1);
              const pc = Number(item?.priceCents || 0);
              const lineTotalCents = pc > 0 ? pc * qty : 0;

              const optText =
                cartMode === "products"
                  ? [item?.selectedSize ? `Size: ${item.selectedSize}` : null, item?.selectedColor ? `Color: ${item.selectedColor}` : null]
                      .filter(Boolean)
                      .join(" • ")
                  : item?.size || "";

              return (
                <div key={String(item?.lineKey || item?.id || item?._id || idx)} style={styles.card}>
                  <div style={styles.cardInner}>
                    {item?.imageUrl ? (
                      <img src={item.imageUrl} alt={item?.name || "Item"} style={styles.image} />
                    ) : (
                      <div style={styles.imagePh}>
                        <span style={{ opacity: 0.8 }}>{cartMode === "products" ? "▢" : "✿"}</span>
                      </div>
                    )}

                    <div style={styles.cardText}>
                      <div style={styles.nameRow}>
                        <div style={styles.name} title={item?.name || ""}>
                          {item?.name || (cartMode === "products" ? "Product" : "Arrangement")}
                        </div>

                        <button onClick={() => handleRemove(item)} style={styles.trashBtn} aria-label="Remove">
                          ✕
                        </button>
                      </div>

                      {item?.category ? <div style={styles.meta}>{String(item.category).toUpperCase()}</div> : null}
                      {optText ? <div style={styles.meta}>{String(optText).toUpperCase()}</div> : null}

                      <div style={styles.rowBetween}>
                        <div style={styles.unitPrice}>{pc > 0 ? formatPrice(pc) : "Pricing on request"}</div>

                        <div style={styles.qtyControl}>
                          <button
                            onClick={() => handleDecrement(item)}
                            disabled={qty <= 1}
                            style={{
                              ...styles.qtyBtn,
                              opacity: qty <= 1 ? 0.4 : 1,
                              cursor: qty <= 1 ? "not-allowed" : "pointer",
                            }}
                          >
                            −
                          </button>

                          <div style={styles.qtyValue}>{qty}</div>

                          <button onClick={() => handleIncrement(item)} style={styles.qtyBtn}>
                            +
                          </button>
                        </div>
                      </div>

                      {pc > 0 ? (
                        <div style={styles.lineTotalRow}>
                          <div style={styles.lineTotalLabel}>Line total</div>
                          <div style={styles.lineTotalValue}>{formatPrice(lineTotalCents)}</div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <div style={styles.summaryRow}>
              <div>
                <div style={styles.summaryLabel}>Subtotal</div>
                <div style={styles.summaryHint}>Taxes & delivery handled during Stripe checkout.</div>
              </div>
              <div style={styles.summaryValue}>{subtotalText}</div>
            </div>

            <div style={styles.footerBtns}>
              <button onClick={handleClearCart} style={styles.clearBtn}>
                Clear Cart
              </button>

              <button
                onClick={hasPriceForAll ? handleCheckout : handleConsultation}
                disabled={checkingOut}
                style={{
                  ...styles.checkoutBtn,
                  opacity: checkingOut ? 0.8 : 1,
                }}
              >
                {checkingOut
                  ? "Opening…"
                  : hasPriceForAll
                  ? "Checkout with Stripe"
                  : "Request consultation"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    position: "relative",
    overflowX: "hidden",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
  },
  bg: {
    position: "fixed",
    inset: 0,
    background:
      "radial-gradient(1000px 600px at 20% 10%, rgba(99,102,241,0.18), transparent 60%), radial-gradient(900px 500px at 80% 30%, rgba(249,115,115,0.14), transparent 60%), linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,1))",
    zIndex: 0,
  },
  headerRow: {
    position: "sticky",
    top: 0,
    zIndex: 5,
    padding: "18px 18px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backdropFilter: "blur(10px)",
    background: "rgba(0,0,0,0.55)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    cursor: "pointer",
  },
  headerCenter: { textAlign: "center", flex: 1 },
  headerTitleRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
  cartDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    background: "rgba(165,180,252,0.9)",
    boxShadow: "0 0 14px rgba(165,180,252,0.5)",
  },
  h1: { fontSize: 20, fontWeight: 900, letterSpacing: 1.1 },
  sub: { marginTop: 2, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#cfd3dc" },

  center: { minHeight: "65vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, padding: 24, position: "relative", zIndex: 1 },
  emptyText: { color: "#cfd3dc", fontSize: 14, textAlign: "center" },
  primaryLink: {
    textDecoration: "none",
    color: "#fff",
    background: "linear-gradient(90deg, #4f46e5, #6366f1)",
    padding: "10px 16px",
    borderRadius: 999,
    fontWeight: 800,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    fontSize: 12,
  },

  list: { padding: "14px 18px 120px", display: "grid", gap: 14, position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto" },

  card: {
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
  },
  cardInner: { display: "flex" },
  image: { width: 110, height: 110, objectFit: "cover" },
  imagePh: {
    width: 110,
    height: 110,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(15,23,42,0.9)",
    borderRight: "1px solid rgba(255,255,255,0.08)",
    fontSize: 22,
  },
  cardText: { flex: 1, padding: 12, display: "flex", flexDirection: "column", gap: 6, minWidth: 0 },
  nameRow: { display: "flex", alignItems: "center", gap: 10 },
  name: { flex: 1, fontWeight: 900, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  trashBtn: { width: 28, height: 28, borderRadius: 999, border: "none", background: "transparent", color: "#fca5a5", cursor: "pointer", fontSize: 18, lineHeight: "28px" },

  meta: { color: "#e5e7eb", fontSize: 11, letterSpacing: 0.8, opacity: 0.85 },
  unitPrice: { color: "#f97373", fontWeight: 900, fontSize: 14 },

  rowBetween: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 4 },
  qtyControl: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(15,23,42,0.9)",
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.6)",
    padding: "4px 6px",
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 999,
    border: "none",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 900,
  },
  qtyValue: { minWidth: 22, textAlign: "center", fontWeight: 900 },

  lineTotalRow: { display: "flex", justifyContent: "space-between", marginTop: 6 },
  lineTotalLabel: { color: "#9ca3af", fontSize: 11 },
  lineTotalValue: { color: "#f97373", fontSize: 13, fontWeight: 900 },

  footer: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    padding: "12px 18px 16px",
    background: "rgba(15,23,42,0.96)",
    borderTop: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(12px)",
    zIndex: 6,
  },
  summaryRow: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, maxWidth: 900, margin: "0 auto 10px" },
  summaryLabel: { color: "#e5e7eb", fontSize: 13, fontWeight: 700 },
  summaryHint: { color: "#9ca3af", fontSize: 11, marginTop: 2 },
  summaryValue: { color: "#f97373", fontSize: 16, fontWeight: 900 },

  footerBtns: { display: "flex", gap: 10, maxWidth: 900, margin: "0 auto" },
  clearBtn: {
    flex: 1,
    borderRadius: 999,
    border: "1px solid rgba(248,113,113,0.35)",
    background: "rgba(0,0,0,0.25)",
    color: "#fecaca",
    padding: "12px 14px",
    fontWeight: 900,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    fontSize: 12,
    cursor: "pointer",
  },
  checkoutBtn: {
    flex: 2,
    borderRadius: 999,
    border: "none",
    background: "linear-gradient(90deg, #22c55e, #16a34a)",
    color: "#fff",
    padding: "12px 14px",
    fontWeight: 900,
    letterSpacing: 1,
    textTransform: "uppercase",
    fontSize: 12,
    cursor: "pointer",
  },
};
