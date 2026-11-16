import PermissionCheckProvider from '@/presentation/providers/PermissionCheckProvider';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <PermissionCheckProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="loading/index" options={{ animation: 'none' }} />
          <Stack.Screen name="map/index" options={{ animation: 'fade' }} />
          <Stack.Screen name="permissions/index" options={{ animation: 'fade' }} />
        </Stack>
      </PermissionCheckProvider>
    </ThemeProvider>
  );
}
