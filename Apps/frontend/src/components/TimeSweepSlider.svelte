<script>
  import { timeSweep } from "../stores";
  export let channel;
</script>

<div>
  <input
    type="range"
    min="0"
    max="10"
    step="0.1"
    class="slider"
    bind:value={$timeSweep[channel]}
  />
</div>
