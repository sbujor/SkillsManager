"use strict";

import User from "../models/user.js";

class StorageOpsController {
    static instance = null;

    constructor() {}

    static async getInstance(m) {
        if (this.instance === null) {
            this.instance = new StorageOpsController();
            this.instance.constructor = null;
        }
        return this.instance;
    }

    async getUser(req, res, next) {
        return new Promise(async (resolve, reject) => {
            const { username, password } = req.body;
            const user = await User.findOne({
                user: username,
            });
            if (user) {
                resolve(res.status(200).send(user));
            } else {
                resolve(res.status(401).send("Not authorized"));
            }
        });
    }
}

const storageOpsController = await StorageOpsController.getInstance();
export default storageOpsController;
