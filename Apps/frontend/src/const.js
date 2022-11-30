import { rgbArrayToRGBAString } from "./helper";

export const CANVAS_WIDTH = 1000;
export const CANVAS_HEIGHT = 500;
export const NUM_INTERVALS_X = 20;
export const NUM_INTERVALS_Y = 10;

export const INDICATOR_MARGIN = 4;
export const INDICATOR_WIDTH = 8;
export const INDICATOR_FONT_SIZE = 11;
export const INDICATOR_DECIMAL_PLACES = 3;
export const INDICATOR_SECTION_WIDTH = 235;
export const INDICATOR_ZERO_LINE_COLOR = "#ffffff80";

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

export const NUM_CHANNELS = 10;
export const MIN_SWEEP = 0.5; // <= 1
export const MAX_SWEEP = 2.0; // >= 1
export const MIN_AMPLITUDE = 0.0;
export const MAX_AMPLITUDE = NUM_INTERVALS_Y / 2;
