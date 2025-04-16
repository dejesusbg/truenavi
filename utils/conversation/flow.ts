import { ConversationFlow, ConversationTurn } from './types';
import { responseVariant } from './responses';

const finalStep: ConversationTurn = {
  output: {
    en: "all set! let me know when you're ready to navigate.",
    es: '¡todo listo! dime cuando quieras empezar la navegación.',
    icon: 'celebration',
  },
  action: () => {}, // go to navigate flow
};

const hapticStep: ConversationTurn = {
  output: {
    en: 'weather option updated. wanna enable haptic vibration for alerts?',
    es: 'opción del clima actualizada. ¿desea activar vibración para alertas?',
    icon: 'vibration',
  },
  action: () => {}, // set vibration option
  next: { '*': finalStep },
};

const weatherStep: ConversationTurn = {
  output: {
    en: 'language set to english. show weather during navigation?',
    es: 'idioma configurado a español. ¿desea saber el clima durante la navegación?',
    icon: 'cloud',
  },
  action: () => {}, // set weather option
  next: { '*': hapticStep },
};

const languageStep: ConversationTurn = {
  output: {
    en: "let's configure your experience, do you want to set your language as spanish?",
    es: 'vamos a configurar tu experiencia. ¿quieres configurar tu idioma a español?',
    icon: 'language',
  },
  action: () => {}, // set language
  next: { '*': weatherStep },
};

const configFlow = languageStep;

const navigationResponses = responseVariant({
  yes: {
    output: {
      en: 'starting navigation to ${destination}.',
      es: 'iniciando navegación a ${destination}.',
      icon: 'directions-walk',
    },
    action: () => {}, // start navigation
  },
  no: {
    output: {
      en: 'okay, navigation canceled.',
      es: 'está bien, la navegación ha sido cancelada.',
      icon: 'done',
    },
    action: () => {}, // reset
  },
});

export const conversationFlow: ConversationFlow = {
  navigation: {
    output: {
      en: "hi, i'm truenavi, where would you like to go today?",
      es: 'hola, soy truenavi, ¿a dónde te gustaría ir hoy?',
      icon: 'signpost',
    },
    action: () => {}, // search node
    next: {
      '*': {
        output: {
          en: 'calculating route to ${input}. start navigation?',
          es: 'calculando ruta a ${input}. ¿iniciar navegación?',
          icon: 'route',
        },
        action: () => {}, // start navigation
        next: navigationResponses,
      },
      configurar: configFlow,
    },
  },
  config: configFlow,
  fallback: {
    output: {
      en: "sorry, i didn't understand that. Can you repeat?",
      es: 'lo siento, no entendí eso. ¿Puedes repetirlo?',
      icon: 'question-mark',
    },
    action: () => {}, // try again
  },
};
