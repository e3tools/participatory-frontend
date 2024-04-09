import { getLocales } from "expo-localization";
import { I18n } from "i18n-js"; 
// import { Language } from "../translations/i18n/resources"; 

import en from "../translations/i18n/en";
import sw from "../translations/i18n/sw";

// const languages = {
//     en: {
//         translation: en,
//     },
//     sw: {
//         translation: sw
//     },
// };
const languages = {
    en: en,
    sw: sw,
};

// See https://docs.expo.dev/guides/localization/ and https://starter.obytes.com/guides/internationalization/
const _ = (text: string) => {
    // set the locale once at the beginning of the app
    //const languages = new Language()
    const i18n = new I18n(languages);

    // Set the locale once at the beginning of your app.
    i18n.locale = 'en';//getLocales()[0].languageCode;

    // When a value is missing from a language it'll fall back to another language with the key present.
    i18n.enableFallback = true;

    return i18n.t(text);
}

export { _ };