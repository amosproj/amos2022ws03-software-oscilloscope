<script>
  import logo from "../assets/sosci-logo.svg";
</script>

<div>
  <img src={logo} alt="SOSCI" />
</div>

<style>
  div {
    width: 100%;
  }
  img {
    width: 15rem;
    filter: invert(100%);
  }
  @media (prefers-color-scheme: light) {
    img {
      filter: none;
    }
  }
</style>
