import { writable } from "svelte/store";
import { NUM_CHANNELS } from "./const";

/** Flag for freezing and starting canvas */
export const osciEnabled = writable(false);

export const osciData = writable([]);

/** @type {import("svelte/store").Writable<Array<Number>>}
 * store for the timeSweep of each channel
 */
export const timeSweep = writable(new Array(NUM_CHANNELS + 1).fill(5));

/**
 * @type {import("svelte/store").Writable<Array<boolean>>}
 * @description store for the activation of each channel
 * @example true => channel active, false => channel disabled
 */
export const channelActivated = writable(new Array(NUM_CHANNELS).fill(false));

/**
 * @type {import("svelte/store").Writable<Array<boolean>>}
 * @description store for thickness setting of each channel
 * @example true => thick, false => thin
 */
export const thicknessAdjustment = writable(
  new Array(NUM_CHANNELS).fill(false)
);

/**
 * @type {import("svelte/store").Writable<Array<number>>}
 * @description store for the offset of each channel
 * @example
 */
export const offsetAdjustment = writable(new Array(NUM_CHANNELS).fill(0));

/**
 * @type {import("svelte/store").Writable<Array<number>>}
 * @description store for the amplification factor of each channel
 * @example
 */
export const amplitudeAdjustment = writable(new Array(NUM_CHANNELS).fill(1));

export const expandedPanelOpen = writable(false);
export const isGND = writable(false);
