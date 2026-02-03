// src/pages/FashionPage.jsx ✅ FULL DROP-IN (WEB, NO FALLBACKS)
// Route: /world/:profileKey/fashion
//
// ✅ Same world BG (bgUrl from navigation state -> remote config -> icon)
// ✅ GET /api/fashion?ts=... (sends x-profile-key)
// ✅ Supports shapes: raw array OR { ok, items: [] }
// ✅ NO fallback items
// ✅ Tags row filter
// ✅ Thumbnail/media is CLICKABLE to it.url (or link/productUrl/href)
//
// Expected item shape from API:
// { _id/id, brand, name, type, description, styleNote, tag, image, video, url }

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const DEFAULT_REMOTE_CONFIG_URL =
  import.meta.env.VITE_REMOTE_CONFIG_URL ||
  "https://montech-remote-config.s3.amazonaws.com/superapp/config.json";

/* ---------------- helpers ---------------- */

function safeUrl(s) {
  const v = typeof s === "string" ? s.trim() : "";
  return v ? v : null;
}
function isHttpUrl(s) {
  return typeof s === "string" && /^https?:\/\//i.test(s);
}
function cleanKey(v) {
  return String(v || "").trim().toLowerCase();
}

async function fetchRemoteConfig({ url = DEFAULT_REMOTE_CONFIG_URL, timeoutMs = 9000 } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { cache: "no-store", signal: ctrl.signal });
    if (!res.ok) throw new Error(`remote config fetch failed: ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

function getProfileByKeyFromCfg(cfg, key) {
  const list = Array.isArray(cfg?.profiles) ? cfg.profiles : [];
  const k = String(key || "").trim();
  return list.find((p) => String(p?.key || "").trim() === k) || null;
}

async function apiJson(path, { profileKey } = {}) {
  const base = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
  if (!base) throw new Error("VITE_API_BASE_URL is missing");
  const url = `${base}${path}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      ...(profileKey ? { "x-profile-key": profileKey } : {}),
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${path} failed (${res.status}): ${text || res.statusText}`);
  }
  return res.json();
}

function normalizeFashion(payload) {
  const raw = Array.isArray(payload) ? payload : Array.isArray(payload?.items) ? payload.items : [];
  return raw
    .map((x) => {
      const id = String(x?.id || x?._id || "").trim();
      return {
        id: id || undefined,
        brand: String(x?.brand || ""),
        name: String(x?.name || ""),
        type: String(x?.type || ""),
        description: String(x?.description || ""),
        styleNote: String(x?.styleNote || ""),
        tag: String(x?.tag || ""),
        image: safeUrl(x?.image),
        video: safeUrl(x?.video),
        url: safeUrl(x?.url || x?.link || x?.productUrl || x?.href),
      };
    })
    .filter((x) => !!x.id);
}

function pickOwnerLabel(profile, profileKey) {
  return (
    profile?.ownerName ||
    profile?.label ||
    (profileKey ? profileKey.charAt(0).toUpperCase() + profileKey.slice(1) : "Fashion")
  );
}

/* ---------------- page ---------------- */

export default function FashionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profileKey: paramsProfileKey } = useParams();

  const profileKey = useMemo(() => cleanKey(paramsProfileKey) || "lamont", [paramsProfileKey]);

  const [cfg, setCfg] = useState(null);
  const profile = useMemo(() => getProfileByKeyFromCfg(cfg, profileKey), [cfg, profileKey]);

  const bgUrl = useMemo(() => {
    const paramBg = safeUrl(location?.state?.bgUrl);
    const remoteIntro = safeUrl(profile?.assets?.introBgImageUrl);
    const remoteIcon = safeUrl(profile?.assets?.iconUrl);

    if (paramBg && isHttpUrl(paramBg)) return paramBg;
    if (remoteIntro && isHttpUrl(remoteIntro)) return remoteIntro;
    if (remoteIcon && isHttpUrl(remoteIcon)) return remoteIcon;
    return null;
  }, [location?.state?.bgUrl, profile]);

  const ownerLabel = useMemo(() => pickOwnerLabel(profile, profileKey), [profile, profileKey]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorNote, setErrorNote] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [query, setQuery] = useState("");

  // load remote config (bg fallback)
  useEffect(() => {
    let alive = true;
    fetchRemoteConfig()
      .then((data) => alive && setCfg(data))
      .catch(() => {})
      .finally(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorNote("");
    try {
      const ts = Date.now();
      const data = await apiJson(`/api/fashion?ts=${ts}`, { profileKey });
      const list = normalizeFashion(data);
      setItems(list);
      if (!list.length) setErrorNote("No items yet.");
    } catch (e) {
      setItems([]);
      setErrorNote(String(e?.message || "Failed to load fashion."));
    } finally {
      setLoading(false);
    }
  }, [profileKey]);

  useEffect(() => {
    load();
  }, [load]);

  const tags = useMemo(() => {
    const s = new Set();
    items.forEach((it) => {
      if (it.tag) s.add(it.tag);
    });
    return Array.from(s);
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (activeTag && it.tag !== activeTag) return false;
      if (!q) return true;
      const hay = `${it.brand} ${it.name} ${it.type} ${it.tag} ${it.description} ${it.styleNote}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, activeTag, query]);

  const metaChips = useMemo(() => {
    const base = ["Closet", "Vibe", "Story"];
    return [ownerLabel, ...base];
  }, [ownerLabel]);

  return (
    <div className="fs-root">
      <div className="fs-bg" style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined} />
      <div className="fs-dim" />

      <div className="fs-shell">
        {/* top bar */}
        <div className="fs-topBar">
          <div className="fs-left">
            <div className="fs-kicker">FASHION</div>
            <div className="fs-title">Lookbook</div>
            <div className="fs-sub">
              <span>{profileKey}</span>
              <span className="fs-dot">•</span>
              <span>{filtered.length} item{filtered.length === 1 ? "" : "s"}</span>
            </div>

            <div className="fs-chipRow">
              {metaChips.map((t) => (
                <span className="fs-metaChip" key={t}>
                  {t}
                </span>
              ))}
            </div>

            {errorNote ? <div className="fs-error">{errorNote}</div> : null}
          </div>

          <div className="fs-actions">
            <button className="fs-iconBtn" onClick={load} title="Refresh" aria-label="Refresh">
              ⟳
            </button>
            <button className="fs-iconBtn" onClick={() => navigate(-1)} title="Close" aria-label="Close">
              ✕
            </button>
          </div>
        </div>

        {/* controls */}
        <div className="fs-controls">
          <div className="fs-search">
            <span className="fs-searchIcon" aria-hidden>
              ⌕
            </span>
            <input
              className="fs-searchInput"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brand, piece, type…"
              spellCheck={false}
            />
          </div>

          {tags.length ? (
            <div className="fs-tags">
              <button
                className={`fs-tag ${!activeTag ? "fs-tagActive" : ""}`}
                onClick={() => setActiveTag(null)}
              >
                All
              </button>
              {tags.map((t) => (
                <button
                  key={t}
                  className={`fs-tag ${activeTag === t ? "fs-tagActive" : ""}`}
                  onClick={() => setActiveTag((prev) => (prev === t ? null : t))}
                >
                  {t}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* content */}
        {loading ? (
          <div className="fs-center">
            <div className="fs-muted">Loading looks…</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="fs-center">
            <div className="fs-muted">No items yet.</div>
          </div>
        ) : (
          <div className="fs-grid">
            {filtered.map((it) => {
              const clickable = it.url && isHttpUrl(it.url);
              const MediaInner = (
                <>
                  {it.video ? (
                    <video
                      className="fs-mediaEl"
                      src={it.video}
                      muted
                      playsInline
                      loop
                      autoPlay
                      preload="metadata"
                    />
                  ) : it.image ? (
                    <img className="fs-mediaEl" src={it.image} alt="" />
                  ) : (
                    <div className="fs-noMedia">No media</div>
                  )}

                  <div className="fs-mediaGrad" />

                  {it.brand ? <div className="fs-brandPill">{it.brand}</div> : null}
                  {it.tag ? <div className="fs-tagPill">{it.tag}</div> : null}

                  {clickable ? <div className="fs-openPill">Open ↗</div> : null}
                </>
              );

              return (
                <div className="fs-card" key={it.id}>
                  <div className="fs-media">
                    {clickable ? (
                      <a className="fs-mediaLink" href={it.url} target="_blank" rel="noreferrer">
                        {MediaInner}
                      </a>
                    ) : (
                      MediaInner
                    )}
                  </div>

                  <div className="fs-cardBody">
                    <div className="fs-piece">{it.name || "Untitled"}</div>
                    <div className="fs-type">
                      {it.type || "—"}
                      {it.tag ? ` • ${it.tag}` : ""}
                    </div>

                    {it.styleNote ? (
                      <div className="fs-desc">{it.styleNote}</div>
                    ) : it.description ? (
                      <div className="fs-desc fs-descDim">{it.description}</div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        :root{
          --glass: rgba(255,255,255,0.06);
          --stroke: rgba(255,255,255,0.12);
          --stroke2: rgba(255,255,255,0.16);
        }

        .fs-root{
          min-height: 100vh;
          background:#000;
          color:#fff;
          position:relative;
          overflow:hidden;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        }

        .fs-bg{
          position: fixed;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 0;
          filter: saturate(1.05) contrast(1.05);
          transform: translateZ(0);
        }
        .fs-dim{
          position: fixed;
          inset: 0;
          z-index: 1;
          background:
            radial-gradient(900px 600px at 22% 8%, rgba(255,255,255,0.10), rgba(0,0,0,0) 55%),
            radial-gradient(900px 600px at 78% 0%, rgba(255,255,255,0.06), rgba(0,0,0,0) 60%),
            linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.88));
        }

        .fs-shell{
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 26px 22px 28px;
        }

        .fs-topBar{
          display:flex;
          align-items:flex-start;
          justify-content: space-between;
          gap: 16px;
        }
        .fs-left{ min-width: 0; }

        .fs-kicker{
          font-size: 12px;
          letter-spacing: 2.8px;
          font-weight: 950;
          opacity: 0.78;
        }
        .fs-title{
          font-size: 44px;
          font-weight: 950;
          letter-spacing: 0.4px;
          margin-top: 6px;
          line-height: 1.04;
          text-shadow: 0 24px 60px rgba(0,0,0,0.45);
        }
        .fs-sub{
          margin-top: 10px;
          color: rgba(255,255,255,0.72);
          font-size: 13px;
          letter-spacing: 0.5px;
          display:flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items:center;
        }
        .fs-dot{ opacity: 0.8; }

        .fs-chipRow{
          margin-top: 10px;
          display:flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .fs-metaChip{
          height: 26px;
          display:inline-flex;
          align-items:center;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.32);
          color: rgba(255,255,255,0.78);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .4px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .fs-error{
          margin-top: 10px;
          color: rgba(252,165,165,0.95);
          font-size: 12px;
          letter-spacing: 0.2px;
        }

        .fs-actions{
          display:flex;
          align-items:center;
          gap:10px;
          padding-top: 6px;
        }
        .fs-iconBtn{
          width: 34px;
          height: 34px;
          border-radius: 999px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.38);
          color: #fff;
          display:grid;
          place-items:center;
          cursor:pointer;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 10px 26px rgba(0,0,0,0.32);
          transition: transform 120ms ease, opacity 120ms ease, border-color 120ms ease;
        }
        .fs-iconBtn:hover{ border-color: var(--stroke2); }
        .fs-iconBtn:active{ transform: scale(0.98); opacity: 0.92; }

        .fs-controls{
          margin-top: 18px;
          display:flex;
          align-items:flex-start;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .fs-search{
          flex: 1;
          min-width: 280px;
          height: 44px;
          display:flex;
          align-items:center;
          gap: 10px;
          padding: 0 14px;
          border-radius: 18px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.30);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 10px 26px rgba(0,0,0,0.28);
        }
        .fs-searchIcon{ opacity: 0.75; font-weight: 900; }
        .fs-searchInput{
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          color:#fff;
          font-size: 14px;
          letter-spacing: 0.2px;
        }
        .fs-searchInput::placeholder{ color: rgba(255,255,255,0.55); }

        .fs-tags{
          display:flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items:center;
        }
        .fs-tag{
          height: 32px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(0,0,0,0.35);
          color: rgba(255,255,255,0.78);
          font-weight: 950;
          font-size: 12px;
          letter-spacing: 0.3px;
          cursor:pointer;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: transform 120ms ease, opacity 120ms ease, border-color 120ms ease;
        }
        .fs-tag:hover{ border-color: rgba(255,255,255,0.20); }
        .fs-tag:active{ transform: scale(0.98); opacity: 0.92; }
        .fs-tagActive{
          background: rgba(255,255,255,0.86);
          border-color: rgba(255,255,255,0.86);
          color: #0b0b12;
        }

        .fs-grid{
          margin-top: 14px;
          display:grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 14px;
        }

        .fs-card{
          grid-column: span 4;
          border-radius: 18px;
          border: 1px solid var(--stroke);
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.035));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 18px 48px rgba(0,0,0,0.42);
          overflow:hidden;
          transition: transform 140ms ease, border-color 140ms ease;
        }
        .fs-card:hover{
          transform: translateY(-1px);
          border-color: var(--stroke2);
        }

        .fs-media{
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          overflow:hidden;
          background: rgba(0,0,0,0.25);
        }
        .fs-mediaEl{
          width: 100%;
          height: 100%;
          object-fit: cover;
          display:block;
        }

        .fs-mediaLink{
          position:absolute;
          inset:0;
          display:block;
          color: inherit;
          text-decoration:none;
        }
        .fs-mediaLink:focus-visible{
          outline: 2px solid rgba(255,255,255,0.85);
          outline-offset: -2px;
        }

        .fs-openPill{
          position:absolute;
          right: 10px;
          top: 10px;
          height: 24px;
          padding: 0 10px;
          border-radius: 999px;
          background: rgba(0,0,0,0.55);
          border: 1px solid rgba(255,255,255,0.16);
          display:flex;
          align-items:center;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: .25px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          opacity: 0.92;
        }

        .fs-noMedia{
          width: 100%;
          height: 100%;
          display:grid;
          place-items:center;
          color: rgba(255,255,255,0.65);
          font-size: 12px;
          letter-spacing: .2px;
        }
        .fs-mediaGrad{
          position:absolute;
          left:0; right:0; bottom:0;
          height: 52%;
          background: linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.80));
          pointer-events:none;
        }

        .fs-brandPill{
          position:absolute;
          top: 10px;
          left: 10px;
          height: 24px;
          padding: 0 10px;
          border-radius: 999px;
          background: rgba(0,0,0,0.55);
          border: 1px solid rgba(255,255,255,0.16);
          display:flex;
          align-items:center;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: .35px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .fs-tagPill{
          position:absolute;
          bottom: 10px;
          left: 10px;
          height: 24px;
          padding: 0 10px;
          border-radius: 999px;
          background: rgba(15,23,42,0.72);
          border: 1px solid rgba(199,210,254,0.24);
          display:flex;
          align-items:center;
          color: rgba(199,210,254,0.95);
          font-size: 11px;
          font-weight: 950;
          letter-spacing: .35px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .fs-cardBody{
          padding: 12px 12px 14px;
        }
        .fs-piece{
          font-size: 15px;
          font-weight: 950;
          letter-spacing: .2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .fs-type{
          margin-top: 4px;
          color: rgba(255,255,255,0.72);
          font-size: 12px;
          letter-spacing: .2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .fs-desc{
          margin-top: 8px;
          font-size: 12px;
          line-height: 1.35;
          color: rgba(255,255,255,0.80);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .fs-descDim{ color: rgba(255,255,255,0.66); }

        .fs-center{
          margin-top: 22px;
          min-height: 44vh;
          display:flex;
          align-items:center;
          justify-content:center;
          text-align:center;
          padding: 18px;
        }
        .fs-muted{
          color: rgba(255,255,255,0.70);
          letter-spacing: 0.3px;
        }

        @media (max-width: 1080px){
          .fs-card{ grid-column: span 6; }
        }
        @media (max-width: 740px){
          .fs-title{ font-size: 36px; }
          .fs-card{ grid-column: span 12; }
        }
        @media (prefers-reduced-motion: reduce){
          .fs-card, .fs-iconBtn, .fs-tag{ transition: none; }
        }
      `}</style>
    </div>
  );
}
