"use strict";
import express from "express";
import cookieParser from "cookie-parser";
import http from "http";

import config from "../Common/services/configService.js";
import log from "../Common/services/logService.js";
import errorJsonReponse from "../Common/middleware/errorJsonResponse.js";

import userRoute from "./routes/userRoute.js";

const app = express();

//json, urlEncoded, cookies
app.use(express.json({ limit: config.userMicroservice.limit }));
app.use(
    express.urlencoded({
        extended: true,
        limit: config.userMicroservice.limit,
    }),
);
app.use(cookieParser());
//..json, urlEncoded, cookies

userRoute(app);
//..register routes

//middlewares
app.use(errorJsonReponse());
//..middlewares

//start the server
const HTTP_PORT = process.argv[3] || config.userMicroservice.httpPort;
const server = http.createServer(app).listen(HTTP_PORT, "0.0.0.0", function () {
    log.info(`UserMicroservice started on http port:  ${HTTP_PORT} ....`);
});
server.timeout = config.userMicroservice.serverTimeout;
