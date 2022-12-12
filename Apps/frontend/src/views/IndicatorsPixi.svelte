<script>
  import * as PIXI from "pixi.js";
  import {
    CANVAS_HEIGHT,
    INDICATOR_FONT_FAMILY,
    INDICATOR_FONT_SIZE,
    INDICATOR_MARGIN,
    INDICATOR_SECTION_WIDTH,
    INDICATOR_WIDTH,
    INDICATOR_ZERO_LINE_COLOR_PIXI,
    LINE_COLORS_NUMBER,
    NUM_CHANNELS,
    NUM_INTERVALS_HORIZONTAL
  } from "../const.js";
  import { onMount } from "svelte";

  export let scaleY;
  let samples = Array(NUM_CHANNELS).fill(0);
  let scalings = Array(NUM_CHANNELS).fill(1);
  let offsets = Array(NUM_CHANNELS).fill(0);

  let wrapper;

  const initPixiApp = () => {

    let pixiApp = new PIXI.Application({ backgroundAlpha: 0, height: CANVAS_HEIGHT, width: INDICATOR_SECTION_WIDTH });

    // Global transforms
    pixiApp.stage.transform.position.set(0, CANVAS_HEIGHT / 2);

    // Static graphics
    const staticContainer = new PIXI.Container();
    // -- Zero line
    const zeroLineGraphics = new PIXI.Graphics();
    zeroLineGraphics.beginFill(INDICATOR_ZERO_LINE_COLOR_PIXI);
    zeroLineGraphics.drawRect(0, 0, pixiApp.view.width, 2);
    zeroLineGraphics.endFill();
    // -- Zero line label
    const zeroLineTextStyle = new PIXI.TextStyle({
      fontFamily: INDICATOR_FONT_FAMILY,
      fontSize: INDICATOR_FONT_SIZE
    });
    const zeroLineText = new PIXI.Text("0", zeroLineTextStyle);
    // -- Add to tree
    staticContainer.addChild(zeroLineGraphics);
    staticContainer.addChild(zeroLineText);


    const ballContainers = [];
    for (let i = 0; i < NUM_CHANNELS; i++) {
      const ballContainer = new PIXI.Container();
      // -- Set x offset
      const xOffset = pixiApp.view.width - (i + 1) * (INDICATOR_WIDTH + INDICATOR_MARGIN);
      ballContainer.position.x = xOffset;
      // -- Draw ball
      const ballGraphics = new PIXI.Graphics();
      ballGraphics.lineStyle(0);
      ballGraphics.beginFill(LINE_COLORS_NUMBER[i]);
      ballGraphics.drawCircle(0, 0, INDICATOR_WIDTH / 2);
      ballGraphics.endFill();
      // -- Add to tree
      ballContainer.addChild(ballGraphics);
      pixiApp.stage.addChild(ballContainer);
      // -- Add ticker
      pixiApp.ticker.add(() => {
        const raw = new PIXI.Point(ballContainer.x, samples[i]);

        const invertYVec = new PIXI.Point(0, -1);
        const channelScalingVec = new PIXI.Point(0, scalings[i]);
        const intervalScalingVec = new PIXI.Point(0, CANVAS_HEIGHT / NUM_INTERVALS_HORIZONTAL);
        const globalScalingVec = new PIXI.Point(0, scaleY);
        const offsetVec = new PIXI.Point(0, offsets[i])
          .multiply(new PIXI.Point(0, CANVAS_HEIGHT / 2));

        const point = raw
          .multiply(invertYVec)
          .multiply(channelScalingVec)
          .multiply(intervalScalingVec)
          .multiply(globalScalingVec)
          .subtract(offsetVec);
        ballContainer.position.set(raw.x, point.y);
      });
      ballContainers.push(ballContainer);
    }

    pixiApp.stage.addChild(staticContainer);
    wrapper.appendChild(pixiApp.view);
  };

  onMount(() => {
    initPixiApp();
  });

  export const update = (newSamples) => {
    samples = newSamples;
  };

  export const updateChannelOffsetY = (index, offset) => {
    offsets[index] = offset;
  };

  export const updateChannelScaling = (index, scaling) => {
    scalings[index] = scaling;
  };
</script>

<div bind:this={wrapper}></div>