// states
export const validAppStates = ['not-allowed', 'config', 'start', 'navigate'];
export type AppState = 'not-allowed' | InputAppState | 'navigate';
export type InputAppState = 'config' | 'start';
export type ConversationStatus = 'speak' | 'listen' | null;

// steps
export interface ConversationStep {
  icon: string;
  output: string;
  action: (input: any) => Promise<any>;
  nextId: string;
}

export interface InstructionStep {
  icon: string;
  output: string;
}

export interface NavigationStep {
  id: string;
  value: string;
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
  destination: string;
}

// reducer actions
export type FlowAction =
  | { type: 'SET_APP_STATE'; payload: AppState }
  | { type: 'SET_CONVERSATION_STATUS'; payload: ConversationStatus }
  | { type: 'SET_CURRENT_STEP'; payload: ConversationStep }
  | { type: 'SET_USER_INPUT'; payload: string }
  | { type: 'HIDE_INPUT'; payload: boolean }
  | { type: 'START_NAVIGATION'; payload: NavigationStep[] }
  | { type: 'END_NAVIGATION' }
  | { type: 'NEXT_INSTRUCTION' }
  | { type: 'SET_DESTINATION'; payload: string };
