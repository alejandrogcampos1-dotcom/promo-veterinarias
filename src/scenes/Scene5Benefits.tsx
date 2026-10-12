import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {ease, springIn} from '../anim';
import {beats, benefitCardStart as cardStart} from '../beats';
import {colors, scenes} from '../config';
import {
  ChatTapVisual,
  MapHoursVisual,
  SearchRankVisual,
  StarsVisual,
} from '../components/BenefitVisuals';
import {DrawnCheck} from '../components/Check';
import {Backdrop} from '../components/Decor';
import {IconChatFilled, IconClock, IconSearch, IconStar} from '../components/Icons';
import {Body, Title} from '../components/Type';
import {Card} from '../components/Ui';
import {radius as R} from '../styles';
import {contentArea} from '../timeline';

type CardConfig = (typeof scenes.benefits.cards)[number];

const b = beats.benefits;

const badgeIcon = (kind: CardConfig['kind']) => {
  switch (kind) {
    case 'search':
      return <IconSearch size={52} color={colors.teal} strokeWidth={2.6} />;
    case 'chat':
      return <IconChatFilled size={56} color={colors.success} />;
    case 'map':
      return <IconClock size={52} color={colors.teal} strokeWidth={2.6} />;
    default:
      return <IconStar size={54} filled={1} id="badge-star" />;
  }
};

const VISUAL_WIDTH = contentArea.width - 72;

const visualFor = (kind: CardConfig['kind'], height: number) => {
  const props = {width: VISUAL_WIDTH, height, delay: b.visualIn};
  switch (kind) {
    case 'search':
      return <SearchRankVisual {...props} />;
    case 'chat':
      return <ChatTapVisual {...props} />;
    case 'map':
      return <MapHoursVisual {...props} />;
    default:
      return <StarsVisual {...props} />;
  }
};

/** Una de las cuatro tarjetas de beneficio. El frame ya viene local. */
const BenefitSlide: React.FC<{
  card: CardConfig;
  first: boolean;
  /** Frame local en el que empieza a entrar la tarjeta siguiente. 0 = es la última. */
  exitAt: number;
}> = ({card, first, exitAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = springIn(frame, fps, {delay: 0, duration: 26});
  // La última no se va sola: de eso se encarga la transición a la escena 6.
  const exit = exitAt === 0 ? 0 : ease(frame, exitAt, exitAt + b.outFrames, 0, 1);

  // La primera tarjeta no entra deslizando: la trae la transición de escena.
  // Entrada y salida recorren la misma distancia corta y se cruzan: mientras
  // una se va la otra ya está entrando, así nunca queda la pantalla vacía.
  const x = (first ? 0 : (1 - enter) * b.enterFrom) - exit * b.enterFrom;
  const opacity =
    (first ? 1 : Math.min(1, enter * 2.2)) * (1 - Math.max(0, exit * 1.8 - 0.8));
  const visualHeight = 714;

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateX(${x}px) scale(${
          (first ? 1 : 0.97 + enter * 0.03) - exit * 0.04
        })`,
      }}
    >
      {/* chapita con el ícono */}
      <div
        style={{
          position: 'absolute',
          left: contentArea.left,
          top: contentArea.top,
          width: 104,
          height: 104,
          borderRadius: '50%',
          background: colors.white,
          boxShadow: '0 16px 38px rgba(30,41,59,0.13)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${0.6 + springIn(frame, fps, {delay: 2, duration: 24}) * 0.4})`,
        }}
      >
        {badgeIcon(card.kind)}
      </div>

      {/* título + bajada (la bajada sigue al título, tenga 1 o 2 renglones) */}
      <div
        style={{
          position: 'absolute',
          left: contentArea.left,
          top: contentArea.top + 122,
          width: contentArea.width,
          display: 'flex',
          flexDirection: 'column',
          gap: 26,
        }}
      >
        <Title fontSize={88} style={{lineHeight: 1.05}}>
          {card.title}
        </Title>
        <div style={{opacity: ease(frame, b.titleIn + 6, b.titleIn + 18, 0, 1)}}>
          <Body fontSize={42} color={colors.inkSoft} weight={500}>
            {card.sub}
          </Body>
        </div>
      </div>

      {/* la animación del beneficio */}
      <div
        style={{
          position: 'absolute',
          left: contentArea.left,
          top: contentArea.top + 470,
          width: contentArea.width,
        }}
      >
        <Card
          width={contentArea.width}
          height={visualHeight}
          padding={36}
          cornerRadius={R.lg}
          elevation="md"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {visualFor(card.kind, visualHeight - 72)}

          {/* check verde que se dibuja al final */}
          <div style={{position: 'absolute', right: -10, bottom: -34}}>
            <DrawnCheck size={104} delay={b.checkAt} />
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

export const Scene5Benefits: React.FC = () => {
  const frame = useCurrentFrame();
  const cards = scenes.benefits.cards;

  // La tarjeta activa cambia en cuanto la siguiente empieza a entrar.
  const active = cards.reduce(
    (acc, _, i) => (frame >= cardStart(i) ? i : acc),
    0,
  );

  return (
    <AbsoluteFill>
      <Backdrop blobs="teal" pawColor={colors.teal} pawOpacity={0.06} />

      {/* indicador de progreso de las 4 tarjetas */}
      <div
        style={{
          position: 'absolute',
          right: contentArea.left,
          top: contentArea.top + 40,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {cards.map((card, i) => (
          <div
            key={card.title}
            style={{
              width: i === active ? 54 : 18,
              height: 18,
              borderRadius: 999,
              background: i === active ? colors.coral : 'rgba(30,41,59,0.18)',
            }}
          />
        ))}
      </div>

      {cards.map((card, i) => (
        <Sequence
          key={card.title}
          from={cardStart(i)}
          durationInFrames={b.cardDuration + b.overlap + 30}
          name={`Beneficio ${i + 1}`}
        >
          <BenefitSlide
            card={card}
            first={i === 0}
            exitAt={i === cards.length - 1 ? 0 : cardStart(i + 1) - cardStart(i)}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
