"use strict";

import axios from "axios";
import config from "../../Common/services/configService.js";

class UserController {
    static instance = null;

    constructor() {}

    static async getInstance() {
        if (this.instance === null) {
            this.instance = new UserController();
            this.instance.constructor = null;
        }
        return this.instance;
    }

    async addManager(req, res, next) {
        try {
            const { name, internalId, managerInternalId, organization, role } =
                req.body;

            let newManager = {
                name: evaluation,
                internalId: internalId,
                managerInternalId: managerInternalId,
                organization: organization,
                role: role,
            };

            await axios.post(
                `${config.storageMicroservice.url}${config.storageMicroservice.context}${config.storageMicroservice.endpoints.userContext}`,
                newManager,
            );

            log.debug(`Manager added received from StorageMicroservice`);
            return res.status(200).send();
        } catch (error) {
            log.error(`Internal error ${error.message}`);
            return res
                .status(500)
                .send(`Internal Server Error ${error.message}`);
        }
    }
}

const userController = await UserController.getInstance();
export default userController;
