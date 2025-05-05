import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Suspense, useEffect, useState } from 'react';
import 'react-native-reanimated';
import '../localization/index'; // Import the i18n configuration

import { useColorScheme } from '@/hooks/useColorScheme';
import { TranslationProvider, useLocale } from '@/provider/translation';
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import { ActivityIndicator, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { User, userTable } from '../db/schema';
import useDatabase from '@/db/hooks';
import UserRepository from '@/db/repository/user';
import { LOCALDB } from '@/db/database';
import { eq } from 'drizzle-orm';

export const DATABASE_NAME = 'engage';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const { t } = useLocale();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    // Initialize db and run migrations
    // const expoDb = SQLite.openDatabaseSync(DATABASE_NAME);
    // const db = drizzle(expoDb);
    // const { success, error } = useMigrations(db, migrations);

    const isDBLoadingComplete = useDatabase();

    const [users, setUsers] = useState<User[] | null>(null);

    useEffect(() => {
        if (loaded /*&& isDBLoadingComplete*/) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    // useEffect(() => {
    //     if (!success) return;

    //     (async () => {
    //         await db.delete(userTable);

    //         await db.insert(userTable).values({
    //             name: 'Administrator',
    //             full_name: 'Administrator',
    //             password: '123',
    //             email: 'humptydumpty@monkey.com',
    //         });

    //         const items = await db.select().from(userTable);
    //         console.log('Users created: ', items);
    //         setUsers(items);
    //     })();
    // }, [success]);

    useEffect(() => {
        const load = async () => {
            const user = {
                name: 'nyaga',
                full_name: 'Steve Nyaga updated2',
                password: '123345',
                email: 'humptydumpty4@monkey.com',
            };
            // await UserRepository.deleteAll();
            // await UserRepository.insert(user);
            await UserRepository.update(user);

            // await LOCALDB.db.insert(userTable).values({
            //     name: 'Administrator2',
            //     full_name: 'Administrator2',
            //     password: '123',
            //     email: 'humptydumpty2@monkey.com',
            // });

            const items = await UserRepository.getUsers();
            console.log('All users:  ', items);
        };
        load();
    }, []);

    if (!loaded) {
        return null;
    }

    // if (error) {
    //     return (
    //         <View>
    //             {t('GLOBAL.MIGRATION_ERROR')} : {error.message}
    //         </View>
    //     );
    // }

    // if (!success) {
    //     return (
    //         <View>
    //             <ThemedText>Migration is in progress...</ThemedText>
    //         </View>
    //     );
    // }

    return (
        <Suspense fallback={<ActivityIndicator size="large" />}>
            <SQLite.SQLiteProvider
                databaseName={DATABASE_NAME}
                options={{ enableChangeListener: true }} // enableChangeListener: true because we want to use liveQuery
                useSuspense
            >
                <ThemeProvider
                    value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
                >
                    <TranslationProvider>
                        <Stack>
                            <Stack.Screen
                                name="(index)"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen name="+not-found" />
                        </Stack>
                        <StatusBar style="auto" />
                    </TranslationProvider>
                </ThemeProvider>
            </SQLite.SQLiteProvider>
        </Suspense>
    );
}
