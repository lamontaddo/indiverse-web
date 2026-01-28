// src/pages/OwnerHomePage.jsx ✅ FULL DROP-IN (Web) — ENHANCED + BACK TO INDIVERSE + PRODUCTS FIX + PORTFOLIO FIX + CONSULTATION/ FLOWER ORDERS ALIAS
// Route: /world/:profileKey/owner/home
//
// ✅ FIX: Products tile routes to /world/:profileKey/owner/products
// ✅ FIX: Portfolio tile now routes to /world/:profileKey/owner/portfolio
// ✅ FIX: Supports remote-config tiles using `ownerconsultation` by aliasing to /owner/flowerorders
// ✅ Adds routeMap.ownerproducts + routeMap.ownerorders + routeMap.ownerportfolio
// ✅ Adds routeMap.ownerconsultation + routeMap.ownerflowerorders -> "flowerorders"
// ✅ builtOwnerRoutes includes "products" + "orders" + "portfolio" + "flowerorders"
// ✅ Adds fallback Products tile + Portfolio tile + Flower Orders tile
// ✅ Keeps large icon look + Back to IndiVerse button + enhanced UI

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getProfileByKey } from "../services/profileRegistry";

const SPEED = 0.55;
const AMP_BOOST = 1.1;

const FALLBACK_OWNER_ITEMS = [
  { key: "about", label: "About", ionicon: "person-circle", to: "ownerabout", size: 150 },
  { key: "contacts", label: "Contacts", ionicon: "people", to: "ownercontacts", size: 160 },
  { key: "messages", label: "Messages", ionicon: "chatbubbles", to: "ownermessages", size: 150 },
  { key: "playlist", label: "Playlist", ionicon: "list", to: "ownerplaylist", size: 165 },
  { key: "music", label: "Music", ionicon: "musical-notes", to: "ownermusic", size: 160 },

  // ✅ consultation / flower orders (alias-safe)
  { key: "flowerorders", label: "Flower Orders", ionicon: "rose", to: "ownerconsultation", size: 160 },

  // ✅ products (important)
  { key: "products", label: "Products", ionicon: "cart", to: "ownerproducts", size: 160 },

  // ✅ portfolio
  { key: "portfolio", label: "Portfolio", ionicon: "images", to: "ownerportfolio", size: 155 },

  { key: "fashion", label: "Fashion", ionicon: "shirt", to: "ownerfashion", size: 155 },
  { key: "videos", label: "Videos", ionicon: "videocam", to: "ownervideos", size: 155 },
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
    size: Number(it.size ?? 150),
    params: it.params || null,
  }));
}

// --- Ionicon → Emoji (intentional web stand-in) ---
function ionToEmoji(name = "", tile = null) {
  const k = String(name).toLowerCase();
  const key = String(tile?.key || "").toLowerCase();
  const to = String(tile?.to || "").toLowerCase();
  const label = String(tile?.label || "").toLowerCase();

  // ✅ FORCE messages icon by tile identity (not ionicon)
  if (key === "messages" || to.includes("messages") || label === "messages") return "🗨️";

  // ✅ consultation / flower orders
  if (key === "flowerorders" || to.includes("consultation") || to.includes("flowerorders") || label.includes("flower"))
    return "🌹";

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
  if (k.includes("cart") || k.includes("bag") || k.includes("cash")) return "🛒";
  if (k.includes("home")) return "🏠";
  return "◉";
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

  const TILES = useMemo(() => normalizeOwnerItems(profile), [profile]);

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

  // ✅ route aliases (remote config might emit "ownerconsultation")
  const routeMap = {
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

    // ✅ ALIASES -> /owner/flowerorders
    ownerflowerorders: "flowerorders",
    ownerconsultation: "flowerorders",
  };

  // ✅ allow-list for navigation
  const builtOwnerRoutes = new Set([
    "home",
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


  const handleTilePress = (tile) => {
    if (!profileKey) return;

    const raw = String(tile.to).toLowerCase().trim();

    // routeMap first; otherwise strip "owner" prefix
    let tool = routeMap[raw] || raw.replace(/^owner/, "");

    // ✅ extra safety: if remote config uses "consultation" without "owner"
    if (tool === "consultation") tool = "flowerorders";

    console.log("[OwnerHomePage] tile", raw, "-> tool:", tool);

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
              <div className="oh-label">{t.label}</div>
            </div>
          </button>
        ))}
      </div>

      <div style={styles.footerNote}>
        <span style={{ opacity: 0.9 }}>Profile:</span>{" "}
        <span style={{ color: "rgba(226,232,240,0.95)", fontWeight: 900 }}>{profileKey || "—"}</span>
      </div>
    </div>
  );
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

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #020617, #0b1220)",
    color: "#e5e7eb",
    overflow: "hidden",
    position: "relative",
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
    padding: "34px 22px 10px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 14,
  },
  headerLeft: {},
  headerRight: { display: "flex", alignItems: "center", gap: 10 },
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
  missingBox: {
    position: "relative",
    zIndex: 2,
    margin: "10px 22px 0",
    padding: 12,
    borderRadius: 16,
    border: "1px solid rgba(248,113,113,0.7)",
    background: "rgba(248,113,113,0.08)",
  },
  missingTitle: { color: "#fecaca", fontWeight: 900, fontSize: 13 },
  missingText: { marginTop: 6, color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 700 },
  field: {
    position: "relative",
    zIndex: 2,
    padding: 18,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 18,
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

  .oh-tile{
    border-radius: 28px;
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
    font-size: 48px;
    line-height: 1;
    filter: drop-shadow(0 10px 22px rgba(0,0,0,0.45));
  }

  .oh-label{
    font-size: 14px;
    font-weight: 900;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(226,232,240,0.95);
    text-shadow: 0 14px 32px rgba(0,0,0,0.45);
  }

  @media (max-width: 520px){
    .oh-icon{ font-size: 42px; }
    .oh-label{ font-size: 13px; }
    .oh-pill{ font-size: 10px; }
  }
  `;
}
