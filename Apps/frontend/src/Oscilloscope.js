import { Channel } from "./Channel";
import { CANVAS_HEIGHT, CANVAS_WIDTH, LINE_COLORS } from "./const";
import { Grid } from "./Grid";

export class Oscilloscope {
    gl;
    grid;
    channels;
    shaderProgramm;

    constructor(gl, shaderProgram) {
        this.gl = gl;
        this.shaderProgramm = shaderProgram;
        this.grid = new Grid(gl);
        this.createChannels();
    }

    draw() {
        this.gl.viewport(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    

        this.grid.draw(this.shaderProgramm);
        for (const channel of this.channels)
        {
          channel.draw(this.shaderProgramm);
        }
    }

    updateChannels(samples) {
        let voltsToNDC = 1.0 / (this.grid.horizontalLines / 2);

        for (let i = 0; i < this.channels.length; i++)
        {
            this.channels[i].update(samples[i] * voltsToNDC)
        }
    }
    createChannels() {
        this.channels = [];
        for (let i = 0; i < 10; i++)
        {
          this.channels.push(new Channel(this.gl, CANVAS_WIDTH, LINE_COLORS[i]));
        }
    }
}