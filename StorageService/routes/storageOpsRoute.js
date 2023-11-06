"use strict";

import express from "express";

import config from "../services/configService.js";
import storageOpsController from "../controllers/storageOpsController.js";
import wrapAsync from "../../Common/middleware/wrapAsync.js";

export default (app) => {
    const router = express.Router();

    router.get("", wrapAsync(storageOpsController.getUser));

    app.use(config.endpoints.userContext, router);
};
