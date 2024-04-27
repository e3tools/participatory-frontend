import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import WebView from 'react-native-webview';

const ViewerWeb = (props) => {
  const { url } = props; 
    // return <WebView source={{ uri: 'https://reactnative.dev/' }} style={{ flex: 1 }} />;
    return <WebView 
              // source={{ html: '<h1>Hello world</h1>' }} 
              source={{ uri: url }}
              style={{ flex: 1 }} 
            />;
}

export default ViewerWeb

// const styles = StyleSheet.create({})

// import { WebView } from 'react-native-webview';

// // ...
// const MyWebComponent = () => {
//   return <WebView source={{ uri: 'https://reactnative.dev/' }} style={{ flex: 1 }} />;
// }