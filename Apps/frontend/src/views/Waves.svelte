<script>
  import { beforeUpdate, onMount } from "svelte";
  import { ColorRGBA, WebglLine, WebglPlot } from "webgl-plot";
  import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    NUM_CHANNELS,
    NUM_INTERVALS_Y,
    MIN_SWEEP,
    MAX_SWEEP,
    LINE_COLORS,
  } from "../const";
  import { timeSweep } from "../stores";

  export let scalesY;

  let canvasElement;
  let webGLPlot;
  let channel_samples = Array.from(Array(NUM_CHANNELS), () =>
    new Array(CANVAS_WIDTH).fill(0.0)
  );
  let lines = [];

  let xArr = new Array(NUM_CHANNELS).fill(0.0);
  let xLast = new Array(NUM_CHANNELS).fill(0);

  export const updateBuffer = (samples) => {
    for (
      let channelIndex = 0;
      channelIndex < channel_samples.length;
      channelIndex++
    ) {
      let xCurr = xArr[channelIndex];
      let xNew = Math.round(xCurr);
      for (let x = xLast[channelIndex] + 1; x < xNew + 1; x++) {
        channel_samples[channelIndex][x] = samples[channelIndex];
      }
      xLast[channelIndex] = xNew;

      let sweep = $timeSweep[channelIndex] / 5.0 - 1.0;
      let fac = sweep < 0 ? MIN_SWEEP : MAX_SWEEP;
      let delta = fac * sweep + 1.0;

      xArr[channelIndex] = xCurr + delta;
      while (xArr[channelIndex] >= CANVAS_WIDTH) {
        xArr[channelIndex] -= CANVAS_WIDTH;
      }
    }
  };

  export const updateChannelOffsetY = (channelIndex, offsetY) => {
    lines[channelIndex].offsetY = offsetY;
  };

  const update = () => {
    for (let i = 0; i < channel_samples.length; i++) {
      for (let x = 0; x < CANVAS_WIDTH; ++x) {
        lines[i].setY(x, channel_samples[i][x]);
      }
    }
  };

  const resizeCanvas = () => {
    canvasElement.width = CANVAS_WIDTH;
    canvasElement.height = CANVAS_HEIGHT;
  };

  const initializePlot = () => {
    webGLPlot = new WebglPlot(canvasElement);
    initializeLines();
    console.log(`lines: ${lines.length}`);
    console.log(`channels: ${channel_samples.length}`);
  };

  const initializeLines = () => {
    for (let i = 0; i < NUM_CHANNELS; i++) {
      const color = new ColorRGBA(
        LINE_COLORS[i][0] / 255,
        LINE_COLORS[i][1] / 255,
        LINE_COLORS[i][2] / 255,
        1
      );
      let line = new WebglLine(color, CANVAS_WIDTH);
      line.arrangeX();
      line.scaleY = (1 / (NUM_INTERVALS_Y / 2)) * scalesY[i];
      webGLPlot.addLine(line);
      lines.push(line);
    }
  };

  onMount(() => {
    resizeCanvas();
    initializePlot();
  });

  beforeUpdate(() => {
    window.requestAnimationFrame(newFrame);
  });

  const newFrame = () => {
    update();
    webGLPlot.update();
    window.requestAnimationFrame(newFrame);
  };

  export const resetPlot = () => {
    xArr = new Array(NUM_CHANNELS).fill(0.0);
    xLast = new Array(NUM_CHANNELS).fill(0);
    channel_samples = Array.from(Array(NUM_CHANNELS), () =>
      new Array(CANVAS_WIDTH).fill(0.0)
    );
    update();
    webGLPlot.clear();
    console.log("clear");
  };
</script>

<canvas bind:this={canvasElement} />
