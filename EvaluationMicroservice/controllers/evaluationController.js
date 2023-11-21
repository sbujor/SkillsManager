"use strict";

import axios from "axios";
import config from "../common/services/configService.js";
import log from "../common/services/logService.js";

class EvaluationController {
    static instance = null;

    constructor() {}

    static async getInstance() {
        if (this.instance === null) {
            this.instance = new EvaluationController();
            this.instance.constructor = null;
        }
        return this.instance;
    }

    async getEvaluations(req, res, next) {
        try {
            let managerId = req.headers["x-managerId"];

            const target = `${config.storageMicroservice.url}${config.storageMicroservice.context}${config.storageMicroservice.endpoints.evaluationContext}`;
            const evaluation = await axios.get(target, {
                timeout: config.evaluationMicroservice.timeout,
                headers: {
                    "x-managerId": managerId,
                },
            });

            log.debug(`Evaluation data received from StorageMicroservice`);
            return Promise.resolve(res.json(evaluation.data));
        } catch (error) {
            log.error(`Internal error ${error.message}`);
            return Promise.resolve(
                res.status(500).send(`Internal Server Error ${error.message}`),
            );
        }
    }

    async updateEvaluation(req, res, next) {
        try {
            const evaluationUpdate = await axios.put(
                `${config.storageMicroservice.url}${config.storageMicroservice.context}${config.storageMicroservice.endpoints.evaluationContext}`,
                req.body.evaluation,
            );

            log.debug(`Evaluation update received from StorageMicroservice`);
            return res.status(200).send();
        } catch (error) {
            log.error(`Internal error ${error.message}`);
            return res
                .status(500)
                .send(`Internal Server Error ${error.message}`);
        }
    }
}

const evaluationController = await EvaluationController.getInstance();
export default evaluationController;
