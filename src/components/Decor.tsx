import {noise2D} from '@remotion/noise';
import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {colors, layout, video} from '../config';
import {safe, subtitleBand} from '../timeline';
import {Paw} from './Pets';

/* ── Formas orgánicas que se mueven lento ───────────────────────────────── */

const Blob: React.FC<{
  seed: string;
  size: number;
  color: string;
  x: number;
  y: number;
  opacity?: number;
  speed?: number;
  travel?: number;
}> = ({seed, size, color, x, y, opacity = 1, speed = 1, travel = 70}) => {
  const frame = useCurrentFrame();
  const time = (frame / 130) * speed;
  const dx = noise2D(`${seed}-x`, time, 0) * travel;
  const dy = noise2D(`${seed}-y`, 0, time) * travel;
  const rot = noise2D(`${seed}-r`, time * 0.55, 3.1) * 28;
  const scale = 1 + noise2D(`${seed}-s`, time * 0.4, 7.7) * 0.09;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        background: color,
        opacity,
        borderRadius: '46% 54% 38% 62% / 56% 42% 58% 44%',
        transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${scale})`,
      }}
    />
  );
};

export const BlobField: React.FC<{
  variant?: 'warm' | 'teal' | 'coral' | 'none';
  opacity?: number;
}> = ({variant = 'warm', opacity = 1}) => {
  if (variant === 'none') {
    return null;
  }
  const palette =
    variant === 'teal'
      ? [colors.tealSoft, colors.coralSoft, colors.tealSoft]
      : variant === 'coral'
        ? [colors.coralSoft, '#FFD9CB', colors.coralSoft]
        : [colors.tealSoft, colors.coralSoft, '#FFE9D2'];

  return (
    <AbsoluteFill style={{opacity}}>
      <Blob seed="b1" size={760} color={palette[0]} x={-260} y={-140} opacity={0.75} speed={0.8} />
      <Blob seed="b2" size={620} color={palette[1]} x={700} y={240} opacity={0.65} speed={1.15} />
      <Blob seed="b3" size={880} color={palette[2]} x={-200} y={1280} opacity={0.5} speed={0.65} travel={95} />
      <Blob seed="b4" size={420} color={palette[1]} x={760} y={1480} opacity={0.5} speed={1.3} />
    </AbsoluteFill>
  );
};

/* ── Huellitas de fondo ─────────────────────────────────────────────────── */

export const PawField: React.FC<{
  count?: number;
  seed?: string;
  color?: string;
  opacity?: number;
  /** Las huellitas "respiran": aparecen y se van de a una. */
  animated?: boolean;
}> = ({count = 16, seed = 'paws', color = colors.teal, opacity = 0.07, animated = true}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      {new Array(count).fill(0).map((_, i) => {
        const x = random(`${seed}-x-${i}`) * (video.width + 160) - 80;
        const y = random(`${seed}-y-${i}`) * (video.height + 160) - 80;
        const size = 54 + random(`${seed}-s-${i}`) * 72;
        const rotate = random(`${seed}-r-${i}`) * 360;
        const phase = random(`${seed}-p-${i}`) * Math.PI * 2;
        const breathe = animated
          ? 0.55 + 0.45 * Math.sin(frame / 34 + phase)
          : 1;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y}}>
            <Paw
              size={size}
              color={color}
              rotate={rotate}
              opacity={opacity * breathe}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ── Fondo completo de escena ───────────────────────────────────────────── */

export const Backdrop: React.FC<{
  background?: string;
  blobs?: 'warm' | 'teal' | 'coral' | 'none';
  paws?: boolean;
  pawColor?: string;
  pawOpacity?: number;
  blobOpacity?: number;
  /** Brillo radial suave que da volumen. */
  glow?: boolean;
}> = ({
  background = colors.cream,
  blobs = 'warm',
  paws = true,
  pawColor = colors.teal,
  pawOpacity = 0.07,
  blobOpacity = 1,
  glow = true,
}) => (
  <AbsoluteFill style={{background, overflow: 'hidden'}}>
    <BlobField variant={blobs} opacity={blobOpacity} />
    {paws ? <PawField color={pawColor} opacity={pawOpacity} /> : null}
    {glow ? (
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(74% 52% at 50% 34%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%)',
        }}
      />
    ) : null}
  </AbsoluteFill>
);

/* ── Guías de zona segura (debug) ───────────────────────────────────────── */

export const SafeGuides: React.FC<{show?: boolean}> = ({show}) => {
  if (!(show ?? layout.showGuides)) {
    return null;
  }
  const label: React.CSSProperties = {
    position: 'absolute',
    fontFamily: 'monospace',
    fontSize: 24,
    color: '#FF00AA',
    background: 'rgba(255,255,255,0.75)',
    padding: '2px 8px',
  };
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* zonas que tapan WhatsApp / Instagram */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderLeft: `${layout.safeX}px solid rgba(255,0,170,0.12)`,
          borderRight: `${layout.safeX}px solid rgba(255,0,170,0.12)`,
          borderTop: `${layout.safeTop}px solid rgba(255,0,170,0.12)`,
          borderBottom: `${layout.safeBottom}px solid rgba(255,0,170,0.12)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: safe.left,
          top: safe.top,
          width: safe.width,
          height: safe.bottom - safe.top,
          outline: '3px dashed #FF00AA',
        }}
      />
      {/* franja de subtítulos */}
      <div
        style={{
          position: 'absolute',
          left: safe.left,
          top: subtitleBand.top,
          width: safe.width,
          height: subtitleBand.height,
          outline: '3px dashed #00B3FF',
        }}
      />
      {/* centro */}
      <div
        style={{
          position: 'absolute',
          left: video.width / 2,
          top: 0,
          bottom: 0,
          width: 1,
          background: 'rgba(255,0,170,0.5)',
        }}
      />
      <div style={{...label, left: safe.left + 8, top: safe.top + 8}}>
        zona segura {safe.width}×{safe.bottom - safe.top}
      </div>
      <div style={{...label, left: safe.left + 8, top: subtitleBand.top + 8, color: '#0077B3'}}>
        subtítulos
      </div>
    </AbsoluteFill>
  );
};
