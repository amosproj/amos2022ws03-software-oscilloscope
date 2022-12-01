<script>
  import { beforeUpdate, onMount } from "svelte";
  import { ColorRGBA, WebglPlot, WebglThickLine } from "webgl-plot";
  import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    NUM_CHANNELS,
    NUM_INTERVALS_HORIZONTAL,
    MIN_SWEEP,
    MAX_SWEEP,
    LINE_COLORS,
    LINE_THICKNESS_SMALL,
    LINE_THICKNESS_BIG,
  } from "../const";
  import { timeSweep } from "../stores";

  export let scalesY;

  let canvasElement;
  let webGLPlot;
  let channel_samples;
  let lines = [];
  let startStopLine = [];
  let xArr;
  let xLast;

  // ----- Svelte lifecycle hooks -----
  onMount(() => {
    resizeCanvas();
    initializePlot();
    resetPlot();
  });

  beforeUpdate(() => {
    window.requestAnimationFrame(newFrame);
  });

  // ----- business logic -----

  const initChannelSamples = () => {
    channel_samples = Array.from(Array(NUM_CHANNELS), () =>
      new Array(CANVAS_WIDTH).fill(0.0)
    );
  };

  export const resetPlot = () => {
    xArr = new Array(NUM_CHANNELS).fill(0.0);
    xLast = new Array(NUM_CHANNELS).fill(0);
    initChannelSamples();
    webGLPlot.clear();
    console.log("clear");
  };

  export const updateBuffer = (samples) => {
    for (
      let channelIndex = 0;
      channelIndex < channel_samples.length;
      channelIndex++
    ) {
      if (!startStopLine[channelIndex]) {
        continue;
      }
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

  // Sets the scaling of a individual wave according to the voltage intervals
  const setScaling = (index, scale) => {
    lines[index].scaleY = computeScaling(scale);
  };

  // computes the Scaling of a wave according to the voltage intervals
  const computeScaling = (scale) => {
    return (1 / (NUM_INTERVALS_HORIZONTAL / 2)) * scale;
  };

  export const updateChannelOffsetY = (channelIndex, offsetY) => {
    lines[channelIndex].offsetY = offsetY;
  };

  // Update the amplification of wave
  export const updateChannelScaling = (channelIndex, scaling) => {
    setScaling(channelIndex, scaling);
  };

  export const updateChannelThickness = (channelIndex, isThick) => {
    const thickness = isThick ? LINE_THICKNESS_BIG : LINE_THICKNESS_SMALL;
    lines[channelIndex].setThickness(thickness);
  };

  export const startStopChannelI = (channelIndex, hasStarted) => {
    startStopLine[channelIndex] = hasStarted;
    /*if(hasStarted) console.log("start Channel " + channelIndex + ", hasStarted:" + startStopLine[channelIndex]);
    else console.log("stop Channel " + channelIndex + ", hasStarted:" + startStopLine[channelIndex]);
    */
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
  };

  const initializeLines = () => {
    for (let i = 0; i < NUM_CHANNELS; i++) {
      const color = new ColorRGBA(
        LINE_COLORS[i][0] / 255,
        LINE_COLORS[i][1] / 255,
        LINE_COLORS[i][2] / 255,
        1
      );
      let line = new WebglThickLine(color, CANVAS_WIDTH, LINE_THICKNESS_SMALL);
      // same thing arrangeX does, but WebglThickLine does not provide it
      line.lineSpaceX(-1, 2 / CANVAS_WIDTH);
      line.scaleY = computeScaling(scalesY[i]);
      webGLPlot.addThickLine(line);
      lines.push(line);
      startStopLine[i] = true;
    }
  };

  const newFrame = () => {
    update();
    webGLPlot.update();
    window.requestAnimationFrame(newFrame);
  };
</script>

<canvas bind:this={canvasElement} />
