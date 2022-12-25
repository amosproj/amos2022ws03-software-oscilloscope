<script>
  import clsx from "clsx";
  import { createEventDispatcher } from "svelte";
  import mui_play_arrow from "../assets/mui_play_arrow.svg";
  import mui_stop from "../assets/mui_stop.svg";

  const dispatch = createEventDispatcher();

  let osciEnabled = false;
  $: url = osciEnabled ? mui_play_arrow : mui_stop;


  const handleClick = async () => {
    osciEnabled = !osciEnabled;
    dispatch("switch-plot-enabled", { enabled: osciEnabled });
  };

  export const click = () => {
    handleClick();
  };
</script>

<button id="button-on-off"
class={clsx(
  {"icon-button": true},
  {"mui-icon--off": osciEnabled},
  {"mui-icon--on": !osciEnabled}
)}
  on:click={handleClick} />
