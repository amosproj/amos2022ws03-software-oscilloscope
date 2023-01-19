<script>
  import { onMount } from "svelte";
  import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    COORDINATE_LINE_COLOR,
    NUM_INTERVALS_VERTICAL,
    NUM_INTERVALS_HORIZONTAL,
  } from "../const";

  export let scaleY;

  let canvasElement;

  // ----- Svelte lifecycle hooks -----
  onMount(() => {
    resizeCanvas();
    drawCoordinateSystem();
    drawScaleY();
  });

  // ----- business logic -----
  const resizeCanvas = () => {
    canvasElement.width = CANVAS_WIDTH;
    canvasElement.height = CANVAS_HEIGHT;
  };

  const drawCoordinateSystem = () => {
    const context = canvasElement.getContext("2d");
    context.lineWidth = 1;
    context.strokeStyle = COORDINATE_LINE_COLOR;

    // Horizontal lines
    for (let i = 0; i < NUM_INTERVALS_HORIZONTAL; i++) {
      let xPos = (CANVAS_HEIGHT / NUM_INTERVALS_HORIZONTAL) * i;
      context.beginPath();
      context.moveTo(0, xPos);
      context.lineTo(CANVAS_WIDTH, xPos);
      context.stroke();
    }

    // Vertical lines
    for (let i = 0; i < NUM_INTERVALS_VERTICAL; i++) {
      let yPos = (CANVAS_WIDTH / NUM_INTERVALS_VERTICAL) * i;
      context.beginPath();
      context.moveTo(yPos, 0);
      context.lineTo(yPos, CANVAS_HEIGHT);
      context.stroke();
    }
  };

  const drawScaleY = () => {
    const context = canvasElement.getContext("2d");
    context.font = "20px Arial";
    context.fillStyle = "white";
    context.fillText(`Y-Scale: ${scaleY}V`, 10, 25);
  };
</script>

<canvas bind:this={canvasElement} />
