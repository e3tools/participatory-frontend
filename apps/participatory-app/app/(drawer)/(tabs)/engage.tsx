import EngagementIndexScreen from '@/app/modules/engage/screens/EngageIndexScreen';
import { APP } from 'common';
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

const EngageHomePage = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ title: APP._('ENGAGEMENT_LIST_PAGE.TITLE') });
  }, [navigation]);

  return <EngagementIndexScreen />;
};

export default EngageHomePage;
