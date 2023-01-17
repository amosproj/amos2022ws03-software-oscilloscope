import "./app.scss";
// @ts-ignore
import App from "./App.svelte";

import { BASE_URL } from "./const";

const app = new App({
  target: document.getElementById("app"),
});

console.log(`Starting frontend on ${BASE_URL}`);

export default app;
