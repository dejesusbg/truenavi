import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScreenView, Text } from '~/components/layout';
import { FlowState } from '~/utils/flow';
import Theme from '../theme';

export function ConversationView({ state }: { state: FlowState }) {
  const router = useRouter();
  const [iconText, setIconText] = useState(['more-horiz', 'listen']);
  const { hideInput, currentStep, conversationStatus, userInput } = state;
  const { icon, output } = currentStep;

  useEffect(() => {
    const statusMap = {
      speak: ['more-horiz', 'listen'],
      listen: ['mic', 'speak'],
      default: ['emergency', 'error'],
    };

    setIconText(statusMap[conversationStatus || 'default']);
  }, [conversationStatus]);

  const [statusIcon, statusText] = iconText;
  const onPress = () => router.push('/settings');

  return (
    <ScreenView title="truenavi" icons={[{ name: 'settings', onPress }]}>
      <View style={styles.container}>
        {/* assistant's question */}
        <View style={styles.subContainer}>
          <MaterialIcons style={styles.sectionIcon} name={icon} />
          <Text style={styles.sectionText}>{output}</Text>
        </View>

        {/* separator */}
        <View style={styles.separator} />

        {/* user's answer input */}
        <View style={styles.subContainer}>
          <Text style={hideInput ? styles.sectionWaitText : styles.sectionText}>
            {hideInput ? 'waiting' : userInput}
          </Text>

          {/* status indicatior */}
          <View style={styles.statusIndicator}>
            <MaterialIcons name={statusIcon} style={styles.statusIcon} />
            <Text style={styles.statusText}>{statusText}</Text>
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
