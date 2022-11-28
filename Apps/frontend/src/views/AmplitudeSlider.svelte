<script>
  import { amplitudeAdjustment } from "../stores.js";
  import { MIN_AMPLITUDE, MAX_AMPLITUDE } from "../const.js";
  export let onInput = (amplitude) => {
    return amplitude;
  };

  export let channel;
  let amplitude = 1.0;
</script>

<div>
  <input
    type="range"
    bind:value={amplitude}
    on:input={() => {
      $amplitudeAdjustment[channel] = amplitude;
      onInput(amplitude);
    }}
    min={MIN_AMPLITUDE}
    max={MAX_AMPLITUDE}
    step="0.01"
    class="slider"
    data-cy="amplitudeSlider-{channel}"
  />
</div>
