// src/App.jsx ✅ FULL DROP-IN (boots remote config for deep links)

import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CartProvider } from "./CartContext.jsx";
import { bootRemoteConfigOnce } from "./services/remoteConfigClient";

import PlaceholderFeatureWeb from "./pages/PlaceholderFeatureWeb.jsx";

import UniverseHome from "./pages/UniverseHome.jsx";
import ProfileHomeShell from "./pages/ProfileHomeShell.jsx";
import UniverseScreen from "./pages/UniverseScreen.jsx";
import MainScreen from "./pages/MainScreen.jsx";

import FlowerOrdersPage from "./pages/FlowerOrdersPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import VideosPage from "./pages/VideosPage.jsx";
import PlaylistPage from "./pages/PlaylistPage.jsx";
import FashionPage from "./pages/FashionPage.jsx";
import MusicPage from "./pages/MusicPage.jsx";

import EnergyPage from "./pages/EnergyPage.jsx";
import GamesPage from "./pages/GamesPage.jsx";

import ProductsPage from "./pages/ProductsPage.jsx";
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx";
import CartPage from "./pages/CartPage.jsx";

import AuthSignup from './pages/AuthSignup';
import AuthLogin from './pages/AuthLogin';
import ChatPage from "./pages/ChatPage.jsx";
import OwnerFashionPage from "./pages/OwnerFashionPage.jsx";
import LinkPortalPage from "./pages/LinkPortalPage.jsx";




import OwnerLoginPage from "./pages/OwnerLoginPage.jsx";
import OwnerHomePage from "./pages/OwnerHomePage.jsx";
import OwnerAboutPage from "./pages/OwnerAboutPage.jsx";
import OwnerVideosPage from "./pages/OwnerVideosPage.jsx";
import OwnerFlowerOrdersPage from "./pages/OwnerFlowerOrdersPage.jsx";
import OwnerProductsPage from "./pages/OwnerProductsPage.jsx";
import OwnerPlaylistPage from "./pages/OwnerPlaylistPage.jsx";
import OwnerContactsPage from "./pages/OwnerContactsPage.jsx";
import OwnerMessagesPage from "./pages/OwnerMessagesPage.jsx";
import OwnerChatPage from "./pages/OwnerChatPage.jsx";
import OwnerMusicPage from "./pages/OwnerMusicPage";
import OwnerPortfolioPage from "./pages/OwnerPortfolioPage.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";
import PortfolioViewerPage from "./pages/PortfolioViewerPage.jsx";




// ✅ Temporary stubs
function Stub({ name }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: 24,
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
      }}
    >
      <h2 style={{ margin: 0, fontSize: 22 }}>{name}</h2>
      <p style={{ opacity: 0.7, marginTop: 10 }}>Stub page. Replace with a real screen.</p>
      <a href="/" style={{ color: "#0ff" }}>
        ← Back to Universe
      </a>
    </div>
  );
}

function BootGate({ children }) {
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    bootRemoteConfigOnce()
      .then(() => alive && setReady(true))
      .catch((e) => alive && setErr(e?.message || "Failed to load remote config"));
    return () => {
      alive = false;
    };
  }, []);

  if (!ready) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          textAlign: "center",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
        }}
      >
        <div style={{ maxWidth: 520 }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: 1 }}>Loading indiVerse…</div>
          <div style={{ marginTop: 10, opacity: 0.7, fontSize: 13 }}>
            Booting remote config so deep links work.
          </div>
          {err ? (
            <div style={{ marginTop: 14, color: "#fca5a5", fontSize: 13 }}>
              {err}
              <div style={{ marginTop: 10 }}>
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(2,6,23,0.55)",
                    color: "#e5e7eb",
                    padding: "10px 14px",
                    cursor: "pointer",
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return children;
}

export default function App() {
  return (
    <CartProvider>
      <BootGate>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<UniverseHome />} />

            <Route path="/vaultgate" element={<Stub name="VaultGate" />} />

<Route path="/auth/signup" element={<AuthSignup />} />
<Route path="/auth/login" element={<AuthLogin />} />

<Route path="/profile/:profileKey" element={<ProfileHomeShell />} />
<Route path="/universe/:profileKey" element={<UniverseScreen />} />
<Route path="/world/:profileKey" element={<MainScreen />} />

<Route path="/world/:profileKey/about" element={<AboutPage />} />
<Route path="/world/:profileKey/contact" element={<ContactPage />} />
<Route path="/world/:profileKey/videos" element={<VideosPage />} />
<Route path="/world/:profileKey/playlist" element={<PlaylistPage />} />
<Route path="/world/:profileKey/fashion" element={<FashionPage />} />
<Route path="/world/:profileKey/music" element={<MusicPage />} />
<Route path="/world/:profileKey/energy" element={<EnergyPage />} />
<Route path="/world/:profileKey/games" element={<GamesPage />} />
<Route path="/world/:profileKey/chat" element={<ChatPage />} />
<Route path="/world/:profileKey/products" element={<ProductsPage />} />
<Route path="/world/:profileKey/products/:productId" element={<ProductDetailsPage />} />
<Route path="/world/:profileKey/cart" element={<CartPage />} />
<Route path="/world/:profileKey/portfolio" element={<PortfolioPage />} />
<Route path="/world/:profileKey/portfolio/view" element={<PortfolioViewerPage />} />

{/* ✅ CONSULTATION */}

<Route path="/world/:profileKey/flowerorders" element={<FlowerOrdersPage />} />{/* keep placeholder last among /world routes */}
  {/* ✅ OWNER LOGIN (MUST be above /:featureKey wildcard) */}
  <Route path="/world/:profileKey/owner/login" element={<OwnerLoginPage />} />
  <Route path="/world/:profileKey/owner/home" element={<OwnerHomePage />} />

  <Route path="/world/:profileKey/owner/about" element={<OwnerAboutPage />} />
  <Route path="/world/:profileKey/owner/videos" element={<OwnerVideosPage />} />
  <Route path="/world/:profileKey/owner/flowerorders" element={<OwnerFlowerOrdersPage />} />
  <Route path="/world/:profileKey/owner/products" element={<OwnerProductsPage />} />
  <Route path="/world/:profileKey/owner/playlist" element={<OwnerPlaylistPage />} />
  <Route path="/world/:profileKey/owner/contacts" element={<OwnerContactsPage />} />
  <Route path="/world/:profileKey/owner/messages" element={<OwnerMessagesPage />} />
  <Route path="/world/:profileKey/owner/chat" element={<OwnerChatPage />} />
  <Route path="/world/:profileKey/owner/fashion" element={<OwnerFashionPage />} />
  <Route path="/world/:profileKey/owner/music" element={<OwnerMusicPage />} />
  <Route path="/portal/:profileKey" element={<LinkPortalPage />} />
  <Route path="/portal/:profileKey/:portalKey" element={<LinkPortalPage />} />
  <Route path="/world/:profileKey/owner/portfolio" element={<OwnerPortfolioPage />} />

<Route path="/world/:profileKey/:featureKey" element={<PlaceholderFeatureWeb />} />


            <Route path="*" element={<Stub name="404" />} />
          </Routes>
        </BrowserRouter>
      </BootGate>
    </CartProvider>
  );
}
