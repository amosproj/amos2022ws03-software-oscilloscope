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
    NUM_CHANNELS,
    NUM_INTERVALS_HORIZONTAL,
  } from "../const";
  import { roundVoltage } from "../helper";

  let canvasElement;
  let canvasContext;
  let current = Array(NUM_CHANNELS).fill(0.0);
  let min = Array(NUM_CHANNELS).fill(0.0);
  let max = Array(NUM_CHANNELS).fill(0.0);
  let offsets = Array(NUM_CHANNELS).fill(0.0);
  let scalings = Array(NUM_CHANNELS).fill(1.0);
  let startStopLine = Array(NUM_CHANNELS).fill(true);

  export let scaleY;

  /**
   * Trigger a rerender of the indicators with given sample array.
   *
   * @param {number[]} samples
   */
  export const update = (samples, startIndex) => {
    clearCanvas();
    drawGlobalZeroLine();

    for (let channel = 0; channel < NUM_CHANNELS; channel++) {
      if (startStopLine[channel]) {
        updateCurrentMinMax(samples[startIndex + channel], channel);
      }
      const transformedCurrent = transformSampleToYCoord(
        current[channel],
        offsets[channel],
        scalings[channel]
      );
      const transformedMin = transformSampleToYCoord(
        min[channel],
        offsets[channel],
        scalings[channel]
      );
      const transformedMax = transformSampleToYCoord(
        max[channel],
        offsets[channel],
        scalings[channel]
      );
      const transformedZero = transformSampleToYCoord(
        0,
        offsets[channel],
        scalings[channel]
      );
      //drawIndicator(channel, transformedCurrent, LINE_COLORS_RGBA[channel]);
      drawMinMaxZeroLines(
        channel,
        transformedMin,
        transformedMax,
        transformedZero,
        LINE_COLORS_RGBA[channel]
      );
      writeText(channel, min[channel], max[channel]);
    }
  };

  /**
   * Update the offset of a channel by a voltage.
   *
   * @param {number} channelIndex
   * @param {number} offsetY
   */
  export const updateChannelOffsetY = (channelIndex, offsetY) => {
    offsets[channelIndex] = offsetY;
    update(current);
  };

  /**
   * Update the scaling/amplification of a channel by a factor.
   *
   * @param {number} channelIndex
   * @param {number} scaling
   */
  export const updateChannelScaling = (channelIndex, scaling) => {
    scalings[channelIndex] = scaling;
    update(current);
  };

  /**
   * Start or stop indicator updates of a channel.
   *
   * @param {number} channelIndex
   * @param {boolean} hasStarted
   */
  export const startStopChannelI = (channelIndex, hasStarted) => {
    startStopLine[channelIndex] = hasStarted;
  };

  // ----- Svelte lifecycle hooks -----
  onMount(() => {
    resizeCanvas();
    update(current);
  });

  // ----- Business logic -----

  /**
   * Update the current, minimum and maximum voltage of a channel.
   *
   * @param {number} sample
   * @param {number} i
   */
  const updateCurrentMinMax = (sample, i) => {
    current[i] = sample;
    if (sample < min[i]) {
      min[i] = sample;
    }
    if (sample > max[i]) {
      max[i] = sample;
    }
  };

  /**
   * Transform a given raw sample to a y coordinate with respect to offset and scaling.
   * @param {number} sample
   * @param {number} offset
   * @param {number} scale
   * @returns {number} y coordinate
   */
  const transformSampleToYCoord = (sample, offset, scale) => {
    const transformedOffset = offset * (CANVAS_HEIGHT / 2);
    const transformedScale = scale * (CANVAS_HEIGHT / NUM_INTERVALS_HORIZONTAL);
    return -sample * transformedScale * scaleY - transformedOffset;
  };

  /**
   * Clear the whole canvas.
   */
  export const clearCanvas = () => {
    canvasContext.clearRect(
      -canvasElement.width,
      -(canvasElement.height / 2),
      canvasElement.width,
      canvasElement.height
    );
  };

  /**
   * Resize the canvas.
   */
  const resizeCanvas = () => {
    canvasElement.width = INDICATOR_SECTION_WIDTH;
    canvasElement.height = CANVAS_HEIGHT;
    canvasContext = canvasElement.getContext("2d");
    // Translate coordinates to have zero point at the right center
    canvasContext.translate(canvasElement.width, canvasElement.height / 2);
  };

  /**
   * Draw a zero line at the vertical center of the canvas.
   */
  const drawGlobalZeroLine = () => {
    canvasContext.beginPath();
    canvasContext.strokeStyle = INDICATOR_ZERO_LINE_COLOR;
    canvasContext.moveTo(0, 0);
    canvasContext.lineTo(-canvasElement.width, 0);
    canvasContext.stroke();
    canvasContext.font = `${INDICATOR_FONT_SIZE}px Arial`;
    canvasContext.fillStyle = INDICATOR_ZERO_LINE_COLOR;
    canvasContext.textAlign = "left";
    canvasContext.fillText("0", -canvasElement.width, INDICATOR_FONT_SIZE);
  };

  /**
   * Draw an indicator of the current voltage of a channel.
   *
   * @param {number} channel
   * @param {number} voltage
   * @param {string} color
   */
  const drawIndicator = (channel, voltage, color) => {
    const x = -(INDICATOR_WIDTH + INDICATOR_MARGIN) * (channel + 1);
    const y = voltage;
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(x, y, INDICATOR_WIDTH / 2, 0, 2 * Math.PI);
    canvasContext.fill();
  };

  /**
   * Draw the zero, minimum and maximum lines of a channel.
   *
   * @param {number} channel
   * @param {number} min
   * @param {number} max
   * @param {number} zero
   * @param {string} color
   */
  const drawMinMaxZeroLines = (channel, min, max, zero, color) => {
    const x = -(INDICATOR_WIDTH + INDICATOR_MARGIN) * (channel + 1);
    canvasContext.beginPath();
    canvasContext.fillStyle = color;
    canvasContext.strokeStyle = color;
    // minimum
    canvasContext.moveTo(x - 4, min);
    canvasContext.lineTo(x + 4, min);
    canvasContext.stroke();
    // maximum
    canvasContext.moveTo(x - 4, max);
    canvasContext.lineTo(x + 4, max);
    canvasContext.stroke();
    //zero
    canvasContext.moveTo(x - 6, zero);
    canvasContext.lineTo(x + 6, zero);
    canvasContext.stroke();
  };

  /**
   * Write the textual representation of the minimum and maximum values of a channel.
   *
   * @param {number} channel
   * @param {number} min
   * @param {number} max
   */
  const writeText = (channel, min, max) => {
    const roundedMin = roundVoltage(min);
    const roundedMax = roundVoltage(max);
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
