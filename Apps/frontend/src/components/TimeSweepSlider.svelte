<script>
  import { NUM_CHANNELS } from "../const";
  import { channelConfig } from "../stores";
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

<div class="control-panel-items">
  <input
    type="range"
    min="0"
    max="10"
    bind:value={$channelConfig[channel].sweepSpeed} 
    on:change={handleChange}
    data-cy="timesweepSlider-{channel}"
  />
</div>
