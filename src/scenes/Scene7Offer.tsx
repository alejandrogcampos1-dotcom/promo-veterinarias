import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ease, ramp, springIn, springSnap} from '../anim';
import {beats} from '../beats';
import {colors, offer, scenes} from '../config';
import {ListCheck} from '../components/Check';
import {Backdrop} from '../components/Decor';
import {Paw} from '../components/Pets';
import {Body, Kicker} from '../components/Type';
import {Card, Counter, Shine} from '../components/Ui';
import {fontBody, fontTitle} from '../fonts';
import {radius as R} from '../styles';
import {t} from '../text';
import {contentArea} from '../timeline';

export const Scene7Offer: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = beats.offer;
  const s = scenes.offer;

  const cardIn = springIn(frame, fps, {delay: b.cardIn, duration: 32});
  const price = ease(frame, b.countStart, b.countStart + b.countFrames, offer.priceFrom, offer.price);
  const pricePop = springSnap(frame, fps, {delay: b.countStart + b.countFrames - 4, duration: 18});
  const shine = ramp(frame, b.shineStart, b.shineStart + 30, 0, 1);

  // La tarjeta entra junto con el primer check, no antes: así nunca se ve
  // vacía esperando a que lleguen los ítems.
  const bulletsIn = springIn(frame, fps, {delay: b.bulletsStart, duration: 28});

  const priceCardTop = 278;
  const priceCardHeight = 516;
  const bulletsTop = 856;

  return (
    <AbsoluteFill>
      <Backdrop blobs="warm" pawColor={colors.teal} pawOpacity={0.06} />

      {/* volanta */}
      <div
        style={{
          position: 'absolute',
          left: contentArea.left,
          top: contentArea.top,
          width: contentArea.width,
          opacity: ramp(frame, b.kickerIn - 10, b.kickerIn, 0, 1),
        }}
      >
        <Kicker fontSize={36} align="center">
          {s.kicker}
        </Kicker>
      </div>

      {/* tarjeta de precio */}
      <div
        style={{
          position: 'absolute',
          left: contentArea.left,
          top: priceCardTop,
          width: contentArea.width,
          opacity: Math.min(1, cardIn * 2),
          transform: `translateY(${(1 - cardIn) * 90}px) scale(${0.95 + cardIn * 0.05})`,
        }}
      >
        <Card
          width={contentArea.width}
          height={priceCardHeight}
          padding={0}
          background={colors.teal}
          cornerRadius={R.xl}
          elevation="teal"
          style={{position: 'relative', overflow: 'hidden'}}
        >
          {/* huellita de fondo */}
          <div style={{position: 'absolute', right: -70, bottom: -90, opacity: 0.1}}>
            <Paw size={420} color={colors.white} rotate={-16} />
          </div>
          <div
            style={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                fontFamily: fontBody,
                fontSize: 46,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.88)',
              }}
            >
              {t(s.priceLabel)}
            </div>

            <div style={{transform: `scale(${1 + pricePop * 0.06})`}}>
              <Counter
                value={price}
                fontSize={236}
                color={colors.white}
                prefix={offer.currency}
                font={fontTitle}
                prefixScale={0.3}
              />
            </div>
          </div>
          <Shine progress={shine} />
        </Card>
      </div>

      {/* lista con checks escalonados */}
      <div
        style={{
          position: 'absolute',
          left: contentArea.left,
          top: bulletsTop,
          width: contentArea.width,
          opacity: Math.min(1, bulletsIn * 2),
          transform: `translateY(${(1 - bulletsIn) * 50}px)`,
        }}
      >
        <Card
          width={contentArea.width}
          padding={40}
          cornerRadius={R.lg}
          elevation="sm"
          style={{display: 'flex', flexDirection: 'column', gap: 26}}
        >
          {s.bullets.map((bullet, i) => {
            const delay = b.bulletsStart + i * b.bulletEvery;
            const p = springIn(frame, fps, {delay, duration: 26});
            return (
              <div
                key={bullet}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 26,
                  opacity: Math.min(1, p * 2),
                  transform: `translateX(${(1 - p) * 46}px)`,
                }}
              >
                <ListCheck size={62} delay={delay + 4} />
                <Body fontSize={44} color={colors.ink} weight={600}>
                  {bullet}
                </Body>
              </div>
            );
          })}
        </Card>
      </div>

      {/* marco coral apenas perceptible, para que la oferta "brille" */}
      <AbsoluteFill
        style={{
          boxShadow: `inset 0 0 160px rgba(255,107,74,${0.1 * shine})`,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
