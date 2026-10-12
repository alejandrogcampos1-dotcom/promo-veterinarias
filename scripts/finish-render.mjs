/**
 * Se corre después del render. Hace dos cosas:
 *
 * 1. Avisa qué archivos de audio encontró y cuáles faltan en public/.
 * 2. Recorta la colita de audio que deja el codec AAC.
 *
 *    El encoder AAC agrega unas muestras de relleno al final, así que el mp4
 *    queda con el audio unos milisegundos más largo que el video. En ese
 *    tramo no hay imagen y muchos reproductores lo muestran NEGRO. Acá se
 *    remuxea (sin recomprimir) para que las dos pistas terminen juntas y el
 *    último frame sea el del cierre.
 */
import {execFile} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import {promisify} from 'node:util';

const run = promisify(execFile);
const root = path.resolve(import.meta.dirname, '..');
const file = path.resolve(root, process.argv[2] ?? 'out/promo-veterinarias.mp4');

const AUDIO_FILES = [
  ['musica.mp3', 'música de fondo'],
  ['voz.mp3', 'voz en off'],
  ['sfx/pop.mp3', 'efecto pop'],
  ['sfx/whoosh.mp3', 'efecto whoosh'],
  ['sfx/ding.mp3', 'efecto ding'],
];

const probe = async (args) => {
  const {stdout} = await run('ffprobe', ['-v', 'error', ...args, file]);
  return stdout.trim();
};

const main = async () => {
  // ── 1 · Qué audio hay y qué falta ──────────────────────────────────────
  const missing = [];
  for (const [rel, label] of AUDIO_FILES) {
    const full = path.join(root, 'public', rel);
    try {
      await fs.access(full);
      const dur = await run('ffprobe', [
        '-v',
        'error',
        '-show_entries',
        'format=duration',
        '-of',
        'csv=p=0',
        full,
      ]);
      console.log(`  ✓ public/${rel.padEnd(16)} ${Number(dur.stdout).toFixed(2)} s · ${label}`);
    } catch {
      missing.push(`public/${rel} (${label})`);
    }
  }
  if (missing.length) {
    console.log('\n  ⚠  FALTAN estos archivos, así que no suenan en el render:');
    missing.forEach((m) => console.log(`     · ${m}`));
    console.log('');
  }

  // ── 2 · Emparejar el final de video y audio ────────────────────────────
  const videoDur = Number(
    await probe([
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=duration',
      '-of',
      'csv=p=0',
    ]),
  );
  const formatDur = Number(
    await probe(['-show_entries', 'format=duration', '-of', 'csv=p=0']),
  );

  if (!Number.isFinite(videoDur) || formatDur - videoDur <= 0.001) {
    console.log(`  ✓ video y audio terminan juntos (${videoDur.toFixed(3)} s)`);
    return;
  }

  const tmp = file.replace(/\.mp4$/, '.tmp.mp4');
  await run('ffmpeg', [
    '-v', 'error', '-y',
    '-i', file,
    '-c', 'copy',
    '-t', String(videoDur),
    '-movflags', '+faststart',
    tmp,
  ]);
  await fs.rename(tmp, file);

  const after = Number(await probe(['-show_entries', 'format=duration', '-of', 'csv=p=0']));
  console.log(
    `  ✓ colita de audio recortada: ${formatDur.toFixed(3)} s → ${after.toFixed(3)} s ` +
      `(el último frame ahora es el del cierre, no negro)`,
  );
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
