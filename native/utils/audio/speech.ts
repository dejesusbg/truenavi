import * as Speech from 'expo-speech';

export async function speak(text: string, language = 'es-ES', options = {}): Promise<void> {
  try {
    Speech.stop();

    const defaultOptions = {
      language,
      pitch: 1.0,
      rate: 1.2,
      onStart: () => console.log('[speech] starting'),
      onDone: () => console.log('[speech] finishing'),
      onStopped: () => console.log('[speech] stopping'),
      onError: (error: any) => console.error('[speech]: ', error),
    };

    const speechOptions = { ...defaultOptions, ...options };
    await Speech.speak(text, speechOptions);
  } catch (error) {
    console.error('[speech]: ', error);
  }
}
