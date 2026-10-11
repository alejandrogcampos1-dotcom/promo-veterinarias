import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ease, ramp, springIn, springSnap} from '../anim';
import {beats} from '../beats';
import {colors, niche, scenes} from '../config';
import {fontBody} from '../fonts';
import {Backdrop} from '../components/Decor';
import {SearchScreen} from '../components/SearchScreen';
import {Kicker, WordReveal} from '../components/Type';
import {contentArea} from '../timeline';

/** Puntito que late: refuerza el "ahora mismo". */
const LiveDot: React.FC = () => {
  const frame = useCurrentFrame();
  const beat = (frame % 34) / 34;
  return (
    <div style={{position: 'relative', width: 22, height: 22, flexShrink: 0}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: colors.coral,
          transform: `scale(${1 + beat * 1.7})`,
          opacity: (1 - beat) * 0.5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: colors.coral,
        }}
      />
    </div>
  );
};

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = beats.hook;

  const query = niche.searchQuery;
  const typedChars = Math.max(0, Math.floor((frame - b.typeStart) / b.typePerChar));
  const typedText = query.slice(0, Math.min(query.length, typedChars));
  const isTyping = frame >= b.typeStart && typedChars < query.length;
  const caretVisible =
    frame >= b.searchFocus && (isTyping || Math.floor(frame / 14) % 2 === 0);

  const focus = springSnap(frame, fps, {delay: b.searchFocus});
  const cardIn = springIn(frame, fps, {delay: b.screenIn, duration: 36});

  const rowProgress = scenes.hook.results.map((_, i) =>
    springIn(frame, fps, {delay: b.resultsStart + i * b.resultEvery, duration: 26}),
  );

  const label =
    frame < b.resultsStart - 6
      ? 'Buscando…'
      : `${scenes.hook.results.length} resultados cerca de vos`;

  const cardWidth = 880;
  const cardHeight = 950;
  const cardTop = 512;

  // Empuje de cámara lento sobre el celular (el texto no se mueve, así no se
  // sale de la zona segura de arriba). El desplazamiento extra hace que el
  // encuadre coincida exacto con el de la escena 2, que escala toda la
  // pantalla desde el 56% de alto: así el corte entre las dos es invisible.
  const camera = ease(frame, 0, 124, 1, 1.035);
  const cameraShift = (cardTop + cardHeight / 2 - 1920 * 0.56) * (camera - 1);

  return (
    <AbsoluteFill>
      <Backdrop blobs="warm" pawColor={colors.teal} pawOpacity={0.065} />

      <AbsoluteFill>
        {/* volanta */}
        <div
          style={{
            position: 'absolute',
            left: contentArea.left,
            top: contentArea.top + 4,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            opacity: ramp(frame, 0, 8, 0, 1),
            transform: `translateY(${(1 - ramp(frame, 0, 10, 0, 1)) * 18}px)`,
          }}
        >
          <LiveDot />
          <Kicker fontSize={38}>{scenes.hook.kicker}</Kicker>
          <span
            style={{
              fontFamily: fontBody,
              fontSize: 32,
              fontWeight: 600,
              color: colors.inkSoft,
            }}
          >
            · {niche.zone}
          </span>
        </div>

        {/* titular palabra por palabra */}
        <div
          style={{
            position: 'absolute',
            left: contentArea.left,
            top: contentArea.top + 72,
            width: contentArea.width,
          }}
        >
          <WordReveal
            text={scenes.hook.headline}
            highlight={niche.zone}
            fontSize={64}
            delay={8}
            every={3.5}
            lineHeight={1.1}
            maxWidth={contentArea.width}
          />
        </div>

        {/* celular */}
        <div
          style={{
            position: 'absolute',
            left: (1080 - cardWidth) / 2,
            top: cardTop,
            opacity: Math.min(1, cardIn * 2),
            transformOrigin: '50% 50%',
            transform: `perspective(1800px) translateY(${
              (1 - cardIn) * 170 + cameraShift
            }px) rotateX(${(1 - cardIn) * 7}deg) scale(${
              (0.95 + cardIn * 0.05) * camera
            })`,
          }}
        >
          <SearchScreen
            width={cardWidth}
            height={cardHeight}
            typedText={typedText}
            caret={caretVisible}
            focus={focus}
            rowProgress={rowProgress}
            label={label}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
