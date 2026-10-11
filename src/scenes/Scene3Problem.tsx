import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ramp, springIn} from '../anim';
import {beats} from '../beats';
import {colors, scenes} from '../config';
import {Backdrop} from '../components/Decor';
import {IconChatFilled} from '../components/Icons';
import {ScreenCard} from '../components/Phone';
import {Body, WordReveal} from '../components/Type';
import {ChatBubble, UnreadBadge} from '../components/Ui';
import {fontTitle} from '../fonts';
import {radius as R, shadow} from '../styles';
import {t} from '../text';
import {contentArea} from '../timeline';

const senders = [
  {initial: 'M', color: '#F2B5A0'},
  {initial: 'L', color: '#A8C9C4'},
  {initial: 'J', color: '#F6D7A8'},
  {initial: 'C', color: '#C2C9E0'},
  {initial: 'S', color: '#EFBFC8'},
  {initial: 'R', color: '#BFD9B8'},
];

const Avatar: React.FC<{initial: string; color: string; size?: number}> = ({
  initial,
  color,
  size = 58,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: color,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: fontTitle,
      fontWeight: 800,
      fontSize: size * 0.42,
      color: colors.white,
    }}
  >
    {initial}
  </div>
);

export const Scene3Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = beats.problem;
  const s = scenes.problem;

  const cardIn = springIn(frame, fps, {delay: b.inboxIn, duration: 32});

  // Contador de no leídos: salta de número en número.
  const stepIndex = b.counterSteps.reduce(
    (acc, step, i) => (frame >= step ? i : acc),
    -1,
  );
  const unread = stepIndex >= 0 ? s.counters[stepIndex] : 4;
  const lastStep = stepIndex >= 0 ? b.counterSteps[stepIndex] : -999;
  const pop =
    ramp(frame - lastStep, 0, 4, 0, 1) * ramp(frame - lastStep, 4, 15, 1, 0);

  const bannerIn = springIn(frame, fps, {delay: b.sublineIn, duration: 30});

  const cardWidth = 880;
  const cardHeight = 1060;

  return (
    <AbsoluteFill>
      <Backdrop blobs="warm" pawColor={colors.coral} pawOpacity={0.06} />

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
          text={s.headline}
          highlight="lo mismo"
          fontSize={70}
          delay={b.headlineIn}
          every={3.5}
          maxWidth={contentArea.width}
        />
      </div>

      {/* bandeja */}
      <div
        style={{
          position: 'absolute',
          left: (1080 - cardWidth) / 2,
          top: 398,
          opacity: Math.min(1, cardIn * 2),
          transform: `perspective(1800px) translateY(${(1 - cardIn) * 120}px) scale(${
            0.96 + cardIn * 0.04
          })`,
        }}
      >
        <ScreenCard width={cardWidth} height={cardHeight} statusTime="19:48">
          <div
            style={{
              height: '100%',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* encabezado de la bandeja */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                padding: '18px 34px 22px',
                borderBottom: `2px solid ${colors.line}`,
              }}
            >
              <IconChatFilled size={48} color={colors.success} />
              <div
                style={{
                  flex: 1,
                  fontFamily: fontTitle,
                  fontWeight: 800,
                  fontSize: 38,
                  color: colors.ink,
                  letterSpacing: -0.8,
                }}
              >
                {t(s.inboxTitle)}
              </div>
              <UnreadBadge value={unread} pop={pop} fontSize={38} />
            </div>

            {/* burbujas que caen y se apilan */}
            <div
              style={{
                flex: 1,
                minHeight: 0,
                padding: '26px 30px',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              {s.messages.map((message, i) => {
                const delay = b.firstBubble + i * b.bubbleEvery;
                const p = springIn(frame, fps, {delay, duration: 28});
                if (p <= 0) {
                  return <div key={message} style={{height: 0}} />;
                }
                const sender = senders[i % senders.length];
                return (
                  <div
                    key={message}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: 16,
                      opacity: Math.min(1, p * 1.8),
                      transform: `translateY(${(1 - p) * -90}px) rotate(${
                        (1 - p) * (i % 2 === 0 ? -3.5 : 3.5)
                      }deg)`,
                    }}
                  >
                    <Avatar initial={sender.initial} color={sender.color} />
                    <ChatBubble text={message} fontSize={31} maxWidth="76%" />
                  </div>
                );
              })}

              {/* "escribiendo…" para que nunca quede quieto */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  opacity: ramp(frame, b.firstBubble + 10, b.firstBubble + 22, 0, 1),
                }}
              >
                <Avatar initial="•" color={colors.grey} size={58} />
                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    padding: '22px 26px',
                    borderRadius: R.md,
                    borderBottomLeftRadius: 8,
                    background: colors.white,
                    boxShadow: shadow.xs,
                  }}
                >
                  {[0, 1, 2].map((d) => (
                    <div
                      key={d}
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: colors.inkFaint,
                        opacity:
                          0.35 + 0.65 * Math.abs(Math.sin((frame - d * 4) / 9)),
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScreenCard>
      </div>

      {/* cartel coral: "y los turnos se pierden" */}
      <div
        style={{
          position: 'absolute',
          left: contentArea.left,
          width: contentArea.width,
          top: 1252,
          opacity: Math.min(1, bannerIn * 2),
          transform: `translateY(${(1 - bannerIn) * 110}px) rotate(${
            -1.6 * bannerIn
          }deg) scale(${0.94 + bannerIn * 0.06})`,
        }}
      >
        <div
          style={{
            padding: '34px 42px',
            borderRadius: R.md,
            background: colors.coral,
            boxShadow: shadow.coral,
            boxSizing: 'border-box',
          }}
        >
          <Body fontSize={50} color={colors.white} weight={700} align="left">
            {s.subline}
          </Body>
        </div>
      </div>
    </AbsoluteFill>
  );
};
