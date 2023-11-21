"use strict";
import express from "express";
import cookieParser from "cookie-parser";
import http from "http";

import config from "./common/services/configService.js";
import log from "./common/services/logService.js";
import errorJsonReponse from "./common/middleware/errorJsonResponse.js";

import evaluationRoute from "./routes/evaluationRoute.js";

const app = express();

//json, urlEncoded, cookies
app.use(express.json({ limit: config.evaluationMicroservice.limit }));
app.use(
    express.urlencoded({
        extended: true,
        limit: config.evaluationMicroservice.limit,
    }),
);
app.use(cookieParser());
//..json, urlEncoded, cookies

evaluationRoute(app);
//..register routes

//middlewares
app.use(errorJsonReponse());
//..middlewares

//start the server
const HTTP_PORT = process.argv[3] || config.evaluationMicroservice.httpPort;
const server = http.createServer(app).listen(HTTP_PORT, function () {
    log.info(`EvaluationMicroservice started on http port:  ${HTTP_PORT} ....`);
});
server.timeout = config.evaluationMicroservice.serverTimeout;
