import dgram from "node:dgram";
import {WebSocketServer} from 'ws';

const server = dgram.createSocket("udp4");
const socket = new WebSocketServer({
  port: 9000,
  host: "0.0.0.0"
}, () => {
  console.log("WebSocket Server started on 0.0.0.0:9000")
});
let client = undefined;
let packageCounter = 0
let packageCounterWS = 0

let count = 0
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

server.on("message", (msg, rinfo) => {
  let samples = new Float64Array(msg.buffer);
  packageCounter += 1
  
  if(client !== undefined && client !== null) {
    if(count === 4) {
      packageCounterWS += 1
      client.send(sendArray)
      sendArray = []
      count = 0
    }
    else {
      sendArray.push(...samples)
      count += 1
    }
  }  
});

server.on("listening", () => {
  const address = server.address();
  console.log(`Server listening on ${address.address}:${address.port}`);
});

server.bind(
  process.env.HOST_PORT || "34255",
  process.env.HOST_ADDRESS || "0.0.0.0"
);


setInterval(function(){ calculatePackagesPerSecond() }, 1000);

socket.onopen = function(e) {
  console.log("[open] Connection established");
  console.log("Sending to server");
};

function calculatePackagesPerSecond(){
  console.log("Current rcv PPS: " +packageCounter + " | Current sending PPS: " +packageCounterWS)
  packageCounter = 0;
  packageCounterWS = 0;
}