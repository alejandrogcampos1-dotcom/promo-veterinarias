import type {CSSProperties} from 'react';
import React from 'react';
import {colors} from '../config';

/**
 * Íconos genéricos dibujados a mano (sin logos ni marcas reales).
 * Todos comparten viewBox 24×24 y trazo redondeado.
 */

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: CSSProperties;
};

const Svg: React.FC<IconProps & {children: React.ReactNode; fill?: boolean}> = ({
  size = 48,
  color = colors.ink,
  strokeWidth = 2,
  style,
  children,
  fill = false,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill ? color : 'none'}
    stroke={fill ? 'none' : color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{display: 'block', overflow: 'visible', ...style}}
  >
    {children}
  </svg>
);

/** Lupa — representa al buscador sin usar ninguna marca. */
export const IconSearch: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.4 15.4 L21 21" />
  </Svg>
);

/** Burbuja de chat — mensajería genérica. */
export const IconChat: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M21 11.5a8 8 0 0 1-8 8H8.8L4 22l1.1-3.6A8 8 0 0 1 13 3.5a8 8 0 0 1 8 8Z" />
    <path d="M9.5 11.5h7" />
    <path d="M9.5 8.5h4" />
  </Svg>
);

/** Burbuja de chat rellena (para el ícono verde de mensajes). */
export const IconChatFilled: React.FC<IconProps> = ({
  size = 48,
  color = colors.success,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block', ...style}}>
    <path
      d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L4 20.5l1.6-4.3A8.5 8.5 0 1 1 21 11.5Z"
      fill={color}
    />
    <g stroke={colors.white} strokeWidth="1.8" strokeLinecap="round">
      <path d="M8.5 10.2h7" />
      <path d="M8.5 13.4h4.5" />
    </g>
  </svg>
);

/** Cámara — representa a las redes sociales. */
export const IconCamera: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5.5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.2" cy="6.8" r="0.9" fill={p.color ?? colors.ink} stroke="none" />
  </Svg>
);

/** Reloj — horarios. */
export const IconClock: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.2v5.1l3.4 2" />
  </Svg>
);

/** Pin de ubicación. */
export const IconPin: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 21.5s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
    <circle cx="12" cy="10.2" r="2.6" />
  </Svg>
);

/** Pin relleno (para el mapa). */
export const IconPinFilled: React.FC<IconProps> = ({
  size = 48,
  color = colors.coral,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block', ...style}}>
    <path
      d="M12 22.5s7.5-6.6 7.5-11.8A7.5 7.5 0 1 0 4.5 10.7C4.5 15.9 12 22.5 12 22.5Z"
      fill={color}
    />
    <circle cx="12" cy="10.4" r="3" fill={colors.white} />
  </svg>
);

/** Estrella: `filled` entre 0 y 1 la va llenando de izquierda a derecha. */
export const IconStar: React.FC<IconProps & {filled?: number; id?: string}> = ({
  size = 48,
  color = '#F6B33E',
  filled = 1,
  style,
  id = 'star',
}) => {
  const clipId = `star-clip-${id}`;
  const path =
    'M12 2.6l2.95 5.98 6.6.96-4.77 4.65 1.12 6.57L12 17.64l-5.9 3.12 1.12-6.57L2.45 9.54l6.6-.96L12 2.6Z';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{display: 'block', ...style}}>
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={24 * Math.min(1, Math.max(0, filled))} height="24" />
        </clipPath>
      </defs>
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" opacity={0.35} />
      <path d={path} fill={color} clipPath={`url(#${clipId})`} />
    </svg>
  );
};

/** Tilde suelto (para listas estáticas). */
export const IconCheck: React.FC<IconProps> = (p) => (
  <Svg {...p} strokeWidth={p.strokeWidth ?? 3}>
    <path d="M4.5 12.8 L9.5 17.6 L19.5 6.6" />
  </Svg>
);

/** Calendario — turnos. */
export const IconCalendar: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="16" rx="4" />
    <path d="M3.5 10h17M8.5 3.2v3.6M15.5 3.2v3.6" />
  </Svg>
);

/** Globo — dominio propio. */
export const IconGlobe: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3.3 9.6h17.4M3.3 14.4h17.4" />
    <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z" />
  </Svg>
);

/** Corazón — consultas / cuidado. */
export const IconHeart: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 20.3S3.8 15.4 3.8 9.6A4.6 4.6 0 0 1 12 6.9a4.6 4.6 0 0 1 8.2 2.7c0 5.8-8.2 10.7-8.2 10.7Z" />
  </Svg>
);

/** Jeringa — vacunas. */
export const IconSyringe: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M14.2 4.4l5.4 5.4" />
    <path d="M16.6 2l5.4 5.4" />
    <path d="M12.4 6.2l5.4 5.4-7.6 7.6H4.8v-5.4l7.6-7.6Z" />
    <path d="M9 11.5l2.4 2.4" />
    <path d="M4.8 19.2L2 22" />
  </Svg>
);

/** Tijera — peluquería. */
export const IconScissors: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="6.2" cy="18" r="2.8" />
    <circle cx="6.2" cy="6" r="2.8" />
    <path d="M8.6 7.6L21 19M8.6 16.4L21 5" />
  </Svg>
);

/** Campana / urgencias. */
export const IconUrgency: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M12 3a6.5 6.5 0 0 1 6.5 6.5c0 4 1.5 5.5 1.5 5.5H4s1.5-1.5 1.5-5.5A6.5 6.5 0 0 1 12 3Z" />
    <path d="M9.6 18.6a2.6 2.6 0 0 0 4.8 0" />
  </Svg>
);

/** Flecha hacia arriba — "subiste al primer lugar". */
export const IconTrendUp: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M3.5 17.5l6-6 4 4 7-7" />
    <path d="M15.5 8.5h5v5" />
  </Svg>
);

/** Dedo que toca (para el tap del botón). */
export const IconTap: React.FC<IconProps> = ({
  size = 90,
  color = colors.ink,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 64 64" style={{display: 'block', ...style}}>
    <path
      d="M26 34V14.5a4.5 4.5 0 0 1 9 0V31h3.5a12 12 0 0 1 12 12v6a10 10 0 0 1-10 10H34a12 12 0 0 1-9.6-4.8L14 40.4a4.6 4.6 0 0 1 6.6-6.2L26 38.6Z"
      fill={color}
      stroke={colors.white}
      strokeWidth="2.6"
      strokeLinejoin="round"
    />
  </svg>
);

/** Tres líneas apiladas — esqueleto de texto en los mockups. */
export const SkeletonLine: React.FC<{
  width: number | string;
  height?: number;
  color?: string;
  radius?: number;
  style?: CSSProperties;
}> = ({width, height = 14, color = colors.grey, radius, style}) => (
  <div
    style={{
      width,
      height,
      borderRadius: radius ?? height / 2,
      background: color,
      ...style,
    }}
  />
);
