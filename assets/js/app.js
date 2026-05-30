import { auth } from '../firebase/firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

/* ── TOAST ──────────────────────────────────────────── */
const _tw = document.createElement('div');
_tw.id = 'toast-wrap';
document.body.appendChild(_tw);

export function toast(msg, type = 'info', ms = 3200) {
  const icons = { ok: '✅', err: '❌', warn: '⚠️', info: 'ℹ️' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  _tw.appendChild(el);
  setTimeout(() => {
    el.style.animation = 'tOut .28s ease forwards';
    setTimeout(() => el.remove(), 300);
  }, ms);
}

/* ── LOADER ─────────────────────────────────────────── */
const _ld = document.createElement('div');
_ld.id = 'gloader';
_ld.innerHTML = `<div class="sp"></div><p id="gl-txt">Loading...</p>`;
document.body.appendChild(_ld);

export function showLoader(txt = 'Loading...') {
  const t = document.getElementById('gl-txt');
  if (t) t.textContent = txt;
  _ld.style.display = 'flex';
}
export function hideLoader() { _ld.style.display = 'none'; }

/* ── FORMAT ─────────────────────────────────────────── */
export const bdt = n => '৳ ' + parseFloat(n || 0).toFixed(2);
export const num = n =>
  n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' :
  n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n || 0);

export function ago(ts) {
  if (!ts) return '';
  const ms = Date.now() - (ts.seconds ? ts.seconds * 1000 : +ts);
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  return Math.floor(h / 24) + 'd ago';
}

export function fmtDate(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date((ts.seconds || 0) * 1000);
  return d.toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ── REFERRAL CODE ──────────────────────────────────── */
export const refCode = uid => 'EP' + uid.slice(0, 6).toUpperCase();

/* ── BADGE ──────────────────────────────────────────── */
export function badgeCls(m) {
  return ({ free: 'b-free', bronze: 'b-bronze', silver: 'b-silver', gold: 'b-gold', diamond: 'b-diamond' })[m] || 'b-free';
}
export function badgeLbl(m) {
  return ({ free: '👤 Free', bronze: '🥉 Bronze Pro', silver: '🥈 Silver Pro', gold: '🥇 Gold Pro', diamond: '💎 Diamond' })[m] || '👤 Free';
}

/* ── COPY ───────────────────────────────────────────── */
export function copyText(text, btn) {
  const _doCopy = () => {
    const orig = btn.innerHTML;
    btn.innerHTML = '✓';
    btn.style.color = '#10b981';
    setTimeout(() => { btn.innerHTML = orig; btn.style.color = ''; }, 1500);
    toast('Copied!', 'ok', 1500);
  };
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(_doCopy).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      _doCopy();
    });
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    _doCopy();
  }
}

/* ── MODAL ──────────────────────────────────────────── */
export const openModal  = id => document.getElementById(id)?.classList.add('open');
export const closeModal = id => document.getElementById(id)?.classList.remove('open');

/* ── SETTINGS CACHE ─────────────────────────────────── */
let _cfg = null;
export async function getSettings(db) {
  if (_cfg) return _cfg;
  try {
    const { getDocs, collection } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    const snap = await getDocs(collection(db, 'settings'));
    _cfg = snap.empty ? {} : snap.docs[0].data();
  } catch { _cfg = {}; }
  return Object.assign({ dailyBonus: 2, adReward: 1, referralBonus: 5, minWithdraw: 50, adCooldown: 30, siteName: 'EarnPro' }, _cfg);
}

/* ── AUTH GUARD (SINGLE-FIRE) ───────────────────────── */
// Calls cb(user) exactly once. Redirects to login if not authed.
// Uses location.replace so there is NO history entry → no back-button loop.
export function requireAuth(cb) {
  const unsub = onAuthStateChanged(auth, user => {
    unsub();                          // ← critical: unsubscribe immediately
    if (!user) { location.replace('login.html'); return; }
    cb(user);
  });
}
