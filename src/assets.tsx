import type {CSSProperties, ReactNode} from 'react';
import React from 'react';
import {getStaticFiles, Img, staticFile} from 'remotion';

/**
 * ¿Existe este archivo dentro de public/?
 * Gracias a esto el video renderiza igual si todavía no pusiste
 * la música, la voz, los efectos o tus fotos.
 */
export const hasStaticFile = (path: string | null | undefined): boolean => {
  if (!path) {
    return false;
  }
  const wanted = path.replace(/^\.?\//, '');
  try {
    return getStaticFiles().some((file) => {
      const name = file.name.replace(/^\.?\//, '');
      return name === wanted || decodeURIComponent(name) === wanted;
    });
  } catch {
    // En algunos contextos getStaticFiles() no está disponible: no arriesgamos.
    return false;
  }
};

/**
 * Resuelve un `enabled: 'auto' | true | false` del config.
 * 'auto' → se usa el archivo solo si está en public/.
 */
export const isEnabled = (
  enabled: 'auto' | boolean,
  path: string,
): boolean => {
  if (enabled === 'auto') {
    return hasStaticFile(path);
  }
  return enabled === true;
};

/**
 * Foto del usuario con plan B.
 * Si `src` apunta a un archivo que existe en public/, se muestra la foto.
 * Si no, se dibuja la ilustración vectorial que le pases como children.
 */
export const Photo: React.FC<{
  src: string | null;
  style?: CSSProperties;
  children: ReactNode;
}> = ({src, style, children}) => {
  if (!hasStaticFile(src)) {
    return <>{children}</>;
  }
  return (
    <Img
      src={staticFile(src as string)}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        ...style,
      }}
    />
  );
};
