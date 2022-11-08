import { NR_SHOWN_DATAPOINTS } from "./const";


/**
 * Returns number normalized between -1 and 1.
 *
 * @param {number} number The number to normalize.
 * @return {number} The normalized number
 */
export const normalizeForCanvas = (number) => {
    return ((number - 0)/(NR_SHOWN_DATAPOINTS - 0)*2) - 1;
}