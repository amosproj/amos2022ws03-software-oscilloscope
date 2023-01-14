export class Grid {
  webgl: WebGLRenderingContext;
  vertexBuffer: WebGLBuffer;
  gridVertices: Float32Array;
  color: [number, number, number, number];
  verticalDevisions: number;
  horizontalDevisions: number;

  constructor(gl, verticalDevisions, horizontalDevisions) {
    this.webgl = gl;
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.vertexBuffer = this.webgl.createBuffer() as WebGLBuffer;
    this.verticalDevisions = verticalDevisions;
    this.horizontalDevisions = horizontalDevisions;
    this.initializeGridVertices();
  }

  initializeGridVertices() {
    let verticalVertices: number[] = this.createVerticalLineVertices();
    let horizontalVertices: number[] = this.createHorizontalLineVertices();
    let gridVertices: number[] = verticalVertices.concat(horizontalVertices);
    this.gridVertices = new Float32Array(gridVertices);
  }

  createVerticalLineVertices() {
    let verticalLines: number[] = [];
    let stepSize = 2.0 / this.verticalDevisions;
    for (let x = -1.0; x <= 1.0; x += stepSize) {
      verticalLines.push(x);
      verticalLines.push(-1.0);
      verticalLines.push(x);
      verticalLines.push(1.0);
    }
    return verticalLines;
  }

  createHorizontalLineVertices() {
    let horizontalLines: number[] = [];
    let stepSize = 2.0 / this.horizontalDevisions;
    for (let y = -1.0; y <= 1.0; y += stepSize) {
      horizontalLines.push(-1.0);
      horizontalLines.push(y);
      horizontalLines.push(1.0);
      horizontalLines.push(y);
    }
    return horizontalLines;
  }

  draw(shaderProgram) {
    this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, this.vertexBuffer);
    this.webgl.bufferData(
      this.webgl.ARRAY_BUFFER,
      this.gridVertices,
      this.webgl.STATIC_DRAW
    );
    let vertexPositionAttrribute = this.webgl.getAttribLocation(
      shaderProgram,
      "aVertexPosition"
    );
    this.webgl.vertexAttribPointer(
      vertexPositionAttrribute,
      2,
      this.webgl.FLOAT,
      false,
      0,
      0
    );

    let colorUniform = this.webgl.getUniformLocation(shaderProgram, "u_colour");
    this.webgl.uniform4fv(colorUniform, new Float32Array(this.color));

    this.webgl.enableVertexAttribArray(vertexPositionAttrribute);
    this.webgl.drawArrays(this.webgl.LINES, 0, this.gridVertices.length / 2);
  }
}
