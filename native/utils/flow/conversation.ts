import { getPlacesNames, PreferencesProps } from '~/services';
import { listen, speak } from '~/utils/audio';
import t, { commonInputs, Locale, normalize } from '~/utils/text';
import { startNavigation } from './navigation';
import { flow } from './steps';
import { AppState, ConversationStep, FlowDispatch, InputAppState, validAppStates } from './types';

// handle user input to get keep flow going
async function handleInput(
  userInput: string,
  current: ConversationStep,
  type: InputAppState,
  dispatch: FlowDispatch
): Promise<ConversationStep> {
  const input = await parseInput(userInput, type);
  const output = current.output.replace(/\n/g, ' ');

  console.log(`[Conversation] ${output} -> ${userInput} (${input})`);

  if (input === null) {
    return { ...flow.fallback, action: current.action, nextId: current.nextId };
  }

  if (input === 'config') {
    dispatch({ type: 'SET_APP_STATE', payload: 'config' });
    return flow.config;
  }

  await current.action(input);
  return flow[current.nextId] || current;
}

// parse user input into predefined categories
async function parseInput(
  userInput: string,
  type: InputAppState
): Promise<string | boolean | null> {
  const input = normalize(userInput);

  if (type === 'config') {
    if (commonInputs.yes.includes(input)) return true;
    if (commonInputs.no.includes(input)) return false;
  }

  if (type === 'start') {
    commonInputs.place = await getPlacesNames();
    if (commonInputs.config.includes(input)) return 'config';
    if (commonInputs.place.includes(input)) return input;
  }

  return null;
}

// handle conversation speech output
export function speakConversation(step: ConversationStep, locale: Locale, dispatch: FlowDispatch) {
  speak(t(step.output, locale), locale, {
    onDone: () => dispatch({ type: 'SET_CONVERSATION_STATUS', payload: 'listen' }),
  });
}

// handle conversation input processing
export async function listenConversation(
  state: AppState,
  step: ConversationStep,
  input: string,
  preferences: PreferencesProps,
  loadPreferences: () => Promise<any>,
  dispatch: FlowDispatch
) {
  // determine next app state
  const newState = validAppStates.includes(step.nextId) ? (step.nextId as AppState) : state;

  // special case: start navigation if that's the next state
  if (newState === 'navigate') return startNavigation(input, preferences, dispatch);

  // get user input from audio
  const listenedInput = await listen(state as InputAppState);
  dispatch({ type: 'SET_APP_STATE', payload: newState });
  dispatch({ type: 'SET_USER_INPUT', payload: listenedInput });
  dispatch({ type: 'HIDE_INPUT', payload: false });

  // process the input and reload preferences (in case they changed)
  const nextStep = await handleInput(listenedInput, step, state as InputAppState, dispatch);
  await loadPreferences();

  setTimeout(() => {
    dispatch({ type: 'HIDE_INPUT', payload: true });
    dispatch({ type: 'SET_CONVERSATION_STATUS', payload: 'speak' });
    dispatch({ type: 'SET_CURRENT_STEP', payload: nextStep });
  }, 3000);
}
