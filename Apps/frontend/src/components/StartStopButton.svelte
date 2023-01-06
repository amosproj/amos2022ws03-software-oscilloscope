<script>
  import { createEventDispatcher } from "svelte";
  import Switch from "svelte-toggle";
  import { LINE_COLORS_RGBA } from "../const.js";
  export let channel_id;

  const dispatch = createEventDispatcher();

  let hasStarted = true;
  let color = LINE_COLORS_RGBA[channel_id];
  let channelLabel = `Ch. ${channel_id}`;

  const handleStartStop = async () => {
    hasStarted = !hasStarted;
    dispatch("startStop", { buttonValue: hasStarted });
  };
</script>

<div>
  <small>{channelLabel}</small>
  <Switch
    hideLabel
    small
    toggledColor={color}
    bind:value={hasStarted}
    on:click={handleStartStop}
  />
</div>
