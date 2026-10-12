/**
 * Renderiza SOLO la pista de audio del video (voz + efectos + música).
 * Sirve para revisar la mezcla sin esperar el render de los 1456 frames.
 *
 *   npm run audio            → out/promo-veterinarias.wav
 *   npm run audio -- out/mezcla.wav
 */
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {execFile} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import {promisify} from 'node:util';

const run = promisify(execFile);
const root = path.resolve(import.meta.dirname, '..');
const outArg = process.argv.slice(2).find((a) => !a.startsWith('-'));
const output = path.resolve(root, outArg ?? 'out/promo-veterinarias.wav');

const main = async () => {
  await fs.mkdir(path.dirname(output), {recursive: true});

  console.log('Empaquetando el proyecto…');
  const serveUrl = await bundle({
    entryPoint: path.join(root, 'src/index.ts'),
    publicDir: path.join(root, 'public'),
    onProgress: () => undefined,
  });

  const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
  const composition = await selectComposition({
    serveUrl,
    id: 'PromoVeterinarias',
    browserExecutable,
  });

  await renderMedia({
    composition,
    serveUrl,
    codec: 'wav',
    outputLocation: output,
    browserExecutable,
    overwrite: true,
    onProgress: () => undefined,
  });

  const {stdout} = await run('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'csv=p=0',
    output,
  ]);
  console.log(`✓ ${path.relative(root, output)} · ${Number(stdout).toFixed(2)} s`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
