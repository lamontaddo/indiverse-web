// src/pages/GamesPage.jsx ✅ FULL DROP-IN (Web version of GamesScreen)
// Route: /world/:profileKey/games
//
// ✅ Guessing game (1–50) + timer + confetti burst (CSS)
// ✅ Reflex game (reaction timer) + “too early” handling + confetti
// ✅ Same "not stretched" layout: centered container (maxWidth), clean cards
// ✅ No RN/Expo deps

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const GUESS_MIN = 1;
const GUESS_MAX = 50;

/* ------------------------------ utils ------------------------------ */

function clampInt(n, min, max, fallback) {
  const x = parseInt(n, 10);
  if (!Number.isFinite(x)) return fallback;
  return Math.max(min, Math.min(max, x));
}

function useConfettiBurst() {
  const [bursts, setBursts] = useState([]);
  const fire = (count = 90) => {
    const id = `${Date.now()}-${Math.random()}`;
    const pieces = Array.from({ length: count }).map((_, i) => ({
      id: `${id}-${i}`,
      left: Math.random() * 100, // %
      delay: Math.random() * 160, // ms
      dur: 900 + Math.random() * 900, // ms
      rot: (Math.random() * 720 - 360).toFixed(0),
      drift: (Math.random() * 120 - 60).toFixed(0), // px
      size: 5 + Math.random() * 6, // px
      opacity: 0.65 + Math.random() * 0.35,
      hue: Math.floor(Math.random() * 360),
    }));
    setBursts((prev) => [...prev, { id, pieces }]);
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
    }, 2200);
  };
  return { bursts, fire };
}

/* ------------------------------ tabs ------------------------------ */

function GameTab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ ...styles.tab, ...(active ? styles.tabActive : null) }}>
      <span style={{ ...styles.tabText, ...(active ? styles.tabTextActive : null) }}>{label}</span>
    </button>
  );
}

/* ------------------------------ confetti ------------------------------ */

function ConfettiLayer({ bursts }) {
  if (!bursts.length) return null;

  return (
    <div style={styles.confettiLayer} aria-hidden>
      {bursts.map((b) =>
        b.pieces.map((p) => (
          <span
            key={p.id}
            style={{
              ...styles.confettiPiece,
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 1.6,
              opacity: p.opacity,
              background: `hsl(${p.hue} 90% 60%)`,
              animationDuration: `${p.dur}ms`,
              animationDelay: `${p.delay}ms`,
              transform: `translateX(0px) rotate(0deg)`,
              ['--drift']: `${p.drift}px`,
              ['--rot']: `${p.rot}deg`,
            }}
          />
        ))
      )}
    </div>
  );
}

/* ------------------------------ Guessing game ------------------------------ */

function GuessingGameCard() {
  const { bursts, fire } = useConfettiBurst();

  const [secret, setSecret] = useState(() => Math.floor(Math.random() * (GUESS_MAX - GUESS_MIN + 1)) + GUESS_MIN);
  const [input, setInput] = useState('');
  const [hint, setHint] = useState('Pick a number and take a shot.');
  const [attempts, setAttempts] = useState(0);
  const [done, setDone] = useState(false);

  const [startedAt, setStartedAt] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => clearInterval(id);
  }, [startedAt, done]);

  const reset = () => {
    setSecret(Math.floor(Math.random() * (GUESS_MAX - GUESS_MIN + 1)) + GUESS_MIN);
    setInput('');
    setHint('New number locked in. Take your guess.');
    setAttempts(0);
    setDone(false);
    setElapsed(0);
    setStartedAt(Date.now());
  };

  const handleGuess = () => {
    const n = clampInt(input, -999999, 999999, NaN);
    if (!Number.isFinite(n)) {
      setHint('Type a number first.');
      return;
    }
    if (n < GUESS_MIN || n > GUESS_MAX) {
      setHint(`Keep it between ${GUESS_MIN} and ${GUESS_MAX}.`);
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (n === secret) {
      setHint(`You got it in ${nextAttempts} ${nextAttempts === 1 ? 'try' : 'tries'} 🎉`);
      setDone(true);
      fire(110);
    } else if (n < secret) {
      setHint('Too low. Try going higher.');
    } else {
      setHint('Too high. Try going lower.');
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardSheen} />
      <ConfettiLayer bursts={bursts} />

      <div style={styles.cardHeader}>
        <div>
          <div style={styles.kicker}>Guessing Game</div>
          <div style={styles.h2}>Pick {GUESS_MIN}–{GUESS_MAX}</div>
          <div style={styles.desc}>Try to land the secret number with as few attempts as possible.</div>
        </div>
        <div style={styles.iconBadge} title="dice" aria-label="dice">🎲</div>
      </div>

      <div style={styles.hint}>{hint}</div>

      <div style={styles.row}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          inputMode="numeric"
          placeholder="Your guess"
          style={styles.input}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleGuess();
          }}
        />
        <button onClick={handleGuess} style={styles.primaryBtn}>
          Guess
        </button>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.stat}>Attempts: <b style={styles.statB}>{attempts}</b></div>
        <div style={styles.stat}>Time: <b style={styles.statB}>{elapsed}s</b></div>
      </div>

      {done && (
        <button onClick={reset} style={styles.secondaryBtn}>
          ↻ Play Again
        </button>
      )}
    </div>
  );
}

/* ------------------------------ Reflex game ------------------------------ */

function ReflexGameCard() {
  const { bursts, fire } = useConfettiBurst();

  const [state, setState] = useState('idle'); // idle | waiting | ready | result
  const [reactionTime, setReactionTime] = useState(null);
  const [message, setMessage] = useState('Click “Start Round”, then wait for the cue.');

  const timerRef = useRef(null);
  const readyTimeRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => () => clearTimer(), []);

  const startRound = () => {
    clearTimer();
    setReactionTime(null);
    setState('waiting');
    setMessage('Wait for it…');

    const delay = 1500 + Math.random() * 1500; // 1.5–3s
    timerRef.current = setTimeout(() => {
      readyTimeRef.current = Date.now();
      setState('ready');
      setMessage('Tap now!');
    }, delay);
  };

  const handleTap = () => {
    if (state === 'waiting') {
      clearTimer();
      setState('result');
      setReactionTime(null);
      setMessage('Too early 🫠 Start another round.');
      return;
    }

    if (state === 'ready') {
      const now = Date.now();
      const rt = now - (readyTimeRef.current || now);
      setReactionTime(rt);
      setState('result');

      if (rt < 300) {
        setMessage(`Lightning fast: ${rt} ms ⚡`);
        fire(120);
      } else if (rt < 500) {
        setMessage(`Nice reflexes: ${rt} ms 👌`);
      } else {
        setMessage(`Reaction: ${rt} ms — you can go faster 😌`);
      }
    }
  };

  const orbStyle = useMemo(() => {
    if (state === 'ready') return { ...styles.orb, backgroundImage: styles.orbReadyBg, boxShadow: styles.orbReadyShadow };
    if (state === 'result') return { ...styles.orb, backgroundImage: styles.orbResultBg };
    if (state === 'waiting') return { ...styles.orb, opacity: 0.9 };
    return styles.orb;
  }, [state]);

  return (
    <div style={styles.card}>
      <div style={styles.cardSheen} />
      <ConfettiLayer bursts={bursts} />

      <div style={styles.cardHeader}>
        <div>
          <div style={styles.kicker}>Reflex Game</div>
          <div style={styles.h2}>Reaction timer</div>
          <div style={styles.desc}>Start, wait for the light, then click the pad as fast as you can.</div>
        </div>
        <div style={styles.iconBadge} title="flash" aria-label="flash">⚡</div>
      </div>

      <div style={styles.hint}>{message}</div>

      <button onClick={handleTap} style={styles.tapPad}>
        <div style={styles.tapInner}>
          <div style={orbStyle} />
          <div style={styles.tapText}>
            {state === 'ready' ? 'TAP!' : 'Tap inside when it lights up'}
          </div>
        </div>
      </button>

      <div style={styles.bottomRow}>
        <button onClick={startRound} style={styles.secondaryBtn}>
          ▶ {state === 'waiting' ? 'Restart Round' : 'Start Round'}
        </button>

        {reactionTime != null && (
          <div style={styles.stat}>
            Last: <b style={styles.statB}>{reactionTime} ms</b>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ page ------------------------------ */

export default function GamesPage() {
  const { profileKey } = useParams();
  const navigate = useNavigate();

  const [activeGame, setActiveGame] = useState('guess');

  return (
    <div style={styles.page}>
      <style>{css}</style>
      <div style={styles.bg} />

      {/* header */}
      <div style={styles.header}>
        <button onClick={() => navigate(`/world/${profileKey}`)} style={styles.backBtn} aria-label="Back">
          <span style={styles.chev}>‹</span>
        </button>

        <div style={styles.headerCenter}>
          <div style={styles.title}>Games</div>
          <div style={styles.subtitle}>LIGHT PLAY • QUICK RESET</div>
        </div>

        <div style={{ width: 40 }} />
      </div>

      <div style={styles.container}>
        {/* selector */}
        <div style={styles.selectorCard}>
          <div style={styles.selectorSheen} />
          <div style={styles.selectorInner}>
            <GameTab label="Guessing" active={activeGame === 'guess'} onClick={() => setActiveGame('guess')} />
            <GameTab label="Reflex" active={activeGame === 'reflex'} onClick={() => setActiveGame('reflex')} />
          </div>
          <div style={styles.selectorMeta}>
            <Link to={`/world/${profileKey}`} style={styles.link}>
              Return to {profileKey}
            </Link>
          </div>
        </div>

        {/* active game */}
        {activeGame === 'guess' ? <GuessingGameCard /> : <ReflexGameCard />}

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
      'radial-gradient(900px 520px at 18% 0%, rgba(120,220,255,0.09), transparent 60%),' +
      'radial-gradient(850px 520px at 82% 20%, rgba(190,150,255,0.09), transparent 60%),' +
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

  selectorCard: {
    position: 'relative',
    borderRadius: 18,
    overflow: 'hidden',
    padding: 10,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(14px)',
    boxShadow: '0 18px 50px rgba(0,0,0,0.55)',
  },
  selectorSheen: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))',
    pointerEvents: 'none',
  },
  selectorInner: {
    position: 'relative',
    display: 'flex',
    gap: 8,
  },
  selectorMeta: {
    position: 'relative',
    marginTop: 8,
    display: 'flex',
    justifyContent: 'center',
  },

  tab: {
    flex: 1,
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(0,0,0,0.35)',
    borderRadius: 999,
    padding: '10px 12px',
    cursor: 'pointer',
  },
  tabActive: {
    background: '#fff',
    borderColor: '#fff',
  },
  tabText: { color: '#e0e4ff', fontSize: 12, fontWeight: 700, letterSpacing: 0.7 },
  tabTextActive: { color: '#000', fontWeight: 900 },

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
    background: 'linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))',
    pointerEvents: 'none',
  },

  cardHeader: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'flex-start',
  },
  kicker: {
    color: '#a5b0ff',
    fontSize: 11,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  h2: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: 900,
    letterSpacing: 0.2,
  },
  desc: {
    marginTop: 6,
    fontSize: 12,
    color: '#cfd3dc',
    maxWidth: 620,
    lineHeight: '18px',
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(0,0,0,0.28)',
    display: 'grid',
    placeItems: 'center',
    fontSize: 16,
  },

  hint: {
    position: 'relative',
    marginTop: 10,
    marginBottom: 12,
    color: '#e9ecff',
    fontSize: 13,
  },

  row: {
    position: 'relative',
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.22)',
    padding: '10px 12px',
    color: '#fff',
    background: 'rgba(0,0,0,0.35)',
    outline: 'none',
  },
  primaryBtn: {
    border: 0,
    borderRadius: 999,
    padding: '10px 14px',
    background: '#fff',
    color: '#000',
    cursor: 'pointer',
    fontWeight: 900,
    letterSpacing: 0.6,
  },
  secondaryBtn: {
    border: 0,
    borderRadius: 999,
    padding: '10px 14px',
    background: '#fff',
    color: '#000',
    cursor: 'pointer',
    fontWeight: 900,
    letterSpacing: 0.6,
    marginTop: 12,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  },

  statsRow: {
    position: 'relative',
    marginTop: 10,
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
    flexWrap: 'wrap',
  },
  stat: { color: '#cfd3dc', fontSize: 12 },
  statB: { fontWeight: 900, color: '#fff' },

  tapPad: {
    position: 'relative',
    width: '100%',
    marginTop: 8,
    borderRadius: 18,
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(0,0,0,0.35)',
    padding: 16,
    cursor: 'pointer',
    textAlign: 'center',
  },
  tapInner: {
    display: 'grid',
    placeItems: 'center',
    gap: 10,
    padding: '10px 0',
  },
  tapText: {
    color: '#cfd3dc',
    fontSize: 12,
    letterSpacing: 0.6,
  },

  orb: {
    width: 120,
    height: 120,
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.18)',
    backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.36), rgba(255,255,255,0.08) 60%, rgba(255,255,255,0.03))',
    boxShadow: '0 18px 42px rgba(0,0,0,0.65), inset 0 0 22px rgba(255,255,255,0.06)',
    transition: 'filter 200ms ease',
  },
  orbReadyBg:
    'radial-gradient(circle at 30% 30%, rgba(120,220,255,0.92), rgba(120,220,255,0.18) 60%, rgba(120,220,255,0.06))',
  orbReadyShadow:
    '0 20px 52px rgba(0,0,0,0.65), 0 0 0 6px rgba(120,220,255,0.08), inset 0 0 22px rgba(255,255,255,0.06)',
  orbResultBg:
    'radial-gradient(circle at 30% 30%, rgba(190,150,255,0.75), rgba(120,100,255,0.14) 60%, rgba(120,100,255,0.06))',

  bottomRow: {
    position: 'relative',
    marginTop: 12,
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  link: {
    color: 'rgba(0,255,255,0.85)',
    textDecoration: 'none',
    fontSize: 12,
  },

  confettiLayer: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
    zIndex: 5,
  },
  confettiPiece: {
    position: 'absolute',
    top: '-12px',
    borderRadius: 2,
    animationName: 'confettiFall',
    animationTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    animationFillMode: 'forwards',
  },
};

const css = `
@keyframes confettiFall {
  0%   { transform: translateX(0px) translateY(0px) rotate(0deg); opacity: 0; }
  10%  { opacity: 1; }
  100% { transform: translateX(var(--drift)) translateY(520px) rotate(var(--rot)); opacity: 0; }
}

/* responsive stacking */
@media (max-width: 720px) {
  .__games_container { padding: 14px 12px; }
}
`;
