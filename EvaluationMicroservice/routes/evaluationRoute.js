"use strict";

import express from "express";

import config from "../../Common/services/configService.js";
import wrapAsync from "../../Common/middleware/wrapAsync.js";

import evaluationController from "../controllers/evaluationController.js";

export default (app) => {
    const router = express.Router();

    //EvaluationMicroservice -> StorageMicroservice
    router.get(
        config.evaluationMicroservice.endpoints.evaluationContext,
        wrapAsync(evaluationController.getEvaluations).bind(
            evaluationController,
        ),
    );

    //EvaluationMicroservice <-> StorageMicroservice
    router.put(
        config.evaluationMicroservice.endpoints.evaluationContext,
        wrapAsync(
            evaluationController.updateEvaluation.bind(evaluationController),
        ),
    );

    app.use(config.evaluationMicroservice.context, router);
};
