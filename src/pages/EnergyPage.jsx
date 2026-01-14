// src/pages/EnergyPage.jsx ✅ FULL DROP-IN (Web Energy - cleaner layout, not stretched)
// Route: /world/:profileKey/energy

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

/* ------------------------------ data ------------------------------ */

const BREATH_MODES = {
  box: {
    key: 'box',
    label: 'Box 4–4–4–4',
    description: 'Balanced reset for calm focus.',
    pattern: [
      { phase: 'Inhale', seconds: 4 },
      { phase: 'Hold', seconds: 4 },
      { phase: 'Exhale', seconds: 4 },
      { phase: 'Hold', seconds: 4 },
    ],
  },
  calm: {
    key: 'calm',
    label: 'Calm 4–2–6',
    description: 'Long exhales to release tension.',
    pattern: [
      { phase: 'Inhale', seconds: 4 },
      { phase: 'Hold', seconds: 2 },
      { phase: 'Exhale', seconds: 6 },
    ],
  },
};

const MODE_ORDER = ['box', 'calm'];

const AFFIRMATIONS = [
  'I breathe in clarity and exhale what no longer serves me.',
  'Nothing outside of me controls my peace; I choose how I respond.',
  'I allow myself to feel, to heal, and to grow at my own pace.',
  'Every breath brings me back to myself, present and grounded.',
  'I am enough, even in the moments I feel undone.',
];

const MOODS = ['Calm', 'Focused', 'Recharging', 'Grateful', 'Processing', 'Grounded'];

function getPhaseScale(phase) {
  switch (phase) {
    case 'Inhale':
      return 1.12;
    case 'Exhale':
      return 0.86;
    case 'Hold':
    default:
      return 1.0;
  }
}

function orbGradientForPhase(phase) {
  if (phase === 'Inhale') {
    return 'radial-gradient(circle at 30% 30%, rgba(120,220,255,0.85), rgba(120,220,255,0.18) 60%, rgba(120,220,255,0.06))';
  }
  if (phase === 'Exhale') {
    return 'radial-gradient(circle at 30% 30%, rgba(190,150,255,0.78), rgba(120,100,255,0.16) 60%, rgba(120,100,255,0.06))';
  }
  return 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.48), rgba(255,255,255,0.10) 60%, rgba(255,255,255,0.04))';
}

/* ------------------------------ ui bits ------------------------------ */

function TypingAffirmation({ text, speed = 30 }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const id = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <div style={styles.card}>
      <div style={styles.cardSheen} />
      <div style={styles.cardHeaderRow}>
        <div style={styles.cardKicker}>Affirmation</div>
      </div>
      <div style={styles.affText}>{displayed}</div>
    </div>
  );
}

/* ------------------------------ page ------------------------------ */

export default function EnergyPage() {
  const { profileKey } = useParams();
  const navigate = useNavigate();

  const [modeKey, setModeKey] = useState('box');
  const [isRunning, setIsRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedMood, setSelectedMood] = useState(null);

  const timerRef = useRef(null);

  const mode = BREATH_MODES[modeKey];
  const step = mode.pattern[stepIndex];
  const phase = step.phase;

  const affirmation = useMemo(() => {
    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    return AFFIRMATIONS[dayIndex % AFFIRMATIONS.length];
  }, []);

  const orbScale = useMemo(() => getPhaseScale(phase), [phase]);
  const orbBg = useMemo(() => orbGradientForPhase(phase), [phase]);

  // reset on mode change
  useEffect(() => {
    setStepIndex(0);
    setIsRunning(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [modeKey]);

  // breathing loop
  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    const durationMs = step.seconds * 1000;
    timerRef.current = setTimeout(() => {
      setStepIndex((prev) => {
        const pattern = BREATH_MODES[modeKey].pattern;
        return (prev + 1) % pattern.length;
      });
    }, durationMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, stepIndex, modeKey, step.seconds]);

  return (
    <div style={styles.page}>
      <div style={styles.bg} />

      {/* header */}
      <div style={styles.header}>
        <button onClick={() => navigate(`/world/${profileKey}`)} style={styles.backBtn} aria-label="Back">
          <span style={styles.chev}>‹</span>
        </button>

        <div style={styles.headerCenter}>
          <div style={styles.title}>Energy</div>
          <div style={styles.subtitle}>BREATH • WORDS • PRESENCE</div>
        </div>

        <div style={{ width: 40 }} />
      </div>

      <div style={styles.container}>
        {/* breathing card */}
        <div style={styles.card}>
          <div style={styles.cardSheen} />

          <div style={styles.cardHeaderRow}>
            <div>
              <div style={styles.cardKicker}>Breathing</div>
              <div style={styles.cardTitle}>{mode.label}</div>
              <div style={styles.cardDesc}>{mode.description}</div>
            </div>

            <div style={styles.phasePill}>
              <div style={styles.phaseBig}>{step.phase}</div>
              <div style={styles.phaseSmall}>{step.seconds}s</div>
            </div>
          </div>

          {/* 2-col layout */}
          <div style={styles.breathGrid}>
            {/* left: controls */}
            <div style={styles.controlsCol}>
              <div style={styles.chipsRow}>
                {MODE_ORDER.map((k) => {
                  const active = k === modeKey;
                  return (
                    <button
                      key={k}
                      onClick={() => setModeKey(k)}
                      style={{ ...styles.chip, ...(active ? styles.chipActive : null) }}
                    >
                      <span style={{ ...styles.chipText, ...(active ? styles.chipTextActive : null) }}>
                        {BREATH_MODES[k].label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div style={styles.ctaRow}>
                <button
                  onClick={() => setIsRunning((p) => !p)}
                  style={{ ...styles.ctaBtn, ...(isRunning ? styles.ctaBtnRunning : null) }}
                >
                  <span style={styles.ctaIcon}>{isRunning ? '❚❚' : '▶'}</span>
                  <span style={styles.ctaText}>{isRunning ? 'Pause' : 'Start'}</span>
                </button>

                <Link to={`/world/${profileKey}`} style={styles.link}>
                  Return to {profileKey}
                </Link>
              </div>

              <div style={styles.tipBox}>
                <div style={styles.tipTitle}>Tip</div>
                <div style={styles.tipText}>
                  Match the orb. Inhale as it expands. Exhale as it softens.
                </div>
              </div>
            </div>

            {/* right: orb */}
            <div style={styles.orbCol}>
              <div style={styles.orbWrap}>
                <div
                  style={{
                    ...styles.orb,
                    backgroundImage: orbBg,
                    transform: `scale(${orbScale})`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* affirmation */}
        <TypingAffirmation text={affirmation} />

        {/* mood card */}
        <div style={styles.card}>
          <div style={styles.cardSheen} />
          <div style={styles.cardHeaderRow}>
            <div>
              <div style={styles.cardKicker}>Check-in</div>
              <div style={styles.cardTitle}>How are you moving right now?</div>
            </div>
          </div>

          <div style={styles.moodRow}>
            {MOODS.map((m) => {
              const active = m === selectedMood;
              return (
                <button
                  key={m}
                  onClick={() => setSelectedMood(m)}
                  style={{ ...styles.chip, ...(active ? styles.chipActive : null) }}
                >
                  <span style={{ ...styles.chipText, ...(active ? styles.chipTextActive : null) }}>{m}</span>
                </button>
              );
            })}
          </div>

          {selectedMood && (
            <div style={styles.moodReflection}>
              Noted. Today you’re feeling <b>{selectedMood.toLowerCase()}</b>.
            </div>
          )}
        </div>

        <div style={{ height: 28 }} />
      </div>
    </div>
  );
}

/* ------------------------------ styles ------------------------------ */

const styles = {
  page: {
    minHeight: '100vh',
    background: '#000',
    color: '#fff',
    position: 'relative',
    overflowX: 'hidden',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
  },
  bg: {
    position: 'fixed',
    inset: 0,
    background:
      'radial-gradient(900px 520px at 20% 0%, rgba(120,220,255,0.10), transparent 60%),' +
      'radial-gradient(850px 520px at 80% 20%, rgba(190,150,255,0.10), transparent 60%),' +
      'linear-gradient(rgba(0,0,0,0.72), rgba(0,0,0,0.96))',
    pointerEvents: 'none',
  },

  header: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px 10px',
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
  },
  chev: { fontSize: 22, lineHeight: '22px', transform: 'translateX(-1px)' },

  headerCenter: { flex: 1, textAlign: 'center' },
  title: { fontSize: 20, fontWeight: 850, letterSpacing: 0.8 },
  subtitle: {
    marginTop: 3,
    fontSize: 11,
    color: '#cfd3dc',
    letterSpacing: 1.2,
  },

  container: {
    width: '100%',
    maxWidth: 980,
    margin: '0 auto',
    padding: '18px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },

  card: {
    position: 'relative',
    borderRadius: 22,
    overflow: 'hidden',
    padding: 16,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(14px)',
    boxShadow: '0 18px 50px rgba(0,0,0,0.55)',
  },
  cardSheen: {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))',
    pointerEvents: 'none',
  },

  cardHeaderRow: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'flex-start',
  },

  cardKicker: {
    color: '#a5b0ff',
    fontSize: 11,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  cardTitle: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: 800,
    letterSpacing: 0.2,
  },
  cardDesc: {
    marginTop: 6,
    fontSize: 12,
    color: '#cfd3dc',
    maxWidth: 520,
    lineHeight: '18px',
  },

  phasePill: {
    minWidth: 92,
    padding: '10px 12px',
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(0,0,0,0.28)',
    textAlign: 'right',
  },
  phaseBig: { fontSize: 13, fontWeight: 800 },
  phaseSmall: { marginTop: 2, fontSize: 12, color: '#cfd3dc' },

  breathGrid: {
    position: 'relative',
    marginTop: 14,
    display: 'grid',
    gridTemplateColumns: '1.05fr 0.95fr',
    gap: 14,
    alignItems: 'center',
  },

  controlsCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },

  chipsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },

  chip: {
    padding: '7px 11px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.18)',
    background: 'rgba(0,0,0,0.35)',
    cursor: 'pointer',
  },
  chipActive: { background: '#fff', borderColor: '#fff' },
  chipText: { color: '#e0e4ff', fontSize: 11, letterSpacing: 0.6 },
  chipTextActive: { color: '#000', fontWeight: 800 },

  ctaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  ctaBtn: {
    border: 0,
    borderRadius: 999,
    padding: '10px 14px',
    background: '#fff',
    color: '#000',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
  },
  ctaBtnRunning: {
    background: 'rgba(255,255,255,0.86)',
  },
  ctaIcon: { fontSize: 13, fontWeight: 900 },
  ctaText: { fontSize: 13, fontWeight: 900, letterSpacing: 0.6 },

  link: {
    color: 'rgba(0,255,255,0.85)',
    textDecoration: 'none',
    fontSize: 12,
  },

  tipBox: {
    padding: 12,
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(0,0,0,0.25)',
  },
  tipTitle: { fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase', color: '#a5b0ff' },
  tipText: { marginTop: 6, fontSize: 12, color: '#cfd3dc', lineHeight: '18px' },

  orbCol: {
    display: 'grid',
    placeItems: 'center',
  },
  orbWrap: {
    width: '100%',
    display: 'grid',
    placeItems: 'center',
    padding: '8px 0',
  },
  orb: {
    width: 170,
    height: 170,
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.20)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    boxShadow:
      '0 24px 48px rgba(0,0,0,0.65), inset 0 0 26px rgba(255,255,255,0.06)',
    transition: 'transform 900ms ease-in-out, filter 900ms ease-in-out',
    filter: 'saturate(1.15)',
  },

  affText: {
    position: 'relative',
    marginTop: 10,
    fontSize: 14,
    lineHeight: '20px',
  },

  moodRow: {
    position: 'relative',
    marginTop: 12,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodReflection: {
    position: 'relative',
    marginTop: 12,
    fontSize: 12,
    color: '#cfd3dc',
  },
};

/* ---- responsive: stack the breathing grid on small screens ---- */
if (typeof window !== 'undefined') {
  const ensureResponsive = () => {
    const w = window.innerWidth || 0;
    // Hacky but effective for inline-styles approach:
    // When narrow, we rely on CSS var by toggling gridTemplateColumns via a data attr.
    document.documentElement.dataset.energyNarrow = w < 720 ? '1' : '0';
  };
  ensureResponsive();
  window.addEventListener('resize', ensureResponsive);
}

// apply the narrow override (using inline style + dataset)
const _origBreathGrid = styles.breathGrid;
styles.breathGrid = {
  ..._origBreathGrid,
  gridTemplateColumns:
    typeof document !== 'undefined' && document.documentElement.dataset.energyNarrow === '1'
      ? '1fr'
      : _origBreathGrid.gridTemplateColumns,
};
