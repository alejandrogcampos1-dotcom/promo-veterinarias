/* ──────────────────────────────────────────────────────────────────────────────
 *
 *   config.ts  —  EL ÚNICO ARCHIVO QUE NECESITÁS TOCAR
 *
 *   Todo lo editable del video vive acá: marca, rubro, zona, precio, textos de
 *   cada escena, colores, subtítulos, audio y márgenes.
 *
 *   ─── PLANTILLAS DE TEXTO ───
 *   Dentro de cualquier texto podés usar estas llaves y se reemplazan solas.
 *   Así cambiás de rubro (barbería, gimnasio, odontólogo) tocando `niche`:
 *
 *     {rubro}     → niche.singular            ej: "veterinaria"
 *     {rubros}    → niche.plural              ej: "veterinarias"
 *     {elRubro}   → niche.withArticle         ej: "la veterinaria"
 *     {zona}      → niche.zone                ej: "Quilmes"
 *     {negocio}   → niche.demoBusiness        ej: "Veterinaria Patitas"
 *     {mascota}   → niche.clientName          ej: "Toby"
 *     {busqueda}  → niche.searchQuery         ej: "veterinaria cerca de mí"
 *     {agencia}   → brand.agency
 *     {precio}    → offer.price               ej: "150"
 *     {moneda}    → offer.currency            ej: "USD"
 *     {dias}      → offer.days                ej: "7"
 *
 * ────────────────────────────────────────────────────────────────────────────── */

// ═══════════════════════════════════════════════════════════════════════════
//  1. VIDEO
// ═══════════════════════════════════════════════════════════════════════════

export const video = {
  width: 1080,
  height: 1920,
  fps: 30,
};

// ═══════════════════════════════════════════════════════════════════════════
//  2. MARCA / AGENCIA
// ═══════════════════════════════════════════════════════════════════════════

export const brand = {
  agency: 'Campos Studio', // ← tu nombre o el de tu estudio
  tagline: 'Webs que traen clientes',
  phone: '+54 9 11 2345-6789', // ← tu número de contacto
  phoneLabel: 'Escribime al', // texto chico antes del número
};

// ═══════════════════════════════════════════════════════════════════════════
//  3. RUBRO Y ZONA  (cambiá esto y el video entero se adapta)
// ═══════════════════════════════════════════════════════════════════════════

export const niche = {
  singular: 'veterinaria',
  plural: 'veterinarias',
  withArticle: 'la veterinaria',
  zone: 'Quilmes',
  searchQuery: 'veterinaria cerca de mí',
  /** Negocio inventado que se usa como ejemplo en pantalla. */
  demoBusiness: 'Veterinaria Patitas',
  demoBusinessShort: 'Patitas',
  demoAddress: 'Av. Mitre 1240',
  /** Nombre que aparece en el mensaje de WhatsApp de ejemplo. */
  clientName: 'Toby',
  clientEmoji: '🐶',
  /** 'vet' dibuja perro/gato/huellitas. 'neutral' usa formas abstractas. */
  illustration: 'vet' as 'vet' | 'neutral',
};

// ═══════════════════════════════════════════════════════════════════════════
//  4. OFERTA Y PRECIO
// ═══════════════════════════════════════════════════════════════════════════

export const offer = {
  currency: 'USD',
  price: 150,
  /** El contador del precio arranca acá y sube hasta `price`. */
  priceFrom: 0,
  days: 7,
};

// ═══════════════════════════════════════════════════════════════════════════
//  5. COLORES
// ═══════════════════════════════════════════════════════════════════════════

export const colors = {
  // --- Paleta principal ---
  cream: '#FFF8F0', // fondo
  teal: '#0F766E', // principal
  coral: '#FF6B4A', // acento
  ink: '#1E293B', // texto oscuro
  success: '#22C55E', // checks y botón de contacto

  // --- Derivados (se calculan a ojo a partir de los de arriba) ---
  white: '#FFFFFF',
  tealDark: '#0A5650',
  tealSoft: '#D6EDE9',
  coralSoft: '#FFE4DB',
  successSoft: '#DCFCE7',
  inkSoft: '#64748B',
  inkFaint: '#94A3B8',
  line: '#E6E0D7',
  grey: '#CBD5E1',
  greyDeep: '#8A94A6',
  greyFlat: '#B6BECC',

  // --- Tonos de las ilustraciones (perro, gato, huellitas) ---
  petFur: '#F0BE93',
  petFurDark: '#DCA471',
  petSnout: '#FFF1E2',
  catFur: '#A9B7C4',
  catFurDark: '#8D9CAA',
};

// ═══════════════════════════════════════════════════════════════════════════
//  6. MÁRGENES DE SEGURIDAD Y AYUDAS VISUALES
// ═══════════════════════════════════════════════════════════════════════════

export const layout = {
  /** WhatsApp / Instagram tapan los costados y las puntas. */
  safeX: 80,
  safeTop: 200,
  safeBottom: 200,
  /** Franja de subtítulos (termina 30px antes de la zona insegura de abajo). */
  subtitleBandHeight: 200,
  /** Barra fina de progreso abajo. */
  showProgressBar: true,
  /** true dibuja las guías de zona segura encima del video (para chequear). */
  showGuides: false,
};

// ═══════════════════════════════════════════════════════════════════════════
//  7. TRANSICIONES ENTRE ESCENAS  (7 en total, una por cada corte)
// ═══════════════════════════════════════════════════════════════════════════

export type TransitionKind =
  | 'fade'
  | 'slideUp'
  | 'slideLeft'
  | 'coralWipe'
  | 'wipeDiagonal'
  | 'clockWipe'
  | 'iris';

export const transitions: {kind: TransitionKind; durationInFrames: number}[] = [
  {kind: 'fade', durationInFrames: 8}, // 1 → 2  (corte casi invisible: la cámara sigue)
  {kind: 'wipeDiagonal', durationInFrames: 15}, // 2 → 3
  {kind: 'coralWipe', durationInFrames: 15}, // 3 → 4  "barrido coral"
  {kind: 'slideUp', durationInFrames: 15}, // 4 → 5
  {kind: 'slideLeft', durationInFrames: 15}, // 5 → 6
  {kind: 'clockWipe', durationInFrames: 15}, // 6 → 7
  {kind: 'slideUp', durationInFrames: 15}, // 7 → 8
];

// ═══════════════════════════════════════════════════════════════════════════
//  8. ESCENAS  (duración en frames; 30 frames = 1 segundo)
// ═══════════════════════════════════════════════════════════════════════════

export const scenes = {
  // ── Escena 1 · Gancho (0:00 – 0:04) ────────────────────────────────────
  hook: {
    durationInFrames: 124,
    kicker: 'AHORA MISMO',
    headline: 'Alguien está buscando una {rubro}…',
    searchPlaceholder: 'Buscar',
    /** Resultados inventados que aparecen en el buscador. */
    results: [
      {name: 'Vet San Francisco', rating: 4.8, reviews: 212, distance: '350 m'},
      {name: 'Clínica Pet Zone', rating: 4.6, reviews: 158, distance: '600 m'},
      {name: '{Rubro} Huellitas', rating: 4.9, reviews: 97, distance: '1,1 km'},
    ],
  },

  // ── Escena 2 · El golpe (0:04 – 0:08) ──────────────────────────────────
  punch: {
    durationInFrames: 131,
    headline: '…y encuentra a la de la otra cuadra.',
    punchline: '¿Y la tuya?',
    emptyCardLabel: 'Tu {rubro}',
    emptyCardHint: 'sin resultados',
  },

  // ── Escena 3 · El problema (0:08 – 0:15) ───────────────────────────────
  problem: {
    durationInFrames: 225,
    headline: 'Respondés lo mismo todo el día…',
    subline: '…y los turnos se pierden.',
    inboxTitle: 'Mensajes',
    messages: [
      '¿Atienden el sábado?',
      '¿Cuánto sale la vacuna?',
      '¿Dónde quedan?',
      '¿Tienen guardia?',
      '¿Atienden sin turno?',
      '¿Hacen peluquería?',
    ],
    /** El contador de "sin leer" va pasando por estos números. */
    counters: [12, 27, 48],
    counterLabel: 'sin leer',
  },

  // ── Escena 4 · La solución (0:15 – 0:21) ───────────────────────────────
  solution: {
    durationInFrames: 195,
    headline: 'Tu {rubro}, con web propia.',
    ctaButton: 'Pedir turno',
    services: ['Consultas', 'Vacunas', 'Peluquería', 'Urgencias'],
    hours: [
      {day: 'Lun a Vie', time: '9 a 20 h'},
      {day: 'Sábados', time: '9 a 14 h'},
      {day: 'Urgencias', time: '24 h'},
    ],
    mapLabel: '{negocio} · {zona}',
  },

  // ── Escena 5 · Beneficios (0:21 – 0:33) ────────────────────────────────
  benefits: {
    durationInFrames: 375,
    /** 4 tarjetas, ~3 segundos cada una. `kind` elige la animación de adentro. */
    cards: [
      {
        kind: 'search' as const,
        title: 'Aparecés cuando te buscan',
        sub: 'Primera en el buscador, no en la página 3',
      },
      {
        kind: 'chat' as const,
        title: 'Turnos por WhatsApp',
        sub: 'En un toque, sin llamados ni idas y vueltas',
      },
      {
        kind: 'map' as const,
        title: 'Horarios y ubicación',
        sub: 'Servicios, dirección y mapa siempre a mano',
      },
      {
        kind: 'stars' as const,
        title: 'Imagen profesional',
        sub: 'La confianza empieza antes de que entren',
      },
    ],
    /** Mensaje de ejemplo del chat (tarjeta 2). */
    chatMessage: 'Hola, quiero un turno para {mascota} {emoji}',
    chatReply: '¡Hola! Te espero mañana 10 h 👋',
  },

  // ── Escena 6 · Antes / Después (0:33 – 0:37) ───────────────────────────
  beforeAfter: {
    durationInFrames: 135,
    headline: 'Antes / Después',
    beforeLabel: 'ANTES',
    afterLabel: 'DESPUÉS',
    beforeCaption: 'Solo redes',
    afterCaption: 'Web propia',
    /** Lo que le falta al perfil de redes (se muestra del lado "antes"). */
    beforeBullets: ['Sin horarios', 'Sin turnos', 'Sin mapa'],
  },

  // ── Escena 7 · Oferta y precio (0:37 – 0:44) ───────────────────────────
  offer: {
    durationInFrames: 225,
    kicker: 'PARA {RUBROS} DE {ZONA}',
    priceLabel: 'Tu web desde',
    bullets: [
      'Lista en {dias} días',
      'Dominio propio',
      'Botón de WhatsApp y mapa',
      'Pagás 50% al empezar y 50% al entregar',
    ],
  },

  // ── Escena 8 · Llamado a la acción (0:44 – 0:48) ───────────────────────
  cta: {
    durationInFrames: 128,
    button: 'Respondé este mensaje',
    sub: 'Te armo una **demo gratis** con tu {rubro}',
    note: 'Sin compromiso',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
//  9. SUBTÍTULOS QUEMADOS
//     `from` y `to` están en SEGUNDOS: ajustalos cuando tengas la voz grabada.
//     `highlight` es la palabra (o frase) que se pinta en coral.
// ═══════════════════════════════════════════════════════════════════════════

export const subtitles = {
  /** Corrimiento global en segundos. Si la voz entra tarde, subí este número. */
  offsetSeconds: 0,
  fontSize: 52,
  cues: [
    // Escena 1
    {from: 0.25, to: 3.8, text: 'Ahora mismo alguien en {zona} está buscando una {rubro}', highlight: '{zona}'},
    // Escena 2
    {from: 4.15, to: 6.3, text: 'Y encuentra a la de la otra cuadra', highlight: 'la otra cuadra'},
    {from: 6.5, to: 7.9, text: '¿Y la tuya?', highlight: 'tuya?'},
    // Escena 3
    {from: 8.3, to: 11.3, text: 'Solo con redes respondés lo mismo todo el día', highlight: 'lo mismo'},
    {from: 11.5, to: 14.8, text: 'y los turnos se te pierden entre los mensajes', highlight: 'se te pierden'},
    // Escena 4
    {from: 15.3, to: 19.6, text: 'Con una web propia todo eso se ordena solo', highlight: 'web propia'},
    // Escena 5
    {from: 21.2, to: 23.9, text: 'Aparecés cuando te buscan', highlight: 'cuando te buscan'},
    {from: 24.3, to: 27.0, text: 'Te piden turno por WhatsApp en un toque', highlight: 'en un toque'},
    {from: 27.4, to: 30.1, text: 'Tus horarios y tu ubicación siempre a mano', highlight: 'siempre a mano'},
    {from: 30.5, to: 32.6, text: 'Y una imagen que da confianza', highlight: 'confianza'},
    // Escena 6
    {from: 33.4, to: 36.4, text: 'La diferencia se nota al toque', highlight: 'al toque'},
    // Escena 7
    {from: 37.3, to: 41.0, text: 'Tu web lista en {dias} días, desde {precio} dólares', highlight: '{dias} días'},
    {from: 41.2, to: 43.6, text: 'Pagás la mitad al empezar y la mitad al entregar', highlight: 'la mitad'},
    // Escena 8
    {from: 44.2, to: 46.5, text: 'Respondé este mensaje y te armo una demo gratis', highlight: 'demo gratis'},
    {from: 46.7, to: 47.8, text: 'Sin compromiso', highlight: 'Sin compromiso'},
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
//  10. AUDIO
//      Los archivos van en public/. Si no existen, el video renderiza igual.
//      enabled: 'auto' → se usa el archivo solo si está. true/false fuerza.
// ═══════════════════════════════════════════════════════════════════════════

export const audio = {
  music: {
    src: 'musica.mp3',
    enabled: 'auto' as 'auto' | boolean,
    volume: 0.15,
    fadeInSeconds: 1.5,
    fadeOutSeconds: 2.5,
    /** Desde qué segundo del mp3 arrancar. */
    startFromSeconds: 0,
  },
  voiceover: {
    src: 'voz.mp3',
    /**
     * ⚠️ En false a propósito: la voz grabada dura 39,9 s y el video 48 s,
     * así que todavía no coincide con los subtítulos ni con las escenas.
     * Ponelo en 'auto' cuando los tiempos estén ajustados.
     */
    enabled: false as 'auto' | boolean,
    volume: 1,
    /** Si la voz arranca corrida, movela con esto (en segundos, puede ser negativo). */
    offsetSeconds: 0,
  },
  sfx: {
    enabled: 'auto' as 'auto' | boolean,
    /** Volumen general de los efectos. 0,38 = 38% del volumen del archivo. */
    volume: 0.38,
    /**
     * Cuánto baja un efecto que cae justo encima de una frase de la voz en off
     * (0,55 = al 55%). Solo se aplica si la voz está activada. 1 = no baja.
     */
    duckUnderVoice: 0.55,
    sounds: {
      // Los tres están emparejados a -20 LUFS, así que suenan todos igual de
      // fuerte. `gain` es el retoque fino de cada uno dentro de la mezcla.
      pop: {src: 'sfx/pop.mp3', gain: 1}, // entrada de tarjetas
      whoosh: {src: 'sfx/whoosh.mp3', gain: 0.8}, // transiciones
      ding: {src: 'sfx/ding.mp3', gain: 0.9}, // checks verdes
    },
    /**
     * En public/sfx/ hay una variante de cada uno: pop-alt.mp3 (golpe grave),
     * whoosh-alt.mp3 (swish tonal) y ding-alt.mp3 (tono grave).
     * Para probarlas, cambiá el `src` de arriba.
     */
  },
};

// ═══════════════════════════════════════════════════════════════════════════
//  11. TUS FOTOS (opcional)
//      Poné los archivos en public/ y escribí la ruta acá.
//      null = se usa la ilustración vectorial que ya viene hecha.
// ═══════════════════════════════════════════════════════════════════════════

export const media = {
  /** Foto principal de la landing (escenas 4, 5 y 6). Ej: 'fotos/perro.jpg' */
  heroPhoto: null as string | null,
  /** Logo del negocio, se recorta en círculo. Ej: 'fotos/logo.png' */
  logoPhoto: null as string | null,
  /** Captura del perfil de red social, para el "antes". */
  beforePhoto: null as string | null,
  /** Captura de la web, para el "después". */
  afterPhoto: null as string | null,
};
