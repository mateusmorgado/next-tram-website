/**
 * Website entry for the nextTram app's own "How it works" animations.
 * Built by build.mjs from the app repo (mateusmorgado/next-tram, src/app/screens/intro),
 * so the site plays exactly the animations the app shows on first open.
 */
import { mountFast } from '@app/app/screens/intro/demo-fast.ts';
import { mountScene } from '@app/app/screens/intro/demo-scene.ts';
import type { DemoContext, IntroScene } from '@app/app/screens/intro/helpers.ts';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function context(): DemoContext {
  let scene: IntroScene | null = null;
  let pending: Promise<IntroScene | null> | null = null;
  return {
    reduced,
    dark: true,
    scene(host: HTMLElement) {
      pending ||= import('@app/app/screens/intro/scene.ts')
        .then((mod) => {
          try {
            scene = mod.createScene(host, { reduced, dark: true, onLost: () => host.closest('.in-3d')?.classList.remove('live') });
          } catch {
            scene = null; // no WebGL: the flat map stays
          }
          return scene;
        })
        .catch(() => null);
      return pending;
    },
    sceneNow: () => scene,
  };
}

/** Mount a demo while its host is on screen, stop it when it scrolls away. */
function whileVisible(host: HTMLElement, mount: (ctx: DemoContext) => () => void, keep = false) {
  const ctx = context();
  let stop: (() => void) | null = null;
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !stop) stop = mount(ctx);
    else if (!e.isIntersecting && stop) {
      if (keep) { ctx.sceneNow()?.pause(); return; }
      stop(); stop = null;
    }
  }, { rootMargin: '200px 0px' }).observe(host);
}

// The race, then the tap count for each app, then the race again.
const race = document.querySelector<HTMLElement>('[data-demo="fast"]');
const taps = document.querySelector<HTMLElement>('[data-taps]');
if (race) {
  whileVisible(race, (ctx) => {
    if (ctx.reduced) {
      const stop = mountFast(race, ctx);
      taps?.classList.add('is-on');
      return stop;
    }
    let stopRace: (() => void) | null = null;
    let timer = 0;
    let watch: MutationObserver | null = null;
    const run = () => {
      taps?.classList.remove('is-on');
      stopRace = mountFast(race, ctx);
      const root = race.querySelector('.in-race');
      watch = new MutationObserver(() => {
        if (!root?.classList.contains('fading')) return;
        watch?.disconnect();
        stopRace?.(); stopRace = null;
        taps?.classList.add('is-on');
        timer = window.setTimeout(run, 4200);
      });
      if (root) watch.observe(root, { attributes: true, attributeFilter: ['class'] });
    };
    run();
    return () => { watch?.disconnect(); stopRace?.(); clearTimeout(timer); taps?.classList.remove('is-on'); };
  });
}

const walk = document.querySelector<HTMLElement>('[data-demo="walk"]');
if (walk) {
  const shortcut = mountScene('shortcut');
  whileVisible(walk, (ctx) => shortcut(walk, ctx));
}
