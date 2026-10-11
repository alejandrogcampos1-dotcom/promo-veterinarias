/**
 * "Beats" = en qué frame de cada escena pasa cada cosa.
 * Es la única fuente de verdad: las escenas animan con estos números y los
 * efectos de sonido (pop / whoosh / ding) se enganchan a los mismos.
 * Todos los valores son frames RELATIVOS al inicio de su escena.
 */

export const beats = {
  hook: {
    screenIn: 4,
    searchFocus: 16,
    typeStart: 22,
    /** Frames por letra tecleada. */
    typePerChar: 1.7,
    resultsStart: 76,
    resultEvery: 7,
  },

  punch: {
    /**
     * Los primeros 8 frames la escena queda clavada igual que el final de la
     * escena 1: es lo que dura el fundido entre las dos, y así el corte no
     * se ve (parece una sola toma con la cámara entrando).
     */
    pushStart: 8,
    pushFrames: 46,
    mapCollapseStart: 10,
    dimStart: 12,
    emptyCardIn: 26,
    shakeStart: 36,
    /** Cae un toque antes de que la voz diga "¿Y la tuya?", para anticiparla. */
    punchlineIn: 78,
    headlineIn: 8,
  },

  problem: {
    headlineIn: 4,
    inboxIn: 12,
    firstBubble: 28,
    bubbleEvery: 23,
    /**
     * Frame en el que el contador salta a cada número de
     * `scenes.problem.counters`. Van corridos unos frames respecto de las
     * burbujas para que el "pop" del contador no se superponga con el de
     * la burbuja y suene como un solo golpe.
     */
    counterSteps: [34, 86, 148],
    sublineIn: 150,
  },

  solution: {
    headlineIn: 8,
    screenIn: 14,
    buildStart: 30,
    buildEvery: 11,
    /** La landing "scrollea" sola hasta el final de la página. */
    panStart: 120,
    panFrames: 54,
  },

  benefits: {
    /** La primera tarjeta ya está puesta cuando arranca la escena, así la
     *  transición de entrada no muestra la pantalla vacía. */
    startOffset: 0,
    cardDuration: 90,
    /** Dentro de cada tarjeta: */
    titleIn: 6,
    visualIn: 16,
    checkAt: 58,
    /** Hasta cuándo se queda la tarjeta antes de salir. */
    outAt: 78,
  },

  beforeAfter: {
    framesIn: 4,
    labelsIn: 14,
    dividerStart: 26,
    dividerFrames: 62,
  },

  offer: {
    cardIn: 6,
    kickerIn: 16,
    countStart: 26,
    countFrames: 44,
    bulletsStart: 86,
    bulletEvery: 24,
    shineStart: 70,
  },

  cta: {
    /** Sin espera: la transición de entrada ya trae el botón puesto. */
    buttonIn: 0,
    subIn: 16,
    noteIn: 34,
    pawIn: 48,
    agencyIn: 60,
  },
} as const;
