/**
 * Baja Plus Jakarta Sans e Inter a public/fonts/ y genera src/fontManifest.ts.
 *
 *   npm run fonts
 *
 * ¿Por qué local y no desde la CDN de Google?
 * Porque así el render no depende de internet: sale igual en tu máquina, en un
 * servidor o sin conexión, y arranca más rápido. Las URLs se leen del propio
 * paquete @remotion/google-fonts, así que siguen siendo las fuentes oficiales.
 */
import {execFile} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import {promisify} from 'node:util';

const run = promisify(execFile);
const root = path.resolve(import.meta.dirname, '..');
const outDir = path.join(root, 'public/fonts');

/** Qué familias y qué subconjuntos de caracteres necesitamos. */
const families = [
  {module: '@remotion/google-fonts/PlusJakartaSans', slug: 'PlusJakartaSans'},
  {module: '@remotion/google-fonts/Inter', slug: 'Inter'},
];
const subsets = ['latin', 'latin-ext'];

const main = async () => {
  await fs.mkdir(outDir, {recursive: true});
  const manifest = [];

  for (const {module, slug} of families) {
    const {getInfo} = await import(module);
    const info = getInfo();
    const weights = Object.keys(info.fonts.normal)
      .map(Number)
      .sort((a, b) => a - b);
    // Plus Jakarta Sans e Inter son fuentes variables: un archivo por subset
    // cubre todos los pesos, así que declaramos el rango completo.
    const weightRange = `${weights[0]} ${weights[weights.length - 1]}`;

    const files = [];
    for (const subset of subsets) {
      const url = info.fonts.normal[String(weights[weights.length - 1])][subset];
      if (!url) {
        console.warn(`! ${slug}: no hay subset ${subset}, se saltea`);
        continue;
      }
      const fileName = `${slug}-${subset}.woff2`;
      const dest = path.join(outDir, fileName);
      await run('curl', ['-fsSL', '--retry', '3', '-o', dest, url]);
      const {size} = await fs.stat(dest);
      console.log(`✓ ${fileName}  ${(size / 1024).toFixed(1)} kB`);
      files.push({
        path: `fonts/${fileName}`,
        unicodeRange: info.unicodeRanges[subset],
      });
    }

    manifest.push({family: info.fontFamily, weightRange, files});
  }

  // Licencia, porque los .woff2 quedan versionados en el repo.
  try {
    const text = await fs.readFile(
      path.join(root, 'node_modules/@remotion/google-fonts/LICENSE.md'),
      'utf8',
    );
    await fs.writeFile(path.join(outDir, 'LICENSE.md'), text);
    console.log('✓ public/fonts/LICENSE.md');
  } catch {
    /* sin licencia en el paquete: no es crítico */
  }

  const ts = `/* Generado por scripts/download-fonts.mjs — no editar a mano.
 * Volvé a generarlo con: npm run fonts
 */

export type FontFamilyManifest = {
  family: string;
  /** Rango de pesos que cubre la fuente variable, ej. "200 800". */
  weightRange: string;
  files: {path: string; unicodeRange: string}[];
};

export const fontManifest: FontFamilyManifest[] = ${JSON.stringify(
    manifest,
    null,
    2,
  )};
`;
  await fs.writeFile(path.join(root, 'src/fontManifest.ts'), ts);
  console.log('✓ src/fontManifest.ts');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
