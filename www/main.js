import { Persistence } from "./modules/persistence.js";
import { Logic } from "./modules/logic.js";
import { Language } from "./modules/language.js";
import { UI } from "./modules/ui.js";
import { registerServiceworker } from "./modules/registerServiceworker.js";
import { ALL_TRANSLATIONS } from "./translations.js";

const DEFAULT_LANGUAGE = "en";

const language = new Language(
    ALL_TRANSLATIONS,
    DEFAULT_LANGUAGE,
    navigator.languages
);

const ui = new UI(new Logic(new Persistence()), language);

registerServiceworker(ui)