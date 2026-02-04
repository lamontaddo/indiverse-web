// src/pages/AccountOrders.jsx ✅ FULL DROP-IN (Vite React)
// ✅ Basic Orders page (placeholder-ready)
// ✅ Reads auth from localStorage
// ✅ Tries to fetch orders if API_BASE is set; otherwise shows empty state
// ✅ Route: /account/orders

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function safeTrim(v) {
  return String(v || "").trim();
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

// ✅ Uses your existing env pattern if present. If not, it will gracefully fall back.
function getApiBase() {
  return (
    safeTrim(import.meta.env.VITE_API_BASE_URL) ||
    safeTrim(import.meta.env.VITE_API_BASE) ||
    ""
  ).replace(/\/+$/, "");
}

async function fetchOrders() {
  const base = getApiBase();
  if (!base) return { ok: true, items: [], note: "No VITE_API_BASE_URL set." };

  const token = safeTrim(localStorage.getItem("buyerToken"));
  const res = await fetch(`${base}/api/orders/my`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return { ok: false, error: data?.error || `Orders fetch failed (${res.status})` };
  }

  // accept shapes: [] OR { ok, orders } OR { ok, items }
  const items = Array.isArray(data) ? data : Array.isArray(data?.orders) ? data.orders : data?.items;
  return { ok: true, items: Array.isArray(items) ? items : [] };
}

function money(cents) {
  const n = Number(cents);
  if (!Number.isFinite(n)) return "";
  return `$${(n / 100).toFixed(2)}`;
}

function fmtDate(d) {
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toLocaleString();
}

export default function AccountOrders() {
  const nav = useNavigate();
  const [buyerUser, setBuyerUser] = useState(() => readBuyerUser());

  const authed = useMemo(() => isAuthedNow(), [buyerUser]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!authed) {
      nav("/auth/login?next=/account/orders");
      return;
    }

    const onStorage = (e) => {
      if (!e) return;
      if (e.key === "buyerUser" || e.key === "buyerToken" || e.key === "auth:isAuthed") {
        setBuyerUser(readBuyerUser());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [authed, nav]);

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const out = await fetchOrders();
      if (!out.ok) {
        setErr(out.error || "Unable to load orders.");
        setItems([]);
      } else {
        setItems(out.items || []);
      }
    } catch (e) {
      setErr(e?.message || "Unable to load orders.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

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
            <button className="pillBtn" onClick={load} disabled={loading}>
              {loading ? "Refreshing…" : "Refresh"}
            </button>
            <button className="pillBtn" onClick={() => nav("/")}>
              Home
            </button>
          </div>
        </div>

        <div className="header">
          <div className="title">Orders</div>
          <div className="sub">Purchases for {name}</div>
        </div>

        {err ? <div className="error">{err}</div> : null}

        {loading ? (
          <div className="emptyCard">Loading…</div>
        ) : items.length === 0 ? (
          <div className="emptyCard">
            <div className="emptyTitle">No orders yet</div>
            <div className="emptySub">
              When you buy products or unlock content, your orders will show up here.
            </div>

            <div className="hint">
              <span className="mono">Tip:</span> If you want this page to fetch real data, set{" "}
              <span className="mono">VITE_API_BASE_URL</span> and add a backend route like{" "}
              <span className="mono">GET /api/orders/my</span>.
            </div>
          </div>
        ) : (
          <div className="list">
            {items.map((o, idx) => {
              const id = o?.id || o?._id || o?.orderId || String(idx);
              const status = safeTrim(o?.status) || safeTrim(o?.paymentStatus) || "created";
              const createdAt = o?.createdAt || o?.created || o?.timestamp;
              const total = o?.totalCents ?? o?.amountTotal ?? o?.amountCents;

              // optional fields that might exist in your models
              const profileKey = safeTrim(o?.profileKey);
              const kind = safeTrim(o?.kind || o?.type); // e.g. product/music/video
              const label = safeTrim(o?.title || o?.itemTitle || o?.description);

              return (
                <button
                  key={id}
                  className="row"
                  onClick={() => nav(`/account/orders/${encodeURIComponent(id)}`)}
                  title="Open order (placeholder route)"
                >
                  <div className="rowTop">
                    <div className="rowLeft">
                      <div className="rowId">{id}</div>
                      <div className="rowMeta">
                        {createdAt ? fmtDate(createdAt) : "—"}
                        {profileKey ? ` • ${profileKey}` : ""}
                        {kind ? ` • ${kind}` : ""}
                      </div>
                    </div>

                    <div className="rowRight">
                      <div className="rowTotal">{total != null ? money(total) : ""}</div>
                      <div className={`badge badge_${status.toLowerCase()}`}>{status}</div>
                    </div>
                  </div>

                  {label ? <div className="rowLabel">{label}</div> : null}
                </button>
              );
            })}
          </div>
        )}

        <div className="note">
          Next step: we can wire this to your real order schema + add an order details page.
        </div>
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
          position: absolute;
          inset: 0;
          background: radial-gradient(900px 500px at 50% 15%, rgba(0,255,255,0.08), transparent 60%),
                      linear-gradient(180deg, #0b1020, #090b14, #06070d);
        }
        .ordWrap{
          position: relative;
          z-index: 1;
          max-width: 980px;
          margin: 0 auto;
          padding: 22px 16px 40px;
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
        .hint{ margin-top: 12px; color: rgba(255,255,255,0.55); font-size: 12px; line-height: 1.4; }
        .mono{
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          color: rgba(255,255,255,0.82);
        }

        .list{
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .row{
          text-align: left;
          border-radius: 18px;
          padding: 14px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.30);
          color: #fff;
          cursor: pointer;
          backdrop-filter: blur(14px);
          transition: transform 120ms ease, opacity 120ms ease;
        }
        .row:active{ transform: scale(0.995); opacity: 0.95; }

        .rowTop{
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }
        .rowId{
          font-weight: 900;
          font-size: 14px;
          letter-spacing: 0.2px;
        }
        .rowMeta{
          margin-top: 6px;
          color: rgba(255,255,255,0.65);
          font-size: 12px;
        }
        .rowRight{
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
          min-width: 120px;
        }
        .rowTotal{
          font-weight: 900;
          font-size: 14px;
          color: rgba(255,255,255,0.92);
        }
        .badge{
          font-size: 11px;
          padding: 5px 9px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.06);
          text-transform: capitalize;
        }
        .rowLabel{
          margin-top: 10px;
          color: rgba(255,255,255,0.82);
          font-size: 13px;
          line-height: 1.35;
        }

        .note{
          margin-top: 14px;
          color: rgba(255,255,255,0.55);
          font-size: 12px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
