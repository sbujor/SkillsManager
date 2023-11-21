"use strict";

import express from "express";

import config from "../../Common/services/configService.js";
import wrapAsync from "../../Common/middleware/wrapAsync.js";

import authController from "../controllers/authController.js";

export default (app) => {
    const router = express.Router();

    //APIGateway <->StorageMicroservice
    router.post(
        config.apiGateway.endpoints.authContext,
        wrapAsync(authController.authenticate.bind(authController)),
    );
    //APIGateway <-> StorageMicroservice
    //APIGateway -> EvaluationMicroservice -> StorageMicroservice
    //StorageMicroservice -> EvaluationMicroservice -> APIGateway
    router.get(
        config.apiGateway.endpoints.evaluationContext,
        wrapAsync(authController.getEvaluations.bind(authController)),
    );
    //APIGateway <-> StorageMicroservice
    //APIGateway -> EvaluationMicroservice -> StorageMicroservice
    //StorageMicroservice -> EvaluationMicroservice -> APIGateway
    router.put(
        config.apiGateway.endpoints.evaluationContext,
        wrapAsync(authController.updateEvaluation.bind(authController)),
    );
    //APIGateway <-> StorageMicroservice
    //APIGateway -> UserManagementMicroservice -> StorageMicroservice
    //StorageMicroservice -> UserManagementMicroservice -> APIGateway
    router.post(
        config.apiGateway.endpoints.managerContext,
        wrapAsync(authController.addManager),
    );

    app.use(config.apiGateway.context, router);
};
