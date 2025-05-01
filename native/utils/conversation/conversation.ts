import { Conversation, ConversationStep } from '~/utils/conversation/types';

// utils
export const normalize = (input: string) => input.trim().toLowerCase();
const normalizeOutput = (input: string) => input.replace('\n', ' ');

export function handleInput(current: ConversationStep, userInput: string): ConversationStep {
  const input = normalize(userInput);
  const output = normalizeOutput(current.out.en);
  console.log(`[conversation] ${output} -> ${input}`);
  current.action(input);

  if (input === 'configurar' || input === 'configure') return flow.configuration;

  if (!current.next) {
    if (current.id?.startsWith('config')) return flow.start;
    return current;
  }

  return current.next;
}

// conversation flow
export const flow: Conversation = {
  start: {
    id: 'nav_start',
    out: {
      en: "where are we headed?\nlet me know and i'll find the best route",
      es: '¿a dónde vamos hoy?\ndime y encontraré la mejor ruta para ti',
      icon: 'signpost',
    },
    action: (input) => {},
    next: {
      id: 'nav_calculate',
      out: {
        en: 'calculating your route and starting navigation now',
        es: 'calculando tu ruta e iniciando la navegación ahora',
        icon: 'route',
      },
      action: (input) => {},
    },
  },
  configuration: {
    id: 'config_language',
    out: {
      en: "let's set up the app,\nwould you like to switch to spanish?",
      es: 'vamos a configurar la app\n¿desearías cambiar el idioma a inglés?',
      icon: 'language',
    },
    action: (input) => {},
    next: {
      id: 'config_weather',
      out: {
        en: 'language set,\ndo you want to know the weather before navigating?',
        es: 'idioma configurado\n¿quieres saber el clima antes de navegar?',
        icon: 'cloud',
      },
      action: (input) => {},
      next: {
        id: 'config_haptic',
        out: {
          en: 'weather updates set,\nwould you like haptic feedback for alerts?',
          es: 'clima configurado\n¿te gustaría recibir vibraciones para alertas?',
          icon: 'vibration',
        },
        action: (input) => {},
      },
    },
  },
  fallback: {
    id: 'fallback',
    out: {
      en: "sorry, i didn't catch that,\ncould you try saying it again?",
      es: 'lo siento, no entendí eso\n¿puedes intentarlo de nuevo?',
      icon: 'question-mark',
    },
    action: (input) => {},
  },
};
