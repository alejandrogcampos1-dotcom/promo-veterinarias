import {layout, scenes, transitions, video} from './config';

/**
 * El orden de las escenas. Cambiá el orden acá y todo (duración total,
 * transiciones y cues de sonido) se recalcula solo.
 */
export const sceneOrder = [
  'hook',
  'punch',
  'problem',
  'solution',
  'benefits',
  'beforeAfter',
  'offer',
  'cta',
] as const;

export type SceneId = (typeof sceneOrder)[number];

export const sceneDurations: number[] = sceneOrder.map(
  (id) => scenes[id].durationInFrames,
);

/**
 * En un <TransitionSeries> las transiciones se SUPERPONEN: la duración total
 * es la suma de las escenas menos la suma de las transiciones.
 */
export const transitionFrames: number[] = sceneOrder
  .slice(0, -1)
  .map((_, i) => transitions[i]?.durationInFrames ?? 0);

export const TOTAL_FRAMES =
  sceneDurations.reduce((a, b) => a + b, 0) -
  transitionFrames.reduce((a, b) => a + b, 0);

export const TOTAL_SECONDS = TOTAL_FRAMES / video.fps;

/** Frame absoluto en el que empieza cada escena dentro del video final. */
export const sceneStarts: number[] = (() => {
  const out: number[] = [];
  let acc = 0;
  for (let i = 0; i < sceneDurations.length; i++) {
    out.push(acc);
    acc += sceneDurations[i] - (transitionFrames[i] ?? 0);
  }
  return out;
})();

/** Frame absoluto en el que arranca cada transición (el "corte"). */
export const transitionStarts: number[] = transitionFrames.map((_, i) => {
  return sceneStarts[i] + sceneDurations[i] - transitionFrames[i];
});

/** Tabla legible para el README y para sincronizar los subtítulos. */
export const timelineTable = sceneOrder.map((id, i) => ({
  id,
  index: i + 1,
  startFrame: sceneStarts[i],
  startSeconds: Number((sceneStarts[i] / video.fps).toFixed(2)),
  durationInFrames: sceneDurations[i],
  /** Centro visual del corte siguiente (ahí se percibe el cambio de escena). */
  cutSeconds:
    i < transitionFrames.length
      ? Number(
          (
            (transitionStarts[i] + transitionFrames[i] / 2) /
            video.fps
          ).toFixed(2),
        )
      : TOTAL_SECONDS,
}));

// ─── Geometría de la zona segura ────────────────────────────────────────────

export const safe = {
  left: layout.safeX,
  right: video.width - layout.safeX,
  width: video.width - layout.safeX * 2,
  top: layout.safeTop,
  bottom: video.height - layout.safeBottom,
};

/** Franja de subtítulos: termina 30px antes de la zona insegura de abajo. */
export const subtitleBand = {
  bottom: safe.bottom - 30,
  height: layout.subtitleBandHeight,
  get top() {
    return this.bottom - this.height;
  },
};

/** Zona útil para el contenido de cada escena (arriba de los subtítulos). */
export const contentArea = {
  left: safe.left,
  width: safe.width,
  top: safe.top,
  bottom: subtitleBand.top - 20,
  get height() {
    return this.bottom - this.top;
  },
  get centerY() {
    return (this.top + this.bottom) / 2;
  },
};
