import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import React, { useEffect, useState } from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox/lib';
import Checkbox, { CheckboxProps as ExpoCheckboxProps } from 'expo-checkbox';
import { ThemedText } from '@/components/ThemedText';

type InputSize = 'sm' | 'md' | 'lg';
interface CheckboxProps extends Omit<ExpoCheckboxProps, 'style'> {
    label?: string;
    error?: string;
    size?: InputSize;
    disabled?: boolean;
    isChecked?: boolean;
    containerStyle?: ViewStyle;
    // inputStyle?: TextStyle;
}

export const CheckBox: React.FC<CheckboxProps> = ({
    label,
    error,
    size = 'md',
    disabled = false,
    containerStyle,
    isChecked = false,
    onValueChange,
    ...props
}) => {
    const [checked, setChecked] = useState<boolean>(isChecked);

    useEffect(() => {
        setChecked(isChecked);
    }, [isChecked]);

    return (
        // <View>
        //     {/* <BouncyCheckbox onPress={(isChecked: boolean) => {}} /> */}
        //     <Checkbox />
        // </View>
        <View style={styles.section}>
            <Checkbox
                style={styles.checkbox}
                value={checked}
                onValueChange={(checked: boolean) => {
                    setChecked(checked);
                    onValueChange?.(checked);
                }}
                color={checked ? '#4630EB' : undefined}
                {...props}
            />
            <ThemedText type="default" style={styles.paragraph}>
                {label}
            </ThemedText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 8,
        marginVertical: 32,
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paragraph: {
        fontSize: 15,
    },
    checkbox: {
        margin: 8,
    },
});
