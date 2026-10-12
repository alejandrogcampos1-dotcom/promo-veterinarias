/**
 * Revisa la mezcla de un render ya hecho y dice si las tres capas están ahí
 * y en el nivel que pide `audio` en src/config.ts.
 *
 *   npm run check                       → out/promo-veterinarias.mp4
 *   npm run check -- out/otra-cosa.mp4
 *
 * ─── Por qué no alcanza con medir el volumen ───
 *
 * La música, la voz y los efectos suenan juntos: un medidor común devuelve el
 * total y no sabe de quién es cada decibel. Acá se reconstruye cada capa por
 * separado, igual que la arma SoundTrack.tsx, y se la busca dentro de la
 * mezcla por proyección:
 *
 *     ganancia = ⟨capa, mezcla⟩ / ⟨capa, capa⟩
 *
 * Si la capa está al volumen pedido, da ese volumen. Si no está, da ~0. Y como
 * el cociente se calcula contra la propia capa, no importa si la música sube o
 * baja de intensidad: lo que se mide es la ganancia aplicada, no el contenido.
 *
 * ─── La trampa en la que es fácil caer ───
 *
 * Remotion redondea los tiempos a FRAMES ENTEROS antes de pasarlos a muestras.
 * Si acá se convirtiera de segundos a muestras directo, cada frase de la voz
 * quedaría corrida hasta 33 ms y la medición daría cualquier cosa —parecería
 * que la voz no está—. Por eso todo pasa por `f2s(Math.round(seg * FPS))`.
 */
import {execFile} from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {promisify} from 'node:util';
import esbuild from 'esbuild';

const run = promisify(execFile);
const root = path.resolve(import.meta.dirname, '..');
const file = path.resolve(root, process.argv.slice(2).find((a) => !a.startsWith('-')) ?? 'out/promo-veterinarias.mp4');

const SR = 48000;
const db = (x) => (x > 0 ? 20 * Math.log10(x) : -Infinity);
const ok = (cond) => (cond ? '✓' : '✗');

let failures = 0;
const check = (cond, text) => {
  if (!cond) failures++;
  console.log(`  ${ok(cond)} ${text}`);
};

/** Bundlea un módulo TS del proyecto para no duplicar acá sus números. */
const loadModule = async (rel) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'promo-check-'));
  const outfile = path.join(dir, 'm.mjs');
  await esbuild.build({
    entryPoints: [path.join(root, rel)],
    outfile,
    bundle: true,
    format: 'esm',
    platform: 'node',
    external: ['remotion', 'react', 'react/*', '@remotion/*'],
    logLevel: 'silent',
  });
  return import(outfile);
};

/** Cualquier archivo → mono float32 a 48 kHz. */
const decodeMono = async (f) => {
  const {stdout} = await run(
    'ffmpeg',
    ['-v', 'error', '-i', f, '-f', 'f32le', '-ac', '1', '-ar', String(SR), '-'],
    {maxBuffer: 1 << 30, encoding: 'buffer'},
  );
  return new Float32Array(stdout.buffer, stdout.byteOffset, stdout.length / 4);
};

/** Ganancia de `ref` dentro de `mix` a partir de `at`, buscando el desfase. */
const probe = (mix, ref, at, search = 1600, step = 16) => {
  let refE = 0;
  for (let k = 0; k < ref.length; k++) refE += ref[k] * ref[k];
  if (refE <= 0) return null;

  let best = {gain: 0, r: -2, lag: 0};
  const scan = (from, to, by) => {
    for (let lag = from; lag <= to; lag += by) {
      let dot = 0;
      let e = 0;
      for (let k = 0; k < ref.length; k++) {
        const x = mix[at + k + lag] ?? 0;
        dot += ref[k] * x;
        e += x * x;
      }
      const r = e > 0 ? dot / Math.sqrt(refE * e) : 0;
      if (r > best.r) best = {gain: dot / refE, r, lag};
    }
  };
  scan(-search, search, step);
  if (step > 1) scan(best.lag - step, best.lag + step, 1);
  return best;
};

const main = async () => {
  const {audio, subtitles} = await loadModule('src/config.ts');
  const {TOTAL_FRAMES} = await loadModule('src/timeline.ts');
  const {sfxCues} = await loadModule('src/sfxCues.ts');
  const {video} = await loadModule('src/config.ts');

  const FPS = video.fps;
  const f2s = (f) => Math.round((f / FPS) * SR);
  const TOTAL = f2s(TOTAL_FRAMES);

  const exists = async (rel) =>
    fs
      .access(path.join(root, 'public', rel))
      .then(() => true)
      .catch(() => false);

  console.log(`Revisando ${path.relative(root, file)}\n`);
  const mix = await decodeMono(file);
  console.log(
    `  mezcla ${(mix.length / SR).toFixed(3)} s · video ${(TOTAL / SR).toFixed(3)} s ` +
      `(${TOTAL_FRAMES} frames a ${FPS} fps)`,
  );
  check(
    Math.abs(mix.length - TOTAL) < 0.05 * SR,
    `el audio dura lo mismo que el video (si sobra, el final queda en negro)`,
  );

  // ── MÚSICA ────────────────────────────────────────────────────────────────
  console.log('\n── Música ─────────────────────────────────────────────────');
  if (!(await exists(audio.music.src))) {
    console.log(`  ✗ falta public/${audio.music.src}: no hay música en el video`);
    failures++;
  } else {
    const src = await decodeMono(path.join(root, 'public', audio.music.src));
    const offset = f2s(Math.round(audio.music.startFromSeconds * FPS));
    const slice =
      audio.music.useSeconds === null
        ? TOTAL_FRAMES
        : Math.max(1, Math.round(audio.music.useSeconds * FPS));

    // La misma pista que monta SoundTrack.tsx, pero con ganancia 1.
    const ref = new Float32Array(TOTAL);
    for (let from = 0; from < TOTAL_FRAMES; from += slice) {
      const at = f2s(from);
      const len = f2s(Math.min(slice, TOTAL_FRAMES - from));
      for (let i = 0; i < len && at + i < TOTAL; i++) ref[at + i] = src[offset + i] ?? 0;
      if (!audio.music.loop) break;
    }

    const fadeIn = Math.max(1, Math.round(audio.music.fadeInSeconds * FPS));
    const fadeOut = Math.max(1, Math.round(audio.music.fadeOutSeconds * FPS));
    const curve = (f) => {
      if (f <= 0 || f >= TOTAL_FRAMES) return 0;
      if (f < fadeIn) return (audio.music.volume * f) / fadeIn;
      if (f > TOTAL_FRAMES - fadeOut) {
        return (audio.music.volume * (TOTAL_FRAMES - f)) / fadeOut;
      }
      return audio.music.volume;
    };

    const win = 2 * SR;
    const flat = [];
    let silent = 0;
    let windows = 0;
    for (let start = 0; start + win <= TOTAL; start += win) {
      const seg = ref.subarray(start, start + win);
      let e = 0;
      for (let k = 0; k < seg.length; k++) e += seg[k] * seg[k];
      if (e / seg.length < 1e-8) continue; // tramo sin música en el archivo
      windows++;
      const p = probe(mix, seg, start, 800, 16);
      if (!p || p.gain < 0.25 * audio.music.volume) silent++;
      const f = ((start + win / 2) / SR) * FPS;
      if (curve(f) >= audio.music.volume - 1e-9 && p) flat.push(p.gain);
    }

    const avg = flat.reduce((a, b) => a + b, 0) / flat.length;
    // Los fades se miran donde más se notan: el primer y el último segundo.
    const head = probe(mix, ref.subarray(0, SR), 0, 800, 16);
    const tail = probe(mix, ref.subarray(TOTAL - SR, TOTAL), TOTAL - SR, 800, 16);

    console.log(
      `  recorte: desde ${audio.music.startFromSeconds} s, ` +
        `${audio.music.useSeconds ?? 'hasta el final'}${audio.music.useSeconds ? ' s por vuelta' : ''}` +
        `, loop ${audio.music.loop ? 'sí' : 'no'}`,
    );
    console.log(
      `  nivel medido ${avg.toFixed(4)} · pedido ${audio.music.volume} ` +
        `(${db(avg / audio.music.volume).toFixed(2)} dB)`,
    );
    check(
      Math.abs(db(avg / audio.music.volume)) < 1.5,
      `suena al ${(audio.music.volume * 100).toFixed(0)}%`,
    );
    check(silent === 0, `suena en todo el video (${windows - silent}/${windows} tramos con música)`);
    check(
      head !== null && head.gain < avg * 0.75,
      `fade in de ${audio.music.fadeInSeconds} s (primer segundo al ${((head?.gain ?? 0) / avg * 100).toFixed(0)}% del nivel)`,
    );
    check(
      tail !== null && tail.gain < avg * 0.6,
      `fade out de ${audio.music.fadeOutSeconds} s (último segundo al ${((tail?.gain ?? 0) / avg * 100).toFixed(0)}% del nivel)`,
    );
  }

  // ── VOZ ───────────────────────────────────────────────────────────────────
  console.log('\n── Voz en off ─────────────────────────────────────────────');
  if (!(await exists(audio.voiceover.src))) {
    console.log(`  · no hay public/${audio.voiceover.src} (opcional)`);
  } else {
    const src = await decodeMono(path.join(root, 'public', audio.voiceover.src));
    const gains = [];
    let maxLag = 0;
    for (const p of audio.voiceover.phrases) {
      const at = f2s(Math.round((p.at + audio.voiceover.offsetSeconds) * FPS));
      const from = f2s(Math.round(p.from * FPS));
      const len = f2s(Math.max(1, Math.round((p.to - p.from) * FPS)));
      const ref = new Float32Array(len);
      for (let k = 0; k < len; k++) ref[k] = src[from + k] ?? 0;
      const r = probe(mix, ref, at, Math.round(0.15 * SR), 8);
      if (!r) continue;
      gains.push(r.gain);
      maxLag = Math.max(maxLag, Math.abs(r.lag));
    }
    const avg = gains.reduce((a, b) => a + b, 0) / gains.length;
    console.log(
      `  ${gains.length} frases · nivel medido ${avg.toFixed(2)} · pedido ${audio.voiceover.volume} ` +
        `(${db(avg / audio.voiceover.volume).toFixed(2)} dB)`,
    );
    check(
      Math.abs(db(avg / audio.voiceover.volume)) < 1.5,
      `entra al volumen pedido`,
    );
    check(
      maxLag < 0.03 * SR,
      `cada frase cae donde dice el config (corrimiento máximo ${((maxLag / SR) * 1000).toFixed(1)} ms)`,
    );
  }

  // ── EFECTOS ───────────────────────────────────────────────────────────────
  console.log('\n── Efectos ────────────────────────────────────────────────');
  const kinds = Object.entries(audio.sfx.sounds);
  const haveAll = (await Promise.all(kinds.map(([, s]) => exists(s.src)))).every(Boolean);
  if (!haveAll) {
    console.log('  · faltan efectos en public/sfx/ (opcionales)');
  } else {
    const banks = {};
    for (const [kind, s] of kinds) banks[kind] = await decodeMono(path.join(root, 'public', s.src));

    const voiceOn = audio.voiceover.enabled !== false && (await exists(audio.voiceover.src));
    const duck = voiceOn ? audio.sfx.duckUnderVoice : 1;
    const onVoice = (sec) =>
      subtitles.cues.some(
        (c) =>
          sec >= c.from + subtitles.offsetSeconds - 0.15 &&
          sec <= c.to + subtitles.offsetSeconds + 0.15,
      );

    const errs = [];
    const levels = [];
    for (const cue of sfxCues) {
      const sound = audio.sfx.sounds[cue.kind];
      const bank = banks[cue.kind];
      const want =
        audio.sfx.volume * sound.gain * (cue.volume ?? 1) * (onVoice(cue.frame / FPS) ? duck : 1);
      const len = Math.min(bank.length, f2s(45));
      const r = probe(mix, bank.subarray(0, len), f2s(cue.frame), 1600, 16);
      if (!r) continue;
      errs.push(Math.abs(db(r.gain / want)));
      levels.push(want);
    }
    const avgErr = errs.reduce((a, b) => a + b, 0) / errs.length;
    const missing = errs.filter((e) => !(e < 3)).length;
    console.log(
      `  ${sfxCues.length} efectos · entre el ${(Math.min(...levels) * 100).toFixed(0)}% y el ` +
        `${(Math.max(...levels) * 100).toFixed(0)}% · ducking bajo la voz ${duck}`,
    );
    // Un efecto ausente proyectaría ganancia ~0, o sea un error enorme en dB.
    check(missing === 0, `están los ${sfxCues.length} en su frame y en nivel`);
    console.log(`    error de nivel: promedio ${avgErr.toFixed(2)} dB · peor ${Math.max(...errs).toFixed(2)} dB`);
  }

  console.log(
    `\n${failures === 0 ? '✓ la mezcla es la que pide el config' : `✗ ${failures} cosa(s) para revisar`}`,
  );
  process.exit(failures === 0 ? 0 : 1);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
