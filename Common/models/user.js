import mongoDbService from "../services/mongoDbService.js";

const userSchema = new mongoDbService.Schema({
    user: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    registeredEmployee: {
        type: mongoDbService.Schema.Types.ObjectId,
        ref: "RegisteredEmployee",
        required: true,
    },
});

const User = mongoDbService.model("User", userSchema);

export default User;
