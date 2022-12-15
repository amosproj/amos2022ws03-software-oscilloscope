/**
 *
 * @param {*} name Name of the PPS calculator to use different PPS metrics
 */
export function setupMetricMonitors(metrics) {
  setInterval(function () {
    calculatePackagesPerSecond(metrics);
  }, 1000);
}
/**
 * Calculates the packages per second received on the UDP socket and resets the counter
 */
function calculatePackagesPerSecond(metrics) {
  //console.debug(`[DEBUG] ${metrics.name} PPS:  ${metrics.pps}`)
  metrics.pps = 0;
}
