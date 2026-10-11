/**
 * Renderiza un fotograma (still) de cada escena para poder revisarlas
 * sin tener que renderizar el video entero.
 *
 *   npm run stills              → out/stills/
 *   npm run stills -- --guides  → out/stills-guias/ (con las zonas seguras dibujadas)
 */
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import esbuild from 'esbuild';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const withGuides = process.argv.includes('--guides');
const outDir = path.join(root, withGuides ? 'out/stills-guias' : 'out/stills');

/** Carga un módulo TS del proyecto, para no duplicar los tiempos acá. */
const loadModule = async (relativePath) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'promo-ts-'));
  const outfile = path.join(dir, 'module.mjs');
  await esbuild.build({
    entryPoints: [path.join(root, relativePath)],
    outfile,
    bundle: true,
    format: 'esm',
    platform: 'node',
    logLevel: 'error',
  });
  return import(pathToFileURL(outfile).href);
};

/** Qué frame de cada escena vale la pena mirar (frame local dentro de la escena). */
const shots = (timeline, beats) => {
  const {sceneStarts, sceneOrder} = timeline;
  const at = (id, local, label) => {
    const index = sceneOrder.indexOf(id);
    return {
      frame: sceneStarts[index] + local,
      name: `${String(index + 1).padStart(2, '0')}-${id}${label ? `-${label}` : ''}`,
    };
  };
  const card = (i) => beats.benefits.startOffset + i * beats.benefits.cardDuration + 74;
  return [
    at('hook', 112),
    at('punch', 98),
    at('problem', 196),
    at('solution', 180),
    at('benefits', card(0), '1-buscador'),
    at('benefits', card(1), '2-whatsapp'),
    at('benefits', card(2), '3-horarios'),
    at('benefits', card(3), '4-estrellas'),
    at('beforeAfter', 104),
    at('offer', 196),
    at('cta', 112),
  ];
};

const main = async () => {
  const timeline = await loadModule('src/timeline.ts');
  const {beats} = await loadModule('src/beats.ts');
  console.log(
    `Duración total: ${timeline.TOTAL_FRAMES} frames (${timeline.TOTAL_SECONDS.toFixed(2)} s)`,
  );
  console.table(timeline.timelineTable);

  await fs.mkdir(outDir, {recursive: true});

  console.log('Empaquetando el proyecto…');
  const serveUrl = await bundle({
    entryPoint: path.join(root, 'src/index.ts'),
    publicDir: path.join(root, 'public'),
    onProgress: () => undefined,
  });

  const id = withGuides ? 'PromoVeterinariasGuias' : 'PromoVeterinarias';
  const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;

  const composition = await selectComposition({serveUrl, id, browserExecutable});

  const shotList = shots(timeline, beats);
  for (const shot of shotList) {
    if (shot.frame >= composition.durationInFrames) {
      console.warn(`! ${shot.name}: frame ${shot.frame} queda fuera del video, se saltea`);
      continue;
    }
    const output = path.join(outDir, `${shot.name}.png`);
    await renderStill({
      composition,
      serveUrl,
      output,
      frame: shot.frame,
      imageFormat: 'png',
      overwrite: true,
      browserExecutable,
    });
    console.log(`✓ ${path.relative(root, output)}  (frame ${shot.frame})`);
  }

  console.log(`\nListo: ${shotList.length} stills en ${path.relative(root, outDir)}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
