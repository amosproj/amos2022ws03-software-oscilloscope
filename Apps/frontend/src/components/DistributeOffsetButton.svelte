<script>
  import { createEventDispatcher } from "svelte";
  import { NUM_CHANNELS } from "../const.js";

  const dispatch = createEventDispatcher();
  const handleClick = async () => {
    dispatch("distributeOffset", { offset: calculateOffset() });
  };
  function calculateOffset() {
    // offset is calculated based on the number of channels between -1 and 1
    return 2 / (NUM_CHANNELS + 1);
  }
</script>

<button id="distribute-button" on:click={handleClick}>Distribute waves</button>

<style>
  #distribute-button {
    border-style: solid;
    border-color: grey;
  }
</style>
