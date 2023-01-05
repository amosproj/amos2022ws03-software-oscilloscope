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
  id="button-on-off"
  class={clsx(
    { "icon-button": true },
    { "mui-icon--off": $osciEnabled },
    { "mui-icon--on": !$osciEnabled }
  )}
  on:click={handleClick}
/>
