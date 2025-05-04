import { Audio } from 'expo-av';
import { normalize } from '~/utils/text';

// simulate some common voice phrases
const commonPhrases: Record<string, string[]> = {
  configurar: ['configure', 'configurar', 'settings', 'setup'],
  ayuda: ['help', 'ayuda', 'ayúdame'],
  'ir a': ['go to', 'navigate to', 'ir a', 'vamos a'],
  sí: ['yes', 'sí', 'yeah', 'ok', 'okay'],
  no: ['no', 'nope', 'no way'],
};

export class VoiceDetector {
  private recording: Audio.Recording | null = null;
  private isRecording: boolean = false;
  private timer: NodeJS.Timeout | null = null;
  private silenceTimer: NodeJS.Timeout | null = null;
  private callback: ((input: string) => void) | null = null;
  private silenceThreshold: number = 60; // dB threshold for silence detection

  constructor() {
    this.setupAudio();
  }

  private async setupAudio() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
    } catch (error) {
      console.error('[Voice] Error during setting up:', error);
    }
  }

  // start listening for voice input
  async startListening(onInputDetected: (input: string) => void) {
    if (this.isRecording) return;

    try {
      this.callback = onInputDetected;

      // create and start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      this.isRecording = true;

      // monitor recording status for sound levels
      this.recording.setOnRecordingStatusUpdate(this.onRecordingStatusUpdate);

      // set a timeout for max recording duration (10 seconds)
      this.timer = setTimeout(() => {
        this.stopListeningAndProcessInput();
      }, 10000);
    } catch (error) {
      console.error('[Voice] Error during listening:', error);
    }
  }

  // handle recording status updates
  private onRecordingStatusUpdate = (status: Audio.RecordingStatus) => {
    if (status.isRecording) {
      const { metering } = status;

      if (metering !== undefined && metering < this.silenceThreshold) {
        // detected silence
        if (!this.silenceTimer) {
          this.silenceTimer = setTimeout(() => {
            // stop recording after silence for more than 1.5 seconds
            this.stopListeningAndProcessInput();
          }, 1500);
        }
      } else {
        // detected sound, reset silence timer
        if (this.silenceTimer) {
          clearTimeout(this.silenceTimer);
          this.silenceTimer = null;
        }
      }
    }
  };

  // stop listening and process the detected input
  private async stopListeningAndProcessInput() {
    if (!this.isRecording || !this.recording) return;

    try {
      // clear timers
      if (this.timer) clearTimeout(this.timer);
      if (this.silenceTimer) clearTimeout(this.silenceTimer);

      // stop recording
      await this.recording.stopAndUnloadAsync();

      // simulate voice recognition
      this.simulateRecognition();

      this.isRecording = false;
      this.recording = null;
    } catch (error) {
      console.error('[Voice] Error during listening:', error);
    }
  }

  // simulate the recognition of a voice input
  private simulateRecognition() {
    if (!this.callback) return;

    // flatten common phrases and pick a random phrase
    const allPhrases = Object.values(commonPhrases).flat();
    const randomIndex = Math.floor(Math.random() * allPhrases.length);
    const simulatedInput = allPhrases[randomIndex];

    // normalize and send the input to the callback
    const normalizedInput = normalize(simulatedInput);
    this.callback(normalizedInput);
  }

  // for testing: Simulate specific input
  simulateSpecificInput(input: string) {
    if (this.callback) {
      this.callback(normalize(input));
    }
  }
}

export const voiceDetector = new VoiceDetector();
