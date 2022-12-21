<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let wavesFreezed = true;
  $: label = "Turn " + (wavesFreezed ? "on" : "off") + ".";

  const handleClick = async () => {
    wavesFreezed = !wavesFreezed;
    dispatch("switch-plot-enabled", { enabled: !wavesFreezed });
  };

  export const click = () => {
    handleClick();
  };
</script>

<br />
<button id="button-waves-freezed" on:click={handleClick}>{label}</button>

<style>
  #button-waves-freezed {
    border-style: solid;
    border-color: grey;
  }
</style>
