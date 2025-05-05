import { getLocales } from 'expo-localization';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en';
import sw from './locales/sw';
import { Translation } from './translation.type';

// See https://dev.to/lucasferreiralimax/i18n-in-react-native-with-expo-2j0j
// See https://github.com/abdulahad-07/react-native-tutorial/blob/10.localization/src/screens/language/LanguageScreen.js

const LANG_KEY = 'lang.setting';

const locales = {
    // en: en,
    // sw: sw,
    en: { translation: en },
    sw: { translation: sw },
};

const initI18n = async () => {
    let savedLanguage = 'en'; // await get_value(LANG_KEY);
    if (savedLanguage) {
        savedLanguage = Localization.getLocales()[0].languageCode ?? 'en';
    }
    i18n.use(initReactI18next).init({
        compatibilityJSON: 'v3',
        lng: savedLanguage,
        fallbackLng: 'en',
        resources: locales,
        interpolation: {
            escapeValue: false, // react already safes from xss
        },
        returnObjects: true,
    });
};

const getCurrentLocale = async () => {
    let lang = await AsyncStorage.getItem(LANG_KEY);
    if (lang) {
        i18n.changeLanguage(lang);
    } else {
        const locale = getLocales()[0].languageCode ?? 'en';
        i18n.changeLanguage(lang);
    }
    return lang;
};

const setLocale = async (lang: string) => {
    i18n.changeLanguage(lang);
    await AsyncStorage.getItem(LANG_KEY, lang);
};

initI18n();
getCurrentLocale();

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

declare function translate<P extends Join<PathKeys<Translation>, '.'>>(
    paths: P,
    vars?: Record<Variables<Translation, P, '.'>, string>
): string;

const t = <T extends Translation, P extends Join<PathKeys<T>, '.'>>(
    path: P,
    vars?: Record<Variables<T, P, '.'>, string>
) => {
    return i18n.t(path, vars);
};

export default i18n;
export { getCurrentLocale, setLocale, t };
