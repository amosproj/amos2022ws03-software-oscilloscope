<script>
  import Switch from "svelte-toggle";
  import { LINE_COLORS_RGBA } from "../const.js";
  import { thicknessAdjustment } from "../stores.js";

  export let channel;
</script>

<div class="switch-wrapper" data-cy="thicknessSwitch-{channel}">
  <Switch
    hideLabel
    bind:toggled={$thicknessAdjustment[channel]}
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
