import { writable } from "svelte/store";
import { NUM_CHANNELS } from "./const";

export const osciData = writable([]);

export const timeSweep = writable(new Array(NUM_CHANNELS).fill(5));

// store for the amplification factors of each channel
export const amplitudeAdjustment = writable(new Array(NUM_CHANNELS).fill(1));

export const thicknessAdjustment = writable(
  new Array(NUM_CHANNELS).fill(false)
);
