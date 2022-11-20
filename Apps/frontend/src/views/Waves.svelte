<script>
  import { beforeUpdate, onMount } from "svelte";
  import { ColorRGBA, WebglLine, WebglPlot } from "webgl-plot";
  import { CANVAS_HEIGHT, CANVAS_WIDTH, NUM_CHANNELS, NUM_INTERVALS_Y } from "../const";

  
  export let scalesY;
  export let offsetsY;

  let canvasElement;
  let webGLPlot;
  let channel_samples = Array.from(Array(NUM_CHANNELS), () => new Array(CANVAS_WIDTH).fill(0.0))
  let lines = []

  let x = 0
  export const updateBuffer = (samples) => {
    for (let channelIndex = 0; channelIndex < channel_samples.length; channelIndex++)
    {
      channel_samples[channelIndex][x] = samples[channelIndex]
    }
    x++;
    x = x % CANVAS_WIDTH;
  }

  const update = () => {
    for (let i = 0; i < channel_samples.length; i++)
    {
      for (let x = 0; x < CANVAS_WIDTH; ++x) {
        lines[i].offsetY = offsetsY[i];
        lines[i].setY(x, channel_samples[i][x]);
      }
    }
  }

  const resizeCanvas = () => {
    canvasElement.width = CANVAS_WIDTH;
    canvasElement.height = CANVAS_HEIGHT;
  }

  const initializePlot = () => {
    webGLPlot = new WebglPlot(canvasElement);
    initializeLines();
    console.log(`lines: ${lines.length}`)
    console.log(`channels: ${channel_samples.length}`)
  }
  
  const initializeLines = () => {
    for (let i = 0; i < NUM_CHANNELS; i++)
    {
      const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
      let line = new WebglLine(color, CANVAS_WIDTH);
      line.arrangeX();
      line.scaleY = (1 / ((NUM_INTERVALS_Y / 2)) * scalesY[i]);
      line.offsetY = offsetsY[i];
      webGLPlot.addLine(line);
      lines.push(line)
    }
  }

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
  }
</script>

<canvas bind:this={canvasElement} />
