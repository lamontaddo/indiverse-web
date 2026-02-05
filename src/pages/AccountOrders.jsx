// src/pages/AccountOrders.jsx ✅ FULL DROP-IN (Vite React) — REAL ORDERS (cross-profile) + PRODUCT IMAGE
// ✅ Adds item thumbnail from order.items[0].imageUrl / image / coverUrl (best-effort)
// ✅ If missing, shows a glass fallback tile

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function safeTrim(v) {
  return String(v ?? "").trim();
}

function readBuyerUser() {
  try {
    const raw = localStorage.getItem("buyerUser");
    if (!raw) return null;
    const u = JSON.parse(raw);
    if (!u || typeof u !== "object") return null;
    return u;
  } catch {
    return null;
  }
}

function isAuthedNow() {
  const token = safeTrim(localStorage.getItem("buyerToken"));
  const authed = safeTrim(localStorage.getItem("auth:isAuthed"));
  return !!token && authed === "1";
}

const REMOTE_CONFIG_URL =
  import.meta.env.VITE_REMOTE_CONFIG_URL ||
  "https://montech-remote-config.s3.amazonaws.com/superapp/config.json";

async function fetchRemoteConfig({ force = false } = {}) {
  const url = force ? `${REMOTE_CONFIG_URL}?v=${Date.now()}` : REMOTE_CONFIG_URL;
  const res = await fetch(url, {
    cache: "no-store",
    headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
  });
  if (!res.ok) throw new Error(`remote config failed (${res.status})`);
  return res.json();
}

function normalizeRealms(cfg) {
  const list = Array.isArray(cfg?.profiles) ? cfg.profiles : [];
  return list
    .filter((p) => p?.enabled !== false)
    .map((p) => ({
      key: safeTrim(p?.key).toLowerCase(),
      label: safeTrim(p?.label || p?.name || p?.key || "Realm"),
      apiBaseUrl: safeTrim(p?.apiBaseUrl || "").replace(/\/+$/, ""),
    }))
    .filter((p) => p.key && p.apiBaseUrl);
}

function moneyFromCents(cents, currency = "usd") {
  const n = Number(cents || 0);
  if (!Number.isFinite(n)) return "";
  const cur = safeTrim(currency || "usd").toUpperCase();
  const sign = cur === "USD" ? "$" : `${cur} `;
  return `${sign}${(n / 100).toFixed(2)}`;
}

function fmtDate(d) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleString();
}

function summarizeItems(items) {
  const arr = Array.isArray(items) ? items : [];
  if (!arr.length) return "—";
  const first = arr[0];
  const name = safeTrim(first?.name) || "Item";
  const qty = Number(first?.quantity || 1);
  const extra = arr.length > 1 ? ` +${arr.length - 1}` : "";
  return `${name}${qty > 1 ? ` (x${qty})` : ""}${extra}`;
}

// ✅ Best-effort thumbnail picker (works even before backend adds it)
function pickThumbFromOrder(order) {
  const items = Array.isArray(order?.items) ? order.items : [];
  const first = items[0] || {};
  const candidates = [
    first?.imageUrl,
    first?.imageURL,
    first?.imgUrl,
    first?.image,
    first?.photoUrl,
    first?.coverUrl,
    first?.thumbnailUrl,
    order?.imageUrl,
    order?.coverUrl,
    order?.thumbnailUrl,
  ]
    .map((x) => safeTrim(x))
    .filter(Boolean);

  return candidates[0] || "";
}

export default function AccountOrders() {
  const nav = useNavigate();

  const [buyerUser, setBuyerUser] = useState(() => readBuyerUser());
  const authed = useMemo(() => isAuthedNow(), [buyerUser]);

  const token = safeTrim(localStorage.getItem("buyerToken"));
  const userId = useMemo(() => {
    const fromStorage = safeTrim(localStorage.getItem("buyerUserId"));
    const fromUser = safeTrim(buyerUser?.id || buyerUser?._id || buyerUser?.userId);
    return fromStorage || fromUser || "";
  }, [buyerUser]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState("");
  const [items, setItems] = useState([]); // flattened orders across realms

  useEffect(() => {
    if (!authed) {
      nav("/auth/login?next=/account/orders");
      return;
    }

    const onStorage = (e) => {
      if (!e) return;
      if (
        e.key === "buyerUser" ||
        e.key === "buyerToken" ||
        e.key === "auth:isAuthed" ||
        e.key === "buyerUserId"
      ) {
        setBuyerUser(readBuyerUser());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [authed, nav]);

  const load = useCallback(
    async ({ force = false } = {}) => {
      if (!authed) return;

      try {
        force ? setRefreshing(true) : setLoading(true);
        setErr("");
        setItems([]);

        if (!userId) throw new Error("Missing buyer user id (buyerUserId / buyerUser.id).");

        const cfg = await fetchRemoteConfig({ force });
        const realms = normalizeRealms(cfg);

        const out = [];

        for (const r of realms) {
          try {
            const res = await fetch(`${r.apiBaseUrl}/api/orders/me?limit=50`, {
              method: "GET",
              headers: {
                "x-profile-key": r.key,
                "x-user-id": userId,
                Authorization: token ? `Bearer ${token}` : "",
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
              },
            });

            const data = await res.json().catch(() => null);

            if (!res.ok || !data?.ok) {
              console.log("[orders] realm failed", r.key, data?.error || res.status);
              continue;
            }

            const orders = Array.isArray(data?.orders) ? data.orders : [];
            for (const o of orders) {
              const mapped = {
                realmKey: r.key,
                realmLabel: r.label,
                apiBaseUrl: r.apiBaseUrl,

                id: safeTrim(o?._id || o?.id),
                status: safeTrim(o?.status || "unknown").toLowerCase(),
                purchaseType: safeTrim(o?.purchaseType || "products"),
                amountTotalCents: o?.amountTotalCents ?? 0,
                currency: safeTrim(o?.currency || "usd"),
                createdAt: o?.createdAt || o?.paidAt || null,
                stripeSessionId: safeTrim(o?.stripeSessionId || ""),
                items: Array.isArray(o?.items) ? o.items : [],
                _raw: o,
              };

              mapped.thumbUrl = pickThumbFromOrder(mapped._raw);
              out.push(mapped);
            }
          } catch (e) {
            console.log("[orders] realm error", r.key, e?.message);
          }
        }

        out.sort((a, b) => {
          const da = new Date(a.createdAt || 0).getTime() || 0;
          const db = new Date(b.createdAt || 0).getTime() || 0;
          return db - da;
        });

        setItems(out);
      } catch (e) {
        setErr(e?.message || "Unable to load orders.");
        setItems([]);
      } finally {
        force ? setRefreshing(false) : setLoading(false);
      }
    },
    [authed, token, userId]
  );

  useEffect(() => {
    if (authed) load({ force: false });
  }, [authed, load]);

  if (!authed) return null;

  const name = useMemo(() => {
    const first = safeTrim(buyerUser?.firstName);
    const last = safeTrim(buyerUser?.lastName);
    const email = safeTrim(buyerUser?.email);
    const n = `${first} ${last}`.trim();
    return n || email || "You";
  }, [buyerUser]);

  return (
    <div className="ordRoot">
      <div className="ordBg" />

      <div className="ordWrap">
        <div className="topRow">
          <button className="pillBtn" onClick={() => nav("/account")}>
            ← Account
          </button>

          <div className="rightRow">
            <button
              className="pillBtn"
              onClick={() => load({ force: true })}
              disabled={loading || refreshing}
            >
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
            <button className="pillBtn" onClick={() => nav("/")}>
              Home
            </button>
          </div>
        </div>

        <div className="header">
          <div className="title">Orders</div>
          <div className="sub">Purchases for {name} (cross-profile)</div>
        </div>

        {err ? <div className="error">{err}</div> : null}

        {loading ? (
          <div className="emptyCard">Loading…</div>
        ) : items.length === 0 ? (
          <div className="emptyCard">
            <div className="emptyTitle">No orders yet</div>
            <div className="emptySub">When you buy products, your orders will show up here.</div>
          </div>
        ) : (
          <div className="list">
            {items.map((o, idx) => {
              const id = o.id || o.stripeSessionId || String(idx);
              const status = safeTrim(o.status || "unknown");
              const badgeClass = `badge badge_${status.toLowerCase()}`;

              return (
                <button
                  key={`${o.realmKey}:${id}:${idx}`}
                  className="row"
                  onClick={() => nav(`/account/orders/${encodeURIComponent(id)}`)}
                  title="Order details page next"
                >
                  <div className="rowInner">
                    {/* ✅ THUMB */}
                    <div className="thumb">
                      {o.thumbUrl ? <img src={o.thumbUrl} alt="" /> : <div className="thumbFallback" />}
                      <div className="thumbGlow" />
                    </div>

                    <div className="rowBody">
                      <div className="rowTop">
                        <div className="rowLeft">
                          <div className="rowTitle">{summarizeItems(o.items)}</div>
                          <div className="rowMeta">
                            {o.createdAt ? fmtDate(o.createdAt) : "—"} • {o.purchaseType} •{" "}
                            {o.realmLabel}
                          </div>
                        </div>

                        <div className="rowRight">
                          <div className="rowTotal">
                            {moneyFromCents(o.amountTotalCents, o.currency)}
                          </div>
                          <div className={badgeClass}>{status}</div>
                        </div>
                      </div>

                      {o.stripeSessionId ? (
                        <div className="rowSub">session: {o.stripeSessionId}</div>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="note">Next: we’ll drop in the order details page.</div>
      </div>

      <style>{`
        .ordRoot{
          min-height: 100vh;
          position: relative;
          background: #05060b;
          color: #fff;
          overflow: hidden;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
        }
        .ordBg{
          position: fixed;
          inset: 0;
          background: radial-gradient(900px 500px at 50% 15%, rgba(0,255,255,0.08), transparent 60%),
                      linear-gradient(180deg, #0b1020, #090b14, #06070d);
          z-index: 0;
        }
        .ordWrap{
          position: relative;
          z-index: 1;
          max-width: 980px;
          margin: 0 auto;
          padding: 22px 16px 60px;
        }
        .topRow{
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 14px;
        }
        .rightRow{
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pillBtn{
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(0,0,0,0.28);
          color: rgba(255,255,255,0.9);
          padding: 10px 12px;
          border-radius: 999px;
          cursor: pointer;
          backdrop-filter: blur(12px);
        }
        .pillBtn:disabled{ opacity: 0.6; cursor: not-allowed; }

        .header{
          padding: 14px 14px 10px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.30);
          backdrop-filter: blur(14px);
          margin-bottom: 12px;
        }
        .title{ font-size: 20px; font-weight: 900; }
        .sub{ margin-top: 6px; color: rgba(255,255,255,0.7); font-size: 13px; }

        .error{
          margin: 10px 0 12px;
          padding: 12px 12px;
          border-radius: 14px;
          border: 1px solid rgba(255,80,80,0.25);
          background: rgba(255,80,80,0.08);
          color: rgba(255,255,255,0.92);
        }

        .emptyCard{
          padding: 16px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.30);
          backdrop-filter: blur(14px);
        }
        .emptyTitle{ font-weight: 900; font-size: 16px; }
        .emptySub{ margin-top: 8px; color: rgba(255,255,255,0.7); font-size: 13px; line-height: 1.4; }

        .list{
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .row{
          text-align: left;
          border-radius: 18px;
          padding: 12px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.30);
          color: #fff;
          cursor: pointer;
          backdrop-filter: blur(14px);
          transition: transform 120ms ease, opacity 120ms ease;
        }
        .row:active{ transform: scale(0.995); opacity: 0.95; }

        .rowInner{
          display:flex;
          align-items:center;
          gap: 12px;
        }

        .thumb{
          width: 52px;
          height: 52px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.06);
          position: relative;
          flex: 0 0 auto;
        }
        .thumb img{
          width:100%;
          height:100%;
          object-fit: cover;
          display:block;
        }
        .thumbFallback{
          width:100%;
          height:100%;
          background: rgba(255,255,255,0.06);
        }
        .thumbGlow{
          position:absolute;
          inset:-40%;
          background: radial-gradient(circle at 50% 50%, rgba(0,255,255,0.16), transparent 60%);
          pointer-events:none;
          opacity: 0.7;
        }

        .rowBody{ flex: 1; min-width: 0; }

        .rowTop{
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }
        .rowLeft{ min-width: 0; }
        .rowTitle{
          font-weight: 900;
          font-size: 14px;
          letter-spacing: 0.2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 520px;
        }
        .rowMeta{
          margin-top: 6px;
          color: rgba(255,255,255,0.65);
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 520px;
        }
        .rowRight{
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          min-width: 140px;
        }
        .rowTotal{ font-weight: 900; font-size: 14px; color: rgba(255,255,255,0.92); }
        .badge{
          font-size: 11px;
          padding: 5px 9px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.06);
          text-transform: uppercase;
          letter-spacing: 0.2px;
        }
        .rowSub{
          margin-top: 8px;
          color: rgba(255,255,255,0.55);
          font-size: 11px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .note{
          margin-top: 14px;
          color: rgba(255,255,255,0.55);
          font-size: 12px;
          text-align: center;
        }

        @media (max-width: 560px){
          .rowTitle, .rowMeta{ max-width: 230px; }
          .rowRight{ min-width: 120px; }
        }
      `}</style>
    </div>
  );
}
