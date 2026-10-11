import React from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import {ease, ramp, springIn, springSnap} from '../anim';
import {colors, niche, scenes} from '../config';
import {fontBody, fontTitle, numericFeatures} from '../fonts';
import {radius as R, shadow} from '../styles';
import {t} from '../text';
import {IconClock, IconStar, IconTap, IconTrendUp, SkeletonLine} from './Icons';
import {Paw} from './Pets';
import {
  ChatBubble,
  GreenButton,
  HoursRow,
  MiniMap,
  Pill,
  ResultRow,
  SearchBar,
  Stars,
} from './Ui';

type VisualProps = {
  width: number;
  height: number;
  delay: number;
};

/* ── 1 · Subís al primer lugar del buscador ─────────────────────────────── */

export const SearchRankVisual: React.FC<VisualProps> = ({width, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const mine = {
    name: niche.demoBusiness,
    rating: 5,
    reviews: 36,
    distance: '400 m',
  };
  const rows = [scenes.hook.results[0], scenes.hook.results[1], mine];

  const p = springIn(frame, fps, {delay: delay + 14, duration: 38});
  // Antes: [A, B, yo].  Después: [yo, A, B].
  const slots = [0 + p, 1 + p, 2 - 2 * p];
  const slotHeight = 142;

  const badge = springIn(frame, fps, {delay: delay + 40, duration: 26});

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 24}}>
      <SearchBar text={niche.searchQuery} fontSize={28} />

      <div style={{position: 'relative', height: slotHeight * 2 + 124}}>
        {rows.map((row, i) => {
          const isMine = i === rows.length - 1;
          return (
            <div
              key={row.name}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: slots[i] * slotHeight,
                zIndex: isMine ? 2 : 1,
                transform: isMine ? `scale(${1 + p * 0.03})` : undefined,
                filter: isMine && p > 0.1 ? 'drop-shadow(0 16px 36px rgba(15,118,110,0.3))' : undefined,
              }}
            >
              <ResultRow
                result={{...row, name: t(row.name)}}
                highlighted={isMine && p > 0.45}
                dim={isMine ? 0 : p * 0.35}
                fontSize={30}
              />
              {isMine ? (
                <div
                  style={{
                    position: 'absolute',
                    right: -14,
                    top: -22,
                    opacity: Math.min(1, badge * 2),
                    transform: `scale(${0.7 + badge * 0.3}) rotate(${(1 - badge) * -12}deg)`,
                  }}
                >
                  <Pill background={colors.coral} color={colors.white} fontSize={26}>
                    <IconTrendUp size={26} color={colors.white} strokeWidth={3} />
                    1° lugar
                  </Pill>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div
        style={{
          fontFamily: fontBody,
          fontSize: 25,
          color: colors.inkSoft,
          fontWeight: 600,
          width,
        }}
      >
        Tu web ordenada y rápida sube sola en los resultados.
      </div>
    </div>
  );
};

/* ── 2 · Turnos por WhatsApp en un toque ────────────────────────────────── */

export const ChatTapVisual: React.FC<VisualProps> = ({width, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const tapIn = springIn(frame, fps, {delay: delay + 2, duration: 24});
  const press = ramp(frame, delay + 18, delay + 24, 0, 1) * ramp(frame, delay + 26, delay + 34, 1, 0);
  const ripple = ramp(frame, delay + 20, delay + 44, 0, 1);

  const outBubble = springIn(frame, fps, {delay: delay + 30, duration: 28});
  const inBubble = springIn(frame, fps, {delay: delay + 52, duration: 28});

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 30, width}}>
      {/* el botón y el dedo */}
      <div style={{position: 'relative'}}>
        <GreenButton
          label={scenes.solution.ctaButton}
          fontSize={36}
          pressed={press}
        />
        {ripple > 0 && ripple < 1 ? (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 160,
              height: 160,
              marginLeft: -80,
              marginTop: -80,
              borderRadius: '50%',
              border: `8px solid ${colors.success}`,
              transform: `scale(${0.3 + ripple * 2.4})`,
              opacity: (1 - ripple) * 0.6,
            }}
          />
        ) : null}
        <div
          style={{
            position: 'absolute',
            right: 92,
            top: 18,
            opacity: Math.min(1, tapIn * 2),
            transform: `translate(${(1 - tapIn) * 90}px, ${
              (1 - tapIn) * 90
            }px) scale(${0.9 + press * 0.08})`,
          }}
        >
          <IconTap size={104} color={colors.ink} />
        </div>
      </div>

      {/* la charla */}
      <div
        style={{
          padding: 30,
          borderRadius: R.md,
          background: colors.cream,
          border: `2px solid ${colors.line}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          minHeight: 300,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            alignSelf: 'center',
            fontFamily: fontBody,
            fontSize: 22,
            fontWeight: 600,
            color: colors.inkFaint,
          }}
        >
          Hoy
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            opacity: Math.min(1, outBubble * 2),
            transform: `translateY(${(1 - outBubble) * 30}px)`,
          }}
        >
          <ChatBubble
            text={scenes.benefits.chatMessage}
            side="out"
            fontSize={30}
            time="10:02"
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            opacity: Math.min(1, inBubble * 2),
            transform: `translateY(${(1 - inBubble) * 30}px)`,
          }}
        >
          <ChatBubble
            text={scenes.benefits.chatReply}
            side="in"
            fontSize={30}
            time="10:03"
          />
        </div>
      </div>
    </div>
  );
};

/* ── 3 · Horarios, servicios y ubicación ────────────────────────────────── */

export const MapHoursVisual: React.FC<VisualProps> = ({width, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const local = frame - delay - 8;
  const bounce =
    local > 0 ? Math.abs(Math.sin(local / 7.5)) * 30 * Math.exp(-local / 34) : 0;

  const mapIn = springIn(frame, fps, {delay, duration: 28});
  const hoursIn = springIn(frame, fps, {delay: delay + 16, duration: 28});

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 26, width}}>
      <div
        style={{
          opacity: Math.min(1, mapIn * 2),
          transform: `scale(${0.96 + mapIn * 0.04})`,
        }}
      >
        <MiniMap
          width="100%"
          height={344}
          label={`${niche.demoAddress}, ${niche.zone}`}
          pinBounce={bounce}
        />
      </div>

      <div
        style={{
          padding: 28,
          borderRadius: R.md,
          background: colors.cream,
          border: `2px solid ${colors.line}`,
          opacity: Math.min(1, hoursIn * 2),
          transform: `translateY(${(1 - hoursIn) * 26}px)`,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 18,
            fontFamily: fontTitle,
            fontWeight: 800,
            fontSize: 30,
            color: colors.ink,
          }}
        >
          <IconClock size={32} color={colors.teal} strokeWidth={2.4} />
          Horarios de atención
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
          {scenes.solution.hours.map((h, i) => (
            <div
              key={h.day}
              style={{
                opacity: ramp(frame, delay + 24 + i * 6, delay + 34 + i * 6, 0, 1),
              }}
            >
              <HoursRow day={h.day} time={h.time} fontSize={30} highlight={i === 2} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── 4 · Imagen profesional que da confianza ────────────────────────────── */

export const StarsVisual: React.FC<VisualProps> = ({width, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const fill = ease(frame, delay + 8, delay + 54, 0, 1);
  const rating = ease(frame, delay + 8, delay + 54, 0, 4.9);
  const numberPop = springSnap(frame, fps, {delay: delay + 50, duration: 18});

  const starSize = 122;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 30,
        width,
      }}
    >
      <div style={{display: 'flex', gap: 22}}>
        {[0, 1, 2, 3, 4].map((i) => {
          const starFill = Math.min(1, Math.max(0, fill * 5 - i));
          const pop = springSnap(frame, fps, {delay: delay + 8 + i * 9, duration: 16});
          return (
            <div
              key={i}
              style={{
                transform: `scale(${0.8 + pop * 0.2 + (starFill > 0.98 ? 0.04 : 0)}) rotate(${
                  (1 - pop) * -18
                }deg)`,
              }}
            >
              <IconStar size={starSize} filled={starFill} id={`big-${i}`} />
            </div>
          );
        })}
      </div>

      <div style={{display: 'flex', alignItems: 'baseline', gap: 16}}>
        <span
          style={{
            fontFamily: fontTitle,
            fontWeight: 800,
            fontSize: 104,
            color: colors.ink,
            letterSpacing: -3,
            transform: `scale(${1 + numberPop * 0.07})`,
            display: 'inline-block',
            ...numericFeatures,
          }}
        >
          {rating.toLocaleString('es-AR', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}
        </span>
        <span
          style={{
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: 38,
            color: colors.inkSoft,
          }}
        >
          de 5
        </span>
      </div>

      {/* reseñas de ejemplo */}
      <div style={{display: 'flex', flexDirection: 'column', gap: 16, width: '100%'}}>
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: 22,
              borderRadius: R.sm,
              background: colors.white,
              boxShadow: shadow.xs,
              opacity: ramp(frame, delay + 46 + i * 8, delay + 58 + i * 8, 0, 1),
              transform: `translateY(${
                (1 - ramp(frame, delay + 46 + i * 8, delay + 58 + i * 8, 0, 1)) * 20
              }px)`,
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: i === 0 ? colors.tealSoft : colors.coralSoft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Paw size={30} color={i === 0 ? colors.teal : colors.coral} />
            </div>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 10}}>
              <Stars value={5} size={22} idPrefix={`rev-${i}`} />
              <SkeletonLine
                width={`${62 + random(`rev-${i}`) * 30}%`}
                height={13}
                color={colors.line}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
