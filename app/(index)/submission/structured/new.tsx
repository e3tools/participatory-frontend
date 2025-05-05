import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Button } from '@/module/ui/components/button';
import { useLocalSearchParams, useRouter } from 'expo-router';
import StructuredForm from '@/module/engage/components/structured-form';
import { useGetEngagement, useGetEngagements } from '@/stores/EngagementStore';
import { ThemedText } from '@/components/ThemedText';
import { useLocale } from '@/provider/translation';
import { useEngage } from '@/provider/engage';
import { useAddStructuredSubmissionCallback } from '@/stores/SubmissionStore';

export default function NewStructuredSubmissionScreen() {
    const router = useRouter();
    const { engagementId } = useLocalSearchParams<{ engagementId: string }>();
    const form = useGetEngagement(engagementId)?.engagement_form;
    const addSubmission = useAddStructuredSubmissionCallback();
    const { t } = useLocale();
    const { submission, initializeStructuredSubmission } = useEngage();

    useEffect(() => {
        //initializeStructuredSubmission(engagementId, form);
    }, [form, engagementId]);

    const handleSubmit = (doc: any) => {
        const res = addSubmission(engagementId, JSON.stringify(doc), form);
        console.log('Added submission: ', doc);
    };

    if (!form) {
        <ThemedText type="default">
            {t('SUBMISSIONS_PAGE.STRUCTURED_ENGAGEMENT.MISSING_FORM')}
        </ThemedText>;
    }

    return (
        <View>
            <ThemedText type="subtitle" style={{ textAlign: 'center' }}>
                {engagementId}
            </ThemedText>
            <StructuredForm
                doctype={form}
                docname={null}
                initValues={{}}
                engagement={engagementId}
                onSubmit={handleSubmit}
            />
        </View>
    );
}

const styles = StyleSheet.create({});
