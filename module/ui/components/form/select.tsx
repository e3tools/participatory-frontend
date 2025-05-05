import { View, Text, ViewStyle, TextStyle, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SelectList, SelectListProps } from 'react-native-dropdown-select-list';
import { Dropdown } from 'react-native-element-dropdown';
import { ThemedText } from '@/components/ThemedText';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { DropdownProps } from 'react-native-element-dropdown/lib/typescript/components/Dropdown/model';
import { useLocale } from '@/provider/translation';

type InputVariant = 'default' | 'filled' | 'outlined' | 'ghost';
type InputSize = 'sm' | 'md' | 'lg';

// interface SelectInputProps extends Omit<SelectListProps, 'style'> {
//     label?: string;
//     error?: string;
//     variant?: InputVariant;
//     size?: InputSize;
//     disabled?: boolean;
//     containerStyle?: ViewStyle;
//     inputStyle?: TextStyle;
// }

export type SelectOption = {
    label: string;
    value?: string;
};

interface SelectInputProps extends DropdownProps<{}> {
    label?: string;
    options?: SelectOption[];
    displayProperty?: string;
    valueProperty?: string;
}

export default function Select({
    label,
    dropdownPosition,
    options,
    displayProperty,
    valueProperty,
    placeholder,
    value,
    onChange,
    ...rest
}: SelectInputProps) {
    const [data, setData] = useState<SelectOption[]>(options || []);
    const [selectedValue, setSelectedValue] = useState(null);
    const { t } = useLocale();

    // const [selected, setSelected] = useState('');
    // const [value, setValue] = useState(null);

    // const data3 = [
    //     { key: '1', value: 'Mobiles', disabled: true },
    //     { key: '2', value: 'Appliances' },
    //     { key: '3', value: 'Cameras' },
    //     { key: '4', value: 'Computers', disabled: true },
    //     { key: '5', value: 'Vegetables' },
    //     { key: '6', value: 'Diary Products' },
    //     { key: '7', value: 'Drinks' },
    // ];

    // const data2 = [
    //     { label: 'Item 1', value: '1' },
    //     { label: 'Item 2', value: '2' },
    //     { label: 'Item 3', value: '3' },
    //     { label: 'Item 4', value: '4' },
    //     { label: 'Item 5', value: '5' },
    //     { label: 'Item 6', value: '6' },
    //     { label: 'Item 7', value: '7' },
    //     { label: 'Item 8', value: '8' },
    // ];

    useEffect(() => {
        if (options) {
            options.map((item) => {
                item.label = item.label || item.value;
            });
            setData(options);
        }
    }, [options]);

    useEffect(() => {
        if (value) {
            setSelectedValue(value);
        }
    }, [value]);

    const renderItem = (item) => {
        return (
            <View style={styles.item}>
                <ThemedText style={styles.textItem}>{item.label}</ThemedText>
                {item.value === selectedValue && (
                    <Ionicons
                        style={styles.icon}
                        color="black"
                        name="checkmark"
                        size={20}
                    />
                )}
            </View>
        );
    };

    return (
        <View>
            <ThemedText>{label}</ThemedText>
            {/* <SelectList
                setSelected={(val) => setSelected(val)}
                data={data}
                save="value"
            /> */}
            <Dropdown
                style={styles.dropdown2}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                search
                maxHeight={300}
                labelField={displayProperty || 'label'}
                valueField={valueProperty || 'value'}
                placeholder={placeholder || t('GLOBAL.DROPDOWN_PLACEHOLDER')}
                searchPlaceholder={t('GLOBAL.SEARCH_PLACEHOLDER')}
                value={selectedValue}
                onChange={(item) => {
                    setSelectedValue(item.value);
                    onChange(item);
                }}
                // renderLeftIcon={() => (
                //     <Ionicons
                //         style={styles.icon}
                //         color="black"
                //         name="star-outline"
                //         size={20}
                //     />
                // )}
                renderRightIcon={(item) => {
                    return (
                        <>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                {value && (
                                    <Text
                                        onPress={() => {
                                            setSelectedValue(null);
                                        }}
                                        style={{ marginRight: 8 }}
                                    >
                                        <Ionicons
                                            name="close"
                                            color={'red'}
                                            size={16}
                                        />
                                    </Text>
                                )}
                                <Text
                                    // onPress={() => {
                                    //     console.log('clickdown');
                                    // }}
                                    style={{ marginRight: 10 }}
                                >
                                    <Ionicons
                                        name="chevron-down-outline"
                                        size={16}
                                    />
                                </Text>
                            </View>
                        </>
                    );
                }}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    dropdown2: {
        // margin: 16,
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    dropdown: {
        // margin: 16,
        marginVertical: 10,
        paddingHorizontal: 5,
        height: 45,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 10,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        borderRadius: 10,
    },
});
