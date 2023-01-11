<script>
  import { beforeUpdate, onMount } from "svelte";
  import {
    ColorRGBA,
    WebglPlot,
    WebglSquare,
    WebglThickLine,
  } from "webgl-plot";
  import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    NUM_CHANNELS,
    NUM_INTERVALS_HORIZONTAL,
    MIN_SWEEP,
    MAX_SWEEP,
    DEFAULT_STEP_SIZE,
    LINE_COLORS,
    WAVE_CURSOR_SIZE,
    LINE_THICKNESS_SMALL,
    LINE_THICKNESS_BIG,
  } from "../const";
  import { timeSweep } from "../stores";

  export let scalesY;

  let canvasElement;
  let webGLPlot;
  /**
   * @type {Number[][]}
   */
  let channelSamples;
  let lines = [];
  let heads = [];
  let startStopLine = [];
  let xArr;
  let xLast;

  const LOG_AFTER = 10000;
  let bufferCounter;
  let startTime;
  const currentTime = () => {
    return window.performance.now();
  };
  const resetLogVars = () => {
    bufferCounter = 0;
    startTime = currentTime();
  };
  resetLogVars();

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
    channelSamples = Array.from(Array(NUM_CHANNELS), () =>
      new Array(CANVAS_WIDTH).fill(undefined)
    );
  };

  export const resetPlot = () => {
    xArr = new Array(NUM_CHANNELS).fill(0.0);
    xLast = new Array(NUM_CHANNELS).fill(undefined);
    initChannelSamples();
    webGLPlot.clear();
  };

  export const updateBuffer = (samples, startIndex, endIndex) => {
    for (
      let channelIndex = startIndex;
      channelIndex < endIndex;
      channelIndex++
    ) {
      if (!startStopLine[channelIndex]) {
        continue;
      }
      let xCurr = xArr[channelIndex];
      let xNew = Math.round(xCurr);
      for (let x = xLast[channelIndex] + 1; x < xNew + 1; x++) {
        channelSamples[channelIndex][x] = samples[channelIndex];
        channelSamples[channelIndex][
          (x + WAVE_CURSOR_SIZE) % canvasElement.width
        ] = undefined;
      }
      xLast[channelIndex] = xNew;

      // time sweep (https://github.com/amosproj/amos2022ws03-software-oscilloscope/wiki/Development-Documentation#time-sweep-calculation)
      let sweep = $timeSweep[channelIndex] / 5.0 - 1.0; // in [-1,1]
      let delta =
        DEFAULT_STEP_SIZE *
        (1.0 + sweep * (sweep >= 0.0 ? MAX_SWEEP - 1.0 : 1.0 - MIN_SWEEP));

      xArr[channelIndex] = xCurr + delta;
      while (xArr[channelIndex] >= CANVAS_WIDTH) {
        xArr[channelIndex] -= CANVAS_WIDTH;
      }
    }

    bufferCounter++;
    if (bufferCounter >= LOG_AFTER) {
      console.log(
        "Updated " +
          LOG_AFTER +
          " times in " +
          (currentTime() - startTime) +
          " ms."
      );
      resetLogVars();
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
    heads[channelIndex].offsetY = offsetY;
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
  };

  const update = () => {
    for (let i = 0; i < channelSamples.length; i++) {
      for (let x = 0; x < CANVAS_WIDTH; ++x) {
        lines[i].setY(x, channelSamples[i][x]);
      }

      const size = 0.01;
      let x = (xArr[i] * 2) / CANVAS_WIDTH - 1;
      let scale = lines[i].scaleY * 5;
      let y = (channelSamples[i][xLast[i] - 1] * 100 * scale) / CANVAS_HEIGHT;
      heads[i].setSquare(x - size / 2, y - size, x + size / 2, y + size);
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

      let head = new WebglSquare(color);
      heads.push(head);
      webGLPlot.addSurface(head);
    }
  };

  const newFrame = () => {
    update();
    webGLPlot.update();
    window.requestAnimationFrame(newFrame);
  };
</script>

<canvas bind:this={canvasElement} />
