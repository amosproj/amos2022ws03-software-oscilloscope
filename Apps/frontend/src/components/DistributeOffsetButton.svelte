<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  const handleClick = async () => {
    dispatch("distributeOffset", {});
  };
</script>

<button id="distribute-button" on:click={handleClick}>Distribute waves</button>

<style>
  #distribute-button {
    border-style: solid;
    border-color: grey;
  }
</style>
