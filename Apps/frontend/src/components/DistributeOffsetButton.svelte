<script>
  import { NUM_CHANNELS } from "../const";
  import { channelActivated, offsetAdjustment } from "../stores";
  import { Tooltip } from "sveltestrap";
  import { TOOLTIP_BUTTON_DISTRIBUTE } from "../labels";

  function calculateOffset() {
    // offset is calculated based on the number of channels between -1 and 1
    return 2 / ($channelActivated.filter(Boolean).length + 1);
  }

  let button;
</script>

<button
  bind:this={button}
  class="icon-button icon--distribute"
  on:click={() => {
    let baseOffset = calculateOffset();
    let offsetY = 1 - baseOffset;
    for (let index = 0; index < NUM_CHANNELS; index++) {
      if ($channelActivated[index]) {
        $offsetAdjustment[index] = offsetY;
        offsetY -= baseOffset;
      }
    }
  }}
  data-cy="distribute-button"
/>
<Tooltip target={button} placement="bottom" data-cy="distribute-button-tooltip">
  {TOOLTIP_BUTTON_DISTRIBUTE}
</Tooltip>
