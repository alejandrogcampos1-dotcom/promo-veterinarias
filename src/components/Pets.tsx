import type {CSSProperties} from 'react';
import React from 'react';
import {colors} from '../config';

type SvgProps = {
  size?: number;
  style?: CSSProperties;
};

/* ── Huellita ───────────────────────────────────────────────────────────── */

export const Paw: React.FC<
  SvgProps & {color?: string; opacity?: number; rotate?: number}
> = ({size = 80, color = colors.teal, opacity = 1, rotate = 0, style}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{
      transform: `rotate(${rotate}deg)`,
      opacity,
      overflow: 'visible',
      ...style,
    }}
  >
    <g fill={color}>
      <ellipse cx="50" cy="66" rx="25" ry="21" />
      <ellipse cx="21" cy="42" rx="11" ry="14" transform="rotate(-22 21 42)" />
      <ellipse cx="39" cy="25" rx="11" ry="14" transform="rotate(-8 39 25)" />
      <ellipse cx="61" cy="25" rx="11" ry="14" transform="rotate(8 61 25)" />
      <ellipse cx="79" cy="42" rx="11" ry="14" transform="rotate(22 79 42)" />
    </g>
  </svg>
);

/** Huellita dibujada con trazo (se "escribe" con strokeDashoffset). */
export const PawOutline: React.FC<
  SvgProps & {color?: string; progress?: number; strokeWidth?: number}
> = ({size = 120, color = colors.white, progress = 1, strokeWidth = 7, style}) => {
  // Cada óvalo se dibuja por separado, uno después del otro.
  const parts = [
    {cx: 50, cy: 66, rx: 25, ry: 21, rot: 0},
    {cx: 21, cy: 42, rx: 11, ry: 14, rot: -22},
    {cx: 39, cy: 25, rx: 11, ry: 14, rot: -8},
    {cx: 61, cy: 25, rx: 11, ry: 14, rot: 8},
    {cx: 79, cy: 42, rx: 11, ry: 14, rot: 22},
  ];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{overflow: 'visible', ...style}}
    >
      {parts.map((p, i) => {
        const slot = 1 / parts.length;
        const local = Math.min(1, Math.max(0, (progress - i * slot) / slot));
        const perimeter = Math.PI * (1.5 * (p.rx + p.ry) - Math.sqrt(p.rx * p.ry));
        return (
          <ellipse
            key={i}
            cx={p.cx}
            cy={p.cy}
            rx={p.rx}
            ry={p.ry}
            transform={`rotate(${p.rot} ${p.cx} ${p.cy})`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={perimeter}
            strokeDashoffset={perimeter * (1 - local)}
          />
        );
      })}
    </svg>
  );
};

/* ── Perro ──────────────────────────────────────────────────────────────── */

export const DogAvatar: React.FC<SvgProps & {blink?: number}> = ({
  size = 240,
  blink = 1,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={style}>
    {/* orejas */}
    <ellipse
      cx="46"
      cy="86"
      rx="25"
      ry="45"
      fill={colors.petFurDark}
      transform="rotate(-16 46 86)"
    />
    <ellipse
      cx="154"
      cy="86"
      rx="25"
      ry="45"
      fill={colors.petFurDark}
      transform="rotate(16 154 86)"
    />
    {/* cabeza */}
    <ellipse cx="100" cy="94" rx="62" ry="57" fill={colors.petFur} />
    {/* frente clarita */}
    <ellipse cx="100" cy="66" rx="24" ry="20" fill={colors.petSnout} opacity={0.55} />
    {/* hocico */}
    <ellipse cx="100" cy="126" rx="39" ry="29" fill={colors.petSnout} />
    {/* nariz */}
    <ellipse cx="100" cy="114" rx="14" ry="11" fill={colors.ink} />
    <path
      d="M100 125 L100 134 M100 134 Q88 142 82 132 M100 134 Q112 142 118 132"
      stroke={colors.ink}
      strokeWidth="4.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* ojos */}
    <ellipse cx="76" cy="86" rx="8" ry={8 * blink} fill={colors.ink} />
    <ellipse cx="124" cy="86" rx="8" ry={8 * blink} fill={colors.ink} />
    <circle cx="79" cy={83} r="2.8" fill={colors.white} opacity={blink > 0.5 ? 1 : 0} />
    <circle cx="127" cy={83} r="2.8" fill={colors.white} opacity={blink > 0.5 ? 1 : 0} />
  </svg>
);

/* ── Gato ───────────────────────────────────────────────────────────────── */

export const CatAvatar: React.FC<SvgProps & {blink?: number}> = ({
  size = 240,
  blink = 1,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={style}>
    {/* orejas */}
    <path d="M44 72 L54 20 L96 50 Z" fill={colors.catFurDark} />
    <path d="M156 72 L146 20 L104 50 Z" fill={colors.catFurDark} />
    <path d="M56 66 L62 36 L86 53 Z" fill={colors.coralSoft} />
    <path d="M144 66 L138 36 L114 53 Z" fill={colors.coralSoft} />
    {/* cabeza */}
    <ellipse cx="100" cy="102" rx="58" ry="52" fill={colors.catFur} />
    {/* hocico */}
    <ellipse cx="86" cy="124" rx="19" ry="14" fill={colors.petSnout} opacity={0.9} />
    <ellipse cx="114" cy="124" rx="19" ry="14" fill={colors.petSnout} opacity={0.9} />
    {/* nariz y boca */}
    <path d="M94 116 L106 116 L100 124 Z" fill={colors.coral} />
    <path
      d="M100 124 L100 130 M100 130 Q92 137 87 129 M100 130 Q108 137 113 129"
      stroke={colors.ink}
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    {/* ojos */}
    <ellipse cx="76" cy="96" rx="11" ry={13 * blink} fill={colors.white} />
    <ellipse cx="124" cy="96" rx="11" ry={13 * blink} fill={colors.white} />
    <ellipse cx="76" cy="96" rx="4.5" ry={11 * blink} fill={colors.ink} />
    <ellipse cx="124" cy="96" rx="4.5" ry={11 * blink} fill={colors.ink} />
    {/* bigotes */}
    <g stroke={colors.ink} strokeWidth="3" strokeLinecap="round" opacity={0.55}>
      <path d="M62 118 L30 112" />
      <path d="M62 126 L30 128" />
      <path d="M138 118 L170 112" />
      <path d="M138 126 L170 128" />
    </g>
  </svg>
);

/* ── Cruz veterinaria ───────────────────────────────────────────────────── */

export const VetCross: React.FC<SvgProps & {color?: string}> = ({
  size = 90,
  color = colors.teal,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <rect x="37" y="8" width="26" height="84" rx="12" fill={color} />
    <rect x="8" y="37" width="84" height="26" rx="12" fill={color} />
    <g transform="translate(29 29) scale(0.42)">
      <g fill={colors.white}>
        <ellipse cx="50" cy="66" rx="25" ry="21" />
        <ellipse cx="21" cy="42" rx="11" ry="14" transform="rotate(-22 21 42)" />
        <ellipse cx="39" cy="25" rx="11" ry="14" transform="rotate(-8 39 25)" />
        <ellipse cx="61" cy="25" rx="11" ry="14" transform="rotate(8 61 25)" />
        <ellipse cx="79" cy="42" rx="11" ry="14" transform="rotate(22 79 42)" />
      </g>
    </g>
  </svg>
);

/* ── Hueso (detalle decorativo) ─────────────────────────────────────────── */

export const Bone: React.FC<SvgProps & {color?: string; rotate?: number}> = ({
  size = 70,
  color = colors.petFurDark,
  rotate = 0,
  style,
}) => (
  <svg
    width={size}
    height={size * 0.5}
    viewBox="0 0 100 50"
    style={{transform: `rotate(${rotate}deg)`, ...style}}
  >
    <g fill={color}>
      <rect x="22" y="18" width="56" height="15" rx="7" />
      <circle cx="18" cy="17" r="12" />
      <circle cx="18" cy="34" r="12" />
      <circle cx="82" cy="17" r="12" />
      <circle cx="82" cy="34" r="12" />
    </g>
  </svg>
);
