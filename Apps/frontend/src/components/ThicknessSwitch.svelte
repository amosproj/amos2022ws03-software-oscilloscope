<script>
  import Switch from "svelte-toggle";
  import { LINE_COLORS_RGBA } from "../const.js";
  import { channelConfig } from "../stores.js";

  export let onClick = (event) => {
    console.error(`Missing implementation for thickness)!`);
  };

  export let channel;
</script>

<div class="switch-wrapper" data-cy="thicknessSwitch-{channel}">
  <Switch
    hideLabel
    bind:toggled={$channelConfig[channel].thickness}
    on:click={(event) => {
      onClick(event);
    }}
    toggledColor={LINE_COLORS_RGBA[channel]}
  />
</div>

<style>
  .switch-wrapper {
    display: flex;
    justify-content: start;
    margin: 0.56rem;
  }
</style>
