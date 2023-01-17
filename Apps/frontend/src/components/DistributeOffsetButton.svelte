<script>
  import { NUM_CHANNELS } from "../const";
  import { channelActivated, offsetAdjustment } from "../stores";

  function calculateOffset() {
    // offset is calculated based on the number of channels between -1 and 1
    return 2 / ($channelActivated.filter(Boolean).length + 1);
  }
</script>

<button
  id="distribute-button"
  on:click={() => {
    let baseOffset = calculateOffset();
    let offsetY = 1 - baseOffset;
    for (let index = 0; index < NUM_CHANNELS; index++) {
      if ($channelActivated[index]) {
        $offsetAdjustment[index] = offsetY;
        offsetY -= baseOffset;
      }
    }
  }}>Distribute waves</button
>

<style>
  #distribute-button {
    border-style: solid;
    border-color: grey;
  }
</style>
