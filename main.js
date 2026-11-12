/* Next Tram showcase, v2. Every effect is an enhancement: the page reads fully without JS,
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
  const tick = () => $$('[data-clock]').forEach(el => { el.textContent = fmt.format(new Date()); });
  tick(); setInterval(tick, 10000);

  /* ---------- video sources: 720p on small screens or data saver ---------- */
  const small = matchMedia('(max-width: 1199px)').matches || (navigator.connection && navigator.connection.saveData);
  const load = v => { if (reduce) return; if (v && !v.getAttribute('src')) { v.src = `${v.dataset.src}-${small ? 720 : 1080}.mp4`; } };
  const tryPlay = v => { if (reduce || !v) return Promise.reject(); const p = v.play(); return p && p.catch ? p : Promise.resolve(); };

  /* ---------- loader ---------- */
  const loader = $('.loader');
  const countEl = $('[data-loader-count]');
  let introDone = false;
  const startIntro = () => {
    if (introDone) return; introDone = true;
    loader && loader.classList.add('is-done');
    if (motion) {
      gsap.from('.hero__title .word', { yPercent: 115, duration: 1.4, ease: 'expo.out', stagger: 0.08, delay: 0.2 });
      gsap.from(['.hero__kicker', '.subs', '.hero__bottom'], { opacity: 0, y: 24, duration: 1.1, ease: 'expo.out', delay: 0.6, stagger: 0.1 });
    }
  };
  if (reduce || !loader) { doc.classList.add('no-loader'); introDone = true; }
  else {
    let n = 3;
    const step = setInterval(() => { n -= 1; if (countEl) countEl.textContent = n > 0 ? n : 'now'; if (n <= 0) { clearInterval(step); setTimeout(startIntro, 260); } }, 320);
  }

  /* ---------- hero reel: three films cut into each other ---------- */
  const clips = $$('.reel__clip');
  const chapters = $$('[data-chapter]');
  const wipe = $('.reel__wipe');
  const vq = $('[data-voice-q]'), va = $('[data-voice-a]'), vt = $('[data-voice-t]');
  const VOICE = [
    { q: '“Hey Google, when’s the next tram?”', a: 'Tram 3 to Hauptbahnhof leaves Torgauer Platz in 6 minutes. Leave in 2.' },
    { q: 'Timer running', a: 'Tram 3 is on time. Your 4 minute walk is already counted in.' },
    { q: 'Tram 3 · Torgauer Platz', a: 'Doors open. You made it.' }
  ];
  const CLIP_MAX = 8; // seconds each film plays before the cut
  let cur = 0, clipStart = performance.now(), typer = null, reelVisible = true, autoplayOk = !reduce;

  const typeText = (el, text) => {
    if (!el) return; clearInterval(typer);
    if (reduce) { el.textContent = text; return; }
    let i = 0; el.textContent = '';
    typer = setInterval(() => { i += 2; el.textContent = text.slice(0, i); if (i >= text.length) clearInterval(typer); }, 24);
  };
  const vsr = $('[data-voice-sr]');
  const setVoice = i => { if (vq) vq.textContent = VOICE[i].q; typeText(va, VOICE[i].a); if (vsr) vsr.textContent = `${VOICE[i].q} ${VOICE[i].a}`; };

  const go = (i, user = false) => {
    if (!clips.length) return;
    i = (i + clips.length) % clips.length;
    if (i === cur && !user) return;
    const prev = clips[cur], next = clips[i];
    if (prev !== next) {
      clips.forEach(c => c.classList.remove('is-prev'));
      prev.classList.remove('is-active'); prev.classList.add('is-prev');
      void next.offsetWidth;
      next.classList.add('is-active');
      if (wipe && !reduce) { wipe.classList.remove('is-go'); void wipe.offsetWidth; wipe.classList.add('is-go'); }
      const pv = prev.querySelector('video');
      setTimeout(() => { prev.classList.remove('is-prev'); if (pv) { pv.pause(); try { pv.currentTime = 0; } catch (e) {} } }, 1200);
    }
    cur = i; clipStart = performance.now();
    chapters.forEach((c, k) => { c.classList.toggle('is-active', k === i); c.setAttribute('aria-current', k === i ? 'true' : 'false'); const bar = c.querySelector('i'); if (bar) bar.style.transform = k < i ? 'scaleX(1)' : 'scaleX(0)'; });
    const v = next.querySelector('video');
    load(v); try { v.currentTime = 0; } catch (e) {}
    if (reelVisible) tryPlay(v).catch(() => { autoplayOk = false; });
    load(clips[(i + 1) % clips.length].querySelector('video')); // warm up the next film
    setVoice(i);
  };
  chapters.forEach(c => c.addEventListener('click', () => go(+c.dataset.chapter, true)));
  const heroEl = $('[data-hero]');
  if (heroEl && matchMedia('(hover: hover) and (pointer: fine)').matches) heroEl.addEventListener('click', e => { if (!e.target.closest('a, button')) go(cur + 1, true); });

  if (clips.length) {
    const first = clips[0].querySelector('video'); load(first);
    tryPlay(first).catch(() => { autoplayOk = false; });
    setVoice(0);
    const loop = now => {
      const v = clips[cur].querySelector('video');
      const dur = Math.min(CLIP_MAX, (v && v.duration) || CLIP_MAX);
      const t = autoplayOk && v && !v.paused ? v.currentTime : (now - clipStart) / 1000;
      if (!reelVisible) clipStart = now - t * 1000;
      const p = Math.min(1, t / dur);
      const bar = chapters[cur] && chapters[cur].querySelector('i');
      if (bar) bar.style.transform = `scaleX(${p})`;
      if (vt) vt.textContent = mmss(120 * (1 - (cur + p) / clips.length));
      if (!reduce && reelVisible && p >= 1) go(cur + 1);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    new IntersectionObserver(([e]) => {
      reelVisible = e.isIntersecting;
      const v = clips[cur].querySelector('video');
      if (reelVisible) tryPlay(v).catch(() => {}); else v.pause();
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

  /* ---------- manifesto: words light up as you read ---------- */
  const man = $('[data-manifesto]');
  if (man) {
    const words = man.textContent.trim().split(/\s+/);
    man.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(' ');
    const spans = $$('.w', man);
    const light = p => { const n = Math.round(p * spans.length); spans.forEach((s, i) => s.classList.toggle('is-lit', i < n)); };
    if (motion) ScrollTrigger.create({ trigger: man, start: 'top 80%', end: 'bottom 45%', scrub: true, onUpdate: s => light(s.progress) });
    else new IntersectionObserver(([e], o) => { if (e.isIntersecting) { light(1); o.disconnect(); } }).observe(man);
  }

  /* ---------- the one number counts down ---------- */
  const punch = $('[data-punch]');
  if (punch && !reduce) {
    new IntersectionObserver(([e], o) => {
      if (!e.isIntersecting) return; o.disconnect();
      let n = 24; punch.textContent = n;
      const t = setInterval(() => { n -= 1; punch.textContent = n; if (n <= 6) clearInterval(t); }, 60);
    }, { threshold: 0.5 }).observe(punch);
  }

  /* ---------- feed panel content (phones) ---------- */
  const feed = $('[data-feed]');
  if (feed) {
    const rows = [
      ['18:07:04', 'LVB', '3', 'Taucha', '+0'], ['18:07:04', 'LVB', '8', 'Paunsdorf-Nord', '+1'], ['18:07:05', 'LVB', '3', 'Knautkleeberg', '+0', 1],
      ['18:07:05', 'LVB', '7', 'Sommerfeld', '+2'], ['18:07:06', 'BVG', 'M10', 'Hauptbahnhof', '+0'], ['18:07:06', 'LVB', '8', 'Grünau-Nord', '+4'],
      ['18:07:07', 'BVG', 'M13', 'Virchow-Klinikum', '+1'], ['18:07:07', 'LVB', '7', 'Böhlitz-E.', '+0'], ['18:07:08', 'LVB', '3', 'Knautkleeberg', '+0', 1],
      ['18:07:08', 'LVB', 'N17', 'Sommerfeld', '+0'], ['18:07:09', 'BVG', '12', 'Am Kupfergraben', '+3'], ['18:07:09', 'LVB', '15', 'Meusdorf', '+0']
    ];
    const html = rows.map(r => `<div${r[5] ? ' class="hl"' : ''}>${r[0]}  ${r[1]}  ${r[2].padEnd(4, ' ')} ${r[3].padEnd(17, ' ')} ${r[4]}</div>`).join('');
    feed.innerHTML = html + html;
  }

  /* ---------- ring timers (2 minutes shown in 24 seconds) ---------- */
  const rings = $$('[data-ring]');
  if (rings.length) {
    const C = 2 * Math.PI * 88; rings.forEach(r => { r.style.strokeDasharray = C; });
    const labels = $$('[data-ring-t]');
    const t0 = performance.now();
    const ringVis = rings.map(el => seen(el.closest('svg')));
    const rLoop = now => {
      if (!reduce && !ringVis.some(v => v.on)) { requestAnimationFrame(rLoop); return; }
      const s = reduce ? 0 : ((now - t0) / 200) % 120;
      rings.forEach(r => { r.style.strokeDashoffset = (C * s / 120).toFixed(1); });
      labels.forEach(l => { l.textContent = mmss(120 - s); });
      if (!reduce) requestAnimationFrame(rLoop);
    };
    requestAnimationFrame(rLoop);
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
    const cards = $$('[data-stopcard]');
    let last = performance.now();
    const SPEED = reduce ? 0 : 4; // demo time runs 4x
    const step = () => {
      const now = performance.now(); const dt = (now - last) / 1000 * SPEED; last = now;
      STOPS.forEach(s => { s.next -= dt; while (s.next < s.walk * 60) s.next += s.every; });
      const best = STOPS.reduce((a, b) => (b.next < a.next ? b : a));
      STOPS.forEach((s, i) => {
        const el = $(`[data-sc-min="${i}"]`); if (el) el.textContent = `${Math.floor(s.next / 60)} min`;
        if (cards[i]) cards[i].classList.toggle('is-best', s === best);
      });
      app.stop.textContent = best.name; app.line.textContent = best.line; app.dest.textContent = `→ ${best.dest}`;
      app.ghost.textContent = best.short; app.min.textContent = Math.floor(best.next / 60);
      app.sec.textContent = mmss(best.next); app.walk.textContent = `${best.walk} min walk`;
      const leave = Math.floor((best.next - best.walk * 60) / 60);
      app.leave.textContent = leave <= 0 ? 'Leave now' : `Leave in ${leave} min`;
    };
    const appVis = seen($('.device'));
    step(); setInterval(() => { if (appVis.on) step(); else last = performance.now(); }, 250);
  }

  /* ---------- walk slider + line ---------- */
  const range = $('[data-walk]');
  if (range) {
    const MAX = 18;
    const DEPS = [
      { m: 1, line: '3', dest: 'Knautkleeberg' }, { m: 3, line: '8', dest: 'Grünau-Nord' }, { m: 6, line: '3', dest: 'Knautkleeberg' },
      { m: 9, line: '8', dest: 'Grünau-Nord' }, { m: 13, line: '3', dest: 'Knautkleeberg' }, { m: 17, line: '8', dest: 'Grünau-Nord' }
    ];
    const out = $('[data-walk-out]'), leaveEl = $('[data-walk-leave]'), list = $('[data-walk-list]');
    const lineEl = $('.wline'), ticks = $('[data-ticks]');
    ticks.innerHTML = DEPS.map(d => `<span class="tick" style="left:${d.m / MAX * 100}%"><b class="badge">${d.line}</b><span class="mono">${d.m}&prime;</span></span>`).join('');
    const tickEls = $$('.tick', ticks);
    const render = () => {
      const w = +range.value;
      out.textContent = w;
      range.setAttribute('aria-valuetext', `${w} minute walk`);
      lineEl.style.setProperty('--w', w);
      const pick = DEPS.find(d => d.m >= w);
      const leave = pick ? pick.m - w : null;
      leaveEl.textContent = leave === null ? 'Nothing you can make' : leave === 0 ? 'Leave now' : `Leave in ${leave} min`;
      leaveEl.classList.toggle('is-now', leave === 0);
      DEPS.forEach((d, i) => { tickEls[i].classList.toggle('is-tight', d.m < w); tickEls[i].classList.toggle('is-pick', d === pick); });
      list.innerHTML = DEPS.slice(0, 4).map(d => {
        const tight = d.m < w, isPick = d === pick;
        return `<li class="${tight ? 'is-tight' : ''}"><b class="badge">${d.line}</b><span>${d.dest} <span class="mono">in ${d.m} min</span></span><span class="tag">${tight ? 'too tight' : isPick ? 'your tram' : ''}</span></li>`;
      }).join('');
    };
    range.addEventListener('input', render); render();
  }

  /* ---------- watch face cycles routes ---------- */
  const W = { ghost: $('[data-w-ghost]'), stop: $('[data-w-stop]'), line: $('[data-w-line]'), dest: $('[data-w-dest]'), time: $('[data-w-time]'), leave: $('[data-w-leave]') };
  if (W.time && !reduce) {
    const STATES = [
      { ghost: 'M10', stop: 'S+U Warschauer Str.', line: 'M10', dest: '→ Friedrich', time: '11:32', leave: 'Leave in 9 min' },
      { ghost: '3', stop: 'Torgauer Platz', line: '3', dest: '→ Knautkleeberg', time: '18:13', leave: 'Leave in 2 min' },
      { ghost: '7', stop: 'Edlichstraße', line: '7', dest: '→ Böhlitz-E.', time: '18:18', leave: 'Leave in 8 min' }
    ];
    const face = $('.watch__face'); let k = 0; const wVis = seen(face);
    setInterval(() => {
      if (!wVis.on) return;
      k = (k + 1) % STATES.length; const s = STATES[k];
      face.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: 'forwards' }).onfinish = () => {
        Object.keys(W).forEach(key => { if (W[key]) W[key].textContent = s[key]; });
        face.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, fill: 'forwards' });
      };
    }, 3600);
  }

  /* ---------- scroll choreography (GSAP) ---------- */
  const panels = $$('.panel');
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

      if (!ctx.conditions.wide) {
        panels.forEach(p => ScrollTrigger.create({ trigger: p, start: 'top 65%', onEnter: () => p.classList.add('is-on') }));
        return;
      }

      // How it works: one board through three states, pinned
      const sec = $('[data-bridge]'), stage = $('[data-stage]'), wrapEl = $('[data-stage-wrap]');
      sec.classList.add('has-stage');
      const words = $$('[data-sw]', stage), steps = $$('[data-ss]', stage), ticksEl = $$('[data-st]', stage);
      const rows = $$('[data-sboard-rows] li', stage), keep = $('.is-keep', stage), others = rows.filter(r => r !== keep);
      const setTick = i => ticksEl.forEach((t, k) => t.classList.toggle('is-on', k <= i));
      setTick(0);
      const swap = (a, b) => {
        tl.to(words[a], { opacity: 0, scale: 0.92, duration: 0.35 })
          .to(steps[a], { opacity: 0, y: -20, duration: 0.25 }, '<')
          .to(words[b], { opacity: 1, scale: 1, duration: 0.35 }, '>-0.1')
          .to(steps[b], { opacity: 1, y: 0, duration: 0.25 }, '<');
      };
      gsap.set(words.slice(1), { opacity: 0, scale: 1.08 });
      gsap.set(steps.slice(1), { opacity: 0, y: 20 });
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: wrapEl, start: 'top top', end: 'bottom bottom', scrub: 0.6,
          onUpdate: s => setTick(s.progress < 0.36 ? 0 : s.progress < 0.7 ? 1 : 2)
        }
      });
      // 1 fetch: rows pour in as the board arrives (outside the scrubbed timeline)
      gsap.from(rows, { opacity: 0, x: 40, stagger: 0.06, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: wrapEl, start: 'top 75%' } });
      tl.to({}, { duration: 0.6 });
      // 2 strip
      swap(0, 1);
      tl.to(others, { height: 0, paddingTop: 0, paddingBottom: 0, opacity: 0, borderWidth: 0, stagger: 0.04, duration: 0.6 }, '<')
        .to(keep, { backgroundColor: '#ffd400', color: '#0b0b0c', scale: 1.12, duration: 0.4 }, '-=0.2')
        .to({}, { duration: 0.5 });
      // 3 say
      swap(1, 2);
      tl.to('[data-sboard]', { opacity: 0, scale: 0.9, filter: 'blur(6px)', duration: 0.5 }, '<')
        .fromTo('[data-ssay]', { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 0.5 }, '-=0.2')
        .to({}, { duration: 0.5 });
      return () => { sec.classList.remove('has-stage'); };
    });

    // yellow floods in for "your pace"
    const walkSec = $('[data-walk-section]');
    if (walkSec) {
      doc.classList.add('flood');
      gsap.fromTo(document.body, { backgroundColor: '#0b0b0c' }, { backgroundColor: '#ffd400', ease: 'none', immediateRender: false, scrollTrigger: { trigger: walkSec, start: 'top 85%', end: 'top 35%', scrub: true } });
      gsap.fromTo(document.body, { backgroundColor: '#ffd400' }, { backgroundColor: '#0b0b0c', ease: 'none', immediateRender: false, scrollTrigger: { trigger: walkSec, start: 'bottom 35%', end: 'bottom top', scrub: true } });
    }

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
    // the race rows
    gsap.from('.race__row', { yPercent: 30, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.15, scrollTrigger: { trigger: '.race', start: 'top 85%' } });
    // watch turns as you pass
    gsap.fromTo('.watch__body', { rotate: -10, y: 40 }, { rotate: 6, y: -40, ease: 'none', scrollTrigger: { trigger: '.watch', start: 'top bottom', end: 'bottom top', scrub: true } });
    // footer word rises
    gsap.from('.foot__word', { yPercent: 40, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    addEventListener('load', () => ScrollTrigger.refresh());
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  } else {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-on'); }), { threshold: 0.4 });
    panels.forEach(p => io.observe(p));
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
