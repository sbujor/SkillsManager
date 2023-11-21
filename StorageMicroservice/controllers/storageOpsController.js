"use strict";

import User from "../models/user.js";
import Evaluation from "../models/evaluation.js";
import log from "../common/services/logService.js";

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
        const username = req.headers["x-username"];
        const user = await User.aggregate([
            {
                $match: {
                    user: username,
                },
            },
            {
                $lookup: {
                    from: "registeredemployees", // Collection name for RegisteredEmployee
                    localField: "name",
                    foreignField: "name",
                    as: "userWithManager",
                },
            },
            {
                $unwind: "$userWithManager", // Unwind the array created by $lookup
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    user: 1,
                    password: 1,
                    internalId: "$userWithManager.internalId",
                    managerId: "$userWithManager.managerInternalId",
                    role: "$userWithManager.role",
                },
            },
        ]);
        if (user && user.length > 0) {
            Promise.resolve(res.status(200).send(user[0]));
        } else {
            Promise.resolve(
                res
                    .status(401)
                    .send("You are not authorized to user this application."),
            );
        }
    }

    async getEvaluations(req, res, next) {
        const evaluations = await Evaluation.aggregate([
            {
                $lookup: {
                    from: "registeredemployees", // name of the RegisteredEmployee collection
                    localField: "registeredEmployee",
                    foreignField: "_id",
                    as: "employee",
                },
            },
            {
                $unwind: "$employee",
            },
            {
                $lookup: {
                    from: "organizations", // name of the Organization collection
                    localField: "employee.organization",
                    foreignField: "_id",
                    as: "organization",
                },
            },
            {
                $unwind: "$organization",
            },
            {
                $project: {
                    _id: 1,
                    name: "$employee.name",
                    managerId: "$employee.managerInternalId",
                    organization: "$organization.name",
                    skill: "$skill",
                    evaluation: "$evaluation",
                },
            },
        ]);

        if (evaluations && evaluations.length > 0) {
            const managerId = req.headers["x-managerId"];
            if (managerId) {
                evaluations = evaluations.filter(
                    (e) => e.managerId === managerId,
                );
            }
        }

        log.debug(JSON.stringify(evaluations, null, 2));
        return Promise.resolve(res.json(evaluations));
    }

    async updateEvaluation(req, res, next) {
        const { evaluationId, evaluationNewValue } = req.body;

        const result = await Evaluation.updateOne(
            { _id: evaluationId },
            { $set: { evaluation: evaluationNewValue } },
        );
        res.status(200).send();
    }

    async addManager(req, res, next) {
        let employeeData = req.body; //FIXME
        const manager = await RegisteredEmployee.findOne({
            name: employeeData.managerName,
        });

        if (!manager) {
            return res.status(404).send("Manager is not found.");
        }

        // Update the employee data with the manager's internalId
        employeeData.managerInternalId = manager.internalId;

        // Create the new employee
        const newEmployee = await RegisteredEmployee.create(employeeData);

        return res.status(200).send("Employee added");
    }
}

const storageOpsController = await StorageOpsController.getInstance();
export default storageOpsController;
