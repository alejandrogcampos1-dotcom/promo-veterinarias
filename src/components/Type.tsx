import type {CSSProperties} from 'react';
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {springIn} from '../anim';
import {colors} from '../config';
import {fontBody, fontTitle} from '../fonts';
import {highlightMask, parseStrong, t, words} from '../text';

/* ── Texto que aparece palabra por palabra ──────────────────────────────── */

export const WordReveal: React.FC<{
  text: string;
  fontSize: number;
  color?: string;
  /** Palabra o frase que va en coral. */
  highlight?: string;
  highlightColor?: string;
  weight?: number;
  font?: string;
  delay?: number;
  /** Frames entre palabra y palabra (el "stagger"). */
  every?: number;
  lineHeight?: number;
  align?: CSSProperties['textAlign'];
  letterSpacing?: number;
  maxWidth?: number | string;
  uppercase?: boolean;
  style?: CSSProperties;
}> = ({
  text,
  fontSize,
  color = colors.ink,
  highlight,
  highlightColor = colors.coral,
  weight = 800,
  font = fontTitle,
  delay = 0,
  every = 3.5,
  lineHeight = 1.08,
  align = 'left',
  letterSpacing = -1.5,
  maxWidth,
  uppercase = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const list = words(text);
  const mask = highlight ? highlightMask(text, highlight) : list.map(() => false);

  return (
    <div
      style={{
        fontFamily: font,
        fontSize,
        fontWeight: weight,
        color,
        lineHeight,
        letterSpacing,
        textAlign: align,
        maxWidth,
        textWrap: 'balance',
        textTransform: uppercase ? 'uppercase' : 'none',
        ...style,
      }}
    >
      {list.map((word, i) => {
        const p = springIn(frame, fps, {delay: delay + i * every, duration: 24});
        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: 'inline-block',
              whiteSpace: 'pre',
              opacity: p,
              transform: `translateY(${(1 - p) * fontSize * 0.42}px) scale(${
                0.9 + p * 0.1
              })`,
              color: mask[i] ? highlightColor : undefined,
            }}
          >
            {word}
            {i < list.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </div>
  );
};

/* ── Título estático (entra en bloque) ──────────────────────────────────── */

export const Title: React.FC<{
  children: string;
  fontSize?: number;
  color?: string;
  align?: CSSProperties['textAlign'];
  weight?: number;
  style?: CSSProperties;
}> = ({
  children,
  fontSize = 96,
  color = colors.ink,
  align = 'left',
  weight = 800,
  style,
}) => (
  <div
    style={{
      fontFamily: fontTitle,
      fontSize,
      fontWeight: weight,
      color,
      lineHeight: 1.04,
      letterSpacing: -2,
      textAlign: align,
      textWrap: 'balance',
      ...style,
    }}
  >
    {t(children)}
  </div>
);

/* ── Texto de apoyo ─────────────────────────────────────────────────────── */

export const Body: React.FC<{
  children: string;
  fontSize?: number;
  color?: string;
  align?: CSSProperties['textAlign'];
  weight?: number;
  style?: CSSProperties;
}> = ({
  children,
  fontSize = 50,
  color = colors.inkSoft,
  align = 'left',
  weight = 500,
  style,
}) => (
  <div
    style={{
      fontFamily: fontBody,
      fontSize,
      fontWeight: weight,
      color,
      lineHeight: 1.3,
      textAlign: align,
      textWrap: 'pretty',
      ...style,
    }}
  >
    {t(children)}
  </div>
);

/* ── Volanta chica en mayúsculas ────────────────────────────────────────── */

export const Kicker: React.FC<{
  children: string;
  color?: string;
  fontSize?: number;
  align?: CSSProperties['textAlign'];
  style?: CSSProperties;
}> = ({children, color = colors.coral, fontSize = 40, align = 'left', style}) => (
  <div
    style={{
      fontFamily: fontBody,
      fontSize,
      fontWeight: 700,
      letterSpacing: fontSize * 0.14,
      textTransform: 'uppercase',
      color,
      textAlign: align,
      ...style,
    }}
  >
    {t(children)}
  </div>
);

/* ── Texto con **partes resaltadas** ────────────────────────────────────── */

export const RichText: React.FC<{
  children: string;
  fontSize?: number;
  color?: string;
  strongColor?: string;
  weight?: number;
  strongWeight?: number;
  font?: string;
  align?: CSSProperties['textAlign'];
  style?: CSSProperties;
}> = ({
  children,
  fontSize = 52,
  color = colors.ink,
  strongColor = colors.coral,
  weight = 500,
  strongWeight = 800,
  font = fontBody,
  align = 'center',
  style,
}) => (
  <div
    style={{
      fontFamily: font,
      fontSize,
      fontWeight: weight,
      color,
      lineHeight: 1.25,
      textAlign: align,
      textWrap: 'balance',
      ...style,
    }}
  >
    {parseStrong(children).map((part, i) => (
      <span
        key={i}
        style={{
          color: part.strong ? strongColor : undefined,
          fontWeight: part.strong ? strongWeight : undefined,
        }}
      >
        {part.text}
      </span>
    ))}
  </div>
);
