import { useRouter, useGlobalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

export const useCustomTheme = () => {
  const router = useRouter();
  const { colorScheme: globalColorScheme } = useGlobalSearchParams();
  const [localColorScheme, setLocalColorScheme] = useState(
    globalColorScheme || 'light',
  );

  useEffect(() => {
    if (globalColorScheme && globalColorScheme !== localColorScheme) {
      setLocalColorScheme(globalColorScheme);
    }
  }, [globalColorScheme, localColorScheme]);

  const toggleColorScheme = () => {
    const newScheme = localColorScheme === 'light' ? 'dark' : 'light';
    setLocalColorScheme(newScheme);
    router.setParams({ colorScheme: newScheme });
  };

  return { toggleColorScheme, colorScheme: localColorScheme };
};
