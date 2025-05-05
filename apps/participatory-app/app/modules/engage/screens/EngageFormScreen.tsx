import React, { useLayoutEffect } from 'react';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import MultiStepForm from '../../../views/form/multi-step-form';
import AppContainer from 'ui/components/shared/app-container';
import { Text } from 'react-native';

const EngageFormScreen = () => {
  const navigation = useNavigation();
  const { engagement, entry } = useLocalSearchParams<{
    engagement: string;
    entry: string;
  }>();

  useLayoutEffect(()=>{
    navigation.setOptions({ title: 'engagement2' });
    console.log('navigation', navigation)
  }, [navigation])

  return (
    <>
    <Stack screenOptions={{ headerShown: true, headerLargeTitle: true, title: 'engagement' }}/>
    <AppContainer>
      <MultiStepForm engagement={engagement} engagementEntry={entry} />
    </AppContainer>
    </>
  );
};

export default EngageFormScreen;
