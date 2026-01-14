// src/pages/OwnerProductsPage.jsx ✅ FULL DROP-IN (Web)
// Route: /world/:profileKey/owner/products
//
// Uses: /api/owner/products (GET/POST/PATCH/DELETE)
// Requires: :profileKey in route (no silent fallback)
// Owner token: localStorage ownerToken:<profileKey> (fallback ownerToken)

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function normalizeProfileKey(pk) {
  return String(pk || "").trim().toLowerCase();
}

function ownerTokenKey(profileKey) {
  return `ownerToken:${normalizeProfileKey(profileKey)}`;
}

function getOwnerToken(profileKey) {
  try {
    return (
      localStorage.getItem(ownerTokenKey(profileKey)) ||
      localStorage.getItem("ownerToken") ||
      ""
    );
  } catch {
    return "";
  }
}

async function readJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function ownerFetchWeb(path, { profileKey, method = "GET", body } = {}) {
  const pk = normalizeProfileKey(profileKey);
  const token = getOwnerToken(pk);

  const res = await fetch(path, {
    method,
    headers: {
      "content-type": "application/json",
      "x-profile-key": pk,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });

  return res;
}

function moneyFromCents(cents, currency = "usd") {
  const n = Number(cents || 0) / 100;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: String(currency || "usd").toUpperCase(),
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

function parseCsv(s) {
  if (!s) return [];
  return String(s)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function joinCsv(arr) {
  if (!Array.isArray(arr) || !arr.length) return "";
  return arr.join(", ");
}

const EMPTY_FORM = {
  _id: null,
  name: "",
  description: "",
  category: "",
  imageUrl: "",
  imageUrlsCsv: "",
  priceDollars: "",
  currency: "usd",
  sizesCsv: "",
  colorsCsv: "",
  inStock: true,
  stockQtyText: "",
  isPublished: true,
};

export default function OwnerProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const routeProfileKey = normalizeProfileKey(params?.profileKey);
  const [profileKey] = useState(routeProfileKey || "");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [items, setItems] = useState([]);

  const [filters, setFilters] = useState({
    published: "all", // all|true|false
    inStock: "all", // all|true|false
    search: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const canUse = useMemo(() => !!profileKey, [profileKey]);

  const bgUrl = location?.state?.bgUrl || null;

  const goBack = () => {
    if (profileKey) {
      navigate(`/world/${encodeURIComponent(profileKey)}/owner/home`, {
        state: { profileKey, bgUrl },
      });
    } else {
      navigate("/", { replace: true });
    }
  };

  const goOwnerLogin = useCallback(() => {
    if (!profileKey) return navigate("/", { replace: true });
    navigate(`/world/${encodeURIComponent(profileKey)}/owner/login`, {
      replace: true,
      state: { profileKey, bgUrl },
    });
  }, [navigate, profileKey, bgUrl]);

  function buildPayloadFromForm(f) {
    const name = String(f.name || "").trim();
    if (!name) throw new Error("Name is required");

    const priceDollars = String(f.priceDollars || "").trim();
    const price = Number(priceDollars);
    if (!Number.isFinite(price) || price < 0) throw new Error("Price must be a valid number");

    const priceCents = Math.round(price * 100);

    const stockQtyText = String(f.stockQtyText || "").trim();
    const stockQty = stockQtyText === "" ? null : Number.parseInt(stockQtyText, 10);

    if (stockQty !== null && (!Number.isFinite(stockQty) || stockQty < 0)) {
      throw new Error("Stock Qty must be empty or a number ≥ 0");
    }

    return {
      name,
      description: String(f.description || "").trim(),
      category: String(f.category || "").trim(),
      imageUrl: String(f.imageUrl || "").trim(),
      imageUrls: parseCsv(f.imageUrlsCsv),
      priceCents,
      currency: String(f.currency || "usd").trim().toLowerCase() || "usd",
      sizes: parseCsv(f.sizesCsv),
      colors: parseCsv(f.colorsCsv),
      inStock: !!f.inStock,
      stockQty,
      isPublished: !!f.isPublished,
    };
  }

  const fetchList = useCallback(
    async ({ isRefresh = false } = {}) => {
      if (!profileKey) return;

      try {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        const qs = new URLSearchParams();
        if (filters.published !== "all") qs.set("published", filters.published);
        if (filters.inStock !== "all") qs.set("inStock", filters.inStock);
        if (filters.search) qs.set("search", filters.search);
        qs.set("limit", "200");
        qs.set("skip", "0");

        const res = await ownerFetchWeb(`/api/owner/products?${qs.toString()}`, { profileKey });
        const json = await readJsonSafe(res);

        if (res.status === 401 || res.status === 403) {
          goOwnerLogin();
          return;
        }

        if (!res.ok) {
          const msg =
            json?.error ||
            json?.message ||
            `Request failed (${res.status}${res.statusText ? ` ${res.statusText}` : ""})`;
          throw new Error(msg);
        }

        setItems(Array.isArray(json?.items) ? json.items : []);
      } catch (e) {
        alert(e?.message || "Unable to load products");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [profileKey, filters, goOwnerLogin]
  );

  useEffect(() => {
    if (!profileKey) return;
    fetchList();
  }, [fetchList, profileKey]);

  const openCreate = () => {
    setForm({ ...EMPTY_FORM });
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setForm({
      _id: p?._id || null,
      name: p?.name || "",
      description: p?.description || "",
      category: p?.category || "",
      imageUrl: p?.imageUrl || "",
      imageUrlsCsv: joinCsv(p?.imageUrls || []),
      priceDollars: typeof p?.priceCents === "number" ? (p.priceCents / 100).toFixed(2) : "",
      currency: p?.currency || "usd",
      sizesCsv: joinCsv(p?.sizes || []),
      colorsCsv: joinCsv(p?.colors || []),
      inStock: p?.inStock !== undefined ? !!p.inStock : true,
      stockQtyText: p?.stockQty === null || p?.stockQty === undefined ? "" : String(p.stockQty),
      isPublished: p?.isPublished !== undefined ? !!p.isPublished : true,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const saveProduct = async () => {
    if (!profileKey) return;

    try {
      setSaving(true);

      const payload = buildPayloadFromForm(form);

      const isEdit = !!form._id;
      const path = isEdit ? `/api/owner/products/${form._id}` : "/api/owner/products";
      const method = isEdit ? "PATCH" : "POST";

      const res = await ownerFetchWeb(path, {
        profileKey,
        method,
        body: JSON.stringify(payload),
      });

      const json = await readJsonSafe(res);

      if (res.status === 401 || res.status === 403) {
        goOwnerLogin();
        return;
      }

      if (!res.ok) {
        const msg =
          json?.error ||
          json?.message ||
          `Request failed (${res.status}${res.statusText ? ` ${res.statusText}` : ""})`;
        throw new Error(msg);
      }

      const saved = json?.item;

      setItems((prev) => {
        const arr = Array.isArray(prev) ? [...prev] : [];
        if (!saved?._id) return arr;
        const idx = arr.findIndex((x) => String(x?._id) === String(saved._id));
        if (idx >= 0) arr[idx] = saved;
        else arr.unshift(saved);
        return arr;
      });

      setModalOpen(false);
    } catch (e) {
      alert(e?.message || "Unable to save product");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (p) => {
    const id = p?._id;
    if (!id) return;

    const ok = window.confirm(`Delete "${p?.name || "this product"}"? This cannot be undone.`);
    if (!ok) return;

    try {
      setSaving(true);

      const res = await ownerFetchWeb(`/api/owner/products/${id}`, {
        profileKey,
        method: "DELETE",
      });

      const json = await readJsonSafe(res);

      if (res.status === 401 || res.status === 403) {
        goOwnerLogin();
        return;
      }

      if (!res.ok) {
        throw new Error(json?.error || json?.message || `Delete failed (${res.status})`);
      }

      setItems((prev) =>
        Array.isArray(prev) ? prev.filter((x) => String(x?._id) !== String(id)) : []
      );
      setModalOpen(false);
    } catch (e) {
      alert(e?.message || "Unable to delete product");
    } finally {
      setSaving(false);
    }
  };

  const quickTogglePublished = async (p) => {
    if (!p?._id) return;

    const next = !p.isPublished;

    // optimistic
    setItems((prev) =>
      prev.map((x) => (String(x?._id) === String(p._id) ? { ...x, isPublished: next } : x))
    );

    try {
      const res = await ownerFetchWeb(`/api/owner/products/${p._id}`, {
        profileKey,
        method: "PATCH",
        body: JSON.stringify({ isPublished: next }),
      });

      const json = await readJsonSafe(res);

      if (res.status === 401 || res.status === 403) {
        goOwnerLogin();
        return;
      }

      if (!res.ok) throw new Error(json?.error || json?.message || `Update failed (${res.status})`);

      const saved = json?.item;
      if (saved?._id) {
        setItems((prev) =>
          prev.map((x) => (String(x?._id) === String(saved._id) ? saved : x))
        );
      }
    } catch (e) {
      // revert by re-fetch
      fetchList();
      alert(e?.message || "Unable to update product");
    }
  };

  if (!canUse) {
    return (
      <div style={styles.page}>
        <style>{css}</style>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={goBack}>← Back</button>
          <div style={styles.headerTitle}>Products</div>
          <div style={{ width: 80 }} />
        </div>
        <div style={styles.center}>
          <div style={styles.errTitle}>Missing profileKey</div>
          <div style={styles.errText}>
            Open this page as <code>/world/:profileKey/owner/products</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{css}</style>

      <div style={styles.header}>
        <button style={styles.backBtn} onClick={goBack}>← Back</button>
        <div style={styles.headerTitle}>Products</div>
        <div style={styles.headerRight}>
          <button style={styles.headerBtn} onClick={openCreate}>+ Add</button>
        </div>
      </div>

      <div style={styles.toolbar}>
        <button style={styles.button} onClick={() => fetchList({ isRefresh: true })}>
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div style={styles.filters}>
        <input
          value={filters.search}
          onChange={(e) => setFilters((s) => ({ ...s, search: e.target.value }))}
          placeholder="Search…"
          style={styles.search}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchList();
          }}
        />

        <div style={styles.filterRow}>
          <Chip on={filters.published === "all"} onClick={() => setFilters((s) => ({ ...s, published: "all" }))}>
            All
          </Chip>
          <Chip on={filters.published === "true"} onClick={() => setFilters((s) => ({ ...s, published: "true" }))}>
            Published
          </Chip>
          <Chip on={filters.published === "false"} onClick={() => setFilters((s) => ({ ...s, published: "false" }))}>
            Hidden
          </Chip>

          <span style={{ width: 10 }} />

          <Chip on={filters.inStock === "all"} onClick={() => setFilters((s) => ({ ...s, inStock: "all" }))}>
            Any stock
          </Chip>
          <Chip on={filters.inStock === "true"} onClick={() => setFilters((s) => ({ ...s, inStock: "true" }))}>
            In stock
          </Chip>
          <Chip on={filters.inStock === "false"} onClick={() => setFilters((s) => ({ ...s, inStock: "false" }))}>
            Out
          </Chip>
        </div>

        <button style={styles.apply} onClick={() => fetchList()}>
          Apply
        </button>
      </div>

      {loading ? (
        <div style={styles.center}>
          <div className="spinner" />
          <div style={styles.muted}>Loading…</div>
        </div>
      ) : items.length === 0 ? (
        <div style={styles.center}>
          <div style={styles.muted}>No products yet.</div>
        </div>
      ) : (
        <div style={styles.list}>
          {items.map((p) => (
            <button key={p._id} style={styles.row} onClick={() => openEdit(p)}>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={styles.rowTitle}>{p.name || "(untitled)"}</div>
                <div style={styles.rowSub}>
                  {p.category ? `${p.category} • ` : ""}
                  {moneyFromCents(p.priceCents, p.currency)}
                  {p.stockQty !== null && p.stockQty !== undefined ? ` • qty: ${p.stockQty}` : ""}
                </div>
              </div>

              <div style={styles.rowRight} onClick={(e) => e.stopPropagation()}>
                <div style={styles.badgeText}>{p.isPublished ? "Published" : "Hidden"}</div>
                <label style={styles.switchWrap}>
                  <input
                    type="checkbox"
                    checked={!!p.isPublished}
                    onChange={() => quickTogglePublished(p)}
                  />
                  <span style={styles.switchUi} />
                </label>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div style={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <button style={styles.modalLink} onClick={closeModal} disabled={saving}>
                Close
              </button>
              <div style={styles.modalTitle}>{form._id ? "Edit Product" : "New Product"}</div>
              <button style={{ ...styles.modalLink, opacity: saving ? 0.6 : 1 }} onClick={saveProduct} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>

            <div style={styles.modalBody}>
              <Field label="Name" value={form.name} onChange={(v) => setForm((s) => ({ ...s, name: v }))} />
              <Field
                label="Description"
                value={form.description}
                onChange={(v) => setForm((s) => ({ ...s, description: v }))}
                multiline
              />
              <Field label="Category" value={form.category} onChange={(v) => setForm((s) => ({ ...s, category: v }))} />
              <Field label="Image URL" value={form.imageUrl} onChange={(v) => setForm((s) => ({ ...s, imageUrl: v }))} />
              <Field
                label="Gallery URLs (comma separated)"
                value={form.imageUrlsCsv}
                onChange={(v) => setForm((s) => ({ ...s, imageUrlsCsv: v }))}
              />

              <div style={styles.twoCol}>
                <div style={{ flex: 1 }}>
                  <Field
                    label="Price (USD)"
                    value={form.priceDollars}
                    onChange={(v) => setForm((s) => ({ ...s, priceDollars: v }))}
                    inputMode="decimal"
                  />
                </div>
                <div style={{ width: 12 }} />
                <div style={{ flex: 1 }}>
                  <Field
                    label="Currency"
                    value={form.currency}
                    onChange={(v) => setForm((s) => ({ ...s, currency: v }))}
                  />
                </div>
              </div>

              <Field label="Sizes (comma separated)" value={form.sizesCsv} onChange={(v) => setForm((s) => ({ ...s, sizesCsv: v }))} />
              <Field label="Colors (comma separated)" value={form.colorsCsv} onChange={(v) => setForm((s) => ({ ...s, colorsCsv: v }))} />

              <div style={styles.switchRow}>
                <div style={styles.switchLabel}>In Stock</div>
                <label style={styles.switchWrap}>
                  <input
                    type="checkbox"
                    checked={!!form.inStock}
                    onChange={(e) => setForm((s) => ({ ...s, inStock: e.target.checked }))}
                  />
                  <span style={styles.switchUi} />
                </label>
              </div>

              <Field
                label="Stock Qty (blank = not tracked)"
                value={form.stockQtyText}
                onChange={(v) => setForm((s) => ({ ...s, stockQtyText: v }))}
                inputMode="numeric"
              />

              <div style={styles.switchRow}>
                <div style={styles.switchLabel}>Published</div>
                <label style={styles.switchWrap}>
                  <input
                    type="checkbox"
                    checked={!!form.isPublished}
                    onChange={(e) => setForm((s) => ({ ...s, isPublished: e.target.checked }))}
                  />
                  <span style={styles.switchUi} />
                </label>
              </div>

              {!!form._id && (
                <button
                  style={{ ...styles.deleteButton, opacity: saving ? 0.7 : 1 }}
                  disabled={saving}
                  onClick={() => deleteProduct({ _id: form._id, name: form.name })}
                >
                  Delete Product
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({ on, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ ...styles.chip, ...(on ? styles.chipOn : null) }}
    >
      {children}
    </button>
  );
}

function Field({ label, value, onChange, multiline, inputMode }) {
  return (
    <div style={styles.field}>
      <div style={styles.label}>{label}</div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...styles.input, ...styles.inputMulti }}
          rows={4}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={styles.input}
          inputMode={inputMode}
        />
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b0b0b",
    color: "#fff",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 12px 10px",
    borderBottom: "1px solid #222",
    position: "sticky",
    top: 0,
    background: "#0b0b0b",
    zIndex: 5,
  },
  backBtn: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid transparent",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 800,
  },
  headerTitle: { flex: 1, textAlign: "center", fontWeight: 900, letterSpacing: 0.6 },
  headerRight: { width: 80, display: "flex", justifyContent: "flex-end" },
  headerBtn: {
    padding: "8px 10px",
    background: "#1a1a1a",
    borderRadius: 10,
    border: "1px solid #2a2a2a",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 800,
  },

  toolbar: { padding: 12, borderBottom: "1px solid #222" },
  button: {
    padding: "10px 14px",
    background: "#1a1a1a",
    borderRadius: 10,
    border: "1px solid #2a2a2a",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },

  filters: { padding: 12, borderBottom: "1px solid #222" },
  search: {
    height: 42,
    width: "100%",
    borderRadius: 10,
    border: "1px solid #2a2a2a",
    padding: "0 12px",
    color: "#fff",
    background: "#111",
    marginBottom: 10,
    outline: "none",
  },
  filterRow: { display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" },
  chip: {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #2a2a2a",
    background: "#121212",
    color: "#ddd",
    fontSize: 12,
    cursor: "pointer",
  },
  chipOn: { background: "#1f1f1f", color: "#fff" },
  apply: {
    marginTop: 10,
    padding: "8px 12px",
    borderRadius: 10,
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },

  list: { paddingBottom: 24 },
  row: {
    width: "100%",
    display: "flex",
    gap: 12,
    padding: 12,
    borderBottom: "1px solid #161616",
    alignItems: "center",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
    textAlign: "left",
  },
  rowTitle: { fontSize: 16, fontWeight: 700 },
  rowSub: { color: "#aaa", marginTop: 2, fontSize: 13 },
  rowRight: { display: "flex", alignItems: "flex-end", gap: 8 },
  badgeText: { color: "#aaa", fontSize: 12 },

  center: { padding: 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  muted: { color: "#aaa", marginTop: 10 },
  errTitle: { fontSize: 18, fontWeight: 900, marginBottom: 8 },
  errText: { color: "#aaa", textAlign: "center" },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    zIndex: 50,
  },
  modal: {
    width: "min(920px, 100%)",
    maxHeight: "92vh",
    background: "#0b0b0b",
    borderRadius: 16,
    border: "1px solid #222",
    overflow: "hidden",
    boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 12px",
    borderBottom: "1px solid #222",
    position: "sticky",
    top: 0,
    background: "#0b0b0b",
    zIndex: 2,
  },
  modalTitle: { fontWeight: 900 },
  modalLink: {
    background: "transparent",
    border: "1px solid transparent",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 800,
    padding: "6px 8px",
    borderRadius: 10,
  },
  modalBody: { padding: 12, overflow: "auto" },

  field: { marginBottom: 12 },
  label: { color: "#bbb", marginBottom: 6, fontSize: 12 },
  input: {
    width: "100%",
    minHeight: 42,
    borderRadius: 10,
    border: "1px solid #2a2a2a",
    padding: "10px 12px",
    color: "#fff",
    background: "#111",
    outline: "none",
  },
  inputMulti: { minHeight: 100, resize: "vertical" },
  twoCol: { display: "flex" },

  switchRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 0",
    marginBottom: 8,
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  switchLabel: { color: "#ddd", fontWeight: 700 },

  switchWrap: { position: "relative", display: "inline-flex", alignItems: "center", gap: 8 },
  switchUi: { display: "none" }, // actual styling done in CSS below

  deleteButton: {
    marginTop: 14,
    padding: "12px 12px",
    borderRadius: 10,
    border: "1px solid #3a1a1a",
    background: "#1a0f0f",
    color: "#ffb4b4",
    cursor: "pointer",
    fontWeight: 900,
  },
};

const css = `
/* tiny spinner */
.spinner{
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: rgba(255,255,255,0.9);
  border-radius: 999px;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* toggle switches (simple) */
label[style*="switchWrap"] input{
  width: 44px;
  height: 26px;
  appearance: none;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.20);
  border-radius: 999px;
  position: relative;
  cursor: pointer;
  outline: none;
}
label[style*="switchWrap"] input:checked{
  background: rgba(34,197,94,0.28);
  border-color: rgba(34,197,94,0.45);
}
label[style*="switchWrap"] input::after{
  content: "";
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: #fff;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 160ms ease;
}
label[style*="switchWrap"] input:checked::after{
  transform: translateX(18px);
}
`;
