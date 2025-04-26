import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice/dist';
import { useState, useEffect, useCallback } from 'react';

export const useSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = (e) => {
      if (e.value && e.value[0]) {
        setTranscript(e.value[0]);
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const speak = useCallback((text: string) => {
    Speech.stop();

    setIsSpeaking(true);
    Speech.speak(text, {
      language: 'es',
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
    });
  }, []);

  const startListening = useCallback(async () => {
    try {
      await Voice.start('es-ES');
      setIsListening(true);
    } catch (error) {
      console.error('Error starting voice recognition:', error);
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    transcript,
    isListening,
    isSpeaking,
    speak,
    startListening,
    stopListening,
    resetTranscript,
  };
};
