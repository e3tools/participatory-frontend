import { View, Text } from 'react-native';
import React, { Children, useEffect } from 'react';
import i18next from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Translation } from '@/localization/translation.type';

const LANGUAGE = 'USER_LANGUAGE';
type Direction = 'ltr' | 'rtl';
// see https://www.youtube.com/watch?v=PPU29dyKoMA

export const TranslationContext = React.createContext({
    currentLanguage: 'en',
    setCurrentLanguage: (lang: string) => {
        console.log('setCurrentLanguage', lang);
    },
    dir: 'ltr' as Direction,
});

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [currentLanguage, setCurrentLanguage] = React.useState(
        i18next.language ?? 'en'
    );

    const changeLanguage = async (lang: string) => {
        setCurrentLanguage(lang);
        i18next.changeLanguage(lang);
        // Save the language to AsyncStorage or any other storage
        await AsyncStorage.setItem(LANGUAGE, lang);
    };

    useEffect(() => {
        const loadLanguage = async () => {
            const savedLanguage = await AsyncStorage.getItem(LANGUAGE);
            if (savedLanguage) {
                changeLanguage(savedLanguage);
                i18next.changeLanguage(savedLanguage);
            }
        };
        loadLanguage();
    }, []);

    return (
        <TranslationContext.Provider
            value={{
                currentLanguage,
                setCurrentLanguage: changeLanguage,
                dir: currentLanguage === 'ar' ? 'rtl' : 'ltr', // i18next.dir(currentLanguage) as Direction,
            }}
        >
            {children}
        </TranslationContext.Provider>
    );
};

/******TYPING translate function******** */
// Construct a type that represents nested properties of a translation object
// See https://dev.to/halolab/implementing-the-translate-function-with-typescript-5d8d
// See https://www.typescriptlang.org/play/?#code/C4TwDgpgBACghsAFgaQiAzgHgCoD4oC8U2UEAHsBAHYAm6U6wATgJZUDmUA-FANoC6UAFxQA3gCgoUvsihsoAazQB7AGbF+I3sgA0UAHSH4SVBhzb+ufuIC+vJSDUaA3OPGhIUAFLK2OUhTUdAzMbOwCegAiEAA2LAC2LJRMAZS09IysHPgEktIk5GnBAtxQVBAAbhApQnlSBYHpfGyq1VAAYoI87cJ1xKlB9Lwtbe16hvojKQDySNVdfT2FgyFZnFx9AAYAJKLtNrvRcYnJB6I+fgCiFExwAMbAmLOI1XqZYQK4UbEJSdW4Nk2wjKlTaIneHFcbg80GwrHimAAggMmhD2DkoMjlk0gbsplAAEKA0pwhKYAn4ERYxrBHaifEAYRsUCBPFJCIZlMxUJhUAAyhA4Ew7oh2somAA1IUsOAAIxiECRKOCaIx1KK9Dp+MRNlEeKorRSRLOjMBfR4AqFIrFkulcoVSPwAB9iPDyc7+YLhaLxVLWPbFZy+iJylUmDzwNA-TL5RAsA0NaswlAXcpZQArCAPPTGRDKjKhDjfY5-FLYlWF9GEPq5-Ms-WGzFnI6-U4NtrTM3SUrqlYOJzYc1QaMBrDXZj3R7YXiI-hvSspqBpzMPL5QabF1v-YMgsM72vlzXtlI6zZD3tNfvqQfdi1e62+u2xzDj24Pcyz+drXC4Heh6p-qC4ZuDQWYxEK0CqAArlQDwsMoVBQBOVDoOBlCYDAdYXFQGEICgaDxmuADk+hET+AAUYB4egIgwHoFRCugXAiAASlm4o0JgI6xvGOZ6CRZFfmEuAAJTgpWUJsMkqj3LCYh9HAIgSN23aykpfQqdIdwiERiDKERGnSDYOiGVIspCjpohQPEgpUMmmlGd2ojKHMTDMgZ3bGX0qjKMoOnmQAXmIyhQcA6AsKBNgGTYbjiHcCGMFAcCEEhtwoWhEDkURcD6OZTBEXoVk2XAdkcDpekFUurk6fpUA2CJ4hAA
type PathKeys<T> = T extends string
    ? []
    : {
          [K in keyof T]: [K, ...PathKeys<T[K]>];
      }[keyof T];

type Join<T extends string[], Delimiter extends string> = T extends []
    ? never
    : T extends [infer F]
    ? F
    : T extends [infer F, ...infer Other]
    ? F extends string
        ? `${F}${Delimiter}${Join<Extract<Other, string[]>, Delimiter>}`
        : never
    : string;

type Trim<A extends string> = A extends ` ${infer B}`
    ? Trim<B>
    : A extends `${infer C} `
    ? Trim<C>
    : A;

type SearchForVariable<A extends string> =
    A extends `${infer A}{${infer B}}${infer C}`
        ? SearchForVariable<A> | Trim<B> | SearchForVariable<C>
        : never;

type Variables<
    T extends string | object,
    Path extends string,
    Delimiter extends string
> = Path extends `${infer A}${Delimiter}${infer O}`
    ? A extends keyof T
        ? Variables<Extract<T[A], string | object>, O, Delimiter>
        : never
    : Path extends `${infer A}`
    ? A extends keyof T
        ? SearchForVariable<Extract<T[A], string>>
        : never
    : never;

/**
 * Function to translate a string using the i18next library outside of component without path typing
 * @param path
 * @param params
 * @returns
 */
const translate_simple = (
    path: string,
    params?: any // ITranslationParams
) => {
    if (!i18next.isInitialized) {
        return 'Translation not initialized';
    }
    if (!i18next.exists(path)) {
        return `[Missing "en.${path}" translation]`;
    }
    return i18next.t(path, params) as string;
};

/**
 * Translate function with path typing that also accepts variables
 * e.g translate('key1.key2.key3', { var1: 'value1' }). for this, the key 'key1.key2.key3' should contain a text such as 'Text {{var1}}'
 * @param path
 * @param params
 * @returns
 */
export const translate = <
    T extends Translation,
    P extends Join<PathKeys<T>, '.'>
>(
    path: P,
    params?: Record<Variables<T, P, '.'>, string>
) => {
    // return i18n.t(path, vars);
    return translate_simple(path, params);
};

export const useLocale = () => {
    const context = React.useContext(TranslationContext);
    if (!context) {
        throw new Error('useLocale must be used within a TranslationProvider');
    }
    const { currentLanguage, setCurrentLanguage, dir } = context;
    // const { t } = useTranslation();
    const t = translate;
    return {
        t,
        currentLanguage,
        setCurrentLanguage,
        dir,
    };
};
