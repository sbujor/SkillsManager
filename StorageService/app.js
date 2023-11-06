"use strict";
import express from "express";
import http from "http";

import config from "../Common/services/configService.js";
import log from "../Common/services/logService.js";
import errorJsonReponse from "../Common/middleware/errorJsonResponse.js";
import storageOpsRoute from "./routes/storageOpsRoute.js";

const app = express();

//json, urlEncoded
app.use(express.json({ limit: config.webServer.limit }));
app.use(
    express.urlencoded({
        extended: true,
        limit: config.webServer.limit,
    }),
);
//..json, urlEncoded, cookies

//register routes
storageOpsRoute(app);
//..

//middlewares
app.use(errorJsonReponse());
//..

//start the server
const HTTP_PORT = process.argv[3] || config.webServer.storageServicePort;
const server = http.createServer(app).listen(HTTP_PORT, function () {
    log.info(`StorageService started on http port:  ${HTTP_PORT} ....`);
});
server.timeout = config.webServer.serverTimeout;
//...
