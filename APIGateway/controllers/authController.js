"use strict";

import axios from "axios";
import bcrypt from "bcrypt";
import config from "../common/services/configService.js";
import log from "../common/services/logService.js";

class AuthController {
    static instance = null;

    constructor() {}

    static async getInstance() {
        if (this.instance === null) {
            this.instance = new AuthController();
            this.instance.constructor = null;
        }
        return this.instance;
    }

    async #getUser(req, res, next) {
        try {
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                return res
                    .status(401)
                    .send("Unauthorized: Missing Authorization header");
            }

            const [authType, encodedCredentials] =
                authorizationHeader.split(" ");

            if (authType.toLowerCase() !== "basic" || !encodedCredentials) {
                return res
                    .status(401)
                    .send("Unauthorized: Invalid Authorization header format");
            }

            // Decode base64-encoded credentials
            const credentials = Buffer.from(
                encodedCredentials,
                "base64",
            ).toString("utf-8");
            const [username, password] = credentials.split(":");

            const target = `${config.storageMicroservice.url}${config.storageMicroservice.context}${config.storageMicroservice.endpoints.userContext}`;
            log.debug(`Credential were read.... calling now ${target}`);

            const response = await axios.get(target, {
                timeout: config.apiGateway.timeout,
                headers: {
                    "x-username": username,
                },
            });

            const loggedInUser = response.data;
            if (loggedInUser) {
                const isPasswordCorrect = await bcrypt.compare(
                    password,
                    loggedInUser.password,
                );
                if (!isPasswordCorrect) {
                    return res.status(401).send({
                        message:
                            "You are not authorized to use this application.",
                    });
                }
                delete loggedInUser.password;
                return Promise.resolve(loggedInUser);
            }

            return Promise.resolve(null);
        } catch (error) {
            if (error.response.status === 401)
                return res.status(401).send({
                    message: "You are not authorized to use this application.",
                });

            throw error;
        }
    }

    async authenticate(req, res, next) {
        log.debug(`Incoming authenticate request`);
        try {
            let user = await this.#getUser(req, res, next);
            if (!user)
                return res.status(401).send({
                    message: "You are not authorized to use this application.",
                });
            if (!res.headersSent) return res.json(user);
        } catch (error) {
            return res
                .status(500)
                .send(`Internal Server Error ${error.message}`);
        }
    }

    async getEvaluations(req, res, next) {
        log.debug(`Incoming getEvaluations request`);
        try {
            let user = await this.#getUser(req, res, next);
            if (!user) {
                log.error(`getEvaluations error.... user not found.`);
                return res.status(401).send({
                    message: "You are not authorized to use this application.",
                });
            }
            const target = `${config.evaluationMicroservice.url}${config.evaluationMicroservice.context}${config.evaluationMicroservice.endpoints.evaluationContext}`;
            const response = await axios.get(target, {
                timeout: config.apiGateway.timeout,
                headers: {
                    "x-manager": user.managerId,
                },
            });
            log.debug(`getEvaluations returning data.... ${response.data}`);
            if (!res.headersSent) {
                log.debug(`getEvaluations returning data....`);
                return res.json(response.data);
            } else {
                log.debug("Headers sent");
                return;
            }
        } catch (error) {
            log.error(`getEvaluations error.... ${error.message}`);
            return res
                .status(500)
                .send(`Internal Server Error ${error.message}`);
        }
    }

    async updateEvaluation(req, res, next) {
        log.debug(`Incoming updateEvaluation request`);
        try {
            let user = await this.#getUser(req, res, next);
            if (!user)
                return res.status(401).send({
                    message: "You are not authorized to use this application.",
                });

            const updatedEvaluation = {
                evaluationId: req.body.id,
                evaluationNewValue: req.body.value,
            };
            const target = `${config.evaluationMicroservice.url}${config.evaluationMicroservice.context}${config.evaluationMicroservice.endpoints.evaluationContext}`;
            await axios.put(target, {
                timeout: config.apiGateway.timeout,
                evaluation: updatedEvaluation,
            });
            if (!res.headersSent) {
                return res.status(200).send("Updated evaluation");
            }
            return;
        } catch (error) {
            return res
                .status(500)
                .send(`Internal Server Error ${error.message}`);
        }
    }
}

const authController = await AuthController.getInstance();
export default authController;
