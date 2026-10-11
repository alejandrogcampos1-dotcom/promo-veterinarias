import React from 'react';
import {Composition} from 'remotion';
import {video} from './config';
import {PromoVeterinarias} from './PromoVeterinarias';
import {TOTAL_FRAMES} from './timeline';

export const RemotionRoot: React.FC = () => (
  <>
    {/* El video que se renderiza. */}
    <Composition
      id="PromoVeterinarias"
      component={PromoVeterinarias}
      durationInFrames={TOTAL_FRAMES}
      fps={video.fps}
      width={video.width}
      height={video.height}
      defaultProps={{showGuides: false}}
    />

    {/* Igual, pero con las guías de zona segura dibujadas encima.
        Sirve para chequear que nada quede tapado por WhatsApp/Instagram. */}
    <Composition
      id="PromoVeterinariasGuias"
      component={PromoVeterinarias}
      durationInFrames={TOTAL_FRAMES}
      fps={video.fps}
      width={video.width}
      height={video.height}
      defaultProps={{showGuides: true}}
    />
  </>
);
