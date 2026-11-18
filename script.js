/* Your default image. Change the path to your own file (e.g. "me.png").
   If the file isn't found, the meditating figure is shown instead. */
const PHOTO = "images/welcome.png";

document.getElementById('aboutPhoto').src = "images/me.png";   // same image as the particle portrait

const cv = document.getElementById('dots');
const ctx = cv.getContext('2d');

let P = [];
let W = 0;
let H = 0;

const D = Math.min(window.devicePixelRatio || 1, 2);
const M = { x: -999, y: -999 };
let raf;
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* FIGURE SILHOUETTE */
function silhouette(c) {
  const g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#171615');
  g.addColorStop(.3, '#625c56');
  g.addColorStop(.65, '#c2b8ad');
  g.addColorStop(1, '#e4dcd2');

  c.fillStyle = g;
  c.strokeStyle = g;
  c.lineCap = 'round';
  c.lineJoin = 'round';

  // HEAD / HAIR
  c.beginPath();
  c.ellipse(W*.5, H*.24, W*.105, H*.135, 0, 0, Math.PI*2);
  c.fill();

  c.beginPath();
  c.ellipse(W*.5, H*.205, W*.12, H*.13, 0, Math.PI, Math.PI*2);
  c.lineTo(W*.62, H*.30);
  c.bezierCurveTo(W*.61, H*.15, W*.58, H*.08, W*.5, H*.075);
  c.bezierCurveTo(W*.40, H*.08, W*.38, H*.16, W*.38, H*.30);
  c.fill();

  // NECK
  c.fillRect(W*.465, H*.34, W*.07, H*.065);

  // TORSO
  c.beginPath();
  c.moveTo(W*.43, H*.37);
  c.bezierCurveTo(W*.34, H*.39, W*.32, H*.53, W*.31, H*.66);
  c.lineTo(W*.69, H*.66);
  c.bezierCurveTo(W*.68, H*.53, W*.66, H*.39, W*.57, H*.37);
  c.closePath();
  c.fill();

  // LEFT ARM
  c.beginPath();
  c.moveTo(W*.39, H*.40);
  c.bezierCurveTo(W*.34, H*.43, W*.31, H*.55, W*.27, H*.65);
  c.bezierCurveTo(W*.25, H*.69, W*.20, H*.68, W*.17, H*.65);
  c.lineWidth = W*.045;
  c.stroke();

  // RIGHT ARM
  c.beginPath();
  c.moveTo(W*.61, H*.40);
  c.bezierCurveTo(W*.66, H*.43, W*.69, H*.55, W*.73, H*.65);
  c.bezierCurveTo(W*.75, H*.69, W*.80, H*.68, W*.83, H*.65);
  c.lineWidth = W*.045;
  c.stroke();

  // HANDS
  c.beginPath();
  c.arc(W*.17, H*.65, W*.028, 0, Math.PI*2);
  c.fill();
  c.beginPath();
  c.arc(W*.83, H*.65, W*.028, 0, Math.PI*2);
  c.fill();

  // SEATED LEGS
  c.beginPath();
  c.moveTo(W*.36, H*.64);
  c.bezierCurveTo(W*.25, H*.67, W*.12, H*.76, W*.20, H*.83);
  c.bezierCurveTo(W*.29, H*.91, W*.43, H*.85, W*.50, H*.77);
  c.bezierCurveTo(W*.57, H*.85, W*.71, H*.91, W*.80, H*.83);
  c.bezierCurveTo(W*.88, H*.76, W*.75, H*.67, W*.64, H*.64);
  c.bezierCurveTo(W*.58, H*.68, W*.53, H*.73, W*.50, H*.77);
  c.bezierCurveTo(W*.46, H*.73, W*.42, H*.68, W*.36, H*.64);
  c.fill();

  c.beginPath();
  c.ellipse(W*.5, H*.80, W*.30, H*.075, 0, 0, Math.PI*2);
  c.fill();
}

/* PARTICLE SAMPLING */
function sample(draw) {
  const o = document.createElement('canvas');
  o.width = W;
  o.height = H;
  const c = o.getContext('2d', { willReadFrequently: true });

  draw(c);

  let d;
  try {
    d = c.getImageData(0, 0, W, H).data;
  } catch (e) {
    console.warn('Could not read the image. Open the page through a local server (e.g. VS Code Live Server).');
    return;
  }
  const s = Math.max(3, Math.round(W/190));

  P = [];

  for (let y = 0; y < H; y += s) {
    for (let x = 0; x < W; x += s) {
      const i = (y*W + x)*4;

      if (d[i+3] < 120) continue;
      if (d[i]*.3 + d[i+1]*.59 + d[i+2]*.11 > 236) continue;

      P.push({
        hx: x + Math.random()*s,
        hy: y + Math.random()*s,
        x: Math.random()*W,
        y: Math.random()*H,
        vx: 0,
        vy: 0,
        r: s*(.22 + Math.random()*.2),
        c: Math.random() < .035 ? '#a99b8d' : `rgb(${d[i]},${d[i+1]},${d[i+2]})`
      });
    }
  }

  // FLOATING PARTICLES
  for (let i = 0; i < 260; i++) {
    P.push({
      hx: W*.5 + (Math.random()-.5)*W*.35,
      hy: Math.random()*H*.20,
      x: W*.5 + (Math.random()-.5)*W*.35,
      y: Math.random()*H*.20,
      vx: 0,
      vy: 0,
      r: Math.random()*1.3 + .3,
      c: Math.random() < .2 ? '#a99b8d' : 'rgba(35,32,29,.45)',
      dust: true
    });
  }
}

/* draws an image into the sampling canvas, filling the area */
function drawPhoto(im) {
  return function (c) {
    const k = Math.max(W/im.width, H/im.height);
    const w = im.width*k;
    const h = im.height*k;
    c.drawImage(im, (W-w)/2, (H-h)/2, w, h);
  };
}

/* BUILD CANVAS */
function build() {
  const r = cv.getBoundingClientRect();
  W = Math.round(r.width);
  H = Math.round(r.height);
  if (!W || !H) return;

  cv.width = W*D;
  cv.height = H*D;
  ctx.setTransform(D, 0, 0, D, 0, 0);

  if (PHOTO) {
    const im = new Image();
    im.onload = function () { sample(drawPhoto(im)); go(); };
    im.onerror = function () { sample(silhouette); go(); };
    im.src = PHOTO;
  } else {
    sample(silhouette);
    go();
  }
}

/* DRAW */
function draw() {
  ctx.clearRect(0, 0, W, H);
  P.forEach(function (p) {
    ctx.fillStyle = p.c;
    ctx.fillRect(p.x, p.y, p.r*2, p.r*2);
  });
}

/* ANIMATION */
function go() {
  cancelAnimationFrame(raf);

  if (still) {
    P.forEach(function (p) { p.x = p.hx; p.y = p.hy; });
    draw();
    return;
  }
  loop();
}

function loop() {
  P.forEach(function (p) {
    const dx = p.x - M.x;
    const dy = p.y - M.y;
    const d2 = dx*dx + dy*dy;

    if (d2 < 2200) {
      const f = (1 - d2/2200)*5;
      const d = Math.sqrt(d2) || 1;
      p.vx += dx/d*f;
      p.vy += dy/d*f;
    }

    const drift = p.dust ? .015 : .002;
    p.vx += Math.sin(p.hy*.03 + performance.now()*.0004)*drift;
    p.vy += Math.cos(p.hx*.03 + performance.now()*.0003)*drift;

    p.vx = (p.vx + (p.hx - p.x)*.05)*.84;
    p.vy = (p.vy + (p.hy - p.y)*.05)*.84;

    p.x += p.vx;
    p.y += p.vy;
  });

  draw();
  raf = requestAnimationFrame(loop);
}

/* POINTER INTERACTION */
cv.addEventListener('pointermove', function (e) {
  const r = cv.getBoundingClientRect();
  M.x = e.clientX - r.left;
  M.y = e.clientY - r.top;
});
cv.addEventListener('pointerleave', function () { M.x = -999; M.y = -999; });

/* PHOTO UPLOAD ("Try your photo") */
document.getElementById('pick').addEventListener('change', function (e) {
  const f = e.target.files[0];
  if (!f || !f.type.startsWith('image/')) return;

  const reader = new FileReader();
  reader.onload = function () {
    const image = new Image();
    image.onload = function () { sample(drawPhoto(image)); go(); };
    image.src = reader.result;
  };
  reader.readAsDataURL(f);
});

/* RESIZE */
let resizeTimer;
window.addEventListener('resize', function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(build, 200);
});

build();

/* SIDE PANELS: click a panel and it slides across to the right and stays there.
   Click it again to send it back. Click the black panel to send them all back. */
const tabsLeft = document.getElementById('tabsLeft');
const tabsRight = document.getElementById('tabsRight');
const rail = document.querySelector('.rail');

function movePanels(change) {
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const before = new Map(tabs.map(function (t) { return [t, t.getBoundingClientRect().left]; }));

  change();

  document.documentElement.style.setProperty('--nl', tabsLeft.children.length);
  document.documentElement.style.setProperty('--nr', tabsRight.children.length);
  showPage();

  if (still) return;
  tabs.forEach(function (t) {          // slide each panel from where it was to where it is now
    const dx = before.get(t) - t.getBoundingClientRect().left;
    if (Math.abs(dx) < 1) return;
    t.animate(
      [{ transform: 'translateX(' + dx + 'px)' }, { transform: 'none' }],
      { duration: 700, easing: 'cubic-bezier(.2,.8,.2,1)' }
    );
  });
}

/* the page shown is the one belonging to the last panel moved right (home if none) */
function showPage() {
  const open = Array.from(tabsRight.children).reverse().find(function (t) {
    return document.getElementById(t.getAttribute('href').slice(1) + '-page');
  });
  const target = open ? open.getAttribute('href').slice(1) + '-page' : 'home';
  document.querySelectorAll('.page').forEach(function (p) {
    p.classList.toggle('current', p.id === target);
  });
}

function sendRight(tab) { tabsRight.appendChild(tab); }
function sendLeft(tab) {               // put it back in its original order
  const next = Array.from(tabsLeft.children).find(function (c) {
    return +c.dataset.order > +tab.dataset.order;
  });
  tabsLeft.insertBefore(tab, next || null);
}

document.querySelectorAll('.tab').forEach(function (tab) {
  tab.addEventListener('click', function (e) {
    e.preventDefault();
    movePanels(function () {
      if (tab.parentElement === tabsLeft) sendRight(tab); else sendLeft(tab);
    });
  });
});

function resetPanels() {
  movePanels(function () { Array.from(tabsRight.children).forEach(sendLeft); });
}
rail.addEventListener('click', resetPanels);
rail.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); resetPanels(); }
});
/* DRAGGABLE PHOTO: pick it up and drop it anywhere, on any page.
   Double-click it to send it back to its place above "About". */
(function () {
  const frame = document.getElementById('photoFrame');
  const slot = frame.parentElement;
  let offX = 0, offY = 0, startX = 0, startY = 0, down = false, moved = false;

  function float() {                       // lift it out of the About page onto the whole screen
    const r = frame.getBoundingClientRect();
    document.body.appendChild(frame);
    frame.classList.add('floating');
    frame.style.width = r.width + 'px';
    frame.style.height = r.height + 'px';
    frame.style.left = r.left + 'px';
    frame.style.top = r.top + 'px';
  }

  function clamp(x, y) {
    return [
      Math.min(Math.max(0, x), innerWidth - frame.offsetWidth),
      Math.min(Math.max(0, y), innerHeight - frame.offsetHeight)
    ];
  }

  frame.addEventListener('pointerdown', function (e) {
    down = true; moved = false;
    startX = e.clientX; startY = e.clientY;
    const r = frame.getBoundingClientRect();
    offX = e.clientX - r.left; offY = e.clientY - r.top;
    frame.setPointerCapture(e.pointerId);
    frame.style.transition = '';
  });

  frame.addEventListener('pointermove', function (e) {
    if (!down) return;
    if (!moved && Math.hypot(e.clientX - startX, e.clientY - startY) < 4) return;
    if (!moved) {
      moved = true;
      if (!frame.classList.contains('floating')) float();
      frame.classList.add('dragging');
    }
    const p = clamp(e.clientX - offX, e.clientY - offY);
    frame.style.left = p[0] + 'px';
    frame.style.top = p[1] + 'px';
  });

  function drop() { down = false; frame.classList.remove('dragging'); }
  frame.addEventListener('pointerup', drop);
  frame.addEventListener('pointercancel', drop);

  frame.addEventListener('dblclick', function () {   // glide back home
    if (!frame.classList.contains('floating')) return;
    const r = slot.getBoundingClientRect();
    frame.style.transition = 'left .5s cubic-bezier(.2,.8,.2,1), top .5s cubic-bezier(.2,.8,.2,1), transform .25s, box-shadow .25s';
    frame.style.left = r.left + 'px';
    frame.style.top = r.top + 'px';
    setTimeout(function () {
      frame.classList.remove('floating');
      frame.style.cssText = '';
      slot.appendChild(frame);
    }, 520);
  });

  addEventListener('resize', function () {           // keep it on screen
    if (!frame.classList.contains('floating')) return;
    const p = clamp(parseFloat(frame.style.left) || 0, parseFloat(frame.style.top) || 0);
    frame.style.left = p[0] + 'px';
    frame.style.top = p[1] + 'px';
  });
})();

/* "See my work" and other #work links slide the work panel across */
document.querySelectorAll('a[href="#work"]:not(.tab), a[href="#contact"]:not(.tab)').forEach(function (a) {
  a.addEventListener('click', function (e) {
    e.preventDefault();
    const t = document.querySelector('.tab[href="' + a.getAttribute('href') + '"]');
    // bring that panel across, or make it the last one moved if it's already over there
    if (t !== tabsRight.lastElementChild) movePanels(function () { sendRight(t); });
  });
});
/* PROJECT PREVIEW: an image appears while you hover a project and follows the cursor */
(function () {
  const list = document.querySelector('.projects');
  const body = list.closest('.about-body');
  const workPage = document.getElementById('work-page');

  const pv = document.createElement('div');
  pv.className = 'preview';
  pv.setAttribute('aria-hidden', 'true');
  pv.innerHTML = '<div class="pv-fallback"></div><img alt="">';
  document.body.appendChild(pv);
  const img = pv.querySelector('img');
  const fb = pv.querySelector('.pv-fallback');

  let active = null, shown = false, raf = 0;
  let mx = 0, my = 0, x = 0, y = 0, vx = 0, vy = 0, appear = 0;

  img.onerror = function () { img.style.display = 'none'; };   // no image yet: the name shows instead
  img.onload = function () { img.style.display = 'block'; };

  /* The image floats like a kite on a string: it swings after the cursor with a little
     overshoot, leans, bends and flutters in the direction you move, then settles. */
  function frame(t) {
    if (still) {
      x = mx; y = my; vx = vy = 0;
    } else {
      vx += (mx - x) * 0.085;          // pulled towards the cursor
      vy += (my - y) * 0.085;
      vx *= 0.82;                      // air resistance (higher number = floatier)
      vy *= 0.82;
      x += vx;
      y += vy;
    }

    const lagX = mx - x, lagY = my - y;                     // how far behind the cursor it is
    const speed = Math.hypot(vx, vy);
    const clamp = function (v, m) { return Math.max(-m, Math.min(m, v)); };

    const flutter = still ? 0 : Math.sin(t / 130) * Math.min(3.5, speed * 0.3);   // wind flutter while moving
    const rotZ = still ? 0 : clamp(lagX * 0.16, 26) + flutter;   // leans the way it is travelling
    const rotY = still ? 0 : clamp(lagX * 0.22, 30);             // turns into the wind
    const rotX = still ? 0 : clamp(-lagY * 0.18, 22);
    const bend = still ? 0 : clamp(-lagX * 0.1, 14);             // curves along the direction of travel

    appear += ((shown ? 1 : 0) - appear) * 0.18;
    const size = (0.9 + 0.1 * appear) * (1 - Math.min(0.06, speed * 0.003));   // slightly squashed at speed

    pv.style.transform =
      'translate3d(' + (x - pv.offsetWidth / 2) + 'px,' + (y - pv.offsetHeight / 2) + 'px,0)' +
      ' perspective(800px) rotateZ(' + rotZ + 'deg) rotateY(' + rotY + 'deg) rotateX(' + rotX + 'deg)' +
      ' skewX(' + bend + 'deg) scale(' + size + ')';

    if (!workPage.classList.contains('current')) hide();
    raf = (shown || appear > 0.01) ? requestAnimationFrame(frame) : 0;
  }

  function hide() { active = null; shown = false; pv.classList.remove('show'); }

  function setActive(a) {
    if (a === active) return;
    if (!a) { hide(); return; }
    active = a;
    fb.textContent = a.querySelector('strong').textContent;
    img.style.display = 'none';
    if (a.dataset.preview) img.src = a.dataset.preview;
    if (!shown) {
      x = mx; y = my; vx = vy = 0; appear = 0; shown = true;   // starts at the cursor, no fly-in
      pv.classList.add('show');
    }
    if (!raf) raf = requestAnimationFrame(frame);
  }

  list.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    setActive(e.target.closest('.project'));
  });
  list.addEventListener('mouseleave', hide);
  body.addEventListener('scroll', function () {       // rows move under a still cursor
    const el = document.elementFromPoint(mx, my);
    setActive(el && el.closest('.project'));
  });
})();
/* CONTACT: copy the email address, and send the form through the visitor's email app */
(function () {
  const emailLink = document.getElementById('emailLink');
  const copyBtn = document.getElementById('copyEmail');
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const label = copyBtn.textContent;
  const address = function () { return emailLink.getAttribute('href').replace('mailto:', ''); };

  copyBtn.addEventListener('click', function () {
    function done() {
      copyBtn.textContent = 'Copied';
      setTimeout(function () { copyBtn.textContent = label; }, 1800);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(address()).then(done, done);
    } else {
      const t = document.createElement('textarea');
      t.value = address();
      document.body.appendChild(t);
      t.select();
      try { document.execCommand('copy'); } catch (e) {}
      t.remove();
      done();
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.classList.add('checked');
    if (!form.checkValidity()) {
      status.textContent = 'Please fill in your name, a valid email and a message.';
      return;
    }
    const f = new FormData(form);
    const body = f.get('message') + '\n\n' + f.get('name') + '\n' + f.get('email');
    location.href = 'mailto:' + address() +
      '?subject=' + encodeURIComponent('Message from ' + f.get('name')) +
      '&body=' + encodeURIComponent(body);
    status.textContent = 'Opening your email app so you can send it.';
  });
})();

/* ===== PROJECT CASE STUDIES =====
   Click a project on the Work page and its description page opens in the same space
   (All work 01 / 09, title, description, Role and Stack, screenshots, sections, links,
   Next project).

   It builds every page from the project rows already in your HTML, so each project works
   straight away. To write a project up in full, add it to EXTRA below.
   */

(function () {
  const work = document.getElementById('work-page');
  const list = work && work.querySelector('.projects');
  if (!list) return;

  const listHead = work.querySelector('.about-head');
  const listBody = work.querySelector('.about-body');
  const rows = Array.from(list.querySelectorAll('.project'));

  const ICON_UP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>';
  const ICON_LEFT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12H5M11 6l-6 6 6 6"/></svg>';
  const ICON_RIGHT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';

  /* ---------- FULL WRITE-UPS ----------
     The key is the project name in lowercase with dashes (Unsaid -> "unsaid",
     Home Sweet Hound -> "home-sweet-hound"). Anything you leave out is simply not shown.
     Available fields: tagline, role, when, stack, images, sections, highlights, live, code */
  const EXTRA = {
    'unsaid': {
      tagline: 'Say it out loud.',
      role: 'Full-stack, built solo',
      stack: 'PHP, Laravel, MySQL, Blade, JavaScript, Vite, OpenRouter API, browser speech recognition and text-to-speech',
      code: 'https://github.com/YolandaMbande/Unsaid',
      images: [
        { src: 'images/unsaid.jpeg', alt: 'Unsaid conversation screen', caption: 'A conversation with Unsaid, with past conversations in the sidebar.' },
        { src: 'images/unsaid-2.png', alt: 'Unsaid voice input', caption: 'Speaking instead of typing, with voice input.' },
        { src: 'images/unsaid-3.png', alt: 'Unsaid Call Mode', caption: 'Call Mode, the voice-first conversation screen.' }
      ],
      sections: [
        { h: 'Overview', p: 'Unsaid is built around conversation rather than productivity. There are no structured prompts to fill in: you start talking, in whichever way is easiest at that moment, and Unsaid answers. Past conversations are saved and can be opened again from the sidebar, so you can come back to a thought later.' },
        { h: 'The problem', p: 'Most chat interfaces are built for tasks, with a prompt going in and an answer coming out. I wanted something for the moments when you know something is on your mind but you do not have the words for it yet. That meant a calm, conversation-first interface, more than one way to speak, and conversations that do not vanish when the page refreshes.' },
        { h: 'What I did', p: 'I built Unsaid end to end as a full-stack project. Laravel handles the application logic and the conversation storage, and passes each message on to the AI service through OpenRouter. The reply comes back to the interface, and both sides of the exchange are saved in MySQL. On the front end I built the chat interface with Blade, CSS and JavaScript, bundled with Vite. Voice input uses the browser’s speech recognition, text-to-speech reads replies aloud, and Call Mode brings them together in a dedicated voice-first screen.' },
        { h: 'Decisions', p: 'Conversation comes first, so there are no prompt templates or task menus, only a place to start talking. Typing, speaking and Call Mode are all available, and you choose whichever suits the moment. Messages and conversations are stored in the database rather than living in the page, so a refresh does not lose anything. The interface is responsive, designed to work on both desktop and mobile screens.' }
      ],
      highlights: [
        'Built the whole app end to end, from the chat interface to the database, with Laravel and MySQL',
        'Connected the Laravel backend to the OpenRouter API so replies flow back into the conversation',
        'Saved every conversation and message in MySQL, with past conversations reopened from the sidebar',
        'Added voice input with browser speech recognition and spoken replies with text-to-speech',
        'Designed Call Mode, a voice-first interface for continuous back and forth',
        'Made the interface responsive across desktop and mobile'
      ]
    }
    // 'nestashots': { tagline: '...', sections: [ { h: 'Overview', p: '...' } ], highlights: ['...'] },
  };

  /* ---------- helpers ---------- */
  function esc(t) { const d = document.createElement('div'); d.textContent = t == null ? '' : t; return d.innerHTML; }
  function slug(t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------- read every project row ---------- */
  const projects = rows.map(function (row) {
    const title = row.querySelector('strong').textContent.trim();
    const id = slug(title);
    const href = row.getAttribute('href') || '';
    const isRepo = /github\.com/.test(href);
    const base = {
      title: title,
      desc: row.querySelector('.p-desc').textContent.trim(),
      stack: row.querySelector('.p-meta').textContent.split('·').map(function (s) { return s.trim(); }).filter(Boolean).join(', '),
      role: 'Designed and built solo',
      live: isRepo ? '' : href,
      code: isRepo ? href : '',
      images: row.dataset.preview ? [{ src: row.dataset.preview, alt: title + ' preview', caption: 'A look at ' + title + '.' }] : []
    };
    return Object.assign(base, EXTRA[id] || {});
  });

  /* ---------- containers ---------- */
  const head = document.createElement('div');
  const body = document.createElement('div');
  head.className = 'about-head';
  body.className = 'about-body';
  head.hidden = body.hidden = true;
  work.appendChild(head);
  work.appendChild(body);

  /* ---------- lightbox ---------- */
  const box = document.createElement('div');
  box.className = 'cs-lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Enlarged image');
  box.innerHTML = '<button class="cs-close" type="button">Close</button><img alt=""><p></p>';
  document.body.appendChild(box);
  const boxImg = box.querySelector('img');
  const boxCap = box.querySelector('p');
  function closeBox() { box.classList.remove('open'); }
  box.addEventListener('click', closeBox);
  addEventListener('keydown', function (e) { if (e.key === 'Escape') closeBox(); });

  /* ---------- building one page ---------- */
  function figure(img, n) {
    return '<figure class="cs-fig">' +
      '<div class="cs-frame"><span>' + esc(img.src) + '</span><img src="' + esc(img.src) + '" alt="' + esc(img.alt) + '"></div>' +
      '<figcaption><span class="cs-n">' + pad(n) + '</span><span class="cs-cap">' + esc(img.caption) + '</span>' +
      '<button class="cs-enlarge" type="button" hidden>Enlarge image</button></figcaption></figure>';
  }

  /* extra screenshots come in side-by-side pairs, each with its own little note beneath */
  function pairs(list, start) {
    let out = '';
    for (let k = 0; k < list.length; k += 2) {
      out += '<div class="cs-pair">' + figure(list[k], start + k) + (list[k + 1] ? figure(list[k + 1], start + k + 1) : '') + '</div>';
    }
    return out;
  }

  function render(i) {
    const p = projects[i];
    const next = projects[(i + 1) % projects.length];
    const imgs = p.images || [];
    const sections = p.sections || [];

    head.innerHTML =
      '<div class="cs-top"><button class="cs-back" type="button">' + ICON_LEFT + ' All work</button>' +
      '<span class="cs-count">' + pad(i + 1) + ' / ' + pad(projects.length) + '</span></div>' +
      '<h1>' + esc(p.title) + '</h1>' +
      (p.tagline ? '<p class="tagline">' + esc(p.tagline) + '</p>' : '');

    let html = '<p class="cs-lead">' + esc(p.desc) + '</p>';

    html += '<dl class="cs-meta">' +
      (p.role ? '<div><dt>Role</dt><dd>' + esc(p.role) + '</dd></div>' : '') +
      (p.when ? '<div><dt>When</dt><dd>' + esc(p.when) + '</dd></div>' : '') +
      (p.stack ? '<div class="cs-full"><dt>Stack</dt><dd>' + esc(p.stack) + '</dd></div>' : '') +
      '</dl>';

    if (imgs[0]) html += figure(imgs[0], 1);

    sections.forEach(function (s, k) {
      html += '<h2 class="cs-h">' + esc(s.h) + '</h2><p class="cs-p">' + esc(s.p) + '</p>';
      if (k === 2) html += pairs(imgs.slice(1), 2);        // right below "What I did"
    });
    if (sections.length < 3) html += pairs(imgs.slice(1), 2);

    if (p.highlights && p.highlights.length) {
      html += '<h2 class="cs-h">Highlights</h2><ul class="cs-list">' +
        p.highlights.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ul>';
    }

    html += '<div class="cs-links">' +
      (p.live ? '<a class="cs-link" href="' + esc(p.live) + '" target="_blank" rel="noopener noreferrer">Visit the live site ' + ICON_UP + '</a>' : '') +
      (p.code ? '<a class="cs-link" href="' + esc(p.code) + '" target="_blank" rel="noopener noreferrer">View the code on GitHub ' + ICON_UP + '</a>' : '') +
      '</div>';

    if (projects.length > 1) {
      html += '<button class="cs-next" type="button"><span class="cs-next-label">Next project · ' + pad(((i + 1) % projects.length) + 1) + '</span>' +
        '<span class="cs-next-title">' + esc(next.title) + ICON_RIGHT + '</span></button>';
    }

    body.innerHTML = html;

    /* wire up this page */
    head.querySelector('.cs-back').addEventListener('click', close);
    const nextBtn = body.querySelector('.cs-next');
    if (nextBtn) nextBtn.addEventListener('click', function () { open((i + 1) % projects.length); });

    body.querySelectorAll('.cs-fig').forEach(function (fig) {
      const img = fig.querySelector('img');
      const btn = fig.querySelector('.cs-enlarge');
      function ok() { btn.hidden = false; }
      function missing() { img.style.display = 'none'; }     // no image yet: the file name shows instead
      if (img.complete) { img.naturalWidth ? ok() : missing(); }
      img.addEventListener('load', ok);
      img.addEventListener('error', missing);
      btn.addEventListener('click', function () {
        boxImg.src = img.src;
        boxImg.alt = img.alt;
        boxCap.textContent = fig.querySelector('.cs-n').textContent + '  ' + fig.querySelector('.cs-cap').textContent;
        box.classList.add('open');
      });
    });
  }

  /* ---------- opening and closing ---------- */
  function open(i) {
    render(i);
    listHead.hidden = listBody.hidden = true;
    head.hidden = body.hidden = false;
    body.scrollTop = 0;
    [head, body].forEach(function (el) {                      // replay the fade-in
      el.classList.remove('cs-in');
      void el.offsetWidth;
      el.classList.add('cs-in');
    });
    list.dispatchEvent(new Event('mouseleave'));              // closes the hover preview
  }

  function close() {
    head.hidden = body.hidden = true;
    listHead.hidden = listBody.hidden = false;
    list.dispatchEvent(new Event('mouseleave'));
  }

  /* a normal click opens the write-up; ctrl/cmd-click still opens the live site in a new tab */
  list.addEventListener('click', function (e) {
    const row = e.target.closest('.project');
    if (!row) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    open(rows.indexOf(row));
  });
})();

/* ===== MOBILE NAV =====
   On small screens the side panels become a bottom bar that simply switches pages
   (nothing slides across). Resizing or rotating the phone is handled too. */

(function () {
  const mq = matchMedia('(max-width: 800px)');
  const pages = { '#home': 'home', '#about': 'about-page', '#work': 'work-page', '#contact': 'contact-page' };
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const left = document.getElementById('tabsLeft');
  const right = document.getElementById('tabsRight');

  function go(hash) {
    const id = pages[hash];
    if (!id) return;
    document.querySelectorAll('.page').forEach(function (p) { p.classList.toggle('current', p.id === id); });
    tabs.forEach(function (t) { t.classList.toggle('here', t.getAttribute('href') === hash); });
    scrollTo(0, 0);
  }

  /* on a phone: tabs, the logo, and every "See my work" / "Get in touch" link just switch pages.
     (capture phase, so the sliding-panel code is skipped) */
  document.addEventListener('click', function (e) {
    if (!mq.matches) return;
    if (e.target.closest('.rail')) {
      e.preventDefault(); e.stopPropagation();
      go('#home');
      return;
    }
    const a = e.target.closest('a[href^="#"]');
    if (a && pages[a.getAttribute('href')]) {
      e.preventDefault(); e.stopPropagation();
      go(a.getAttribute('href'));
    }
  }, true);

  /* crossing the breakpoint (rotating, resizing): put the panels back and show a sensible page */
  function reset() {
    tabs.sort(function (a, b) { return a.dataset.order - b.dataset.order; })
        .forEach(function (t) { left.appendChild(t); });
    document.documentElement.style.setProperty('--nl', 3);
    document.documentElement.style.setProperty('--nr', 0);
    tabs.forEach(function (t) { t.classList.remove('here'); });
    document.querySelectorAll('.page').forEach(function (p) { p.classList.toggle('current', p.id === 'home'); });
    scrollTo(0, 0);
  }
  (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(reset);
})();