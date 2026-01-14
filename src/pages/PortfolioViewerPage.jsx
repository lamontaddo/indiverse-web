// src/pages/PortfolioViewerPage.jsx ✅ FULL DROP-IN (Web)
// Route: /world/:profileKey/portfolio/view
//
// Expects router state:
//   { url, id?, profileKey }
//
// Features:
// ✅ Fade-in entrance
// ✅ Drag to pan when zoomed in
// ✅ Pinch-to-zoom via trackpad pinch (wheel + ctrlKey)
// ✅ Wheel zoom (ctrlKey) and clamp [1..4]
// ✅ Double-click toggles 1x <-> 2x (like mobile double tap)
// ✅ ESC to close
// ✅ Close button (top-left)
//
// NOTE: Mobile pinch gestures aren't native on web; trackpads typically emit wheel+ctrl.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function PortfolioViewerPage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const routeProfileKey = String(params?.profileKey || '').trim().toLowerCase();
  const stateProfileKey = String(location?.state?.profileKey || '').trim().toLowerCase();
  const profileKey = routeProfileKey || stateProfileKey || '';

  const url = useMemo(() => String(location?.state?.url || '').trim(), [location?.state?.url]);

  // fade in
  const [mounted, setMounted] = useState(false);

  // transform state
  const [scale, setScale] = useState(1);
  const scaleRef = useRef(1);

  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const panRef = useRef({ tx: 0, ty: 0 });

  // dragging
  const draggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const stageRef = useRef(null);

  useEffect(() => setMounted(true), []);

  const resetPan = () => {
    panRef.current = { tx: 0, ty: 0 };
    setTx(0);
    setTy(0);
  };

  const commitScale = (next) => {
    const s = clamp(next, 1, 4);
    scaleRef.current = s;
    setScale(s);

    if (s <= 1.02) {
      scaleRef.current = 1;
      setScale(1);
      resetPan();
    }
  };

  const onClose = () => {
    // go back if possible; else fall back to portfolio list
    if (window.history.length > 1) navigate(-1);
    else if (profileKey) navigate(`/world/${encodeURIComponent(profileKey)}/portfolio`, { replace: true });
    else navigate('/', { replace: true });
  };

  // ESC closes
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileKey]);

  // Double click = zoom toggle (1 <-> 2)
  const onDoubleClick = () => {
    const zoomingIn = scaleRef.current <= 1.05;
    commitScale(zoomingIn ? 2 : 1);
  };

  // Drag to pan (only when zoomed)
  const onPointerDown = (e) => {
    if (scaleRef.current <= 1.01) return;
    draggingRef.current = true;
    (e.currentTarget || stageRef.current)?.setPointerCapture?.(e.pointerId);

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      tx: panRef.current.tx,
      ty: panRef.current.ty,
    };
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const nextTx = dragStartRef.current.tx + dx;
    const nextTy = dragStartRef.current.ty + dy;

    panRef.current = { tx: nextTx, ty: nextTy };
    setTx(nextTx);
    setTy(nextTy);
  };

  const onPointerUp = () => {
    draggingRef.current = false;
  };

  // Trackpad pinch usually emits wheel with ctrlKey=true
  const onWheel = (e) => {
    // Only treat ctrl+wheel as zoom (prevents messing scroll)
    if (!e.ctrlKey) return;

    e.preventDefault();

    // deltaY > 0 = zoom out, < 0 = zoom in
    const direction = e.deltaY > 0 ? -1 : 1;
    const step = 0.12; // smooth zoom
    const next = scaleRef.current + direction * step;

    commitScale(next);
  };

  if (!url) {
    return (
      <div style={styles.page}>
        <style>{css}</style>
        <div style={styles.topOverlay}>
          <button className="pv-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div style={styles.center}>
          <div style={styles.dim}>Missing image URL. Go back and select an image again.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{css}</style>

      <div style={styles.bg} className={mounted ? 'pv-fade-in' : 'pv-fade-out'} />

      <div
        ref={stageRef}
        className="pv-stage"
        onDoubleClick={onDoubleClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        // ensures wheel handler can preventDefault in React
        onContextMenu={(e) => e.preventDefault()}
        title="Double-click to zoom • ctrl+wheel to zoom • drag to pan"
      >
        <img
          src={url}
          alt=""
          draggable={false}
          className="pv-img"
          style={{
            transform: `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`,
            opacity: mounted ? 1 : 0,
            cursor: scale > 1.01 ? (draggingRef.current ? 'grabbing' : 'grab') : 'zoom-in',
          }}
        />
      </div>

      <div style={styles.topOverlay}>
        <button className="pv-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <div style={styles.hintPill}>
        <span style={styles.dot} />
        <span style={styles.hintText}>
          {Math.round(scale * 100)}% • double-click zoom • ctrl+wheel pinch • drag to pan
        </span>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#000',
    position: 'relative',
    overflow: 'hidden',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, #05070D, #000)',
  },
  topOverlay: {
    position: 'absolute',
    // “safe area” approximation for iOS Safari notches
    top: 'max(16px, env(safe-area-inset-top))',
    left: 16,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  center: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    position: 'relative',
    zIndex: 2,
  },
  dim: { color: 'rgba(255,255,255,0.75)', fontWeight: 900, textAlign: 'center' },
  hintPill: {
    position: 'absolute',
    bottom: 'max(18px, env(safe-area-inset-bottom))',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 14px',
    borderRadius: 999,
    background: 'rgba(15,23,42,0.85)',
    border: '1px solid rgba(148,163,184,0.55)',
    boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
    maxWidth: 'calc(100vw - 24px)',
  },
  dot: { width: 8, height: 8, borderRadius: 999, background: '#22c55e', display: 'inline-block' },
  hintText: { color: '#9ca3af', fontSize: 12, fontWeight: 800, letterSpacing: 0.6, whiteSpace: 'nowrap' },
};

const css = `
.pv-fade-in{ opacity: 1; transition: opacity 220ms ease; }
.pv-fade-out{ opacity: 0; }

.pv-stage{
  position: relative;
  z-index: 2;
  width: 100vw;
  height: 100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  touch-action: none; /* allow pointer drag without scrolling */
}

.pv-img{
  width: 100vw;
  height: 100vh;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
  will-change: transform, opacity;
  transition: opacity 220ms ease;
}

.pv-close{
  width: 40px;
  height: 40px;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(0,0,0,0.35);
  color: #fff;
  cursor: pointer;
  display:grid;
  place-items:center;
  font-weight: 900;
  box-shadow: 0 18px 40px rgba(0,0,0,0.35);
}
.pv-close:active{ opacity: 0.78; transform: scale(0.98); }

/* Reduced motion */
@media (prefers-reduced-motion: reduce){
  .pv-fade-in, .pv-img{ transition: none; }
}
`;
