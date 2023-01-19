<script>
  import { NUM_CHANNELS } from "../const";
  import { channelActivated, offsetAdjustment } from "../stores";
  import { Tooltip } from "sveltestrap";

  function calculateOffset() {
    // offset is calculated based on the number of channels between -1 and 1
    return 2 / ($channelActivated.filter(Boolean).length + 1);
  }
</script>

<div>
  <button
    id="btn-distribute"
    class="icon-button mui-icon--distribute"
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
  <Tooltip target="btn-distribute" placement="bottom">Distribute</Tooltip>
</div>
