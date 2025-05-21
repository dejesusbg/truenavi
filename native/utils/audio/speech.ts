import * as Speech from 'expo-speech';

/**
 * Speaks the provided text using the device's speech synthesis capabilities.
 *
 * @param text - The text to be spoken.
 * @param language - The language code for speech synthesis (default is 'es-ES').
 * @param options - Additional speech options such as pitch, rate, and event handlers.
 * @returns A promise that resolves when the speech operation is initiated.
 *
 * @remarks
 * This function stops any ongoing speech before starting a new one.
 * Errors during speech setup or speaking are logged to the console.
 */
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
