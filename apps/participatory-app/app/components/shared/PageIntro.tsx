import { theme } from '@/app/core/theme';
import React from 'react';
import { View } from 'react-native';
import { Banner, Icon, Text } from 'react-native-paper';

const PageIntro = ({
  text,
  showImage = true,
}: {
  text: string;
  showImage?: boolean;
}) => {
  if (!showImage) {
    return (
      <View
        style={{
          // backgroundColor: theme.colors.inversePrimary,
          borderWidth: 2,
          borderStyle: 'solid',
          borderColor: 'red',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          {text}
        </Text>
      </View>
    );
  }
  return (
    <View
      style={{
        marginVertical: 3,
        marginHorizontal: 5,
        borderColor: theme.colors.error,
        borderWidth: 1,
      }}
    >
      <Banner
        style={
          {
            /*marginTop: -20, marginHorizontal: 5,
          // borderColor: theme.colors.onErrorContainer,
          // borderWidth: 1,*/
          }
        }
        visible={true}
        icon={({ size }) =>
          showImage ? <Icon source="help-network" size={size} /> : null
        }
      >
        <Text
          style={{
            textAlign: 'justify',
            fontWeight: 'bold',
            // backgroundColor: theme.colors.inversePrimary,
          }}
        >
          {text}
        </Text>
      </Banner>
    </View>
  );
};

export default PageIntro;
