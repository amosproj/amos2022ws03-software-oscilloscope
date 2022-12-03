<script>
  import { onMount } from "svelte";
  import {
    CANVAS_HEIGHT,
    INDICATOR_FONT_SIZE,
    INDICATOR_MARGIN,
    INDICATOR_SECTION_WIDTH,
    INDICATOR_WIDTH,
    INDICATOR_ZERO_LINE_COLOR,
    LINE_COLORS_RGBA,
    NUM_INTERVALS_HORIZONTAL,
  } from "../const";
  import { roundVoltage } from "../helper";

  let canvasElement;
  let canvasContext;
  /** @type {number[]} */
  let min = Array(10).fill(0.0);
  /** @type {number[]} */
  let max = Array(10).fill(0.0);

  /** @type {number}*/
  export let scaleY;

  /** @param {number[]} samples */
  export const update = (samples) => {
    clearCanvas();
    drawZeroLine();
    for (let i = 0; i < samples.length; i++) {
      updateMinMax(samples[i], i);
      drawIndicator(i, samples[i], LINE_COLORS_RGBA[i]);
      drawMinMaxLines(i, LINE_COLORS_RGBA[i]);
      writeText(i);
    }
  };

  // ----- Svelte lifecycle hooks -----
  onMount(() => {
    resizeCanvas();
  });

  // ----- Business logic -----
  /**
   * @param {number} sample
   * @param {number} index
   */
  const updateMinMax = (sample, index) => {
    if (sample < min[index]) {
      min[index] = sample;
    }
    if (sample > max[index]) {
      max[index] = sample;
    }
  };

  export const clearCanvas = () => {
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

  /**
   * @param {number} channel
   * @param {number }voltage
   * @param {string} color
   */
  const drawIndicator = (channel, voltage, color) => {
    const x = -(INDICATOR_WIDTH + INDICATOR_MARGIN) * (channel + 1);
    const y = -(voltage * CANVAS_HEIGHT) / (scaleY * NUM_INTERVALS_HORIZONTAL);

    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(x, y, INDICATOR_WIDTH / 2, 0, 2 * Math.PI);
    canvasContext.fill();
  };

  /**
   * @param {number} channel
   * @param {string} color
   */
  const drawMinMaxLines = (channel, color) => {
    const minY =
      -(min[channel] * CANVAS_HEIGHT) / (scaleY * NUM_INTERVALS_HORIZONTAL);
    const maxY =
      -(max[channel] * CANVAS_HEIGHT) / (scaleY * NUM_INTERVALS_HORIZONTAL);
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

  /**
   * @param {number} channel
   */
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
</script>

<canvas data-cy="indicators" bind:this={canvasElement} />

<style>
</style>
