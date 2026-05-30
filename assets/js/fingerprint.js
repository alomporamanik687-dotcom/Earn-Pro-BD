export async function getDeviceFingerprint() {
  const p = [];
  try { p.push(screen.width + 'x' + screen.height + 'x' + screen.colorDepth); } catch { p.push('s0'); }
  try { p.push(String(window.devicePixelRatio || 1)); } catch { p.push('r1'); }
  try { p.push(String(navigator.hardwareConcurrency || 0)); } catch { p.push('c0'); }
  try { p.push(String(navigator.maxTouchPoints || 0)); } catch { p.push('t0'); }
  try { p.push(navigator.platform || ''); } catch { p.push(''); }
  try { p.push(navigator.language || ''); } catch { p.push(''); }
  try { p.push(Intl.DateTimeFormat().resolvedOptions().timeZone || ''); } catch { p.push(''); }
  try {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f69'; ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069'; ctx.font = '11pt Arial';
      ctx.fillText('EarnPro.fp', 2, 15);
      p.push(c.toDataURL().slice(-60));
    }
  } catch { p.push('nc'); }
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      if (ext) p.push(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '');
    }
  } catch { p.push('ngl'); }
  const raw = p.join('||');
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('').slice(0,32);
  } catch {
    let h = 0;
    for (let i = 0; i < raw.length; i++) h = Math.imul(31, h) + raw.charCodeAt(i) | 0;
    return Math.abs(h).toString(16).padStart(8,'0').repeat(4).slice(0,32);
  }
}
