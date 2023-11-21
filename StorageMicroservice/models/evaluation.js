import mongoDbService from "../services/mongoDbService.js";

const evaluationSchema = new mongoDbService.Schema({
    skill: {
        type: String,
        required: true,
    },
    evaluation: {
        type: Number,
        required: true,
    },
    registeredEmployee: {
        type: mongoDbService.Schema.Types.ObjectId,
        ref: "RegisteredEmployee",
        required: false,
    },
});

const Evaluation = mongoDbService.model("Evaluation", evaluationSchema);

export default Evaluation;
