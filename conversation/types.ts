export interface LocalizedText {
  en: string;
  es: string;
  icon: string;
}

export interface ConversationTurn {
  input?: LocalizedText;
  output: LocalizedText;
  next?: Record<string, ConversationTurn> | ConversationTurn;
  action: () => void;
}

export interface ConversationFlow {
  navigation: ConversationTurn;
  config: ConversationTurn;
  fallback: ConversationTurn;
}
