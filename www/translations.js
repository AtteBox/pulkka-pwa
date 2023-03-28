/**
 * English translations
 * @type {Record<string, string|Record<string, string>>}
 */
const TRANSLATION_EN = {
    signInToWork: "Clock-in to work",
    signOutOfWork: "Clock-out of work",
    title: "Pulkka",
    cameToWork: "Came to work",
    leftWork: "Left work",
    clearStamps: "Clear all records",
    stamps: 'Records',
    noStamps: "No records",
    today: "Today",
    editingStamp: "Editing record",
    time: "Time",
    stampType: "Record type",
    save: "Save",
    cancel: "Cancel",
    date: "Date",
    deleteAllStamps: "Delete all records",
    deleteStampConfirmationMessage: "Are you sure you want to delete this record?",
    ok: "OK",
    editStampValidationErrors: {
        DATE_IN_FUTURE: "Time cannot be in the future",
        DATE_DUPLICATE: "Time cannot be the same as another record's time",
    },
    addStampValidationErrors: {
        DATE_DUPLICATE: "Cannot add another record with the same minute",
    },
    edit: "Edit",
    delete: "Delete",
    about: "About",
    aboutText: "Pulkka is a clock-in, clock-out application that allows you to create and manage time records for coming to work and leaving work.\n\nNote that Pulkka does not save your data to any server, but all data is saved to the browser's memory (localStorage) so if you clear the browser's page history, you will lose all records.",
    welcomeText: "Welcome to Pulkka clock-in, clock-out!",
    close: "Close",
    exportCsv: "Export to CSV",
    deleteAllStampsConfirmationMessage: "Are you sure you want to delete all records?",
    deleteStamp: "Delete record",
}

/**
 * Finnish translations
 * @type {typeof TRANSLATION_EN}
 */
const TRANSLATION_FI = {
    signInToWork: "Leimaa sisään töihin",
    signOutOfWork: "Leimaa ulos töistä",
    title: "Pulkka",
    cameToWork: "Töihin tulo",
    leftWork: "Töistä lähtö",
    clearStamps: "Tyhjennä kaikki merkinnät",
    stamps: 'Merkinnät',
    noStamps: "Ei merkintöjä",
    today: "Tänään",
    editingStamp: "Merkinnän muokkaus",
    time: "Aika",
    stampType: "Merkinnän tyyppi",
    save: "Tallenna",
    cancel: "Peruuta",
    date: "Päivämäärä",
    deleteAllStamps: "Poista kaikki merkinnät",
    deleteAllStampsConfirmationMessage: "Haluatko varmasti poistaa kaikki työaikamerkinnät?",
    deleteStamp: "Poista merkintä",
    deleteStampConfirmationMessage: "Haluatko varmasti poistaa tämän työaikamerkinnän?",
    ok: "OK",
    editStampValidationErrors: {
        DATE_IN_FUTURE: "Aika ei voi olla tulevaisuudessa",
        DATE_DUPLICATE: "Aika ei voi olla sama kuin toisen merkinnän aika",
    },
    addStampValidationErrors: {
        DATE_DUPLICATE: "Samalla minuutilla ei voi lisätä toista merkintää",
    },
    edit: "Muokkaa",
    delete: "Poista",
    about: "Tietoa sovelluksesta",
    aboutText: "Pulkka on työleimaussovellus jolla voit luoda ja hallita töihintulomerkintöjä ja lähtömerkintöjä. Voit myös tyhjentää kaikki merkinnät.\n\nHuomioi, että Pulkka ei tallenna tietojasi mihinkään palvelimelle, vaan kaikki tiedot tallennetaan selaimen muistiin (localStorage) joten jos tyhjennät selaimen sivuhistorian niin menetät kaikki merkinnät.",
    welcomeText: "Tervetuloa käyttämään Pulkka työleimaussovellusta!",
    close: "Sulje",
    exportCsv: "Vie CSV-tiedostoon",
}

/**
 * All translations
 * @type {Record<string, typeof TRANSLATION_EN>}
 */
export const ALL_TRANSLATIONS = {
    fi: TRANSLATION_FI,
    en: TRANSLATION_EN,
}