import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Text from '~/components/Text';
import ScreenView from '~/components/ScreenView';
import { useRouter } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { conversationFlow, handleConversationInput, ConversationTurn } from '~/utils/conversation';
import usePermissions from '~/hooks/usePermissions';
import { useSpeech } from '~/utils/speech';

const Home = () => {
  const router = useRouter();
  const { speak, startListening, stopListening } = useSpeech();
  const permissionsGranted = usePermissions();
  const [step, setStep] = useState<ConversationTurn>(conversationFlow.navigation);
  const [input, setInput] = useState<string>('edificio bienestar');
  const isSpeaking = true,
    isListening = true;
  // const {
  //   transcript,
  //   isListening,
  //   isSpeaking,
  //   speak,
  //   startListening,
  //   stopListening,
  //   resetTranscript,
  // } = useSpeech();

  // useEffect(() => {
  //   speak(step.out.es);
  // }, []);

  // useEffect(() => {
  //   if (isSpeaking) return;
  //   // startListening();
  //   // handleConversationInput(step.out.es, transcript);
  // }, []);

  return permissionsGranted ? (
    <ScreenView
      title="truenavi"
      icons={[{ name: 'settings', onPress: () => router.push('/settings') }]}>
      <View style={styles.container}>
        {/* question */}
        <View style={styles.subContainer}>
          <MaterialIcons style={styles.sectionIcon} name={step.out.icon} />
          <Text style={styles.sectionText}>{step.out.es}</Text>
        </View>

        <View style={styles.separator}></View>

        {/* answer */}
        <View style={styles.subContainer}>
          <Text style={styles.sectionText}>{input}</Text>
          <View style={styles.statusIndicator}>
            <MaterialIcons
              name={isSpeaking ? 'volume-off' : isListening ? 'mic' : 'more-horiz'}
              style={styles.statusIcon}
            />
            <Text style={styles.statusText}>you</Text>
          </View>
        </View>
      </View>
    </ScreenView>
  ) : (
    <ScreenView>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <MaterialIcons name="location-off" style={styles.sectionIcon} />
          <TouchableOpacity onPress={() => Linking.openSettings()}>
            <Text style={styles.sectionText}>
              abre los ajustes para activar los permisos necesarios para que Truenavi funcione
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 'auto',
  },
  subContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  separator: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, .08)',
    height: 2,
    marginVertical: 16,
    borderRadius: 1,
  },
  sectionText: {
    fontSize: 24,
    lineHeight: 36,
    fontWeight: 600,
    color: '#fff',
    textAlign: 'center',
  },
  sectionIcon: {
    fontSize: 48,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statusIndicator: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusIcon: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    marginRight: 6,
  },
  statusText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
});

export default Home;
