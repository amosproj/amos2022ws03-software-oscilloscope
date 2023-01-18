<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  const handleClick = async (/** @type {boolean} */ down) => {
    dispatch("set-gnd", { down: down });
  };
</script>

<button
  class="icon-button icon--ground"
  on:mousedown={async () => {
    handleClick(true);
  }}
  on:mouseup={async () => {
    handleClick(false);
  }}
  data-cy="gnd-button"
/>
