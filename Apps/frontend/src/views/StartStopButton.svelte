<script>
	import { createEventDispatcher } from 'svelte'
	import Switch from "svelte-toggle";
	import { LINE_COLORS_RGBA } from "../const.js";
	export let channel_id;


	const dispatch = createEventDispatcher()

	let hasStarted = true;
	let color= LINE_COLORS_RGBA[channel_id];
	let channelLabel = "CH " + channel_id + "  ";

	const handleStartStop = async () => {
		hasStarted = !hasStarted;
		dispatch('startStop', {buttonValue: hasStarted})
	}


</script>
	<div class="switch-wrapper" >
		<Switch bind:value={hasStarted} hideLabel on={channelLabel} off={channelLabel} toggledColor={color} on:click={handleStartStop} />
	</div>

<style>
	.switch-wrapper {
	  display: flex;
	  justify-content: center;
	  margin: 0.25rem;
	}
  </style>


