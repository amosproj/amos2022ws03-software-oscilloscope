<script>
  import { timeSweep } from "../stores";
  import {
    MAX_SWEEP_SLIDER_VALUE,
    MIN_SWEEP_SLIDER_VALUE,
    NUM_CHANNELS,
  } from "../const";

  export let channel;

  export let isCommon = false;
  const handleChange = () => {
    if (isCommon) {
      for (let index = 0; index < NUM_CHANNELS; index++) {
        $channelConfig[index].sweepSpeed = $channelConfig[channel].sweepSpeed;
      }
    }
  };
</script>

<div class="control-panel--entry">
  <input
    type="range"
    min={MIN_SWEEP_SLIDER_VALUE}
    max={MAX_SWEEP_SLIDER_VALUE}
    bind:value={$timeSweep[channel]}
    on:change={handleChange}
    data-cy="timesweepSlider-{channel}"
  />
</div>
