// src/pages/OwnerProductsPage.jsx ✅ FULL DROP-IN (Web) — S3 IMAGE PICKER + MODAL SCROLL FIX + AVATAR IMG FIX
// Route: /world/:profileKey/owner/products
//
// ✅ FIX: Calls BACKEND base URL (VITE_API_BASE_URL) instead of indiverse-web domain
// ✅ If VITE_API_BASE_URL is missing, defaults to https://indiverse-backend.onrender.com
// ✅ Adds "Back to IndiVerse" button (to /world/:profileKey)
// ✅ Enhanced look (accent glow, glass panels, better list rows, cleaner modal)
// ✅ Requires :profileKey in route (no silent fallback)
// ✅ FIX: Modal body scrolls reliably (flex column + body overflow)
// ✅ NEW: Pick images from photo library (file picker), upload to S3 via signed PUT,
//        auto-fills Primary Image URL + Gallery URLs
// ✅ FIX: Left avatar shows product image when available; fallback letter is centered on iPhone
//
// Owner token: localStorage ownerToken:<profileKey> (fallback ownerToken)
//
// IMPORTANT ENV (Render web service):
//   VITE_API_BASE_URL=https://indiverse-backend.onrender.com

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

/* -------------------- config -------------------- */

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://indiverse-backend.onrender.com";

/* -------------------- helpers -------------------- */

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

function joinUrl(base, path) {
  const b = String(base || "").replace(/\/+$/, "");
  const p = String(path || "");
  if (!p) return b;
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  return p.startsWith("/") ? `${b}${p}` : `${b}/${p}`;
}

async function ownerFetchWeb(path, { profileKey, method = "GET", body } = {}) {
  const pk = normalizeProfileKey(profileKey);
  const token = getOwnerToken(pk);

  const url = joinUrl(API_BASE, path);

  const res = await fetch(url, {
    method,
    headers: {
      ...(body ? { "content-type": "application/json" } : {}),
      "x-profile-key": pk,
      "X-Profile": pk,
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

function uniqUrls(arr) {
  const out = [];
  const seen = new Set();
  for (const x of arr || []) {
    const s = String(x || "").trim();
    if (!s) continue;
    if (seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

function hexToRgba(hex, a = 1) {
  const h = String(hex || "").replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (full.length !== 6) return `rgba(129,140,248,${a})`;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
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

/* -------------------- page -------------------- */

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

  // ✅ Image picker/upload state
  const [pickedFiles, setPickedFiles] = useState([]); // File[]
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]); // string[] (blob or https)
  const fileInputRef = useRef(null);

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

  const goBackToIndiVerse = () => {
    if (!profileKey) return navigate("/", { replace: false });
    navigate(`/world/${encodeURIComponent(profileKey)}`, {
      state: { profileKey, bgUrl },
    });
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
    if (!Number.isFinite(price) || price < 0) {
      throw new Error("Price must be a valid number");
    }
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

  // ✅ cleanup blob URLs when previews change
  useEffect(() => {
    return () => {
      // on unmount, revoke any blob previews
      for (const u of imagePreviews) {
        if (String(u).startsWith("blob:")) URL.revokeObjectURL(u);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearPickedImages = () => {
    for (const u of imagePreviews) {
      if (String(u).startsWith("blob:")) URL.revokeObjectURL(u);
    }
    setPickedFiles([]);
    setImagePreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openCreate = () => {
    clearPickedImages();
    setForm({ ...EMPTY_FORM });
    setModalOpen(true);
  };

  const openEdit = (p) => {
    clearPickedImages();
    const urls = uniqUrls([p?.imageUrl, ...(p?.imageUrls || [])].filter(Boolean));
    setImagePreviews(urls);

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
    if (saving || uploadingImages) return;
    setModalOpen(false);
  };

  function applyImageUrlsToForm(urls) {
    const clean = uniqUrls(urls);
    setForm((s) => ({
      ...s,
      imageUrl: clean[0] || "",
      imageUrlsCsv: joinCsv(clean),
    }));
  }

  const onPickImages = (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f && f.type?.startsWith("image/"));
    if (!files.length) return;

    // revoke old blob previews
    for (const u of imagePreviews) {
      if (String(u).startsWith("blob:")) URL.revokeObjectURL(u);
    }

    setPickedFiles(files);
    const previews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews(previews);
    // NOTE: don't write blob URLs to form; only after upload returns https urls
  };

  async function uploadOneImage(file) {
    const filename = file?.name || `image-${Date.now()}.jpg`;
    const contentType = file?.type || "image/jpeg";

    // 1) sign
    const signRes = await ownerFetchWeb(`/api/owner/products/sign-image-upload`, {
      profileKey,
      method: "POST",
      body: JSON.stringify({ filename, contentType }),
    });
    const signJson = await readJsonSafe(signRes);

    if (signRes.status === 401 || signRes.status === 403) {
      goOwnerLogin();
      return null;
    }
    if (!signRes.ok || !signJson?.putUrl || !signJson?.fileUrl) {
      throw new Error(signJson?.error || signJson?.message || "Unable to sign image upload");
    }

    // 2) PUT to S3
    const putRes = await fetch(signJson.putUrl, {
      method: "PUT",
      headers: { "content-type": contentType },
      body: file,
    });

    if (!putRes.ok) {
      throw new Error(`Upload failed (${putRes.status})`);
    }

    return String(signJson.fileUrl);
  }

  const uploadPickedImages = async () => {
    if (!pickedFiles.length) return;

    try {
      setUploadingImages(true);

      // sequential uploads (more reliable)
      const urls = [];
      for (const f of pickedFiles) {
        const u = await uploadOneImage(f);
        if (u) urls.push(u);
      }

      // revoke blob previews, replace with https urls
      for (const u of imagePreviews) {
        if (String(u).startsWith("blob:")) URL.revokeObjectURL(u);
      }

      setPickedFiles([]);
      setImagePreviews(urls);
      applyImageUrlsToForm(urls);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e) {
      alert(e?.message || "Unable to upload images");
    } finally {
      setUploadingImages(false);
    }
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
      fetchList();
      alert(e?.message || "Unable to update product");
    }
  };

  if (!canUse) {
    return (
      <div style={styles.page}>
        <style>{css()}</style>

        <div style={styles.glowOne} />
        <div style={styles.glowTwo} />
        <div style={styles.grid} />

        <div style={styles.header}>
          <button className="op-back" onClick={goBack} title="Back to Owner Home">
            ← Back
          </button>

          <div style={styles.headerTitle}>Products</div>

          <button className="op-pill" onClick={() => navigate("/", { replace: false })} title="Home">
            Home
          </button>
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
      <style>{css()}</style>

      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />
      <div style={styles.grid} />

      <div style={styles.header}>
        <button className="op-back" onClick={goBack} title="Back to Owner Home">
          ← Owner
        </button>

        <div style={styles.headerTitle}>Products</div>

        <div style={styles.headerRight}>
          <button className="op-pill" onClick={goBackToIndiVerse} title="Back to IndiVerse">
            <span className="op-dot" />
            Back to IndiVerse
          </button>

          <button className="op-add" onClick={openCreate} title="Add Product">
            + Add
          </button>
        </div>
      </div>

      <div style={styles.panelWrap}>
        <div style={styles.toolbar}>
          <button className="op-btn" onClick={() => fetchList({ isRefresh: true })}>
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>

          <div style={{ marginLeft: "auto", opacity: 0.75, fontSize: 12, fontWeight: 800 }}>
            API: {API_BASE.replace(/^https?:\/\//, "")}
          </div>
        </div>

        <div style={styles.filters}>
          <input
            value={filters.search}
            onChange={(e) => setFilters((s) => ({ ...s, search: e.target.value }))}
            placeholder="Search products…"
            className="op-search"
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

            <div style={{ flex: 1 }} />
            <button className="op-btn op-apply" onClick={() => fetchList()}>
              Apply
            </button>
          </div>
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
            {items.map((p) => {
              const avatarSrc =
                (p?.imageUrl && String(p.imageUrl).trim()) ||
                (Array.isArray(p?.imageUrls) && p.imageUrls[0] ? String(p.imageUrls[0]).trim() : "") ||
                "";

              const letter = String(p?.name || "P").slice(0, 1).toUpperCase();

              return (
                <button key={p._id} className="op-row" onClick={() => openEdit(p)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                    <div className="op-avatar">
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt={p?.name || "Product"}
                          className="op-avatarImg"
                          loading="lazy"
                          onError={(e) => {
                            // hide broken image; show letter
                            e.currentTarget.style.display = "none";
                            const parent = e.currentTarget.parentElement;
                            if (parent) parent.classList.add("op-avatar--fallback");
                          }}
                        />
                      ) : (
                        letter
                      )}
                      {/* fallback letter if img fails */}
                      {avatarSrc ? <span className="op-avatarLetter">{letter}</span> : null}
                    </div>

                    <div style={{ minWidth: 0, flex: 1, textAlign: "left" }}>
                      <div style={styles.rowTitle}>{p.name || "(untitled)"}</div>
                      <div style={styles.rowSub}>
                        {p.category ? `${p.category} • ` : ""}
                        {moneyFromCents(p.priceCents, p.currency)}
                        {p.stockQty !== null && p.stockQty !== undefined ? ` • qty: ${p.stockQty}` : ""}
                      </div>
                    </div>
                  </div>

                  <div style={styles.rowRight} onClick={(e) => e.stopPropagation()}>
                    <div className={p.isPublished ? "op-badge op-badgeOn" : "op-badge"}>
                      {p.isPublished ? "Published" : "Hidden"}
                    </div>

                    <label className="op-switch">
                      <input type="checkbox" checked={!!p.isPublished} onChange={() => quickTogglePublished(p)} />
                      <span className="op-switchUi" />
                    </label>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <button className="op-link" onClick={closeModal} disabled={saving || uploadingImages}>
                Close
              </button>
              <div style={styles.modalTitle}>{form._id ? "Edit Product" : "New Product"}</div>
              <button className="op-link op-linkPrimary" onClick={saveProduct} disabled={saving || uploadingImages}>
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

              <div style={styles.twoCol}>
                <div style={{ flex: 1 }}>
                  <Field label="Category" value={form.category} onChange={(v) => setForm((s) => ({ ...s, category: v }))} />
                </div>
                <div style={{ width: 12 }} />
                <div style={{ flex: 1 }}>
                  <Field label="Currency" value={form.currency} onChange={(v) => setForm((s) => ({ ...s, currency: v }))} />
                </div>
              </div>

              <div style={styles.twoCol}>
                <div style={{ flex: 1 }}>
                  <Field
                    label="Price"
                    value={form.priceDollars}
                    onChange={(v) => setForm((s) => ({ ...s, priceDollars: v }))}
                    inputMode="decimal"
                    placeholder="0.00"
                  />
                </div>
                <div style={{ width: 12 }} />
                <div style={{ flex: 1 }}>
                  <Field
                    label="Stock Qty (blank = not tracked)"
                    value={form.stockQtyText}
                    onChange={(v) => setForm((s) => ({ ...s, stockQtyText: v }))}
                    inputMode="numeric"
                    placeholder=""
                  />
                </div>
              </div>

              {/* ✅ NEW: Photo library picker + S3 upload */}
              <div style={styles.field}>
                <div style={styles.label}>Images (Photo Library)</div>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                  <button
                    type="button"
                    className="op-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={saving || uploadingImages}
                  >
                    Choose Images
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onPickImages}
                    style={{ display: "none" }}
                    disabled={saving || uploadingImages}
                  />

                  <button
                    type="button"
                    className="op-btn op-apply"
                    onClick={uploadPickedImages}
                    disabled={saving || uploadingImages || !pickedFiles.length}
                    title={!pickedFiles.length ? "Choose images first" : "Upload to S3"}
                  >
                    {uploadingImages
                      ? "Uploading…"
                      : pickedFiles.length
                      ? `Upload Selected (${pickedFiles.length})`
                      : "Upload Selected"}
                  </button>

                  <button
                    type="button"
                    className="op-btn"
                    onClick={clearPickedImages}
                    disabled={saving || uploadingImages}
                  >
                    Clear
                  </button>

                  <div style={{ marginLeft: "auto", opacity: 0.75, fontSize: 12, fontWeight: 800 }}>
                    {pickedFiles.length ? `${pickedFiles.length} selected` : ""}
                  </div>
                </div>

                {!!imagePreviews.length && (
                  <div
                    style={{
                      marginTop: 12,
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                      gap: 10,
                    }}
                  >
                    {imagePreviews.map((u, idx) => (
                      <div
                        key={`${u}-${idx}`}
                        style={{
                          borderRadius: 14,
                          overflow: "hidden",
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: "rgba(2,6,23,0.35)",
                        }}
                      >
                        <div style={{ aspectRatio: "1/1", width: "100%", overflow: "hidden" }}>
                          <img
                            src={u}
                            alt={`img-${idx}`}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          />
                        </div>

                        <div style={{ display: "flex", gap: 8, padding: 8 }}>
                          <button
                            type="button"
                            className="op-chip"
                            onClick={() => {
                              const next = [...imagePreviews];
                              const chosen = next.splice(idx, 1)[0];
                              next.unshift(chosen);
                              setImagePreviews(next);

                              // only write to form if these are real urls (not blob)
                              if (!String(chosen).startsWith("blob:") && next.every((x) => !String(x).startsWith("blob:"))) {
                                applyImageUrlsToForm(next);
                              }
                            }}
                          >
                            Make Primary
                          </button>

                          <button
                            type="button"
                            className="op-chip"
                            onClick={() => {
                              const next = imagePreviews.filter((_, i) => i !== idx);
                              setImagePreviews(next);

                              if (next.length && next.every((x) => !String(x).startsWith("blob:"))) {
                                applyImageUrlsToForm(next);
                              } else if (next.length === 0) {
                                setForm((s) => ({ ...s, imageUrl: "", imageUrlsCsv: "" }));
                              }
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: 10, color: "rgba(148,163,184,0.9)", fontSize: 12, fontWeight: 700 }}>
                  Upload fills Primary + Gallery automatically. You can still paste URLs below if you want.
                </div>
              </div>

              <Field
                label="Primary Image URL"
                value={form.imageUrl}
                onChange={(v) => setForm((s) => ({ ...s, imageUrl: v }))}
              />
              <Field
                label="Gallery URLs (comma separated)"
                value={form.imageUrlsCsv}
                onChange={(v) => setForm((s) => ({ ...s, imageUrlsCsv: v }))}
              />

              <Field label="Sizes (comma separated)" value={form.sizesCsv} onChange={(v) => setForm((s) => ({ ...s, sizesCsv: v }))} />
              <Field label="Colors (comma separated)" value={form.colorsCsv} onChange={(v) => setForm((s) => ({ ...s, colorsCsv: v }))} />

              <div style={styles.switchRow}>
                <div style={styles.switchLabel}>In Stock</div>
                <label className="op-switch">
                  <input
                    type="checkbox"
                    checked={!!form.inStock}
                    onChange={(e) => setForm((s) => ({ ...s, inStock: e.target.checked }))}
                  />
                  <span className="op-switchUi" />
                </label>
              </div>

              <div style={styles.switchRow}>
                <div style={styles.switchLabel}>Published</div>
                <label className="op-switch">
                  <input
                    type="checkbox"
                    checked={!!form.isPublished}
                    onChange={(e) => setForm((s) => ({ ...s, isPublished: e.target.checked }))}
                  />
                  <span className="op-switchUi" />
                </label>
              </div>

              {!!form._id && (
                <button
                  className="op-danger"
                  disabled={saving || uploadingImages}
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
    <button type="button" onClick={onClick} className={on ? "op-chip op-chipOn" : "op-chip"}>
      {children}
    </button>
  );
}

function Field({ label, value, onChange, multiline, inputMode, placeholder }) {
  return (
    <div style={styles.field}>
      <div style={styles.label}>{label}</div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="op-input op-textarea"
          rows={4}
          placeholder={placeholder}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="op-input"
          inputMode={inputMode}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

/* -------------------- styles -------------------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #020617, #0b1220, #020617)",
    color: "#e5e7eb",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
    position: "relative",
    overflow: "hidden",
  },

  glowOne: {
    position: "fixed",
    width: 360,
    height: 360,
    borderRadius: 999,
    top: -120,
    right: -140,
    background: hexToRgba("#818cf8", 0.28),
    filter: "blur(90px)",
    opacity: 0.8,
    pointerEvents: "none",
    zIndex: 0,
  },
  glowTwo: {
    position: "fixed",
    width: 360,
    height: 360,
    borderRadius: 999,
    bottom: -140,
    left: -160,
    background: "rgba(236,72,153,0.22)",
    filter: "blur(90px)",
    opacity: 0.7,
    pointerEvents: "none",
    zIndex: 0,
  },
  grid: {
    position: "fixed",
    inset: 0,
    backgroundImage:
      "radial-gradient(circle at 1px 1px, rgba(148,163,184,0.10) 1px, rgba(0,0,0,0) 0)",
    backgroundSize: "26px 26px",
    maskImage: "radial-gradient(circle at 50% 18%, rgba(0,0,0,0.85), rgba(0,0,0,0) 62%)",
    WebkitMaskImage: "radial-gradient(circle at 50% 18%, rgba(0,0,0,0.85), rgba(0,0,0,0) 62%)",
    pointerEvents: "none",
    zIndex: 0,
    opacity: 0.9,
  },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 5,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "14px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(2,6,23,0.62)",
    backdropFilter: "blur(12px)",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: 900,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerRight: { display: "flex", gap: 10, alignItems: "center" },

  panelWrap: {
    position: "relative",
    zIndex: 2,
    maxWidth: 980,
    margin: "0 auto",
    padding: "14px 14px 40px",
  },

  toolbar: { display: "flex", gap: 10, alignItems: "center", padding: "10px 2px 12px" },

  filters: {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(15,23,42,0.66)",
    padding: 12,
    boxShadow: "0 18px 42px rgba(0,0,0,0.35)",
  },

  filterRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    marginTop: 10,
  },

  list: {
    marginTop: 14,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(15,23,42,0.52)",
    overflow: "hidden",
    boxShadow: "0 18px 42px rgba(0,0,0,0.35)",
  },

  rowTitle: {
    fontSize: 14,
    fontWeight: 900,
    color: "#f9fafb",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  rowSub: {
    color: "rgba(203,213,225,0.85)",
    marginTop: 3,
    fontSize: 12,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  rowRight: { display: "flex", alignItems: "center", gap: 10 },

  center: {
    padding: 18,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  muted: { color: "rgba(148,163,184,0.9)", marginTop: 10, fontWeight: 700 },

  errTitle: { fontSize: 18, fontWeight: 900, marginBottom: 8 },
  errText: { color: "rgba(148,163,184,0.9)", textAlign: "center" },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.62)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 14,
    zIndex: 50,
    backdropFilter: "blur(6px)",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
  },
  modal: {
    width: "min(980px, 100%)",
    maxHeight: "92vh",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(2,6,23,0.96)",
    overflow: "hidden",
    boxShadow: "0 30px 90px rgba(0,0,0,0.65)",

    // ✅ critical for scroll behavior
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(2,6,23,0.92)",
  },
  modalTitle: { fontWeight: 900, letterSpacing: 0.8, textTransform: "uppercase" },

  modalBody: {
    padding: 14,
    flex: 1,
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    overscrollBehavior: "contain",
  },

  field: { marginBottom: 12 },
  label: {
    color: "rgba(148,163,184,0.92)",
    marginBottom: 6,
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },

  twoCol: { display: "flex" },

  switchRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0",
    marginBottom: 8,
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  switchLabel: { color: "rgba(226,232,240,0.95)", fontWeight: 900 },
};

function css() {
  return `
  *{ box-sizing: border-box; }
  button{ font-family: inherit; }

  .spinner{
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255,255,255,0.25);
    border-top-color: rgba(255,255,255,0.9);
    border-radius: 999px;
    animation: spin 0.9s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .op-back{
    height: 40px;
    border-radius: 999px;
    padding: 0 12px;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(2,6,23,0.35);
    color: rgba(255,255,255,0.92);
    font-weight: 900;
    letter-spacing: 0.6px;
    cursor: pointer;
    backdrop-filter: blur(10px);
    transition: transform 140ms ease, background 140ms ease, border-color 140ms ease;
    user-select:none;
    white-space: nowrap;
  }
  .op-back:hover{ transform: translateY(-1px); background: rgba(15,23,42,0.55); border-color: rgba(129,140,248,0.45); }
  .op-back:active{ transform: translateY(0) scale(0.995); opacity:0.95; }

  .op-pill{
    height: 40px;
    border-radius: 999px;
    padding: 0 14px 0 12px;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(2,6,23,0.35);
    color: rgba(255,255,255,0.92);
    font-weight: 900;
    letter-spacing: 0.6px;
    cursor: pointer;
    display:flex;
    align-items:center;
    gap: 10px;
    backdrop-filter: blur(10px);
    transition: transform 140ms ease, background 140ms ease, border-color 140ms ease;
    user-select:none;
    text-transform: uppercase;
    font-size: 11px;
    white-space: nowrap;
  }
  .op-pill:hover{ transform: translateY(-1px); background: rgba(15,23,42,0.55); border-color: rgba(129,140,248,0.45); }
  .op-pill:active{ transform: translateY(0) scale(0.995); opacity:0.95; }
  .op-dot{
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: rgba(129,140,248,0.95);
    box-shadow: 0 0 0 6px rgba(129,140,248,0.18);
  }

  .op-add{
    height: 40px;
    border-radius: 999px;
    padding: 0 14px;
    border: 1px solid rgba(56,189,248,0.35);
    background: linear-gradient(90deg, rgba(56,189,248,0.92), rgba(168,85,247,0.92));
    color: rgba(236,254,255,0.98);
    font-weight: 900;
    letter-spacing: 0.5px;
    cursor: pointer;
    user-select:none;
    white-space: nowrap;
  }
  .op-add:active{ transform: scale(0.995); opacity:0.96; }

  .op-btn{
    height: 40px;
    border-radius: 999px;
    padding: 0 14px;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(2,6,23,0.35);
    color: rgba(255,255,255,0.92);
    font-weight: 900;
    cursor: pointer;
    letter-spacing: 0.4px;
    white-space: nowrap;
  }
  .op-btn:hover{ border-color: rgba(129,140,248,0.35); background: rgba(15,23,42,0.55); }
  .op-apply{ border-color: rgba(34,197,94,0.35); }
  .op-apply:hover{ border-color: rgba(34,197,94,0.55); }

  .op-search{
    height: 44px;
    width: 100%;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.14);
    padding: 0 14px;
    color: rgba(255,255,255,0.94);
    background: rgba(2,6,23,0.45);
    outline: none;
    font-weight: 700;
  }
  .op-search::placeholder{ color: rgba(148,163,184,0.9); }

  .op-chip{
    padding: 7px 11px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(2,6,23,0.35);
    color: rgba(226,232,240,0.92);
    font-size: 12px;
    cursor: pointer;
    font-weight: 900;
    letter-spacing: 0.3px;
    white-space: nowrap;
  }
  .op-chip:hover{ border-color: rgba(129,140,248,0.35); background: rgba(15,23,42,0.55); }
  .op-chipOn{
    background: rgba(129,140,248,0.18);
    border-color: rgba(129,140,248,0.55);
    color: rgba(255,255,255,0.96);
  }

  .op-row{
    width: 100%;
    display: flex;
    gap: 12px;
    padding: 12px 12px;
    align-items: center;
    background: transparent;
    color: rgba(255,255,255,0.94);
    cursor: pointer;
    border: none;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    transition: background 140ms ease;
  }
  .op-row:hover{
    background: rgba(255,255,255,0.04);
  }

  /* ✅ AVATAR FIX (center letter + show image) */
  .op-avatar{
    width: 38px;
    height: 38px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    font-weight: 900;
    background: rgba(56,189,248,0.16);
    border: 1px solid rgba(129,140,248,0.6);
    color: rgba(226,232,240,0.95);
    flex: 0 0 auto;
    overflow: hidden;
    line-height: 1;
    font-size: 16px;
    position: relative;
  }
  .op-avatarImg{
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .op-avatarLetter{
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    opacity: 0;
    pointer-events: none;
  }
  .op-avatar--fallback .op-avatarLetter{ opacity: 1; }

  .op-badge{
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    padding: 6px 10px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.14);
    color: rgba(148,163,184,0.92);
    background: rgba(2,6,23,0.35);
    user-select:none;
    white-space: nowrap;
  }
  .op-badgeOn{
    border-color: rgba(34,197,94,0.45);
    background: rgba(34,197,94,0.14);
    color: rgba(187,247,208,0.95);
  }

  .op-switch{
    position: relative;
    display: inline-flex;
    align-items: center;
  }
  .op-switch input{
    width: 46px;
    height: 26px;
    appearance: none;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 999px;
    position: relative;
    cursor: pointer;
    outline: none;
  }
  .op-switch input:checked{
    background: rgba(34,197,94,0.24);
    border-color: rgba(34,197,94,0.45);
  }
  .op-switchUi{
    pointer-events: none;
  }
  .op-switch input::after{
    content: "";
    width: 20px;
    height: 20px;
    border-radius: 999px;
    background: rgba(255,255,255,0.95);
    position: absolute;
    top: 2px;
    left: 2px;
    transition: transform 160ms ease;
  }
  .op-switch input:checked::after{
    transform: translateX(20px);
  }

  .op-input{
    width: 100%;
    min-height: 44px;
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,0.14);
    padding: 12px 12px;
    color: rgba(255,255,255,0.94);
    background: rgba(2,6,23,0.45);
    outline: none;
    font-weight: 700;
  }
  .op-input::placeholder{ color: rgba(148,163,184,0.9); }
  .op-textarea{
    min-height: 112px;
    resize: vertical;
  }

  .op-link{
    background: rgba(2,6,23,0.35);
    border: 1px solid rgba(255,255,255,0.14);
    color: rgba(255,255,255,0.92);
    cursor: pointer;
    font-weight: 900;
    padding: 8px 12px;
    border-radius: 999px;
    letter-spacing: 0.4px;
    white-space: nowrap;
  }
  .op-linkPrimary{
    border-color: rgba(56,189,248,0.35);
    background: rgba(56,189,248,0.14);
  }
  .op-link:disabled{ opacity: 0.6; cursor: not-allowed; }

  .op-danger{
    margin-top: 14px;
    width: 100%;
    padding: 12px 12px;
    border-radius: 14px;
    border: 1px solid rgba(248,113,113,0.55);
    background: rgba(239,68,68,0.10);
    color: rgba(254,202,202,0.95);
    cursor: pointer;
    font-weight: 900;
    letter-spacing: 0.4px;
  }
  .op-danger:disabled{ opacity: 0.6; cursor: not-allowed; }

  @media (max-width: 620px){
    .op-pill{ display:none; }
  }
  `;
}
