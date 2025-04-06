import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text, { fontStyle } from '~/components/Text';
import ScreenView from '~/components/ScreenView';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Home = () => {
  const router = useRouter();

  return (
    <ScreenView
      title="truenavi"
      icons={[{ name: 'settings', onPress: () => router.push('/settings') }]}>
      <View style={styles.container}>
        {/* Question */}
        <View style={styles.subContainer}>
          <Text style={styles.questionText}>where would you like to go today?</Text>
        </View>
        <View style={styles.separator}></View>
        {/* Answer */}
        <View style={styles.subContainer}>
          <MaterialIcons style={styles.answerIcon} name="place" />
          <Text style={styles.answerText}>edificio bienestar</Text>
        </View>
      </View>
    </ScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 'auto',
    gap: 20,
  },
  subContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  separator: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, .08)',
    height: 2,
  },
  questionText: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: 600,
    textAlign: 'center',
    color: '#fff',
    ...fontStyle,
  },
  answerIcon: {
    fontSize: 24,
    color: '#fff',
    ...fontStyle,
  },
  answerText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 500,
    ...fontStyle,
  },
});

export default Home;
