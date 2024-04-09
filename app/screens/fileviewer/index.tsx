// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import ViewerWeb from '@/app/components/base/ViewerWeb'
// import { useLocalSearchParams } from 'expo-router'

// const ViewFile = () => {
//     const params = useLocalSearchParams();
//     const { url } = params;
//   return (
//     <View>
//       <ViewerWeb url={url} />
//     </View>
//   )
// }

// export default ViewFile

// const styles = StyleSheet.create({})

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { WebView } from 'react-native-webview';

const ViewFile = (url) => {
  return (
    <WebView
    //   source={{ uri: 'https://expo.dev' }}
        source={{ uri: 'https://web.pdx.edu/~nauna/week7b-neuralnetwork.pdf' }}
    />
  )
}

export default ViewFile

const styles = StyleSheet.create({})