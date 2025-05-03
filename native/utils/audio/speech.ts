import * as Speech from 'expo-speech';

export async function speak(text: string, language = 'es-ES', options = {}): Promise<void> {
  try {
    Speech.stop();

    const defaultOptions = {
      language,
      pitch: 1.0,
      rate: 1.2,
      onStart: () => console.log('[Speech] starting'),
      onDone: () => console.log('[Speech] finishing'),
      onStopped: () => console.log('[Speech] stopping'),
      onError: (error: any) => console.error('[Speech]: ', error),
    };

    const speechOptions = { ...defaultOptions, ...options };
    await Speech.speak(text, speechOptions);
  } catch (error) {
    console.error('[Speech]: ', error);
  }
}
