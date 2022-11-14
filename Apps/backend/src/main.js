import dgram from "node:dgram";
import WebSocket, {WebSocketServer} from 'ws' 

const server = dgram.createSocket("udp4");
const socket = new WebSocketServer({
  port: 9000,
  host: "0.0.0.0"
}, () => {
  console.log("WebSocket Server started on 0.0.0.0:9000")
});
let client = undefined;

socket.on('connection', (clientSocket) => {
  client = clientSocket
  client.send("connection established")
});

server.on("error", (err) => {
  console.log(`Server error:\n${err.stack}`);
  server.close();
});

let counter = 0
server.on("message", (msg, rinfo) => {
  let raw_data = Array.apply([], msg);
  let data = [];
  const chunk_size = 3;

  for (let i = 0; i < raw_data.length; i += chunk_size) {
    const chunk = raw_data.slice(i, i + chunk_size);
    data.push(chunk);
  }

  console.log(
    `Received from ${rinfo.address}:${rinfo.port}: [${data.join("][")}]`
  );


  if (client !== undefined && client !== null) {
    client.send(Math.sin(counter))
    counter += 0.1
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