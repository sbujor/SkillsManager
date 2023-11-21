import mongoDbService from "../services/mongoDbService.js";

const organizationSchema = new mongoDbService.Schema({
    name: {
        type: String,
        required: true,
    },
    parentOrganization: {
        type: String,
        required: true,
    },
});

const Organization = mongoDbService.model("Organization", organizationSchema);

export default Organization;
