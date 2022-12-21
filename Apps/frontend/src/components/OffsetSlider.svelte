<script>
  import { channelConfig } from "../stores";
  export let channel;

  export let onInput = (offsetY) => {
    console.error(
      `Missing implementation of OffsetSlider.onInput(${offsetY})!`
    );
  };
  let offsetY;
</script>

<div class="control-panel-items">
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
