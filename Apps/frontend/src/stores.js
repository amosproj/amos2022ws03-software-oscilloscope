import { writable } from "svelte/store";
import { NUM_CHANNELS } from "./const";

export const osciData = writable([]);

export const timeSweep = writable(new Array(NUM_CHANNELS).fill(5));

export const amplitudeAdjustment = writable(new Array(NUM_CHANNELS).fill(1));
