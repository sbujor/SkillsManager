"use strict";

import express from "express";

import config from "../../Common/services/configService.js";
import storageOpsController from "../controllers/storageOpsController.js";
import wrapAsync from "../../Common/middleware/wrapAsync.js";

export default (app) => {
    const router = express.Router();

    router.get(
        config.storageMicroservice.endpoints.userContext,
        wrapAsync(storageOpsController.getUser),
    );

    router.get(
        config.storageMicroservice.endpoints.evaluationContext,
        wrapAsync(storageOpsController.getEvaluations),
    );

    router.put(
        config.storageMicroservice.endpoints.evaluationContext,
        wrapAsync(storageOpsController.updateEvaluation),
    );

    router.post(
        config.storageMicroservice.endpoints.managerContext,
        wrapAsync(storageOpsController.addManager),
    );

    app.use(config.storageMicroservice.context, router);
};
