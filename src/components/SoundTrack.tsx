import React from 'react';
import {Audio, interpolate, Sequence, staticFile, useVideoConfig} from 'remotion';
import {isEnabled} from '../assets';
import {audio, subtitles} from '../config';
import {sfxCues} from '../sfxCues';
import {TOTAL_FRAMES} from '../timeline';

/** ¿Este segundo cae encima de una frase de la voz en off? */
const landsOnVoice = (seconds: number): boolean =>
  subtitles.cues.some((cue) => {
    const from = cue.from + subtitles.offsetSeconds - 0.15;
    const to = cue.to + subtitles.offsetSeconds + 0.15;
    return seconds >= from && seconds <= to;
  });

/**
 * Pista de audio. Todo es opcional: si los mp3 no están en public/
 * no se monta nada y el video renderiza igual, sin errores.
 */
export const SoundTrack: React.FC = () => {
  const {fps} = useVideoConfig();

  const musicOn = isEnabled(audio.music.enabled, audio.music.src);
  const voiceOn = isEnabled(audio.voiceover.enabled, audio.voiceover.src);
  const sfxOn = audio.sfx.enabled === 'auto' ? null : audio.sfx.enabled;

  const fadeIn = Math.max(1, Math.round(audio.music.fadeInSeconds * fps));
  const fadeOut = Math.max(1, Math.round(audio.music.fadeOutSeconds * fps));
  const voiceOffset = Math.round(audio.voiceover.offsetSeconds * fps);

  // Los efectos solo se agachan si hay voz con la que pelearse.
  const duck = voiceOn ? audio.sfx.duckUnderVoice : 1;

  // `onError` es la red de seguridad: si un archivo falta o está roto,
  // Remotion lo saltea en vez de cortar el render.
  const ignore = (name: string) => (err: Error) => {
    // eslint-disable-next-line no-console
    console.warn(`[audio] no se pudo cargar ${name}: ${err.message}`);
  };

  return (
    <>
      {musicOn ? (
        <Audio
          src={staticFile(audio.music.src)}
          trimBefore={Math.round(audio.music.startFromSeconds * fps)}
          volume={(f) =>
            interpolate(
              f,
              [0, fadeIn, TOTAL_FRAMES - fadeOut, TOTAL_FRAMES],
              [0, audio.music.volume, audio.music.volume, 0],
              {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
            )
          }
          onError={ignore(audio.music.src)}
        />
      ) : null}

      {voiceOn
        ? audio.voiceover.phrases.length > 0
          ? // Frase por frase: cada una se recorta del mp3 y se planta en su
            // momento del video. Las pausas se estiran, el habla no se toca.
            audio.voiceover.phrases.map((phrase, i) => {
              const length = Math.max(
                1,
                Math.round((phrase.to - phrase.from) * fps),
              );
              return (
                <Sequence
                  key={`voz-${i}`}
                  from={Math.round((phrase.at + audio.voiceover.offsetSeconds) * fps)}
                  durationInFrames={length}
                  name={`Voz ${i + 1} · ${phrase.nota}`}
                >
                  <Audio
                    src={staticFile(audio.voiceover.src)}
                    trimBefore={Math.round(phrase.from * fps)}
                    volume={audio.voiceover.volume}
                    onError={ignore(audio.voiceover.src)}
                  />
                </Sequence>
              );
            })
          : voiceOffset >= 0
            ? [
                <Sequence from={voiceOffset} name="Voz en off" key="voz">
                  <Audio
                    src={staticFile(audio.voiceover.src)}
                    volume={audio.voiceover.volume}
                    onError={ignore(audio.voiceover.src)}
                  />
                </Sequence>,
              ]
            : [
                <Audio
                  key="voz"
                  src={staticFile(audio.voiceover.src)}
                  trimBefore={-voiceOffset}
                  volume={audio.voiceover.volume}
                  onError={ignore(audio.voiceover.src)}
                />,
              ]
        : null}

      {sfxCues.map((cue, i) => {
        const sound = audio.sfx.sounds[cue.kind];
        const on = sfxOn === null ? isEnabled('auto', sound.src) : sfxOn;
        if (!on) {
          return null;
        }
        const ducked = landsOnVoice(cue.frame / fps) ? duck : 1;
        return (
          <Sequence
            key={`${cue.kind}-${cue.frame}-${i}`}
            from={cue.frame}
            durationInFrames={45}
            name={`sfx ${cue.kind}`}
          >
            <Audio
              src={staticFile(sound.src)}
              volume={audio.sfx.volume * sound.gain * (cue.volume ?? 1) * ducked}
              onError={ignore(sound.src)}
            />
          </Sequence>
        );
      })}
    </>
  );
};
