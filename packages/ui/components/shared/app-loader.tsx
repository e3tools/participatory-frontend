import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ActivityIndicator, useTheme } from 'react-native-paper';  

type Props = {
  loadingText?: string;
};

export default function AppLoader(props: Props) {
  const theme = useTheme()
  return (
    <View style={{
      alignItems: 'center',
      alignContent: 'center',
      display: 'flex'
    }}>
      <ActivityIndicator
        color={theme.colors.primary}
        animating={true}
        size={40}
        {...props}
      />
      <Text style={{ marginTop: 5}}>{props.loadingText}</Text>
    </View>
  );
  return (
    <View style={[StyleSheet.absoluteFill, styles.loader]}>
      <ActivityIndicator color="#fff" animating={true} size={40} {...props} />
      {/* <Text style={{ flex: 1 }}>{loadingText}</Text> */}
    </View>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loader: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  indicator: {
    flex: 1
  }
})