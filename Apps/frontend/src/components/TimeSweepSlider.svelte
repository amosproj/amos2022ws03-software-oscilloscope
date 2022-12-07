<script>
  import { timeSweep } from "../stores";
  import { NUM_CHANNELS } from "../const";
  export let channel;
  
  export let isCommon = false;
  const handleChange = () => {
    if (isCommon) {
      for (let idx=0; idx<NUM_CHANNELS; idx++) {
        $timeSweep[idx] = $timeSweep[channel];
      }
    }
  }
</script>

<div>
  <input
    type="range"
    min="0"
    max="10"
    class="slider"
    bind:value={$timeSweep[channel]}
    on:change={handleChange}
    data-cy="timesweepSlider-{channel}"
  />
</div>
