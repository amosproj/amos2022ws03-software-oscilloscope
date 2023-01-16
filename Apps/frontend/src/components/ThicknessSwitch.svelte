<script>
  import Switch from "svelte-toggle";
  import { LINE_COLORS_RGBA } from "../const.js";
  import { channelConfig } from "../stores.js";

  export let onClick = (event) => {
    console.error(`Missing implementation for thickness)!`);
  };

  export let channel;
</script>

<div class="control-panel--bottom_switch" data-cy="thicknessSwitch-{channel}">
  <Switch
    hideLabel
    small
    bind:toggled={$channelConfig[channel].thickness}
    on:click={() => {
      $channelConfig[channel].thickness = !channelConfig[channel].thickness;
      onClick();
    }}
    toggledColor={LINE_COLORS_RGBA[channel]}
  />
</div>
