import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  DEFAULT_STEP_SIZE,
  HEAD_PIXEL_WIDTH,
  MAX_SWEEP,
  MIN_SWEEP,
  NUM_INTERVALS_HORIZONTAL,
  NUM_INTERVALS_VERTICAL,
  UPDATES_PER_SECOND,
  WAVE_CURSOR_SIZE,
} from "./const";

export class Channel {
  webgl: WebGLRenderingContext;
  vertexBuffer: WebGLBuffer;
  headVertexBuffer: WebGLBuffer;
  vertices: Float32Array;
  samples: (number | undefined)[];
  nextXToUpdate: number = 0;
  offsetY: number = 0.0;
  scaleY: number = 1.0;
  active: boolean = true;
  // sec/div
  sweep: number = 1.0;
  color: [number, number, number, number];
  xCurr: number = 0.0;
  xLast: number = 0.0;
  xDelta: number = 1.0;
  constructor(webgl, color: [number, number, number]) {
    this.webgl = webgl;
    this.vertexBuffer = this.webgl.createBuffer() as WebGLBuffer;
    this.headVertexBuffer = this.webgl.createBuffer() as WebGLBuffer;
    this.vertices = new Float32Array(2 * CANVAS_WIDTH);
    this.color = [color[0] / 255, color[1] / 255, color[2] / 255, 1.0];
    this.initializeVertices();
    this.computeXDelta();
  }

  computeXDelta() {
    let timePerScreen = CANVAS_WIDTH / UPDATES_PER_SECOND;
    let timePerDiv = timePerScreen / NUM_INTERVALS_VERTICAL;

    this.xDelta = timePerDiv * this.sweep;
  }

  initializeVertices() {
    this.samples = new Array(CANVAS_WIDTH).fill(undefined);

    let xNDC = -1.0;
    let xStepNDC = 2.0 / CANVAS_WIDTH;
    for (let i = 0; i < this.vertices.length; i = i + 2) {
      this.vertices[i] = xNDC;
      xNDC += xStepNDC;
    }
  }

  update(sample) {
    if (!this.active) return;

    let xNew = Math.round(this.xCurr);
    for (let x = this.xLast + 1; x < xNew + 1; x++) {
      this.samples[x] = sample;
      this.samples[(x + WAVE_CURSOR_SIZE) % CANVAS_WIDTH] = undefined;
    }
    this.xLast = xNew;

    // time sweep (https://github.com/amosproj/amos2022ws03-software-oscilloscope/wiki/Development-Documentation#time-sweep-calculation)

    this.xCurr = this.xCurr + this.xDelta;
    while (this.xCurr >= CANVAS_WIDTH) {
      this.xCurr -= CANVAS_WIDTH;
    }
  }

  setScaling(scaleY) {
    this.scaleY = scaleY;
  }

  draw(shaderProgram) {
    this.drawLine(shaderProgram);
    this.drawHead(shaderProgram);
  }

  drawLine(shaderProgram) {
    let voltsToNDC = 2.0 / NUM_INTERVALS_HORIZONTAL;
    for (let i = 0; i < this.samples.length; i++) {
      this.vertices[i * 2 + 1] = (this.samples[i] as number) * voltsToNDC;
    }

    this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, this.vertexBuffer);
    this.webgl.bufferData(
      this.webgl.ARRAY_BUFFER,
      this.vertices,
      this.webgl.STATIC_DRAW
    );
    let aVertexPosition = this.webgl.getAttribLocation(
      shaderProgram,
      "aVertexPosition"
    );
    this.webgl.vertexAttribPointer(
      aVertexPosition,
      2,
      this.webgl.FLOAT,
      false,
      0,
      0
    );
    let colorUniform = this.webgl.getUniformLocation(shaderProgram, "u_colour");
    this.webgl.uniform4fv(colorUniform, new Float32Array(this.color));

    let offsetYUniform = this.webgl.getUniformLocation(
      shaderProgram,
      "u_offsetY"
    );
    this.webgl.uniform1f(offsetYUniform, this.offsetY);

    let scaleYUniform = this.webgl.getUniformLocation(
      shaderProgram,
      "u_scaleY"
    );
    this.webgl.uniform1f(scaleYUniform, this.scaleY);

    this.webgl.drawArrays(this.webgl.LINE_STRIP, 0, this.vertices.length / 2);
  }

  drawHead(shaderProgram) {
    let x: number = this.vertices[2 * Math.round(this.xCurr)];
    let y: number = this.scaleY * this.vertices[2 * Math.round(this.xCurr) + 1];
    // TODO: don't caluclate every draw call. Maybe calculate in shader
    // (x,y) to [-1.0;1.0]
    let yCoordinateToNDC = 2.0 / CANVAS_HEIGHT;
    let xCoordinateToNDC = 2.0 / CANVAS_WIDTH;
    let headXWidthNDC = HEAD_PIXEL_WIDTH * xCoordinateToNDC;
    let headYWidthNDC = HEAD_PIXEL_WIDTH * yCoordinateToNDC;

    let squareVertices = new Float32Array([
      x + headXWidthNDC,
      y + headYWidthNDC,
      x + headXWidthNDC,
      y - headYWidthNDC,
      x - headXWidthNDC,
      y + headYWidthNDC,
      x - headXWidthNDC,
      y - headYWidthNDC,
    ]);

    this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, this.headVertexBuffer);
    this.webgl.bufferData(
      this.webgl.ARRAY_BUFFER,
      squareVertices,
      this.webgl.STATIC_DRAW
    );

    let vertexPositionAttribute = this.webgl.getAttribLocation(
      shaderProgram,
      "aVertexPosition"
    );
    this.webgl.vertexAttribPointer(
      vertexPositionAttribute,
      2,
      this.webgl.FLOAT,
      false,
      0,
      0
    );
    let colorUniform = this.webgl.getUniformLocation(shaderProgram, "u_colour");
    this.webgl.uniform4fv(colorUniform, new Float32Array(this.color));

    let offsetYUniform = this.webgl.getUniformLocation(
      shaderProgram,
      "u_offsetY"
    );
    this.webgl.uniform1f(offsetYUniform, this.offsetY);

    let scaleYUniform = this.webgl.getUniformLocation(
      shaderProgram,
      "u_scaleY"
    );
    this.webgl.uniform1f(scaleYUniform, 1.0);

    this.webgl.drawArrays(
      this.webgl.TRIANGLE_STRIP,
      0,
      squareVertices.length / 2
    );
  }
}
