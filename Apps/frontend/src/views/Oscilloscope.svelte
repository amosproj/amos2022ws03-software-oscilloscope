<script>
  import { onDestroy, onMount } from "svelte";
  import Logo from "./Logo.svelte";
  import Indicators from "./Indicators.svelte";
  import ExpandableControlPanel from "./ExpandableControlPanel.svelte";
  import ControlPanelBottom from "./ControlPanelBottom.svelte";
  import GeneralButtons from "./GeneralButtons.svelte";
  import Waves from "../components/Waves.svelte";
  import CoordinateSystem from "./CoordinateSystem.svelte";
  import { MIN_CONTROL_PANEL_BOTTOM_HEIGHT, NUM_CHANNELS } from "../const";
  import { osciEnabled, isGND } from "../stores";
  import { logSocketCloseCode } from "../helper";

  $: innerWidth = 0;
  $: innerHeight = 0;
  $: controlPanelBottomHeight = 0;

  let scalesY = Array(NUM_CHANNELS).fill(1); // 1V per horizontal line

  let waveElement;
  let indicatorElement;

  let socket;

  let gndSample = null;

  // ----- Svelte lifecycle hooks -----
  onMount(() => {
    socket = createSocket();

    socket.onmessage = socketOnMessage;
    socket.onclose = socketOnClose;
  });

  onDestroy(() => {
    socket.close();
  });

  // -----business logic functions -----
  const createSocket = () => {
    console.log("Connecting to :" + import.meta.env.VITE_BACKEND_WEBSOCKET);
    let socket = new WebSocket(import.meta.env.VITE_BACKEND_WEBSOCKET);
    socket.binaryType = "arraybuffer";

    return socket;
  };

  /**
   * On receiving a socket message, update buffer of waves.
   *
   * @param {MessageEvent} messageEvent - has poperty (Float64Array) data
   */
  const socketOnMessage = (messageEvent) => {
    if (!$osciEnabled) return;
    let samples = new Float64Array(messageEvent.data);
    if ($isGND) {
      if (gndSample == null) {
        gndSample = new Array(samples.length).fill(0.0);
      }
      samples = gndSample;
    }
    for (let index = 0; index < samples.length; index += NUM_CHANNELS) {
      waveElement.updateBuffer(samples, index, index + NUM_CHANNELS);
      if (index % 1000 == 0) indicatorElement.update(samples, index);
    }
  };

  const socketOnClose = (closeEvent) => logSocketCloseCode(closeEvent.code);
</script>

<svelte:window bind:innerWidth bind:innerHeight />
{#if innerHeight > innerWidth}
  <div class="screen-size-warning">
    We currently only support landscape mode, please turn your screen.
  </div>
{:else}
  <div class="wrapper">
    <div class="logo">
      <Logo />
    </div>
    <div class="control-panel--top_general">
      <GeneralButtons {waveElement} {indicatorElement} />
    </div>
    <div class="indicators">
      <Indicators bind:this={indicatorElement} scaleY={Math.max(...scalesY)} />
    </div>
    <div class="oscilloscope">
      <div class="oscilloscope--coordinate-system">
        <CoordinateSystem scaleY={Math.max(...scalesY)} />
      </div>
      <div class="oscilloscope--waves">
        <Waves bind:this={waveElement} {scalesY} />
      </div>
    </div>
    <div class="control-panel--right">Overall Buttons</div>
    <div
      class="control-panel--bottom"
      bind:clientHeight={controlPanelBottomHeight}
    >
      {#if controlPanelBottomHeight > MIN_CONTROL_PANEL_BOTTOM_HEIGHT}
        <ControlPanelBottom
          {waveElement}
          {indicatorElement}
          {controlPanelBottomHeight}
        />
      {:else}
        <ExpandableControlPanel {waveElement} {indicatorElement} />
      {/if}
    </div>
  </div>
{/if}
