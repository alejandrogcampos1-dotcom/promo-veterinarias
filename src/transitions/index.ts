import {linearTiming, springTiming} from '@remotion/transitions';
import {clockWipe} from '@remotion/transitions/clock-wipe';
import {fade} from '@remotion/transitions/fade';
import {iris} from '@remotion/transitions/iris';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import type {TransitionKind} from '../config';
import {video} from '../config';
import {coralWipe} from './coralWipe';

/**
 * Traduce el `kind` que pusiste en config.transitions a una transición real.
 * Se usan solo presentaciones basadas en CSS: renderizan igual en cualquier
 * máquina, sin depender de WebGL.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const presentationFor = (kind: TransitionKind): any => {
  switch (kind) {
    case 'fade':
      return fade();
    case 'slideUp':
      return slide({direction: 'from-bottom'});
    case 'slideLeft':
      return slide({direction: 'from-right'});
    case 'wipeDiagonal':
      return wipe({direction: 'from-top-right'});
    case 'clockWipe':
      return clockWipe({width: video.width, height: video.height});
    case 'iris':
      return iris({width: video.width, height: video.height});
    case 'coralWipe':
    default:
      return coralWipe();
  }
};

/**
 * Curva de tiempo de cada transición. Los deslizamientos usan un resorte
 * muy amortiguado (arranca y frena suave); los barridos van lineales para
 * que la velocidad del barrido sea constante.
 */
export const timingFor = (kind: TransitionKind, durationInFrames: number) => {
  if (kind === 'slideUp' || kind === 'slideLeft') {
    return springTiming({durationInFrames, config: {damping: 200}});
  }
  return linearTiming({durationInFrames});
};
