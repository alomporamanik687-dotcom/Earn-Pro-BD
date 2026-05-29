// Device Fingerprint Generator
export async function getDeviceId() {
  const cached = localStorage.getItem('ep_did');
  if (cached) return cached;

  const nav = window.navigator;
  const screen = window.screen;

  const raw = [
    nav.userAgent,
    nav.language,
    nav.platform,
    nav.hardwareConcurrency,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    nav.maxTouchPoints,
    typeof window.ontouchstart !== 'undefined',
    nav.cookieEnabled,
    nav.doNotTrack
  ].join('|');

  // SHA-256 hash
  const encoded = new TextEncoder().encode(raw);
  const buffer = await crypto.subtle.digest('SHA-256', encoded);
  const hex = Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2,'0')).join('');
  const id = hex.substring(0, 32);

  localStorage.setItem('ep_did', id);
  return id;
}
