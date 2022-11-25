<script>
  import { amplitudeAdjustment } from "../stores";

  export let channel;
</script>

<div>
  <input
    type="range"
    min="0"
    max="10"
    class="slider"
    bind:value={$amplitudeAdjustment[channel]}
  />
</div>
