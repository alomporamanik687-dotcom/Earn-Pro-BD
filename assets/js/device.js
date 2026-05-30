export function getDeviceId() {
  try {
    const k = 'ep_did';
    let id = localStorage.getItem(k);
    if (id && id.length === 32) return id;
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    id = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
    localStorage.setItem(k, id);
    return id;
  } catch { return ''; }
}
