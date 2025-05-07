import { PreferencesProps } from '~/services/preferences';

export type Locale = 'es-CO' | 'en-GB';

export const commonInputs: Record<string, string[]> = {
  config: ['configurar', 'settings', 'setup'],
  yes: ['yes', 'sí', 'yeah', 'ok', 'okay'],
  no: ['no', 'nope', 'no way', 'negative', 'no gracias'],
};

const translationMap: Record<Locale, Record<string, string>> = {
  'en-GB': {},
  'es-CO': {
    // conversation
    'enable the necessary permissions in the settings so truenavi can function properly':
      'abre los ajustes para activar los permisos necesarios para que truenavi funcione',
    "where are we headed?\nlet me know and i'll find the best route":
      '¿a dónde vamos hoy?\ndime y encontraré la mejor ruta para ti',
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
    'going to your destination': 'en camino a tu destino',
    'you should turn to the left': 'gira en dirección a la izquierda',
    'you should turn to the right': 'gira en dirección a la derecha',
    'turn slightly to the left': 'gira ligeramente a la izquierda',
    'turn slightly to the right': 'gira ligeramente a la derecha',
    'go straight': 'continúa recto',
    'your destination is here': 'has llegado a tu destino',
    'rain chance of': 'posibilidad de lluvia',
    'hold up, rerouting quickly': 'recalculando tu ruta rapidamente',
    percent: 'por ciento',
    meters: 'metros',
  },
};

export function getLocale(preferences: PreferencesProps): Locale {
  return preferences.spanish ? 'es-CO' : 'en-GB';
}

export function normalize(input: string) {
  return input.trim().toLowerCase();
}

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
