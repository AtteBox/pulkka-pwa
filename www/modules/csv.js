import { STAMP_TYPES } from "./model.js";
import { toPaddedString } from "./utils/number.js";

/**
 * Convert stamps to CSV.
 * @param {Stamp[]} stamps
 * @returns {string}
 * @example
 * const csv = stampsToCsv([
 *    { date: new Date("2021-01-01T01:00:00.000Z"), stampType: STAMP_TYPES.IN },
 *   { date: new Date("2021-01-02T02:34:00.000Z"), stampType: STAMP_TYPES.OUT },
 * ]);
 * console.log(csv);
 * // date,stampType
 * // 2021-01-01 01:00:00,IN
 * // 2021-01-02 02:34:00,OUT
 */
export function stampsToCsv(stamps) {
    const csv = [];
    csv.push("date,stampType");
    for (const stamp of stamps) {
        csv.push(`${convertToExcelDate(stamp.date)},${stamp.stampType}`);
    }
    return csv.join("\n");
}

/**
 * Convert date to Excel compatible date string
 * 
 * f
 * 
 * @param {Date} date
 */
function convertToExcelDate(date) {
    return toPaddedString(date.getFullYear(), 4) + "-" + toPaddedString(date.getMonth() + 1, 2) + "-" + toPaddedString(date.getDate(), 2) + " " +
        toPaddedString(date.getHours(), 2) + ":" + toPaddedString(date.getMinutes(), 2) + ":" + toPaddedString(date.getSeconds(), 2);
}

/**
 * The Stamp type.
 * @typedef {Object} Stamp
 * @property {Date} date - The date of the stamp.
 * @property {typeof STAMP_TYPES[keyof typeof STAMP_TYPES]} stampType - The type of the stamp. 
 */