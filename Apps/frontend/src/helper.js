import { INDICATOR_DECIMAL_PLACES, NR_SHOWN_DATAPOINTS } from "./const";

/**
 * Returns number normalized between -1 and 1.
 *
 * @param {number} number The number to normalize.
 * @return {number} The normalized number
 */
export const normalizeForCanvas = (number) => {
  return ((number - 0) / (NR_SHOWN_DATAPOINTS - 0)) * 2 - 1;
};

/**
 * Returns hex string for array of rgb values.
 *
 * @param {[number, number, number]} rgb Array of rgb values
 * @returns {string} rgba string
 */
export const rgbArrayToRGBAString = (rgb) =>
  `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;

export const roundVoltage = (voltage) =>
  Math.trunc(voltage * 10 ** INDICATOR_DECIMAL_PLACES) /
  10 ** INDICATOR_DECIMAL_PLACES;
