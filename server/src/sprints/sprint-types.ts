import mongoose from "mongoose";

export default interface Sprint {
    _id: mongoose.Types.ObjectId,
    projectId: mongoose.Types.ObjectId | null,
    backlogId: mongoose.Types.ObjectId | null,
    name: string,
    startDate: Date,
    endDate: Date,
    goal: string
}

export interface SprintCredentials {
    projectId: mongoose.Types.ObjectId | null,
    backlogId: mongoose.Types.ObjectId | null,
    name: string,
    startDate: Date,
    endDate: Date,
    goal: string
}