// src/pages/OwnerFashionPage.jsx ✅ FULL DROP-IN (WEB) — + OUTBOUND LINK (PRESSABLE)
// Route: /world/:profileKey/owner/fashion
//
// ✅ Adds "Outbound Link" input (saved as `url` on FashionItem)
// ✅ List shows a PRESSABLE "Open ↗" button when url exists (normalizes missing https)
// ✅ Keeps your existing Media URL logic (image/video)
// ✅ Uses ownerFetchRawWeb (absolute backend base)
//
// Requires:
// - ownerFetchRawWeb + normalizeProfileKey from ../utils/ownerApi.web

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ownerFetchRawWeb, normalizeProfileKey } from "../utils/ownerApi.web";

function normalizeList(data) {
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.data)
    ? data.data
    : [];

  return list
    .map((x) => {
      const id = String(x?._id || x?.id || "").trim();
      return { ...x, id: id || undefined, _id: x?._id || id || undefined };
    })
    .filter((x) => x.id || x._id);
}

function isProbablyVideoUrl(u) {
  const s = String(u || "").toLowerCase();
  return /\.(mp4|mov|m4v|webm)(\?|$)/i.test(s);
}

function uniqStrings(arr) {
  const out = [];
  const seen = new Set();
  (arr || []).forEach((v) => {
    const s = String(v || "").trim();
    if (!s) return;
    const key = s.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(s);
  });
  return out;
}

function clampStr(v) {
  return String(v || "").trim();
}

function safeUrl(s) {
  const v = typeof s === "string" ? s.trim() : "";
  return v ? v : null;
}

// ✅ normalize outbound links (handles "www.foo.com", "foo.com/..", "//foo.com/..")
function outboundUrl(raw) {
  const s = safeUrl(raw);
  if (!s) return null;

  if (/^\/\//.test(s)) return `https:${s}`;
  if (/^https?:\/\//i.test(s)) return s;
  if (/^www\./i.test(s)) return `https://${s}`;
  if (/^[a-z0-9.-]+\.[a-z]{2,}([/:?#].*)?$/i.test(s)) return `https://${s}`;

  return null;
}

/* -------------------- small UI primitives -------------------- */

function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;
  return (
    <div style={ui.modalOverlay} onMouseDown={onClose} role="presentation">
      <div
        style={ui.modalCard}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div style={ui.modalTitle}>{title}</div>
        <div style={ui.modalBody}>{children}</div>
        {footer ? <div style={{ marginTop: 12 }}>{footer}</div> : null}
        <button style={ui.modalCloseBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

function SelectModal({ open, title, options, selected, onSelect, onClose, footer }) {
  return (
    <Modal open={open} title={title} onClose={onClose} footer={footer}>
      <div style={{ maxHeight: 360, overflowY: "auto" }}>
        {(options || []).map((opt) => {
          const active = String(opt.value) === String(selected);
          return (
            <button
              key={String(opt.value)}
              onClick={() => onSelect(opt.value)}
              style={{ ...ui.modalRow, ...(active ? ui.modalRowActive : null) }}
            >
              <span style={{ ...ui.modalRowText, ...(active ? ui.modalRowTextActive : null) }}>
                {opt.label}
              </span>
              {active ? <span style={{ opacity: 0.9 }}>✓</span> : null}
            </button>
          );
        })}
        {options?.length ? null : <div style={{ color: "#9ca3af", fontSize: 12 }}>—</div>}
      </div>
    </Modal>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const bg = toast.type === "success" ? "rgba(22,163,74,0.98)" : "rgba(239,68,68,0.98)";
  return (
    <div style={{ ...ui.toast, backgroundColor: bg }}>
      <div style={ui.toastIcon}>{toast.type === "success" ? "✓" : "!"}</div>
      <div style={ui.toastText}>{toast.message}</div>
    </div>
  );
}

/* -------------------- page -------------------- */

export default function OwnerFashionPage() {
  const nav = useNavigate();
  const params = useParams();
  const location = useLocation();

  const profileKey = normalizeProfileKey(params?.profileKey);

  const [brand, setBrand] = useState("");
  const [name, setName] = useState("");
  const [pieceType, setPieceType] = useState("");
  const [tag, setTag] = useState("");
  const [styleNote, setStyleNote] = useState("");

  const [mediaUrl, setMediaUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState(""); // ✅ NEW

  const [items, setItems] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const bgUrl = location?.state?.bgUrl || null;

  // pickers
  const [typePickerOpen, setTypePickerOpen] = useState(false);
  const [tagPickerOpen, setTagPickerOpen] = useState(false);
  const [customTagOpen, setCustomTagOpen] = useState(false);
  const [customTagText, setCustomTagText] = useState("");

  const canUseApi = useMemo(() => !!profileKey, [profileKey]);
  const abortRef = useRef(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 2400);
  };

  const goOwnerLogin = (k) => {
    const pk = normalizeProfileKey(k || profileKey);
    if (!pk) return nav("/", { replace: true });
    nav(`/world/${encodeURIComponent(pk)}/owner/login`, {
      replace: true,
      state: { profileKey: pk, bgUrl },
    });
  };

  const resetForm = () => {
    setBrand("");
    setName("");
    setPieceType("");
    setTag("");
    setStyleNote("");
    setMediaUrl("");
    setLinkUrl(""); // ✅ NEW
    setCustomTagText("");
  };

  // Dropdown options
  const TYPE_OPTIONS = useMemo(
    () =>
      ["Knitwear", "Headwear", "Sneakers", "Outerwear", "Accessories", "Shirts", "Pants", "Sets", "Other"].map(
        (x) => ({ label: x, value: x })
      ),
    []
  );

  const TAG_OPTIONS = useMemo(() => {
    const fromItems = items.map((i) => i.tag).filter(Boolean);
    const defaults = ["Street", "Studio", "Everyday", "Statement", "Clean", "Vintage", "Gym"];
    const merged = uniqStrings([...fromItems, ...defaults]);
    return merged.map((x) => ({ label: x, value: x }));
  }, [items]);

  const typeLabel = pieceType ? pieceType : "Select type…";
  const tagLabel = tag ? tag : "Select tag…";

  // ✅ Load list
  useEffect(() => {
    if (!profileKey) {
      setItems([]);
      setLoadingList(false);
      setError("Missing profileKey in route.");
      return;
    }

    let mounted = true;
    setLoadingList(true);
    setError(null);

    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    (async () => {
      try {
        const res = await ownerFetchRawWeb("/api/owner/fashion", {
          profileKey,
          method: "GET",
          signal: ctrl.signal,
        });

        const data = await res.json().catch(() => ({}));

        if (res.status === 401 || res.status === 403) {
          if (mounted) {
            setItems([]);
            setLoadingList(false);
          }
          goOwnerLogin(profileKey);
          return;
        }

        if (!res.ok || data?.ok === false) throw new Error(data?.error || "Failed to load fashion items.");

        const list = normalizeList(data);
        if (mounted) setItems(list);
      } catch (err) {
        if (!mounted) return;
        if (err?.name === "AbortError") return;
        console.error("OwnerFashionPage load error:", err);
        setError(err?.message || "Failed to load fashion items.");
      } finally {
        if (mounted) setLoadingList(false);
      }
    })();

    return () => {
      mounted = false;
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileKey]);

  // ✅ Add
  const handleAddItem = async () => {
    if (!profileKey) return showToast("error", "Missing profileKey.");

    const trimmedBrand = clampStr(brand);
    const trimmedName = clampStr(name);
    const trimmedType = clampStr(pieceType);
    const trimmedTag = clampStr(tag);
    const trimmedNote = clampStr(styleNote);

    const url = clampStr(mediaUrl);
    const outbound = outboundUrl(linkUrl); // ✅ NEW (normalized)

    if (!trimmedBrand || !trimmedName || !trimmedType) return showToast("error", "Brand, name, and type are required.");
    if (!url) return showToast("error", "Paste an image/video URL.");
    if (saving) return;

    try {
      setSaving(true);
      setError(null);

      const payload = {
        brand: trimmedBrand,
        name: trimmedName,
        type: trimmedType,
        styleNote: trimmedNote || null,
        tag: trimmedTag || null,
        image: isProbablyVideoUrl(url) ? null : url,
        video: isProbablyVideoUrl(url) ? url : null,

        // ✅ NEW
        url: outbound || null,
      };

      const res = await ownerFetchRawWeb("/api/owner/fashion", {
        profileKey,
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401 || res.status === 403) return goOwnerLogin(profileKey);

      if (!res.ok || data?.ok === false) throw new Error(data?.error || "Failed to add fashion item.");

      const saved = normalizeList([data?.item || data?.data || data])[0];
      if (!saved) throw new Error("Save succeeded but item was invalid.");

      setItems((prev) => [saved, ...prev]);
      resetForm();
      showToast("success", "Piece added");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("OwnerFashionPage save error:", err);
      setError(err?.message || "Failed to add fashion item.");
      showToast("error", err?.message || "Failed to add fashion item.");
      if (String(err?.message || "").toLowerCase().includes("unauthorized")) goOwnerLogin(profileKey);
    } finally {
      setSaving(false);
    }
  };

  // ✅ Delete
  const handleDeleteItem = async (rawId) => {
    if (!profileKey) return showToast("error", "Missing profileKey.");

    const targetId = String(rawId || "").trim();
    if (!targetId) return showToast("error", "Delete failed: missing id.");

    const ok = window.confirm("Delete piece?\n\nThis will remove it from your fashion list.");
    if (!ok) return;

    try {
      const res = await ownerFetchRawWeb(`/api/owner/fashion/${encodeURIComponent(targetId)}`, {
        profileKey,
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401 || res.status === 403) return goOwnerLogin(profileKey);

      if (!res.ok || data?.ok === false) throw new Error(data?.error || "Failed to delete fashion item.");

      setItems((prev) => prev.filter((x) => String(x._id || x.id) !== targetId));
      showToast("success", "Piece removed");
    } catch (err) {
      console.error("OwnerFashionPage delete error:", err);
      showToast("error", err?.message || "Failed to delete fashion item.");
      if (String(err?.message || "").toLowerCase().includes("unauthorized")) goOwnerLogin(profileKey);
    }
  };

  const openOutbound = (raw) => {
    const u = outboundUrl(raw);
    if (!u) return showToast("error", "Missing/invalid link URL.");
    window.open(u, "_blank", "noopener,noreferrer");
  };

  const customTagFooter = (
    <div>
      <div style={ui.modalHelper}>Add a new tag:</div>
      <div style={ui.customTagRow}>
        <input
          value={customTagText}
          onChange={(e) => setCustomTagText(e.target.value)}
          placeholder="e.g. Photoshoot, Winter, Clean"
          style={ui.customTagInput}
        />
        <button
          style={ui.customTagAddBtn}
          onClick={() => {
            const t = String(customTagText || "").trim();
            if (!t) return;
            setTag(t);
            setCustomTagOpen(false);
            setTagPickerOpen(false);
            setCustomTagText("");
          }}
        >
          Add
        </button>
      </div>
    </div>
  );

  return (
    <div style={ui.page}>
      <style>{ui.css()}</style>

      <Toast toast={toast} />

      {/* Header */}
      <div style={ui.header}>
        <button style={ui.backBtn} onClick={() => nav(-1)} title="Back">
          ←
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={ui.title}>Owner Fashion</div>
          <div style={ui.subtitle}>Brand • Type • Tag • Media • Link</div>
          {!canUseApi ? <div style={{ ...ui.subtitle, color: "#fca5a5" }}>Missing profileKey for this page.</div> : null}
        </div>

        <button
          style={{ ...ui.refreshBtn, opacity: !canUseApi || loadingList ? 0.55 : 1 }}
          onClick={() => canUseApi && window.location.reload()}
          disabled={!canUseApi || loadingList}
          title="Refresh"
        >
          ⟳
        </button>
      </div>

      {!profileKey ? (
        <div style={ui.missingBox}>
          <div style={ui.missingTitle}>Missing profileKey</div>
          <div style={ui.missingText}>Open this page as: /world/&lt;profileKey&gt;/owner/fashion</div>
        </div>
      ) : null}

      <div style={ui.body}>
        {error ? (
          <div style={ui.errorBox}>
            <div style={ui.errorText}>{error}</div>
          </div>
        ) : null}

        {/* Brand */}
        <div style={ui.label}>Brand</div>
        <div style={ui.inputWrap}>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} style={ui.input} placeholder="Ralph Lauren, ANTA, etc." />
        </div>

        {/* Name */}
        <div style={{ ...ui.label, marginTop: 12 }}>Name</div>
        <div style={ui.inputWrap}>
          <input value={name} onChange={(e) => setName(e.target.value)} style={ui.input} placeholder="Cable-Knit Sweater, Hela Roots..." />
        </div>

        {/* Type */}
        <div style={{ ...ui.label, marginTop: 12 }}>Type</div>
        <button style={ui.pickerWrap} onClick={() => setTypePickerOpen(true)} disabled={!canUseApi}>
          <span style={{ ...ui.pickerText, ...(pieceType ? null : ui.pickerPlaceholder) }}>{typeLabel}</span>
          <span style={{ opacity: 0.9 }}>▾</span>
        </button>

        {/* Tag */}
        <div style={{ ...ui.label, marginTop: 12 }}>Tag</div>
        <button style={ui.pickerWrap} onClick={() => setTagPickerOpen(true)} disabled={!canUseApi}>
          <span style={{ ...ui.pickerText, ...(tag ? null : ui.pickerPlaceholder) }}>{tagLabel}</span>
          <span style={{ opacity: 0.9 }}>▾</span>
        </button>

        {/* Style note */}
        <div style={{ ...ui.label, marginTop: 12 }}>Style note</div>
        <div style={ui.inputWrapMultiline}>
          <textarea
            value={styleNote}
            onChange={(e) => setStyleNote(e.target.value)}
            style={ui.textarea}
            placeholder="How you wear it, why it matters…"
            rows={3}
          />
        </div>

        {/* Media URL */}
        <div style={{ ...ui.label, marginTop: 12 }}>Media URL</div>
        <div style={ui.inputWrap}>
          <input
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            style={ui.input}
            placeholder="Paste image or video URL (mp4, mov...)"
          />
        </div>

        {/* ✅ NEW: Outbound Link */}
        <div style={{ ...ui.label, marginTop: 12 }}>Outbound Link (optional)</div>
        <div style={ui.inputWrap}>
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            style={ui.input}
            placeholder="Paste product link (https://..., www..., etc.)"
          />
        </div>

        <button onClick={handleAddItem} disabled={!canUseApi || saving} style={{ ...ui.saveBtn, opacity: !canUseApi || saving ? 0.6 : 1 }}>
          {saving ? "Saving…" : "Add Piece"}
        </button>

        <div style={{ ...ui.sectionTitle, marginTop: 18 }}>Current pieces</div>

        {loadingList ? (
          <div style={ui.loadingRow}>
            <div className="spinner" />
            <div style={{ color: "#9ca3af" }}>Loading pieces…</div>
          </div>
        ) : items.length === 0 ? (
          <div style={ui.emptyText}>No pieces yet. Add one above.</div>
        ) : (
          <div style={ui.list}>
            {items.map((item) => {
              const itemId = String(item._id || item.id || "").trim();
              const link = outboundUrl(item.url);

              return (
                <div key={itemId} style={ui.itemCard}>
                  <div style={ui.itemRow}>
                    <div style={ui.monogram}>{(item.brand?.[0] || "F").toUpperCase()}</div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={ui.itemTitle} title={item.name}>
                        {item.name}
                      </div>

                      <div style={ui.itemMeta} title={`${item.brand} • ${item.type}${item.tag ? ` • ${item.tag}` : ""}`}>
                        {item.brand} • {item.type}
                        {item.tag ? ` • ${item.tag}` : ""}
                      </div>

                      {item.styleNote ? <div style={ui.itemNote}>{item.styleNote}</div> : null}

                      <div style={ui.itemMedia}>
                        {item.video ? "Video" : item.image ? "Image" : "Media"}
                        {link ? <span style={{ opacity: 0.7 }}> • Link</span> : null}
                      </div>

                      {link ? (
                        <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button style={ui.linkBtn} onClick={() => openOutbound(item.url)} title={link}>
                            Open ↗
                          </button>
                          <button
                            style={ui.copyBtn}
                            onClick={() => {
                              navigator.clipboard?.writeText(link).catch(() => {});
                              showToast("success", "Link copied");
                            }}
                            title="Copy link"
                          >
                            Copy
                          </button>
                        </div>
                      ) : null}
                    </div>

                    <button style={ui.deleteBtn} onClick={() => handleDeleteItem(itemId)} title="Delete">
                      🗑
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Type picker */}
      <SelectModal
        open={typePickerOpen}
        title="Select type"
        options={TYPE_OPTIONS}
        selected={pieceType}
        onSelect={(v) => {
          setPieceType(String(v));
          setTypePickerOpen(false);
        }}
        onClose={() => setTypePickerOpen(false)}
      />

      {/* Tag picker */}
      <SelectModal
        open={tagPickerOpen}
        title="Select tag"
        options={[...TAG_OPTIONS, { label: "Add custom…", value: "__custom__" }, { label: "No tag", value: "" }]}
        selected={tag}
        onSelect={(v) => {
          if (v === "__custom__") {
            setCustomTagOpen(true);
            return;
          }
          setTag(String(v));
          setTagPickerOpen(false);
        }}
        onClose={() => setTagPickerOpen(false)}
      />

      {/* Custom tag */}
      <SelectModal
        open={customTagOpen}
        title="Custom tag"
        options={[{ label: "Use custom tag below", value: "__noop__" }]}
        selected={"__noop__"}
        onSelect={() => {}}
        onClose={() => {
          setCustomTagOpen(false);
          setTagPickerOpen(false);
        }}
        footer={customTagFooter}
      />
    </div>
  );
}

const ui = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, rgba(2,6,23,1), rgba(2,6,23,0.98))",
    color: "#e5e7eb",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 18px",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    position: "sticky",
    top: 0,
    zIndex: 10,
    background: "rgba(2,6,23,0.72)",
    backdropFilter: "blur(10px)",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
  title: { fontSize: 18, fontWeight: 900, letterSpacing: 0.6, color: "#fff" },
  subtitle: { marginTop: 4, fontSize: 12, color: "#9ca3af" },

  missingBox: {
    margin: "12px 18px 0",
    padding: 12,
    borderRadius: 14,
    border: "1px solid rgba(248,113,113,0.7)",
    background: "rgba(248,113,113,0.08)",
  },
  missingTitle: { color: "#fecaca", fontWeight: 900, fontSize: 13 },
  missingText: { marginTop: 6, color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 600 },

  body: { padding: "16px 18px 40px", maxWidth: 860, margin: "0 auto" },

  label: { fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, color: "#9ca3af", marginBottom: 6, fontWeight: 800 },

  inputWrap: { borderRadius: 999, border: "1px solid #374151", background: "rgba(15,23,42,0.70)", overflow: "hidden" },
  inputWrapMultiline: { borderRadius: 18, border: "1px solid #374151", background: "rgba(15,23,42,0.70)", overflow: "hidden" },

  input: { width: "100%", padding: "12px 14px", outline: "none", border: "none", background: "transparent", color: "#f9fafb", fontSize: 14 },
  textarea: { width: "100%", padding: "12px 14px", outline: "none", border: "none", background: "transparent", color: "#f9fafb", fontSize: 14, lineHeight: "20px", resize: "vertical" },

  pickerWrap: {
    width: "100%",
    borderRadius: 999,
    border: "1px solid #374151",
    background: "rgba(15,23,42,0.70)",
    padding: "12px 14px",
    color: "#f9fafb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
  },
  pickerText: { fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  pickerPlaceholder: { color: "#6b7280" },

  saveBtn: {
    marginTop: 14,
    width: "100%",
    borderRadius: 999,
    border: "none",
    padding: "12px 14px",
    cursor: "pointer",
    fontWeight: 900,
    letterSpacing: 0.6,
    background: "linear-gradient(90deg, #22c55e, #16a34a)",
    color: "#052e16",
  },

  sectionTitle: { fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, color: "#e5e7eb", fontWeight: 900 },

  loadingRow: { marginTop: 10, color: "#9ca3af", display: "flex", alignItems: "center", gap: 10 },
  emptyText: { marginTop: 10, color: "#6b7280" },

  list: { marginTop: 10, display: "grid", gap: 10 },

  itemCard: { borderRadius: 16, border: "1px solid #374151", background: "rgba(15,23,42,0.86)", padding: 12 },
  itemRow: { display: "flex", alignItems: "center", gap: 12 },
  monogram: { width: 38, height: 38, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#e5e7eb", background: "rgba(59,130,246,0.25)", border: "1px solid rgba(129,140,248,0.65)", flex: "0 0 auto" },

  itemTitle: { color: "#fff", fontWeight: 900, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  itemMeta: { marginTop: 2, color: "#cbd5f5", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  itemNote: { marginTop: 6, color: "#9ca3af", fontSize: 12, lineHeight: "18px" },
  itemMedia: { marginTop: 6, color: "#6b7280", fontSize: 11, letterSpacing: 0.4 },

  linkBtn: {
    height: 34,
    padding: "0 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
  copyBtn: {
    height: 34,
    padding: "0 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(2,6,23,0.35)",
    color: "#e5e7eb",
    fontWeight: 900,
    cursor: "pointer",
  },

  deleteBtn: { width: 38, height: 38, borderRadius: 999, border: "1px solid rgba(248,113,113,0.7)", background: "rgba(239,68,68,0.10)", color: "#fecaca", cursor: "pointer", flex: "0 0 auto" },

  errorBox: { marginBottom: 10, padding: 12, borderRadius: 14, border: "1px solid rgba(248,113,113,0.7)", background: "rgba(248,113,113,0.08)" },
  errorText: { color: "#fecaca", fontWeight: 900, fontSize: 13 },

  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.58)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 999 },
  modalCard: { width: "min(560px, 92vw)", borderRadius: 18, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(15,23,42,0.98)", padding: 14, boxShadow: "0 24px 60px rgba(0,0,0,0.55)" },
  modalTitle: { color: "#fff", fontWeight: 900, letterSpacing: 1, textTransform: "uppercase", fontSize: 13, marginBottom: 10 },
  modalBody: {},

  modalRow: {
    width: "100%",
    textAlign: "left",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(2,6,23,0.35)",
    padding: "12px 12px",
    marginBottom: 8,
    cursor: "pointer",
    color: "#e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  modalRowActive: { background: "rgba(59,130,246,0.18)", border: "1px solid rgba(129,140,248,0.55)" },
  modalRowText: { fontWeight: 800, fontSize: 13 },
  modalRowTextActive: { color: "#fff" },

  modalCloseBtn: { marginTop: 12, width: "100%", borderRadius: 12, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.08)", color: "#e5e7eb", padding: "10px 12px", fontWeight: 900, cursor: "pointer" },

  modalHelper: { color: "#cbd5f5", fontSize: 12, marginBottom: 8, fontWeight: 800 },
  customTagRow: { display: "flex", gap: 10, alignItems: "center" },
  customTagInput: { flex: 1, height: 42, borderRadius: 12, padding: "0 12px", color: "#f9fafb", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(2,6,23,0.35)", outline: "none" },
  customTagAddBtn: { height: 42, padding: "0 14px", borderRadius: 12, border: "1px solid rgba(34,197,94,0.5)", background: "rgba(34,197,94,0.18)", color: "#bbf7d0", fontWeight: 900, cursor: "pointer" },

  toast: { position: "fixed", right: 16, top: 16, zIndex: 1000, display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 999, boxShadow: "0 18px 40px rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.12)" },
  toastIcon: { width: 22, height: 22, borderRadius: 999, background: "rgba(255,255,255,0.88)", color: "#111827", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, flex: "0 0 auto" },
  toastText: { color: "#ecfdf5", fontWeight: 900, fontSize: 13 },

  css: () => `
    * { box-sizing: border-box; }
    button { font-family: inherit; }
    .spinner{
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.25);
      border-top-color: rgba(255,255,255,0.85);
      border-radius: 999px;
      animation: spin 0.9s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `,
};
