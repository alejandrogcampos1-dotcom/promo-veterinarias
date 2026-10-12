# Carpeta `public/`

Todo lo que pongas acá lo puede usar el video. Si un archivo **no existe, el
video renderiza igual**: se usan las ilustraciones vectoriales y el audio
simplemente no suena.

```
public/
├── musica.mp3          ← música de fondo (volumen 0,15 con fade in/out)
├── voz.mp3             ← voz en off
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

Las tres capas están puestas y sonando.

- **Efectos:** 41 en total, entre el 30% y el 38%.
- **Voz:** sincronizada. La grabación dura 39,9 s y el video 48,5 s, así que se
  reparte frase por frase (ver `voiceover.phrases` en el config): se estiran las
  pausas, no el habla. Va +6 dB porque vino baja.
- **Música:** al 15% de punta a punta, con fade in de 1,5 s y fade out de 2,5 s.

La pista que está puesta dura 48 s pero tiene música sólo entre los **1,9 s y
los 42,1 s** (los bordes son su propia entrada suave y su cola de silencio). Por
eso el config la recorta y la repite, así no hay ni un segundo mudo:

```ts
music: {startFromSeconds: 2.1, useSeconds: 40, loop: true}
```

**Si cambiás la música por otra**, mirá dónde empieza y termina de verdad y
ajustá esos dos números. Si tu pista suena entera de principio a fin, poné
`startFromSeconds: 0` y `useSeconds: null`.

## Cómo se enganchan

En `src/config.ts`:

```ts
export const audio = {
  music:     {src: 'musica.mp3', enabled: 'auto', volume: 0.15, ...},
  voiceover: {src: 'voz.mp3',    enabled: 'auto', volume: 2, offsetSeconds: 0},
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
