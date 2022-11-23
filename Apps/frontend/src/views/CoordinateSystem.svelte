<script>
  import { onMount } from "svelte";
  import { CANVAS_HEIGHT, CANVAS_WIDTH, NUM_INTERVALS_X, NUM_INTERVALS_Y } from "../const";


  export let scaleY;

  const lineColor = "#FFFFFF80";

  let canvasElement;

  const resizeCanvas = () => {
    canvasElement.width = CANVAS_WIDTH;
    canvasElement.height = CANVAS_HEIGHT;
  }

  const drawCoordinateSystem = () => {
    const context = canvasElement.getContext("2d");
    context.lineWidth = 1;
    context.strokeStyle = lineColor;

    // X lines
    for (let x = 0; x < NUM_INTERVALS_Y; x++) {
      let xPos = (CANVAS_HEIGHT / NUM_INTERVALS_Y) * x;
      context.beginPath();
      context.moveTo(0, xPos);
      context.lineTo(CANVAS_WIDTH, xPos);
      context.stroke();
    }

    // Y lines
    for (let y = 0; y < NUM_INTERVALS_X; y++) {
      let yPos = (CANVAS_WIDTH / NUM_INTERVALS_X) * y;
      context.beginPath();
      context.moveTo(yPos, 0);
      context.lineTo(yPos, CANVAS_HEIGHT);
      context.stroke();
    }
  }

  const drawScaleY = () => {
    const context = canvasElement.getContext("2d");
    context.font = "20px Arial";
    context.fillStyle = "white";
    context.fillText(`Y-Scale: ${scaleY}V`, 10, 25);
  }

  onMount(() => {
    resizeCanvas();
    drawCoordinateSystem();
    drawScaleY();
  });
</script>

<canvas bind:this={canvasElement} />

<style>
  canvas {
    border: 1px solid white;
    background-color: black;
  }
</style>
