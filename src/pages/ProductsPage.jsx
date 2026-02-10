// src/pages/ProductsPage.jsx ✅ FULL DROP-IN (Web, IG FEED)
// Route: /world/:profileKey/products
//
// ✅ IG feed vibe: smaller tiles, more columns
// ✅ Responsive grid: 2/3/4/5/6 cols
// ✅ Single product: centered, not full-bleed
// ✅ Odd count: last item spans full row ONLY on small screens
// ✅ GET /api/products scoped by profileKey
// ✅ Click -> /world/:profileKey/products/:productId (passes product via router state)
// ✅ Cart icon -> /world/:profileKey/cart?mode=products

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useCart } from "../CartContext";
import { profileFetchRaw } from "../services/profileApi";

function formatPrice(priceCents) {
  const n = Number(priceCents || 0);
  if (!n || n <= 0) return "Pricing on request";
  const dollars = (n / 100).toFixed(0);
  return `$${Number(dollars).toLocaleString()}`;
}

function getId(p, fallback) {
  return String(p?._id || p?.id || fallback || "");
}

export default function ProductsPage() {
  const { profileKey = "lamont" } = useParams();
  const navigate = useNavigate();

  const { cartCount } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorText, setErrorText] = useState(null);

  const fetchProducts = useCallback(
    async (opts = { isRefresh: false }) => {
      try {
        if (opts.isRefresh) setRefreshing(true);
        else setLoading(true);

        const res = await profileFetchRaw(profileKey, "/api/products", {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          console.log("[ProductsPage] non-OK", res.status, txt.slice(0, 300));
          throw new Error("Failed to load products");
        }

        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
        setErrorText(null);
      } catch (err) {
        console.log("Error loading products:", err);
        setErrorText("Unable to load products at the moment.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [profileKey]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await fetchProducts({ isRefresh: false });
    })();
    return () => {
      mounted = false;
    };
  }, [fetchProducts]);

  const gridData = useMemo(() => (Array.isArray(products) ? [...products] : []), [products]);

  const isOdd = products.length % 2 === 1;
  const lastRealIndex = products.length - 1;
  const isSingle = products.length === 1;

  const onBack = () => navigate(`/world/${profileKey}`);
  const onCart = () => navigate(`/world/${profileKey}/cart?mode=products`);

  const onOpenProduct = (p) => {
    const id = getId(p);
    if (!id) return;
    navigate(`/world/${profileKey}/products/${id}`, {
      state: { product: p, profileKey, cartMode: "products" },
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.bg} />

      {/* Header */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.iconBtn} aria-label="Back">
          ‹
        </button>

        <div style={styles.headerCenter}>
          <div style={styles.titleRow}>
            <span style={styles.dot} />
            <div style={styles.title}>Products</div>
          </div>
          <div style={styles.subtitle}>DROPS • ESSENTIALS • EXCLUSIVE</div>
        </div>

        <button onClick={onCart} style={styles.iconBtn} aria-label="Cart">
          🛒
          {cartCount > 0 && (
            <span style={styles.cartBadge}>{cartCount > 9 ? "9+" : cartCount}</span>
          )}
        </button>
      </div>

      <div style={styles.container}>
        <div style={styles.topRow}>
          <button
            onClick={() => fetchProducts({ isRefresh: true })}
            style={styles.refreshBtn}
            disabled={loading || refreshing}
            title="Refresh"
          >
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>

          <Link to={`/world/${profileKey}`} style={styles.link}>
            Return to {profileKey}
          </Link>
        </div>

        {loading ? (
          <div style={styles.center}>
            <div className="pp-spin" style={styles.spinner} />
            <div style={styles.muted}>Loading products…</div>
          </div>
        ) : errorText ? (
          <div style={styles.center}>
            <div style={styles.error}>{errorText}</div>
          </div>
        ) : products.length === 0 ? (
          <div style={styles.center}>
            <div style={styles.muted}>No products yet. Check back soon.</div>
          </div>
        ) : (
          <div
            className={`pp-grid ${isSingle ? "pp-grid--single" : ""}`}
            style={styles.grid}
          >
            {gridData.map((p, index) => {
              const id = getId(p, index);

              // ✅ Only span last odd item on small screens (handled via CSS breakpoint)
              const isLastReal = index === lastRealIndex;
              const span = !isSingle && isOdd && isLastReal;

              const img =
  (p?.imageUrl && String(p.imageUrl).trim()) ||
  (Array.isArray(p?.imageUrls) && p.imageUrls[0] ? String(p.imageUrls[0]).trim() : "") ||
  "";

              const name = p?.name || "Item";
              const price = formatPrice(p?.priceCents);
              const inStock = p?.inStock !== false;

              return (
                <button
                  key={id}
                  onClick={() => onOpenProduct(p)}
                  className={`pp-tileBtn ${span ? "pp-span-sm" : ""}`}
                  style={styles.tileBtn}
                  title={name}
                >
                  <div className="pp-tile" style={styles.tile}>
                    <div className="pp-mediaWrap" style={styles.mediaWrap}>
                      {img ? (
                        <img
                          src={img}
                          alt={name}
                          className="pp-media"
                          style={styles.media}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div style={styles.mediaPlaceholder}>
                          <div style={{ fontSize: 16, opacity: 0.9 }}>🖼️</div>
                          <div style={styles.mediaPlaceholderText}>No image</div>
                        </div>
                      )}

                      {/* top overlay */}
                      <div style={styles.topOverlay}>
                        <div style={styles.pill}>PRODUCT</div>
                        {!inStock && (
                          <div style={{ ...styles.pill, ...styles.pillDanger }}>OUT</div>
                        )}
                      </div>

                      {/* bottom overlay */}
                      <div style={styles.bottomOverlay}>
                        <div style={styles.bottomRow}>
                          <div style={styles.name} title={name}>
                            {name}
                          </div>
                          <div style={styles.price}>{price}</div>
                        </div>
                      </div>

                      <div style={styles.fadeTop} />
                      <div style={styles.fadeBottom} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div style={{ height: 28 }} />
      </div>

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
      "linear-gradient(rgba(0,0,0,0.78), rgba(0,0,0,0.99))",
    pointerEvents: "none",
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 14px 10px",
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(0,0,0,0.40)",
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
    position: "relative",
    fontSize: 18,
  },
  cartBadge: {
    position: "absolute",
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    padding: "0 5px",
    borderRadius: 999,
    background: "#f97373",
    color: "#fff",
    fontSize: 10,
    fontWeight: 900,
    display: "grid",
    placeItems: "center",
    border: "1px solid rgba(0,0,0,0.35)",
  },

  headerCenter: { flex: 1, textAlign: "center" },
  titleRow: { display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 999,
    background: "rgba(96,165,250,0.95)",
    boxShadow: "0 0 0 5px rgba(96,165,250,0.12)",
  },
  title: { fontSize: 18, fontWeight: 900, letterSpacing: 1 },
  subtitle: { marginTop: 3, fontSize: 10, color: "#cfd3dc", letterSpacing: 1.2 },

  container: {
    width: "100%",
    maxWidth: 1380, // ✅ wider for more columns
    margin: "0 auto",
    padding: "14px 12px",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  refreshBtn: {
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(0,0,0,0.35)",
    color: "#fff",
    borderRadius: 999,
    padding: "9px 12px",
    cursor: "pointer",
    fontWeight: 800,
    letterSpacing: 0.6,
    fontSize: 12,
  },
  link: { color: "rgba(0,255,255,0.85)", textDecoration: "none", fontSize: 12 },

  center: {
    minHeight: 240,
    display: "grid",
    placeItems: "center",
    gap: 10,
    padding: 24,
    textAlign: "center",
  },
  spinner: {
    width: 18,
    height: 18,
    borderRadius: 999,
    border: "2px solid rgba(255,255,255,0.18)",
    borderTopColor: "#fff",
  },
  muted: { color: "#cfd3dc", fontSize: 13 },
  error: { color: "#fca5a5", fontSize: 13 },

  grid: { display: "grid", gap: 10 }, // ✅ tighter gap

  tileBtn: {
    border: 0,
    padding: 0,
    background: "transparent",
    cursor: "pointer",
    textAlign: "left",
  },
  tile: {
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.35)",
    boxShadow: "0 14px 34px rgba(0,0,0,0.42)",
  },

  // ✅ IG-ish tiles: slightly portrait but compact
  mediaWrap: {
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1", // tighter / more IG grid
    background: "rgba(15,23,42,0.92)",
    overflow: "hidden",
  },
  media: {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
    objectPosition: "center",
  },
  mediaPlaceholder: {
    width: "100%",
    height: "100%",
    display: "grid",
    placeItems: "center",
    gap: 6,
    color: "rgba(255,255,255,0.8)",
  },
  mediaPlaceholderText: { fontSize: 11, fontWeight: 800, opacity: 0.8 },

  fadeTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    background: "linear-gradient(rgba(0,0,0,0.55), transparent)",
    pointerEvents: "none",
  },
  fadeBottom: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 76,
    background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
    pointerEvents: "none",
  },

  topOverlay: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    pointerEvents: "none",
  },
  pill: {
    padding: "5px 9px",
    borderRadius: 999,
    background: "rgba(0,0,0,0.55)",
    border: "1px solid rgba(255,255,255,0.18)",
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: 0.9,
  },
  pillDanger: {
    background: "rgba(185,28,28,0.55)",
    border: "1px solid rgba(255,255,255,0.20)",
  },

  bottomOverlay: {
    position: "absolute",
    left: 8,
    right: 8,
    bottom: 8,
    pointerEvents: "none",
  },
  bottomRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  name: {
    flex: 1,
    fontSize: 12,
    fontWeight: 900,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  price: { color: "#f97373", fontWeight: 900, fontSize: 11 },
};

const css = `
@keyframes ppSpin { to { transform: rotate(360deg); } }
.pp-spin { animation: ppSpin 0.9s linear infinite; }

/* ✅ IG feed: more columns as screen grows */
.pp-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
@media (min-width: 720px)  { .pp-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (min-width: 980px)  { .pp-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
@media (min-width: 1220px) { .pp-grid { grid-template-columns: repeat(5, minmax(0, 1fr)); } }
@media (min-width: 1500px) { .pp-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); } }

/* ✅ single product: centered, compact */
.pp-grid--single {
  grid-template-columns: minmax(0, 420px);
  justify-content: center;
}

/* ✅ odd last item spans ONLY on small screens (2-col) */
.pp-span-sm { }
@media (max-width: 719px) {
  .pp-span-sm { grid-column: 1 / -1; }
}

/* hover */
.pp-tile { transition: transform 140ms ease, box-shadow 140ms ease; }
.pp-tileBtn:hover .pp-tile { transform: translateY(-2px); box-shadow: 0 18px 44px rgba(0,0,0,0.55); }

/* focus */
button:focus { outline: none; }
button:focus-visible { outline: 2px solid rgba(0,255,255,0.6); outline-offset: 2px; border-radius: 14px; }
`;
