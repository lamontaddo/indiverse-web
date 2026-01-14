// src/services/ownerFetch.js ✅ FULL DROP-IN (Web)
// Simple fetch wrapper that ALWAYS sends x-profile-key + optional auth token.

function normPk(v) {
    return String(v || "").trim().toLowerCase();
  }
  
  function readOwnerToken(profileKey) {
    const pk = normPk(profileKey);
    try {
      // try a few common keys (keep it flexible)
      return (
        localStorage.getItem(`ownerToken:${pk}`) ||
        localStorage.getItem("ownerToken") ||
        ""
      );
    } catch {
      return "";
    }
  }
  
  /**
   * ownerFetch("/api/owner/fashion", { profileKey, method, headers, body })
   */
  export async function ownerFetch(path, opts = {}) {
    const {
      profileKey,
      method = "GET",
      headers = {},
      body,
      token, // optional override
      auth = "owner", // "owner" | "none"
    } = opts;
  
    const pk = normPk(profileKey);
    if (!pk) throw new Error("ownerFetch: missing profileKey");
  
    const outHeaders = {
      ...headers,
      "x-profile-key": pk,
    };
  
    // attach token if available (optional)
    const t = token || (auth === "owner" ? readOwnerToken(pk) : "");
    if (t) outHeaders.Authorization = `Bearer ${t}`;
  
    return fetch(path, {
      method,
      headers: outHeaders,
      body,
    });
  }
  