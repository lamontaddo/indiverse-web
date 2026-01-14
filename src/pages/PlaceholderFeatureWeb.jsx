// src/pages/PlaceholderFeatureWeb.jsx ✅ FULL DROP-IN
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function PlaceholderFeatureWeb() {
  const navigate = useNavigate();
  const { profileKey, featureKey } = useParams();

  const pk = String(profileKey || '').toLowerCase();
  const fk = String(featureKey || '').toLowerCase();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000',
        color: '#fff',
        padding: 24,
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 0.8 }}>
            {fk.toUpperCase()}
          </div>
          <div style={{ opacity: 0.7, marginTop: 6 }}>
            Profile: <span style={{ opacity: 0.95 }}>{pk}</span>
          </div>
        </div>

        <button
          onClick={() => navigate(`/world/${encodeURIComponent(pk)}`)}
          style={{
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            padding: '10px 14px',
            cursor: 'pointer',
            fontWeight: 800,
          }}
        >
          ✕ Close
        </button>
      </div>

      <div style={{ marginTop: 18, opacity: 0.8, lineHeight: 1.55 }}>
        This feature route is wired and working — you just haven’t built the web page for it yet.
        <br />
        When you’re ready, create a real page and swap it into the router.
      </div>

      <div style={{ marginTop: 18 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(2,6,23,0.55)',
            color: '#e5e7eb',
            padding: '10px 14px',
            cursor: 'pointer',
            fontWeight: 800,
          }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
