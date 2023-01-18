import { writable, get } from "svelte/store";
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
export const presetPopupOpen = writable(false);
export const isGND = writable(false);

export const availableChannelConfigPresets = writable([]);

export const getLiveChannelConfig = () => {
  return Array(NUM_CHANNELS + 1)
    .fill()
    .map((_, idx) => ({
      channelId: idx,
      enabled: get(channelActivated)[idx],
      thickness: get(thicknessAdjustment)[idx],
      offset: get(offsetAdjustment)[idx],
      sweepSpeed: get(timeSweep)[idx],
      amplitude: get(amplitudeAdjustment)[idx],
    }));
};

export const setLiveChannelConfig = (channelConfig) => {
  let timeSweepArray = Array(NUM_CHANNELS + 1).fill(0);
  let channelActivatedArray = Array(NUM_CHANNELS).fill(false);
  let thicknessAdjustmentArray = Array(NUM_CHANNELS).fill(false);
  let offsetAdjustmentArray = Array(NUM_CHANNELS).fill(0);
  let amplitudeAdjustmentArray = Array(NUM_CHANNELS).fill(1);

  channelConfig.forEach((config, idx) => {
    timeSweepArray[idx] = config.sweepSpeed;
    if (idx < NUM_CHANNELS) {
      channelActivatedArray[idx] = config.enabled;
      thicknessAdjustmentArray[idx] = config.thickness;
      offsetAdjustmentArray[idx] = config.offset;
      amplitudeAdjustmentArray[idx] = config.amplitude;
    }
  });

  timeSweep.set(timeSweepArray);
  channelActivated.set(channelActivatedArray);
  thicknessAdjustment.set(thicknessAdjustmentArray);
  offsetAdjustment.set(offsetAdjustmentArray);
  amplitudeAdjustment.set(amplitudeAdjustmentArray);
};
