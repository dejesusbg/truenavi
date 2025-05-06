import * as Speech from 'expo-speech';

export async function speak(text: string, language = 'es-ES', options = {}): Promise<void> {
  try {
    Speech.stop();

    const speechOptions = {
      language,
      pitch: 1.0,
      rate: 1.2,
      onError: (error: any) => console.error('[Speech] Error during speaking:', error),
      ...options,
    };

    Speech.speak(text, speechOptions);
  } catch (error) {
    console.error('[Speech] Error during setup:', error);
  }
}
