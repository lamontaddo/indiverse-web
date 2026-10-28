
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getProfileByKey } from "../services/profileRegistry";
import {
  normalizeProfileKey,
  ownerJsonWeb,
} from "../utils/ownerApi.web";

const initialForm = {
  title: "",
  author: "",
  description: "",
  price: "",
  isFree: false,
  status: "draft",
};

function formatPrice(cents) {
  const value = Number(cents || 0);
  return value === 0 ? "Free" : `$${(value / 100).toFixed(2)}`;
}

function formFromBook(book) {
  const cents = Number(book.priceCents || 0);
  return {
    title: book.title || "",
    author: book.author || "",
    description: book.description || "",
    price: cents > 0 ? (cents / 100).toFixed(2) : "",
    isFree: cents === 0,
    status: book.isPublished ? "published" : "draft",
  };
}

function cleanFilename(name) {
  return String(name || "book-file")
    .split(/[\\/]/)
    .pop()
    .replace(/[^\w.\- ]/g, "_")
    .slice(0, 180);
}

export default function OwnerBooksPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profileKey: routeProfileKey } = useParams();

  const [profileKey, setProfileKey] = useState("");
  const [ownerLabel, setOwnerLabel] = useState("Owner");
  const [accent, setAccent] = useState("#22d3ee");

  const [books, setBooks] = useState([]);
  const [coverUrls, setCoverUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [uploadStep, setUploadStep] = useState("");

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [form, setForm] = useState(initialForm);

  const [coverFile, setCoverFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");

  // Match ownerApi.web.js environment selection.
  const apiBase =
    ["localhost", "127.0.0.1"].includes(window.location.hostname)
      ? "http://localhost:5050"
      : (
          import.meta.env.VITE_API_BASE_URL ||
          "https://indiverse-backend.onrender.com"
        ).replace(/\/$/, "");

  useEffect(() => {
    let storedKey = "";
    try {
      storedKey = localStorage.getItem("profileKey") || "";
    } catch {
      // Storage unavailable
    }

    const key =
      normalizeProfileKey(routeProfileKey) ||
      normalizeProfileKey(storedKey);

    setProfileKey(key);

    const profile = key ? getProfileByKey(key) : null;

    setOwnerLabel(
      profile?.label || profile?.brandTopTitle || "Owner"
    );
    setAccent(profile?.accent || "#22d3ee");
  }, [routeProfileKey]);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreview("");
      return;
    }

    const url = URL.createObjectURL(coverFile);
    setCoverPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const handleApiError = useCallback(
    (err) => {
      if (err?.code === "OWNER_UNAUTHORIZED") {
        const next = encodeURIComponent(
          `/world/${profileKey}/owner/books`
        );
        navigate(
          `/world/${profileKey}/owner/login?next=${next}`,
          { replace: true }
        );
        return;
      }

      setError(err?.message || "Something went wrong.");
    },
    [navigate, profileKey]
  );

  const refreshCover = useCallback(
    async (book) => {
      if (!book?.coverImageKey || !profileKey) return;

      try {
        const data = await ownerJsonWeb(
          `/api/owner/books/${book._id}/cover-url`,
          { profileKey }
        );

        if (data?.url) {
          setCoverUrls((prev) => ({
            ...prev,
            [book._id]: data.url,
          }));
        }
      } catch (err) {
        console.warn("Cover preview unavailable:", err.message);
      }
    },
    [profileKey]
  );

  const loadBooks = useCallback(async () => {
    if (!profileKey) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const data = await ownerJsonWeb("/api/owner/books", {
        profileKey,
      });

      const nextBooks = Array.isArray(data.books)
        ? data.books
        : [];

      setBooks(nextBooks);

      await Promise.all(
        nextBooks
          .filter((book) => book.coverImageKey)
          .map(refreshCover)
      );
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  }, [profileKey, handleApiError, refreshCover]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openNewBook = () => {
    setEditingBook(null);
    setForm({ ...initialForm });
    setCoverFile(null);
    setPdfFile(null);
    setError("");
    setNotice("");
    setUploadStep("");
    setEditorOpen(true);
  };

  const openEditBook = (book) => {
    setEditingBook(book);
    setForm(formFromBook(book));
    setCoverFile(null);
    setPdfFile(null);
    setError("");
    setNotice("");
    setUploadStep("");
    setEditorOpen(true);
  };

  const closeEditor = () => {
    if (saving) return;
    setEditorOpen(false);
    setEditingBook(null);
    setCoverFile(null);
    setPdfFile(null);
    setUploadStep("");
  };

  const validateBook = () => {
    if (!form.title.trim()) return "Enter a book title.";
    if (!form.author.trim()) return "Enter an author.";

    if (!form.isFree) {
      const raw = form.price.trim();

      if (!/^\d+(\.\d{1,2})?$/.test(raw) || Number(raw) <= 0) {
        return "Enter a valid price with no more than two decimal places.";
      }
    }

    if (form.status === "published") {
      if (!editingBook?.hasPdf && !pdfFile) {
        return "Choose a PDF before publishing.";
      }
      if (!editingBook?.coverImageKey && !coverFile) {
        return "Choose a cover before publishing.";
      }
    }

    return null;
  };

  // Upload to S3 and attach the verified file to the book.
  const uploadFile = async (bookId, kind, file) => {
    const isPdf = kind === "pdf";
    const contentType = isPdf
      ? "application/pdf"
      : file.type === "image/jpg"
      ? "image/jpeg"
      : file.type;

    const maxBytes = isPdf
      ? 100 * 1024 * 1024
      : 10 * 1024 * 1024;

    if (!file.size || file.size > maxBytes) {
      throw new Error(
        `${isPdf ? "PDF" : "Cover"} must be between 1 byte and ${
          maxBytes / 1024 / 1024
        } MB.`
      );
    }

    if (isPdf && !file.name.toLowerCase().endsWith(".pdf")) {
      throw new Error("Please select a .pdf file.");
    }

    if (
      !isPdf &&
      !["image/jpeg", "image/png", "image/webp"].includes(
        contentType
      )
    ) {
      throw new Error("Cover must be JPG, PNG, or WebP.");
    }

    setUploadStep(
      `Preparing ${isPdf ? "PDF" : "cover"} upload...`
    );

    const signed = await ownerJsonWeb(
      "/api/owner/books/upload-url",
      {
        profileKey,
        method: "POST",
        body: JSON.stringify({
          bookId,
          kind,
          filename: file.name,
          contentType,
          sizeBytes: file.size,
        }),
      }
    );

    if (!signed?.uploadUrl || !signed?.key) {
      throw new Error("Server did not return an S3 upload URL.");
    }

    setUploadStep(
      `Uploading ${isPdf ? "PDF" : "cover"} to S3...`
    );

    // Signed headers must match the backend's PutObjectCommand.
    const uploadHeaders = {
      "Content-Type": contentType,
      "x-amz-meta-book-id": bookId,
      "x-amz-meta-profile-key": profileKey,
      "x-amz-meta-original-filename":
        encodeURIComponent(cleanFilename(file.name)),
    };

    let uploadResponse;

    try {
      uploadResponse = await fetch(signed.uploadUrl, {
        method: "PUT",
        headers: uploadHeaders,
        body: file,
      });
    } catch (err) {
      throw new Error(
        `Could not connect to S3: ${err.message}. Check the browser Network tab for a CORS or network error.`
      );
    }

    if (!uploadResponse.ok) {
      const details = (await uploadResponse.text()).slice(
        0,
        400
      );

      throw new Error(
        `S3 upload failed (HTTP ${uploadResponse.status}): ${details}`
      );
    }

    setUploadStep(
      `Verifying ${isPdf ? "PDF" : "cover"} in S3...`
    );

    const attached = await ownerJsonWeb(
      `/api/owner/books/${bookId}/${
        isPdf ? "attach-pdf" : "attach-cover"
      }`,
      {
        profileKey,
        method: "POST",
        body: JSON.stringify({
          key: signed.key,
          filename: file.name,
          sizeBytes: file.size,
        }),
      }
    );

    if (!attached?.book) {
      throw new Error(
        "S3 upload succeeded, but the book attachment failed."
      );
    }

    return attached.book;
  };

  const handleSave = async () => {
    const validationError = validateBook();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!profileKey || saving) return;

    setSaving(true);
    setError("");
    setNotice("");
    setUploadStep("");

    const priceCents = form.isFree
      ? 0
      : Math.round(Number(form.price) * 100);

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      description: form.description.trim(),
      priceCents,
    };

    try {
      let data;

      // Save metadata as a draft first so the book has an ID.
      if (editingBook) {
        data = await ownerJsonWeb(
          `/api/owner/books/${editingBook._id}`,
          {
            profileKey,
            method: "PATCH",
            body: JSON.stringify({
              ...payload,
              isPublished: false,
            }),
          }
        );
      } else {
        data = await ownerJsonWeb("/api/owner/books", {
          profileKey,
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      let book = data?.book;

      if (!book?._id) {
        throw new Error(
          "The server did not return a saved book."
        );
      }

      // Preserve saved book ID if a subsequent upload fails.
      setEditingBook(book);

      if (coverFile) {
        book = await uploadFile(book._id, "cover", coverFile);
        setEditingBook(book);
        setCoverFile(null);
        await refreshCover(book);
      }

      if (pdfFile) {
        book = await uploadFile(book._id, "pdf", pdfFile);
        setEditingBook(book);
        setPdfFile(null);
      }

      if (form.status === "published") {
        setUploadStep("Publishing book...");

        const published = await ownerJsonWeb(
          `/api/owner/books/${book._id}`,
          {
            profileKey,
            method: "PATCH",
            body: JSON.stringify({
              isPublished: true,
            }),
          }
        );

        book = published.book;
      }

      setUploadStep("");
      setEditorOpen(false);
      setEditingBook(null);
      setCoverFile(null);
      setPdfFile(null);

      setNotice(
        form.status === "published"
          ? "Book published successfully."
          : "Book draft saved successfully."
      );

      await loadBooks();
    } catch (err) {
      setUploadStep("");
      handleApiError(err);
      await loadBooks();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (book) => {
    if (!profileKey || deletingId) return;

    const confirmed = window.confirm(
      `Delete "${book.title}"?\n\nThis will permanently remove its book record.`
    );

    if (!confirmed) return;

    setDeletingId(book._id);
    setError("");
    setNotice("");

    try {
      await ownerJsonWeb(
        `/api/owner/books/${book._id}`,
        {
          profileKey,
          method: "DELETE",
        }
      );

      setBooks((prev) =>
        prev.filter((item) => item._id !== book._id)
      );

      setNotice("Book deleted successfully.");
    } catch (err) {
      handleApiError(err);
    } finally {
      setDeletingId(null);
    }
  };

  const goBack = () => {
    navigate(
      `/world/${encodeURIComponent(profileKey)}/owner`,
      { state: location.state }
    );
  };

  const publishedCount = books.filter(
    (book) => book.isPublished
  ).length;

  return (
    <main
      className="obk-page"
      style={{ "--obk-accent": accent }}
    >
      <header className="obk-header">
        <button
          className="obk-icon-button"
          onClick={goBack}
          aria-label="Back"
        >
          ←
        </button>

        <div className="obk-header-center">
          <h1>{ownerLabel} • Books</h1>
          <p>Manage digital books & publishing</p>
        </div>

        <span className="obk-header-badge">BOOKS</span>
      </header>

      <section className="obk-content">
        <div className="obk-summary">
          <div>
            <span className="obk-stat-number">
              {books.length}
            </span>
            <span className="obk-stat-label">Books</span>
          </div>

          <div>
            <span className="obk-stat-number">
              {publishedCount}
            </span>
            <span className="obk-stat-label">
              Published
            </span>
          </div>

          <button
            className="obk-primary"
            onClick={openNewBook}
            disabled={!profileKey}
          >
            + Add Book
          </button>
        </div>

        {error && !editorOpen && (
          <div className="obk-message obk-error">
            {error}
          </div>
        )}

        {notice && (
          <div className="obk-message obk-success">
            {notice}
          </div>
        )}

        <div className="obk-section-title">
          <h2>Your Books</h2>

          <button
            className="obk-refresh"
            onClick={loadBooks}
            disabled={loading || saving}
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="obk-empty">
            <span className="obk-empty-icon">📚</span>
            <h3>Loading books...</h3>
          </div>
        ) : books.length === 0 ? (
          <div className="obk-empty">
            <span className="obk-empty-icon">📚</span>
            <h3>No books yet</h3>
            <p>
              Create your first digital book listing,
              upload a cover and PDF, then publish.
            </p>

            <button
              className="obk-secondary"
              onClick={openNewBook}
              disabled={!profileKey}
            >
              + Create Book
            </button>
          </div>
        ) : (
          <div className="obk-book-list">
            {books.map((book) => (
              <article
                className="obk-book-card"
                key={book._id}
              >
                <div className="obk-book-cover">
                  {(
                    coverUrls[book._id] ||
                    book.coverImageUrl
                  ) ? (
                    <img
                      src={
                        coverUrls[book._id] ||
                        book.coverImageUrl
                      }
                      alt={book.title}
                    />
                  ) : (
                    <span>📖</span>
                  )}
                </div>

                <div className="obk-book-info">
                  <h3>{book.title}</h3>
                  <p className="obk-book-author">
                    By {book.author}
                  </p>

                  {book.description && (
                    <p className="obk-book-description">
                      {book.description}
                    </p>
                  )}

                  <div className="obk-book-meta">
                    <span className="obk-price">
                      {formatPrice(book.priceCents)}
                    </span>

                    <span
                      className={
                        book.isPublished
                          ? "obk-status published"
                          : "obk-status draft"
                      }
                    >
                      {book.isPublished
                        ? "Published"
                        : "Draft"}
                    </span>

                    <span className="obk-file-status">
                      {book.hasPdf
                        ? "PDF attached"
                        : "PDF not uploaded"}
                    </span>

                    <span className="obk-file-status">
                      {book.coverImageKey
                        ? "Cover attached"
                        : "Cover missing"}
                    </span>
                  </div>
                </div>

                <div className="obk-book-actions">
                  <button
                    className="obk-secondary"
                    onClick={() => openEditBook(book)}
                    disabled={saving}
                  >
                    Edit
                  </button>

                  <button
                    className="obk-delete"
                    onClick={() => handleDelete(book)}
                    disabled={
                      deletingId === book._id || saving
                    }
                  >
                    {deletingId === book._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {editorOpen && (
        <div className="obk-overlay">
          <div
            className="obk-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Book editor"
          >
            <div className="obk-modal-header">
              <div>
                <h2>
                  {editingBook
                    ? "Edit Book"
                    : "New Book"}
                </h2>
                <p>
                  {editingBook
                    ? "Update your digital release"
                    : "Set up your digital release"}
                </p>
              </div>

              <button
                className="obk-icon-button"
                onClick={closeEditor}
                disabled={saving}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="obk-form">
              <label>
                Book Title
                <input
                  value={form.title}
                  onChange={(e) =>
                    updateField(
                      "title",
                      e.target.value
                    )
                  }
                  placeholder="Enter book title"
                  maxLength={250}
                  disabled={saving}
                />
              </label>

              <label>
                Author
                <input
                  value={form.author}
                  onChange={(e) =>
                    updateField(
                      "author",
                      e.target.value
                    )
                  }
                  placeholder="Author name"
                  maxLength={200}
                  disabled={saving}
                />
              </label>

              <label>
                Description
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    updateField(
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Tell readers about this book"
                  maxLength={10000}
                  disabled={saving}
                />
              </label>

              <div className="obk-price-row">
                <label>
                  Price (USD)
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    disabled={form.isFree || saving}
                    onChange={(e) =>
                      updateField(
                        "price",
                        e.target.value
                      )
                    }
                    placeholder="9.99"
                  />
                </label>

                <label className="obk-free">
                  <input
                    type="checkbox"
                    checked={form.isFree}
                    disabled={saving}
                    onChange={(e) =>
                      updateField(
                        "isFree",
                        e.target.checked
                      )
                    }
                  />
                  Free
                </label>
              </div>

              <div className="obk-upload-box">
                <label>
                  Book Cover
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    disabled={saving}
                    onChange={(e) =>
                      setCoverFile(
                        e.target.files?.[0] || null
                      )
                    }
                  />
                </label>

                {coverPreview && (
                  <img
                    className="obk-cover-preview"
                    src={coverPreview}
                    alt="Selected book cover"
                  />
                )}

                <p>
                  {coverFile
                    ? `Selected: ${coverFile.name}`
                    : editingBook?.coverImageKey
                    ? "Cover attached. Choose another image to replace it."
                    : "Choose JPG, PNG, or WebP (up to 10 MB)."}
                </p>
              </div>

              <div className="obk-upload-box">
                <label>
                  Digital Book (PDF)
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    disabled={saving}
                    onChange={(e) =>
                      setPdfFile(
                        e.target.files?.[0] || null
                      )
                    }
                  />
                </label>

                <p>
                  {pdfFile
                    ? `Selected: ${pdfFile.name}`
                    : "Choose a PDF (up to 100 MB). Stored privately in S3."}
                </p>

                {editingBook?.hasPdf && (
                  <span className="obk-file-name">
                    Existing PDF:{" "}
                    {editingBook.pdfFilename ||
                      "Attached"}
                  </span>
                )}
              </div>

              <label>
                Publishing Status
                <select
                  value={form.status}
                  onChange={(e) =>
                    updateField(
                      "status",
                      e.target.value
                    )
                  }
                  disabled={
                    saving ||
                    (!editingBook?.hasPdf && !pdfFile)
                  }
                >
                  <option value="draft">
                    Draft
                  </option>
                  <option value="published">
                    Published
                  </option>
                </select>
              </label>

              {!editingBook?.hasPdf && !pdfFile && (
                <p className="obk-publish-note">
                  Upload a PDF and cover before publishing.
                </p>
              )}

              {uploadStep && (
                <div className="obk-message obk-success">
                  {uploadStep}
                </div>
              )}

              {error && (
                <div className="obk-message obk-error">
                  {error}
                </div>
              )}
            </div>

            <div className="obk-modal-footer">
              <button
                className="obk-secondary"
                onClick={closeEditor}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="obk-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? uploadStep || "Saving..."
                  : editingBook
                  ? "Save Changes"
                  : "Create Draft"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .obk-page {
          min-height: 100vh;
          color: #e5e7eb;
          background:
            radial-gradient(1000px 550px at 20% 0%,
              rgba(34,211,238,.11), transparent 60%),
            radial-gradient(850px 500px at 85% 15%,
              rgba(99,102,241,.10), transparent 55%),
            linear-gradient(180deg,#050509,#10101c);
          font-family: ui-sans-serif,system-ui,-apple-system,
            "Segoe UI",sans-serif;
          padding: 18px;
          box-sizing: border-box;
        }

        .obk-page button { cursor: pointer; }
        .obk-page button:disabled {
          opacity: .5;
          cursor: not-allowed;
        }

        .obk-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .obk-icon-button {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 14px;
          border: 1px solid rgba(148,163,184,.28);
          background: rgba(15,23,42,.55);
          color: white;
          font-size: 18px;
        }

        .obk-header-center {
          flex: 1;
          min-width: 0;
        }

        .obk-header-center h1 {
          margin: 0;
          font-size: 18px;
          font-weight: 900;
          overflow-wrap: anywhere;
        }

        .obk-header-center p {
          margin: 4px 0 0;
          color: #9ca3af;
          font-size: 12px;
        }

        .obk-header-badge {
          border: 1px solid rgba(148,163,184,.25);
          border-radius: 999px;
          padding: 9px 12px;
          font-size: 11px;
          font-weight: 900;
          color: var(--obk-accent);
        }

        .obk-content {
          max-width: 1180px;
          margin: auto;
        }

        .obk-summary {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 16px;
          border: 1px solid rgba(148,163,184,.20);
          background: rgba(15,23,42,.45);
          border-radius: 18px;
          margin-bottom: 26px;
        }

        .obk-stat-number {
          display: block;
          color: white;
          font-size: 22px;
          font-weight: 900;
        }

        .obk-stat-label {
          color: #9ca3af;
          font-size: 11px;
        }

        .obk-primary {
          margin-left: auto;
          padding: 11px 17px;
          border-radius: 999px;
          border: 1px solid var(--obk-accent);
          background: var(--obk-accent);
          color: #07111e;
          font-weight: 900;
        }

        .obk-secondary {
          padding: 11px 17px;
          border-radius: 999px;
          border: 1px solid rgba(148,163,184,.3);
          background: rgba(15,23,42,.6);
          color: white;
          font-weight: 800;
        }

        .obk-section-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .obk-section-title h2 {
          font-size: 16px;
          margin: 0;
        }

        .obk-refresh {
          background: transparent;
          border: none;
          color: var(--obk-accent);
          font-weight: 800;
          font-size: 12px;
        }

        .obk-message {
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 16px;
          font-size: 13px;
          overflow-wrap: anywhere;
        }

        .obk-error {
          color: #fecaca;
          background: rgba(239,68,68,.12);
          border: 1px solid rgba(239,68,68,.3);
        }

        .obk-success {
          color: #86efac;
          background: rgba(34,197,94,.10);
          border: 1px solid rgba(34,197,94,.25);
        }

        .obk-empty {
          min-height: 300px;
          border: 1px solid rgba(148,163,184,.16);
          background: rgba(15,23,42,.35);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 28px;
        }

        .obk-empty-icon { font-size: 42px; }

        .obk-empty h3 {
          margin: 14px 0 6px;
          color: white;
          font-size: 20px;
        }

        .obk-empty p {
          max-width: 420px;
          color: #9ca3af;
          font-size: 13px;
          line-height: 1.7;
        }

        .obk-empty .obk-secondary {
          margin-top: 12px;
        }

        .obk-book-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .obk-book-card {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 16px;
          border-radius: 18px;
          border: 1px solid rgba(148,163,184,.20);
          background: rgba(15,23,42,.48);
        }

        .obk-book-cover {
          width: 88px;
          height: 125px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          overflow: hidden;
          background: rgba(30,41,59,.8);
          font-size: 36px;
        }

        .obk-book-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .obk-book-info {
          flex: 1;
          min-width: 0;
        }

        .obk-book-info h3 {
          margin: 0 0 5px;
          color: white;
          font-size: 16px;
        }

        .obk-book-author {
          color: #9ca3af;
          font-size: 12px;
          margin: 0 0 8px;
        }

        .obk-book-description {
          color: #cbd5e1;
          font-size: 12px;
          line-height: 1.6;
          margin: 0 0 12px;
          overflow-wrap: anywhere;
        }

        .obk-book-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }

        .obk-price {
          color: white;
          font-weight: 900;
          font-size: 13px;
        }

        .obk-status,
        .obk-file-status {
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
        }

        .obk-status.draft {
          background: rgba(148,163,184,.15);
          color: #cbd5e1;
        }

        .obk-status.published {
          background: rgba(34,197,94,.15);
          color: #86efac;
        }

        .obk-file-status {
          background: rgba(56,189,248,.1);
          color: #7dd3fc;
        }

        .obk-book-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .obk-delete {
          padding: 10px 17px;
          border-radius: 999px;
          border: 1px solid rgba(239,68,68,.3);
          background: rgba(239,68,68,.1);
          color: #fca5a5;
          font-weight: 800;
        }

        .obk-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(2,6,23,.82);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          box-sizing: border-box;
        }

        .obk-modal {
          width: min(680px,100%);
          max-height: 92dvh;
          overflow-y: auto;
          border-radius: 22px;
          border: 1px solid rgba(148,163,184,.3);
          background: #111827;
          box-shadow: 0 24px 80px rgba(0,0,0,.6);
        }

        .obk-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 20px;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }

        .obk-modal-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .obk-modal-header p {
          margin: 5px 0 0;
          color: #9ca3af;
          font-size: 12px;
        }

        .obk-form {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .obk-form label {
          display: flex;
          flex-direction: column;
          gap: 8px;
          font-size: 12px;
          font-weight: 800;
          color: #cbd5e1;
        }

        .obk-form input:not([type="checkbox"]),
        .obk-form textarea,
        .obk-form select {
          width: 100%;
          box-sizing: border-box;
          border-radius: 12px;
          border: 1px solid rgba(148,163,184,.3);
          background: rgba(2,6,23,.55);
          color: white;
          padding: 12px;
          font: inherit;
          font-size: 14px;
        }

        .obk-form input[type="file"] {
          font-size: 12px;
        }

        .obk-price-row {
          display: flex;
          align-items: end;
          gap: 18px;
        }

        .obk-price-row > label:first-child {
          flex: 1;
        }

        .obk-form .obk-free {
          flex-direction: row;
          align-items: center;
          padding-bottom: 12px;
        }

        .obk-upload-box {
          padding: 14px;
          border: 1px dashed rgba(148,163,184,.3);
          border-radius: 12px;
        }

        .obk-upload-box p {
          margin: 8px 0 0;
          font-size: 12px;
          color: #9ca3af;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .obk-cover-preview {
          display: block;
          width: 110px;
          height: 155px;
          object-fit: cover;
          border-radius: 10px;
          margin-top: 12px;
        }

        .obk-file-name {
          display: block;
          margin-top: 8px;
          color: #86efac;
          font-size: 12px;
        }

        .obk-publish-note {
          margin: 0;
          color: #fbbf24;
          font-size: 12px;
          line-height: 1.5;
        }

        .obk-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 16px 20px;
          border-top: 1px solid rgba(255,255,255,.08);
        }

        .obk-modal-footer .obk-primary {
          margin-left: 0;
        }

        @media (max-width: 600px) {
          .obk-page { padding: 12px; }

          .obk-summary {
            gap: 16px;
            flex-wrap: wrap;
          }

          .obk-summary .obk-primary {
            width: 100%;
            margin-left: 0;
          }

          .obk-book-card {
            flex-wrap: wrap;
            align-items: flex-start;
          }

          .obk-book-cover {
            width: 72px;
            height: 104px;
          }

          .obk-book-info {
            flex: 1 1 calc(100% - 100px);
          }

          .obk-book-actions {
            width: 100%;
            flex-direction: row;
          }

          .obk-book-actions button {
            flex: 1;
          }

          .obk-modal-header,
          .obk-form {
            padding: 16px;
          }

          .obk-header-badge {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
