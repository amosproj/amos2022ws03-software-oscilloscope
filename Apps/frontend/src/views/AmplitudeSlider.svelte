<script>
  import { channelConfig } from "../stores.js";
  import { MIN_AMPLITUDE, MAX_AMPLITUDE } from "../const.js";

  export let onInput = (amplitude) => {
    console.error(
      `Missing implementation of AmplitudeSlider.onInput(${amplitude})!`
    );
  };

  export let channel;
</script>

<div class="control-panel-items" data-cy="amplitudeSlider-{channel}">
  <input
    type="range"
    bind:value={$channelConfig[channel].amplitude}
    on:input={() => {
      onInput($channelConfig[channel].amplitude);
    }}
    min={MIN_AMPLITUDE}
    max={MAX_AMPLITUDE}
    step="0.01"
  />
  <span>{(1 / $channelConfig[channel].amplitude).toFixed(2)}</span>
</div>
