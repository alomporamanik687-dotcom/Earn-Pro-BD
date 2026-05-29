// ── Device Fingerprint — unique per physical device ───────────────────────
// Used as the primary device-lock mechanism (1 account per device).
// Combines hardware signals for a stable ID that survives app reinstalls.
// If ANY step fails (privacy mode, WebView restrictions), it degrades
// gracefully and still produces a usable ID from whatever signals are
// available.

export async function getDeviceFingerprint() {
  const parts = [];

  // ── Stable hardware signals ──────────────────────────────────
  try { parts.push(screen.width + 'x' + screen.height + 'x' + screen.colorDepth); } catch { parts.push('s0'); }
  try { parts.push(String(window.devicePixelRatio || 1)); } catch { parts.push('r1'); }
  try { parts.push(String(navigator.hardwareConcurrency || 0)); } catch { parts.push('c0'); }
  try { parts.push(String(navigator.maxTouchPoints || 0)); } catch { parts.push('t0'); }
  try { parts.push(navigator.platform || ''); } catch { parts.push(''); }
  try { parts.push(navigator.language || ''); } catch { parts.push(''); }
  try { parts.push(Intl.DateTimeFormat().resolvedOptions().timeZone || ''); } catch { parts.push(''); }

  // ── Canvas fingerprint (GPU/driver specific) ─────────────────
  try {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#f69';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.font = '11pt no-such-font,Arial';
      ctx.fillText('EarnPro.device.id', 2, 15);
      ctx.fillStyle = 'rgba(102,200,0,0.7)';
      ctx.fillText('EarnPro.device.id', 4, 16);
      parts.push(c.toDataURL().slice(-80));
    } else { parts.push('nc'); }
  } catch { parts.push('nc'); }

  // ── WebGL renderer ────────────────────────────────────────────
  try {
    const gl = document.createElement('canvas').getContext('webgl')
            || document.createElement('canvas').getContext('experimental-webgl');
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      if (ext) {
        parts.push(gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) || '');
        parts.push(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '');
      }
      parts.push(gl.getParameter(gl.VERSION) || '');
    } else { parts.push('ngl'); }
  } catch { parts.push('ngl'); }

  // ── Audio fingerprint ─────────────────────────────────────────
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 44100 });
    const osc = ac.createOscillator();
    const analyser = ac.createAnalyser();
    const gain = ac.createGain();
    gain.gain.value = 0;
    osc.connect(analyser);
    analyser.connect(gain);
    gain.connect(ac.destination);
    osc.start(0);
    const data = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(data);
    osc.stop();
    await ac.close();
    parts.push(data.slice(0, 10).join(','));
  } catch { parts.push('nac'); }

  // ── Hash all parts → 32-char ID ──────────────────────────────
  const raw = parts.join('||');
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 32);
  } catch {
    // Fallback: simple hash if SubtleCrypto is unavailable
    let h = 0;
    for (let i = 0; i < raw.length; i++) {
      h = Math.imul(31, h) + raw.charCodeAt(i) | 0;
    }
    return Math.abs(h).toString(16).padStart(8, '0').repeat(4).slice(0, 32);
  }
}

