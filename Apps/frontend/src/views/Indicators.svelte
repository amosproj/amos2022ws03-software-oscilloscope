<link rel="stylesheet" href="../app.scss">
<script>
  import {
    NUM_CHANNELS,
  } from "../const";
  import { roundVoltage } from "../helper";
  import { LINE_COLORS_RGBA } from "../const.js";

  let min = Array(NUM_CHANNELS).fill(0.0);
  let max = Array(NUM_CHANNELS).fill(0.0);
  let startStopLine = Array(NUM_CHANNELS).fill(true);

  /**
   * Trigger a rerender of the indicators with given sample array.
   *
   * @param {number[]} samples
   */
  export const update = (samples) => {
    for (let channel = 0; channel < NUM_CHANNELS; channel++) {
      if (!startStopLine[channel]) continue;
      if (samples[channel] > max[channel]) max[channel] = samples[channel];
      if (samples[channel] < min[channel]) min[channel] = samples[channel];
    }
  };

  export const reset = () => {
    min = Array(NUM_CHANNELS).fill(0.0);
    max = Array(NUM_CHANNELS).fill(0.0);
  }

  /**
   * Start or stop indicator updates of a channel.
   *
   * @param {number} channelIndex
   * @param {boolean} hasStarted
   */
  export const startStopChannelI = (channelIndex, hasStarted) => {
    startStopLine[channelIndex] = hasStarted;
  };
</script>

<div data-cy="indicators">
{#each min as _, i}
    <div style="color: {LINE_COLORS_RGBA[i]}">
      [{i}]
      Min: {roundVoltage(min[i])} V
      <br>
      Max: {roundVoltage(max[i])} V
    </div>
{/each}
</div>
