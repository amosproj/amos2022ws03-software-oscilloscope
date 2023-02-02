<script>
  import clsx from "clsx";
  import { createEventDispatcher } from "svelte";
  import { osciEnabled } from "../stores";
  import { Tooltip } from "sveltestrap";
  import {
    TOOLTIP_BUTTON_OFFOFF_ON,
    TOOLTIP_BUTTON_OFFOFF_OFF,
  } from "../labels";

  const dispatch = createEventDispatcher();

  const handleClick = async () => {
    $osciEnabled = !$osciEnabled;
    dispatch("switch-plot-enabled", { enabled: $osciEnabled });
  };

  export const click = () => {
    handleClick();
  };
  let button;
</script>

<button
  bind:this={button}
  data-cy="on-off-button"
  class={clsx(
    { "icon-button": true },
    { "icon--off": $osciEnabled },
    { "icon--on": !$osciEnabled }
  )}
  on:click={handleClick}
/>
<Tooltip target={button} placement="bottom" data-cy="on-off-button-tooltip">
  {$osciEnabled ? TOOLTIP_BUTTON_OFFOFF_OFF : TOOLTIP_BUTTON_OFFOFF_ON}
</Tooltip>
