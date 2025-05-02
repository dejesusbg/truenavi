import { normalize } from '~/utils/conversation';

type Languages = 'ES-es' | 'EN-en';
type LanguagesMap = { [L in Languages]: { [key: string]: string } };

export const defaultLanguage = 'EN-en';

const translationMap: LanguagesMap = {
  'EN-en': {},
  'ES-es': {
    'enable the necessary permissions in the settings so truenavi can function properly':
      'abre los ajustes para activar los permisos necesarios para que truenavi funcione',

    "where are we headed?\nlet me know and i'll find the best route":
      '¿a dónde vamos hoy?\ndime y encontraré la mejor ruta para ti',

    'calculating your route and starting navigation now':
      'calculando tu ruta e iniciando la navegación ahora',

    "let's set up the app,\nwould you like to switch to spanish?":
      'vamos a configurar la app\n¿desearías cambiar el idioma a inglés?',

    'language set,\ndo you want to know the weather before navigating?':
      'idioma configurado\n¿quieres saber el clima antes de navegar?',

    'weather updates set,\nwould you like haptic feedback for alerts?':
      'clima configurado\n¿te gustaría recibir vibraciones para alertas?',

    "sorry, i didn't catch that,\ncould you try saying it again?":
      'lo siento, no entendí eso\n¿puedes intentarlo de nuevo?',

    'set language to spanish': 'establecer idioma a español',

    'turn on alerts vibration': 'activar vibración',

    'show weather': 'ver pronóstico del clima',

    'terms and conditions': 'terminos y condiciones',

    'data policy': 'política de datos',

    'erase all data': 'borrar datos',

    you: 'tú',

    assistant: 'asistente',

    wait: 'espera',

    speak: 'habla',
  },
};
export default function translate(sentence: string) {
  if (!translationMap[defaultLanguage]) return sentence;
  const translated = translationMap[defaultLanguage][normalize(sentence)];
  return translated || sentence;
}
