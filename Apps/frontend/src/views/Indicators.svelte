<script>
  import { onMount } from "svelte";
  import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    INDICATOR_DECIMAL_PLACES,
    INDICATOR_FONT_SIZE,
    INDICATOR_MARGIN,
    INDICATOR_SECTION_WIDTH,
    INDICATOR_WIDTH,
    LINE_COLORS,
    NUM_INTERVALS_Y,
  } from "../const";

  let canvasElement;
  let canvasContext;
  let min = Array(10).fill(0.0);
  let max = Array(10).fill(0.0);

  export let scaleY;
  export function update(samples) {
    canvasContext.clearRect(
      -canvasElement.width,
      -(canvasElement.height / 2),
      canvasElement.width,
      canvasElement.height
    );
    for (let i = 0; i < samples.length; i++) {
      if (samples[i] < min[i]) {
        min[i] = samples[i];
      }
      if (samples[i] > max[i]) {
        max[i] = samples[i];
      }
      drawZeroLine();
      drawIndicator(
        i,
        samples[i],
        `rgba(${LINE_COLORS[i][0]}, ${LINE_COLORS[i][1]}, ${LINE_COLORS[i][2]}, 1)`
      );
      drawMinMaxLine(
        i,
        `rgba(${LINE_COLORS[i][0]}, ${LINE_COLORS[i][1]}, ${LINE_COLORS[i][2]}, 1)`
      );
    }
  }

  const initializeCanvas = () => {
    canvasElement.width = INDICATOR_SECTION_WIDTH;
    canvasElement.height = CANVAS_HEIGHT;
    canvasContext = canvasElement.getContext("2d");
    canvasContext.translate(canvasElement.width, canvasElement.height / 2);
  };

  const drawZeroLine = () => {
    canvasContext.beginPath();
    canvasContext.strokeStyle = "#ffffff20";
    canvasContext.fillStyle = "#ffffff20";
    canvasContext.moveTo(0, 0);
    canvasContext.lineTo(-canvasElement.width, 0);
    canvasContext.stroke();
    canvasContext.font = `${INDICATOR_FONT_SIZE}px Arial`;
    canvasContext.textColor = "#ffffff80";
    canvasContext.textAlign = "left";
    canvasContext.fillText("0", -canvasElement.width, INDICATOR_FONT_SIZE);
  };

  const drawIndicator = (channel, voltage, color) => {
    const y = -(voltage * CANVAS_HEIGHT) / (scaleY * NUM_INTERVALS_Y);
    const x = -(INDICATOR_WIDTH + INDICATOR_MARGIN) * (channel + 1);

    const roundedVoltage =
      Math.trunc(voltage * 10 ** INDICATOR_DECIMAL_PLACES) /
      10 ** INDICATOR_DECIMAL_PLACES;

    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(x, y, INDICATOR_WIDTH / 2, 0, 2 * Math.PI);
    canvasContext.fill();
    // Draw text
    canvasContext.font = `${INDICATOR_FONT_SIZE}px monospace`;
    canvasContext.fillText(
      `${channel}:${roundedVoltage} V`,
      -INDICATOR_SECTION_WIDTH + 8,
      -(CANVAS_HEIGHT / 2) + (channel + 1) * INDICATOR_FONT_SIZE
    );
  };

  const drawMinMaxLine = (channel, color) => {
    const minY = -(min[channel] * CANVAS_HEIGHT) / (scaleY * NUM_INTERVALS_Y);
    const maxY = -(max[channel] * CANVAS_HEIGHT) / (scaleY * NUM_INTERVALS_Y);
    const x = -(INDICATOR_WIDTH + INDICATOR_MARGIN) * (channel + 1);
    canvasContext.beginPath();
    canvasContext.fillStyle = color;
    canvasContext.strokeStyle = color;
    canvasContext.moveTo(x - 4, minY);
    canvasContext.lineTo(x + 4, minY);
    canvasContext.stroke();
    canvasContext.moveTo(x - 4, maxY);
    canvasContext.lineTo(x + 4, maxY);
    canvasContext.stroke();
  };

  onMount(() => {
    initializeCanvas();
  });
</script>

<canvas bind:this={canvasElement} />

<style>
</style>
