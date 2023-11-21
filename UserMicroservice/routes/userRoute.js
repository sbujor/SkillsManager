"use strict";

import express from "express";

import config from "../../Common/services/configService.js";
import wrapAsync from "../../Common/middleware/wrapAsync.js";

import userController from "../controllers/userController.js";

export default (app) => {
    const router = express.Router();

    //UserMicroservice <-> StorageMicroservice
    router.post(
        config.userMicroservice.endpoints.userContext,
        wrapAsync(evaluationController.addManager.bind(userController)),
    );

    app.use(config.userMicroservice.context, router);
};
