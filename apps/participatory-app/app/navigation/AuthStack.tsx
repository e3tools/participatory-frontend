import React from 'react';
import { Stack } from 'expo-router';

const AuthStack = () => {
  return (
    <Stack>
      <Stack.Screen
        name="screens/OnboardingScreen"
        options={{
          headerShown: false,
        }}
        getId={({ params }) => String(Date.now())}
      />
      <Stack.Screen
        name="navigation/login"
        getId={({ params }) => String(Date.now())}
      />
      <Stack.Screen
        name="navigation/register"
        getId={({ params }) => String(Date.now())}
      />
    </Stack>
  );
};

export default AuthStack;
