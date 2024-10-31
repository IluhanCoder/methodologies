import mongoose from "mongoose";

const journalSchema = new mongoose.Schema({
    userId: mongoose.Types.ObjectId,
    date: Date,
    action: String
})

export default mongoose.model("Journal", journalSchema);