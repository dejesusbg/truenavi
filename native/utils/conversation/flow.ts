import { ConversationFlow } from './engine';

export const conversationFlow: ConversationFlow = {
  navigation: {
    out: {
      en: "hey, i'm truenavi. where are we headed today?",
      es: 'hola, soy truenavi, ¿a dónde vamos hoy?',
      icon: 'signpost',
    },
    action: (input) => console.log('truenavi: buscando el destino y la mejor ruta posible'),
    next: {
      out: {
        en: 'calculating your route and starting navigation...',
        es: 'calculando tu ruta e iniciando la navegación...',
        icon: 'route',
      },
      action: (input) => console.log('truenavi: modo de instrucciones activado'),
    },
  },
  reroute: {
    out: {
      en: 'looks like you took a detour, re-routing now...',
      es: 'parece que tomaste un desvío, recalculando la ruta ahora...',
      icon: 'auto-awesome',
    },
    action: (input) => console.log('truenavi: recalculando la ruta debido al desvío'),
  },
  instruction: {
    out: {
      en: 'turn ${direction} and continue for ${distance} meters',
      es: 'gira a la ${direction} y continúa por ${distance} metros',
      icon: 'directions-walk',
    },
    action: (input) => console.log('truenavi: dando instrucciones precisas'),
  },
  weather: {
    out: {
      en: "it's ${degrees}°C in ${location} and there's a ${chance}% chance of rain",
      es: 'está a ${degrees}°C en ${location} y hay una probabilidad de lluvia del ${chance}%',
      icon: 'cloud',
    },
    action: (input) => console.log('truenavi: mostrando el clima actual'),
  },
  configuration: {
    out: {
      en: "let's set up your experience. would you like to switch to spanish?",
      es: 'vamos a configurar tu experiencia. ¿quieres cambiar el idioma a inglés?',
      icon: 'language',
    },
    action: (input) => console.log('truenavi: configurando el idioma deseado'),
    next: {
      out: {
        en: 'language set to english. would you like weather updates during navigation?',
        es: 'idioma configurado a español. ¿quieres recibir actualizaciones del clima durante la navegación?',
        icon: 'cloud',
      },
      action: (input) => console.log('truenavi: configurando las actualizaciones del clima'),
      next: {
        out: {
          en: 'weather updates are enabled. do you want to activate haptic feedback for alerts?',
          es: 'actualizaciones del clima activadas. ¿quieres activar la vibración para las alertas?',
          icon: 'vibration',
        },
        action: (input) => console.log('truenavi: ajustando la configuración de vibración'),
        next: {
          out: {
            en: "everything's set! just let me know when you're ready to navigate.",
            es: '¡todo listo! avísame cuando estés listo para empezar la navegación.',
            icon: 'celebration',
          },
          action: (input) => console.log('truenavi: configuración completada'),
        },
      },
    },
  },
  fallback: {
    out: {
      en: "sorry, i didn't quite catch that. could you say it again?",
      es: 'lo siento, no entendí bien eso. ¿puedes repetirlo?',
      icon: 'question-mark',
    },
    action: (input) => console.log('truenavi: no entendí la solicitud'),
  },
};
