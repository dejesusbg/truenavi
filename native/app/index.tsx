import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '~/components/Text';
import ScreenView from '~/components/layout/ScreenView';
import { useRouter } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { conversationFlow, ConversationTurn } from '~/utils/conversation';
import usePermissions from '~/hooks/usePermissions';
import NavigationView from '~/components/ui/Navigation';
import NotAllowedView from '~/components/ui/NotAllowed';

type AppState = 'not-allowed' | 'speaking' | 'listening' | 'navigating';

const Home = () => {
  const router = useRouter();
  const permissionsGranted = usePermissions();
  const [appState, setAppState] = useState<AppState>('not-allowed');
  const [step, setStep] = useState<ConversationTurn>(conversationFlow.fallback);
  const [input, setInput] = useState<string>('si');

  useEffect(() => {
    setAppState(permissionsGranted ? 'navigating' : 'not-allowed');
  }, [permissionsGranted]);

  if (appState === 'not-allowed') return <NotAllowedView />;
  if (appState === 'navigating') return <NavigationView />;

  return (
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
              name={appState === 'speaking' ? 'volume-off' : 'mic'}
              style={styles.statusIcon}
            />
            <Text style={styles.statusText}>you</Text>
          </View>
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
