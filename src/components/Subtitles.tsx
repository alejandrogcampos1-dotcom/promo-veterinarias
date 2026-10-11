import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {ramp, springSnap} from '../anim';
import {colors, subtitles} from '../config';
import {fontBody} from '../fonts';
import {radius as R} from '../styles';
import {highlightMask, words} from '../text';
import {safe, subtitleBand} from '../timeline';

/**
 * Subtítulos quemados: aparecen palabra por palabra y resaltan en coral la
 * palabra clave de cada frase. Los tiempos salen de `config.subtitles.cues`
 * (en segundos), así que se sincronizan a mano cuando tengas la voz grabada.
 */
export const SubtitleTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const now = frame / fps - subtitles.offsetSeconds;

  const index = subtitles.cues.findIndex((c) => now >= c.from && now <= c.to);
  if (index === -1) {
    return null;
  }

  const cue = subtitles.cues[index];
  const startFrame = (cue.from + subtitles.offsetSeconds) * fps;
  const endFrame = (cue.to + subtitles.offsetSeconds) * fps;
  const local = frame - startFrame;
  const total = endFrame - startFrame;

  const list = words(cue.text);
  const mask = highlightMask(cue.text, cue.highlight);

  // Las frases largas se achican lo justo para seguir entrando en dos
  // renglones dentro de la franja, sin empujar el contenido de la escena.
  const resolvedLength = list.join(' ').length;
  const fontSize =
    resolvedLength > subtitles.shrinkOver
      ? Math.round(subtitles.fontSize * Math.max(0.85, subtitles.shrinkOver / resolvedLength))
      : subtitles.fontSize;

  // Todas las palabras terminan de entrar antes de la mitad del cue.
  const revealWindow = Math.min(total * 0.55, fps * 0.85);
  const every = list.length > 1 ? revealWindow / list.length : 0;

  // El bloque entra y sale suave para que no parpadee.
  const blockIn = ramp(local, 0, 4, 0, 1);
  const blockOut = ramp(local, total - 4, total, 1, 0);
  const blockOpacity = Math.min(blockIn, blockOut);

  return (
    <div
      style={{
        position: 'absolute',
        left: safe.left,
        width: safe.width,
        top: subtitleBand.top,
        height: subtitleBand.height,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '100%',
          padding: '24px 40px',
          borderRadius: R.md,
          background: 'rgba(23, 32, 48, 0.92)',
          boxShadow: '0 18px 44px rgba(15, 23, 42, 0.3)',
          opacity: blockOpacity,
          transform: `translateY(${(1 - blockIn) * 22}px)`,
          textAlign: 'center',
          fontFamily: fontBody,
          fontSize,
          fontWeight: 600,
          lineHeight: 1.24,
          letterSpacing: -0.4,
          color: colors.white,
          boxSizing: 'border-box',
        }}
      >
        {list.map((word, i) => {
          const p = springSnap(local, fps, {delay: i * every, duration: 14});
          return (
            <span
              key={`${word}-${i}`}
              style={{
                display: 'inline-block',
                whiteSpace: 'pre',
                opacity: p,
                transform: `translateY(${(1 - p) * 14}px) scale(${0.88 + p * 0.12})`,
                color: mask[i] ? colors.coral : undefined,
                fontWeight: mask[i] ? 800 : undefined,
              }}
            >
              {word}
              {i < list.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </div>
  );
};
