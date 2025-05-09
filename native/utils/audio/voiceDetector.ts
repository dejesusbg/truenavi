import { Audio } from 'expo-av';
import { getPlacesNames } from '~/services';
import { InputAppState } from '~/utils/flow';
import { commonInputs, normalize } from '~/utils/text';

const SILENCE_THRESHOLD = 60;
const SILENCE_TIMEOUT_MS = 1500;
const MAX_LISTEN_DURATION_MS = 10000;

export async function listen(type: InputAppState): Promise<string> {
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
        recording.stopAndUnloadAsync().then(() => resolve(simulateInput(type)));
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

// TODO: implement actual speech to text and get rid of this
export async function simulateInput(type: InputAppState): Promise<string> {
  commonInputs.place = await getPlacesNames();

  const pool: string[] = {
    config: [...commonInputs.yes, ...commonInputs.no],
    start: [...commonInputs.place, ...commonInputs.config],
  }[type];

  pool.push('pan con queso'); // placeholder for not recognized input

  const random = pool[Math.floor(Math.random() * pool.length)];
  return normalize(random);
}
