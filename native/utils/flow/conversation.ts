import { Dispatch } from 'react';
import { getPlacesNames, updatePreferences } from '~/services';
import { commonInputs, normalize } from '~/utils/text';
import { ConversationStep, FlowAction, InputAppState } from './types';

const createStep = (
  icon: string,
  output: string,
  nextId: string = '',
  action: (input: any) => Promise<any> = async () => {}
): ConversationStep => ({ icon, output, action, nextId });

// conversation flow
export const flow: Record<string, ConversationStep> = {
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
    (input) => updatePreferences({ vibration: input, isFirstTime: false })
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
  type: InputAppState,
  dispatch: Dispatch<FlowAction>
): Promise<ConversationStep> {
  const input = await parseInput(userInput, type);
  const output = current.output.replace(/\n/g, ' ');

  console.log(`[Conversation] ${output} -> ${userInput} (${input})`);

  if (input === null) return { ...flow.fallback, action: current.action, nextId: current.nextId };

  if (input === 'config') {
    dispatch({ type: 'SET_APP_STATE', payload: 'config' });
    return flow.config;
  }

  await current.action(input);
  return flow[current.nextId] || current;
}

export async function parseInput(
  userInput: string,
  type: InputAppState
): Promise<string | boolean | null> {
  commonInputs.place = await getPlacesNames();
  const input = normalize(userInput);

  if (type === 'config') {
    if (commonInputs.yes.includes(input)) return true;
    if (commonInputs.no.includes(input)) return false;
  }

  if (type === 'start') {
    if (commonInputs.config.includes(input)) return 'config';
    if (commonInputs.place.includes(input)) return input;
  }

  return null;
}
