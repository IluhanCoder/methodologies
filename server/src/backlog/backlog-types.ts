import mongoose from "mongoose";

export default interface Backlog {
    _id: string,
    name: string,
    projectId: mongoose.Types.ObjectId
}
