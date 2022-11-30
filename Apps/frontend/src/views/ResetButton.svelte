<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  $: label = "Reset";

  const handleClick = async () => {
    dispatch("reset", {});
  };
</script>

<br />
<button id="button-reset" on:click={handleClick}>{label}</button>

<style>
  #button-reset {
    border-style: solid;
    border-color: grey;
  }
</style>
