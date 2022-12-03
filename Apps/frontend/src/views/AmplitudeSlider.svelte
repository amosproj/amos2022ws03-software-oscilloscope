<script>
  import { amplitudeAdjustment } from "../stores.js";
  import { MIN_AMPLITUDE, MAX_AMPLITUDE } from "../const.js";

  /** @type {number} */
  export let channel;

  /**
   * Callback to be called when the user moves the slider
   * @param {number} amplitude
   */
  export let onInput = (amplitude) => {
    console.error(
      `Missing implementation of AmplitudeSlider.onInput(${amplitude})!`
    );
  };

  // default amplification
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
