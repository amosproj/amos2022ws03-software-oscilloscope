<script>
  import { osciEnabled } from "../stores";
  import OnOffButton from "../components/OnOffButton.svelte";
  import ResetButton from "../components/ResetButton.svelte";

  let onOffButton;
  export let indicatorElement;
  export let waveElement;
</script>

<OnOffButton
  on:switch-plot-enabled={(e) => {
    $osciEnabled = e.detail.enabled;
  }}
  bind:this={onOffButton}
/>
<ResetButton
  on:reset={() => {
    // if oscilloscope is running, click stop button
    if ($osciEnabled) {
      onOffButton.click();
    }
    // clear canvas and indicators
    indicatorElement.clearCanvas();
    waveElement.resetPlot();
  }}
/>
