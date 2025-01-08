import { View } from 'react-native';
import React, { useLayoutEffect } from 'react';
import { Avatar, Banner, Button, Card, Icon, Text } from 'react-native-paper';
import { router, useNavigation } from 'expo-router';
import { APP } from 'common';
import { theme } from '@/app/core/theme';
import { GLOBALS } from 'ui/constants/defaults';
import { useAppSelector } from '@/app/state/hooks';

const SuccessScreen = () => {
  const navigation = useNavigation();
  const engagement = useAppSelector(
    (state) => state.engagement.selectedEngagement,
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: APP._('SUCCESS_SAVE_PAGE.TITLE') });
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        // justifyContent: 'center',
        padding: 20,
        marginTop: 20,
      }}
    >
      {/* <View
        style={{
          justifyContent: 'space-between',
          alignContent: 'center',
          backgroundColor: 'red',
          alignItems: 'center',
        }}
      >
        <Card.Title
          style={{ alignSelf: 'center' }}
          // style={{ alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}
          titleStyle={{ textAlign: 'left', fontWeight: 'bold' }}
          // leftStyle={{ backgroundColor: 'red', left: '40%', justifyContent: 'center'}}
          title={APP._('GLOBAL.SAVE_SUCCESS_MESSAGE')}
          left={(props) => <Avatar.Icon {...props} icon="check" />}
        />
      </View> */}
      <Card>
        <Card.Content>
          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginBottom: 20,
            }}
          >
            <View>
              <Avatar.Icon size={40} icon="check" />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontWeight: 'bold' }} variant="bodyLarge">
                {APP._('SUCCESS_SAVE_PAGE.SAVE_SUCCESS_MESSAGE')}
              </Text>
            </View>
          </View>
          <Button
            style={{ marginVertical: 10 }}
            icon="plus-circle"
            mode="contained-tonal"
            onPress={() => {
              APP.navigateToPath(
                navigation,
                'modules/engage/screens/EngageFormScreen',
                {
                  engagement: engagement?.name,
                  entry: GLOBALS.NEW_RECORD_ID,
                },
              );
            }}
          >
            {APP._('SUCCESS_SAVE_PAGE.BUTTON.SAVE_ANOTHER_RECORD')}
          </Button>
          <Button
            style={{ marginVertical: 10 }}
            icon="arrow-left-bold-circle-outline"
            mode="text"
            onPress={() => {
              router.push('/modules/engage/screens/EngageIndexScreen');
            }}
          >
            {APP._('SUCCESS_SAVE_PAGE.BUTTON.BACK_TO_ENGAGEMENTS')}
          </Button>
        </Card.Content>
      </Card>

      <Banner
        visible={false}
        actions={[
          {
            label: 'Save Another Record',
            mode: 'contained-tonal',
            icon: 'plus-circle',
            onPress: () => {
              APP.navigateToPath(
                navigation,
                'modules/engage/screens/EngageFormScreen',
                {
                  engagement: engagement?.name,
                  entry: GLOBALS.NEW_RECORD_ID,
                },
              );
            },
          },
          {
            label: 'Back to Engagements',
            icon: 'arrow-left-bold-circle-outline',
            mode: 'contained-tonal',
            onPress: () => {
              router.push('/modules/engage/screens/EngageIndexScreen');
            },
          },
        ]}
        icon={({ size }) => (
          <Icon
            source="checkbox-marked-circle"
            color={theme.colors.primary}
            size={size}
          />
        )}
      >
        <Text
          style={{
            fontWeight: 'bold',
            textAlign: 'center',
            color: theme.colors.primary,
          }}
        >
          {APP._('GLOBAL.SAVE_SUCCESS_MESSAGE')}
        </Text>
      </Banner>
    </View>
  );
};

export default SuccessScreen;
