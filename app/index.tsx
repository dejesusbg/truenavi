import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import Text, { fontStyle } from '~/components/Text';
import ScreenView from '~/components/ScreenView';
import { useRouter } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { conversationFlow, handleConversationInput, ConversationTurn } from '~/utils/conversation';
import usePermissions from '~/hooks/usePermissions';

const Home = () => {
  const router = useRouter();
  const permissionsGranted = usePermissions();
  const [step, setStep] = useState<ConversationTurn>(conversationFlow.navigation);
  const [lastInput, setLastInput] = useState<string>('edificio bienestar'); // hardcoded for now

  // simular un input al iniciar el componente (puedes poner esto tras un botón también)
  useEffect(() => {
    if (step !== conversationFlow.config) return;
    const nextStep = handleConversationInput(step, lastInput);
    setStep(nextStep);
  }, [step]);

  return permissionsGranted ? (
    <ScreenView
      title="truenavi"
      icons={[{ name: 'settings', onPress: () => router.push('/settings') }]}>
      <View style={styles.container}>
        {/* question */}
        <View style={styles.subContainer}>
          <MaterialIcons style={styles.sectionIcon} name={step.output.icon} />
          <Text style={styles.sectionText}>{step.output.es}</Text>
        </View>
        <View style={styles.separator}></View>
        {/* answer */}
        <View style={styles.subContainer}>
          <Text style={styles.sectionText}>{lastInput}</Text>
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
              abre los ajustes para activar los permisos necesarios para que truenavi funcione
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
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Platform.OS === 'web' ? 16 : 32,
  },
  separator: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, .08)',
    height: 2,
    marginVertical: Platform.OS === 'web' ? 8 : 16,
    borderRadius: 1,
  },
  sectionText: {
    fontSize: 24,
    lineHeight: 36,
    fontWeight: 600,
    color: '#fff',
    textAlign: 'center',
    ...fontStyle,
  },
  sectionIcon: {
    fontSize: Platform.OS === 'web' ? 32 : 48,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default Home;
