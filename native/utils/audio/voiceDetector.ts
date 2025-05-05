import { Audio } from 'expo-av';
import { normalize } from '~/utils/text';

const commonPhrases: Record<string, string[]> = {
  // config: ['configure', 'configurar', 'settings', 'setup'],
  '': ['asklda', 'asdas', 'qweqwd', 'asda', 'asdasf'],
  yes: ['yes', 'sí', 'yeah', 'ok', 'okay'],
  no: ['no', 'nope', 'no way', 'negative', 'no gracias'],
};

const SILENCE_THRESHOLD = 60;
const SILENCE_TIMEOUT_MS = 1500;
const MAX_LISTEN_DURATION_MS = 10000;

export async function listen(): Promise<string> {
  try {
    await setupAudio();

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    return await new Promise<string>((resolve) => {
      let silenceTimer: NodeJS.Timeout | null = null;

      const stop = async () => {
        silenceTimer && clearTimeout(silenceTimer);
        clearTimeout(timeoutTimer);
        recording.stopAndUnloadAsync().then(() => resolve(getSimulatedInput()));
      };

      const timeoutTimer = setTimeout(stop, MAX_LISTEN_DURATION_MS);

      recording.setOnRecordingStatusUpdate((status: any) => {
        const metering = status.metering;
        if (!status.isRecording) return;

        if (metering < SILENCE_THRESHOLD) {
          if (!silenceTimer) silenceTimer = setTimeout(stop, SILENCE_TIMEOUT_MS);
        } else {
          silenceTimer && clearTimeout(silenceTimer);
          silenceTimer = null;
        }
      });
    });
  } catch (error) {
    console.error('[Listen] Error during listening:', error);
    return '';
  }
}

async function setupAudio() {
  try {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
  } catch (error) {
    console.error('[Audio] Error during setup:', error);
  }
}

function getSimulatedInput(): string {
  const phrases = Object.values(commonPhrases).flat();
  const random = phrases[Math.floor(Math.random() * phrases.length)];
  return normalize(random);
}

export function getStandarizedInput(input: string): string {
  for (const [key, phrases] of Object.entries(commonPhrases)) {
    if (phrases.includes(normalize(input))) {
      return key;
    }
  }
  return input;
}

export function getBooleanInput(input: string): boolean {
  return getStandarizedInput(input) === 'yes';
}
