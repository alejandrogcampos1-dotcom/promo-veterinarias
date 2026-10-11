# Carpeta `public/`

Todo lo que pongas acá lo puede usar el video. Si un archivo **no existe, el
video renderiza igual**: se usan las ilustraciones vectoriales y el audio
simplemente no suena.

```
public/
├── musica.mp3          ← música de fondo (volumen 0,15 con fade in/out)
├── voz.mp3             ← tu voz en off
├── sfx/
│   ├── pop.mp3         ← entrada de tarjetas
│   ├── whoosh.mp3      ← transiciones entre escenas
│   └── ding.mp3        ← checks verdes
├── fotos/              ← tus fotos (ver `media` en src/config.ts)
│   ├── perro.jpg
│   └── logo.png
└── fonts/              ← tipografías (no tocar, las genera `npm run fonts`)
```

## Cómo se enganchan

En `src/config.ts`:

```ts
export const audio = {
  music:     {src: 'musica.mp3', enabled: 'auto', volume: 0.15, ...},
  voiceover: {src: 'voz.mp3',    enabled: 'auto', volume: 1, offsetSeconds: 0},
  sfx:       {enabled: 'auto', volume: 0.35, pop: 'sfx/pop.mp3', ...},
};

export const media = {
  heroPhoto:  'fotos/perro.jpg',  // null = ilustración vectorial
  logoPhoto:  'fotos/logo.png',
  beforePhoto: null,
  afterPhoto:  null,
};
```

`enabled: 'auto'` usa el archivo solo si está. Si lo pusiste y no suena,
poné `enabled: true` para forzarlo.

## Dónde conseguir música y efectos

Buscá pistas **libres de derechos** (royalty free / CC0). Para un video de
WhatsApp alcanza con una pista instrumental alegre de ~50 segundos.
