<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  $: label = "GND";
  const handleClick = async (/** @type {boolean} */ down) => {
    dispatch("set-gnd", { down: down });
  };
</script>

<br />
<button
  id="btn-gnd"
  on:mousedown={async () => {
    handleClick(true);
  }}
  on:mouseup={async () => {
    handleClick(false);
  }}>{label}</button
>

<style>
  #btn-gnd {
    border-style: solid;
    border-color: grey;
  }
</style>
