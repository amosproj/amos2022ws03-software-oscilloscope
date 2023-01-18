import { UdpSocket } from "./sockets/udpsocket.js";

import { WebSocketInterface } from "./sockets/websocket.js";
import { RestApi } from "./rest/rest_api.js";

const UDP_PORT = process.env.UDP_PORT || "34255";
const WS_PORT = process.env.WS_PORT || "9000";
const REST_PORT = process.env.REST_PORT || "8080";
const ADDRESS = process.env.HOST_ADDRESS || "0.0.0.0";
const API_KEY = process.eventNames.API_KEY;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

const webSocket = new WebSocketInterface(WS_PORT, ADDRESS, undefined);
const udpSocket = new UdpSocket(UDP_PORT, ADDRESS, webSocket);
const restApi = new RestApi(REST_PORT, ADDRESS, API_KEY, FRONTEND_ORIGIN);

webSocket.setupInterface();
udpSocket.setupInterface();
restApi.setupInterface();
