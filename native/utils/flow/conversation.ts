import { updatePreferences } from '~/services/preferences';
import { AppState, Conversation, ConversationStep } from '~/utils/flow/types';
import { normalize } from '~/utils/text';

const commonInputs: Record<string, string[]> = {
  place: ['edificio bienestar', 'lago', 'cafeteria', 'mar caribe', 'restaurante'],
  config: ['configure', 'configurar', 'settings', 'setup'],
  yes: ['yes', 'sí', 'yeah', 'ok', 'okay'],
  no: ['no', 'nope', 'no way', 'negative', 'no gracias'],
  '': ['asklda', 'asdas', 'qweqwd', 'asda', 'asdasf'],
};

const noop = async () => {};

const createStep = (
  icon: string,
  output: string,
  nextId: string = '',
  action: (input: any) => Promise<any> = noop
): ConversationStep => ({ icon, output, action, nextId });

// conversation flow
export const flow: Conversation = {
  start: createStep(
    // TODO: search destination and find route
    'signpost',
    "where are we headed?\nlet me know and i'll find the best route",
    'start_nav'
  ),
  start_nav: createStep('route', 'calculating your route and starting navigation now', 'navigate'),
  config: createStep(
    'language',
    "let's set up the app,\nwould you like to switch to spanish?",
    'config_weather',
    (input) => updatePreferences({ spanish: input })
  ),
  config_weather: createStep(
    'cloud',
    'language set,\ndo you want to know the weather before navigating?',
    'config_vibrate',
    (input) => updatePreferences({ weather: input })
  ),
  config_vibrate: createStep(
    'vibration',
    'weather updates set,\nwould you like haptic feedback for alerts?',
    'start',
    (input) => updatePreferences({ vibration: input })
  ),
  fallback: createStep(
    'question-mark',
    "sorry, i didn't catch that,\ncould you try saying it again?"
  ),
};

// input utils
export async function handleInput(
  userInput: string,
  current: ConversationStep,
  appState: AppState
): Promise<ConversationStep> {
  const input = parseInput(userInput, appState);
  const output = normalize(current.output).replace(/\n/g, ' ');

  console.log(`[Conversation] ${output} -> ${userInput}`);

  if (input === null) return { ...flow.fallback, action: current.action, nextId: current.nextId };
  if (input === 'config') return flow.config;

  await current.action(input);
  return flow[current.nextId] || current;
}

export function simulateInput(appState: AppState): string {
  const pool: Record<AppState, string[]> = {
    config: [...commonInputs.yes, ...commonInputs.no, ...commonInputs.config],
    start: [...commonInputs.place],
  };

  const statePhrases = pool[appState] || [];
  statePhrases.push(...commonInputs['']);

  const random = statePhrases[Math.floor(Math.random() * statePhrases.length)];
  return normalize(random);
}

export function parseInput(userInput: string, appState: AppState): string | boolean | null {
  const input = normalize(userInput);

  if (appState === 'config') {
    if (commonInputs.yes.includes(input)) return true;
    if (commonInputs.no.includes(input)) return false;
    if (commonInputs.config.includes(input)) return 'config';
  }

  if (appState === 'start') {
    // TODO: get actual places and search
    if (commonInputs.place.includes(input)) return input;
  }

  return null;
}
