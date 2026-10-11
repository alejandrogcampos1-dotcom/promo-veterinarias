import {brand, niche, offer} from './config';

/**
 * Diccionario de plantillas. Cualquier texto del config puede usar {llaves}.
 * Si la llave va en MAYÚSCULAS ({RUBROS}), el resultado se pasa a mayúsculas.
 */
const dictionary: Record<string, string> = {
  rubro: niche.singular,
  rubros: niche.plural,
  elrubro: niche.withArticle,
  zona: niche.zone,
  negocio: niche.demoBusiness,
  negociocorto: niche.demoBusinessShort,
  direccion: niche.demoAddress,
  mascota: niche.clientName,
  emoji: niche.clientEmoji,
  busqueda: niche.searchQuery,
  agencia: brand.agency,
  tagline: brand.tagline,
  telefono: brand.phone,
  precio: String(offer.price),
  moneda: offer.currency,
  dias: String(offer.days),
};

/**
 * Reemplaza las {llaves} de un texto por su valor del config.
 * El uso de mayúsculas en la llave manda:
 *   {rubro} → veterinaria   ·   {Rubro} → Veterinaria   ·   {RUBRO} → VETERINARIA
 */
export const t = (input: string): string =>
  input.replace(/\{([A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)\}/g, (full, rawKey: string) => {
    const value = dictionary[rawKey.toLowerCase()];
    if (value === undefined) {
      return full;
    }
    const hasUpper = /[A-ZÁÉÍÓÚÜÑ]/.test(rawKey);
    if (!hasUpper) {
      return value;
    }
    if (rawKey === rawKey.toLocaleUpperCase('es-AR')) {
      return value.toLocaleUpperCase('es-AR');
    }
    return value.charAt(0).toLocaleUpperCase('es-AR') + value.slice(1);
  });

/** Separa un texto en palabras ya resueltas, listo para animar una por una. */
export const words = (input: string): string[] => t(input).split(/\s+/).filter(Boolean);

/**
 * Parte un texto marcado con **asteriscos** en tramos normales y resaltados.
 * "Te armo una **demo gratis**" → [{text:'Te armo una ',strong:false},{text:'demo gratis',strong:true}]
 */
export const parseStrong = (input: string): {text: string; strong: boolean}[] => {
  const resolved = t(input);
  const out: {text: string; strong: boolean}[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(resolved)) !== null) {
    if (match.index > last) {
      out.push({text: resolved.slice(last, match.index), strong: false});
    }
    out.push({text: match[1], strong: true});
    last = match.index + match[0].length;
  }
  if (last < resolved.length) {
    out.push({text: resolved.slice(last), strong: false});
  }
  return out.length > 0 ? out : [{text: resolved, strong: false}];
};

/**
 * Marca qué palabras de un subtítulo van resaltadas en coral.
 * Compara sin tildes, sin signos y sin distinguir mayúsculas, así
 * "la otra cuadra" matchea con "…la otra cuadra." sin pelearse.
 */
export const highlightMask = (text: string, highlight: string): boolean[] => {
  const all = words(text);
  const target = words(highlight);
  const mask = all.map(() => false);
  if (target.length === 0) {
    return mask;
  }
  const clean = (w: string) =>
    w
      .toLocaleLowerCase('es-AR')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]/g, '');
  const haystack = all.map(clean);
  const needle = target.map(clean);
  for (let i = 0; i + needle.length <= haystack.length; i++) {
    let hit = true;
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) {
        hit = false;
        break;
      }
    }
    if (hit) {
      for (let j = 0; j < needle.length; j++) {
        mask[i + j] = true;
      }
      return mask;
    }
  }
  return mask;
};

/** Formatea un número con separador de miles al estilo argentino. */
export const formatNumber = (n: number): string =>
  Math.round(n).toLocaleString('es-AR', {maximumFractionDigits: 0});
