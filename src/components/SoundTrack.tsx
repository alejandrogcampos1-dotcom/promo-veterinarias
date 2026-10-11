import React from 'react';
import {Audio, interpolate, Sequence, staticFile, useVideoConfig} from 'remotion';
import {isEnabled} from '../assets';
import {audio} from '../config';
import {sfxCues} from '../sfxCues';
import {TOTAL_FRAMES} from '../timeline';

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

      {voiceOn ? (
        voiceOffset >= 0 ? (
          <Sequence from={voiceOffset} name="Voz en off">
            <Audio
              src={staticFile(audio.voiceover.src)}
              volume={audio.voiceover.volume}
              onError={ignore(audio.voiceover.src)}
            />
          </Sequence>
        ) : (
          <Audio
            src={staticFile(audio.voiceover.src)}
            trimBefore={-voiceOffset}
            volume={audio.voiceover.volume}
            onError={ignore(audio.voiceover.src)}
          />
        )
      ) : null}

      {sfxCues.map((cue, i) => {
        const src = audio.sfx[cue.kind];
        const on = sfxOn === null ? isEnabled('auto', src) : sfxOn;
        if (!on) {
          return null;
        }
        return (
          <Sequence
            key={`${cue.kind}-${cue.frame}-${i}`}
            from={cue.frame}
            durationInFrames={45}
            name={`sfx ${cue.kind}`}
          >
            <Audio
              src={staticFile(src)}
              volume={audio.sfx.volume * (cue.volume ?? 1)}
              onError={ignore(src)}
            />
          </Sequence>
        );
      })}
    </>
  );
};
