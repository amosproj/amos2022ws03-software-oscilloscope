<script>
  import clsx from "clsx";
  import { createEventDispatcher } from "svelte";
  import { osciEnabled } from "../stores";

  const dispatch = createEventDispatcher();

  const handleClick = async () => {
    $osciEnabled = !$osciEnabled;
    dispatch("switch-plot-enabled", { enabled: $osciEnabled });
  };

  export const click = () => {
    handleClick();
  };
</script>

<button
  data-cy="on-off-button"
  class={clsx(
    { "icon-button": true },
    { "icon--off": $osciEnabled },
    { "icon--on": !$osciEnabled }
  )}
  on:click={handleClick}
/>
