import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from '@remotion/transitions';
import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {colors} from '../config';

export type CoralWipeProps = {
  color: string;
  /** Ancho de la banda de pintura, en px. */
  bandWidth: number;
  /** Inclinación de la banda, en px de desplazamiento entre arriba y abajo. */
  skew: number;
};

const CoralWipePresentation: React.FC<
  TransitionPresentationComponentProps<CoralWipeProps>
> = ({children, presentationProgress, presentationDirection, passedProps}) => {
  const {width, height} = useVideoConfig();
  const {color, bandWidth, skew} = passedProps;

  // Borde de ataque: entra desde la izquierda y sale por la derecha.
  const edge = -bandWidth + presentationProgress * (width + bandWidth + skew * 2);
  const topX = edge + skew;
  const bottomX = edge - skew;

  if (presentationDirection === 'exiting') {
    // La escena que se va queda visible a la DERECHA del borde.
    return (
      <AbsoluteFill
        style={{
          clipPath: `polygon(${topX}px 0px, ${width}px 0px, ${width}px ${height}px, ${bottomX}px ${height}px)`,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }

  // La escena que entra queda visible a la IZQUIERDA del borde…
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          clipPath: `polygon(0px 0px, ${topX}px 0px, ${bottomX}px ${height}px, 0px ${height}px)`,
        }}
      >
        {children}
      </AbsoluteFill>

      {/* …y la banda coral va "pintando" por encima del borde. */}
      <AbsoluteFill
        style={{
          background: color,
          clipPath: `polygon(${topX - bandWidth}px 0px, ${topX}px 0px, ${bottomX}px ${height}px, ${
            bottomX - bandWidth
          }px ${height}px)`,
        }}
      />
      {/* Filito claro en la punta, para que el barrido se vea nítido. */}
      <AbsoluteFill
        style={{
          background: 'rgba(255,255,255,0.75)',
          clipPath: `polygon(${topX - 10}px 0px, ${topX}px 0px, ${bottomX}px ${height}px, ${
            bottomX - 10
          }px ${height}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Barrido coral: una banda de pintura cruza la pantalla en diagonal y
 * detrás de ella aparece la escena nueva.
 */
export const coralWipe = (
  props: Partial<CoralWipeProps> = {},
): TransitionPresentation<CoralWipeProps> => ({
  component: CoralWipePresentation,
  props: {
    color: props.color ?? colors.coral,
    bandWidth: props.bandWidth ?? 380,
    skew: props.skew ?? 150,
  },
});
