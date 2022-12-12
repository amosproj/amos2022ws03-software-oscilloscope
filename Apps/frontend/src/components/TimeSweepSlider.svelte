<script>
  import { timeSweep } from "../stores";
  export let channel;
</script>

<div class="control-panel-items">
  <input type="range" min="0" max="10" bind:value={$timeSweep[channel]} />
</div>
