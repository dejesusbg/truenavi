interface LocalizedText {
  en: string;
  es: string;
}

export interface ConversationTurn {
  input: LocalizedText;
  output: LocalizedText;
  next?: ConversationTurn[];
}

export interface ConversationFlow {
  initialPrompts: ConversationTurn[];
  configPrompts: ConversationTurn[];
  navigationPrompts: ConversationTurn[];
  fallback: LocalizedText;
}

function generateConfigFlow(): ConversationTurn[] {
  return [
    {
      input: { en: 'language', es: 'idioma' },
      output: {
        en: 'choose language: english or spanish',
        es: 'elige idioma: inglés o español',
      },
      next: [
        {
          input: { en: 'english|spanish', es: 'inglés|español' },
          output: {
            en: 'language set to ${input}. adjust anything else?',
            es: 'idioma configurado en ${input}. ¿algo más?',
          },
        },
      ],
    },
    {
      input: { en: 'weather', es: 'clima' },
      output: {
        en: 'show weather during navigation? (yes/no)',
        es: '¿desea saber el clima durante la navegación? (sí/no)',
      },
      next: [
        {
          input: { en: 'yes', es: 'sí' },
          output: {
            en: 'weather will be shown. adjust anything else?',
            es: 'el clima se le hará saber. ¿algo más?',
          },
        },
        {
          input: { en: 'no', es: 'no' },
          output: {
            en: "weather won't be shown. adjust anything else?",
            es: 'el clima no se mostrará. ¿algo más?',
          },
        },
      ],
    },
    {
      input: { en: 'vibration', es: 'vibración' },
      output: {
        en: 'enable haptic vibration for alerts? (yes/no)',
        es: '¿activar vibración para alertar? (sí/no)',
      },
      next: [
        {
          input: { en: 'yes', es: 'sí' },
          output: {
            en: 'vibration enabled. Adjust anything else?',
            es: 'vibración activada. ¿Algo más?',
          },
        },
        {
          input: { en: 'no', es: 'no' },
          output: {
            en: 'vibration disabled. Adjust anything else?',
            es: 'vibración desactivada. ¿Algo más?',
          },
        },
      ],
    },
  ];
}

export const conversationFlow: ConversationFlow = {
  initialPrompts: [
    {
      input: { en: 'start', es: 'inicio' },
      output: {
        en: "hi, i'm truenavi. can i access your location and microphone?",
        es: 'hola, soy truenavi. ¿me permites acceder a tu ubicación y micrófono?',
      },
      next: [
        {
          input: { en: 'yes', es: 'sí' },
          output: {
            en: "great! let's configure your experience.",
            es: '¡perfecto! configuremos tu experiencia.',
          },
          next: generateConfigFlow(),
        },
        {
          input: { en: 'no', es: 'no' },
          output: {
            en: "without these permissions, guidance doesn't work.",
            es: 'sin estos permisos, la aplicación no puede funcionar.',
          },
        },
      ],
    },
  ],
  configPrompts: generateConfigFlow(),
  navigationPrompts: [
    {
      input: { en: 'navigate', es: 'navegar' },
      output: {
        en: 'where would you like to go today?',
        es: '¿a dónde te gustaría ir hoy?',
      },
      next: [
        {
          input: { en: '*', es: '*' },
          output: {
            en: 'calculating route to ${input}. start navigation?',
            es: 'calculando ruta a ${input}. ¿iniciar navegación?',
          },
          next: [
            {
              input: { en: 'yes', es: 'sí' },
              output: {
                en: 'starting navigation to ${destination}.',
                es: 'iniciando navegación a ${destination}.',
              },
            },
            {
              input: { en: 'no', es: 'no' },
              output: {
                en: 'okay, let me know when you are ready.',
                es: 'está bien, dime cuando estés listo.',
              },
            },
          ],
        },
        {
          input: { en: 'settings', es: 'configuración' },
          output: {
            en: "let's configure your experience.",
            es: 'vamos a configurar tu experiencia.',
          },
          next: generateConfigFlow(),
        },
      ],
    },
  ],
  fallback: {
    en: "sorry, I didn't understand that. can you repeat?",
    es: 'lo siento, no entendí eso. ¿puedes repetirlo?',
  },
};
