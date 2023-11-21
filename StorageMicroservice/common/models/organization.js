import mongoDbService from "../services/mongoDbService.js";

const organizationSchema = new mongoDbService.Schema({
    name: {
        type: String,
        required: true,
    },
    parentOrganization: String,
    lead: String,
    isLocal: Boolean,
    procesingTimestamp: {
        type: Date,
        default: Date.now,
    },
    modifiedBy: String,
});

const Organization = mongoDbService.model("Organization", organizationSchema);

export default Organization;
