import { Conversation, ConversationStep } from '~/utils/conversation/types';

// utils
export const normalize = (input: string) => input.trim().toLowerCase();
const normalizeOutput = (input: string) => input.replace('\n', ' ');

export function handleInput(current: ConversationStep, userInput: string): ConversationStep {
  const input = normalize(userInput);
  const output = normalizeOutput(current.output);
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
    icon: 'signpost',
    output: "where are we headed?\nlet me know and i'll find the best route",
    action: (input) => {},
    next: {
      id: 'nav_calculate',
      icon: 'route',
      output: 'calculating your route and starting navigation now',
      action: (input) => {},
    },
  },
  configuration: {
    id: 'config_language',
    icon: 'language',
    output: "let's set up the app,\nwould you like to switch to spanish?",
    action: (input) => {},
    next: {
      id: 'config_weather',
      icon: 'cloud',
      output: 'language set,\ndo you want to know the weather before navigating?',
      action: (input) => {},
      next: {
        id: 'config_haptic',
        icon: 'vibration',
        output: 'weather updates set,\nwould you like haptic feedback for alerts?',
        action: (input) => {},
      },
    },
  },
  fallback: {
    id: 'fallback',
    icon: 'question-mark',
    output: "sorry, i didn't catch that,\ncould you try saying it again?",
    action: (input) => {},
  },
};
