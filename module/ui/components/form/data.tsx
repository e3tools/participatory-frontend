import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TextInput } from '@/module/ui/components/form/text-input';
import { DocField } from '@/module/engage/types';

export default function Data({ label, read_only, fieldtype }: DocField) {
    return <TextInput label={label} readOnly={read_only} />;
}
