<script>
  import { amplitudeAdjustment } from "../stores.js";
  import { MIN_AMPLITUDE, MAX_AMPLITUDE } from "../const.js";
  export let onInput = (amplitude) => {
    console.error(
      `Missing implementation of AmplitudeSlider.onInput(${amplitude})!`
    );
    return amplitude;
  };

  export let channel;
  // default amplification
  let amplitude = 1.0;
</script>

<div class="control-panel--entry" data-cy="amplitudeSlider-{channel}">
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
  />
  <span>{(1 / amplitude).toFixed(2)}</span>
</div>
