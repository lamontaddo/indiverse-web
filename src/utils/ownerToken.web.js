// src/utils/ownerToken.web.js ✅ FULL DROP-IN
// Profile-scoped owner token storage for web (localStorage)

function normalizeProfileKey(pk) {
    return String(pk || "").trim().toLowerCase();
  }
  
  function ownerTokenKey(profileKey) {
    return `ownerToken:${normalizeProfileKey(profileKey)}`;
  }
  
  export function setOwnerToken(profileKey, token) {
    const pk = normalizeProfileKey(profileKey);
    const t = String(token || "").trim();
    if (!pk || !t) return;
  
    localStorage.setItem(ownerTokenKey(pk), t);
  
    // convenience / legacy
    localStorage.setItem("ownerToken", t);
    localStorage.setItem("profileKey", pk);
    localStorage.setItem("lastOwnerProfileKey", pk);
  }
  
  export function getOwnerToken(profileKey) {
    const pk = normalizeProfileKey(profileKey);
    try {
      return (
        localStorage.getItem(ownerTokenKey(pk)) ||
        localStorage.getItem("ownerToken") ||
        ""
      );
    } catch {
      return "";
    }
  }
  
  export function clearOwnerToken(profileKey) {
    const pk = normalizeProfileKey(profileKey);
    try {
      localStorage.removeItem(ownerTokenKey(pk));
    } catch {}
  }
  