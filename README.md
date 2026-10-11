# Promo veterinarias — video vertical con Remotion

Video promocional **1080×1920, 30 fps, 48 segundos** para vender landings a
veterinarias y pet shops de Quilmes y GBA Sur. Pensado para mandar por
WhatsApp: engancha en los primeros 2 segundos y se entiende **sin sonido**
gracias a los subtítulos quemados.

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
public/sfx/pop.mp3    → entrada de tarjetas
public/sfx/whoosh.mp3 → transiciones
public/sfx/ding.mp3   → checks verdes
```

Se detectan solos. Si pusiste el archivo y no suena, forzalo:

```ts
music: {src: 'musica.mp3', enabled: true, volume: 0.15, ...}
```

### Sincronizar los subtítulos con tu voz

Los tiempos están **en segundos** en `subtitles.cues`:

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

Si la voz grabada te queda corrida unas décimas, tocá `offsetSeconds` y listo.
Si queda corrida solo en una parte, ajustá los `from`/`to` de esos cues.

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
| 4 | La solución | 14,73 s | 20,98 s | sube |
| 5 | Beneficios | 20,73 s | 32,98 s | entra de costado |
| 6 | Antes / Después | 32,73 s | 36,98 s | barrido circular |
| 7 | Oferta y precio | 36,73 s | 43,98 s | sube |
| 8 | Llamado a la acción | 43,73 s | 48,00 s | — |

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
# → out/promo-veterinarias.mp4   (H.264, 1080×1920, 30 fps, ~48 s, ~12 MB)
```

Si el render no encuentra Chrome, Remotion se baja el suyo solo la primera
vez. Para apuntarlo a uno ya instalado:

```bash
REMOTION_BROWSER_EXECUTABLE=/ruta/al/chrome npm run build
```
