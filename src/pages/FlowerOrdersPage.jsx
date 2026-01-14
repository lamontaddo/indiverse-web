// src/pages/FlowerOrdersPage.jsx ✅ FULL DROP-IN (WEB)
// Route: /world/:profileKey/consultation
//
// ✅ Matches your RN Floral Consultation UX (glass card, gradient, etc.)
// ✅ Uses x-profile-key header (multi-profile)
// ✅ Prefills from router state: state.presetArrangement (like RN presetArrangement)
// ✅ Back button top-left (navigate(-1))
// ✅ Uses env VITE_API_BASE_URL if set (falls back to same-origin)
// ✅ No React Native deps

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function cleanKey(v) {
  return String(v || "").trim().toLowerCase();
}

function safeTrim(v) {
  return String(v || "").trim();
}

function apiBase() {
  const base = String(import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/+$/, "");
  // If not set, use same origin (works if proxying /api in dev or serving behind same domain)
  return base || "";
}

async function postJsonOrThrow(path, { headers = {}, body } = {}) {
  const url = `${apiBase()}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      ...headers,
    },
    body,
    credentials: "include",
  });

  const text = await res.text().catch(() => "");
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const msg =
      json?.error ||
      json?.message ||
      (text ? text.slice(0, 240) : "") ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return json || {};
}

export default function FlowerOrdersPage() {
  const nav = useNavigate();
  const location = useLocation();
  const { profileKey: rawProfileKey } = useParams();

  const profileKey = useMemo(() => cleanKey(rawProfileKey) || "lamont", [rawProfileKey]);

  // background (inherit from MainScreen navigation state if present)
  const bgUrl = useMemo(() => {
    const s = location?.state?.bgUrl;
    const v = typeof s === "string" ? s.trim() : "";
    return /^https?:\/\//i.test(v) ? v : null;
  }, [location?.state?.bgUrl]);

  // form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [occasion, setOccasion] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [bouquetType, setBouquetType] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const presetArrangement = location?.state?.presetArrangement || null;

  // ✅ Prefill from presetArrangement (same idea as RN)
  useEffect(() => {
    if (!presetArrangement) return;

    const qty = presetArrangement.quantity || 1;
    const nameFromPreset = presetArrangement.name || "Custom arrangement";

    setBouquetType((prev) => (prev ? prev : String(nameFromPreset)));
    setNotes((prev) => (prev ? prev : `Requested quantity: ${qty}\n\n`));
  }, [presetArrangement]);

  // tiny toast helper
  const showToast = useCallback((msg) => {
    setToast(String(msg || ""));
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2600);
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => window.clearTimeout(showToast._t), []);

  const onSubmit = useCallback(async () => {
    const n = safeTrim(name);
    const p = safeTrim(phone);
    const b = safeTrim(bouquetType);

    if (!n || !p || !b) {
      showToast("Name, phone, and floral needs are required.");
      return;
    }

    try {
      setSubmitting(true);

      await postJsonOrThrow("/api/flowers/orders", {
        headers: { "x-profile-key": String(profileKey) },
        body: JSON.stringify({
          name: n,
          phone: p,
          occasion: safeTrim(occasion) || null,
          deliveryDate: safeTrim(deliveryDate) || null,
          deliveryAddress: safeTrim(deliveryAddress) || null,
          bouquetType: b,
          notes: safeTrim(notes) || null,
        }),
      });

      showToast("Inquiry sent 🌹 I’ll follow up soon.");

      setName("");
      setPhone("");
      setOccasion("");
      setDeliveryDate("");
      setDeliveryAddress("");
      setBouquetType("");
      setNotes("");
    } catch (e) {
      showToast(e?.message || "Something went wrong submitting your inquiry.");
    } finally {
      setSubmitting(false);
    }
  }, [
    name,
    phone,
    bouquetType,
    occasion,
    deliveryDate,
    deliveryAddress,
    notes,
    profileKey,
    showToast,
  ]);

  return (
    <div className="fo-root">
      <div className="fo-bg" style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined} />
      <div className="fo-dim" />

      <div className="fo-shell">
        {/* header */}
        <div className="fo-top">
          <button className="fo-back" onClick={() => nav(-1)} aria-label="Back">
            ‹
          </button>

          <div className="fo-topCenter">
            <div className="fo-titleRow">
              <span className="fo-flower" aria-hidden>
                🌹
              </span>
              <div className="fo-title">Floral Consultation</div>
            </div>
            <div className="fo-sub">events • occasions • bespoke arrangements</div>
          </div>

          <div className="fo-spacer" />
        </div>

        {/* card */}
        <div className="fo-card">
          <div className="fo-cardInner">
            <div className="fo-cardTitle">Share a few details about your florals</div>
            <div className="fo-cardHint">
              I’ll review your inquiry and reach out personally to confirm details, availability, and pricing.
            </div>

            <div className="fo-grid">
              <Field label="Name *">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name or contact name"
                />
              </Field>

              <Field label="Phone *">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Best number for consultation"
                  inputMode="tel"
                />
              </Field>

              <Field label="Occasion">
                <input
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="Wedding, celebration, corporate event, private dinner..."
                />
              </Field>

              <Field label="Event / delivery date">
                <input
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  placeholder="MM/DD or date range"
                />
              </Field>

              <Field label="Location" wide>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Venue, city, or delivery address"
                  rows={2}
                />
              </Field>

              <Field label="Floral needs *" wide>
                <textarea
                  value={bouquetType}
                  onChange={(e) => setBouquetType(e.target.value)}
                  placeholder="Bridal bouquet, tablescapes, ceremony florals, installations, gifting, etc."
                  rows={2}
                />
              </Field>

              <Field label="Additional details" wide>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Color palette, inspiration, guest count, budget range, or any design notes."
                  rows={4}
                />
              </Field>
            </div>

            <button className="fo-submit" onClick={onSubmit} disabled={submitting}>
              <span className="fo-submitInner">
                {submitting ? "Sending..." : "Submit consultation request"}
              </span>
            </button>

            <div className="fo-small">
              {presetArrangement ? (
                <span>
                  Prefilled from arrangement: <b>{String(presetArrangement?.name || "")}</b>
                </span>
              ) : (
                <span />
              )}
              <span className="fo-smallRight">profileKey: {profileKey}</span>
            </div>
          </div>
        </div>
      </div>

      {toast ? <div className="fo-toast">{toast}</div> : null}

      <style>{`
        :root{
          --glass: rgba(255,255,255,0.06);
          --stroke: rgba(255,255,255,0.12);
          --stroke2: rgba(255,255,255,0.18);
          --ink: #05060b;
          --rose1: #ff4b5c;
          --rose2: #ff7b88;
        }

        .fo-root{
          min-height: 100vh;
          background:#000;
          color:#fff;
          position:relative;
          overflow:hidden;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        }
        .fo-bg{
          position: fixed;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 0;
          filter: saturate(1.05) contrast(1.05);
          transform: translateZ(0);
        }
        .fo-dim{
          position: fixed;
          inset: 0;
          z-index: 1;
          background:
            radial-gradient(900px 600px at 22% 8%, rgba(255,255,255,0.10), rgba(0,0,0,0) 55%),
            radial-gradient(900px 600px at 78% 0%, rgba(255,255,255,0.06), rgba(0,0,0,0) 60%),
            linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.90));
        }

        .fo-shell{
          position: relative;
          z-index: 2;
          max-width: 980px;
          margin: 0 auto;
          padding: 22px 18px 40px;
        }

        .fo-top{
          display:flex;
          align-items:center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 16px;
          padding-top: 14px;
        }
        .fo-back{
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.38);
          color: #fff;
          display:grid;
          place-items:center;
          cursor:pointer;
          font-size: 22px;
          font-weight: 900;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.35);
          transition: transform 120ms ease, opacity 120ms ease, border-color 120ms ease;
        }
        .fo-back:hover{ border-color: var(--stroke2); }
        .fo-back:active{ transform: scale(0.98); opacity: 0.92; }

        .fo-topCenter{
          flex: 1;
          min-width: 0;
          display:flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .fo-titleRow{
          display:flex;
          align-items:center;
          gap: 10px;
        }
        .fo-flower{ font-size: 20px; }
        .fo-title{
          font-size: 28px;
          font-weight: 950;
          letter-spacing: 0.8px;
          line-height: 1.06;
          text-shadow: 0 24px 60px rgba(0,0,0,0.45);
        }
        .fo-sub{
          margin-top: 6px;
          color: rgba(255,255,255,0.75);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .fo-spacer{ width: 40px; }

        .fo-card{
          margin-top: 18px;
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.14);
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 18px 54px rgba(0,0,0,0.45);
          overflow:hidden;
        }
        .fo-cardInner{
          padding: 18px 18px 16px;
        }
        .fo-cardTitle{
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 0.2px;
        }
        .fo-cardHint{
          margin-top: 8px;
          color: rgba(255,255,255,0.72);
          font-size: 13px;
          line-height: 1.35;
        }

        .fo-grid{
          margin-top: 14px;
          display:grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .fo-field{
          display:flex;
          flex-direction: column;
          gap: 6px;
        }
        .fo-fieldWide{ grid-column: 1 / -1; }

        .fo-label{
          color: rgba(255,255,255,0.78);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .fo-field input,
        .fo-field textarea{
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.15);
          padding: 10px 12px;
          color: #fff;
          font-size: 14px;
          background: rgba(0,0,0,0.45);
          outline: none;
          resize: vertical;
        }
        .fo-field input::placeholder,
        .fo-field textarea::placeholder{
          color: rgba(154,160,178,0.92);
        }
        .fo-field input:focus,
        .fo-field textarea:focus{
          border-color: rgba(255,255,255,0.28);
        }

        .fo-submit{
          margin-top: 16px;
          width: 100%;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          padding: 0;
          overflow:hidden;
          box-shadow: 0 18px 40px rgba(0,0,0,0.35);
          opacity: 1;
          transition: transform 120ms ease, opacity 120ms ease;
        }
        .fo-submit:active{ transform: scale(0.99); opacity: 0.94; }
        .fo-submit:disabled{ opacity: 0.6; cursor: not-allowed; }
        .fo-submitInner{
          display:flex;
          align-items:center;
          justify-content:center;
          height: 48px;
          background: linear-gradient(90deg, var(--rose1), var(--rose2));
          color:#fff;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-size: 13px;
        }

        .fo-small{
          margin-top: 12px;
          display:flex;
          align-items:center;
          justify-content: space-between;
          gap: 10px;
          color: rgba(255,255,255,0.55);
          font-size: 11px;
        }
        .fo-smallRight{ opacity: 0.85; }

        .fo-toast{
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          bottom: 18px;
          z-index: 99;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(0,0,0,0.70);
          color: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 18px 60px rgba(0,0,0,0.55);
          max-width: min(720px, calc(100% - 28px));
          text-align: center;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.2px;
        }

        @media (max-width: 820px){
          .fo-grid{ grid-template-columns: 1fr; }
          .fo-title{ font-size: 24px; }
        }
        @media (prefers-reduced-motion: reduce){
          .fo-back, .fo-submit{ transition: none; }
        }
      `}</style>
    </div>
  );
}

function Field({ label, children, wide = false }) {
  return (
    <div className={`fo-field ${wide ? "fo-fieldWide" : ""}`}>
      <div className="fo-label">{label}</div>
      {children}
    </div>
  );
}
