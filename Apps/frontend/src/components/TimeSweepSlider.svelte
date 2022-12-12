<script>
  import { timeSweep } from "../stores";
  import { NUM_CHANNELS } from "../const";
  export let channel;
  
  export let isCommon = false;
  const handleChange = () => {
    if (isCommon) {
      for (let index=0; index<NUM_CHANNELS; index++) {
        $timeSweep[index] = $timeSweep[channel];
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
