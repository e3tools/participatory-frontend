// import i18n from "i18n-js";
// import * as Localization from 'expo-localization';

// See https://medium.com/@anujguptawork/how-to-add-multi-language-support-in-react-native-using-i18-js-and-expo-localization-quick-ee6af6154fe8 
// https://docs.expo.dev/guides/localization/ 
// https://medium.com/@lasithherath00/implementing-react-native-i18n-and-language-selection-with-asyncstorage-b24ae59e788e
// https://crowdbotics.com/posts/blog/how-to-offer-multi-language-support-in-a-react-native-app/

import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import en from "../translations/i18n/en";
import sw from "../translations/i18n/sw";
import {set_value, get_value} from '../utils/storage';
import { APP } from "./app";

// const languages = {
//     en: {
//         translation: en,
//     },
//     sw: {
//         translation: sw
//     },
// };
const LANG_KEY = 'lang.setting';
const languages = {
    en: en,
    sw: sw,
};
// set the locale once at the beginning of the app
//const languages = new Language()
const i18n = new I18n(languages);

// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0].languageCode ?? 'en';
// When a value is missing from a language it'll fall back to another language with the key present.
i18n.enableFallback = true;

const change_language = async (lang: string) => {
    i18n.locale = lang;  
    await set_value(LANG_KEY, lang); 
}

const get_language = async () => {
    const lang = await get_value(LANG_KEY); 
    if (lang){
        i18n.locale = lang;
    } else {
        i18n.locale = getLocales()[0].languageCode ?? 'en';
    }
    return lang;
}

const _ = (text: string) => {
    // set the locale once at the beginning of the app
    //const languages = new Language()
    /*const i18n = new I18n(languages);

    // Set the locale once at the beginning of your app.
    i18n.locale = 'en';//getLocales()[0].languageCode; 

    // When a value is missing from a language it'll fall back to another language with the key present.
    i18n.enableFallback = true;
    */
    return i18n.t(text); 
}

get_language();
export { i18n, change_language, get_language, _ }

/*
console.log("Translating...", text)
return i18n.t(text); 

const _ = (text: string) => {
    // set the locale once at the beginning of the app
    //const languages = new Language()
    const i18n = new I18n(languages);

    // Set the locale once at the beginning of your app.
    i18n.locale = 'en';//getLocales()[0].languageCode;
    get_language(i18n);

    // When a value is missing from a language it'll fall back to another language with the key present.
    i18n.enableFallback = true;
    
    console.log("Translating...", text)
    return i18n.t(text); 
}*/

/*
import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
const _OLD = (text: string) => {
    // set the locale once at the beginning of the app
    //const languages = new Language()
    const i18n = new I18n(languages);

    // Set the locale once at the beginning of your app.
    i18n.locale = 'en';//getLocales()[0].languageCode;

    // When a value is missing from a language it'll fall back to another language with the key present.
    i18n.enableFallback = true;
    
    console.log("Translating...", text)
    return i18n.t(text); 
}
 

export { _ };

*/