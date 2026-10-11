import React from 'react';
import {useCurrentFrame} from 'remotion';
import {colors, layout} from '../config';
import {radius as R} from '../styles';
import {safe, TOTAL_FRAMES} from '../timeline';

/** Barra fina de progreso, dentro de la zona segura de abajo. */
export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  if (!layout.showProgressBar) {
    return null;
  }
  const progress = Math.min(1, Math.max(0, frame / (TOTAL_FRAMES - 1)));

  return (
    <div
      style={{
        position: 'absolute',
        left: safe.left,
        width: safe.width,
        top: safe.bottom - 20,
        height: 8,
        borderRadius: R.pill,
        background: 'rgba(30, 41, 59, 0.13)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: '100%',
          borderRadius: R.pill,
          background: `linear-gradient(90deg, ${colors.teal} 0%, ${colors.coral} 100%)`,
        }}
      />
    </div>
  );
};
