export interface Conversation {
  [key: string]: ConversationStep;
}

export interface ConversationStep {
  icon: string;
  output: string;
  action: (input: any) => Promise<any>;
  nextId: string;
}

export const appStates = ['not-allowed', 'config', 'start', 'navigate'];
export type AppState = (typeof appStates)[number];
export type ConversationState = 'speak' | 'listen' | null;

export interface HomeState {
  appState: AppState;
  conversationState: ConversationState;
  currentStep: ConversationStep;
  userInput: string;
  isFirstTime: boolean;
}

export type HomeAction =
  | { type: 'SET_APP_STATE'; payload: AppState }
  | { type: 'SET_CONVERSATION_STATE'; payload: ConversationState }
  | { type: 'SET_STEP'; payload: ConversationStep }
  | { type: 'SET_USER_INPUT'; payload: string }
  | { type: 'NEXT_STEP' }
  | { type: 'HANDLE_PERMISSIONS'; payload: boolean };
