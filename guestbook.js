/* ===== GUESTBOOK =====
   Visitors write a postcard and it is pinned to a board that everyone sees.
   Notes are kept in a free Supabase table (no server of your own, and no email).

   Fill in SUPABASE_URL and SUPABASE_KEY below to switch it on. While they are empty it runs
   in demo mode: sample cards, and notes only saved in the visitor's own browser. */

(function () {
  const SUPABASE_URL = 'https://igceyluuavulmbpamkgy.supabase.co';   // e.g. 'https://abcdxyz.supabase.co'
  const SUPABASE_KEY = 'sb_publishable_t82p9jFqqw_E9L24TR4vmg_j3uRHjgD';   // the public "anon" / "publishable" key (safe in the browser, the table rules protect it)

  const live = !!(SUPABASE_URL && SUPABASE_KEY);
  const board = document.getElementById('gbBoard');
  if (!board) return;

  const $ = function (id) { return document.getElementById(id); };
  function el(tag, cls, txt) { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
  const MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

  /* ---------- storage ---------- */
  const DEMO = [
    { name: 'Thandi', from: 'Johannesburg', text: 'Spent ten minutes dragging the photo around. Please never fix that.', at: Date.now() - 864e5 * 6 },
    { name: 'Marcus', from: 'Lisbon', text: 'Clean, quiet, and the vertical panels are a lovely touch.', at: Date.now() - 864e5 * 3 },
    { name: 'Aisha', from: 'Nairobi', text: 'Found you through a friend. Hello from the other side of the continent!', at: Date.now() - 864e5 }
  ];

  function api(path, opt) {
    opt = opt || {};
    const h = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' };
    if (SUPABASE_KEY.indexOf('eyJ') === 0) h.Authorization = 'Bearer ' + SUPABASE_KEY;   // only the older JWT-style anon key goes here; the newer sb_publishable_ key must not
    opt.headers = Object.assign(h, opt.headers || {});
    return fetch(SUPABASE_URL.replace(/\/+$/, '') + '/rest/v1/' + path, opt);
  }

  /* the cards written in THIS browser, each with a secret key that proves they are yours */
  function mine() { try { return JSON.parse(localStorage.getItem('guestbook:mine') || '{}'); } catch (e) { return {}; } }
  function setMine(m) { try { localStorage.setItem('guestbook:mine', JSON.stringify(m)); } catch (e) {} }

  /* where this visitor has dragged the cards to (their own browser only) */
  let saved = {};
  function loadPos() { try { return JSON.parse(localStorage.getItem('guestbook:pos') || '{}'); } catch (e) { return {}; } }
  function savePos(p) { try { localStorage.setItem('guestbook:pos', JSON.stringify(p)); } catch (e) {} }

  const Store = {
    async list() {
      if (live) {
        const r = await api('guestbook?select=id,name,place,message,created_at&order=created_at.desc&limit=60');
        if (!r.ok) throw new Error('load failed: ' + r.status + ' ' + (await r.text()));
        return (await r.json()).map(function (n) { return { id: n.id, name: n.name, from: n.place, text: n.message, at: Date.parse(n.created_at) }; });
      }
      let all = DEMO.slice();
      try { const s = localStorage.getItem('guestbook:cards'); if (s) all = JSON.parse(s); } catch (e) {}
      return all.map(function (n) { return Object.assign({ id: n.at }, n); });
    },
    async add(n) {                                   // returns the new card's id
      if (live) {
        const r = await api('guestbook?select=id', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ name: n.name, place: n.from || null, message: n.text, secret: n.secret }) });
        if (!r.ok) throw new Error('send failed: ' + r.status + ' ' + (await r.text()));
        return (await r.json())[0].id;
      }
      const all = await this.list(); all.push(n);
      try { localStorage.setItem('guestbook:cards', JSON.stringify(all)); } catch (e) {}
      return n.at;
    },
    async remove(id) {                               // only works with the secret key made when the card was written
      if (live) {
        const r = await api('rpc/delete_postcard', { method: 'POST', body: JSON.stringify({ p_id: id, p_secret: mine()[id] || '' }) });
        if (!r.ok) throw new Error('delete failed: ' + r.status + ' ' + (await r.text()));
        return;
      }
      const all = (await this.list()).filter(function (c) { return c.id !== id; });
      try { localStorage.setItem('guestbook:cards', JSON.stringify(all)); } catch (e) {}
    }
  };

  /* ---------- drawing the board ---------- */
  function card(n, isNew) {
    const h = hash(n.name + n.at);
    const d = new Date(n.at);
    const li = el('li', 'gb-card' + (isNew ? ' new' : ''));
    li.style.setProperty('--r', (((h % 61) - 30) / 10) + 'deg');
    li.style.setProperty('--y', ((h >> 3) % 22) + 'px');
    li.dataset.id = n.id;
    const p = saved[n.id];
    if (p) { li.style.setProperty('--dx', p[0] + 'px'); li.style.setProperty('--dy', p[1] + 'px'); }

    const stamp = el('span', 'gb-stamp'); stamp.setAttribute('aria-hidden', 'true'); stamp.append(el('i', '', n.name.charAt(0)));
    const pm = el('span', 'gb-pm'); pm.setAttribute('aria-hidden', 'true');
    pm.append(MON[d.getMonth()], document.createElement('br'), d.getDate() + ' ' + d.getFullYear());
    const l1 = el('div', 'gb-line'); l1.append(el('b', '', n.name));
    const l2 = el('div', 'gb-line'); l2.append(el('small', '', n.from || 'somewhere lovely'));
    const side = el('div', 'gb-side'); side.append(stamp, l1, l2);

    li.append(el('span', 'gb-pin'), el('div', 'gb-msg', n.text), pm, side);
    if (mine()[n.id]) {                              // a small x, only on cards you wrote in this browser
      const x = el('button', 'gb-x', '×');
      x.type = 'button';
      x.title = 'Take down my postcard';
      x.setAttribute('aria-label', 'Take down my postcard');
      x.addEventListener('click', function () { remove(n); });
      li.append(x);
    }
    return li;
  }

  function render(all, newestId) {
    saved = loadPos();
    board.textContent = '';
    $('gbCount').textContent = all.length + (all.length === 1 ? ' postcard so far' : ' postcards so far');
    if (!all.length) { board.append(el('li', 'gb-empty', 'The board is empty. Be the first to pin a card.')); return; }
    all.slice().sort(function (a, b) { return b.at - a.at; }).forEach(function (n) { board.append(card(n, n.id === newestId)); });
    keepInside();
  }

  async function remove(n) {
    if (!confirm('Take down your postcard?')) return;
    try {
      await Store.remove(n.id);
      const m = mine(); delete m[n.id]; setMine(m);
      render(await Store.list());
    } catch (err) {
      console.error('Guestbook:', err);
      alert('Couldn’t take it down right now. Please try again in a moment.');
    }
  }

  /* ---------- drag the postcards around the board ---------- */
  let topZ = 5, drag = null;

  function getOff(li) { return [parseFloat(li.style.getPropertyValue('--dx')) || 0, parseFloat(li.style.getPropertyValue('--dy')) || 0]; }

  function setOff(li, x, y) {                       // keeps the card inside the board
    const m = 8;
    const minX = m - li.offsetLeft, maxX = board.clientWidth - li.offsetLeft - li.offsetWidth - m;
    const minY = m - li.offsetTop, maxY = board.clientHeight - li.offsetTop - li.offsetHeight - m;
    x = Math.min(Math.max(x, minX), Math.max(minX, maxX));
    y = Math.min(Math.max(y, minY), Math.max(minY, maxY));
    li.style.setProperty('--dx', x + 'px');
    li.style.setProperty('--dy', y + 'px');
    return [x, y];
  }

  function keepInside() {
    if (!board.clientWidth) return;                 // page is hidden right now
    board.querySelectorAll('.gb-card').forEach(function (li) { const o = getOff(li); setOff(li, o[0], o[1]); });
  }

  function activate() {
    drag.active = true;
    drag.li.setPointerCapture(drag.pid);
    drag.li.classList.add('dragging');
    drag.li.style.zIndex = ++topZ;                  // the card you moved last sits on top
  }

  function finish() {
    if (!drag) return;
    clearTimeout(drag.timer);
    if (drag.active) {
      drag.li.classList.remove('dragging');
      const p = loadPos(); p[drag.li.dataset.id] = getOff(drag.li); savePos(p);
    }
    drag = null;
  }

  board.addEventListener('pointerdown', function (e) {
    const li = e.target.closest('.gb-card');
    if (!li || e.target.closest('.gb-x') || e.button > 0) return;
    const o = getOff(li);
    drag = { li: li, pid: e.pointerId, sx: e.clientX, sy: e.clientY, ox: o[0], oy: o[1], active: false, touch: e.pointerType === 'touch', timer: 0 };
    if (drag.touch) drag.timer = setTimeout(function () { if (drag && !drag.active) activate(); }, 320);   // touch: press and hold, so scrolling still works
  });

  board.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.pid) return;
    const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if (!drag.active) {
      if (drag.touch) { if (Math.hypot(dx, dy) > 10) { clearTimeout(drag.timer); drag = null; } return; }   // they are scrolling
      if (Math.hypot(dx, dy) < 4) return;
      activate();
    }
    setOff(drag.li, drag.ox + dx, drag.oy + dy);
  });

  board.addEventListener('pointerup', finish);
  board.addEventListener('pointercancel', finish);
  board.addEventListener('touchmove', function (e) { if (drag && drag.active) e.preventDefault(); }, { passive: false });
  board.addEventListener('dragstart', function (e) { e.preventDefault(); });

  let rt;
  addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(keepInside, 150); });

  /* ---------- the form ---------- */
  const msg = $('gbMessage'), status = $('gbStatus'), go = $('gbSend'), form = $('gbForm');
  msg.addEventListener('input', function () { $('gbChars').textContent = msg.value.length + ' / 240'; });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = $('gbName').value.trim(), text = msg.value.trim();
    if ($('gbHp').value) return;                                          // honeypot: only bots fill it
    if (!name || !text) { status.textContent = 'Add your name and a message first.'; return; }
    if (/https?:\/\/|www\./i.test(text)) { status.textContent = 'No links on the board, sorry.'; return; }
    let last = 0; try { last = +localStorage.getItem('guestbook:last') || 0; } catch (err) {}
    if (Date.now() - last < 60000) { status.textContent = 'One postcard a minute, please.'; return; }

    go.disabled = true;
    try {
      const secret = Array.from(crypto.getRandomValues(new Uint8Array(16)), function (b) { return b.toString(16).padStart(2, '0'); }).join('');
      const id = await Store.add({ name: name, from: $('gbFrom').value.trim(), text: text, at: Date.now(), secret: secret });
      const m = mine(); m[id] = secret; setMine(m);
      try { localStorage.setItem('guestbook:last', String(Date.now())); } catch (err) {}
      render(await Store.list(), id);
      form.reset(); $('gbChars').textContent = '0 / 240';
      status.textContent = 'Pinned! Thanks for stopping by.';
    } catch (err) {
      console.error('Guestbook:', err);
      status.textContent = 'Something went wrong. Please try again in a moment.';
    }
    go.disabled = false;
  });

  Store.list().then(render).catch(function (err) {
    console.error('Guestbook:', err);                 // open the browser console (F12) to see why
    board.append(el('li', 'gb-empty', 'The board couldn’t load right now.'));
  });
})();


/* ===== GUESTBOOK: LAYOUT + MOBILE NAV =====
   1. Desktop: leave room in the middle for exactly as many panels as are on each side,
      so the panels never sit on top of the welcome page, whatever the CSS default says.
   2. Phone: tapping the Guestbook tab just switches page, like the other tabs. */

(function () {
  const root = document.documentElement;
  const left = document.getElementById('tabsLeft');
  const right = document.getElementById('tabsRight');
  const mq = matchMedia('(max-width: 800px)');

  function sync() {
    if (mq.matches) return;                       // phones don't use the sliding panels
    root.style.setProperty('--nl', left.children.length);
    root.style.setProperty('--nr', right.children.length);
  }
  sync();
  (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(sync);

  document.addEventListener('click', function (e) {
    if (!mq.matches || e.defaultPrevented) return;   // already handled by the main mobile nav
    const a = e.target.closest('a[href="#guestbook"]');
    if (!a) return;
    e.preventDefault();
    e.stopPropagation();                             // stops the desktop "slide across" code running
    document.querySelectorAll('.page').forEach(function (p) { p.classList.toggle('current', p.id === 'guestbook-page'); });
    document.querySelectorAll('.tab').forEach(function (t) { t.classList.toggle('here', t.getAttribute('href') === '#guestbook'); });
    scrollTo(0, 0);
  }, true);
})();