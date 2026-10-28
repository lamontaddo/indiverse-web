
import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
  } from "react";
  import { payments } from "@square/web-sdk";
  import { useNavigate, useParams } from "react-router-dom";
  import { normalizeProfileKey } from "../utils/ownerApi.web";
  
  const API_BASE = ["localhost", "127.0.0.1"].includes(
    window.location.hostname
  )
    ? "http://localhost:5050"
    : (
        import.meta.env.VITE_API_BASE_URL ||
        "https://indiverse-backend.onrender.com"
      ).replace(/\/$/, "");
  
  const formatPrice = (cents) =>
    Number(cents || 0) === 0
      ? "Free"
      : `$${(Number(cents) / 100).toFixed(2)}`;
  
  const createCheckoutKey = () => `book_${crypto.randomUUID()}`;
  
  async function apiRequest(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  
    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error(`Server returned HTTP ${response.status}.`);
    }
  
    if (!response.ok && response.status !== 202) {
      throw new Error(data.error || data.message || "Request failed.");
    }
  
    if (data.ok === false) {
      throw new Error(data.error || "Request failed.");
    }
  
    return data;
  }
  
  export default function BooksPage() {
    const { profileKey: routeProfileKey } = useParams();
    const navigate = useNavigate();
    const profileKey = normalizeProfileKey(routeProfileKey);
  
    const [books, setBooks] = useState([]);
    const [coverUrls, setCoverUrls] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    const [ownedBookIds, setOwnedBookIds] = useState(new Set());
    const [libraryLoading, setLibraryLoading] = useState(false);
    const [bookActionBusy, setBookActionBusy] = useState("");
    const [bookActionError, setBookActionError] = useState("");
  
    const [readerBook, setReaderBook] = useState(null);
    const [readerUrl, setReaderUrl] = useState("");
    const [readerError, setReaderError] = useState("");
  
    const [checkoutBook, setCheckoutBook] = useState(null);
    const [checkoutBusy, setCheckoutBusy] = useState(false);
    const [checkoutStatus, setCheckoutStatus] = useState("");
    const [checkoutError, setCheckoutError] = useState("");
    const [checkoutAttempt, setCheckoutAttempt] = useState(null);
  
    const [squareReady, setSquareReady] = useState(false);
    const [squareError, setSquareError] = useState("");
  
    const squareCardRef = useRef(null);
    const paymentLockRef = useRef(false);
  
    const checkoutOpen = Boolean(checkoutBook);
  
    const buyerHeaders = useCallback(() => {
      const token = localStorage.getItem("buyerToken");
      if (!token) {
        throw new Error(
          "Please sign in to your indiVerse account to purchase or read books."
        );
      }
      return {
        "x-profile-key": profileKey,
        Authorization: `Bearer ${token}`,
      };
    }, [profileKey]);
  
    const loadBooks = useCallback(async () => {
      if (!profileKey) {
        setError("Artist profile is missing.");
        setLoading(false);
        return;
      }
  
      setLoading(true);
      setError("");
      setCoverUrls({});
  
      try {
        const data = await apiRequest("/api/books", {
          headers: { "x-profile-key": profileKey },
        });
        const published = Array.isArray(data.books) ? data.books : [];
        setBooks(published);
  
        const covers = await Promise.all(
          published.map(async (book) => {
            if (book.coverImageUrl) return [String(book._id), book.coverImageUrl];
            if (!book.hasCover) return [String(book._id), null];
  
            try {
              const result = await apiRequest(
                `/api/books/${encodeURIComponent(book._id)}/cover-url`,
                { headers: { "x-profile-key": profileKey } }
              );
              return [String(book._id), result.url || null];
            } catch {
              return [String(book._id), null];
            }
          })
        );
  
        setCoverUrls(Object.fromEntries(covers));
      } catch (err) {
        setError(err.message || "Unable to load books.");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }, [profileKey]);
  
    const loadOwnedBooks = useCallback(async () => {
      if (!localStorage.getItem("buyerToken")) {
        setOwnedBookIds(new Set());
        return [];
      }
  
      setLibraryLoading(true);
      try {
        const data = await apiRequest("/api/books/mine", {
          headers: buyerHeaders(),
        });
        const owned = Array.isArray(data.books) ? data.books : [];
        setOwnedBookIds(new Set(owned.map((b) => String(b._id))));
        return owned;
      } catch (err) {
        console.error("Library loading failed:", err);
        setOwnedBookIds(new Set());
        return [];
      } finally {
        setLibraryLoading(false);
      }
    }, [buyerHeaders]);
  
    useEffect(() => {
      loadBooks();
      loadOwnedBooks();
    }, [loadBooks, loadOwnedBooks]);
  
    useEffect(() => {
      const onFocus = () => loadOwnedBooks();
      window.addEventListener("focus", onFocus);
      return () => window.removeEventListener("focus", onFocus);
    }, [loadOwnedBooks]);
  
    const openReader = async (book) => {
      setBookActionBusy(String(book._id));
      setBookActionError("");
      try {
        const data = await apiRequest(
          `/api/books/${encodeURIComponent(book._id)}/read-url`,
          { headers: buyerHeaders() }
        );
        if (!data.url) throw new Error("Reader URL unavailable.");
        setReaderBook(book);
        setReaderUrl(data.url);
        setReaderError("");
      } catch (err) {
        setBookActionError(err.message);
      } finally {
        setBookActionBusy("");
      }
    };
  
    const downloadBook = async (book) => {
      setBookActionBusy(String(book._id));
      setBookActionError("");
      setReaderError("");
  
      try {
        const data = await apiRequest(
          `/api/books/${encodeURIComponent(book._id)}/download-url`,
          { headers: buyerHeaders() }
        );
        if (!data.url) throw new Error("Download URL unavailable.");
        window.location.assign(data.url);
      } catch (err) {
        if (readerBook) setReaderError(err.message);
        else setBookActionError(err.message);
      } finally {
        setBookActionBusy("");
      }
    };
  
    const closeReader = () => {
      setReaderBook(null);
      setReaderUrl("");
      setReaderError("");
    };
  
    const openCheckout = async (book) => {
      if (!book || checkoutBusy) return;
  
      setCheckoutBook(book);
      setCheckoutBusy(true);
      setCheckoutStatus("Preparing secure checkout...");
      setCheckoutError("");
      setCheckoutAttempt(null);
      setSquareReady(false);
      setSquareError("");
  
      try {
        const data = await apiRequest("/api/square/checkout/book", {
          method: "POST",
          headers: buyerHeaders(),
          body: JSON.stringify({
            bookId: book._id,
            checkoutKey: createCheckoutKey(),
          }),
        });
  
        if (data.alreadyOwned) {
          await loadOwnedBooks();
          setCheckoutStatus("This book is already in your library.");
          return;
        }
  
        setCheckoutAttempt(data);
  
        setCheckoutStatus(
          data.status === "pending"
            ? data.resumed
              ? "Existing checkout resumed securely."
              : "Secure checkout prepared."
            : "Payment verification is required before continuing."
        );
      } catch (err) {
        setCheckoutError(err.message);
        setCheckoutStatus("");
      } finally {
        setCheckoutBusy(false);
      }
    };
  
    const closeCheckout = () => {
      if (checkoutBusy || paymentLockRef.current) return;
      setCheckoutBook(null);
      setCheckoutAttempt(null);
      setCheckoutStatus("");
      setCheckoutError("");
      setSquareReady(false);
      setSquareError("");
    };
  
    useEffect(() => {
      if (
        !checkoutOpen ||
        !checkoutAttempt ||
        checkoutAttempt.status !== "pending"
      ) {
        return;
      }
  
      let cancelled = false;
      let card = null;
  
      async function initializeSquare() {
        setSquareReady(false);
        setSquareError("");
  
        try {
          const config = await apiRequest(
            "/api/square/checkout/config",
            { headers: buyerHeaders() }
          );
  
          if (!config.applicationId || !config.locationId) {
            throw new Error("Square checkout configuration is incomplete.");
          }
  
          const squareEnvironment = String(
            config.environment || ""
          ).toLowerCase();
          
          if (!["sandbox", "production"].includes(squareEnvironment)) {
            throw new Error(
              "Invalid Square checkout environment."
            );
          }
          
          const isLocalhost = [
            "localhost",
            "127.0.0.1",
          ].includes(window.location.hostname);
          
          if (isLocalhost && squareEnvironment !== "sandbox") {
            throw new Error(
              "Local book checkout must use Square Sandbox."
            );
          }
          
          if (!isLocalhost && squareEnvironment !== "production") {
            throw new Error(
              "Live book checkout requires Square Production."
            );
          }
  
          const squarePayments = await payments(
            config.applicationId,
            config.locationId
          );
  
          if (cancelled) return;
  
          card = await squarePayments.card();
          if (cancelled) {
            await card.destroy?.();
            return;
          }
  
          const container = document.getElementById(
            "books-square-card-container"
          );
          if (!container) throw new Error("Card container not found.");
  
          container.replaceChildren();
          await card.attach("#books-square-card-container");
  
          if (cancelled) {
            await card.destroy?.();
            return;
          }
  
          squareCardRef.current = card;
          setSquareReady(true);
        } catch (err) {
          if (!cancelled) {
            setSquareError(err.message || "Unable to load payment form.");
            setSquareReady(false);
          }
        }
      }
  
      initializeSquare();
  
      return () => {
        cancelled = true;
        if (squareCardRef.current === card) squareCardRef.current = null;
        if (card?.destroy) {
          Promise.resolve(card.destroy()).catch(() => {});
        }
      };
    }, [checkoutOpen, checkoutAttempt, buyerHeaders]);
  
    const confirmOwnership = async () => {
      const owned = await loadOwnedBooks();
      return owned.some((book) => String(book._id) === String(checkoutBook?._id));
    };
  
    const recoverCheckout = async () => {
      if (!checkoutAttempt?.checkoutKey) {
        setCheckoutError("Checkout reference unavailable.");
        return;
      }
  
      setCheckoutBusy(true);
      setCheckoutError("");
      setCheckoutStatus("Checking your existing Square transaction...");
  
      try {
        const data = await apiRequest(
          "/api/square/checkout/book/recover",
          {
            method: "POST",
            headers: buyerHeaders(),
            body: JSON.stringify({
              checkoutKey: checkoutAttempt.checkoutKey,
            }),
          }
        );
  
        const owned = await confirmOwnership();
  
        if (owned) {
          setCheckoutStatus("Purchase verified! Your book is unlocked.");
          setCheckoutAttempt((prev) => ({
            ...prev,
            status: "fulfilled",
          }));
          return;
        }
  
        if (data.status === "pending") {
          setCheckoutAttempt((prev) => ({
            ...prev,
            status: "pending",
          }));
          setCheckoutStatus(
            "No completed payment was found. You can continue checkout."
          );
        } else {
          setCheckoutAttempt((prev) => ({
            ...prev,
            status: data.status || "processing",
          }));
          setCheckoutStatus(
            "Payment is still being verified. Do not submit another charge. Check again shortly."
          );
        }
      } catch (err) {
        setCheckoutError(
          `${err.message} Do not retry payment until its status is verified.`
        );
      } finally {
        setCheckoutBusy(false);
      }
    };
  
    const payForBook = async () => {
      if (paymentLockRef.current || checkoutBusy) return;
  
      if (
        !squareReady ||
        !squareCardRef.current ||
        checkoutAttempt?.status !== "pending" ||
        !checkoutAttempt.checkoutKey
      ) {
        setCheckoutError("Checkout is not ready.");
        return;
      }
  
      paymentLockRef.current = true;
      setCheckoutBusy(true);
      setCheckoutError("");
      setCheckoutStatus("Securing card details...");
  
      let paymentSubmitted = false;
  
      try {
        const tokenResult = await squareCardRef.current.tokenize();
  
        if (tokenResult.status !== "OK" || !tokenResult.token) {
          const message = tokenResult.errors
            ?.map((e) => e.message)
            .filter(Boolean)
            .join(" ");
  
          throw new Error(message || "Card verification failed.");
        }
  
        setCheckoutStatus("Submitting Square Sandbox payment...");
  
        // After this request starts, an uncertain result must
        // be recovered, not blindly submitted again.
        paymentSubmitted = true;
  
        const result = await apiRequest(
          "/api/square/checkout/book/pay",
          {
            method: "POST",
            headers: buyerHeaders(),
            body: JSON.stringify({
              checkoutKey: checkoutAttempt.checkoutKey,
              sourceId: tokenResult.token,
            }),
          }
        );
  
        const owned = await confirmOwnership();
  
        if (owned) {
          setCheckoutStatus(
            "Payment successful! Your book is now in your library."
          );
          setCheckoutAttempt((prev) => ({
            ...prev,
            status: "fulfilled",
          }));
          return;
        }
  
        setCheckoutAttempt((prev) => ({
          ...prev,
          status: result.status || "processing",
        }));
  
        setCheckoutStatus(
          "Payment submitted. Purchase verification is still in progress. Use Check Payment Status."
        );
      } catch (err) {
        setCheckoutError(err.message || "Payment could not be completed.");
  
        if (paymentSubmitted) {
          setCheckoutAttempt((prev) => ({
            ...prev,
            status: "processing",
          }));
          setCheckoutStatus(
            "Payment outcome is uncertain. Do not pay again. Select Check Payment Status."
          );
        } else {
          setCheckoutStatus(
            "No payment was submitted. Check your card details and try again."
          );
        }
      } finally {
        paymentLockRef.current = false;
        setCheckoutBusy(false);
      }
    };
  
    return (
      <main className="books-page">
        <header className="books-header">
          <button
            className="books-back"
            onClick={() =>
              navigate(`/world/${encodeURIComponent(profileKey)}`)
            }
            aria-label="Back to artist"
          >
            ‹
          </button>
          <div className="books-heading">
            <h1>Books</h1>
            <p>STORIES • KNOWLEDGE • INSPIRATION</p>
          </div>
          <div className="books-header-space" />
        </header>
  
        <section className="books-content">
          <div className="books-intro">
            <span className="books-eyebrow">DIGITAL LIBRARY</span>
            <h2>Discover something worth reading.</h2>
            <p>
              Explore digital books from this creator. Purchase your
              favorites, read directly on indiVerse, and download
              your copies to enjoy anytime.
            </p>
          </div>
  
          {error && (
            <div className="books-error" role="alert">
              <p>{error}</p>
              <button onClick={loadBooks}>Try Again</button>
            </div>
          )}
  
          {bookActionError && (
            <div className="books-error" role="alert">
              <p>{bookActionError}</p>
              <button onClick={() => setBookActionError("")}>
                Dismiss
              </button>
            </div>
          )}
  
          {loading ? (
            <div className="books-empty">
              <span className="books-empty-icon">📚</span>
              <h3>Loading books...</h3>
            </div>
          ) : !error && books.length === 0 ? (
            <div className="books-empty">
              <span className="books-empty-icon">📖</span>
              <h3>Books coming soon</h3>
              <p>New digital releases will appear here.</p>
            </div>
          ) : !error ? (
            <>
              <div className="books-section-heading">
                <h3>Available Books</h3>
                <span>
                  {books.length} {books.length === 1 ? "book" : "books"}
                </span>
              </div>
  
              {libraryLoading && (
                <p className="books-library-status">
                  Checking your library...
                </p>
              )}
  
              <div className="books-grid">
                {books.map((book) => {
                  const bookId = String(book._id);
                  const owned = ownedBookIds.has(bookId);
                  const busy = bookActionBusy === bookId;
  
                  return (
                    <article className="books-card" key={bookId}>
                      <div className="books-cover">
                        {coverUrls[bookId] ? (
                          <img
                            src={coverUrls[bookId]}
                            alt={`${book.title} cover`}
                            loading="lazy"
                          />
                        ) : (
                          <div className="books-cover-placeholder">
                            📖
                          </div>
                        )}
                      </div>
  
                      <div className="books-card-content">
                        <span className="books-format">
                          DIGITAL BOOK • PDF
                        </span>
                        <h3>{book.title}</h3>
                        <p className="books-author">By {book.author}</p>
  
                        {book.description && (
                          <p className="books-description">
                            {book.description}
                          </p>
                        )}
  
                        {owned && (
                          <span className="books-owned-label">
                            ✓ In Your Library
                          </span>
                        )}
  
                        <div className="books-card-footer">
                          <strong>{formatPrice(book.priceCents)}</strong>
  
                          {owned ? (
                            <div className="books-owned-actions">
                              <button
                                className="books-buy"
                                disabled={busy}
                                onClick={() => openReader(book)}
                              >
                                {busy ? "Loading..." : "Read"}
                              </button>
                              <button
                                className="books-download"
                                disabled={busy}
                                onClick={() => downloadBook(book)}
                              >
                                Download
                              </button>
                            </div>
                          ) : (
                            <button
                              className="books-buy"
                              disabled={Number(book.priceCents) === 0}
                              onClick={() => openCheckout(book)}
                            >
                              {Number(book.priceCents) === 0
                                ? "Claim Soon"
                                : "Buy"}
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          ) : null}
        </section>
  
        {readerBook && (
          <div className="books-reader-backdrop">
            <div
              className="books-reader-modal"
              role="dialog"
              aria-modal="true"
              aria-label={`Reading ${readerBook.title}`}
            >
              <div className="books-reader-header">
                <div>
                  <strong>{readerBook.title}</strong>
                  <span>By {readerBook.author}</span>
                </div>
                <button onClick={closeReader} aria-label="Close reader">
                  ✕
                </button>
              </div>
  
              <iframe
                title={`Read ${readerBook.title}`}
                src={readerUrl}
                className="books-reader-frame"
              />
  
              <div className="books-reader-footer">
                <span>Your indiVerse Library</span>
                <button onClick={() => downloadBook(readerBook)}>
                  Download PDF
                </button>
              </div>
  
              {readerError && (
                <div className="books-reader-message" role="alert">
                  {readerError}
                </div>
              )}
            </div>
          </div>
        )}
  
        {checkoutOpen && checkoutBook && (
          <div
            className="books-modal-backdrop"
            onClick={closeCheckout}
            role="presentation"
          >
            <div
              className="books-checkout-modal"
              role="dialog"
              aria-modal="true"
              aria-label={`Checkout for ${checkoutBook.title}`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="books-checkout-top">
                <div>
                  <span className="books-eyebrow">
                    SECURE SANDBOX CHECKOUT
                  </span>
                  <h2>{checkoutBook.title}</h2>
                  <p>By {checkoutBook.author}</p>
                </div>
                <button
                  className="books-modal-close"
                  onClick={closeCheckout}
                  disabled={checkoutBusy}
                  aria-label="Close checkout"
                >
                  ✕
                </button>
              </div>
  
              <div className="books-checkout-price">
                <span>Digital PDF</span>
                <strong>{formatPrice(checkoutBook.priceCents)}</strong>
              </div>
  
              {checkoutStatus && (
                <p className="books-checkout-note">{checkoutStatus}</p>
              )}
  
              {checkoutError && (
                <div className="books-error" role="alert">
                  {checkoutError}
                </div>
              )}
  
              {checkoutAttempt?.status === "pending" && (
                <div className="books-square-box">
                  <h3>Card Details</h3>
                  <div
                    id="books-square-card-container"
                    className="books-square-card"
                  />
                  {!squareReady && !squareError && (
                    <p className="books-square-hint">
                      Loading secure payment form...
                    </p>
                  )}
                  {squareError && (
                    <div className="books-error" role="alert">
                      {squareError}
                    </div>
                  )}
                </div>
              )}
  
              {checkoutAttempt?.status === "pending" && (
                <button
                  className="books-pay-button"
                  onClick={payForBook}
                  disabled={!squareReady || checkoutBusy}
                >
                  {checkoutBusy
                    ? "Processing..."
                    : `Pay securely • ${formatPrice(
                        checkoutBook.priceCents
                      )}`}
                </button>
              )}
  
              {checkoutAttempt &&
                checkoutAttempt.status !== "fulfilled" && (
                  <button
                    className="books-recover-button"
                    onClick={recoverCheckout}
                    disabled={checkoutBusy}
                  >
                    Check Payment Status
                  </button>
                )}
  
              {checkoutAttempt?.status === "fulfilled" && (
                <button
                  className="books-pay-button"
                  onClick={closeCheckout}
                >
                  Continue to My Book
                </button>
              )}
  
              <p className="books-checkout-disclaimer">
                Square Sandbox test checkout. No live funds are
                transferred. Book access is granted only after
                server-side payment verification.
              </p>
            </div>
          </div>
        )}
  
        <style>{`
          .books-page {
            min-height: 100vh;
            color: #fff;
            background:
              radial-gradient(ellipse at 20% 0%,rgba(96,165,250,.12),transparent 55%),
              radial-gradient(ellipse at 85% 25%,rgba(249,115,115,.08),transparent 50%),
              #050505;
            font-family: ui-sans-serif,system-ui,-apple-system,
              BlinkMacSystemFont,"Segoe UI",sans-serif;
          }
          .books-header {
            position: sticky;
            top: 0;
            z-index: 10;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            background: rgba(0,0,0,.65);
            backdrop-filter: blur(14px);
            border-bottom: 1px solid rgba(255,255,255,.08);
          }
          .books-back {
            width: 42px;
            height: 42px;
            flex-shrink: 0;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,.15);
            background: rgba(255,255,255,.08);
            color: white;
            font-size: 28px;
            cursor: pointer;
            display: grid;
            place-items: center;
          }
          .books-heading { flex: 1; text-align: center; }
          .books-heading h1 {
            margin: 0;
            font-size: 19px;
            font-weight: 900;
            letter-spacing: 1px;
          }
          .books-heading p {
            margin: 4px 0 0;
            color: #aeb5c2;
            font-size: 9px;
            letter-spacing: 1.4px;
          }
          .books-header-space { width: 42px; flex-shrink: 0; }
          .books-content {
            max-width: 1180px;
            margin: 0 auto;
            padding: 40px 20px;
            box-sizing: border-box;
          }
          .books-intro { max-width: 600px; margin-bottom: 40px; }
          .books-eyebrow {
            color: #93c5fd;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 2px;
          }
          .books-intro h2 {
            font-size: clamp(28px,5vw,46px);
            line-height: 1.15;
            margin: 14px 0;
            font-weight: 900;
            letter-spacing: -1px;
          }
          .books-intro p {
            color: #aeb5c2;
            line-height: 1.7;
            font-size: 15px;
          }
          .books-section-heading {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            margin-bottom: 18px;
          }
          .books-section-heading h3 { font-size: 20px; margin: 0; }
          .books-section-heading span,
          .books-library-status {
            color: #aeb5c2;
            font-size: 12px;
          }
          .books-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill,minmax(240px,1fr));
            gap: 24px;
          }
          .books-card {
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,.12);
            border-radius: 20px;
            background: rgba(255,255,255,.045);
            transition: transform .2s,border-color .2s;
          }
          .books-card:hover {
            transform: translateY(-3px);
            border-color: rgba(147,197,253,.4);
          }
          .books-cover {
            height: 320px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(15,23,42,.7);
            overflow: hidden;
          }
          .books-cover img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          .books-cover-placeholder { font-size: 64px; }
          .books-card-content {
            padding: 20px;
            display: flex;
            flex-direction: column;
            flex: 1;
          }
          .books-format {
            color: #93c5fd;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1px;
          }
          .books-card-content h3 {
            margin: 12px 0 5px;
            font-size: 20px;
            line-height: 1.3;
          }
          .books-author {
            margin: 0 0 12px;
            color: #aeb5c2;
            font-size: 13px;
          }
          .books-description {
            color: #cbd5e1;
            font-size: 13px;
            line-height: 1.7;
            margin: 0 0 20px;
            overflow-wrap: anywhere;
          }
          .books-owned-label {
            color: #86efac;
            font-size: 11px;
            font-weight: 800;
            margin-bottom: 12px;
          }
          .books-card-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-top: auto;
            padding-top: 12px;
          }
          .books-card-footer strong { font-size: 21px; }
          .books-buy,.books-pay-button {
            border: 0;
            border-radius: 999px;
            padding: 12px 18px;
            background: #93c5fd;
            color: #07111e;
            font-size: 12px;
            font-weight: 900;
            cursor: pointer;
          }
          .books-buy:disabled,.books-pay-button:disabled,
          .books-download:disabled,.books-recover-button:disabled {
            opacity: .5;
            cursor: not-allowed;
          }
          .books-owned-actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }
          .books-download,.books-recover-button {
            border: 1px solid rgba(147,197,253,.5);
            border-radius: 999px;
            padding: 12px 16px;
            background: rgba(147,197,253,.1);
            color: #bfdbfe;
            font-size: 12px;
            font-weight: 800;
            cursor: pointer;
          }
          .books-empty {
            min-height: 280px;
            border: 1px solid rgba(255,255,255,.1);
            border-radius: 20px;
            background: rgba(255,255,255,.035);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 30px;
            text-align: center;
            box-sizing: border-box;
          }
          .books-empty-icon { font-size: 44px; }
          .books-empty h3 { margin: 16px 0 6px; font-size: 20px; }
          .books-empty p {
            color: #aeb5c2;
            font-size: 14px;
            line-height: 1.6;
          }
          .books-error {
            border: 1px solid rgba(239,68,68,.3);
            border-radius: 14px;
            background: rgba(239,68,68,.1);
            padding: 18px;
            margin-bottom: 20px;
            color: #fecaca;
          }
          .books-error button {
            border: 1px solid rgba(255,255,255,.2);
            background: rgba(255,255,255,.1);
            color: white;
            border-radius: 10px;
            padding: 9px 14px;
            cursor: pointer;
          }
          .books-modal-backdrop {
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 18px;
            background: rgba(0,0,0,.78);
            backdrop-filter: blur(10px);
            box-sizing: border-box;
          }
          .books-checkout-modal {
            width: 100%;
            max-width: 480px;
            max-height: 90dvh;
            overflow-y: auto;
            padding: 26px;
            box-sizing: border-box;
            border: 1px solid rgba(147,197,253,.25);
            border-radius: 24px;
            background: #10141e;
            box-shadow: 0 24px 80px rgba(0,0,0,.65);
          }
          .books-checkout-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 16px;
          }
          .books-checkout-top h2 {
            margin: 10px 0 6px;
            font-size: 23px;
          }
          .books-checkout-top p {
            margin: 0;
            color: #aeb5c2;
            font-size: 13px;
          }
          .books-modal-close {
            flex-shrink: 0;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            border: 1px solid rgba(255,255,255,.15);
            background: rgba(255,255,255,.08);
            color: white;
            cursor: pointer;
          }
          .books-checkout-price {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin: 24px 0;
            padding: 16px 0;
            border-top: 1px solid rgba(255,255,255,.1);
            border-bottom: 1px solid rgba(255,255,255,.1);
          }
          .books-checkout-price span {
            color: #aeb5c2;
            font-size: 13px;
          }
          .books-checkout-price strong { font-size: 24px; }
          .books-checkout-note {
            color: #cbd5e1;
            font-size: 13px;
            line-height: 1.6;
          }
          .books-square-box {
            margin-top: 22px;
            padding: 18px;
            border: 1px solid rgba(255,255,255,.12);
            border-radius: 16px;
            background: rgba(255,255,255,.035);
          }
          .books-square-box h3 { margin: 0 0 16px; font-size: 14px; }
          .books-square-card { min-height: 90px; }
          .books-square-hint { color: #aeb5c2; font-size: 12px; }
          .books-pay-button {
            width: 100%;
            margin-top: 20px;
            padding: 15px 20px;
            font-size: 14px;
          }
          .books-recover-button {
            width: 100%;
            margin-top: 12px;
          }
          .books-checkout-disclaimer {
            margin: 14px 0 0;
            color: #94a3b8;
            font-size: 11px;
            line-height: 1.6;
            text-align: center;
          }
          .books-reader-backdrop {
            position: fixed;
            inset: 0;
            z-index: 2000;
            background: rgba(0,0,0,.9);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            box-sizing: border-box;
          }
          .books-reader-modal {
            width: 100%;
            max-width: 1100px;
            height: 94dvh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,.15);
            border-radius: 20px;
            background: #10141e;
          }
          .books-reader-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 16px 20px;
            border-bottom: 1px solid rgba(255,255,255,.1);
          }
          .books-reader-header div {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .books-reader-header span {
            font-size: 12px;
            color: #94a3b8;
          }
          .books-reader-header button {
            border: 0;
            background: rgba(255,255,255,.1);
            color: white;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            cursor: pointer;
          }
          .books-reader-frame {
            width: 100%;
            flex: 1;
            min-height: 0;
            border: 0;
            background: white;
          }
          .books-reader-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 12px 20px;
            border-top: 1px solid rgba(255,255,255,.1);
            font-size: 12px;
            color: #94a3b8;
          }
          .books-reader-footer button {
            background: #93c5fd;
            color: #07111e;
            border: 0;
            border-radius: 999px;
            padding: 10px 16px;
            font-weight: 800;
            cursor: pointer;
          }
          .books-reader-message {
            padding: 12px 20px;
            background: rgba(239,68,68,.15);
            color: #fecaca;
            font-size: 12px;
          }
          @media (max-width: 600px) {
            .books-header { padding: 12px; }
            .books-content { padding: 28px 16px; }
            .books-intro { margin-bottom: 28px; }
            .books-grid {
              grid-template-columns: repeat(2,minmax(0,1fr));
              gap: 12px;
            }
            .books-cover { height: 220px; }
            .books-card-content { padding: 12px; }
            .books-card-content h3 { font-size: 16px; }
            .books-card-footer {
              flex-direction: column;
              align-items: stretch;
            }
            .books-buy { width: 100%; }
            .books-owned-actions {
              width: 100%;
              flex-direction: column;
            }
            .books-download { width: 100%; }
            .books-checkout-modal {
              padding: 20px 16px;
              border-radius: 18px;
            }
            .books-reader-backdrop { padding: 0; }
            .books-reader-modal {
              height: 100dvh;
              border-radius: 0;
            }
            .books-reader-header { padding: 14px 16px; }
            .books-reader-footer { padding: 12px 16px; }
          }
          @media (max-width: 360px) {
            .books-grid { grid-template-columns: 1fr; }
          }
        `}</style>
      </main>
    );
  }
  