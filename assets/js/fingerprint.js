export async function getDeviceFingerprint() {
  try {
    const parts = [];
    parts.push(screen.width + 'x' + screen.height);
    parts.push(navigator.language || '');
    parts.push(Intl.DateTimeFormat().resolvedOptions().timeZone || '');
    parts.push(navigator.hardwareConcurrency || 0);
    parts.push(navigator.maxTouchPoints || 0);

    try {
      const c = document.createElement('canvas');
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#f69';
      ctx.fillRect(10, 10, 50, 20);
      ctx.fillStyle = '#069';
      ctx.font = '12px Arial';
      ctx.fillText('EarnPro', 2, 15);
      parts.push(c.toDataURL().slice(-50));
    } catch { parts.push('nc'); }

    const raw = parts.join('||');
    const buf = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(raw)
    );
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 32);
  } catch(e) {
    return 'fp_' + Math.random().toString(36).slice(2, 18);
  }
}
