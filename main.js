/* nextTram showcase, v2. Every effect is an enhancement: the page reads fully without JS,
   and without GSAP/Lenis (CDN blocked) it falls back to IntersectionObserver. */
(() => {
  'use strict';
  const doc = document.documentElement;
  doc.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const motion = hasGsap && !reduce;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const pad = n => String(n).padStart(2, '0');
  const mmss = s => `${Math.floor(s / 60)}:${pad(Math.max(0, Math.floor(s % 60)))}`;
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  // run a loop only while its element is on screen
  const seen = el => { const st = { on: true }; if (el && 'IntersectionObserver' in window) new IntersectionObserver(([e]) => { st.on = e.isIntersecting; }).observe(el); return st; };

  /* ---------- clock (Leipzig/Berlin time) ---------- */
  const fmt = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin' });
  const tick = () => $$('[data-clock]').forEach(el => { if (el.closest('.appdemo')) return; // the app demos run their own clocks
    el.textContent = fmt.format(new Date()); });
  tick(); setInterval(tick, 10000);

  /* ---------- video sources: 720p on small screens or data saver ---------- */
  const small = matchMedia('(max-width: 1199px)').matches || (navigator.connection && navigator.connection.saveData);
  const load = v => { if (reduce) return; if (v && !v.getAttribute('src')) { v.src = `${v.dataset.src}-${small ? 720 : 1080}.mp4`; } };
  const tryPlay = v => { if (reduce || !v) return Promise.reject(); const p = v.play(); return p && p.catch ? p : Promise.resolve(); };

  /* ---------- intro: the hand-off ----------
     The inline script at the top of <body> decides whether the intro plays (html.js-intro), starts
     it once the display face is in (html.intro-play) and skips it on any input (html.intro-skip).
     The trams and the green stop are CSS. This waits for the trams to clear, then drops the word
     into its place in the hero title as the screen lifts, and removes the intro. */
  const loader = $('[data-loader]');
  const heroWord = $('.hero__title .word--trams');
  // the hero's own entrance; from-tweens take their start state at once, so nothing flashes in place first
  const heroIn = (handoff, delay = 0) => {
    if (!motion) return;
    const words = $$('.hero__title .word').filter(w => !(handoff && w === heroWord));
    gsap.from(words, { yPercent: 115, duration: 1.2, ease: 'expo.out', stagger: 0.08, delay });
    gsap.from(['.hero__kicker', '.subs', '.hero__bottom'], { opacity: 0, y: 24, duration: 1.1, ease: 'expo.out', delay: delay + 0.2, stagger: 0.1 });
  };
  let introEnded = false;
  const endIntro = () => {
    if (introEnded) return; introEnded = true;
    doc.classList.add('intro-done', 'no-loader');
    if (loader) loader.remove();
  };
  // no intro this time, or it was skipped / its CSS safety net fired before this script arrived
  if (!loader || !doc.classList.contains('js-intro') || doc.classList.contains('intro-skip') || performance.now() > 3300) endIntro();
  else {
    doc.classList.add('intro-live'); // this script has it from here: the CSS safety nets stand down
    const word = $('[data-loader-word]'), lvb = $('.loader__tram--lvb');
    let phase = 'trams';
    const out = () => {
      if (phase !== 'trams') return; phase = 'out';
      const a = word.getBoundingClientRect(), b = heroWord && heroWord.getBoundingClientRect();
      if (b && b.width && b.top >= 0 && b.bottom <= innerHeight) {
        word.style.setProperty('--dx', `${b.left - a.left}px`);
        word.style.setProperty('--dy', `${b.top - a.top}px`);
        word.addEventListener('transitionend', e => { if (e.propertyName === 'transform') endIntro(); });
      } else loader.classList.add('is-far'); // page restored mid-scroll: no hero to land in, just fade
      loader.classList.add('is-out');
      heroIn(true, 0.36); // "Just ask." rises out of its line as the word lands under it
      setTimeout(endIntro, 700);
    };
    const skip = () => {
      if (phase !== 'trams') return; phase = 'skip';
      heroIn(false);
      setTimeout(endIntro, 300);
    };
    new MutationObserver(() => { if (doc.classList.contains('intro-skip')) skip(); }).observe(doc, { attributes: true, attributeFilter: ['class'] });
    // the trams may already be through if this script came in late
    const anims = lvb.getAnimations ? lvb.getAnimations() : [];
    if (doc.classList.contains('intro-play') && anims.length && anims.every(x => x.playState === 'finished')) out();
    else lvb.addEventListener('animationend', () => setTimeout(out, 40), { once: true });
    setTimeout(out, 2600); // and never hold the page longer than this
  }

  /* ---------- hero reel: one edit that intercuts the three films ---------- */
  // Chapters are time ranges in assets/video/hero-*.mp4 (15.4 s): Ask = the question,
  // Leave = phone away, watch check, the run starts, Make it = all three boardings.
  const heroV = $('[data-hero-video]');
  const chapters = $$('[data-chapter]');
  const vq = $('[data-voice-q]'), va = $('[data-voice-a]'), vt = $('[data-voice-t]');
  const CUES = [0, 2.65, 6.52];
  const VOICE = [
    { q: '“Hey Google, when’s the next tram?”', a: 'Tram 3 in 6 min. Leave in 2.' },
    { q: 'Timer running', a: '' },
    { q: 'Tram 3 · Torgauer Platz', a: 'Doors open. You made it.' }
  ];
  const FALLBACK_DUR = 15.4;
  let cur = -1, typer = null, reelVisible = true, autoplayOk = !reduce, t0 = performance.now();

  const typeText = (el, text) => {
    if (!el) return; clearInterval(typer);
    if (reduce) { el.textContent = text; return; }
    let i = 0; el.textContent = '';
    typer = setInterval(() => { i += 2; el.textContent = text.slice(0, i); if (i >= text.length) clearInterval(typer); }, 24);
  };
  const vsr = $('[data-voice-sr]');
  const setVoice = i => { if (vq) vq.textContent = VOICE[i].q; typeText(va, VOICE[i].a); if (vsr) vsr.textContent = `${VOICE[i].q} ${VOICE[i].a}`; };
  const dur = () => (heroV && heroV.duration) || FALLBACK_DUR;
  const chapterAt = t => { let i = 0; CUES.forEach((c, k) => { if (t >= c) i = k; }); return i; };
  const setChapter = i => {
    if (i === cur) return; cur = i;
    chapters.forEach((c, k) => { c.classList.toggle('is-active', k === i); c.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    setVoice(i);
  };
  chapters.forEach(c => c.addEventListener('click', () => {
    const k = +c.dataset.chapter;
    if (heroV) { try { heroV.currentTime = CUES[k] + 0.01; } catch (e) {} }
    t0 = performance.now() - CUES[k] * 1000; setChapter(k);
  }));

  if (heroV) {
    load(heroV);
    tryPlay(heroV).catch(() => { autoplayOk = false; });
    setChapter(0);
    const loop = now => {
      const d = dur();
      const t = autoplayOk && !heroV.paused ? heroV.currentTime : ((now - t0) / 1000) % d;
      if (!reelVisible) t0 = now - t * 1000;
      if (!reduce) setChapter(chapterAt(t));
      chapters.forEach((c, k) => {
        const bar = c.querySelector('i'); if (!bar) return;
        const s = CUES[k], e = CUES[k + 1] || d;
        bar.style.transform = `scaleX(${Math.min(1, Math.max(0, (t - s) / (e - s)))})`;
      });
      if (vt) vt.textContent = mmss(Math.max(0, d - t)); // real seconds, 0:00 as the film ends
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    new IntersectionObserver(([e]) => {
      reelVisible = e.isIntersecting;
      if (reelVisible) tryPlay(heroV).catch(() => {}); else heroV.pause();
    }, { threshold: 0.05 }).observe($('[data-hero]'));
  }

  /* ---------- lazy films ---------- */
  const lazyIO = new IntersectionObserver(entries => entries.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) { load(v); tryPlay(v).catch(() => {}); } else if (!v.paused) v.pause();
  }), { rootMargin: '300px 0px' });
  $$('video[data-lazy]').forEach(v => lazyIO.observe(v));

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduce && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    if (hasGsap) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); const el = id === '#top' ? document.body : $(id);
    if (!el) return; e.preventDefault();
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 }); else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }));

  /* ---------- nav hide/show + progress line ---------- */
  const nav = $('[data-nav]'), prog = $('[data-progress]');
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('is-solid', y > 80);
    nav.classList.toggle('is-hidden', y > 400 && y > lastY + 2);
    if (y < lastY - 2) nav.classList.remove('is-hidden');
    lastY = y;
    if (prog) prog.style.transform = `scaleX(${y / Math.max(1, doc.scrollHeight - innerHeight)})`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- ticker reacts to scroll speed ---------- */
  const mq = $('[data-marquee]');
  if (mq && mq.getAnimations && !reduce) {
    let vel = 0, prevY = scrollY; const mqVis = seen(mq);
    const anim = mq.getAnimations()[0];
    const mLoop = () => {
      if (!mqVis.on) { prevY = scrollY; requestAnimationFrame(mLoop); return; }
      const y = scrollY; const d = y - prevY; prevY = y;
      vel += (d - vel) * 0.1;
      if (anim) anim.playbackRate = (vel < -0.5 ? -1 : 1) * (1 + Math.min(6, Math.abs(vel) / 6));
      requestAnimationFrame(mLoop);
    };
    requestAnimationFrame(mLoop);
  }

  /* ---------- 04 how it works: line map, live call counts, small reveals ---------- */
  const how = $('[data-how]');
  if (how) {
    // each step plays its small animation once, when it comes into view
    const steps = $$('[data-how-step]', how);
    if (reduce || !('IntersectionObserver' in window)) steps.forEach(s => s.classList.add('is-on'));
    else {
      const stepIO = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-on'); stepIO.unobserve(e.target); }
      }), { threshold: 0.3 });
      steps.forEach(s => stepIO.observe(s));
    }

    // the map: hover or tap a line to follow it, the rest fades
    const map = $('[data-how-map]', how);
    if (map) {
      const btns = $$('[data-ln-btn]', map), parts = $$('svg [data-ln]', map);
      let fixed = null;
      const focus = ln => parts.forEach(p => p.classList.toggle('is-dim', Boolean(ln) && p.dataset.ln !== ln));
      btns.forEach(b => {
        const ln = b.dataset.lnBtn;
        b.addEventListener('click', () => {
          fixed = fixed === ln ? null : ln;
          btns.forEach(x => x.setAttribute('aria-pressed', String(x.dataset.lnBtn === fixed)));
          focus(fixed);
        });
        b.addEventListener('mouseenter', () => focus(ln));
        b.addEventListener('mouseleave', () => focus(fixed));
      });
    }

    // the live board: real call counts from the production API (public, counts only)
    const board = $('[data-how-stats]', how);
    if (board) {
      const note = $('[data-stats-note]', how);
      const countTo = (el, n) => {
        if (reduce) { el.textContent = n.toLocaleString('en-GB'); return; }
        const t0 = performance.now(), dur = 900;
        const stepN = now => {
          const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(n * e).toLocaleString('en-GB');
          if (k < 1) requestAnimationFrame(stepN);
        };
        requestAnimationFrame(stepN);
      };
      const show = d => {
        const counts = {};
        d.services.forEach(s => { counts[s.name] = Math.max(0, Number(s.count) || 0); });
        counts.total = Math.max(0, Number(d.total) || 0);
        $$('[data-stat]', board).forEach(el => countTo(el, counts[el.dataset.stat] || 0));
        const days = Array.isArray(d.daily) ? d.daily.map(n => Math.max(0, Number(n) || 0)) : [];
        const max = Math.max(1, ...days), spark = $('[data-spark]', board);
        if (spark) spark.innerHTML = days.map(n => `<i class="${n ? '' : 'is-zero'}" style="height:${Math.max(6, Math.round(n / max * 100))}%"></i>`).join('');
        board.dataset.state = 'live';
      };
      const fail = () => {
        board.dataset.state = 'error';
        if (note) note.innerHTML = 'The live counts can&rsquo;t be reached right now. They come from <a class="mono" href="https://app.nexttram.morgado.tech/api/stats" target="_blank" rel="noopener">/api/stats</a>, one Redis counter per function and day.';
      };
      const load = () => {
        const ctrl = typeof AbortController === 'function' ? new AbortController() : null;
        const timer = ctrl && setTimeout(() => ctrl.abort(), 8000);
        fetch('https://app.nexttram.morgado.tech/api/stats', ctrl ? { signal: ctrl.signal } : undefined)
          .then(r => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
          .then(d => { if (!d || !Array.isArray(d.services)) throw new Error('Unexpected reply'); show(d); })
          .catch(fail)
          .finally(() => clearTimeout(timer));
      };
      if ('IntersectionObserver' in window) {
        const boardIO = new IntersectionObserver(([e]) => { if (e.isIntersecting) { boardIO.disconnect(); load(); } }, { rootMargin: '600px 0px' });
        boardIO.observe(board);
      } else load();
    }

    // the terminal types its question, then Claude answers
    const term = $('[data-how-term]', how);
    const typed = term && $('[data-term-type]', term);
    if (typed && !reduce && 'IntersectionObserver' in window) {
      const full = typed.textContent;
      typed.textContent = '';
      term.classList.add('is-waiting');
      const termIO = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        termIO.disconnect();
        let i = 0;
        const type = () => {
          typed.textContent = full.slice(0, ++i);
          if (i < full.length) setTimeout(type, 30 + Math.random() * 45);
          else setTimeout(() => term.classList.remove('is-waiting'), 500);
        };
        setTimeout(type, 400);
      }, { threshold: 0.6 });
      termIO.observe(term);
    }
  }

  /* ---------- direction board ---------- */
  const board = $('[data-board-el]');
  const boardBtns = $$('[data-board]');
  const setBoard = v => { if (!board) return; board.dataset.view = v; $$('.is-other', board).forEach(row => row.setAttribute('aria-hidden', v === 'mine')); boardBtns.forEach(b => { const on = b.dataset.board === v; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); }); };
  boardBtns.forEach(b => b.addEventListener('click', () => setBoard(b.dataset.board)));
  if (board && !reduce) {
    let played = false;
    new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || played) return; played = true;
      setBoard('all'); setTimeout(() => setBoard('mine'), 1500);
    }, { threshold: 0.5 }).observe(board);
  }

  /* ---------- integrations: cards scrolled sideways, with arrows and dots ---------- */
  const itrack = $('[data-integr]');
  if (itrack) {
    const icards = $$('.icard', itrack), idots = $$('.integr__dots i'), prev = $('[data-integr-prev]'), next = $('[data-integr-next]');
    const current = () => { let k = 0, best = Infinity; icards.forEach((c, i) => { const d = Math.abs(c.offsetLeft - itrack.offsetLeft - itrack.scrollLeft - parseFloat(getComputedStyle(itrack).scrollPaddingLeft || 0)); if (d < best) { best = d; k = i; } }); return k; };
    const go = k => { const c = icards[Math.max(0, Math.min(icards.length - 1, k))]; itrack.scrollTo({ left: c.offsetLeft - itrack.offsetLeft - parseFloat(getComputedStyle(itrack).scrollPaddingLeft || 0), behavior: reduce ? 'auto' : 'smooth' }); };
    const sync = () => { const k = current(); idots.forEach((d, i) => d.classList.toggle('is-on', i === k)); if (prev) prev.disabled = k === 0; if (next) next.disabled = k === icards.length - 1; };
    prev && prev.addEventListener('click', () => go(current() - 1));
    next && next.addEventListener('click', () => go(current() + 1));
    itrack.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
    itrack.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); go(current() + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(current() - 1); } });
    sync();
  }

  /* ---------- (03) the message changes while the section is on screen ---------- */
  const says = $$('.says__item');
  if (says.length > 1 && !reduce) {
    const saysVis = seen($('[data-says]'));
    let si = 0;
    setInterval(() => {
      if (!saysVis.on) return;
      says[si].classList.remove('is-on'); si = (si + 1) % says.length; says[si].classList.add('is-on');
    }, 4500);
  }

  /* ---------- app demo: two stops checked in parallel ---------- */
  const app = {
    stop: $('[data-app-stop]'), line: $('[data-app-line]'), dest: $('[data-app-dest]'), min: $('[data-app-min]'),
    sec: $('[data-app-sec]'), ghost: $('[data-app-ghost]'), leave: $('[data-app-leave]'), walk: $('[data-app-walk]')
  };
  if (app.min) {
    const STOPS = [
      { name: 'Edlichstraße', short: 'ES', walk: 2, line: '7', dest: 'Böhlitz-E.', next: 600, every: 600 },
      { name: 'Torgauer Platz', short: 'TP', walk: 4, line: '3', dest: 'Knautkleeberg', next: 389, every: 600 }
    ];
    const W = { ghost: $('[data-w-ghost]'), stop: $('[data-w-stop]'), line: $('[data-w-line]'), dest: $('[data-w-dest]'), time: $('[data-w-time]'), leave: $('[data-w-leave]') };
    const cards = $$('[data-stopcard]');
    let last = performance.now();
    const SPEED = reduce ? 0 : 1; // a live timer: one second per second
    const step = () => {
      const now = performance.now(); const dt = (now - last) / 1000 * SPEED; last = now;
      STOPS.forEach(s => { s.next -= dt; while (s.next < s.walk * 60) s.next += s.every; });
      const best = STOPS.reduce((a, b) => (b.next < a.next ? b : a));
      STOPS.forEach((s, i) => {
        const el = $(`[data-sc-min="${i}"]`); if (el) el.textContent = `${Math.floor(s.next / 60)} min`;
        if (cards[i]) cards[i].classList.toggle('is-best', s === best);
      });
      app.stop.textContent = best.name; app.line.textContent = best.line; app.line.dataset.line = best.line; app.dest.textContent = `→ ${best.dest}`;
      app.ghost.textContent = best.short; app.min.textContent = mmss(best.next); // big mm:ss timer, like the watch
      app.sec.textContent = `${Math.floor(best.next / 60)} min`; app.walk.textContent = `${best.walk} min walk`;
      const leave = Math.floor((best.next - best.walk * 60) / 60);
      app.leave.textContent = leave <= 0 ? 'Leave now' : `Leave in ${leave} min`;
      // the watch shows the same answer as the phone
      if (W.time) {
        W.stop.textContent = best.name; W.dest.textContent = `→ ${best.dest}`;
        W.line.textContent = W.ghost.textContent = best.line; W.line.dataset.line = W.ghost.dataset.line = best.line;
        W.time.textContent = mmss(best.next); W.leave.textContent = app.leave.textContent;
      }
    };
    const appVis = seen($('.device'));
    step(); setInterval(() => { if (appVis.on) step(); else last = performance.now(); }, 250);
  }

  /* ---------- scroll choreography (GSAP) ---------- */
  if (motion) {
    const mm = gsap.matchMedia();

    // hero hands over: the film shrinks into a card, the title lifts away
    gsap.to('[data-reel]', { clipPath: 'inset(10% 5% 0% 5% round 28px)', ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('[data-hero-title]', { yPercent: -35, scale: 0.85, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } });

    // parallax photos
    $$('[data-parallax]').forEach(img => {
      gsap.fromTo(img, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: img.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    // headlines over images rise
    $$('.photo__copy .h-xl, .film__caption .h-xl, .cta__title, .stops__text .h-xl').forEach(h => {
      gsap.from(h, { yPercent: 25, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 90%' } });
    });

    mm.add({ wide: '(min-width: 1024px) and (min-height: 600px)', narrow: '(max-width: 1023px), (max-height: 599px)' }, ctx => {
      // films open from a card to full bleed
      const inset = ctx.conditions.wide ? 'inset(9% 16% 9% 16% round 32px)' : 'inset(6% 5% 6% 5% round 22px)';
      $$('[data-film-frame]').forEach(f => {
        gsap.fromTo(f, { clipPath: inset }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: f, start: 'top 85%', end: 'top 15%', scrub: true } });
      });
    });

    // the delay sum collapses into one instruction
    const eq = $('[data-eq]');
    if (eq) {
      const tl = gsap.timeline({ scrollTrigger: { trigger: eq, start: 'top 85%', end: 'top 45%', scrub: true } });
      tl.fromTo(eq.querySelector('.eq__old'), { '--strike': 0 }, { '--strike': 1, ease: 'none', duration: 0.4 })
        .to(eq.querySelectorAll('.eq__old span'), { opacity: 0.25, y: -10, stagger: 0.05, duration: 0.3 })
        .from(eq.querySelector('.eq__new b'), { opacity: 0, scale: 0.85, transformOrigin: 'left center', duration: 0.4 }, '-=0.2');
    }

    // "No" lines slide up
    gsap.from('.nos__list li', { yPercent: 40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.nos__list', start: 'top 80%' } });
    // footer word rises
    gsap.from('.foot__word', { yPercent: 40, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    addEventListener('load', () => ScrollTrigger.refresh());
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  /* ---------- cursor + magnetic buttons (fine pointers only) ---------- */
  const cursor = $('.cursor');
  if (cursor && matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
    const label = $('.cursor__label', cursor);
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; cursor.classList.add('is-on'); }, { passive: true });
    document.addEventListener('mouseleave', () => cursor.classList.remove('is-on'));
    const cLoop = () => { cx += (x - cx) * 0.2; cy += (y - cy) * 0.2; cursor.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(cLoop); };
    requestAnimationFrame(cLoop);
    $$('[data-cursor]').forEach(s => {
      s.addEventListener('mouseenter', () => { label.textContent = s.dataset.cursor; cursor.classList.add('is-big'); });
      s.addEventListener('mouseleave', () => cursor.classList.remove('is-big'));
    });
    $$('a, button, input').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.remove('is-big'));
      el.addEventListener('mouseleave', () => { const s = el.closest('[data-cursor]'); if (s) { label.textContent = s.dataset.cursor; cursor.classList.add('is-big'); } });
    });
    $$('[data-magnetic]').forEach(b => {
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`; });
      b.addEventListener('mouseleave', () => { b.style.transform = ''; });
    });
  }
})();
