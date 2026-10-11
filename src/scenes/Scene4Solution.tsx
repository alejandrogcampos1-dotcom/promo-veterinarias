import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ease, ramp, springIn} from '../anim';
import {beats} from '../beats';
import {colors, scenes} from '../config';
import {Backdrop} from '../components/Decor';
import {ScreenCard} from '../components/Phone';
import {WordReveal} from '../components/Type';
import {LandingMock} from '../components/Ui';
import {contentArea} from '../timeline';

export const Scene4Solution: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = beats.solution;

  const cardIn = springIn(frame, fps, {delay: b.screenIn, duration: 34});
  const pan = ease(frame, b.panStart, b.panStart + b.panFrames, 0, 1);
  // Empuje de cámara lento, para que la escena nunca quede quieta.
  const push = ease(frame, b.panStart - 10, b.panStart + b.panFrames + 16, 1, 1.03);

  const cardWidth = 880;
  const cardHeight = 1050;

  return (
    <AbsoluteFill>
      <Backdrop blobs="teal" pawColor={colors.teal} pawOpacity={0.07} />

      {/* titular */}
      <div
        style={{
          position: 'absolute',
          left: contentArea.left,
          top: contentArea.top,
          width: contentArea.width,
        }}
      >
        <WordReveal
          text={scenes.solution.headline}
          highlight="web propia."
          fontSize={84}
          delay={b.headlineIn}
          every={4}
          maxWidth={contentArea.width}
        />
      </div>

      {/* la landing se construye sola dentro del celular */}
      <div
        style={{
          position: 'absolute',
          left: (1080 - cardWidth) / 2,
          top: 408,
          opacity: Math.min(1, cardIn * 2),
          transform: `perspective(2000px) translateY(${(1 - cardIn) * 140}px) rotateX(${
            (1 - cardIn) * 6
          }deg) scale(${(0.95 + cardIn * 0.05) * push})`,
        }}
      >
        <ScreenCard width={cardWidth} height={cardHeight} statusTime="9:41">
          <LandingMock
            width={cardWidth}
            delay={b.buildStart}
            every={b.buildEvery}
            pan={pan}
          />
        </ScreenCard>
      </div>

      {/* destello suave cuando la web queda armada */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(44% 26% at 50% 54%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 72%)',
          opacity: ramp(frame, b.buildStart + 58, b.buildStart + 74, 0.9, 0),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
