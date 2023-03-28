/**
 * Language class
 */
export class Language {
    #translations;
    #supportedLanguages;
    #allTranslations;
    #onLanguageChangeCallbacks = [];
    #language;
    #localStorage;

    /**
     * @param {{ [lang: string]: Translation }} allTranslations - text by key by language
     * @param {string} defaultLanguage - fallback language
     * @param {readonly string[]} userCulturePreferences - for instance from navigator.languages
     * @param {Storage} localStorage - for instance window.localStorage
     */
    constructor(allTranslations, defaultLanguage, userCulturePreferences, localStorage = window.localStorage) {
        const supportedLanguages = Object.keys(allTranslations);
        if (!supportedLanguages.includes(defaultLanguage)) {
            throw new Error(`Default language ${defaultLanguage} is not supported.`);
        }
        const storedLanguageMatch = supportedLanguages.includes(localStorage.getItem("language"))
            ? localStorage.getItem("language") : null;
        const preferredLanguageMatch = userCulturePreferences
            .map((culture) =>
                culture.indexOf("-") > -1 ? culture.split("-")[0] : culture
            )
            .find((lang) => supportedLanguages.includes(lang));
        this.#localStorage = localStorage;
        this.#supportedLanguages = supportedLanguages;
        this.#allTranslations = allTranslations;
        // prefer stored language over navigator.languages as last resort use default language
        this.language = storedLanguageMatch ?? preferredLanguageMatch ?? defaultLanguage;
    }

    /**
     * Get the current language.
     */
    get language() {
        return this.#language;
    }

    get supportedLanguages() {
        return this.#supportedLanguages;
    }

    /**
     * Get the translation text for the given key.
     * @param {string} key
     */
    t(key) {
        const keyParts = key.split(".");
        // @ts-ignore
        return keyParts.reduce((obj, keyPart) => obj[keyPart] ?? key, this.#translations);
    }

    /**
     * Set the current language.
     * @param {string} lang
     */
    set language(lang) {
        if (this.#supportedLanguages.includes(lang)) {
            this.#translations = this.#allTranslations[lang];
            this.#language = lang;
            this.#localStorage.setItem("language", lang)
            for (const callback of this.#onLanguageChangeCallbacks) {
                callback(lang);
            }
        }
    }

    /**
     * Add a callback that is called when the language changes.
     * @param {(lang:string) => void} callback
     */
    addLanguageChangeListener(callback) {
        this.#onLanguageChangeCallbacks.push(callback);
    }

    /**
     * Remove a callback that is called when the language changes.
     * @param {(lang:string) => void} callback 
     */
    removeLanguageChangeListener(callback) {
        const index = this.#onLanguageChangeCallbacks.indexOf(callback);
        if (index > -1) {
            this.#onLanguageChangeCallbacks.splice(index, 1);
        }
    }

}

/**
 * @typedef {Object.<string, string | Object.<string, string>>} Translation
 */