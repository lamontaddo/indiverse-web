// src/pages/AuthSignup.jsx ✅ FULL DROP-IN (WEB)
// ✅ Buyer signup (platform-wide IndiVerse account)
// ✅ NO profileKey anywhere
// ✅ POST /api/auth/register
// ✅ On success -> /auth/login?email=...

import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../utils/apiClient';

const universeVideo =
  'https://montech-remote-config.s3.amazonaws.com/assets/test/bgvideo-1767903039953.mov';

function safeTrim(v) {
  return String(v || '').trim();
}

export default function AuthSignup() {
  const nav = useNavigate();
  const [sp] = useSearchParams();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(sp.get('email') || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      safeTrim(firstName).length > 0 &&
      safeTrim(lastName).length > 0 &&
      safeTrim(email).length > 0 &&
      String(password || '').length >= 8
    );
  }, [firstName, lastName, email, password]);

  const onSubmit = async () => {
    const fn = safeTrim(firstName);
    const ln = safeTrim(lastName);
    const em = safeTrim(email).toLowerCase();
    const pw = String(password || '');

    if (!fn || !ln || !em || !pw) {
      alert('All fields are required.');
      return;
    }
    if (!em.includes('@')) {
      alert('Enter a valid email.');
      return;
    }
    if (pw.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }

    try {
      setLoading(true);

      const res = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ firstName: fn, lastName: ln, email: em, password: pw }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data || data?.ok === false || data?.error) {
        throw new Error(data?.error || 'Signup failed');
      }

      alert('Account created. You can now sign in.');
      nav(`/auth/login?email=${encodeURIComponent(em)}`);
    } catch (err) {
      alert(err?.message || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.root}>
      <video
        src={universeVideo}
        style={styles.video}
        autoPlay
        muted
        loop
        playsInline
      />

      <div style={styles.overlay} />

      <div style={styles.topRow}>
        <button
          onClick={() => nav(-1)}
          style={styles.backBtn}
          disabled={loading}
        >
          ← Back
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.superTitle}>MONTECH</div>
          <div style={styles.indiTitle}>INDIverse</div>
        </div>

        <div style={styles.cardWrap}>
          <div style={styles.card}>
            <div style={styles.title}>SIGN UP</div>
            <div style={styles.sub}>Create your account.</div>

            <div style={styles.row}>
              <div style={styles.half}>
                <div style={styles.label}>First name</div>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First"
                  style={styles.input}
                  disabled={loading}
                />
              </div>

              <div style={styles.half}>
                <div style={styles.label}>Last name</div>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last"
                  style={styles.input}
                  disabled={loading}
                />
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={styles.label}>Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={styles.input}
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div style={{ marginTop: 10 }}>
              <div style={styles.label}>Password</div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={styles.input}
                disabled={loading}
                type="password"
                autoComplete="new-password"
              />
              <div style={styles.hint}>At least 8 characters.</div>
            </div>

            <button
              onClick={onSubmit}
              disabled={loading || !canSubmit}
              style={{
                ...styles.primaryBtn,
                opacity: loading || !canSubmit ? 0.55 : 1,
              }}
            >
              {loading ? 'Creating…' : 'Create account'}
            </button>

            <button
              onClick={() => nav(`/auth/login?email=${encodeURIComponent(email || '')}`)}
              style={styles.linkBtn}
              disabled={loading}
            >
              Already have an account? Sign in
            </button>
          </div>

          <div style={styles.poweredBy}>Powered by Montech</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: '100vh',
    background: '#000',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial',
  },
  video: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'scale(1.02)',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.82), rgba(0,0,0,0.92))',
  },
  topRow: {
    position: 'relative',
    zIndex: 2,
    padding: '20px 16px 0',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    borderRadius: 999,
    border: '1px solid rgba(148,163,184,0.25)',
    background: 'rgba(15,23,42,0.45)',
    color: '#e5e7eb',
    fontWeight: 800,
    cursor: 'pointer',
  },
  content: {
    position: 'relative',
    zIndex: 2,
    padding: '16px 18px 24px',
    maxWidth: 520,
    margin: '0 auto',
    minHeight: 'calc(100vh - 60px)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: { marginTop: 10, marginBottom: 12, textAlign: 'center' },
  superTitle: {
    color: '#6b7280',
    fontSize: 13,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  indiTitle: { fontSize: 34, color: '#fff', fontWeight: 900 },
  cardWrap: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  card: {
    borderRadius: 22,
    padding: 18,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(0,0,0,0.35)',
    backdropFilter: 'blur(14px)',
  },
  title: { color: '#fff', fontSize: 24, fontWeight: 900, letterSpacing: 2 },
  sub: { color: 'rgba(255,255,255,0.7)', marginTop: 6, marginBottom: 8 },
  row: { display: 'flex', gap: 10 },
  half: { flex: 1 },
  label: { color: 'rgba(255,255,255,0.8)', fontWeight: 800, marginBottom: 6, fontSize: 12 },
  input: {
    width: '100%',
    padding: '12px 12px',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.16)',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    outline: 'none',
    fontSize: 14,
  },
  hint: { marginTop: 6, color: 'rgba(255,255,255,0.45)', fontSize: 12 },
  primaryBtn: {
    marginTop: 16,
    padding: '14px 14px',
    borderRadius: 16,
    background: 'rgba(255,255,255,0.9)',
    border: 'none',
    width: '100%',
    fontWeight: 900,
    letterSpacing: 1,
    cursor: 'pointer',
  },
  linkBtn: {
    marginTop: 12,
    width: '100%',
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.72)',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: 13,
  },
  poweredBy: {
    marginTop: 12,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    letterSpacing: 0.4,
  },
};
