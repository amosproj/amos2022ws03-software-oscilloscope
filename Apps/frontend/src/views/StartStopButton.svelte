<script>
  import { createEventDispatcher } from "svelte";
  import Switch from "svelte-toggle";
  import { LINE_COLORS_RGBA } from "../const.js";
  export let channel_id;

  const dispatch = createEventDispatcher();

  let hasStarted = false;
  let color = LINE_COLORS_RGBA[channel_id];
  let channelLabel = `CH ${channel_id}`;

  const handleStartStop = async () => {
    console.log("erstes hasStarted " + hasStarted);
    //hasStarted = !hasStarted;
    dispatch("startStop", { buttonValue: !hasStarted });
  };
</script>

<div class="switch-wrapper">
  <small style="margin-right: 0.5vw;">{channelLabel}</small>
  <Switch
    hideLabel
    bind:toggled={hasStarted}
    on:click={handleStartStop}
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
