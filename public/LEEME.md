# Carpeta `public/`

Todo lo que pongas acá lo puede usar el video. Si un archivo **no existe, el
video renderiza igual**: se usan las ilustraciones vectoriales y el audio
simplemente no suena.

```
public/
├── musica.mp3          ← música de fondo (volumen 0,15 con fade in/out) — FALTA
├── voz.mp3             ← voz en off (puesta, pero desactivada: ver abajo)
├── sfx/                ← los 3 efectos, emparejados a -20 LUFS
│   ├── pop.mp3         ← entrada de tarjetas
│   ├── whoosh.mp3      ← transiciones entre escenas
│   ├── ding.mp3        ← checks verdes
│   ├── pop-alt.mp3     ← variantes: golpe más grave
│   ├── whoosh-alt.mp3  ←            swish tonal
│   └── ding-alt.mp3    ←            tono más grave
├── fotos/              ← tus fotos (ver `media` en src/config.ts)
│   ├── perro.jpg
│   └── logo.png
└── fonts/              ← tipografías (no tocar, las genera `npm run fonts`)
```

## Estado actual

- **Efectos:** listos y sonando, 41 en total, entre el 30% y el 38%.
- **Voz:** lista y sincronizada. La grabación dura 39,9 s y el video 48,5 s,
  así que se reparte frase por frase (ver `voiceover.phrases` en el config):
  se estiran las pausas, no el habla. Va +6 dB porque vino baja.
- **Música:** falta `public/musica.mp3`. Apenas la copies acá entra sola: 15%,
  fade in de 1,5 s, fade out de 2,5 s, y si la pista es más corta que el video
  se repite para cubrirlo entero. No hay que tocar nada del código.

## Cómo se enganchan

En `src/config.ts`:

```ts
export const audio = {
  music:     {src: 'musica.mp3', enabled: 'auto', volume: 0.15, ...},
  voiceover: {src: 'voz.mp3',    enabled: false,  volume: 1, offsetSeconds: 0},
  sfx: {
    enabled: 'auto',
    volume: 0.38,
    duckUnderVoice: 0.55,
    sounds: {
      pop:    {src: 'sfx/pop.mp3',    gain: 1},
      whoosh: {src: 'sfx/whoosh.mp3', gain: 0.8},
      ding:   {src: 'sfx/ding.mp3',   gain: 0.9},
    },
  },
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
