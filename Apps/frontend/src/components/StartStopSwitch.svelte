<script>
  import Switch from "svelte-toggle";
  import { LINE_COLORS_RGBA } from "../const.js";
  import { channelActivated } from "../stores.js";
  export let channel;

  let color = LINE_COLORS_RGBA[channel];
</script>

<div class="control-panel--bottom_switch" data-cy="startStopSwitch-{channel}">
  <Switch
    hideLabel
    small
    bind:toggled={$channelActivated[channel]}
    toggledColor={color}
  />
</div>
