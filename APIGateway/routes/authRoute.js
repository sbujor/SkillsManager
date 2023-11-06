"use strict";

import express from "express";

import config from "../services/configService.js";
import authController from "../controllers/authController.js";
import wrapAsync from "../middleware/wrapAsync.js";

export default (app) => {
    app.use((req, res, next) => {
        res.header(
            "Acces-Control-Allow-Headers",
            "x-acces-token, Origin, Content-Type, Accept",
        );
        next();
    });

    const router = express.Router();

    router.post("", wrapAsync(authController.auth));
    app.use(config.endpoints.authContext, router);
};
