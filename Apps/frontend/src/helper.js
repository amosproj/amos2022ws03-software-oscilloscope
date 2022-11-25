import { INDICATOR_DECIMAL_PLACES } from "./const";

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
