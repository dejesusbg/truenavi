export type Locale = 'es-CO' | 'en-GB';
export * from '~/utils/text/commonInputs';

const translationMap: Record<Locale, Record<string, string>> = {
  'en-GB': {},
  'es-CO': {
    // conversation
    'enable the necessary permissions in the settings so truenavi can function properly':
      'abre los ajustes para activar los permisos necesarios para que truenavi funcione',
    "where are we headed?\nlet me know and i'll find the best route":
      '¿a dónde vamos hoy?\ndime y encontraré la mejor ruta para ti',
    'no valid route,\nplease choose a different destination':
      'ruta no encontrada,\npor favor elige un destino distinto',
    'calculating your route and starting navigation now':
      'calculando tu ruta e iniciando la navegación ahora',
    "let's set up the app,\nwould you like to switch to spanish?":
      'vamos a configurar la app\n¿desearías mantener el idioma en español?',
    'language set,\ndo you want to know the weather before navigating?':
      'idioma configurado\n¿quieres saber el clima antes de navegar?',
    'weather updates set,\nwould you like haptic feedback for alerts?':
      'clima configurado\n¿te gustaría recibir vibraciones para alertas?',
    "sorry, i didn't catch that,\ncould you try saying it again?":
      'lo siento, no entendí eso\n¿puedes intentarlo de nuevo?',

    // settings
    'terms and conditions': 'terminos y condiciones',
    'data policy': 'política de datos',
    'erase all data': 'borrar datos',
    'switch to spanish': 'cambiar a español',
    'show weather': 'mostrar clima',
    vibration: 'vibración',

    // layout
    waiting: 'esperando',
    listen: 'escucha',
    settings: 'ajustes',
    navigation: 'navegación',
    speak: 'habla',

    // navigation
    'starting from': 'empezando desde',
    'going to': 'en camino a',
    'please, turn to the left': 'haz un giro a la izquierda',
    'please, turn to the right': 'haz un giro a la derecha',
    'turn slightly to the left': 'gira ligeramente a la izquierda',
    'turn slightly to the right': 'gira ligeramente a la derecha',
    'make a sharp left turn': 'gira bruscamente a la izquierda',
    'make a sharp right turn': 'gira bruscamente a la derecha',
    'please, make a u-turn': 'haz un giro en forma de u',
    'go straight': 'continúa recto',
    'current temperature': 'temperatura actual',
    'rain chance of': 'posibilidad de lluvia',
    'hold up, rerouting quickly': 'recalculando tu ruta rapidamente',
    'you have arrived to': 'has llegado a',
    celsius: 'grados',
    percent: 'por ciento',
    meters: 'metros',
  },
};

/**
 * Normalizes a string by trimming whitespace from both ends and converting all characters to lowercase.
 *
 * @param input - The string to normalize.
 * @returns The normalized string.
 */
export function normalize(input: string) {
  return input.trim().toLowerCase();
}

/**
 * Translates a given sentence into the specified locale using a translation map.
 *
 * If a direct translation for the entire sentence exists, it returns that translation.
 * Otherwise, it attempts to translate each word individually and reconstructs the sentence.
 * If no translation is found for a word or the sentence, the original text is returned.
 *
 * @param sentence - The sentence to translate.
 * @param locale - The target locale for translation.
 * @returns The translated sentence, or the original sentence if no translation is found.
 */
export default function translate(sentence: string, locale: Locale): string {
  const translations = translationMap[locale];
  if (!translations) return sentence;

  const directMatch = translations[normalize(sentence)];
  if (directMatch) return directMatch;

  return sentence
    .split(' ')
    .map((word) => translations[normalize(word)] || word)
    .join(' ');
}
