export class Logger {
  constructor(name) {
    this.name = name;
  }

  log(msg, lvl = "INFO") {
    console.log(`[${Date.now()}] - [${lvl}] ${this.name}: ${msg}`);
  }
}
