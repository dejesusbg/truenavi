import { useReducer, useEffect } from 'react';
import { flow, handleInput } from '~/utils/conversation/conversation';
import { HomeAction, HomeState } from '~/utils/conversation/types';
import { speak } from '~/utils/audio';
import t, { defaultLanguage } from '../text/translation';

// initial state
const initialState: HomeState = {
  appState: 'not-allowed',
  conversationState: null,
  currentStep: flow.configuration,
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
      const nextStep = state.currentStep.next ?? flow.start;
      return { ...state, currentStep: nextStep, conversationState: 'speak' };
    }

    case 'HANDLE_PERMISSIONS':
      return {
        ...state,
        appState: action.payload ? (state.isFirstTime ? 'config' : 'start') : 'not-allowed',
        currentStep: action.payload && !state.isFirstTime ? flow.start : flow.configuration,
        conversationState: action.payload ? 'speak' : null,
      };

    case 'SUBMIT_INPUT': {
      const nextStep = handleInput(state.currentStep, state.userInput);

      const shouldStart = nextStep.id?.startsWith('config_') && !nextStep.next;
      const shouldNavigate = nextStep.id?.startsWith('nav_') && !nextStep.next;

      return {
        ...state,
        currentStep: nextStep,
        conversationState: 'speak',
        appState: shouldNavigate ? 'navigate' : shouldStart ? 'start' : state.appState,
      };
    }

    default:
      return state;
  }
};

export function useConversationReducer(permissionsGranted: boolean) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // handle permission changes
  useEffect(() => {
    dispatch({ type: 'HANDLE_PERMISSIONS', payload: permissionsGranted });
  }, [permissionsGranted]);

  const handleSpeakDone = () => {
    dispatch({ type: 'SET_CONVERSATION_STATE', payload: 'listen' });
    console.log('[speech] finishing');
  };

  // simulate speech output - will be replaced with actual speech functionality
  useEffect(() => {
    if (state.conversationState === 'speak') {
      speak(t(state.currentStep.output), defaultLanguage, { onDone: handleSpeakDone });
    }
  }, [state.conversationState, state.currentStep]);

  return { state, dispatch };
}
