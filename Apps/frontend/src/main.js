import "./app.css";
// @ts-ignore
import App from "./App.svelte";
import { channelConfig } from "./stores";

import { BASE_URL } from "./const";

const app = new App({
  target: document.getElementById("app"),
});

console.log(`Starting frontend on ${BASE_URL}`)
//console.log(channelConfig)

export default app;
