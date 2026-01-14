// src/pages/LinkPortalPage.jsx ✅ FULL DROP-IN (Web)
// Routes:
//   - /world/:profileKey/portal
//   - /world/:profileKey/portal/:portalKey
//
// Mirrors RN LinkPortalScreen:
// ✅ Video background (autoplay-friendly on web: muted by default)
// ✅ Gradient overlay from portal.gradientColors
// ✅ CTA gradient from portal.ctaColors
// ✅ Close button + ESC to go back (fallback to /world/:profileKey)
// ✅ Supports direct-link entry:
//    - prefers location.state.portal
//    - then profile.portals[portalKey]
//    - then profile.portal
//
// Requires: react-router-dom
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getProfileByKey } from '../services/profileRegistry';

function pickColors(maybeColors, fallback) {
  if (!Array.isArray(maybeColors)) return fallback;
  const cleaned = maybeColors.map((c) => String(c || '').trim()).filter(Boolean);
  return cleaned.length >= 2 ? cleaned : fallback;
}

function normalizeUrl(raw) {
  const s = String(raw || '').trim();
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) return `https://${s}`;
  return s;
}

export default function LinkPortalPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const profileKey = params.profileKey || 'lamont';
  const portalKey = params.portalKey || null;

  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true); // autoplay friendly on web

  const profile = useMemo(() => getProfileByKey(profileKey), [profileKey]);

  const portal = useMemo(() => {
    const fromState = location?.state?.portal;
    if (fromState) return fromState;

    const portals = profile?.portals || null;
    if (portalKey && portals && portals[portalKey]) return portals[portalKey];

    return profile?.portal || null;
  }, [location?.state, profile, portalKey]);

  const title = String(portal?.title || profile?.label || 'PORTAL').toUpperCase();
  const subtitle = String(portal?.subtitle || '').trim();
  const buttonText = String(portal?.buttonText || 'Enter').trim();

  const url = useMemo(() => normalizeUrl(portal?.url), [portal?.url]);

  const videoUrl = useMemo(() => {
    // On web, prefer a URL string. If your config uses { uri }, handle that too.
    if (typeof portal?.videoUrl === 'string') return portal.videoUrl;
    if (portal?.videoUrl?.uri) return portal.videoUrl.uri;
    if (typeof portal?.video === 'string') return portal.video;
    if (portal?.video?.uri) return portal.video.uri;
    return null;
  }, [portal]);

  const gradientColors = useMemo(
    () => pickColors(portal?.gradientColors, ['rgba(0,0,0,0.35)', 'rgba(0,0,0,0.88)']),
    [portal?.gradientColors]
  );

  const ctaColors = useMemo(
    () => pickColors(portal?.ctaColors, ['#FFD54A', '#FFB300']),
    [portal?.ctaColors]
  );

  const onEnter = () => {
    if (!url) return;
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      // fallback
      window.location.href = url;
    }
  };

  const onClose = () => {
    // If user came from somewhere, go back. Otherwise go to world home.
    if (window.history.length > 1) navigate(-1);
    else navigate(`/world/${profileKey}`);
  };

  // ESC to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileKey]);

  // Try to unmute only after user interaction (browser policy)
  const toggleMute = () => {
    setMuted((m) => !m);
    const v = videoRef.current;
    if (v) v.muted = !v.muted;
  };

  const overlayStyle = useMemo(() => {
    // simple 2-stop gradient; if you provide 3+ colors, we’ll use first/last
    const first = gradientColors[0];
    const last = gradientColors[gradientColors.length - 1];
    return {
      background: `linear-gradient(to bottom, ${first}, ${last})`,
    };
  }, [gradientColors]);

  const ctaStyle = useMemo(() => {
    const first = ctaColors[0];
    const last = ctaColors[ctaColors.length - 1];
    return {
      background: `linear-gradient(90deg, ${first}, ${last})`,
    };
  }, [ctaColors]);

  return (
    <div style={styles.container}>
      {/* Background */}
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          style={styles.video}
          autoPlay
          loop
          playsInline
          muted={muted}
        />
      ) : (
        <div style={styles.fallbackBg} />
      )}

      {/* Gradient overlay */}
      <div style={{ ...styles.overlay, ...overlayStyle }} />

      {/* Close */}
      <div style={styles.closeWrap}>
        <button
          type="button"
          onClick={onClose}
          style={styles.closeButton}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.stack}>
          <div style={styles.title}>{title}</div>
          {!!subtitle && <div style={styles.subtitle}>{subtitle}</div>}

          <button
            type="button"
            onClick={onEnter}
            disabled={!url}
            style={{
              ...styles.enterButton,
              ...(url ? null : styles.disabledButton),
            }}
          >
            <div style={{ ...styles.enterGradient, ...ctaStyle }}>
              <span style={styles.enterText}>{buttonText.toUpperCase()}</span>
            </div>
          </button>

         

          {!url && (
            <div style={styles.missingUrl}>
              Missing <code>portal.url</code> (set it in <code>profile.portals</code> or route state)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  video: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'scale(1.02)', // slight cinematic fill
  },
  fallbackBg: {
    position: 'absolute',
    inset: 0,
    backgroundColor: '#000',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
  },
  closeWrap: {
    position: 'absolute',
    top: 18,
    left: 18,
    zIndex: 10,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.35)',
    background: 'rgba(0,0,0,0.55)',
    color: '#fff',
    fontSize: 18,
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
    userSelect: 'none',
  },
  content: {
    position: 'relative',
    zIndex: 2,
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: '0 24px 80px',
    textAlign: 'center',
  },
  stack: {
    width: 'min(520px, 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: 800,
    letterSpacing: 4,
    color: '#fff',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  subtitle: {
    color: '#f5f5f5',
    fontSize: 14,
    letterSpacing: 1,
    marginBottom: 28,
    textTransform: 'uppercase',
    opacity: 0.95,
  },
  enterButton: {
    border: 'none',
    padding: 0,
    background: 'transparent',
    borderRadius: 999,
    overflow: 'hidden',
    minWidth: 220,
    cursor: 'pointer',
    transform: 'translateZ(0)',
  },
  disabledButton: {
    opacity: 0.45,
    cursor: 'not-allowed',
  },
  enterGradient: {
    padding: '14px 26px',
    borderRadius: 999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enterText: {
    color: '#000',
    fontWeight: 800,
    letterSpacing: 1.2,
    fontSize: 14,
  },
  muteBtn: {
    marginTop: 14,
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.25)',
    background: 'rgba(0,0,0,0.35)',
    color: 'rgba(255,255,255,0.9)',
    padding: '10px 14px',
    fontSize: 12,
    cursor: 'pointer',
  },
  missingUrl: {
    marginTop: 14,
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    lineHeight: 1.4,
  },
};
