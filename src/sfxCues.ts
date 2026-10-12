import {beats, benefitCardStart} from './beats';
import {scenes} from './config';
import {sceneStarts, TOTAL_FRAMES, transitionStarts} from './timeline';

export type SfxKind = 'pop' | 'whoosh' | 'ding';

/**
 * `volume` es el retoque por cue (0,8 a 1). Se multiplica por
 * `audio.sfx.volume` y por el `gain` del efecto, así que el nivel final de
 * cualquier efecto queda entre el 30% y el 38%.
 */
export type SfxCue = {frame: number; kind: SfxKind; volume?: number};

const SCENE = {
  hook: 0,
  punch: 1,
  problem: 2,
  solution: 3,
  benefits: 4,
  beforeAfter: 5,
  offer: 6,
  cta: 7,
} as const;

const at = (scene: keyof typeof SCENE, local: number) =>
  sceneStarts[SCENE[scene]] + Math.round(local);

/**
 * Cuándo suena cada efecto. Se arma a partir de los mismos `beats` que usan
 * las escenas, así que si movés una animación el sonido la sigue.
 */
export const sfxCues: SfxCue[] = (() => {
  const cues: SfxCue[] = [];

  // Whoosh en cada transición.
  transitionStarts.forEach((frame) => cues.push({frame, kind: 'whoosh'}));

  // 1 · resultados del buscador.
  scenes.hook.results.forEach((_, i) =>
    cues.push({
      frame: at('hook', beats.hook.resultsStart + i * beats.hook.resultEvery),
      kind: 'pop',
      volume: 0.85,
    }),
  );

  // 2 · tarjeta vacía y golpe.
  cues.push({frame: at('punch', beats.punch.emptyCardIn), kind: 'pop'});
  cues.push({frame: at('punch', beats.punch.punchlineIn), kind: 'whoosh'});

  // 3 · burbujas que caen y saltos del contador.
  scenes.problem.messages.forEach((_, i) =>
    cues.push({
      frame: at('problem', beats.problem.firstBubble + i * beats.problem.bubbleEvery),
      kind: 'pop',
      volume: 0.8,
    }),
  );
  beats.problem.counterSteps.forEach((f) =>
    cues.push({frame: at('problem', f), kind: 'pop', volume: 0.9}),
  );

  // 4 · bloques de la landing.
  new Array(6).fill(0).forEach((_, i) =>
    cues.push({
      frame: at('solution', beats.solution.buildStart + i * beats.solution.buildEvery),
      kind: 'pop',
      volume: 0.8,
    }),
  );

  // 5 · entrada de cada tarjeta + check verde.
  scenes.benefits.cards.forEach((_, i) => {
    const base = benefitCardStart(i);
    cues.push({frame: at('benefits', base), kind: 'pop'});
    cues.push({frame: at('benefits', base + beats.benefits.checkAt), kind: 'ding'});
  });

  // 6 · barrido del divisor.
  cues.push({frame: at('beforeAfter', beats.beforeAfter.dividerStart), kind: 'whoosh'});

  // 7 · tarjeta de precio y checks de la lista.
  cues.push({frame: at('offer', beats.offer.cardIn), kind: 'pop'});
  scenes.offer.bullets.forEach((_, i) =>
    cues.push({
      frame: at('offer', beats.offer.bulletsStart + i * beats.offer.bulletEvery + 7),
      kind: 'ding',
      volume: 0.9,
    }),
  );

  // 8 · botón final y cierre.
  cues.push({frame: at('cta', beats.cta.buttonIn), kind: 'pop'});
  cues.push({frame: at('cta', beats.cta.noteIn), kind: 'ding'});

  const sorted = cues
    .filter((c) => c.frame >= 0 && c.frame < TOTAL_FRAMES)
    .sort((a, b) => a.frame - b.frame);

  // El whoosh de una transición ya marca el golpe: si justo ahí entraba
  // además un "pop", lo sacamos para que no suenen amontonados.
  const whooshes = sorted.filter((c) => c.kind === 'whoosh').map((c) => c.frame);
  return sorted.filter(
    (c) => c.kind !== 'pop' || !whooshes.some((w) => Math.abs(w - c.frame) <= 3),
  );
})();
