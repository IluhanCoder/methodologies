import mongoose from "mongoose";

const phaseSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Types.ObjectId
    },
    index: {
        type: Number,
        default: 0
    },
    name: {
      type: String,
      required: true,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    goal: {
        type: String,
        required: false
    },
    charge: {
        type: mongoose.Types.ObjectId,
        required: false
    }
})

export default mongoose.model("Phase", phaseSchema);