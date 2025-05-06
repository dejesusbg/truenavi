import { useReducer, useEffect } from 'react';
import usePreferences from '~/hooks/usePreferences';
import { listen, speak } from '~/utils/audio';
import { flow, handleInput } from '~/utils/flow/conversation';
import { HomeAction, HomeState, appStates } from '~/utils/flow/types';
import t, { getLocale } from '~/utils/text';

// initial state
const initialState: HomeState = {
  appState: 'not-allowed',
  conversationState: null,
  currentStep: flow.config,
  userInput: 'waiting',
  isFirstTime: true, // TODO: this would be false after first use (would connect to DB)
};

// reducer function
const reducer = (state: HomeState, action: HomeAction): HomeState => {
  switch (action.type) {
    case 'SET_APP_STATE':
      return { ...state, appState: action.payload };
    case 'SET_CONVERSATION_STATE':
      return { ...state, conversationState: action.payload };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_USER_INPUT':
      return { ...state, userInput: action.payload };
    case 'HANDLE_PERMISSIONS':
      return {
        ...state,
        appState: action.payload ? (state.isFirstTime ? 'config' : 'start') : 'not-allowed',
        currentStep: action.payload && !state.isFirstTime ? flow.start : flow.config,
        conversationState: action.payload ? 'speak' : null,
      };
    default:
      return state;
  }
};

export function useConversationReducer(permissionsGranted: boolean) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { preferences, setNewPreferences } = usePreferences();

  // handle permission changes on mount
  useEffect(() => {
    dispatch({ type: 'HANDLE_PERMISSIONS', payload: permissionsGranted });
  }, [permissionsGranted]);

  // handle speak completion and listen start
  const handleSpeak = () => {
    const locale = getLocale(preferences);
    const output = t(state.currentStep.output, locale);
    speak(output, locale, {
      onDone: () => dispatch({ type: 'SET_CONVERSATION_STATE', payload: 'listen' }),
    });
  };

  const handleListen = async () => {
    dispatch({ type: 'SET_USER_INPUT', payload: 'waiting' });

    // get user input from audio
    const input = await listen(state.appState);
    dispatch({ type: 'SET_USER_INPUT', payload: input });

    if (state.appState === 'navigate') return;
    const nextStep = await handleInput(input, state.currentStep, state.appState);
    await setNewPreferences();

    setTimeout(() => {
      const newState = appStates.includes(nextStep.nextId) ? nextStep.nextId : state.appState;
      dispatch({ type: 'SET_USER_INPUT', payload: 'waiting' });
      dispatch({ type: 'SET_CONVERSATION_STATE', payload: 'speak' });
      dispatch({ type: 'SET_STEP', payload: nextStep });
      dispatch({ type: 'SET_APP_STATE', payload: newState });
    }, 2500);
  };

  useEffect(() => {
    if (state.conversationState === 'speak') handleSpeak();
    if (state.conversationState === 'listen') handleListen();
  }, [state.conversationState, state.currentStep]);

  return { state, dispatch };
}
