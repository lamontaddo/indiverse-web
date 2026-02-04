// src/pages/AccountHome.jsx ✅ FULL DROP-IN (Vite React)
// ✅ Basic logged-in hub: Orders + Entitlements
// ✅ Uses localStorage buyerUser + buyerToken/auth:isAuthed
// ✅ If logged out -> sends to /auth/login with next=/account

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

export default function AccountHome() {
  const nav = useNavigate();
  const [buyerUser, setBuyerUser] = useState(() => readBuyerUser());

  const authed = useMemo(() => isAuthedNow(), [buyerUser]);

  const fullName = useMemo(() => {
    const first = safeTrim(buyerUser?.firstName);
    const last = safeTrim(buyerUser?.lastName);
    const email = safeTrim(buyerUser?.email);
    const name = `${first} ${last}`.trim();
    return name || email || "Account";
  }, [buyerUser]);

  const initial = useMemo(() => {
    const first = safeTrim(buyerUser?.firstName);
    const last = safeTrim(buyerUser?.lastName);
    const email = safeTrim(buyerUser?.email);
    const base = first || last || email || "?";
    return base.charAt(0).toUpperCase();
  }, [buyerUser]);

  useEffect(() => {
    if (!authed) {
      nav("/auth/login?next=/account");
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

  const goOrders = () => nav("/account/orders");
  const goEntitlements = () => nav("/account/entitlements");

  const onLogout = () => {
    try {
      localStorage.removeItem("buyerToken");
      localStorage.removeItem("auth:isAuthed");
      localStorage.removeItem("buyerUserId");
      localStorage.removeItem("buyerUser");
    } catch {}
    nav("/");
  };

  if (!authed) return null;

  return (
    <div className="accRoot">
      <div className="accBg" />
      <div className="accWrap">
        <div className="topRow">
          <button className="backBtn" onClick={() => nav("/")}>
            ← Back
          </button>

          <button className="logoutBtn" onClick={onLogout} title="Log out">
            Log out
          </button>
        </div>

        <div className="hero">
          <div className="avatar" aria-hidden>
            {initial}
          </div>
          <div className="heroText">
            <div className="heroTitle">{fullName}</div>
            <div className="heroSub">Your orders and access lives here.</div>
          </div>
        </div>

        <div className="grid">
          <button className="card" onClick={goOrders}>
            <div className="cardIcon" aria-hidden>
              📦
            </div>
            <div className="cardTitle">Orders</div>
            <div className="cardSub">Track purchases and delivery status.</div>
          </button>

          <button className="card" onClick={goEntitlements}>
            <div className="cardIcon" aria-hidden>
              🔐
            </div>
            <div className="cardTitle">Entitlements</div>
            <div className="cardSub">See everything you’ve unlocked.</div>
          </button>
        </div>

        <div className="note">
          Next: we’ll drop in <span className="mono">/account/orders</span> and{" "}
          <span className="mono">/account/entitlements</span> pages and wire them to your backend.
        </div>
      </div>

      <style>{`
        .accRoot{
          min-height: 100vh;
          position: relative;
          background: #05060b;
          color: #fff;
          overflow: hidden;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
        }
        .accBg{
          position: absolute;
          inset: 0;
          background: radial-gradient(900px 500px at 50% 20%, rgba(0,255,255,0.08), transparent 60%),
                      linear-gradient(180deg, #0b1020, #090b14, #06070d);
        }
        .accWrap{
          position: relative;
          z-index: 1;
          max-width: 980px;
          margin: 0 auto;
          padding: 26px 18px 40px;
        }
        .topRow{
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 16px;
        }
        .backBtn, .logoutBtn{
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(0,0,0,0.28);
          color: rgba(255,255,255,0.9);
          padding: 10px 12px;
          border-radius: 999px;
          cursor: pointer;
          backdrop-filter: blur(12px);
        }
        .logoutBtn{
          border-color: rgba(0,255,255,0.18);
        }
        .hero{
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.30);
          backdrop-filter: blur(14px);
          margin-bottom: 16px;
        }
        .avatar{
          width: 54px;
          height: 54px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 24px;
          background: rgba(0,255,255,0.10);
          border: 1px solid rgba(0,255,255,0.22);
          text-shadow: 0 0 14px rgba(0,255,255,0.18);
        }
        .heroTitle{
          font-size: 20px;
          font-weight: 900;
          line-height: 1.1;
        }
        .heroSub{
          margin-top: 6px;
          color: rgba(255,255,255,0.7);
          font-size: 13px;
        }
        .grid{
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 720px){
          .grid{ grid-template-columns: 1fr 1fr; }
        }
        .card{
          text-align: left;
          border-radius: 18px;
          padding: 16px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(0,0,0,0.30);
          color: #fff;
          cursor: pointer;
          backdrop-filter: blur(14px);
          transition: transform 120ms ease, opacity 120ms ease;
        }
        .card:active{ transform: scale(0.99); opacity: 0.95; }
        .cardIcon{ font-size: 22px; }
        .cardTitle{
          margin-top: 10px;
          font-weight: 900;
          font-size: 16px;
        }
        .cardSub{
          margin-top: 6px;
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          line-height: 1.35;
        }
        .note{
          margin-top: 14px;
          color: rgba(255,255,255,0.55);
          font-size: 12px;
          text-align: center;
        }
        .mono{
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          color: rgba(255,255,255,0.8);
        }
      `}</style>
    </div>
  );
}
