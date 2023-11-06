"use strict";
import express from "express";
import cookieParser from "cookie-parser";
import http from "http";
import httpProxy from "http-proxy";

import config from "../Common/services/configService.js";
import log from "../Common/services/logService.js";
import errorJsonReponse from "../Common/middleware/errorJsonResponse.js";

import authRoute from "./routes/authRoute.js";

//import prepopulationService from "./services/prepopulationService.js";

const app = express();

//json, urlEncoded, cookies
app.use(express.json({ limit: config.webServer.limit }));
app.use(
    express.urlencoded({
        extended: true,
        limit: config.webServer.limit,
    }),
);
app.use(cookieParser());
//..json, urlEncoded, cookies

authRoute(app);
//..register routes

//middlewares
app.use(errorJsonReponse());
//..middlewares

//start the server
const HTTP_PORT = process.argv[3] || config.webServer.httpPort;
const server = http.createServer(app).listen(HTTP_PORT, "0.0.0.0", function () {
    log.info(`ONLY FOR TEST Server started on http port:  ${HTTP_PORT} ....`);
});
server.timeout = config.webServer.serverTimeout;
