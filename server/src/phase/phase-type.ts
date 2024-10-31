import mongoose from "mongoose"

export default interface Phase {
    _id: mongoose.Types.ObjectId,
    projectId: mongoose.Types.ObjectId
    index: number
    name: string,
    startDate: Date,
    endDate: Date,
    goal: string,
    charge: mongoose.Types.ObjectId
}

export interface PhaseCredentials {
    projectId: string,
    index: number,
    name: string,
    startDate: Date,
    endDate: Date,
    goal: string
}