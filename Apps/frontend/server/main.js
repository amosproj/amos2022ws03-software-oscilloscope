import dgram from 'node:dgram';

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  console.log(`Server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  let raw_data = Array.apply([], msg)
  let data = []
  const chunk_size = 3

  for (let i = 0; i < raw_data.length; i += chunk_size) {
    const chunk = raw_data.slice(i, i+chunk_size)
    data.push(chunk)
  }

  console.log(`Received from ${rinfo.address}:${rinfo.port}: [${data.join("][")}]`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`Server listening on ${address.address}:${address.port}`);
});

server.bind(process.env.HOST_PORT, process.env.HOST_ADDRESS);

function toArrayBuffer(buf) {
    const ab = new ArrayBuffer(buf.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }