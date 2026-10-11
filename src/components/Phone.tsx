import type {CSSProperties, ReactNode} from 'react';
import React from 'react';
import {colors} from '../config';
import {fontBody} from '../fonts';
import {radius as R, shadow} from '../styles';

/* ── Barra de estado genérica (sin marcas) ──────────────────────────────── */

export const StatusBar: React.FC<{
  time?: string;
  color?: string;
  height?: number;
  island?: boolean;
}> = ({time = '9:41', color = colors.ink, height = 58, island = true}) => (
  <div
    style={{
      height,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 34px',
      position: 'relative',
      fontFamily: fontBody,
      fontSize: 24,
      fontWeight: 700,
      color,
    }}
  >
    <span>{time}</span>
    {island ? (
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: height * 0.2,
          transform: 'translateX(-50%)',
          width: 150,
          height: 34,
          borderRadius: R.pill,
          background: colors.ink,
        }}
      />
    ) : null}
    <div style={{display: 'flex', alignItems: 'center', gap: 9}}>
      {/* señal */}
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 3}}>
        {[8, 12, 16, 20].map((h) => (
          <div key={h} style={{width: 5, height: h, borderRadius: 2, background: color}} />
        ))}
      </div>
      {/* wifi */}
      <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
        <path d="M3 7.5a15 15 0 0 1 20 0" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M7 12a9.5 9.5 0 0 1 12 0" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="13" cy="16.4" r="2" fill={color} />
      </svg>
      {/* batería */}
      <div
        style={{
          width: 40,
          height: 20,
          borderRadius: 6,
          border: `2.4px solid ${color}`,
          padding: 3,
          position: 'relative',
        }}
      >
        <div style={{width: '72%', height: '100%', borderRadius: 2.5, background: color}} />
        <div
          style={{
            position: 'absolute',
            right: -5,
            top: 6,
            width: 3,
            height: 8,
            borderRadius: 2,
            background: color,
          }}
        />
      </div>
    </div>
  </div>
);

/* ── Pantalla flotante (el "celular" del video) ─────────────────────────── */

/**
 * Mockup de pantalla de celular. Se usa sin marco grueso para que la UI
 * entre grande y se lea en un teléfono real; `bezel` agrega el marco negro
 * cuando se necesita que parezca un aparato.
 */
export const ScreenCard: React.FC<{
  width: number;
  height: number;
  children: ReactNode;
  background?: string;
  cornerRadius?: number;
  statusBar?: boolean;
  statusTime?: string;
  statusColor?: string;
  island?: boolean;
  bezel?: number;
  bezelColor?: string;
  elevation?: keyof typeof shadow;
  style?: CSSProperties;
  /** Capa extra dibujada encima del contenido, dentro del recorte. */
  overlay?: ReactNode;
}> = ({
  width,
  height,
  children,
  background = colors.white,
  cornerRadius = R.lg,
  statusBar = true,
  statusTime,
  statusColor,
  island = true,
  bezel = 0,
  bezelColor = '#101827',
  elevation = 'lg',
  style,
  overlay,
}) => {
  const inner = (
    <div
      style={{
        width: width - bezel * 2,
        height: height - bezel * 2,
        borderRadius: Math.max(6, cornerRadius - bezel),
        background,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {statusBar ? <StatusBar time={statusTime} color={statusColor} island={island} /> : null}
      {/* overflow hidden: así el contenido que se desplaza (paneo de la landing)
          queda recortado debajo de la barra de estado y no la tapa. */}
      <div style={{flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden'}}>
        {children}
      </div>
      {overlay}
    </div>
  );

  return (
    <div
      style={{
        width,
        height,
        borderRadius: cornerRadius,
        background: bezel > 0 ? bezelColor : background,
        padding: bezel,
        boxSizing: 'border-box',
        boxShadow: shadow[elevation],
        position: 'relative',
        ...style,
      }}
    >
      {inner}
    </div>
  );
};
