<script>
	import { createEventDispatcher } from 'svelte'
	import Switch from "svelte-toggle";
	export let channel_id;


	const dispatch = createEventDispatcher()

	let hasStarted = true;
	let switchLabelOn = "Started " + channel_id;
	let switchLabelOff = "Stopped " + channel_id;

	const handleStartStop = async () => {
		hasStarted = !hasStarted;
		dispatch('startStop', {buttonValue: hasStarted})
	}


</script>

<Switch bind:value={hasStarted} hideLabel on={switchLabelOn}
off={switchLabelOff} design="slider" on:click={handleStartStop} />


