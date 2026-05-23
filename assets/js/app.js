// ── TOAST ──────────────────────────────────────────────
const toastWrap = document.createElement('div');
toastWrap.id = 'toast-wrap';
document.body.appendChild(toastWrap);

export function toast(msg, type = 'info', ms = 3200) {
  const icons = { ok: '✅', err: '❌', warn: '⚠️', info: 'ℹ️' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type] || icons.info}</span><span>${msg}</span>`;
  toastWrap.appendChild(el);
  setTimeout(() => {
    el.style.animation = 'tOut .28s ease forwards';
    setTimeout(() => el.remove(), 300);
  }, ms);
}

// ── LOADER ─────────────────────────────────────────────
const loaderEl = document.createElement('div');
loaderEl.id = 'gloader';
loaderEl.innerHTML = `<div class="sp"></div><p id="gl-txt">Loading...</p>`;
document.body.appendChild(loaderEl);

export function showLoader(txt = 'Loading...') {
  document.getElementById('gl-txt').textContent = txt;
  loaderEl.style.display = 'flex';
}
export function hideLoader() { loaderEl.style.display = 'none'; }

// ── FORMAT ─────────────────────────────────────────────
export const bdt = n => '৳ ' + parseFloat(n || 0).toFixed(2);
export const num = n => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n || 0);
export const pct = (v, t) => t ? Math.round((v / t) * 100) : 0;

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
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── REFERRAL ───────────────────────────────────────────
export const refCode = uid => 'EP' + uid.slice(0, 6).toUpperCase();

// ── BADGE ──────────────────────────────────────────────
export function badgeCls(m) {
  return ({ free: 'b-free', bronze: 'b-bronze', silver: 'b-silver', gold: 'b-gold', diamond: 'b-diamond' })[m] || 'b-free';
}
export function badgeLbl(m) {
  return ({ free: '👤 Free', bronze: '🥉 Bronze Pro', silver: '🥈 Silver Pro', gold: '🥇 Gold Pro', diamond: '💎 Diamond' })[m] || '👤 Free';
}

// ── COPY ───────────────────────────────────────────────
export function copyText(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.innerHTML;
    btn.innerHTML = '✓'; btn.style.color = '#10b981';
    setTimeout(() => { btn.innerHTML = orig; btn.style.color = ''; }, 1500);
    toast('Copied!', 'ok', 1500);
  });
}

// ── MODAL ──────────────────────────────────────────────
export const openModal = id => document.getElementById(id)?.classList.add('open');
export const closeModal = id => document.getElementById(id)?.classList.remove('open');

// ── AUTH GUARD ─────────────────────────────────────────
import { auth } from '../firebase/firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

export function requireAuth(cb) {
  onAuthStateChanged(auth, u => {
    if (!u) { window.location.href = 'login.html'; return; }
    cb(u);
  });
}

// ── SETTINGS CACHE ─────────────────────────────────────
let _cfg = null;
export async function getSettings(db) {
  if (_cfg) return _cfg;
  const { getDocs, collection } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
  const snap = await getDocs(collection(db, 'settings'));
  _cfg = snap.empty ? { dailyBonus: 2, adReward: 1, referralBonus: 5, minWithdraw: 50, adCooldown: 30, siteName: 'EarnPro' } : snap.docs[0].data();
  return _cfg;
}
