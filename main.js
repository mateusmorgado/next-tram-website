// Next Tram showcase: small interactions only. Everything reads fine without JS.
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero board: a sample countdown that loops 6 → 4 min, like a real wait.
  const heroMin = document.getElementById('hero-min');
  const heroLeave = document.getElementById('hero-leave');
  if (heroMin && heroLeave && !reduce) {
    let m = 6;
    setInterval(() => {
      m = m <= 4 ? 6 : m - 1;
      heroMin.textContent = m;
      heroLeave.textContent = m - 4 <= 0 ? 'Leave now' : `Leave in ${m - 4} min`;
    }, 2600);
  }

  // Assistant timer: counts down 2:00 in a loop.
  const fill = document.getElementById('timer-fill');
  const text = document.getElementById('timer-text');
  if (fill && text) {
    const total = 120;
    let left = total;
    const draw = () => {
      const mm = Math.floor(left / 60);
      const ss = String(left % 60).padStart(2, '0');
      text.textContent = left > 0 ? `Leave in ${mm}:${ss}` : 'Leave now';
      fill.style.transform = `scaleX(${left / total})`;
    };
    draw();
    if (!reduce) setInterval(() => { left = left <= 0 ? total : left - 1; draw(); }, 250);
  }

  // Walk-time demo. Same rule as the app: a tram you can't reach on foot is too tight.
  const range = document.getElementById('walk-range');
  const out = document.getElementById('walk-out');
  const box = document.getElementById('walk-result');
  const tram = document.getElementById('walk-tram');
  const advice = document.getElementById('walk-advice');
  const note = document.getElementById('walk-note');
  const deps = [{ line: '3', in: 6, at: '13:15' }, { line: '3', in: 14, at: '13:23' }];
  const update = () => {
    const walk = Number(range.value);
    out.textContent = walk;
    const catchable = deps.find(d => d.in >= walk);
    const skipped = deps.filter(d => d.in < walk);
    box.classList.toggle('tight', skipped.length > 0);
    if (!catchable) {
      tram.textContent = 'No tram you can reach';
      advice.textContent = 'Too tight';
      note.textContent = 'Every tram in the next 14 min leaves before you could get there.';
      box.classList.remove('now');
      return;
    }
    const leave = catchable.in - walk;
    tram.textContent = `Tram ${catchable.line} · ${catchable.at}`;
    advice.textContent = leave === 0 ? '🏃 Leave now' : `🚶 Leave in ${leave} min`;
    box.classList.toggle('now', leave === 0);
    note.textContent = skipped.length
      ? `Earlier: Tram 3 in ${skipped[0].in} min is too tight for your ${walk} min walk.`
      : leave === 0 ? 'Go now and you’ll make it.' : 'You’ll reach the stop with time to spare.';
  };
  if (range) { range.addEventListener('input', update); update(); }

  // Reveal: content is visible at rest; sections below the fold get a small lift on entry.
  if (!reduce && 'IntersectionObserver' in window) {
    const els = document.querySelectorAll('.section .wrap > *');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('pre'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      el.classList.add('reveal');
      if (r.top > window.innerHeight) { el.classList.add('pre'); io.observe(el); }
    });
  }
})();
