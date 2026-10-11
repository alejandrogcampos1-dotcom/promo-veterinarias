import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {ease, pulse, ramp, springIn} from '../anim';
import {beats} from '../beats';
import {brand, colors, scenes} from '../config';
import {PawField} from '../components/Decor';
import {Paw, PawOutline} from '../components/Pets';
import {Kicker, RichText} from '../components/Type';
import {Pill} from '../components/Ui';
import {fontBody, fontTitle} from '../fonts';
import {radius as R} from '../styles';
import {t} from '../text';
import {contentArea} from '../timeline';

/** Chevrons que apuntan al botón. */
const Chevrons: React.FC<{frame: number}> = ({frame}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
    {[0, 1, 2].map((i) => {
      const phase = Math.sin((frame - i * 5) / 9);
      return (
        <svg key={i} width="84" height="40" viewBox="0 0 84 40" fill="none">
          <path
            d="M8 8 L42 32 L76 8"
            stroke={colors.white}
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={(0.34 + i * 0.26) * (0.68 + 0.32 * phase)}
          />
        </svg>
      );
    })}
  </div>
);

export const Scene8Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = beats.cta;

  const buttonIn = springIn(frame, fps, {delay: b.buttonIn, duration: 32});
  const subIn = springIn(frame, fps, {delay: b.subIn, duration: 28});
  const noteIn = springIn(frame, fps, {delay: b.noteIn, duration: 24});
  const agencyIn = springIn(frame, fps, {delay: b.agencyIn, duration: 30});
  const pawDraw = ease(frame, b.pawIn, b.pawIn + 34, 0, 1);

  const beat = pulse(frame - b.buttonIn, 40, 0.032);

  return (
    <AbsoluteFill style={{background: colors.coral}}>
      {/* manchas y huellitas blancas */}
      <AbsoluteFill style={{opacity: 0.16}}>
        <div
          style={{
            position: 'absolute',
            left: -220,
            top: -160,
            width: 760,
            height: 760,
            borderRadius: '46% 54% 38% 62% / 56% 42% 58% 44%',
            background: colors.white,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -260,
            bottom: -220,
            width: 820,
            height: 820,
            borderRadius: '52% 48% 60% 40% / 44% 56% 44% 56%',
            background: colors.white,
          }}
        />
      </AbsoluteFill>
      <PawField count={14} seed="cta-paws" color={colors.white} opacity={0.14} />

      {/* huellitas que flotan subiendo */}
      <AbsoluteFill>
        {new Array(7).fill(0).map((_, i) => {
          const speed = 0.5 + random(`fl-s-${i}`) * 0.8;
          const x = 60 + random(`fl-x-${i}`) * 940;
          const y = 1500 - ((frame * speed + random(`fl-y-${i}`) * 900) % 1500);
          return (
            <div key={i} style={{position: 'absolute', left: x, top: y}}>
              <Paw
                size={30 + random(`fl-z-${i}`) * 44}
                color={colors.white}
                opacity={0.22}
                rotate={random(`fl-r-${i}`) * 360}
              />
            </div>
          );
        })}
      </AbsoluteFill>

      {/* flechas que apuntan al botón */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: contentArea.top + 76,
          display: 'flex',
          justifyContent: 'center',
          opacity: ramp(frame, b.buttonIn + 14, b.buttonIn + 28, 0, 1),
        }}
      >
        <Chevrons frame={frame} />
      </div>

      {/* botón grande que late */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 500,
          display: 'flex',
          justifyContent: 'center',
          opacity: Math.min(1, buttonIn * 2),
          transform: `scale(${(0.82 + buttonIn * 0.18) * beat})`,
        }}
      >
        <div
          style={{
            padding: '38px 62px',
            borderRadius: R.pill,
            background: colors.white,
            boxShadow: '0 26px 70px rgba(120, 32, 8, 0.32)',
            fontFamily: fontTitle,
            fontWeight: 800,
            fontSize: 58,
            color: colors.coral,
            letterSpacing: -1.4,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            whiteSpace: 'nowrap',
          }}
        >
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L4 20.5l1.6-4.3A8.5 8.5 0 1 1 21 11.5Z"
              fill={colors.success}
            />
            <path
              d="M8.4 10.4h7M8.4 13.6h4.4"
              stroke={colors.white}
              strokeWidth="1.9"
              strokeLinecap="round"
            />
          </svg>
          {t(scenes.cta.button)}
        </div>
      </div>

      {/* bajada con "demo gratis" resaltado */}
      <div
        style={{
          position: 'absolute',
          left: contentArea.left,
          top: 712,
          width: contentArea.width,
          opacity: Math.min(1, subIn * 2),
          transform: `translateY(${(1 - subIn) * 28}px)`,
        }}
      >
        <RichText
          fontSize={54}
          color="rgba(255,255,255,0.95)"
          strongColor={colors.ink}
          weight={500}
          strongWeight={800}
          align="center"
        >
          {scenes.cta.sub}
        </RichText>
      </div>

      {/* "sin compromiso" */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 884,
          display: 'flex',
          justifyContent: 'center',
          opacity: Math.min(1, noteIn * 2),
          transform: `scale(${0.88 + noteIn * 0.12})`,
        }}
      >
        <Pill
          background="rgba(255,255,255,0.22)"
          color={colors.white}
          fontSize={32}
          style={{padding: '16px 30px'}}
        >
          ✓ {t(scenes.cta.note)}
        </Pill>
      </div>

      {/* cierre: huellita que se dibuja + nombre de la agencia */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1116,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <PawOutline size={132} color={colors.white} progress={pawDraw} strokeWidth={6.5} />
        <div
          style={{
            opacity: Math.min(1, agencyIn * 2),
            transform: `translateY(${(1 - agencyIn) * 22}px)`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: fontTitle,
              fontWeight: 800,
              fontSize: 66,
              color: colors.white,
              letterSpacing: -1.6,
            }}
          >
            {brand.agency}
          </div>
          <Kicker fontSize={26} color="rgba(255,255,255,0.8)" align="center" style={{marginTop: 10}}>
            {brand.tagline}
          </Kicker>
          <div
            style={{
              marginTop: 16,
              fontFamily: fontBody,
              fontSize: 32,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            {brand.phoneLabel} {brand.phone}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
