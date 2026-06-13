import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { TabNavigator } from './src/navigation/TabNavigator';
import { LoginScreen } from './src/screens/LoginScreen';
import { useAuthStore } from './src/stores/authStore';
import { colors } from './src/theme/colors';

export default function App() {
  const { token, isLoading, loadToken } = useAuthStore();

  // Au démarrage, recharge le token depuis AsyncStorage
  useEffect(() => {
    loadToken();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        {token ? <TabNavigator /> : <LoginScreen />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
