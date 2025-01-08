import { View } from 'react-native';
import React, { useEffect, useState } from 'react';
import OnlineStatus from './network/online-status';
import { Button } from 'react-native-paper';
import AppLoader from 'ui/components/shared/app-loader';
import { full_sync } from '../utils/data-sync';
import { APP } from 'common';

const SynchronizeData = (
  { isOnline }: { isOnline: boolean } /*props: SyncDataProps*/,
) => {
  const [syncing, set_syncing] = useState(false);
  const [is_online, set_is_online] = useState(isOnline);

  useEffect(() => {
    set_is_online(isOnline);
  }, [isOnline]);

  const start_sync = () => {
    APP.notify(APP._('GLOBAL.SYNC_IN_PROGRESS'));
    set_syncing(true);
    setTimeout(() => {
      full_sync();
      set_syncing(false);
    }, 3000);
    APP.notify(APP._('GLOBAL.SYNC_COMPLETED'));
  };

  return (
    <View>
      <Button
        icon="sync"
        disabled={!is_online || syncing}
        mode="contained"
        onPress={() => start_sync()}
      >
        {APP._('GLOBAL.SYNC_START')}{' '}
      </Button>
      {syncing && <AppLoader />}
      <OnlineStatus isOnline={is_online} />
    </View>
  );
};

export default SynchronizeData;
