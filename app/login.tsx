import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Text, { TextInput } from '~/components/Text';
import ScreenView from '~/components/ScreenView';
import { useRouter } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOpen(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOpen(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleLogin = () => {
    if (!username || !password) return;
    // todo: login process
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/map');
    }, 1500);
  };

  return (
    <ScreenView title="login" goBack={true}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <MaterialIcons
              name="admin-panel-settings"
              style={[styles.logoIcon, { opacity: keyboardOpen ? 0 : 1 }]}
            />
            <Text style={styles.logoText}>truenavi admin</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <MaterialIcons name="person" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="username"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="password"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name={showPassword ? 'visibility-off' : 'visibility'}
                  style={styles.visibilityIcon}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, (!username || !password) && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={!username || !password || isLoading}>
              {isLoading ? (
                <Text style={styles.loginButtonText}>authenticating...</Text>
              ) : (
                <Text style={styles.loginButtonText}>login</Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.securityNote}>authorized personnel only</Text>
        </View>
      </TouchableWithoutFeedback>
    </ScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    fontSize: 64,
    color: '#fff',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 600,
    color: '#fff',
  },
  formContainer: {
    width: '100%',
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.7)',
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  visibilityIcon: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  loginButton: {
    backgroundColor: 'rgba(129, 176, 255, 0.8)',
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: 'rgba(129, 176, 255, 0.3)',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 600,
  },
  securityNote: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Login;
