<script>
  import { onMount } from "svelte";
  import {
    CANVAS_HEIGHT,
    INDICATOR_DECIMAL_PLACES,
    INDICATOR_FONT_SIZE,
    INDICATOR_MARGIN,
    INDICATOR_SECTION_WIDTH,
    INDICATOR_WIDTH,
    INDICATOR_ZERO_LINE_COLOR,
    LINE_COLORS_RGBA,
    NUM_INTERVALS_Y,
  } from "../const";
  import { roundVoltage } from "../helper";

  let canvasElement;
  let canvasContext;
  let min = Array(10).fill(0.0);
  let max = Array(10).fill(0.0);

  export let scaleY;
  export function update(samples) {
    clearCanvas();
    drawZeroLine();
    for (let i = 0; i < samples.length; i++) {
      updateMinMax(samples[i], i);
      drawIndicator(i, samples[i], LINE_COLORS_RGBA[i]);
      drawMinMaxLines(i, LINE_COLORS_RGBA[i]);
      writeText(i);
    }
  }

  const updateMinMax = (sample, i) => {
    if (sample < min[i]) {
      min[i] = sample;
    }
    if (sample > max[i]) {
      max[i] = sample;
    }
  };

  const clearCanvas = () => {
    canvasContext.clearRect(
      -canvasElement.width,
      -(canvasElement.height / 2),
      canvasElement.width,
      canvasElement.height
    );
  };

  const resizeCanvas = () => {
    canvasElement.width = INDICATOR_SECTION_WIDTH;
    canvasElement.height = CANVAS_HEIGHT;
    canvasContext = canvasElement.getContext("2d");
    // Translate coordinates to have zero point at the right center
    canvasContext.translate(canvasElement.width, canvasElement.height / 2);
  };

  const drawZeroLine = () => {
    canvasContext.beginPath();
    canvasContext.strokeStyle = INDICATOR_ZERO_LINE_COLOR;
    canvasContext.moveTo(0, 0);
    canvasContext.lineTo(-canvasElement.width, 0);
    canvasContext.stroke();
    canvasContext.font = `${INDICATOR_FONT_SIZE}px Arial`;
    canvasContext.textColor = INDICATOR_ZERO_LINE_COLOR;
    canvasContext.textAlign = "left";
    canvasContext.fillText("0", -canvasElement.width, INDICATOR_FONT_SIZE);
  };

  const drawIndicator = (channel, voltage, color) => {
    const x = -(INDICATOR_WIDTH + INDICATOR_MARGIN) * (channel + 1);
    const y = -(voltage * CANVAS_HEIGHT) / (scaleY * NUM_INTERVALS_Y);

    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(x, y, INDICATOR_WIDTH / 2, 0, 2 * Math.PI);
    canvasContext.fill();
  };

  const drawMinMaxLines = (channel, color) => {
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

  const writeText = (channel) => {
    const roundedMin = roundVoltage(min[channel]);
    const roundedMax = roundVoltage(max[channel]);
    canvasContext.font = `${INDICATOR_FONT_SIZE}px monospace`;
    canvasContext.fillText(
      `[${channel}] Min:${roundedMin} V`,
      -INDICATOR_SECTION_WIDTH,
      -(CANVAS_HEIGHT / 2) + (channel + 1) * 2 * INDICATOR_FONT_SIZE
    );
    canvasContext.fillText(
      `    Max:${roundedMax} V`,
      -INDICATOR_SECTION_WIDTH,
      -(CANVAS_HEIGHT / 2) + (channel + 1.5) * 2 * INDICATOR_FONT_SIZE
    );
  };

  onMount(() => {
    resizeCanvas();
  });
</script>

<canvas data-cy="indicators" bind:this={canvasElement} />

<style>
</style>
