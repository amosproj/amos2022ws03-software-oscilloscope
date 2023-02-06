import { rgbArrayToRGBAString } from "./helper";

export const CANVAS_WIDTH = 1000;
export const CANVAS_HEIGHT = 500;
export const NUM_INTERVALS_VERTICAL = 20;
export const NUM_INTERVALS_HORIZONTAL = 10;
export const INDICATORS_UPDATE_FREQUENCY = 1000;
export const TEXT_INDICATORS_DECIMAL_PLACES = 3;
export const LINE_INDICATORS_CANVAS_WIDTH = 120;

export const COORDINATE_LINE_COLOR = "#FFFFFF80";

export const LINE_COLORS = [
  [230, 0, 73],
  [11, 180, 255],
  [80, 233, 145],
  [230, 216, 0],
  [155, 25, 245],
  [255, 163, 0],
  [220, 10, 180],
  [179, 212, 255],
  [0, 191, 160],
  [128, 143, 128],
];

export const LINE_COLORS_RGBA = LINE_COLORS.map(rgbArrayToRGBAString);
export const LINE_COLORS_WEBGL = LINE_COLORS.map((color) =>
  color.map((num) => num / 255).concat([1])
);
export const NUM_CHANNELS = 10;
export const MIN_SWEEP = 0.1; // <= 1
export const MAX_SWEEP = 2.0; // >= 1
export const MIN_SWEEP_SLIDER_VALUE = 0;
export const MAX_SWEEP_SLIDER_VALUE = 10;
export const DEFAULT_STEP_SIZE = 1.0;
export const MIN_AMPLITUDE = 0.0;
export const MAX_AMPLITUDE = NUM_INTERVALS_HORIZONTAL / 2;
export const WAVE_CURSOR_SIZE = 50;
export const HEAD_WIDTH_PIXEL = 3;

export const MIN_CONTROL_PANEL_BOTTOM_HEIGHT = 304; //px

/* FRONTEND CONFIG */
export const BASE_URL = import.meta.env.VITE_BASE_URL;
/* END FRONTEND CONFIG */

/* REST API CONFIG */
export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
export const BACKEND_API_URL = `${BACKEND_BASE_URL}`;
export const REST_ENDPOINT_CONFIG = `${BACKEND_API_URL}/config`;
/* END REST API CONFIG */

/* DISPLAY SPEED */
const EXPECTED_UPDATES_PER_SECOND = 10_000;
// Change this after functionality for measuring actual updates per second is implemented
const REAL_UPDATES_PER_SECOND = EXPECTED_UPDATES_PER_SECOND;
export const TIME_PER_DIV =
  EXPECTED_UPDATES_PER_SECOND / REAL_UPDATES_PER_SECOND;
/* END DISPLAY SPEED */
