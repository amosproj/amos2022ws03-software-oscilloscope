<script>
  import { channelConfig } from "../stores";
  export let channel;

  export let onInput = (offsetY) => {
    console.error(
      `Missing implementation of OffsetSlider.onInput(${offsetY})!`
    );
  };
  export let channel;
  let offsetY;
</script>

<div class="control-panel--entry" data-cy="offsetSlider-{channel}">
  <input
    type="range"
    bind:value={$channelConfig[channel].offset}
    on:input={() => {
      onInput(offsetY);
    }}
    min="-1.0"
    max="1.0"
    step="0.01"
  />
</div>
