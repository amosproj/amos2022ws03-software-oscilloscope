import { Channel } from "./Channel";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  LINE_COLORS,
  NUM_CHANNELS,
  NUM_INTERVALS_HORIZONTAL,
  NUM_INTERVALS_VERTICAL,
} from "./const";
import { Grid } from "./Grid";
import { fragmentShader, vertexShader } from "./shader/shader";
import { createShaderProgram } from "./shader/shaderHelper";

export class Oscilloscope {
  private webgl: WebGLRenderingContext;
  private webGlProgram: WebGLProgram;
  public grid: Grid;
  public channels: Channel[] = [];

  constructor(webgl: WebGLRenderingContext) {
    this.webgl = webgl;
    this.webGlProgram = createShaderProgram(
      this.webgl,
      vertexShader,
      fragmentShader
    );
    this.grid = new Grid(webgl);
    this.initializeProgram();
    this.createChannels();
  }

  initializeProgram() {
    this.webgl.useProgram(this.webGlProgram);
    let attributeVertexPosition = this.webgl.getAttribLocation(
      this.webGlProgram,
      "aVertexPosition"
    );
    this.webgl.vertexAttribPointer(
      attributeVertexPosition,
      2,
      this.webgl.FLOAT,
      false,
      0,
      0
    );
    this.webgl.enableVertexAttribArray(attributeVertexPosition);
  }

  draw() {
    this.webgl.viewport(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.webgl.clear(this.webgl.COLOR_BUFFER_BIT);

    this.grid.draw(this.webGlProgram);
    for (const channel of this.channels) {
      channel.draw(this.webGlProgram);
    }
  }

  updateChannels(samplesInVolts) {
    for (let i = 0; i < this.channels.length; i++) {
      this.channels[i].update(samplesInVolts[i]);
    }
  }

  createChannels() {
    for (let i = 0; i < NUM_CHANNELS; i++) {
      let color: [number, number, number] = [
        LINE_COLORS[i][0],
        LINE_COLORS[i][1],
        LINE_COLORS[i][2],
      ];
      this.channels.push(new Channel(this.webgl, color));
    }
  }
}
