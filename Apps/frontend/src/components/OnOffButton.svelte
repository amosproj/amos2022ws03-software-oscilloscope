<script>
  import clsx from "clsx";
  import { createEventDispatcher } from "svelte";
  import { osciEnabled } from "../stores";
  import { Tooltip } from "sveltestrap";
  import {
    TOOLTIP_BUTTON_OFFOFF_BASE,
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
</script>

<div>
  <button
    id="btn-onoff"
    data-cy="on-off-button"
    class={clsx(
      { "icon-button": true },
      { "mui-icon--off": $osciEnabled },
      { "mui-icon--on": !$osciEnabled }
    )}
    on:click={handleClick}
  />
  <Tooltip target="btn-onoff" placement="bottom"
    >{TOOLTIP_BUTTON_OFFOFF_BASE}{$osciEnabled
      ? TOOLTIP_BUTTON_OFFOFF_OFF
      : TOOLTIP_BUTTON_OFFOFF_ON}</Tooltip
  >
</div>
