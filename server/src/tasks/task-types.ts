import mongoose from "mongoose"
import { UserResponse } from "../user/user-type";

interface Task {
    projectId: mongoose.Types.ObjectId | null,
    sprintId: mongoose.Types.ObjectId | null,
    backlogId: mongoose.Types.ObjectId | null,
    phaseId: mongoose.Types.ObjectId | null,
    name: string,
    desc: string,
    isChecked: boolean,
    createdBy: mongoose.Types.ObjectId,
    created: Date,
    checkedDate: Date | null,
    executors: mongoose.Types.ObjectId[],
    status: string,
    difficulty: string,
    priority: string,
    requirements: string,
}

export default Task;

export interface TaskResponse {
    _id: mongoose.Types.ObjectId,
    name: string,
    desc: string,
    backlogId: mongoose.Types.ObjectId | null,
    projectId: mongoose.Types.ObjectId | null,
    sprintId: mongoose.Types.ObjectId | null,
    phaseId: mongoose.Types.ObjectId | null,
    isChecked: boolean,
    createdBy: mongoose.Types.ObjectId,
    created: Date,
    checkedDate: Date | null,
    executors: UserResponse[],
    status: string,
    difficulty: string,
    priority: string,
    requirements: string,
}

export interface TaskCredentials {
    name: string,
    desc: string,
    backlogId: string | null,
    projectId: string | null,
    sprintId: string | null,
    phaseId: mongoose.Types.ObjectId | null,
    createdBy: string,
    executors?: mongoose.Types.ObjectId[],
    requirements: string
}

export interface UpdateTaskCredentials {
    name: string,
    desc: string,
    difficulty: string,
    priority: string,
    requirements: string,
    status: string,
    checkedDate: Date
}

export interface SubTask {
    name: string,
    parentTask: mongoose.Types.ObjectId,
    isChecked: boolean
}

export interface SubTaskCredentials {
    name: string,
    parentTask: string
}