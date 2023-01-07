<script>
  import { createEventDispatcher } from "svelte";
  import Switch from "svelte-toggle";
  import { LINE_COLORS_RGBA } from "../const.js";
  export let channel;

  const dispatch = createEventDispatcher();

  let hasStarted = true;
  let color = LINE_COLORS_RGBA[channel];
  let channelLabel = `Ch. ${channel}`;

  const handleStartStop = async () => {
    hasStarted = !hasStarted;
    dispatch("startStop", { buttonValue: hasStarted });
  };
</script>

<div data-cy="startStopSwitch-{channel}">
  <small>{channelLabel}</small>
  <Switch
    hideLabel
    small
    toggledColor={color}
    bind:value={hasStarted}
    on:click={handleStartStop}
  />
</div>
