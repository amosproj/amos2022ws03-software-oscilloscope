<script>
  import { createEventDispatcher } from "svelte";
  import Switch from "svelte-toggle";
  import { LINE_COLORS_RGBA } from "../const.js";
  import { channelConfig } from "../stores.js";
  export let channel;

  const dispatch = createEventDispatcher();

  let color = LINE_COLORS_RGBA[channel];
  let channelLabel = `CH ${channel}`;

  const handleStartStop = async () => {
    dispatch("startStop", { buttonValue: $channelConfig[channel].enabled });
  };
</script>

<div class="switch-wrapper">
  <small style="margin-right: 0.5vw;">{channelLabel}</small>
  <Switch
    bind:toggled={$channelConfig[channel].enabled}
    hideLabel
    toggledColor={color}
    on:click={handleStartStop}
  />
</div>

<style>
  .switch-wrapper {
    display: flex;
    justify-content: start;
    margin: 0.32rem;
  }
</style>
