<script>
    import { createEventDispatcher } from "svelte";


    const dispatch = createEventDispatcher()

    let isOn = false;
    $: label = 'Turn ' + (isOn ? 'off' : 'on') + '.';

    const handleClick = async () => {
        isOn = !isOn;
        dispatch('switch-plot-enabled', {enabled: isOn});
    }
</script>

<br>
<button on:click={handleClick}>{label}</button>
