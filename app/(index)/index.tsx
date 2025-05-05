import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/module/ui/components/button';
import { TextInput } from '@/module/ui/components/form/text-input';
import { BodyScrollView } from '@/components/ui/BodyScrollView';
import { useRouter } from 'expo-router';
import { FrappeAuthContext, useFrappeAuth } from '@/provider/frappe-auth';

export default function HomeScreen() {
    const router = useRouter();
    const { isAuthenticated, promptAsync, request, userInfo, logout } =
        useFrappeAuth();
    return (
        <BodyScrollView>
            <ThemedText type="title">Home Screen</ThemedText>
            <TextInput label="Hello" placeholder="cow" />

            <View
                style={{ direction: 'flex', flexDirection: 'column', gap: 20 }}
            >
                <Button
                    size="md"
                    variant="filled"
                    onPress={() => router.push('/(index)/engagement/list')}
                >
                    Engagements
                </Button>

                {!isAuthenticated && (
                    <Button
                        size="md"
                        variant="filled"
                        onPress={() => {
                            promptAsync();
                        }}
                    >
                        Login
                    </Button>
                )}
                {isAuthenticated && (
                    <>
                        <ThemedText type="defaultSemiBold">
                            Logged in: {JSON.stringify(userInfo ?? {})}{' '}
                            {userInfo?.email}
                        </ThemedText>
                        <Button
                            size="md"
                            variant="filled"
                            onPress={() => logout()}
                        >
                            Logout
                        </Button>
                    </>
                )}
            </View>
        </BodyScrollView>
    );
}
