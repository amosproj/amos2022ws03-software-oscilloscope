import { WebSocketServer } from "ws";
import { Metrics } from "../utils/metrics.js";
import { setupMetricMonitors } from "../utils/pps.js";
import { DeliveryPackage } from "../utils/deliveryPackage.js";
import { Logger } from "../utils/logger.js";
import { DEFAULT_PACKAGE_SIZE } from "../const.js";

/**
 * WebSocket Interface
 */
export class WebSocketInterface {
  /**
   * Create a new Web socket.
   * @param {number} port Port which shall be used to bind the web socket
   * @param {string} address Address which shall be used to bind the web socket
   */
  constructor(port, address) {
    this.port = port;
    this.address = address;

    this.metrics = new Metrics("Web Socket");
    this.logger = new Logger("WebSocket");
    setupMetricMonitors(this.metrics, this.logger);

    /** Frontend client (WebSocket Connection) */
    this.client = undefined;
    /** Package which will be sent to client */
    this.deliveryPackage = new DeliveryPackage(DEFAULT_PACKAGE_SIZE);
  }

  /**
   * Setup the Websocket server frontend connecton
   * @memberof WebSocketInterface
   */
  setupInterface() {
    this.socket = new WebSocketServer(
      {
        port: this.port,
        host: this.address,
      },
      () => {
        this.logger.log(`Bound on ${this.address}:${this.port}`);
      }
    );

    this.socket.on("connection", (clientSocket) => {
      this.client = clientSocket;
      this.client.send("Connection established");
      this.logger.log(`New client Connection!`);
    });

    this.socket.onopen = function (e) {
      this.logger.log("[open] Connection established");
      this.logger.log("Sending to server");
    };

    this.logger.log("Initialized");
  }

  /**
   * Handle incoming UDP datagrams.
   *
   * 1000 packages * 10 channel * 64 bit/value = 79 kB
   * PPS of 10 = 790 kB/s network traffic towards frontend
   *
   * UDP datagrams are packaged to a size of <maxNumberOfChunks> and sent to the connected clients on the web socket
   * We use a normal JS array as temporary buffer to support push operations and a Float64Buffer for sending
   * @param {Float64Array} data
   */
  handle(data) {
    if (this.deliveryPackage.chunks === this.deliveryPackage.maxChunks) {
      this.metrics.pps += 1;

      let pkg = new Float64Array(this.deliveryPackage.array);

      if (this.client !== undefined && this.client !== null) {
        this.client.send(pkg);
      }

      this.deliveryPackage.reset();
    } else {
      this.deliveryPackage.append(data);
    }
  }
}
