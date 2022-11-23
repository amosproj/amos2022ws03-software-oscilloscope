<script>
  import { onMount, onDestroy } from "svelte";
  import CoordinateSystem from "./CoordinateSystem.svelte";
  import SineWave from "./SineWave.svelte";
  import { CANVAS_HEIGHT, CANVAS_WIDTH, NUM_CHANNELS } from "../const";
  import Indicators from "./Indicators.svelte";
  import OnOffButton from "./OnOffButton.svelte";
  import TimeSweepSlider from "./TimeSweepSlider.svelte";

  let waveElement;
  let indicatorElement;
  let scaleY = 0.5; // 1V per horizontal line
  let socket;

  let isEnabled = false;

  onMount(() => {
    socket = new WebSocket(import.meta.env.VITE_BACKEND_WEBSOCKET);
    socket.binaryType = "arraybuffer";

    socket.onopen = () => {
      console.log("Socket opened");
    };

    socket.onclose = function (event) {
        var reason;
        // See https://www.rfc-editor.org/rfc/rfc6455#section-7.4.1
        if (event.code == 1000)
            reason = "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
        else if(event.code == 1001)
            reason = "An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.";
        else if(event.code == 1002)
            reason = "An endpoint is terminating the connection due to a protocol error";
        else if(event.code == 1003)
            reason = "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
        else if(event.code == 1004)
            reason = "Reserved. The specific meaning might be defined in the future.";
        else if(event.code == 1005)
            reason = "No status code was actually present.";
        else if(event.code == 1006)
           reason = "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
        else if(event.code == 1007)
            reason = "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [https://www.rfc-editor.org/rfc/rfc3629] data within a text message).";
        else if(event.code == 1008)
            reason = "An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.";
        else if(event.code == 1009)
           reason = "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
        else if(event.code == 1010) // Note that this status code is not used by the server, because it can fail the WebSocket handshake instead.
            reason = "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " + event.reason;
        else if(event.code == 1011)
            reason = "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
        else if(event.code == 1015)
            reason = "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
        else
            reason = "Unknown reason";  
        
        console.log("Websocket: " +reason)
    };

    socket.onmessage = (message) => {
      let samples = new Float64Array(message.data);
      if (!isEnabled) return;
      waveElement.updateBuffer(samples);
      indicatorElement.update(samples);
    };
  });

  onDestroy(() => {
    socket.close();
  });
</script>

<div
  class="wrapper"
  style="--canvas-width: {CANVAS_WIDTH}px; --canvas-height: {CANVAS_HEIGHT}px"
  data-cy="oscilloscope"
>
  <div class="indicators">
    <Indicators bind:this={indicatorElement} {scaleY} />
  </div>
  <div class="stack coordinate-system">
    <CoordinateSystem yScale={scaleY} />
  </div>
  <div class="stack wave">
    <SineWave bind:this={waveElement} {scaleY} />
  </div>
</div>

<div class="wrapper" id="control-panel">
  <div id="btn-on-off">
    <OnOffButton
      on:switch-plot-enabled={(e) => {
        isEnabled = e.detail.enabled;
      }}
    />
  </div>
  <div id="slider-container">
    {#each Array(NUM_CHANNELS) as _, i}
      <div class="slider"><TimeSweepSlider channel={i} /></div>
    {/each}
  </div>
</div>

<style>
  .wrapper {
    position: relative;
    width: var(--canvas-width);
    height: var(--canvas-height);
    margin-left: auto;
    margin-right: auto;
  }
  .indicators {
    position: absolute;
    left: 0;
    transform: translateX(-100%);
  }
  .stack {
    position: absolute;
    inset: 0;
  }
  .coordinate-system {
    z-index: 0;
  }
  .wave {
    z-index: 1;
  }
  #control-panel {
    top: 500px;
  }
  #slider-container {
    display: table;
  }
  .slider {
    display: table-cell;
  }
</style>
