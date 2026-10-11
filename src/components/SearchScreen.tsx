import React from 'react';
import {colors, scenes} from '../config';
import {fontBody} from '../fonts';
import {radius as R} from '../styles';
import {t} from '../text';
import {IconSearch} from './Icons';
import {ScreenCard} from './Phone';
import {EmptyResultRow, MiniMap, ResultRow, SearchBar} from './Ui';

/**
 * Pantalla de resultados del buscador.
 * La comparten las escenas 1 y 2 para que el corte entre las dos sea
 * continuo: en la 2 es exactamente la misma pantalla, pero con la cámara
 * entrando y los resultados apagándose.
 */
export const SearchScreen: React.FC<{
  width: number;
  height: number;
  /** Texto ya tecleado en el buscador. */
  typedText: string;
  caret?: boolean;
  focus?: number;
  /** Progreso de entrada (0-1) de cada resultado. */
  rowProgress: number[];
  /** Grado de "apagado" (0-1) de cada resultado. */
  rowDim?: number[];
  label: string;
  /** Tarjeta vacía con borde punteado (escena 2). */
  emptyRow?: {progress: number; shake: number} | null;
  /** Alto del mapita. En la escena 2 se colapsa a 0 para dar lugar. */
  mapHeight?: number;
}> = ({
  width,
  height,
  typedText,
  caret = false,
  focus = 0,
  rowProgress,
  rowDim,
  label,
  emptyRow = null,
  mapHeight = 168,
}) => {
  const results = scenes.hook.results;

  return (
    <ScreenCard width={width} height={height} statusTime="9:41">
      <div
        style={{
          padding: 34,
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <SearchBar text={typedText} caret={caret} focus={focus} fontSize={34} />

        {mapHeight > 4 ? (
          <MiniMap width="100%" height={mapHeight} pinBounce={0} cornerRadius={R.sm} />
        ) : null}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontFamily: fontBody,
            fontSize: 26,
            fontWeight: 600,
            color: colors.inkSoft,
          }}
        >
          <IconSearch size={26} color={colors.inkFaint} strokeWidth={2.6} />
          {t(label)}
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
          {results.map((result, i) => {
            const p = rowProgress[i] ?? 0;
            if (p <= 0) {
              return (
                <div
                  key={result.name}
                  style={{height: 140, borderRadius: R.sm, background: '#F4F2EE'}}
                />
              );
            }
            return (
              <div
                key={result.name}
                style={{
                  opacity: Math.min(1, p * 1.5),
                  transform: `translateY(${(1 - p) * 34}px) scale(${0.97 + p * 0.03})`,
                }}
              >
                <ResultRow
                  result={{...result, name: t(result.name)}}
                  dim={rowDim?.[i] ?? 0}
                  fontSize={34}
                />
              </div>
            );
          })}

          {emptyRow && emptyRow.progress > 0 ? (
            <div
              style={{
                opacity: Math.min(1, emptyRow.progress * 1.6),
                transform: `translate(${emptyRow.shake}px, ${
                  (1 - emptyRow.progress) * 34
                }px) rotate(${emptyRow.shake * 0.12}deg)`,
              }}
            >
              <EmptyResultRow
                label={scenes.punch.emptyCardLabel}
                hint={scenes.punch.emptyCardHint}
                fontSize={34}
              />
            </div>
          ) : null}
        </div>
      </div>
    </ScreenCard>
  );
};
