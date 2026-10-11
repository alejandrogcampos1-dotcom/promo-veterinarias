import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ease, ramp, springIn} from '../anim';
import {beats} from '../beats';
import {colors, scenes} from '../config';
import {Backdrop} from '../components/Decor';
import {Title} from '../components/Type';
import {LandingMock, Pill, SocialMock} from '../components/Ui';
import {fontBody} from '../fonts';
import {radius as R, shadow} from '../styles';
import {t} from '../text';
import {contentArea} from '../timeline';

export const Scene6BeforeAfter: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = beats.beforeAfter;

  const panelIn = springIn(frame, fps, {delay: b.framesIn, duration: 30});
  // El divisor desliza de izquierda a derecha y revela el "después".
  const reveal = ease(frame, b.dividerStart, b.dividerStart + b.dividerFrames, 0, 0.62);

  const panelWidth = contentArea.width;
  const panelTop = 390;
  const panelHeight = contentArea.bottom - panelTop;
  const dividerX = reveal * panelWidth;

  return (
    <AbsoluteFill>
      <Backdrop blobs="warm" pawColor={colors.teal} pawOpacity={0.05} />

      <div
        style={{
          position: 'absolute',
          left: contentArea.left,
          top: contentArea.top,
          width: contentArea.width,
          opacity: ramp(frame, 0, 10, 0, 1),
        }}
      >
        <Title fontSize={70} align="center">
          {scenes.beforeAfter.headline}
        </Title>
      </div>

      {/* etiquetas arriba del panel, para no tapar los mockups */}
      <div
        style={{
          position: 'absolute',
          left: contentArea.left,
          top: 300,
          width: contentArea.width,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{opacity: ramp(frame, b.dividerStart + 8, b.dividerStart + 22, 0, 1)}}>
          <Pill background={colors.teal} color={colors.white} fontSize={30}>
            {t(scenes.beforeAfter.afterLabel)} · {t(scenes.beforeAfter.afterCaption)}
          </Pill>
        </div>
        <div style={{opacity: ramp(frame, b.labelsIn, b.labelsIn + 12, 0, 1)}}>
          <Pill background="#6B7280" color={colors.white} fontSize={30}>
            {t(scenes.beforeAfter.beforeLabel)} · {t(scenes.beforeAfter.beforeCaption)}
          </Pill>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: contentArea.left,
          top: panelTop,
          width: panelWidth,
          height: panelHeight,
          borderRadius: R.lg,
          overflow: 'hidden',
          background: colors.white,
          boxShadow: shadow.lg,
          opacity: Math.min(1, panelIn * 2),
          transform: `translateY(${(1 - panelIn) * 70}px) scale(${0.97 + panelIn * 0.03})`,
        }}
      >
        {/* ANTES: el perfil de red social, gris y caótico */}
        <AbsoluteFill style={{background: '#F3F3F1'}}>
          <SocialMock width={panelWidth} />
          {/* lo que le falta, apilado a la derecha para que se lea en la franja */}
          <div
            style={{
              position: 'absolute',
              right: 26,
              top: panelHeight * 0.3,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              alignItems: 'flex-end',
            }}
          >
            {scenes.beforeAfter.beforeBullets.map((bullet, i) => (
              <div
                key={bullet}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 22px',
                  borderRadius: R.pill,
                  background: 'rgba(255,255,255,0.92)',
                  border: `2px solid ${colors.grey}`,
                  fontFamily: fontBody,
                  fontSize: 27,
                  fontWeight: 700,
                  color: colors.greyDeep,
                  whiteSpace: 'nowrap',
                  opacity: ramp(frame, b.labelsIn + i * 6, b.labelsIn + 14 + i * 6, 0, 1),
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke={colors.greyDeep}
                    strokeWidth="3.4"
                    strokeLinecap="round"
                  />
                </svg>
                {t(bullet)}
              </div>
            ))}
          </div>
        </AbsoluteFill>

        {/* DESPUÉS: la landing, revelada por el divisor */}
        <AbsoluteFill
          style={{
            clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`,
            background: colors.white,
          }}
        >
          <LandingMock width={panelWidth} instant />
        </AbsoluteFill>

        {/* degradé abajo, para que el corte del mockup se vea prolijo */}
        <AbsoluteFill
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0) 86%, rgba(255,255,255,0.92) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* divisor */}
        <div
          style={{
            position: 'absolute',
            left: dividerX - 5,
            top: 0,
            bottom: 0,
            width: 10,
            background: colors.coral,
            boxShadow: '0 0 34px rgba(255,107,74,0.65)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: dividerX,
            top: panelHeight / 2,
            transform: 'translate(-50%, -50%)',
            width: 92,
            height: 92,
            borderRadius: '50%',
            background: colors.coral,
            boxShadow: shadow.coral,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <svg width="46" height="34" viewBox="0 0 46 34" fill="none">
            <path
              d="M16 7 L9 17 L16 27 M30 7 L37 17 L30 27"
              stroke={colors.white}
              strokeWidth="4.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

      </div>
    </AbsoluteFill>
  );
};
