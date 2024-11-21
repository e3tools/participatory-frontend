import en from "./en";
import sw from "./sw";

export const resources = {
    en: {
        translation: en,
    },
    sw: {
        translation: sw
    },
};

export type Language = keyof typeof resources;