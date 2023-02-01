<script>
  import { roundVoltage } from "../helper.js";
  import { LINE_COLORS_RGBA, NUM_CHANNELS } from "../const.js";
  import { channelActivated } from "../stores.js";

  let min = Array(NUM_CHANNELS).fill(0.0);
  let max = Array(NUM_CHANNELS).fill(0.0);
  let isActive = Array(NUM_CHANNELS).fill(true);

  channelActivated.subscribe((newIsActive) => {
    isActive = newIsActive;
  });

  /**
   * Trigger a rerender of the indicators with given sample array.
   *
   * @param {number[]} samples
   */
  export const update = (samples) => {
    for (let channel = 0; channel < NUM_CHANNELS; channel++) {
      if (!isActive[channel]) continue;
      if (samples[channel] > max[channel]) {
        max[channel] = samples[channel];
      }
      if (samples[channel] < min[channel]) {
        min[channel] = samples[channel];
      }
    }
  };

  export const reset = () => {
    min = Array(NUM_CHANNELS).fill(0.0);
    max = Array(NUM_CHANNELS).fill(0.0);
  };
</script>

<table data-cy="text-indicators">
  {#each min as _, i}
    <tr style="color: {LINE_COLORS_RGBA[i]}">
      <td>
        [{i + 1}]
      </td>
      <td>
        Min: {roundVoltage(min[i])} V
        <br />
        Max: {roundVoltage(max[i])} V
      </td>
    </tr>
  {/each}
</table>
