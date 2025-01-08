import { StyleSheet, View } from 'react-native';
import React from 'react';
// import EngagementHeader from './EngagementHeader';
// import EngagementBody from './EngagementBody';
// import EngagementFooter from './EngagementFooter';
import { theme } from '@/app/core/theme';
// import { Engagement } from '@/app/state/state.types';
import {
  Avatar,
  Button,
  Card,
  FAB,
  IconButton,
  Text,
  Tooltip,
} from 'react-native-paper';
import { APP } from 'common';
import { router, useNavigation } from 'expo-router';
import { GLOBALS } from 'ui/constants/defaults';
import { getDaysBetweenDates } from 'common/utils/date';
import { useAppDispatch } from 'auth/state/store';
import { selectEngagement } from '@/app/state/engagement/engagementSlice';
import { useAppSelector } from '@/app/state/hooks';
import AppContainer from 'ui/components/shared/app-container';

const getRemainingDaysDesc = (closingDate: Date | undefined) => {
  if (!closingDate) {
    return '';
  }
  const days = getDaysBetweenDates(new Date(), closingDate);
  return (days || 0) > 0 ? `${days} day(s) to go` : '';
};

const EngagementDetail = () => {
  const iconSize = 16;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const engagement = useAppSelector(
    (state) => state.engagement.selectedEngagement,
  );

  return (
    <AppContainer>
      <Card>
        <Card.Cover source={require('../../../assets/images/feedback.png')} />
        <Card.Title
          title={engagement?.engagement_name}
          titleStyle={{ fontWeight: 'bold' }}
          subtitle={getRemainingDaysDesc(engagement?.closing_date)}
          left={(props) => <Avatar.Icon {...props} icon="folder" />}
          right={(props) => (
            <IconButton {...props} icon="dots-vertical" onPress={() => {}} />
          )}
        />
        <Card.Content>
          <Text variant="bodyMedium">{engagement?.description}</Text>
        </Card.Content>
        <Card.Actions>
          <Button
            icon="plus"
            onPress={() => {
              router.push({
                // pathname: '/views/form/MultiStepForm',
                pathname: '/modules/engage/screens/EngageFormScreen',
                params: {
                  engagement: engagement?.name || '',
                  entry: GLOBALS.NEW_RECORD_ID,
                },
              });
            }}
          >
            {APP._('SUBMISSIONS_PAGE.BUTTONS.NEW_SUBMISSION')}
          </Button>
        </Card.Actions>
      </Card>
    </AppContainer>
  );

  return (
    // <View key={engagement.name} style={styles.card}>
    //   <EngagementHeader engagement={engagement} />
    //   <EngagementBody engagement={engagement} />
    //   <EngagementFooter engagement={engagement} />
    // </View>
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={engagement?.engagement_name}
          subtitle={getRemainingDaysDesc(engagement?.closing_date)}
          titleStyle={{ fontWeight: 'bold' }}
          subtitleStyle={{ fontSize: 10, marginTop: -10, fontStyle: 'italic' }}
          left={(props) => <Avatar.Icon {...props} icon="folder" />}
          right={(props) => (
            <IconButton
              {...props}
              size={iconSize}
              icon="open-in-new"
              mode="contained"
              onPress={() => {}}
            />
          )}
        />
        <Card.Content>
          <View style={styles.contentWrapper}>
            <Tooltip title={engagement?.description}>
              <Text
                numberOfLines={3}
                ellipsizeMode="tail"
                style={styles.content}
              >
                {engagement?.description}
              </Text>
            </Tooltip>
          </View>
        </Card.Content>
        <Card.Actions>
          <FAB
            icon="comment-plus"
            label="Add New"
            customSize={30}
            mode="flat"
            onPress={() => {
              dispatch(selectEngagement(engagement));
              APP.navigateToPath(
                navigation,
                'modules/engage/screens/EngageFormScreen',
                {
                  engagement: engagement.name,
                  entry: GLOBALS.NEW_RECORD_ID,
                },
              );
            }}
          />
          {/* <IconButton
            size={iconSize}
            icon="comment-plus"
            mode="contained"
            onPress={() => {}}
          /> */}
        </Card.Actions>
      </Card>
    </View>
  );
};

export default EngagementDetail;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 5,
  },
  card: {
    borderRadius: 5,
    borderColor: theme.colors.tertiary, //.error,
    // borderBottomWidth: 2,
    borderWidth: 1,
    padding: 5,
    margin: 5,
  },
  contentWrapper: {
    height: 50,
  },
  content: {
    textAlign: 'justify',
  },
  image: {
    height: 100,
    width: 150,
  },
});
