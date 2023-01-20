import { rgbArrayToRGBAString } from "./helper";

export const CANVAS_WIDTH = 1000;
export const CANVAS_HEIGHT = 500;
export const NUM_INTERVALS_VERTICAL = 20;
export const NUM_INTERVALS_HORIZONTAL = 10;

export const INDICATOR_DECIMAL_PLACES = 3;
export const INDICATOR_SECTION_WIDTH = 120;

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
export const LINE_THICKNESS_SMALL = 0.002;
export const LINE_THICKNESS_BIG = 0.008;

export const NUM_CHANNELS = 10;
export const MIN_SWEEP = 0.1; // <= 1
export const MAX_SWEEP = 2.0; // >= 1
export const MIN_SWEEP_SLIDER_VALUE = 0;
export const MAX_SWEEP_SLIDER_VALUE = 10;
export const DEFAULT_STEP_SIZE = 1.0;
export const MIN_AMPLITUDE = 0.0;
export const MAX_AMPLITUDE = NUM_INTERVALS_HORIZONTAL / 2;
export const WAVE_CURSOR_SIZE = 50;

export const MIN_CONTROL_PANEL_BOTTOM_HEIGHT = 280; //px

/* FRONTEND CONFIG */
export const BASE_URL = import.meta.env.VITE_BASE_URL;
/* END FRONTEND CONFIG */

/* REST API CONFIG */
export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
export const BACKEND_API_URL = `${BACKEND_BASE_URL}`;
export const REST_ENDPOINT_CONFIG = `${BACKEND_API_URL}/config`;
/* END REST API CONFIG */
