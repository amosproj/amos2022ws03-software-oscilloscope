<script>
  import { onMount } from "svelte";
  export let canvasHeight;
  export let canvasWidth;
  export let numIntervalsY;
  export let numIntervalsX;
  export let yScale;

  const lineColor = "#FFFFFF80";

  let canvasElement;

  function resizeCanvas() {
    canvasElement.width = canvasWidth;
    canvasElement.height = canvasHeight;
  }

  function drawCoordinateSystem() {
    const context = canvasElement.getContext("2d");
    context.lineWidth = 1;
    context.strokeStyle = lineColor;

    // X lines
    for (let x = 0; x < numIntervalsY; x++) {
      let xPos = (canvasHeight / numIntervalsY) * x;
      context.beginPath();
      context.moveTo(0, xPos);
      context.lineTo(canvasWidth, xPos);
      context.stroke();
    }

    // Y lines
    for (let y = 0; y < numIntervalsX; y++) {
      let yPos = (canvasWidth / numIntervalsX) * y;
      context.beginPath();
      context.moveTo(yPos, 0);
      context.lineTo(yPos, canvasHeight);
      context.stroke();
    }
  }

  function drawYScale() {
    const context = canvasElement.getContext("2d");
    context.font = "20px Arial";
    context.fillStyle = "white";
    context.fillText(`Y-Scale: ${yScale}V`, 10, 25);
  }

  onMount(() => {
    resizeCanvas();
    drawCoordinateSystem();
    drawYScale();
  });
</script>

<canvas bind:this={canvasElement} />

<style>
  canvas {
    border: 1px solid white;
    background-color: black;
  }
</style>
