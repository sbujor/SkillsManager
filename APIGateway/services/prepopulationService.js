"use strict";

import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

import log from "./logService.js";
import mongoDbService from "./mongoDbService.js";
import Organization from "../models/organization.js";
import RegisteredEmployee from "../models/registeredEmployee.js";
import User from "../models/user.js";

const __dirname = path.dirname(import.meta.url).replace(/^file:\/\/\//, "");

class PrepopulationService {
    static instance = null;
    #organization;
    #registeredEmployee;

    constructor() {
        this.#organization = Organization;
        this.#registeredEmployee = RegisteredEmployee;
    }

    static async getInstance() {
        if (this.instance === null) {
            this.instance = new PrepopulationService();
            this.instance.constructor = null;
            await this.instance.#clean();
            await this.instance.#populate();
        }
        return this.instance;
    }

    async #clean() {
        try {
            // Get all the collections in the database
            const collections =
                await mongoDbService.connection.db.collections();

            // Delete all the collections
            for (const collection of collections) {
                await collection.drop();
            }
            log.debug("All collections were dropped.");
        } catch (err) {
            log.error(`Cleaning error ${err}`);
        }
    }

    async #populate() {
        try {
            await this.#populateOrganizations();
            await this.#populateRegisteredEmployees();
            await this.#populateUsers();
        } catch (err) {
            log.error(`Prepopulation error ${err}`);
        }
    }

    async #populateOrganizations() {
        try {
            await this.#populateCollection(
                this.#organization,
                "../prepopulation/organizations.json",
            );
            log.debug("Prepopulations Organizations - done");
        } catch (err) {
            log.error(`Prepopulation error ${err}`);
        }
    }

    async #populateRegisteredEmployees() {
        try {
            const registeredEmployeesData = JSON.parse(
                fs.readFileSync(
                    path.join(
                        __dirname,
                        "../prepopulation/registeredEmployees.json",
                    ),
                    "utf8",
                ),
            );

            // Iterate through the registeredEmployeesData and update references
            for (const employeeData of registeredEmployeesData) {
                const organization = await Organization.findOne({
                    name: employeeData.organization,
                });

                if (organization) {
                    // Set the organization reference to the found organization's ObjectId
                    employeeData.organization = organization._id;

                    // Create or update the RegisteredEmployee document
                    await RegisteredEmployee.findOneAndUpdate(
                        { internalId: employeeData.internalId },
                        employeeData,
                        { upsert: true },
                    );
                }
            }
            log.debug("Prepopulations RegisteredEmployees - done");
        } catch (err) {
            log.error(`Prepopulation error ${err}`);
        }
    }

    async #populateUsers() {
        try {
            const userData = JSON.parse(
                fs.readFileSync(
                    path.join(__dirname, "../prepopulation/users.json"),
                    "utf8",
                ),
            );

            // Iterate through the registeredEmployeesData and update references
            for (const user of userData) {
                user.password = await bcrypt.hash(user.password, 10);
                const registeredEmployee = await RegisteredEmployee.findOne({
                    name: user.name,
                });

                if (registeredEmployee) {
                    user.registeredEmployee = registeredEmployee._id;

                    await User.findOneAndUpdate({ name: user.name }, user, {
                        upsert: true,
                    });
                }
            }
            log.debug("Prepopulations Users - done");
        } catch (err) {
            log.error(`Prepopulation error ${err}`);
        }
    }

    async #populateCollection(collection, fileName) {
        const count = await collection.countDocuments();
        if (count === 0) {
            log.debug(`Populating based on file ${fileName} ...`);
            const data = JSON.parse(
                fs.readFileSync(path.join(__dirname, fileName), "utf8"),
            );
            await collection.create(data);
        }
    }
}

export default await PrepopulationService.getInstance();
