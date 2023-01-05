<script>
  import Logo from "./Logo.svelte";
  import GeneralButtons from "../components/GeneralButtons.svelte";
  import StartStopButton from "../components/StartStopButton.svelte";
  import Indicators from "./Indicators.svelte";
  import Waves from "../components/Waves.svelte";
  import CoordinateSystem from "./CoordinateSystem.svelte";
  import { NUM_CHANNELS } from "../const";
  import { onDestroy, onMount } from "svelte";
  import { osciEnabled } from "../stores";
  import { logSocketCloseCode } from "../helper";
  import ExtendedControlPanelTop from "../components/ExtendedControlPanelTop.svelte";
  import ControlPanelBottom from "./ControlPanelBottom.svelte";

  $: innerWidth = 0;
  $: innerHeight = 0;
  $: controlPanelBottomHeight = 0;
  $: controlPanelBottomWidth = 0;

  let scalesY = Array(NUM_CHANNELS).fill(1); // 1V per horizontal line

  let waveElement;
  let indicatorElement;

  let socket;

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
    <div class="control-panel--top_waves">
      {#each { length: NUM_CHANNELS } as _, index}
        <StartStopButton
          channel_id={index}
          on:startStop={async (event) => {
            let hasStarted = event.detail.buttonValue;
            waveElement.startStopChannelI(index, hasStarted);
            indicatorElement.startStopChannelI(index, hasStarted);
          }}
        />
      {/each}
    </div>
    {#if true} <!--controlPanelBottomHeight < 240 && 6 * controlPanelBottomHeight < controlPanelBottomWidth-->
      <div class="control-panel--top_expansion">
        <ExtendedControlPanelTop {waveElement} {indicatorElement}/>
      </div>
    {/if}
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
    <div class="control-panel--right">
      Overall Buttons such as Save Presets,...
    </div>
    <div
      class="control-panel--bottom"
      bind:clientHeight={controlPanelBottomHeight}
      bind:clientWidth={controlPanelBottomWidth}
    >
      <ControlPanelBottom {waveElement} {indicatorElement} /> 
    </div>
  </div>
{/if}
