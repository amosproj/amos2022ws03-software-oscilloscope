<script>
  import { clsx } from "clsx";
  import Waves from "../components/Waves.svelte";
  import { NUM_CHANNELS } from "../const";
  import ControlPanel from "./ControlPanel.svelte";
  import CoordinateSystem from "./CoordinateSystem.svelte";
  import Indicators from "./Indicators.svelte";
  import Logo from "./Logo.svelte";
  import Oscilloscope from "./Oscilloscope.svelte";

  $: innerWidth = 0;
  $: innerHeight = 0;
  $: controlPanelBottomHeight = 0;
  $: controlPanelBottomWidth = 0;

  let scalesY = Array(NUM_CHANNELS).fill(1); // 1V per horizontal line
  let waveElement;
  let indicatorElement;
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
            Always big
        </div>
        <div class="control-panel--bottom" bind:clientHeight={controlPanelBottomHeight} bind:clientWidth={controlPanelBottomWidth}>
            {controlPanelBottomHeight > 200 || 6 * controlPanelBottomHeight > controlPanelBottomWidth ? "Big" : "Small"}<br/>
            If this becomes small, move stuff to right and/or open accordions
        </div>
    </div>
{/if}

<style>
    .indicators {
        grid-column: 1;
        grid-row: 1/3;
        justify-self: end;
        height:100%;
        background-color: green;
        padding: 1px 0;
    }

    .oscilloscope {
        grid-column: 2; 
        grid-row: 1/3;
        background-color: red;
    }
</style>