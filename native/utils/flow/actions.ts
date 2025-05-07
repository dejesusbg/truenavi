import { Dispatch } from 'react';

import { FlowAction, InputAppState, AppState, NavigationStep, ConversationStep } from './types';
import { createNavigation, direction, sampleNavigation } from './navigation';
import { flow, handleInput } from './conversation';
import { listen, speak } from '../audio';
import t, { Locale } from '../text';

// handle navigation instructions
export function speakNavigation(
  steps: NavigationStep[],
  index: number,
  locale: Locale,
  dispatch: Dispatch<FlowAction>
) {
  const { id, value } = steps[index];
  const instructionText = `${t(direction[id].output, locale)} ${t(value, locale)}`;

  console.log(`[Navigation] ${instructionText}`);

  speak(t(instructionText, locale), locale, {
    onDone: () => {
      if (index < steps.length - 1) {
        setTimeout(() => dispatch({ type: 'NEXT_INSTRUCTION' }), 5000);
      } else {
        endNavigation(dispatch);
      }
    },
  });
}

// handle conversation speech output
export function speakConversation(
  step: ConversationStep,
  locale: Locale,
  dispatch: Dispatch<FlowAction>
) {
  speak(t(step.output, locale), locale, {
    onDone: () => dispatch({ type: 'SET_CONVERSATION_STATUS', payload: 'listen' }),
  });
}

// handle conversation input processing
export async function listenConversation(
  state: AppState,
  step: ConversationStep,
  input: string,
  loadPreferences: () => Promise<any>,
  dispatch: Dispatch<FlowAction>
) {
  // determine next app state
  const newState = (step.nextId as AppState) || state;
  dispatch({ type: 'SET_APP_STATE', payload: newState });

  // special case: start navigation if that's the next state
  if (newState === 'navigate') return startNavigation(input, dispatch);

  // get user input from audio
  const listenedInput = await listen(state as InputAppState);
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

// initialize navigation flow
export function startNavigation(destination: string, dispatch: Dispatch<FlowAction>) {
  // TODO: generate actual navigation steps based on destination
  const navigation = [createNavigation('start'), ...sampleNavigation, createNavigation('end')];
  dispatch({ type: 'SET_DESTINATION', payload: destination });
  dispatch({ type: 'START_NAVIGATION', payload: navigation });
}

// end navigation and return to conversation
export function endNavigation(dispatch: Dispatch<FlowAction>) {
  setTimeout(() => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: flow.start });
    dispatch({ type: 'SET_APP_STATE', payload: 'start' });
    dispatch({ type: 'SET_CONVERSATION_STATUS', payload: 'speak' });
    dispatch({ type: 'END_NAVIGATION' });
  }, 3000);
}

// handle permission changes
export function handlePermissions(
  isFirstTime: boolean,
  permissionsGranted: boolean,
  dispatch: Dispatch<FlowAction>
) {
  const newState = permissionsGranted ? (isFirstTime ? 'config' : 'start') : 'not-allowed';
  const newStep = permissionsGranted && !isFirstTime ? flow.start : flow.config;
  const newConversationStatus = permissionsGranted ? 'speak' : null;

  dispatch({ type: 'SET_APP_STATE', payload: newState });
  dispatch({ type: 'SET_CURRENT_STEP', payload: newStep });
  dispatch({ type: 'SET_CONVERSATION_STATUS', payload: newConversationStatus });
}
