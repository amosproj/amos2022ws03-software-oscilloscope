<script>
  import { createEventDispatcher } from "svelte";
  import Switch from "svelte-toggle";
  import { LINE_COLORS_RGBA } from "../const.js";
  export let channel;

  const dispatch = createEventDispatcher();

  let hasStarted = true;
  let color = LINE_COLORS_RGBA[channel];

  const handleStartStop = async () => {
    hasStarted = !hasStarted;
    dispatch("startStop", { buttonValue: hasStarted });
  };
</script>

<div class="control-panel--bottom_switch" data-cy="startStopSwitch-{channel}">
  <Switch
    hideLabel
    small
    toggledColor={color}
    bind:value={hasStarted}
    on:click={handleStartStop}
  />
</div>
