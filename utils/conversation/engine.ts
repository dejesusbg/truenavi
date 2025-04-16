import { ConversationTurn } from './types';

// normaliza la entrada del usuario para facilitar comparaciones.
function normalize(input: string): string {
  return input.trim().toLowerCase();
}

// ejecuta el paso actual y resuelve el siguiente ConversationTurn.
export function handleConversationInput(
  current: ConversationTurn,
  userInput: string
): ConversationTurn {
  const input = normalize(userInput);

  current.action();

  // si no hay pasos siguientes, retornar el actual
  if (!current.next) return current;
  // si next es un solo paso (no un objeto), ir directo
  if (!isNextRecord(current.next)) {
    return current.next;
  }

  // buscar una coincidencia exacta
  if (current.next[input]) {
    return current.next[input];
  }
  // si hay comodín '*', usarlo como fallback
  if (current.next['*']) {
    return current.next['*'];
  }
  // si no se reconoce la entrada, retornar el mismo paso (o podrías devolver fallback)
  return current;
}

// verifica si el tipo de `next` es un objeto con múltiples variantes.
function isNextRecord(
  next: Record<string, ConversationTurn> | ConversationTurn
): next is Record<string, ConversationTurn> {
  return typeof next === 'object' && !('output' in next);
}
