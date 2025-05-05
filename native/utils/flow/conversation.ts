import { updatePreferences } from '~/services/preferences';
import { Conversation, ConversationStep } from '~/utils/flow/types';
import { normalize } from '~/utils/text';
import { getBooleanInput, getStandarizedInput } from '../audio';

export async function handleInput(
  current: ConversationStep,
  userInput: string
): Promise<ConversationStep> {
  let input = normalize(userInput);
  const output = normalize(current.output).replace('\n', ' ');

  console.log(`[Conversation] ${output} -> ${input}`);
  input = getStandarizedInput(input);

  if (input === 'config') return flow.config;

  if (input === '') {
    const fallback = flow.fallback;
    fallback.action = current.action;
    fallback.nextId = current.nextId;
    return flow.fallback;
  }

  await current.action(input);

  if (current.nextId === 'start') return flow.start;
  return flow[current.nextId];
}

// conversation flow
export const flow: Conversation = {
  start: {
    icon: 'signpost',
    output: "where are we headed?\nlet me know and i'll find the best route",
    action: async (input) => {},
    nextId: 'start_nav',
  },
  start_nav: {
    icon: 'route',
    output: 'calculating your route and starting navigation now',
    action: async (input) => {},
    nextId: 'navigate',
  },
  config: {
    icon: 'language',
    output: "let's set up the app,\nwould you like to switch to spanish?",
    action: (input) => updatePreferences({ spanish: getBooleanInput(input) }),
    nextId: 'config_weather',
  },
  config_weather: {
    icon: 'cloud',
    output: 'language set,\ndo you want to know the weather before navigating?',
    action: (input) => updatePreferences({ weather: getBooleanInput(input) }),
    nextId: 'config_vibrate',
  },
  config_vibrate: {
    icon: 'vibration',
    output: 'weather updates set,\nwould you like haptic feedback for alerts?',
    action: (input) => updatePreferences({ vibration: getBooleanInput(input) }),
    nextId: 'start',
  },
  fallback: {
    icon: 'question-mark',
    output: "sorry, i didn't catch that,\ncould you try saying it again?",
    action: async (input) => {},
    nextId: '',
  },
};
