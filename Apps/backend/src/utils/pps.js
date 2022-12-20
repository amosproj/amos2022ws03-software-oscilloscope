/**
 * @class PPS
 */
import { Logger } from "./logger.js";
import { Metrics } from "./metrics.js";

/**
 * Setup a new metrics monitor which will update once per second
 * Will update the following metrics:
 *  - PPS
 * @param {Metrics} metrics Name of the PPS calculator to use different PPS metrics
 * @param {Logger} logger Logger object used for the output
 * @memberof PPS
 */
export function setupMetricMonitors(metrics, logger) {
  setInterval(function () {
    calculatePackagesPerSecond(metrics, logger);
  }, 1000);
}
/**
 * Calculates the packages per second received on the UDP socket and resets the counter
 * @param {Metrics} metrics Metrics object that shpuld be updated
 * @param {Logger} logger Logger object used for the output
 * @memberof PPS
 */
function calculatePackagesPerSecond(metrics, logger) {
  //logger.log(`${metrics.name} PPS:  ${metrics.pps}`)
  metrics.pps = 0;
}
