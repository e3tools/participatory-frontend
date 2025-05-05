import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { useLocale } from '@/provider/translation';
import StructuredForm from '@/module/engage/components/structured-form';
import { Button } from '@/module/ui/components/button';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { generateRandomString } from '@/utils/common';

interface ChildTableProps {
    parentField: string;
    parentDoctype: string;
    childDoctype: string;
    childDocname?: string;
    rowIndex?: number;
}

export default function ChildTableScreen(/*{
    parentDoctype,
    childDoctype,
    childDocname,
    rowIndex,
}: ChildTableProps*/) {
    const { t } = useLocale();

    const onInsert = (childRow: any) => {
        console.log('Inserted row: ', childRow);
    };

    const {
        parentField,
        parentDoctype,
        parentDocname,
        childDoctype,
        childDocname,
        engagement,
        rowIndex = 1,
    } = useLocalSearchParams<{
        parentField: string;
        parentDoctype: string;
        parentDocname: string;
        childDoctype: string;
        engagement: string;
        childDocname?: string;
        rowIndex?: string;
    }>();

    return (
        <View>
            {/* <View style={styles.headerContainer}>
                <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
                    {t('CHILD_TABLE.EDITING_ROW', { rowNumber: 1 })}
                </ThemedText>
                <View style={styles.actionsContainer}>
                    <ThemedText>Here</ThemedText>
                    <Ionicons name="add" size={20} />
                </View>
            </View> */}
            <StructuredForm
                parentField={parentField}
                doctype={childDoctype}
                docname={childDocname || generateRandomString()}
                engagement={engagement}
                initValues={{}}
                onSubmit={onInsert}
                childRowIndex={+rowIndex}
                isChild={typeof childDoctype === 'string'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    headerTitle: {},
    actionsContainer: {
        flexDirection: 'row',
        gap: 10,
    },
});
