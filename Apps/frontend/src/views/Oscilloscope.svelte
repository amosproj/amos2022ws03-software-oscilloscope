<script>
    import { onMount } from 'svelte';

    import { osciData } from '../stores';
    import { NR_SHOWN_DATAPOINTS } from '../const';
    import { normalizeForCanvas } from '../helper';
    

    const DEBUG_NR_DATA_POINTS = 10000

    let boundCanvas;
    osciData.subscribe(value => {
		inputData = value;
	});
    
    const main = (boundCanvas) => {
        /*================Creating a canvas=================*/
        const canvas = boundCanvas;
        /** @type {WebGLRenderingContext} */
        let gl =  canvas.getContext('webgl');      
        
        if (!gl) {
            gl = canvas.getContext('experimental-webgl');
        }

        /* Debugging Start */
        let inputMatrix = [];
        let count = 0;
        // NR -> 0 to fill up right to left
        for (let i=0; i < NR_SHOWN_DATAPOINTS-1; ++i) {
            const xIndex = normalizeForCanvas(i);
            const yIndex = count - 1; //for debugging purposes
            const zIndex = 1; //always same z-position so it looks like 2D

            inputMatrix[i] = [xIndex, yIndex, zIndex];
            
            count = (count + 1) % 3;
        }

        const vertexData = inputMatrix.flat();

        console.log("OsciData: ", osciData);
        /* Debugging End */


        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.DYNAMIC_DRAW);

        const vertexShader = gl.createShader(gl.VERTEX_SHADER);

        gl.shaderSource(vertexShader, `
            attribute vec3 position;

            void main() {
                gl_Position = vec4(position, 1);
            }
        `);
        gl.compileShader(vertexShader);

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

        // specifies color of lines
        gl.shaderSource(fragmentShader, `
            void main() {
                gl_FragColor = vec4(0.8, 0.8, 0, 1);
            }
        `);
        gl.compileShader(fragmentShader);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        const positionLocation = gl.getAttribLocation(program, `position`);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

        gl.useProgram(program);
        gl.drawArrays(gl.LINE_STRIP, 0, NR_SHOWN_DATAPOINTS);
    }

    onMount(() => {
        main(boundCanvas);
	});
</script>
  
<div>
    <canvas bind:this={boundCanvas} id="glCanvas" width="400" height="200" style="background-color: #000;"></canvas>
</div>  