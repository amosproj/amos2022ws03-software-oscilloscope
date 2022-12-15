import express from "express";
import fs from "fs";
import path from "path";
//import cors from 'cors'
//import bodyParser from 'body-parser'
import { initialize } from "express-openapi";
import { Logger } from "../utils/logger.js";

import configServiceV1 from "../rest/service/ConfigServiceV1.js";

import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const app = express();

export class RestApi {
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
      },
      paths: path.resolve(__dirname, "./controllers"),
    });
    app.listen(this.port);

    app.use(express.json());

    this.logger.log(`Listening on ${this.address}:${this.port}`);
  }
}
