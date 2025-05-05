import { StyleSheet, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { APP } from 'common';
import EngagementItem from '../components/EngagementItem';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import { getActiveEngagements } from '../../../state/engagement/actions/engagement.action';
import AppLoader from 'ui/components/shared/app-loader';
import { Appbar, Banner, Icon, Searchbar, Text } from 'react-native-paper';
import { Engagement } from '../../../state/state.types';
import { setSearchQuery } from '../../../state/engagement/engagementSlice';
import PageIntro from '../../../components/shared/PageIntro';
import AppContainer from 'ui/components/shared/app-container';

const SearchComponent = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.engagement.searchQuery);
  return (
    <Searchbar
      style={{ margin: 0 }}
      // inputStyle={{ height: 20 }}
      placeholder={APP._('GLOBAL.SEARCH_PLACEHOLDER')}
      onChangeText={(query) => dispatch(setSearchQuery(query))}
      onClearIconPress={() => dispatch(setSearchQuery(''))}
      value={searchQuery}
    />
  );
};

const EngagementList = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const engagements = useAppSelector((state) => state.engagement.engagements);
  const [filteredEngagements, setFilteredEngagements] = useState<Engagement[]>(
    [],
  );
  const loading = useAppSelector((state) => state.engagement.loading);
  const searchQuery = useAppSelector((state) => state.engagement.searchQuery);

  useEffect(() => {
    dispatch(setSearchQuery(''));
    dispatch(getActiveEngagements());
  }, [dispatch]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredEngagements(engagements ? [...engagements] : []);
    } else {
      const filtered = engagements?.filter((el: Engagement) =>
        el.engagement_name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredEngagements([...filtered]);
    }
  }, [searchQuery, engagements]);

  // useLayoutEffect(() => {
  //   navigation.setOptions({ title: APP._('ENGAGEMENT_LIST_PAGE.TITLE') });
  // }, [navigation]);

  if (loading) {
    return (
      <View
        style={{
          alignSelf: 'center',
          marginTop: 20,
        }}
      >
        <AppLoader loadingText={APP._('GLOBAL.LOADING')} />
      </View>
    );
  }

  if (filteredEngagements.length === 0) {
    return (
      <View style={styles.container}>
        <Banner
          visible={true}
          icon={({ size }) => (
            <Icon source="emoticon-sad-outline" size={size} />
          )}
        >
          <Text style={{ textAlign: 'justify', alignSelf: 'center' }}>
            {APP._('ENGAGEMENT_LIST_PAGE.NO_DATA')}
          </Text>
        </Banner>
      </View>
    );
  }

  return (
    <>
      <PageIntro text={APP._('ENGAGEMENT_LIST_PAGE.INTRODUCTION')}></PageIntro>
      <View style={styles.container}>
        {filteredEngagements?.map((engagement) => (
          <EngagementItem engagement={engagement} key={engagement.name} />
        ))}
      </View>
    </>
  );
};

const EngagementIndexScreen = () => {
  return (
    <>
      {/* <PageIntro text={APP._('ENGAGEMENT_LIST_PAGE.INTRODUCTION')}></PageIntro> */}
      {/* <Appbar.Header style={{ marginTop: -25 }}>
        <SearchComponent />
      </Appbar.Header> */}
      <AppContainer>
        <EngagementList />
      </AppContainer>
    </>
  );
};

export default EngagementIndexScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: -10,
  },
});
