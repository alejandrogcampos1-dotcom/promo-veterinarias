import {TransitionSeries} from '@remotion/transitions';
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {colors, transitions} from './config';
import {SafeGuides} from './components/Decor';
import {ProgressBar} from './components/ProgressBar';
import {SoundTrack} from './components/SoundTrack';
import {SubtitleTrack} from './components/Subtitles';
import {Scene1Hook} from './scenes/Scene1Hook';
import {Scene2Punch} from './scenes/Scene2Punch';
import {Scene3Problem} from './scenes/Scene3Problem';
import {Scene4Solution} from './scenes/Scene4Solution';
import {Scene5Benefits} from './scenes/Scene5Benefits';
import {Scene6BeforeAfter} from './scenes/Scene6BeforeAfter';
import {Scene7Offer} from './scenes/Scene7Offer';
import {Scene8Cta} from './scenes/Scene8Cta';
import {sceneDurations, sceneOrder} from './timeline';
import {presentationFor, timingFor} from './transitions';

const sceneComponents = {
  hook: Scene1Hook,
  punch: Scene2Punch,
  problem: Scene3Problem,
  solution: Scene4Solution,
  benefits: Scene5Benefits,
  beforeAfter: Scene6BeforeAfter,
  offer: Scene7Offer,
  cta: Scene8Cta,
} as const;

export type PromoProps = {
  /** true dibuja las guías de zona segura encima del video. */
  showGuides: boolean;
};

export const PromoVeterinarias: React.FC<PromoProps> = ({showGuides}) => {
  const children: React.ReactNode[] = [];

  sceneOrder.forEach((id, i) => {
    const Scene = sceneComponents[id];
    children.push(
      <TransitionSeries.Sequence
        key={`scene-${id}`}
        durationInFrames={sceneDurations[i]}
        name={`${i + 1} · ${id}`}
      >
        <Scene />
      </TransitionSeries.Sequence>,
    );
    const transition = transitions[i];
    if (i < sceneOrder.length - 1 && transition) {
      children.push(
        <TransitionSeries.Transition
          key={`transition-${i}`}
          presentation={presentationFor(transition.kind)}
          timing={timingFor(transition.kind, transition.durationInFrames)}
        />,
      );
    }
  });

  return (
    <AbsoluteFill style={{backgroundColor: colors.cream}}>
      <TransitionSeries>{children}</TransitionSeries>

      {/* Capas que viven arriba de todo el video, en tiempo absoluto. */}
      <SubtitleTrack />
      <ProgressBar />
      <SoundTrack />
      <SafeGuides show={showGuides} />
    </AbsoluteFill>
  );
};
