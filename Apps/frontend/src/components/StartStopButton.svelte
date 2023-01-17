<script>
  import { createEventDispatcher } from "svelte";
  import Switch from "svelte-toggle";
  import { LINE_COLORS_RGBA } from "../const.js";
  import { channelConfig } from "../stores.js";
  export let channel;

  const dispatch = createEventDispatcher();

  let color = LINE_COLORS_RGBA[channel];

  const handleStartStop = async () => {
    dispatch("startStop", { buttonValue: !$channelConfig[channel].enabled });
  };
</script>

<div class="control-panel--bottom_switch">
  <Switch
    hideLabel
    bind:toggled={$channelConfig[channel].enabled}
    on:click={handleStartStop}
    toggledColor={color}
  />
</div>
