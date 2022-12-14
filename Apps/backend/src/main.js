import dgram from "node:dgram";
import {WebSocketServer} from 'ws';

const server = dgram.createSocket("udp4");
const socket = new WebSocketServer({
  port: 9000,
  host: "0.0.0.0"
}, () => {
  console.log("WebSocket Server started on 0.0.0.0:9000")
});
/** Frontend client (WebSocket Connection) */
let client = undefined;
/** Received packages from generator */
let packageCounter = 0
/** Sent packages to frontend */
let packageCounterWS = 0

let chunkCounter = 0
/** Array which will be send to frontend */
let sendArray = []

socket.on('connection', (clientSocket) => {
  client = clientSocket
  client.send("connection established")
  console.log(`Connection established remote=`)
});

server.on("error", (err) => {
  console.log(`Server error:\n${err.stack}`);
  server.close(package_recieved);
});

/**
 * Receive incoming UDP packages and handle them
 * @param {Float64Array} msg.bufffer
 */
server.on("message", (msg, rinfo) => {
  let samples = new Float64Array(msg.buffer);
  packageCounter += 1
  
  handle(samples, 200)   
});

server.on("listening", () => {
  const address = server.address();
  console.log(`Server listening on ${address.address}:${address.port}`);
  setupPpsCalculator()
});

server.bind(
  process.env.HOST_PORT || "34255",
  process.env.HOST_ADDRESS || "0.0.0.0"
);

/**
 * Set the interval for tracking the received PPS
 */
function setupPpsCalculator() {
  setInterval(function(){ calculatePackagesPerSecond() }, 1000);
}

socket.onopen = function(e) {
  console.log("[open] Connection established");
  console.log("Sending to server");
};

/**
 * Calculates the packages per second received on the UDP socket
 */
function calculatePackagesPerSecond(){
  console.log("Current rcv PPS: " +packageCounter + " | Current sending PPS: " +packageCounterWS)
  packageCounter = 0;
  packageCounterWS = 0;
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
 * @param {number} maxNumberOfChunks 
 */
function handle(data, maxNumberOfChunks) {
  if(chunkCounter === maxNumberOfChunks) {
    packageCounterWS += 1

    let pkg = new Float64Array(sendArray)

    if(client !== undefined && client !== null) {
      client.send(pkg)
    }
    // Reset chunk stats
    sendArray = []
    chunkCounter = 0
  }
  else {
    sendArray.push(...data)
    chunkCounter += 1
  }
}