import { useEffect, useReducer } from 'react';
import { PreferencesProps, calculateRoute, getLocale, getNodes } from '~/services';
import {
  endNavigation,
  handlePermissions,
  listenConversation,
  speakConversation,
  speakNavigation,
} from './actions';
import { flow } from './conversation';
import { FlowAction, FlowState } from './types';

export const defaultState: FlowState = {
  appState: 'not-allowed',
  conversationStatus: null,
  currentStep: flow.config,
  userInput: '',
  hideInput: true,
  navigationSteps: [],
  navigationIndex: -1,
  destination: '',
};

const reducer = (state: FlowState, action: FlowAction): FlowState => {
  switch (action.type) {
    case 'SET_APP_STATE':
      return { ...state, appState: action.payload };
    case 'SET_CONVERSATION_STATUS':
      return { ...state, conversationStatus: action.payload };
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_USER_INPUT':
      return { ...state, userInput: action.payload };
    case 'HIDE_INPUT':
      return { ...state, hideInput: action.payload };
    case 'SET_DESTINATION':
      return { ...state, destination: action.payload };
    case 'START_NAVIGATION':
      return { ...state, navigationSteps: action.payload, navigationIndex: 0 };
    case 'END_NAVIGATION':
      return { ...state, navigationSteps: [], navigationIndex: -1 };
    case 'NEXT_INSTRUCTION':
      return { ...state, navigationIndex: state.navigationIndex + 1 };
    default:
      return state;
  }
};

/**
 * custom hook to manage conversation and navigation flow
 *
 * @param permissionsGranted whether necessary permissions are granted
 * @param preferences user preferences including locale settings
 * @param loadPreferences function to reload user preferences
 * @returns state and control functions for the flow
 */
export function useFlowReducer(
  permissionsGranted: boolean,
  preferences: PreferencesProps,
  loadPreferences: () => Promise<any>
) {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const locale = getLocale(preferences);

  useEffect(() => {
    loadPreferences();
    const isFirstTime = preferences.isFirstTime ?? true;
    handlePermissions(isFirstTime, permissionsGranted, dispatch);
  }, [permissionsGranted]);

  useEffect(() => {
    const { appState, conversationStatus, currentStep, userInput } = state;
    if (appState === 'navigate') return;

    // handle conversation flow (skip if in navigation mode)
    if (conversationStatus === 'speak') {
      speakConversation(currentStep, locale, dispatch);
    } else if (conversationStatus === 'listen') {
      listenConversation(appState, currentStep, userInput, preferences, loadPreferences, dispatch);
    }
  }, [state.conversationStatus, state.currentStep]);

  useEffect(() => {
    const { appState, navigationSteps, navigationIndex } = state;
    if (appState !== 'navigate' || navigationIndex < 0) return;

    // handle navigation flow (only when in navigate state and we have steps)
    speakNavigation(navigationSteps, navigationIndex, locale, dispatch);
  }, [state.navigationIndex]);

  return { state, finish: () => endNavigation(dispatch) };
}
