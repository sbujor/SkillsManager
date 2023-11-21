import mongoDbService from "../services/mongoDbService.js";

const registeredEmployeeSchema = new mongoDbService.Schema({
    name: {
        type: String,
        required: true,
    },
    internalId: {
        type: String,
        required: true,
    },
    managerInternalId: {
        type: String,
        required: true,
    },
    organization: {
        type: mongoDbService.Schema.Types.ObjectId,
        ref: "Organization",
        required: false,
    },
    role: {
        type: String,
        required: true,
    },
});

const RegisteredEmployee = mongoDbService.model(
    "RegisteredEmployee",
    registeredEmployeeSchema,
);

export default RegisteredEmployee;
