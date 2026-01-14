// src/pages/ConsultationPage.jsx ✅ FULL DROP-IN (WEB)
// Route: /world/:profileKey/consultation
//
// Web port of FlowerOrdersScreen (RN):
// ✅ Uses profileKey from route params (fallback "lamont")
// ✅ Prefill from router state OR query params (presetArrangement)
// ✅ Sends x-profile-key header (multi-tenant)
// ✅ POST /api/flowers/orders (same endpoint)
// ✅ Back button top-left (navigate(-1))
// ✅ Glass / gradient vibe (pure CSS, no RN deps)

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

/* ------------------------ helpers ------------------------ */

function cleanKey(v) {
  return String(v || "").trim().toLowerCase();
}

function apiBase() {
  return String(import.meta.env.VITE_API_BASE_URL || "")
    .trim()
    .replace(/\/+$/, "");
}

function safeTrim(v) {
  return String(v || "").trim();
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
  if (!res.ok) throw new Error(`${method} ${path} failed (${res.status}): ${text || res.statusText}`);
  return text ? JSON.parse(text) : {};
}

function moneyFromCents(cents, currency = "usd") {
  const n = Number(cents || 0) / 100;
  if (!Number.isFinite(n) || n <= 0) return "";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: String(currency || "usd").toUpperCase(),
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

export default function ConsultationPage() {
  const nav = useNavigate();
  const location = useLocation();
  const [sp] = useSearchParams();
  const { profileKey: paramsProfileKey } = useParams();

  const profileKey = useMemo(() => cleanKey(paramsProfileKey) || "lamont", [paramsProfileKey]);

  // --- form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [occasion, setOccasion] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [bouquetType, setBouquetType] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ✅ Prefill from ArrangementDetail "Buy Now"
  // Support BOTH:
  // - location.state.presetArrangement (preferred; mirrors RN route.params)
  // - query params (?arrangementName=...&quantity=...)
  const presetArrangement = useMemo(() => {
    const fromState = location?.state?.presetArrangement;
    if (fromState) return fromState;

    const arrangementName = safeTrim(sp.get("arrangementName"));
    const quantity = Number(sp.get("quantity") || 0) || 0;

    if (!arrangementName && !quantity) return null;
    return { name: arrangementName || "Custom arrangement", quantity: quantity || 1 };
  }, [location?.state, sp]);

  useEffect(() => {
    if (!presetArrangement) return;

    const qty = presetArrangement.quantity || 1;
    const nameFromPreset = presetArrangement.name || "Custom arrangement";

    // only set if blank (don’t overwrite user typing)
    setBouquetType((prev) => (prev ? prev : nameFromPreset));
    setNotes((prev) => (prev ? prev : `Requested quantity: ${qty}\n\n`));
  }, [presetArrangement]);

  const handleSubmit = useCallback(async () => {
    if (!safeTrim(name) || !safeTrim(phone) || !safeTrim(bouquetType)) {
      alert("Missing details:\nName, phone, and a brief description of your floral needs are required.");
      return;
    }

    try {
      setSubmitting(true);

      await apiJsonOrThrow("/api/flowers/orders", {
        method: "POST",
        headers: {
          "x-profile-key": String(profileKey || ""),
        },
        body: JSON.stringify({
          name: safeTrim(name),
          phone: safeTrim(phone),
          occasion: safeTrim(occasion) || null,
          deliveryDate: safeTrim(deliveryDate) || null,
          deliveryAddress: safeTrim(deliveryAddress) || null,
          bouquetType: safeTrim(bouquetType),
          notes: safeTrim(notes) || null,
        }),
      });

      alert("Inquiry sent 🌹\n\nThank you for your interest. I’ll follow up to confirm details, availability, and pricing.");

      setName("");
      setPhone("");
      setOccasion("");
      setDeliveryDate("");
      setDeliveryAddress("");
      setBouquetType("");
      setNotes("");
    } catch (e) {
      console.error("[ConsultationPage] submit error =>", e?.message || e);
      alert(e?.message || "Something went wrong submitting your inquiry.");
    } finally {
      setSubmitting(false);
    }
  }, [profileKey, name, phone, bouquetType, occasion, deliveryDate, deliveryAddress, notes]);

  return (
    <div className="cp-root">
      <div className="cp-bg" />
      <div className="cp-dim" />

      <div className="cp-shell">
        {/* Header */}
        <div className="cp-header">
          <button className="cp-back" onClick={() => nav(-1)} aria-label="Back">
            ←
          </button>

          <div className="cp-headCenter">
            <div className="cp-titleRow">
              <span className="cp-flower">🌸</span>
              <h1 className="cp-title">Floral Consultation</h1>
            </div>
            <div className="cp-sub">events • occasions • bespoke arrangements</div>
          </div>

          <div className="cp-spacer" />
        </div>

        {/* Card */}
        <div className="cp-cardWrap">
          <div className="cp-card">
            <div className="cp-cardTop">
              <div className="cp-cardTitle">Share a few details about your florals</div>
              <div className="cp-cardHint">
                I’ll review your inquiry and reach out personally to discuss your event, design direction, and next steps.
              </div>
            </div>

            <div className="cp-grid">
              <div className="cp-field">
                <div className="cp-label">Name *</div>
                <input
                  className="cp-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name or contact name"
                />
              </div>

              <div className="cp-field">
                <div className="cp-label">Phone *</div>
                <input
                  className="cp-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Best number for consultation"
                  inputMode="tel"
                />
              </div>

              <div className="cp-field cp-span2">
                <div className="cp-label">Occasion</div>
                <input
                  className="cp-input"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="Wedding, celebration, corporate event, private dinner..."
                />
              </div>

              <div className="cp-field">
                <div className="cp-label">Event / delivery date</div>
                <input
                  className="cp-input"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  placeholder="MM/DD or date range"
                />
              </div>

              <div className="cp-field cp-span2">
                <div className="cp-label">Location</div>
                <textarea
                  className="cp-input cp-textarea"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Venue, city, or delivery address"
                  rows={2}
                />
              </div>

              <div className="cp-field cp-span2">
                <div className="cp-label">Floral needs *</div>
                <textarea
                  className="cp-input cp-textarea"
                  value={bouquetType}
                  onChange={(e) => setBouquetType(e.target.value)}
                  placeholder="Bridal bouquet, tablescapes, ceremony florals, installations, gifting, etc."
                  rows={2}
                />
                {presetArrangement ? (
                  <div className="cp-preset">
                    Prefill: <b>{presetArrangement.name || "Custom arrangement"}</b>{" "}
                    {presetArrangement.quantity ? (
                      <span className="cp-presetMuted">
                        • qty {presetArrangement.quantity}{" "}
                        {presetArrangement.priceCents ? `• ${moneyFromCents(presetArrangement.priceCents, presetArrangement.currency)}` : ""}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="cp-field cp-span2">
                <div className="cp-label">Additional details</div>
                <textarea
                  className="cp-input cp-textarea cp-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Color palette, inspiration, guest count, budget range, or any design notes."
                  rows={4}
                />
              </div>
            </div>

            <button className="cp-submit" onClick={handleSubmit} disabled={submitting}>
              <span className="cp-submitInner">{submitting ? "Sending..." : "Submit consultation request"}</span>
            </button>

            {/* tiny debug */}
            {/* <div className="cp-debug">profileKey: {profileKey}</div> */}
          </div>
        </div>
      </div>

      <style>{`
        :root{
          --stroke: rgba(255,255,255,0.14);
          --stroke2: rgba(255,255,255,0.20);
          --glass: rgba(0,0,0,0.38);
          --pink1: #ff4b5c;
          --pink2: #ff7b88;
        }

        .cp-root{
          min-height: 100vh;
          position: relative;
          background: #000;
          color: #fff;
          overflow: hidden;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
        }

        .cp-bg{
          position: fixed;
          inset: 0;
          background:
            radial-gradient(900px 600px at 20% 10%, rgba(255, 75, 92, 0.18), rgba(0,0,0,0) 55%),
            radial-gradient(900px 600px at 80% 0%, rgba(255, 123, 136, 0.12), rgba(0,0,0,0) 60%),
            linear-gradient(180deg, #070812, #05060b, #04040a);
          z-index: 0;
        }
        .cp-dim{
          position: fixed;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.82));
          z-index: 1;
        }

        .cp-shell{
          position: relative;
          z-index: 2;
          max-width: 980px;
          margin: 0 auto;
          padding: 20px 18px 36px;
        }

        /* Header */
        .cp-header{
          display: grid;
          grid-template-columns: 44px 1fr 44px;
          align-items: center;
          gap: 10px;
          padding-top: 10px;
        }
        .cp-back{
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid var(--stroke);
          background: rgba(0,0,0,0.35);
          color: #fff;
          cursor: pointer;
          display: grid;
          place-items: center;
          font-size: 18px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 14px 40px rgba(0,0,0,0.45);
          transition: transform 120ms ease, opacity 120ms ease, border-color 120ms ease;
        }
        .cp-back:hover{ border-color: var(--stroke2); }
        .cp-back:active{ transform: scale(0.98); opacity: 0.92; }

        .cp-headCenter{ text-align: center; }
        .cp-titleRow{
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .cp-flower{ font-size: 22px; opacity: 0.95; }
        .cp-title{
          margin: 0;
          font-size: 28px;
          font-weight: 950;
          letter-spacing: 0.8px;
          line-height: 1.05;
          text-shadow: 0 24px 60px rgba(0,0,0,0.45);
        }
        .cp-sub{
          margin-top: 6px;
          color: rgba(255,255,255,0.70);
          font-size: 12px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        .cp-spacer{ width: 44px; height: 44px; }

        /* Card */
        .cp-cardWrap{
          margin-top: 18px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 26px 80px rgba(0,0,0,0.55);
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .cp-card{
          padding: 18px;
          background: linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02));
        }
        .cp-cardTop{ margin-bottom: 12px; }
        .cp-cardTitle{
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 0.2px;
        }
        .cp-cardHint{
          margin-top: 8px;
          color: rgba(255,255,255,0.70);
          font-size: 12px;
          line-height: 1.45;
          max-width: 860px;
        }

        .cp-grid{
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 14px;
        }
        .cp-span2{ grid-column: span 2; }

        .cp-field{ display: flex; flex-direction: column; gap: 6px; }
        .cp-label{
          color: rgba(255,255,255,0.72);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.9px;
        }

        .cp-input{
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.14);
          padding: 11px 12px;
          color: #fff;
          font-size: 14px;
          background: rgba(0,0,0,0.45);
          outline: none;
        }
        .cp-input:focus{
          border-color: rgba(255, 123, 136, 0.55);
          box-shadow: 0 0 0 3px rgba(255, 75, 92, 0.12);
        }
        .cp-textarea{
          resize: vertical;
          min-height: 44px;
        }
        .cp-notes{ min-height: 90px; }

        .cp-preset{
          margin-top: 6px;
          font-size: 12px;
          color: rgba(255,255,255,0.78);
        }
        .cp-presetMuted{ color: rgba(255,255,255,0.60); }

        .cp-submit{
          margin-top: 18px;
          width: 100%;
          border: none;
          padding: 0;
          border-radius: 999px;
          overflow: hidden;
          cursor: pointer;
          opacity: 1;
        }
        .cp-submit:disabled{ cursor: not-allowed; opacity: 0.65; }

        .cp-submitInner{
          display: grid;
          place-items: center;
          height: 48px;
          font-weight: 950;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-size: 13px;
          color: #fff;
          background: linear-gradient(90deg, var(--pink1), var(--pink2));
        }

        .cp-debug{
          margin-top: 10px;
          color: rgba(255,255,255,0.45);
          font-size: 11px;
        }

        @media (max-width: 820px){
          .cp-grid{ grid-template-columns: 1fr; }
          .cp-span2{ grid-column: span 1; }
          .cp-title{ font-size: 24px; }
        }
      `}</style>
    </div>
  );
}
