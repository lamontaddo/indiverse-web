// src/pages/OwnerPaidVideosPage.jsx ✅ FULL DROP-IN (WEB)
// Route: /world/:profileKey/owner/paid-videos  (example)
// Requires:
// - ownerFetch(profileKey, path, opts) (same as your web ownerApi)
// - getProfileByKey(profileKey) optional (for label) OR pass label via route
//
// Upload flow (web):
// 1) Pick file via <input type="file" />
// 2) POST /api/owner/paid-videos/sign-upload -> { ok:true, key, putUrl, fileUrl? }
// 3) PUT blob to putUrl (Content-Type)
// 4) Save video doc with thumbnailKey + s3KeyFull, etc.
//
// Notes:
// - Uses simple HTML/CSS (no libs)
// - Uses window.confirm instead of RN Alert
// - Uses <dialog> modal (supported in modern browsers)

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { apiJson } from "../utils/apiClient";
import { getProfileByKey } from "../services/profileRegistry";
import { getActiveProfileKey } from "../config/apiBase";

/* ------------------------------ ownerJson ------------------------------ */
async function ownerJson(path, { method = "GET", profileKey, body, headers } = {}) {
    const res = await apiJson(path, {
      method,
      credentials: "include", // ✅ REQUIRED for owner cookie/session
      headers: {
        ...(profileKey ? { "x-profile-key": profileKey } : {}),
        ...(headers || {}),
      },
      ...(body !== undefined ? { body } : {}),
    });
  
    return res;
  }
  
  

/* ------------------------------ helpers ------------------------------ */
function dollarsFromCents(cents) {
  const n = Number(cents || 0);
  if (!Number.isFinite(n) || n <= 0) return "$0.00";
  return `$${(n / 100).toFixed(2)}`;
}

function parseDollarsToCents(input) {
  const raw = String(input || "").replace(/[^0-9.]/g, "");
  if (!raw) return 0;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n * 100);
}

function formatDollarsInput(input) {
  return String(input || "").replace(/[^0-9.]/g, "");
}

function badgeText(v) {
  const pub = v.isPublished ? "Published" : "Draft";
  const src = String(v.sourceType || "s3").toLowerCase() === "link" ? "Link" : "S3";
  const acc =
    String(v.access || "free").toLowerCase() === "paid" ? `Paid ${dollarsFromCents(v.priceCents)}` : "Free";
  return `${pub} • ${acc} • ${src}`;
}

function canPublish(video) {
  const src = String(video?.sourceType || "s3").toLowerCase();
  if (src === "link") return true;
  const access = String(video?.access || "free").toLowerCase();
  if (access !== "paid") return true;
  const n = Number(video?.priceCents || 0);
  return Number.isFinite(n) && n > 0;
}

function validateForm(form) {
  const title = String(form.title || "").trim();
  if (!title) return "Title is required.";

  const sourceType = String(form.sourceType || "s3").toLowerCase();

  if (sourceType !== "link") {
    const access = String(form.access || "free").toLowerCase();
    if (access === "paid") {
      const cents = parseDollarsToCents(form.priceDollars);
      if (!Number.isFinite(cents) || cents <= 0) return "Paid videos must have a price > 0.";
    }
  }

  if (sourceType === "s3") {
    if (!String(form.s3KeyFull || "").trim()) return "Pick a video (or set s3KeyFull) for S3 uploads.";
  } else {
    if (!String(form.externalUrl || "").trim()) return "externalUrl is required when sourceType is link.";
  }

  return null;
}

function guessVideoContentTypeFromName(name = "") {
  const n = String(name).toLowerCase();
  if (n.endsWith(".mov")) return "video/quicktime";
  if (n.endsWith(".m4v")) return "video/x-m4v";
  if (n.endsWith(".webm")) return "video/webm";
  return "video/mp4";
}

function guessImageContentTypeFromName(name = "") {
  const n = String(name).toLowerCase();
  if (n.endsWith(".png")) return "image/png";
  if (n.endsWith(".webp")) return "image/webp";
  if (n.endsWith(".heic")) return "image/heic";
  if (n.endsWith(".heif")) return "image/heif";
  return "image/jpeg";
}

function cacheBust(url) {
  const u = String(url || "").trim();
  if (!u) return "";
  return `${u}${u.includes("?") ? "&" : "?"}v=${Date.now()}`;
}

/* ------------------------------ page ------------------------------ */
export default function OwnerPaidVideosPage() {
  const nav = useNavigate();
  const params = useParams();

  const profileKey = String(params.profileKey || getActiveProfileKey?.() || "").trim().toLowerCase();
  const profile = useMemo(() => (profileKey ? getProfileByKey(profileKey) : null), [profileKey]);

  const headerTitle = `${profile?.label || profileKey || "owner"} • Owner Paid Videos`;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [saving, setSaving] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);

  const [videos, setVideos] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const emptyForm = useMemo(
    () => ({
      title: "",
      description: "",
      access: "free",
      priceDollars: "0.00",
      currency: "usd",

      sourceType: "s3",
      s3KeyFull: "",
      s3KeyPreview: "",
      externalUrl: "",

      thumbnailUrl: "",
      thumbnailKey: "",

      isPublished: false,
    }),
    []
  );

  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    if (!profileKey) {
      alert("Missing profileKey");
      setLoading(false);
      return;
    }

    try {
      const data = await ownerJson("/api/owner/paid-videos", { profileKey });
      setVideos(Array.isArray(data) ? data : []);
    } catch (e) {
      alert(`Failed to load videos: ${e.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [profileKey]);

  useEffect(() => {
    load();
  }, [load]);

  function openCreate() {
    setEditTarget(null);
    setForm(emptyForm);
    setUploadingVideo(false);
    setUploadingThumb(false);
    setModalOpen(true);
  }

  function openEdit(v) {
    const src = String(v?.sourceType || "s3").toLowerCase();
    const isLink = src === "link";

    setEditTarget(v);
    setForm({
      title: v.title || "",
      description: v.description || "",
      access: isLink ? "free" : String(v.access || "free").toLowerCase(),
      priceDollars: isLink ? "0.00" : String(((Number(v.priceCents || 0) || 0) / 100).toFixed(2)),
      currency: (v.currency || "usd").toLowerCase(),

      sourceType: src,
      s3KeyFull: v.s3KeyFull || "",
      s3KeyPreview: v.s3KeyPreview || "",
      externalUrl: v.externalUrl || "",

      thumbnailUrl: v.thumbnailUrl || "",
      thumbnailKey: v.thumbnailKey || "",

      isPublished: !!v.isPublished,
    });

    setUploadingVideo(false);
    setUploadingThumb(false);
    setModalOpen(true);
  }

  function closeModal() {
    if (saving || uploadingVideo || uploadingThumb) return;
    setModalOpen(false);
    setEditTarget(null);
    setForm(emptyForm);
    setUploadingVideo(false);
    setUploadingThumb(false);
  }

  /* ------------------------------ uploads (WEB) ------------------------------ */
  const signUpload = useCallback(
    async ({ filename, contentType, kind }) => {
      return await ownerJson("/api/owner/paid-videos/sign-upload", {
        method: "POST",
        profileKey,
        body: { filename, contentType, kind },
      });
    },
    [profileKey]
  );

  const pickAndUploadVideo = useCallback(
    async (file) => {
      if (!profileKey) return alert("Missing profileKey");
      if (!file) return;
      if (uploadingVideo || uploadingThumb || saving) return;

      try {
        setUploadingVideo(true);

        const filename = file.name || `video-${Date.now()}.mp4`;
        const contentType = file.type || guessVideoContentTypeFromName(filename);

        const signed = await signUpload({ filename, contentType, kind: "video" });
        const putUrl = signed?.putUrl;
        const key = signed?.key;

        if (!putUrl || !key) throw new Error("Upload signer did not return putUrl/key.");

        const putRes = await fetch(putUrl, {
          method: "PUT",
          headers: { "Content-Type": contentType },
          body: file,
        });

        if (!putRes.ok) {
          const txt = await putRes.text().catch(() => "");
          throw new Error(`Upload failed (${putRes.status}) ${txt ? `- ${txt}` : ""}`.trim());
        }

        setForm((s) => ({
          ...s,
          sourceType: "s3",
          s3KeyFull: key,
          s3KeyPreview: "", // server sets after generation
        }));

        alert("Uploaded. Now hit Save.");
      } catch (e) {
        alert(e?.message || "Upload failed");
      } finally {
        setUploadingVideo(false);
      }
    },
    [profileKey, uploadingVideo, uploadingThumb, saving, signUpload]
  );

  const pickAndUploadThumbnail = useCallback(
    async (file) => {
      if (!profileKey) return alert("Missing profileKey");
      if (!file) return;
      if (uploadingVideo || uploadingThumb || saving) return;

      try {
        setUploadingThumb(true);

        const filename = file.name || `thumb-${Date.now()}.jpg`;
        const contentType = file.type || guessImageContentTypeFromName(filename);

        const signed = await signUpload({ filename, contentType, kind: "thumbnail" });
        const putUrl = signed?.putUrl;
        const key = signed?.key;

        if (!putUrl || !key) throw new Error("Thumbnail signer did not return putUrl/key.");

        const putRes = await fetch(putUrl, {
          method: "PUT",
          headers: { "Content-Type": contentType },
          body: file,
        });

        if (!putRes.ok) {
          const txt = await putRes.text().catch(() => "");
          throw new Error(`Thumbnail upload failed (${putRes.status}) ${txt ? `- ${txt}` : ""}`.trim());
        }

        const signedGet = String(signed?.getUrl || signed?.getThumbUrl || signed?.thumbnailUrl || "").trim();
        const localPreview = URL.createObjectURL(file);

        setForm((s) => ({
          ...s,
          thumbnailKey: String(key || "").trim(),
          thumbnailUrl: signedGet ? cacheBust(signedGet) : localPreview,
        }));

        alert("Thumbnail set.");
      } catch (e) {
        alert(e?.message || "Thumbnail upload failed");
      } finally {
        setUploadingThumb(false);
      }
    },
    [profileKey, uploadingVideo, uploadingThumb, saving, signUpload]
  );

  /* ------------------------------ CRUD ------------------------------ */
  async function onSave() {
    if (uploadingVideo || uploadingThumb) return alert("Upload still in progress.");

    const err = validateForm(form);
    if (err) return alert(err);

    const src = String(form.sourceType || "s3").toLowerCase();
    const isLink = src === "link";

    const access = isLink ? "free" : String(form.access || "free").toLowerCase() === "paid" ? "paid" : "free";
    const priceCents = isLink ? 0 : access === "paid" ? parseDollarsToCents(form.priceDollars) : 0;

    const payload = {
      title: String(form.title || "").trim(),
      description: String(form.description || "").trim(),

      sourceType: isLink ? "link" : "s3",

      access,
      priceCents,
      currency: String(form.currency || "usd").toLowerCase(),

      s3KeyFull: !isLink && form.s3KeyFull ? String(form.s3KeyFull).trim() : null,
      s3KeyPreview: !isLink && form.s3KeyPreview ? String(form.s3KeyPreview).trim() : null,
      externalUrl: isLink && form.externalUrl ? String(form.externalUrl).trim() : null,

      thumbnailKey: form.thumbnailKey ? String(form.thumbnailKey).trim() : null,

      isPublished: !!form.isPublished,
    };

    if (payload.isPublished && payload.sourceType !== "link" && payload.access === "paid" && !(Number(payload.priceCents) > 0)) {
      return alert("Paid videos must have a price before publishing.");
    }

    setSaving(true);
    try {
      if (!profileKey) throw new Error("Missing profileKey");

      if (editTarget?._id) {
        const updated = await ownerJson(`/api/owner/paid-videos/${editTarget._id}`, {
          method: "PUT",
          profileKey,
          body: payload,
        });
        setVideos((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
      } else {
        const created = await ownerJson("/api/owner/paid-videos", {
          method: "POST",
          profileKey,
          body: payload,
        });
        setVideos((prev) => [created, ...prev]);
      }

      closeModal();
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(v) {
    const ok = window.confirm(`Delete "${v.title || "Untitled"}"?`);
    if (!ok) return;

    try {
      await ownerJson(`/api/owner/paid-videos/${v._id}`, { method: "DELETE", profileKey });
      setVideos((prev) => prev.filter((x) => x._id !== v._id));
    } catch (e) {
      alert(e.message);
    }
  }

  async function togglePublish(v) {
    const next = !v.isPublished;
    if (next && !canPublish(v)) return alert("Set a price first (paid videos require price > 0).");

    try {
      await ownerJson(`/api/owner/paid-videos/${v._id}/publish`, {
        method: "PUT",
        profileKey,
        body: { isPublished: next },
      });
      setVideos((prev) => prev.map((x) => (x._id === v._id ? { ...x, isPublished: next } : x)));
    } catch (e) {
      alert(e.message);
    }
  }

  const saveDisabled = saving || uploadingVideo || uploadingThumb;
  const srcIsLink = String(form.sourceType || "s3").toLowerCase() === "link";
  const accessDisabled = srcIsLink;

  return (
    <div style={S.page}>
      <div style={S.header}>
        <button style={S.backBtn} onClick={() => nav(-1)}>{`‹ Back`}</button>
        <div style={S.headerCenter}>
          <div style={S.headerTitle} title={headerTitle}>{headerTitle}</div>
        </div>
        <button style={S.addBtn} onClick={openCreate}>+ Add</button>
      </div>

      {loading ? (
        <div style={S.center}>
          <div style={S.spinner} />
          <div style={S.centerText}>Loading videos…</div>
        </div>
      ) : (
        <>
          <div style={S.toolbar}>
            <button
              style={S.pillBtn}
              onClick={async () => {
                setRefreshing(true);
                await load();
              }}
              disabled={refreshing}
            >
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>

          {videos.length === 0 ? (
            <div style={S.empty}>
              <div style={S.emptyTitle}>No videos yet</div>
              <div style={S.emptySub}>Add your first video and publish when ready.</div>
              <button style={S.primaryBtn} onClick={openCreate}>+ Add Video</button>
            </div>
          ) : (
            <div style={S.list}>
              {videos.map((v) => {
                const thumb = v.thumbnailUrl;
                const isPaid = String(v.sourceType || "s3").toLowerCase() !== "link" && String(v.access || "free").toLowerCase() === "paid";

                return (
                  <button key={v._id} style={S.cardBtn} onClick={() => openEdit(v)}>
                    <div style={S.card}>
                      <div style={S.thumbWrap}>
                        {thumb ? (
                          <img src={thumb} alt="" style={S.thumb} />
                        ) : (
                          <div style={{ ...S.thumb, ...S.thumbFallback }}>🎬</div>
                        )}

                        {isPaid && <div style={S.lockPill}>PAID</div>}
                        {!v.isPublished && <div style={S.draftPill}>DRAFT</div>}
                      </div>

                      <div style={S.cardBody}>
                        <div style={S.titleRow}>
                          <div style={S.title} title={v.title || "Untitled"}>{v.title || "Untitled"}</div>
                        </div>

                        <div style={S.sub} title={v.description || badgeText(v)}>
                          {v.description || badgeText(v)}
                        </div>

                        <div style={S.row}>
                          <button
                            type="button"
                            style={{ ...S.pill, ...(v.isPublished ? S.pillOn : S.pillOff) }}
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePublish(v);
                            }}
                          >
                            {v.isPublished ? "Unpublish" : "Publish"}
                          </button>

                          <button
                            type="button"
                            style={S.pill}
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(v);
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            style={{ ...S.pill, ...S.pillDanger }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(v);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Floating add */}
      {!modalOpen && (
        <button style={S.fab} onClick={openCreate} title="Add">
          +
        </button>
      )}

      {/* Modal */}
      {modalOpen && (
        <div style={S.modalOverlay} onMouseDown={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={S.modalCard}>
            <div style={S.modalHeader}>
              <button style={S.modalHeaderBtn} onClick={closeModal} disabled={saveDisabled}>
                Close
              </button>

              <div style={S.modalTitle}>{editTarget ? "Edit Video" : "New Video"}</div>

              <button
                style={{ ...S.modalHeaderBtn, ...S.modalSaveBtn, ...(saveDisabled ? { opacity: 0.6 } : {}) }}
                onClick={onSave}
                disabled={saveDisabled}
              >
                {uploadingVideo ? "Uploading video…" : uploadingThumb ? "Uploading thumb…" : saving ? "Saving…" : "Save"}
              </button>
            </div>

            <div style={S.modalContent}>
              <label style={S.label}>Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
                style={S.input}
                placeholder="Video title"
              />

              <label style={S.label}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                style={{ ...S.input, ...S.inputMulti }}
                placeholder="Short description"
              />

              <div style={S.sectionRow}>
                <button
                  type="button"
                  onClick={() => setForm((s) => ({ ...s, access: "free", priceDollars: "0.00" }))}
                  style={{ ...S.choice, ...(form.access === "free" ? S.choiceOn : {}), ...(accessDisabled ? S.choiceDisabled : {}) }}
                >
                  Free
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (String(form.sourceType || "s3").toLowerCase() === "link") return;
                    setForm((s) => ({ ...s, access: "paid" }));
                  }}
                  disabled={accessDisabled}
                  style={{ ...S.choice, ...(form.access === "paid" ? S.choiceOn : {}), ...(accessDisabled ? S.choiceDisabled : {}) }}
                >
                  Paid
                </button>
              </div>

              {String(form.sourceType || "s3").toLowerCase() !== "link" && form.access === "paid" && (
                <>
                  <label style={S.label}>Price (USD)</label>
                  <input
                    value={form.priceDollars}
                    onChange={(e) => setForm((s) => ({ ...s, priceDollars: formatDollarsInput(e.target.value) }))}
                    style={S.input}
                    inputMode="decimal"
                    placeholder="5.00"
                  />
                  <div style={S.hint}>You type dollars (ex: 5.00). We store cents behind the scenes.</div>
                </>
              )}

              <div style={S.sectionRow}>
                <button
                  type="button"
                  onClick={() => setForm((s) => ({ ...s, sourceType: "s3" }))}
                  disabled={uploadingVideo || uploadingThumb}
                  style={{ ...S.choice, ...(form.sourceType === "s3" ? S.choiceOn : {}) }}
                >
                  S3 Upload
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setForm((s) => ({
                      ...s,
                      sourceType: "link",
                      access: "free",
                      priceDollars: "0.00",
                      s3KeyFull: "",
                      s3KeyPreview: "",
                    }))
                  }
                  disabled={uploadingVideo || uploadingThumb}
                  style={{ ...S.choice, ...(form.sourceType === "link" ? S.choiceOn : {}) }}
                >
                  Link
                </button>
              </div>

              {form.sourceType === "s3" ? (
                <>
                  <div style={{ ...S.sectionRow, marginTop: 10 }}>
                    <label style={{ ...S.primaryBtn, flex: 1, cursor: saveDisabled ? "not-allowed" : "pointer", opacity: saveDisabled ? 0.65 : 1 }}>
                      <input
                        type="file"
                        accept="video/*"
                        disabled={saveDisabled}
                        style={{ display: "none" }}
                        onChange={(e) => pickAndUploadVideo(e.target.files?.[0] || null)}
                      />
                      {uploadingVideo ? "Uploading…" : "Pick video from computer"}
                    </label>
                  </div>

                  {uploadingVideo ? <div style={S.hint}>Uploading video to S3…</div> : null}

                  <label style={S.label}>s3KeyFull</label>
                  <input
                    value={form.s3KeyFull}
                    onChange={(e) => setForm((s) => ({ ...s, s3KeyFull: e.target.value }))}
                    style={S.input}
                    placeholder="videos/profile/abc.mp4"
                    autoCapitalize="none"
                    disabled={uploadingVideo || uploadingThumb}
                  />
                </>
              ) : (
                <>
                  <label style={S.label}>externalUrl</label>
                  <input
                    value={form.externalUrl}
                    onChange={(e) => setForm((s) => ({ ...s, externalUrl: e.target.value }))}
                    style={S.input}
                    placeholder="https://…"
                    autoCapitalize="none"
                    disabled={uploadingVideo || uploadingThumb}
                  />
                  <div style={S.hint}>Links are always free (by design).</div>
                </>
              )}

              <label style={S.label}>Thumbnail</label>

              {form.thumbnailUrl ? (
                <img src={form.thumbnailUrl} alt="" style={S.thumbPreview} />
              ) : (
                <div style={{ ...S.thumbPreview, ...S.thumbPreviewEmpty }}>No thumbnail</div>
              )}

              <div style={{ ...S.sectionRow, marginTop: 10 }}>
                <label style={{ ...S.primaryBtn, flex: 1, cursor: saveDisabled ? "not-allowed" : "pointer", opacity: saveDisabled ? 0.65 : 1 }}>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={saveDisabled}
                    style={{ display: "none" }}
                    onChange={(e) => pickAndUploadThumbnail(e.target.files?.[0] || null)}
                  />
                  {uploadingThumb ? "Uploading…" : "Pick thumbnail from computer"}
                </label>
              </div>

              <div style={S.hint}>If empty, fallback thumbnail is shown until auto-generated.</div>

              <div style={S.sectionRow}>
                <button
                  type="button"
                  onClick={() => {
                    const next = !form.isPublished;
                    const isLinkNow = String(form.sourceType || "s3").toLowerCase() === "link";
                    if (!isLinkNow && next && form.access === "paid" && !(parseDollarsToCents(form.priceDollars) > 0)) {
                      alert("Paid videos must have a price before publishing.");
                      return;
                    }
                    setForm((s) => ({ ...s, isPublished: next }));
                  }}
                  disabled={uploadingVideo || uploadingThumb}
                  style={{ ...S.choice, ...(form.isPublished ? S.choiceOn : {}), ...(uploadingVideo || uploadingThumb ? { opacity: 0.65 } : {}) }}
                >
                  {form.isPublished ? "Published" : "Draft"}
                </button>
              </div>

              <div style={{ height: 18 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ styles ------------------------------ */
const S = {
  page: { minHeight: "100vh", background: "#0b0b0b", color: "#fff" },

  header: {
    position: "sticky",
    top: 0,
    zIndex: 40,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderBottom: "1px solid #1f1f1f",
    background: "#0b0b0b",
  },
  backBtn: { padding: "8px 10px", borderRadius: 12, background: "#161616", color: "#fff", fontWeight: 900, border: "1px solid #222" },
  headerCenter: { flex: 1, display: "flex", justifyContent: "center" },
  headerTitle: { textAlign: "center", fontWeight: 900, fontSize: 14, opacity: 0.95, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  addBtn: { padding: "8px 10px", borderRadius: 12, background: "#1b1b1b", color: "#fff", fontWeight: 900, border: "1px solid #222" },

  toolbar: { padding: 14, display: "flex", justifyContent: "flex-end" },
  pillBtn: { padding: "9px 12px", borderRadius: 999, background: "#1b1b1b", border: "1px solid #2a2a2a", color: "#fff", fontWeight: 800 },

  center: { minHeight: "55vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 },
  centerText: { color: "#bbb", fontWeight: 800 },
  spinner: { width: 18, height: 18, border: "2px solid #333", borderTopColor: "#fff", borderRadius: 999, animation: "spin 0.9s linear infinite" },

  empty: { padding: 22, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: 800 },
  emptySub: { color: "#aaa", textAlign: "center", maxWidth: 520 },
  primaryBtn: { padding: "12px 16px", borderRadius: 14, background: "#1c1c1c", color: "#fff", fontWeight: 800, border: "1px solid #222" },

  list: { padding: 14, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 },

  cardBtn: { background: "transparent", border: "none", padding: 0, textAlign: "left", cursor: "pointer" },
  card: { borderRadius: 18, background: "#111", overflow: "hidden", border: "1px solid #1f1f1f" },
  thumbWrap: { position: "relative" },
  thumb: { width: "100%", height: 170, objectFit: "cover", background: "#1a1a1a", display: "block" },
  thumbFallback: { display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 },

  lockPill: {
    position: "absolute",
    left: 10,
    top: 10,
    background: "rgba(0,0,0,0.65)",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.15)",
    fontWeight: 900,
    fontSize: 12,
  },
  draftPill: {
    position: "absolute",
    right: 10,
    top: 10,
    background: "rgba(0,0,0,0.65)",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.15)",
    fontWeight: 900,
    fontSize: 12,
  },

  cardBody: { padding: 12 },
  titleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 },
  title: { fontSize: 16, fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  sub: { color: "#9b9b9b", marginTop: 4, marginBottom: 10, fontWeight: 700 },

  row: { display: "flex", flexWrap: "wrap", gap: 8 },
  pill: { padding: "9px 12px", borderRadius: 999, background: "#1b1b1b", border: "1px solid #2a2a2a", color: "#fff", fontWeight: 800 },
  pillOn: { background: "#0f2a17", border: "1px solid #1e4f2e" },
  pillOff: { background: "#1b1b1b" },
  pillDanger: { background: "#2b1212", border: "1px solid #4b1d1d" },

  fab: {
    position: "fixed",
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    background: "#1b1b1b",
    border: "1px solid #2a2a2a",
    color: "#fff",
    fontSize: 26,
    fontWeight: 900,
    cursor: "pointer",
  },

  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.62)", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: 16, overflow: "auto", zIndex: 80 },
  modalCard: { width: "min(760px, 100%)", marginTop: 16, background: "#0b0b0b", border: "1px solid #1f1f1f", borderRadius: 18, overflow: "hidden" },

  modalHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: 14, borderBottom: "1px solid #1f1f1f", background: "#0b0b0b", position: "sticky", top: 0, zIndex: 2 },
  modalTitle: { fontWeight: 900, fontSize: 16 },
  modalHeaderBtn: { padding: "8px 10px", borderRadius: 12, background: "#161616", color: "#fff", fontWeight: 900, border: "1px solid #222" },
  modalSaveBtn: { background: "#132317" },

  modalContent: { padding: 14 },

  label: { display: "block", fontWeight: 900, marginTop: 12, marginBottom: 6 },
  hint: { color: "#8a8a8a", marginTop: 6, fontWeight: 700 },

  input: { width: "100%", background: "#111", border: "1px solid #222", borderRadius: 14, padding: "10px 12px", color: "#fff", outline: "none" },
  inputMulti: { minHeight: 90, resize: "vertical" },

  sectionRow: { display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" },
  choice: { flex: "1 1 160px", padding: "12px 12px", borderRadius: 14, background: "#111", border: "1px solid #222", color: "#fff", fontWeight: 900, cursor: "pointer" },
  choiceOn: { borderColor: "#3b3b3b", background: "#151515" },
  choiceDisabled: { opacity: 0.55 },

  thumbPreview: { width: "100%", height: 160, borderRadius: 14, background: "#111", border: "1px solid #222", objectFit: "cover", display: "block" },
  thumbPreviewEmpty: { display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontWeight: 900 },
};

/* inject keyframes once */
if (typeof document !== "undefined" && !document.getElementById("ownerPaidVideosSpin")) {
  const el = document.createElement("style");
  el.id = "ownerPaidVideosSpin";
  el.innerHTML = `@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`;
  document.head.appendChild(el);
}
