import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useLocale } from '@/provider/translation';
import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/module/ui/components/button';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function SubmissionSuccessScreen() {
    const { t } = useLocale();
    const router = useRouter();
    return (
        <View style={styles.container}>
            <View style={styles.messageContainer}>
                <Ionicons name="checkmark-circle" size={56} color="green" />
                <ThemedText>{t('GLOBAL.SAVE_SUCCESS_MESSAGE')}</ThemedText>
            </View>

            <Button
                variant="outlined"
                size="sm"
                onPress={() => {
                    router.push('/(index)/engagement/list');
                }}
            >
                {t('SUCCESS_SAVE_PAGE.BUTTON.BACK_TO_ENGAGEMENTS')}
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    messageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
    },
});
