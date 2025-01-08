import { StyleSheet, View } from 'react-native';
import React from 'react';
import { theme } from 'ui/components/theme/theme';
import { Engagement } from '../../../state/state.types';
import {
  Avatar,
  Card,
  FAB,
  IconButton,
  Text,
  Tooltip,
} from 'react-native-paper';
import { router, useNavigation } from 'expo-router';
import { GLOBALS } from 'ui/constants/defaults';
import { getDaysBetweenDates } from 'common/utils/date';
import { useAppDispatch } from 'auth/state/store';
import { selectEngagement } from '../../../state/engagement/engagementSlice';

const getRemainingDaysDesc = (closingDate: Date | undefined) => {
  if (!closingDate) {
    return '';
  }
  const days = getDaysBetweenDates(new Date(), closingDate);
  return `${days} day(s) to go`;
};

const EngagementItem = ({ engagement }: { engagement: Engagement }) => {
  const iconSize = 16;
  const dispatch = useAppDispatch();

  return (
    // <View key={engagement.name} style={styles.card}>
    //   <EngagementHeader engagement={engagement} />
    //   <EngagementBody engagement={engagement} />
    //   <EngagementFooter engagement={engagement} />
    // </View>
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={engagement.engagement_name}
          subtitle={getRemainingDaysDesc(engagement.closing_date)}
          titleStyle={{ fontWeight: 'bold' }}
          subtitleStyle={{ fontSize: 10, marginTop: -10, fontStyle: 'italic' }}
          left={(props) => <Avatar.Icon {...props} icon="folder" />}
          right={(props) => (
            <IconButton
              {...props}
              size={iconSize}
              icon="open-in-new"
              mode="contained"
              onPress={() => {
                dispatch(selectEngagement(engagement));
                router.push('/modules/engage/components/EngagementDetail');
              }}
            />
          )}
        />
        <Card.Content>
          <View style={styles.contentWrapper}>
            <Tooltip title={engagement.description}>
              <Text
                numberOfLines={3}
                ellipsizeMode="tail"
                style={styles.content}
              >
                {engagement.description}
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
              router.push({
                // pathname: '/views/form/MultiStepForm',
                pathname: '/modules/engage/screens/EngageFormScreen',
                params: {
                  engagement: engagement?.name || '',
                  entry: GLOBALS.NEW_RECORD_ID,
                },
              });
              // APP.navigateToPath(navigation, 'modules/engage/screens/EngageFormScreen', {
              //   engagement: engagement.name,
              //   entry: GLOBALS.NEW_RECORD_ID,
              // });
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

export default EngagementItem;

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
});
