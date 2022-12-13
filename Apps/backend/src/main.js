import dgram from "node:dgram";
import WebSocket, {WebSocketServer} from 'ws';

const server = dgram.createSocket("udp4");
const socket = new WebSocketServer({
  port: 9000,
  host: "0.0.0.0"
}, () => {
  console.log("WebSocket Server started on 0.0.0.0:9000")
});
let client = undefined;
let pps = 0;

socket.on('connection', (clientSocket) => {
  client = clientSocket
  client.send("connection established")
});

server.on("error", (err) => {
  console.log(`Server error:\n${err.stack}`);
  server.close(package_recieved);
});

server.on("message", (msg, rinfo) => {
  let samples = new Float64Array(msg.buffer);
  
  if (client !== undefined && client !== null) {
    client.send(samples)
    pps = pps + 1;
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

socket.onopen = function(e) {
  alert("[open] Connection established");
  alert("Sending to server");
};