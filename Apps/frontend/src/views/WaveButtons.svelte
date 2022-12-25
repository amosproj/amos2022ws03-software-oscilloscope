<script>
  import OnOffButton from "../components/OnOffButton.svelte";
  import ResetButton from "../components/ResetButton.svelte";
  import { osciEnabled } from "../stores";

  export let waveElement;
  export let indicatorElement;
  let onOffButton;
</script>

<div class="control-panel--button--wrapper">
  <OnOffButton
    on:switch-plot-enabled={(e) => {
      $osciEnabled = e.detail.enabled;
    }}
    bind:this={onOffButton}
  />
  <ResetButton
    on:reset={() => {
      // if oscilloscope is running, click stop button
      if (osciEnabled) {
        onOffButton.click();
      }
      // clear canvas and indicators
      indicatorElement.clearCanvas();
      waveElement.resetPlot();
    }}
  />
</div>
