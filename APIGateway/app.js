"use strict";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";

import config from "./common/services/configService.js";
import log from "./common/services/logService.js";
import errorJsonReponse from "./common/middleware/errorJsonResponse.js";

import authRoute from "./routes/authRoute.js";

const app = express();

//json, urlEncoded, cookies
app.use(express.json({ limit: config.apiGateway.limit }));
app.use(
    express.urlencoded({
        extended: true,
        limit: config.apiGateway.limit,
    }),
);
app.use(cookieParser());
//..json, urlEncoded, cookies

//cors
const corsOptions = {
    origin: config.corsAllowed,
    optionsSuccesStatus: 200,
    credentials: true,
};
app.use(cors(corsOptions));
//..cors

authRoute(app);
//..register routes

//middlewares
app.use(errorJsonReponse());
//..middlewares

//start the server
const HTTP_PORT = process.argv[3] || config.apiGateway.httpPort;
const server = http.createServer(app).listen(HTTP_PORT, function () {
    log.info(`APIGateway started on http port:  ${HTTP_PORT} ....`);
});
server.timeout = config.apiGateway.serverTimeout;
