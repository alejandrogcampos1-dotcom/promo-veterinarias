import {Easing, interpolate, spring} from 'remotion';

type SpringOpts = {
  /** Frames de espera antes de arrancar. */
  delay?: number;
  /** Duración del resorte en frames. */
  duration?: number;
};

/** Entrada con rebote suave (el caballito de batalla del video). */
export const springIn = (frame: number, fps: number, opts: SpringOpts = {}) =>
  spring({
    frame: frame - (opts.delay ?? 0),
    fps,
    config: {damping: 13, mass: 0.7, stiffness: 110},
    durationInFrames: opts.duration ?? 26,
  });

/** Entrada más seca y rápida, para elementos chicos. */
export const springSnap = (frame: number, fps: number, opts: SpringOpts = {}) =>
  spring({
    frame: frame - (opts.delay ?? 0),
    fps,
    config: {damping: 18, mass: 0.5, stiffness: 180},
    durationInFrames: opts.duration ?? 18,
  });

/** Rebote exagerado, para el golpe de "¿Y la tuya?". */
export const springPunch = (frame: number, fps: number, opts: SpringOpts = {}) =>
  spring({
    frame: frame - (opts.delay ?? 0),
    fps,
    config: {damping: 9, mass: 0.9, stiffness: 140},
    durationInFrames: opts.duration ?? 34,
  });

/** Movimiento sin resorte, con curva suave. */
export const ease = (
  frame: number,
  from: number,
  to: number,
  outFrom = 0,
  outTo = 1,
): number =>
  interpolate(frame, [from, to], [outFrom, outTo], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Lineal con clamp en las dos puntas (para fades y barridos). */
export const ramp = (
  frame: number,
  from: number,
  to: number,
  outFrom = 0,
  outTo = 1,
): number =>
  interpolate(frame, [from, to], [outFrom, outTo], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/**
 * Fade de entrada y salida de una escena: 0 → 1 → 1 → 0.
 * Sirve para que nada aparezca ni desaparezca de golpe.
 */
export const inOut = (
  frame: number,
  duration: number,
  fadeIn = 10,
  fadeOut = 10,
): number =>
  interpolate(
    frame,
    [0, fadeIn, duration - fadeOut, duration],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

/** Latido continuo (para el botón del CTA). */
export const pulse = (frame: number, periodInFrames = 42, amount = 0.035): number =>
  1 + Math.sin((frame / periodInFrames) * Math.PI * 2) * amount;

/** Temblor que se va apagando (tarjeta vacía de la escena 2). */
export const shake = (frame: number, amplitude = 10, decay = 40): number => {
  const falloff = Math.exp(-frame / decay);
  return Math.sin(frame * 0.9) * amplitude * falloff;
};

/** Reparte N elementos en el tiempo (stagger de 3-5 frames). */
export const stagger = (index: number, every = 4, start = 0): number =>
  start + index * every;
