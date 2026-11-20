// Rebuilds assets/app-demos/ from the nextTram app repo.
//   node tools/app-demos/build.mjs ../next-tram
// Needs the app repo checked out with its dependencies installed (npm ci): it uses the app's
// esbuild and three.js. The output is committed, so the site itself still has no build step.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const site = resolve(here, '../..');
const app = resolve(process.argv[2] || join(site, '../next-tram'));
const esbuild = createRequire(join(app, 'package.json'))('esbuild');
const out = join(site, 'assets/app-demos');
mkdirSync(out, { recursive: true });

const appSrc = join(app, 'src');
await esbuild.build({
  entryPoints: [join(here, 'entry.ts')],
  bundle: true, format: 'esm', splitting: true, minify: true, target: 'es2020',
  outdir: out, entryNames: 'app-demos', chunkNames: '[name]-[hash]',
  nodePaths: [join(app, 'node_modules')],
  legalComments: 'none',
  plugins: [{
    name: 'app-paths',
    setup(b) {
      b.onResolve({ filter: /^@app\// }, (a) => ({ path: join(appSrc, a.path.slice(5)) }));
      b.onResolve({ filter: /i18n\/index\.ts$/ }, () => ({ path: join(here, 'i18n-stub.ts') }));
    },
  }],
});

// The race shows the app icon (point it at the site's copy) and the name, as the site spells it.
for (const f of ['app-demos.js']) {
  const p = join(out, f);
  writeFileSync(p, readFileSync(p, 'utf8').replaceAll('icons/icon.svg', 'assets/img/icon.svg').replaceAll('NextTram</', 'nextTram</'));
}
copyFileSync(join(app, 'public/intro.css'), join(out, 'intro.css'));
console.log('built', out);
