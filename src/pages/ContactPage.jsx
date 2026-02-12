// src/pages/ContactPage.jsx ✅ FULL DROP-IN (WEB) — glass chat + step wizard + selfie upload (camera OR device upload)
// Route suggestion: /world/:profileKey/contact
//
// ✅ Visual: full-bleed world bg (passed via navigation state bgUrl), glass shell, chat bubbles
// ✅ Steps: name -> phone -> address (skip) -> note (skip) -> selfie (skip) -> confirm/save
// ✅ Uses your backend: POST /api/contacts  (profileKey REQUIRED via x-profile-key)
// ✅ Optional "This is me" device binding for chat identity (localStorage keys)
// ✅ Works with Vite proxy OR VITE_API_BASE_URL
//
// ✅ UPDATE (this drop-in):
// - Selfie step offers BOTH:
//    1) 📷 Take Selfie (mobile camera hint via capture="user")
//    2) 🖼 Upload From Device (photo library / file picker)
// - Both inputs share the same onFileChange handler
// - onFileChange clears input value so picking the same file twice still works

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const FALLBACK_BG =
  'https://images.unsplash.com/photo-1520975682071-a4a3a8a92dd7?auto=format&fit=crop&w=1600&q=60'; // only if nothing passed

function cleanKey(v) {
  return String(v || '').trim().toLowerCase();
}

function resolveProfileKeyWeb(paramsProfileKey) {
  const fromParams = cleanKey(paramsProfileKey);
  if (fromParams) return fromParams;
  try {
    const saved = cleanKey(localStorage.getItem('profileKey'));
    if (saved) return saved;
  } catch {}
  return 'lamont';
}

function capWords(s) {
  return String(s || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function onlyDigits(s) {
  return String(s || '').replace(/[^\d]/g, '');
}

function validName(v) {
  return /\S+\s+\S+/.test(String(v || '').trim());
}

function validPhone(v) {
  return onlyDigits(v).length >= 10;
}

function formatPhonePretty(v) {
  const d = onlyDigits(v);
  if (d.length < 10) return v;
  const a = d.slice(0, 3);
  const b = d.slice(3, 6);
  const c = d.slice(6, 10);
  return `(${a}) ${b}-${c}${d.length > 10 ? ` +${d.slice(10)}` : ''}`;
}

async function apiJson(path, { profileKey, method = 'GET', body } = {}) {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
  const url = `${base}${path}`;

  const res = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      ...(method !== 'GET' ? { 'Content-Type': 'application/json' } : {}),
      ...(profileKey ? { 'x-profile-key': profileKey } : {}),
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
    credentials: 'include',
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const text = await res.text().catch(() => '');
  const json = text
    ? (() => {
        try {
          return JSON.parse(text);
        } catch {
          return null;
        }
      })()
    : null;

  if (!res.ok) {
    const msg =
      json?.message || json?.error || (text && text.length < 220 ? text : '') || res.statusText;
    throw new Error(`${method} ${path} failed (${res.status}): ${msg || 'Request failed'}`);
  }

  return json ?? {};
}

function Bubble({ role, children }) {
  const isAI = role === 'ai';
  return (
    <div style={{ display: 'flex', justifyContent: isAI ? 'flex-start' : 'flex-end', margin: '10px 0' }}>
      <div
        style={{
          maxWidth: '82%',
          borderRadius: 18,
          padding: '10px 12px',
          border: '1px solid rgba(255,255,255,0.14)',
          background: isAI ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
          lineHeight: '20px',
          whiteSpace: 'pre-wrap',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Chip({ children, onClick, variant = 'ghost', disabled, title }) {
  const styles = {
    base: {
      borderRadius: 999,
      padding: '8px 12px',
      border: '1px solid rgba(255,255,255,0.16)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      fontWeight: 800,
      letterSpacing: 0.6,
      fontSize: 12,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      userSelect: 'none',
    },
    ghost: { background: 'rgba(255,255,255,0.08)', color: '#fff' },
    primary: {
      background: 'rgba(255,255,255,0.85)',
      color: '#000',
      border: '1px solid rgba(255,255,255,0.24)',
    },
    danger: {
      background: 'rgba(239,68,68,0.14)',
      color: '#fecaca',
      border: '1px solid rgba(239,68,68,0.25)',
    },
  };

  return (
    <button
      title={title}
      onClick={disabled ? undefined : onClick}
      style={{
        ...styles.base,
        ...(variant === 'primary' ? styles.primary : variant === 'danger' ? styles.danger : styles.ghost),
      }}
    >
      {children}
    </button>
  );
}

export default function ContactPage() {
  const navigate = useNavigate();
  const { profileKey: paramsProfileKey } = useParams();
  const location = useLocation();

  const activeProfileKey = useMemo(() => resolveProfileKeyWeb(paramsProfileKey), [paramsProfileKey]);

  // keep storage aligned (like RN AsyncStorage usage)
  useEffect(() => {
    try {
      localStorage.setItem('profileKey', activeProfileKey);
    } catch {}
  }, [activeProfileKey]);

  // world background from MainScreen navigate state
  const bgUrl = useMemo(() => {
    const fromState = location?.state?.bgUrl;
    const v = typeof fromState === 'string' ? fromState.trim() : '';
    return v ? v : FALLBACK_BG;
  }, [location?.state?.bgUrl]);

  const ownerName = useMemo(() => {
    const k = activeProfileKey || 'owner';
    return k === 'lamont' ? 'Lamont' : k.charAt(0).toUpperCase() + k.slice(1);
  }, [activeProfileKey]);

  // form state
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [selfieObjUrl, setSelfieObjUrl] = useState('');
  const [selfieFileName, setSelfieFileName] = useState('');

  // device identity toggle
  const [setAsMe, setSetAsMe] = useState(() => (location?.state?.mode === 'connect' ? true : false));

  // 0=name, 1=phone, 2=address(opt), 3=note(opt), 4=selfie(opt), 5=confirm
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorNote, setErrorNote] = useState('');

  const scrollRef = useRef(null);

  // ✅ two refs: camera vs upload
  const fileCameraRef = useRef(null);
  const fileUploadRef = useRef(null);

  // cleanup object URL
  useEffect(() => {
    return () => {
      if (selfieObjUrl) URL.revokeObjectURL(selfieObjUrl);
    };
  }, [selfieObjUrl]);

  const baseMessages = useMemo(() => {
    const m = [
      { role: 'ai', text: `Hey — I’m ${ownerName}’s assistant.` },
      { role: 'ai', text: `Let’s add a new contact to ${ownerName}’s phone book. (We won’t message them.)` },
      { role: 'ai', text: `Add anyone you want, or connect yourself so ${ownerName} recognizes you.` },
    ];

    if (!first && !last) {
      m.push({ role: 'ai', text: 'Who are we adding? Enter their first and last name.' });
      return m;
    }

    m.push({ role: 'user', text: `${first} ${last}`.trim() });

    if (!phone) {
      m.push({ role: 'ai', text: "Got it — what’s their phone number?" });
      return m;
    }

    m.push({ role: 'user', text: formatPhonePretty(phone) });

    if (step === 2 && !address) return m;
    m.push({ role: 'user', text: address ? address : '(No address)' });

    if (step === 3 && !note) return m;
    m.push({ role: 'user', text: note ? note : '(No note)' });

    if (step < 5) return m;

    m.push({ role: 'user', text: selfieObjUrl ? '(Selfie added)' : '(No selfie)' });
    m.push({ role: 'ai', text: 'Confirm the details below — then we’ll save this contact.' });

    return m;
  }, [ownerName, first, last, phone, address, note, selfieObjUrl, step]);

  // auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const t = window.setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 30);
    return () => window.clearTimeout(t);
  }, [baseMessages, step]);

  // step actions
  const advanceName = useCallback(() => {
    setErrorNote('');
    if (!validName(input)) {
      setErrorNote('Please enter first and last name.');
      return;
    }
    const parts = input.trim().split(/\s+/);
    const f = capWords(parts[0]);
    const l = capWords(parts.slice(1).join(' '));
    setFirst(f);
    setLast(l);
    setInput('');
    setStep(1);
  }, [input]);

  const advancePhone = useCallback(() => {
    setErrorNote('');
    if (!validPhone(input)) {
      setErrorNote('Please enter a valid phone number (10+ digits).');
      return;
    }
    setPhone(input.trim());
    setInput('');
    setStep(2);
  }, [input]);

  const advanceAddress = useCallback(() => {
    setErrorNote('');
    if (input.trim()) setAddress(input.trim());
    setInput('');
    setStep(3);
  }, [input]);

  const skipAddress = useCallback(() => {
    setErrorNote('');
    setAddress('');
    setInput('');
    setStep(3);
  }, []);

  const advanceNote = useCallback(() => {
    setErrorNote('');
    if (input.trim()) setNote(input.trim());
    setInput('');
    setStep(4);
  }, [input]);

  const skipNote = useCallback(() => {
    setErrorNote('');
    setNote('');
    setInput('');
    setStep(4);
  }, []);

  // ✅ two pickers: camera vs upload
  const pickSelfieCamera = useCallback(() => {
    setErrorNote('');
    fileCameraRef.current?.click?.();
  }, []);

  const pickSelfieUpload = useCallback(() => {
    setErrorNote('');
    fileUploadRef.current?.click?.();
  }, []);

  const onFileChange = useCallback(
    (e) => {
      const f = e?.target?.files?.[0];

      // ✅ allow picking same file again
      try {
        e.target.value = '';
      } catch {}

      if (!f) return;

      // revoke previous
      try {
        if (selfieObjUrl) URL.revokeObjectURL(selfieObjUrl);
      } catch {}

      const url = URL.createObjectURL(f);
      setSelfieObjUrl(url);
      setSelfieFileName(f.name || 'selfie.jpg');
      setStep(5);
    },
    [selfieObjUrl]
  );

  const skipSelfie = useCallback(() => {
    setErrorNote('');
    if (selfieObjUrl) {
      try {
        URL.revokeObjectURL(selfieObjUrl);
      } catch {}
    }
    setSelfieObjUrl('');
    setSelfieFileName('');
    setStep(5);
  }, [selfieObjUrl]);

  const editStep = useCallback((target) => {
    setErrorNote('');
    setStep(target);
    setInput('');
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  const confirmAndSend = useCallback(async () => {
    setErrorNote('');
    if (!first || !last || !phone) {
      setErrorNote('Missing required fields: name + phone.');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        firstName: first,
        lastName: last,
        phone: phone,
        address: address || '',
        note: note || '',
        selfieUrl: selfieObjUrl || '',
      };

      const json = await apiJson('/api/contacts', {
        profileKey: activeProfileKey,
        method: 'POST',
        body: payload,
      });

      const contactDoc = json?.contact || null;
      const createdId = contactDoc?._id || contactDoc?.id || null;
      const createdPhone = contactDoc?.phone || phone;

      if (!createdId) throw new Error('Contact created but missing contact._id in response.');

      // ✅ bind device identity only when toggle is ON
      if (setAsMe) {
        try {
          localStorage.setItem(`chatContactId:${activeProfileKey}`, String(createdId));
          localStorage.setItem(`chatPhone:${activeProfileKey}`, String(createdPhone));
        } catch {}
      }

      setErrorNote('');
      alert(setAsMe ? 'Saved + connected. You can open Direct Line now.' : `Saved to ${ownerName}’s contact list.`);

      navigate(`/world/${encodeURIComponent(activeProfileKey)}`, {
        state: { profileKey: activeProfileKey, bgUrl },
      });
    } catch (err) {
      setErrorNote(String(err?.message || 'Failed to save contact.'));
    } finally {
      setSaving(false);
    }
  }, [first, last, phone, address, note, selfieObjUrl, activeProfileKey, setAsMe, ownerName, navigate, bgUrl]);

  const composer = useMemo(() => {
    const common = {
      value: input,
      onChange: (e) => setInput(e.target.value),
      onSend: null,
      placeholder: '',
      hint: '',
      icon: '',
      type: 'text',
    };

    if (step === 0) return { ...common, icon: '👤', placeholder: 'e.g., Jordan Smith', hint: 'First + last name', onSend: advanceName };
    if (step === 1) return { ...common, icon: '📞', placeholder: 'Phone number', hint: '10+ digits', onSend: advancePhone, type: 'tel' };
    if (step === 2) return { ...common, icon: '📍', placeholder: 'Address (optional)', hint: 'Press Enter to save, or Skip', onSend: advanceAddress };
    if (step === 3) return { ...common, icon: '💬', placeholder: 'Tiny note (optional)', hint: 'Press Enter to save, or Skip', onSend: advanceNote };
    return null;
  }, [step, input, advanceName, advancePhone, advanceAddress, advanceNote]);

  const headerTitle = useMemo(() => {
    return location?.state?.title || `Connect • ${ownerName}`;
  }, [location?.state?.title, ownerName]);

  return (
    <div style={styles.page}>
      <div style={{ ...styles.bg, backgroundImage: `url(${bgUrl})` }} />
      <div style={styles.dim} />

      <div style={styles.shell}>
        <div style={styles.topBar}>
          <div style={styles.topLeft}>
            <div style={styles.pillTitle}>{headerTitle}</div>
          </div>

          <div style={styles.topActions}>
            <Chip onClick={() => navigate(-1)} title="Close">
              ✕ Close
            </Chip>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardOverlay} />

          <div ref={scrollRef} style={styles.chat}>
            {baseMessages.map((m, idx) => (
              <Bubble key={idx} role={m.role}>
                <div style={{ color: '#fff' }}>{m.text}</div>
              </Bubble>
            ))}

            {/* optional step prompts */}
            {step === 2 && !address && (
              <Bubble role="ai">
                <div style={{ color: '#fff' }}>Add an address? (optional)</div>
                <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Chip onClick={skipAddress}>Skip</Chip>
                  <Chip variant="primary" onClick={advanceAddress} disabled={saving}>
                    Save address
                  </Chip>
                </div>
              </Bubble>
            )}

            {step === 3 && !note && (
              <Bubble role="ai">
                <div style={{ color: '#fff' }}>Add a note? (optional)</div>
                <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Chip onClick={skipNote}>Skip</Chip>
                  <Chip variant="primary" onClick={advanceNote} disabled={saving}>
                    Save note
                  </Chip>
                </div>
              </Bubble>
            )}

            {/* ✅ selfie step: camera OR upload */}
            {step === 4 && !selfieObjUrl && (
              <Bubble role="ai">
                <div style={{ color: '#fff' }}>{`Do you want to add a selfie so ${ownerName} recognizes you? (optional)`}</div>
                <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Chip variant="primary" onClick={pickSelfieCamera}>
                    📷 Take Selfie
                  </Chip>
                  <Chip onClick={pickSelfieUpload}>🖼 Upload From Device</Chip>
                  <Chip onClick={skipSelfie}>Skip</Chip>
                </div>
              </Bubble>
            )}

            {step >= 5 && (
              <div style={styles.confirmWrap}>
                <div style={styles.confirmCard}>
                  <div style={styles.confirmHead}>
                    <div style={styles.confirmTitle}>Confirm contact</div>
                    <div style={styles.confirmHint}>You can edit any field before saving.</div>
                  </div>

                  <div style={styles.grid} className="_contact_grid_fix">
                    <div style={styles.block}>
                      <div style={styles.blockLabel}>Name</div>
                      <div style={styles.blockValue}>{`${first} ${last}`.trim()}</div>
                      <div style={styles.blockActions}>
                        <Chip onClick={() => editStep(0)}>✎ Edit</Chip>
                      </div>
                    </div>

                    <div style={styles.block}>
                      <div style={styles.blockLabel}>Phone</div>
                      <div style={styles.blockValue}>{formatPhonePretty(phone)}</div>
                      <div style={styles.blockActions}>
                        <Chip onClick={() => editStep(1)}>✎ Edit</Chip>
                      </div>
                    </div>

                    <div style={styles.block}>
                      <div style={styles.blockLabel}>Address</div>
                      <div style={styles.blockValue}>{address || <span style={{ opacity: 0.75 }}>(none)</span>}</div>
                      <div style={styles.blockActions}>
                        <Chip onClick={() => editStep(2)}>✎ Edit</Chip>
                      </div>
                    </div>

                    <div style={styles.block}>
                      <div style={styles.blockLabel}>Note</div>
                      <div style={styles.blockValue}>{note || <span style={{ opacity: 0.75 }}>(none)</span>}</div>
                      <div style={styles.blockActions}>
                        <Chip onClick={() => editStep(3)}>✎ Edit</Chip>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <div style={styles.blockLabel}>Photo</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
                      {selfieObjUrl ? (
                        <div style={styles.selfieRow}>
                          <img src={selfieObjUrl} alt="selfie" style={styles.selfieImg} />
                          <div>
                            <div style={{ fontWeight: 800 }}>{selfieFileName || 'selfie'}</div>
                            <div style={{ opacity: 0.75, fontSize: 12 }}>Stored for this device unless you add uploads later.</div>
                          </div>
                        </div>
                      ) : (
                        <div style={{ opacity: 0.85 }}>(none)</div>
                      )}

                      <div style={{ display: 'flex', gap: 10 }}>
                        <Chip onClick={() => editStep(4)}>✎ Edit</Chip>
                      </div>
                    </div>
                  </div>

                  {/* identity toggle */}
                  <div
                    style={styles.meToggle}
                    onClick={() => setSetAsMe((v) => !v)}
                    role="button"
                    tabIndex={0}
                  >
                    <div style={styles.checkbox}>{setAsMe ? '☑' : '☐'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={styles.meTitle}>This is me (enable Direct Line on this device)</div>
                      <div style={styles.meSub}>Leave OFF if you’re only adding someone to the phone book.</div>
                    </div>
                  </div>

                  <div style={styles.confirmActions}>
                    <Chip
                      onClick={() =>
                        navigate(`/world/${encodeURIComponent(activeProfileKey)}`, {
                          state: { profileKey: activeProfileKey, bgUrl },
                        })
                      }
                    >
                      ← Back
                    </Chip>
                    <Chip variant="primary" disabled={saving} onClick={confirmAndSend} title="Save Contact">
                      {saving ? 'Saving…' : '✓ Save Contact'}
                    </Chip>
                  </div>

                  {!!errorNote && <div style={styles.errorNote}>{errorNote}</div>}
                </div>
              </div>
            )}
          </div>

          {/* composer */}
          {composer && step < 4 && (
            <div style={styles.composerWrap}>
              <div style={styles.composer}>
                <div style={styles.composerIcon}>{composer.icon}</div>

                <input
                  value={composer.value}
                  onChange={composer.onChange}
                  placeholder={composer.placeholder}
                  type={composer.type}
                  style={styles.input}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') composer.onSend?.();
                  }}
                  autoComplete="off"
                />

                <Chip variant="primary" onClick={composer.onSend} disabled={saving}>
                  Send
                </Chip>
              </div>

              <div style={styles.composerHint}>
                <span style={{ opacity: 0.75 }}>{composer.hint}</span>
                {step === 2 && <span style={{ opacity: 0.75 }}> • or </span>}
                {step === 2 && (
                  <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={skipAddress}>
                    Skip address
                  </span>
                )}
                {step === 3 && <span style={{ opacity: 0.75 }}> • or </span>}
                {step === 3 && (
                  <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={skipNote}>
                    Skip note
                  </span>
                )}
              </div>

              {!!errorNote && step < 5 && <div style={styles.errorInline}>{errorNote}</div>}
            </div>
          )}

          {/* ✅ hidden file inputs: camera + upload */}
          <input
            ref={fileCameraRef}
            type="file"
            accept="image/*"
            capture="user"
            style={{ display: 'none' }}
            onChange={onFileChange}
          />
          <input
            ref={fileUploadRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={onFileChange}
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#000',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
  },
  bg: {
    position: 'fixed',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transform: 'translateZ(0)',
    zIndex: 0,
  },
  dim: {
    position: 'fixed',
    inset: 0,
    zIndex: 1,
    background:
      'radial-gradient(circle at 20% 10%, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 45%, rgba(0,0,0,0.70) 78%), linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.88))',
  },

  shell: {
    position: 'relative',
    zIndex: 2,
    maxWidth: 980,
    margin: '0 auto',
    padding: '18px 18px 28px',
  },

  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  topLeft: { display: 'flex', flexDirection: 'column', gap: 6 },
  pillTitle: {
    fontWeight: 900,
    letterSpacing: 1.2,
    fontSize: 16,
    textTransform: 'uppercase',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
  },
  pillSub: { color: '#cfd3dc', fontSize: 12, letterSpacing: 0.5 },

  topActions: { display: 'flex', gap: 10, alignItems: 'center' },

  card: {
    position: 'relative',
    borderRadius: 24,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.16)',
    background: 'rgba(255,255,255,0.06)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
  },
  cardOverlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.11), rgba(255,255,255,0.03))',
  },

  chat: {
    position: 'relative',
    maxHeight: '72vh',
    overflowY: 'auto',
    padding: 18,
  },

  composerWrap: {
    borderTop: '1px solid rgba(255,255,255,0.10)',
    padding: 14,
    background: 'rgba(0,0,0,0.20)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  composer: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    borderRadius: 999,
    padding: '10px 12px',
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(255,255,255,0.08)',
  },
  composerIcon: { width: 32, textAlign: 'center', fontSize: 16 },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    padding: '8px 6px',
    fontSize: 14,
  },
  composerHint: {
    marginTop: 8,
    fontSize: 12,
    color: '#94a3b8',
  },
  errorInline: {
    marginTop: 10,
    fontSize: 12,
    color: '#fca5a5',
  },

  confirmWrap: { marginTop: 4, paddingBottom: 10 },
  confirmCard: {
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(0,0,0,0.24)',
    padding: 14,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
  },
  confirmHead: { marginBottom: 10 },
  confirmTitle: { fontSize: 16, fontWeight: 900, letterSpacing: 0.6 },
  confirmHint: { marginTop: 4, fontSize: 12, color: '#cfd3dc' },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 12,
    marginTop: 10,
  },
  block: {
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    padding: 12,
  },
  blockLabel: {
    color: '#cfd3dc',
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: 900,
  },
  blockValue: { marginTop: 6, fontWeight: 800 },
  blockActions: { marginTop: 10, display: 'flex', gap: 10 },

  selfieRow: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    padding: 10,
  },
  selfieImg: {
    width: 74,
    height: 74,
    borderRadius: 16,
    objectFit: 'cover',
    border: '1px solid rgba(255,255,255,0.14)',
  },

  meToggle: {
    marginTop: 12,
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 18,
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(0,0,0,0.22)',
    cursor: 'pointer',
    userSelect: 'none',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 10,
    display: 'grid',
    placeItems: 'center',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.14)',
    fontWeight: 900,
  },
  meTitle: { fontWeight: 900 },
  meSub: { marginTop: 4, color: '#cfd3dc', fontSize: 12, lineHeight: '16px' },

  confirmActions: {
    marginTop: 12,
    display: 'flex',
    gap: 10,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  errorNote: {
    marginTop: 12,
    padding: 10,
    borderRadius: 14,
    border: '1px solid rgba(239,68,68,0.25)',
    background: 'rgba(239,68,68,0.10)',
    color: '#fecaca',
    fontSize: 12,
    fontWeight: 800,
  },

  footer: { marginTop: 10, fontSize: 11, color: '#94a3b8' },
};

/* responsive tweak (inline because we’re doing “no CSS file” drop-in) */
const styleEl = document?.getElementById?.('contactpage-responsive-style');
if (!styleEl && typeof document !== 'undefined') {
  const s = document.createElement('style');
  s.id = 'contactpage-responsive-style';
  s.innerHTML = `
    @media (max-width: 820px){
      ._contact_grid_fix{ grid-template-columns: 1fr !important; }
    }
  `;
  document.head.appendChild(s);
}
