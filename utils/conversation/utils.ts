import { conversationFlow } from './flow';
import { LocalizedText, ConversationFlow as FlowType } from './types';

// utility to get output according to a step and language
export function t(flow: keyof FlowType, local: keyof LocalizedText) {
  return conversationFlow[flow].output[local];
}
