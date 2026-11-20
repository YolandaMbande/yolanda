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