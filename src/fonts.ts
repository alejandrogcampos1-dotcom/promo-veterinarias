import {loadFont} from '@remotion/fonts';
import type {CSSProperties} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import {fontManifest} from './fontManifest';

/**
 * Tipografías: Plus Jakarta Sans (títulos, peso 800) e Inter (textos).
 *
 * Los .woff2 están en public/fonts/ y se bajaron del propio paquete
 * @remotion/google-fonts con `npm run fonts`. Al servirlos localmente el
 * render no depende de internet y sale idéntico en cualquier máquina.
 *
 * ¿Querés usarlas directo desde la CDN de Google? Reemplazá todo este bloque por:
 *
 *   import {loadFont as loadJakarta} from '@remotion/google-fonts/PlusJakartaSans';
 *   import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
 *   const jakarta = loadJakarta('normal', {weights: ['600', '700', '800']});
 *   const inter = loadInter('normal', {weights: ['400', '500', '600', '700']});
 *   export const fontTitle = jakarta.fontFamily;
 *   export const fontBody = inter.fontFamily;
 */
const handle = delayRender('Cargando tipografías');

Promise.all(
  fontManifest.flatMap((family) =>
    family.files.map((file) =>
      loadFont({
        family: family.family,
        url: staticFile(file.path),
        weight: family.weightRange,
        unicodeRange: file.unicodeRange,
        style: 'normal',
        format: 'woff2',
        display: 'block',
      }),
    ),
  ),
)
  .then(() => continueRender(handle))
  .catch((err: Error) => {
    // Si faltara algún .woff2, el video renderiza con la tipografía del sistema
    // en vez de cortarse. Volvé a correr `npm run fonts` para arreglarlo.
    // eslint-disable-next-line no-console
    console.warn(`[fuentes] no se pudieron cargar: ${err.message}`);
    continueRender(handle);
  });

const fallback = `-apple-system, "Segoe UI", Roboto, system-ui, sans-serif`;

/** Fuente de títulos. Usar junto a fontWeight 800. */
export const fontTitle = `"Plus Jakarta Sans", ${fallback}`;

/** Fuente de textos y subtítulos. */
export const fontBody = `"Inter", ${fallback}`;

/** Números tabulares para que los contadores no "bailen" al cambiar de cifra. */
export const numericFeatures: CSSProperties = {
  fontVariantNumeric: 'tabular-nums',
  fontFeatureSettings: '"tnum" 1',
};
