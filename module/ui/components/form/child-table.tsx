import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { DocField } from '@/module/engage/types';
import DataTable from '../data-table/data-table';
import { useRouter } from 'expo-router';

interface ChildTableProps {
    doctype: string; //doctype of the child doc
    parentType: string; //doctype of the parent doc
    parentField: string; //Table field column that contains the parent doc value
    parent?: string; //id of the parent doc
    parentDoc?: object; //parent doc incase it is available
    field: DocField; // field definition
    // data?: any[];
    // onRowIdClick?: (item: any) => void;
    onChange?: (data: any) => void;
}

function ChildTable({
    doctype,
    parentType,
    parentField,
    parent,
    parentDoc,
    field,
    onChange,
}: ChildTableProps) {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {field.label && (
                <ThemedText type="default" style={styles.label}>
                    {field.label}
                    {field.reqd && (
                        <ThemedText style={styles.required}> *</ThemedText>
                    )}
                </ThemedText>
            )}
            <View>
                <DataTable
                    onAddNewRow={(item: any) => {
                        router.push({
                            pathname:
                                '/(index)/submission/structured/child-table',
                            params: {
                                parentField: parentField,
                                parentDoctype: parentType,
                                childDoctype: doctype,
                                childDocname: item.id,
                                engagement: item.engagement,
                                rowIndex: item.idx,
                            },
                        });
                    }}
                    onRowClick={(item: any) => {
                        router.push({
                            pathname:
                                '/(index)/submission/structured/child-table',
                            params: {
                                parentField: parentField,
                                parentDoctype: parentType,
                                childDoctype: doctype,
                                childDocname: item.id,
                                engagement: item.engagement,
                                rowIndex: item.idx,
                            },
                        });
                    }}
                    onChange={(data) => {
                        console.log('New data: ', data);
                    }}
                />
            </View>
        </View>
    );
}

export default ChildTable;

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    required: {
        color: '#ef4444',
    },
    label: {
        marginBottom: 4,
    },
    error: {
        color: '#ef4444',
        marginTop: 4,
        fontSize: 12,
    },
    disabled: {
        opacity: 0.5,
    },
    multiline: {
        minHeight: 200,
    },
});
