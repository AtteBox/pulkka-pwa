/**
 * Convert a number to a string with a fixed length filled with leading zeros.
 * 
 * @param {number} number
 * @param {number} length
 */
export function toPaddedString(number, length) {
    return number.toString().padStart(length, '0');
}