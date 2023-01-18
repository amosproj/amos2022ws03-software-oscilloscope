/**
 * Logging wrapper
 */
export class Logger {
  /**
   * Create a new logger
   * @param {String} name Name of the parent of this logger
   */
  constructor(name) {
    this.name = name;
  }

  /**
   * Log a message to the console
   * @param {String} msg The message to be logged
   * @param {String} lvl The logging level. DEFAULT: INFO
   */
  log(msg, lvl = "INFO") {
    console.log(`[${Date.now()}] - [${lvl}] ${this.name}: ${msg}`);
  }
}
