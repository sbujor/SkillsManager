"use strict";

import mongoose from "mongoose";
import log from "../common/services/logService.js";
import config from "../common/services/configService.js";

class MongoDbService {
    static instance = null;
    #mongoose;

    constructor(m) {
        this.#mongoose = m;
    }

    getMongo() {
        return this.#mongoose;
    }

    static async getInstance(m) {
        if (this.instance === null) {
            this.instance = new MongoDbService(m);
            this.instance.constructor = null;

            await this.instance.#connect();
            log.debug(`Connected to MongoDb ...`);
        }
        return this.instance;
    }

    async #connect() {
        //let mongoUrl = process.env.MONGO_URL;
        let mongoUrl = config.MongoDbServer.url;
        log.debug(`Mongo Url ${mongoUrl}`);

        await this.#mongoose.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Listen for connection events
        this.#mongoose.connection.on("connected", () => {
            log.debug("Connected to MongoDB");
        });

        this.#mongoose.connection.on("error", (err) => {
            log.error(`MongoDb error ${err}`);
        });

        // Use the connection object for database operations
        this.#mongoose.connection.once("open", () => {
            log.debug("Connection to MongoDB opened...");
        });
    }
}

const mongoDbService = await MongoDbService.getInstance(mongoose);
export default mongoDbService.getMongo();
