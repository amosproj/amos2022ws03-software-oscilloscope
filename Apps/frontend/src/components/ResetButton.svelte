<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  $: url = "../assets/icon_reset.svg";

  const handleClick = async () => {
    dispatch("reset", {});
  };
</script>

<button
  class="icon-button icon--reset"
  on:click={handleClick}
  data-cy="reset-button"
/>
