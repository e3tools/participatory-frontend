import { Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { NetworkContext } from '../contexts/network';
import NoInternetBanner from '../components/network/noInternetBanner';
import { useAppDispatch } from '../state/hooks';
import { setIsBackendConnected } from '../state/backend/backendSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

const ConnectivityProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const [isOffline, setIsOffline] = useState(false);
  const { isConnected, setIsConnected } = useContext(NetworkContext); //using the createContext to access the setIsConnected state

  // override to ping the backend
  NetInfo.configure({
    reachabilityUrl: process.env.EXPO_PUBLIC_BACKEND, // 'https://clients3.google.com/generate_204',
    reachabilityTest: async (response) => response.status === 200, // 204,
    reachabilityLongTimeout: 60 * 1000, // 60s
    reachabilityShortTimeout: 5 * 1000, // 5s
    reachabilityRequestTimeout: 15 * 1000, // 15s
    reachabilityShouldRun: () => true,
    shouldFetchWiFiSSID: true, // met iOS requirements to get SSID. Will leak memory if set to true without meeting requirements.
    useNativeReachability: false,
  });

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      // console.log('Network status changed: ', state);
      const offline = !(state.isConnected && state.isInternetReachable);
      setIsOffline(offline);
      // setIsConnected(offline);
    });
    return () => removeNetInfoSubscription();
  }, []);

  useEffect(() => {
    console.log('Network status. Is offline:', isOffline);
    dispatch(setIsBackendConnected(!isOffline));
  }, [dispatch, isOffline]);

  if (!isOffline) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'orange',
        }}
      >
        <NoInternetBanner />
        {children}
      </SafeAreaView>
    );
  }
  return <>{children}</>;
};

export default ConnectivityProvider;
