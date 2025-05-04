import { Conversation, ConversationStep } from '~/utils/flow/types';
import { normalize } from '~/utils/text';

export function handleInput(current: ConversationStep, userInput: string): ConversationStep {
  const input = normalize(userInput);
  const output = normalize(current.output).replace('\n', ' ');
  console.log(`[Conversation] ${output} -> ${input}`);
  current.action(input);

  if (input === 'configurar' || input === 'configure') return flow.config;

  if (current.next === 'start') return flow.start;
  if (!current.next || typeof current.next === 'string') return current;
  return current.next;
}

// conversation flow
export const flow: Conversation = {
  start: {
    icon: 'signpost',
    output: "where are we headed?\nlet me know and i'll find the best route",
    action: (input) => {},
    next: {
      icon: 'route',
      output: 'calculating your route and starting navigation now',
      action: (input) => {},
      next: 'navigate',
    },
  },
  config: {
    icon: 'language',
    output: "let's set up the app,\nwould you like to switch to spanish?",
    action: (input) => {},
    next: {
      icon: 'cloud',
      output: 'language set,\ndo you want to know the weather before navigating?',
      action: (input) => {},
      next: {
        icon: 'vibration',
        output: 'weather updates set,\nwould you like haptic feedback for alerts?',
        action: (input) => {},
        next: 'start',
      },
    },
  },
};
