// src/components/OwnerGate.jsx ✅ FULL DROP-IN
// Wrap owner pages to ensure:
// - profileKey exists
// - token exists
// - owner profile fetch uses absolute backend base
// - redirects to /owner/login on 401/403

import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchOwnerProfileWeb, normalizeProfileKey } from "../utils/ownerProfile.web";
import { getOwnerToken } from "../utils/ownerToken.web";

export default function OwnerGate({ children }) {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const routePk = normalizeProfileKey(params?.profileKey);
  const statePk = normalizeProfileKey(location?.state?.profileKey);
  const storedPk = normalizeProfileKey(
    (() => {
      try {
        return localStorage.getItem("profileKey");
      } catch {
        return "";
      }
    })()
  );

  const profileKey = useMemo(() => routePk || statePk || storedPk || "", [routePk, statePk, storedPk]);

  const [loading, setLoading] = useState(true);
  const [ownerProfile, setOwnerProfile] = useState(null);
  const [error, setError] = useState("");

  const bgUrl = location?.state?.bgUrl || null;

  useEffect(() => {
    let alive = true;

    (async () => {
      setError("");
      setLoading(true);

      if (!profileKey) {
        if (!alive) return;
        setError("Missing profileKey. Open this as /world/:profileKey/owner/...");
        setLoading(false);
        return;
      }

      const token = getOwnerToken(profileKey);
      if (!token) {
        // no token -> login
        navigate(`/world/${encodeURIComponent(profileKey)}/owner/login`, {
          replace: true,
          state: { profileKey, bgUrl },
        });
        return;
      }

      try {
        const p = await fetchOwnerProfileWeb(profileKey);
        if (!alive) return;
        setOwnerProfile(p);
        setLoading(false);
      } catch (e) {
        const msg = e?.message || "Owner session failed.";
        const code = e?.code || "";
        const status = e?.status;

        // ownerApi.web sets OWNER_UNAUTHORIZED on throw, and status is included
        if (code === "OWNER_UNAUTHORIZED" || status === 401 || status === 403) {
          navigate(`/world/${encodeURIComponent(profileKey)}/owner/login`, {
            replace: true,
            state: { profileKey, bgUrl },
          });
          return;
        }

        if (!alive) return;
        setError(msg);
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [profileKey, navigate, bgUrl]);

  if (loading) {
    return (
      <div style={{ padding: 18, color: "#e5e7eb" }}>
        <div style={{ opacity: 0.85 }}>Loading owner session…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 18, color: "#e5e7eb" }}>
        <div style={{ fontWeight: 900, color: "#fca5a5" }}>Owner Gate Error</div>
        <div style={{ marginTop: 6, opacity: 0.9 }}>{error}</div>
      </div>
    );
  }

  // optionally provide ownerProfile to children later via context if you want
  return <>{children}</>;
}
