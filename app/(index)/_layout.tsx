import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { Stack, useRouter } from 'expo-router';
import { generateRandomString } from '@/utils/common';
import { useLocale } from '@/provider/translation';
import { Button } from '@/module/ui/components/button';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Provider as TinyBaseProvider } from 'tinybase/ui-react';
import { EngagementStore } from '@/stores/EngagementStore';
import { SubmissionStore } from '@/stores/SubmissionStore';
import Toast from 'react-native-toast-message';
import { FrappeAuthProvider } from '@/provider/frappe-auth';
import { FrappeProvider } from '@/provider/frappe';
import { EngagementFormStore } from '@/stores/EngagementFormStore';
import { DocTypeStore } from '@/stores/DocTypeStore';
import SyncData from '@/stores/synchronization/SyncData';
import { EngageProvider } from '@/provider/engage';
import { DocListsStore } from '@/stores/DocListsStore';

export default function HomeRoutesLayout() {
    const router = useRouter();
    const { t } = useLocale();
    return (
        <TinyBaseProvider>
            <FrappeAuthProvider>
                <FrappeProvider>
                    <EngagementFormStore />
                    <EngagementStore />
                    <SubmissionStore />
                    <DocTypeStore />
                    <DocListsStore />
                    <EngageProvider>
                        <Stack
                            screenOptions={{
                                ...(process.env.EXPO_OS !== 'ios'
                                    ? {
                                          headerRight: (props) => {
                                              return (
                                                  <View
                                                      style={
                                                          styles.headerActionsContainer
                                                      }
                                                  >
                                                      <Pressable
                                                          onPress={() => {
                                                              router.push(
                                                                  '/(index)/engagement/list'
                                                              );
                                                          }}
                                                      >
                                                          <Ionicons
                                                              name="people"
                                                              size={24}
                                                          />
                                                      </Pressable>
                                                      <Pressable
                                                          onPress={() => {
                                                              router.push(
                                                                  '/(index)/submission/structured/list2'
                                                              );
                                                          }}
                                                      >
                                                          <Ionicons
                                                              name="pencil"
                                                              size={24}
                                                          />
                                                      </Pressable>
                                                      <Pressable
                                                          onPress={() => {
                                                              router.push(
                                                                  '/(index)/diagnostics'
                                                              );
                                                          }}
                                                      >
                                                          <Ionicons
                                                              name="map-sharp"
                                                              size={24}
                                                          />
                                                      </Pressable>

                                                      <Pressable
                                                          onPress={() => {
                                                              router.push(
                                                                  '/(index)/settings'
                                                              );
                                                          }}
                                                      >
                                                          <Ionicons
                                                              name="settings-outline"
                                                              size={24}
                                                          />
                                                      </Pressable>
                                                  </View>
                                              );
                                          },
                                      }
                                    : {
                                          headerLargeTitle: true,
                                          headerTransparent: true,
                                          headerBlurEffect:
                                              'systemChromeMaterial',
                                          headerLargeTitleShadowVisible: false,
                                          headerShadowVisible: true,
                                          headerLargeStyle: {
                                              backgroundColor: 'transparent', //make the large title transparent to match the background
                                          },
                                      }),
                            }}
                            // screenOptions={{
                            //     headerShown: true,
                            //     headerRight: (props) => {
                            //         return (
                            //             <Button
                            //                 variant="text"
                            //                 size="sm"
                            //                 onPress={() => {
                            //                     router.push('/(index)/settings');
                            //                 }}
                            //             >
                            //                 {t('SETTINGS_PAGE.TITLE')}
                            //             </Button>
                            //         );
                            //     },
                            // }}
                        >
                            <Stack.Screen
                                name="index"
                                options={{
                                    title: t('APP_NAME'), // 'Home',
                                    // headerTitle: () => (
                                    //     <ThemedText type="title" style={{ fontSize: 20 }}>
                                    //         Home
                                    //     </ThemedText>
                                    // ),
                                }}
                            />
                            <Stack.Screen
                                name="settings"
                                options={{
                                    title: t('SETTINGS_PAGE.TITLE'), // 'Settings',
                                    // headerTitle: () => (
                                    //     <ThemedText type="title" style={{ fontSize: 20 }}>
                                    //         Settings
                                    //     </ThemedText>
                                    // ),
                                }}
                            />
                            <Stack.Screen
                                name="engagement/list"
                                options={{
                                    title: t('ENGAGEMENT_LIST_PAGE.TITLE'),
                                }}
                            />
                            <Stack.Screen
                                name="engagement/details"
                                options={{
                                    title: t('ENGAGEMENT_LIST_PAGE.TITLE'),
                                }}
                            />
                            <Stack.Screen
                                name="submission/structured/new"
                                options={{
                                    title: t('SUBMISSIONS_PAGE.TITLE'),
                                }}
                            />
                            <Stack.Screen
                                name="submission/structured/list"
                                options={{
                                    title: t(
                                        'MAIN_LAYOUT.NAVIGATOR.MY_SUBMISSIONS_TITLE'
                                    ),
                                }}
                            />
                            <Stack.Screen
                                name="submission/structured/list-old"
                                options={{
                                    title: t(
                                        'MAIN_LAYOUT.NAVIGATOR.MY_SUBMISSIONS_TITLE'
                                    ),
                                }}
                            />
                            <Stack.Screen
                                name="submission/success"
                                options={{
                                    title: t('SUCCESS_SAVE_PAGE.TITLE'),
                                }}
                            />
                            <Stack.Screen
                                name="diagnostics/index"
                                options={{
                                    title: t('MAP_PAGE.TITLE'),
                                }}
                            />
                            <Stack.Screen
                                name="submission/structured/child-table"
                                options={{
                                    title: t('MAP_PAGE.TITLE'),
                                    presentation: 'formSheet',
                                    sheetAllowedDetents: [0.75, 1],
                                    headerLargeTitle: false,
                                    sheetGrabberVisible: true,
                                    headerTitle: 'Add child row',
                                }}
                            />
                        </Stack>
                        <SyncData />
                    </EngageProvider>
                </FrappeProvider>
            </FrappeAuthProvider>
            <Toast />
        </TinyBaseProvider>
    );
}

const styles = StyleSheet.create({
    headerActionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 15,
    },
});
