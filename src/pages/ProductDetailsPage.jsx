// src/pages/ProductDetailsPage.jsx ✅ FULL DROP-IN (Web, more web-friendly + CLICK-TO-ZOOM)
// Route: /world/:profileKey/products/:productId
//
// ✅ Web layout: 2-col (gallery + details) on desktop, stacked on mobile
// ✅ Sticky gallery + sticky CTA bar (desktop)
// ✅ Resets selectedSize/selectedColor when product changes
// ✅ Direct-link entry support:
//    - prefers router state.product
//    - tries GET /api/products/:id
//    - falls back to GET /api/products and find
// ✅ Add to cart + Buy now (go to cart mode=products)
// ✅ Chips + qty + subtotal
// ✅ NEW: Click image to open full-screen zoom (lightbox)
//    - ESC to close
//    - click outside to close
//    - locks background scroll while open

import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { useCart } from "../CartContext";
import { profileFetchRaw } from "../services/profileApi";

function formatPrice(priceCents) {
  const n = Number(priceCents || 0);
  if (!n || n <= 0) return "Pricing on request";
  const dollars = (n / 100).toFixed(0);
  return `$${Number(dollars).toLocaleString()}`;
}

function uniq(arr) {
  const out = [];
  const seen = new Set();
  for (const v of Array.isArray(arr) ? arr : []) {
    const s = String(v || "").trim();
    if (!s) continue;
    const k = s.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(s);
  }
  return out;
}

function samePick(a, b) {
  return String(a || "")
    .trim()
    .toLowerCase() ===
    String(b || "")
      .trim()
      .toLowerCase();
}

function getId(p) {
  return String(p?._id || p?.id || "");
}

export default function ProductDetailsPage() {
  const { profileKey = "lamont", productId = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCart();

  const stateProduct = location?.state?.product || null;

  const [product, setProduct] = useState(stateProduct);
  const [loading, setLoading] = useState(!stateProduct);
  const [errorText, setErrorText] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const sizes = useMemo(() => uniq(product?.sizes), [product]);
  const colors = useMemo(() => uniq(product?.colors), [product]);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // ✅ Zoom modal state
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const openZoom = () => setIsZoomOpen(true);
  const closeZoom = () => setIsZoomOpen(false);

  // ESC to close + lock body scroll while open
  useEffect(() => {
    if (!isZoomOpen) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") closeZoom();
    };
    window.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isZoomOpen]);

  // Load product if not passed via state (direct link support)
  useEffect(() => {
    let mounted = true;

    async function load() {
      if (stateProduct) {
        setProduct(stateProduct);
        setLoading(false);
        setErrorText(null);
        return;
      }

      setLoading(true);
      setErrorText(null);

      // 1) Try /api/products/:id
      try {
        const res = await profileFetchRaw(profileKey, `/api/products/${encodeURIComponent(productId)}`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          if (!mounted) return;
          setProduct(data);
          setLoading(false);
          return;
        }
      } catch {
        // ignore
      }

      // 2) Fallback: load list and find
      try {
        const res2 = await profileFetchRaw(profileKey, `/api/products`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!res2.ok) throw new Error("Failed list fetch");
        const list = await res2.json();
        const found = (Array.isArray(list) ? list : []).find((p) => getId(p) === String(productId));

        if (!mounted) return;

        if (found) {
          setProduct(found);
          setLoading(false);
          return;
        }

        setErrorText("Product not found.");
      } catch {
        if (!mounted) return;
        setErrorText("Unable to load product at the moment.");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [profileKey, productId, stateProduct]);

  // ✅ Reset quantity + default picks when product changes
  useEffect(() => {
    setQuantity(1);
    setSelectedSize(sizes.length === 1 ? sizes[0] : "");
    setSelectedColor(colors.length === 1 ? colors[0] : "");
    setIsZoomOpen(false); // close zoom if navigating to another product
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?._id, product?.id]);

  // Keep selections valid if options change
  useEffect(() => {
    if (!product) return;
    if (selectedSize && sizes.length > 0) {
      const stillValid = sizes.some((s) => samePick(s, selectedSize));
      if (!stillValid) setSelectedSize(sizes.length === 1 ? sizes[0] : "");
    } else if (!selectedSize && sizes.length === 1) setSelectedSize(sizes[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizes.join("|")]);

  useEffect(() => {
    if (!product) return;
    if (selectedColor && colors.length > 0) {
      const stillValid = colors.some((c) => samePick(c, selectedColor));
      if (!stillValid) setSelectedColor(colors.length === 1 ? colors[0] : "");
    } else if (!selectedColor && colors.length === 1) setSelectedColor(colors[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors.join("|")]);

  const hasPrice = !!product?.priceCents && Number(product.priceCents) > 0;
  const unitPriceText = useMemo(() => (product ? formatPrice(product?.priceCents) : ""), [product]);
  const subtotalText = useMemo(() => {
    if (!product) return "";
    return hasPrice ? formatPrice(Number(product.priceCents) * quantity) : "Pricing on request";
  }, [product, hasPrice, quantity]);

  const mustPickSize = sizes.length > 0;
  const mustPickColor = colors.length > 0;

  const validateOptions = () => {
    if (!product) return false;

    if (product?.inStock === false) {
      window.alert("Out of stock: This item is currently unavailable.");
      return false;
    }
    if (mustPickSize && !selectedSize) {
      window.alert("Select a size before continuing.");
      return false;
    }
    if (mustPickColor && !selectedColor) {
      window.alert("Select a color before continuing.");
      return false;
    }
    return true;
  };

  const cartMeta = useMemo(() => {
    const pid = String(product?._id || product?.id || productId || "");
    return {
      profileKey,
      itemType: "product",
      productId: pid,
      selectedSize: selectedSize || undefined,
      selectedColor: selectedColor || undefined,
    };
  }, [profileKey, product, productId, selectedSize, selectedColor]);

  const onBack = () => navigate(`/world/${profileKey}/products`);
  const onDec = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const onInc = () => setQuantity((q) => (q < 99 ? q + 1 : 99));

  const onAddToCart = () => {
    if (!validateOptions()) return;
    addItem(product, quantity, cartMeta);
    window.alert(`Added to cart: ${quantity} × ${product?.name || "Item"}`);
  };

  const onBuyNow = () => {
    if (!validateOptions()) return;
    addItem(product, quantity, cartMeta);
    navigate(`/world/${profileKey}/cart?mode=products&fromBuyNow=1`);
  };

  return (
    <div style={styles.page}>
      <div style={styles.bg} />

      {/* header */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.iconBtn} aria-label="Back">
          ‹
        </button>

        <div style={styles.headerCenter}>
          <div style={styles.headerTitle} title={product?.name || "Product"}>
            {product?.name || "Product"}
          </div>
          <div style={styles.headerSub}>DROPS • ESSENTIALS • EXCLUSIVE</div>
        </div>

        <div style={{ width: 40 }} />
      </div>

      <div style={styles.container}>
        {loading ? (
          <div style={styles.center}>
            <div className="pd-spin" style={styles.spinner} />
            <div style={styles.muted}>Loading product…</div>
          </div>
        ) : errorText ? (
          <div style={styles.center}>
            <div style={styles.error}>{errorText}</div>
            <Link to={`/world/${profileKey}/products`} style={styles.link}>
              Back to products
            </Link>
          </div>
        ) : !product ? (
          <div style={styles.center}>
            <div style={styles.error}>Product not found.</div>
          </div>
        ) : (
          <>
            <div className="pd-grid" style={styles.grid}>
              {/* LEFT: gallery */}
              <div className="pd-left" style={styles.leftCol}>
                <div className="pd-gallery" style={styles.galleryCard}>
                  <div style={styles.sheen} />

                  {product?.imageUrl ? (
                    <button
                      type="button"
                      onClick={openZoom}
                      style={styles.zoomBtn}
                      aria-label="Open image"
                      title="Click to enlarge"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product?.name || "Product"}
                        style={styles.galleryImg}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div style={styles.zoomHint}>Click to zoom</div>
                    </button>
                  ) : (
                    <div style={styles.galleryPlaceholder}>
                      <div style={{ fontSize: 24 }}>🧊</div>
                      <div style={styles.galleryPlaceholderText}>Image coming soon</div>
                    </div>
                  )}

                  <div style={styles.galleryOverlayTop}>
                    <div style={styles.pill}>PRODUCT</div>
                    {product?.inStock === false ? <div style={{ ...styles.pill, ...styles.pillDanger }}>OUT</div> : null}
                  </div>
                </div>

                {/* desktop-only quick links */}
                <div className="pd-links" style={styles.linksRow}>
                  <Link to={`/world/${profileKey}/products`} style={styles.link}>
                    ← Back to products
                  </Link>
                  <Link to={`/world/${profileKey}/cart?mode=products`} style={styles.link}>
                    Open cart
                  </Link>
                </div>
              </div>

              {/* RIGHT: details */}
              <div className="pd-right" style={styles.rightCol}>
                <div style={styles.detailsCard}>
                  <div style={styles.sheen} />

                  <div style={styles.topRow}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={styles.name}>{product?.name}</div>
                      {product?.category ? (
                        <div style={styles.meta}>{String(product.category).toUpperCase()}</div>
                      ) : null}
                      {product?.description ? <div style={styles.desc}>{product.description}</div> : null}
                    </div>

                    <div style={styles.priceBox}>
                      <div style={styles.priceLabel}>Price</div>
                      <div style={styles.priceValue}>{unitPriceText}</div>
                    </div>
                  </div>

                  {/* size */}
                  {sizes.length > 0 && (
                    <div style={styles.section}>
                      <div style={styles.sectionLabel}>Size</div>
                      <div style={styles.chipRow}>
                        {sizes.map((s) => {
                          const active = samePick(selectedSize, s);
                          return (
                            <button
                              key={s}
                              onClick={() => setSelectedSize(s)}
                              style={{ ...styles.chip, ...(active ? styles.chipActive : null) }}
                            >
                              <span style={{ ...styles.chipText, ...(active ? styles.chipTextActive : null) }}>{s}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* color */}
                  {colors.length > 0 && (
                    <div style={styles.section}>
                      <div style={styles.sectionLabel}>Color</div>
                      <div style={styles.chipRow}>
                        {colors.map((c) => {
                          const active = samePick(selectedColor, c);
                          return (
                            <button
                              key={c}
                              onClick={() => setSelectedColor(c)}
                              style={{ ...styles.chip, ...(active ? styles.chipActive : null) }}
                            >
                              <span style={{ ...styles.chipText, ...(active ? styles.chipTextActive : null) }}>{c}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* qty + subtotal */}
                  <div style={styles.summaryRow}>
                    <div style={styles.qtyBlock}>
                      <div style={styles.sectionLabel}>Quantity</div>
                      <div style={styles.qtyControls}>
                        <button onClick={onDec} style={styles.qtyBtn} aria-label="Decrease">
                          −
                        </button>
                        <div style={styles.qtyValue}>{quantity}</div>
                        <button onClick={onInc} style={styles.qtyBtn} aria-label="Increase">
                          +
                        </button>
                      </div>
                    </div>

                    <div style={styles.subBlock}>
                      <div style={styles.sectionLabel}>Subtotal</div>
                      <div style={styles.subtotal}>{subtotalText}</div>
                    </div>
                  </div>

                  {(mustPickSize || mustPickColor) && (
                    <div style={styles.helper}>
                      {mustPickSize && !selectedSize ? "Select a size. " : ""}
                      {mustPickColor && !selectedColor ? "Select a color." : ""}
                    </div>
                  )}

                  {/* mobile-only links */}
                  <div className="pd-linksMobile" style={styles.linksRowMobile}>
                    <Link to={`/world/${profileKey}/products`} style={styles.link}>
                      ← Back to products
                    </Link>
                    <Link to={`/world/${profileKey}/cart?mode=products`} style={styles.link}>
                      Open cart
                    </Link>
                  </div>
                </div>

                {/* sticky CTA bar (desktop) */}
                <div className="pd-cta" style={styles.ctaBar}>
                  <button onClick={onAddToCart} style={styles.ctaSecondary}>
                    Add to cart
                  </button>

                  <button
                    onClick={onBuyNow}
                    style={{ ...styles.ctaPrimary, ...(product?.inStock === false ? styles.ctaDisabled : null) }}
                    disabled={product?.inStock === false}
                  >
                    Buy now
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <div style={{ height: 28 }} />
      </div>

      {/* ✅ Zoom modal */}
      {isZoomOpen && product?.imageUrl ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Product image"
          style={styles.zoomOverlay}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeZoom();
          }}
        >
          <div style={styles.zoomTopBar}>
            <div style={styles.zoomTitle}>{product?.name || "Product"}</div>
            <button type="button" onClick={closeZoom} style={styles.zoomClose} aria-label="Close">
              ✕
            </button>
          </div>

          <img src={product.imageUrl} alt={product?.name || "Product"} style={styles.zoomImg} />

          <div style={styles.zoomFooter}>
            <span style={styles.zoomTip}>ESC to close • Click outside to close</span>
          </div>
        </div>
      ) : null}

      <style>{css}</style>
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
      "radial-gradient(900px 520px at 18% 0%, rgba(96,165,250,0.10), transparent 60%)," +
      "radial-gradient(850px 520px at 82% 20%, rgba(249,115,115,0.09), transparent 60%)," +
      "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.98))",
    pointerEvents: "none",
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px 10px",
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(0,0,0,0.35)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    fontSize: 22,
    lineHeight: "22px",
  },
  headerCenter: { flex: 1, textAlign: "center" },
  headerTitle: {
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: 0.6,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  headerSub: { marginTop: 3, fontSize: 11, color: "#cfd3dc", letterSpacing: 1.2 },

  container: { width: "100%", maxWidth: 1180, margin: "0 auto", padding: "18px 16px" },

  grid: { display: "grid", gridTemplateColumns: "1fr", gap: 14 },

  leftCol: { minWidth: 0 },
  rightCol: { minWidth: 0 },

  galleryCard: {
    position: "relative",
    borderRadius: 22,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(14px)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
  },
  galleryImg: {
    width: "100%",
    height: 520,
    objectFit: "cover",
    objectPosition: "center",
    display: "block",
  },
  galleryPlaceholder: {
    height: 520,
    display: "grid",
    placeItems: "center",
    gap: 8,
    background: "rgba(15,23,42,0.9)",
  },
  galleryPlaceholderText: { color: "#cfd3dc", fontSize: 12 },

  galleryOverlayTop: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    pointerEvents: "none",
  },

  detailsCard: {
    position: "relative",
    borderRadius: 22,
    overflow: "hidden",
    padding: 16,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(14px)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
  },
  sheen: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))",
    pointerEvents: "none",
  },

  topRow: {
    position: "relative",
    display: "flex",
    gap: 14,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  name: { fontSize: 20, fontWeight: 900 },
  meta: { marginTop: 6, fontSize: 11, color: "#e5e7eb", letterSpacing: 1, opacity: 0.9 },
  desc: { marginTop: 10, color: "#cbd5f5", fontSize: 13, lineHeight: "18px" },

  priceBox: {
    position: "relative",
    minWidth: 160,
    borderRadius: 16,
    padding: "10px 12px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.35)",
    textAlign: "right",
  },
  priceLabel: { fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", color: "#cfd3dc" },
  priceValue: { marginTop: 6, color: "#f97373", fontWeight: 900, fontSize: 14 },

  section: { position: "relative", marginTop: 14 },
  sectionLabel: { color: "#cfd3dc", fontSize: 12, textTransform: "uppercase", letterSpacing: 0.8 },
  chipRow: { marginTop: 10, display: "flex", flexWrap: "wrap", gap: 10 },
  chip: {
    borderRadius: 999,
    padding: "10px 12px",
    border: "1px solid rgba(255,255,255,0.20)",
    background: "rgba(0,0,0,0.35)",
    cursor: "pointer",
  },
  chipActive: { border: "1px solid rgba(249,115,115,0.9)", background: "rgba(249,115,115,0.18)" },
  chipText: { color: "#e5e7eb", fontSize: 12, fontWeight: 900 },
  chipTextActive: { color: "#fff" },

  summaryRow: {
    position: "relative",
    marginTop: 14,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    alignItems: "end",
  },
  qtyBlock: { minWidth: 0 },
  subBlock: { minWidth: 0, textAlign: "right" },

  qtyControls: { marginTop: 10, display: "inline-flex", alignItems: "center", gap: 10 },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.20)",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    cursor: "pointer",
    fontSize: 18,
    fontWeight: 900,
    display: "grid",
    placeItems: "center",
  },
  qtyValue: { minWidth: 24, textAlign: "center", fontWeight: 900 },

  subtotal: { marginTop: 10, fontWeight: 900, fontSize: 16 },

  helper: { position: "relative", marginTop: 10, color: "#9ca3af", fontSize: 11, textAlign: "center" },

  ctaBar: {
    marginTop: 12,
    display: "flex",
    gap: 10,
    padding: 12,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(15,23,42,0.80)",
    backdropFilter: "blur(12px)",
  },
  ctaSecondary: {
    flex: 1,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    padding: "12px 14px",
    cursor: "pointer",
    fontWeight: 900,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    fontSize: 12,
  },
  ctaPrimary: {
    flex: 1,
    borderRadius: 999,
    border: 0,
    background: "linear-gradient(90deg, #ff4b5c, #ff7b88)",
    color: "#fff",
    padding: "12px 14px",
    cursor: "pointer",
    fontWeight: 900,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    fontSize: 12,
  },
  ctaDisabled: { opacity: 0.55, cursor: "not-allowed" },

  linksRow: { marginTop: 10, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  linksRowMobile: { display: "none", marginTop: 14, justifyContent: "space-between", gap: 12, flexWrap: "wrap" },

  link: { color: "rgba(0,255,255,0.85)", textDecoration: "none", fontSize: 12 },

  center: { minHeight: 260, display: "grid", placeItems: "center", gap: 10, padding: 24, textAlign: "center" },
  spinner: {
    width: 18,
    height: 18,
    borderRadius: 999,
    border: "2px solid rgba(255,255,255,0.18)",
    borderTopColor: "#fff",
  },
  muted: { color: "#cfd3dc", fontSize: 13 },
  error: { color: "#fca5a5", fontSize: 13 },

  pill: {
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(0,0,0,0.55)",
    border: "1px solid rgba(255,255,255,0.18)",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: 0.9,
  },
  pillDanger: { background: "rgba(185,28,28,0.55)", border: "1px solid rgba(255,255,255,0.20)" },

  /* ✅ Zoom button wrapper */
  zoomBtn: {
    width: "100%",
    border: 0,
    padding: 0,
    background: "transparent",
    cursor: "zoom-in",
    display: "block",
    position: "relative",
  },
  zoomHint: {
    position: "absolute",
    right: 12,
    bottom: 12,
    padding: "8px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(10px)",
    pointerEvents: "none",
  },

  /* ✅ Zoom modal */
  zoomOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 9999,
    background: "rgba(0,0,0,0.78)",
    backdropFilter: "blur(10px)",
    display: "grid",
    gridTemplateRows: "auto 1fr auto",
    alignItems: "center",
    justifyItems: "center",
    padding: 16,
  },
  zoomTopBar: {
    width: "min(1100px, 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "10px 6px",
  },
  zoomTitle: {
    fontWeight: 900,
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  zoomClose: {
    width: 42,
    height: 42,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    fontSize: 16,
    fontWeight: 900,
  },
  zoomImg: {
    width: "min(1100px, 100%)",
    height: "min(78vh, 820px)",
    objectFit: "contain",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.35)",
    boxShadow: "0 30px 90px rgba(0,0,0,0.7)",
  },
  zoomFooter: {
    width: "min(1100px, 100%)",
    padding: "10px 6px 0",
    display: "flex",
    justifyContent: "center",
  },
  zoomTip: { fontSize: 11, color: "rgba(255,255,255,0.75)" },
};

const css = `
@keyframes pdSpin { to { transform: rotate(360deg); } }
.pd-spin { animation: pdSpin 0.9s linear infinite; }

.pd-grid { grid-template-columns: 1fr; }
@media (min-width: 980px) {
  .pd-grid { grid-template-columns: 1.1fr 0.9fr; align-items: start; }
  .pd-left { position: sticky; top: 86px; }
  .pd-cta { position: sticky; top: calc(86px + 540px + 14px); }
}

/* Mobile: show links inside details, not under image */
@media (max-width: 979px) {
  .pd-links { display: none !important; }
  .pd-linksMobile { display: flex !important; }
}

/* hover polish */
button:focus { outline: none; }
button:focus-visible { outline: 2px solid rgba(0,255,255,0.6); outline-offset: 2px; border-radius: 14px; }

/* subtle zoom feel */
.pd-gallery button:hover img { transform: scale(1.01); }
.pd-gallery img { transition: transform 160ms ease; }
`;
