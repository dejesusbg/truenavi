import { ConversationTurn } from './types';

// utility to map user responses to variants
export function responseVariant(
  variants: Record<string, ConversationTurn>,
  aliases = {
    yes: ['yes', 'sí', 'ok', 'okay', 'vale', 'afirmativo'],
    no: ['no', 'nope', 'negativo'],
  }
): Record<string, ConversationTurn> {
  return Object.entries(aliases).reduce(
    (map, [key, values]) => {
      for (const val of values) {
        map[val] = variants[key];
      }
      return map;
    },
    {} as Record<string, ConversationTurn>
  );
}
