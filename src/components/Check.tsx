import {evolvePath} from '@remotion/paths';
import type {CSSProperties} from 'react';
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {ramp, springIn} from '../anim';
import {colors} from '../config';

const CHECK_PATH = 'M8 18.5 L15.6 26 L29 9.5';

/**
 * Check verde que se dibuja solo: el círculo entra con rebote y
 * el tilde se traza de punta a punta.
 */
export const DrawnCheck: React.FC<{
  size?: number;
  delay?: number;
  color?: string;
  background?: string;
  drawFrames?: number;
  /** Anillo que se expande y se apaga cuando termina el tilde. */
  burst?: boolean;
  style?: CSSProperties;
}> = ({
  size = 90,
  delay = 0,
  color = colors.white,
  background = colors.success,
  drawFrames = 11,
  burst = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = springIn(frame, fps, {delay, duration: 20});
  const local = frame - delay;
  const draw = ramp(local, 7, 7 + drawFrames, 0, 1);
  const {strokeDasharray, strokeDashoffset} = evolvePath(draw, CHECK_PATH);

  const burstStart = 7 + drawFrames - 2;
  const burstProgress = ramp(local, burstStart, burstStart + 16, 0, 1);

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        transform: `scale(${pop})`,
        ...style,
      }}
    >
      {burst && burstProgress > 0 && burstProgress < 1 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `${size * 0.07}px solid ${background}`,
            transform: `scale(${1 + burstProgress * 0.75})`,
            opacity: (1 - burstProgress) * 0.55,
          }}
        />
      ) : null}
      <svg width={size} height={size} viewBox="0 0 36 36" style={{display: 'block'}}>
        <circle cx="18" cy="18" r="18" fill={background} />
        <path
          d={CHECK_PATH}
          fill="none"
          stroke={color}
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
    </div>
  );
};

/** Versión chica para listas (sin anillo). */
export const ListCheck: React.FC<{size?: number; delay?: number; color?: string}> = ({
  size = 56,
  delay = 0,
  color = colors.success,
}) => (
  <DrawnCheck
    size={size}
    delay={delay}
    background={color}
    color={colors.white}
    drawFrames={9}
    burst={false}
  />
);
