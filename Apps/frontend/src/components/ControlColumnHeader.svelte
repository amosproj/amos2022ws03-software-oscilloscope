<script>
  export let label;
  export let icon;
</script>

<div class="icon icon--{icon}" />
<div>{label}</div>

<style>
  .icon {
    width: 100%;
    height: 24px;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
