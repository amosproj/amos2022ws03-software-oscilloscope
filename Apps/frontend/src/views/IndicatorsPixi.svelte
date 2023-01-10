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
    NUM_INTERVALS_HORIZONTAL,
  } from "../const.js";
  import { onMount } from "svelte";
  import { roundVoltage } from "../helper.js";

  export let scaleY;
  let samples = Array(NUM_CHANNELS).fill(0);
  let scalings = Array(NUM_CHANNELS).fill(1);
  let offsets = Array(NUM_CHANNELS).fill(0);

  let wrapper;

  const addStaticGrapics = (pixiApp) => {
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
      fontSize: INDICATOR_FONT_SIZE,
    });
    const zeroLineText = new PIXI.Text("0", zeroLineTextStyle);
    // -- Add to tree
    staticContainer.addChild(zeroLineGraphics);
    staticContainer.addChild(zeroLineText);
    pixiApp.stage.addChild(staticContainer);
  };

  const addBallIndicators = (pixiApp) => {
    for (let i = 0; i < NUM_CHANNELS; i++) {
      const xOffset = pixiApp.view.width - (i + 1) * (INDICATOR_WIDTH + INDICATOR_MARGIN);
      // Ball indicators
      const ballContainer = new PIXI.Container();
      // -- Set x offset
      ballContainer.position.x = xOffset;
      // -- Draw ball
      const ballGraphics = new PIXI.Graphics();
      ballGraphics.lineStyle(0);
      ballGraphics.beginFill(LINE_COLORS_NUMBER[i]);
      ballGraphics.drawCircle(0, 0, INDICATOR_WIDTH / 2);
      ballGraphics.endFill();
      // -- Add to tree
      ballContainer.addChild(ballGraphics);
      // -- Add ticker for ball indicator
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
      pixiApp.stage.addChild(ballContainer);
    }
  };

  const addMinMaxIndicators = (pixiApp) => {
    for (let i = 0; i < NUM_CHANNELS; i++) {
      const xOffset = pixiApp.view.width - (i + 1) * (INDICATOR_WIDTH + INDICATOR_MARGIN);

      const minContainer = new PIXI.Container();
      minContainer.position.x = xOffset;
      const minGraphics = new PIXI.Graphics();
      minGraphics.beginFill(LINE_COLORS_NUMBER[i]);
      minGraphics.drawRect(0, 0, INDICATOR_WIDTH, 1);
      minGraphics.endFill();

      const maxContainer = new PIXI.Container();
      maxContainer.position.x = xOffset;
      const maxGraphics = new PIXI.Graphics();
      maxGraphics.beginFill(LINE_COLORS_NUMBER[i]);
      maxGraphics.drawRect(0, 0, INDICATOR_WIDTH, 1);
      maxGraphics.endFill();

      pixiApp.ticker.add(() => {
        const oldMinPoint = new PIXI.Point(minContainer.x, samples[i]);
        const oldMaxPoint = new PIXI.Point(maxContainer.x, samples[i]);

        const invertYVec = new PIXI.Point(0, -1);
        const channelScalingVec = new PIXI.Point(0, scalings[i]);
        const intervalScalingVec = new PIXI.Point(0, CANVAS_HEIGHT / NUM_INTERVALS_HORIZONTAL);
        const globalScalingVec = new PIXI.Point(0, scaleY);
        const offsetVec = new PIXI.Point(0, offsets[i])
          .multiply(new PIXI.Point(0, CANVAS_HEIGHT / 2));

        const newMinPoint = oldMinPoint
          .multiply(invertYVec)
          .multiply(channelScalingVec)
          .multiply(intervalScalingVec)
          .multiply(globalScalingVec)
          .subtract(offsetVec);

        const newMaxPoint = oldMaxPoint
          .multiply(invertYVec)
          .multiply(channelScalingVec)
          .multiply(intervalScalingVec)
          .multiply(globalScalingVec)
          .subtract(offsetVec);

        minContainer.position.set(oldMinPoint.x, Math.max(newMinPoint.y, minContainer.position.y));
        maxContainer.position.set(oldMaxPoint.x, Math.min(newMaxPoint.y, maxContainer.position.y));
      });

      minContainer.addChild(maxGraphics);
      maxContainer.addChild(minGraphics);
      pixiApp.stage.addChild(minContainer);
      pixiApp.stage.addChild(maxContainer);
    }
  };

  const addTextIndicators = (pixiApp) => {
    for (let i = 0; i < NUM_CHANNELS; i++) {
      const yPosition = -(pixiApp.view.height / 2) + (INDICATOR_FONT_SIZE * i * 2);
      const container = new PIXI.Container();
      container.position.y = yPosition;

      const minMax = new PIXI.Point(0, 0);


      const indicatorTextStyle = new PIXI.TextStyle({
        fontFamily: INDICATOR_FONT_FAMILY,
        fontSize: INDICATOR_FONT_SIZE,
        fill: LINE_COLORS_NUMBER[i],
      });
      const textIndicator = new PIXI.Text(`Min:${minMax.x}\nMax:${minMax.y}`, indicatorTextStyle);
      pixiApp.ticker.add(() => {
        minMax.set(Math.min(minMax.x, samples[i]), Math.max(minMax.y, samples[i]));
        textIndicator.text = `Min:${roundVoltage(minMax.x)}\nMax:${roundVoltage(minMax.y)}`;

      });
      container.addChild(textIndicator);
      pixiApp.stage.addChild(container);
    }
  };

  const initPixiApp = () => {

    let pixiApp = new PIXI.Application({ backgroundAlpha: 0, height: CANVAS_HEIGHT, width: INDICATOR_SECTION_WIDTH });

    // Global transforms
    pixiApp.stage.transform.position.set(0, CANVAS_HEIGHT / 2);

    addStaticGrapics(pixiApp);
    addBallIndicators(pixiApp);
    addMinMaxIndicators(pixiApp);
    addTextIndicators(pixiApp);

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