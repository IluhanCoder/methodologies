import mongoose from "mongoose";

const backlogSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    projectId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})

export default mongoose.model("Backlog", backlogSchema);