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

const race = document.querySelector<HTMLElement>('[data-demo="fast"]');
if (race) whileVisible(race, (ctx) => mountFast(race, ctx));

const walk = document.querySelector<HTMLElement>('[data-demo="walk"]');
if (walk) {
  const shortcut = mountScene('shortcut');
  whileVisible(walk, (ctx) => shortcut(walk, ctx));
}
