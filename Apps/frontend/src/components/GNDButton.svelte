<script>
  import { Tooltip } from "sveltestrap";
  import { TOOLTIP_BUTTON_GND } from "../labels";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  const handleClick = async (/** @type {boolean} */ down) => {
    dispatch("set-gnd", { down: down });
  };
  let button;
</script>

<button
  bind:this={button}
  class="icon-button icon--ground"
  on:mousedown={async () => {
    handleClick(true);
  }}
  on:mouseup={async () => {
    handleClick(false);
  }}
  data-cy="gnd-button"
/>
<Tooltip target={button} placement="bottom" data-cy="gnd-button-tooltip"
  >{TOOLTIP_BUTTON_GND}</Tooltip
>
