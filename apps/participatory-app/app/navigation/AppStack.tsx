import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function AppStack() {
  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
        name="(drawer)"
        options={{
          headerShown: false,
          title: 'Drawer Home',
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
