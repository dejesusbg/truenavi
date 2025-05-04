import { useReducer, useEffect } from 'react';
import { speak } from '~/utils/audio';
import { flow, handleInput } from '~/utils/flow/conversation';
import { HomeAction, HomeState, AppState } from '~/utils/flow/types';
import t, { Locale } from '~/utils/text';

// initial state
const initialState: HomeState = {
  appState: 'not-allowed',
  conversationState: null,
  currentStep: flow.config,
  userInput: 'edificio bienestar',
  isFirstTime: true, // this would be false after first use (would connect to DB)
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

    case 'NEXT_STEP': {
      return {
        ...state,
        currentStep:
          typeof state.currentStep.next === 'object' ? state.currentStep.next : flow.start,
        conversationState: 'speak',
      };
    }

    case 'HANDLE_PERMISSIONS':
      return {
        ...state,
        appState: action.payload ? (state.isFirstTime ? 'config' : 'start') : 'not-allowed',
        currentStep: action.payload && !state.isFirstTime ? flow.start : flow.config,
        conversationState: action.payload ? 'speak' : null,
      };

    case 'SUBMIT_INPUT': {
      const nextStep = handleInput(state.currentStep, state.userInput);
      return {
        ...state,
        currentStep: nextStep,
        conversationState: 'speak',
        appState: typeof nextStep.next === 'string' ? (nextStep.next as AppState) : state.appState,
      };
    }

    default:
      return state;
  }
};

export function useConversationReducer(permissionsGranted: boolean, locale: Locale) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // handle permission changes
  useEffect(() => {
    dispatch({ type: 'HANDLE_PERMISSIONS', payload: permissionsGranted });
  }, [permissionsGranted]);

  const handleSpeakDone = () => {
    dispatch({ type: 'SET_CONVERSATION_STATE', payload: 'listen' });
  };

  useEffect(() => {
    if (state.conversationState === 'speak') {
      speak(t(state.currentStep.output, locale), locale, { onDone: handleSpeakDone });
    }
  }, [state.conversationState, state.currentStep]);

  return { state, dispatch };
}
