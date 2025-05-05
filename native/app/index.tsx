import { useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import Theme, { Text, ScreenView, MapView, NotAllowedView } from '~/components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useConversationReducer } from '~/utils/flow';
import usePermissions from '~/hooks/usePermissions';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const permissionsGranted = usePermissions();
  const { state } = useConversationReducer(permissionsGranted);
  const [iconText, setIconText] = useState(['more-horiz', 'listen']);

  useEffect(() => {
    const statusMap = {
      speak: ['more-horiz', 'listen'],
      listen: ['mic', 'speak'],
      default: ['emergency', 'error'],
    };

    setIconText(statusMap[state.conversationState || 'default']);
  }, [state.conversationState]);

  if (state.appState === 'not-allowed') return <NotAllowedView />;
  if (state.appState === 'navigate') return <MapView />;

  const handleSettingsPress = () => router.push('/settings');
  const [icon, text] = iconText;

  return (
    <ScreenView title="truenavi" icons={[{ name: 'settings', onPress: handleSettingsPress }]}>
      <View style={styles.container}>
        {/* assistant's question */}
        <View style={styles.subContainer}>
          <MaterialIcons style={styles.sectionIcon} name={state.currentStep.icon} />
          <Text style={styles.sectionText}>{state.currentStep.output}</Text>
        </View>

        <View style={styles.separator} />

        {/* user's answer input */}
        <View style={styles.subContainer}>
          <Text style={state.userInput === 'waiting' ? styles.sectionWaitText : styles.sectionText}>
            {state.userInput}
          </Text>
          <View style={styles.statusIndicator}>
            <MaterialIcons name={icon} style={styles.statusIcon} />
            <Text style={styles.statusText}>{text}</Text>
          </View>
        </View>
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  subContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  separator: {
    width: '100%',
    backgroundColor: Theme.iconSubtle,
    height: 2,
    marginVertical: 16,
    borderRadius: 1,
  },
  sectionText: {
    fontSize: 24,
    lineHeight: 36,
    fontWeight: '600',
    color: Theme.white,
    textAlign: 'center',
    width: '100%',
  },
  sectionWaitText: {
    fontSize: 24,
    lineHeight: 36,
    fontWeight: '600',
    color: Theme.foregroundMuted,
    textAlign: 'center',
    width: '100%',
  },
  sectionIcon: {
    fontSize: 48,
    color: Theme.icon,
  },
  statusIndicator: {
    flexDirection: 'row',
    backgroundColor: Theme.status,
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusIcon: {
    fontSize: 16,
    color: Theme.foreground,
    marginRight: 6,
  },
  statusText: {
    color: Theme.foreground,
    fontSize: 14,
  },
});
