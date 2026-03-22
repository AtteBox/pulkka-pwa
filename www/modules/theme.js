/**
 * Theme class
 */
export class Theme {
    #theme;
    #localStorage;
    #onThemeChangeCallbacks = [];

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

    get theme() {
        return this.#theme;
    }

    get isDark() {
        return this.#theme === Theme.THEMES.DARK;
    }

    /**
     * @param {string} value
     */
    set theme(value) {
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
     * @param {(theme: string) => void} callback
     */
    addThemeChangeListener(callback) {
        this.#onThemeChangeCallbacks.push(callback);
    }
}
