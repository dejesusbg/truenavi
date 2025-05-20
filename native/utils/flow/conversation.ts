import { getPlaces, PreferencesProps } from '~/services';
import { getLevenshtein } from '~/utils/audio';
import { speak } from '~/utils/audio/speech';
import t, { commonInputs, Locale, normalize } from '~/utils/text';
import { startNavigation } from './navigation';
import { flow } from './steps';
import { ConversationStep, FlowDispatch, FlowState, InputAppState, isAppState } from './types';

type Input = string | boolean | null;

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

  dispatch({ type: 'SET_APP_STATE', payload: newState });
  dispatch({ type: 'SET_CURRENT_STEP', payload: newStep });
  dispatch({ type: 'SET_CONVERSATION_STATUS', payload: granted ? 'speak' : null });
}

/**
 * Handles the processing of a transcript message within a conversation flow.
 *
 * This function parses the incoming transcript data, determines the next application state,
 * processes user input, updates the conversation state, and manages navigation or step transitions.
 * It also loads dynamic data (such as places), updates preferences, and provides visual feedback
 * through delayed state transitions.
 *
 * @param state - The current flow state of the conversation.
 * @param dispatch - The dispatch function to update the flow state.
 * @param preferences - The user's preferences used in the flow.
 * @param loadPreferences - A function to reload or refresh user preferences.
 * @param data - The raw transcript data as a JSON string.
 */
export async function listenTranscript(
  state: FlowState,
  dispatch: FlowDispatch,
  preferences: PreferencesProps,
  loadPreferences: () => Promise<any>,
  data: string
) {
  try {
    const { transcript } = JSON.parse(data);
    const { currentStep, appState, userInput } = state;

    // determine next app state based on flow definition
    const newState = isAppState(currentStep.nextId) ? currentStep.nextId : appState;

    // special case: navigate state triggers navigation flow
    if (newState === 'navigate') {
      return startNavigation(userInput, preferences.weather!, dispatch);
    }

    // load places dinamically
    commonInputs.place = await getPlaces();

    // process input and identify next action
    const normalizedInput = normalize(transcript);
    const [input, parsedInput] = resolveUserInput(normalizedInput, appState as InputAppState);

    console.log(
      `[Conversation] ${currentStep.output.replace(/\n/g, ' ')} -> (${parsedInput}) ${input}`
    );

    dispatch({ type: 'SET_APP_STATE', payload: newState });
    dispatch({ type: 'SET_USER_INPUT', payload: input });
    dispatch({ type: 'HIDE_INPUT', payload: false });

    // get next step based on processed input
    const nextStep = await processConversationInput(parsedInput, currentStep, dispatch);
    await loadPreferences();

    const moveToNextStep = () => {
      dispatch({ type: 'HIDE_INPUT', payload: true });
      dispatch({ type: 'SET_CONVERSATION_STATUS', payload: 'speak' });
      dispatch({ type: 'SET_CURRENT_STEP', payload: nextStep });
    };

    // add small delay for visual feedback if we have valid input
    normalizedInput ? setTimeout(moveToNextStep, 3000) : moveToNextStep();
  } catch (err) {
    console.error('[Conversation] Error handling transcript:', err);
  }
}

/**
 * Resolves the user's input transcript to a recognized command or input based on the current application state.
 *
 * This function attempts to match the provided transcript against a set of available commands determined by the `appState`.
 * It first checks for exact matches, and if none are found, it uses the Levenshtein distance algorithm to find the closest match.
 * If a sufficiently close match is found (distance < 5), it returns the matched command and its parsed input.
 * Otherwise, it returns the original transcript and `null`.
 *
 * @param transcript - The user's input as a string.
 * @param appState - The current input state of the application, used to determine available commands.
 * @returns A tuple containing the matched command (or original transcript) and the parsed input, or `null` if no match is found.
 */
function resolveUserInput(transcript: string, appState: InputAppState): [string, Input] {
  if (!transcript) return [transcript, null];

  // define available commands based on input type
  const availableCommands = {
    config: [...commonInputs.yes, ...commonInputs.no],
    start: [...commonInputs.place, ...commonInputs.config],
  };

  const potentialMatches = availableCommands[appState] || [];

  // first check for exact matches
  for (const match of potentialMatches) {
    if (transcript.includes(match)) {
      return [transcript, parseMatchInput(match, appState)];
    }
  }

  // if no exact match, find closest using Levenshtein distance
  let bestMatch = '';
  let bestScore = Infinity;

  for (const match of potentialMatches) {
    const distance = getLevenshtein(transcript, match);
    if (distance < bestScore) {
      bestScore = distance;
      bestMatch = match;
    }
  }

  // only use fuzzy match if score is good enough
  if (bestScore < 4) {
    return [bestMatch, parseMatchInput(bestMatch, appState)];
  }

  // no good match found
  return [transcript, null];
}

/**
 * Parses a matched input string and returns a corresponding value based on the input type.
 *
 * @param match - The input string to be matched against known values.
 * @param appState - The current input state, determining how the match should be interpreted.
 * @returns Returns a boolean for 'config' inputType, a matched place string or 'config' for 'start' inputType, or null if no match is found.
 */
function parseMatchInput(match: string, appState: InputAppState): Input {
  switch (appState) {
    case 'config':
      if (commonInputs.yes.includes(match)) return true;
      if (commonInputs.no.includes(match)) return false;
      break;

    case 'start':
      if (commonInputs.config.includes(match)) return 'config';
      if (commonInputs.place.includes(match)) return match;
      break;
  }

  return null;
}

/**
 * Handles user input for a conversation flow step, dispatching actions and determining the next step.
 *
 * @param userInput - The input provided by the user, which can be a string, boolean, or null.
 * @param currentStep - The current step in the conversation flow.
 * @param dispatch - The dispatch function used to update the flow or application state.
 * @returns A promise that resolves to the next ConversationStep in the flow.
 *
 * @remarks
 * - If `userInput` is `null`, returns a fallback step.
 * - If `userInput` is `'config'`, dispatches a state change and returns the config step.
 * - Otherwise, executes the current step's action and returns the next step.
 */
export async function processConversationInput(
  userInput: Input,
  currentStep: ConversationStep,
  dispatch: FlowDispatch
): Promise<ConversationStep> {
  // handle special cases
  if (userInput === null) {
    return { ...flow.fallback, action: currentStep.action, nextId: currentStep.nextId };
  }

  if (userInput === 'config') {
    dispatch({ type: 'SET_APP_STATE', payload: 'config' });
    return flow.config;
  }

  // execute action with the parsed input and return the next step in the flow
  await currentStep.action(userInput);
  return flow[currentStep.nextId] || currentStep;
}

/**
 * Speaks the output of a conversation step in the specified locale and dispatches an action to set the conversation status to 'listen' when done.
 *
 * @param state - The current conversation flow state containing the step output to be spoken.
 * @param locale - The locale to use for translation and speech synthesis.
 * @param dispatch - The dispatch function to update the conversation flow state.
 */
export function speakStepOutput(state: FlowState, locale: Locale, dispatch: FlowDispatch) {
  const listen = () => dispatch({ type: 'SET_CONVERSATION_STATUS', payload: 'listen' });
  speak(t(state.currentStep.output, locale), locale, { onDone: listen });
}
