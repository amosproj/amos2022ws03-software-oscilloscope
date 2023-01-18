/**
 * Metrics interfaces for different components like socket connections
 */
export class Metrics {
  /**
   * Create a new Metrics object
   * @param {String} name Name of the parent of this object
   */
  constructor(name) {
    /** Name of the parent */
    this.name = name;
    /** Packages per second metric */
    this.pps = 0;
  }
}
