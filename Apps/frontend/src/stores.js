import { writable } from "svelte/store";
import { NUM_CHANNELS } from "./const";

export const osciData = writable([]);

export const channelConfig = writable(
  Array(NUM_CHANNELS + 1)
    .fill()
    .map(() => ({
      channelId: 0,
      enabled: true,
      thickness: false,
      offset: 0,
      sweepSpeed: 5,
      amplitude: 1,
    }))
);
