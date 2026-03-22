/**
 * @typedef {"light" | "dark"} ThemeValue
 */

/**
 * Theme class
 */
export class Theme {
    /** @type {ThemeValue} */
    #theme;
    #localStorage;
    /** @type {Array<(theme: ThemeValue) => void>} */
    #onThemeChangeCallbacks = [];

    /** @type {Readonly<{LIGHT: "light", DARK: "dark"}>} */
    static THEMES = { LIGHT: "light", DARK: "dark" };

    /**
     * @param {Storage} localStorage
     */
    constructor(localStorage = window.localStorage) {
        this.#localStorage = localStorage;
        const stored = this.#localStorage.getItem("theme");
        if (stored === Theme.THEMES.DARK || stored === Theme.THEMES.LIGHT) {
            this.theme = stored;
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            this.theme = Theme.THEMES.DARK;
        } else {
            this.theme = Theme.THEMES.LIGHT;
        }
    }

    /**
     * @returns {ThemeValue}
     */
    get theme() {
        return this.#theme;
    }

    /**
     * @returns {boolean}
     */
    get isDark() {
        return this.#theme === Theme.THEMES.DARK;
    }

    /**
     * @param {ThemeValue} value
     */
    set theme(value) {
        if (value !== Theme.THEMES.LIGHT && value !== Theme.THEMES.DARK) {
            throw new Error(`Invalid theme: ${value}. Must be "${Theme.THEMES.LIGHT}" or "${Theme.THEMES.DARK}".`);
        }
        this.#theme = value;
        this.#localStorage.setItem("theme", value);
        document.documentElement.setAttribute("data-theme", value);
        for (const callback of this.#onThemeChangeCallbacks) {
            callback(value);
        }
    }

    toggle() {
        this.theme = this.isDark ? Theme.THEMES.LIGHT : Theme.THEMES.DARK;
    }

    /**
     * @param {(theme: ThemeValue) => void} callback
     */
    addThemeChangeListener(callback) {
        this.#onThemeChangeCallbacks.push(callback);
    }
}
