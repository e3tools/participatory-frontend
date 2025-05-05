import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

const RedirectAuthScreen = () => {
    const router = useRouter();

    useEffect(() => {
        console.log('Redirecting after authentication...');
        //redirect to home
        router.replace('/(index)');
    }, []);

    return (
        <View>
            <Text>Redirect Auth Landing Screen</Text>
        </View>
    );
};

export default RedirectAuthScreen;

const styles = StyleSheet.create({});
