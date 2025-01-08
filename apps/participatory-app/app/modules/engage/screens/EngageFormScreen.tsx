import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import MultiStepForm from '../../../views/form/multi-step-form';
import AppContainer from 'ui/components/shared/app-container';

const EngageFormScreen = () => {
  const { engagement, entry } = useLocalSearchParams<{
    engagement: string;
    entry: string;
  }>();

  return (
    <AppContainer>
      <MultiStepForm engagement={engagement} engagementEntry={entry} />
    </AppContainer>
  );
};

export default EngageFormScreen;
