import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./const";

export class Channel {
    vertexBuffer;
    vertices;
    gl;
    nextXToUpdate;
    offsetY;
    active;
    constructor(gl, vertexBufferLength, color) {
        this.color = [color[0] / 255, color[1] / 255, color[2] / 255, 1.0]
        this.gl = gl;
        this.vertices = new Float32Array(2 * vertexBufferLength);
        this.vertexBuffer = this.gl.createBuffer();
        this.headVertexBuffer = this.gl.createBuffer();
        this.nextXToUpdate = 0;
        this.offsetY = 0.0;
        this.scaleY = 1.0;
        this.active = true;
        this.initVerticesX();
    }

    update(y) {
        if (!this.active)
          return;
          
        this.vertices[this.nextXToUpdate + 1] = y;
        this.nextXToUpdate = (this.nextXToUpdate + 2) % this.vertices.length;
    }
     
    setScaling(scaleY) {
      this.scaleY = scaleY;
    }

    initVerticesX()
    {
        let numberOfVertices = this.vertices.length / 2;
        let xHomogenious = -1.0;
        let stepSize = 2.0 / numberOfVertices;
        for (let i = 0; i < this.vertices.length; i++)
        {
          if (i % 2 == 0)
          {
            this.vertices[i] = xHomogenious;
            xHomogenious += stepSize;
          }
          else
          this.vertices[i] = 0.0;
        }
    }

    draw(shaderProgram) {
      this.drawLine(shaderProgram);
      this.drawHead(shaderProgram);
    }

    drawLine(shaderProgram) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.STATIC_DRAW);

      let aVertexPosition  = this.gl.getAttribLocation(shaderProgram, "aVertexPosition");
      this.gl.vertexAttribPointer(
        aVertexPosition,
        2,
        this.gl.FLOAT,
        false,
        0,
        0
      );
      let colorUniform = this.gl.getUniformLocation(shaderProgram, 'u_colour');
      this.gl.uniform4fv(colorUniform, new Float32Array(this.color));

      let offsetYUniform = this.gl.getUniformLocation(shaderProgram, 'u_offsetY');
      this.gl.uniform1f(offsetYUniform, this.offsetY);

      let scaleYUniform = this.gl.getUniformLocation(shaderProgram, 'u_scaleY');
      this.gl.uniform1f(scaleYUniform, this.scaleY);

      this.gl.drawArrays(this.gl.LINE_STRIP, 0, this.vertices.length / 2);
    }

    drawHead(shaderProgram) {
      let x = this.vertices[this.nextXToUpdate]
      let y = this.vertices[this.nextXToUpdate + 1]

      // TODO: don't caluclate every draw call. Maybe calculate in shader
      // (x,y) to [-1.0;1.0]
      let yCoordinateToNDC = 2.0 / CANVAS_HEIGHT;
      let xCoordinateToNDC = 2.0 / CANVAS_WIDTH;
      let headWidthPixels = 5;
      let headXWidthNDC = headWidthPixels * xCoordinateToNDC
      let headYWidthNDC = headWidthPixels * yCoordinateToNDC   

      let squareVertices = new Float32Array([x + headXWidthNDC, y + headYWidthNDC,
                            x + headXWidthNDC, y - headYWidthNDC,
                            x - headXWidthNDC, y + headYWidthNDC,
                            x - headXWidthNDC, y - headYWidthNDC,
                          ]);

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.headVertexBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, squareVertices, this.gl.STATIC_DRAW);

      let aVertexPosition  = this.gl.getAttribLocation(shaderProgram, "aVertexPosition");
      this.gl.vertexAttribPointer(
        aVertexPosition,
        2,
        this.gl.FLOAT,
        false,
        0,
        0
      );
      let colorUniform = this.gl.getUniformLocation(shaderProgram, 'u_colour');
      this.gl.uniform4fv(colorUniform, new Float32Array(this.color));

      let offsetYUniform = this.gl.getUniformLocation(shaderProgram, 'u_offsetY');
      this.gl.uniform1f(offsetYUniform, this.offsetY);

      let scaleYUniform = this.gl.getUniformLocation(shaderProgram, 'u_scaleY');
      this.gl.uniform1f(scaleYUniform, this.scaleY);

      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, squareVertices.length / 2);
  }
}