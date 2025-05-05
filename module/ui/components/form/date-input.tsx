import {
    View,
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    ViewStyle,
    TextStyle,
    useColorScheme,
    StyleSheet,
    Pressable,
    Platform,
    TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { zincColors } from '@/constants/Colors';
import DateTimePicker, {
    AndroidNativeProps,
    IOSNativeProps,
    WindowsNativeProps,
} from '@react-native-community/datetimepicker';
import { ThemedText } from '@/components/ThemedText';
import { TextInput } from '@/module/ui/components/form/text-input';
import { useLocale } from '@/provider/translation';
import { formatDate } from '@/utils/date';

// see https://www.youtube.com/watch?v=UEfFjfW7Zes
type InputVariant = 'default' | 'filled' | 'outlined' | 'ghost';
type InputSize = 'sm' | 'md' | 'lg';

interface DateInputProps {
    label?: string;
    error?: string;
    disabled?: boolean;
    containerStyle?: ViewStyle;
    // inputStyle?: TextStyle;
}

type DateProps = (IOSNativeProps | AndroidNativeProps | WindowsNativeProps) &
    DateInputProps;

export const DateInput: React.FC<DateProps> = ({
    label,
    error,
    disabled = false,
    containerStyle,
    // inputStyle,
    mode,
    value,
    onChange,
    ...props
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { t } = useLocale();
    const [date, setDate] = useState(value || new Date(1598051730000));
    const [showPicker, setShowPicker] = useState(false);

    const toggleDatePicker = () => {
        setShowPicker(!showPicker);
    };

    const onChangeValue = (evt, selectedDate) => {
        if (evt.type == 'set') {
            setDate(selectedDate);

            if (Platform.OS === 'android') {
                // disable the picker from showing in android
                toggleDatePicker();
                onChange(evt, selectedDate);
            }
        } else {
            toggleDatePicker();
        }
    };

    const confirmIOSDate = () => {
        // setDate(selectedDate);
        toggleDatePicker();
        onChange(null, date);
    };

    // useState(()=>{
    //     setDate(value)
    // }, [value])

    // const sizeStyles: Record<
    //     InputSize,
    //     { height?: number; fontSize: number; padding: number }
    // > = {
    //     sm: { fontSize: 16, padding: 8 },
    //     md: { height: 50, fontSize: 16, padding: 14 },
    //     lg: { height: 55, fontSize: 32, padding: 16 },
    // };

    // const getVariantStyle = () => {
    //     const baseStyle: ViewStyle = {
    //         borderRadius: 12,
    //         backgroundColor: isDark ? zincColors[900] : 'rgb(220, 220, 234)',
    //     };

    //     switch (variant) {
    //         case 'filled':
    //             return {
    //                 ...baseStyle,
    //                 backgroundColor: isDark ? zincColors[700] : zincColors[100],
    //             };
    //         case 'outlined':
    //             return {
    //                 ...baseStyle,
    //                 backgroundColor: isDark ? zincColors[600] : zincColors[200],
    //             };
    //         case 'ghost':
    //             return {
    //                 ...baseStyle,
    //                 backgroundColor: 'transparent',
    //             };
    //         default:
    //             return baseStyle;
    //     }
    // };

    // const getTextColor = () => {
    //     if (disabled) {
    //         return isDark ? zincColors[500] : zincColors[400];
    //     }
    //     return isDark ? zincColors[50] : zincColors[900];
    // };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <ThemedText style={styles.label}>{label}</ThemedText>}
            <View style={[/*getVariantStyle(),*/ disabled && styles.disabled]}>
                {showPicker && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={mode}
                        display="spinner"
                        is24Hour={true}
                        onChange={onChangeValue}
                    />
                )}
                {
                    // confirm/cancel buttons will not display in IOS, so add buttons manually
                    showPicker && Platform.OS === 'ios' && (
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                            }}
                        >
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    styles.pickerButton,
                                    {
                                        backgroundColor: isDark
                                            ? zincColors[50]
                                            : zincColors[900],
                                    },
                                ]}
                                onPress={toggleDatePicker}
                            >
                                <ThemedText>{t('BUTTON.OK')}</ThemedText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    styles.pickerButton,
                                    {
                                        backgroundColor: isDark
                                            ? zincColors[50]
                                            : zincColors[900],
                                    },
                                ]}
                                onPress={confirmIOSDate}
                            >
                                <ThemedText>{t('BUTTON.YES')}</ThemedText>
                            </TouchableOpacity>
                        </View>
                    )
                }

                {!showPicker && (
                    <Pressable onPress={toggleDatePicker}>
                        <TextInput
                            editable={false}
                            value={date ? formatDate(date) : ''}
                            onPressIn={toggleDatePicker} //android specific code
                        />
                    </Pressable>
                )}
            </View>
            {error && <ThemedText style={styles.error}>{error}</ThemedText>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
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
    datePicker: {
        height: 120,
        marginTop: -10,
    },
    button: {},
    pickerButton: {},
});
