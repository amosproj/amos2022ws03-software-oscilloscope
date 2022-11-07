<div>
  <canvas id="my_canvas" style="width: 100%;"></canvas>
</div>


<script>
    import {ColorRGBA, WebglLine, WebglPlot} from "webgl-plot";
    import {beforeUpdate, onMount} from 'svelte';

    const freq = 0.001;
    const amp = 0.5;
    const noise = 0.1;

    let wglp;
    let line;


    onMount(() => {
        const canvas = document.getElementById("my_canvas");
        console.log(canvas);
        const devicePixelRatio = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * devicePixelRatio;
        canvas.height = canvas.clientHeight * devicePixelRatio;

        const numX = canvas.width;
        const color = new ColorRGBA(Math.random(), Math.random(), Math.random(), 1);
        line = new WebglLine(color, numX);
        wglp = new WebglPlot(canvas);

        line.arrangeX();
        wglp.addLine(line);


        for (let i = 0; i < line.numPoints; i++) {
            const ySin = Math.sin(Math.PI * i * freq * Math.PI * 2);
            const yNoise = Math.random() - 0.5;
            line.setY(i, ySin * amp + yNoise * noise);
        }
    });

    beforeUpdate(() => {
        console.log("beforeUpdate");
        window.requestAnimationFrame(newFrame);
    });

    function newFrame() {
        update();
        wglp.update();
        window.requestAnimationFrame(newFrame);
    }

    function update() {
        const freq = 0.001;
        const amp = 0.5;
        const noise = 0.1;

        for (let i = 0; i < line.numPoints; i++) {
            const ySin = Math.sin(Math.PI * i * freq * Math.PI * 2);
            const yNoise = Math.random() - 0.5;
            line.setY(i, ySin * amp + yNoise * noise);
        }


    }
</script>













































































































