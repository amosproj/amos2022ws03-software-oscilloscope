import { writable } from "svelte/store";
import { NUM_CHANNELS } from "./const";

export const osciData = writable([]);

/**
 * @type {import("svelte/store").Writable<number[]>}
 * Stores the timeSweep factor of each channel
 */
export const timeSweep = writable(new Array(NUM_CHANNELS + 1).fill(5));

/**
 * @type {import("svelte/store").Writable<number[]>}
 * Stores the amplification factor of each channel
 */
export const amplitudeAdjustment = writable(new Array(NUM_CHANNELS).fill(1));

/**
 * @type {import("svelte/store").Writable<boolean[]>}
 * Stores the thickness state of each channels
 */
export const thicknessAdjustment = writable(
  new Array(NUM_CHANNELS).fill(false)
);

/**
 * @type {import("svelte/store").Writable<boolean[]>}
 * Stores the activation state of each channels
 */
export const channelEnabled = writable(new Array(NUM_CHANNELS).fill(false));
