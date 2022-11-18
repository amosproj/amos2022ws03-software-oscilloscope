<script>
  import { onMount } from "svelte";
  import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    INDICATOR_DECIMAL_PLACES,
    INDICATOR_FONT_SIZE,
    INDICATOR_HEIGHT,
    INDICATOR_WIDTH,
    LINE_COLORS,
    NUM_INTERVALS_Y,
  } from "../const";

  let canvasElement;
  let canvasContext;
  let indicators = Array(10).fill({ min: 0, max: 0, current: 0 });

  export let scaleY;
  export function update(samples) {
    canvasContext.clearRect(
      -canvasElement.width,
      -(canvasElement.height / 2),
      canvasElement.width,
      canvasElement.height
    );
    for (let i = 0; i < samples.length; i++) {
      let current = samples[i];
      indicators[i].current = current;
      if (current < indicators[i].min) {
        indicators[i].min = current;
        return;
      }
      if (current > indicators[i].max) {
        indicators[i].max = current;
      }
      drawZeroLine();
      drawIndicator(
        current,
        `rgba(${LINE_COLORS[i][0]}, ${LINE_COLORS[i][1]}, ${LINE_COLORS[i][2]}, 1)`
      );
    }
  }

  const initializeCanvas = () => {
    canvasElement.width = CANVAS_WIDTH / 8;
    canvasElement.height = CANVAS_HEIGHT;
    canvasContext = canvasElement.getContext("2d");
    canvasContext.translate(canvasElement.width, canvasElement.height / 2);
  };

  const drawZeroLine = () => {
    canvasContext.beginPath();
    canvasContext.strokeStyle = "#ffffff80";
    canvasContext.fillStyle = "#ffffff80";
    canvasContext.setLineDash([5, 5]);
    canvasContext.moveTo(0, 0);
    canvasContext.lineTo(-canvasElement.width, 0);
    canvasContext.stroke();
    canvasContext.font = `${INDICATOR_FONT_SIZE}px Arial`;
    canvasContext.textColor = "#ffffff80";
    canvasContext.textAlign = "left";
    canvasContext.fillText("0", -canvasElement.width, INDICATOR_FONT_SIZE);
  };

  const drawIndicator = (voltage, color) => {
    const y = -(voltage * CANVAS_HEIGHT) / (scaleY * NUM_INTERVALS_Y);
    const roundedVoltage =
      Math.trunc(voltage * 10 ** INDICATOR_DECIMAL_PLACES) /
      10 ** INDICATOR_DECIMAL_PLACES;

    canvasContext.fillStyle = color;
    // Draw triangle
    canvasContext.beginPath();
    canvasContext.moveTo(0, y);
    canvasContext.lineTo(-INDICATOR_WIDTH, y - INDICATOR_HEIGHT / 2);
    canvasContext.lineTo(-INDICATOR_WIDTH, y + INDICATOR_HEIGHT / 2);
    canvasContext.fill();
    // Draw text
    canvasContext.font = `${INDICATOR_FONT_SIZE}px Arial`;
    canvasContext.textAlign = "right";
    canvasContext.fillText(
      `${roundedVoltage} V`,
      -INDICATOR_WIDTH - 4,
      y + INDICATOR_FONT_SIZE / 2
    );
  };

  onMount(() => {
    initializeCanvas();
  });
</script>

<canvas bind:this={canvasElement} />

<style>
</style>
