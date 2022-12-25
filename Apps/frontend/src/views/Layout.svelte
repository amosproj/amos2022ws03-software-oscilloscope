<script>
  import { clsx } from "clsx";
  import OnOffButton from "../components/OnOffButton.svelte";
  import StartStopButton from "../components/StartStopButton.svelte";
  import Waves from "../components/Waves.svelte";
  import { NUM_CHANNELS } from "../const";
  import ControlPanel from "./ControlPanel.svelte";
  import CoordinateSystem from "./CoordinateSystem.svelte";
  import Indicators from "./Indicators.svelte";
  import Logo from "./Logo.svelte";
  import Oscilloscope from "./Oscilloscope.svelte";
  import { osciEnabled } from "../stores";
  import ResetButton from "../components/ResetButton.svelte";

  $: innerWidth = 0;
  $: innerHeight = 0;
  $: controlPanelBottomHeight = 0;
  $: controlPanelBottomWidth = 0;

  let scalesY = Array(NUM_CHANNELS).fill(1); // 1V per horizontal line
  
  let waveElement;
  let indicatorElement;
  let onOffButton;
</script>

<svelte:window bind:innerWidth bind:innerHeight />
{#if innerHeight > innerWidth}
    <div class="screen-size-warning"> <!--TODO-->
        We currently only support landscape mode, please turn your screen.
    </div>
{:else}
    <!--<div class={clsx( TODO
        {"wrapper": true},
        {"--decrease-first-row": 2.4 * innerHeight < innerWidth}
    )}>-->
    <div class="wrapper">
        <div class="logo">
            <Logo />
        </div>
        <div class="control-panel--top">
            <div class="control-panel--top_on-off">
                <OnOffButton
                    on:switch-plot-enabled={(e) => {
                        $osciEnabled = e.detail.enabled;
                    }}
                    bind:this={onOffButton}
                />
            </div>
            <div class="control-panel--top_reset">
                <ResetButton
                    on:reset={() => {
                        // if oscilloscope is running, click stop button
                        if ($osciEnabled) {
                            onOffButton.click();
                        }
                        // clear canvas and indicators
                        indicatorElement.clearCanvas();
                        waveElement.resetPlot();
                    }}
                />
            </div>
            <div class="control-panel--top_display-hide">
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
        </div>
        <div class="indicators">
            <Indicators bind:this={indicatorElement} scaleY={Math.max(...scalesY)}/>
        </div>
        <div class="oscilloscope">
            <div class="coordinate-system">
                <CoordinateSystem scaleY={Math.max(...scalesY)} />
            </div>
            <div class="waves">
                <Waves bind:this={waveElement} {scalesY} />
            </div>
        </div>
        <div class="control-panel--right">
            Overall Buttons such as Save Presets,...
        </div>
        <div class="control-panel--bottom" bind:clientHeight={controlPanelBottomHeight} bind:clientWidth={controlPanelBottomWidth}>
            {controlPanelBottomHeight > 200 || 6 * controlPanelBottomHeight > controlPanelBottomWidth ? "Big" : "Small"}<br/>
            If this becomes small, move stuff to top and/or open accordions
        </div>
    </div>
{/if}