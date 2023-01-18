import dgram from "node:dgram";
import { Metrics } from "../utils/metrics.js";
import { setupMetricMonitors } from "../utils/pps.js";
import { Logger } from "../utils/logger.js";

/**
 * Create a new UDP socket. The callback is called on incoming UDP packages
 */
export class UdpSocket {
  /**
   * Create a new UDP socket. The callback is called on incoming UDP packages
   * @param {number} port Port which shall be used to bind the UDP socket
   * @param {string} address Address which shall be used to bind the UDP socket
   * @param {Function} callback Callback on incoming UDP packages
   */
  constructor(port, address, callback) {
    this.port = port;
    this.address = address;
    this.callback = callback;

    this.metrics = new Metrics("UDP Socket");
    this.logger = new Logger("UDP Socket");
    setupMetricMonitors(this.metrics, this.logger);
  }

  /**
   * Setup the UDP socket for Generator connection
   */
  setupInterface() {
    this.server = dgram.createSocket("udp4");

    this.server.bind(this.port, this.address);

    this.server.on("error", (err) => {
      this.logger.log(`error:\n${err.stack}`);
      this.server.close(package_recieved);
    });

    /**
     * Receive incoming UDP packages and handle them
     * @param {Float64Array} msg.bufffer
     */
    this.server.on("message", (msg, _) => {
      let samples = new Float64Array(msg.buffer);
      this.metrics.pps += 1;

      this.callback.handle(samples);
    });

    this.server.on("listening", () => {
      const address = this.server.address();
      this.logger.log(`Bound on ${address.address}:${address.port}`);
    });
    this.logger.log("Initialized");
  }
}
