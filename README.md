# Promo veterinarias — video vertical con Remotion

Video promocional **1080×1920, 30 fps, 48,5 segundos** para vender landings a
veterinarias y pet shops de Quilmes y GBA Sur. Pensado para mandar por
WhatsApp: engancha en los primeros 2 segundos y se entiende **sin sonido**
gracias a los subtítulos quemados. Lleva voz en off y efectos de sonido.

Está armado para **reusarlo en otros rubros** (barberías, gimnasios,
odontólogos) cambiando un solo archivo: `src/config.ts`.

---

## Arrancar

```bash
npm install
npm run studio     # editor visual de Remotion (http://localhost:3000)
npm run build      # renderiza out/promo-veterinarias.mp4
npm run stills     # un fotograma de cada escena en out/stills/
```

Otros comandos:

| Comando | Qué hace |
| --- | --- |
| `npm run stills -- --guides` | Stills con las zonas seguras dibujadas encima |
| `npm run stills -- --seg=5,23,39` | Stills de esos segundos, en `out/stills-seg/` |
| `npm run audio` | Solo la pista de audio, para revisar la mezcla rápido |
| `npm run typecheck` | Chequea tipos de TypeScript |
| `npm run fonts` | Vuelve a bajar las tipografías a `public/fonts/` |

En el Studio hay dos composiciones: **PromoVeterinarias** (la buena) y
**PromoVeterinariasGuias** (la misma, con las guías de zona segura encima).

---

## Las 3 cosas que vas a querer cambiar

Todo está en **`src/config.ts`**. No hace falta tocar nada más.

### 1. El precio

```ts
export const offer = {
  currency: 'USD',
  price: 150,     // ← el contador sube de 0 hasta acá
  priceFrom: 0,
  days: 7,        // ← "lista en 7 días"
};
```

El número de la escena 7 y los textos que dicen `{precio}` o `{dias}` se
actualizan solos.

### 2. El rubro y la zona

```ts
export const niche = {
  singular: 'veterinaria',
  plural: 'veterinarias',
  withArticle: 'la veterinaria',
  zone: 'Quilmes',
  searchQuery: 'veterinaria cerca de mí',
  demoBusiness: 'Veterinaria Patitas',
  demoAddress: 'Av. Mitre 1240',
  clientName: 'Toby',
  clientEmoji: '🐶',
  illustration: 'vet',
};
```

Para una barbería alcanza con:

```ts
singular: 'barbería', plural: 'barberías', withArticle: 'la barbería',
searchQuery: 'barbería cerca de mí', demoBusiness: 'Barbería Don Carlos',
clientName: 'Martín', clientEmoji: '✂️',
```

…y cambiar los servicios en `scenes.solution.services`.

**Cómo funciona:** cualquier texto puede llevar llaves que se reemplazan solas.
El uso de mayúsculas manda:

| Llave | Resultado |
| --- | --- |
| `{rubro}` | veterinaria |
| `{Rubro}` | Veterinaria |
| `{RUBRO}` | VETERINARIA |

Las disponibles son `{rubro} {rubros} {elRubro} {zona} {negocio} {direccion}
{mascota} {emoji} {busqueda} {agencia} {tagline} {telefono} {precio} {moneda}
{dias}`.

### 3. Los textos

Cada escena tiene su bloque dentro de `scenes`:

```ts
export const scenes = {
  hook:        {headline: 'Alguien está buscando una {rubro}…', results: [...]},
  punch:       {punchline: '¿Y la tuya?', ...},
  problem:     {messages: ['¿Atienden el sábado?', ...], counters: [12, 27, 48]},
  solution:    {services: [...], hours: [...]},
  benefits:    {cards: [{title, sub, kind}, ...]},
  beforeAfter: {...},
  offer:       {bullets: ['Lista en {dias} días', ...]},
  cta:         {button: 'Respondé este mensaje', sub: '...**demo gratis**...'},
};
```

Lo que va entre `**dobles asteriscos**` se pinta en color de acento.

Tu marca y tu contacto:

```ts
export const brand = {
  agency: 'Campos Studio',           // ← tu nombre
  tagline: 'Webs que traen clientes',
  phone: '+54 9 11 2345-6789',       // ← tu número
  phoneLabel: 'Escribime al',
};
```

---

## Tus fotos, tu música y tu voz

Todo va en `public/` (ver `public/LEEME.md`). **Si falta un archivo, el video
renderiza igual**, sin errores: se usan las ilustraciones vectoriales y el
audio no suena.

### Fotos

Dejá el archivo en `public/fotos/` y escribí la ruta en `media`:

```ts
export const media = {
  heroPhoto:   'fotos/perro.jpg',   // foto principal de la landing
  logoPhoto:   'fotos/logo.png',    // logo del negocio (se recorta en círculo)
  beforePhoto: null,
  afterPhoto:  null,
};
```

`null` = se dibuja la ilustración vectorial (perro, gato, huellitas).

### Música y voz en off

```
public/musica.mp3     → fondo, volumen 0,15, con fade in y fade out
public/voz.mp3        → voz en off
```

Se detectan solos. Si pusiste el archivo y no suena, forzalo:

```ts
music: {src: 'musica.mp3', enabled: true, volume: 0.15, ...}
```

La música **se repite sola** si la pista es más corta que el video
(`music.loop`), y el fade in de 1,5 s y el fade out de 2,5 s se aplican una
sola vez sobre el total, no en cada repetición. Para revisar la mezcla sin
esperar el render de los 1443 frames:

```bash
npm run audio        # → out/promo-veterinarias.wav
```

### Efectos de sonido

Ya están puestos y mezclados: **41 efectos** repartidos en las 8 escenas.

```ts
sfx: {
  volume: 0.38,          // volumen general
  duckUnderVoice: 0.55,  // un efecto que cae sobre una frase baja al 55%
  sounds: {
    pop:    {src: 'sfx/pop.mp3',    gain: 1},    // entrada de tarjetas
    whoosh: {src: 'sfx/whoosh.mp3', gain: 0.8},  // transiciones
    ding:   {src: 'sfx/ding.mp3',   gain: 0.9},  // checks verdes
  },
}
```

| Efecto | Dónde suena | Veces |
| --- | --- | --- |
| `whoosh` | los 7 cortes entre escenas, el golpe de "¿Y la tuya?" y el divisor del antes/después | 9 |
| `pop` | resultados del buscador, burbujas de mensajes, saltos del contador, bloques de la landing, entrada de tarjetas | 21 |
| `ding` | los 4 checks verdes de beneficios, los 4 de la oferta y el cierre | 11 |

Los tres archivos están emparejados a **−20 LUFS**, así que suenan todos igual
de fuerte. Con `volume: 0.38` y los retoques por cue, cada efecto queda entre
el **30% y el 38%** — dentro del rango pedido y con el pico de toda la pista en
−6,9 dBFS, que deja aire de sobra para la voz.

**Ducking:** si un efecto cae justo encima de una frase de la voz en off, baja
solo al 55%. Las frases salen de `subtitles.cues`, así que si reajustás los
subtítulos el ducking se reacomoda solo. Solo se aplica cuando la voz está
activada.

En `public/sfx/` hay además una variante de cada uno: `pop-alt.mp3` (golpe más
grave), `whoosh-alt.mp3` (swish tonal) y `ding-alt.mp3` (tono más grave). Para
probarlas, cambiá el `src` en el bloque de arriba.

Dos reglas automáticas evitan que la mezcla se amontone: un `pop` que caiga a
menos de 3 frames de un `whoosh` se descarta, y los saltos del contador van
corridos unos frames respecto de las burbujas.

Las posiciones salen de `src/sfxCues.ts`, que lee los mismos `beats.ts` que
usan las animaciones: si movés una animación, el sonido la sigue.

### La voz en off, frase por frase

La grabación dura **39,9 s** y el video **48,5 s**, así que en vez de tirarla
de corrido se reparte frase por frase: cada una se recorta del mp3 y se planta
en el momento de su escena. **Lo único que se estira son las pausas; el habla
no se toca.**

```ts
voiceover: {
  volume: 2,              // +6 dB: la grabación vino baja (−25,3 LUFS)
  phrases: [
    // at = segundo del VIDEO · from/to = tramo del MP3
    {at: 0.30, from: 0.00, to: 3.43, nota: 'Ahora mismo, alguien en Quilmes…'},
    {at: 4.08, from: 3.65, to: 6.37, nota: 'Y encuentra a la de la otra cuadra.'},
    ...
  ],
}
```

Para mover una frase, cambiás su `at` (y el `from`/`to` del cue que le
corresponde en `subtitles.cues`, que va en el mismo orden). Si vaciás
`phrases`, la voz se reproduce de corrido desde el segundo 0.

Los 15 tramos del mp3 se midieron con detección de silencios y se asignaron a
cada frase contando núcleos silábicos del audio y comparándolos con el guion:
las 14 frases quedan entre 4,4 y 7,4 sílabas por segundo, que es el rango
normal del castellano hablado.

### Sincronizar los subtítulos con tu voz

Los tiempos están **en segundos** en `subtitles.cues`, uno por frase y en el
mismo orden que `voiceover.phrases`:

```ts
export const subtitles = {
  offsetSeconds: 0,   // corré TODO de una (si la voz entra tarde, subilo)
  fontSize: 52,
  cues: [
    {from: 0.25, to: 3.8, text: 'Ahora mismo alguien en {zona}…', highlight: '{zona}'},
    ...
  ],
};
```

- `from` / `to`: cuándo entra y sale cada frase.
- `highlight`: la palabra o frase que se pinta en coral (compara sin tildes ni
  signos, así que `la mitad` matchea con `…la mitad.`).
- Las palabras aparecen de a una, repartidas en la primera mitad del cue.

Si la voz grabada te queda corrida unas décimas, tocá `offsetSeconds` y listo
(mueve la voz y los subtítulos juntos). Si queda corrida solo en una parte,
ajustá el `at` de esa frase y el `from`/`to` de su cue.

Los textos largos se achican solos para no pasar de dos renglones dentro de la
franja (`subtitles.shrinkOver`), así nunca empujan el contenido de la escena.

---

## Cómo está armado

```
src/
├── config.ts          ← TODO lo editable (marca, rubro, precio, textos, colores)
├── beats.ts           ← en qué frame pasa cada cosa dentro de cada escena
├── timeline.ts        ← duración total, inicio de cada escena, zona segura
├── text.ts            ← reemplazo de {llaves} y resaltado de palabras
├── fonts.ts           ← carga de tipografías
├── sfxCues.ts         ← cuándo suena cada efecto (sale de beats.ts)
├── PromoVeterinarias.tsx  ← encadena las escenas con <TransitionSeries>
├── Root.tsx
├── scenes/            ← una escena por archivo
│   ├── Scene1Hook.tsx        5. Scene5Benefits.tsx
│   ├── Scene2Punch.tsx       6. Scene6BeforeAfter.tsx
│   ├── Scene3Problem.tsx     7. Scene7Offer.tsx
│   └── Scene4Solution.tsx    8. Scene8Cta.tsx
├── components/        ← celular, landing, buscador, chat, mapa, íconos, perro…
└── transitions/       ← el "barrido coral" hecho a mano
```

### Tiempos

| # | Escena | Entra | Corte | Transición de salida |
| --- | --- | --- | --- | --- |
| 1 | Gancho | 0,00 s | 4,00 s | fundido |
| 2 | El golpe | 3,87 s | 7,98 s | barrido diagonal |
| 3 | El problema | 7,73 s | 14,98 s | **barrido coral** |
| 4 | La solución | 14,73 s | 19,48 s | sube |
| 5 | Beneficios | 19,23 s | 31,48 s | entra de costado |
| 6 | Antes / Después | 31,23 s | 35,48 s | barrido circular |
| 7 | Oferta y precio | 35,23 s | 42,48 s | sube |
| 8 | Llamado a la acción | 42,23 s | 48,53 s | — |

Dos escenas se salen del molde por la voz: la 8 es más larga (189 frames)
para que entre la última frase sin apurarla, y la 4 más corta (150) porque si
no quedaba un silencio de 3 segundos antes de los beneficios.

**El total son 1456 frames, y que sea múltiplo de 16 no es casualidad.** A
30 fps y 48 kHz, cada 16 frames entran exactamente 25 paquetes de audio AAC.
Con cualquier otro largo el audio termina unos milisegundos después que la
última imagen, y en ese tramo sin video el reproductor muestra **un frame
negro**. Si cambiás duraciones de escena, tratá de que el total siga siendo
múltiplo de 16; `npm run build` avisa y lo corrige si puede.

Las escenas se superponen porque las transiciones comen frames de las dos. Si
cambiás una duración en `scenes.*.durationInFrames`, el total y los cortes se
recalculan solos (`npm run stills` te imprime la tabla actualizada).

### Decisiones de diseño

- **Zona segura:** 80 px a los costados y 200 px arriba y abajo. Nada
  importante entra ahí. Los subtítulos van en una franja fija encima del
  margen de abajo. Para verlo: `npm run stills -- --guides` o la composición
  `PromoVeterinariasGuias`.
- **Sin logos ni marcas:** lupa para el buscador, burbuja verde para mensajes,
  cámara para redes. Todo dibujado a mano en SVG. Los nombres de veterinarias
  son inventados.
- **Tipografías locales:** Plus Jakarta Sans (títulos, 800) e Inter (textos)
  viven en `public/fonts/`. Se bajaron del paquete `@remotion/google-fonts`
  con `npm run fonts`, pero se sirven desde el proyecto para que el render no
  dependa de internet y salga igual en cualquier máquina. Si preferís
  cargarlas desde la CDN de Google, `src/fonts.ts` tiene el bloque alternativo
  comentado.
- **Ritmo:** hay un cambio visual cada 1,5–3 segundos. Nada queda quieto más
  de 3 segundos (hasta la landing terminada tiene un empuje de cámara lento).

---

## Render

```bash
npm run build
# → out/promo-veterinarias.mp4   (H.264, 1080×1920, 30 fps, 48,53 s, ~12 MB)
```

Después de renderizar, `scripts/finish-render.mjs` hace dos chequeos y los
imprime: **qué archivos de audio encontró en `public/` y cuáles faltan** (si
falta la música, lo dice con todas las letras), y que el video y el audio
terminen en el mismo milisegundo, para que el último frame sea el del cierre
y no uno negro.

Si el render no encuentra Chrome, Remotion se baja el suyo solo la primera
vez. Para apuntarlo a uno ya instalado:

```bash
REMOTION_BROWSER_EXECUTABLE=/ruta/al/chrome npm run build
```
