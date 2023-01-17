<script>
  import Switch from "svelte-toggle";
  import { LINE_COLORS_RGBA } from "../const.js";
  import { channelActivated } from "../stores.js";
  export let channel_id;

  let color = LINE_COLORS_RGBA[channel_id];
  let channelLabel = `CH ${channel_id}`;
</script>

<div class="switch-wrapper">
  <small style="margin-right: 0.5vw;">{channelLabel}</small>
  <Switch
    hideLabel
    bind:toggled={$channelActivated[channel_id]}
    toggledColor={color}
  />
</div>

<style>
  .switch-wrapper {
    display: flex;
    justify-content: start;
    margin: 0.32rem;
  }
</style>
