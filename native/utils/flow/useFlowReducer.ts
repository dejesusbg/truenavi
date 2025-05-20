import { useEffect, useReducer } from 'react';
import usePreferencesContext from '~/context/PreferencesProvider';
import { usePermissions } from '~/hooks/usePermissions';
import { getLocale } from '~/services';
import { handlePermissions, speakStepOutput } from './conversation';
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
 * Custom hook that manages the flow state and side effects for the application.
 *
 * @returns An object containing the current flow state and a dispatch function to update the state.
 *
 * @remarks
 * - Loads user preferences on mount.
 * - Handles permission changes and updates the flow state accordingly.
 * - Triggers speech output or navigation instructions based on the current state.
 */
export function useFlowReducer() {
  const permissionsGranted = usePermissions();
  const { preferences, loadPreferences } = usePreferencesContext();
  const [state, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    handlePermissions(permissionsGranted, preferences.isFirstTime!, dispatch);
  }, [permissionsGranted]);

  useEffect(() => {
    const locale = getLocale(preferences.spanish!);

    if (state.appState !== 'navigate' && state.conversationStatus === 'speak') {
      speakStepOutput(state, locale, dispatch);
    } else if (state.appState === 'navigate' && state.navigationIndex >= 0) {
      speakNavigationInstruction(state, locale, dispatch);
    }
  }, [state.conversationStatus, state.currentStep, state.navigationIndex]);

  return { state, dispatch };
}
