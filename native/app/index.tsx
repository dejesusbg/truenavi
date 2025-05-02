import { useRouter } from 'expo-router';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Theme, { Text, TextInput, ScreenView, MapView, NotAllowedView } from '~/components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ConversationState, useConversationReducer } from '~/utils/conversation';
import usePermissions from '~/hooks/usePermissions';

function getStatus(conversationState: ConversationState) {
  const [icon, text] =
    conversationState === 'speak'
      ? ['more-horiz', 'wait']
      : conversationState === 'listen'
        ? ['mic', 'speak']
        : ['emergency', 'error'];

  return (
    <View style={styles.statusIndicator}>
      <MaterialIcons name={icon} style={styles.statusIcon} />
      <Text style={styles.statusText}>{text}</Text>
    </View>
  );
}

export default function Home() {
  const router = useRouter();
  const permissionsGranted = usePermissions();
  const { state, dispatch } = useConversationReducer(permissionsGranted);

  const handleSubmit = () => dispatch({ type: 'SUBMIT_INPUT' });
  const handleChangeText = (text: string) => dispatch({ type: 'SET_USER_INPUT', payload: text });

  if (state.appState === 'not-allowed') return <NotAllowedView />;
  if (state.appState === 'navigate') return <MapView />;

  return (
    <ScreenView
      title="truenavi"
      icons={[{ name: 'settings', onPress: () => router.push('/settings') }]}>
      <View style={styles.container}>
        {/* assistant's question */}
        <View style={styles.subContainer}>
          <MaterialIcons style={styles.sectionIcon} name={state.currentStep.icon} />
          <Text style={styles.sectionText}>{state.currentStep.output}</Text>
        </View>

        <View style={styles.separator} />

        {/* user's answer input */}
        <View style={styles.subContainer}>
          <TextInput
            style={styles.sectionText}
            value={state.userInput}
            onChangeText={handleChangeText}
            editable={state.conversationState === 'listen'}
          />
          <TouchableOpacity onPress={handleSubmit} disabled={state.conversationState !== 'listen'}>
            {getStatus(state.conversationState)}
          </TouchableOpacity>
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
