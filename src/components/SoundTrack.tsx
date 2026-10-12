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

  /** Volumen de la música en un frame del video: fade in, meseta, fade out. */
  const musicVolumeAt = (globalFrame: number) =>
    interpolate(
      globalFrame,
      [0, fadeIn, TOTAL_FRAMES - fadeOut, TOTAL_FRAMES],
      [0, audio.music.volume, audio.music.volume, 0],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
    );

  /**
   * En cuántos tramos se reparte la música. Si `useSeconds` recorta la pista
   * a menos de lo que dura el video y `loop` está activo, se repite el tramo
   * las veces que haga falta hasta cubrirlo entero.
   */
  const musicChunks = (() => {
    const slice =
      audio.music.useSeconds === null
        ? TOTAL_FRAMES
        : Math.max(1, Math.round(audio.music.useSeconds * fps));
    if (slice >= TOTAL_FRAMES || !audio.music.loop) {
      return [{from: 0, durationInFrames: TOTAL_FRAMES}];
    }
    const out: {from: number; durationInFrames: number}[] = [];
    for (let from = 0; from < TOTAL_FRAMES; from += slice) {
      out.push({from, durationInFrames: Math.min(slice, TOTAL_FRAMES - from)});
    }
    return out;
  })();

  // `onError` es la red de seguridad: si un archivo falta o está roto,
  // Remotion lo saltea en vez de cortar el render.
  const ignore = (name: string) => (err: Error) => {
    // eslint-disable-next-line no-console
    console.warn(`[audio] no se pudo cargar ${name}: ${err.message}`);
  };

  return (
    <>
      {musicOn
        ? musicChunks.map((chunk, i) => (
            // Una secuencia por vuelta de la pista. Cada una arranca el mp3 en
            // `startFromSeconds` y la corta la propia secuencia. El volumen se
            // calcula con el frame GLOBAL del video, así el fade in y el fade
            // out se aplican una sola vez sobre el total y no en cada vuelta.
            <Sequence
              key={`musica-${i}`}
              from={chunk.from}
              durationInFrames={chunk.durationInFrames}
              name={musicChunks.length > 1 ? `Música ${i + 1}/${musicChunks.length}` : 'Música'}
            >
              <Audio
                src={staticFile(audio.music.src)}
                trimBefore={Math.round(audio.music.startFromSeconds * fps)}
                volume={(f) => musicVolumeAt(chunk.from + f)}
                onError={ignore(audio.music.src)}
              />
            </Sequence>
          ))
        : null}

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
