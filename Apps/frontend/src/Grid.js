export class Grid {
    vertexBuffer;
    gridVertices;
    gl;
    color;
    verticalLines;
    horizontalLines;
    constructor(gl, verticalDevisions, horizontalDevisions) {
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.gl = gl;
        this.vertexBuffer = this.gl.createBuffer();
        this.verticalDevisions = verticalDevisions;
        this.horizontalDevisions = horizontalDevisions;
        this.initGridVertices();
    }

    initGridVertices()
    {
        let verticalLines = this.initVerticalLines();
        let horizontalLines = this.initHorizontalLines();
        let lines = verticalLines.concat(horizontalLines);
        this.gridVertices = new Float32Array(lines);
    }

    initVerticalLines()
    {
        let verticalLines = [];
        let stepSize = 2.0 / this.verticalDevisions;
        for (let x = -1.0; x <= 1.0; x += stepSize) 
        {
            verticalLines.push(x);
            verticalLines.push(-1.0);
            verticalLines.push(x);
            verticalLines.push(1.0);
        }
        return verticalLines;
    }

    initHorizontalLines()
    {
        let horizontalLines = [];
        let stepSize = 2.0 / this.horizontalDevisions;
        for (let y = -1.0; y <= 1.0; y += stepSize) 
        {
            horizontalLines.push(-1.0);
            horizontalLines.push(y);
            horizontalLines.push(1.0);
            horizontalLines.push(y);
        }
        return horizontalLines;
    }

    draw(shaderProgram) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.gridVertices, this.gl.STATIC_DRAW);
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

        this.gl.enableVertexAttribArray(aVertexPosition);
        this.gl.drawArrays(this.gl.LINES, 0, this.gridVertices.length / 2)
    }
}