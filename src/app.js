'use strict';
const APP_VERSION = '1.5';
/* ===================== Türkçe Quest ===================== */

const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sample = (a, n) => shuffle(a).slice(0, n);
const todayKey = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

/* ---------- Награды ---------- */
const REWARD = {
  answer: 5,          // правильный ответ с первой попытки
  speech: 5,          // засчитанное произношение
  speechFirstTry: 3,  // бонус: произнёс с первой попытки
  perfectSpeech: 2,   // бонус: точность ≥ 90%
  lesson: 25,         // урок пройден
  perfectLesson: 25,  // без ошибок
  xpTask: 10,
  xpLesson: 50,
};

/* ---------- Состояние ---------- */
const STORE_KEY = 'turkce-quest-v1';
const DEFAULT_STATE = {
  coins: 30, totalCoins: 30, xp: 0,
  completed: {},            // lessonId -> { stars }
  owned: [],                // купленные паки/карточки
  streak: 0, lastDay: null, freezes: 0, doubleNext: false,
  stats: { lessons: 0, perfectSpeech: 0, speech: 0, tasks: 0, mistakes: 0 },
  achievements: [], sound: true, onboarded: false,
  inProgress: {},           // lessonId -> сохранённое место в уроке
  uid: null, refBy: null, refClaimed: false, referrals: [],  // реферальная программа
};
let S = load();
if (!S.uid) { S.uid = Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-3); save(); }
function load() {
  try { const raw = localStorage.getItem(STORE_KEY); if (raw) return deepMerge(structuredClone(DEFAULT_STATE), JSON.parse(raw)); } catch (e) {}
  return structuredClone(DEFAULT_STATE);
}
function deepMerge(base, add) {
  for (const k in add) {
    if (add[k] && typeof add[k] === 'object' && !Array.isArray(add[k]) && base[k] && typeof base[k] === 'object') deepMerge(base[k], add[k]);
    else base[k] = add[k];
  }
  return base;
}
function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(S)); } catch (e) {} }

/* ---------- Уровни ---------- */
function levelInfo(xp) {
  let lvl = 1, need = 100, rest = xp;
  while (rest >= need) { rest -= need; lvl++; need = Math.round(need * 1.25); }
  return { lvl, rest, need, rank: RANKS[Math.min(lvl - 1, RANKS.length - 1)] };
}

/* ---------- Серия дней ---------- */
function checkStreakDecay() {
  if (!S.lastDay) return;
  const last = new Date(S.lastDay.split('-')[0], S.lastDay.split('-')[1] - 1, S.lastDay.split('-')[2]);
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const diff = Math.round((now - last) / 86400000);
  if (diff <= 1) return;
  const missed = diff - 1;
  if (S.freezes >= missed) {
    S.freezes -= missed;
    const y = new Date(now); y.setDate(y.getDate() - 1); S.lastDay = todayKey(y);
    setTimeout(() => toast(`🧊 Заморозка спасла серию!`), 800);
  } else if (S.streak > 0) {
    S.streak = 0; setTimeout(() => toast('Серия сгорела 😢 Начнём новую!'), 800);
  }
  save();
}
function bumpStreak() {
  const t = todayKey();
  if (S.lastDay === t) return false;
  const y = new Date(); y.setDate(y.getDate() - 1);
  S.streak = (S.lastDay === todayKey(y)) ? S.streak + 1 : 1;
  S.lastDay = t;
  return true;
}

/* ---------- Монеты, XP ---------- */
let lessonCoinMult = 1;
function addCoins(n, el) {
  n = Math.round(n * lessonCoinMult);
  S.coins += n; S.totalCoins += n; save(); renderTop(); bump('#coinPill');
  if (el) flyText(`+${n} 🪙`, el);
  return n;
}
function addXp(n) {
  const before = levelInfo(S.xp).lvl;
  S.xp += n; save(); renderTop();
  const after = levelInfo(S.xp).lvl;
  if (after > before) setTimeout(() => { sfx('level'); toast(`⬆️ Новый уровень ${after}: ${levelInfo(S.xp).rank}!`); }, 300);
}
function spend(n) { if (S.coins < n) return false; S.coins -= n; save(); renderTop(); bump('#coinPill'); return true; }

/* ---------- Достижения ---------- */
function checkAchievements() {
  const has = (id) => S.achievements.includes(id);
  const coreDone = CORE_LESSONS.every((l) => S.completed[l.id]);
  const rules = {
    first_lesson: S.stats.lessons >= 1, five_lessons: S.stats.lessons >= 5, all_core: coreDone,
    speech10: S.stats.perfectSpeech >= 10, speech50: S.stats.perfectSpeech >= 50,
    perfect: !!S._perfectFlag, streak3: S.streak >= 3, streak7: S.streak >= 7,
    buyer: S.owned.length > 0 || !!S._boughtFlag, rich: S.totalCoins >= 1000,
  };
  let delay = 0;
  for (const a of ACHIEVEMENTS) {
    if (!has(a.id) && rules[a.id]) {
      S.achievements.push(a.id);
      S.coins += a.reward; S.totalCoins += a.reward;
      setTimeout(() => { sfx('level'); toast(`${a.emoji} Достижение «${a.title}» +${a.reward} 🪙`); renderTop(); }, 600 + delay);
      delay += 2600;
    }
  }
  delete S._perfectFlag; delete S._boughtFlag;
  save();
}

/* ---------- Звук ---------- */
let actx;
function sfx(type) {
  if (!S.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const seq = {
      ok: [[660, 0], [880, 0.09]], bad: [[220, 0], [180, 0.12]], coin: [[988, 0], [1319, 0.07]],
      level: [[523, 0], [659, 0.1], [784, 0.2], [1047, 0.3]], tap: [[500, 0]],
    }[type] || [];
    const t0 = actx.currentTime;
    seq.forEach(([f, t]) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type === 'bad' ? 'sawtooth' : 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0 + t); g.gain.exponentialRampToValueAtTime(0.18, t0 + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + t + 0.18);
      o.connect(g).connect(actx.destination); o.start(t0 + t); o.stop(t0 + t + 0.2);
    });
  } catch (e) {}
  if (navigator.vibrate) navigator.vibrate(type === 'bad' ? [60, 40, 60] : type === 'ok' ? 30 : 0);
}

/* ---------- Озвучка (TTS) ---------- */
let trVoice = null;
function pickVoice() {
  const vs = speechSynthesis.getVoices();
  trVoice = vs.find((v) => /^tr[-_]/i.test(v.lang) && /google/i.test(v.name)) || vs.find((v) => /^tr/i.test(v.lang)) || null;
}
if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
function say(text, slow = false) {
  if (!('speechSynthesis' in window)) { toast('Озвучка недоступна на этом устройстве'); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'tr-TR'; if (trVoice) u.voice = trVoice;
  u.rate = slow ? 0.55 : 0.9; u.pitch = 1;
  speechSynthesis.speak(u);
}

/* ---------- Проверка произношения ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const ONES = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const TENS = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
function numToTr(n) {
  if (n === 0) return 'sıfır';
  const out = [];
  const th = Math.floor(n / 1000) % 10, h = Math.floor(n / 100) % 10, t = Math.floor(n / 10) % 10, o = n % 10;
  if (th) out.push(th === 1 ? 'bin' : ONES[th] + ' bin');
  if (h) out.push(h === 1 ? 'yüz' : ONES[h] + ' yüz');
  if (t) out.push(TENS[t]);
  if (o) out.push(ONES[o]);
  return out.join(' ');
}
function norm(s) {
  s = String(s).toLocaleLowerCase('tr-TR');
  s = s.replace(/\d{1,4}/g, (m) => ' ' + numToTr(parseInt(m, 10)) + ' ');
  s = s.replace(/[’'`´]/g, '');
  s = s.replace(/[^a-zçğıöşüâîû\s]/g, ' ');
  return s.replace(/\s+/g, ' ').trim();
}
function deaccent(s) {
  return s.replace(/[çğıöşüâîû]/g, (c) => ({ ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', â: 'a', î: 'i', û: 'u' }[c]));
}
function lev(a, b) {
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
function similarity(heard, target) {
  const h = norm(heard), t = norm(target);
  if (!h) return 0;
  const sim = (a, b) => 1 - lev(a, b) / Math.max(a.length, b.length);
  const hs = h.replace(/ /g, ''), ts = t.replace(/ /g, '');
  let score = Math.max(sim(h, t), sim(hs, ts));
  score = Math.max(score, sim(deaccent(hs), deaccent(ts)) * 0.95);
  // распознаватель мог услышать фразу дважды или с лишним словом
  if (hs.includes(ts) && hs.length <= ts.length * 2.2) score = Math.max(score, 0.92);
  return Math.max(0, Math.min(1, score));
}
function passThreshold(target) { return norm(target).replace(/ /g, '').length <= 3 ? 0.66 : 0.75; }
// посимвольная подсветка — какие буквы распознаватель не услышал
function diffLetters(heard, target) {
  const h = deaccent(norm(heard));
  return [...target].map((ch) => {
    const n = norm(ch); if (!n) return esc(ch);
    return `<span class="${h.includes(deaccent(n)) ? 'ok' : 'bad'}">${esc(ch)}</span>`;
  }).join('');
}

let activeRec = null;
function listen({ onStart, onInterim, onDone, onError }) {
  if (!SR) { onError('unsupported'); return; }
  try { if (activeRec) activeRec.abort(); } catch (e) {}
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  const rec = new SR();
  activeRec = rec;
  rec.lang = 'tr-TR'; rec.interimResults = true; rec.maxAlternatives = 5; rec.continuous = false;
  let finals = [], interim = '', done = false;
  rec.onstart = () => onStart && onStart();
  rec.onresult = (e) => {
    interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) { for (let a = 0; a < r.length; a++) finals.push(r[a].transcript); }
      else interim += r[0].transcript;
    }
    onInterim && onInterim(finals[0] || interim);
  };
  rec.onerror = (e) => { if (done) return; if (e.error === 'no-speech' || e.error === 'aborted') return; done = true; onError(e.error); };
  rec.onend = () => {
    activeRec = null;
    if (done) return; done = true;
    const alts = finals.length ? finals : (interim ? [interim] : []);
    onDone(alts);
  };
  try { rec.start(); } catch (e) { done = true; onError('start'); }
}

/* ---------- UI helpers ---------- */
function toast(msg, ms = 2400) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), ms);
}
function bump(sel) { const el = $(sel); el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
function flyText(txt, el) {
  const r = el.getBoundingClientRect(); const f = document.createElement('div');
  f.className = 'fly'; f.textContent = txt; f.style.left = r.left + r.width / 2 - 30 + 'px'; f.style.top = r.top + 'px';
  document.body.appendChild(f); setTimeout(() => f.remove(), 1000);
}
function modal(html) { $('#modalCard').innerHTML = html; $('#modal').classList.remove('hidden'); }
function closeModal() { $('#modal').classList.add('hidden'); }
$('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });

function renderTop() {
  const li = levelInfo(S.xp);
  $('#lvlNum').textContent = li.lvl; $('#lvlRank').textContent = `${li.rank} · ${li.rest}/${li.need} XP`;
  $('#xpFill').style.width = (li.rest / li.need * 100) + '%';
  $('#coinNum').textContent = S.coins; $('#streakNum').textContent = S.streak;
}

/* ===================== ВКЛАДКИ ===================== */
let tab = 'map';
document.querySelectorAll('#tabbar button').forEach((b) => b.addEventListener('click', () => { sfx('tap'); showTab(b.dataset.tab); }));
function showTab(t) {
  tab = t;
  document.querySelectorAll('#tabbar button').forEach((b) => b.classList.toggle('active', b.dataset.tab === t));
  ({ map: renderMap, shop: renderShop, library: renderLibrary, profile: renderProfile })[t]();
  window.scrollTo(0, 0);
}
$('#coinPill').addEventListener('click', () => showTab('shop'));
$('#streakPill').addEventListener('click', () => modal(`<h2>🔥 Серия: ${S.streak} дн.</h2>
  <p>Проходи хотя бы один урок в день, чтобы серия росла. За 3 и 7 дней — достижения с монетами.</p>
  <p>🧊 Заморозок в запасе: <b>${S.freezes}</b></p>
  <div class="modal-actions"><button class="btn block" onclick="closeModal()">Понятно</button></div>`));

function lessonById(id) { return CORE_LESSONS.find((l) => l.id === id) || BONUS_LESSONS.find((l) => l.id === id); }
function isUnlocked(i) { return i === 0 || !!S.completed[CORE_LESSONS[i - 1].id]; }
function starsStr(n) { return '★'.repeat(n) + '☆'.repeat(3 - n); }

function renderMap() {
  const nextIdx = CORE_LESSONS.findIndex((l) => !S.completed[l.id]);
  const offsets = [0, 60, 80, 40, -30, -70, -50, 10, 60];
  const nodes = CORE_LESSONS.map((l, i) => {
    const done = S.completed[l.id], unlocked = isUnlocked(i), current = i === nextIdx;
    const cls = done ? 'done' : current ? 'current' : unlocked ? '' : 'locked';
    return `<div class="node ${cls}" style="transform:translateX(${offsets[i % offsets.length]}px)">
      ${progressLabel(l.id) ? `<div class="start-tag">▶ ${progressLabel(l.id)}</div>` : current ? '<div class="start-tag">Начать!</div>' : ''}
      <button class="node-btn" data-lesson="${l.id}" data-idx="${i}">${unlocked ? l.emoji : '🔒'}</button>
      <div class="node-title">${esc(l.title)}</div>
      <div class="node-stars" style="color:var(--gold)">${done ? starsStr(done.stars) : ''}</div>
    </div>`;
  }).join('');
  const bonus = BONUS_LESSONS.map((l) => {
    const owned = S.owned.includes(l.id), done = S.completed[l.id];
    return `<div class="bonus ${owned ? (done ? 'done' : '') : 'locked'}" data-bonus="${l.id}">
      <div class="em">${l.emoji}</div><div class="t">${esc(l.title)}</div><div class="s">${esc(l.subtitle)}</div>
      ${owned ? (progressLabel(l.id) ? `<div class="owned">▶ Продолжить ${progressLabel(l.id)}</div>` : done ? `<div style="color:var(--gold)">${starsStr(done.stars)}</div>` : '<div class="owned">Открыто ▶</div>') : `<div class="price">🔒 ${l.price} 🪙</div>`}
    </div>`;
  }).join('');
  const allDone = nextIdx === -1;
  $('#screen').innerHTML = `
    <div class="hero">
      <h1>Merhaba, ${allDone ? 'Sultan' : 'dostum'}! 🇹🇷</h1>
      <p>${allDone ? 'Все основы пройдены! Открывай бонусные паки в магазине.' : 'Отвечай, произноси вслух — и только чистое произношение открывает следующее задание.'}</p>
      ${allDone ? '<button class="btn" onclick="showTab(\'shop\')">В магазин</button>' : `<button class="btn" id="contBtn">▶ ${S.stats.lessons || savedProgress(CORE_LESSONS[nextIdx].id) ? 'Продолжить' : 'Начать'}</button>`}
    </div>
    ${SR ? '' : `<div class="warn">⚠️ Этот браузер не умеет распознавать речь. Открой приложение в <b>Google Chrome</b> на Android — без этого задания не засчитаются.${isAndroid() ? '<div style="margin-top:10px"><button class="btn small-btn" onclick="openInChrome()">Открыть в Chrome</button></div>' : ''}</div>`}
    ${inviteCard()}
    ${S.refBy && S.stats.lessons > 0 && !S.refClaimed ? '<div class="card row" onclick="showReferralConfirm()" style="border:2px solid var(--gold)"><div class="em">📨</div><div class="grow"><div class="t">Отправь подтверждение другу</div><div class="s">Он получит 100 🪙 за то, что пригласил тебя</div></div><div>›</div></div>' : ''}
    <h2 class="section">Основной путь</h2>
    <div class="path">${nodes}</div>
    <h2 class="section">Бонусные паки</h2>
    <p class="sub">Открываются за монеты в магазине</p>
    <div class="bonus-grid">${bonus}</div>`;
  const cb = $('#contBtn'); if (cb) cb.onclick = () => startLesson(CORE_LESSONS[nextIdx].id);
  document.querySelectorAll('.node-btn').forEach((b) => b.onclick = () => {
    const i = +b.dataset.idx;
    if (!isUnlocked(i)) { sfx('bad'); toast('🔒 Сначала пройди предыдущий урок'); return; }
    lessonPreview(lessonById(b.dataset.lesson));
  });
  document.querySelectorAll('[data-bonus]').forEach((b) => b.onclick = () => {
    const l = lessonById(b.dataset.bonus);
    if (S.owned.includes(l.id)) lessonPreview(l); else buyDialog(l, 'pack');
  });
}

function lessonPreview(l) {
  const done = S.completed[l.id], saved = savedProgress(l.id);
  modal(`<div style="text-align:center;font-size:60px">${l.emoji}</div>
    <h2 style="text-align:center">${esc(l.title)}</h2>
    <p style="text-align:center;color:var(--muted);margin-top:-6px">${esc(l.subtitle)} · ${l.items.length} фраз${done ? ' · ' + starsStr(done.stars) : ''}</p>
    <div class="card" style="box-shadow:none;border:2px solid var(--line)">
      ${l.items.slice(0, 4).map((it) => `<div style="padding:4px 0"><b style="color:var(--red)">${esc(it.tr)}</b> — ${esc(it.ru)}</div>`).join('')}
      ${l.items.length > 4 ? `<div style="color:var(--muted);padding-top:4px">…и ещё ${l.items.length - 4}</div>` : ''}
    </div>
    ${saved ? `<div class="card" style="box-shadow:none;border:2px solid var(--green);background:var(--ok-bg)">
        <div style="font-weight:900;color:var(--green-d)">💾 Ты остановился на задании ${saved.idx + 1} из ${saved.q.length}</div>
        <div class="progress" style="margin-top:8px;background:#fff"><div class="progress-fill" style="width:${saved.idx / saved.q.length * 100}%"></div></div></div>` : ''}
    ${S.doubleNext && !saved ? '<div class="tip">💰 Активен бустер: x2 монет за этот урок!</div>' : ''}
    <div class="modal-actions">
      <button class="btn block" id="goLesson">${saved ? '▶ Продолжить с места остановки' : done ? '🔁 Пройти заново' : '▶ Начать урок'}</button>
      ${saved ? '<button class="btn ghost block" id="restartLesson">🔄 Начать урок заново</button>' : ''}
      <button class="btn ghost block" onclick="closeModal()">Позже</button>
    </div>`);
  $('#goLesson').onclick = () => { closeModal(); startLesson(l.id); };
  if (saved) $('#restartLesson').onclick = () => {
    modal(`<div style="text-align:center;font-size:54px">🔄</div><h2 style="text-align:center">Начать «${esc(l.title)}» заново?</h2>
      <p style="text-align:center">Сохранённое место (задание ${saved.idx + 1} из ${saved.q.length}) сбросится, и урок начнётся с первой фразы. Монеты и звёзды останутся.</p>
      <div class="modal-actions"><button class="btn red block" id="yesRestart">Да, начать заново</button>
      <button class="btn ghost block" id="noRestart">Нет, продолжить с места</button></div>`);
    $('#yesRestart').onclick = () => { closeModal(); delete S.inProgress[l.id]; save(); startLesson(l.id, true); };
    $('#noRestart').onclick = () => { closeModal(); startLesson(l.id); };
  };
}

/* ---------- Магазин ---------- */
function renderShop() {
  const packRow = (l) => {
    const owned = S.owned.includes(l.id);
    return `<div class="card row"><div class="em">${l.emoji}</div>
      <div class="grow"><div class="t">${esc(l.title)}</div><div class="s">Урок-пак · ${l.items.length} фраз · ${esc(l.subtitle)}</div></div>
      ${owned ? '<div class="owned">✓ Есть</div>' : `<button class="btn gold small-btn" data-buy="${l.id}" data-kind="pack">${l.price} 🪙</button>`}</div>`;
  };
  const cardRow = (k) => {
    const owned = S.owned.includes(k.id);
    return `<div class="card row"><div class="em">${k.emoji}</div>
      <div class="grow"><div class="t">${esc(k.title)}</div><div class="s">Карточка знаний</div></div>
      ${owned ? `<button class="btn turq small-btn" data-read="${k.id}">Читать</button>` : `<button class="btn gold small-btn" data-buy="${k.id}" data-kind="card">${k.price} 🪙</button>`}</div>`;
  };
  const boostRow = (b) => `<div class="card row"><div class="em">${b.emoji}</div>
      <div class="grow"><div class="t">${esc(b.title)}</div><div class="s">${esc(b.desc)}${b.id === 'freeze' ? ` · есть: ${S.freezes}` : (S.doubleNext ? ' · уже активен' : '')}</div></div>
      <button class="btn gold small-btn" data-buy="${b.id}" data-kind="boost" ${b.id === 'double' && S.doubleNext ? 'disabled' : ''}>${b.price} 🪙</button></div>`;
  $('#screen').innerHTML = `
    <h2 class="section">Магазин знаний</h2>
    <p class="sub">У тебя ${S.coins} 🪙 — зарабатывай их на уроках и вкладывай в новые знания</p>
    <h2 class="section" style="font-size:18px">📦 Бонусные уроки</h2>${BONUS_LESSONS.map(packRow).join('')}
    <h2 class="section" style="font-size:18px">📚 Грамматика и культура</h2>${KNOWLEDGE.map(cardRow).join('')}
    <h2 class="section" style="font-size:18px">⚡ Бустеры</h2>${BOOSTERS.map(boostRow).join('')}`;
  bindShopButtons();
}
function bindShopButtons() {
  document.querySelectorAll('[data-buy]').forEach((b) => b.onclick = () => {
    const id = b.dataset.buy, kind = b.dataset.kind;
    const item = kind === 'pack' ? lessonById(id) : kind === 'card' ? KNOWLEDGE.find((k) => k.id === id) : BOOSTERS.find((x) => x.id === id);
    buyDialog(item, kind);
  });
  document.querySelectorAll('[data-read]').forEach((b) => b.onclick = () => openKnowledge(b.dataset.read));
}
function buyDialog(item, kind) {
  const can = S.coins >= item.price;
  modal(`<div style="text-align:center;font-size:60px">${item.emoji}</div>
    <h2 style="text-align:center">${esc(item.title)}</h2>
    <p style="text-align:center">${kind === 'pack' ? `Новый урок: ${esc(item.subtitle)} (${item.items.length} фраз)` : kind === 'card' ? 'Карточка знаний — откроется в разделе «Знания»' : esc(item.desc)}</p>
    <p style="text-align:center;font-size:22px;font-weight:900;color:var(--gold-d)">${item.price} 🪙</p>
    ${can ? '' : `<p style="text-align:center;color:var(--wrong)">Не хватает ${item.price - S.coins} 🪙 — пройди ещё урок!</p>`}
    <div class="modal-actions">
      <button class="btn gold block" id="confirmBuy" ${can ? '' : 'disabled'}>Купить</button>
      <button class="btn ghost block" onclick="closeModal()">Отмена</button>
    </div>`);
  $('#confirmBuy').onclick = () => {
    if (!spend(item.price)) return;
    if (kind === 'boost') { if (item.id === 'freeze') S.freezes++; else S.doubleNext = true; S._boughtFlag = true; }
    else S.owned.push(item.id);
    save(); sfx('coin'); closeModal(); confetti(60);
    toast(`${item.emoji} «${item.title}» — твоё!`);
    checkAchievements();
    if (kind === 'card') setTimeout(() => openKnowledge(item.id), 400);
    else if (kind === 'pack') setTimeout(() => lessonPreview(item), 400);
    showTab(tab);
  };
}

/* ---------- Знания ---------- */
function renderLibrary() {
  const owned = KNOWLEDGE.filter((k) => S.owned.includes(k.id));
  const locked = KNOWLEDGE.filter((k) => !S.owned.includes(k.id));
  const words = [...CORE_LESSONS, ...BONUS_LESSONS].filter((l) => S.completed[l.id]).flatMap((l) => l.items);
  $('#screen').innerHTML = `
    <h2 class="section">Мои знания</h2>
    <p class="sub">Открытые карточки и выученный словарь</p>
    ${owned.length ? owned.map((k) => `<div class="card row" data-read="${k.id}"><div class="em">${k.emoji}</div><div class="grow"><div class="t">${esc(k.title)}</div><div class="s">Нажми, чтобы читать</div></div><div>›</div></div>`).join('')
      : '<div class="card" style="text-align:center;color:var(--muted);font-weight:700">Пока пусто. Купи первую карточку в магазине 👇</div>'}
    ${locked.length ? `<h2 class="section" style="font-size:18px">🔒 Можно открыть</h2>
      ${locked.map((k) => `<div class="card row" style="opacity:.7"><div class="em">${k.emoji}</div><div class="grow"><div class="t">${esc(k.title)}</div></div><button class="btn gold small-btn" data-buy="${k.id}" data-kind="card">${k.price} 🪙</button></div>`).join('')}` : ''}
    <h2 class="section" style="font-size:18px">📖 Мой словарь · ${words.length}</h2>
    ${words.length ? `<div class="card">${words.map((w) => `<div class="row" style="padding:8px 0;border-bottom:1px solid var(--line)">
        <div class="grow"><b style="color:var(--red)">${esc(w.tr)}</b><div class="s">${esc(w.ru)} · [${esc(w.ph)}]</div></div>
        <button class="icon-btn" data-say="${esc(w.tr)}">🔊</button></div>`).join('')}</div>`
      : '<div class="card" style="color:var(--muted);font-weight:700;text-align:center">Пройди урок — слова появятся здесь</div>'}`;
  bindShopButtons();
  document.querySelectorAll('.card[data-read]').forEach((c) => c.onclick = () => openKnowledge(c.dataset.read));
  document.querySelectorAll('[data-say]').forEach((b) => b.onclick = () => say(b.dataset.say));
}
function openKnowledge(id) {
  const k = KNOWLEDGE.find((x) => x.id === id);
  modal(`<div style="font-size:50px">${k.emoji}</div><h2>${esc(k.title)}</h2>${k.html}
    <div class="modal-actions"><button class="btn block" onclick="closeModal()">Ясно!</button></div>`);
  $('#modalCard').querySelectorAll('i').forEach((i) => { i.style.cursor = 'pointer'; i.onclick = () => say(i.textContent); });
}

/* ---------- Профиль ---------- */
function renderProfile() {
  const li = levelInfo(S.xp);
  const total = CORE_LESSONS.length + BONUS_LESSONS.length;
  const done = Object.keys(S.completed).length;
  $('#screen').innerHTML = `
    <div class="card" style="text-align:center">
      <div style="font-size:56px">🧑‍🚀</div>
      <div style="font-size:22px;font-weight:900">${li.rank}</div>
      <div style="color:var(--muted);font-weight:700">Уровень ${li.lvl} · ${S.xp} XP</div>
    </div>
    <div class="stats">
      <div class="stat"><b>${done}/${total}</b><span>уроков</span></div>
      <div class="stat"><b>${S.stats.speech}</b><span>произнесено</span></div>
      <div class="stat"><b>${S.stats.perfectSpeech}</b><span>идеально</span></div>
      <div class="stat"><b>${S.streak}🔥</b><span>серия</span></div>
      <div class="stat"><b>${S.totalCoins}</b><span>заработано 🪙</span></div>
      <div class="stat"><b>${S.owned.length}</b><span>покупок</span></div>
    </div>
    <h2 class="section">Достижения</h2>
    <div class="ach-grid">${ACHIEVEMENTS.map((a) => `<div class="ach ${S.achievements.includes(a.id) ? '' : 'off'}"><div class="em">${a.emoji}</div><div><div class="t">${esc(a.title)}</div><div class="s">${esc(a.desc)} · +${a.reward}🪙</div></div></div>`).join('')}</div>
    <h2 class="section">Настройки</h2>
    ${inviteCard()}
    <div class="card row"><div class="grow"><div class="t">Звуки и вибрация</div></div><button class="btn ${S.sound ? 'turq' : 'ghost'} small-btn" id="sndBtn">${S.sound ? 'Вкл' : 'Выкл'}</button></div>
    <div class="card row"><div class="grow"><div class="t">Проверить микрофон</div><div class="s">Скажи «Merhaba»</div></div><button class="btn turq small-btn" id="micTest">🎙️ Тест</button></div>
    <div class="card row"><div class="grow"><div class="t">Как установить на телефон</div></div><button class="btn ghost small-btn" id="howInstall">?</button></div>
    <div class="card row"><div class="grow"><div class="t" style="color:var(--wrong)">Сбросить прогресс</div></div><button class="btn red small-btn" id="resetBtn">Сброс</button></div>
    <p class="sub" style="text-align:center;margin-top:20px">Türkçe Quest v${APP_VERSION} · by goidin.ai</p>`;
  $('#sndBtn').onclick = () => { S.sound = !S.sound; save(); renderProfile(); };
  $('#howInstall').onclick = installHelp;
  $('#resetBtn').onclick = () => { modal(`<h2>Сбросить всё?</h2><p>Монеты, уровни и покупки обнулятся. Отменить нельзя.</p>
    <div class="modal-actions"><button class="btn red block" id="yesReset">Да, сбросить</button><button class="btn ghost block" onclick="closeModal()">Отмена</button></div>`);
  setTimeout(() => { const y = $('#yesReset'); if (y) y.onclick = () => { localStorage.removeItem(STORE_KEY); location.reload(); }; }); };
  $('#micTest').onclick = () => {
    const b = $('#micTest'); b.textContent = '👂 Слушаю...';
    listen({
      onDone: (alts) => { b.textContent = '🎙️ Тест'; const sc = Math.max(0, ...alts.map((a) => similarity(a, 'Merhaba'))); toast(alts.length ? `Услышал: «${alts[0]}» · ${Math.round(sc * 100)}%` : 'Ничего не услышал 🤔'); },
      onError: (er) => { b.textContent = '🎙️ Тест'; micError(er); },
    });
  };
}
function installHelp() {
  modal(`<h2>📲 Установка на Android</h2>
    <ol><li>Открой эту страницу в <b>Google Chrome</b>.</li>
    <li>Нажми <b>⋮</b> (меню справа вверху) → <b>«Установить приложение»</b> или <b>«Добавить на главный экран»</b>.</li>
    <li>На рабочем столе появится иконка <b>Türkçe Quest</b> — запускай как обычное приложение.</li>
    <li>При первом задании разреши доступ к <b>микрофону</b>.</li></ol>
    <p>💡 Если турецкая озвучка молчит: Настройки Android → Синтез речи (Google) → Установить голосовые данные → <b>Türkçe</b>.</p>
    <div class="modal-actions"><button class="btn block" onclick="closeModal()">Понятно</button></div>`);
}
function micError(er) {
  const msg = {
    unsupported: 'Браузер не поддерживает распознавание речи. Открой в Google Chrome.',
    'not-allowed': 'Нет доступа к микрофону. Разреши его: 🔒 в адресной строке → Разрешения → Микрофон.',
    'service-not-allowed': 'Распознавание речи заблокировано. Проверь, что открыто в Chrome, а не во встроенном браузере.',
    network: 'Нужен интернет — распознавание речи работает через Google.',
    'audio-capture': 'Микрофон не найден или занят другим приложением.',
    'language-not-supported': 'Турецкий не поддерживается распознавателем. Обнови Google-приложение/Chrome.',
  }[er] || 'Ошибка микрофона: ' + er;
  toast('🎙️ ' + msg, 4500);
}

/* ===================== УРОК ===================== */
let L = null; // текущий урок

function buildQueue(lesson) {
  const items = lesson.items;
  const q = items.map((item) => ({ type: 'learn', item }));
  const practice = shuffle(items).map((item) => ({ type: pickType(item, lesson), item }));
  return q.concat(practice);
}
function pickType(item, lesson) {
  const words = item.tr.split(/\s+/).length;
  const types = ['choose_ru', 'choose_tr', 'listen'];
  if (words >= 2 && lesson.items.length >= 4) types.push('build', 'build');
  return types[Math.floor(Math.random() * types.length)];
}

// Сохранение места в уроке — после каждого шага
function persistLesson(skip = 0) { // skip=1: текущее задание уже засчитано
  if (!L) return;
  const items = L.lesson.items;
  S.inProgress[L.lesson.id] = {
    q: L.queue.map((t) => ({ t: t.type, i: items.indexOf(t.item), a: t.answered ? 1 : 0 })),
    idx: L.idx + skip, mistakes: L.mistakes, combo: L.combo, maxCombo: L.maxCombo, coins: L.coins, xp: L.xp,
    perfectSpeech: L.perfectSpeech, speechCount: L.speechCount, mult: lessonCoinMult, n: items.length,
  };
  save();
}
function savedProgress(id) {
  const p = S.inProgress[id], l = lessonById(id);
  // если содержание урока изменилось в обновлении — старое сохранение не используем
  if (!p || !l || p.n !== l.items.length || !Array.isArray(p.q) || p.q.some((x) => !l.items[x.i])) return null;
  return p;
}
function progressLabel(id) { const p = savedProgress(id); return p ? `${Math.min(p.idx + 1, p.q.length)}/${p.q.length}` : ''; }

function startLesson(id, restart = false) {
  if (!SR) {
    modal(`<h2>🎙️ Нужен Google Chrome</h2><p>В этом приложении каждое задание засчитывается только после правильного произношения. Этот браузер не умеет распознавать речь.</p>
      <p>Открой ссылку в <b>Chrome на Android</b> (или Chrome/Edge на компьютере).</p>
      <div class="modal-actions"><button class="btn block" onclick="closeModal()">Понятно</button></div>`);
    return;
  }
  const lesson = lessonById(id);
  const saved = restart ? null : savedProgress(id);
  if (saved) {
    lessonCoinMult = saved.mult || 1;
    L = { lesson, queue: saved.q.map((x) => ({ type: x.t, item: lesson.items[x.i], answered: !!x.a })), idx: saved.idx,
      mistakes: saved.mistakes, combo: saved.combo, maxCombo: saved.maxCombo, coins: saved.coins, xp: saved.xp,
      perfectSpeech: saved.perfectSpeech, speechCount: saved.speechCount };
    setTimeout(() => toast(`▶ Продолжаем с задания ${saved.idx + 1} из ${saved.q.length}`), 300);
  } else {
    lessonCoinMult = S.doubleNext ? 2 : 1;
    if (S.doubleNext) { S.doubleNext = false; }
    L = { lesson, queue: buildQueue(lesson), idx: 0, mistakes: 0, combo: 0, maxCombo: 0, coins: 0, xp: 0, perfectSpeech: 0, speechCount: 0 };
  }
  persistLesson();
  $('#lesson').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  renderTask();
}
$('#quitBtn').onclick = () => {
  modal(`<h2>Сделать паузу?</h2><p>💾 Место сохранено — в следующий раз продолжишь ровно с этого задания. Монеты останутся при тебе.</p>
    <div class="modal-actions"><button class="btn block" onclick="closeModal()">Продолжить урок</button>
    <button class="btn ghost block" id="reallyQuit">Выйти в меню</button></div>`);
  $('#reallyQuit').onclick = () => { closeModal(); exitLesson(); };
};
function exitLesson() {
  try { if (activeRec) activeRec.abort(); } catch (e) {}
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  $('#lesson').classList.add('hidden'); document.body.style.overflow = '';
  lessonCoinMult = 1; L = null; showTab('map');
  if (updateReady) location.reload();
}
function setProgress() {
  $('#lessonProgress').style.width = (L.idx / L.queue.length * 100) + '%';
  $('#combo').textContent = L.combo >= 2 ? `🔥x${L.combo}` : '';
}
function foot(html, cls = '') { const f = $('#lessonFoot'); f.className = 'lesson-foot ' + cls; f.innerHTML = html; }

function renderTask() {
  setProgress();
  const task = L.queue[L.idx];
  if (!task) return finishLesson();
  task.attempts = 0;
  if (task.answered && task.type !== 'learn') return renderSpeak(task, false);
  const { item } = task;
  const body = $('#lessonBody');
  const others = L.lesson.items.filter((x) => x !== item);

  if (task.type === 'learn') {
    body.innerHTML = `<div class="task-label">✨ Новая фраза</div>
      <div class="word-card"><div class="tr">${esc(item.tr)}</div><div class="ph">[${esc(item.ph)}]</div><div class="ru">${esc(item.ru)}</div>
      <div class="audio-row"><button class="audio-btn" id="p1">🔊</button><button class="audio-btn" id="p2">🐢</button></div></div>
      <p class="sub" style="text-align:center">Послушай и повтори вслух — без этого дальше не пройти 😉</p>`;
    $('#p1').onclick = () => say(item.tr); $('#p2').onclick = () => say(item.tr, true);
    setTimeout(() => say(item.tr), 350);
    foot(`<button class="btn block" id="toSpeak">🎙️ Произнести</button>`);
    $('#toSpeak').onclick = () => renderSpeak(task, true);
    return;
  }

  if (task.type === 'choose_ru' || task.type === 'choose_tr' || task.type === 'listen') {
    const toRu = task.type !== 'choose_tr';
    const opts = shuffle([item, ...sample(others, 3)]);
    const label = task.type === 'listen' ? '🎧 Послушай и выбери перевод' : toRu ? '🧠 Выбери перевод' : '🇹🇷 Как сказать по-турецки?';
    const q = task.type === 'listen'
      ? `<button class="audio-btn big" id="bigPlay">🔊</button><div style="text-align:center"><button class="btn ghost small-btn" id="slowPlay">🐢 медленно</button></div><div style="height:16px"></div>`
      : `<div class="task-q">${toRu ? `«<span style="color:var(--red)">${esc(item.tr)}</span>»` : `«${esc(item.ru)}»`}</div>`;
    body.innerHTML = `<div class="task-label">${label}</div>${q}
      <div class="options">${opts.map((o, i) => `<button class="opt" data-i="${i}">${esc(toRu ? o.ru : o.tr)}</button>`).join('')}</div>`;
    if (task.type === 'listen') { $('#bigPlay').onclick = () => say(item.tr); $('#slowPlay').onclick = () => say(item.tr, true); setTimeout(() => say(item.tr), 350); }
    let sel = -1;
    body.querySelectorAll('.opt').forEach((b) => b.onclick = () => {
      sfx('tap'); body.querySelectorAll('.opt').forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); sel = +b.dataset.i;
      if (!toRu) say(opts[sel].tr);
      $('#checkBtn').disabled = false;
    });
    foot(`<button class="btn block" id="checkBtn" disabled>Проверить</button>`);
    $('#checkBtn').onclick = () => {
      const right = opts[sel] === item;
      body.querySelectorAll('.opt').forEach((b, i) => { b.disabled = true; if (opts[i] === item) b.classList.add('right'); else if (i === sel) b.classList.add('wrong'); });
      answerResult(task, right);
    };
    return;
  }

  if (task.type === 'build') {
    const words = item.tr.split(/\s+/);
    const extra = sample([...new Set(others.flatMap((o) => o.tr.split(/\s+/)))].filter((w) => !words.includes(w)), 2);
    const pool = shuffle([...words, ...extra]).map((w, i) => ({ w, i }));
    const picked = [];
    body.innerHTML = `<div class="task-label">🧩 Собери фразу по-турецки</div>
      <div class="task-q">«${esc(item.ru)}»</div>
      <div class="build-zone" id="zone"></div><div class="chips" id="pool"></div>`;
    const draw = () => {
      $('#zone').innerHTML = picked.map((p) => `<button class="chip" data-z="${p.i}">${esc(p.w)}</button>`).join('');
      $('#pool').innerHTML = pool.map((p) => `<button class="chip ${picked.includes(p) ? 'used' : ''}" data-p="${p.i}">${esc(p.w)}</button>`).join('');
      $('#zone').querySelectorAll('[data-z]').forEach((b) => b.onclick = () => { sfx('tap'); picked.splice(picked.findIndex((p) => p.i === +b.dataset.z), 1); draw(); });
      $('#pool').querySelectorAll('[data-p]').forEach((b) => b.onclick = () => { const p = pool.find((x) => x.i === +b.dataset.p); if (picked.includes(p)) return; sfx('tap'); picked.push(p); say(p.w); draw(); });
      const cb = $('#checkBtn'); if (cb) cb.disabled = picked.length === 0;
    };
    foot(`<button class="btn block" id="checkBtn" disabled>Проверить</button>`);
    draw();
    $('#checkBtn').onclick = () => {
      const strip = (s) => norm(s);
      const right = strip(picked.map((p) => p.w).join(' ')) === strip(item.tr);
      answerResult(task, right);
    };
  }
}

function answerResult(task, right) {
  const { item } = task;
  task.answered = true;
  if (right) {
    sfx('ok'); L.combo++; L.maxCombo = Math.max(L.maxCombo, L.combo);
    const bonus = Math.min(L.combo - 1, 3);
    L.coins += addCoins(REWARD.answer + bonus, $('#lessonFoot')); L.xp += REWARD.xpTask; addXp(REWARD.xpTask);
    foot(`<div class="feedback ok">✅ Верно!${bonus ? ` Комбо +${bonus}🪙` : ''}</div>
      <button class="btn block" id="toSpeak">🎙️ Теперь произнеси</button>`, 'ok');
    $('#toSpeak').onclick = () => renderSpeak(task, false);
    persistLesson();
  } else {
    sfx('bad'); L.mistakes++; L.combo = 0; S.stats.mistakes++; save();
    // повторим это слово в конце урока
    L.queue.push({ type: pickType(item, L.lesson), item });
    persistLesson();
    foot(`<div class="feedback bad">❌ Не совсем<small>Правильно: <b>${esc(item.tr)}</b> — ${esc(item.ru)}</small></div>
      <button class="btn red block" id="toSpeak">🎙️ Произнеси правильный вариант</button>`, 'bad');
    $('#toSpeak').onclick = () => renderSpeak(task, false);
  }
  setProgress();
}

function renderSpeak(task, fromLearn) {
  const { item } = task;
  const body = $('#lessonBody');
  body.innerHTML = `<div class="speak-wrap">
      <div class="speak-badge">🎙️ ПРОВЕРКА ПРОИЗНОШЕНИЯ</div>
      <div class="word-card" style="width:100%"><div class="tr">${esc(item.tr)}</div><div class="ph">[${esc(item.ph)}]</div><div class="ru">${esc(item.ru)}</div>
        <div class="audio-row"><button class="audio-btn" id="p1">🔊</button><button class="audio-btn" id="p2">🐢</button></div></div>
      <button class="mic" id="micBtn">🎙️</button>
      <div class="mic-hint" id="micHint">Нажми и скажи фразу</div>
      <div class="heard" id="heard"></div>
      <div id="scoreBox"></div>
    </div>`;
  $('#p1').onclick = () => say(item.tr); $('#p2').onclick = () => say(item.tr, true);
  foot(`<button class="btn block" id="nextBtn" disabled>🔒 Дальше — после произношения</button>`);
  const micBtn = $('#micBtn');
  let listening = false;
  micBtn.onclick = () => {
    if (listening) { try { activeRec && activeRec.stop(); } catch (e) {} return; }
    listening = true; micBtn.classList.add('listening'); micBtn.textContent = '👂';
    $('#micHint').textContent = 'Говори...'; $('#heard').textContent = ''; $('#scoreBox').innerHTML = '';
    listen({
      onInterim: (t) => { $('#heard').textContent = '«' + t + '»'; },
      onDone: (alts) => { listening = false; resetMic(); evaluate(task, alts); },
      onError: (er) => { listening = false; resetMic(); micError(er); $('#micHint').textContent = 'Попробуй ещё раз'; },
    });
  };
  function resetMic() { micBtn.classList.remove('listening'); micBtn.textContent = '🎙️'; }
}

function evaluate(task, alts) {
  const { item } = task;
  task.attempts = (task.attempts || 0) + 1;
  if (!alts.length) {
    $('#micHint').textContent = 'Не расслышал 🤔 Говори чуть громче и ближе к телефону';
    $('#heard').textContent = '';
    return;
  }
  let best = alts[0], score = 0;
  for (const a of alts) { const s = similarity(a, item.tr); if (s > score) { score = s; best = a; } }
  const pct = Math.round(score * 100);
  const passed = score >= passThreshold(item.tr);
  $('#heard').textContent = '«' + best + '»';
  if (passed) {
    sfx('ok');
    const perfect = score >= 0.9;
    let earned = REWARD.speech;
    if (task.attempts === 1) earned += REWARD.speechFirstTry;
    if (perfect) { earned += REWARD.perfectSpeech; S.stats.perfectSpeech++; L.perfectSpeech++; }
    S.stats.speech++; L.speechCount++; save();
    $('#micHint').textContent = perfect ? 'Mükemmel! Как настоящий турок 🇹🇷' : 'Güzel! Засчитано 👍';
    $('#scoreBox').innerHTML = `<div class="score ok">🎯 Точность ${pct}% ${perfect ? '· ⭐ идеально' : ''}</div>`;
    L.coins += addCoins(earned, $('#scoreBox')); L.xp += REWARD.xpTask; addXp(REWARD.xpTask);
    $('#micBtn').disabled = true;
    persistLesson(1);
    foot(`<div class="feedback ok">🎉 Произношение засчитано! +${Math.round(earned * lessonCoinMult)}🪙</div><button class="btn block" id="nextBtn">Дальше →</button>`, 'ok');
    $('#nextBtn').onclick = () => { L.idx++; persistLesson(); renderTask(); };
  } else {
    sfx('bad');
    $('#micHint').textContent = task.attempts >= 2 ? 'Послушай медленно 🐢 и повтори по слогам' : 'Почти! Попробуй ещё раз';
    $('#scoreBox').innerHTML = `<div class="score bad">Точность ${pct}% · нужно ${Math.round(passThreshold(item.tr) * 100)}%</div>
      <div class="letters">${diffLetters(best, item.tr)}</div>
      ${task.attempts >= 2 ? `<div class="tip">💡 Подсказка: произноси как <b>[${esc(item.ph)}]</b>. Ударение обычно на последний слог.</div>` : ''}`;
    if (task.attempts === 3) setTimeout(() => say(item.tr, true), 400);
    foot(`<button class="btn block" id="nextBtn" disabled>🔒 Дальше — после произношения</button>`, 'bad');
  }
}

function finishLesson() {
  const lesson = L.lesson;
  delete S.inProgress[lesson.id];
  const stars = L.mistakes === 0 ? 3 : L.mistakes <= 2 ? 2 : 1;
  const prev = S.completed[lesson.id];
  let bonus = REWARD.lesson + (L.mistakes === 0 ? REWARD.perfectLesson : 0);
  L.coins += addCoins(bonus); addXp(REWARD.xpLesson); L.xp += REWARD.xpLesson;
  S.completed[lesson.id] = { stars: Math.max(stars, prev ? prev.stars : 0) };
  S.stats.lessons++;
  const refFirstLesson = S.stats.lessons === 1 && !!S.refBy;
  if (L.mistakes === 0) S._perfectFlag = true;
  const streakUp = bumpStreak();
  save(); renderTop();
  setProgress(); $('#lessonProgress').style.width = '100%';
  const acc = Math.round(L.speechCount ? (L.perfectSpeech / L.speechCount) * 100 : 0);
  const answers = L.queue.filter((t) => t.type !== 'learn').length, correct = answers - L.mistakes;
  const err = (n) => n === 1 ? 'ошибка' : n < 5 ? 'ошибки' : 'ошибок';
  const starsWhy = stars === 3
    ? '⭐⭐⭐ — все ответы верные с первой попытки!'
    : `Звёзды даются за ответы: в этот раз ${L.mistakes} ${err(L.mistakes)}. Пройди урок без ошибок — получишь ⭐⭐⭐`;
  $('#lessonBody').innerHTML = `<div class="finish">
    <div class="big-em">${stars === 3 ? '🏆' : stars === 2 ? '🎉' : '👏'}</div>
    <h1>${stars === 3 ? 'Mükemmel!' : stars === 2 ? 'Harika!' : 'Aferin!'}</h1>
    <p class="sub">Урок «${esc(lesson.title)}» пройден${L.mistakes === 0 ? ' без ошибок' : ''}</p>
    <div class="stars" style="color:var(--gold)">${starsStr(stars)}</div>
    <div class="stars-why">${starsWhy}</div>
    <div class="reward-grid">
      <div class="reward c"><b>+${L.coins}</b>🪙 монет</div>
      <div class="reward x"><b>+${L.xp}</b>✨ XP</div>
      <div class="reward ${L.mistakes ? 'o' : 'a'}"><b>${correct}/${answers}</b>🧠 ответы верно</div>
      <div class="reward a"><b>${acc}%</b>🎙️ произношение идеально</div>
    </div>
    ${streakUp ? `<div class="tip">🔥 Серия: ${S.streak} ${S.streak === 1 ? 'день' : 'дн.'} подряд! Возвращайся завтра.</div>` : ''}
    ${lessonCoinMult > 1 ? '<div class="tip">💰 Бустер x2 сработал!</div>' : ''}
    ${L.maxCombo >= 3 ? `<div class="tip">⚡ Лучшее комбо: x${L.maxCombo}</div>` : ''}
  </div>`;
  foot(`<button class="btn block" id="doneBtn">Продолжить</button>`);
  sfx('level'); confetti(160);
  $('#doneBtn').onclick = () => { exitLesson(); checkAchievements(); if (refFirstLesson) setTimeout(showReferralConfirm, 700); };
}

/* ---------- Конфетти ---------- */
function confetti(n = 120) {
  const c = $('#confetti'), ctx = c.getContext('2d');
  c.width = innerWidth * devicePixelRatio; c.height = innerHeight * devicePixelRatio; ctx.scale(devicePixelRatio, devicePixelRatio);
  const colors = ['#E30A17', '#FFB800', '#14B8A6', '#22C55E', '#ffffff', '#FF7A59'];
  const ps = Array.from({ length: n }, () => ({ x: innerWidth / 2 + (Math.random() - 0.5) * 80, y: innerHeight * 0.35, vx: (Math.random() - 0.5) * 14,
    vy: -Math.random() * 14 - 4, s: Math.random() * 7 + 4, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: colors[Math.floor(Math.random() * colors.length)] }));
  let f = 0;
  (function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ps.forEach((p) => { p.vy += 0.38; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); });
    if (++f < 150) requestAnimationFrame(tick); else ctx.clearRect(0, 0, innerWidth, innerHeight);
  })();
}

/* ---------- Онбординг ---------- */
function onboarding() {
  modal(`<div style="text-align:center;font-size:64px">🇹🇷</div>
    <h2 style="text-align:center">Hoş geldin в Türkçe Quest!</h2>
    <p>Правила простые:</p>
    <ul>
      <li>🧠 Отвечаешь на задание</li>
      <li>🎙️ <b>Произносишь фразу вслух</b> — приложение проверяет произношение</li>
      <li>🔓 Только после правильного произношения открывается следующее задание</li>
      <li>🪙 За всё получаешь монеты, тратишь их в <b>магазине знаний</b> на новые уроки и грамматику</li>
      <li>🔥 Занимайся каждый день — растёт серия</li>
    </ul>
    <p>На старт держи <b>30 🪙</b>.</p>
    <div class="modal-actions">
      <button class="btn block" id="allowMic">🎙️ Разрешить микрофон и начать</button>
      <button class="btn ghost block" id="howI">📲 Как установить на телефон</button>
    </div>`);
  $('#howI').onclick = installHelp;
  $('#allowMic').onclick = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const st = await navigator.mediaDevices.getUserMedia({ audio: true }); st.getTracks().forEach((t) => t.stop());
      }
      toast('🎙️ Микрофон готов! Yallah!');
    } catch (e) { micError('not-allowed'); }
    S.onboarded = true; save(); closeModal();
  };
}

/* ---------- Реферальная программа ---------- */
// Без сервера: друг приходит по ?ref=<uid>, проходит первый урок и отправляет
// пригласившему ссылку-подтверждение ?claim=<ref>.<friend>.<sig>. Открыв её,
// пригласивший получает награду (один раз за каждого друга).
const REF_REWARD = 100;      // пригласившему
const REF_WELCOME = 50;      // новичку, пришедшему по ссылке
const REF_SALT = 'turkce-quest-ref-2026';
function refSig(ref, friend) {
  let h = 0x811c9dc5; const str = ref + '|' + friend + '|' + REF_SALT;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(36);
}
const appBase = () => location.origin + location.pathname.replace(/index\.html$/, '');
const inviteLink = () => `${appBase()}?ref=${S.uid}`;
const claimLink = () => `${appBase()}?claim=${S.refBy}.${S.uid}.${refSig(S.refBy, S.uid)}`;
const isAndroid = () => /android/i.test(navigator.userAgent);
function openInChrome() {
  location.href = `intent://${location.host}${location.pathname}${location.search}#Intent;scheme=https;package=com.android.chrome;end`;
}
async function shareLink(url, text) {
  if (navigator.share) { try { await navigator.share({ title: 'Türkçe Quest', text, url }); return; } catch (e) { if (e.name === 'AbortError') return; } }
  try { await navigator.clipboard.writeText(`${text}\n${url}`); toast('📋 Ссылка скопирована — вставь её в мессенджер'); }
  catch (e) { prompt('Скопируй ссылку:', url); }
}
function inviteCard() {
  const n = S.referrals.length;
  return `<div class="card" style="background:linear-gradient(135deg,#FFF4D6,#FFE6B8);border:2px solid #FFD27A">
    <div class="row"><div class="em" style="background:#fff">🎁</div>
      <div class="grow"><div class="t">Пригласи друга — получи ${REF_REWARD} 🪙</div>
      <div class="s" style="color:#7A5A00">Друг проходит первый урок и присылает тебе подтверждение${n ? ` · приглашено: <b>${n}</b>` : ''}</div></div></div>
    <button class="btn gold block" style="margin-top:12px" onclick="inviteFriend()">📤 Пригласить друга</button></div>`;
}
function inviteFriend() {
  shareLink(inviteLink(), `Учу турецкий в игре Türkçe Quest 🇹🇷 Проверка произношения, монеты, уровни. Заходи по моей ссылке — получишь +${REF_WELCOME} 🪙 на старте:`);
}
function showReferralConfirm() {
  if (!S.refBy) return;
  modal(`<div style="text-align:center;font-size:60px">📨</div>
    <h2 style="text-align:center">Порадуй друга!</h2>
    <p style="text-align:center">Ты прошёл первый урок 🎉 Отправь подтверждение тому, кто тебя пригласил — он получит <b>${REF_REWARD} 🪙</b>.</p>
    <p class="sub" style="text-align:center">Другу нужно просто открыть ссылку на своём телефоне.</p>
    <div class="modal-actions">
      <button class="btn gold block" id="sendClaim">📤 Отправить подтверждение</button>
      <button class="btn ghost block" onclick="closeModal()">Позже</button>
    </div>`);
  $('#sendClaim').onclick = async () => {
    await shareLink(claimLink(), `Я прошёл первый урок в Türkçe Quest 🇹🇷 Открой ссылку — заберёшь свои ${REF_REWARD} 🪙 за приглашение:`);
    S.refClaimed = true; save(); closeModal(); if (tab === 'map') renderMap();
  };
}
function handleReferralParams() {
  const q = new URLSearchParams(location.search);
  const ref = q.get('ref'), claim = q.get('claim');
  if (!ref && !claim) return;
  history.replaceState(null, '', location.pathname); // убираем параметры из адреса
  if (ref && /^[a-z0-9]{4,20}$/.test(ref)) {
    if (ref === S.uid) { setTimeout(() => toast('Это твоя же ссылка 😄 Отправь её другу!'), 500); }
    else if (!S.refBy && S.stats.lessons === 0) {
      S.refBy = ref; S.coins += REF_WELCOME; S.totalCoins += REF_WELCOME; save(); renderTop();
      setTimeout(() => toast(`🎁 Тебя пригласил друг: +${REF_WELCOME} 🪙! Пройди первый урок — и друг тоже получит бонус`, 4000), S.onboarded ? 500 : 6000);
    }
  }
  if (claim) {
    const [r, f, sig] = claim.split('.');
    let msg;
    if (r !== S.uid) msg = '🤔 Это подтверждение для другого игрока. Открой ссылку на телефоне того, кто приглашал.';
    else if (!f || f === S.uid || sig !== refSig(r, f)) msg = '⚠️ Ссылка-подтверждение повреждена';
    else if (S.referrals.includes(f)) msg = '✅ Награда за этого друга уже получена';
    if (msg) { setTimeout(() => toast(msg, 4000), 500); return; }
    S.referrals.push(f); save();
    setTimeout(() => {
      addCoins(REF_REWARD); sfx('level'); confetti(140);
      modal(`<div style="text-align:center;font-size:64px">🤝</div>
        <h2 style="text-align:center">Друг прошёл первый урок!</h2>
        <p style="text-align:center;font-size:22px;font-weight:900;color:var(--gold-d)">+${REF_REWARD} 🪙</p>
        <p style="text-align:center">Всего приглашено друзей: <b>${S.referrals.length}</b>. Зови ещё — каждый друг приносит ${REF_REWARD} 🪙.</p>
        <div class="modal-actions"><button class="btn gold block" onclick="closeModal();inviteFriend()">📤 Пригласить ещё</button>
        <button class="btn ghost block" onclick="closeModal()">Супер!</button></div>`);
      if (tab === 'map') renderMap();
    }, S.onboarded ? 400 : 300);
  }
}

/* ---------- Старт ---------- */
checkStreakDecay();
handleReferralParams();
renderTop();
showTab('map');
if (!S.onboarded) setTimeout(onboarding, 300);
/* ---------- Автообновление ---------- */
// Новая версия ставится сама: при запуске и при каждом возврате в приложение.
// Если обновление пришло посреди урока — применится после выхода из урока (место урока сохранено).
let updateReady = false;
function applyUpdate() { if (L) { updateReady = true; return; } location.reload(); }
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then((reg) => {
    const check = () => reg.update().catch(() => {});
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check(); });
    setInterval(check, 30 * 60 * 1000);
  }).catch(() => {});
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController) applyUpdate(); });
}
window.addEventListener('popstate', () => { if (L) exitLesson(); });
