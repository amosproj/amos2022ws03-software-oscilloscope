import express from "express";
import fs from "fs";
import path from "path";
import { initialize } from "express-openapi";
import { Logger } from "../utils/logger.js";

import configServiceV1 from "../rest/service/ConfigServiceV1.js";
import metricServiceV1 from "./service/MetricServiceV1.js";

import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

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
  constructor(port, address) {
    this.port = port;
    this.address = address;
    this.logger = new Logger("RestApi");
  }

  /**
   * Setup the rest api and load paths as well as starting the express server
   */
  setupInterface() {
    initialize({
      app,
      apiDoc: fs.readFileSync(
        path.resolve(__dirname, "./api/openapi.yml"),
        "utf8"
      ),
      dependencies: {
        configService: configServiceV1,
        metricService: metricServiceV1
      },
      paths: path.resolve(__dirname, "./controllers"),
    });
    app.listen(this.port);

    app.use(express.json());
    app.use(cors);

    this.logger.log(`Listening on ${this.address}:${this.port}`);
  }
}

function cors(req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,api_key');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);


  // Pass to next layer of middleware
  next();
}