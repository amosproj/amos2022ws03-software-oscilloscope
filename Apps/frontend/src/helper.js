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

export const logSocketCloseCode = (code) => {
  // See https://www.rfc-editor.org/rfc/rfc6455#section-7.4.1
  switch (code) {
    case 1000:
      console.log("Socket closed normally.");
      break;
    case 1001:
      console.log("Socket closed due to server shutdown.");
      break;
    case 1002:
      console.log("Socket closed due to protocol error.");
      break;
    case 1003:
      console.log("Socket closed due to unsupported data.");
      break;
    case 1004:
      console.log("Socket closed due to reserved error.");
      break;
    case 1005:
      console.log("Socket closed due to no status code.");
      break;
    case 1006:
      console.log("Socket closed due to abnormal closure.");
      break;
    case 1007:
      console.log("Socket closed due to invalid frame payload data.");
      break;
    case 1008:
      console.log("Socket closed due to policy violation.");
      break;
    case 1009:
      console.log("Socket closed due to message too big.");
      break;
    case 1010:
      console.log("Socket closed due to missing extension.");
      break;
    case 1011:
      console.log("Socket closed due to internal error.");
      break;
    case 1012:
      console.log("Socket closed due to service restart.");
      break;
    case 1013:
      console.log("Socket closed due to try again later.");
      break;
    case 1014:
      console.log("Socket closed due to bad gateway.");
      break;
    case 1015:
      console.log("Socket closed due to TLS handshake.");
      break;
    default:
      console.log("Socket closed due to unknown reason.");
  }
};

/**
 * The function introduces an event handler to check if there is a click
 * event outside the chosen element.
 * To attach the handler add `use:clickOutside` to the node properties.
 */
export const clickOutside = (element) => {
  const handleClick = (event) => {
    if (
      element &&
      !element.contains(event.target) &&
      !event.defaultPrevented
    ) {
      element.dispatchEvent(new CustomEvent("click-outside", element));
    }
  };
  document.addEventListener("click", handleClick, true);
  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
    },
  };
};
