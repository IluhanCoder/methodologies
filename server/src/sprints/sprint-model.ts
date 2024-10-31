import mongoose from "mongoose";

const sprintSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Types.ObjectId,
        default: null
    },
    backlogId: {
        type: mongoose.Types.ObjectId,
        default: null
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
    }
})

export default mongoose.model("Sprint", sprintSchema);