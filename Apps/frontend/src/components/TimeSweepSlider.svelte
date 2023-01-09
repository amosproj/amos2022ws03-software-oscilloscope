<script>
  import { timeSweep } from "../stores";
  import { NUM_CHANNELS } from "../const";
  import { computeStepsizeFromTimeSweep } from "../helper.js";
  export let channel;
  $timeSweep[channel] = 5;

  export let isCommon = false;
  const handleChange = () => {
    if (isCommon) {
      for (let index = 0; index < NUM_CHANNELS; index++) {
        $timeSweep[index] = $timeSweep[channel];
      }
    }
  };
</script>

<div class="control-panel-items">
  <input
    type="range"
    min="0"
    max="10"
    bind:value={$timeSweep[channel]}
    on:change={handleChange}
    data-cy="timesweepSlider-{channel}"
  />
  <span>
    {'×' + computeStepsizeFromTimeSweep($timeSweep[channel]).toFixed(2)}
  </span>
</div>
