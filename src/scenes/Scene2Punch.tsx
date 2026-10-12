import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ease, ramp, shake, springIn, springPunch} from '../anim';
import {beats} from '../beats';
import {colors, niche, scenes} from '../config';
import {Backdrop} from '../components/Decor';
import {Paw} from '../components/Pets';
import {SearchScreen} from '../components/SearchScreen';
import {Body, Title} from '../components/Type';
import {EmptyResultRow} from '../components/Ui';
import {contentArea} from '../timeline';

export const Scene2Punch: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = beats.punch;

  // El encuadre queda clavado donde lo dejó la escena 1: si se agrandara más,
  // el celular se comería los márgenes de seguridad (la hora se cortaba contra
  // el borde izquierdo) y se metería debajo del titular.
  const camera = 1.035;
  // El acercamiento pasa a ser DENTRO de la pantalla del celular, que recorta
  // lo que sobra. Mismo efecto de "entrar a los resultados", sin romper nada.
  // El desplazamiento acompaña al zoom para que el buscador se vaya entero
  // hacia arriba, en vez de quedar cortado a la mitad.
  const zoomP = ease(frame, b.pushStart, b.pushStart + b.pushFrames, 0, 1);
  const contentZoom = 1 + zoomP * 0.2;
  const contentShift = -zoomP * 136;

  // El mapita se repliega para dar lugar a la tarjeta vacía.
  const mapHeight = ramp(frame, b.mapCollapseStart, b.mapCollapseStart + 14, 168, 0);

  const dim = ramp(frame, b.dimStart, b.dimStart + 22, 0, 0.92);
  const emptyProgress = springIn(frame, fps, {delay: b.emptyCardIn, duration: 28});
  const emptyShake = frame > b.shakeStart ? shake(frame - b.shakeStart, 11, 34) : 0;

  // Golpe final: velo + "¿Y la tuya?"
  const veil = ramp(frame, b.punchlineIn - 2, b.punchlineIn + 9, 0, 1);
  const blur = ramp(frame, b.punchlineIn - 2, b.punchlineIn + 9, 0, 11);
  const emptyCardIn = springIn(frame, fps, {delay: b.punchlineIn + 16, duration: 30});
  const punch = springPunch(frame, fps, {delay: b.punchlineIn, duration: 36});
  const impact = frame >= b.punchlineIn ? shake(frame - b.punchlineIn, 9, 9) : 0;

  const headlineOut = ramp(frame, b.punchlineIn - 12, b.punchlineIn, 1, 0);

  const cardWidth = 880;
  const cardHeight = 950;

  return (
    <AbsoluteFill style={{transform: `translateX(${impact}px)`}}>
      <Backdrop blobs="warm" pawColor={colors.coral} pawOpacity={0.07} />

      {/* pantalla del buscador, ahora en primer plano */}
      <AbsoluteFill
        style={{
          transform: `scale(${camera})`,
          transformOrigin: '50% 56%',
          filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: (1080 - cardWidth) / 2,
            top: 512,
          }}
        >
          <SearchScreen
            width={cardWidth}
            height={cardHeight}
            typedText={niche.searchQuery}
            caret={false}
            focus={0}
            rowProgress={[1, 1, 1]}
            rowDim={[dim, dim, dim]}
            label={`${scenes.hook.results.length} resultados cerca de vos`}
            mapHeight={mapHeight}
            contentZoom={contentZoom}
            contentShift={contentShift}
            emptyRow={{progress: emptyProgress, shake: emptyShake}}
          />
        </div>
      </AbsoluteFill>

      {/* bajada de la escena (entra recién cuando terminó el fundido) */}
      <AbsoluteFill style={{opacity: headlineOut * ramp(frame, b.headlineIn, b.headlineIn + 8, 0, 1)}}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 470,
            background:
              'linear-gradient(180deg, rgba(255,248,240,0.97) 0%, rgba(255,248,240,0.92) 58%, rgba(255,248,240,0) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: contentArea.left,
            top: contentArea.top + 36,
            width: contentArea.width,
            transform: `translateY(${
              (1 - ramp(frame, b.headlineIn, b.headlineIn + 14, 0, 1)) * 22
            }px)`,
          }}
        >
          <Body fontSize={62} color={colors.ink} weight={600} align="left">
            {scenes.punch.headline}
          </Body>
        </div>
      </AbsoluteFill>

      {/* el golpe */}
      {veil > 0 ? (
        <AbsoluteFill style={{opacity: veil}}>
          <AbsoluteFill style={{background: 'rgba(255, 248, 240, 0.9)'}} />
          <Backdrop
            background="transparent"
            blobs="coral"
            blobOpacity={0.5}
            pawColor={colors.coral}
            pawOpacity={0.09}
            glow={false}
          />

          <div
            style={{
              position: 'absolute',
              left: contentArea.left,
              top: contentArea.top,
              width: contentArea.width,
              height: contentArea.height,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 26,
            }}
          >
            <div style={{opacity: ramp(frame, b.punchlineIn + 2, b.punchlineIn + 12, 0, 1)}}>
              <Paw size={96} color={colors.coral} opacity={0.45} rotate={-12} />
            </div>

            <div
              style={{
                transform: `scale(${0.55 + punch * 0.45}) rotate(${(1 - punch) * -5}deg)`,
              }}
            >
              <Title fontSize={158} color={colors.coral} align="center" style={{lineHeight: 0.96}}>
                {scenes.punch.punchline}
              </Title>
            </div>

            {/* subrayado que se dibuja */}
            <div
              style={{
                width: ramp(frame, b.punchlineIn + 10, b.punchlineIn + 26, 0, 420),
                height: 14,
                borderRadius: 999,
                background: colors.coral,
                opacity: 0.85,
              }}
            />

            {/* el hueco: tu negocio no está en la lista */}
            <div
              style={{
                width: '100%',
                marginTop: 34,
                opacity: Math.min(1, emptyCardIn * 2),
                transform: `translate(${emptyShake * 0.8}px, ${
                  (1 - emptyCardIn) * 40
                }px) rotate(${emptyShake * 0.1}deg)`,
              }}
            >
              <EmptyResultRow
                label={scenes.punch.emptyCardLabel}
                hint={scenes.punch.emptyCardHint}
                fontSize={40}
              />
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
