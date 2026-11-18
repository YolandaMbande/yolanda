
/* ===== PROJECT CASE STUDIES ===== */

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

  /* Replace the image paths with your own screenshots.
     Image 1 = main project image.
     Images 2 and 3 = side-by-side images beneath What I did. */

  const EXTRA = {

    'unsaid': {
      desc: 'An AI-powered conversational companion built to give people a space to express and unpack their thoughts without needing to have the right words first.',
      tagline: 'Say it out loud.',
      role: 'Full-stack development',
      stack: 'PHP, Laravel, MySQL, Blade, HTML, CSS, JavaScript, Vite, OpenRouter API, Browser Speech Recognition, Web Speech API',
      code: 'https://github.com/YolandaMbande/Unsaid',
      sections: [
        { h: 'Overview', p: 'Unsaid is built around conversation rather than productivity. Users can type what is on their mind, speak naturally using voice input, or use Call Mode for a more continuous voice-based experience. Previous conversations are saved so users can return to them later.' },
        { h: 'The problem', p: 'Sometimes people have something on their minds but struggle to find the right words. I wanted to build an experience that felt more like a conversation than a traditional productivity tool, without requiring users to follow structured prompts.' },
        { h: 'What I did', p: 'I built the application using Laravel, PHP and MySQL, connecting the backend to OpenRouter to generate conversational responses. I developed the interface with Blade, CSS and JavaScript, and implemented conversation history so messages remain available after refreshing the page. I also integrated browser speech recognition for voice input, text-to-speech for spoken responses and a dedicated Call Mode.' },
        { h: 'Decisions', p: 'Conversation comes first, so the interface avoids unnecessary menus and prompt templates. Users can choose between typing, speaking and Call Mode. Conversations are stored in the database rather than existing only in the browser, and the interface is designed to work across desktop and mobile screens.' }
      ],
      highlights: [
        'Built the application across the frontend, backend and database',
        'Integrated the OpenRouter API through the Laravel backend',
        'Implemented persistent conversations and message history using MySQL',
        'Added browser-based speech recognition and text-to-speech',
        'Created a dedicated voice-first Call Mode',
        'Designed a responsive conversational interface'
      ],
      images: [
        { src: 'images/unsaid-main.jpeg', alt: 'Unsaid main interface', caption: 'The Unsaid conversational interface.' },
        { src: 'images/unsaid-02.jpeg', alt: 'Unsaid additional screen' },
        { src: 'images/unsaid.jpeg', alt: 'Unsaid additional screen' }
      ]
    },

    'nestashots': {
      desc: 'A responsive photography portfolio and booking website showcasing photography services, galleries, packages, testimonials and booking enquiries.',
      tagline: 'A space for every moment worth capturing.',
      role: 'Web design & development',
      stack: 'HTML5, CSS3, JavaScript, Webpack, Font Awesome, Google Fonts',
      live: 'https://yolandambande.github.io/nestashots/',
      code: 'https://github.com/YolandaMbande/nestashots',
      sections: [
        { h: 'Overview', p: 'Nestashots is a photography website built to showcase photography services and make it easier for potential clients to explore galleries and enquire about bookings. It brings the photographer profile, services, packages and contact information together in one responsive experience.' },
        { h: 'The problem', p: 'A photography business needs more than a collection of pictures. Visitors need to understand what services are offered, see examples of previous work and know how to make an enquiry. The website brings these elements together in one place.' },
        { h: 'What I did', p: 'I developed the website structure and responsive interface, including the homepage, photographer profile, service and package sections, individual photography galleries, testimonials and booking enquiries. I also incorporated contact information, social links and video content, using Webpack to manage the development and production build process.' },
        { h: 'Decisions', p: 'Photography is the focus of the experience, so the design gives galleries and visual content room to stand out. I organised the website around the information a potential client would need when exploring services and deciding whether to enquire.' }
      ],
      highlights: [
        'Built a responsive multi-page photography website',
        'Created individual galleries for different photography services',
        'Added photography packages, testimonials and service information',
        'Included booking enquiries and contact information',
        'Used Webpack for development and production builds'
      ],
      images: [
        { src: 'images/nestashots-02.png', alt: 'Nestashots homepage', caption: 'The Nestashots photography website.' },
        { src: 'images/nestashots-main.png', alt: 'Nestashots additional screen' },
        { src: 'images/nestashots-03.png', alt: 'Nestashots additional screen' }
      ]
    },

    'link-card': {
      desc: 'A personal link hub bringing social profiles and useful online destinations together in one place. Currently a work in progress.',
      tagline: 'Everything in one place.',
      role: 'In progress',
      stack: '',
      live: '',
      code: '',
      sections: [
        { h: 'Overview', p: 'Link Card is an in-progress personal website designed to bring important links and online profiles together through one simple page.' },
        { h: 'The direction', p: 'The goal is to create a compact, visually engaging alternative to sharing multiple separate profile links.' },
        { h: 'What I did', p: 'The project is still being developed. I am refining its layout, visual identity and interactions before considering it complete.' }
      ],
      images: [
        { src: 'images/link-card-mai.png', alt: 'Link Card current design', caption: 'The Link Card project in progress.' },
        { src: 'images/link-card-02.png', alt: 'Link Card additional screen' },
        { src: 'images/link-card-03.png', alt: 'Link Card additional screen' }
      ]
    },

    'block-jewel': {
      desc: 'A colourful browser-based block puzzle game where players place shapes on an 8×8 grid, clear rows and columns, build combos and beat their high scores.',
      tagline: 'One more round.',
      role: 'Game design & development',
      stack: 'HTML5, CSS3, JavaScript, Progressive Web App, Service Workers',
      live: 'https://block-puzzle-amber.vercel.app/',
      code: 'https://github.com/YolandaMbande/block-puzzle',
      sections: [
        { h: 'Overview', p: 'Block Jewel is a browser-based puzzle game inspired by classic block-placement games. Players choose from different shapes and place them on an 8×8 board, completing rows and columns to clear space and earn points.' },
        { h: 'The problem', p: 'I wanted to build a simple game that was easy to understand but still encouraged players to think ahead. The challenge was creating a familiar puzzle mechanic while making the experience feel polished and enjoyable across different devices.' },
        { h: 'What I did', p: 'I developed the game board and block-placement mechanics using JavaScript, with scoring, high-score tracking, combo handling and game-over detection. I implemented animated block placement and line clearing, added light and dark themes, and made the controls responsive and touch-friendly. I also configured the project as an installable Progressive Web App using a manifest and service worker.' },
        { h: 'Decisions', p: 'The 8×8 grid keeps the game familiar, while the combo system rewards thoughtful placement. I included both light and dark themes and made sure the controls work for mouse and touch interactions.' }
      ],
      highlights: [
        'Built an interactive 8×8 puzzle board',
        'Implemented multiple block shapes and colours',
        'Added scoring, high-score tracking and a combo system',
        'Created game-over detection and New Game functionality',
        'Added light and dark themes',
        'Configured the game as an installable Progressive Web App'
      ],
      images: [
        { src: 'images/block-jewel-main.png', alt: 'Block Jewel game board', caption: 'The Block Jewel puzzle board.' },
        { src: 'images/block-jewel-02.png', alt: 'Block Jewel additional screen' },
        { src: 'images/block-jewel-03.png', alt: 'Block Jewel additional screen' }
      ]
    },

    'easybooking': {
      desc: 'A responsive event booking and management platform designed to help organisers manage events while allowing attendees to discover and book them.',
      tagline: 'Making event booking simpler.',
      role: 'Web application development',
      stack: 'PHP, Laravel, MySQL, HTML, CSS, JavaScript, Bootstrap, Tailwind CSS, Vite',
      code: 'https://github.com/YolandaMbande/easybooking',
      sections: [
        { h: 'Overview', p: 'EasyBooking is an event booking and management platform that brings event discovery, registration and organiser management into one application. It is designed to provide a straightforward booking experience across desktop and mobile devices.' },
        { h: 'The problem', p: 'Event information and registration can become difficult to manage when discovery and booking are disconnected. EasyBooking explores how these activities can be brought together in a single platform for both organisers and attendees.' },
        { h: 'What I did', p: 'I developed the application using Laravel and PHP, with MySQL for data storage. The frontend combines HTML, CSS and JavaScript with Bootstrap and Tailwind CSS, while Vite handles the frontend build process. The application covers event browsing, booking and registration, alongside event management functionality for organisers.' },
        { h: 'Decisions', p: 'The application is structured around two main activities: discovering and booking events, and managing events as an organiser. The interface is designed to remain usable across desktop and mobile screens.' }
      ],
      highlights: [
        'Developed a Laravel-based event booking application',
        'Implemented event browsing and discovery functionality',
        'Built event booking and registration workflows',
        'Included event management functionality for organisers',
        'Used MySQL for application data',
        'Combined Bootstrap and Tailwind CSS for the interface'
      ],
      images: [
        { src: 'images/easybooking-main.png', alt: 'EasyBooking main interface', caption: 'The EasyBooking application.' },
        { src: 'images/easybooking-02.png', alt: 'EasyBooking additional screen' },
        { src: 'images/easybooking-03.png', alt: 'EasyBooking additional screen' }
      ]
    },

    'what-now': {
      desc: 'A South African young-adult life-admin guide covering the everyday responsibilities and processes nobody really explains.',
      tagline: 'So... what now?',
      role: 'Design & development',
      stack: 'HTML, CSS, Vanilla JavaScript, Browser localStorage',
      live: 'https://yolandambande.github.io/what-now/',
      code: 'https://github.com/YolandaMbande/what-now',
      sections: [
        { h: 'Overview', p: 'WHAT NOW? is a practical guide for young South Africans navigating adult responsibilities. It brings together straightforward explanations, checklists and useful links to help people work through everyday life-admin tasks.' },
        { h: 'The problem', p: 'A lot of important adult responsibilities are explained across different websites, official documents and application processes. Finding reliable information can be overwhelming, especially when you are trying to work out what to do first.' },
        { h: 'What I did', p: 'I built the guide using HTML, CSS and vanilla JavaScript. It includes situation-based practical checklists, an adulting dictionary, an interactive sample payslip decoder and an important-document checklist that saves progress locally in the browser. I also added links to official South African sources covering services such as SARS, identity documents, police certification and employment matters.' },
        { h: 'Decisions', p: 'The content is written in plain English and organised around practical situations rather than long explanations. For processes that can change, the guide points users towards official sources instead of presenting itself as a replacement for government or professional advice.' }
      ],
      highlights: [
        'Created a South African young-adult life-admin guide',
        'Built situation-based practical checklists',
        'Added an adulting dictionary and interactive payslip decoder',
        'Implemented a document checklist with locally saved progress',
        'Linked users to relevant official South African sources',
        'Designed a responsive mobile layout'
      ],
      images: [
        { src: 'images/what-now-main.png', alt: 'WHAT NOW homepage', caption: 'The WHAT NOW? life-admin guide.' },
        { src: 'images/what-now-02.png', alt: 'WHAT NOW additional screen' },
        { src: 'images/what-now-03.png', alt: 'WHAT NOW additional screen' }
      ]
    },

    'just-today': {
      desc: 'A deliberately simple daily tracker for keeping track of today without streaks, pressure, accounts or unnecessary dashboards.',
      tagline: 'Today is enough.',
      role: 'Design & development',
      stack: 'HTML, CSS, Vanilla JavaScript, localStorage',
      live: 'https://yolandambande.github.io/just-today/',
      code: 'https://github.com/YolandaMbande/just-today',
      sections: [
        { h: 'Overview', p: 'Just Today is a small daily tracker designed for people who want to keep track of what matters today without the pressure that traditional habit and productivity apps can create.' },
        { h: 'The problem', p: 'Many habit trackers rely on streaks, accounts and dashboards. Missing a day can feel like failure, while a simple task list becomes another thing to manage. I wanted to create something that kept the experience lighter.' },
        { h: 'What I did', p: 'I built a daily view for recording the things a person wants to focus on, alongside a history of previous days. The application uses vanilla JavaScript and localStorage to keep information in the browser without requiring an account, backend or database. I also included a print-friendly layout so users can keep a physical copy if they prefer.' },
        { h: 'Decisions', p: 'The project deliberately avoids streaks, scores and dashboards. The focus stays on the current day, with a quiet history available when users want to look back. Keeping the data in localStorage also means the application can be used without signing up.' }
      ],
      highlights: [
        'Built a simple daily task-tracking interface',
        'Implemented a history view for previous days',
        'Stored user data locally with localStorage',
        'Designed the experience without accounts or streaks',
        'Added a print-friendly layout',
        'Kept the application entirely client-side'
      ],
      images: [
        { src: 'images/just-today-main.png', alt: 'Just Today daily tracker', caption: 'The Just Today daily view.' },
        { src: 'images/just-today-main.png', alt: 'Just Today additional screen' },
        { src: 'images/just-today.png', alt: 'Just Today additional screen' }
      ]
    },

    'cascade-inspector': {
      desc: 'An interactive CSS debugging tool for formatting HTML and CSS, previewing changes and understanding how the CSS cascade affects individual elements.',
      tagline: 'See what your CSS is actually doing.',
      role: 'Design & development',
      stack: 'HTML, CSS, Vanilla JavaScript, DOM APIs, CSSOM, Browser Styling APIs',
      live: 'https://yolandambande.github.io/Cascade-Inspector/',
      code: 'https://github.com/YolandaMbande/cascade-inspector',
      sections: [
        { h: 'Overview', p: 'Cascade Inspector is a browser-based workspace for editing HTML and CSS, previewing changes and inspecting how styles are applied to individual elements.' },
        { h: 'The problem', p: 'CSS can become difficult to debug when multiple selectors target the same element. A declaration may be written correctly but still be overridden by another rule, making it frustrating to identify which style is actually taking effect.' },
        { h: 'What I did', p: 'I developed live HTML and CSS editors with a real-time preview. Users can select elements in the preview to inspect the styles affecting them and see which declarations are winning or being overridden. I also implemented HTML and CSS formatting tools, syntax issue detection and visual states to distinguish winning rules, overridden rules, problems and selected elements.' },
        { h: 'Decisions', p: 'I kept the application entirely client-side, using browser DOM and CSSOM APIs rather than introducing a framework or backend. The goal was to make the relationship between CSS declarations and their rendered results easier to understand in one workspace.' }
      ],
      highlights: [
        'Built live HTML and CSS editing panels',
        'Implemented a real-time rendered preview',
        'Added element selection and style inspection',
        'Displayed winning and overridden CSS declarations',
        'Created HTML and CSS formatting tools',
        'Added syntax issue detection and visual rule states'
      ],
      images: [
        { src: 'images/cascade-inspector-main.jpeg', alt: 'Cascade Inspector workspace', caption: 'The Cascade Inspector debugging workspace.' },
        { src: 'images/cascade-inspector-02.png', alt: 'Cascade Inspector additional screen' },
        { src: 'images/cascade-inspector-03.png', alt: 'Cascade Inspector additional screen' }
      ]
    },

    'home-sweet-hound': {
      desc: 'A warm, interactive pet adoption guide helping future pet parents understand the adoption process, costs and responsibilities.',
      tagline: 'A little more prepared for a new best friend.',
      role: 'Design & development',
      stack: 'HTML, CSS, Vanilla JavaScript',
      live: 'https://yolandambande.github.io/home-sweet-hound/',
      code: 'https://github.com/YolandaMbande/home-sweet-hound',
      sections: [
        { h: 'Overview', p: 'Home Sweet Hound is a photography-led pet adoption guide designed to help first-time adopters prepare before bringing an animal home. It covers readiness, budgeting, the adoption process and what to expect during the first few weeks.' },
        { h: 'The problem', p: 'Adopting a pet can seem straightforward, but first-time adopters may not know whether their home and lifestyle are suitable, how much a pet will cost or what the application process involves. That information is often scattered across shelter websites and different resources.' },
        { h: 'What I did', p: 'I built an interactive guide using HTML, CSS and vanilla JavaScript. It includes a readiness checklist with practical next steps, interactive home-check photo notes, a monthly pet budget calculator and guidance for the first weeks after adoption. I also included direct links to official Cape of Good Hope SPCA resources and currently adoptable animals.' },
        { h: 'Decisions', p: 'The design uses photography, bright colour sections, rounded calls to action and spacious image-led layouts to make the information approachable. The guide does not list animals itself; it directs visitors to the shelter for current adoption listings and requirements.' }
      ],
      highlights: [
        'Built an interactive pet adoption guide',
        'Created a readiness checklist with practical next steps',
        'Implemented interactive home-check photo notes',
        'Added a monthly pet budget calculator',
        'Included first-weeks guidance and responsible adoption reminders',
        'Linked directly to official Cape of Good Hope SPCA resources'
      ],
      images: [
        { src: 'images/home-sweet-hound-main.png', alt: 'Home Sweet Hound homepage', caption: 'The Home Sweet Hound adoption guide.' },
        { src: 'images/home-sweet-hound-02.png', alt: 'Home Sweet Hound additional screen' },
        { src: 'images/home-sweet-hound-03.png', alt: 'Home Sweet Hound additional screen' }
      ]
    }
  };

  /* ---------- helpers ---------- */

  function esc(t) {
    const d = document.createElement('div');
    d.textContent = t == null ? '' : t;
    return d.innerHTML;
  }

  function slug(t) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }

  /* ---------- read every project row ---------- */

  const projects = rows.map(function (row) {
    const title = row.querySelector('strong').textContent.trim();
    const id = slug(title);
    const href = row.getAttribute('href') || '';
    const isRepo = /^https?:\/\/(www\.)?github\.com\//i.test(href);
    const isExternal = /^https?:\/\//i.test(href);

    const base = {
      title: title,
      desc: row.querySelector('.p-desc').textContent.trim(),
      stack: row.querySelector('.p-meta').textContent.split('·').map(function (s) {
        return s.trim();
      }).filter(Boolean).join(', '),
      role: 'Design & development',
      live: isExternal && !isRepo ? href : '',
      code: isRepo ? href : '',
      images: row.dataset.preview ? [
        { src: row.dataset.preview, alt: title + ' preview', caption: 'A look at ' + title + '.' }
      ] : []
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

  function closeBox() {
    box.classList.remove('open');
  }

  box.addEventListener('click', closeBox);

  addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeBox();
  });

  /* ---------- image builder ---------- */

  function figure(img, n, compact) {
    const caption = compact ? '' :
      '<figcaption><span class="cs-n">' + pad(n) + '</span><span class="cs-cap">' + esc(img.caption || '') + '</span><button class="cs-enlarge" type="button" hidden>Enlarge image</button></figcaption>';

    const enlarge = compact ?
      '<button class="cs-enlarge cs-enlarge--overlay" type="button" hidden>Enlarge</button>' : '';

    return '<figure class="cs-fig' + (compact ? ' cs-fig--tile' : '') + '">' +
      '<div class="cs-frame">' +
      '<span>' + esc(img.src) + '</span>' +
      '<img src="' + esc(img.src) + '" alt="' + esc(img.alt) + '">' +
      enlarge +
      '</div>' +
      caption +
      '</figure>';
  }

  function gallery(images) {
    if (!images || !images.length) return '';

    return '<div class="cs-gallery">' +
      images.map(function (img, i) {
        return figure(img, i + 2, true);
      }).join('') +
      '</div>';
  }

  /* ---------- build one project page ---------- */

  function render(i) {
    const p = projects[i];
    const next = projects[(i + 1) % projects.length];
    const imgs = p.images || [];
    const sections = p.sections || [];
    const whatDidIndex = sections.findIndex(function (s) {
      return s.h.toLowerCase() === 'what i did';
    });

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

    if (imgs[0]) html += figure(imgs[0], 1, false);

    sections.forEach(function (s, k) {
      html += '<h2 class="cs-h">' + esc(s.h) + '</h2><p class="cs-p">' + esc(s.p) + '</p>';

      if (k === whatDidIndex) {
        html += gallery(imgs.slice(1, 3));
      }
    });

    if (whatDidIndex === -1) {
      html += gallery(imgs.slice(1, 3));
    }

    if (p.highlights && p.highlights.length) {
      html += '<h2 class="cs-h">Highlights</h2><ul class="cs-list">' +
        p.highlights.map(function (h) {
          return '<li>' + esc(h) + '</li>';
        }).join('') +
        '</ul>';
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

    /* Wire up this page */

    head.querySelector('.cs-back').addEventListener('click', close);

    const nextBtn = body.querySelector('.cs-next');

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        open((i + 1) % projects.length);
      });
    }

    body.querySelectorAll('.cs-fig').forEach(function (fig) {
      const img = fig.querySelector('img');
      const btn = fig.querySelector('.cs-enlarge');

      function ok() {
        btn.hidden = false;
      }

      function missing() {
        img.style.display = 'none';
      }

      if (img.complete) {
        img.naturalWidth ? ok() : missing();
      }

      img.addEventListener('load', ok);
      img.addEventListener('error', missing);

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        boxImg.src = img.src;
        boxImg.alt = img.alt;
        boxCap.textContent = fig.querySelector('.cs-cap') ?
          fig.querySelector('.cs-cap').textContent :
          img.alt;
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

    [head, body].forEach(function (el) {
      el.classList.remove('cs-in');
      void el.offsetWidth;
      el.classList.add('cs-in');
    });

    list.dispatchEvent(new Event('mouseleave'));
  }

  function close() {
    head.hidden = body.hidden = true;
    listHead.hidden = listBody.hidden = false;
    list.dispatchEvent(new Event('mouseleave'));
  }

  /* Normal click opens the case study.
     Ctrl/Cmd-click still opens the linked project in a new tab. */

  list.addEventListener('click', function (e) {
    const row = e.target.closest('.project');
    if (!row) return;

    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    e.preventDefault();
    open(rows.indexOf(row));
  });

})();
