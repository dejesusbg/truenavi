import { getPlaces } from '~/services';
import { listen, speak } from '~/utils/audio';
import t, { commonInputs, Locale, normalize } from '~/utils/text';
import { startNavigation } from './navigation';
import { flow } from './steps';
import { ConversationStep, FlowDispatch, FlowState, InputAppState, isAppState } from './types';

/**
 * Handles the application flow based on permission status and whether it is the user's first time.
 *
 * @param granted - Indicates if the required permissions have been granted.
 * @param isFirstTime - Indicates if this is the user's first time performing the action.
 * @param dispatch - The dispatch function to update the application state.
 *
 * Dispatches actions to update the app state, current step, and conversation status
 * according to the permission and first-time status.
 */
export function handlePermissions(granted: boolean, isFirstTime: boolean, dispatch: FlowDispatch) {
  const newState = granted ? (isFirstTime ? 'config' : 'start') : 'not-allowed';
  const newStep = granted && !isFirstTime ? flow.start : flow.config;
  const newConversationStatus = granted ? 'speak' : null;

  dispatch({ type: 'SET_APP_STATE', payload: newState });
  dispatch({ type: 'SET_CURRENT_STEP', payload: newStep });
  dispatch({ type: 'SET_CONVERSATION_STATUS', payload: newConversationStatus });
}

/**
 * Handles user input within a conversation flow, normalizing the input,
 * managing special commands, executing the current step's action, and
 * determining the next conversation step.
 *
 * @param userInput - The raw input string provided by the user.
 * @param currentStep - The current step in the conversation flow.
 * @param inputType - The type of input expected by the application.
 * @param dispatch - The dispatch function for updating application state.
 * @returns A promise that resolves to the next ConversationStep in the flow.
 */
async function handleInput(
  userInput: string,
  currentStep: ConversationStep,
  inputType: InputAppState,
  dispatch: FlowDispatch
): Promise<ConversationStep> {
  const normalizedInput = await parseInput(userInput, inputType);
  console.log(`[Conversation] ${currentStep.output.replace(/\n/g, ' ')} -> ${userInput}`);

  // handle special cases
  if (normalizedInput === null) {
    return { ...flow.fallback, action: currentStep.action, nextId: currentStep.nextId };
  }

  if (normalizedInput === 'config') {
    dispatch({ type: 'SET_APP_STATE', payload: 'config' });
    return flow.config;
  }

  // execute action with the parsed input and return the next step in the flow
  await currentStep.action(normalizedInput);
  return flow[currentStep.nextId] || currentStep;
}

/**
 * Parses the user's input based on the specified input type and returns a corresponding value.
 *
 * @param userInput - The raw input string provided by the user.
 * @param inputType - The context or type of input expected, which determines how the input is parsed.
 * @returns A promise that resolves to:
 * - `true` or `false` for 'config' inputType if the input matches common yes/no values,
 * - a string for 'start' inputType if the input matches a config or place value,
 * - or `null` if the input does not match any expected values.
 */
async function parseInput(
  userInput: string,
  inputType: InputAppState
): Promise<string | boolean | null> {
  const input = normalize(userInput);

  switch (inputType) {
    case 'config':
      if (commonInputs.yes.includes(input)) return true;
      if (commonInputs.no.includes(input)) return false;
      break;

    case 'start':
      // load places dinamically
      commonInputs.place = await getPlaces();
      if (commonInputs.config.includes(input)) return 'config';
      if (commonInputs.place.includes(input)) return input;
      break;
  }

  return null;
}

/**
 * Speaks the output of a conversation step in the specified locale and dispatches an action to set the conversation status to 'listen' when done.
 *
 * @param state - The current conversation flow state containing the step output to be spoken.
 * @param locale - The locale to use for translation and speech synthesis.
 * @param dispatch - The dispatch function to update the conversation flow state.
 */
export function speakConversation(state: FlowState, locale: Locale, dispatch: FlowDispatch) {
  const listen = () => dispatch({ type: 'SET_CONVERSATION_STATUS', payload: 'listen' });
  speak(t(state.currentStep.output, locale), locale, { onDone: listen });
}

/**
 * Handles the conversation flow by listening for user input, updating the application state,
 * and dispatching actions based on the current conversation step.
 *
 * @param state - The current flow state containing the step, past input and app state.
 * @param weather - Indicates whether weather information should be considered.
 * @param loadPreferences - A function to asynchronously load user preferences.
 * @param dispatch - The dispatch function to update the application state.
 */
export async function listenConversation(
  state: FlowState,
  weather: boolean,
  loadPreferences: () => Promise<any>,
  dispatch: FlowDispatch
) {
  const { currentStep, appState, userInput } = state;

  // determine next app state based on flow definition
  const newState = isAppState(currentStep.nextId) ? currentStep.nextId : appState;

  // special case: navigate state triggers navigation flow
  if (newState === 'navigate') {
    return startNavigation(userInput, weather, dispatch);
  }

  // listen for user input
  const listenedInput = await listen(appState as InputAppState);
  dispatch({ type: 'SET_APP_STATE', payload: newState });
  dispatch({ type: 'SET_USER_INPUT', payload: listenedInput });
  dispatch({ type: 'HIDE_INPUT', payload: false });

  // process the input and get next step
  const nextStep = await handleInput(
    listenedInput,
    currentStep,
    appState as InputAppState,
    dispatch
  );
  await loadPreferences();

  // wait briefly, then update UI and move to next step
  setTimeout(() => {
    dispatch({ type: 'HIDE_INPUT', payload: true });
    dispatch({ type: 'SET_CONVERSATION_STATUS', payload: 'speak' });
    dispatch({ type: 'SET_CURRENT_STEP', payload: nextStep });
  }, 3000);
}
