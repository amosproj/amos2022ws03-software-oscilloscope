<script>
  import { onMount } from "svelte";
  import {
    CANVAS_HEIGHT,
    INDICATOR_FONT_SIZE,
    INDICATOR_MARGIN,
    INDICATOR_SECTION_WIDTH,
    INDICATOR_WIDTH,
    INDICATOR_ZERO_LINE_COLOR,
    LINE_COLORS_RGBA, NUM_CHANNELS,
    NUM_INTERVALS_HORIZONTAL
  } from "../const";
  import { roundVoltage } from "../helper";

  let canvasElement;
  let canvasContext;
  let min = Array(NUM_CHANNELS).fill(0.0);
  let max = Array(NUM_CHANNELS).fill(0.0);
  let offsets = Array(NUM_CHANNELS).fill(0.0);
  let scalings = Array(NUM_CHANNELS).fill(1.0);

  export let scaleY;

  export const update = (samples) => {
    clearCanvas();
    drawGlobalZeroLine();
    for (let channel = 0; channel < samples.length; channel++) {
      updateMinMax(samples[channel], channel);
      const transformedCurrent = transformSampleToYCoord(samples[channel], offsets[channel], scalings[channel]);
      const transformedMin = transformSampleToYCoord(min[channel], offsets[channel], scalings[channel]);
      const transformedMax = transformSampleToYCoord(max[channel], offsets[channel], scalings[channel]);
      const transformedZero = transformSampleToYCoord(0, offsets[channel], scalings[channel]);
      drawIndicator(channel, transformedCurrent, LINE_COLORS_RGBA[channel]);
      drawMinMaxZeroLines(channel, transformedMin, transformedMax, transformedZero, LINE_COLORS_RGBA[channel]);
      writeText(channel, min[channel], max[channel]);
    }
  };

  export const updateChannelOffsetY = (channelIndex, offsetY) => {
    resetMinMax();
    offsets[channelIndex] = offsetY;
  };

  // Update the amplification of wave
  export const updateChannelScaling = (channelIndex, scaling) => {
    resetMinMax();
    scalings[channelIndex] = scaling;
  };

  // ----- Svelte lifecycle hooks -----
  onMount(() => {
    resizeCanvas();
  });

  // ----- Business logic -----

  const resetMinMax = () => {
    min.fill(0);
    max.fill(0);
  };
  const updateMinMax = (sample, i) => {
    if (sample < min[i]) {
      min[i] = sample;
    }
    if (sample > max[i]) {
      max[i] = sample;
    }
  };

  const transformSampleToYCoord = (sample, offset, scale) => {
    const transformedOffset = offset * (CANVAS_HEIGHT / 2);
    const transformedScale = scale * (CANVAS_HEIGHT / NUM_INTERVALS_HORIZONTAL);
    return -sample * transformedScale * scaleY - transformedOffset;
  };

  export const clearCanvas = () => {
    canvasContext.clearRect(
      -canvasElement.width,
      -(canvasElement.height / 2),
      canvasElement.width,
      canvasElement.height,
    );
  };

  const resizeCanvas = () => {
    canvasElement.width = INDICATOR_SECTION_WIDTH;
    canvasElement.height = CANVAS_HEIGHT;
    canvasContext = canvasElement.getContext("2d");
    // Translate coordinates to have zero point at the right center
    canvasContext.translate(canvasElement.width, canvasElement.height / 2);
  };

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

  const drawIndicator = (channel, voltage, color) => {
    const x = -(INDICATOR_WIDTH + INDICATOR_MARGIN) * (channel + 1);
    const y = voltage;
    canvasContext.fillStyle = color;
    canvasContext.beginPath();
    canvasContext.arc(x, y, INDICATOR_WIDTH / 2, 0, 2 * Math.PI);
    canvasContext.fill();
  };

  const drawMinMaxZeroLines = (channel, min, max, zero, color) => {
    const x = -(INDICATOR_WIDTH + INDICATOR_MARGIN) * (channel + 1);
    canvasContext.beginPath();
    canvasContext.fillStyle = color;
    canvasContext.strokeStyle = color;
    // min
    canvasContext.moveTo(x - 4, min);
    canvasContext.lineTo(x + 4, min);
    canvasContext.stroke();
    // //max
    canvasContext.moveTo(x - 4, max);
    canvasContext.lineTo(x + 4, max);
    canvasContext.stroke();
    //zero
    canvasContext.moveTo(x - 6, zero);
    canvasContext.lineTo(x + 6, zero);
    canvasContext.stroke();
  };

  const writeText = (channel, min, max) => {
    const roundedMin = roundVoltage(min);
    const roundedMax = roundVoltage(max);
    canvasContext.font = `${INDICATOR_FONT_SIZE}px monospace`;
    canvasContext.fillText(
      `[${channel}] Min:${roundedMin} V`,
      -INDICATOR_SECTION_WIDTH,
      -(CANVAS_HEIGHT / 2) + (channel + 1) * 2 * INDICATOR_FONT_SIZE,
    );
    canvasContext.fillText(
      `    Max:${roundedMax} V`,
      -INDICATOR_SECTION_WIDTH,
      -(CANVAS_HEIGHT / 2) + (channel + 1.5) * 2 * INDICATOR_FONT_SIZE,
    );
  };
</script>

<canvas data-cy="indicators" bind:this={canvasElement} />

<style>
</style>
