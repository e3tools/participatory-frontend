import {
    View,
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    ViewStyle,
    TextStyle,
    useColorScheme,
    StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { zincColors } from '@/constants/Colors';
import { ThemedText } from '../../../../components/ThemedText';

type InputVariant = 'default' | 'filled' | 'outlined' | 'ghost';
type InputSize = 'sm' | 'md' | 'lg';

interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
    label?: string;
    error?: string;
    variant?: InputVariant;
    size?: InputSize;
    disabled?: boolean;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    required?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
    label,
    error,
    variant = 'default',
    size = 'md',
    disabled = false,
    containerStyle,
    inputStyle,
    multiline,
    value,
    required,
    ...props
}) => {
    const [textValue, setTextValue] = useState(value || '');
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const sizeStyles: Record<
        InputSize,
        { height?: number; fontSize: number; padding: number }
    > = {
        sm: { fontSize: 16, padding: 8 },
        md: { height: 50, fontSize: 16, padding: 14 },
        lg: { height: 55, fontSize: 32, padding: 16 },
    };

    const getVariantStyle = () => {
        const baseStyle: ViewStyle = {
            borderRadius: 12,
            backgroundColor: isDark ? zincColors[900] : 'rgb(220, 220, 234)',
        };

        switch (variant) {
            case 'filled':
                return {
                    ...baseStyle,
                    backgroundColor: isDark ? zincColors[700] : zincColors[100],
                };
            case 'outlined':
                return {
                    ...baseStyle,
                    backgroundColor: isDark ? zincColors[600] : zincColors[200],
                };
            case 'ghost':
                return {
                    ...baseStyle,
                    backgroundColor: 'transparent',
                };
            default:
                return baseStyle;
        }
    };

    const getTextColor = () => {
        if (disabled) {
            return isDark ? zincColors[500] : zincColors[400];
        }
        return isDark ? zincColors[50] : zincColors[900];
    };

    useEffect(() => {
        setTextValue(value);
    }, [value]);

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <ThemedText style={[styles.label]}>
                    {label}
                    {required && (
                        <ThemedText style={styles.required}> *</ThemedText>
                    )}
                </ThemedText>
            )}
            <View style={[getVariantStyle(), disabled && styles.disabled]}>
                <RNTextInput
                    style={[
                        {
                            height: multiline ? 100 : sizeStyles[size].height,
                            fontSize: sizeStyles[size].fontSize,
                            padding: sizeStyles[size].padding,
                            color: getTextColor(),
                            textAlignVertical: 'top',
                        },
                        inputStyle,
                    ]}
                    placeholderTextColor={
                        isDark ? zincColors[500] : zincColors[400]
                    }
                    editable={!disabled}
                    value={textValue}
                    {...props}
                />
            </View>
            {error && <ThemedText style={styles.error}>{error}</ThemedText>}
        </View>
    );
};

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
