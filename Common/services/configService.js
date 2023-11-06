"use strict";
import fs from "fs";
import log from "./logService.js";

const ConfigService = (function () {
    let instance = null;

    function ConfigService() {
        log.debug("ConfigService...");
        this.config = JSON.parse(fs.readFileSync("config.json", "utf8"));
    }

    return {
        getInstance: function () {
            if (instance === null) {
                instance = new ConfigService();
                instance.constructor = null;
            }
            return instance;
        },
    };
})();

export default ConfigService.getInstance().config;
