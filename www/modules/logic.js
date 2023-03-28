import { stampsToCsv } from "./csv.js";
import { STAMP_TYPES, STAMP_VALIDATION_ERROR_TYPES } from "./model.js";

/**
 * The Logic class.
 */
export class Logic {
    #persistence;
    #editStampDate = null;
    #editStampValidationErrors = [];
    #addStampValidationErrors = [];
    #editedStamp = null;

    /**
     * @param {import("./persistence").Persistence} persistence
     */
    constructor(persistence) {
        this.#persistence = persistence;
    }


    /**
    * The stamps shown in the UI in the correct order.
    * @returns {Stamp[]}
    */
    get #shownStamps() {
        return this.#persistence.stamps.sort((a, b) => b.date - a.date);
    }

    /**
     * The latest stamp by date and time
     * @returns {Stamp|null}
     * */
    get #latestStamp() {
        if (this.#shownStamps.length === 0) {
            return null;
        }
        return this.#shownStamps[0];
    }


    /**
     * Stamps grouped by date where date is a string created by Date.toDateString() 
     * and can be deserialized by Date constructor.
     * @returns {Object.<string, Stamp[]>|{}}
     */
    get stampsByDate() {
        const stampsByDate = {};
        for (const stamp of this.#shownStamps) {
            const date = stamp.date.toDateString();
            if (stampsByDate[date] == null) {
                stampsByDate[date] = [];
            }
            stampsByDate[date].push(stamp);
        }
        return stampsByDate;
    }

    /**
     * Get the validation errors for the stamp that is being edited.
     */
    get editStampValidationErrors() {
        return this.#editStampValidationErrors;
    }

    /** 
     * Get the edited stamp with the latest unsaved changes.
     */
    get editedStamp() {
        return this.#editedStamp;
    }

    /**
     * Get the validation errors for the stamp that is being added.
     */
    get addStampValidationErrors() {
        return this.#addStampValidationErrors;
    }

    /**
     * Is the user of the app currently at work?
     */
    get isAtWork() {
        return [STAMP_TYPES.IN].includes(this.#latestStamp?.stampType);
    }

    /**
     * add a stamp to the stamps array
     * @param {Stamp} stamp 
     */
    #addStamp({ date, stampType }) {
        this.#addStampValidationErrors = validateStamp({ date, stampType }, this.#persistence.stamps, null);
        if (this.#addStampValidationErrors.length > 0) {
            return;
        }

        this.#persistence.stamps = [
            ...this.#persistence.stamps,
            { date: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()), stampType },
        ];
    }

    /**
     * Add a stamp with the current date and time.
     */
    addCurrentStamp() {
        if (this.isAtWork) {
            this.#addStamp({ date: new Date(), stampType: STAMP_TYPES.OUT });
        } else {
            this.#addStamp({ date: new Date(), stampType: STAMP_TYPES.IN });
        }
    }

    /**
     * Empty the stamps
     */
    clearStamps() {
        this.#persistence.stamps = [];
    }

    /**
     * Start editing a stamp according to its date (identifying property)
     * @param {Date} date 
     */
    startEditingStamp(date) {
        this.#editedStamp = this.#persistence.stamps.find(({ date: stampDate }) => areSameDatesByMinute(stampDate, date));
        if (this.#editedStamp != null) {
            this.#editStampValidationErrors = [];
            this.#editStampDate = date;
        }
    }

    /**
     * Saves the edited stamp to the stamps array.
     * @param {Stamp} stamp 
     * @returns 
     */
    saveEditedStamp({ date, stampType }) {
        this.#editedStamp = { date, stampType };
        this.#editStampValidationErrors = validateStamp({ date, stampType }, this.#persistence.stamps, this.#editStampDate);
        if (this.#editStampValidationErrors.length > 0) {
            return;
        }
        this.#persistence.stamps = this.#persistence.stamps.map((stamp) => {
            if (areSameDatesByMinute(stamp.date, this.#editStampDate)) {
                return { date, stampType };
            }
            return stamp;
        });
        this.#editStampDate = null;
        this.#editedStamp = null;
    }

    /**
     * Cancels the editing of a stamp.
     */
    cancelEditingStamp() {
        this.#editStampDate = null;
        this.#editedStamp = null;
    }

    /**
     * Removes a stamp from the stamps array according to its date (identifying property)
     * @param {Date} date 
     */
    deleteStamp(date) {
        this.#persistence.stamps = this.#persistence.stamps.filter((stamp) => !areSameDatesByMinute(stamp.date, date));
    }

    /**
     * 
     * @returns {string} CSV representation of the stamps
     */
    createStampCsv() {
        return stampsToCsv(this.#shownStamps);
    }
}

/**
 * 
 * @param {Stamp} editedStamp 
 * @param {Stamp[]} existingStamps 
 * @param {Date | null} editedStampOriginalDate
 * @returns {typeof STAMP_VALIDATION_ERROR_TYPES[keyof typeof STAMP_VALIDATION_ERROR_TYPES][]}
 */
function validateStamp(editedStamp, existingStamps, editedStampOriginalDate) {
    const otherStamps = editedStampOriginalDate == null ? existingStamps : existingStamps.filter((stamp) => !areSameDatesByMinute(stamp.date, editedStampOriginalDate));
    const validationErrors = [];
    if (editedStamp.date > new Date()) {
        validationErrors.push(STAMP_VALIDATION_ERROR_TYPES.DATE_IN_FUTURE);
    }
    if (otherStamps.some((stamp) => areSameDatesByMinute(stamp.date, editedStamp.date))) {
        validationErrors.push(STAMP_VALIDATION_ERROR_TYPES.DATE_DUPLICATE);
    }
    return validationErrors
}

export function areDifferentDays(date1, date2) {
    return (
        date1.getFullYear() !== date2.getFullYear() ||
        date1.getMonth() !== date2.getMonth() ||
        date1.getDate() !== date2.getDate()
    );
}

export function areSameDatesByMinute(date1, date2) {
    const result = (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate() &&
        date1.getHours() === date2.getHours() &&
        date1.getMinutes() === date2.getMinutes()
    );
    return result;
}

/**
 * The Stamp type.
 * @typedef {Object} Stamp
 * @property {Date} date - The date of the stamp.
 * @property {typeof STAMP_TYPES[keyof typeof STAMP_TYPES]} stampType - The type of the stamp. 
 */

