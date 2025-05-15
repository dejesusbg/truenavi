import { NodeProps, updatePreferences } from '~/services';
import { ConversationStep, InstructionStep, NavigationStep } from '~/utils/flow/types';

function conversationStep(
  icon: string,
  output: string,
  nextId: string = '',
  action: (input: any) => Promise<any> = async () => {}
): ConversationStep {
  return { icon, output, action, nextId };
}

function instructionStep(icon: string, output: string): InstructionStep {
  return { icon, output };
}

export function navigationStep(id: string, value: string): NavigationStep {
  return { id, value };
}

export function navigationNode(id: string, node: NodeProps): NavigationStep {
  return { id, value: '', node };
}

// conversation flow
export const flow: Record<string, ConversationStep> = {
  start: conversationStep(
    'signpost',
    "where are we headed?\nlet me know and i'll find the best route",
    'start_nav'
  ),
  same_destination: conversationStep(
    'gps-fixed',
    'already here,\nplease choose a different destination',
    'start_nav'
  ),
  start_nav: conversationStep(
    'route',
    'calculating your route and starting navigation now',
    'navigate'
  ),
  config: conversationStep(
    'language',
    "let's set up the app,\nwould you like to switch to spanish?",
    'config_weather',
    (input) => updatePreferences({ spanish: input })
  ),
  config_weather: conversationStep(
    'cloud',
    'language set,\ndo you want to know the weather before navigating?',
    'config_vibrate',
    (input) => updatePreferences({ weather: input })
  ),
  config_vibrate: conversationStep(
    'vibration',
    'weather updates set,\nwould you like haptic feedback for alerts?',
    'start',
    (input) => updatePreferences({ vibration: input, isFirstTime: false })
  ),
  fallback: conversationStep(
    'question-mark',
    "sorry, i didn't catch that,\ncould you try saying it again?"
  ),
};

// navigation directions
export const direction: Record<string, InstructionStep> = {
  start: instructionStep('explore', 'going to'),
  left: instructionStep('turn-left', 'please, turn to the left'),
  right: instructionStep('turn-right', 'please, turn to the right'),
  'slight-left': instructionStep('turn-slight-left', 'turn slightly to the left'),
  'slight-right': instructionStep('turn-slight-right', 'turn slightly to the right'),
  'sharp-left': instructionStep('rotate-left', 'make a sharp left turn'),
  'sharp-right': instructionStep('rotate-right', 'make a sharp right turn'),
  'u-turn': instructionStep('u-turn-right', 'please, make a u-turn'),
  straight: instructionStep('arrow-upward', 'go straight'),
  reroute: instructionStep('auto-awesome', 'hold up, rerouting quickly'),
  rain: instructionStep('umbrella', 'rain chance of'),
  temperature: instructionStep('cloud', 'current temperature'),
  end: instructionStep('place', 'you have arrived to'),
};
