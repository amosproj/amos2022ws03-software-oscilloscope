<script>
  import Switch from "svelte-toggle";
  import { LINE_COLORS_RGBA } from "../const.js";
  import { thicknessAdjustment } from "../stores.js";

  export let channel;
</script>

<div class="control-panel--bottom_switch" data-cy="thicknessSwitch-{channel}">
  <Switch
    hideLabel
    small
    bind:toggled={$thicknessAdjustment[channel]}
    toggledColor={LINE_COLORS_RGBA[channel]}
  />
</div>
