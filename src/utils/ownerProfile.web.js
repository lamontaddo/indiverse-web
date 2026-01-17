// src/utils/ownerProfile.web.js ✅ FULL DROP-IN
// Loads the owner profile using absolute backend base (prevents indiverse-web /api 404)

import { ownerJsonWeb } from "./ownerApi.web";

export function normalizeProfileKey(pk) {
  return String(pk || "").trim().toLowerCase();
}

export async function fetchOwnerProfileWeb(profileKey) {
  const pk = normalizeProfileKey(profileKey);
  if (!pk) {
    const err = new Error("Missing profileKey.");
    err.code = "MISSING_PROFILE_KEY";
    throw err;
  }

  // Backend endpoint your web is trying to call
  // If your backend uses a different endpoint, change it here once.
  return await ownerJsonWeb("/api/owner/profile", { profileKey: pk });
}
