import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Card, Text, Switch } from 'react-native-paper';
import { useCustomTheme } from '@/app/hooks/useCustomTheme';

const Settingss = () => {
  const { toggleColorScheme, colorScheme } = useCustomTheme();

  return (
    <View>
      <Card>
        {/* <Card.Title title="Settings" subtitle="Modify settings" /> */}
        <Card.Content>
          <View style={styles.container}>
            <View style={styles.switchContainer}>
              <Text variant="bodySmall">Dark Mode</Text>
              <Switch
                value={colorScheme === 'dark'}
                onValueChange={toggleColorScheme}
              />
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

export default Settingss;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switch: {
    marginLeft: 20,
  },
});
