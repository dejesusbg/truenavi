import { Audio } from 'expo-av';
import { AppState, simulateInput } from '~/utils/flow';

const SILENCE_THRESHOLD = 60;
const SILENCE_TIMEOUT_MS = 1500;
const MAX_LISTEN_DURATION_MS = 10000;

export async function listen(appState: AppState): Promise<string> {
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
        recording.stopAndUnloadAsync().then(() => resolve(simulateInput(appState)));
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
    await Audio.setAudioModeAsync({ staysActiveInBackground: false });
  } catch (error) {
    console.error('[Audio] Error during setup:', error);
  }
}
