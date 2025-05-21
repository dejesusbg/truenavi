import { Dispatch } from 'react';
import { NodeProps } from '~/services';

// states
export type AppState = 'not-allowed' | InputAppState | 'navigate';
export type InputAppState = 'config' | 'start';
export type ConversationStatus = 'speak' | 'listen' | null;
export type Input = string | boolean | null;

// steps
export interface ConversationStep {
  icon: string;
  output: string;
  action: (input: Input) => Promise<any>;
  nextId: string;
}

export interface InstructionStep {
  icon: string;
  output: string;
}

export interface NavigationStep {
  id: string;
  value: string;
  start?: NodeProps;
  end?: NodeProps;
}

// flow
export interface FlowState {
  appState: AppState;
  conversationStatus: ConversationStatus;
  currentStep: ConversationStep;
  userInput: string;
  hideInput: boolean;
  navigationSteps: NavigationStep[];
  navigationIndex: number;
  path: NodeProps[];
  destination: string;
}

// reducer actions
export type FlowAction =
  | { type: 'SET_APP_STATE'; payload: AppState }
  | { type: 'SET_CONVERSATION_STATUS'; payload: ConversationStatus }
  | { type: 'SET_CURRENT_STEP'; payload: ConversationStep }
  | { type: 'SET_USER_INPUT'; payload: string }
  | { type: 'HIDE_INPUT'; payload: boolean }
  | { type: 'START_NAVIGATION'; steps: NavigationStep[]; path: NodeProps[] }
  | { type: 'END_NAVIGATION' }
  | { type: 'NEXT_INSTRUCTION' }
  | { type: 'SET_DESTINATION'; payload: string };

export type FlowDispatch = Dispatch<FlowAction>;

export interface FlowReducer {
  state: FlowState;
  dispatch: FlowDispatch;
}
