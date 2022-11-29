<script>
  import { onMount, onDestroy } from "svelte";
  import { CANVAS_HEIGHT, CANVAS_WIDTH, NUM_CHANNELS } from "../const";
  import CoordinateSystem from "../components/CoordinateSystem.svelte";
  import Waves from "../components/Waves.svelte";
  import OffsetSlider from "../components/OffsetSlider.svelte";
  import Indicators from "./Indicators.svelte";
  import OnOffButton from "../components/OnOffButton.svelte";
  import TimeSweepSlider from "../components/TimeSweepSlider.svelte";

  let waveElement;
  let scalesY = Array(NUM_CHANNELS).fill(1); // 1V per horizontal line
  let indicatorElement;
  let socket;

  let isEnabled = false;

  // ----- Svelte lifecycle hooks -----
  onMount(() => {
    socket = createSocket();

    socket.onopen = socketOnOpen;
    socket.onmessage = socketOnMessage;
    socket.onclose = socketOnClose;
  });

  onDestroy(() => {
    socket.close();
  });

  // -----business logic functions -----
  const createSocket = function () {
    let socket = new WebSocket(import.meta.env.VITE_BACKEND_WEBSOCKET);
    socket.binaryType = "arraybuffer";

    return socket;
  };

  const socketOnOpen = function (event) {
    console.log("Socket opened");
  };

  const socketOnMessage = function (messageEvent) {
    let samples = new Float64Array(messageEvent.data);
    if (!isEnabled) return;
    waveElement.updateBuffer(samples);
    indicatorElement.update(samples);
  };

  const socketOnClose = function (closeEvent) {
    // See https://www.rfc-editor.org/rfc/rfc6455#section-7.4.1
    let reason;
    switch (closeEvent.code) {
      case 1000:
        reason =
          "Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";
        break;
      case 1001:
        reason =
          'An endpoint is "going away", such as a server going down or a browser having navigated away from a page.';
        break;
      case 1002:
        reason =
          "An endpoint is terminating the connection due to a protocol error";
        break;
      case 1003:
        reason =
          "An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).";
        break;
      case 1004:
        reason =
          "Reserved. The specific meaning might be defined in the future.";
        break;
      case 1004:
        reason = "No status code was actually present.";
        break;
      case 1006:
        reason =
          "The connection was closed abnormally, e.g., without sending or receiving a Close control frame";
        break;
      case 1007:
        reason =
          "An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [https://www.rfc-editor.org/rfc/rfc3629] data within a text message).";
        break;
      case 1008:
        reason =
          'An endpoint is terminating the connection because it has received a message that "violates its policy". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.';
        break;
      case 1009:
        reason =
          "An endpoint is terminating the connection because it has received a message that is too big for it to process.";
        break;
      case 1010:
        reason =
          "An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didn't return them in the response message of the WebSocket handshake. <br /> Specifically, the extensions that are needed are: " +
          closeEvent.reason;
        break;
      case 1011:
        reason =
          "A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.";
        break;
      case 1015:
        reason =
          "The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).";
        break;
      default:
        reason = "Unknown reason";
        break;
    }
    console.log("Websocket closed: " + reason);
  };
</script>

<div
  class="wrapper"
  style="--canvas-width: {CANVAS_WIDTH}px; --canvas-height: {CANVAS_HEIGHT}px"
  data-cy="oscilloscope"
>
  <div class="grid-container">
    <div class="indicators">
      <Indicators bind:this={indicatorElement} scaleY={Math.max(...scalesY)} />
    </div>
    <div class="oscilloscope">
      <div class="coordinate-system">
        <CoordinateSystem scaleY={Math.max(...scalesY)} />
      </div>
      <div class="waves">
        <Waves bind:this={waveElement} {scalesY} />
      </div>
    </div>
    <div class="controls">
      <OnOffButton
        on:switch-plot-enabled={(e) => {
          isEnabled = e.detail.enabled;
        }}
      />
      <div class="slider-wrapper">
        <div class="sliders">
          Offset
          {#each { length: NUM_CHANNELS } as _, index}
            <OffsetSlider
              onInput={(offsetY) => {
                waveElement.updateChannelOffsetY(index, offsetY);
              }}
            />
          {/each}
        </div>
        <div class="sliders">
          Time Sweep
          {#each { length: NUM_CHANNELS } as _, index}
            <TimeSweepSlider channel={index} />
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .wrapper {
    display: flex;
    justify-content: center;
  }

  .grid-container {
    display: grid;
    grid-template-columns: 200px var(--canvas-width);
  }
  .indicators {
    grid-column: 1;
  }

  .oscilloscope {
    grid-column: 2;
    position: relative;
  }

  .oscilloscope .coordinate-system,
  .oscilloscope .waves {
    position: absolute;
    inset: 0;
  }
  .controls {
    grid-column: 2;
  }

  .slider-wrapper {
    display: flex;
  }

  .sliders {
    width: 50%;
  }
</style>
