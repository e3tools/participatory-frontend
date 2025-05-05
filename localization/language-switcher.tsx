import {
    View,
    Text,
    FlatList,
    TouchableWithoutFeedback,
    useColorScheme,
} from 'react-native';
import React from 'react';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import { useLocale } from '@/provider/translation';

export default function LanguageSwitcher() {
    const locales = [
        { code: 'en', name: 'English' },
        { code: 'sw', name: 'Swahili' },
    ];
    const theme = useColorScheme() ?? 'light';
    const { t, currentLanguage, setCurrentLanguage } = useLocale();
    return (
        <View>
            <ThemedText>Current Language: {currentLanguage}</ThemedText>
            <FlatList
                data={locales}
                renderItem={({ item }) => {
                    const active = item.code === currentLanguage;
                    return (
                        <TouchableWithoutFeedback
                            onPress={() => {
                                setCurrentLanguage(item.code);
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 10,
                                    height: 70,
                                    width: '100%',
                                    borderColor: active ? '#000' : '#ccc',
                                    borderWidth: 2,
                                    justifyContent: 'space-between',
                                    backgroundColor: active
                                        ? Colors.light.tabIconSelected
                                        : '#fff',
                                }}
                            >
                                <ThemedText>{item.name}</ThemedText>
                                <View>
                                    {active && (
                                        <View
                                            style={{
                                                borderRadius: 10,
                                                height: 20,
                                                width: 20,
                                                borderWidth: 1,
                                                backgroundColor: Colors.light,
                                            }}
                                        ></View>
                                    )}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    );
                }}
            />
        </View>
    );
}
