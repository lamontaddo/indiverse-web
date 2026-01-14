// src/pages/OwnerFlowerOrdersPage.jsx ✅ FULL DROP-IN (Web)
// Route: /world/:profileKey/owner/flowerorders
//
// ✅ Requires profileKey (no silent fallback)
// ✅ GET   /api/owner/flowers/orders
// ✅ PATCH /api/owner/flowers/orders/:id   { status }
// ✅ Sends x-profile-key + Authorization Bearer <ownerToken>
// ✅ Expand/collapse, refresh, status updates, cancel confirm
//
// Env (optional):
// - VITE_API_BASE_URL ('' = same-origin)

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

function normalizeProfileKey(pk) {
  return String(pk || '').trim().toLowerCase();
}

function ownerTokenKey(profileKey) {
  return `ownerToken:${normalizeProfileKey(profileKey)}`;
}

function getOwnerToken(profileKey) {
  try {
    return (
      localStorage.getItem(ownerTokenKey(profileKey)) ||
      localStorage.getItem('ownerToken') ||
      ''
    );
  } catch {
    return '';
  }
}

async function readJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

async function ownerFetchWeb(path, { profileKey, method = 'GET', body } = {}) {
  const token = getOwnerToken(profileKey);
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
      'x-profile-key': normalizeProfileKey(profileKey),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });
  return res;
}

function fmtWhen(d) {
  try {
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return '';
    return dt.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

function statusColors(status) {
  const st = String(status || 'new').toLowerCase();
  if (st === 'confirmed') return { bg: 'rgba(46,204,113,0.25)', bd: 'rgba(46,204,113,0.45)' };
  if (st === 'completed') return { bg: 'rgba(52,152,219,0.25)', bd: 'rgba(52,152,219,0.45)' };
  if (st === 'cancelled') return { bg: 'rgba(231,76,60,0.25)', bd: 'rgba(231,76,60,0.45)' };
  return { bg: 'rgba(255,255,255,0.10)', bd: 'rgba(255,255,255,0.18)' };
}

export default function OwnerFlowerOrdersPage() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const routeKey = normalizeProfileKey(params?.profileKey);
  const stateKey = normalizeProfileKey(location?.state?.profileKey);

  // ✅ STRICT: param wins, else state. (No localStorage fallback here unless you want it.)
  const profileKey = routeKey || stateKey || '';

  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');

  const canUseApi = useMemo(() => !!profileKey, [profileKey]);

  const goOwnerLogin = useCallback(() => {
    if (!profileKey) {
      navigate('/', { replace: true });
      return;
    }
    navigate(`/world/${encodeURIComponent(profileKey)}/owner/login`, {
      replace: true,
      state: { profileKey, bgUrl: location?.state?.bgUrl || null },
    });
  }, [navigate, profileKey, location?.state?.bgUrl]);

  const loadOrders = useCallback(
    async (mode = 'load') => {
      if (!profileKey) {
        setOrders([]);
        setLoading(false);
        setRefreshing(false);
        setError('Missing profileKey. Open this page as /world/:profileKey/owner/flowerorders');
        return;
      }

      try {
        setError('');
        if (mode === 'refresh') setRefreshing(true);
        else setLoading(true);

        const res = await ownerFetchWeb('/api/owner/flowers/orders', { profileKey });
        const body = await readJsonSafe(res);

        if (res.status === 401 || res.status === 403) {
          setOrders([]);
          setError('Session expired. Please log in again.');
          goOwnerLogin();
          return;
        }

        if (!res.ok) {
          throw new Error(body?.error || body?.message || `Failed to fetch flower orders (${res.status})`);
        }

        const list = Array.isArray(body) ? body : Array.isArray(body?.items) ? body.items : [];
        setOrders(list);
      } catch (e) {
        setError(e?.message || 'Unable to load flower orders.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [profileKey, goOwnerLogin]
  );

  useEffect(() => {
    loadOrders('load');
  }, [loadOrders]);

  const updateStatus = useCallback(
    async (orderId, status) => {
      if (!profileKey) {
        setError('Missing profileKey.');
        return;
      }
      if (!orderId) return;

      try {
        setUpdatingId(orderId);
        setError('');

        const res = await ownerFetchWeb(`/api/owner/flowers/orders/${encodeURIComponent(orderId)}`, {
          profileKey,
          method: 'PATCH',
          body: JSON.stringify({ status }),
        });

        const body = await readJsonSafe(res);

        if (res.status === 401 || res.status === 403) {
          setError('Session expired. Please log in again.');
          goOwnerLogin();
          return;
        }

        if (!res.ok) {
          throw new Error(body?.error || body?.message || `Failed to update (${res.status})`);
        }

        const updated = body;
        setOrders((prev) =>
          prev.map((o) => (String(o?._id) === String(updated?._id) ? updated : o))
        );
      } catch (e) {
        setError(e?.message || 'Unable to update order status.');
      } finally {
        setUpdatingId('');
      }
    },
    [profileKey, goOwnerLogin]
  );

  const confirmCancel = useCallback(
    (orderId) => {
      const ok = window.confirm('Cancel this order?\n\nThis will mark the order as cancelled.');
      if (ok) updateStatus(orderId, 'cancelled');
    },
    [updateStatus]
  );

  const onBack = () => {
    if (window.history.length > 1) navigate(-1);
    else if (profileKey) navigate(`/world/${encodeURIComponent(profileKey)}/owner/home`, { replace: true, state: { profileKey } });
    else navigate('/', { replace: true });
  };

  return (
    <div style={styles.page}>
      <style>{css}</style>

      <div style={styles.header}>
        <button className="btnIcon" onClick={onBack} aria-label="Back">
          ‹
        </button>

        <div style={{ flex: 1 }}>
          <div style={styles.titleRow}>
            <span style={{ fontSize: 18 }}>🌹</span>
            <div style={styles.title}>Flower Consultations</div>
          </div>
          <div style={styles.subtitle}>
            requests • occasions • deliveries{profileKey ? ` • ${profileKey}` : ''}
          </div>
        </div>

        <button
          className="btnPill"
          onClick={() => loadOrders('refresh')}
          disabled={!canUseApi || refreshing}
          title="Refresh"
        >
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {!canUseApi ? (
        <div style={styles.bannerErr}>
          <div style={{ fontWeight: 900 }}>Missing profileKey</div>
          <div style={{ marginTop: 6, opacity: 0.9, fontSize: 12 }}>
            Open: <code style={styles.code}>/world/:profileKey/owner/flowerorders</code>
          </div>
        </div>
      ) : null}

      {error ? (
        <div style={styles.bannerWarn}>
          <div style={{ fontWeight: 900 }}>Notice</div>
          <div style={{ marginTop: 6, fontSize: 12 }}>{error}</div>
        </div>
      ) : null}

      {loading ? (
        <div style={styles.loading}>
          <div className="spinner" />
          <div style={{ opacity: 0.75, fontSize: 13 }}>Loading flower orders…</div>
        </div>
      ) : orders.length === 0 ? (
        <div style={styles.empty}>
          <div style={{ fontSize: 16, fontWeight: 800 }}>No flower orders yet 🌹</div>
          <div style={{ marginTop: 8, opacity: 0.75, fontSize: 13, textAlign: 'center' }}>
            When someone submits the flower form, orders will land here.
          </div>
        </div>
      ) : (
        <div style={styles.list}>
          {orders.map((item) => {
            const id = String(item?._id || item?.id || '');
            const expanded = expandedId === id;
            const st = String(item?.status || 'new').toLowerCase();
            const pill = statusColors(st);

            return (
              <button
                key={id}
                className="card"
                onClick={() => setExpandedId((prev) => (prev === id ? '' : id))}
              >
                <div style={styles.cardTop}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={styles.cardTitle}>{item?.bouquetType || 'Flower order'}</div>
                    <div style={styles.cardSub}>
                      {item?.name || '—'} • {item?.phone || '—'}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ ...styles.statusPill, background: pill.bg, borderColor: pill.bd }}>
                      {st}
                    </span>
                    <div style={styles.cardTime}>{item?.createdAt ? fmtWhen(item.createdAt) : ''}</div>
                  </div>
                </div>

                <div style={styles.badges}>
                  {item?.occasion ? <span className="badge">🎁 {item.occasion}</span> : null}
                  {item?.deliveryDate ? <span className="badge">🗓️ {item.deliveryDate}</span> : null}
                </div>

                {expanded ? (
                  <div style={styles.expanded}>
                    {item?.deliveryAddress ? (
                      <div style={styles.detail}>
                        <div style={styles.detailLabel}>Address</div>
                        <div style={styles.detailValue}>{item.deliveryAddress}</div>
                      </div>
                    ) : null}

                    {item?.notes ? (
                      <div style={styles.detail}>
                        <div style={styles.detailLabel}>Notes</div>
                        <div style={styles.detailValue}>{item.notes}</div>
                      </div>
                    ) : null}

                    <div style={styles.actions}>
                      <button
                        className="btnGreen"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          updateStatus(id, 'confirmed');
                        }}
                        disabled={updatingId === id}
                      >
                        {updatingId === id ? 'Updating…' : 'Mark confirmed'}
                      </button>

                      <button
                        className="btnOutline"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          updateStatus(id, 'completed');
                        }}
                        disabled={updatingId === id}
                      >
                        {updatingId === id ? 'Updating…' : 'Mark completed'}
                      </button>

                      <button
                        className="btnRed"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          confirmCancel(id);
                        }}
                        disabled={updatingId === id}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #020617, #0b1220, #020617)',
    color: '#e5e7eb',
    padding: '18px',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    paddingBottom: 14,
  },
  titleRow: { display: 'flex', alignItems: 'center', gap: 8 },
  title: { fontSize: 20, fontWeight: 900, letterSpacing: 0.6 },
  subtitle: { marginTop: 6, color: '#9ca3af', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },

  bannerErr: {
    borderRadius: 14,
    padding: 12,
    background: 'rgba(231,76,60,0.12)',
    border: '1px solid rgba(231,76,60,0.30)',
    marginBottom: 10,
  },
  bannerWarn: {
    borderRadius: 14,
    padding: 12,
    background: 'rgba(250,204,21,0.10)',
    border: '1px solid rgba(250,204,21,0.26)',
    marginBottom: 10,
  },
  code: {
    background: 'rgba(255,255,255,0.08)',
    padding: '2px 6px',
    borderRadius: 8,
  },

  loading: {
    marginTop: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  empty: {
    marginTop: 80,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  list: { marginTop: 8, display: 'flex', flexDirection: 'column', gap: 12 },

  cardTop: { display: 'flex', alignItems: 'flex-start', gap: 12 },
  cardTitle: { fontSize: 15, fontWeight: 800, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  cardSub: { marginTop: 6, fontSize: 12, color: '#cbd5e1' },
  cardTime: { marginTop: 6, fontSize: 11, color: '#9ca3af' },

  statusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 10px',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    border: '1px solid rgba(255,255,255,0.18)',
  },

  badges: { marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' },

  expanded: {
    marginTop: 12,
    paddingTop: 12,
    borderTop: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  detailLabel: { fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1 },
  detailValue: { marginTop: 4, fontSize: 13, color: '#fff', whiteSpace: 'pre-wrap' },
  detail: {},

  actions: { marginTop: 8, display: 'flex', gap: 10, flexWrap: 'wrap' },
};

const css = `
.card{
  text-align: left;
  width: 100%;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(15,23,42,0.72);
  border-radius: 18px;
  padding: 14px;
  cursor: pointer;
  box-shadow: 0 18px 40px rgba(0,0,0,0.35);
}
.card:hover{ border-color: rgba(255,255,255,0.20); }
.card:active{ transform: scale(0.998); opacity: 0.98; }

.badge{
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.06);
  color: #fff;
  font-size: 12px;
}

.btnIcon{
  width: 36px;
  height: 36px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(0,0,0,0.25);
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}
.btnIcon:active{ opacity: 0.85; }

.btnPill{
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(0,0,0,0.25);
  color: #e5e7eb;
  padding: 9px 12px;
  cursor: pointer;
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.6px;
}
.btnPill:disabled{ opacity: 0.6; cursor: default; }

.btnGreen, .btnOutline, .btnRed{
  border-radius: 999px;
  padding: 10px 14px;
  font-weight: 900;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  font-size: 12px;
  cursor: pointer;
}
.btnGreen{
  border: 1px solid rgba(46,204,113,0.40);
  background: rgba(46,204,113,0.22);
  color: #fff;
}
.btnOutline{
  border: 1px solid rgba(255,255,255,0.26);
  background: transparent;
  color: #fff;
}
.btnRed{
  border: 1px solid rgba(231,76,60,0.42);
  background: rgba(231,76,60,0.22);
  color: #fff;
}
.btnGreen:disabled, .btnOutline:disabled, .btnRed:disabled{
  opacity: 0.6;
  cursor: default;
}

.spinner{
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: rgba(255,255,255,0.9);
  animation: spin 0.8s linear infinite;
}
@keyframes spin{ to{ transform: rotate(360deg);} }
`;
