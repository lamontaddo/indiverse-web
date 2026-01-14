// src/pages/OwnerMusicPage.jsx ✅ FULL DROP-IN (Web)
// Route: /owner/:profileKey/music   (recommended)
// Also supports missing param via localStorage activeProfileKey
//
// ✅ profileKey resolution: param wins; else localStorage activeProfileKey
// ✅ ownerFetch includes { profileKey } always
// ✅ unauthorized -> redirect to /owner/login?profileKey=...
// ✅ parse json once
// ✅ S3 PUT upload via fetch(uploadUrl, { method:'PUT', body:file })

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ownerFetch } from "../services/ownerFetch";

// ---------------- helpers ----------------
function normPk(v) {
  return String(v || "").trim().toLowerCase();
}

function getActiveProfileKeyWeb() {
  try {
    return localStorage.getItem("activeProfileKey") || "";
  } catch {
    return "";
  }
}

function moneyFromCents(cents) {
  const n = Number(cents || 0) / 100;
  if (!Number.isFinite(n)) return "$0.00";
  return `$${n.toFixed(2)}`;
}

function toPriceCents(priceStr) {
  const f = parseFloat(String(priceStr || "").trim());
  if (Number.isNaN(f) || f < 0) return null;
  return Math.round(f * 100);
}

async function safeJson(res) {
  return res.json().catch(() => ({}));
}

function isUnauthorizedMessage(msg) {
  return String(msg || "").toLowerCase().includes("unauthorized");
}

async function s3PutUpload({ uploadUrl, file, contentType }) {
  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: contentType ? { "Content-Type": contentType } : undefined,
    body: file,
  });
  if (!putRes.ok) {
    throw new Error(`Upload to S3 failed (status ${putRes.status})`);
  }
}

// ---------------- Modal ----------------
function ModalShell({ open, title, onClose, children, footer }) {
  if (!open) return null;

  return (
    <div className="omodalBack" onMouseDown={onClose}>
      <div className="omodalCard" onMouseDown={(e) => e.stopPropagation()}>
        <div className="omodalHeader">
          <div className="omodalTitle">{title}</div>
          <button className="oiconBtn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="omodalBody">{children}</div>
        {footer ? <div className="omodalFooter">{footer}</div> : null}
      </div>
    </div>
  );
}

export default function OwnerMusicPage() {
  const nav = useNavigate();
  const { profileKey: pkParam } = useParams();
  const location = useLocation();

  // ✅ resolve pk: param wins, else localStorage
  const [profileKey, setProfileKey] = useState(null);
  const [profileReady, setProfileReady] = useState(false);

  const [OWNER_LABEL, setOwnerLabel] = useState("Owner");

  // ===== DATA =====
  const [stats, setStats] = useState({ albumCount: 0, trackCount: 0 });
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  // TRACK editor
  const [trackOpen, setTrackOpen] = useState(false);
  const [savingTrack, setSavingTrack] = useState(false);
  const [editingTrack, setEditingTrack] = useState(null);

  const [formTitle, setFormTitle] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formDuration, setFormDuration] = useState("");
  const [formPreviewSeconds, setFormPreviewSeconds] = useState("30");
  const [formAlbumId, setFormAlbumId] = useState("");
  const [formS3KeyPreview, setFormS3KeyPreview] = useState("");
  const [formS3KeyFull, setFormS3KeyFull] = useState("");

  const [formCoverImageUrl, setFormCoverImageUrl] = useState("");
  const [formCoverImageKey, setFormCoverImageKey] = useState("");
  const [uploadingTrackArtwork, setUploadingTrackArtwork] = useState(false);
  const [uploadingFull, setUploadingFull] = useState(false);

  // ALBUM editor
  const [albumOpen, setAlbumOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumPrice, setAlbumPrice] = useState("");
  const [albumCoverImageUrl, setAlbumCoverImageUrl] = useState("");
  const [albumCoverImageKey, setAlbumCoverImageKey] = useState("");
  const [savingAlbum, setSavingAlbum] = useState(false);
  const [uploadingAlbumArtwork, setUploadingAlbumArtwork] = useState(false);

  const canUseApi = useMemo(() => !!profileKey, [profileKey]);

  const goOwnerLogin = useCallback(
    (pk) => {
      const k = normPk(pk || profileKey || pkParam);
      // preserve return route
      const next = encodeURIComponent(location.pathname + location.search);
      nav(`/owner/login?profileKey=${encodeURIComponent(k)}&next=${next}`, { replace: true });
    },
    [nav, profileKey, pkParam, location.pathname, location.search]
  );

  // ✅ resolve profileKey + label
  useEffect(() => {
    const pk = normPk(pkParam) || normPk(getActiveProfileKeyWeb());
    setProfileKey(pk || null);

    // optional label: if you have a registry, wire it here.
    // for now keep "Owner".
    setOwnerLabel("Owner");

    setProfileReady(true);
  }, [pkParam]);

  const sortedAlbums = useMemo(() => {
    const copy = [...albums];
    copy.sort((a, b) => String(a.title || "").localeCompare(String(b.title || "")));
    return copy;
  }, [albums]);

  const loadCatalog = useCallback(async () => {
    if (!profileKey) return;

    setLoading(true);
    try {
      const res = await ownerFetch("/api/owner/music/catalog", { profileKey });
      const data = await safeJson(res);

      if (!res.ok) {
        const msg = data?.error || "Failed to load catalog";
        if (isUnauthorizedMessage(msg)) {
          goOwnerLogin(profileKey);
          return;
        }
        throw new Error(msg);
      }

      setStats(data.stats || { albumCount: 0, trackCount: 0 });
      setAlbums(Array.isArray(data.albums) ? data.albums : []);
      setTracks(Array.isArray(data.tracks) ? data.tracks : []);
    } catch (e) {
      console.error("OwnerMusicPage load error:", e);
      alert(e?.message || "Unable to load catalog.");
    } finally {
      setLoading(false);
    }
  }, [profileKey, goOwnerLogin]);

  useEffect(() => {
    if (!profileReady || !profileKey) return;
    loadCatalog();
  }, [profileReady, profileKey, loadCatalog]);

  // ---------------- Albums ----------------
  const openNewAlbum = () => {
    setEditingAlbum(null);
    setAlbumTitle("");
    setAlbumPrice("");
    setAlbumCoverImageUrl("");
    setAlbumCoverImageKey("");
    setAlbumOpen(true);
  };

  const openEditAlbum = (a) => {
    setEditingAlbum(a);
    setAlbumTitle(a?.title || "");
    setAlbumPrice(typeof a?.priceCents === "number" ? (a.priceCents / 100).toFixed(2) : "");
    setAlbumCoverImageUrl(a?.coverImageUrl || "");
    setAlbumCoverImageKey(a?.coverImageKey || "");
    setAlbumOpen(true);
  };

  const saveAlbum = async () => {
    if (!profileKey) return;

    const title = String(albumTitle || "").trim();
    if (!title) return alert("Missing title");

    const priceCents = toPriceCents(albumPrice);
    if (priceCents === null) return alert("Enter a valid price in dollars.");

    const payload = {
      title,
      priceCents,
      coverImageKey: albumCoverImageKey || null,
      coverImageUrl: albumCoverImageUrl || null,
    };

    setSavingAlbum(true);
    try {
      let url = "/api/owner/music/albums";
      let method = "POST";
      if (editingAlbum?._id) {
        url = `/api/owner/music/albums/${editingAlbum._id}`;
        method = "PUT";
      }

      const res = await ownerFetch(url, {
        profileKey,
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await safeJson(res);

      if (!res.ok) {
        const msg = data?.error || "Failed to save album";
        if (isUnauthorizedMessage(msg)) return goOwnerLogin(profileKey);
        throw new Error(msg);
      }

      await loadCatalog();
      setAlbumOpen(false);
    } catch (e) {
      console.error("saveAlbum error:", e);
      alert(e?.message || "Could not save album.");
    } finally {
      setSavingAlbum(false);
    }
  };

  const deleteAlbum = async () => {
    if (!editingAlbum?._id) return;
    if (!confirm(`Delete album "${editingAlbum.title}"? Tracks will become singles.`)) return;

    try {
      const res = await ownerFetch(`/api/owner/music/albums/${editingAlbum._id}`, {
        profileKey,
        method: "DELETE",
      });
      const data = await safeJson(res);

      if (!res.ok) {
        const msg = data?.error || "Failed to delete album";
        if (isUnauthorizedMessage(msg)) return goOwnerLogin(profileKey);
        throw new Error(msg);
      }

      await loadCatalog();
      setAlbumOpen(false);
    } catch (e) {
      console.error("deleteAlbum error:", e);
      alert(e?.message || "Could not delete album.");
    }
  };

  const pickAndUploadAlbumArtwork = async (file) => {
    if (!file) return;
    if (!profileKey) return;

    setUploadingAlbumArtwork(true);
    try {
      const uploadRes = await ownerFetch("/api/owner/music/upload-url", {
        profileKey,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name || "album-cover.jpg", contentType: file.type || "image/jpeg" }),
      });
      const uploadData = await safeJson(uploadRes);

      if (!uploadRes.ok) {
        const msg = uploadData?.error || "Failed to get artwork upload URL.";
        if (isUnauthorizedMessage(msg)) return goOwnerLogin(profileKey);
        throw new Error(msg);
      }

      if (!uploadData?.uploadUrl || !uploadData?.key) throw new Error("Upload URL response missing uploadUrl/key");

      await s3PutUpload({ uploadUrl: uploadData.uploadUrl, file, contentType: file.type });

      setAlbumCoverImageKey(uploadData.key);
      setAlbumCoverImageUrl(uploadData.publicUrl || URL.createObjectURL(file));
      alert("Album artwork uploaded.");
    } catch (e) {
      console.error("album artwork upload error:", e);
      alert(e?.message || "Could not upload artwork.");
    } finally {
      setUploadingAlbumArtwork(false);
    }
  };

  // ---------------- Tracks ----------------
  const openNewTrack = () => {
    setEditingTrack(null);
    setFormTitle("");
    setFormPrice("");
    setFormDuration("");
    setFormPreviewSeconds("30");
    setFormS3KeyPreview("");
    setFormS3KeyFull("");
    setFormCoverImageUrl("");
    setFormCoverImageKey("");

    setFormAlbumId(sortedAlbums?.[0]?._id || "");
    setTrackOpen(true);
  };

  const openEditTrack = (t) => {
    const artworkUrl = t.coverImageUrl || t.albumCoverImageUrl || "";
    setEditingTrack(t);

    setFormTitle(t?.title || "");
    setFormPrice(typeof t?.priceCents === "number" ? (t.priceCents / 100).toFixed(2) : "");
    setFormDuration(typeof t?.durationSeconds === "number" ? String(t.durationSeconds) : "");
    setFormPreviewSeconds(typeof t?.previewSeconds === "number" ? String(t.previewSeconds) : "30");
    setFormAlbumId(t?.albumId || "");
    setFormS3KeyPreview(t?.s3KeyPreview || "");
    setFormS3KeyFull(t?.s3KeyFull || "");

    setFormCoverImageUrl(artworkUrl);
    setFormCoverImageKey(t?.coverImageKey || "");

    setTrackOpen(true);
  };

  const saveTrack = async () => {
    if (!profileKey) return;

    const title = String(formTitle || "").trim();
    if (!title) return alert("Missing track title");

    const durationNum = parseInt(formDuration, 10);
    if (!Number.isFinite(durationNum) || durationNum <= 0) return alert("Enter duration in seconds (e.g. 240)");

    const priceCents = toPriceCents(formPrice);
    if (priceCents === null) return alert("Enter a valid price in dollars.");

    const previewNum = parseInt(formPreviewSeconds, 10);
    const previewSecondsValid = Number.isFinite(previewNum) && previewNum > 0 ? previewNum : 30;

    const payload = {
      title,
      durationSeconds: durationNum,
      priceCents,
      previewSeconds: previewSecondsValid,
      albumId: formAlbumId || null,
      s3KeyPreview: String(formS3KeyPreview || "").trim() || null,
      s3KeyFull: String(formS3KeyFull || "").trim() || null,
      coverImageKey: formCoverImageKey || null,
      coverImageUrl: formCoverImageUrl || null,
    };

    setSavingTrack(true);
    try {
      let url = "/api/owner/music/tracks";
      let method = "POST";
      if (editingTrack?._id) {
        url = `/api/owner/music/tracks/${editingTrack._id}`;
        method = "PUT";
      }

      const res = await ownerFetch(url, {
        profileKey,
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await safeJson(res);

      if (!res.ok) {
        const msg = data?.error || "Failed to save track";
        if (isUnauthorizedMessage(msg)) return goOwnerLogin(profileKey);
        throw new Error(msg);
      }

      await loadCatalog();
      setTrackOpen(false);
    } catch (e) {
      console.error("saveTrack error:", e);
      alert(e?.message || "Could not save track.");
    } finally {
      setSavingTrack(false);
    }
  };

  const deleteTrack = async () => {
    if (!editingTrack?._id) return;
    if (!confirm(`Delete track "${editingTrack.title}"?`)) return;

    try {
      const res = await ownerFetch(`/api/owner/music/tracks/${editingTrack._id}`, {
        profileKey,
        method: "DELETE",
      });
      const data = await safeJson(res);

      if (!res.ok) {
        const msg = data?.error || "Failed to delete track";
        if (isUnauthorizedMessage(msg)) return goOwnerLogin(profileKey);
        throw new Error(msg);
      }

      await loadCatalog();
      setTrackOpen(false);
    } catch (e) {
      console.error("deleteTrack error:", e);
      alert(e?.message || "Could not delete track.");
    }
  };

  const pickAndUploadTrackArtwork = async (file) => {
    if (!file) return;
    if (!profileKey) return;

    setUploadingTrackArtwork(true);
    try {
      const uploadRes = await ownerFetch("/api/owner/music/upload-url", {
        profileKey,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name || "cover.jpg", contentType: file.type || "image/jpeg" }),
      });
      const uploadData = await safeJson(uploadRes);

      if (!uploadRes.ok) {
        const msg = uploadData?.error || "Failed to get artwork upload URL.";
        if (isUnauthorizedMessage(msg)) return goOwnerLogin(profileKey);
        throw new Error(msg);
      }

      if (!uploadData?.uploadUrl || !uploadData?.key) throw new Error("Upload URL response missing uploadUrl/key");

      await s3PutUpload({ uploadUrl: uploadData.uploadUrl, file, contentType: file.type });

      setFormCoverImageKey(uploadData.key);
      setFormCoverImageUrl(uploadData.publicUrl || URL.createObjectURL(file));
      alert("Artwork uploaded.");
    } catch (e) {
      console.error("track artwork upload error:", e);
      alert(e?.message || "Could not upload artwork.");
    } finally {
      setUploadingTrackArtwork(false);
    }
  };

  const pickAndUploadFullAudio = async (file) => {
    if (!file) return;
    if (!profileKey) return;

    setUploadingFull(true);
    try {
      const uploadRes = await ownerFetch("/api/owner/music/upload-url", {
        profileKey,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name || "track.m4a", contentType: file.type || "audio/m4a" }),
      });
      const uploadData = await safeJson(uploadRes);

      if (!uploadRes.ok) {
        const msg = uploadData?.error || "Failed to get upload URL.";
        if (isUnauthorizedMessage(msg)) return goOwnerLogin(profileKey);
        throw new Error(msg);
      }

      if (!uploadData?.uploadUrl || !uploadData?.key) throw new Error("Upload URL response missing uploadUrl/key");

      await s3PutUpload({ uploadUrl: uploadData.uploadUrl, file, contentType: file.type });

      setFormS3KeyFull(uploadData.key);
      setFormS3KeyPreview((prev) => prev || uploadData.key);
      alert("Upload complete. Full key set (and preview key set if empty).");
    } catch (e) {
      console.error("full upload error:", e);
      alert(e?.message || "Could not upload audio.");
    } finally {
      setUploadingFull(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="opage">
      <div className="oheader">
        <button className="oiconBtn" onClick={() => nav(-1)} title="Back">
          ✕
        </button>

        <div className="oheaderCenter">
          <div className="otitle">{OWNER_LABEL} Music</div>
          <div className="osubtitle">
            Manage your catalog & pricing{profileKey ? ` • ${profileKey}` : ""}
          </div>
        </div>

        <div className="ochip">
          <span className="ochipDot" />
          <span>{stats.trackCount} tracks</span>
        </div>
      </div>

      {!profileKey ? (
        <div className="obox warn">
          Missing profileKey for this page. Use /owner/:profileKey/music or set localStorage.activeProfileKey
        </div>
      ) : loading ? (
        <div className="oload">
          <div className="ospin" />
          <div className="oloadTxt">Loading catalog…</div>
        </div>
      ) : (
        <>
          <div className="ostats">
            <div className="ostat">
              <div className="ostatNum">{stats.albumCount}</div>
              <div className="ostatLabel">Albums</div>
            </div>
            <div className="ostat">
              <div className="ostatNum">{stats.trackCount}</div>
              <div className="ostatLabel">Tracks</div>
            </div>
            <div className="oactions">
              <button className="oactBtn" onClick={openNewAlbum} title="New album">
                ＋ Album
              </button>
              <button className="oactBtn" onClick={openNewTrack} title="New track">
                ＋ Track
              </button>
            </div>
          </div>

          <div className="osection">
            <div className="osecTitle">Albums</div>

            {sortedAlbums.length === 0 ? (
              <div className="oempty">No albums yet. Create one above.</div>
            ) : (
              <div className="ogrid">
                {sortedAlbums.map((a) => (
                  <button key={a._id} className="ocard" onClick={() => openEditAlbum(a)}>
                    <div className="ocardRow">
                      <div className="ocover">
                        {a.coverImageUrl ? <img src={a.coverImageUrl} alt="" /> : <div className="ocoverPh">♫</div>}
                      </div>
                      <div className="oflex1">
                        <div className="ocardTitle">{a.title}</div>
                        <div className="ocardMeta">{a.trackCount || 0} tracks</div>
                      </div>
                      <div className="oright">
                        <div className="oprice">{moneyFromCents(a.priceCents)}</div>
                        <div className="oedit">Edit</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="osection">
            <div className="osecTitle">Tracks</div>

            {tracks.length === 0 ? (
              <div className="oempty">No tracks yet. Create one above.</div>
            ) : (
              <div className="olist">
                {tracks.map((t) => {
                  const artworkUrl = t.coverImageUrl || t.albumCoverImageUrl || "";
                  return (
                    <button key={t._id} className="orow" onClick={() => openEditTrack(t)}>
                      <div className="orowLeft">
                        <div className="obubble">
                          {artworkUrl ? <img src={artworkUrl} alt="" /> : <span>♪</span>}
                        </div>
                        <div className="oflex1">
                          <div className="orowTitle">{t.title}</div>
                          <div className="orowMeta">
                            {t.albumTitle || "Single"} • {Math.round((t.durationSeconds || 0) / 60)} min • Preview:{" "}
                            {t.previewSeconds || 30}s
                          </div>
                          {(t.s3KeyFull || t.s3KeyPreview) && (
                            <div className="orowS3">
                              {t.s3KeyPreview || "no preview key"} | {t.s3KeyFull || "no full key"}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="orowRight">
                        <div className="oprice">{moneyFromCents(t.priceCents)}</div>
                        <div className="oedit">Edit</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* TRACK MODAL */}
      <ModalShell
        open={trackOpen}
        title={editingTrack ? "Edit Track" : "New Track"}
        onClose={() => {
          if (savingTrack || uploadingFull || uploadingTrackArtwork) return;
          setTrackOpen(false);
        }}
        footer={
          <div className="omodalFootRow">
            {editingTrack ? (
              <button className="odanger" onClick={deleteTrack} disabled={savingTrack || uploadingFull || uploadingTrackArtwork}>
                Delete
              </button>
            ) : (
              <div />
            )}
            <div className="oflex1" />
            <button
              className="osecond"
              onClick={() => setTrackOpen(false)}
              disabled={savingTrack || uploadingFull || uploadingTrackArtwork}
            >
              Cancel
            </button>
            <button className="oprimary" onClick={saveTrack} disabled={savingTrack || uploadingFull || uploadingTrackArtwork}>
              {savingTrack ? "Saving…" : "Save"}
            </button>
          </div>
        }
      >
        <div className="oform">
          <label className="olabel">Title</label>
          <input className="oinput" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Track title" />

          <div className="orow2">
            <div>
              <label className="olabel">Price (USD)</label>
              <input className="oinput" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} placeholder="1.99" />
            </div>
            <div>
              <label className="olabel">Duration (seconds)</label>
              <input className="oinput" value={formDuration} onChange={(e) => setFormDuration(e.target.value)} placeholder="240" />
            </div>
          </div>

          <label className="olabel">Preview length (seconds)</label>
          <input className="oinput" value={formPreviewSeconds} onChange={(e) => setFormPreviewSeconds(e.target.value)} placeholder="30" />

          <label className="olabel">Album (optional)</label>
          <div className="ochips">
            <button className={`ochipBtn ${!formAlbumId ? "active" : ""}`} onClick={() => setFormAlbumId("")}>
              Single
            </button>
            {sortedAlbums.map((a) => (
              <button
                key={a._id}
                className={`ochipBtn ${formAlbumId === a._id ? "active" : ""}`}
                onClick={() => setFormAlbumId(a._id)}
              >
                {a.title}
              </button>
            ))}
          </div>

          <label className="olabel">Artwork (optional)</label>
          <div className="ouploadRow">
            <div className="oprev">
              {formCoverImageUrl ? <img src={formCoverImageUrl} alt="" /> : <div className="oprevPh">IMG</div>}
            </div>
            <label className={`ouploadBtn ${uploadingTrackArtwork ? "disabled" : ""}`}>
              {uploadingTrackArtwork ? "Uploading…" : "Upload Artwork"}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                disabled={uploadingTrackArtwork}
                onChange={(e) => pickAndUploadTrackArtwork(e.target.files?.[0])}
              />
            </label>
          </div>

          <label className="olabel">S3 key (preview – optional)</label>
          <input
            className="oinput"
            value={formS3KeyPreview}
            onChange={(e) => setFormS3KeyPreview(e.target.value)}
            placeholder="tracks/02-deep1-preview.m4a"
          />

          <label className="olabel">S3 key (full track)</label>
          <div className="ouploadRow">
            <input
              className="oinput"
              value={formS3KeyFull}
              onChange={(e) => setFormS3KeyFull(e.target.value)}
              placeholder="tracks/02-deep1.m4a"
            />
            <label className={`ouploadBtn ${uploadingFull ? "disabled" : ""}`}>
              {uploadingFull ? "Uploading…" : "Upload Audio"}
              <input
                type="file"
                accept="audio/*"
                style={{ display: "none" }}
                disabled={uploadingFull}
                onChange={(e) => pickAndUploadFullAudio(e.target.files?.[0])}
              />
            </label>
          </div>
        </div>
      </ModalShell>

      {/* ALBUM MODAL */}
      <ModalShell
        open={albumOpen}
        title={editingAlbum ? "Edit Album" : "New Album"}
        onClose={() => {
          if (savingAlbum || uploadingAlbumArtwork) return;
          setAlbumOpen(false);
        }}
        footer={
          <div className="omodalFootRow">
            {editingAlbum ? (
              <button className="odanger" onClick={deleteAlbum} disabled={savingAlbum || uploadingAlbumArtwork}>
                Delete
              </button>
            ) : (
              <div />
            )}
            <div className="oflex1" />
            <button className="osecond" onClick={() => setAlbumOpen(false)} disabled={savingAlbum || uploadingAlbumArtwork}>
              Cancel
            </button>
            <button className="oprimary" onClick={saveAlbum} disabled={savingAlbum || uploadingAlbumArtwork}>
              {savingAlbum ? "Saving…" : "Save"}
            </button>
          </div>
        }
      >
        <div className="oform">
          <label className="olabel">Album title</label>
          <input className="oinput" value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} placeholder="Album title" />

          <label className="olabel">Price (USD)</label>
          <input className="oinput" value={albumPrice} onChange={(e) => setAlbumPrice(e.target.value)} placeholder="9.99" />

          <label className="olabel">Album artwork</label>
          <div className="ouploadRow">
            <div className="oprev">
              {albumCoverImageUrl ? <img src={albumCoverImageUrl} alt="" /> : <div className="oprevPh">IMG</div>}
            </div>
            <label className={`ouploadBtn ${uploadingAlbumArtwork ? "disabled" : ""}`}>
              {uploadingAlbumArtwork ? "Uploading…" : "Upload Artwork"}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                disabled={uploadingAlbumArtwork}
                onChange={(e) => pickAndUploadAlbumArtwork(e.target.files?.[0])}
              />
            </label>
          </div>
        </div>
      </ModalShell>

      {/* Styles */}
      <style>{styles}</style>
    </div>
  );
}

const styles = `
.opage{
  min-height:100vh;
  padding:18px;
  background: radial-gradient(1200px 600px at 20% 0%, rgba(34,211,238,.12), transparent 60%),
              radial-gradient(900px 500px at 80% 10%, rgba(99,102,241,.10), transparent 55%),
              linear-gradient(180deg, #050509, #0b0b14 65%, #151521);
  color:#e5e7eb;
}
.oheader{
  display:flex; align-items:center; gap:12px;
  margin-bottom:14px;
}
.oiconBtn{
  width:34px; height:34px; border-radius:999px;
  border:1px solid rgba(255,255,255,.18);
  background: rgba(2,6,23,.25);
  color:#fff; cursor:pointer;
}
.oheaderCenter{ flex:1; }
.otitle{ font-size:18px; font-weight:800; letter-spacing:.3px; }
.osubtitle{ font-size:12px; color:#9ca3af; margin-top:3px; }

.ochip{
  display:flex; align-items:center; gap:8px;
  padding:8px 12px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.12);
  background: rgba(2,6,23,.25);
  font-size:12px;
}
.ochipDot{ width:8px; height:8px; border-radius:999px; background:#22d3ee; box-shadow:0 0 18px rgba(34,211,238,.55); }

.obox{
  border:1px solid rgba(255,255,255,.12);
  background: rgba(2,6,23,.30);
  border-radius:14px;
  padding:12px;
}
.obox.warn{ border-color: rgba(248,113,113,.6); color:#fecaca; }

.oload{ margin-top:40px; display:flex; flex-direction:column; align-items:center; gap:10px; }
.ospin{
  width:26px; height:26px; border-radius:999px;
  border:2px solid rgba(255,255,255,.18);
  border-top-color:#22d3ee;
  animation: spin 1s linear infinite;
}
@keyframes spin{ to { transform: rotate(360deg); } }
.oloadTxt{ color:#9ca3af; font-size:13px; }

.ostats{
  display:flex; align-items:center; gap:12px;
  border:1px solid rgba(255,255,255,.10);
  background: rgba(2,6,23,.28);
  border-radius:18px;
  padding:12px;
  margin: 14px 0 16px;
  backdrop-filter: blur(10px);
}
.ostat{ min-width:110px; }
.ostatNum{ font-size:18px; font-weight:900; color:#fff; }
.ostatLabel{ font-size:11px; color:#9ca3af; margin-top:2px; }
.oactions{ margin-left:auto; display:flex; gap:10px; }
.oactBtn{
  border-radius:999px;
  border:1px solid rgba(34,211,238,.55);
  background: rgba(34,211,238,.10);
  color:#e0f2fe;
  padding:8px 12px;
  font-weight:800;
  cursor:pointer;
}

.osection{ margin-top:14px; }
.osecTitle{ font-size:14px; font-weight:900; letter-spacing:.4px; margin: 10px 0 10px; }
.oempty{ color:#9ca3af; font-style:italic; font-size:12px; }

.ogrid{ display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:10px; }
.ocard{
  border-radius:18px;
  border:1px solid rgba(255,255,255,.08);
  background: rgba(2,6,23,.28);
  padding:10px;
  color:inherit;
  text-align:left;
  cursor:pointer;
}
.ocardRow{ display:flex; align-items:center; gap:10px; }
.ocover{ width:54px; height:54px; border-radius:14px; overflow:hidden; border:1px solid rgba(34,211,238,.25); background: rgba(15,23,42,.6); display:flex; align-items:center; justify-content:center; }
.ocover img{ width:100%; height:100%; object-fit:cover; }
.ocoverPh{ color:#22d3ee; font-weight:900; }
.oflex1{ flex:1; }
.ocardTitle{ font-weight:800; color:#fff; }
.ocardMeta{ font-size:11px; color:#9ca3af; margin-top:2px; }
.oright{ text-align:right; display:flex; flex-direction:column; align-items:flex-end; gap:4px; }
.oprice{ font-weight:800; color:#fff; }
.oedit{ font-size:11px; color:#9ca3af; }

.olist{ display:flex; flex-direction:column; gap:10px; }
.orow{
  display:flex; align-items:center; justify-content:space-between;
  border-radius:18px;
  border:1px solid rgba(255,255,255,.06);
  background: rgba(2,6,23,.25);
  padding:10px;
  color:inherit;
  text-align:left;
  cursor:pointer;
}
.orowLeft{ display:flex; align-items:center; gap:10px; flex:1; }
.obubble{
  width:42px; height:42px; border-radius:999px;
  overflow:hidden;
  border:1px solid rgba(34,211,238,.55);
  background: rgba(15,23,42,.6);
  display:flex; align-items:center; justify-content:center;
}
.obubble img{ width:100%; height:100%; object-fit:cover; }
.orowTitle{ font-weight:800; color:#fff; }
.orowMeta{ font-size:11px; color:#9ca3af; margin-top:2px; }
.orowS3{ font-size:10px; color:#4ade80; margin-top:2px; }
.orowRight{ display:flex; flex-direction:column; align-items:flex-end; gap:6px; margin-left:12px; }

.omodalBack{
  position:fixed; inset:0;
  background: rgba(2,6,23,.72);
  display:flex; align-items:center; justify-content:center;
  padding:16px;
  z-index:50;
}
.omodalCard{
  width:min(860px, 100%);
  max-height: 90vh;
  overflow:auto;
  border-radius:22px;
  border:1px solid rgba(148,163,184,.6);
  background: rgba(2,6,23,.55);
  backdrop-filter: blur(12px);
  box-shadow: 0 24px 80px rgba(0,0,0,.55);
}
.omodalHeader{
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 14px 8px;
}
.omodalTitle{ font-weight:900; letter-spacing:.3px; }
.omodalBody{ padding: 10px 14px 12px; }
.omodalFooter{ padding: 10px 14px 14px; border-top: 1px solid rgba(255,255,255,.06); }
.omodalFootRow{ display:flex; align-items:center; gap:10px; }

.oform{ display:flex; flex-direction:column; gap:8px; }
.olabel{ font-size:12px; color:#9ca3af; }
.oinput{
  border-radius:12px;
  border:1px solid rgba(148,163,184,.6);
  background: rgba(15,23,42,.45);
  color:#f9fafb;
  padding:10px 10px;
  outline:none;
}
.orow2{ display:grid; grid-template-columns: 1fr 1fr; gap:10px; }

.ochips{ display:flex; flex-wrap:wrap; gap:8px; margin-top:2px; }
.ochipBtn{
  border-radius:999px;
  border:1px solid rgba(148,163,184,.6);
  background: transparent;
  color:#cbd5e1;
  padding:6px 10px;
  cursor:pointer;
  font-size:12px;
}
.ochipBtn.active{
  border-color: rgba(34,211,238,.75);
  background: rgba(34,211,238,.10);
  color:#e0f2fe;
  font-weight:800;
}

.ouploadRow{ display:flex; align-items:center; gap:10px; }
.oprev{
  width:64px; height:64px; border-radius:14px;
  border:1px solid rgba(148,163,184,.6);
  background: rgba(15,23,42,.55);
  overflow:hidden;
  display:flex; align-items:center; justify-content:center;
}
.oprev img{ width:100%; height:100%; object-fit:cover; }
.oprevPh{ font-size:12px; color:#9ca3af; font-weight:800; }

.ouploadBtn{
  border-radius:999px;
  border:1px solid rgba(34,211,238,.55);
  background: rgba(34,211,238,.10);
  color:#e0f2fe;
  padding:8px 12px;
  cursor:pointer;
  font-weight:900;
  font-size:12px;
  user-select:none;
}
.ouploadBtn.disabled{ opacity:.65; cursor:not-allowed; }

.osecond{
  border-radius:999px;
  border:1px solid rgba(148,163,184,.6);
  background: transparent;
  color:#e5e7eb;
  padding:8px 12px;
  cursor:pointer;
}
.oprimary{
  border-radius:999px;
  border:1px solid rgba(34,211,238,.75);
  background: rgba(34,211,238,.85);
  color:#0f172a;
  padding:8px 14px;
  cursor:pointer;
  font-weight:900;
}
.odanger{
  border-radius:999px;
  border:1px solid rgba(248,113,113,.75);
  background: rgba(248,113,113,.12);
  color:#fecaca;
  padding:8px 12px;
  cursor:pointer;
  font-weight:900;
}
`;
