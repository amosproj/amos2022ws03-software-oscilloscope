<script>
  import { beforeUpdate, onMount } from "svelte";
  import { ColorRGBA, WebglLine, WebglPlot } from "webgl-plot";

  export let canvasHeight;
  export let canvasWidth;
  export let scaleY;
  export let numIntervalsY;

  const lineColor = new ColorRGBA(0, 255, 0, 1);

  let canvasElement;

  let webGLPlot;
  let webGLLine;

  export function updatePoint(index, value) {
    webGLLine.setY(index % canvasWidth, value);
  }

  function resizeCanvas() {
    canvasElement.width = canvasWidth;
    canvasElement.height = canvasHeight;
  }

  function initializePlot() {
    const numPoints = canvasElement.width;
    webGLLine = new WebglLine(lineColor, numPoints);
    webGLPlot = new WebglPlot(canvasElement);
    webGLLine.arrangeX();
    webGLLine.scaleY = 1 / ((numIntervalsY / 2) * scaleY);
    webGLPlot.addLine(webGLLine);
  }

  onMount(() => {
    resizeCanvas();
    initializePlot();
  });

  beforeUpdate(() => {
    window.requestAnimationFrame(newFrame);
  });

  function newFrame() {
    webGLPlot.update();
    window.requestAnimationFrame(newFrame);
  }
</script>

<canvas bind:this={canvasElement} />
