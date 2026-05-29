// ── Device ID (localStorage-based, simple and fast) ──────────────────────
// Used as a lightweight first-layer device check.
// Falls back gracefully if localStorage is unavailable.

export function getDeviceId() {
  try {
    const cached = localStorage.getItem('ep_did');
    if (cached && cached.length === 32) return cached;

    // Generate a random ID and persist it
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    const id = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
    localStorage.setItem('ep_did', id);
    return id;
  } catch {
    // Private/incognito mode — return empty string (device check will be skipped)
    return '';
  }
}
