import { View, Text } from 'react-native';
import React from 'react';
import LanguageSwitcher from '@/localization/language-switcher';
import { translate, useLocale } from '@/provider/translation';
import { BodyScrollView } from '@/components/ui/BodyScrollView';

export default function Settings() {
    const { t, dir } = useLocale();
    return (
        <View style={{ direction: dir }}>
            <LanguageSwitcher />
        </View>
    );
}
