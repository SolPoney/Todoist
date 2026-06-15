import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabNavigator } from './src/navigation/TabNavigator';
import { LoginScreen } from './src/screens/LoginScreen';
import { TutorialScreen } from './src/screens/TutorialScreen';
import { useAuthStore } from './src/stores/authStore';
import { useThemeStore } from './src/stores/themeStore';
import { colors } from './src/theme/colors';
import { requestNotificationPermission } from './src/utils/notifications';

const TUTORIAL_KEY = 'tutorial_seen';

export default function App() {
  const { token, isLoading, loadToken } = useAuthStore();
  const { isDark } = useThemeStore();
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialChecked, setTutorialChecked] = useState(false);

  useEffect(() => {
    loadToken();
    useThemeStore.getState().loadTheme();
    requestNotificationPermission().catch(() => {});
  }, []);

  // Check tutorial state once user is logged in
  useEffect(() => {
    if (!isLoading && token && !tutorialChecked) {
      AsyncStorage.getItem(TUTORIAL_KEY).then(seen => {
        if (!seen) setShowTutorial(true);
        setTutorialChecked(true);
      });
    }
    if (!token) {
      setTutorialChecked(false);
      setShowTutorial(false);
    }
  }, [isLoading, token]);

  async function handleTutorialDone() {
    await AsyncStorage.setItem(TUTORIAL_KEY, 'yes');
    setShowTutorial(false);
  }

  if (isLoading || (token && !tutorialChecked)) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        {!token ? (
          <LoginScreen />
        ) : showTutorial ? (
          <TutorialScreen onDone={handleTutorialDone} />
        ) : (
          <TabNavigator />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
