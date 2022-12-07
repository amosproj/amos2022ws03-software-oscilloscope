<script>
  import Switch from "svelte-toggle";
  import { LINE_COLORS_RGBA } from "../const.js";
  import { thicknessAdjustment } from "../stores.js";

  export let onClick = (isThick) => {
    console.error(
      `Missing implementation of ThicknessSwitch.onClick(${isThick})!`
    );
    return;
  };

  export let channel;
  let isThick = false;
</script>

<div class="switch-wrapper" data-cy="thicknessSwitch-{channel}">
  <Switch
    hideLabel
    bind:toggled={isThick}
    on:click={() => {
      $thicknessAdjustment[channel] = isThick;
      onClick(isThick);
    }}
    toggledColor={LINE_COLORS_RGBA[channel]}
  />
</div>

<style>
  .switch-wrapper {
    display: flex;
    justify-content: center;
    margin: 0.25rem;
  }
</style>
