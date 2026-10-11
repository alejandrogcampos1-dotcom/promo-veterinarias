import type {CSSProperties, ReactNode} from 'react';
import React from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import {ease, ramp, springIn, stagger} from '../anim';
import {Photo} from '../assets';
import {colors, media, niche, scenes} from '../config';
import {fontBody, fontTitle, numericFeatures} from '../fonts';
import {radius as R, shadow} from '../styles';
import {t} from '../text';
import {
  IconCamera,
  IconChatFilled,
  IconClock,
  IconHeart,
  IconPinFilled,
  IconScissors,
  IconSearch,
  IconStar,
  IconSyringe,
  IconUrgency,
  SkeletonLine,
} from './Icons';
import {DogAvatar, Paw} from './Pets';

/* ── Tarjeta blanca base ────────────────────────────────────────────────── */

export const Card: React.FC<{
  children: ReactNode;
  width?: number | string;
  height?: number | string;
  padding?: number | string;
  background?: string;
  cornerRadius?: number;
  elevation?: keyof typeof shadow;
  border?: string;
  style?: CSSProperties;
}> = ({
  children,
  width,
  height,
  padding = 40,
  background = colors.white,
  cornerRadius = R.md,
  elevation = 'sm',
  border,
  style,
}) => (
  <div
    style={{
      width,
      height,
      padding,
      background,
      borderRadius: cornerRadius,
      boxShadow: shadow[elevation],
      border,
      boxSizing: 'border-box',
      ...style,
    }}
  >
    {children}
  </div>
);

/* ── Pastilla / etiqueta ────────────────────────────────────────────────── */

export const Pill: React.FC<{
  children: ReactNode;
  color?: string;
  background?: string;
  fontSize?: number;
  style?: CSSProperties;
}> = ({children, color = colors.teal, background = colors.tealSoft, fontSize = 26, style}) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: `${fontSize * 0.34}px ${fontSize * 0.68}px`,
      borderRadius: R.pill,
      background,
      color,
      fontFamily: fontBody,
      fontWeight: 700,
      fontSize,
      lineHeight: 1,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {children}
  </span>
);

/* ── Botón verde de contacto ────────────────────────────────────────────── */

export const GreenButton: React.FC<{
  label: string;
  width?: number | string;
  fontSize?: number;
  icon?: boolean;
  pressed?: number;
  style?: CSSProperties;
}> = ({label, width = '100%', fontSize = 34, icon = true, pressed = 0, style}) => (
  <div
    style={{
      width,
      padding: `${fontSize * 0.62}px ${fontSize * 0.9}px`,
      borderRadius: R.pill,
      background: colors.success,
      color: colors.white,
      fontFamily: fontTitle,
      fontWeight: 800,
      fontSize,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: fontSize * 0.42,
      boxShadow: shadow.green,
      boxSizing: 'border-box',
      transform: `scale(${1 - pressed * 0.055})`,
      filter: pressed > 0 ? `brightness(${1 - pressed * 0.12})` : undefined,
      ...style,
    }}
  >
    {icon ? <IconChatFilled size={fontSize * 1.15} color={colors.white} /> : null}
    <span>{t(label)}</span>
  </div>
);

/* ── Buscador genérico (lupa, sin marcas) ───────────────────────────────── */

export const SearchBar: React.FC<{
  text: string;
  caret?: boolean;
  fontSize?: number;
  focus?: number;
  style?: CSSProperties;
}> = ({text, caret = false, fontSize = 34, focus = 0, style}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: `${fontSize * 0.56}px ${fontSize * 0.74}px`,
      borderRadius: R.pill,
      background: '#F1F0EC',
      border: `3px solid ${focus > 0.05 ? colors.teal : 'transparent'}`,
      boxShadow: focus > 0.05 ? `0 0 0 ${focus * 9}px rgba(15,118,110,0.12)` : undefined,
      boxSizing: 'border-box',
      ...style,
    }}
  >
    <IconSearch size={fontSize * 1.25} color={colors.inkSoft} strokeWidth={2.4} />
    <div
      style={{
        fontFamily: fontBody,
        fontSize,
        fontWeight: 500,
        color: colors.ink,
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {text}
      {caret ? (
        <span
          style={{
            display: 'inline-block',
            width: 3,
            height: fontSize * 1.05,
            marginLeft: 3,
            background: colors.teal,
          }}
        />
      ) : null}
    </div>
  </div>
);

/* ── Estrellas ──────────────────────────────────────────────────────────── */

export const Stars: React.FC<{
  value?: number;
  size?: number;
  gap?: number;
  /** 0 → 1 va llenando las 5 estrellas una por una. */
  progress?: number;
  idPrefix?: string;
  style?: CSSProperties;
}> = ({value = 5, size = 30, gap = 4, progress, idPrefix = 'st', style}) => (
  <div style={{display: 'flex', gap, ...style}}>
    {[0, 1, 2, 3, 4].map((i) => {
      const byValue = Math.min(1, Math.max(0, value - i));
      const byProgress =
        progress === undefined ? 1 : Math.min(1, Math.max(0, progress * 5 - i));
      return (
        <IconStar
          key={i}
          id={`${idPrefix}-${i}`}
          size={size}
          filled={byValue * byProgress}
        />
      );
    })}
  </div>
);

/* ── Resultado del buscador ─────────────────────────────────────────────── */

export type SearchResult = {
  name: string;
  rating: number;
  reviews: number;
  distance: string;
};

export const ResultRow: React.FC<{
  result: SearchResult;
  highlighted?: boolean;
  dim?: number;
  avatar?: 'paw' | 'photo' | 'grey';
  fontSize?: number;
  style?: CSSProperties;
}> = ({result, highlighted = false, dim = 0, avatar = 'paw', fontSize = 34, style}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      padding: 26,
      borderRadius: R.sm,
      background: colors.white,
      border: `3px solid ${highlighted ? colors.teal : colors.line}`,
      boxShadow: highlighted ? shadow.teal : shadow.xs,
      filter: dim > 0 ? `grayscale(${dim}) opacity(${1 - dim * 0.45})` : undefined,
      boxSizing: 'border-box',
      ...style,
    }}
  >
    <div
      style={{
        width: fontSize * 2.3,
        height: fontSize * 2.3,
        borderRadius: R.xs,
        background: highlighted ? colors.teal : colors.tealSoft,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {avatar === 'photo' ? (
        <Photo src={media.logoPhoto}>
          <DogAvatar size={fontSize * 2.5} />
        </Photo>
      ) : (
        <Paw size={fontSize * 1.3} color={highlighted ? colors.white : colors.teal} />
      )}
    </div>
    <div style={{flex: 1, minWidth: 0}}>
      <div
        style={{
          fontFamily: fontTitle,
          fontWeight: 800,
          fontSize,
          color: colors.ink,
          letterSpacing: -0.6,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {t(result.name)}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 10}}>
        <span
          style={{
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: fontSize * 0.74,
            color: colors.ink,
            ...numericFeatures,
          }}
        >
          {result.rating.toLocaleString('es-AR', {minimumFractionDigits: 1})}
        </span>
        <Stars value={result.rating} size={fontSize * 0.74} idPrefix={result.name} />
        <span
          style={{
            fontFamily: fontBody,
            fontSize: fontSize * 0.7,
            color: colors.inkSoft,
            ...numericFeatures,
          }}
        >
          ({result.reviews})
        </span>
        <span style={{color: colors.inkFaint, fontSize: fontSize * 0.7}}>·</span>
        <span
          style={{
            fontFamily: fontBody,
            fontSize: fontSize * 0.7,
            color: colors.inkSoft,
            fontWeight: 600,
          }}
        >
          {result.distance}
        </span>
      </div>
    </div>
    {highlighted ? (
      <Pill background={colors.successSoft} color="#15803D" fontSize={fontSize * 0.62}>
        Abierto
      </Pill>
    ) : null}
  </div>
);

/** Tarjeta vacía con borde punteado y signo de pregunta. */
export const EmptyResultRow: React.FC<{
  label: string;
  hint?: string;
  fontSize?: number;
  style?: CSSProperties;
}> = ({label, hint, fontSize = 34, style}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      padding: 26,
      borderRadius: R.sm,
      border: `4px dashed ${colors.coral}`,
      background: 'rgba(255,107,74,0.07)',
      boxSizing: 'border-box',
      ...style,
    }}
  >
    <div
      style={{
        width: fontSize * 2.3,
        height: fontSize * 2.3,
        borderRadius: R.xs,
        border: `4px dashed ${colors.coral}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontFamily: fontTitle,
        fontWeight: 800,
        fontSize: fontSize * 1.2,
        color: colors.coral,
      }}
    >
      ?
    </div>
    <div style={{flex: 1}}>
      <div
        style={{
          fontFamily: fontTitle,
          fontWeight: 800,
          fontSize,
          color: colors.coral,
          letterSpacing: -0.6,
        }}
      >
        {t(label)}
      </div>
      {hint ? (
        <div
          style={{
            fontFamily: fontBody,
            fontSize: fontSize * 0.7,
            color: colors.coral,
            opacity: 0.8,
            marginTop: 8,
          }}
        >
          {t(hint)}
        </div>
      ) : null}
    </div>
  </div>
);

/* ── Burbuja de chat ────────────────────────────────────────────────────── */

export const ChatBubble: React.FC<{
  text: string;
  side?: 'in' | 'out';
  fontSize?: number;
  maxWidth?: number | string;
  background?: string;
  color?: string;
  time?: string;
  style?: CSSProperties;
}> = ({
  text,
  side = 'in',
  fontSize = 32,
  maxWidth = '82%',
  background,
  color,
  time,
  style,
}) => {
  const isOut = side === 'out';
  const bg = background ?? (isOut ? colors.successSoft : colors.white);
  const fg = color ?? colors.ink;
  return (
    <div
      style={{
        alignSelf: isOut ? 'flex-end' : 'flex-start',
        maxWidth,
        padding: `${fontSize * 0.56}px ${fontSize * 0.72}px`,
        borderRadius: R.md,
        borderBottomRightRadius: isOut ? 8 : R.md,
        borderBottomLeftRadius: isOut ? R.md : 8,
        background: bg,
        color: fg,
        fontFamily: fontBody,
        fontSize,
        fontWeight: 500,
        lineHeight: 1.3,
        boxShadow: shadow.xs,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {t(text)}
      {time ? (
        <div
          style={{
            fontSize: fontSize * 0.55,
            color: colors.inkFaint,
            textAlign: 'right',
            marginTop: 6,
            ...numericFeatures,
          }}
        >
          {time}
        </div>
      ) : null}
    </div>
  );
};

/* ── Mini mapa con pin que rebota ───────────────────────────────────────── */

export const MiniMap: React.FC<{
  width: number | string;
  height: number;
  label?: string;
  pinBounce?: number;
  cornerRadius?: number;
  style?: CSSProperties;
}> = ({width, height, label, pinBounce = 0, cornerRadius = R.sm, style}) => (
  <div
    style={{
      width,
      height,
      borderRadius: cornerRadius,
      background: '#E8EFEC',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
      ...style,
    }}
  >
    {/* manzanas */}
    {new Array(14).fill(0).map((_, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${random(`mb-x-${i}`) * 96 - 6}%`,
          top: `${random(`mb-y-${i}`) * 96 - 6}%`,
          width: 50 + random(`mb-w-${i}`) * 110,
          height: 38 + random(`mb-h-${i}`) * 80,
          borderRadius: 8,
          background: '#DCE7E3',
        }}
      />
    ))}
    {/* calles */}
    <div style={{position: 'absolute', left: 0, right: 0, top: '38%', height: 16, background: colors.white, opacity: 0.95}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: '74%', height: 11, background: colors.white, opacity: 0.9}} />
    <div style={{position: 'absolute', top: 0, bottom: 0, left: '30%', width: 14, background: colors.white, opacity: 0.95}} />
    <div style={{position: 'absolute', top: 0, bottom: 0, left: '72%', width: 10, background: colors.white, opacity: 0.9}} />
    {/* avenida verde azulada */}
    <div
      style={{
        position: 'absolute',
        left: '-10%',
        right: '-10%',
        top: '55%',
        height: 20,
        background: colors.tealSoft,
        transform: 'rotate(-7deg)',
      }}
    />
    {/* pin */}
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, calc(-100% - ${pinBounce}px))`,
        filter: 'drop-shadow(0 10px 14px rgba(30,41,59,0.28))',
      }}
    >
      <IconPinFilled size={Math.min(110, height * 0.46)} color={colors.coral} />
    </div>
    {/* sombra del pin */}
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 34,
        height: 12,
        borderRadius: '50%',
        background: 'rgba(30,41,59,0.22)',
      }}
    />
    {label ? (
      <div
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 16,
          padding: '14px 20px',
          borderRadius: R.xs,
          background: colors.white,
          boxShadow: shadow.xs,
          fontFamily: fontBody,
          fontWeight: 600,
          fontSize: 24,
          color: colors.ink,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        <IconPinFilled size={26} color={colors.coral} />
        {t(label)}
      </div>
    ) : null}
  </div>
);

/* ── Chips de servicios ─────────────────────────────────────────────────── */

const serviceIcon = (index: number, size: number) => {
  const props = {size, color: colors.teal, strokeWidth: 2.2};
  switch (index % 4) {
    case 0:
      return <IconHeart {...props} />;
    case 1:
      return <IconSyringe {...props} />;
    case 2:
      return <IconScissors {...props} />;
    default:
      return <IconUrgency {...props} />;
  }
};

export const ServiceChip: React.FC<{
  label: string;
  index: number;
  fontSize?: number;
  style?: CSSProperties;
}> = ({label, index, fontSize = 26, style}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: `${fontSize * 0.5}px ${fontSize * 0.7}px`,
      borderRadius: R.pill,
      background: colors.tealSoft,
      fontFamily: fontBody,
      fontWeight: 700,
      fontSize,
      color: colors.teal,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {serviceIcon(index, fontSize * 1.2)}
    {t(label)}
  </div>
);

/* ── Fila de horarios ───────────────────────────────────────────────────── */

export const HoursRow: React.FC<{
  day: string;
  time: string;
  fontSize?: number;
  highlight?: boolean;
}> = ({day, time, fontSize = 27, highlight = false}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'baseline',
      gap: 10,
      fontFamily: fontBody,
      fontSize,
      color: highlight ? colors.teal : colors.ink,
      fontWeight: highlight ? 700 : 500,
    }}
  >
    <span>{t(day)}</span>
    <span
      style={{
        flex: 1,
        borderBottom: `2px dotted ${colors.line}`,
        transform: 'translateY(-6px)',
      }}
    />
    <span style={{fontWeight: 700, ...numericFeatures}}>{t(time)}</span>
  </div>
);

/* ── Contador con números tabulares ─────────────────────────────────────── */

export const Counter: React.FC<{
  value: number;
  fontSize: number;
  color?: string;
  prefix?: string;
  suffix?: string;
  weight?: number;
  font?: string;
  scale?: number;
  /** Tamaño del prefijo/sufijo respecto del número. */
  prefixScale?: number;
  style?: CSSProperties;
}> = ({
  value,
  fontSize,
  color = colors.ink,
  prefix,
  suffix,
  weight = 800,
  font = fontTitle,
  scale = 1,
  prefixScale = 0.42,
  style,
}) => (
  <div
    style={{
      fontFamily: font,
      fontSize,
      fontWeight: weight,
      color,
      lineHeight: 1,
      letterSpacing: -2,
      display: 'flex',
      alignItems: 'baseline',
      gap: fontSize * 0.1,
      transform: `scale(${scale})`,
      ...numericFeatures,
      ...style,
    }}
  >
    {prefix ? (
      <span style={{fontSize: fontSize * prefixScale, fontWeight: 700, opacity: 0.85}}>
        {prefix}
      </span>
    ) : null}
    <span>{Math.round(value).toLocaleString('es-AR')}</span>
    {suffix ? (
      <span style={{fontSize: fontSize * prefixScale, fontWeight: 700, opacity: 0.85}}>
        {suffix}
      </span>
    ) : null}
  </div>
);

/* ── Landing que se construye bloque por bloque ─────────────────────────── */

type LandingProps = {
  width: number;
  /** Frame en el que empieza a construirse. */
  delay?: number;
  /** Frames entre bloque y bloque. */
  every?: number;
  /** true muestra todo armado, sin animación. */
  instant?: boolean;
  /** Botón presionado (0-1), para el tap de la escena 5. */
  pressed?: number;
  /**
   * Paneo del contenido, de 0 a 1. En 1 el final de la página queda alineado
   * con el borde de abajo, sea cual sea el alto real del mockup: el truco es
   * combinar `top` en % (del contenedor) con translateY en % (del contenido).
   */
  pan?: number;
  scale?: number;
};

export const LandingMock: React.FC<LandingProps> = ({
  width,
  delay = 0,
  every = 9,
  instant = false,
  pressed = 0,
  pan = 0,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pad = 34;

  const block = (i: number) => {
    if (instant) {
      return {opacity: 1, transform: 'none'};
    }
    const p = springIn(frame, fps, {delay: stagger(i, every, delay), duration: 26});
    return {
      opacity: Math.min(1, p * 1.6),
      transform: `translateY(${(1 - p) * 46}px) scale(${0.96 + p * 0.04})`,
    };
  };

  const s = scenes.solution;

  return (
    <div
      style={{
        width,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transform: scale === 1 ? undefined : `scale(${scale})`,
        transformOrigin: 'top center',
      }}
    >
      {/* 1 · header — queda fijo arriba, como en una web de verdad */}
      <div
        style={{
          ...block(0),
          flexShrink: 0,
          position: 'relative',
          zIndex: 2,
          background: colors.white,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: `22px ${pad}px`,
          borderBottom: `2px solid ${colors.line}`,
          boxShadow: pan > 0.02 ? '0 10px 18px rgba(30,41,59,0.07)' : undefined,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: colors.teal,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
          }}
        >
          <Photo src={media.logoPhoto}>
            <Paw size={36} color={colors.white} />
          </Photo>
        </div>
        <div style={{flex: 1, minWidth: 0}}>
          <div
            style={{
              fontFamily: fontTitle,
              fontWeight: 800,
              fontSize: 30,
              color: colors.ink,
              letterSpacing: -0.6,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {niche.demoBusiness}
          </div>
          <div style={{fontFamily: fontBody, fontSize: 22, color: colors.inkSoft, marginTop: 2}}>
            {niche.demoAddress} · {niche.zone}
          </div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{width: 32, height: 4, borderRadius: 2, background: colors.greyFlat}} />
          ))}
        </div>
      </div>

      {/* Zona que "scrollea". El contenido se panea sin saber su alto:
          top en % mide el contenedor y translateY en % mide el contenido. */}
      <div style={{flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative'}}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${pan * 100}%`,
            transform: `translateY(${-pan * 100}%)`,
          }}
        >
      {/* 2 · hero */}
      <div style={{...block(1), padding: `${pad * 0.7}px ${pad}px 0`}}>
        <div
          style={{
            height: 268,
            borderRadius: R.sm,
            background: `linear-gradient(135deg, ${colors.teal} 0%, #14938A 100%)`,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Photo src={media.heroPhoto}>
            <>
              <div style={{position: 'absolute', right: -24, bottom: -34, opacity: 0.16}}>
                <Paw size={230} color={colors.white} />
              </div>
              <DogAvatar size={226} style={{position: 'relative', top: 16}} />
            </>
          </Photo>
          <div
            style={{
              position: 'absolute',
              left: 22,
              bottom: 20,
              padding: '12px 20px',
              borderRadius: R.pill,
              background: 'rgba(255,255,255,0.94)',
              fontFamily: fontTitle,
              fontWeight: 800,
              fontSize: 24,
              color: colors.teal,
            }}
          >
            Turnos online
          </div>
        </div>
      </div>

      {/* 3 · botón */}
      <div style={{...block(2), padding: `${pad * 0.72}px ${pad}px 0`}}>
        <GreenButton label={s.ctaButton} fontSize={32} pressed={pressed} />
      </div>

      {/* 4 · servicios */}
      <div
        style={{
          ...block(3),
          padding: `${pad * 0.72}px ${pad}px 0`,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {s.services.map((label, i) => (
          <ServiceChip key={label} label={label} index={i} fontSize={24} />
        ))}
      </div>

      {/* 5 · horarios */}
      <div style={{...block(4), padding: `${pad * 0.72}px ${pad}px 0`}}>
        <div
          style={{
            padding: 26,
            borderRadius: R.sm,
            background: colors.cream,
            border: `2px solid ${colors.line}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 16,
              fontFamily: fontTitle,
              fontWeight: 800,
              fontSize: 26,
              color: colors.ink,
            }}
          >
            <IconClock size={28} color={colors.teal} strokeWidth={2.4} />
            Horarios
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            {s.hours.map((h, i) => (
              <HoursRow key={h.day} day={h.day} time={h.time} fontSize={25} highlight={i === 2} />
            ))}
          </div>
        </div>
      </div>

      {/* 6 · mapa */}
      <div style={{...block(5), padding: `${pad * 0.72}px ${pad}px ${pad}px`}}>
        <MiniMap width="100%" height={210} label={s.mapLabel} />
      </div>
        </div>
      </div>
    </div>
  );
};

/* ── Perfil de red social gris y caótico (el "antes") ───────────────────── */

export const SocialMock: React.FC<{width: number; scale?: number}> = ({width, scale = 1}) => (
  <div
    style={{
      width,
      transform: `scale(${scale})`,
      transformOrigin: 'top center',
      filter: 'grayscale(1)',
      padding: 30,
      boxSizing: 'border-box',
    }}
  >
    {/* header desordenado */}
    <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
      <div
        style={{
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: colors.grey,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconCamera size={48} color={colors.greyDeep} strokeWidth={2.2} />
      </div>
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 12}}>
        <SkeletonLine width="78%" height={22} color={colors.greyFlat} />
        <SkeletonLine width="52%" height={16} color={colors.grey} />
        <div style={{display: 'flex', gap: 18, marginTop: 4}}>
          <SkeletonLine width={74} height={14} color={colors.grey} />
          <SkeletonLine width={74} height={14} color={colors.grey} />
          <SkeletonLine width={74} height={14} color={colors.grey} />
        </div>
      </div>
    </div>

    {/* "bio" que no dice nada */}
    <div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 26}}>
      <SkeletonLine width="94%" height={14} color={colors.grey} />
      <SkeletonLine width="70%" height={14} color={colors.grey} />
      <SkeletonLine width="40%" height={14} color={colors.grey} />
    </div>

    {/* grilla de fotos desprolija */}
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8,
        marginTop: 28,
      }}
    >
      {new Array(9).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            paddingTop: '100%',
            background: i % 3 === 1 ? colors.greyFlat : colors.grey,
            borderRadius: 6,
            position: 'relative',
            transform: `rotate(${(random(`sk-${i}`) - 0.5) * 2.2}deg)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '28%',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.35)',
            }}
          />
        </div>
      ))}
    </div>

    {/* nota de "mandá DM" */}
    <div
      style={{
        marginTop: 26,
        padding: '18px 22px',
        borderRadius: R.xs,
        border: `3px dashed ${colors.greyDeep}`,
        fontFamily: fontBody,
        fontSize: 24,
        fontWeight: 600,
        color: colors.greyDeep,
        textAlign: 'center',
      }}
    >
      Consultas por mensaje privado
    </div>
  </div>
);

/* ── Bandeja de mensajes que se llena sola ──────────────────────────────── */

export const UnreadBadge: React.FC<{
  value: number;
  pop?: number;
  fontSize?: number;
}> = ({value, pop = 0, fontSize = 40}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: `${fontSize * 0.3}px ${fontSize * 0.55}px`,
      borderRadius: R.pill,
      background: colors.coral,
      boxShadow: shadow.coral,
      transform: `scale(${1 + pop * 0.16})`,
    }}
  >
    <span
      style={{
        fontFamily: fontTitle,
        fontWeight: 800,
        fontSize,
        color: colors.white,
        lineHeight: 1,
        ...numericFeatures,
      }}
    >
      {value}
    </span>
    <span
      style={{
        fontFamily: fontBody,
        fontWeight: 700,
        fontSize: fontSize * 0.48,
        color: colors.white,
        opacity: 0.95,
      }}
    >
      {t(scenes.problem.counterLabel)}
    </span>
  </div>
);

/* ── Barrido coral reutilizable dentro de una escena ────────────────────── */

export const CoralSweep: React.FC<{
  progress: number;
  color?: string;
  bandWidth?: number;
}> = ({progress, color = colors.coral, bandWidth = 420}) => {
  const x = ease(progress, 0, 1, -bandWidth, 1080 + bandWidth);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -200,
          bottom: -200,
          left: x - bandWidth,
          width: bandWidth,
          background: color,
          transform: 'skewX(-9deg)',
          opacity: ramp(progress, 0.92, 1, 1, 0),
        }}
      />
    </div>
  );
};

/** Brillo que cruza una tarjeta (detalle de la tarjeta de precio). */
export const Shine: React.FC<{progress: number; angle?: number}> = ({
  progress,
  angle = -18,
}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      borderRadius: 'inherit',
      pointerEvents: 'none',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: '-30%',
        bottom: '-30%',
        left: `${progress * 160 - 40}%`,
        width: '26%',
        background:
          'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
        transform: `rotate(${angle}deg)`,
      }}
    />
  </div>
);
