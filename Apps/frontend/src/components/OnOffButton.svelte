<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let isOn = false;
  $: label = "Turn " + (isOn ? "off" : "on") + ".";

  const handleClick = async () => {
    isOn = !isOn;
    dispatch("switch-plot-enabled", { enabled: isOn });
  };

  export const click = () => handleClick();
</script>

<br />
<button id="btn-on-off" on:click={handleClick}>{label}</button>

<style>
  #btn-on-off {
    border-style: solid;
    border-color: grey;
  }
</style>
