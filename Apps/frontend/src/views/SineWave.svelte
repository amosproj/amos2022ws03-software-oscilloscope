<script>
  import { beforeUpdate, onMount } from "svelte";
  import { ColorRGBA, WebglLine, WebglPlot } from "webgl-plot";
  import { CANVAS_HEIGHT, CANVAS_WIDTH, NUM_INTERVALS_Y } from "../const";


  export let scaleY;

  const lineColor = new ColorRGBA(0, 255, 0, 1);

  let canvasElement;

  let webGLPlot;
  let webGLLine;

  export const updatePoint = (index, value) => {
    webGLLine.setY(index % CANVAS_WIDTH, value);
  }

  const resizeCanvas = () => {
    canvasElement.width = CANVAS_WIDTH;
    canvasElement.height = CANVAS_HEIGHT;
  }

  const initializePlot = () => {
    const numPoints = canvasElement.width;
    webGLLine = new WebglLine(lineColor, numPoints);
    webGLPlot = new WebglPlot(canvasElement);
    webGLLine.arrangeX();
    webGLLine.scaleY = 1 / ((NUM_INTERVALS_Y / 2) * scaleY);
    webGLPlot.addLine(webGLLine);
  }

  onMount(() => {
    resizeCanvas();
    initializePlot();
  });

  beforeUpdate(() => {
    window.requestAnimationFrame(newFrame);
  });

  const newFrame = () => {
    webGLPlot.update();
    window.requestAnimationFrame(newFrame);
  }
</script>

<canvas bind:this={canvasElement} />
