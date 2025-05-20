import { useEffect, useReducer } from 'react';
import usePreferencesContext from '~/context/PreferencesProvider';
import { getLocale } from '~/services';
import { awaitListening, handlePermissions, speakStepOutput } from './conversation';
import { speakNavigationInstruction } from './navigation';
import { flow } from './steps';
import { FlowAction, FlowState } from './types';

export const defaultState: FlowState = {
  appState: 'start',
  conversationStatus: null,
  currentStep: flow.config,
  userInput: '',
  hideInput: true,
  navigationSteps: [],
  navigationIndex: -1,
  path: [],
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
      return { ...state, navigationSteps: action.steps, path: action.path, navigationIndex: 0 };
    case 'END_NAVIGATION':
      return { ...state, navigationSteps: [], path: [], navigationIndex: -1 };
    case 'NEXT_INSTRUCTION':
      return { ...state, navigationIndex: state.navigationIndex + 1 };
    default:
      return state;
  }
};

/**
 * Custom hook that manages the flow state and side effects for the application's conversation and navigation logic.
 *
 * @param permissionsGranted - Indicates whether the required permissions have been granted.
 * @param preferences - User preferences including language, weather, and first-time usage flags.
 * @param loadPreferences - Async function to reload user preferences.
 * @returns An object containing the current flow state and a dispatch function to update the state.
 *
 * @remarks
 * - Handles permission checks and updates the flow state accordingly.
 * - Manages conversation (speak/listen) and navigation flow based on the current state or mode.
 */
export function useFlowReducer(permissionsGranted: boolean) {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const { preferences, loadPreferences } = usePreferencesContext();

  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    handlePermissions(permissionsGranted, preferences.isFirstTime!, dispatch);
  }, [permissionsGranted]);

  useEffect(() => {
    // only run if appState is 'navigate'
    if (state.appState !== 'navigate') return;

    const locale = getLocale(preferences.spanish!);
    if (state.navigationIndex >= 0) speakNavigationInstruction(state, locale, dispatch);
  }, [state.navigationIndex]);

  useEffect(() => {
    // only run if appState is 'start' || 'config'
    if (state.appState === 'navigate') return;

    if (state.conversationStatus === 'speak') {
      const locale = getLocale(preferences.spanish!);
      speakStepOutput(state, locale, dispatch);
    } else if (state.conversationStatus === 'listen') {
      awaitListening(state, preferences.weather!, loadPreferences, dispatch);
    }
  }, [state.conversationStatus, state.currentStep]);

  return { state, dispatch };
}
