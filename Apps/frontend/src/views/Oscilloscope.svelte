<script>
  import { onMount } from "svelte";
  import CoordinateSystem from "./CoordinateSystem.svelte";
  import SineWave from "./SineWave.svelte";

  const canvasWidth = 1000;
  const canvasHeight = 500;
  const numIntervalsX = 20;
  const numIntervalsY = 10;

  let waveElement;

  let scaleY = 1; // 1V per horizontal line

  onMount(() => {
    let i = 0;
    setInterval(() => {
      const nextValue = Math.sin(i / 10);
      waveElement.updatePoint(i, nextValue);
      i++;
    }, 0.1);
  });
</script>

<div class="wrapper">
  <div class="stack coordinate-system">
    <CoordinateSystem
      {canvasWidth}
      {canvasHeight}
      {numIntervalsX}
      {numIntervalsY}
      yScale={scaleY}
    />
  </div>
  <div class="stack wave">
    <SineWave
      bind:this={waveElement}
      {canvasWidth}
      {canvasHeight}
      {numIntervalsY}
      {scaleY}
    />
  </div>
</div>

<style>
  .wrapper {
    position: relative;
  }
  .stack {
    position: absolute;
    inset: 0;
  }
  .coordinate-system {
    z-index: 0;
  }
  .wave {
    z-index: 1;
  }
</style>
