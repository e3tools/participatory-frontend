import { View, Text } from 'react-native';
import React, { createContext, PropsWithChildren, useContext } from 'react';
import { useCustomTheme } from '../hooks/useCustomTheme';
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';
import Colors from '../constants/Colors';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

// const CombinedLightTheme = merge(LightTheme, customLightTheme);
//const CombinedDarkTheme = merge(DarkTheme, customDarkThene);

const CombinedLightTheme = {
  ...MD3LightTheme,
  ...LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...LightTheme.colors,
    ...Colors.light,
  },
};

const CombinedDarkTheme = {
  ...MD3DarkTheme,
  ...DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...DarkTheme.colors,
    ...Colors.dark,
  },
};

type IAppThemeContext = {
  theme: object | null;
};

const AppThemeContext = createContext<IAppThemeContext | undefined>(undefined);

type AppThemeProps = PropsWithChildren;

export default function AppThemeProvider({ children }: AppThemeProps) {
  const { colorScheme } = useCustomTheme();
  const paperTheme =
    colorScheme === 'dark' ? CombinedDarkTheme : CombinedLightTheme;

  return (
    <AppThemeContext.Provider
      value={{
        theme: paperTheme,
      }}
    >
      <PaperProvider theme={paperTheme}>{children}</PaperProvider>
    </AppThemeContext.Provider>
  );

  // return <PaperProvider theme={paperTheme}>{children}</PaperProvider>;
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);

  if (context === undefined) {
    throw new Error('useAppTheme must be used inside of an AppThemeProvider');
  }

  return context;
}
