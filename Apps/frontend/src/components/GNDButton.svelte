<script>
  import { Tooltip } from "sveltestrap";
  import { TOOLTIP_BUTTON_GND } from '../labels';

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  const handleClick = async (/** @type {boolean} */ down) => {
    dispatch("set-gnd", { down: down });
  };
</script>

<div>
  <button
    id="btn-gnd"
    class="icon-button mui-icon--drop-down"
    on:mousedown={async () => {
      handleClick(true);
    }}
    on:mouseup={async () => {
      handleClick(false);
    }}
    data-cy="gnd-button"
  />
  <Tooltip target="btn-gnd" placement="bottom">{TOOLTIP_BUTTON_GND}</Tooltip>
</div>
