// types
export interface LocalizedText {
  en: string;
  es: string;
  icon: string;
}

export interface ConversationTurn {
  out: LocalizedText;
  next?: ConversationTurn;
  action: (input: string) => void;
}

export interface ConversationFlow {
  [key: string]: ConversationTurn;
}

// utils
const normalize = (input: string) => input.trim().toLowerCase();

// execution
export function handleConversationInput(
  current: ConversationTurn,
  userInput: string
): ConversationTurn {
  const input = normalize(userInput);
  current.action(input);
  if (!current.next) return current;
  return current.next;
}
