// import { Link, router } from 'expo-router';
// import * as WebBrowser from 'expo-web-browser';
// import React from 'react';
// import { Platform, StyleSheet } from 'react-native';

// export function ExternalLink(
//   props: Omit<React.ComponentProps<typeof Link>, 'href'> & { href: string }
// ) {
//   return (
//     <Link
//       target="_blank"
//       {...props}
//       // @ts-expect-error: External URLs are not typed.
//       href={props.href}
//       onPress={(e) => {
//         if (Platform.OS !== 'web') {
//           // Prevent the default behavior of linking to the default browser on native.
//           e.preventDefault();
//           // Open the link in an in-app browser.
//           WebBrowser.openBrowserAsync(props.href as string);
//         }
//       }}
//     />
//   );
// }

import { View, StyleSheet } from 'react-native'
import React from 'react'
import { useRouter, Link } from 'expo-router'
import { Button, Text } from 'react-native-paper';

export default function HyperLink({ label, on_press, href, style=null}) {
  const router = useRouter();
  return (
    // <Link style={styles.link} href={href} onPress={on_press}>{label}</Link>
      <Button mode='text' onPress={on_press} style={style}>
        <Text style={styles.link_text}>{label}</Text>        
      </Button>
    // <View>
    //   {/* <Text style={styles.link}
    //     onPress={on_press} 
    //   >
    //     {label}
    //   </Text> */}
    //   <Link href={href} onPress={on_press}>{label}</Link>
    // </View>
  )
}

const styles = StyleSheet.create({
  link: {
    // color: 'blue',
    flexWrap: 'nowrap',
    textDecorationLine: 'underline', 
  },
  link_text: {
    textDecorationLine: 'underline',
    paddingRight: 10,
    marginLeft: 0
  }
})