import express from "express";
import fs from "fs";
import path from "path";
import { initialize } from "express-openapi";
import { Logger } from "../utils/logger.js";

import configServiceV1 from "../rest/service/ConfigServiceV1.js";

import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

let frontendOrigin;
let apiKey;

const app = express();
/**
 * Rest API interface
 */
export class RestApi {
  /**
   * Create a new rest api
   * @param {String} port Port which shall be used for serving the rest api
   * @param {String} address Not used
   */
  constructor(port, address, apiKey, frontendOrigin) {
    this.port = port;
    this.address = address;
    this.apiKey = apiKey;
    this.logger = new Logger("RestApi");
    this.frontendOrigin = frontendOrigin;
  }

  /**
   * Setup the rest api and load paths as well as starting the express server
   */
  setupInterface() {
    frontendOrigin = this.frontendOrigin;
    apiKey = this.apiKey;

    initialize({
      app,
      apiDoc: fs.readFileSync(
        path.resolve(__dirname, "./api/openapi.yml"),
        "utf8"
      ),
      dependencies: {
        configService: configServiceV1,
      },
      paths: path.resolve(__dirname, "./controllers"),
    });
    app.listen(this.port);

    app.use(express.json());
    app.use(cors);
    app.use(auth);

    this.logger.log(`Listening on ${this.address}:${this.port}`);
  }
}

function auth(req, res, next) {
  // Set REST API credentials
  //res.setHeader('api_key', Buffer.from(apiKey, 'base64').toString());
  next();
}

function cors(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", frontendOrigin);
  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,api_key"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
}
