'use strict';
// Генератор промокодов для Türkçe Quest. Та же подпись, что и в приложении.
// Доступ по паролю (меняй PASS на свой). Эта страница нигде не связана с приложением.
const PASS = 'goidin2026';
const PROMO_SALT = 'turkce-quest-promo-2026-goidin-ai';
const PROMO_TARGETS = ['ALL', 'realty', 'business', 'emergency'];
const TARGET_NAMES = { ALL: '💎 Весь премиум (все уроки)', realty: '🏠 Недвижимость', business: '💼 Деловые переговоры', emergency: '🚑 Экстренные ситуации' };
const PROMO_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function fnv32(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h >>> 0; }
function promoSig(p) { const n = fnv32(p + '|' + PROMO_SALT); let r = ''; for (let i = 0; i < 4; i++) r += PROMO_ALPHABET[(n >>> (i * 5)) & 31]; return r; }
function nonce() { let s = ''; for (let i = 0; i < 3; i++) s += PROMO_ALPHABET[Math.floor(Math.random() * 32)]; return s; }
function makeCode(target) { const tc = PROMO_ALPHABET[PROMO_TARGETS.indexOf(target)]; const p = tc + nonce(); const raw = p + promoSig(p); return 'TQ-' + raw.slice(0, 4) + '-' + raw.slice(4); }
const $ = (s) => document.querySelector(s);
function gate() {
  const ok = sessionStorage.getItem('promo-ok') === '1';
  if (ok) return show();
  document.body.innerHTML = `<div class="box"><h1>🔒 Генератор промокодов</h1>
    <input id="pass" type="password" placeholder="Пароль"><button id="go">Войти</button><p id="err"></p></div>`;
  $('#go').onclick = () => { if ($('#pass').value === PASS) { sessionStorage.setItem('promo-ok', '1'); show(); } else $('#err').textContent = 'Неверный пароль'; };
  $('#pass').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#go').click(); });
}
function show() {
  document.body.innerHTML = `<div class="box"><h1>🎟️ Генератор промокодов</h1>
    <label>Что открывает код:</label>
    <select id="target">${PROMO_TARGETS.map((t) => `<option value="${t}">${TARGET_NAMES[t]}</option>`).join('')}</select>
    <label>Сколько кодов:</label><input id="qty" type="number" value="10" min="1" max="500">
    <button id="gen">Сгенерировать</button>
    <button id="copy" style="display:none">📋 Скопировать всё</button>
    <pre id="out"></pre>
    <p class="note">Один код активируется один раз на одном телефоне. Эти коды — секретные, выдавай их только покупателям.</p></div>`;
  $('#gen').onclick = () => {
    const t = $('#target').value, q = Math.min(500, Math.max(1, +$('#qty').value || 1));
    const set = new Set(); while (set.size < q) set.add(makeCode(t));
    $('#out').textContent = [...set].join('\n');
    $('#copy').style.display = 'inline-block';
  };
  $('#copy').onclick = () => navigator.clipboard.writeText($('#out').textContent).then(() => { $('#copy').textContent = '✓ Скопировано'; setTimeout(() => $('#copy').textContent = '📋 Скопировать всё', 1500); });
}
gate();
